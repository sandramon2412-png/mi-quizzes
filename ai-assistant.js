// ============================================================
// Luminous Studio — Floating AI Assistant
// Drop <script src="./ai-assistant.js"></script> in any page
// Requires: supabase-config.js + app.js already loaded
// ============================================================

(function () {
  'use strict';

  // ── Context detection ──────────────────────────────────────
  const PAGE_CONTEXTS = {
    'dashboard':     'El usuario está en el Dashboard, donde ve sus quizzes y mini-apps.',
    'generador-ia':  'El usuario está en el editor de quizzes, creando o editando un quiz con IA.',
    'leads':         'El usuario está revisando sus leads (contactos capturados por sus quizzes).',
    'plantillas':    'El usuario está explorando las plantillas de quizzes disponibles.',
    'settings':      'El usuario está en los ajustes de su cuenta.',
    'precios':       'El usuario está viendo los planes y precios.',
    'resultado-quiz':'El usuario está viendo el resultado de un quiz.',
    'quiz':          'El usuario está tomando (respondiendo) un quiz.',
  };

  function getPageContext() {
    const path = window.location.pathname;
    for (const [key, ctx] of Object.entries(PAGE_CONTEXTS)) {
      if (path.includes(key)) return ctx;
    }
    return 'El usuario está navegando por Luminous Studio.';
  }

  const SYSTEM_PROMPT = `Eres el asistente de IA de Luminous Studio, una plataforma SaaS para crear quizzes interactivos y mini-apps orientados a embudos de venta con Facebook Ads y marketing digital.

Tu rol: ayudar al usuario a sacar el máximo provecho de la plataforma. Eres conciso, práctico y hablas en español con un tono profesional pero cercano.

Contexto de la sesión actual:
- ${getPageContext()}
- La plataforma permite crear quizzes con IA (Claude/Groq), capturar leads, integrar Meta Pixel y ver analytics.
- Los usuarios son emprendedores digitales latinoamericanos.

Áreas en las que puedes ayudar:
1. Crear y optimizar quizzes para alta conversión
2. Estrategia de Facebook/Meta Ads con quizzes como landing
3. Copywriting: títulos, preguntas, resultados y CTAs
4. Configuración técnica (Meta Pixel, redirects, WhatsApp)
5. Estrategia de marketing para nichos específicos
6. Interpretar métricas y leads
7. Cualquier duda sobre el uso de la plataforma

Cuando des consejos de copywriting o estructura de quiz, sé MUY específico y usa ejemplos concretos.
Si no sabes algo, dilo con honestidad.
Responde siempre en español. Usa markdown básico (negritas, listas) cuando añada claridad.`;

  // ── State ─────────────────────────────────────────────────
  let _history = []; // { role: 'user'|'assistant', content: string }
  let _isOpen = false;
  let _isThinking = false;

  // ── HTML injection ─────────────────────────────────────────
  function injectHTML() {
    const html = `
    <!-- AI Assistant Styles -->
    <style id="lsa-styles">
      #lsa-btn {
        position: fixed; bottom: 88px; right: 20px; z-index: 200;
        width: 52px; height: 52px; border-radius: 50%;
        background: linear-gradient(135deg, #2E5BFF 0%, #1a3fd4 100%);
        border: none; cursor: pointer; color: white;
        box-shadow: 0 8px 32px rgba(46,91,255,0.4);
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      #lsa-btn:hover { transform: scale(1.08); box-shadow: 0 12px 40px rgba(46,91,255,0.55); }
      #lsa-btn .lsa-icon { font-size: 22px; transition: opacity 0.15s; }
      #lsa-btn .lsa-pulse {
        position: absolute; top: 4px; right: 4px;
        width: 10px; height: 10px; border-radius: 50%;
        background: #69f6b8; box-shadow: 0 0 0 2px #0e0e0e;
        animation: lsa-pulse 2s infinite;
      }
      @keyframes lsa-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50%       { transform: scale(1.2); opacity: 0.7; }
      }

      #lsa-panel {
        position: fixed; top: 0; right: 0; bottom: 0; z-index: 199;
        width: min(420px, 100vw);
        background: #131313; border-left: 1px solid rgba(255,255,255,0.07);
        display: flex; flex-direction: column;
        transform: translateX(100%); transition: transform 0.28s cubic-bezier(0.16,1,0.3,1);
        box-shadow: -20px 0 60px rgba(0,0,0,0.6);
      }
      #lsa-panel.open { transform: translateX(0); }

      .lsa-header {
        display: flex; align-items: center; gap: 12px;
        padding: 16px 16px 14px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        background: #0e0e0e;
      }
      .lsa-header-icon {
        width: 36px; height: 36px; border-radius: 10px;
        background: linear-gradient(135deg, rgba(46,91,255,0.2), rgba(46,91,255,0.05));
        border: 1px solid rgba(46,91,255,0.3);
        display: flex; align-items: center; justify-content: center;
        font-size: 18px;
      }
      .lsa-header-title { font-weight: 800; font-size: 14px; color: #fff; }
      .lsa-header-sub { font-size: 11px; color: #adaaaa; margin-top: 1px; }
      .lsa-header-actions { margin-left: auto; display: flex; gap: 6px; }
      .lsa-icon-btn {
        width: 30px; height: 30px; border-radius: 8px;
        background: transparent; border: none; cursor: pointer; color: #adaaaa;
        display: flex; align-items: center; justify-content: center;
        font-size: 18px; transition: background 0.15s, color 0.15s;
      }
      .lsa-icon-btn:hover { background: rgba(255,255,255,0.07); color: #fff; }

      #lsa-messages {
        flex: 1; overflow-y: auto; padding: 16px; display: flex;
        flex-direction: column; gap: 12px;
        scrollbar-width: thin; scrollbar-color: #484847 transparent;
      }
      #lsa-messages::-webkit-scrollbar { width: 3px; }
      #lsa-messages::-webkit-scrollbar-thumb { background: #484847; border-radius: 10px; }

      .lsa-msg {
        display: flex; gap: 8px; animation: lsa-fadein 0.2s ease both;
      }
      @keyframes lsa-fadein { from { opacity:0; transform: translateY(6px); } to { opacity:1; } }

      .lsa-msg.user { flex-direction: row-reverse; }
      .lsa-avatar {
        width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 13px; font-weight: 800; margin-top: 2px;
      }
      .lsa-avatar.ai {
        background: linear-gradient(135deg, rgba(46,91,255,0.25), rgba(46,91,255,0.05));
        border: 1px solid rgba(46,91,255,0.3); color: #2E5BFF;
        font-size: 15px;
      }
      .lsa-avatar.user-av { background: rgba(105,246,184,0.15); border: 1px solid rgba(105,246,184,0.3); color: #69f6b8; font-size: 11px; }
      .lsa-bubble {
        max-width: calc(100% - 44px);
        padding: 10px 13px; border-radius: 14px;
        font-size: 13px; line-height: 1.55; color: #e8e8e8;
      }
      .lsa-msg.ai .lsa-bubble {
        background: #1a1a1a; border: 1px solid rgba(255,255,255,0.06);
        border-top-left-radius: 4px;
      }
      .lsa-msg.user .lsa-bubble {
        background: rgba(46,91,255,0.18); border: 1px solid rgba(46,91,255,0.25);
        border-top-right-radius: 4px; color: #c8d4ff;
      }
      .lsa-bubble strong { color: #fff; }
      .lsa-bubble ul, .lsa-bubble ol { padding-left: 18px; margin: 4px 0; }
      .lsa-bubble li { margin: 2px 0; }
      .lsa-bubble code { background: rgba(255,255,255,0.08); padding: 1px 5px; border-radius: 4px; font-size: 12px; }

      .lsa-thinking .lsa-bubble {
        display: flex; gap: 5px; align-items: center; padding: 13px 14px;
      }
      .lsa-dot {
        width: 7px; height: 7px; border-radius: 50%; background: #adaaaa;
        animation: lsa-bounce 1.2s infinite;
      }
      .lsa-dot:nth-child(2) { animation-delay: 0.2s; }
      .lsa-dot:nth-child(3) { animation-delay: 0.4s; }
      @keyframes lsa-bounce {
        0%, 80%, 100% { transform: translateY(0); }
        40%            { transform: translateY(-5px); }
      }

      .lsa-suggestions {
        display: flex; flex-wrap: wrap; gap: 6px;
        padding: 0 16px 8px;
      }
      .lsa-suggestion {
        font-size: 11px; font-weight: 600; padding: 5px 10px;
        background: rgba(46,91,255,0.08); border: 1px solid rgba(46,91,255,0.2);
        border-radius: 20px; color: #7a9aff; cursor: pointer; transition: all 0.15s;
        white-space: nowrap;
      }
      .lsa-suggestion:hover { background: rgba(46,91,255,0.16); border-color: rgba(46,91,255,0.4); color: #aac0ff; }

      .lsa-input-row {
        padding: 12px 14px; border-top: 1px solid rgba(255,255,255,0.06);
        display: flex; gap: 8px; align-items: flex-end; background: #0e0e0e;
      }
      #lsa-input {
        flex: 1; background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px; padding: 10px 13px; color: #fff; font-size: 13px;
        font-family: 'Plus Jakarta Sans', sans-serif; resize: none; outline: none;
        max-height: 120px; min-height: 40px; line-height: 1.45;
        transition: border-color 0.15s;
      }
      #lsa-input:focus { border-color: rgba(46,91,255,0.5); }
      #lsa-input::placeholder { color: #767575; }
      #lsa-send {
        width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
        background: #2E5BFF; border: none; cursor: pointer; color: white;
        display: flex; align-items: center; justify-content: center; font-size: 18px;
        transition: background 0.15s, transform 0.1s; align-self: flex-end;
      }
      #lsa-send:hover { background: #1a3fd4; }
      #lsa-send:active { transform: scale(0.94); }
      #lsa-send:disabled { background: #262626; color: #484847; cursor: not-allowed; transform: none; }

      .lsa-empty {
        flex: 1; display: flex; flex-direction: column; align-items: center;
        justify-content: center; gap: 12px; text-align: center; padding: 20px;
      }
      .lsa-empty-icon {
        width: 52px; height: 52px; border-radius: 16px;
        background: linear-gradient(135deg, rgba(46,91,255,0.15), rgba(46,91,255,0.03));
        border: 1px solid rgba(46,91,255,0.2);
        display: flex; align-items: center; justify-content: center; font-size: 24px;
      }
      .lsa-empty h3 { font-size: 15px; font-weight: 800; color: #fff; }
      .lsa-empty p { font-size: 12px; color: #767575; max-width: 260px; line-height: 1.5; }
    </style>

    <!-- Floating Button -->
    <button id="lsa-btn" onclick="LSA.toggle()" title="Asistente IA (Ctrl+Space)">
      <span class="material-symbols-outlined lsa-icon" id="lsa-btn-icon">auto_awesome</span>
      <span class="lsa-pulse"></span>
    </button>

    <!-- Chat Panel -->
    <div id="lsa-panel">
      <div class="lsa-header">
        <div class="lsa-header-icon">✨</div>
        <div>
          <div class="lsa-header-title">Asistente Luminous</div>
          <div class="lsa-header-sub" id="lsa-status-text">Listo para ayudarte</div>
        </div>
        <div class="lsa-header-actions">
          <button class="lsa-icon-btn" onclick="LSA.clear()" title="Nueva conversación">
            <span class="material-symbols-outlined" style="font-size:17px">refresh</span>
          </button>
          <button class="lsa-icon-btn" onclick="LSA.toggle()" title="Cerrar">
            <span class="material-symbols-outlined" style="font-size:17px">close</span>
          </button>
        </div>
      </div>

      <div id="lsa-messages"></div>

      <!-- Suggestion chips (only shown when empty) -->
      <div class="lsa-suggestions" id="lsa-suggestions"></div>

      <div class="lsa-input-row">
        <textarea id="lsa-input" placeholder="Pregúntame cualquier cosa..." rows="1"
          onkeydown="LSA.handleKey(event)" oninput="LSA.autoResize(this)"></textarea>
        <button id="lsa-send" onclick="LSA.send()" title="Enviar">
          <span class="material-symbols-outlined" style="font-size:18px">send</span>
        </button>
      </div>
    </div>`;

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
  }

  // ── Suggestion chips per page ──────────────────────────────
  const SUGGESTIONS = {
    'dashboard':    ['¿Cómo mejorar mi quiz?', '¿Por qué pocos leads?', 'Estrategia para Ads'],
    'generador-ia': ['Mejora este título', '¿Cuántas preguntas?', 'Ideas de resultados', 'Mejor CTA'],
    'leads':        ['¿Qué hago con mis leads?', 'Cómo segmentarlos', 'Email de bienvenida'],
    'settings':     ['¿Para qué sirve Groq?', 'Cómo conectar Meta Pixel'],
    'default':      ['¿Cómo empezar?', '¿Qué es un quiz embudo?', 'Tips de conversión'],
  };

  function getSuggestions() {
    const path = window.location.pathname;
    for (const [key, chips] of Object.entries(SUGGESTIONS)) {
      if (path.includes(key)) return chips;
    }
    return SUGGESTIONS.default;
  }

  // ── Render ─────────────────────────────────────────────────
  function renderMessages() {
    const container = document.getElementById('lsa-messages');
    const suggestionsEl = document.getElementById('lsa-suggestions');

    if (!_history.length) {
      container.innerHTML = `
        <div class="lsa-empty">
          <div class="lsa-empty-icon">✨</div>
          <h3>Hola, soy tu asistente</h3>
          <p>Puedo ayudarte con quizzes, copywriting, estrategia de Ads, leads y todo lo de Luminous Studio.</p>
        </div>`;
      // Show suggestions
      suggestionsEl.innerHTML = getSuggestions().map(s =>
        `<button class="lsa-suggestion" onclick="LSA.sendText('${s.replace(/'/g, "\\'")}'">${s}</button>`
      ).join('');
      return;
    }

    suggestionsEl.innerHTML = '';
    container.innerHTML = _history.map(m => renderMessage(m)).join('');

    if (_isThinking) {
      container.innerHTML += `
        <div class="lsa-msg ai lsa-thinking">
          <div class="lsa-avatar ai">✨</div>
          <div class="lsa-bubble">
            <div class="lsa-dot"></div>
            <div class="lsa-dot"></div>
            <div class="lsa-dot"></div>
          </div>
        </div>`;
    }

    container.scrollTop = container.scrollHeight;
  }

  function renderMessage(m) {
    const isUser = m.role === 'user';
    const html = markdownToHTML(m.content);
    return `
      <div class="lsa-msg ${isUser ? 'user' : 'ai'}">
        <div class="lsa-avatar ${isUser ? 'user-av' : 'ai'}">${isUser ? 'TU' : '✨'}</div>
        <div class="lsa-bubble">${html}</div>
      </div>`;
  }

  // Very lightweight markdown rendering
  function markdownToHTML(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^### (.+)$/gm, '<strong>$1</strong>')
      .replace(/^## (.+)$/gm, '<strong>$1</strong>')
      .replace(/^# (.+)$/gm, '<strong>$1</strong>')
      .replace(/^\* (.+)$/gm, '• $1')
      .replace(/^- (.+)$/gm, '• $1')
      .replace(/^\d+\. (.+)$/gm, (_, p1) => `• ${p1}`)
      .replace(/\n{2,}/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  function setStatus(text) {
    const el = document.getElementById('lsa-status-text');
    if (el) el.textContent = text;
  }

  // ── Public API ─────────────────────────────────────────────
  window.LSA = {
    toggle() {
      _isOpen = !_isOpen;
      const panel = document.getElementById('lsa-panel');
      const icon  = document.getElementById('lsa-btn-icon');
      if (_isOpen) {
        panel.classList.add('open');
        icon.textContent = 'close';
        renderMessages();
        setTimeout(() => document.getElementById('lsa-input')?.focus(), 300);
      } else {
        panel.classList.remove('open');
        icon.textContent = 'auto_awesome';
      }
    },

    clear() {
      _history = [];
      setStatus('Listo para ayudarte');
      renderMessages();
      document.getElementById('lsa-input')?.focus();
    },

    handleKey(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.send();
      }
    },

    autoResize(el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    },

    sendText(text) {
      const input = document.getElementById('lsa-input');
      if (input) { input.value = text; this.autoResize(input); }
      this.send();
    },

    async send() {
      const input = document.getElementById('lsa-input');
      const text  = (input?.value || '').trim();
      if (!text || _isThinking) return;

      input.value = '';
      input.style.height = 'auto';

      _history.push({ role: 'user', content: text });
      _isThinking = true;
      renderMessages();

      const sendBtn = document.getElementById('lsa-send');
      if (sendBtn) sendBtn.disabled = true;
      setStatus('Pensando...');

      try {
        const session = await Auth.session();
        if (!session) throw new Error('Debes iniciar sesión para usar el asistente.');

        const res = await fetch(`${SUPABASE_URL}/functions/v1/claude-proxy`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: _history,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error?.message || `Error ${res.status}`);
        }

        const data = await res.json();
        const reply = data.content?.[0]?.text || 'No pude generar una respuesta.';
        _history.push({ role: 'assistant', content: reply });
        setStatus('Listo para ayudarte');

      } catch (err) {
        _history.push({ role: 'assistant', content: `**Error:** ${err.message}` });
        setStatus('Error — intenta de nuevo');
      } finally {
        _isThinking = false;
        if (sendBtn) sendBtn.disabled = false;
        renderMessages();
        input?.focus();
      }
    },
  };

  // ── Keyboard shortcut: Ctrl/Cmd + Space ───────────────────
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
      e.preventDefault();
      LSA.toggle();
    }
    if (e.key === 'Escape' && _isOpen) {
      LSA.toggle();
    }
  });

  // ── Init ──────────────────────────────────────────────────
  function init() {
    // Inject only if Supabase and Auth are available
    if (typeof Auth === 'undefined' || typeof SUPABASE_URL === 'undefined') {
      console.warn('[LSA] Requires supabase-config.js to be loaded first.');
      return;
    }
    injectHTML();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
