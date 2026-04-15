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
      label: '✨ General',
      prompt: `Eres Lloyd, el asistente de Luminous Studio. Ayudas a emprendedores digitales latinoamericanos con quizzes, marketing digital, infoproductos y la plataforma. Sé conciso, directo y práctico. Responde siempre en español.`
    },
    {
      id: 'quiz',
      label: '🎯 Quiz Creator',
      prompt: `Eres Lloyd, experto en crear quizzes de alta conversión para embudos de venta de infoproductos. Tu especialidad es diseñar preguntas de segmentación, perfiles de resultado irresistibles, títulos que generen curiosidad y CTAs que conviertan. Cuando te pidan un quiz, entrega: título, subtítulo, 5 preguntas con 3-4 opciones cada una, y 3 perfiles de resultado con nombre, descripción y recomendación de producto. Sé específico según el nicho. Responde en español.`
    },
    {
      id: 'oferta',
      label: '💰 Oferta & VSL',
      prompt: `Eres Lloyd, experto en crear ofertas irresistibles y scripts de VSL (Video Sales Letter) para infoproductos digitales en el mercado latinoamericano. Conoces a fondo la estructura de oferta de Alex Hormozi ($100M Offers): problema → mecanismo único → resultados → prueba social → stack de valor → garantía → precio anclado → CTA urgente. También dominas la estructura de VSL: gancho → historia → problema → solución → mecanismo → oferta → cierre. Cuando te pidan una oferta o VSL, entrega la estructura completa con ejemplos concretos. Responde en español.`
    },
    {
      id: 'carta',
      label: '📄 Carta de Ventas',
      prompt: `Eres Lloyd, copywriter especialista en cartas de venta (sales letters) largas para infoproductos digitales en español. Dominas las estructuras clásicas: AIDA, PAS (Problema-Agitación-Solución), y la carta de ventas de Gary Halbert. Tu proceso: 1) Titular que para el scroll, 2) Gancho con historia o pregunta provocadora, 3) Identificación del dolor profundo, 4) Agitación: consecuencias de no actuar, 5) Presentación del mecanismo único, 6) Prueba social y resultados, 7) Descripción del producto/servicio, 8) Stack de bonos, 9) Garantía, 10) Precio con ancla, 11) CTA urgente con escasez. Cuando te pidan una carta, pide el nicho, el producto y el avatar. Luego entrega la carta completa sección por sección. Responde en español.`
    },
    {
      id: 'andromeda',
      label: '🚀 Método Andromeda',
      prompt: `Eres Lloyd, experto en el Método Andromeda para Facebook e Instagram Ads aplicado a infoproductos y quizzes como landing pages. El Método Andromeda se basa en: 1) TRÁFICO FRÍO con contenido de valor (educativo/entretenimiento) para generar awareness, 2) QUIZ como filtro de segmentación — el quiz clasifica al prospecto antes de mostrarle la oferta, 3) RESULTADO PERSONALIZADO que conecta el perfil del quiz directamente con el producto, 4) RETARGETING a quienes completaron el quiz pero no compraron. Estructura de campaña Andromeda: Campaña 1 (ABO - awareness): creativos de problema/curiosidad → quiz. Campaña 2 (CBO - conversión): retargeting a completados → carta de ventas. Audiencias: intereses amplios + LAL de compradores. Creativos: UGC, testimonios, antes/después. Cuando te pidan ayuda con Andromeda, pide: nicho, producto, presupuesto diario y objetivo. Luego entrega plan de campaña detallado con estructura, copies de anuncios y audiencias sugeridas. Responde en español.`
    },
    {
      id: 'prompts',
      label: '🧠 Prompt Builder',
      prompt: `Eres Lloyd, especialista en crear prompts de alta calidad para herramientas de IA (ChatGPT, Claude, Gemini) orientados a la creación de contenido para infoproductos y marketing digital en español. Creas prompts para: páginas de venta, cartas de ventas, secuencias de email, copies de anuncios, guiones de VSL, contenido de redes sociales, hooks virales, títulos de ebooks y cursos, y scripts de webinar. Cuando te pidan un prompt, entrega: el prompt completo listo para copiar y pegar, con variables entre [corchetes] para personalizar. Incluye instrucciones de uso. Responde en español.`
    },
    {
      id: 'copy',
      label: '✍️ Copywriter',
      prompt: `Eres Lloyd, copywriter experto en marketing para infoproductos latinoamericanos. Escribes titulares magnéticos, CTAs irresistibles, descripciones de producto, emails de venta, hooks para redes sociales y textos de alta conversión. Usas técnicas de persuasión: escasez, urgencia, prueba social, autoridad, reciprocidad. Tu tono es cercano, directo y aspiracional. Cuando te pidan un copy, pide el contexto (plataforma, producto, avatar) y entrega varias versiones para testear. Responde en español.`
    },
    {
      id: 'leads',
      label: '📈 Leads Analyst',
      prompt: `Eres Lloyd, experto en análisis de leads y estrategias de nurturing para infoproductos digitales. Ayudas a interpretar métricas del quiz (tasa de finalización, perfiles más frecuentes, conversión por perfil), segmentar contactos según su resultado, y crear secuencias de seguimiento por WhatsApp o email adaptadas a cada perfil. Cuando analices leads, pide los datos disponibles y entrega recomendaciones concretas y accionables. Responde en español.`
    },
  ];

  // ── Estado ────────────────────────────────────────────────
  const SESSIONS_KEY = 'lsa_sessions';
  let _sessions = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
  let _activeSession = null;
  let _currentMode = MODES[0];
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
  width: 56px; height: 56px; border-radius: 50%;
  background: linear-gradient(135deg, #2E5BFF 0%, #7c3aed 100%);
  border: none; cursor: pointer; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
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
  background: #0a0a14;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  box-shadow: 0 32px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(46,91,255,0.15), inset 0 1px 0 rgba(255,255,255,0.06);
  display: flex; flex-direction: column;
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  color: #fff;
  transition: box-shadow 0.2s;
  user-select: none;
}
#lsa-win.dragging { box-shadow: 0 48px 120px rgba(0,0,0,0.95); }

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
  background: rgba(255,255,255,0.02);
  border-bottom: 1px solid rgba(255,255,255,0.06);
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
  display: flex; gap: 4px; padding: 8px 12px 7px;
  background: rgba(0,0,0,0.3);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  overflow-x: auto; scrollbar-width: none;
}
#lsa-mode-tabs::-webkit-scrollbar { display: none; }
.lsa-tab {
  flex-shrink: 0; padding: 4px 11px; border-radius: 20px;
  font-size: 11px; font-weight: 700; cursor: pointer; border: none;
  background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.35);
  transition: all 0.15s; white-space: nowrap;
}
.lsa-tab:hover { background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.7); }
.lsa-tab.active {
  background: rgba(46,91,255,0.2); color: #7a9aff;
  border: 1px solid rgba(46,91,255,0.35);
}

/* ── Sessions panel ── */
#lsa-sessions-panel {
  border-bottom: 1px solid rgba(255,255,255,0.06);
  max-height: 180px; overflow-y: auto;
  background: rgba(0,0,0,0.4);
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
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
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
  padding: 10px 12px 12px; border-top: 1px solid rgba(255,255,255,0.06);
  display: flex; gap: 7px; align-items: flex-end;
  background: rgba(0,0,0,0.35);
}
#lsa-input {
  flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; padding: 9px 13px; color: #fff; font-size: 13px;
  font-family: inherit; resize: none; outline: none;
  max-height: 120px; min-height: 38px; line-height: 1.45;
  transition: border-color 0.18s, background 0.18s;
}
#lsa-input:focus { border-color: rgba(46,91,255,0.5); background: rgba(46,91,255,0.06); }
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
    const bx = window.innerWidth - 68;
    const by = window.innerHeight - 80;
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
    el.innerHTML = MODES.map(m => `
      <button class="lsa-tab ${m.id === _currentMode.id ? 'active' : ''}" onclick="LSA._selectMode('${m.id}')">
        ${m.label}
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
    'dashboard':    ['Analiza mis leads', 'Mejora mi quiz', 'Crea campaña Andromeda'],
    'generador-ia': ['Crea un quiz para mi nicho', 'Mejora mis perfiles de resultado', 'Dame un título irresistible'],
    'leads':        ['Segmenta mis leads', 'Secuencia de WhatsApp por perfil', 'Tasa de conversión baja, qué hago'],
    'precios':      ['¿Qué plan me conviene?', 'Diferencia entre Pro y Growth', '¿Vale la pena el Elite?'],
    'default':      ['Crea una oferta irresistible', 'Escríbeme una carta de ventas', 'Campaña con Método Andromeda'],
  };

  function _getChips() {
    const path = window.location.pathname;
    for (const [k, v] of Object.entries(PAGE_CHIPS)) {
      if (path.includes(k)) return v;
    }
    return PAGE_CHIPS.default;
  }

  function _renderMessages() {
    const el = document.getElementById('lsa-messages');
    if (!_activeSession || !_activeSession.messages.length) {
      el.innerHTML = `
        <div class="lsa-empty">
          <div class="lsa-empty-logo">✦</div>
          <h4>Hola, soy Lloyd</h4>
          <p>Tu asistente IA especializado en quizzes, marketing y ventas digitales. ¿En qué puedo ayudarte hoy?</p>
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

      try {
        // Solo mensajes válidos, sin errores anteriores
        const cleanMessages = _activeSession.messages
          .filter(m => !m._isError)
          .map(m => ({ role: m.role, content: m.content }));

        let reply = null;

        // ── 1. Intentar Groq (no necesita sesión Supabase) ──
        const groqKey = Settings.getGroqApiKey();
        if (groqKey) {
          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              max_tokens: 1024,
              messages: [{ role: 'system', content: _currentMode.prompt }, ...cleanMessages],
            }),
          });
          const groqData = await groqRes.json();
          if (groqRes.ok) reply = groqData.choices?.[0]?.message?.content;
        }

        // ── 2. Fallback: Claude proxy ──
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
            // Sin sesión válida: mostrar mensaje con links de acción
            _activeSession.messages.push({
              role: 'assistant',
              content: '⚠️ Tu sesión expiró o no tienes Groq configurado.\n\n**Opciones:**\n• [Iniciar sesión de nuevo](./login.html)\n• Añade tu API key de Groq en [Ajustes](./settings.html) para usar el asistente sin depender de la sesión.',
              _isError: true,
            });
            _isThinking = false;
            document.getElementById('lsa-send-btn').disabled = false;
            _renderMessages();
            return;
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

  // ── Init ──────────────────────────────────────────────────
  async function _checkNicheAssistantAccess() {
    // Asistente IA del nicho requiere Growth o superior (nicheAssistant: true)
    try {
      if (typeof Auth === 'undefined' || typeof DB === 'undefined') return false;
      const user = await Auth.user();
      if (!user) return false;
      let plan = 'free';
      try {
        const profile = await DB.profiles.get(user.id);
        plan = (profile && profile.plan) || 'free';
      } catch (_) {}
      const caps = (typeof getPlanCaps === 'function') ? getPlanCaps(plan) : null;
      return !!(caps && caps.nicheAssistant);
    } catch (_) { return false; }
  }

  async function init() {
    if (typeof Auth === 'undefined' || typeof SUPABASE_URL === 'undefined') return;
    // Gate: solo planes Growth y Elite pueden ver el asistente IA flotante
    const allowed = await _checkNicheAssistantAccess();
    if (!allowed) return;
    injectHTML();
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
