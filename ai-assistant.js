// ============================================================
// Luminous Studio — AI Assistant (HeyLloyd style)
// Ventana flotante arrastrable con modos, sesiones y voz
// ============================================================
(function () {
  'use strict';

  // ── Modos personalizados ──────────────────────────────────
  const MODES = [
    {
      id: 'general',
      label: 'General',
      icon: 'auto_awesome',
      prompt: `Eres Lloyd, el asistente de Luminous Studio. Ayudas a emprendedores digitales latinoamericanos con quizzes, marketing digital, infoproductos y la plataforma. Sé conciso, directo y práctico. Responde siempre en español.`
    },
    {
      id: 'quiz',
      label: 'Quiz Creator',
      icon: 'quiz',
      prompt: `Eres Lloyd, experto en crear quizzes de alta conversión para embudos de venta de infoproductos. Tu especialidad es diseñar preguntas de segmentación, perfiles de resultado irresistibles, títulos que generen curiosidad y CTAs que conviertan. Cuando te pidan un quiz, entrega: título, subtítulo, 5 preguntas con 3-4 opciones cada una, y 3 perfiles de resultado con nombre, descripción y recomendación de producto. Sé específico según el nicho. Responde en español.`
    },
    {
      id: 'oferta',
      label: 'Oferta & VSL',
      icon: 'sell',
      prompt: `Eres Lloyd, experto en crear ofertas irresistibles y scripts de VSL (Video Sales Letter) para infoproductos digitales en el mercado latinoamericano. Conoces a fondo la estructura de oferta de Alex Hormozi ($100M Offers): problema → mecanismo único → resultados → prueba social → stack de valor → garantía → precio anclado → CTA urgente. También dominas la estructura de VSL: gancho → historia → problema → solución → mecanismo → oferta → cierre. Cuando te pidan una oferta o VSL, entrega la estructura completa con ejemplos concretos. Responde en español.`
    },
    {
      id: 'carta',
      label: 'Carta de Ventas',
      icon: 'description',
      prompt: `Eres Lloyd, copywriter especialista en cartas de venta (sales letters) largas para infoproductos digitales en español. Dominas las estructuras clásicas: AIDA, PAS (Problema-Agitación-Solución), y la carta de ventas de Gary Halbert. Tu proceso: 1) Titular que para el scroll, 2) Gancho con historia o pregunta provocadora, 3) Identificación del dolor profundo, 4) Agitación: consecuencias de no actuar, 5) Presentación del mecanismo único, 6) Prueba social y resultados, 7) Descripción del producto/servicio, 8) Stack de bonos, 9) Garantía, 10) Precio con ancla, 11) CTA urgente con escasez. Cuando te pidan una carta, pide el nicho, el producto y el avatar. Luego entrega la carta completa sección por sección. Responde en español.`
    },
    {
      id: 'andromeda',
      label: 'Método Andromeda',
      icon: 'rocket_launch',
      prompt: `Eres Lloyd, experto en el Método Andromeda para Facebook e Instagram Ads aplicado a infoproductos y quizzes como landing pages. El Método Andromeda se basa en: 1) TRÁFICO FRÍO con contenido de valor (educativo/entretenimiento) para generar awareness, 2) QUIZ como filtro de segmentación — el quiz clasifica al prospecto antes de mostrarle la oferta, 3) RESULTADO PERSONALIZADO que conecta el perfil del quiz directamente con el producto, 4) RETARGETING a quienes completaron el quiz pero no compraron. Estructura de campaña Andromeda: Campaña 1 (ABO - awareness): creativos de problema/curiosidad → quiz. Campaña 2 (CBO - conversión): retargeting a completados → carta de ventas. Audiencias: intereses amplios + LAL de compradores. Creativos: UGC, testimonios, antes/después. Cuando te pidan ayuda con Andromeda, pide: nicho, producto, presupuesto diario y objetivo. Luego entrega plan de campaña detallado con estructura, copies de anuncios y audiencias sugeridas. Responde en español.`
    },
    {
      id: 'prompts',
      label: 'Prompt Builder',
      icon: 'psychology',
      prompt: `Eres Lloyd, especialista en crear prompts de alta calidad para herramientas de IA (ChatGPT, Claude, Gemini) orientados a la creación de contenido para infoproductos y marketing digital en español. Creas prompts para: páginas de venta, cartas de ventas, secuencias de email, copies de anuncios, guiones de VSL, contenido de redes sociales, hooks virales, títulos de ebooks y cursos, y scripts de webinar. Cuando te pidan un prompt, entrega: el prompt completo listo para copiar y pegar, con variables entre [corchetes] para personalizar. Incluye instrucciones de uso. Responde en español.`
    },
    {
      id: 'copy',
      label: 'Copywriter',
      icon: 'edit_note',
      prompt: `Eres Lloyd, copywriter experto en marketing para infoproductos latinoamericanos. Escribes titulares magnéticos, CTAs irresistibles, descripciones de producto, emails de venta, hooks para redes sociales y textos de alta conversión. Usas técnicas de persuasión: escasez, urgencia, prueba social, autoridad, reciprocidad. Tu tono es cercano, directo y aspiracional. Cuando te pidan un copy, pide el contexto (plataforma, producto, avatar) y entrega varias versiones para testear. Responde en español.`
    },
    {
      id: 'leads',
      label: 'Leads Analyst',
      icon: 'trending_up',
      prompt: `Eres Lloyd, experto en análisis de leads y estrategias de nurturing para infoproductos digitales. Ayudas a interpretar métricas del quiz (tasa de finalización, perfiles más frecuentes, conversión por perfil), segmentar contactos según su resultado, y crear secuencias de seguimiento por WhatsApp o email adaptadas a cada perfil. Cuando analices leads, pide los datos disponibles y entrega recomendaciones concretas y accionables. Responde en español.`
    },
    {
      id: 'landing',
      label: 'Landing Architect',
      icon: 'web',
      prompt: `Eres Lloyd, arquitecto de landing pages de alta conversión para infoproductos hispanohablantes. Tu especialidad: estructura, jerarquía visual, psicología de conversión y microcopy.

Conoces las estructuras que convierten: AIDA, PAS, antes/después, mecanismo único. Dominas anatomía de landing: hero magnético, prueba social, stack de valor, garantía, FAQ, CTA final. Entiendes jerarquía tipográfica, balance texto/imagen, ritmo visual y el flujo del ojo.

Cuando el creador te pida ayuda dentro del Landing Builder:
• Para titulares: entregá 3-5 opciones con diferentes ángulos (curiosidad, beneficio directo, identificación de dolor).
• Para secciones: describí estructura + copy listo para copiar.
• Para CTAs: microcopy específico + urgencia sutil.
• Para testimonios: inventá realistas con nombre latino, rol, resultado medible.
• Para objeciones: listá las top 5 + cómo contrarrestarlas en la landing.
• Para estructura: recomendá orden de secciones según el tipo de producto.

Sé concreto, accionable, nunca teórico. El creador va a pegar tu output directo en su landing. Responde en español latinoamericano neutro.`
    },
  ];

  // Modo público (landing): Lloyd solo responde preguntas sobre la plataforma
  const PUBLIC_MODE = {
    id: 'luminous-info',
    label: 'Luminous Studio',
    icon: 'auto_awesome',
    prompt: `Eres Lloyd, el asistente oficial de Luminous Studio. Estás en la landing pública — tu única misión es explicar qué es Luminous Studio y ayudar a visitantes a decidir si la plataforma les sirve. NO generes copy, quizzes, cartas de venta ni estrategias de marketing — si te piden algo así, responde amable que esa funcionalidad está dentro de la plataforma para usuarios registrados y sugiere crear una cuenta.

INFORMACIÓN SOBRE LUMINOUS STUDIO:
- Es una plataforma SaaS para creadores de infoproductos hispanohablantes
- Permite crear quizzes interactivos (como landing pages de alta conversión) y mini-apps (retos, devocionales, trackers, chatbots IA, diarios, planificadores, meditaciones guiadas, flashcards, glosarios, roadmaps, FAQs, generadores, y más — 19 tipos de sección combinables)
- Captura leads automáticamente y los segmenta según el resultado del quiz
- Tiene IA generativa integrada (Claude + Groq) para crear quizzes y mini-apps desde una idea
- Integraciones: Hotmart, Stripe, WhatsApp, Calendly, Discord, Mailchimp, Meta Ads, TikTok Pixel, Google Analytics, Zapier, Webhooks
- Planes: Free ($0 — 1 quiz, 2 mini-apps, 500 respuestas/mes), Starter ($5 — 3 quizzes, 5 mini-apps, sin IA), Pro ($9 — ilimitado + IA), Growth ($19 — ilimitado + dominio propio), Elite ($49 — todo + white-label + subdominios)
- Usa Bot Lab: 16 bots IA especializados en copywriting, ads, producto, contenido
- Dominio propio desde Pro, white-label desde Elite

TONO: cercano, directo, entusiasta pero sin exagerar. Respuestas cortas (2-4 oraciones). Cuando tenga sentido, invita al visitante a crear cuenta gratis o a ver los planes. No uses jerga técnica innecesaria. Responde siempre en español.`
  };

  // ── Estado ────────────────────────────────────────────────
  const SESSIONS_KEY = 'lsa_sessions';
  let _sessions = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
  let _activeSession = null;
  let _currentMode = MODES[0];
  let _isPublic = false;
  let _isThinking = false;
  let _isMinimized = false;
  let _showSessions = false;
  let _recognition = null;
  let _isListening = false;

  // posición de la ventana
  let _pos = { x: null, y: null };
  let _dragging = false;
  let _dragOffset = { x: 0, y: 0 };

  function newSession() {
    return { id: Date.now().toString(), mode: _currentMode.id, title: 'Nueva conversación', messages: [], ts: Date.now() };
  }

  function saveSession() {
    if (!_activeSession) return;
    _activeSession.ts = Date.now();
    if (_activeSession.messages.length) {
      _activeSession.title = _activeSession.messages[0].content.slice(0, 40) + '…';
    }
    const idx = _sessions.findIndex(s => s.id === _activeSession.id);
    if (idx >= 0) _sessions[idx] = _activeSession;
    else _sessions.unshift(_activeSession);
    _sessions = _sessions.slice(0, 20); // keep last 20
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(_sessions));
  }

  // ── HTML ──────────────────────────────────────────────────
  function injectHTML() {
    const el = document.createElement('div');
    el.id = 'lsa-root';
    el.innerHTML = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
#lsa-root * { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Float trigger ── */
#lsa-float-btn {
  position: fixed; z-index: 9998;
  width: 72px; height: 72px; border-radius: 50%;
  background: linear-gradient(135deg, #2E5BFF 0%, #7c3aed 100%);
  border: none; cursor: pointer; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px;
  box-shadow: 0 8px 32px rgba(46,91,255,0.5), 0 0 0 0 rgba(46,91,255,0.4);
  transition: transform 0.2s, box-shadow 0.2s;
  animation: lsa-ring 2.5s ease-in-out infinite;
}
@keyframes lsa-ring {
  0%   { box-shadow: 0 8px 32px rgba(46,91,255,0.5), 0 0 0 0   rgba(46,91,255,0.35); }
  60%  { box-shadow: 0 8px 32px rgba(46,91,255,0.5), 0 0 0 14px rgba(46,91,255,0); }
  100% { box-shadow: 0 8px 32px rgba(46,91,255,0.5), 0 0 0 0   rgba(46,91,255,0); }
}
#lsa-float-btn:hover { transform: scale(1.1); }
#lsa-float-btn .lsa-badge {
  position: absolute; top: 4px; right: 4px; width: 10px; height: 10px;
  border-radius: 50%; background: #69f6b8; border: 2px solid #0a0a12;
  animation: lsa-blink 2s ease-in-out infinite;
}
@keyframes lsa-blink { 0%,100%{opacity:1} 50%{opacity:0.4} }

/* ── Main window ── */
#lsa-win {
  position: fixed; z-index: 9999;
  width: 460px;
  background: rgba(14,16,40,0.22);
  backdrop-filter: blur(48px) saturate(180%); -webkit-backdrop-filter: blur(48px) saturate(180%);
  border: 1px solid rgba(120,140,255,0.22);
  border-radius: 22px;
  box-shadow: 0 8px 48px rgba(46,91,255,0.18), 0 0 0 1px rgba(46,91,255,0.12), inset 0 1px 0 rgba(255,255,255,0.14);
  display: flex; flex-direction: column;
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  color: #fff;
  transition: box-shadow 0.2s;
  user-select: none;
}
#lsa-win.dragging { box-shadow: 0 20px 80px rgba(46,91,255,0.25); }

/* ── Gradient top strip ── */
#lsa-win::before {
  content: ''; display: block;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #2E5BFF 30%, #7c3aed 70%, transparent 100%);
  opacity: 0.7;
}

/* ── Header ── */
#lsa-header {
  display: flex; align-items: center; gap: 10px;
  padding: 13px 14px 11px;
  background: rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(120,140,255,0.15);
  cursor: grab;
}
#lsa-header:active { cursor: grabbing; }
.lsa-logo {
  width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
  background: linear-gradient(135deg, #2E5BFF 0%, #7c3aed 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; font-weight: 900; color: #fff; letter-spacing: -1px;
  box-shadow: 0 4px 12px rgba(46,91,255,0.4);
}
.lsa-header-info { flex: 1; min-width: 0; }
.lsa-header-name { font-size: 13px; font-weight: 800; color: #fff; line-height: 1.2; letter-spacing: -0.3px; }
.lsa-header-sub { font-size: 10px; color: rgba(255,255,255,0.35); font-weight: 500; display: flex; align-items: center; gap: 4px; }
.lsa-status-dot { width: 5px; height: 5px; border-radius: 50%; background: #69f6b8; display: inline-block; animation: lsa-blink 2s infinite; }
.lsa-hbtn {
  width: 26px; height: 26px; border-radius: 7px; border: none; flex-shrink: 0;
  background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.lsa-hbtn:hover { background: rgba(255,255,255,0.1); color: #fff; }
.lsa-hbtn.active { background: rgba(46,91,255,0.2); color: #7a9aff; }
.lsa-hbtn-sep { width: 1px; height: 14px; background: rgba(255,255,255,0.07); flex-shrink: 0; }

/* ── Mode tabs ── */
#lsa-mode-tabs {
  display: flex; flex-wrap: wrap; align-items: center; gap: 5px;
  padding: 10px 12px;
  background: rgba(0,0,0,0.08);
  border-bottom: 1px solid rgba(120,140,255,0.12);
  flex-shrink: 0;
}
#lsa-mode-tabs::-webkit-scrollbar { display: none; }
.lsa-tab {
  flex-shrink: 0; padding: 6px 11px; border-radius: 20px; line-height: 1;
  font-size: 11px; font-weight: 700; cursor: pointer; border: 1px solid transparent;
  background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.55);
  transition: all 0.15s; white-space: nowrap;
  display: inline-flex; align-items: center; gap: 5px;
}
.lsa-tab-icon {
  font-size: 14px !important; line-height: 1;
  background: linear-gradient(135deg, #4d7cff, #a78bfa);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
}
.lsa-tab.active .lsa-tab-icon {
  background: none; -webkit-text-fill-color: currentColor; color: #a78bfa;
}
.lsa-tab:hover { background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.7); }
.lsa-tab.active {
  background: rgba(46,91,255,0.2); color: #7a9aff;
  border: 1px solid rgba(46,91,255,0.35);
}

/* ── Sessions panel ── */
#lsa-sessions-panel {
  border-bottom: 1px solid rgba(120,140,255,0.12);
  max-height: 180px; overflow-y: auto;
  background: rgba(0,0,0,0.1);
  scrollbar-width: thin; scrollbar-color: #333 transparent;
}
.lsa-session-item {
  padding: 8px 14px; font-size: 11px; cursor: pointer;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  color: #767575; display: flex; align-items: center; justify-content: space-between;
  gap: 8px; transition: background 0.12s;
}
.lsa-session-item:hover { background: rgba(255,255,255,0.04); color: #ccc; }
.lsa-session-item.active { color: #7a9aff; background: rgba(46,91,255,0.08); }
.lsa-session-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
.lsa-session-del {
  background: none; border: none; color: #484847; cursor: pointer;
  font-size: 13px; padding: 1px 3px; border-radius: 4px; flex-shrink: 0;
}
.lsa-session-del:hover { color: #ff6e84; background: rgba(255,110,132,0.1); }

/* ── Messages ── */
#lsa-messages {
  flex: 1; overflow-y: auto; padding: 16px 14px;
  display: flex; flex-direction: column; gap: 12px;
  min-height: 240px; max-height: 380px;
  scrollbar-width: thin; scrollbar-color: #222 transparent;
}
#lsa-messages::-webkit-scrollbar { width: 3px; }
#lsa-messages::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
.lsa-msg { display: flex; gap: 9px; animation: lsa-in 0.2s cubic-bezier(.25,.8,.25,1) both; }
@keyframes lsa-in { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform:translateY(0); } }
.lsa-msg.user { flex-direction: row-reverse; }
.lsa-av {
  width: 28px; height: 28px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; margin-top: 1px;
}
.lsa-av.ai {
  background: linear-gradient(135deg, #1a2dff 0%, #7c3aed 100%);
  box-shadow: 0 3px 10px rgba(46,91,255,0.4);
}
.lsa-av.me {
  background: rgba(105,246,184,0.12); border: 1px solid rgba(105,246,184,0.2);
  color: #69f6b8; font-size: 9px; font-weight: 900;
}
.lsa-bubble {
  max-width: calc(100% - 42px); padding: 9px 13px; border-radius: 14px;
  font-size: 13px; line-height: 1.6; color: #d0d0e0;
}
.lsa-msg.ai .lsa-bubble {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-top-left-radius: 4px;
}
.lsa-msg.user .lsa-bubble {
  background: linear-gradient(135deg, rgba(46,91,255,0.22) 0%, rgba(124,58,237,0.15) 100%);
  border: 1px solid rgba(46,91,255,0.28);
  border-top-right-radius: 4px; color: #c0d0ff;
}
.lsa-bubble strong { color: #fff; font-weight: 700; }
.lsa-bubble code {
  background: rgba(255,255,255,0.08); padding: 1px 5px; border-radius: 4px;
  font-size: 11.5px; font-family: 'Fira Code', monospace;
}
.lsa-bubble a { color: #7a9aff; text-decoration: underline; }
.lsa-thinking .lsa-bubble {
  display: flex; gap: 5px; align-items: center; padding: 13px 16px;
}
.lsa-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(46,91,255,0.5); animation: lsa-bounce 1.2s infinite; }
.lsa-dot:nth-child(2) { animation-delay: .2s; background: rgba(124,58,237,0.5); }
.lsa-dot:nth-child(3) { animation-delay: .4s; background: rgba(46,91,255,0.3); }
@keyframes lsa-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }

/* ── Empty state ── */
.lsa-empty {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 10px; padding: 28px 20px; text-align: center;
}
.lsa-empty-logo {
  width: 56px; height: 56px; border-radius: 16px;
  background: linear-gradient(135deg, #2E5BFF 0%, #7c3aed 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; margin-bottom: 4px;
  box-shadow: 0 8px 30px rgba(46,91,255,0.35);
}
.lsa-empty h4 { font-size: 15px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
.lsa-empty p { font-size: 12px; color: rgba(255,255,255,0.3); max-width: 260px; line-height: 1.6; }
.lsa-chips { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 8px; }
.lsa-chip {
  font-size: 11.5px; font-weight: 600; padding: 5px 11px;
  background: rgba(46,91,255,0.09); border: 1px solid rgba(46,91,255,0.2);
  border-radius: 20px; color: #7a9aff; cursor: pointer; transition: all 0.15s;
}
.lsa-chip:hover { background: rgba(46,91,255,0.2); border-color: rgba(46,91,255,0.4); color: #a0c0ff; }

/* ── Input bar ── */
#lsa-inputbar {
  padding: 10px 12px 12px; border-top: 1px solid rgba(120,140,255,0.15);
  display: flex; gap: 7px; align-items: flex-end;
  background: rgba(0,0,0,0.1);
}
#lsa-input {
  flex: 1; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.13);
  border-radius: 12px; padding: 9px 13px; color: #fff; font-size: 13px;
  font-family: inherit; resize: none; outline: none;
  max-height: 120px; min-height: 38px; line-height: 1.45;
  transition: border-color 0.18s, background 0.18s;
}
#lsa-input:focus { border-color: rgba(46,91,255,0.6); background: rgba(46,91,255,0.08); }
#lsa-input::placeholder { color: rgba(255,255,255,0.25); }
.lsa-input-btn {
  width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; border: none;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  align-self: flex-end; transition: all 0.15s;
}
#lsa-mic-btn { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.4); }
#lsa-mic-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
#lsa-mic-btn.listening { background: rgba(255,110,132,0.15); color: #ff6e84; animation: lsa-pulse 1s infinite; }
@keyframes lsa-pulse { 0%,100%{opacity:1} 50%{opacity:0.55} }
#lsa-send-btn {
  background: linear-gradient(135deg, #2E5BFF 0%, #7c3aed 100%);
  color: #fff; box-shadow: 0 4px 14px rgba(46,91,255,0.4);
}
#lsa-send-btn:hover { filter: brightness(1.15); transform: scale(1.05); }
#lsa-send-btn:disabled { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.2); cursor: not-allowed; box-shadow: none; transform: none; }

/* ── Minimized ── */
#lsa-win.minimized #lsa-messages,
#lsa-win.minimized #lsa-inputbar,
#lsa-win.minimized #lsa-sessions-panel,
#lsa-win.minimized #lsa-mode-tabs { display: none !important; }
</style>

<!-- Botón flotante -->
<button id="lsa-float-btn" title="Lloyd · Asistente IA (Ctrl+Space)">
  ✦
  <span class="lsa-badge"></span>
</button>

<!-- Ventana -->
<div id="lsa-win" style="display:none;">

  <!-- Header / Drag handle -->
  <div id="lsa-header">
    <div class="lsa-logo">✦</div>
    <div class="lsa-header-info">
      <div class="lsa-header-name">Lloyd</div>
      <div class="lsa-header-sub"><span class="lsa-status-dot"></span> Asistente IA · Luminous Studio</div>
    </div>
    <button class="lsa-hbtn" id="lsa-sessions-btn" onclick="LSA._toggleSessions()" title="Historial">
      <span class="material-symbols-outlined" style="font-size:15px">history</span>
    </button>
    <button class="lsa-hbtn" onclick="LSA._newChat()" title="Nueva conversación">
      <span class="material-symbols-outlined" style="font-size:15px">add</span>
    </button>
    <div class="lsa-hbtn-sep"></div>
    <button class="lsa-hbtn" onclick="LSA._toggleMinimize()" title="Minimizar">
      <span class="material-symbols-outlined" style="font-size:15px">remove</span>
    </button>
    <button class="lsa-hbtn" onclick="LSA.hide()" title="Cerrar">
      <span class="material-symbols-outlined" style="font-size:15px">close</span>
    </button>
  </div>

  <!-- Mode tabs -->
  <div id="lsa-mode-tabs"></div>

  <!-- Sessions panel -->
  <div id="lsa-sessions-panel" style="display:none;"></div>

  <!-- Messages -->
  <div id="lsa-messages"></div>

  <!-- Input bar -->
  <div id="lsa-inputbar">
    <textarea id="lsa-input" placeholder="Pregúntale algo a Lloyd..." rows="1"
      onkeydown="LSA._key(event)" oninput="LSA._resize(this)"></textarea>
    <button class="lsa-input-btn" id="lsa-mic-btn" onclick="LSA._toggleVoice()" title="Voz">
      <span class="material-symbols-outlined" style="font-size:18px">mic</span>
    </button>
    <button class="lsa-input-btn" id="lsa-send-btn" onclick="LSA.send()" title="Enviar">
      <span class="material-symbols-outlined" style="font-size:18px">arrow_upward</span>
    </button>
  </div>
</div>`;
    document.body.appendChild(el);

    _initDrag();
    _initPosition();
    _renderModeTabs();
    _renderMessages();

  }

  // ── Posición inicial ──────────────────────────────────────
  function _initPosition() {
    const win = document.getElementById('lsa-win');
    const btn = document.getElementById('lsa-float-btn');
    const bx = window.innerWidth - 96;
    const by = window.innerHeight - 96;
    btn.style.left = bx + 'px';
    btn.style.top  = by + 'px';
    _pos.x = window.innerWidth - 420;
    _pos.y = Math.max(10, window.innerHeight - 560);
    win.style.left = _pos.x + 'px';
    win.style.top  = _pos.y + 'px';
  }

  // ── Drag ─────────────────────────────────────────────────
  function _initDrag() {
    const toolbar = document.getElementById('lsa-header');
    const win = document.getElementById('lsa-win');

    const onMove = (cx, cy) => {
      if (!_dragging) return;
      const nx = cx - _dragOffset.x;
      const ny = cy - _dragOffset.y;
      _pos.x = Math.max(0, Math.min(nx, window.innerWidth - win.offsetWidth));
      _pos.y = Math.max(0, Math.min(ny, window.innerHeight - 50));
      win.style.left = _pos.x + 'px';
      win.style.top  = _pos.y + 'px';
    };

    toolbar.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
      _dragging = true;
      _dragOffset.x = e.clientX - _pos.x;
      _dragOffset.y = e.clientY - _pos.y;
      win.classList.add('dragging');
    });
    document.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    document.addEventListener('mouseup', () => { _dragging = false; win.classList.remove('dragging'); });

    // Touch
    toolbar.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      _dragging = true;
      _dragOffset.x = t.clientX - _pos.x;
      _dragOffset.y = t.clientY - _pos.y;
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      onMove(t.clientX, t.clientY);
    }, { passive: true });
    document.addEventListener('touchend', () => { _dragging = false; });
  }

  // ── Render ────────────────────────────────────────────────
  function _renderModeTabs() {
    const el = document.getElementById('lsa-mode-tabs');
    if (!el) return;
    if (_isPublic) { el.style.display = 'none'; return; }
    el.innerHTML = MODES.map(m => `
      <button class="lsa-tab ${m.id === _currentMode.id ? 'active' : ''}" onclick="LSA._selectMode('${m.id}')">
        <span class="material-symbols-outlined lsa-tab-icon">${m.icon || 'bolt'}</span>
        <span>${m.label}</span>
      </button>`).join('');
  }

  function _renderSessions() {
    const el = document.getElementById('lsa-sessions-panel');
    if (!_sessions.length) {
      el.innerHTML = '<div style="padding:12px 14px;font-size:11px;color:#555;">Sin conversaciones guardadas.</div>';
      return;
    }
    el.innerHTML = _sessions.map(s => `
      <div class="lsa-session-item ${_activeSession?.id === s.id ? 'active' : ''}" onclick="LSA._loadSession('${s.id}')">
        <span class="lsa-session-title">${_esc(s.title)}</span>
        <button class="lsa-session-del" onclick="event.stopPropagation();LSA._deleteSession('${s.id}')" title="Eliminar">✕</button>
      </div>`).join('');
  }

  const PAGE_CHIPS = {
    'dashboard':        ['Analiza mis leads', 'Mejora mi quiz', 'Crea campaña Andromeda'],
    'generador-ia':     ['Crea un quiz para mi nicho', 'Mejora mis perfiles de resultado', 'Dame un título irresistible'],
    'landing-builder':  ['Dame 5 titulares para mi hero', 'Sugiéreme 3 testimonios realistas', 'Mejora mi sección de garantía'],
    'leads':            ['Segmenta mis leads', 'Secuencia de WhatsApp por perfil', 'Tasa de conversión baja, qué hago'],
    'precios':          ['¿Qué plan me conviene?', 'Diferencia entre Pro y Growth', '¿Vale la pena el Elite?'],
    'default':          ['Crea una oferta irresistible', 'Escríbeme una carta de ventas', 'Campaña con Método Andromeda'],
  };

  const PUBLIC_CHIPS = [
    '¿Qué es Luminous Studio?',
    '¿Cuánto cuesta?',
    '¿Qué es una mini-app?',
    '¿Tiene IA?',
    '¿Qué integraciones tiene?',
    '¿Cómo empiezo?',
  ];

  function _getChips() {
    if (_isPublic) return PUBLIC_CHIPS;
    const path = window.location.pathname;
    for (const [k, v] of Object.entries(PAGE_CHIPS)) {
      if (path.includes(k)) return v;
    }
    return PAGE_CHIPS.default;
  }

  function _renderMessages() {
    const el = document.getElementById('lsa-messages');
    if (!_activeSession || !_activeSession.messages.length) {
      const welcomeTitle = _isPublic ? 'Hola, soy Lloyd' : 'Hola, soy Lloyd';
      const welcomeBody  = _isPublic
        ? 'Estoy acá para resolverte dudas sobre Luminous Studio. ¿Qué querés saber?'
        : 'Tu asistente IA especializado en quizzes, marketing y ventas digitales. ¿En qué puedo ayudarte hoy?';
      el.innerHTML = `
        <div class="lsa-empty">
          <div class="lsa-empty-logo">✦</div>
          <h4>${welcomeTitle}</h4>
          <p>${welcomeBody}</p>
          <div class="lsa-chips">
            ${_getChips().map(c => `<button class="lsa-chip" onclick="LSA._chip('${c.replace(/'/g,"\\'")}')">${c}</button>`).join('')}
          </div>
        </div>`;
      return;
    }

    el.innerHTML = _activeSession.messages.map(m => {
      const isUser = m.role === 'user';
      return `<div class="lsa-msg ${isUser ? 'user' : 'ai'}">
        <div class="lsa-av ${isUser ? 'me' : 'ai'}">${isUser ? 'TÚ' : '✦'}</div>
        <div class="lsa-bubble">${_md(m.content)}</div>
      </div>`;
    }).join('');

    if (_isThinking) {
      el.innerHTML += `<div class="lsa-msg ai lsa-thinking">
        <div class="lsa-av ai">✦</div>
        <div class="lsa-bubble"><div class="lsa-dot"></div><div class="lsa-dot"></div><div class="lsa-dot"></div></div>
      </div>`;
    }
    el.scrollTop = el.scrollHeight;
  }

  function _md(text) {
    return text
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/`([^`]+)`/g,'<code>$1</code>')
      .replace(/^#{1,3} (.+)$/gm,'<strong>$1</strong>')
      .replace(/^[\*\-] (.+)$/gm,'• $1')
      .replace(/^\d+\. (.+)$/gm,'• $1')
      .replace(/\n{2,}/g,'<br><br>').replace(/\n/g,'<br>');
  }

  function _esc(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ── Voz ──────────────────────────────────────────────────
  function _initVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    _recognition = new SR();
    _recognition.lang = 'es-ES';
    _recognition.continuous = false;
    _recognition.interimResults = false;
    _recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      const input = document.getElementById('lsa-input');
      if (input) { input.value = (input.value + ' ' + text).trim(); LSA._resize(input); }
    };
    _recognition.onend = () => {
      _isListening = false;
      document.getElementById('lsa-mic-btn')?.classList.remove('listening');
    };
  }

  // ── Public API ────────────────────────────────────────────
  window.LSA = {
    show() {
      const win = document.getElementById('lsa-win');
      const btn = document.getElementById('lsa-float-btn');
      if (!_activeSession) { _activeSession = newSession(); }
      win.style.display = 'flex';
      btn.style.display = 'none';
      _renderMessages();
      setTimeout(() => document.getElementById('lsa-input')?.focus(), 100);
    },

    hide() {
      document.getElementById('lsa-win').style.display = 'none';
      document.getElementById('lsa-float-btn').style.display = 'flex';
    },

    toggle() {
      const win = document.getElementById('lsa-win');
      if (win.style.display === 'none' || !win.style.display) this.show();
      else this.hide();
    },

    _toggleMinimize() {
      const win = document.getElementById('lsa-win');
      _isMinimized = !_isMinimized;
      win.classList.toggle('minimized', _isMinimized);
    },

    _selectMode(id) {
      _currentMode = MODES.find(m => m.id === id) || MODES[0];
      _renderModeTabs();
      _renderMessages();
    },

    _toggleSessions() {
      const el = document.getElementById('lsa-sessions-panel');
      _showSessions = !_showSessions;
      el.style.display = _showSessions ? 'block' : 'none';
      const btn = document.getElementById('lsa-sessions-btn');
      btn.classList.toggle('active', _showSessions);
      if (_showSessions) _renderSessions();
    },

    _loadSession(id) {
      _activeSession = _sessions.find(s => s.id === id);
      if (_activeSession) _currentMode = MODES.find(m => m.id === _activeSession.mode) || MODES[0];
      _renderModeTabs();
      _showSessions = false;
      document.getElementById('lsa-sessions-panel').style.display = 'none';
      document.getElementById('lsa-sessions-btn').classList.remove('active');
      _renderMessages();
    },

    _deleteSession(id) {
      _sessions = _sessions.filter(s => s.id !== id);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(_sessions));
      if (_activeSession?.id === id) { _activeSession = null; _renderMessages(); }
      _renderSessions();
    },

    _newChat() {
      saveSession();
      _activeSession = newSession();
      _showSessions = false;
      document.getElementById('lsa-sessions-panel').style.display = 'none';
      document.getElementById('lsa-sessions-btn').classList.remove('active');
      _renderMessages();
      document.getElementById('lsa-input')?.focus();
    },

    _chip(text) {
      const input = document.getElementById('lsa-input');
      if (input) { input.value = text; this._resize(input); }
      this.send();
    },

    _key(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); }
    },

    _resize(el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 100) + 'px';
    },

    _toggleVoice() {
      if (!_recognition) { alert('Tu navegador no soporta entrada de voz.'); return; }
      const btn = document.getElementById('lsa-mic-btn');
      if (_isListening) { _recognition.stop(); return; }
      _isListening = true;
      btn.classList.add('listening');
      _recognition.start();
    },

    async send() {
      const input = document.getElementById('lsa-input');
      const text = (input?.value || '').trim();
      if (!text || _isThinking) return;
      input.value = ''; input.style.height = 'auto';

      if (!_activeSession) _activeSession = newSession();
      _activeSession.messages.push({ role: 'user', content: text });
      _isThinking = true;
      document.getElementById('lsa-send-btn').disabled = true;
      _renderMessages();

      // Modo público (landing): responder localmente con FAQ, sin hit al API
      if (_isPublic) {
        setTimeout(() => {
          const reply = _publicFaqReply(text);
          _activeSession.messages.push({ role: 'assistant', content: reply });
          saveSession();
          _isThinking = false;
          document.getElementById('lsa-send-btn').disabled = false;
          _renderMessages();
          input?.focus();
        }, 350);
        return;
      }

      try {
        // Solo mensajes válidos, sin errores anteriores
        const cleanMessages = _activeSession.messages
          .filter(m => !m._isError)
          .map(m => ({ role: m.role, content: m.content }));

        let reply = null;

        // ── Lloyd usa SIEMPRE Claude proxy (plataforma paga) ──
        if (!reply) {
          // Obtener token, intentando refresh primero
          let token = null;
          try {
            const { data } = await db.auth.refreshSession();
            token = data?.session?.access_token || null;
          } catch {}
          if (!token) {
            try {
              const { data: { session } } = await db.auth.getSession();
              token = session?.access_token || null;
            } catch {}
          }

          if (!token) {
            if (_isPublic && typeof SUPABASE_ANON_KEY !== 'undefined') {
              token = SUPABASE_ANON_KEY;
            } else {
              _activeSession.messages.push({
                role: 'assistant',
                content: 'Tu sesión expiró. Por favor [inicia sesión de nuevo](./login.html) para seguir usando el asistente.',
                _isError: true,
              });
              _isThinking = false;
              document.getElementById('lsa-send-btn').disabled = false;
              _renderMessages();
              return;
            }
          }

          const res = await fetch(`${SUPABASE_URL}/functions/v1/claude-proxy`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'claude-haiku-4-5-20251001',
              max_tokens: 1024,
              system: _currentMode.prompt,
              messages: cleanMessages,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            if (res.status === 401) {
              _activeSession.messages.push({
                role: 'assistant',
                content: '⚠️ Sesión expirada.\n\n**Opciones:**\n• [Iniciar sesión de nuevo](./login.html)\n• Añade tu API key de Groq en [Ajustes](./settings.html).',
                _isError: true,
              });
              _isThinking = false;
              document.getElementById('lsa-send-btn').disabled = false;
              _renderMessages();
              return;
            }
            if (res.status === 429) throw new Error('Demasiadas solicitudes. Espera un momento.');
            throw new Error(data.error?.message || data.message || `Error ${res.status}`);
          }
          reply = data.content?.[0]?.text;
        }

        if (!reply) throw new Error('Respuesta vacía. Intenta de nuevo.');
        _activeSession.messages.push({ role: 'assistant', content: reply });
        saveSession();
      } catch (err) {
        _activeSession.messages.push({ role: 'assistant', content: `⚠️ ${err.message}`, _isError: true });
      } finally {
        _isThinking = false;
        document.getElementById('lsa-send-btn').disabled = false;
        _renderMessages();
        input?.focus();
      }
    },
  };

  // ── FAQ pregrabado para modo público (landing) ────────────
  const PUBLIC_FAQ = [
    {
      keys: ['qué es', 'que es', 'qué hace', 'que hace', 'luminous', 'plataforma', 'para qué sirve', 'para que sirve'],
      answer: `**Luminous Studio** es una plataforma para creadores de infoproductos hispanohablantes. Te permite crear:\n\n• **Quizzes interactivos** que capturan leads y los segmentan\n• **Mini-apps personalizadas** (retos, diarios, trackers, meditaciones, flashcards, chatbots IA y 13 tipos más)\n• **Landing pages de alta conversión** para vender cursos, ebooks o servicios\n\nTodo con IA integrada, integraciones con las herramientas que ya usas, y tu propia marca.`
    },
    {
      keys: ['precio', 'costo', 'cuánto', 'cuanto', 'plan', 'pagar', 'cuesta', 'tarifa', 'suscripción'],
      answer: `Tenemos 5 planes:\n\n• **Free** — $0 · 1 quiz, 2 mini-apps, 500 respuestas/mes\n• **Starter** — $5/mes · 3 quizzes, 5 mini-apps, sin IA\n• **Pro** — $9/mes · ilimitado + IA generativa + leads\n• **Growth** — $19/mes · + dominio propio + Bot Lab\n• **Elite** — $49/mes · + white-label + subdominios\n\nPodés empezar [gratis acá](./registro.html) y subir cuando lo necesites.`
    },
    {
      keys: ['ia', 'inteligencia artificial', 'ai', 'claude', 'groq', 'chatgpt', 'gpt'],
      answer: `Sí — Luminous tiene **IA generativa** integrada (Claude + Groq). Con ella podés:\n\n• Crear un quiz completo desde una idea en 8 segundos\n• Generar mini-apps con contenido real (retos, afirmaciones, meditaciones, etc.)\n• Chatear con 16 bots especializados en copywriting, ads, ofertas y más\n\nLa IA viene desde el plan **Pro ($9/mes)**. En Free y Starter usás plantillas prearmadas.`
    },
    {
      keys: ['mini-app', 'miniapp', 'mini app', 'app', 'sección', 'seccion', 'módulo', 'modulo'],
      answer: `Las **mini-apps** son experiencias interactivas que podés combinar en una sola página. Hay **19 tipos de sección**:\n\nreto · checklist · tracker · devocional · planificador · calculadora · diario · chatbot · generador · simulador · afirmaciones · meditación · FAQ · flashcards · glosario · roadmap · diagnóstico · comparador · biblioteca\n\nMezclás las que quieras y tu audiencia las abre como si fuera una mini-app nativa.`
    },
    {
      keys: ['integración', 'integracion', 'conecta', 'herramienta', 'hotmart', 'stripe', 'whatsapp', 'calendly', 'mailchimp', 'zapier', 'webhook', 'meta', 'tiktok', 'analytics', 'discord'],
      answer: `Integraciones disponibles:\n\n**Pagos**: Hotmart · Stripe\n**Comunicación**: WhatsApp · Calendly · Discord\n**Email**: Mailchimp · Email nativo de Luminous\n**Ads y tracking**: Meta Pixel · TikTok Pixel · Google Analytics\n**Automatización**: Zapier · Webhooks personalizados\n\nSe conectan en 2 minutos desde Ajustes, sin código.`
    },
    {
      keys: ['quiz', 'quizzes', 'cuestionario', 'test'],
      answer: `Los **quizzes** de Luminous son landing pages interactivas. Tu visitante responde 5-10 preguntas, obtiene un resultado personalizado y vos capturás su email segmentado por perfil.\n\nPodés crearlos con IA (desde una idea), con plantillas prearmadas (más de 30 nichos), o desde cero. Soportan Meta Pixel, GA y TikTok para tracking, y se integran con tu CRM/embudo.`
    },
    {
      keys: ['dominio', 'subdominio', 'url', 'marca', 'white label', 'whitelabel', 'white-label', 'personalizar'],
      answer: `• **Dominio propio**: desde el plan Pro ($9). Conectás tu dominio y tus quizzes salen bajo tu marca.\n• **White-label**: desde el plan Elite ($49). Oculta toda mención de Luminous — tu cliente final ve solo tu marca.\n• **Subdominios**: hasta 5 en Elite, útil si manejás varios negocios o marcas.`
    },
    {
      keys: ['bot', 'bots', 'chatbot', 'bot lab', 'asistente'],
      answer: `**Bot Lab** (plan Growth/Elite) es una biblioteca de **16 bots IA especializados** en copywriting, ads, ofertas, VSL, lanzamientos, email, contenido, y más. Cada uno con un prompt afinado para su tarea.\n\nAdemás, podés crear chatbots personalizados para tus propios infoproductos (tu cliente chatea con un bot entrenado con tu contenido).`
    },
    {
      keys: ['lead', 'leads', 'contacto', 'email', 'lista', 'captura'],
      answer: `Cada quiz y mini-app **captura leads** automáticamente. Los segmentás por el resultado del quiz (ej: perfil A, B o C) y podés:\n\n• Exportarlos a CSV\n• Enviarlos a Mailchimp, Zapier o tu CRM\n• Verlos en el panel de Leads con filtros y métricas\n• Enviarles el resultado por email con tu marca automáticamente`
    },
    {
      keys: ['cómo empiezo', 'como empiezo', 'empezar', 'registrar', 'cuenta', 'crear cuenta', 'registro', 'sign up', 'signup'],
      answer: `Podés crear tu cuenta [gratis acá](./registro.html) — no necesitás tarjeta. Te lleva 30 segundos y ya tenés:\n\n• 1 quiz\n• 2 mini-apps\n• 500 respuestas al mes\n\nCuando quieras más, subís al plan que te sirva.`
    },
    {
      keys: ['idioma', 'español', 'ingles', 'inglés', 'portugués', 'portugues'],
      answer: `Luminous está pensado para el mercado **hispanohablante**. Toda la plataforma, plantillas, IA y documentación están en español. Podés crear contenido en cualquier idioma que quieras — la IA genera en el idioma que le pidas.`
    },
    {
      keys: ['cómo funciona', 'como funciona', 'funciona', 'proceso', 'pasos', 'tutorial'],
      answer: `En 3 pasos:\n\n**1.** Creás un quiz o mini-app (con IA, plantilla o desde cero)\n**2.** Lo compartís con un link (o lo pegás en tu landing)\n**3.** Recibís leads segmentados + métricas en tiempo real\n\nCada pieza queda conectada a tu CRM, Meta Pixel, WhatsApp o lo que uses.`
    },
  ];

  function _publicFaqReply(msg) {
    const q = (msg || '').toLowerCase();

    // Detectar intentos de usar Lloyd como bot especialista
    const bannedIntents = ['escribe', 'escríbeme', 'escribeme', 'redacta', 'crea un quiz', 'crea una', 'dame un copy', 'hazme', 'generá', 'genera', 'campaña', 'campaign', 'anuncio', 'vsl', 'carta de venta', 'andromeda'];
    if (bannedIntents.some(b => q.includes(b))) {
      return `Esa es una tarea que resuelven los bots internos de Luminous Studio — están disponibles dentro de la plataforma para usuarios registrados.\n\nPodés [crear tu cuenta gratis acá](./registro.html) y probarlos sin tarjeta.`;
    }

    for (const f of PUBLIC_FAQ) {
      if (f.keys.some(k => q.includes(k))) return f.answer;
    }

    return `Puedo contarte sobre Luminous Studio. Preguntame, por ejemplo:\n\n• ¿Qué es Luminous?\n• ¿Cuánto cuesta?\n• ¿Qué es una mini-app?\n• ¿Qué integraciones tiene?\n• ¿Cómo empiezo?\n\nO si preferís probarlo, [creá tu cuenta gratis](./registro.html).`;
  }

  // ── Init ──────────────────────────────────────────────────
  async function _checkAccess() {
    // Si hay body[data-lloyd-public], Lloyd corre en modo público (solo info de Luminous).
    if (document.body?.dataset?.lloydPublic === 'true') {
      _isPublic = true;
      _currentMode = PUBLIC_MODE;
      return true;
    }
    try {
      if (typeof Auth === 'undefined') return false;
      const user = await Auth.user();
      if (!user) return false;
      // Permite pre-seleccionar un modo via data-lloyd-default-mode="landing"
      const def = document.body?.dataset?.lloydDefaultMode;
      if (def) {
        const match = MODES.find(m => m.id === def);
        if (match) _currentMode = match;
      }
      return true;
    } catch (_) { return false; }
  }

  async function init() {
    if (typeof SUPABASE_URL === 'undefined') return;
    const allowed = await _checkAccess();
    if (!allowed) return;
    injectHTML();
    if (_isPublic) {
      const sub = document.querySelector('.lsa-header-sub');
      if (sub) sub.innerHTML = '<span class="lsa-status-dot"></span> Atención al cliente · Luminous Studio';
      const floatBtn = document.getElementById('lsa-float-btn');
      if (floatBtn) floatBtn.title = 'Lloyd · ¿Dudas sobre Luminous? (Ctrl+Space)';
      const input = document.getElementById('lsa-input');
      if (input) input.placeholder = '¿En qué te puedo ayudar?';
    }
    _initVoice();
    document.getElementById('lsa-float-btn').onclick = () => LSA.toggle();
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.code === 'Space') { e.preventDefault(); LSA.toggle(); }
      if (e.key === 'Escape') { const w = document.getElementById('lsa-win'); if (w?.style.display !== 'none') LSA.hide(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
