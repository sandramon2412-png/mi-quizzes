// landing-blocks.js — Block-based landing renderer for Luminous Studio
// v1.0 — 2026-06-02

// ──────────────────────────────────────────────────────────
// PALETTES
// ──────────────────────────────────────────────────────────
// LANDING_PALETTES_DEF: array format for the UI (id, name, primary=from, accent=to)
const LANDING_PALETTES_DEF = [
  { id: 'blue-purple',   name: 'Azul → Púrpura',    primary: '#2E5BFF', accent: '#7c3aed' },
  { id: 'green-teal',    name: 'Verde → Teal',       primary: '#059669', accent: '#0891b2' },
  { id: 'orange-rose',   name: 'Naranja → Rosa',     primary: '#ea580c', accent: '#e11d48' },
  { id: 'gold-amber',    name: 'Dorado → Ámbar',     primary: '#d97706', accent: '#b45309' },
  { id: 'violet-indigo', name: 'Violeta → Índigo',   primary: '#7c3aed', accent: '#4338ca' },
  { id: 'rose-fuchsia',  name: 'Rosa → Fucsia',      primary: '#e11d48', accent: '#a21caf' },
  { id: 'teal-cyan',     name: 'Teal → Cyan',        primary: '#0891b2', accent: '#06b6d4' },
  { id: 'lime-green',    name: 'Lima → Verde',        primary: '#65a30d', accent: '#059669' },
];

// Internal palette lookup by id (from, to)
function _palById(id) {
  const p = LANDING_PALETTES_DEF.find(x => x.id === id) || LANDING_PALETTES_DEF[0];
  return { from: p.primary, to: p.accent };
}

// ──────────────────────────────────────────────────────────
// BLOCK SCHEMAS (empty templates for AI to fill)
// ──────────────────────────────────────────────────────────
const BLOCK_DEFAULTS = {
  nav: {
    logo: '',
    links: ['Para quién', 'Beneficios', 'Testimonios', 'FAQ'],
    cta_text: 'Comenzar ahora',
    cta_href: '#ld-cta_final'
  },
  hero: {
    badge: '',
    headline: '',
    headline_gradient: '',
    subheadline: '',
    cta_text: '',
    cta_href: '#ld-cta_final',
    image_url: '',
    image_size: 'grande',
    image_ratio: '4/3',
    social_proof_count: '',
    social_proof_label: '',
    microcopy: 'Sin tarjeta de crédito · Acceso inmediato · Garantía 30 días'
  },
  para_quien: {
    for_headline: 'Esta formación ES para vos si…',
    for_items: ['', '', '', ''],
    not_for_headline: 'NO es para vos si…',
    not_for_items: ['', '']
  },
  problema: {
    headline: '',
    subheadline: '',
    items: [
      { icon: 'sentiment_dissatisfied', text: '' },
      { icon: 'sentiment_dissatisfied', text: '' },
      { icon: 'sentiment_dissatisfied', text: '' },
      { icon: 'sentiment_dissatisfied', text: '' }
    ]
  },
  metricas: {
    headline: '',
    items: [
      { value: '', label: '' },
      { value: '', label: '' },
      { value: '', label: '' },
      { value: '', label: '' }
    ]
  },
  beneficios: {
    headline: '',
    subheadline: '',
    items: [
      { icon: 'check_circle', title: '', description: '' },
      { icon: 'check_circle', title: '', description: '' },
      { icon: 'check_circle', title: '', description: '' },
      { icon: 'check_circle', title: '', description: '' },
      { icon: 'check_circle', title: '', description: '' },
      { icon: 'check_circle', title: '', description: '' }
    ]
  },
  modulos: {
    headline: '',
    subheadline: '',
    items: [
      { number: '01', title: '', description: '', chips: [] },
      { number: '02', title: '', description: '', chips: [] },
      { number: '03', title: '', description: '', chips: [] },
      { number: '04', title: '', description: '', chips: [] }
    ]
  },
  testimonios: {
    headline: 'Lo que dicen quienes ya lo vivieron',
    items: [
      { name: '', role: '', text: '', initials: '', result: '' },
      { name: '', role: '', text: '', initials: '', result: '' },
      { name: '', role: '', text: '', initials: '', result: '' }
    ]
  },
  bonos: {
    headline: 'Cuando te inscribís HOY también recibís:',
    subheadline: '',
    items: [
      { icon: 'workspace_premium', name: '', description: '', value: '', badge: 'GRATIS' },
      { icon: 'workspace_premium', name: '', description: '', value: '', badge: 'GRATIS' },
      { icon: 'workspace_premium', name: '', description: '', value: '', badge: 'GRATIS' }
    ]
  },
  stack: {
    headline: 'Todo lo que recibís hoy:',
    items: [
      { name: '', value: '' },
      { name: '', value: '' }
    ],
    total_value: '',
    current_price: '',
    savings: ''
  },
  garantia: {
    days: '30',
    headline: 'Garantía total sin preguntas',
    text: ''
  },
  faq: {
    headline: 'Preguntas frecuentes',
    items: [
      { question: '¿Necesito experiencia previa?', answer: '' },
      { question: '¿Cuánto tiempo necesito por día?', answer: '' },
      { question: '¿Cuánto tiempo tengo acceso al material?', answer: '' },
      { question: '¿Cómo funciona la garantía de 30 días?', answer: '' },
      { question: '¿Hay soporte si tengo dudas?', answer: '' },
      { question: '¿Es una compra segura?', answer: '' }
    ]
  },
  cta_final: {
    headline: '',
    subheadline: '',
    cta_text: '',
    cta_href: '',
    price: '',
    original_price: '',
    urgency: '',
    microcopy: 'Sin tarjeta de crédito · Acceso inmediato · Garantía 30 días'
  },
  footer: {
    brand: '',
    tagline: '',
    links: [
      { text: 'Términos y condiciones', href: '#' },
      { text: 'Política de privacidad', href: '#' }
    ],
    copyright: ''
  },
  imagen: {
    title: '',
    subtitle: '',
    image_url: '',
    caption: '',
    image_size: 'natural',
  },
  galeria: {
    title: 'Galería de imágenes',
    subtitle: '',
    columns: 2,
    ratio: '4/3',
    images: [
      { url: '', caption: '' },
      { url: '', caption: '' },
    ],
  },
};

const BLOCK_ORDER = [
  'nav', 'hero', 'para_quien', 'problema', 'metricas',
  'beneficios', 'modulos', 'testimonios', 'bonos',
  'stack', 'garantia', 'faq', 'cta_final', 'footer'
];

// ──────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────
function _e(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function _gradBg(pal) {
  return `background:linear-gradient(135deg,${pal.from} 0%,${pal.to} 100%)`;
}
function _gradText(pal) {
  return `background:linear-gradient(135deg,${pal.from},${pal.to});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:inline`;
}
function _icon(name, size = 24, color = 'inherit') {
  return `<span class="material-symbols-outlined" style="font-size:${size}px;color:${color};vertical-align:middle;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' ${size}">${_e(name)}</span>`;
}

// ──────────────────────────────────────────────────────────
// BASE CSS for rendered landings (no Tailwind dependency)
// ──────────────────────────────────────────────────────────
function _baseCss(pal) {
  return `
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#09090b;color:#fff;overflow-x:hidden;-webkit-font-smoothing:antialiased}
a{text-decoration:none;color:inherit}
img{max-width:100%;height:auto;display:block;border-radius:12px}
.material-symbols-outlined{font-family:'Material Symbols Outlined';font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24;font-style:normal;line-height:1;letter-spacing:normal;text-transform:none;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased}

/* Gradient utilities */
.grad-bg{${_gradBg(pal)}}
.grad-text{${_gradText(pal)}}
.grad-border{border:1px solid transparent;background-clip:padding-box;position:relative}

/* Layout */
.ld-inner{max-width:1180px;margin:0 auto;padding:0 28px}
.ld-section{padding:100px 0}
.ld-section-sm{padding:60px 0}

/* Typography */
.ld-h1{font-size:clamp(38px,5.5vw,76px);font-weight:800;line-height:1.06;letter-spacing:-0.025em}
.ld-h2{font-size:clamp(30px,3.8vw,56px);font-weight:800;line-height:1.1;letter-spacing:-0.02em}
.ld-h3{font-size:clamp(20px,2.2vw,30px);font-weight:700;line-height:1.2;letter-spacing:-0.01em}
.ld-body{font-size:18px;line-height:1.75;color:rgba(255,255,255,0.68)}
.ld-small{font-size:13px;color:rgba(255,255,255,0.45);letter-spacing:0.01em}
.ld-label{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.5)}
.ld-section-tag{display:inline-flex;align-items:center;gap:8px;padding:8px 18px;border-radius:999px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);font-size:13px;font-weight:600;margin-bottom:24px}

/* Cards */
.ld-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:28px;transition:background 0.2s,border-color 0.2s}
.ld-card:hover{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.14)}
.ld-card-dark{background:#111113;border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:28px}

/* Buttons */
.ld-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:18px 36px;border-radius:14px;font-weight:700;font-size:17px;cursor:pointer;transition:opacity 0.2s,transform 0.15s,box-shadow 0.2s;border:none;color:#fff;letter-spacing:-0.01em;${_gradBg(pal)};box-shadow:0 4px 24px rgba(0,0,0,0.4)}
.ld-btn:hover{opacity:0.92;transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.5)}
.ld-btn-lg{font-size:19px;padding:20px 44px;border-radius:16px}
.ld-btn-outline{background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.18);color:rgba(255,255,255,0.85);box-shadow:none}
.ld-btn-outline:hover{border-color:rgba(255,255,255,0.4);background:rgba(255,255,255,0.1)}

/* Grids */
.ld-g2{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.ld-g3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.ld-g4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.ld-flex{display:flex;align-items:center;gap:16px}
.ld-flex-col{display:flex;flex-direction:column;gap:12px}
.ld-center{text-align:center;display:flex;flex-direction:column;align-items:center}

/* Divider */
.ld-hr{height:1px;background:rgba(255,255,255,0.07);margin:0 28px}

/* FAQ */
details.ld-faq{border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;margin-bottom:10px}
details.ld-faq summary{padding:20px 24px;font-weight:700;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;list-style:none;user-select:none}
details.ld-faq summary::-webkit-details-marker{display:none}
details.ld-faq summary::after{content:'▾';font-size:18px;opacity:0.5;transition:transform 0.2s}
details.ld-faq[open] summary::after{transform:rotate(180deg)}
details.ld-faq .faq-body{padding:0 24px 20px;color:rgba(255,255,255,0.7);font-size:15px;line-height:1.75}

/* Animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.ld-animate{animation:fadeUp 0.6s ease both}

/* Metric counter animation */
@keyframes countUp{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}
.ld-metric-val{animation:countUp 0.5s ease both}

/* Stack table */
.ld-table{width:100%;border-collapse:separate;border-spacing:0}
.ld-table tr{border-bottom:1px solid rgba(255,255,255,0.06)}
.ld-table td{padding:14px 0;font-size:15px}
.ld-table .ld-table-name{color:rgba(255,255,255,0.75)}
.ld-table .ld-table-val{text-align:right;font-weight:600;text-decoration:line-through;color:rgba(255,255,255,0.35);font-size:14px}
.ld-table-total{border-top:2px solid rgba(255,255,255,0.12)!important;font-weight:800;font-size:18px}

/* Responsive */
@media(max-width:900px){
  .ld-section,.ld-section-sm{padding:64px 0}
  .ld-g4{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:640px){
  .ld-inner{padding:0 18px}
  .ld-h1{font-size:36px}
  .ld-h2{font-size:28px}
  .ld-section,.ld-section-sm{padding:52px 0}
  .ld-g2,.ld-g3,.ld-g4{grid-template-columns:1fr}
  .ld-hero-cols{flex-direction:column!important}
  .ld-nav-links{display:none!important}
  .ld-btn-lg{font-size:16px;padding:16px 28px}
}
`;
}

// ──────────────────────────────────────────────────────────
// SECTION RENDERERS
// ──────────────────────────────────────────────────────────

// Guard: AI sometimes returns a string/object instead of an array
function _arr(v) { return Array.isArray(v) ? v : []; }

function _renderNav(data, pal) {
  // Map nav link text to correct section IDs (text can be in any language/case)
  function _navAnchor(text) {
    var s = text.toLowerCase().replace(/[áéíóú]/g,function(c){return {á:'a',é:'e',í:'i',ó:'o',ú:'u'}[c]||c;}).replace(/[^a-z0-9]+/g,'');
    var m = {paraquien:'para_quien',paraquienes:'para_quien',paraqueien:'para_quien',problema:'problema',dolor:'problema',metricas:'metricas',resultados:'metricas',beneficios:'beneficios',modulos:'modulos',temario:'modulos',contenido:'modulos',testimonios:'testimonios',clientes:'testimonios',bonos:'bonos',stack:'stack',incluye:'stack',garantia:'garantia',faq:'faq',preguntas:'faq',cta:'cta_final',comenzar:'cta_final',empezar:'cta_final'};
    return '#ld-' + (m[s] || s.replace(/\s+/g,'-'));
  }
  const links = _arr(data.links).map(l =>
    `<a href="${_navAnchor(l)}" style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.65);transition:color 0.2s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.65)'">${_e(l)}</a>`
  ).join('');
  return `
<nav id="ld-nav" style="position:sticky;top:0;z-index:100;background:rgba(9,9,11,0.88);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.07)">
  <div class="ld-inner" style="height:64px;display:flex;align-items:center;gap:32px">
    <div style="font-weight:800;font-size:19px;white-space:nowrap;${_gradText(pal)}">${_e(data.logo || 'Mi Brand')}</div>
    <div class="ld-nav-links" style="flex:1;display:flex;gap:28px;justify-content:center">${links}</div>
    <a href="${_e(data.cta_href||'#ld-cta_final')}" class="ld-btn" style="padding:10px 22px;font-size:14px;border-radius:10px;box-shadow:none;${_gradBg(pal)}">${_e(data.cta_text||'Comenzar')}</a>
  </div>
</nav>`;
}

function _renderHero(data, pal) {
  const headline = data.headline_gradient
    ? `${_e(data.headline)} <span style="${_gradText(pal)}">${_e(data.headline_gradient)}</span>`
    : `<span style="${_gradText(pal)}">${_e(data.headline)}</span>`;

  // Image size controls both flex width and layout
  const sz = data.image_size || 'grande';
  let imgCol = '';
  if (data.image_url) {
    const flexSz = sz === 'grande' ? 'flex:1;min-width:0' : sz === 'mediano' ? 'flex:0 0 38%;min-width:0' : sz === 'pequeno' ? 'flex:0 0 26%;min-width:0' : 'width:100%;margin-top:40px';
    const maxW   = sz === 'grande' ? '560px' : sz === 'mediano' ? '420px' : sz === 'pequeno' ? '260px' : '720px';
    imgCol = `<div style="${flexSz};display:flex;align-items:center;justify-content:center">
        <img src="${_e(data.image_url)}" alt="" style="width:100%;max-width:${maxW};border-radius:24px;box-shadow:0 32px 80px rgba(0,0,0,0.6);object-fit:cover;aspect-ratio:${data.image_ratio||'4/3'}" onerror="this.style.display='none'">
       </div>`;
  }
  // For 'centrado' layout, image goes below text in a separate row
  const heroCols = sz === 'centrado'
    ? `<div style="flex-direction:column;align-items:center;text-align:center">`
    : `<div class="ld-hero-cols" style="display:flex;align-items:center;gap:64px">`;

  const socialProof = data.social_proof_count
    ? `<div style="display:flex;align-items:center;gap:12px;margin-top:16px">
        <div style="display:flex">
          ${[0,1,2,3].map(i=>`<div style="width:32px;height:32px;border-radius:50%;${_gradBg(pal)};border:2px solid #09090b;margin-left:${i?-8:0}px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">${String.fromCharCode(65+i)}</div>`).join('')}
        </div>
        <span style="font-size:13px;color:rgba(255,255,255,0.65)"><strong style="color:#fff">${_e(data.social_proof_count)}</strong> ${_e(data.social_proof_label)}</span>
       </div>`
    : '';
  return `
<section id="ld-hero" style="padding:80px 0 64px;overflow:hidden">
  <div class="ld-inner">
    ${data.badge ? `<div style="display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:999px;${_gradBg(pal)};font-size:12px;font-weight:700;letter-spacing:0.06em;margin-bottom:28px;opacity:0.9">${_e(data.badge)}</div>` : ''}
    ${heroCols}
      <div style="${sz==='centrado'?'max-width:700px':'flex:1;min-width:0'}">
        <h1 class="ld-h1" style="margin-bottom:20px">${headline}</h1>
        <p class="ld-body" style="font-size:19px;margin-bottom:36px;max-width:580px">${_e(data.subheadline)}</p>
        <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center${sz==='centrado'?';justify-content:center':''}">
          <a href="${_e(data.cta_href||'#ld-cta_final')}" class="ld-btn ld-btn-lg">${_icon('bolt',22,'#fff')} ${_e(data.cta_text||'Comenzar ahora')}</a>
        </div>
        ${socialProof}
        ${data.microcopy ? `<p class="ld-small" style="margin-top:14px">${_e(data.microcopy)}</p>` : ''}
      </div>
      ${imgCol}
    </div>
  </div>
</section>`;
}

function _renderParaQuien(data, pal) {
  const forItems = _arr(data.for_items).filter(Boolean).map(t =>
    `<li style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:15px;color:rgba(255,255,255,0.8)">
      <span style="${_gradText(pal)};flex-shrink:0">${_icon('check_circle',20)}</span> ${_e(t)}
     </li>`).join('');
  const notForItems = _arr(data.not_for_items).filter(Boolean).map(t =>
    `<li style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:15px;color:rgba(255,255,255,0.6)">
      <span style="color:#ef4444;flex-shrink:0">${_icon('cancel',20)}</span> ${_e(t)}
     </li>`).join('');
  return `
<section id="ld-para_quien" class="ld-section">
  <div class="ld-inner">
    <div class="ld-g2">
      <div class="ld-card">
        <h3 class="ld-h3" style="margin-bottom:20px">${_e(data.for_headline||'Esta formación ES para vos si…')}</h3>
        <ul style="list-style:none">${forItems}</ul>
      </div>
      <div class="ld-card" style="background:rgba(239,68,68,0.04);border-color:rgba(239,68,68,0.15)">
        <h3 class="ld-h3" style="margin-bottom:20px;color:rgba(255,255,255,0.65)">${_e(data.not_for_headline||'NO es para vos si…')}</h3>
        <ul style="list-style:none">${notForItems}</ul>
      </div>
    </div>
  </div>
</section>`;
}

function _renderProblema(data, pal) {
  const items = (data.items || []).filter(i=>i.text).map(item =>
    `<div class="ld-card" style="display:flex;gap:16px;align-items:flex-start">
      <div style="width:44px;height:44px;border-radius:12px;background:rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0">
        ${_icon(item.icon||'sentiment_dissatisfied', 22, '#f87171')}
      </div>
      <p style="font-size:15px;line-height:1.65;color:rgba(255,255,255,0.78);padding-top:10px">${_e(item.text)}</p>
     </div>`).join('');
  return `
<section id="ld-problema" class="ld-section" style="background:linear-gradient(to bottom,transparent,rgba(239,68,68,0.04) 30%,rgba(239,68,68,0.04) 70%,transparent)">
  <div class="ld-inner">
    <div class="ld-center" style="margin-bottom:56px">
      ${data.headline ? `<h2 class="ld-h2">${_e(data.headline)}</h2>` : ''}
      ${data.subheadline ? `<p class="ld-body" style="margin-top:16px;max-width:640px">${_e(data.subheadline)}</p>` : ''}
    </div>
    <div class="ld-g2">${items}</div>
  </div>
</section>`;
}

function _renderMetricas(data, pal) {
  const items = _arr(data.items).filter(i=>i&&i.value).map((item, idx) =>
    `<div class="ld-card ld-center" style="padding:40px 24px">
      <div class="ld-metric-val ld-h1" style="${_gradText(pal)};animation-delay:${idx*0.1}s">${_e(item.value)}</div>
      <div style="margin-top:10px;font-size:15px;font-weight:600;color:rgba(255,255,255,0.55);text-align:center">${_e(item.label)}</div>
     </div>`).join('');
  const cols = Math.min(4, _arr(data.items).filter(i=>i&&i.value).length);
  return `
<section id="ld-metricas" class="ld-section-sm">
  <div class="ld-inner">
    ${data.headline ? `<div class="ld-center" style="margin-bottom:40px"><h2 class="ld-h2">${_e(data.headline)}</h2></div>` : ''}
    <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:16px">${items}</div>
  </div>
</section>`;
}

function _renderBeneficios(data, pal) {
  const items = _arr(data.items).filter(i=>i&&(i.title||i.text)).map(item =>
    `<div class="ld-card" style="display:flex;flex-direction:column;gap:14px">
      <div style="width:48px;height:48px;border-radius:14px;${_gradBg(pal)};display:flex;align-items:center;justify-content:center;flex-shrink:0">
        ${_icon(item.icon||'check_circle', 24, '#fff')}
      </div>
      <div>
        <h3 style="font-size:17px;font-weight:700;margin-bottom:8px">${_e(item.title||item.text)}</h3>
        ${item.description ? `<p style="font-size:14px;line-height:1.65;color:rgba(255,255,255,0.62)">${_e(item.description)}</p>` : ''}
      </div>
     </div>`).join('');
  return `
<section id="ld-beneficios" class="ld-section">
  <div class="ld-inner">
    <div class="ld-center" style="margin-bottom:56px">
      ${data.headline ? `<h2 class="ld-h2">${_e(data.headline)}</h2>` : ''}
      ${data.subheadline ? `<p class="ld-body" style="margin-top:16px;max-width:640px">${_e(data.subheadline)}</p>` : ''}
    </div>
    <div class="ld-g3">${items}</div>
  </div>
</section>`;
}

function _renderModulos(data, pal) {
  const items = _arr(data.items).filter(i=>i&&i.title).map((item, idx) =>
    `<div class="ld-card" style="display:flex;gap:20px">
      <div style="font-size:40px;font-weight:800;${_gradText(pal)};flex-shrink:0;line-height:1;padding-top:2px">${_e(item.number||String(idx+1).padStart(2,'0'))}</div>
      <div style="min-width:0">
        <h3 style="font-size:18px;font-weight:700;margin-bottom:8px">${_e(item.title)}</h3>
        <p style="font-size:14px;line-height:1.65;color:rgba(255,255,255,0.6);margin-bottom:14px">${_e(item.description)}</p>
        ${_arr(item.chips).filter(Boolean).length ? `<div style="display:flex;flex-wrap:wrap;gap:6px">${_arr(item.chips).filter(Boolean).map(c=>`<span style="padding:4px 10px;border-radius:6px;background:rgba(255,255,255,0.07);font-size:11px;font-weight:600">${_e(c)}</span>`).join('')}</div>` : ''}
      </div>
     </div>`).join('');
  return `
<section id="ld-modulos" class="ld-section">
  <div class="ld-inner">
    <div class="ld-center" style="margin-bottom:56px">
      ${data.headline ? `<h2 class="ld-h2">${_e(data.headline)}</h2>` : ''}
      ${data.subheadline ? `<p class="ld-body" style="margin-top:16px;max-width:640px">${_e(data.subheadline)}</p>` : ''}
    </div>
    <div class="ld-g2">${items}</div>
  </div>
</section>`;
}

function _renderTestimonios(data, pal) {
  const items = _arr(data.items).filter(i=>i&&i.text).map(item => {
    const initials = item.initials || (item.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    return `
    <div class="ld-card" style="display:flex;flex-direction:column;gap:16px">
      ${item.result ? `<div style="padding:8px 14px;border-radius:8px;${_gradBg(pal)};font-size:13px;font-weight:700;display:inline-block;align-self:flex-start">${_e(item.result)}</div>` : ''}
      <p style="font-size:15px;line-height:1.75;color:rgba(255,255,255,0.8);flex:1;font-style:italic">"${_e(item.text)}"</p>
      <div style="display:flex;align-items:center;gap:12px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.07)">
        <div style="width:40px;height:40px;border-radius:50%;${_gradBg(pal)};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;flex-shrink:0">${_e(initials)}</div>
        <div>
          <div style="font-weight:700;font-size:14px">${_e(item.name)}</div>
          ${item.role ? `<div style="font-size:12px;color:rgba(255,255,255,0.45)">${_e(item.role)}</div>` : ''}
        </div>
      </div>
     </div>`;
  }).join('');
  return `
<section id="ld-testimonios" class="ld-section" style="background:linear-gradient(135deg,rgba(${_hexToRgb(pal.from)},0.06) 0%,transparent 50%,rgba(${_hexToRgb(pal.to)},0.06) 100%)">
  <div class="ld-inner">
    <div class="ld-center" style="margin-bottom:56px">
      <h2 class="ld-h2">${_e(data.headline||'Lo que dicen nuestros alumnos')}</h2>
    </div>
    <div class="ld-g3">${items}</div>
  </div>
</section>`;
}

function _renderBonos(data, pal) {
  const items = _arr(data.items).filter(i=>i&&(i.name||i.title)).map((item, idx) =>
    `<div class="ld-card" style="display:flex;gap:18px;align-items:flex-start;position:relative;overflow:hidden">
      <div style="width:52px;height:52px;border-radius:14px;${_gradBg(pal)};display:flex;align-items:center;justify-content:center;flex-shrink:0">
        ${_icon(item.icon||'workspace_premium', 26, '#fff')}
      </div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:flex-start;gap:10px;flex-wrap:wrap;margin-bottom:6px">
          <h3 style="font-size:16px;font-weight:700;flex:1">${_e(item.name||item.title)}</h3>
          <span style="padding:4px 10px;border-radius:6px;${_gradBg(pal)};font-size:11px;font-weight:700;flex-shrink:0">${_e(item.badge||'GRATIS')}</span>
        </div>
        <p style="font-size:14px;line-height:1.6;color:rgba(255,255,255,0.6);margin-bottom:8px">${_e(item.description||item.desc||'')}</p>
        ${item.value ? `<p style="font-size:13px;color:rgba(255,255,255,0.35)">Valor: <span style="text-decoration:line-through">${_e(item.value)}</span></p>` : ''}
      </div>
      <div style="position:absolute;top:-20px;right:-20px;width:80px;height:80px;border-radius:50%;${_gradBg(pal)};opacity:0.08"></div>
     </div>`).join('');
  return `
<section id="ld-bonos" class="ld-section">
  <div class="ld-inner">
    <div class="ld-center" style="margin-bottom:56px">
      <div class="ld-section-tag">${_icon('workspace_premium',16)} <span>Bonos exclusivos</span></div>
      <h2 class="ld-h2">${_e(data.headline||'Además, cuando te inscribís hoy recibís:')}</h2>
      ${data.subheadline ? `<p class="ld-body" style="margin-top:16px;max-width:640px">${_e(data.subheadline)}</p>` : ''}
    </div>
    <div class="ld-flex-col">${items}</div>
  </div>
</section>`;
}

function _renderStack(data, pal) {
  const rows = _arr(data.items).filter(i=>i&&(i.name||i.label)).map(item =>
    `<tr><td class="ld-table-name">${_icon('check',18,pal.from)} ${_e(item.name||item.label)}</td><td class="ld-table-val">${_e(item.value)}</td></tr>`
  ).join('');
  return `
<section id="ld-stack" class="ld-section-sm">
  <div class="ld-inner">
    <div class="ld-card" style="max-width:680px;margin:0 auto;padding:40px">
      <h2 class="ld-h3" style="margin-bottom:32px;text-align:center">${_e(data.headline||'Todo lo que recibís hoy:')}</h2>
      <table class="ld-table"><tbody>${rows}</tbody></table>
      <div style="margin-top:24px;padding-top:20px;border-top:2px solid rgba(255,255,255,0.1)">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:15px;color:rgba(255,255,255,0.6)">Valor total</span>
          <span style="font-size:15px;text-decoration:line-through;color:rgba(255,255,255,0.35)">${_e(data.total_value||'')}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px">
          <span style="font-size:19px;font-weight:700">Tu inversión hoy</span>
          <span class="ld-h2" style="${_gradText(pal)}">${_e(data.current_price||'')}</span>
        </div>
        ${data.savings ? `<div style="margin-top:10px;padding:10px 16px;border-radius:10px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);color:#4ade80;font-size:14px;font-weight:700;text-align:center">${_icon('savings',16,'#4ade80')} ${_e(data.savings)}</div>` : ''}
      </div>
    </div>
  </div>
</section>`;
}

function _renderGarantia(data, pal) {
  return `
<section id="ld-garantia" class="ld-section-sm">
  <div class="ld-inner">
    <div class="ld-card ld-center" style="max-width:680px;margin:0 auto;padding:52px 40px;background:rgba(34,197,94,0.04);border-color:rgba(34,197,94,0.15)">
      <div style="width:80px;height:80px;border-radius:50%;background:rgba(34,197,94,0.12);display:flex;align-items:center;justify-content:center;margin-bottom:24px">
        ${_icon('verified_user', 40, '#4ade80')}
      </div>
      <div style="font-size:64px;font-weight:800;${_gradText(pal)};line-height:1;margin-bottom:4px">${_e(data.days||'30')}</div>
      <div style="font-size:14px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:24px">días de garantía</div>
      <h2 class="ld-h3" style="margin-bottom:16px">${_e(data.headline||'Garantía total sin preguntas')}</h2>
      <p class="ld-body" style="max-width:500px;text-align:center">${_e(data.text)}</p>
    </div>
  </div>
</section>`;
}

function _renderFaq(data, pal) {
  const items = _arr(data.items).filter(i=>i&&i.question).map((item, idx) =>
    `<details class="ld-faq" ${idx===0?'open':''}>
      <summary>${_e(item.question)}</summary>
      <div class="faq-body">${_e(item.answer)}</div>
     </details>`).join('');
  return `
<section id="ld-faq" class="ld-section">
  <div class="ld-inner">
    <div class="ld-center" style="margin-bottom:48px">
      <h2 class="ld-h2">${_e(data.headline||'Preguntas frecuentes')}</h2>
    </div>
    <div style="max-width:740px;margin:0 auto">${items}</div>
  </div>
</section>`;
}

function _renderCtaFinal(data, pal) {
  return `
<section id="ld-cta_final" class="ld-section" style="background:linear-gradient(135deg,rgba(${_hexToRgb(pal.from)},0.12) 0%,rgba(${_hexToRgb(pal.to)},0.12) 100%)">
  <div class="ld-inner ld-center">
    ${data.urgency ? `<div style="display:inline-flex;align-items:center;gap:8px;padding:8px 18px;border-radius:999px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.2);font-size:13px;font-weight:700;color:#f87171;margin-bottom:24px">${_icon('timer',16,'#f87171')} ${_e(data.urgency)}</div>` : ''}
    <h2 class="ld-h2" style="margin-bottom:16px;max-width:720px">${_e(data.headline)}</h2>
    ${data.subheadline ? `<p class="ld-body" style="margin-bottom:32px;max-width:560px">${_e(data.subheadline)}</p>` : ''}
    <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:20px">
      ${data.original_price ? `<p style="font-size:15px;text-decoration:line-through;color:rgba(255,255,255,0.35)">Antes: ${_e(data.original_price)}</p>` : ''}
      ${data.price ? `<div class="ld-h2" style="${_gradText(pal)}">${_e(data.price)}</div>` : ''}
    </div>
    <a href="${_e(data.cta_href||'#')}" class="ld-btn ld-btn-lg" style="width:auto">${_icon('bolt',22,'#fff')} ${_e(data.cta_text||'Comenzar ahora')}</a>
    ${data.microcopy ? `<p class="ld-small" style="margin-top:14px">${_e(data.microcopy)}</p>` : ''}
  </div>
</section>`;
}

function _renderFooter(data, pal) {
  const links = _arr(data.links).filter(l=>l&&(l.text||l.href)).map(l =>
    `<a href="${_e(l.href||'#')}" style="font-size:13px;color:rgba(255,255,255,0.4);transition:color 0.2s" onmouseover="this.style.color='rgba(255,255,255,0.7)'" onmouseout="this.style.color='rgba(255,255,255,0.4)'">${_e(l.text)}</a>`
  ).join('');
  return `
<footer id="ld-footer" style="border-top:1px solid rgba(255,255,255,0.07);padding:48px 0 32px">
  <div class="ld-inner">
    <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;margin-bottom:24px">
      <div>
        <div style="font-weight:800;font-size:17px;${_gradText(pal)};margin-bottom:4px">${_e(data.brand||'Mi Brand')}</div>
        ${data.tagline ? `<p style="font-size:13px;color:rgba(255,255,255,0.4)">${_e(data.tagline)}</p>` : ''}
      </div>
      <div style="display:flex;gap:20px;flex-wrap:wrap">${links}</div>
    </div>
    <div class="ld-hr" style="margin:0 0 20px"></div>
    <p class="ld-small" style="text-align:center">${_e(data.copyright||`© ${new Date().getFullYear()} ${data.brand||''}. Todos los derechos reservados.`)}</p>
  </div>
</footer>`;
}

// Helper: hex to rgb components
function _hexToRgb(hex) {
  const r = parseInt((hex||'#000').slice(1,3),16)||0;
  const g = parseInt((hex||'#000').slice(3,5),16)||0;
  const b = parseInt((hex||'#000').slice(5,7),16)||0;
  return `${r},${g},${b}`;
}


function _renderImagen(data, pal) {
  const sz = data.image_size || 'wide';
  // natural: image shows at its own size (no forced ratio, no crop)
  if (sz === 'natural') {
    return `
<section id="ld-imagen-${Math.random().toString(36).slice(2,5)}" class="ld-section-sm">
  <div class="ld-inner" style="display:flex;flex-direction:column;align-items:center">
    ${data.title ? `<h2 class="ld-h2" style="text-align:center;margin-bottom:16px">${_e(data.title)}</h2>` : ''}
    ${data.subtitle ? `<p class="ld-body" style="text-align:center;margin-bottom:32px;max-width:700px">${_e(data.subtitle)}</p>` : ''}
    ${data.image_url ? `<img src="${_e(data.image_url)}" alt="${_e(data.caption||'')}" style="max-width:100%;height:auto;border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,0.45);display:block" onerror="this.style.display='none'"/>` : `<div style="width:300px;height:200px;background:rgba(255,255,255,0.05);border-radius:16px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.3);font-size:14px">Sin imagen</div>`}
    ${data.caption ? `<p style="text-align:center;margin-top:12px;font-size:13px;color:rgba(255,255,255,0.45)">${_e(data.caption)}</p>` : ''}
  </div>
</section>`;
  }
  const wMap  = {wide:'100%', medium:'65%', small:'40%', portrait:'30%'};
  const arMap = {wide:'16/7', medium:'16/9', small:'4/3',  portrait:'3/4'};
  const w  = wMap[sz]  || '100%';
  const ar = arMap[sz] || '16/7';
  return `
<section id="ld-imagen-${Math.random().toString(36).slice(2,5)}" class="ld-section-sm">
  <div class="ld-inner">
    ${data.title ? `<h2 class="ld-h2" style="text-align:center;margin-bottom:16px">${_e(data.title)}</h2>` : ''}
    ${data.subtitle ? `<p class="ld-body" style="text-align:center;margin-bottom:32px;max-width:700px;margin-left:auto;margin-right:auto">${_e(data.subtitle)}</p>` : ''}
    <div style="margin:0 auto;width:${w};border-radius:20px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.5)">
      ${data.image_url ? `<img src="${_e(data.image_url)}" alt="${_e(data.caption||'')}" style="width:100%;aspect-ratio:${ar};object-fit:cover;display:block" onerror="this.style.display='none'"/>` : `<div style="width:100%;aspect-ratio:${ar};background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.3);font-size:14px">Sin imagen</div>`}
    </div>
    ${data.caption ? `<p style="text-align:center;margin-top:16px;font-size:13px;color:rgba(255,255,255,0.45)">${_e(data.caption)}</p>` : ''}
  </div>
</section>`;
}

function _renderGaleria(data, pal) {
  const imgs = Array.isArray(data.images) ? data.images : [];
  const cols = Math.min(imgs.length, parseInt(data.columns) || 3);
  const imgHtml = imgs.map(img => `
    <div style="border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.4)">
      ${img.url ? `<img src="${_e(img.url)}" alt="${_e(img.caption||'')}" style="width:100%;aspect-ratio:${data.ratio||'4/3'};object-fit:cover;display:block" onerror="this.style.display='none'"/>` : `<div style="width:100%;aspect-ratio:${data.ratio||'4/3'};background:rgba(255,255,255,0.05)"></div>`}
      ${img.caption ? `<p style="font-size:12px;color:rgba(255,255,255,0.4);padding:10px;text-align:center">${_e(img.caption)}</p>` : ''}
    </div>`).join('');
  return `
<section id="ld-galeria-${Math.random().toString(36).slice(2,5)}" class="ld-section-sm">
  <div class="ld-inner">
    ${data.title ? `<h2 class="ld-h2" style="text-align:center;margin-bottom:12px">${_e(data.title)}</h2>` : ''}
    ${data.subtitle ? `<p class="ld-body" style="text-align:center;margin-bottom:40px;max-width:640px;margin-left:auto;margin-right:auto">${_e(data.subtitle)}</p>` : ''}
    <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:20px">${imgHtml}</div>
  </div>
</section>`;
}

// ──────────────────────────────────────────────────────────
// MAIN RENDERER
// ──────────────────────────────────────────────────────────
function renderBlock(type, data, pal) {
  const fn = {
    nav:        _renderNav,
    hero:       _renderHero,
    para_quien: _renderParaQuien,
    problema:   _renderProblema,
    metricas:   _renderMetricas,
    beneficios: _renderBeneficios,
    modulos:    _renderModulos,
    testimonios:_renderTestimonios,
    bonos:      _renderBonos,
    stack:      _renderStack,
    garantia:   _renderGarantia,
    faq:        _renderFaq,
    cta_final:  _renderCtaFinal,
    footer:     _renderFooter,
    imagen:     _renderImagen,
    galeria:    _renderGaleria,
  }[type];
  return fn ? fn(data || {}, pal) : '';
}

function renderLandingFromBlocks(blocks, paletteId, customFrom, customTo) {
  const palBase = _palById(paletteId);
  const pal = {
    from: customFrom || palBase.from,
    to:   customTo   || palBase.to,
  };
  const htmlBlocks = (blocks || [])
    .filter(b => b && !b.disabled && !b.hidden)
    .map(b => renderBlock(b.type, b.data, pal))
    .join('\n');
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Landing</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined" rel="stylesheet">
<style>${_baseCss(pal)}</style>
</head>
<body>
${htmlBlocks}
</body>
</html>`;
}

// Build a default blocks array from schemas
function buildDefaultBlocks(brief) {
  return BLOCK_ORDER.map(type => ({
    id: `ld-${type}-${Math.random().toString(36).slice(2,6)}`,
    type,
    hidden: false,
    data: JSON.parse(JSON.stringify(BLOCK_DEFAULTS[type] || {}))
  }));
}

// ──────────────────────────────────────────────────────────
// BLOCK FIELD DEFINITIONS (for the editor UI)
// ──────────────────────────────────────────────────────────
const BLOCK_FIELDS = {
  nav: [
    { key: 'logo', label: 'Nombre / logo', type: 'text' },
    { key: 'links', label: 'Links de navegación (uno por línea)', type: 'list-simple' },
    { key: 'cta_text', label: 'Texto del botón CTA', type: 'text' },
    { key: 'cta_href', label: 'URL del botón CTA', type: 'text' },
  ],
  hero: [
    { key: 'badge', label: 'Badge superior (ej: "🚀 Lanzamiento · Junio 2026")', type: 'text' },
    { key: 'headline', label: 'Titular principal', type: 'textarea' },
    { key: 'headline_gradient', label: 'Parte del titular en gradiente (opcional)', type: 'text' },
    { key: 'subheadline', label: 'Subtítulo', type: 'textarea' },
    { key: 'cta_text', label: 'Texto del botón principal', type: 'text' },
    { key: 'cta_href', label: 'URL del botón', type: 'text' },
    { key: 'image_url', label: 'Imagen del hero', type: 'image' },
    { key: 'image_size', label: 'Tamaño de la imagen', type: 'select', options: [
      { value: 'grande',   label: 'Grande — mitad del hero (50%)' },
      { value: 'mediano',  label: 'Mediano — 38% del ancho' },
      { value: 'pequeno',  label: 'Pequeño — 26% del ancho' },
      { value: 'centrado', label: 'Centrado — ancho completo, debajo del texto' },
    ]},
    { key: 'image_ratio', label: 'Proporción de la imagen', type: 'select', options: [
      { value: '4/3',  label: 'Clásica (4:3)' },
      { value: '16/9', label: 'Video / ancho (16:9)' },
      { value: '1/1',  label: 'Cuadrada (1:1)' },
      { value: '3/4',  label: 'Retrato / vertical (3:4)' },
    ]},
    { key: 'social_proof_count', label: 'Número de social proof (ej: "+2,400")', type: 'text' },
    { key: 'social_proof_label', label: 'Texto de social proof (ej: "alumnos ya transformaron sus finanzas")', type: 'text' },
    { key: 'microcopy', label: 'Microcopy bajo el botón', type: 'text' },
  ],
  para_quien: [
    { key: 'for_headline', label: 'Título columna "Para vos si"', type: 'text' },
    { key: 'for_items', label: 'Ítems "Para vos si" (uno por línea)', type: 'list-simple' },
    { key: 'not_for_headline', label: 'Título columna "No es para vos"', type: 'text' },
    { key: 'not_for_items', label: 'Ítems "No es para vos" (uno por línea)', type: 'list-simple' },
  ],
  problema: [
    { key: 'headline', label: 'Titular de la sección', type: 'text' },
    { key: 'subheadline', label: 'Subtítulo', type: 'textarea' },
    { key: 'items', label: 'Pain points', type: 'list-icon-text', iconDefault: 'sentiment_dissatisfied' },
  ],
  metricas: [
    { key: 'headline', label: 'Titular de la sección (opcional)', type: 'text' },
    { key: 'items', label: 'Métricas (valor + etiqueta)', type: 'list-value-label' },
  ],
  beneficios: [
    { key: 'headline', label: 'Titular', type: 'text' },
    { key: 'subheadline', label: 'Subtítulo', type: 'textarea' },
    { key: 'items', label: 'Beneficios (ícono + texto)', type: 'list-icon-text', iconDefault: 'check_circle' },
  ],
  modulos: [
    { key: 'headline', label: 'Titular', type: 'text' },
    { key: 'subheadline', label: 'Subtítulo', type: 'textarea' },
    { key: 'items', label: 'Módulos', type: 'list-module' },
  ],
  testimonios: [
    { key: 'headline', label: 'Titular', type: 'text' },
    { key: 'items', label: 'Testimonios', type: 'list-testimonio' },
  ],
  bonos: [
    { key: 'headline', label: 'Titular', type: 'text' },
    { key: 'subheadline', label: 'Subtítulo (opcional)', type: 'text' },
    { key: 'items', label: 'Bonos', type: 'list-bono' },
  ],
  stack: [
    { key: 'headline', label: 'Titular', type: 'text' },
    { key: 'items', label: 'Ítems del stack (nombre + valor tachado)', type: 'list-value-label' },
    { key: 'total_value', label: 'Valor total (tachado)', type: 'text' },
    { key: 'current_price', label: 'Precio actual', type: 'text' },
    { key: 'savings', label: 'Mensaje de ahorro (ej: "Ahorrás $300")', type: 'text' },
  ],
  garantia: [
    { key: 'days', label: 'Días de garantía', type: 'text' },
    { key: 'headline', label: 'Titular de la garantía', type: 'text' },
    { key: 'text', label: 'Descripción de la garantía', type: 'textarea' },
  ],
  faq: [
    { key: 'headline', label: 'Titular', type: 'text' },
    { key: 'items', label: 'Preguntas y respuestas', type: 'list-qa' },
  ],
  cta_final: [
    { key: 'headline', label: 'Titular final', type: 'textarea' },
    { key: 'subheadline', label: 'Subtítulo', type: 'textarea' },
    { key: 'cta_text', label: 'Texto del botón', type: 'text' },
    { key: 'cta_href', label: 'URL del botón (Hotmart, etc.)', type: 'text' },
    { key: 'original_price', label: 'Precio original (tachado)', type: 'text' },
    { key: 'price', label: 'Precio actual', type: 'text' },
    { key: 'urgency', label: 'Mensaje de urgencia', type: 'text' },
    { key: 'microcopy', label: 'Microcopy bajo el botón', type: 'text' },
  ],
  footer: [
    { key: 'brand', label: 'Nombre de la marca', type: 'text' },
    { key: 'tagline', label: 'Tagline (opcional)', type: 'text' },
    { key: 'links', label: 'Links legales (texto + URL)', type: 'list-link' },
    { key: 'copyright', label: 'Copyright (dejar vacío para autogenerar)', type: 'text' },
  ],
  imagen: [
    { key: 'title', label: 'Título (opcional)', type: 'text' },
    { key: 'subtitle', label: 'Subtítulo (opcional)', type: 'textarea' },
    { key: 'image_url', label: 'Imagen', type: 'image' },
    { key: 'caption', label: 'Pie de foto (opcional)', type: 'text' },
    { key: 'image_size', label: 'Tamaño', type: 'select',
      options: [
        { value: 'natural',  label: 'Natural — respeta el tamaño original' },
        { value: 'wide',     label: 'Banner ancho (100%, recortada 16:7)' },
        { value: 'medium',   label: 'Mediana (65%, recortada 16:9)' },
        { value: 'small',    label: 'Pequeña (40%, recortada 4:3)' },
        { value: 'portrait', label: 'Retrato (30%, recortada 3:4)' },
      ]
    },
  ],
  galeria: [
    { key: 'title', label: 'Título (opcional)', type: 'text' },
    { key: 'subtitle', label: 'Subtítulo (opcional)', type: 'textarea' },
    { key: 'columns', label: 'Imágenes por fila (2 o 3)', type: 'text' },
    { key: 'ratio', label: 'Proporción de imágenes (ej: 4/3, 1/1, 3/4)', type: 'text' },
    { key: 'images', label: 'Imágenes (URL + pie de foto)', type: 'list-image' },
  ],
};

const BLOCK_LABELS = {
  nav:         'Navegación',
  hero:        'Hero principal',
  para_quien:  'Para quién es',
  problema:    'Problema / Dolor',
  metricas:    'Métricas / Resultados',
  beneficios:  'Beneficios',
  modulos:     'Módulos / Contenido',
  testimonios: 'Testimonios',
  bonos:       'Bonos',
  stack:       'Stack de valor',
  garantia:    'Garantía',
  faq:         'FAQ',
  cta_final:   'CTA Final',
  footer:      'Footer',
  imagen:      'Imagen',
  galeria:     'Galería de imágenes',
};

const BLOCK_ICONS = {
  nav:         'menu',
  hero:        'web_asset',
  para_quien:  'people',
  problema:    'sentiment_dissatisfied',
  metricas:    'bar_chart',
  beneficios:  'check_circle',
  modulos:     'layers',
  testimonios: 'format_quote',
  bonos:       'workspace_premium',
  stack:       'receipt_long',
  garantia:    'verified_user',
  faq:         'help',
  cta_final:   'rocket_launch',
  footer:      'web',
  imagen:      'image',
  galeria:     'photo_library',
};

// Expose globals
if (typeof window !== 'undefined') {
  window.LANDING_PALETTES_DEF = LANDING_PALETTES_DEF;
  window.BLOCK_DEFAULTS = BLOCK_DEFAULTS;
  window.BLOCK_ORDER = BLOCK_ORDER;
  window.BLOCK_FIELDS = BLOCK_FIELDS;
  window.BLOCK_LABELS = BLOCK_LABELS;
  window.BLOCK_ICONS = BLOCK_ICONS;
  window.renderBlock = renderBlock;
  window.renderLandingFromBlocks = renderLandingFromBlocks;
  window.buildDefaultBlocks = buildDefaultBlocks;
}
