// E2E REAL: sirve el repo por HTTP, corre landing-builder.html en Chromium,
// mockea Supabase (CDN) y claude-proxy (red), y maneja la UI como Sandra:
// generar → editar → verificar que NO regenera → recargar → editar de nuevo.
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const REPO = require('path').resolve(__dirname, '..');
const PORT = 8931;

// ── Servidor estático del repo ──
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const fp = path.join(REPO, urlPath === '/' ? 'index.html' : urlPath);
  if (!fp.startsWith(REPO) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
    res.writeHead(404); res.end('nf'); return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'text/plain' });
  res.end(fs.readFileSync(fp));
});

// ── Mock de supabase-js: localStorage-backed, auth fake ──
const SUPABASE_MOCK = `
window.supabase = { createClient: function(url, key, opts) {
  const store = {
    _get(t) { try { return JSON.parse(localStorage.getItem('mockdb_' + t)) || []; } catch { return []; } },
    _set(t, rows) { localStorage.setItem('mockdb_' + t, JSON.stringify(rows)); },
  };
  const FIXED = { profiles: [{ id: 'u1', plan: 'elite', groq_api_key: '' }] };
  function builder(table) {
    const st = { table, filters: [], op: 'select', payload: null, single: false };
    const api = {
      select() { return api; },
      eq(col, val) { st.filters.push([col, val]); return api; },
      order() { return api; }, limit() { return api; },
      maybeSingle() { st.single = true; return api; },
      single() { st.single = true; return api; },
      insert(row) { st.op = 'insert'; st.payload = row; return api; },
      update(row) { st.op = 'update'; st.payload = row; return api; },
      delete() { st.op = 'delete'; return api; },
      then(resolve, reject) {
        let rows = (FIXED[st.table] || store._get(st.table)).slice();
        const match = r => st.filters.every(([c, v]) => r[c] === v);
        let out;
        if (st.op === 'insert') {
          const row = { ...st.payload };
          if (!row.id) row.id = 'uuid-' + Math.random().toString(36).slice(2, 10);
          const all = store._get(st.table); all.push(row); store._set(st.table, all);
          out = { data: st.single ? row : [row], error: null };
        } else if (st.op === 'update') {
          const all = store._get(st.table);
          let updated = null;
          for (let i = 0; i < all.length; i++) if (match(all[i])) { all[i] = { ...all[i], ...st.payload }; updated = all[i]; }
          store._set(st.table, all);
          out = { data: st.single ? updated : (updated ? [updated] : []), error: null };
        } else if (st.op === 'delete') {
          store._set(st.table, store._get(st.table).filter(r => !match(r)));
          out = { data: null, error: null };
        } else {
          const found = rows.filter(match);
          out = st.single ? { data: found[0] || null, error: null } : { data: found, error: null };
        }
        resolve(out);
      },
    };
    return api;
  }
  return {
    auth: {
      async getUser() { return { data: { user: { id: 'u1', email: 's@test.com' } }, error: null }; },
      async getSession() { return { data: { session: { access_token: 'tok-123', user: { id: 'u1' } } }, error: null }; },
      async refreshSession() { return { data: { session: { access_token: 'tok-123' } }, error: null }; },
      onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } }; },
      async signOut() { return { error: null }; },
    },
    from: builder,
    functions: { invoke: async () => ({ data: null, error: null }) },
  };
}};
`;

// ── Mock de claude-proxy: responde según el prompt (mismo criterio que el harness) ──
const PLAN = { title: 'Yoga Prenatal', sections: [
  { id: 'hero', brief: 'curso de yoga para embarazadas' },
  { id: 'beneficios', brief: 'beneficios' },
  { id: 'modulos', brief: 'modulos' },
  { id: 'testimonios', brief: 'testimonios' },
  { id: 'precio', brief: 'precio 120' },
  { id: 'faq', brief: 'faq' },
  { id: 'cta-final', brief: 'cierre' },
  { id: 'footer', brief: 'footer' },
]};
const CONTENT = {
  hero: { badge: '+300 mamás', title: 'Yoga prenatal desde tu casa', subtitle: 'Movete segura durante tu embarazo: vas a sentir que podés con todo.', cta: 'Quiero empezar', microcopy: 'Sin tarjeta', image_prompt: 'pregnant+yoga', layout: 'split' },
  beneficios: { title: 'Beneficios', items: [ { icon: 'favorite', title: 'Menos dolor de espalda', desc: 'Sumate y vas a notar que tenés menos molestias.' }, { icon: 'self_improvement', title: 'Mejor descanso', desc: 'B' }, { icon: 'health_and_safety', title: 'Parto más preparado', desc: 'C' }, { icon: 'psychology', title: 'Calma mental', desc: 'D' } ] },
  modulos: { title: 'Módulos', items: [ { icon: 'school', title: 'M1', desc: 'x' }, { icon: 'school', title: 'M2', desc: 'y' }, { icon: 'school', title: 'M3', desc: 'z' }, { icon: 'school', title: 'M4', desc: 'w' } ] },
  testimonios: { title: 'Testimonios', items: [ { initials: 'ML', name: 'María', role: 'Mamá', quote: 'Genial' }, { initials: 'AC', name: 'Ana', role: 'Mamá', quote: 'Me cambió' }, { initials: 'PG', name: 'Pau', role: 'Mamá', quote: 'Lo amo' } ] },
  precio: { title: 'Tu inversión', price: '$120', period: 'pago único', features: ['Todo incluido'], cta: 'Quiero acceso', microcopy: 'Garantía 30 días' },
  faq: { title: 'Preguntas', items: [ { q: '¿Sirve en primer trimestre?', a: 'Sí' }, { q: '¿Necesito experiencia?', a: 'No' } ] },
  'cta-final': { title: '¿Lista?', subtitle: 'Sumate', cta: 'Empezar hoy', microcopy: 'Sin tarjeta' },
  footer: { brand_name: 'Yoga Prenatal', tagline: 'Movete segura', copyright: '© 2026' },
};

const aiCalls = [];
function aiResponder(bodyStr) {
  const body = JSON.parse(bodyStr);
  const msg = body.messages[body.messages.length - 1].content;
  aiCalls.push({ kind:
    msg.includes('SECCIONES ACTUALES DE LA PÁGINA') ? 'chatops' :
    msg.includes('Elegí las secciones ideales') ? 'plan' :
    msg.includes('REGLAS DE CLASIFICACIÓN') ? 'classify' :
    msg.includes('página de UPSELL') || msg.includes('página de DOWNSELL') ? 'offer' :
    msg.includes('CONTENIDO ACTUAL') ? 'surgical' :
    msg.includes('SECCIÓN:') ? 'content' : 'other' });
  let text = '{}';
  if (msg.includes('SECCIONES ACTUALES DE LA PÁGINA')) {
    // Motor nuevo del chat: devuelve operaciones puntuales. Omite todo lo demás
    // e intenta vaciar el logo, para probar que nada del usuario se pierde.
    text = JSON.stringify({ reply: 'Listo, cambié el título de la portada.',
      ops: [{ section: 'hero', set: { title: 'TITULO EDITADO POR CHAT', logo_url: '' } }] });
  }
  else if (msg.includes('Elegí las secciones ideales')) text = JSON.stringify(PLAN);
  else if (msg.includes('REGLAS DE CLASIFICACIÓN')) text = JSON.stringify({ action: 'edit', sectionId: 'hero', reply: 'Aplico ese cambio en el hero.' });
  else if (msg.includes('página de UPSELL') || msg.includes('página de DOWNSELL')) {
    text = JSON.stringify({ badge: 'Oferta única', title: 'Sumá las sesiones en vivo',
      subtitle: 'Acompañamiento mensual para tu embarazo.', features: ['4 clases en vivo', 'Grupo privado'],
      price_before: '$97', price: '$47', cta: 'SÍ, LO QUIERO SUMAR', decline: 'No gracias, continuar sin esto',
      microcopy: 'Pago seguro' });
  }
  else if (msg.includes('CONTENIDO ACTUAL')) {
    const jm = msg.match(/CONTENIDO ACTUAL \(JSON\):\n([\s\S]*?)\n\nPEDIDO DEL USUARIO/);
    const cur = JSON.parse(jm[1]);
    // Simula lo que hace el modelo real: devuelve SOLO lo que cambió y omite el resto.
    // Antes esto borraba el logo, las imágenes y los links del usuario.
    text = JSON.stringify({ title: 'TITULO EDITADO POR CHAT', logo_url: '' });
  } else {
    const sm = msg.match(/SECCIÓN: "([^"]+)"/);
    if (sm && CONTENT[sm[1]]) text = JSON.stringify(CONTENT[sm[1]]);
  }
  return JSON.stringify({ content: [{ text }] });
}

(async () => {
  await new Promise(r => server.listen(PORT, r));
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
  page.on('console', m => { if (m.type() === 'error') console.log('  [console.error]', m.text().slice(0, 160)); });
  page.on('pageerror', e => console.log('  [pageerror]', String(e).slice(0, 200)));

  // Interceptar CDN de supabase → mock; claude-proxy → responder; resto de CDNs → abort
  await page.route('**/@supabase/supabase-js*', r => r.fulfill({ contentType: 'application/javascript', body: SUPABASE_MOCK }));
  await page.route('**/functions/v1/claude-proxy', async r => {
    r.fulfill({ contentType: 'application/json', body: aiResponder(r.request().postData()) });
  });
  await page.route(/image\.pollinations\.ai|fonts\.googleapis|fonts\.gstatic|cdn\.tailwindcss|pdfjs-dist|r\.jina\.ai|cloudfront|mux\.com|cloudinary|pexels/, r => r.abort());

  // Espera a que el contador de llamadas a la IA se estabilice, para que medir
  // "cero llamadas" no cuente pedidos del paso anterior que siguen en vuelo.
  const settleAI = async (quietMs = 900) => {
    let last = -1;
    while (last !== aiCalls.length) { last = aiCalls.length; await new Promise(r => setTimeout(r, quietMs)); }
    return aiCalls.length;
  };

  const fails = [];
  const chk = (name, ok) => { console.log('  ' + (ok ? '✅' : '❌'), name); if (!ok) fails.push(name); };

  console.log('E2E 1 — cargar el builder logueada');
  await page.goto(`http://127.0.0.1:${PORT}/landing-builder.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  chk('no redirigió a login', !page.url().includes('login'));
  chk('chat input presente', await page.locator('#chat-input').count() === 1);

  console.log('E2E 2 — generar landing por chat');
  await page.fill('#chat-input', 'Quiero una landing para mi curso de yoga para embarazadas, precio $120');
  await page.click('#chat-send');
  await page.waitForFunction(() => window.landing && window.landing.sections && window.landing.sections.length > 0, null, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1000);
  const st1 = await page.evaluate(() => ({
    n: landing?.sections?.length || 0,
    ids: (landing?.sections || []).map(s => s.id),
    brief: landing?.brief || '',
    mode: landing?.mode,
    slug: landing?.slug || '',
    heroHtml: (landing?.sections || []).find(s => s.id === 'hero')?.html?.slice(0, 400) || '',
    hasContent: (landing?.sections || []).every(s => s.content),
  }));
  chk('landing generada con secciones (' + st1.n + ')', st1.n >= 7);
  chk('brief guardado', st1.brief.includes('yoga'));
  chk('slug generado', /yoga/.test(st1.slug));
  chk('todas las secciones guardan content', st1.hasContent);
  const planCalls1 = aiCalls.filter(c => c.kind === 'plan').length;

  console.log('E2E 3 — pedir una edición por chat (NO debe regenerar)');
  const secsBefore = await page.evaluate(() => landing.sections.map(s => s.html));
  await page.fill('#chat-input', 'cambiá el título del hero');
  await page.click('#chat-send');
  await page.waitForFunction(() => (landing.sections.find(s => s.id === 'hero')?.html || '').includes('TITULO EDITADO POR CHAT'), null, { timeout: 20000 }).catch(() => {});
  const st3 = await page.evaluate(() => ({
    heroEdited: (landing.sections.find(s => s.id === 'hero')?.html || '').includes('TITULO EDITADO POR CHAT'),
    others: landing.sections.filter(s => s.id !== 'hero').map(s => s.html),
    n: landing.sections.length,
  }));
  const planCalls2 = aiCalls.filter(c => c.kind === 'plan').length;
  chk('hero editado con el cambio pedido', st3.heroEdited);
  chk('NO se generó un plan nuevo (no regeneró la landing)', planCalls2 === planCalls1);
  chk('el chat usó el motor de operaciones puntuales', aiCalls.some(c => c.kind === 'chatops'));
  chk('una sola llamada por pedido (antes eran dos)', aiCalls.filter(c => c.kind === 'chatops').length === 1);
  chk('las demás secciones quedaron intactas', JSON.stringify(st3.others) === JSON.stringify(secsBefore.filter((h, i) => st1.ids[i] !== 'hero')));

  console.log('E2E 4 — guardado en DB y RELOAD (el ciclo que nunca se probó)');
  await page.waitForTimeout(2500); // autosave debounce 1.5s
  const savedRow = await page.evaluate(() => {
    const rows = JSON.parse(localStorage.getItem('mockdb_landings') || '[]');
    return rows[0] ? { id: rows[0].id, slug: rows[0].slug, hasSections: !!(rows[0].settings && rows[0].settings.sections), mode: rows[0].settings && rows[0].settings.mode } : null;
  });
  chk('la landing se guardó en la DB', !!savedRow);
  chk('con slug válido', !!(savedRow && savedRow.slug));
  chk('sections persistidas en settings', !!(savedRow && savedRow.hasSections));
  if (savedRow) {
    await page.goto(`http://127.0.0.1:${PORT}/landing-builder.html?id=${savedRow.id}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.landing && landing.sections && landing.sections.length > 0, null, { timeout: 15000 }).catch(() => {});
    const st4 = await page.evaluate(() => ({
      n: landing?.sections?.length || 0, mode: landing?.mode, brief: (landing?.brief || '').slice(0, 40),
      hasContent: (landing?.sections || []).some(s => s.content),
    }));
    chk('reload: secciones restauradas (' + st4.n + ')', st4.n >= 7);
    chk('reload: mode html restaurado', st4.mode === 'html');
    chk('reload: brief restaurado', st4.brief.length > 0);
    chk('reload: content de secciones restaurado', st4.hasContent);

    console.log('E2E 5 — editar DESPUÉS del reload (donde probablemente moría)');
    const planCalls3 = aiCalls.filter(c => c.kind === 'plan').length;
    await page.fill('#chat-input', 'cambiá el título del hero otra vez');
    await page.click('#chat-send');
    await page.waitForFunction(() => (landing.sections.find(s => s.id === 'hero')?.html || '').includes('TITULO EDITADO POR CHAT'), null, { timeout: 20000 }).catch(() => {});
    const st5 = await page.evaluate(() => ({
      heroEdited: (landing.sections.find(s => s.id === 'hero')?.html || '').includes('TITULO EDITADO POR CHAT'),
      n: landing.sections.length,
    }));
    const planCalls4 = aiCalls.filter(c => c.kind === 'plan').length;
    chk('post-reload: editó el hero', st5.heroEdited);
    chk('post-reload: NO regeneró la landing', planCalls4 === planCalls3);
    chk('post-reload: mismas secciones (' + st5.n + ')', st5.n === st4.n);
  }

  console.log('E2E 6 — EDITOR VISUAL: editar a mano, sin IA');
  const aiBefore = await settleAI();
  // El panel debe estar visible con la lista de secciones
  chk('panel de edición visible', await page.locator('#right-panel:not(.hidden)').count() === 1);
  const rows = await page.locator('#sec-list .sec-row').count();
  chk('lista muestra las secciones (' + rows + ')', rows >= 7);

  // Click en "Beneficios" y editar su título a mano
  const benIdx = await page.evaluate(() => landing.sections.findIndex(s => s.id === 'beneficios'));
  await page.evaluate(i => openSectionEditor(i), benIdx);
  await page.waitForTimeout(300);
  const inputs = await page.locator('#sec-editor input[type="text"]').count();
  chk('formulario con campos editables (' + inputs + ')', inputs > 0);

  const titleInput = page.locator('#sec-editor input[type="text"]').first();
  await titleInput.fill('MI TITULO ESCRITO A MANO');
  await page.waitForTimeout(900); // debounce 350ms + rebuild
  const st6 = await page.evaluate(() => {
    const b = landing.sections.find(s => s.id === 'beneficios');
    return { content: b.content.title, inHtml: b.html.includes('MI TITULO ESCRITO A MANO'), inFull: landing.html.includes('MI TITULO ESCRITO A MANO') };
  });
  chk('el texto se guardó en el contenido', st6.content === 'MI TITULO ESCRITO A MANO');
  chk('la sección se reconstruyó con el texto', st6.inHtml);
  chk('el HTML final tiene el cambio', st6.inFull);
  chk('CERO llamadas a la IA para editar a mano', aiCalls.length === aiBefore);

  console.log('E2E 7 — agregar item a una lista (sin IA)');
  const nBefore = await page.evaluate(() => landing.sections.find(s => s.id === 'beneficios').content.items.length);
  await page.evaluate(() => addSecItem('items'));
  await page.waitForTimeout(700);
  const nAfter = await page.evaluate(() => landing.sections.find(s => s.id === 'beneficios').content.items.length);
  chk('item agregado (' + nBefore + ' → ' + nAfter + ')', nAfter === nBefore + 1);
  chk('sigue sin usar IA', aiCalls.length === aiBefore);

  console.log('E2E 8 — reordenar y borrar secciones');
  const orderBefore = await page.evaluate(() => landing.sections.map(s => s.id).join(','));
  await page.evaluate(() => moveSection(1, 1));
  await page.waitForTimeout(500);
  const orderAfter = await page.evaluate(() => landing.sections.map(s => s.id).join(','));
  chk('orden cambió al mover', orderBefore !== orderAfter);
  chk('mismo número de secciones', orderBefore.split(',').length === orderAfter.split(',').length);
  chk('HTML refleja el nuevo orden', await page.evaluate(() => {
    const ids = landing.sections.map(s => s.id);
    const positions = ids.map(id => landing.html.indexOf('id="' + id + '"'));
    return positions.every((p, i) => i === 0 || p > positions[i - 1]);
  }));

  console.log('E2E 9 — agregar una sección nueva desde cero');
  const hadGarantia = await page.evaluate(() => landing.sections.some(s => s.id === 'garantia'));
  await page.evaluate(() => addSection('garantia'));
  await page.waitForTimeout(700);
  const st9 = await page.evaluate(() => ({
    has: landing.sections.some(s => s.id === 'garantia'),
    inHtml: landing.html.includes('id="garantia"'),
    beforeFooter: landing.sections.findIndex(s => s.id === 'garantia') < landing.sections.findIndex(s => s.id === 'footer'),
    editorOpen: document.querySelectorAll('#sec-editor input').length > 0,
  }));
  chk('sección garantía agregada', st9.has);
  chk('aparece en el HTML', st9.inHtml);
  chk('se insertó antes del footer', st9.beforeFooter);
  chk('se abrió su editor automáticamente', st9.editorOpen);
  chk('agregar sección tampoco usa IA', aiCalls.length === aiBefore);

  console.log('E2E 10 — persistencia del trabajo manual tras recargar');
  await page.waitForTimeout(2500);
  const rid = await page.evaluate(() => landing.id);
  await page.goto('http://127.0.0.1:' + PORT + '/landing-builder.html?id=' + rid, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.landing && landing.sections && landing.sections.length > 0, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(600);
  const st10 = await page.evaluate(() => ({
    manualTitle: (landing.sections.find(s => s.id === 'beneficios') || {}).content?.title,
    hasGarantia: landing.sections.some(s => s.id === 'garantia'),
    panelVisible: !document.getElementById('right-panel').classList.contains('hidden'),
    rows: document.querySelectorAll('#sec-list .sec-row').length,
  }));
  chk('el texto escrito a mano sobrevivió al reload', st10.manualTitle === 'MI TITULO ESCRITO A MANO');
  chk('la sección agregada sobrevivió', st10.hasGarantia);
  chk('panel de edición visible tras reload', st10.panelVisible);
  chk('lista de secciones poblada (' + st10.rows + ')', st10.rows >= 8);

  console.log('E2E 11 — nav, secciones nuevas y panel de ventas');
  const aiB2 = await settleAI();
  const st11 = await page.evaluate(() => ({
    hasNav: landing.sections.some(s => s.id === 'nav'),
    navFirst: landing.sections[0]?.id === 'nav',
    navInHtml: landing.html.includes('<header id="nav"'),
    navLinksReal: (landing.sections.find(s => s.id === 'nav')?.content?.links || [])
      .every(l => landing.sections.some(x => '#' + x.id === l.href)),
  }));
  chk('la landing tiene barra de navegación', st11.hasNav);
  chk('el nav va primero', st11.navFirst);
  chk('nav presente en el HTML', st11.navInHtml);
  chk('links del nav apuntan a secciones reales', st11.navLinksReal);

  // Agregar una sección de video desde el modal
  await page.evaluate(() => addSection('video'));
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    const i = landing.sections.findIndex(s => s.id === 'video');
    openSectionEditor(i);
    setSecField('video_url', 'https://www.youtube.com/watch?v=abc12345');
  });
  await page.waitForTimeout(900);
  chk('sección de video agregada y embebida', await page.evaluate(() => landing.html.includes('youtube.com/embed/abc12345')));

  // Imagen en una sección que no es el hero
  await page.evaluate(() => {
    const i = landing.sections.findIndex(s => s.id === 'beneficios');
    openSectionEditor(i);
    setSecField('image_url', 'data:image/png;base64,SECIMG');
  });
  await page.waitForTimeout(900);
  chk('imagen colocada en una sección que no es el hero', await page.evaluate(() => landing.html.includes('SECIMG')));
  chk('nada de esto usó IA', aiCalls.length === aiB2);

  // Panel de ventas: link de pago + pixel
  await page.evaluate(() => {
    document.getElementById('sales-cta-url').value = 'https://pay.hotmart.com/ABC';
    document.getElementById('sales-fb-pixel').value = '999888777666555';
    saveSalesSettings();
  });
  await page.waitForTimeout(900);
  const st12 = await page.evaluate(() => ({
    cta: landing.html.includes('href="https://pay.hotmart.com/ABC"'),
    pixel: landing.html.includes("fbq('init','999888777666555')"),
  }));
  chk('botones apuntan a la pasarela de pago', st12.cta);
  chk('píxel de Facebook inyectado', st12.pixel);

  console.log('E2E 12 — embudo completo: upsell → downsell → gracias');
  const aiB3 = await settleAI();
  // El builder pregunta qué se ofrece: respondemos automáticamente en el test
  await page.evaluate(() => { window.prompt = () => 'Sesiones en vivo mensuales + comunidad, a $47'; });
  await page.evaluate(() => createFunnelPage('upsell'));
  await page.waitForFunction(() => landing.settings?.funnel?.upsell?.slug, null, { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => createFunnelPage('downsell'));
  await page.waitForFunction(() => landing.settings?.funnel?.downsell?.slug, null, { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => createFunnelPage('thanks'));
  await page.waitForFunction(() => landing.settings?.funnel?.thanks?.slug, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(800);

  const fn = await page.evaluate(() => {
    const rows = JSON.parse(localStorage.getItem('mockdb_landings') || '[]');
    const byRole = r => rows.find(x => x.settings && x.settings.funnel_role === r);
    const up = byRole('upsell'), down = byRole('downsell'), th = rows.find(x => x.settings && x.settings.funnel_role === 'thanks');
    const declineOf = row => {
      const secs = (row && (row.sections || (row.settings || {}).sections)) || [];
      return (secs.find(s => s.id === 'oferta') || {}).content?.decline_url || '';
    };
    return {
      f: landing.settings.funnel,
      upSaved: !!up, downSaved: !!down, thSaved: !!th,
      allPublished: [up, down, th].every(r => r && r.published),
      upHasOffer: !!(up && up.html && up.html.includes('SÍ, LO QUIERO SUMAR')),
      upTitle: (() => { const secs = (up && (up.sections || (up.settings||{}).sections)) || []; return (secs.find(s => s.id === 'oferta')||{}).content?.title || ''; })(),
      downCheaper: !!(down && down.html && down.html.includes('$27')),
      upDecline: declineOf(up),
      downDecline: declineOf(down),
      downSlug: down && down.slug, thSlug: th && th.slug,
      stepsUi: document.querySelectorAll('#funnel-steps input[readonly]').length,
    };
  });
  chk('página de upsell creada', fn.upSaved);
  chk('página de downsell creada', fn.downSaved);
  chk('página de gracias creada', fn.thSaved);
  chk('las tres quedan publicadas', fn.allPublished);
  chk('el upsell tiene su oferta con botón SÍ', fn.upHasOffer);
  chk('el contenido del upsell habla del producto real', !!(fn.upTitle && fn.upTitle.includes('sesiones en vivo')));
  chk('el downsell tiene su propia oferta', !!fn.downSaved);
  chk('"no gracias" del upsell → downsell', fn.upDecline.includes(fn.downSlug));
  chk('"no gracias" del downsell → gracias', fn.downDecline.includes(fn.thSlug));
  chk('el panel muestra los 3 links listos para copiar', fn.stepsUi === 3);
  const offerCalls = aiCalls.slice(aiB3).filter(c => c.kind === 'offer').length;
  chk('las ofertas se escriben con el producto real (1 llamada por oferta)', offerCalls === 2);
  chk('la página de gracias no usa IA', aiCalls.slice(aiB3).filter(c => c.kind !== 'offer').length === 0);

  // El link de pago propio de la oferta manda: no lo pisa el de la landing madre
  const offerHtml = await page.evaluate(() => {
    const palId = landing.palette || 'blue-purple';
    const c = { title: 'X', price: '$47', cta: 'SI', cta_url: 'https://pay.hotmart.com/UPSELL9', decline: 'no', decline_url: 'https://x.com/next' };
    const sec = { id: 'oferta', content: c, html: AI.buildSection('oferta', c, palId) };
    return AI.assembleLanding([sec], palId, 't', { ctaUrl: 'https://pay.hotmart.com/PRINCIPAL' });
  });
  chk('el botón usa el link de pago de su propia oferta', offerHtml.includes('href="https://pay.hotmart.com/UPSELL9"'));
  chk('el "no gracias" no se reescribe al checkout', offerHtml.includes('href="https://x.com/next"'));

  console.log('E2E 10b — el chat no borra lo que subiste');
  await page.evaluate(() => {
    const i = landing.sections.findIndex(s2 => s2.id === 'hero');
    landing.sections[i].content.image_url = 'data:image/png;base64,MIFOTO';
    landing.sections[i].content.cta_url = 'https://pay.hotmart.com/MIPAGO';
  });
  await page.fill('#chat-input', 'cambiá el título del hero');
  await page.click('#chat-send');
  await page.waitForFunction(() => (landing.sections.find(s2 => s2.id === 'hero')?.content?.title || '').includes('TITULO EDITADO'), null, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(500);
  const keep = await page.evaluate(() => {
    const c = landing.sections.find(s2 => s2.id === 'hero').content;
    return { title: c.title, img: c.image_url, cta: c.cta_url, sub: c.subtitle };
  });
  chk('aplicó el cambio pedido', (keep.title || '').includes('TITULO EDITADO'));
  chk('NO borró la imagen que subiste', keep.img === 'data:image/png;base64,MIFOTO');
  chk('NO borró el link de pago', keep.cta === 'https://pay.hotmart.com/MIPAGO');
  chk('conservó el resto del contenido', !!keep.sub);

  console.log('E2E 11b — el copy sale en español neutro aunque la IA vosee');
  const vos = await page.evaluate(() => {
    const txt = JSON.stringify(landing.sections.map(s2 => s2.content));
    const malas = ['tenés','podés','querés','sumate','movete','fijate','sos ','vos '];
    return { encontradas: malas.filter(w => txt.toLowerCase().includes(w)), html: landing.html };
  });
  chk('sin formas voseantes en el contenido' + (vos.encontradas.length ? ' — halladas: ' + vos.encontradas.join(', ') : ''), vos.encontradas.length === 0);
  chk('el texto neutro llegó al HTML', /tienes|puedes|súmate|muévete/i.test(vos.html));

  console.log('E2E 12b — saltos de línea y espacios en el editor');
  await page.evaluate(() => {
    const i = landing.sections.findIndex(s2 => s2.id === 'beneficios');
    openSectionEditor(i);
  });
  await page.waitForTimeout(300);
  const ta = page.locator('#sec-editor textarea').first();
  await ta.fill('Primera línea\nSegunda línea\n\nCuarta con   espacios');
  await page.waitForTimeout(900);
  const nl = await page.evaluate(() => {
    const b = landing.sections.find(s2 => s2.id === 'beneficios');
    const val = JSON.stringify(b.content);
    return { guardado: val.includes('\\n'), enHtml: /white-space:pre-wrap/.test(b.html) };
  });
  chk('los saltos de línea se guardan', nl.guardado);
  chk('la landing los respeta al mostrarlos', nl.enHtml);

  console.log('E2E 13 — imágenes pesadas no cuelgan el guardado ni la publicación');
  // Simular una foto de celular grande (data URL de ~1.5 MB)
  const bigPng = await page.evaluate(() => {
    const cv = document.createElement('canvas');
    cv.width = 2400; cv.height = 1600;
    const ctx = cv.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 2400, 1600);
    g.addColorStop(0, '#ff0055'); g.addColorStop(1, '#0055ff');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 2400, 1600);
    for (let i = 0; i < 4000; i++) { ctx.fillStyle = `rgb(${i%255},${(i*7)%255},${(i*13)%255})`; ctx.fillRect((i*37)%2400, (i*53)%1600, 9, 9); }
    return cv.toDataURL('image/png');
  });
  const bigKb = Math.round(bigPng.length * 0.75 / 1024);
  console.log('    [info] imagen de prueba:', bigKb, 'KB');
  chk('la imagen de prueba es realmente pesada', bigKb > 400);

  const small = await page.evaluate(async src => await compressImage(src), bigPng);
  const smallKb = await page.evaluate(s2 => Math.round(s2.length * 0.75 / 1024), small);
  console.log('    [info] tras comprimir:', smallKb, 'KB');
  chk('se comprime a un tamaño razonable', smallKb < 260 && smallKb > 0);
  chk('sigue siendo una imagen válida', /^data:image\//.test(small));

  // Guardar una landing que tiene la imagen pesada adentro: debe optimizar y no colgarse
  await page.evaluate(src => {
    const i = landing.sections.findIndex(s2 => s2.id === 'beneficios');
    landing.sections[i].content.image_url = src;
  }, bigPng);
  const t0 = Date.now();
  const saveOk = await page.evaluate(async () => {
    try { await saveLanding(); return true; } catch (e) { return 'ERR: ' + e.message; }
  });
  const ms = Date.now() - t0;
  chk('guardar con imagen pesada no falla (' + ms + 'ms)', saveOk === true);
  chk('guardar no se cuelga', ms < 25000);
  const storedKb = await page.evaluate(() => {
    const i = landing.sections.findIndex(s2 => s2.id === 'beneficios');
    return Math.round((landing.sections[i].content.image_url || '').length * 0.75 / 1024);
  });
  chk('la imagen quedó optimizada en el contenido (' + storedKb + ' KB)', storedKb < 260);

  console.log('E2E 14 — publicar responde siempre');
  const pub = await page.evaluate(async () => {
    publishLanding();
    document.getElementById('publish-slug').value = 'prueba-publicar';
    try { await confirmPublish(); } catch (e) { return 'ERR: ' + e.message; }
    return {
      linkVisible: !document.getElementById('publish-result').classList.contains('hidden'),
      url: document.getElementById('publish-link').textContent,
      btnEnabled: !document.getElementById('publish-confirm').disabled,
    };
  });
  chk('publicar termina y muestra el link', pub && pub.linkVisible && /prueba-publicar/.test(pub.url || ''));
  chk('el botón vuelve a quedar disponible', pub && pub.btnEnabled);

  console.log('\nLlamadas IA por tipo:', JSON.stringify(aiCalls.reduce((a, c) => { a[c.kind] = (a[c.kind] || 0) + 1; return a; }, {})));
  console.log(fails.length === 0 ? '\n🎉 E2E COMPLETO: TODO PASA' : '\n⚠️ FALLARON: ' + fails.join(' | '));
  await browser.close();
  server.close();
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error('CRASH:', e); process.exit(2); });
