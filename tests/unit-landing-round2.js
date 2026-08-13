// Tests de la ronda 2: grids balanceados, iconos, edición quirúrgica, precio, opts, imagen por sección
const fs = require('fs');
const storage = {};
global.localStorage = { getItem: k => storage[k] ?? null, setItem: (k,v)=>storage[k]=String(v), removeItem: k=>delete storage[k] };
global.window = { location:{search:''}, LANDING_PALETTES_DEF: [
  { id: 'blue-purple', name: 'Azul', primary: '#2E5BFF', accent: '#7c3aed', bg: '#09090b', surface: 'rgba(255,255,255,0.04)', fg: '#ffffff', mode: 'dark' },
]};
global.document = { getElementById: () => null, createElement: () => ({style:{},classList:{add(){},remove(){}},setAttribute(){},appendChild(){}}), querySelectorAll: () => [], body:{appendChild(){}} };
global.navigator = { userAgent: 'node' };
eval(fs.readFileSync(require('path').resolve(__dirname,'..','app.js'),'utf8') + '\n;globalThis.Claude=Claude;');
const C = globalThis.Claude;
const pal = C._landingPalette('blue-purple');
let fails = 0;
const chk = (name, ok) => { console.log('  ' + (ok?'✅':'❌'), name); if (!ok) fails++; };

(async () => {
  // T1: grid balanceado — 4 módulos → 2 columnas (2x2), 3 beneficios → 3 columnas
  const mod4 = C._buildSection('modulos', { title:'x', items:[{title:'1'},{title:'2'},{title:'3'},{title:'4'}] }, pal);
  const ben3 = C._buildSection('beneficios', { title:'x', items:[{title:'1'},{title:'2'},{title:'3'}] }, pal);
  const ben6 = C._buildSection('beneficios', { title:'x', items:[{},{},{},{},{},{}] }, pal);
  console.log('T1 — grids balanceados');
  chk('4 items → ld-g2 (2x2, sin huérfano)', mod4.includes('ld-g2') && !mod4.includes('ld-g3'));
  chk('3 items → ld-g3', ben3.includes('ld-g3'));
  chk('6 items → ld-g3 (3x2)', ben6.includes('ld-g3'));

  // T2: iconos sanitizados — emoji → fallback
  const emo = C._buildSection('beneficios', { title:'x', items:[{icon:'💡', title:'a'},{icon:'check_circle', title:'b'},{icon:'<script>', title:'c'}] }, pal);
  console.log('T2 — iconos');
  chk('emoji reemplazado por fallback', !emo.includes('💡') && emo.includes('check_circle'));
  chk('sin html raro en icono', !emo.includes('<script>'));

  // T3: CSS responsive presente en assembled
  const html3 = C.assembleLanding([{id:'modulos', html:mod4}], 'blue-purple', 't');
  console.log('T3 — responsive');
  chk('media query 640 fuerza 1 col', html3.includes('.ld-grid{grid-template-columns:1fr !important}'));
  chk('media query 960 baja g3 a 2', html3.includes('.ld-g3{grid-template-columns:repeat(2,1fr)}'));

  // T4: edición quirúrgica — solo cambia lo pedido
  const curContent = { title: 'Qué vas a aprender en 60 días', items: [{icon:'school',title:'Módulo 1: Mentalidad',desc:'Desc 1'},{icon:'school',title:'Módulo 2: Deudas',desc:'Desc 2'}] };
  C._call = async (messages) => {
    const msg = messages[messages.length-1].content;
    if (!msg.includes('CONTENIDO ACTUAL')) throw new Error('no es surgical prompt');
    // Simula Haiku cambiando SOLO el título
    const c2 = JSON.parse(JSON.stringify(curContent)); c2.title = 'Contenido del programa';
    return JSON.stringify(c2);
  };
  const secs = [{ id:'modulos', brief:'', content: curContent, html: mod4 }];
  C._call_classify_backup = C._call;
  // editLandingSectioned: clasificador + edit
  let phase = 0;
  C._call = async (messages) => {
    const msg = messages[messages.length-1].content;
    if (msg.includes('REGLAS DE CLASIFICACIÓN')) return JSON.stringify({action:'edit', sectionId:'modulos', reply:'ok'});
    if (msg.includes('CONTENIDO ACTUAL')) { const c2 = JSON.parse(JSON.stringify(curContent)); c2.title = 'Contenido del programa'; return JSON.stringify(c2); }
    throw new Error('prompt inesperado: ' + msg.slice(0,80));
  };
  const r4 = await C.editLandingSectioned('cambiá el título de módulos a "Contenido del programa"', secs, 'blue-purple', 'Curso finanzas', [{role:'user',content:'hola'}]);
  const m4 = r4.sections[0];
  console.log('T4 — edición quirúrgica');
  chk('título cambiado', m4.content.title === 'Contenido del programa');
  chk('items intactos palabra por palabra', JSON.stringify(m4.content.items) === JSON.stringify(curContent.items));

  // T5: filtro de precio/bonos si el brief no los menciona
  C._call = async (messages) => {
    const msg = messages[messages.length-1].content;
    if (msg.includes('Elegí las secciones ideales')) return JSON.stringify({title:'X', sections:[{id:'hero',brief:''},{id:'beneficios',brief:''},{id:'precio',brief:''},{id:'bonos',brief:''},{id:'cta-final',brief:''},{id:'footer',brief:''}]});
    const jsonStart = msg.indexOf('\n{'); return jsonStart !== -1 ? msg.slice(jsonStart) : '{}';
  };
  const r5 = await C.generateLandingSectioned('Mentoría de yoga para principiantes, agendar llamada', 'blue-purple');
  console.log('T5 — precio/bonos determinístico');
  chk('sin precio en brief → sin sección precio', !r5.sections.some(s=>s.id==='precio'));
  chk('sin bonos en brief → sin sección bonos', !r5.sections.some(s=>s.id==='bonos'));
  chk('CTAs no apuntan a #precio inexistente', !r5.html.includes('href="#precio"'));
  const r5b = await C.generateLandingSectioned('Curso de yoga, precio $149, incluye bonos de regalo', 'blue-purple');
  chk('con precio en brief → sección precio presente', r5b.sections.some(s=>s.id==='precio'));

  // T6: assembleLanding opts — link de pago + pixel
  const html6 = C.assembleLanding(r5b.sections, 'blue-purple', 't', { ctaUrl: 'https://pay.hotmart.com/X123', fbPixel: '123456789012345' });
  console.log('T6 — pixel + link de pago');
  chk('CTAs apuntan al link de pago', html6.includes('href="https://pay.hotmart.com/X123" target="_blank"'));
  chk('pixel inyectado con el ID', html6.includes("fbq('init','123456789012345')"));
  chk('InitiateCheckout en botones', html6.includes("fbq('track','InitiateCheckout')"));
  const html6b = C.assembleLanding(r5b.sections, 'blue-purple', 't');
  chk('sin opts → sin pixel init ni link de pago', !html6b.includes("fbq('init'") && !html6b.includes('hotmart'));

  // T7: setSectionImage — instantáneo con content, imagen aparece en la sección
  const secs7 = r5b.sections;
  let calls7 = 0; const oldCall = C._call; C._call = async (...a) => { calls7++; return oldCall(...a); };
  const out7 = await C.setSectionImage(secs7, 'blue-purple', 'beneficios', 'data:image/png;base64,FOTO7', 'curso');
  console.log('T7 — imagen en sección específica');
  chk('0 llamadas IA (content guardado)', calls7 === 0);
  chk('imagen en beneficios', out7.find(s=>s.id==='beneficios').html.includes('FOTO7'));

  // T8: hero con video + foto conviven
  const heroVF = C._buildSection('hero', { title:'T', video_url:'https://v.mp4', image_url:'data:image/png;base64,FOTO8' }, pal);
  console.log('T8 — video + foto en hero');
  chk('video presente', heroVF.includes('<video'));
  chk('foto también presente', heroVF.includes('FOTO8'));

  console.log('\n' + (fails===0 ? '🎉 TODOS LOS CHECKS PASARON' : '⚠️ ' + fails + ' FALLARON'));
  process.exit(fails===0?0:1);
})().catch(e => { console.error('CRASH:', e); process.exit(2); });
