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
      prompt: `Eres el asistente de Luminous Studio. Ayudas a emprendedores digitales latinoamericanos con quizzes, marketing digital y la plataforma. Sé conciso y práctico. Responde siempre en español.`
    },
    {
      id: 'quiz',
      label: '🎯 Quiz Creator',
      prompt: `Eres un experto en crear quizzes de alta conversión para embudos de venta. Ayudas a diseñar preguntas, resultados, títulos y subtítulos irresistibles. Das ejemplos concretos y específicos. Responde en español.`
    },
    {
      id: 'copy',
      label: '✍️ Copywriter',
      prompt: `Eres un copywriter experto en marketing para infoproductos latinoamericanos. Escribes titulares, CTAs, descripciones y textos de venta de alta conversión. Usa lenguaje cercano y directo. Responde en español.`
    },
    {
      id: 'ads',
      label: '📊 Ads Advisor',
      prompt: `Eres un especialista en Facebook e Instagram Ads para infoproductos. Ayudas con estrategia de campañas, audiencias, creativos, presupuestos y optimización usando quizzes como landing pages. Responde en español.`
    },
    {
      id: 'leads',
      label: '📈 Leads Analyst',
      prompt: `Eres un experto en análisis de leads y estrategias de nurturing para infoproductos digitales. Ayudas a interpretar métricas, segmentar contactos y crear secuencias de email o WhatsApp. Responde en español.`
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
#lsa-root * { box-sizing: border-box; margin: 0; padding: 0; }
#lsa-win {
  position: fixed; z-index: 9999;
  width: 400px;
  background: rgba(13,13,20,0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(46,91,255,0.25);
  border-radius: 14px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04);
  display: flex; flex-direction: column;
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  color: #fff;
  transition: box-shadow 0.2s;
  user-select: none;
}
#lsa-win.dragging { box-shadow: 0 32px 100px rgba(0,0,0,0.85); }

/* Toolbar */
#lsa-toolbar {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 12px 9px;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  cursor: grab;
}
#lsa-toolbar:active { cursor: grabbing; }
.lsa-mode-btn {
  flex: 1; display: flex; align-items: center; gap-5px; gap: 5px;
  background: rgba(46,91,255,0.12); border: 1px solid rgba(46,91,255,0.22);
  border-radius: 8px; padding: 5px 10px; color: #a0b4ff;
  font-size: 12px; font-weight: 700; cursor: pointer;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  transition: background 0.15s;
}
.lsa-mode-btn:hover { background: rgba(46,91,255,0.22); }
.lsa-tb-btn {
  width: 28px; height: 28px; border-radius: 7px; border: none;
  background: rgba(255,255,255,0.05); color: #adaaaa; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; flex-shrink: 0; transition: background 0.15s, color 0.15s;
}
.lsa-tb-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
.lsa-tb-btn.active { background: rgba(46,91,255,0.2); color: #7a9aff; }
.lsa-tb-sep { width: 1px; height: 16px; background: rgba(255,255,255,0.08); flex-shrink: 0; }

/* Mode dropdown */
#lsa-mode-dropdown {
  position: absolute; left: 12px; top: 48px; z-index: 10;
  background: #131320; border: 1px solid rgba(46,91,255,0.3);
  border-radius: 10px; overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.6);
  min-width: 200px;
}
.lsa-mode-opt {
  padding: 9px 14px; font-size: 12px; font-weight: 600; cursor: pointer;
  color: #adaaaa; transition: background 0.12s, color 0.12s;
  display: flex; align-items: center; gap: 8px;
}
.lsa-mode-opt:hover { background: rgba(46,91,255,0.15); color: #fff; }
.lsa-mode-opt.selected { color: #7a9aff; background: rgba(46,91,255,0.1); }

/* Sessions panel */
#lsa-sessions-panel {
  border-bottom: 1px solid rgba(255,255,255,0.06);
  max-height: 200px; overflow-y: auto;
  background: rgba(0,0,0,0.3);
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

/* Messages */
#lsa-messages {
  flex: 1; overflow-y: auto; padding: 14px 12px;
  display: flex; flex-direction: column; gap: 10px;
  min-height: 220px; max-height: 360px;
  scrollbar-width: thin; scrollbar-color: #333 transparent;
}
#lsa-messages::-webkit-scrollbar { width: 3px; }
#lsa-messages::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
.lsa-msg { display: flex; gap: 7px; animation: lsa-in 0.18s ease both; }
@keyframes lsa-in { from { opacity:0; transform: translateY(5px); } to { opacity:1; } }
.lsa-msg.user { flex-direction: row-reverse; }
.lsa-av {
  width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; margin-top: 2px;
}
.lsa-av.ai { background: rgba(46,91,255,0.2); border: 1px solid rgba(46,91,255,0.3); font-size: 13px; }
.lsa-av.me { background: rgba(105,246,184,0.15); border: 1px solid rgba(105,246,184,0.25); color: #69f6b8; font-size: 9px; }
.lsa-bubble {
  max-width: calc(100% - 36px); padding: 8px 11px; border-radius: 11px;
  font-size: 12.5px; line-height: 1.55; color: #ddd;
}
.lsa-msg.ai .lsa-bubble {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07);
  border-top-left-radius: 3px;
}
.lsa-msg.user .lsa-bubble {
  background: rgba(46,91,255,0.18); border: 1px solid rgba(46,91,255,0.22);
  border-top-right-radius: 3px; color: #b8c8ff;
}
.lsa-bubble strong { color: #fff; }
.lsa-bubble code { background: rgba(255,255,255,0.08); padding: 1px 4px; border-radius: 3px; font-size: 11px; }
.lsa-thinking .lsa-bubble { display: flex; gap: 4px; align-items: center; padding: 11px 14px; }
.lsa-dot { width: 6px; height: 6px; border-radius: 50%; background: #555; animation: lsa-bounce 1.1s infinite; }
.lsa-dot:nth-child(2) { animation-delay: .18s; }
.lsa-dot:nth-child(3) { animation-delay: .36s; }
@keyframes lsa-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }

/* Empty state */
.lsa-empty {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 8px; padding: 20px; text-align: center;
}
.lsa-empty-icon { font-size: 28px; }
.lsa-empty h4 { font-size: 13px; font-weight: 800; color: #fff; }
.lsa-empty p { font-size: 11px; color: #555; max-width: 240px; line-height: 1.5; }
.lsa-chips { display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; margin-top: 6px; }
.lsa-chip {
  font-size: 11px; font-weight: 600; padding: 4px 9px;
  background: rgba(46,91,255,0.08); border: 1px solid rgba(46,91,255,0.2);
  border-radius: 20px; color: #7a9aff; cursor: pointer; transition: all 0.12s;
}
.lsa-chip:hover { background: rgba(46,91,255,0.18); }

/* Input */
#lsa-inputbar {
  padding: 9px 10px; border-top: 1px solid rgba(255,255,255,0.06);
  display: flex; gap: 6px; align-items: flex-end; background: rgba(0,0,0,0.2);
}
#lsa-input {
  flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 9px; padding: 8px 11px; color: #fff; font-size: 12.5px;
  font-family: inherit; resize: none; outline: none;
  max-height: 100px; min-height: 36px; line-height: 1.4;
  transition: border-color 0.15s;
}
#lsa-input:focus { border-color: rgba(46,91,255,0.5); }
#lsa-input::placeholder { color: #555; }
.lsa-input-btn {
  width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0; border: none;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: 16px; align-self: flex-end; transition: all 0.15s;
}
#lsa-mic-btn { background: rgba(255,255,255,0.06); color: #767575; }
#lsa-mic-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
#lsa-mic-btn.listening { background: rgba(255,110,132,0.15); color: #ff6e84; animation: lsa-pulse 1s infinite; }
@keyframes lsa-pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
#lsa-send-btn { background: #2E5BFF; color: #fff; }
#lsa-send-btn:hover { background: #1a3fd4; }
#lsa-send-btn:disabled { background: #222; color: #444; cursor: not-allowed; }

/* Minimized */
#lsa-win.minimized #lsa-messages,
#lsa-win.minimized #lsa-inputbar,
#lsa-win.minimized #lsa-sessions-panel { display: none !important; }

/* Float button */
#lsa-float-btn {
  position: fixed; z-index: 9998;
  width: 48px; height: 48px; border-radius: 50%;
  background: linear-gradient(135deg,#2E5BFF,#1a3fd4);
  border: none; cursor: pointer; color: #fff;
  box-shadow: 0 8px 30px rgba(46,91,255,0.45);
  display: flex; align-items: center; justify-content: center; font-size: 20px;
  transition: transform 0.18s, box-shadow 0.18s;
}
#lsa-float-btn:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(46,91,255,0.6); }
#lsa-float-btn .lsa-badge {
  position: absolute; top: 3px; right: 3px; width: 9px; height: 9px;
  border-radius: 50%; background: #69f6b8; border: 2px solid #0d0d14;
}
</style>

<!-- Botón flotante -->
<button id="lsa-float-btn" title="Asistente IA · Ctrl+Space">
  <span class="material-symbols-outlined" style="font-size:22px">auto_awesome</span>
  <span class="lsa-badge"></span>
</button>

<!-- Ventana -->
<div id="lsa-win" style="display:none;">

  <!-- Toolbar / Drag handle -->
  <div id="lsa-toolbar">
    <button class="lsa-mode-btn" id="lsa-mode-label" onclick="LSA._toggleModeMenu(event)">✨ General ▾</button>
    <div class="lsa-tb-sep"></div>
    <button class="lsa-tb-btn" id="lsa-sessions-btn" onclick="LSA._toggleSessions()" title="Sesiones">
      <span class="material-symbols-outlined" style="font-size:16px">history</span>
    </button>
    <button class="lsa-tb-btn" onclick="LSA._newChat()" title="Nueva conversación">
      <span class="material-symbols-outlined" style="font-size:16px">add</span>
    </button>
    <div class="lsa-tb-sep"></div>
    <button class="lsa-tb-btn" onclick="LSA._toggleMinimize()" id="lsa-min-btn" title="Minimizar">
      <span class="material-symbols-outlined" style="font-size:16px">remove</span>
    </button>
    <button class="lsa-tb-btn" onclick="LSA.hide()" title="Cerrar">
      <span class="material-symbols-outlined" style="font-size:16px">close</span>
    </button>
  </div>

  <!-- Mode dropdown -->
  <div id="lsa-mode-dropdown" style="display:none;"></div>

  <!-- Sessions panel -->
  <div id="lsa-sessions-panel" style="display:none;"></div>

  <!-- Messages -->
  <div id="lsa-messages"></div>

  <!-- Input bar -->
  <div id="lsa-inputbar">
    <textarea id="lsa-input" placeholder="Escribe o usa el micrófono..." rows="1"
      onkeydown="LSA._key(event)" oninput="LSA._resize(this)"></textarea>
    <button class="lsa-input-btn" id="lsa-mic-btn" onclick="LSA._toggleVoice()" title="Voz">
      <span class="material-symbols-outlined" style="font-size:17px">mic</span>
    </button>
    <button class="lsa-input-btn" id="lsa-send-btn" onclick="LSA.send()" title="Enviar">
      <span class="material-symbols-outlined" style="font-size:17px">send</span>
    </button>
  </div>
</div>`;
    document.body.appendChild(el);

    _initDrag();
    _initPosition();
    _renderModeMenu();
    _renderMessages();

    document.addEventListener('click', (e) => {
      const dd = document.getElementById('lsa-mode-dropdown');
      if (dd && !dd.contains(e.target) && e.target.id !== 'lsa-mode-label') dd.style.display = 'none';
    });
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
    const toolbar = document.getElementById('lsa-toolbar');
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
  function _renderModeMenu() {
    const dd = document.getElementById('lsa-mode-dropdown');
    dd.innerHTML = MODES.map(m => `
      <div class="lsa-mode-opt ${m.id === _currentMode.id ? 'selected' : ''}" onclick="LSA._selectMode('${m.id}')">
        ${m.label}
      </div>`).join('');
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
    'dashboard':    ['¿Cómo mejoro mi quiz?', 'Ideas para Ads', '¿Por qué pocos leads?'],
    'generador-ia': ['Mejora este título', 'Ideas de resultados', 'Mejor CTA para mi quiz'],
    'leads':        ['¿Qué hago con mis leads?', 'Cómo segmentarlos', 'Secuencia de emails'],
    'default':      ['¿Cómo empezar?', '¿Qué es un quiz embudo?', 'Tips de conversión'],
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
          <div class="lsa-empty-icon">✨</div>
          <h4>¿En qué te ayudo?</h4>
          <p>Modo activo: <strong>${_currentMode.label}</strong></p>
          <div class="lsa-chips">
            ${_getChips().map(c => `<button class="lsa-chip" onclick="LSA._chip('${c.replace(/'/g,"\\'")}')">${c}</button>`).join('')}
          </div>
        </div>`;
      return;
    }

    el.innerHTML = _activeSession.messages.map(m => {
      const isUser = m.role === 'user';
      return `<div class="lsa-msg ${isUser ? 'user' : 'ai'}">
        <div class="lsa-av ${isUser ? 'me' : 'ai'}">${isUser ? 'TÚ' : '✨'}</div>
        <div class="lsa-bubble">${_md(m.content)}</div>
      </div>`;
    }).join('');

    if (_isThinking) {
      el.innerHTML += `<div class="lsa-msg ai lsa-thinking">
        <div class="lsa-av ai">✨</div>
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

    _toggleModeMenu(e) {
      e.stopPropagation();
      const dd = document.getElementById('lsa-mode-dropdown');
      dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
    },

    _selectMode(id) {
      _currentMode = MODES.find(m => m.id === id) || MODES[0];
      document.getElementById('lsa-mode-label').textContent = _currentMode.label + ' ▾';
      document.getElementById('lsa-mode-dropdown').style.display = 'none';
      _renderModeMenu();
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
      document.getElementById('lsa-mode-label').textContent = _currentMode.label + ' ▾';
      _renderModeMenu();
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
  function init() {
    if (typeof Auth === 'undefined' || typeof SUPABASE_URL === 'undefined') return;
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
