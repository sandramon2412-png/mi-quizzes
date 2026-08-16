// Harness: carga app.js con stubs de browser, mockea Claude._call,
// y corre generateLandingSectioned de punta a punta.
const fs = require('fs');
const path = require('path');

// ── Stubs de browser ──
const storage = {};
global.localStorage = {
  getItem: k => (k in storage ? storage[k] : null),
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: k => { delete storage[k]; },
};
global.window = {
  location: { search: '' },
  LANDING_PALETTES_DEF: [
    { id: 'blue-purple', name: 'Azul Púrpura', primary: '#2E5BFF', accent: '#7c3aed', bg: '#09090b', surface: 'rgba(255,255,255,0.04)', fg: '#ffffff', mode: 'dark' },
    { id: 'nude-rose', name: 'Nude Rosa', primary: '#b76e79', accent: '#d4a5a5', bg: '#faf6f2', surface: '#ffffff', fg: '#2d2424', mode: 'light' },
  ],
};
global.document = {
  getElementById: () => null,
  createElement: () => ({ style: {}, classList: { add(){}, remove(){} }, setAttribute(){}, appendChild(){} }),
  querySelectorAll: () => [],
  body: { appendChild(){} },
};
global.navigator = { userAgent: 'node' };
global.fetch = async () => { throw new Error('fetch no debe llamarse en este test'); };

// ── Cargar app.js ──
const code = fs.readFileSync(require('path').resolve(__dirname,'..','app.js'), 'utf8');
eval(code + '\n;globalThis.Claude = Claude;');
const Claude = globalThis.Claude;

// ── Mock de Claude._call ──
const MOCK_CONTENT = {
  plan: {
    title: 'Finanzas Sin Estrés',
    sections: [
      { id: 'hero', brief: 'Curso de finanzas personales para mujeres latinas' },
      { id: 'prueba-social', brief: 'métricas de confianza' },
      { id: 'problema', brief: 'dolores financieros' },
      { id: 'beneficios', brief: 'beneficios del curso' },
      { id: 'modulos', brief: 'módulos del curso' },
      { id: 'testimonios', brief: 'testimonios de alumnas' },
      { id: 'precio', brief: 'oferta $97' },
      { id: 'garantia', brief: 'garantía 30 días' },
      { id: 'faq', brief: 'objeciones' },
      { id: 'cta-final', brief: 'cierre' },
      { id: 'footer', brief: 'footer' },
    ],
  },
  hero: { badge: '+2.400 mujeres ya ordenaron sus finanzas', title: 'Ordená tus finanzas en 30 días sin dejar de vivir', subtitle: 'El método paso a paso para salir de deudas, ahorrar tu primer fondo de emergencia y dejar de pelearte con la plata — aunque sientas que "no sos buena con los números".', cta: 'Quiero ordenar mis finanzas hoy', microcopy: 'Sin tarjeta · Acceso inmediato · Garantía 30 días', image_prompt: 'happy+latina+woman+laptop+finances+coffee+bright' },
  'prueba-social': { title: 'Más de 2.400 mujeres ya transformaron su relación con el dinero', stats: [{ value: '2.400+', label: 'alumnas activas' }, { value: '97%', label: 'lo recomiendan' }, { value: '30 días', label: 'para ver resultados' }] },
  problema: { title: '¿Te suena familiar?', items: [{ icon: 'sentiment_dissatisfied', title: 'El sueldo se esfuma', desc: 'Cobrás y a la semana ya no sabés a dónde se fue la plata.' }, { icon: 'sentiment_dissatisfied', title: 'Las deudas no bajan', desc: 'Pagás el mínimo de la tarjeta y la deuda sigue igual o peor.' }, { icon: 'sentiment_dissatisfied', title: 'Ahorrar parece imposible', desc: 'Cada vez que intentás ahorrar, aparece un gasto imprevisto.' }] },
  beneficios: { title: 'Qué vas a lograr', subtitle: 'Resultados concretos, no teoría aburrida', items: [{ icon: 'savings', title: 'Tu primer fondo de emergencia', desc: 'Armá un colchón de 3 meses de gastos en menos de un año.' }, { icon: 'trending_up', title: 'Deudas bajo control', desc: 'Un plan claro para eliminar tus deudas de tarjeta en orden.' }, { icon: 'attach_money', title: 'Presupuesto que funciona', desc: 'Un sistema simple de 15 minutos por semana, sin plantillas eternas.' }, { icon: 'psychology', title: 'Mentalidad de abundancia', desc: 'Dejá atrás la culpa y el miedo cada vez que abrís el home banking.' }] },
  modulos: { title: 'Qué vas a aprender', items: [{ icon: 'school', title: 'Módulo 1: Diagnóstico real', desc: 'Radiografía completa de tus números en una tarde.' }, { icon: 'rocket_launch', title: 'Módulo 2: Plan anti-deudas', desc: 'El método bola de nieve adaptado a Latinoamérica.' }, { icon: 'lightbulb', title: 'Módulo 3: Presupuesto 50/30/20', desc: 'Adaptado a ingresos variables e inflación.' }, { icon: 'verified', title: 'Módulo 4: Tu primer inversión', desc: 'Opciones seguras para empezar con poco.' }] },
  testimonios: { title: 'Lo que dicen ellas', items: [{ initials: 'ML', name: 'María López', role: 'Diseñadora · Bogotá', quote: 'En 4 meses pagué una deuda que arrastraba hace 2 años. El plan es tan claro que no hay forma de perderse.' }, { initials: 'AC', name: 'Ana Cruz', role: 'Docente · CDMX', quote: 'Por primera vez tengo un fondo de emergencia. Son $18.000 pesos que antes se me iban sin darme cuenta.' }, { initials: 'PG', name: 'Paula Gómez', role: 'Emprendedora · Lima', quote: 'Dejé de pelearme con mi pareja por plata. Ahora los dos sabemos exactamente qué entra y qué sale.' }] },
  precio: { title: 'Tu inversión', price: '$97', period: 'pago único · acceso de por vida', features: ['4 módulos con clases en video', 'Plantillas de presupuesto listas', 'Comunidad privada de alumnas', 'Actualizaciones de por vida', 'Soporte directo por 60 días'], cta: 'Quiero acceso ahora', microcopy: 'Pago seguro · Garantía 30 días · Acceso inmediato' },
  garantia: { title: 'Garantía de 30 días sin preguntas', desc: 'Si en 30 días no sentís que tenés el control de tu plata, te devolvemos el 100% de tu inversión. Sin preguntas, sin demoras, sin complicaciones.', days: '30' },
  faq: { title: 'Preguntas frecuentes', items: [{ q: '¿Sirve si gano poco o tengo ingresos variables?', a: 'Sí — el módulo 3 está pensado justamente para ingresos variables e inflación.' }, { q: '¿Cuánto tiempo necesito por semana?', a: '15-20 minutos por semana después de la configuración inicial.' }, { q: '¿Qué pasa si no me funciona?', a: 'Tenés 30 días de garantía total. Escribís un mail y te devolvemos el 100%.' }, { q: '¿El acceso es de por vida?', a: 'Sí, pagás una vez y el curso es tuyo para siempre, con actualizaciones incluidas.' }] },
  'cta-final': { title: '¿Lista para dejar de pelearte con la plata?', subtitle: 'Unite a las 2.400 mujeres que ya dieron el primer paso', cta: 'Quiero empezar hoy', microcopy: 'Sin tarjeta · Acceso inmediato · Garantía 30 días' },
  footer: { brand_name: 'Finanzas Sin Estrés', tagline: 'Tu plata bajo control, tu vida sin culpa', copyright: '© 2026 · Todos los derechos reservados' },
};

let callLog = [];
Claude._call = async function (messages, maxTokens, opts) {
  const msg = messages[messages.length - 1].content;
  callLog.push({ model: opts?.model, len: msg.length });
  if (msg.includes('Elegí las secciones ideales')) return JSON.stringify(MOCK_CONTENT.plan);
  const m = msg.match(/SECCIÓN: "([^"]+)"/);
  if (m && MOCK_CONTENT[m[1]]) return JSON.stringify(MOCK_CONTENT[m[1]]);
  // sección desconocida → devolver el schema del mensaje (simula Haiku llenándolo)
  const jsonStart = msg.indexOf('\n{');
  return jsonStart !== -1 ? msg.slice(jsonStart) : '{}';
};

// ── Test 1: generación completa ──
(async () => {
  const result = await Claude.generateLandingSectioned('Curso online de finanzas personales para mujeres latinas que quieren salir de deudas y ahorrar. Precio $97 pago único.', 'blue-purple');
  console.log('TEST 1 — generateLandingSectioned');
  console.log('  title:', result.title);
  console.log('  secciones generadas:', result.sections.length, '→', result.sections.map(s => s.id).join(', '));
  console.log('  html length:', result.html.length);
  console.log('  llamadas IA:', callLog.length, '(1 plan + ' + (callLog.length - 1) + ' secciones)');

  // Validaciones estructurales
  const html = result.html;
  const checks = [
    ['DOCTYPE', html.startsWith('<!DOCTYPE html>')],
    ['CSS vars en :root', html.includes('--brand:#2E5BFF')],
    ['hero con flex layout', /id="hero"[^>]*>[\s\S]*?display:flex/.test(html)],
    ['beneficios con grid balanceado', /id="beneficios"[\s\S]*?ld-grid ld-g/.test(html)],
    ['testimonios con grid balanceado', /id="testimonios"[\s\S]*?ld-grid ld-g/.test(html)],
    ['faq con details', /id="faq"[\s\S]*?<details/.test(html)],
    ['precio con card', /id="precio"[\s\S]*?border:2px solid var\(--brand\)/.test(html)],
    ['cta-final con gradiente', /id="cta-final"[^>]*linear-gradient/.test(html)],
    ['footer presente', html.includes('<footer id="footer"')],
    ['sin template literals JS', !/\$\{/.test(html)],
    ['sin markdown fences', !html.includes('```')],
    ['imagen Pollinations en hero', html.includes('image.pollinations.ai/prompt/happy+latina')],
    ['nav + las 11 secciones planificadas', result.sections.length === 12 && result.sections[0].id === 'nav'],
  ];
  let fails = 0;
  checks.forEach(([name, ok]) => { console.log('  ' + (ok ? '✅' : '❌'), name); if (!ok) fails++; });

  fs.writeFileSync(path.join(__dirname, 'landing-test-dark.html'), html);

  // ── Test 2: cambio de paleta instantáneo (sin IA) ──
  callLog = [];
  const html2 = Claude.assembleLanding(result.sections, 'nude-rose', result.title);
  console.log('\nTEST 2 — assembleLanding con paleta nueva (instantáneo)');
  console.log('  llamadas IA:', callLog.length, '(debe ser 0)');
  console.log('  ' + (html2.includes('--brand:#b76e79') ? '✅' : '❌'), 'paleta nude-rose aplicada');
  console.log('  ' + (html2.includes('--bg:#faf6f2') ? '✅' : '❌'), 'fondo claro aplicado');
  fs.writeFileSync(path.join(__dirname, 'landing-test-light.html'), html2);

  // ── Test 3: edición de una sección (edit) ──
  callLog = [];
  Claude._call = async function (messages, maxTokens, opts) {
    const msg = messages[messages.length - 1].content;
    callLog.push({ model: opts?.model });
    if (msg.includes('REGLAS DE CLASIFICACIÓN')) return JSON.stringify({ action: 'edit', sectionId: 'hero', reply: 'Voy a aplicar ese cambio en hero.' });
    const m = msg.match(/SECCIÓN: "([^"]+)"/);
    if (m === null) return '{}';
    const c = JSON.parse(JSON.stringify(MOCK_CONTENT[m[1]] || {}));
    if (m[1] === 'hero') c.title = 'NUEVO TÍTULO EDITADO POR CHAT';
    return JSON.stringify(c);
  };
  const editRes = await Claude.editLandingSectioned('Cambiá el título del hero', result.sections, 'blue-purple', 'Curso de finanzas');
  const heroSec = editRes.sections.find(s => s.id === 'hero');
  console.log('\nTEST 3 — editLandingSectioned (edit hero)');
  console.log('  reply:', editRes.reply);
  console.log('  ' + (heroSec.html.includes('NUEVO TÍTULO EDITADO POR CHAT') ? '✅' : '❌'), 'hero actualizado');
  console.log('  ' + (editRes.sections.filter(s => s.id !== 'hero').every((s, i) => s.html === result.sections.filter(x => x.id !== 'hero')[i].html) ? '✅' : '❌'), 'las demás secciones intactas');

  // ── Test 4: contenido malformado de la IA no rompe el build ──
  Claude._call = async function (messages) {
    const msg = messages[messages.length - 1].content;
    if (msg.includes('Elegí las secciones ideales')) return 'texto basura sin json';
    return '{"title": "ok", "items": "esto-es-string-no-array"}';
  };
  const res4 = await Claude.generateLandingSectioned('producto x', 'blue-purple');
  console.log('\nTEST 4 — robustez ante IA malformada');
  console.log('  ' + (res4.sections.length >= 7 ? '✅' : '❌'), 'fallback de plan usado (' + res4.sections.length + ' secciones, precio filtrado sin precio en brief)');
  console.log('  ' + (res4.html.length > 1000 ? '✅' : '❌'), 'HTML generado sin crash con items=string');

  // ── Test 5: video de fondo en hero (setHeroVideo instantáneo) ──
  callLog = [];
  Claude._call = async function (messages, maxTokens, opts) {
    callLog.push({ model: opts?.model });
    const msg = messages[messages.length - 1].content;
    const m = msg.match(/SECCIÓN: "([^"]+)"/);
    return JSON.stringify(MOCK_CONTENT[m ? m[1] : 'hero'] || {});
  };
  const VURL = 'https://stream.mux.com/abc123/high.mp4';
  const withVideo = await Claude.setHeroVideo(result.sections, 'blue-purple', VURL, 'Curso de finanzas');
  const heroV = withVideo.find(s => s.id === 'hero');
  console.log('\nTEST 5 — setHeroVideo');
  console.log('  llamadas IA:', callLog.length, '(debe ser 0 — el hero tiene content guardado)');
  console.log('  ' + (callLog.length === 0 ? '✅' : '❌'), 'aplicación instantánea sin IA');
  console.log('  ' + (heroV.html.includes('<video autoplay muted loop playsinline') ? '✅' : '❌'), 'video element en hero');
  console.log('  ' + (heroV.html.includes(VURL) ? '✅' : '❌'), 'URL del video presente');
  console.log('  ' + (/rgba\(0,0,0,\.5[58]\)/.test(heroV.html) ? '✅' : '❌'), 'overlay oscuro para legibilidad');
  console.log('  ' + (heroV.html.includes('Ordená tus finanzas') ? '✅' : '❌'), 'copy original preservado (sin llamar IA)');
  console.log('  ' + (heroV.content.video_url === VURL ? '✅' : '❌'), 'video_url persistido en content');

  // quitar el video
  const noVideo = await Claude.setHeroVideo(withVideo, 'blue-purple', '', 'Curso de finanzas');
  const heroNV = noVideo.find(s => s.id === 'hero');
  console.log('  ' + (!heroNV.html.includes('<video') && heroNV.html.includes('pollinations') ? '✅' : '❌'), 'quitar video vuelve al hero con imagen');

  // ── Test 6: el video sobrevive a un "fix" de todas las secciones ──
  Claude._call = async function (messages) {
    const msg = messages[messages.length - 1].content;
    if (msg.includes('REGLAS DE CLASIFICACIÓN')) return JSON.stringify({ action: 'fix', sectionId: null, reply: 'Regenerando todo...' });
    const m = msg.match(/SECCIÓN: "([^"]+)"/);
    return JSON.stringify(MOCK_CONTENT[m ? m[1] : 'hero'] || {});
  };
  const fixRes = await Claude.editLandingSectioned('está todo mal, arreglalo', withVideo, 'blue-purple', 'Curso de finanzas');
  const heroFix = fixRes.sections.find(s => s.id === 'hero');
  console.log('\nTEST 6 — video preservado tras "fix" total');
  console.log('  ' + (heroFix.html.includes(VURL) ? '✅' : '❌'), 'video sigue en el hero después de regenerar todo');

  // ── Test 7: landing vieja sin content → setHeroVideo pide contenido a IA ──
  callLog = [];
  Claude._call = async function (messages) {
    callLog.push(1);
    const msg = messages[messages.length - 1].content;
    const m = msg.match(/SECCIÓN: "([^"]+)"/);
    return JSON.stringify(MOCK_CONTENT[m ? m[1] : 'hero'] || {});
  };
  const oldSections = result.sections.map(s => ({ id: s.id, brief: s.brief, html: s.html }));
  const oldWithVideo = await Claude.setHeroVideo(oldSections, 'blue-purple', VURL, 'Curso de finanzas');
  const heroOld = oldWithVideo.find(s => s.id === 'hero');
  console.log('\nTEST 7 — landing vieja sin content guardado');
  console.log('  llamadas IA:', callLog.length, '(debe ser 1 — regenera contenido del hero)');
  console.log('  ' + (callLog.length === 1 && heroOld.html.includes(VURL) ? '✅' : '❌'), 'video aplicado con 1 llamada IA');

  // ── Test 8: form brief con "Hero background video:" en generación ──
  Claude._call = async function (messages) {
    const msg = messages[messages.length - 1].content;
    if (msg.includes('Elegí las secciones ideales')) return JSON.stringify(MOCK_CONTENT.plan);
    const m = msg.match(/SECCIÓN: "([^"]+)"/);
    return JSON.stringify(MOCK_CONTENT[m ? m[1] : 'hero'] || {});
  };
  const res8 = await Claude.generateLandingSectioned('Producto: curso de finanzas\nHero background video: ' + VURL, 'blue-purple');
  const hero8 = res8.sections.find(s => s.id === 'hero');
  console.log('\nTEST 8 — video desde el form inicial');
  console.log('  ' + (hero8.html.includes(VURL) && hero8.content.video_url === VURL ? '✅' : '❌'), 'video del form aplicado al hero generado');
  console.log('  ' + (res8.sections.every(s => s.content) ? '✅' : '❌'), 'todas las secciones guardan content para rebuilds sin IA');

  fs.writeFileSync(path.join(__dirname, 'landing-test-video.html'), Claude.assembleLanding(withVideo, 'blue-purple', 'Finanzas Sin Estrés'));

  // ── Test 9: secciones nuevas (para-quien, antes-despues) + hero center ──
  const pal9 = Claude._landingPalette('blue-purple');
  const pq = Claude._buildSection('para-quien', { title: '¿Es para vos?', yes_title: 'Es para vos si…', no_title: 'No es para vos si…', yes: ['Querés ordenar tu plata', 'Estás cansada de las deudas'], no: ['Buscás hacerte rica en una semana'] }, pal9);
  const ad = Claude._buildSection('antes-despues', { title: 'Tu transformación', before_title: 'Hoy', after_title: 'En 30 días', before: ['El sueldo se esfuma'], after: ['Sabés a dónde va cada peso'] }, pal9);
  const heroC = Claude._buildSection('hero', { layout: 'center', title: 'Título centrado', subtitle: 'Sub', cta: 'Vamos', image_prompt: 'app+dashboard' }, pal9);
  console.log('\nTEST 9 — secciones nuevas + hero center');
  console.log('  ' + (pq.includes('check_circle') && pq.includes('Es para vos si') ? '✅' : '❌'), 'para-quien con dos columnas');
  console.log('  ' + (ad.includes('border:2px solid var(--brand)') ? '✅' : '❌'), 'antes-despues con card destacada');
  console.log('  ' + (heroC.includes('text-align:center') && heroC.includes('margin:56px auto 0') ? '✅' : '❌'), 'hero variante centrada');

  // ── Test 10: clases premium presentes ──
  const full10 = Claude.assembleLanding(result.sections, 'blue-purple', 't');
  console.log('\nTEST 10 — diseño premium');
  console.log('  ' + (full10.includes('class="ld-card"') ? '✅' : '❌'), 'cards con clase ld-card');
  console.log('  ' + (full10.includes('class="ld-btn"') ? '✅' : '❌'), 'botones con clase ld-btn');
  console.log('  ' + (full10.includes('.ld-card:hover') && full10.includes('ldAurora') && full10.includes('#hero::before') ? '✅' : '❌'), 'CSS premium (hover, aurora, glow) en el assembled');

  // ── Test 11: image_url del usuario tiene prioridad y sobrevive a un fix ──
  const heroImg = Claude._buildSection('hero', { title: 'X', image_url: 'data:image/png;base64,MIIMAGEN', image_prompt: 'algo' }, pal9);
  console.log('\nTEST 11 — image_url del usuario');
  console.log('  ' + (heroImg.includes('data:image/png;base64,MIIMAGEN') && !heroImg.includes('pollinations') ? '✅' : '❌'), 'image_url pisa a Pollinations');
  const secsImg = result.sections.map(s2 => s2.id === 'hero' ? { ...s2, content: { ...s2.content, image_url: 'data:image/png;base64,MIIMAGEN' } } : s2);
  Claude._call = async function (messages) {
    const msg = messages[messages.length - 1].content;
    if (msg.includes('REGLAS DE CLASIFICACIÓN')) return JSON.stringify({ action: 'fix', sectionId: 'hero', reply: 'ok' });
    const m = msg.match(/SECCIÓN: "([^"]+)"/);
    return JSON.stringify(MOCK_CONTENT[m ? m[1] : 'hero'] || {});
  };
  const fixImg = await Claude.editLandingSectioned('el hero está roto', secsImg, 'blue-purple', 'Curso');
  console.log('  ' + (fixImg.sections.find(s2 => s2.id === 'hero').html.includes('MIIMAGEN') ? '✅' : '❌'), 'imagen sobrevive a regeneración del hero');

  // ── Test 12: acción "new" del clasificador ──
  Claude._call = async function (messages) {
    const msg = messages[messages.length - 1].content;
    if (msg.includes('REGLAS DE CLASIFICACIÓN')) return JSON.stringify({ action: 'new', sectionId: null, reply: 'Dale, armo una nueva.' });
    return '{}';
  };
  const newRes = await Claude.editLandingSectioned('hacé una landing nueva para mi curso de yoga', result.sections, 'blue-purple', 'Curso finanzas');
  console.log('\nTEST 12 — acción new');
  console.log('  ' + (newRes.newLanding === true ? '✅' : '❌'), 'clasificador devuelve newLanding para el caller');

  console.log('\n' + (fails === 0 ? '🎉 TODOS LOS CHECKS PASARON' : '⚠️ ' + fails + ' checks fallaron'));
  process.exit(fails === 0 ? 0 : 1);
})().catch(e => { console.error('CRASH:', e); process.exit(2); });
