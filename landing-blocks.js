// landing-blocks.js — Block-based landing renderer for Luminous Studio
// v1.0 — 2026-06-02

// ──────────────────────────────────────────────────────────
// PALETTES
// ──────────────────────────────────────────────────────────
// LANDING_PALETTES_DEF: array format for the UI (id, name, primary=from, accent=to)
// bg: fondo del body | surface: fondo de cards | fg: color de texto principal | mode: 'dark'|'light'
const LANDING_PALETTES_DEF = [
  // ── OSCURAS (dark) ──────────────────────────────────────
  { id: 'blue-purple',    name: 'Azul → Púrpura',      primary: '#2E5BFF', accent: '#7c3aed', bg: '#09090b', surface: 'rgba(255,255,255,0.04)', fg: '#ffffff', mode: 'dark' },
  { id: 'green-teal',     name: 'Verde → Teal',         primary: '#059669', accent: '#0891b2', bg: '#09090b', surface: 'rgba(255,255,255,0.04)', fg: '#ffffff', mode: 'dark' },
  { id: 'orange-rose',    name: 'Naranja → Rosa',       primary: '#ea580c', accent: '#e11d48', bg: '#0c0a09', surface: 'rgba(255,255,255,0.04)', fg: '#ffffff', mode: 'dark' },
  { id: 'gold-amber',     name: 'Dorado → Ámbar',       primary: '#d97706', accent: '#b45309', bg: '#0c0a00', surface: 'rgba(255,255,255,0.04)', fg: '#ffffff', mode: 'dark' },
  { id: 'violet-indigo',  name: 'Violeta → Índigo',     primary: '#7c3aed', accent: '#4338ca', bg: '#09090b', surface: 'rgba(255,255,255,0.04)', fg: '#ffffff', mode: 'dark' },
  { id: 'rose-fuchsia',   name: 'Rosa → Fucsia',        primary: '#e11d48', accent: '#a21caf', bg: '#0d0509', surface: 'rgba(255,255,255,0.04)', fg: '#ffffff', mode: 'dark' },
  { id: 'teal-cyan',      name: 'Teal → Cyan',          primary: '#0891b2', accent: '#06b6d4', bg: '#030d12', surface: 'rgba(255,255,255,0.04)', fg: '#ffffff', mode: 'dark' },
  { id: 'midnight-navy',  name: 'Medianoche → Marino',  primary: '#3b82f6', accent: '#1e40af', bg: '#05080f', surface: 'rgba(255,255,255,0.04)', fg: '#ffffff', mode: 'dark' },
  { id: 'emerald-dark',   name: 'Esmeralda oscuro',     primary: '#10b981', accent: '#065f46', bg: '#030d08', surface: 'rgba(255,255,255,0.04)', fg: '#ffffff', mode: 'dark' },
  { id: 'charcoal-gold',  name: 'Carbón → Dorado',      primary: '#f59e0b', accent: '#d97706', bg: '#111110', surface: 'rgba(255,255,255,0.05)', fg: '#ffffff', mode: 'dark' },

  // ── TIERRA Y CÁLIDAS (light/warm) ───────────────────────
  { id: 'tierra-cafe',    name: 'Tierra → Café',        primary: '#92400e', accent: '#78350f', bg: '#fdf6ee', surface: 'rgba(0,0,0,0.04)',     fg: '#1c0a00', mode: 'light' },
  { id: 'nude-rose',      name: 'Nude → Rosa palo',     primary: '#c2856d', accent: '#9d5c4a', bg: '#fdf4f0', surface: 'rgba(0,0,0,0.04)',     fg: '#2c1810', mode: 'light' },
  { id: 'crema-dorado',   name: 'Crema → Dorado',       primary: '#b5832a', accent: '#8a6120', bg: '#fffbf0', surface: 'rgba(0,0,0,0.04)',     fg: '#1a1000', mode: 'light' },
  { id: 'terracota',      name: 'Terracota → Coral',    primary: '#c2533a', accent: '#9b3a28', bg: '#fef3ee', surface: 'rgba(0,0,0,0.04)',     fg: '#1a0800', mode: 'light' },
  { id: 'madera-sage',    name: 'Madera → Sage',        primary: '#7c6f5b', accent: '#6b8f71', bg: '#f9f6f2', surface: 'rgba(0,0,0,0.04)',     fg: '#1c1a16', mode: 'light' },
  { id: 'arena-tostada',  name: 'Arena → Tostado',      primary: '#a0845c', accent: '#7d6344', bg: '#faf7f2', surface: 'rgba(0,0,0,0.04)',     fg: '#1c1508', mode: 'light' },
  { id: 'naranja-tierra', name: 'Naranja tierra → Óxido', primary: '#c45c1a', accent: '#9c3d10', bg: '#fef5ee', surface: 'rgba(0,0,0,0.04)',   fg: '#1e0e00', mode: 'light' },
  { id: 'verde-tierra',   name: 'Verde tierra → Oliva',   primary: '#5a7a35', accent: '#3d5c20', bg: '#f5f8f0', surface: 'rgba(0,0,0,0.04)',   fg: '#101e04', mode: 'light' },

  // ── SUAVES Y PASTELES (light/soft) ──────────────────────
  { id: 'lavanda-lila',   name: 'Lavanda → Lila',       primary: '#7c5cbf', accent: '#9d7ce0', bg: '#faf8ff', surface: 'rgba(0,0,0,0.04)',     fg: '#1a0f2e', mode: 'light' },
  { id: 'sage-verde',     name: 'Sage → Verde suave',   primary: '#5a8f6a', accent: '#3d6e50', bg: '#f5faf6', surface: 'rgba(0,0,0,0.04)',     fg: '#0f2018', mode: 'light' },
  { id: 'dusty-rose',     name: 'Rosa polvo → Malva',   primary: '#b06080', accent: '#8a4060', bg: '#fff8f9', surface: 'rgba(0,0,0,0.04)',     fg: '#2a0a18', mode: 'light' },
  { id: 'azul-sereno',    name: 'Azul sereno → Cielo',  primary: '#3a78b5', accent: '#2563a0', bg: '#f5f9ff', surface: 'rgba(0,0,0,0.04)',     fg: '#0a1a30', mode: 'light' },
  { id: 'menta-aqua',     name: 'Menta → Aqua',         primary: '#2a9e8f', accent: '#1e7b6e', bg: '#f2faf9', surface: 'rgba(0,0,0,0.04)',     fg: '#082820', mode: 'light' },
  { id: 'blanco-clasico', name: 'Blanco clásico',        primary: '#1d2b3a', accent: '#3b5268', bg: '#ffffff', surface: 'rgba(0,0,0,0.04)',     fg: '#0d1520', mode: 'light' },
  { id: 'gris-perla',     name: 'Gris perla → Plata',   primary: '#4a5568', accent: '#2d3748', bg: '#f8f9fa', surface: 'rgba(0,0,0,0.04)',     fg: '#1a202c', mode: 'light' },
  { id: 'chocolate-miel', name: 'Chocolate → Miel',     primary: '#7b3f00', accent: '#c47f17', bg: '#fdf8f0', surface: 'rgba(0,0,0,0.04)',     fg: '#1a0a00', mode: 'light' },

  // ── SÓLIDOS / PLANOS ────────────────────────────────────
  { id: 'solido-negro',   name: 'Negro puro',            primary: '#e5e5e5', accent: '#a3a3a3', bg: '#0a0a0a', surface: 'rgba(255,255,255,0.06)', fg: '#ffffff', mode: 'dark',  solid: true },
  { id: 'solido-blanco',  name: 'Blanco puro',           primary: '#1a1a1a', accent: '#404040', bg: '#ffffff', surface: 'rgba(0,0,0,0.05)',     fg: '#0a0a0a', mode: 'light', solid: true },
  { id: 'solido-rojo',    name: 'Rojo',                  primary: '#dc2626', accent: '#b91c1c', bg: '#0a0a0a', surface: 'rgba(255,255,255,0.05)', fg: '#ffffff', mode: 'dark',  solid: true },
  { id: 'solido-azul',    name: 'Azul',                  primary: '#2563eb', accent: '#1d4ed8', bg: '#030712', surface: 'rgba(255,255,255,0.05)', fg: '#ffffff', mode: 'dark',  solid: true },
  { id: 'solido-verde',   name: 'Verde',                 primary: '#16a34a', accent: '#15803d', bg: '#030a05', surface: 'rgba(255,255,255,0.05)', fg: '#ffffff', mode: 'dark',  solid: true },
  { id: 'solido-morado',  name: 'Morado',                primary: '#9333ea', accent: '#7e22ce', bg: '#0a0212', surface: 'rgba(255,255,255,0.05)', fg: '#ffffff', mode: 'dark',  solid: true },
  { id: 'solido-naranja', name: 'Naranja',               primary: '#ea580c', accent: '#c2410c', bg: '#0c0500', surface: 'rgba(255,255,255,0.05)', fg: '#ffffff', mode: 'dark',  solid: true },
  { id: 'solido-rosa',    name: 'Rosa',                  primary: '#ec4899', accent: '#db2777', bg: '#0d020a', surface: 'rgba(255,255,255,0.05)', fg: '#ffffff', mode: 'dark',  solid: true },
  { id: 'solido-cafe',    name: 'Café',                  primary: '#92400e', accent: '#78350f', bg: '#08040a', surface: 'rgba(255,255,255,0.05)', fg: '#ffffff', mode: 'dark',  solid: true },
];

// Internal palette lookup by id (from, to, bg, fg, mode)
function _palById(id) {
  const p = LANDING_PALETTES_DEF.find(x => x.id === id) || LANDING_PALETTES_DEF[0];
  return {
    from:    p.primary,
    to:      p.accent,
    bg:      p.bg      || '#09090b',
    surface: p.surface || 'rgba(255,255,255,0.04)',
    fg:      p.fg      || '#ffffff',
    mode:    p.mode    || 'dark',
  };
}

// Derive text color helpers based on mode
function _fgMain(pal)  { return pal.fg || '#ffffff'; }
function _fgMuted(pal) { return pal.mode === 'light' ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.65)'; }
function _fgDim(pal)   { return pal.mode === 'light' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.4)'; }
function _cardBg(pal)  { return pal.surface || 'rgba(255,255,255,0.04)'; }
function _borderCol(pal){ return pal.mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)'; }

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
    video_url: '',
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
    columns: '3',
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
    gallery_size: 'full',
    columns: '4',
    ratio: '1/1',
    images: [
      { url: '', caption: '', span: '2', rowspan: '2', ratio: '4/3' },
      { url: '', caption: '', span: '1', rowspan: '1', ratio: '1/1' },
      { url: '', caption: '', span: '1', rowspan: '1', ratio: '1/1' },
      { url: '', caption: '', span: '1', rowspan: '1', ratio: '1/1' },
      { url: '', caption: '', span: '1', rowspan: '1', ratio: '1/1' },
      { url: '', caption: '', span: '1', rowspan: '1', ratio: '1/1' },
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

// Sanitize rich text from the contentEditable editor (execCommand output).
// Allows: <br>, <b>/<i>/<strong>/<em>, <span style="safe-props">, <font color/face>.
// Normalizes <font> → <span style> for consistent rendering.
// Escapes everything else (scripts, event handlers, unknown tags).
function _safeHtml(str) {
  if (!str) return '';
  str = String(str);

  // If the string looks like double-escaped HTML (e.g. &lt;span...) unescape it first
  // so the tokenizer can process the actual tags
  if (/&lt;[a-zA-Z]/.test(str) && !/<[a-zA-Z]/.test(str)) {
    str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
  }

  // Plain text (no HTML) → escape and convert newlines to <br>
  if (!/<[a-zA-Z]/i.test(str)) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  }

  // contentEditable wraps new lines in <div> — normalize to <br>
  str = str.replace(/<div><br\s*\/?><\/div>/gi, '<br>');
  str = str.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, function(m, inner) { return inner + '<br>'; });
  str = str.replace(/\n/g, '<br>');

  // CSS properties we allow in span style
  const SAFE_PROPS = /^(color|background-color|font-size|font-family|font-weight|font-style|text-decoration|letter-spacing|line-height)$/;
  function cleanStyle(style) {
    return style.split(';').map(function(decl) {
      const ci = decl.indexOf(':'); if (ci < 0) return '';
      const prop = decl.slice(0, ci).trim().toLowerCase();
      const val  = decl.slice(ci + 1).trim();
      if (!SAFE_PROPS.test(prop)) return '';
      if (/expression|javascript:|url\(|<|>/i.test(val)) return '';
      return prop + ':' + val;
    }).filter(Boolean).join(';');
  }

  // Tokenize: replace safe tags with placeholders, escape the rest
  const tokens = [];
  str = str
    .replace(/&amp;/g, '\x00AMP\x00').replace(/&lt;/g, '\x00LT\x00').replace(/&gt;/g, '\x00GT\x00')
    .replace(/&/g, '\x00AMP\x00')
    .replace(/<br\s*\/?>/gi, '\x00BR\x00')
    // b / i / strong / em (open & close, any attrs ignored)
    .replace(/<\/?(b|i|strong|em)\b[^>]*>/gi, function(m) {
      const cl = m.match(/<\/?\s*([a-zA-Z]+)/)[1].toLowerCase();
      const closing = m.startsWith('</');
      const tok = '\x00TAG' + tokens.length + '\x00';
      tokens.push('<' + (closing ? '/' : '') + cl + '>');
      return tok;
    })
    // span with style
    .replace(/<span\b[^>]*>/gi, function(m) {
      const sm = m.match(/style\s*=\s*["']([^"']*)["']/i);
      const cs = sm ? cleanStyle(sm[1]) : '';
      const tok = '\x00TAG' + tokens.length + '\x00';
      tokens.push(cs ? '<span style="' + cs + '">' : '<span>');
      return tok;
    })
    .replace(/<\/span>/gi, function() {
      const tok = '\x00TAG' + tokens.length + '\x00';
      tokens.push('</span>');
      return tok;
    })
    // <font color="X" face="Y"> → convert to <span style>
    .replace(/<font\b[^>]*>/gi, function(m) {
      const cm = m.match(/color\s*=\s*["']?([^"'\s>]+)["']?/i);
      const fm = m.match(/face\s*=\s*["']([^"']*)["']/i);
      const sm = m.match(/style\s*=\s*["']([^"']*)["']/i);
      const parts = [];
      if (cm) parts.push('color:' + cm[1]);
      if (fm) parts.push('font-family:' + fm[1]);
      if (sm) { const cs = cleanStyle(sm[1]); if (cs) parts.push(cs); }
      const tok = '\x00TAG' + tokens.length + '\x00';
      tokens.push(parts.length ? '<span style="' + parts.join(';') + '">' : '<span>');
      return tok;
    })
    .replace(/<\/font>/gi, function() {
      const tok = '\x00TAG' + tokens.length + '\x00';
      tokens.push('</span>');
      return tok;
    });

  // Escape any remaining unrecognized tags
  str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Restore placeholders
  str = str
    .replace(/\x00AMP\x00/g, '&amp;').replace(/\x00LT\x00/g, '&lt;').replace(/\x00GT\x00/g, '&gt;')
    .replace(/\x00BR\x00/g, '<br>')
    .replace(/\x00TAG(\d+)\x00/g, function(m, i) { return tokens[+i]; });
  return str;
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
const FONT_DEFS = {
  'jakarta':  { name:'Plus Jakarta Sans', family:"'Plus Jakarta Sans',system-ui,sans-serif", url:"Plus+Jakarta+Sans:wght@300;400;500;600;700;800" },
  'inter':    { name:'Inter',             family:"'Inter',system-ui,sans-serif",             url:"Inter:wght@300;400;500;600;700;800" },
  'playfair': { name:'Playfair Display',  family:"'Playfair Display',Georgia,serif",         url:"Playfair+Display:wght@400;700;800" },
  'lato':     { name:'Lato',             family:"'Lato',system-ui,sans-serif",              url:"Lato:wght@300;400;700;900" },
  'dancing':  { name:'Dancing Script',   family:"'Dancing Script',cursive",                 url:"Dancing+Script:wght@400;600;700" },
  'greatvibes':{ name:'Great Vibes',     family:"'Great Vibes',cursive",                    url:"Great+Vibes" },
};

const TYPO_SCALES = {
  'sm':  { h1:'clamp(28px,4vw,52px)',   h2:'clamp(22px,2.8vw,40px)', h3:'clamp(16px,1.8vw,24px)', body:'16px' },
  'md':  { h1:'clamp(38px,5.5vw,76px)', h2:'clamp(30px,3.8vw,56px)', h3:'clamp(20px,2.2vw,30px)', body:'18px' },
  'lg':  { h1:'clamp(48px,6.5vw,96px)', h2:'clamp(38px,4.5vw,68px)', h3:'clamp(24px,2.6vw,36px)', body:'20px' },
};

const SPACING_SCALES = {
  'compact': { section:'64px 0',  sectionSm:'40px 0', inner:'0 20px' },
  'normal':  { section:'100px 0', sectionSm:'60px 0', inner:'0 28px' },
  'airy':    { section:'140px 0', sectionSm:'84px 0', inner:'0 36px' },
};

function _baseCss(pal, font, settings) {
  const isLight = pal.mode === 'light';
  const bg      = pal.bg      || (isLight ? '#ffffff' : '#09090b');
  const fg      = pal.fg      || (isLight ? '#111111' : '#ffffff');
  const muted   = _fgMuted(pal);
  const dim     = _fgDim(pal);
  const card    = _cardBg(pal);
  const border  = _borderCol(pal);
  const cardHov = isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)';
  const navBg   = isLight ? 'rgba(255,255,255,0.92)' : 'rgba(9,9,11,0.88)';
  const darkCard = isLight ? 'rgba(0,0,0,0.06)' : '#111113';
  return `
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:${(FONT_DEFS[font]||FONT_DEFS['jakarta']).family};background:${bg};color:${fg};overflow-x:hidden;-webkit-font-smoothing:antialiased}
a{text-decoration:none;color:inherit}
img{max-width:100%;height:auto;display:block;border-radius:12px}
.material-symbols-outlined{font-family:'Material Symbols Outlined';font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24;font-style:normal;line-height:1;letter-spacing:normal;text-transform:none;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased}

/* Gradient utilities */
.grad-bg{${_gradBg(pal)}}
.grad-text{${_gradText(pal)}}
.grad-border{border:1px solid transparent;background-clip:padding-box;position:relative}

/* Layout */
${(() => { const sp = SPACING_SCALES[(settings&&settings.spacing)||'normal'] || SPACING_SCALES.normal; return `.ld-inner{max-width:1180px;margin:0 auto;padding:${sp.inner}}\n.ld-section{padding:${sp.section}}\n.ld-section-sm{padding:${sp.sectionSm}}`; })()}

/* Typography */
${(() => { const ts = TYPO_SCALES[(settings&&settings.typoScale)||'md'] || TYPO_SCALES.md; return `.ld-h1{font-size:${ts.h1};font-weight:800;line-height:1.06;letter-spacing:-0.025em}\n.ld-h2{font-size:${ts.h2};font-weight:800;line-height:1.1;letter-spacing:-0.02em}\n.ld-h3{font-size:${ts.h3};font-weight:700;line-height:1.2;letter-spacing:-0.01em}\n.ld-body{font-size:${ts.body};line-height:1.75;color:${muted}}`; })()}
.ld-small{font-size:13px;color:${dim};letter-spacing:0.01em}
.ld-label{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${dim}}
.ld-section-tag{display:inline-flex;align-items:center;gap:8px;padding:8px 20px;border-radius:999px;background:${isLight?'rgba(255,255,255,0.75)':'rgba(255,255,255,0.07)'};border:1px solid ${border};font-size:13px;font-weight:600;margin-bottom:24px;backdrop-filter:blur(10px);box-shadow:0 2px 12px rgba(0,0,0,0.1)}

/* Glass Cards */
.ld-card{
  background:${isLight ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.04)'};
  border:1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.09)'};
  border-radius:22px;padding:28px;
  backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
  box-shadow:${isLight ? '0 4px 24px rgba(0,0,0,0.07),inset 0 1px 0 rgba(255,255,255,0.9)' : '0 4px 32px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.07)'};
  transition:transform 0.25s cubic-bezier(.34,1.56,.64,1),box-shadow 0.25s,border-color 0.25s;
  position:relative;overflow:hidden;
}
.ld-card::before{content:'';position:absolute;inset:0;border-radius:inherit;background:linear-gradient(135deg,rgba(255,255,255,${isLight?'0.4':'0.04'}) 0%,transparent 60%);pointer-events:none}
.ld-card:hover{transform:translateY(-4px) scale(1.01);box-shadow:${isLight ? '0 16px 40px rgba(0,0,0,0.12),inset 0 1px 0 rgba(255,255,255,0.95)' : '0 16px 48px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1)'};border-color:${isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.14)'}}
.ld-card-dark{background:${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.4)'};border:1px solid ${border};border-radius:22px;padding:28px;backdrop-filter:blur(12px)}

/* Buttons */
.ld-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:18px 36px;border-radius:14px;font-weight:700;font-size:17px;cursor:pointer;transition:all 0.2s cubic-bezier(.34,1.56,.64,1);border:none;color:#fff;letter-spacing:-0.01em;${_gradBg(pal)};box-shadow:0 4px 28px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.2)}
.ld-btn:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 12px 40px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.25)}
.ld-btn:active{transform:translateY(-1px) scale(0.99)}
.ld-btn-lg{font-size:19px;padding:22px 48px;border-radius:16px}
.ld-btn-outline{background:${isLight?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.06)'};border:1.5px solid ${border};color:${fg};box-shadow:none;backdrop-filter:blur(8px)}
.ld-btn-outline:hover{border-color:${_fgMuted(pal)};background:${isLight?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.1)'}}

/* Nav */
#ld-nav{background:${navBg};box-shadow:0 1px 0 ${border}}
@media(max-width:768px){
  #ld-nav-cta{display:none!important}
  #ld-nav-ham{display:flex!important}
  .ld-nav-links{display:none!important}
}

/* Grids */
.ld-g2{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.ld-g3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.ld-g4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.ld-flex{display:flex;align-items:center;gap:16px}
.ld-flex-col{display:flex;flex-direction:column;gap:12px}
.ld-center{text-align:center;display:flex;flex-direction:column;align-items:center}

/* Divider */
.ld-hr{height:1px;background:${border};margin:0 28px}

/* FAQ — glass style */
details.ld-faq{background:${isLight?'rgba(255,255,255,0.6)':'rgba(255,255,255,0.03)'};backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid ${border};border-radius:18px;overflow:hidden;margin-bottom:10px;transition:background 0.2s,box-shadow 0.2s}
details.ld-faq[open]{background:${isLight?'rgba(255,255,255,0.85)':'rgba(255,255,255,0.06)'};box-shadow:0 8px 32px rgba(0,0,0,0.12)}
details.ld-faq summary{padding:20px 24px;font-weight:700;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;list-style:none;user-select:none}
details.ld-faq summary::-webkit-details-marker{display:none}
details.ld-faq summary:hover{background:rgba(${_hexToRgb(pal.from)},0.06);border-radius:16px}
details.ld-faq summary::after{content:'▾';font-size:22px;color:${pal.from};opacity:0.7;transition:transform 0.35s cubic-bezier(.34,1.56,.64,1),opacity 0.2s}
details.ld-faq[open] summary::after{transform:rotate(180deg);opacity:1}
details.ld-faq .faq-body{padding:0 24px 22px;color:${muted};font-size:15px;line-height:1.8;animation:faqOpen 0.25s ease}
@keyframes faqOpen{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}

/* Animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes floatOrb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-20px) scale(1.08)}}
@keyframes cardFloat{0%,100%{transform:translateY(0px)}50%{transform:translateY(-7px)}}
@keyframes shimmerMove{0%{transform:translateX(-120%) skewX(-15deg)}100%{transform:translateX(350%) skewX(-15deg)}}
@keyframes aurora{
  0%{background-position:0% 50%}
  33%{background-position:100% 20%}
  66%{background-position:40% 100%}
  100%{background-position:0% 50%}
}
.ld-animate{opacity:0}

/* Metric counter animation */
@keyframes countUp{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
.ld-metric-val{animation:countUp 0.5s ease both}

/* Ambient glow orbs */
.ld-orb{position:fixed;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0;animation:floatOrb 12s ease-in-out infinite}
body>*:not(.ld-orb){position:relative;z-index:1}

/* Glass Cards — with shimmer sweep + float */
.ld-card{
  background:${isLight
    ? `linear-gradient(135deg, rgba(${_hexToRgb(pal.from)},0.13) 0%, rgba(255,255,255,0.82) 45%, rgba(${_hexToRgb(pal.to)},0.10) 100%)`
    : 'rgba(255,255,255,0.05)'};
  border:1px solid ${isLight ? `rgba(${_hexToRgb(pal.from)},0.22)` : 'rgba(255,255,255,0.1)'};
  border-radius:22px;padding:28px;
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  box-shadow:${isLight
    ? `0 8px 32px rgba(${_hexToRgb(pal.from)},0.12), 0 1px 0 rgba(255,255,255,0.95) inset, 0 -1px 0 rgba(${_hexToRgb(pal.from)},0.1) inset`
    : '0 4px 32px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.08)'};
  transition:transform 0.3s cubic-bezier(.34,1.56,.64,1),box-shadow 0.3s,border-color 0.3s;
  position:relative;overflow:hidden;
  animation:cardFloat var(--float-dur,6s) ease-in-out infinite;
  animation-delay:var(--float-delay,0s);
}
.ld-card::before{
  content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  background:linear-gradient(135deg,rgba(255,255,255,${isLight?'0.55':'0.06'}) 0%,transparent 55%);
}
.ld-card::after{
  content:'';position:absolute;top:0;left:0;width:35%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,${isLight?'0.35':'0.07'}),transparent);
  animation:shimmerMove 5s ease-in-out infinite;
  animation-delay:var(--shimmer-delay,0s);
  pointer-events:none;border-radius:inherit;
}
.ld-card:hover{
  transform:translateY(-6px) scale(1.02);
  animation-play-state:paused;
  box-shadow:${isLight
    ? `0 24px 48px rgba(${_hexToRgb(pal.from)},0.2), 0 1px 0 rgba(255,255,255,1) inset`
    : '0 20px 56px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.12)'};
  border-color:${isLight ? `rgba(${_hexToRgb(pal.from)},0.35)` : 'rgba(255,255,255,0.18)'}
}
.ld-card-dark{background:${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.4)'};border:1px solid ${border};border-radius:22px;padding:28px;backdrop-filter:blur(12px)}

/* Aurora animated card */
.ld-aurora-card{
  background:linear-gradient(-45deg,
    rgba(${_hexToRgb(pal.from)},${isLight?'0.22':'0.18'}) 0%,
    ${isLight?'rgba(255,255,255,0.78)':'rgba(18,18,22,0.6)'} 35%,
    rgba(${_hexToRgb(pal.to)},${isLight?'0.18':'0.16'}) 70%,
    rgba(${_hexToRgb(pal.from)},${isLight?'0.12':'0.10'}) 100%
  );
  background-size:350% 350%;
  animation:aurora 9s ease infinite, cardFloat var(--float-dur,7s) ease-in-out infinite;
  animation-delay:0s, var(--float-delay,0s);
  border:1px solid ${isLight?`rgba(${_hexToRgb(pal.from)},0.28)`:`rgba(${_hexToRgb(pal.from)},0.3)`};
  border-radius:22px;
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  box-shadow:${isLight
    ? `0 8px 32px rgba(${_hexToRgb(pal.from)},0.16), inset 0 1px 0 rgba(255,255,255,0.9)`
    : `0 4px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`};
  transition:transform 0.3s cubic-bezier(.34,1.56,.64,1),box-shadow 0.3s;
  position:relative;overflow:hidden;
}
.ld-aurora-card::after{
  content:'';position:absolute;top:0;left:0;width:35%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,${isLight?'0.4':'0.08'}),transparent);
  animation:shimmerMove 6s ease-in-out infinite;
  animation-delay:var(--shimmer-delay,1s);
  pointer-events:none;
}
.ld-aurora-card:hover{
  transform:translateY(-6px) scale(1.015);
  animation-play-state:paused,paused;
  box-shadow:${isLight
    ? `0 24px 48px rgba(${_hexToRgb(pal.from)},0.24), inset 0 1px 0 rgba(255,255,255,1)`
    : `0 20px 52px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)`};
}

/* Aurora section bg */
.ld-aurora{
  background:linear-gradient(-45deg,
    ${pal.bg||'#09090b'},
    rgba(${_hexToRgb(pal.from)},${isLight?'0.55':'0.45'}),
    rgba(${_hexToRgb(pal.to)},${isLight?'0.45':'0.35'}),
    ${pal.bg||'#09090b'},
    rgba(${_hexToRgb(pal.from)},${isLight?'0.35':'0.25'})
  );
  background-size:400% 400%;
  animation:aurora 14s ease infinite;
}

/* Stack table */
.ld-table{width:100%;border-collapse:separate;border-spacing:0}
.ld-table tr{border-bottom:1px solid ${border}}
.ld-table td{padding:14px 0;font-size:15px}
.ld-table .ld-table-name{color:${muted}}
.ld-table .ld-table-val{text-align:right;font-weight:600;text-decoration:line-through;color:${dim};font-size:14px}
.ld-table-total{border-top:2px solid ${border}!important;font-weight:800;font-size:18px}

/* Metrics grid (responsive via CSS var) */
.ld-metrics-grid{display:grid;gap:16px;grid-template-columns:repeat(var(--mcols,3),1fr)}
@media(max-width:640px){.ld-metrics-grid{grid-template-columns:repeat(2,1fr)!important}}
@media(max-width:400px){.ld-metrics-grid{grid-template-columns:1fr!important}}

/* Responsive — tablet (900px) */
@media(max-width:900px){
  .ld-section{padding:72px 0}
  .ld-section-sm{padding:48px 0}
  .ld-g4{grid-template-columns:repeat(2,1fr)}
  .ld-hero-cols{gap:40px!important}
}
/* Responsive — iPad (768px) */
@media(max-width:768px){
  .ld-h1{font-size:clamp(30px,6vw,50px)!important}
  .ld-h2{font-size:clamp(24px,5vw,38px)!important}
  .ld-hero-cols{flex-direction:column!important;gap:28px!important}
  .ld-hero-cols > *{width:100%!important;max-width:100%!important;flex:none!important}
  .ld-g3{grid-template-columns:repeat(2,1fr)!important}
  .ld-tgrid{grid-template-columns:repeat(2,1fr)!important}
  .ld-nav-links{display:none!important}
  #ld-nav-ham{display:flex!important}
  .ld-btn-lg{font-size:17px!important;padding:18px 32px!important}
  .ld-section{padding:64px 0}
}
/* Responsive — mobile (640px) */
@media(max-width:640px){
  .ld-inner{padding:0 16px}
  .ld-h1{font-size:clamp(26px,8vw,36px)!important}
  .ld-h2{font-size:clamp(22px,7vw,30px)!important}
  .ld-h3{font-size:18px!important}
  .ld-body{font-size:16px}
  .ld-section{padding:52px 0}
  .ld-section-sm{padding:36px 0}
  .ld-g2,.ld-g3,.ld-g4,.ld-tgrid{grid-template-columns:1fr!important}
  .ld-hero-cols{flex-direction:column!important;gap:28px!important}
  .ld-hero-cols > *{order:unset!important;width:100%!important;max-width:100%!important;flex:none!important}
  .ld-nav-links{display:none!important}
  #ld-nav-ham{display:flex!important}
  .ld-btn-lg{font-size:16px!important;padding:16px 24px!important;width:100%;justify-content:center;line-height:1.3}
  .ld-btn{font-size:15px!important;padding:14px 22px!important;line-height:1.3}
  .ld-card{padding:20px}
  .ld-orb{display:none}
}
${isLight ? `
/* Light mode: alternating section tints for visual separation */
.ld-section:nth-child(even){background:rgba(0,0,0,0.025)}
.ld-section-sm:nth-child(even){background:rgba(0,0,0,0.025)}
` : ''}
`;
}

// ──────────────────────────────────────────────────────────
// SECTION RENDERERS
// ──────────────────────────────────────────────────────────

// Guard: AI sometimes returns a string/object instead of an array
function _arr(v) { return Array.isArray(v) ? v : []; }

// Returns inline style overrides from data._style object
function _blockStyle(data) {
  if (!data || !data._style) return '';
  const s = data._style;
  const parts = [];
  if (s.text_align) parts.push(`text-align:${s.text_align}`);
  if (s.padding === 'compact') parts.push('padding-top:48px;padding-bottom:48px');
  if (s.padding === 'spacious') parts.push('padding-top:160px;padding-bottom:160px');
  if (s.font && FONT_DEFS[s.font]) parts.push(`font-family:${FONT_DEFS[s.font].family}`);
  if (s.bg_color) parts.push(`background-color:${s.bg_color}`);
  // Cursive fonts should render at weight 400
  const cursiveFonts = ['dancing', 'greatvibes'];
  if (s.font && cursiveFonts.includes(s.font)) parts.push('font-weight:400');
  return parts.length ? parts.join(';') + ';' : '';
}

// Returns title size + font family style for headings
function _titleStyle(data) {
  if (!data || !data._style) return '';
  const s = data._style;
  const parts = [];
  const sizes = { xs:'22px', sm:'32px', lg:'64px', xl:'88px' };
  if (s.title_size && sizes[s.title_size]) parts.push(`font-size:${sizes[s.title_size]}!important`);
  if (s.font && FONT_DEFS[s.font]) parts.push(`font-family:${FONT_DEFS[s.font].family}`);
  // Cursive fonts should render at weight 400
  const cursiveFonts = ['dancing', 'greatvibes'];
  if (s.font && cursiveFonts.includes(s.font)) parts.push('font-weight:400!important');
  return parts.length ? parts.join(';') + ';' : '';
}

function _renderNav(data, pal) {
  // Map nav link text to correct section IDs (text can be in any language/case)
  function _navAnchor(text) {
    var s = text.toLowerCase().replace(/[áéíóú]/g,function(c){return {á:'a',é:'e',í:'i',ó:'o',ú:'u'}[c]||c;}).replace(/[^a-z0-9]+/g,'');
    var m = {paraquien:'para_quien',paraquienes:'para_quien',paraqueien:'para_quien',problema:'problema',dolor:'problema',metricas:'metricas',resultados:'metricas',beneficios:'beneficios',modulos:'modulos',temario:'modulos',contenido:'modulos',testimonios:'testimonios',clientes:'testimonios',bonos:'bonos',stack:'stack',incluye:'stack',garantia:'garantia',faq:'faq',preguntas:'faq',cta:'cta_final',comenzar:'cta_final',empezar:'cta_final'};
    return '#ld-' + (m[s] || s.replace(/\s+/g,'-'));
  }
  const links = _arr(data.links).map(l =>
    `<a href="${_navAnchor(l)}" style="font-size:14px;font-weight:600;color:${_fgMuted(pal)};transition:color 0.2s" onmouseover="this.style.color='${_fgMain(pal)}'" onmouseout="this.style.color='${_fgMuted(pal)}'">${_e(l)}</a>`
  ).join('');
  const hamLineColor = _fgMain(pal);
  const mobBg = pal.mode === 'light' ? (pal.bg || '#ffffff') : 'rgba(9,9,11,0.97)';
  return `
<nav id="ld-nav" style="position:sticky;top:0;z-index:100;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid ${_borderCol(pal)}">
  <div class="ld-inner" style="height:64px;display:flex;align-items:center;gap:20px;min-width:0">
    <div style="display:flex;align-items:center;gap:8px;flex-shrink:1;min-width:0;overflow:hidden">
      ${data.logo_img ? `<img src="${_e(data.logo_img)}" alt="${_e(data.logo||'Logo')}" style="height:32px;max-width:120px;object-fit:contain;flex-shrink:0">` : ''}
      <span style="font-weight:800;font-size:18px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;${_gradText(pal)}">${_e(data.logo || 'Mi Brand')}</span>
    </div>
    <div class="ld-nav-links" style="flex:1;display:flex;gap:24px;justify-content:center;min-width:0">${links}</div>
    <button id="ld-nav-ham" onclick="var m=document.getElementById('ld-nav-mobile');var open=m.style.display==='flex';m.style.display=open?'none':'flex';this.querySelector('.ham-label').textContent=open?'Menú':'Cerrar'" style="display:none;flex-direction:row;align-items:center;gap:5px;padding:8px 12px;background:${_cardBg(pal)};border:1px solid ${_borderCol(pal)};border-radius:10px;cursor:pointer;flex-shrink:0;white-space:nowrap">
      <div style="display:flex;flex-direction:column;gap:3px;width:15px;flex-shrink:0">
        <div style="height:2px;background:${hamLineColor};border-radius:2px"></div>
        <div style="height:2px;background:${hamLineColor};border-radius:2px"></div>
        <div style="height:2px;background:${hamLineColor};border-radius:2px"></div>
      </div>
      <span class="ham-label" style="font-size:12px;font-weight:700;color:${hamLineColor}">Menú</span>
    </button>
    <a id="ld-nav-cta" href="${_e(data.cta_href||'#ld-cta_final')}" class="ld-btn" style="padding:10px 20px;font-size:13px;border-radius:10px;flex-shrink:0;${_gradBg(pal)}">${_safeHtml(data.cta_text||'Comenzar')}</a>
  </div>
</nav>
<div id="ld-nav-mobile" style="display:none;flex-direction:column;gap:0;background:${mobBg};border-bottom:1px solid ${_borderCol(pal)};padding:8px 0;position:sticky;top:64px;z-index:99">
  ${_arr(data.links).map(l => `<a href="${_navAnchor(l)}" onclick="document.getElementById('ld-nav-mobile').style.display='none'" style="display:block;padding:14px 24px;font-size:15px;font-weight:600;color:${_fgMuted(pal)};border-bottom:1px solid ${_borderCol(pal)}">${_e(l)}</a>`).join('')}
  <div style="padding:12px 16px"><a href="${_e(data.cta_href||'#ld-cta_final')}" class="ld-btn" style="width:100%;justify-content:center;${_gradBg(pal)}">${_safeHtml(data.cta_text||'Comenzar')}</a></div>
</div>`;
}

function _renderHero(data, pal) {
  const headline = data.headline_gradient
    ? `${_safeHtml(data.headline)} <span style="${_gradText(pal)}">${_e(data.headline_gradient)}</span>`
    : `<span style="${_gradText(pal)}">${_safeHtml(data.headline)}</span>`;

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
        <span style="font-size:13px;color:${_fgMuted(pal)}"><strong style="color:#fff">${_safeHtml(data.social_proof_count)}</strong> ${_safeHtml(data.social_proof_label)}</span>
       </div>`
    : '';
  // mesh grid overlay for premium look
  const meshSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(${_hexToRgb(pal.from)},0.07)' stroke-width='1'/%3E%3C/svg%3E")`;
  const videoBg = data.video_url
    ? `<video autoplay muted loop playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.45;z-index:0" src="${_e(data.video_url)}"></video><div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);z-index:1"></div>`
    : '';
  return `
<section id="ld-hero" style="padding:90px 0 72px;overflow:hidden;position:relative;${data.video_url ? '' : 'background-image:' + meshSvg + ';background-size:60px 60px;'}${_blockStyle(data)}">
  ${videoBg}
  <div class="ld-inner" style="position:relative;z-index:2">
    ${data.badge ? `<div style="display:inline-flex;align-items:center;gap:8px;padding:7px 18px;border-radius:999px;${_gradBg(pal)};font-size:12px;font-weight:700;letter-spacing:0.06em;margin-bottom:32px;box-shadow:0 4px 20px rgba(${_hexToRgb(pal.from)},0.4)">${_safeHtml(data.badge)}</div>` : ''}
    ${heroCols}
      <div style="${sz==='centrado'?'max-width:720px':'flex:1;min-width:0'}">
        <h1 class="ld-h1" style="margin-bottom:22px;${_titleStyle(data)}">${headline}</h1>
        <p class="ld-body" style="font-size:19px;margin-bottom:40px;max-width:580px">${_safeHtml(data.subheadline)}</p>
        <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center${sz==='centrado'?';justify-content:center':''}">
          <a href="${_e(data.cta_href||'#ld-cta_final')}" class="ld-btn ld-btn-lg">${_icon('bolt',22,'#fff')} ${_safeHtml(data.cta_text||'Comenzar ahora')}</a>
        </div>
        ${socialProof}
        ${data.microcopy ? `<p class="ld-small" style="margin-top:16px">${_safeHtml(data.microcopy)}</p>` : ''}
      </div>
      ${imgCol ? imgCol.replace('border-radius:24px', `border-radius:24px;box-shadow:0 32px 80px rgba(${_hexToRgb(pal.from)},0.25),0 8px 32px rgba(0,0,0,0.5)`) : ''}
    </div>
  </div>
</section>`;
}

function _renderParaQuien(data, pal) {
  const forItems = _arr(data.for_items).filter(Boolean).map(t =>
    `<li style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:15px;color:${_fgMuted(pal)}">
      <span style="${_gradText(pal)};flex-shrink:0">${_icon('check_circle',20)}</span> ${_e(t)}
     </li>`).join('');
  const notForItems = _arr(data.not_for_items).filter(Boolean).map(t =>
    `<li style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:15px;color:${_fgMuted(pal)}">
      <span style="color:#ef4444;flex-shrink:0">${_icon('cancel',20)}</span> ${_e(t)}
     </li>`).join('');
  return `
<section id="ld-para_quien" class="ld-section" style="background:rgba(${_hexToRgb(pal.from)},0.04);${_blockStyle(data)}">
  <div class="ld-inner">
    <div class="ld-g2">
      <div class="ld-card">
        <h3 class="ld-h3" style="margin-bottom:20px">${_safeHtml(data.for_headline||'Esta formación ES para vos si…')}</h3>
        <ul style="list-style:none">${forItems}</ul>
      </div>
      <div class="ld-card" style="background:rgba(239,68,68,0.04);border-color:rgba(239,68,68,0.15)">
        <h3 class="ld-h3" style="margin-bottom:20px;color:${_fgMuted(pal)}">${_safeHtml(data.not_for_headline||'NO es para vos si…')}</h3>
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
      <p style="font-size:15px;line-height:1.65;color:${_fgMuted(pal)};padding-top:10px">${_e(item.text)}</p>
     </div>`).join('');
  return `
<section id="ld-problema" class="ld-section" style="background:linear-gradient(to bottom,transparent,rgba(239,68,68,0.04) 30%,rgba(239,68,68,0.04) 70%,transparent);${_blockStyle(data)}">
  <div class="ld-inner">
    <div class="ld-center" style="margin-bottom:56px">
      ${data.headline ? `<h2 class="ld-h2" style="${_titleStyle(data)}">${_safeHtml(data.headline)}</h2>` : ''}
      ${data.subheadline ? `<p class="ld-body" style="margin-top:16px;max-width:640px">${_safeHtml(data.subheadline)}</p>` : ''}
    </div>
    <div class="ld-g2">${items}</div>
  </div>
</section>`;
}

function _renderMetricas(data, pal) {
  const items = _arr(data.items).filter(i=>i&&i.value).map((item, idx) => {
    const numMatch = String(item.value).match(/([0-9]+(?:[.,][0-9]+)?)/);
    const numVal = numMatch ? numMatch[1].replace(',','.') : null;
    const prefix = numMatch ? String(item.value).slice(0, numMatch.index) : '';
    const suffix = numMatch ? String(item.value).slice(numMatch.index + numMatch[0].length) : '';
    const countAttr = numVal ? ` data-count="${numVal}" data-prefix="${_e(prefix)}" data-suffix="${_e(suffix)}"` : '';
    return `<div class="ld-aurora-card ld-center ld-animate" style="padding:40px 24px;animation-delay:${idx*0.08}s;animation-play-state:paused">
      <div class="ld-metric-val ld-h1"${countAttr} style="${_gradText(pal)}">${_e(item.value)}</div>
      <div style="margin-top:10px;font-size:15px;font-weight:600;color:${_fgDim(pal)};text-align:center">${_e(item.label)}</div>
     </div>`;
  }).join('');
  const cols = Math.min(4, _arr(data.items).filter(i=>i&&i.value).length);
  return `
<section id="ld-metricas" class="ld-section-sm" style="background:linear-gradient(135deg,rgba(${_hexToRgb(pal.from)},0.06) 0%,rgba(${_hexToRgb(pal.to)},0.04) 100%);${_blockStyle(data)}">
  <div class="ld-inner">
    ${data.headline ? `<div class="ld-center" style="margin-bottom:40px"><h2 class="ld-h2">${_safeHtml(data.headline)}</h2></div>` : ''}
    <div class="ld-metrics-grid" style="--mcols:${cols}">${items}</div>
  </div>
</section>`;
}

function _renderBeneficios(data, pal) {
  const items = _arr(data.items).filter(i=>i&&(i.title||i.text)).map(item =>
    `<div class="ld-card" style="display:flex;flex-direction:column;gap:16px">
      <div style="width:52px;height:52px;border-radius:16px;${_gradBg(pal)};display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 8px 24px rgba(${_hexToRgb(pal.from)},0.35)">
        ${_icon(item.icon||'check_circle', 26, '#fff')}
      </div>
      <div>
        <h3 style="font-size:17px;font-weight:700;margin-bottom:10px">${_e(item.title||item.text)}</h3>
        ${item.description ? `<p style="font-size:14px;line-height:1.7;color:${_fgMuted(pal)}">${_e(item.description)}</p>` : ''}
      </div>
     </div>`).join('');
  return `
<section id="ld-beneficios" class="ld-section" style="${_blockStyle(data)}">
  <div class="ld-inner">
    <div class="ld-center" style="margin-bottom:56px">
      ${data.headline ? `<h2 class="ld-h2" style="${_titleStyle(data)}">${_safeHtml(data.headline)}</h2>` : ''}
      ${data.subheadline ? `<p class="ld-body" style="margin-top:16px;max-width:640px">${_safeHtml(data.subheadline)}</p>` : ''}
    </div>
    <div class="ld-g3">${items}</div>
    ${data.image_url ? (()=>{const wMap={small:'40%',medium:'65%',full:'100%'};const w=wMap[data.image_url_size||'full']||'100%';return `<div style="margin:40px auto 0;width:${w};border-radius:20px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,0.4)"><img src="${_e(data.image_url)}" style="width:100%;height:auto;display:block" onerror="this.closest('div').style.display='none'"/></div>`;})() : ''}
  </div>
</section>`;
}

function _renderModulos(data, pal) {
  const items = _arr(data.items).filter(i=>i&&i.title).map((item, idx) =>
    `<div class="ld-card" style="display:flex;gap:20px">
      <div style="font-size:40px;font-weight:800;${_gradText(pal)};flex-shrink:0;line-height:1;padding-top:2px">${_e(item.number||String(idx+1).padStart(2,'0'))}</div>
      <div style="min-width:0">
        <h3 style="font-size:18px;font-weight:700;margin-bottom:8px">${_e(item.title)}</h3>
        <p style="font-size:14px;line-height:1.65;color:${_fgMuted(pal)};margin-bottom:14px">${_e(item.description)}</p>
        ${_arr(item.chips).filter(Boolean).length ? `<div style="display:flex;flex-wrap:wrap;gap:6px">${_arr(item.chips).filter(Boolean).map(c=>`<span style="padding:4px 10px;border-radius:6px;background:rgba(255,255,255,0.07);font-size:11px;font-weight:600">${_e(c)}</span>`).join('')}</div>` : ''}
      </div>
     </div>`).join('');
  return `
<section id="ld-modulos" class="ld-section" style="background:rgba(255,255,255,0.015);${_blockStyle(data)}">
  <div class="ld-inner">
    <div class="ld-center" style="margin-bottom:56px">
      ${data.headline ? `<h2 class="ld-h2" style="${_titleStyle(data)}">${_safeHtml(data.headline)}</h2>` : ''}
      ${data.subheadline ? `<p class="ld-body" style="margin-top:16px;max-width:640px">${_safeHtml(data.subheadline)}</p>` : ''}
    </div>
    <div class="ld-g2">${items}</div>
    ${data.image_url ? (()=>{const wMap={small:'40%',medium:'65%',full:'100%'};const w=wMap[data.image_url_size||'full']||'100%';return `<div style="margin:40px auto 0;width:${w};border-radius:20px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,0.4)"><img src="${_e(data.image_url)}" style="width:100%;height:auto;display:block" onerror="this.closest('div').style.display='none'"/></div>`;})() : ''}
  </div>
</section>`;
}

function _renderTestimonios(data, pal) {
  const items = _arr(data.items).filter(i=>i&&i.text).map(item => {
    const initials = item.initials || (item.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    return `
    <div class="ld-aurora-card" style="display:flex;flex-direction:column;gap:16px;padding:28px">
      ${item.result ? `<div style="padding:8px 14px;border-radius:8px;${_gradBg(pal)};font-size:13px;font-weight:700;display:inline-block;align-self:flex-start;box-shadow:0 4px 16px rgba(${_hexToRgb(pal.from)},0.3)">${_e(item.result)}</div>` : ''}
      <p style="font-size:15px;line-height:1.75;color:${_fgMuted(pal)};flex:1;font-style:italic">"${_e(item.text)}"</p>
      <div style="display:flex;align-items:center;gap:12px;padding-top:12px;border-top:1px solid ${_borderCol(pal)}">
        <div style="width:40px;height:40px;border-radius:50%;${_gradBg(pal)};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;flex-shrink:0">${_e(initials)}</div>
        <div>
          <div style="font-weight:700;font-size:14px">${_e(item.name)}</div>
          ${item.role ? `<div style="font-size:12px;color:${_fgDim(pal)}">${_e(item.role)}</div>` : ''}
        </div>
      </div>
     </div>`;
  }).join('');
  const tcols = Math.min(Math.max(parseInt(data.columns) || 3, 1), 4);
  return `
<section id="ld-testimonios" class="ld-section" style="background:linear-gradient(135deg,rgba(${_hexToRgb(pal.from)},0.06) 0%,transparent 50%,rgba(${_hexToRgb(pal.to)},0.06) 100%);${_blockStyle(data)}">
  <div class="ld-inner">
    <div class="ld-center" style="margin-bottom:56px">
      <h2 class="ld-h2" style="${_titleStyle(data)}">${_safeHtml(data.headline||'Lo que dicen nuestros alumnos')}</h2>
    </div>
    <div class="ld-tgrid" style="display:grid;grid-template-columns:repeat(${tcols},1fr);gap:20px;align-items:stretch">${items}</div>
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
        <p style="font-size:14px;line-height:1.6;color:${_fgMuted(pal)};margin-bottom:8px">${_e(item.description||item.desc||'')}</p>
        ${item.value ? `<p style="font-size:13px;color:${_fgDim(pal)}">Valor: <span style="text-decoration:line-through">${_e(item.value)}</span></p>` : ''}
      </div>
      <div style="position:absolute;top:-20px;right:-20px;width:80px;height:80px;border-radius:50%;${_gradBg(pal)};opacity:0.08"></div>
     </div>`).join('');
  return `
<section id="ld-bonos" class="ld-section" style="background:linear-gradient(180deg,rgba(${_hexToRgb(pal.from)},0.07) 0%,transparent 100%);${_blockStyle(data)}">
  <div class="ld-inner">
    <div class="ld-center" style="margin-bottom:56px">
      <div class="ld-section-tag">${_icon('workspace_premium',16)} <span>Bonos exclusivos</span></div>
      <h2 class="ld-h2">${_safeHtml(data.headline||'Además, cuando te inscribís hoy recibís:')}</h2>
      ${data.subheadline ? `<p class="ld-body" style="margin-top:16px;max-width:640px">${_safeHtml(data.subheadline)}</p>` : ''}
    </div>
    <div class="ld-flex-col">${items}</div>
    ${data.image_url ? (()=>{const wMap={small:'40%',medium:'65%',full:'100%'};const w=wMap[data.image_url_size||'full']||'100%';return `<div style="margin:40px auto 0;width:${w};border-radius:20px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,0.4)"><img src="${_e(data.image_url)}" style="width:100%;height:auto;display:block" onerror="this.closest('div').style.display='none'"/></div>`;})() : ''}
  </div>
</section>`;
}

function _renderStack(data, pal) {
  const rows = _arr(data.items).filter(i=>i&&(i.name||i.label)).map(item =>
    `<tr><td class="ld-table-name">${_icon('check',18,pal.from)} ${_e(item.name||item.label)}</td><td class="ld-table-val">${_e(item.value)}</td></tr>`
  ).join('');
  return `
<section id="ld-stack" class="ld-section-sm" style="background:rgba(255,255,255,0.02);${_blockStyle(data)}">
  <div class="ld-inner">
    <div class="ld-card" style="max-width:680px;margin:0 auto;padding:40px">
      <h2 class="ld-h3" style="margin-bottom:32px;text-align:center">${_e(data.headline||'Todo lo que recibís hoy:')}</h2>
      <table class="ld-table"><tbody>${rows}</tbody></table>
      <div style="margin-top:24px;padding-top:20px;border-top:2px solid rgba(255,255,255,0.1)">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:15px;color:${_fgMuted(pal)}">Valor total</span>
          <span style="font-size:15px;text-decoration:line-through;color:${_fgDim(pal)}">${_e(data.total_value||'')}</span>
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
<section id="ld-garantia" class="ld-section-sm" style="${_blockStyle(data)}">
  <div class="ld-inner">
    <div class="ld-card ld-center" style="max-width:680px;margin:0 auto;padding:52px 40px;background:rgba(34,197,94,0.04);border-color:rgba(34,197,94,0.15)">
      <div style="width:80px;height:80px;border-radius:50%;background:rgba(34,197,94,0.12);display:flex;align-items:center;justify-content:center;margin-bottom:24px">
        ${_icon('verified_user', 40, '#4ade80')}
      </div>
      <div style="font-size:64px;font-weight:800;${_gradText(pal)};line-height:1;margin-bottom:4px">${_e(data.days||'30')}</div>
      <div style="font-size:14px;font-weight:700;color:${_fgDim(pal)};letter-spacing:0.08em;text-transform:uppercase;margin-bottom:24px">días de garantía</div>
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
<section id="ld-faq" class="ld-section" style="background:rgba(${_hexToRgb(pal.from)},0.03);${_blockStyle(data)}">
  <div class="ld-inner">
    <div class="ld-center" style="margin-bottom:48px">
      <h2 class="ld-h2">${_safeHtml(data.headline||'Preguntas frecuentes')}</h2>
    </div>
    <div style="max-width:740px;margin:0 auto">${items}</div>
  </div>
</section>`;
}

function _renderCtaFinal(data, pal) {
  const isDark = pal.mode !== 'light';
  return `
<section id="ld-cta_final" class="ld-section ld-aurora" style="overflow:hidden;position:relative;${_blockStyle(data)}">
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(${_hexToRgb(pal.from)},${isDark?'0.35':'0.18'}) 0%,transparent 70%);pointer-events:none"></div>
  <div class="ld-inner ld-center" style="position:relative;z-index:2">
    ${data.urgency ? `<div style="display:inline-flex;align-items:center;gap:8px;padding:8px 18px;border-radius:999px;background:rgba(239,68,68,0.14);border:1px solid rgba(239,68,68,0.25);font-size:13px;font-weight:700;color:#f87171;margin-bottom:24px">${_icon('timer',16,'#f87171')} ${_e(data.urgency)}</div>` : ''}
    <h2 class="ld-h2" style="margin-bottom:16px;max-width:720px">${_safeHtml(data.headline)}</h2>
    ${data.subheadline ? `<p class="ld-body" style="margin-bottom:32px;max-width:560px">${_safeHtml(data.subheadline)}</p>` : ''}
    <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:28px">
      ${data.original_price ? `<p style="font-size:15px;text-decoration:line-through;color:${_fgDim(pal)}">Antes: ${_e(data.original_price)}</p>` : ''}
      ${data.price ? `<div class="ld-h2" style="${_gradText(pal)}">${_e(data.price)}</div>` : ''}
    </div>
    <a href="${_e(data.cta_href||'#')}" class="ld-btn ld-btn-lg" style="width:auto;font-size:20px;padding:22px 52px">${_icon('bolt',24,'#fff')} ${_safeHtml(data.cta_text||'Comenzar ahora')}</a>
    ${data.microcopy ? `<p class="ld-small" style="margin-top:16px">${_safeHtml(data.microcopy)}</p>` : ''}
  </div>
</section>`;
}

function _renderFooter(data, pal) {
  const links = _arr(data.links).filter(l=>l&&(l.text||l.href)).map(l =>
    `<a href="${_e(l.href||'#')}" style="font-size:13px;color:${_fgDim(pal)};transition:color 0.2s" onmouseover="this.style.color='rgba(255,255,255,0.7)'" onmouseout="this.style.color='rgba(255,255,255,0.4)'">${_e(l.text)}</a>`
  ).join('');
  return `
<footer id="ld-footer" style="border-top:1px solid rgba(255,255,255,0.07);padding:48px 0 32px;${_blockStyle(data)}">
  <div class="ld-inner">
    <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;margin-bottom:24px">
      <div>
        <div style="font-weight:800;font-size:17px;${_gradText(pal)};margin-bottom:4px">${_e(data.brand||'Mi Brand')}</div>
        ${data.tagline ? `<p style="font-size:13px;color:${_fgDim(pal)}">${_e(data.tagline)}</p>` : ''}
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
<section id="ld-imagen-${Math.random().toString(36).slice(2,5)}" class="ld-section-sm" style="${_blockStyle(data)}">
  <div class="ld-inner" style="display:flex;flex-direction:column;align-items:center">
    ${data.title ? `<h2 class="ld-h2" style="text-align:center;margin-bottom:16px">${_safeHtml(data.title)}</h2>` : ''}
    ${data.subtitle ? `<p class="ld-body" style="text-align:center;margin-bottom:32px;max-width:700px">${_safeHtml(data.subtitle)}</p>` : ''}
    ${data.image_url ? `<img src="${_e(data.image_url)}" alt="${_e(data.caption||'')}" style="max-width:100%;height:auto;border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,0.45);display:block" onerror="this.style.display='none'"/>` : `<div style="width:300px;height:200px;background:rgba(255,255,255,0.05);border-radius:16px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.3);font-size:14px">Sin imagen</div>`}
    ${data.caption ? `<p style="text-align:center;margin-top:12px;font-size:13px;color:${_fgDim(pal)}">${_e(data.caption)}</p>` : ''}
  </div>
</section>`;
  }
  const wMap  = {wide:'100%', medium:'65%', small:'40%', portrait:'30%', square:'40%'};
  const arMap = {wide:'16/7', medium:'16/9', small:'4/3',  portrait:'3/4', square:'1/1'};
  const w  = wMap[sz]  || '100%';
  const ar = arMap[sz] || '16/7';
  return `
<section id="ld-imagen-${Math.random().toString(36).slice(2,5)}" class="ld-section-sm" style="${_blockStyle(data)}">
  <div class="ld-inner">
    ${data.title ? `<h2 class="ld-h2" style="text-align:center;margin-bottom:16px">${_safeHtml(data.title)}</h2>` : ''}
    ${data.subtitle ? `<p class="ld-body" style="text-align:center;margin-bottom:32px;max-width:700px;margin-left:auto;margin-right:auto">${_safeHtml(data.subtitle)}</p>` : ''}
    <div style="margin:0 auto;width:${w};border-radius:20px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.5)">
      ${data.image_url ? `<img src="${_e(data.image_url)}" alt="${_e(data.caption||'')}" style="width:100%;aspect-ratio:${ar};object-fit:cover;display:block" onerror="this.style.display='none'"/>` : `<div style="width:100%;aspect-ratio:${ar};background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.3);font-size:14px">Sin imagen</div>`}
    </div>
    ${data.caption ? `<p style="text-align:center;margin-top:16px;font-size:13px;color:${_fgDim(pal)}">${_e(data.caption)}</p>` : ''}
  </div>
</section>`;
}

function _renderGaleria(data, pal) {
  const imgs = Array.isArray(data.images) ? data.images : [];
  const cols = Math.max(parseInt(data.columns) || 2, 1);
  const wMap = { full:'100%', large:'80%', medium:'60%', small:'40%' };
  const gw = wMap[data.gallery_size] || '100%';
  const defaultRatio = data.ratio || '1/1';
  const imgHtml = imgs.map(img => {
    const span = Math.min(parseInt(img.span) || 1, cols);
    const rowspan = parseInt(img.rowspan) || 1;
    const ratio = img.ratio || defaultRatio;
    const gridStyle = `grid-column:span ${span}${rowspan > 1 ? `;grid-row:span ${rowspan}` : ''}`;
    // Always use aspect-ratio — for rowspan images use a taller ratio (or user-set ratio)
    // The container is position:relative + padding-bottom trick is overkill; aspect-ratio CSS works fine
    const effectiveRatio = rowspan > 1 ? ratio : ratio;
    return `
    <div style="${gridStyle};border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.25)">
      ${img.url ? `<img src="${_e(img.url)}" alt="${_e(img.caption||'')}" style="width:100%;aspect-ratio:${effectiveRatio};object-fit:cover;display:block;height:100%" onerror="this.style.display='none'"/>` : `<div style="width:100%;aspect-ratio:${effectiveRatio};background:${_cardBg(pal)};min-height:120px"></div>`}
      ${img.caption ? `<p style="font-size:12px;color:${_fgDim(pal)};padding:8px 10px;text-align:center">${_e(img.caption)}</p>` : ''}
    </div>`;
  }).join('');
  return `
<section id="ld-galeria-${Math.random().toString(36).slice(2,5)}" class="ld-section-sm" style="${_blockStyle(data)}">
  <div class="ld-inner">
    ${data.title ? `<h2 class="ld-h2" style="text-align:center;margin-bottom:12px">${_safeHtml(data.title)}</h2>` : ''}
    ${data.subtitle ? `<p class="ld-body" style="text-align:center;margin-bottom:40px;max-width:640px;margin-left:auto;margin-right:auto">${_safeHtml(data.subtitle)}</p>` : ''}
    <div style="margin:0 auto;width:${gw}">
      <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:16px;align-items:start">${imgHtml}</div>
    </div>
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

function renderLandingFromBlocks(blocks, paletteId, customFrom, customTo, font, settings) {
  const palBase = _palById(paletteId);
  const pal = {
    ...palBase,
    from: customFrom || palBase.from,
    to:   customTo   || palBase.to,
  };
  const htmlBlocks = (blocks || [])
    .map((b, i) => b && !b.disabled && !b.hidden
      ? `<div data-bi="${i}">${renderBlock(b.type, b.data, pal)}</div>`
      : '')
    .join('\n');
  // Extra Google Fonts needed by per-block font overrides
  const blockFonts = [...new Set((blocks||[])
    .map(b => b.data && b.data._style && b.data._style.font)
    .filter(f => f && f !== font && FONT_DEFS[f])
  )].map(f => `<link href="https://fonts.googleapis.com/css2?family=${FONT_DEFS[f].url}&display=swap" rel="stylesheet">`).join('\n');
  // Always load every font offered by the inline text toolbar, so font-family
  // chosen on individual words renders correctly (not just the fallback).
  const toolbarFonts = '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;700;800&family=Lato:wght@300;400;700;900&family=Dancing+Script:wght@400;600;700&family=Great+Vibes&family=Montserrat:wght@300;400;600;700;800&family=Merriweather:wght@400;700;900&family=Oswald:wght@300;400;600;700&family=Pacifico&display=swap" rel="stylesheet">';
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Landing</title>
<link href="https://fonts.googleapis.com/css2?family=${(FONT_DEFS[font]||FONT_DEFS['jakarta']).url}&display=swap" rel="stylesheet">
${toolbarFonts}
${blockFonts}
<link href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined" rel="stylesheet">
<style>${_baseCss(pal, font, settings)}</style>
</head>
<body>
<div class="ld-orb" style="width:600px;height:600px;background:radial-gradient(circle,rgba(${_hexToRgb(pal.from)},0.18) 0%,transparent 70%);top:-200px;left:-150px;animation-duration:14s"></div>
<div class="ld-orb" style="width:500px;height:500px;background:radial-gradient(circle,rgba(${_hexToRgb(pal.to)},0.15) 0%,transparent 70%);bottom:10%;right:-100px;animation-duration:18s;animation-delay:-6s"></div>
${htmlBlocks}
<script>
// Assign random float/shimmer delays so cards don't all move in sync
(function(){
  var cards = document.querySelectorAll('.ld-card,.ld-aurora-card');
  cards.forEach(function(c, i){
    var floatDur = (5.5 + (i % 4) * 0.8).toFixed(1) + 's';
    var floatDelay = (-Math.random() * 5).toFixed(1) + 's';
    var shimmerDelay = (i * 1.3 % 7).toFixed(1) + 's';
    c.style.setProperty('--float-dur', floatDur);
    c.style.setProperty('--float-delay', floatDelay);
    c.style.setProperty('--shimmer-delay', shimmerDelay);
  });
})();
// Scroll-triggered fade-in with stagger
(function(){
  var els = document.querySelectorAll('.ld-animate,.ld-card,.ld-card-dark,section');
  if(!els.length) return;
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var delay = parseFloat(e.target.dataset.delay||0);
        setTimeout(function(){
          e.target.style.opacity='1';
          e.target.style.transform='none';
        }, delay * 1000);
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  // Stagger cards within same parent
  document.querySelectorAll('.ld-g2,.ld-g3,.ld-g4,.ld-metrics-grid').forEach(function(grid){
    Array.from(grid.children).forEach(function(child,i){
      child.dataset.delay = (i * 0.08).toFixed(2);
    });
  });
  els.forEach(function(el){
    el.style.opacity='0';
    el.style.transform='translateY(22px)';
    el.style.transition='opacity 0.65s cubic-bezier(.4,0,.2,1), transform 0.65s cubic-bezier(.4,0,.2,1)';
    obs.observe(el);
  });
  // Hero elements visible immediately
  document.querySelectorAll('#ld-hero *,#ld-nav').forEach(function(el){
    el.style.opacity='1'; el.style.transform='none';
  });
})();
// Animated metric counters
(function(){
  function animateCounter(el){
    var target = parseFloat(el.dataset.count || el.textContent.replace(/[^0-9.]/g,''));
    if(!target) return;
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || el.textContent.replace(/[0-9.,]/g,'').replace(prefix,'');
    var start = 0; var dur = 1400; var step = 16;
    var timer = setInterval(function(){
      start += step;
      var pct = Math.min(start/dur,1);
      var eased = 1-Math.pow(1-pct,3);
      var val = target * eased;
      el.textContent = prefix + (Number.isInteger(target) ? Math.round(val).toLocaleString() : val.toFixed(1)) + suffix;
      if(pct>=1) clearInterval(timer);
    },16);
  }
  var obs2 = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ animateCounter(e.target); obs2.unobserve(e.target); }
    });
  },{threshold:0.5});
  document.querySelectorAll('.ld-metric-val[data-count]').forEach(function(el){ obs2.observe(el); });
})();
// Responsive nav: JS fallback in case CSS media queries don't fire in iframe
(function(){
  function applyNavMode(){
    var w = window.innerWidth;
    var ham = document.getElementById('ld-nav-ham');
    var cta = document.getElementById('ld-nav-cta');
    var links = document.querySelector('.ld-nav-links');
    if(!ham) return;
    if(w <= 768){
      ham.style.display='flex';
      if(cta) cta.style.display='none';
      if(links) links.style.display='none';
    } else {
      ham.style.display='none';
      if(cta) cta.style.display='inline-flex';
      if(links) links.style.display='flex';
    }
  }
  applyNavMode();
  window.addEventListener('resize', applyNavMode);
})();
// navGuard: prevent links escaping iframe
document.querySelectorAll('a[href]').forEach(function(a){
  var h = a.getAttribute('href');
  if(h && h.startsWith('#')){ a.addEventListener('click',function(e){ e.preventDefault(); var t=document.querySelector(h); if(t) t.scrollIntoView({behavior:'smooth'}); }); }
  else if(h && !h.startsWith('mailto') && !h.startsWith('tel')){ a.target='_blank'; a.rel='noopener'; }
});
</script>
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
    { key: 'logo', label: 'Nombre del brand (si no hay imagen)', type: 'text' },
    { key: 'logo_img', label: 'Imagen del logo (URL o subir)', type: 'image' },
    { key: 'links', label: 'Links de navegación (uno por línea)', type: 'list-simple' },
    { key: 'cta_text', label: 'Texto del botón CTA', type: 'text' },
    { key: 'cta_href', label: 'URL del botón CTA', type: 'text' },
  ],
  hero: [
    { key: 'video_url', label: 'Video de fondo del hero (URL .mp4)', type: 'text' },
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
    { key: 'image_url', label: 'Imagen de la sección (opcional)', type: 'image' },
  ],
  modulos: [
    { key: 'headline', label: 'Titular', type: 'text' },
    { key: 'subheadline', label: 'Subtítulo', type: 'textarea' },
    { key: 'items', label: 'Módulos', type: 'list-module' },
    { key: 'image_url', label: 'Imagen de la sección (opcional)', type: 'image' },
  ],
  testimonios: [
    { key: 'headline', label: 'Titular', type: 'text' },
    { key: 'columns', label: 'Columnas del grid', type: 'select', options: ['2','3','4'] },
    { key: 'items', label: 'Testimonios', type: 'list-testimonio' },
  ],
  bonos: [
    { key: 'headline', label: 'Titular', type: 'text' },
    { key: 'subheadline', label: 'Subtítulo (opcional)', type: 'text' },
    { key: 'items', label: 'Bonos', type: 'list-bono' },
    { key: 'image_url', label: 'Imagen de la sección (opcional)', type: 'image' },
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
        { value: 'square',   label: 'Cuadrada (40%, recortada 1:1)' },
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
    { key: 'gallery_size', label: 'Tamaño de la galería', type: 'select',
      options: [
        { value: 'full',   label: 'Ancho completo (100%)' },
        { value: 'large',  label: 'Grande (80%)' },
        { value: 'medium', label: 'Mediana (60%)' },
        { value: 'small',  label: 'Pequeña (40%)' },
      ]
    },
    { key: 'columns', label: 'Columnas del grid', type: 'select',
      options: [
        { value: '2', label: '2 columnas' },
        { value: '3', label: '3 columnas' },
        { value: '4', label: '4 columnas' },
      ]
    },
    { key: 'ratio', label: 'Proporción por defecto', type: 'select',
      options: [
        { value: '1/1',  label: 'Cuadrada (1:1)' },
        { value: '4/3',  label: 'Clásica (4:3)' },
        { value: '16/9', label: 'Panorámica (16:9)' },
        { value: '3/4',  label: 'Retrato (3:4)' },
        { value: '3/2',  label: 'Foto (3:2)' },
      ]
    },
    { key: '_layout_preset', label: 'Preset de collage', type: 'layout-preset' },
    { key: 'images', label: 'Imágenes (ajustá tamaño y proporción por foto)', type: 'list-image' },
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
  window._palById = _palById;
  window.BLOCK_DEFAULTS = BLOCK_DEFAULTS;
  window.BLOCK_ORDER = BLOCK_ORDER;
  window.FONT_DEFS = FONT_DEFS;
  window.SPACING_SCALES = SPACING_SCALES;
  window.BLOCK_FIELDS = BLOCK_FIELDS;
  window.BLOCK_LABELS = BLOCK_LABELS;
  window.BLOCK_ICONS = BLOCK_ICONS;
  window.renderBlock = renderBlock;
  window.renderLandingFromBlocks = renderLandingFromBlocks;
  window.TYPO_SCALES = TYPO_SCALES;
  window.buildDefaultBlocks = buildDefaultBlocks;
}
