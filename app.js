// ============================================================
// Luminous Studio — Core App Library
// Storage, Claude API, Quiz Logic, Analytics
// ============================================================

// ── Storage keys ──────────────────────────────────────────
const KEYS = {
  SETTINGS: 'ls_settings',
  QUIZZES:  'ls_quizzes',
  MINI_APPS: 'ls_mini_apps',
  CURRENT_QUIZ_ID: 'ls_current_quiz_id',
  CURRENT_ANSWERS: 'ls_current_answers',
  ANALYTICS: 'ls_analytics',
};

// ── Low-level storage ──────────────────────────────────────
const Store = {
  get(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

// ── Settings ───────────────────────────────────────────────
const Settings = {
  get() {
    return Store.get(KEYS.SETTINGS) || {
      plan: 'free',
      name: 'The Curator',
      email: '',
      bio: '',
      claudeApiKey: '',
      groqApiKey: '',
      notifications: { sales: true, quizCompleted: true, weekly: false },
    };
  },
  save(data) {
    Store.set(KEYS.SETTINGS, { ...this.get(), ...data });
  },
  getApiKey() {
    return this.get().claudeApiKey || '';
  },
  getGroqApiKey() {
    return this.get().groqApiKey || '';
  },
};

// ── Quizzes CRUD ───────────────────────────────────────────
const Quizzes = {
  getAll() {
    return Store.get(KEYS.QUIZZES) || [];
  },
  get(id) {
    return this.getAll().find(q => q.id === id) || null;
  },
  save(quiz) {
    const all = this.getAll();
    const idx = all.findIndex(q => q.id === quiz.id);
    if (idx >= 0) all[idx] = quiz;
    else all.unshift(quiz);
    Store.set(KEYS.QUIZZES, all);
    return quiz;
  },
  create(data) {
    const quiz = {
      id: crypto.randomUUID(),
      created: new Date().toISOString(),
      status: 'draft',
      ...data,
    };
    return this.save(quiz);
  },
  delete(id) {
    Store.set(KEYS.QUIZZES, this.getAll().filter(q => q.id !== id));
  },
  // Plan limits
  canCreate() {
    const plan = Settings.get().plan;
    const count = this.getAll().length;
    if (plan === 'free') return count < 3;
    if (plan === 'pro') return count < 999;
    return true;
  },
};

// ── Mini-Apps CRUD ─────────────────────────────────────────
const MiniApps = {
  getAll() { return Store.get(KEYS.MINI_APPS) || []; },
  get(id) { return this.getAll().find(a => a.id === id) || null; },
  save(app) {
    const all = this.getAll();
    const idx = all.findIndex(a => a.id === app.id);
    if (idx >= 0) all[idx] = app;
    else all.unshift(app);
    Store.set(KEYS.MINI_APPS, all);
    return app;
  },
  create(data) {
    const app = {
      id: crypto.randomUUID(),
      created: new Date().toISOString(),
      status: 'active',
      accessCodes: [],
      ...data,
    };
    return this.save(app);
  },
  delete(id) {
    Store.set(KEYS.MINI_APPS, this.getAll().filter(a => a.id !== id));
  },
  validateCode(id, code) {
    const app = this.get(id);
    if (!app) return false;
    if (!app.accessCodes || app.accessCodes.length === 0) return true;
    return app.accessCodes.map(c => c.trim().toLowerCase()).includes(code.trim().toLowerCase());
  },
};

// ── Analytics ──────────────────────────────────────────────
const Analytics = {
  getAll() { return Store.get(KEYS.ANALYTICS) || {}; },
  _save(data) { Store.set(KEYS.ANALYTICS, data); },
  _ensureQuiz(id) {
    const all = this.getAll();
    if (!all[id]) all[id] = { views: 0, completions: 0, profileHits: {} };
    return all;
  },
  trackView(quizId) {
    const all = this._ensureQuiz(quizId);
    all[quizId].views++;
    this._save(all);
  },
  trackCompletion(quizId, profileId) {
    const all = this._ensureQuiz(quizId);
    all[quizId].completions++;
    all[quizId].profileHits[profileId] = (all[quizId].profileHits[profileId] || 0) + 1;
    this._save(all);
  },
  get(quizId) {
    return (this.getAll())[quizId] || { views: 0, completions: 0, profileHits: {} };
  },
  conversionRate(quizId) {
    const a = this.get(quizId);
    if (!a.views) return 0;
    return Math.round((a.completions / a.views) * 100);
  },
};

// ── Session (current quiz run) ─────────────────────────────
const Session = {
  setCurrentQuiz(id) { Store.set(KEYS.CURRENT_QUIZ_ID, id); },
  getCurrentQuizId() { return Store.get(KEYS.CURRENT_QUIZ_ID); },
  setAnswers(answers) { Store.set(KEYS.CURRENT_ANSWERS, answers); },
  getAnswers() { return Store.get(KEYS.CURRENT_ANSWERS) || []; },
  clear() {
    localStorage.removeItem(KEYS.CURRENT_QUIZ_ID);
    localStorage.removeItem(KEYS.CURRENT_ANSWERS);
  },
};

// ── Profile calculation ────────────────────────────────────
function calculateProfile(quiz, answers) {
  const scores = {};
  quiz.profiles.forEach(p => { scores[p.id] = 0; });

  answers.forEach(({ questionId, optionIndex }) => {
    const q = quiz.questions.find(q => q.id === questionId);
    if (!q) return;
    const opt = q.options[optionIndex];
    if (!opt || !opt.profiles) return;
    opt.profiles.forEach(pid => {
      if (scores[pid] !== undefined) scores[pid]++;
    });
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topId = sorted[0]?.[0];
  return quiz.profiles.find(p => p.id === topId) || quiz.profiles[0];
}

// ── Claude API ─────────────────────────────────────────────
const Claude = {
  async _call(messages, maxTokens = 3000) {
    const doRequest = async (token) => fetch(`${SUPABASE_URL}/functions/v1/claude-proxy`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: maxTokens, messages }),
    });

    let token = await Auth.getToken();
    if (!token) throw new Error('NOT_AUTHENTICATED');

    let res = await doRequest(token);

    // On 401, force a fresh session refresh and retry once
    if (res.status === 401) {
      try {
        const { data, error } = await db.auth.refreshSession();
        if (!error && data.session?.access_token) {
          token = data.session.access_token;
          res = await doRequest(token);
        }
      } catch {}
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Error ${res.status}`);
    }
    const data = await res.json();
    return data.content[0].text;
  },

  _parseJSON(text) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Respuesta de IA inválida');
    return JSON.parse(match[0]);
  },

  async generateQuiz(productName, description, niche) {
    const prompt = `Eres un experto en marketing digital, copywriting de alta conversión y creación de quizzes para Facebook Ads y embudos de venta.

TAREA: Crea un quiz interactivo de alta conversión en español para este producto digital:
- Nombre: ${productName}
- Descripción: ${description || 'Producto digital premium'}
- Nicho: ${niche || 'marketing digital / infoproductos'}

REQUISITOS DEL QUIZ:
• 5 preguntas muy específicas del nicho (no genéricas)
• Cada pregunta con exactamente 4 opciones de respuesta
• Las opciones deben revelar el perfil del comprador
• 3 perfiles de resultado distintos y muy concretos
• Lenguaje conversacional y cercano (tuteo)
• Optimizado para generar curiosidad y que el usuario quiera ver su resultado

RESPONDE SOLO CON JSON VÁLIDO, sin texto adicional:
{
  "title": "título del quiz (máx 60 chars, con gancho)",
  "subtitle": "subtítulo persuasivo de 1 línea",
  "estimatedMinutes": 2,
  "questions": [
    {
      "id": "q1",
      "text": "texto de la pregunta",
      "options": [
        {"text": "texto opción", "profiles": ["id_perfil"]},
        {"text": "texto opción", "profiles": ["id_perfil"]},
        {"text": "texto opción", "profiles": ["id_perfil", "id_perfil2"]},
        {"text": "texto opción", "profiles": ["id_perfil"]}
      ]
    }
  ],
  "profiles": [
    {
      "id": "id_perfil",
      "name": "Nombre del Perfil",
      "emoji": "🎯",
      "description": "Descripción persuasiva de 2-3 oraciones que resuene con el lector",
      "recommendation": "Por qué este producto es exactamente lo que necesita",
      "cta": "Texto del botón de compra (máx 30 chars)"
    }
  ]
}`;

    const text = await this._call([{ role: 'user', content: prompt }], 4000);
    return this._parseJSON(text);
  },

  async generateMiniAppIdeas(productName, description, niche) {
    const prompt = `Eres un experto en productos digitales interactivos y mini-apps de valor añadido para infoproductos.

TAREA: Para el siguiente producto digital, genera 3 ideas de mini-apps que añadan VALOR REAL y diferencial:
- Nombre: ${productName}
- Descripción: ${description || 'Producto digital premium'}
- Nicho: ${niche || 'infoproductos'}

CRITERIOS:
• Las mini-apps deben ser directamente útiles para el tema del producto
• Deben ser algo que el usuario use MIENTRAS consume el contenido
• Tipos: calculadora, tracker de progreso, generador de contenido, planificador, checklist interactivo, simulador

RESPONDE SOLO CON JSON VÁLIDO:
{
  "apps": [
    {
      "name": "Nombre de la Mini-App",
      "icon": "emoji relevante",
      "type": "calculadora|tracker|generador|checklist|planificador|simulador",
      "description": "Qué hace exactamente y cómo ayuda al usuario",
      "features": ["feature 1", "feature 2", "feature 3"],
      "whySellsMore": "Por qué esta mini-app aumenta el valor percibido del producto"
    }
  ]
}`;

    const text = await this._call([{ role: 'user', content: prompt }], 2000);
    return this._parseJSON(text);
  },

  async improveQuestion(currentQuestion, productContext) {
    const prompt = `Eres un experto en copywriting de quizzes de alta conversión.

Mejora esta pregunta de quiz para que sea más específica, persuasiva y relevante:
Pregunta actual: "${currentQuestion}"
Contexto del producto: ${productContext}

Responde SOLO con JSON:
{
  "improved": "nueva pregunta mejorada",
  "options": ["opción 1", "opción 2", "opción 3", "opción 4"]
}`;

    const text = await this._call([{ role: 'user', content: prompt }], 500);
    return this._parseJSON(text);
  },

  async generateMiniAppContent(appIdea, product, niche) {
    const { type, name, description } = appIdea;
    const typeInstructions = {
      checklist: `Genera 10-12 ítems de checklist ESPECÍFICOS y accionables para "${name}". Responde: {"initialItems":["ítem 1","ítem 2",...]}`,
      planificador: `Genera 8-10 tareas de planificador ESPECÍFICAS y ordenadas lógicamente para "${name}". Responde: {"initialTasks":["tarea 1","tarea 2",...]}`,
      tracker: `Define el hábito diario y duración para "${name}". Responde: {"trackerDays":30,"trackerHabit":"nombre del hábito diario específico"}`,
      calculadora: `Diseña una calculadora específica para "${name}". Define 2-3 campos y una fórmula JavaScript simple usando los ids (a,b,c). Responde: {"calcFields":[{"id":"a","label":"Etiqueta del campo","placeholder":"valor ejemplo"}],"calcFormula":"a * b","calcResultLabel":"Etiqueta del resultado"}`,
      generador: `Define el prompt base para el generador de contenido "${name}". Responde: {"generatorPrompt":"Genera [tipo de contenido] para [contexto]: [input del usuario]","inputLabel":"¿Qué quieres generar?","inputPlaceholder":"Describe tu situación..."}`,
    };
    const instruction = typeInstructions[type];
    if (!instruction) return {};

    const prompt = `Eres experto en productos digitales. Producto: "${product}" · Nicho: ${niche || 'infoproductos'}.
Mini-app: "${name}" — ${description}

${instruction}

RESPONDE SOLO JSON VÁLIDO, sin texto adicional.`;

    const text = await this._call([{ role: 'user', content: prompt }], 1000);
    return this._parseJSON(text);
  },
};

// ── Groq API ───────────────────────────────────────────────
const Groq = {
  async _call(messages, maxTokens = 3000) {
    const apiKey = Settings.getGroqApiKey();
    if (!apiKey) throw new Error('NO_GROQ_KEY');

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: maxTokens,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Error ${res.status}`);
    }
    const data = await res.json();
    return data.choices[0].message.content;
  },

  _parseJSON(text) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Respuesta de IA inválida');
    return JSON.parse(match[0]);
  },

  async generateQuiz(productName, description, niche) {
    return Claude.generateQuiz.call(
      { _call: this._call.bind(this), _parseJSON: this._parseJSON },
      productName, description, niche
    );
  },

  async generateMiniAppIdeas(productName, description, niche) {
    return Claude.generateMiniAppIdeas.call(
      { _call: this._call.bind(this), _parseJSON: this._parseJSON },
      productName, description, niche
    );
  },

  async improveQuestion(currentQuestion, productContext) {
    return Claude.improveQuestion.call(
      { _call: this._call.bind(this), _parseJSON: this._parseJSON },
      currentQuestion, productContext
    );
  },

  async generateMiniAppContent(appIdea, product, niche) {
    return Claude.generateMiniAppContent.call(
      { _call: this._call.bind(this), _parseJSON: this._parseJSON },
      appIdea, product, niche
    );
  },
};

// ── AI helper: Groq primero, Claude como fallback ──────────
const AI = {
  async generateQuiz(product, desc, niche) {
    if (Settings.getGroqApiKey()) return Groq.generateQuiz(product, desc, niche);
    return Claude.generateQuiz(product, desc, niche);
  },
  async generateMiniAppIdeas(product, desc, niche) {
    if (Settings.getGroqApiKey()) return Groq.generateMiniAppIdeas(product, desc, niche);
    return Claude.generateMiniAppIdeas(product, desc, niche);
  },
  async improveQuestion(question, context) {
    if (Settings.getGroqApiKey()) return Groq.improveQuestion(question, context);
    return Claude.improveQuestion(question, context);
  },
  async generateMiniAppContent(appIdea, product, niche) {
    if (Settings.getGroqApiKey()) return Groq.generateMiniAppContent(appIdea, product, niche);
    return Claude.generateMiniAppContent(appIdea, product, niche);
  },
};

// ── URL helpers ────────────────────────────────────────────
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function buildQuizUrl(quizId) {
  return `${location.origin}${location.pathname.replace(/[^/]*$/, '')}quiz.html?quiz=${quizId}`;
}

// ── Toast notification ─────────────────────────────────────
function showToast(msg, type = 'success') {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);z-index:9999;transition:opacity .3s;pointer-events:none;';
    document.body.appendChild(toast);
  }
  const colors = { success: 'bg-secondary text-on-secondary', error: 'bg-error text-on-error', info: 'bg-primary text-white' };
  toast.className = `${colors[type] || colors.success} px-6 py-3 rounded-xl font-semibold text-sm shadow-xl`;
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// ── Copy to clipboard ──────────────────────────────────────
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('¡Enlace copiado!');
  } catch {
    showToast('No se pudo copiar', 'error');
  }
}

// ── Plan badge helper ──────────────────────────────────────
function getPlanBadge(plan) {
  const badges = {
    free:     { label: 'Free',     color: 'text-on-surface-variant border-outline-variant' },
    pro:      { label: 'Pro',      color: 'text-primary border-primary' },
    business: { label: 'Business', color: 'text-secondary border-secondary' },
  };
  return badges[plan] || badges.free;
}

// ── Date format ────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Built-in Templates ─────────────────────────────────────
function getBuiltinTemplates() {
  return [
    {
      id: 'tmpl-ebook-finanzas',
      title: '¿Cuál es tu mayor bloqueo financiero?',
      subtitle: 'Descubre qué te está impidiendo alcanzar tu libertad financiera',
      category: 'Finanzas',
      icon: 'account_balance',
      product: 'eBook de Finanzas Personales',
      niche: 'finanzas personales, ahorro, inversión',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Cuál es tu relación actual con el dinero?', options: [
          { text: 'Gasto todo antes de fin de mes', profiles: ['deudas'] },
          { text: 'Ahorro algo pero sin estrategia', profiles: ['ahorrador'] },
          { text: 'Tengo ahorros pero no sé cómo invertirlos', profiles: ['inversor'] },
          { text: 'Tengo deudas y no sé por dónde empezar', profiles: ['deudas'] },
        ]},
        { id: 'q2', text: '¿Cuánto llevas intentando mejorar tus finanzas?', options: [
          { text: 'Acabo de darme cuenta que necesito cambiar', profiles: ['deudas', 'ahorrador'] },
          { text: 'Llevo meses intentándolo sin resultados', profiles: ['ahorrador'] },
          { text: 'Ya tengo bases pero quiero acelerar', profiles: ['inversor'] },
          { text: 'Tengo un sistema pero podría optimizarlo', profiles: ['inversor'] },
        ]},
        { id: 'q3', text: '¿Cuál es tu mayor miedo con el dinero?', options: [
          { text: 'No tener suficiente para emergencias', profiles: ['deudas'] },
          { text: 'Gastar de más y no poder controlarme', profiles: ['ahorrador'] },
          { text: 'Perder mis ahorros invirtiendo mal', profiles: ['inversor'] },
          { text: 'Nunca poder dejar de trabajar', profiles: ['inversor', 'ahorrador'] },
        ]},
        { id: 'q4', text: '¿Qué resultado quieres en 6 meses?', options: [
          { text: 'Salir de deudas y respirar tranquilo/a', profiles: ['deudas'] },
          { text: 'Tener un fondo de emergencia de 3 meses', profiles: ['ahorrador'] },
          { text: 'Tener mi primer portafolio de inversión', profiles: ['inversor'] },
          { text: 'Generar ingresos pasivos que cubran mis gastos', profiles: ['inversor'] },
        ]},
      ],
      profiles: [
        { id: 'deudas', name: 'El Liberador de Deudas', emoji: '🔓', description: 'Las deudas te tienen atrapado/a y eso genera un estrés constante que bloquea tu crecimiento. La buena noticia: con el sistema correcto, puedes salir más rápido de lo que crees.', recommendation: 'Este eBook tiene exactamente el plan paso a paso que necesitas para liquidar tus deudas en orden estratégico y recuperar tu tranquilidad financiera.', cta: 'Quiero salir de deudas' },
        { id: 'ahorrador', name: 'El Ahorrador Consciente', emoji: '🌱', description: 'Ya sabes que ahorrar es importante pero los meses pasan y el dinero desaparece antes de poder guardarlo. Necesitas un sistema automático y sin fricción.', recommendation: 'El método del eBook te enseña a automatizar tu ahorro para que suceda sin esfuerzo, incluso si tu ingreso es irregular.', cta: 'Empezar a ahorrar de verdad' },
        { id: 'inversor', name: 'El Inversor que Despierta', emoji: '📈', description: 'Tienes el dinero pero el miedo a perderlo te paraliza. Ya es hora de que tu dinero trabaje para ti en vez de quedarse dormido en una cuenta.', recommendation: 'El capítulo de inversiones del eBook te explica exactamente cómo empezar con lo que tienes, sin ser experto y minimizando riesgos.', cta: 'Ver cómo invertir seguro' },
      ],
    },
    {
      id: 'tmpl-marketing-digital',
      title: '¿Por qué tus anuncios no convierten?',
      subtitle: 'Descubre tu mayor error en Facebook Ads y cómo corregirlo',
      category: 'Marketing Digital',
      icon: 'ads_click',
      product: 'Curso de Facebook Ads',
      niche: 'emprendedores digitales, marketing online',
      estimatedMinutes: 3,
      questions: [
        { id: 'q1', text: '¿Cuánto tiempo llevas haciendo publicidad digital?', options: [
          { text: 'Soy completamente nuevo, nunca he hecho anuncios', profiles: ['principiante'] },
          { text: 'Llevo 1-6 meses con resultados inconsistentes', profiles: ['intermedio'] },
          { text: 'Llevo más de 6 meses pero no escalo', profiles: ['avanzado'] },
          { text: 'Gasté dinero y no obtuve resultados', profiles: ['principiante', 'intermedio'] },
        ]},
        { id: 'q2', text: '¿Cuál es tu mayor problema con los anuncios?', options: [
          { text: 'No sé cómo segmentar el público correcto', profiles: ['principiante'] },
          { text: 'Mis creatividades no generan clics', profiles: ['intermedio'] },
          { text: 'Obtengo clics pero nadie compra', profiles: ['avanzado'] },
          { text: 'Mis campañas funcionan un tiempo y luego mueren', profiles: ['avanzado'] },
        ]},
        { id: 'q3', text: '¿Cuánto inviertes al mes en publicidad?', options: [
          { text: 'Menos de $50', profiles: ['principiante'] },
          { text: 'Entre $50 y $300', profiles: ['intermedio'] },
          { text: 'Entre $300 y $1,000', profiles: ['avanzado'] },
          { text: 'Más de $1,000', profiles: ['avanzado'] },
        ]},
        { id: 'q4', text: '¿Qué tipo de producto digital vendes o quieres vender?', options: [
          { text: 'Curso o programa de formación', profiles: ['avanzado'] },
          { text: 'eBook o guía PDF', profiles: ['principiante', 'intermedio'] },
          { text: 'Coaching o mentoría', profiles: ['avanzado'] },
          { text: 'Membresía o comunidad', profiles: ['intermedio', 'avanzado'] },
        ]},
      ],
      profiles: [
        { id: 'principiante', name: 'El Anunciante que Empieza', emoji: '🚀', description: 'Estás en el punto perfecto para aprender bien desde el principio y evitar los errores costosos que cometen todos los principiantes. El primer anuncio rentable cambia todo.', recommendation: 'El módulo 1 del curso te lleva de cero a tu primera campaña rentable en menos de 7 días, paso a paso y sin jerga técnica.', cta: 'Quiero mi primera venta' },
        { id: 'intermedio', name: 'El Optimizador', emoji: '🎯', description: 'Ya sabes cómo funciona pero los números no cuadran. El problema no es el presupuesto, es la estrategia. Con los ajustes correctos, tus resultados pueden triplicarse.', recommendation: 'El módulo de optimización del curso revela exactamente qué métricas mirar y cómo interpretar los datos para tomar mejores decisiones.', cta: 'Optimizar mis campañas' },
        { id: 'avanzado', name: 'El Escalador', emoji: '💎', description: 'Tienes el sistema, tienes los resultados, pero escalar sin que el ROAS se desplome es el reto. Necesitas las estrategias avanzadas que usan los grandes anunciantes.', recommendation: 'El módulo de escalado del curso te enseña las técnicas de presupuesto y audiencias lookalike que permiten escalar 5-10x manteniendo rentabilidad.', cta: 'Escalar mis resultados' },
      ],
    },
    {
      id: 'tmpl-productividad',
      title: '¿Qué tipo de emprendedor productivo eres?',
      subtitle: 'Descubre tu perfil y las herramientas perfectas para ti',
      category: 'Productividad',
      icon: 'rocket_launch',
      product: 'Guía de Productividad para Emprendedores',
      niche: 'productividad, emprendimiento, gestión del tiempo',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Cuál es tu mayor problema de productividad?', options: [
          { text: 'Me disperso y no termino lo que empiezo', profiles: ['disperso'] },
          { text: 'Trabajo mucho pero siento que no avanzo', profiles: ['ocupado'] },
          { text: 'Procrastino tareas importantes', profiles: ['procrastinador'] },
          { text: 'Me cuesta delegar y hacerlo todo solo/a', profiles: ['ocupado', 'disperso'] },
        ]},
        { id: 'q2', text: '¿Cómo describes tu día típico de trabajo?', options: [
          { text: 'Reactivo: apago incendios todo el día', profiles: ['ocupado'] },
          { text: 'Caótico: salto de tarea en tarea sin plan', profiles: ['disperso'] },
          { text: 'Planificado pero sin ejecutar lo planeado', profiles: ['procrastinador'] },
          { text: 'Enfocado pero me canso antes de terminar', profiles: ['ocupado'] },
        ]},
        { id: 'q3', text: '¿Cuántas horas trabajas al día en promedio?', options: [
          { text: 'Menos de 4 horas', profiles: ['procrastinador'] },
          { text: 'Entre 4 y 6 horas', profiles: ['disperso'] },
          { text: 'Entre 6 y 9 horas', profiles: ['ocupado'] },
          { text: 'Más de 9 horas y no descansо', profiles: ['ocupado'] },
        ]},
        { id: 'q4', text: '¿Qué quieres lograr mejorando tu productividad?', options: [
          { text: 'Trabajar menos horas con los mismos resultados', profiles: ['ocupado'] },
          { text: 'Terminar mis proyectos importantes de una vez', profiles: ['procrastinador'] },
          { text: 'Tener más claridad sobre qué hacer primero', profiles: ['disperso'] },
          { text: 'Recuperar el control de mi agenda', profiles: ['ocupado', 'disperso'] },
        ]},
      ],
      profiles: [
        { id: 'disperso', name: 'El Multitasker que Necesita Foco', emoji: '🧩', description: 'Tienes mucha energía e ideas pero el foco es tu talón de Aquiles. La dispersión te roba horas productivas que podrías usar para hacer crecer tu negocio.', recommendation: 'El método de bloques de tiempo y la técnica de la semana ideal de la guía van a transformar tu forma de trabajar en menos de 2 semanas.', cta: 'Quiero más foco' },
        { id: 'ocupado', name: 'El Emprendedor Quemado', emoji: '🔋', description: 'Trabajas duro pero la sensación de que "nunca es suficiente" te persigue. El problema no es cuánto trabajas sino en qué trabajas. Es hora de trabajar de forma inteligente.', recommendation: 'La sección de priorización de alto impacto de la guía te enseña a identificar el 20% de actividades que generan el 80% de tus resultados.', cta: 'Trabajar menos y lograr más' },
        { id: 'procrastinador', name: 'El Estratega Postergador', emoji: '⏰', description: 'Sabes exactamente qué hacer pero algo te detiene antes de empezar. La procrastinación no es pereza, es miedo disfrazado. Con la técnica correcta, se rompe el ciclo.', recommendation: 'El capítulo anti-procrastinación de la guía revela el sistema de "primeras acciones" que elimina la resistencia y te pone en movimiento inmediatamente.', cta: 'Romper el ciclo ahora' },
      ],
    },
    {
      id: 'tmpl-salud-bienestar',
      title: '¿Cuál es tu mayor obstáculo para una vida saludable?',
      subtitle: 'Encuentra el plan que se adapta a tu ritmo de vida',
      category: 'Salud & Bienestar',
      icon: 'self_improvement',
      product: 'Programa de Hábitos Saludables',
      niche: 'salud, bienestar, hábitos, estilo de vida',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Cuál es tu mayor reto con la salud ahora mismo?', options: [
          { text: 'No tengo tiempo para cuidarme', profiles: ['ocupado'] },
          { text: 'Empiezo bien pero no logro ser constante', profiles: ['inconsistente'] },
          { text: 'No sé por dónde empezar', profiles: ['principiante'] },
          { text: 'Lo intento todo pero no veo resultados', profiles: ['inconsistente', 'ocupado'] },
        ]},
        { id: 'q2', text: '¿Cuánto ejercicio haces a la semana?', options: [
          { text: 'Casi nada o nada', profiles: ['principiante'] },
          { text: '1-2 veces, de forma irregular', profiles: ['inconsistente'] },
          { text: '3-4 veces cuando puedo', profiles: ['ocupado'] },
          { text: 'Intento hacerlo diario pero me rindo', profiles: ['inconsistente'] },
        ]},
        { id: 'q3', text: '¿Cómo describirías tu alimentación?', options: [
          { text: 'Como lo que sea sin pensar mucho', profiles: ['principiante'] },
          { text: 'Como bien a veces y mal otras veces', profiles: ['inconsistente'] },
          { text: 'Como sano pero me cuesta mantenerlo', profiles: ['inconsistente'] },
          { text: 'Como sano pero sin ver cambios', profiles: ['ocupado'] },
        ]},
        { id: 'q4', text: '¿Qué resultado quieres lograr?', options: [
          { text: 'Perder peso y sentirme bien con mi cuerpo', profiles: ['principiante'] },
          { text: 'Tener más energía durante el día', profiles: ['ocupado'] },
          { text: 'Crear hábitos sanos que duren para siempre', profiles: ['inconsistente'] },
          { text: 'Reducir el estrés y dormir mejor', profiles: ['ocupado', 'inconsistente'] },
        ]},
      ],
      profiles: [
        { id: 'principiante', name: 'El Comienzo Sano', emoji: '🌱', description: 'Estás listo/a para dar el primer paso y eso es lo más importante. No necesitas ser perfecto/a desde el día 1, necesitas un sistema simple que puedas seguir sin complicarte la vida.', recommendation: 'El programa empieza con mini-hábitos de 5 minutos diarios que se van acumulando de forma natural. Perfecto para quien empieza desde cero.', cta: 'Empezar mi cambio hoy' },
        { id: 'inconsistente', name: 'El Que Necesita Consistencia', emoji: '🎯', description: 'Ya sabes qué hacer pero mantener el hábito más de 2 semanas es el reto real. El problema no es la fuerza de voluntad, es el sistema. Con el sistema correcto, la consistencia llega sola.', recommendation: 'El módulo de hábitos encadenados del programa elimina la necesidad de fuerza de voluntad usando el poder de los "gatillos" diarios.', cta: 'Crear hábitos que duran' },
        { id: 'ocupado', name: 'El Saludable sin Tiempo', emoji: '⚡', description: 'Tu vida va a mil por hora y la salud siempre queda para después. La buena noticia: con los métodos correctos, 20 minutos al día son suficientes para transformar tu bienestar.', recommendation: 'El plan de 20 minutos del programa está diseñado específicamente para personas ocupadas que necesitan máximo resultado con mínimo tiempo.', cta: 'Ver el plan de 20 min' },
      ],
    },
  ];
}

// ── Demo/default quiz (for free preview without API key) ──
const DEMO_QUIZ = {
  id: 'demo',
  title: '¿Qué tipo de creador digital eres?',
  subtitle: 'Descubre tu perfil y el producto perfecto para ti',
  estimatedMinutes: 2,
  product: 'Demo — Luminous Studio',
  niche: 'Infoproductos',
  status: 'active',
  created: new Date().toISOString(),
  questions: [
    {
      id: 'q1',
      text: '¿Cuánto tiempo llevas creando productos digitales?',
      options: [
        { text: 'Soy completamente nuevo, apenas empezando', profiles: ['novato'] },
        { text: 'Tengo 1-6 meses vendiendo algo', profiles: ['intermedio'] },
        { text: 'Llevo más de 6 meses y tengo ventas', profiles: ['avanzado'] },
        { text: 'Soy creador de contenido pero no monetizo aún', profiles: ['novato', 'intermedio'] },
      ],
    },
    {
      id: 'q2',
      text: '¿Cuál es tu mayor reto al vender productos digitales?',
      options: [
        { text: 'No sé por dónde empezar ni qué vender', profiles: ['novato'] },
        { text: 'Tengo el producto pero no sé cómo anunciarlo', profiles: ['intermedio'] },
        { text: 'Mis anuncios no convierten lo suficiente', profiles: ['avanzado'] },
        { text: 'No consigo diferenciarte de la competencia', profiles: ['avanzado', 'intermedio'] },
      ],
    },
    {
      id: 'q3',
      text: '¿Qué tipo de producto digital tienes o quieres crear?',
      options: [
        { text: 'eBook o guía PDF', profiles: ['novato', 'intermedio'] },
        { text: 'Curso en video', profiles: ['avanzado'] },
        { text: 'Plantillas o recursos descargables', profiles: ['intermedio'] },
        { text: 'Membresía o comunidad privada', profiles: ['avanzado'] },
      ],
    },
    {
      id: 'q4',
      text: '¿Qué herramienta usas (o usarías) para hacer publicidad?',
      options: [
        { text: 'Facebook/Instagram Ads', profiles: ['avanzado', 'intermedio'] },
        { text: 'Solo publico orgánico en redes', profiles: ['novato'] },
        { text: 'Email marketing', profiles: ['intermedio'] },
        { text: 'Influencers o colaboraciones', profiles: ['novato', 'avanzado'] },
      ],
    },
    {
      id: 'q5',
      text: '¿Qué resultado quieres lograr en los próximos 3 meses?',
      options: [
        { text: 'Hacer mi primera venta online', profiles: ['novato'] },
        { text: 'Alcanzar $1,000/mes constantes', profiles: ['intermedio'] },
        { text: 'Escalar a $5,000/mes o más', profiles: ['avanzado'] },
        { text: 'Construir una comunidad fiel y monetizarla', profiles: ['intermedio', 'avanzado'] },
      ],
    },
  ],
  profiles: [
    {
      id: 'novato',
      name: 'El Creador que Despega',
      emoji: '🚀',
      description: 'Estás en el momento más emocionante: el comienzo. Tienes la energía y las ganas, solo necesitas el sistema correcto para lanzar tu primer producto digital sin perder tiempo ni dinero.',
      recommendation: 'Luminous Studio te da las plantillas de quiz probadas y el generador con IA para crear tu embudo de ventas completo sin experiencia previa.',
      cta: 'Empezar Gratis Ahora',
    },
    {
      id: 'intermedio',
      name: 'El Vendedor Estratégico',
      emoji: '🎯',
      description: 'Ya tienes tracción, ya has vendido algo. Ahora el problema es la consistencia y la escala. Necesitas sistemas que trabajen por ti mientras tú creas más contenido.',
      recommendation: 'El plan Pro de Luminous Studio automatiza tu captación de leads con quizzes de IA y añade mini-apps a tus productos para multiplicar su valor percibido.',
      cta: 'Ver Plan Pro',
    },
    {
      id: 'avanzado',
      name: 'El Emprendedor Digital',
      emoji: '💎',
      description: 'Tienes experiencia, tienes ventas, pero sabes que hay un siguiente nivel. La diferenciación es tu ventaja competitiva y la IA es tu aliada para lograrlo más rápido.',
      recommendation: 'Business te da acceso a generación avanzada de mini-apps con IA, análisis de conversión y branding personalizado para escalar sin límites.',
      cta: 'Explorar Business',
    },
  ],
};
