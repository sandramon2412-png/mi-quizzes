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
    const limits = { free: 1, starter: 3, pro: 999, growth: 999, elite: 999 };
    const max = limits[plan] ?? 999;
    return count < max;
  },
  getLimit() {
    const plan = Settings.get().plan;
    const limits = { free: 1, starter: 3, pro: Infinity, growth: Infinity, elite: Infinity };
    return limits[plan] ?? Infinity;
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
  canCreate() {
    const plan = Settings.get().plan;
    const count = this.getAll().length;
    const limits = { free: 2, starter: 5, pro: 999, growth: 999, elite: 999 };
    const max = limits[plan] ?? 999;
    return count < max;
  },
  getLimit() {
    const plan = Settings.get().plan;
    const limits = { free: 2, starter: 5, pro: Infinity, growth: Infinity, elite: Infinity };
    return limits[plan] ?? Infinity;
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

// ── Niche context system ───────────────────────────────────
const NICHE_CONTEXTS = {
  fitness: {
    patterns: /fitness|gym|ejercicio|entrenam|muscul|cardio|crossfit|bodybuilding|calistenia/i,
    vocabulary: ['series', 'repeticiones', 'sobrecarga progresiva', 'hipertrofia', 'HIIT', 'macros', 'déficit calórico', 'PR (marca personal)', 'split de entrenamiento', 'fase de volumen/definición'],
    painPoints: ['meseta de progreso', 'lesiones recurrentes', 'falta de motivación después de semanas', 'no ver resultados a pesar del esfuerzo', 'confusión con tanta información contradictoria', 'no saber cuánto peso usar'],
    metrics: ['peso levantado', 'composición corporal', 'marcas personales', 'resistencia cardiovascular', 'medidas corporales', 'porcentaje de grasa'],
    archetypes: ['El Novato Entusiasta que se lesiona por exceso', 'El Estancado que lleva meses igual', 'El Informado que sabe todo pero no aplica'],
    examples: { checklist: 'Completé mi sesión de piernas hoy', tracker: 'Entrenamiento de fuerza', calculator: 'calorías diarias según objetivo', planner: 'Preparar meal prep del domingo' },
  },
  spirituality: {
    patterns: /espirit|fe\b|dios|bibli|cristian|iglesia|devocional|oración|alma|medita.*espirit/i,
    vocabulary: ['devocional diario', 'vida de oración', 'discipulado', 'comunión', 'propósito divino', 'dones espirituales', 'gracia', 'frutos del espíritu', 'temporadas espirituales'],
    painPoints: ['sequedad espiritual', 'inconsistencia en la oración', 'dudas de fe en momentos difíciles', 'no entender la Biblia', 'sentirse lejos de Dios', 'culpa por no orar suficiente'],
    metrics: ['consistencia devocional', 'capítulos leídos', 'tiempo en oración', 'días de ayuno', 'versículos memorizados'],
    archetypes: ['El Buscador con dudas sinceras', 'El Creyente inconsistente que quiere profundizar', 'El Líder espiritual agotado'],
    examples: { checklist: 'Leí mi capítulo bíblico del día', tracker: 'Devocional matutino', calculator: 'plan de lectura bíblica anual', planner: 'Preparar mi tiempo devocional de mañana' },
  },
  finance: {
    patterns: /finanz|dinero|inversión|invert|ahorro|trading|cripto|presupuest|deuda|forex|bolsa/i,
    vocabulary: ['flujo de caja', 'fondo de emergencia', 'interés compuesto', 'diversificación', 'rendimiento', 'ROAS', 'ROI', 'activos vs pasivos', 'libertad financiera', 'inflación'],
    painPoints: ['gastar más de lo que se gana', 'no saber dónde va el dinero', 'miedo a invertir y perder', 'deudas que no bajan', 'vivir de quincena en quincena', 'no tener fondo de emergencia'],
    metrics: ['tasa de ahorro mensual', 'deuda total', 'patrimonio neto', 'rendimiento de inversiones', 'gastos fijos vs variables'],
    archetypes: ['El Endeudado que quiere liberarse', 'El Ahorrador sin estrategia', 'El Inversionista paralizado por el miedo'],
    examples: { checklist: 'Registré todos mis gastos de hoy', tracker: 'Ahorro diario', calculator: 'interés compuesto a 10 años', planner: 'Revisar y categorizar gastos del mes' },
  },
  wellness: {
    patterns: /bienestar|wellness|salud|hábito|autocuidado|ansiedad|estrés|sueño|descanso|mindful/i,
    vocabulary: ['autocuidado', 'rutina de bienestar', 'gestión del estrés', 'higiene del sueño', 'mindfulness', 'equilibrio mente-cuerpo', 'sistema nervioso', 'regulación emocional', 'journaling'],
    painPoints: ['ansiedad constante', 'insomnio o mal dormir', 'burnout laboral', 'no tener tiempo para uno mismo', 'sentirse desconectado del cuerpo', 'ciclos de estrés sin salida'],
    metrics: ['horas de sueño', 'nivel de estrés percibido', 'minutos de meditación', 'días de autocuidado', 'nivel de energía diario'],
    archetypes: ['El Quemado que ignora las señales', 'El Ansioso que busca calma', 'El Ocupado que posterga su bienestar'],
    examples: { checklist: 'Hice mi rutina de respiración matutina', tracker: 'Meditación diaria', calculator: 'horas de sueño vs energía', planner: 'Definir mi ritual de desconexión nocturna' },
  },
  nutrition: {
    patterns: /nutri|dieta|alimenta|comida|receta|cocina|meal|keto|vegano|ayuno/i,
    vocabulary: ['macronutrientes', 'micronutrientes', 'densidad calórica', 'meal prep', 'índice glucémico', 'proteína por kilo', 'déficit/superávit', 'hidratación', 'suplementación'],
    painPoints: ['dietas que no se sostienen', 'efecto rebote', 'no saber qué comer', 'comer emocional', 'confusión entre tantas dietas', 'no tener tiempo para cocinar sano'],
    metrics: ['calorías diarias', 'gramos de proteína', 'litros de agua', 'porciones de vegetales', 'comidas preparadas vs ultraprocesados'],
    archetypes: ['El Yo-Yo que va de dieta en dieta', 'El Confundido por información contradictoria', 'El Ocupado que come lo primero que encuentra'],
    examples: { checklist: 'Preparé mi almuerzo saludable', tracker: 'Comer 5 porciones de vegetales', calculator: 'proteína diaria según peso y objetivo', planner: 'Hacer lista de compras saludable del lunes' },
  },
  business: {
    patterns: /negocio|emprendim|empresa|startup|ventas|emprende|lider|coaching.*negocio|escalar/i,
    vocabulary: ['propuesta de valor', 'embudo de ventas', 'ticket promedio', 'retención de clientes', 'escalabilidad', 'modelo de negocio', 'PMV', 'tracción', 'bootstrapping', 'pitch'],
    painPoints: ['no conseguir clientes consistentes', 'trabajar 12h sin ver ganancias', 'no saber delegar', 'miedo a subir precios', 'competir por precio', 'síndrome del impostor emprendedor'],
    metrics: ['ingresos mensuales', 'clientes nuevos/mes', 'tasa de conversión', 'costo de adquisición', 'margen de ganancia', 'lifetime value'],
    archetypes: ['El Solopreneur agotado', 'El Emprendedor con idea pero sin sistema', 'El Vendedor que no escala'],
    examples: { checklist: 'Contacté a 3 prospectos hoy', tracker: 'Llamadas de venta diarias', calculator: 'punto de equilibrio mensual', planner: 'Definir mi oferta irresistible esta semana' },
  },
  marketing: {
    patterns: /marketing|ads|anuncio|facebook|instagram|tiktok|seo|contenido|copywriting|embudo|funnel|redes social/i,
    vocabulary: ['CPC', 'CTR', 'ROAS', 'pixel de conversión', 'audiencia lookalike', 'retargeting', 'copy', 'hook', 'CTA', 'A/B test', 'lead magnet'],
    painPoints: ['anuncios que no convierten', 'gastar dinero sin retorno', 'algoritmo cambiante', 'no saber segmentar', 'creatividades que no enganchan', 'fatiga publicitaria'],
    metrics: ['costo por lead', 'costo por venta', 'tasa de clics', 'alcance orgánico', 'engagement rate', 'ROAS'],
    archetypes: ['El Novato que quema presupuesto', 'El Táctico sin estrategia global', 'El Escalador que pierde rentabilidad'],
    examples: { checklist: 'Revisé métricas de mis campañas activas', tracker: 'Publicar contenido diario', calculator: 'ROAS y costo por adquisición', planner: 'Crear calendario de contenido semanal' },
  },
  motherhood: {
    patterns: /maternidad|mamá|madre|bebé|embaraz|crianza|lactancia|posparto|hijo|infantil|pediatr/i,
    vocabulary: ['rutina del bebé', 'lactancia', 'crianza respetuosa', 'hitos del desarrollo', 'apego seguro', 'BLW', 'sueño infantil', 'posparto', 'destete', 'estimulación temprana'],
    painPoints: ['agotamiento extremo', 'culpa materna', 'no tener tiempo para sí misma', 'inseguridad con decisiones de crianza', 'presión social sobre cómo criar', 'pérdida de identidad propia'],
    metrics: ['horas de sueño del bebé', 'tomas de leche', 'hitos cumplidos', 'tiempo de calidad mamá-bebé', 'momentos de autocuidado'],
    archetypes: ['La Mamá Primeriza Abrumada', 'La Madre Culpable que nunca se siente suficiente', 'La Mamá que quiere recuperar su identidad'],
    examples: { checklist: 'Tomé 15 minutos solo para mí hoy', tracker: 'Rutina de sueño del bebé', calculator: 'onzas de leche según edad y peso', planner: 'Organizar la semana con bloques mamá + bebé' },
  },
  education: {
    patterns: /educación|enseñ|aprendizaje|curso|estudi|profesor|formación|capacitación|idioma|inglés/i,
    vocabulary: ['plan de estudios', 'objetivos de aprendizaje', 'evaluación formativa', 'retroalimentación', 'curva de aprendizaje', 'repaso espaciado', 'técnica Pomodoro', 'mapa mental', 'resumen activo'],
    painPoints: ['no retener lo estudiado', 'procrastinar el estudio', 'no saber por dónde empezar', 'sentirse abrumado por el volumen', 'falta de método efectivo', 'desmotivación a mitad de camino'],
    metrics: ['horas de estudio', 'temas completados', 'notas en evaluaciones', 'flashcards repasadas', 'módulos terminados'],
    archetypes: ['El Estudiante Disperso', 'El Autodidacta sin Método', 'El Procrastinador Académico'],
    examples: { checklist: 'Repasé las flashcards del tema 3', tracker: 'Estudio diario de 45 minutos', calculator: 'horas necesarias para completar el curso', planner: 'Asignar temas a cada día de la semana' },
  },
  relationships: {
    patterns: /relacion|pareja|amor|cita|matrimon|divorcio|seducción|atracción|noviazgo|comunicación.*pareja/i,
    vocabulary: ['lenguajes del amor', 'comunicación asertiva', 'límites sanos', 'interdependencia', 'apego', 'inteligencia emocional', 'intimidad', 'resolución de conflictos', 'codependencia'],
    painPoints: ['comunicación deficiente con la pareja', 'peleas recurrentes por lo mismo', 'miedo a la vulnerabilidad', 'patrones tóxicos repetitivos', 'falta de conexión emocional', 'celos e inseguridad'],
    metrics: ['momentos de calidad juntos', 'conversaciones profundas por semana', 'conflictos resueltos vs escalados', 'actos de amor intencionales'],
    archetypes: ['El Evitante Emocional', 'El Complaciente que se pierde a sí mismo', 'El Perfeccionista Relacional'],
    examples: { checklist: 'Expresé gratitud a mi pareja hoy', tracker: 'Momento de calidad diario con mi pareja', calculator: 'lenguaje del amor predominante', planner: 'Planificar una cita especial esta semana' },
  },
  beauty: {
    patterns: /belleza|maquillaj|skincare|piel|cabello|estétic|cosmet|cuidado personal|uñas/i,
    vocabulary: ['rutina de skincare', 'tipo de piel', 'ácido hialurónico', 'retinol', 'SPF', 'doble limpieza', 'barrera cutánea', 'colorimetría', 'técnica de contouring'],
    painPoints: ['piel reactiva o con acné', 'no saber qué productos usar', 'gastar en productos que no funcionan', 'envejecimiento prematuro', 'rutinas complicadas sin resultados'],
    metrics: ['días de rutina completada', 'productos terminados vs abandonados', 'mejora percibida de la piel', 'SPF aplicado diariamente'],
    archetypes: ['La Principiante Abrumada por opciones', 'La Adicta a productos sin rutina', 'La Minimalista que quiere lo esencial'],
    examples: { checklist: 'Apliqué SPF antes de salir', tracker: 'Rutina de skincare nocturna', calculator: 'tipo de piel y productos recomendados', planner: 'Organizar mi rutina AM/PM de la semana' },
  },
  productivity: {
    patterns: /productividad|tiempo|organiza|planifica|GTD|hábitos.*productiv|agenda|prioridad/i,
    vocabulary: ['bloque de tiempo', 'deep work', 'matriz de Eisenhower', 'batching', 'revisión semanal', 'inbox zero', 'sistema GTD', 'energía vs tiempo', 'tarea de alto impacto'],
    painPoints: ['trabajar muchas horas sin avanzar', 'no saber qué priorizar', 'interrupciones constantes', 'listas de tareas interminables', 'agotamiento decisional', 'procrastinar lo importante'],
    metrics: ['tareas de alto impacto completadas', 'horas de deep work', 'tareas eliminadas o delegadas', 'proyectos terminados por mes'],
    archetypes: ['El Multitasker Disperso', 'El Perfeccionista Paralizante', 'El Ocupado Improductivo'],
    examples: { checklist: 'Completé mi tarea #1 del día antes de las 11am', tracker: 'Sesión de deep work diaria', calculator: 'horas productivas reales por día', planner: 'Definir las 3 prioridades de mañana' },
  },
};

function getNicheContext(niche) {
  if (!niche) return null;
  for (const [key, ctx] of Object.entries(NICHE_CONTEXTS)) {
    if (ctx.patterns.test(niche)) return { id: key, ...ctx };
  }
  return null;
}

function buildNichePromptBlock(niche) {
  const ctx = getNicheContext(niche);
  if (!ctx) return `Nicho: "${niche}". Investiga y usa vocabulario real y específico de este nicho.`;
  return `Nicho: "${niche}"
VOCABULARIO OBLIGATORIO del nicho (usa estos términos): ${ctx.vocabulary.join(', ')}
DOLORES REALES del público: ${ctx.painPoints.join('; ')}
MÉTRICAS que les importan: ${ctx.metrics.join(', ')}
ARQUETIPOS de personas en este nicho: ${ctx.archetypes.join('; ')}`;
}

// ── Claude API ─────────────────────────────────────────────
const Claude = {
  async _call(messages, maxTokens = 3000) {
    const doRequest = async (token) => fetch(`${SUPABASE_URL}/functions/v1/claude-proxy`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: maxTokens, messages }),
    });

    // Always get a fresh token via forced refresh
    let token = null;
    try {
      const { data, error } = await db.auth.refreshSession();
      if (!error && data.session?.access_token) token = data.session.access_token;
    } catch {}
    if (!token) {
      const { data: { session } } = await db.auth.getSession();
      token = session?.access_token || null;
    }
    if (!token) throw new Error('Sesión no válida. Por favor recarga la página e inicia sesión de nuevo.');

    let res = await doRequest(token);

    // On 401, sign out and tell user to re-login
    if (res.status === 401) {
      throw new Error('Sesión expirada. Por favor recarga la página e inicia sesión de nuevo. O configura tu API key de Groq en Ajustes para no depender del proxy.');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.error?.message || `Error ${res.status}`;
      if (res.status === 429) throw new Error('Límite de peticiones alcanzado. Espera un momento e intenta de nuevo.');
      throw new Error(msg);
    }
    const data = await res.json();
    return data.content[0].text;
  },

  _parseJSON(text) {
    // Strip markdown code blocks if present
    const stripped = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const match = stripped.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Respuesta de IA inválida: no se encontró JSON');
    try {
      return JSON.parse(match[0]);
    } catch {
      // Try to extract valid JSON by finding last closing brace
      const lastBrace = stripped.lastIndexOf('}');
      if (lastBrace > -1) {
        const firstBrace = stripped.indexOf('{');
        try { return JSON.parse(stripped.slice(firstBrace, lastBrace + 1)); } catch {}
      }
      throw new Error('Respuesta de IA inválida: JSON malformado');
    }
  },

  async generateQuiz(productName, description, niche, numQuestions, numOptions) {
    const nQ = numQuestions || 6;
    const nO = numOptions   || 4;
    const nicheBlock = buildNichePromptBlock(niche);
    const ctx = getNicheContext(niche);
    const archetypeHint = ctx ? `\nInspírate en estos arquetipos reales del nicho para crear los perfiles: ${ctx.archetypes.join('; ')}` : '';
    const prompt = `Eres un experto en psicología del comprador, copywriting emocional y quizzes virales de alta conversión.

PRODUCTO: "${productName}"
DESCRIPCIÓN: ${description || 'Producto digital premium'}
${nicheBlock}

═══ TU MISIÓN ═══
Crear un quiz que haga que cada persona sienta que "le leyeron la mente". Cada pregunta y cada opción DEBE usar el vocabulario técnico y las situaciones reales del nicho. NADA GENÉRICO — si alguien pudiera copiar la misma pregunta para otro nicho, está mal.

═══ REGLAS PARA LAS PREGUNTAS (${nQ} en total) ═══
Las ${nQ} preguntas deben cubrir estos ángulos en orden:
1. Situación actual — ¿Dónde está HOY respecto al tema? (usa jerga real del nicho)
2. Obstáculo principal — ¿Qué dolor específico del nicho le frena? (menciona situaciones reconocibles)
3. Experiencia previa — ¿Qué métodos/herramientas/enfoques ha probado ya en este nicho?
4. Motivación profunda — ¿Qué resultado tangible y medible quiere? (usa métricas del nicho)
5. Estilo de acción — ¿Cómo prefiere abordar este tema en particular?
6. Mentalidad ante obstáculos — ¿Cómo reacciona cuando enfrenta un reto típico del nicho?
${nQ > 6 ? Array.from({length: nQ - 6}, (_,k) => `${k+7}. Pregunta sobre un aspecto específico y técnico del nicho que diferencie niveles`).join('\n') : ''}

Cada pregunta: exactamente ${nO} opciones. Cada opción:
- Describe UNA SITUACIÓN CONCRETA que solo alguien de este nicho reconocería (no "Sí / No / A veces")
- Usa el vocabulario técnico del nicho en la redacción
- Tiene un EMOJI que represente emocionalmente esa situación

═══ REGLAS PARA LOS PERFILES (3 perfiles) ═══${archetypeHint}
• name: Identidad poderosa y específica del nicho (NO genérica como "El Principiante")
• emoji: Emoji representativo del perfil
• description: 2-3 oraciones que hagan que el usuario piense "¡ESO SOY YO!" — con situaciones, vocabulario y frustraciones concretas del nicho
• recommendation: Por qué "${productName}" resuelve exactamente el problema de ESTE perfil (menciona características específicas del producto)
• matchScore: Número 83-96 (diferente por perfil)
• cta: CTA personalizado que mencione el resultado deseado (máx 35 chars)

═══ RESPONDE SOLO JSON VÁLIDO ═══
{
  "title": "título del quiz con gancho emocional y vocabulario del nicho (máx 65 chars)",
  "subtitle": "subtítulo que describe el beneficio de completarlo (1 línea)",
  "estimatedMinutes": 2,
  "questions": [
    {
      "id": "q1",
      "text": "pregunta usando vocabulario real del nicho",
      "imageKeywords": "2-3 palabras en inglés para imagen (ej: 'gym workout frustration')",
      "options": [
        {"text": "situación reconocible del nicho con jerga real", "emoji": "😊", "profiles": ["id_perfil"]},
        {"text": "situación reconocible del nicho con jerga real", "emoji": "😔", "profiles": ["id_perfil"]},
        {"text": "situación reconocible del nicho con jerga real", "emoji": "😤", "profiles": ["id_perfil", "id_perfil2"]},
        {"text": "situación reconocible del nicho con jerga real", "emoji": "😩", "profiles": ["id_perfil"]}
      ]
    }
  ],
  "profiles": [
    {
      "id": "id_perfil",
      "name": "Nombre Identidad Específica del Nicho",
      "emoji": "🎯",
      "description": "Descripción con vocabulario del nicho que hace que el usuario diga 'eso soy yo'",
      "recommendation": "Por qué ${productName} resuelve exactamente el problema de este perfil",
      "matchScore": 91,
      "cta": "CTA con resultado específico del nicho"
    }
  ]
}`;

    const text = await this._call([{ role: 'user', content: prompt }], 5000);
    return this._parseJSON(text);
  },

  async generateMiniAppIdeas(productName, description, niche) {
    const nicheBlock = buildNichePromptBlock(niche);
    const ctx = getNicheContext(niche);
    const exHint = ctx ? `\nEjemplos de lo que le importa a este público: ${ctx.painPoints.slice(0, 3).join(', ')}` : '';
    const prompt = `Eres un experto en productos digitales interactivos y mini-apps de valor añadido para infoproductos.

TAREA: Para el siguiente producto digital, genera 3 ideas de mini-apps que añadan VALOR REAL y diferencial:
- Nombre: ${productName}
- Descripción: ${description || 'Producto digital premium'}
${nicheBlock}${exHint}

CRITERIOS:
• Cada mini-app debe resolver un DOLOR ESPECÍFICO del público de este nicho
• Debe ser algo que el usuario use MIENTRAS aplica lo aprendido del producto
• Los nombres deben usar vocabulario del nicho, no genéricos
• Usa SOLO estos tipos exactos: calculadora, tracker, generador, checklist, planificador, chatbot, reto, diagnostico, roadmap, simulador, meditacion, afirmaciones, flashcards, comparador, biblioteca, faq, devocional, diario, glosario

ELIGE los 3 tipos que MÁS SENTIDO tengan para "${niche}". Por ejemplo:
- Fitness → tracker, calculadora, reto
- Espiritualidad → devocional, meditacion, afirmaciones
- Finanzas → calculadora, planificador, simulador
- Bienestar → tracker, meditacion, diario

RESPONDE SOLO CON ESTE JSON VÁLIDO (sin texto antes ni después):
{"apps":[{"name":"Nombre específico del nicho","icon":"emoji relevante","type":"tipo_elegido","description":"Qué hace exactamente y cómo ayuda al usuario con un dolor real del nicho en 1 oración","features":["Función clave específica del nicho 1","Función clave 2","Función clave 3"]}]}

Genera 3 apps distintas con tipos distintos. Devuelve SOLO el JSON, sin markdown, sin explicaciones.`;

    const text = await this._call([{ role: 'user', content: prompt }], 2000);
    const result = this._parseJSON(text);
    if (!result.apps || !Array.isArray(result.apps)) throw new Error('Respuesta de IA inválida');
    return result;
  },

  async improveQuestion(currentQuestion, productContext) {
    const nicheBlock = buildNichePromptBlock(productContext);
    const prompt = `Eres un experto en copywriting de quizzes de alta conversión.

Pregunta actual: "${currentQuestion}"
${nicheBlock}

MISIÓN: Reescribe esta pregunta para que sea imposible de reusar en otro nicho. Debe usar vocabulario técnico, situaciones reconocibles y dolores REALES del público.

REGLAS:
• La pregunta mejorada debe sonar como una conversación entre expertos del nicho
• Las 4 opciones deben describir situaciones concretas que SOLO alguien de este nicho reconocería
• Cada opción debe representar un arquetipo/perfil diferente de persona dentro del nicho
• NO usar opciones genéricas como "Sí / No / A veces / Depende"

Responde SOLO con JSON:
{
  "improved": "nueva pregunta con vocabulario técnico del nicho",
  "options": ["situación con jerga del nicho 1", "situación reconocible 2", "situación 3", "situación 4"]
}`;

    const text = await this._call([{ role: 'user', content: prompt }], 800);
    return this._parseJSON(text);
  },

  async generateAppTheme(niche, product) {
    const prompt = `Eres un diseñador UI experto. Dado un nicho y producto, genera la paleta visual perfecta para su mini-app interactiva.

Nicho: "${niche}"
Producto: "${product || niche}"

Reglas:
- "mode": "light" para nichos suaves/femeninos/espirituales/wellness/infantil/emocional
- "mode": "dark" para nichos de tecnología/negocios/fitness intenso/gaming/finanzas premium
- Los colores deben reflejar la emoción del nicho, no ser genéricos
- "accent" es el color principal de botones y énfasis (hex)
- "accent2" es el color secundario/gradiente (hex)
- "bg" es el color de fondo principal (hex)
- "card" es el fondo de las tarjetas (hex)
- "text" es el color de texto principal (hex)
- "muted" es el color de texto secundario (hex)
- "font" es "serif" para nichos emocionales/wellness/espirituales, "sans" para los demás

Ejemplos de referencia:
- Bienestar femenino → mode:light, accent:#c0635c, bg:#fdf8f4, font:serif
- Fitness/gym → mode:dark, accent:#f97316, bg:#0a0a0a, font:sans
- Finanzas → mode:dark, accent:#2563eb, bg:#0d1117, font:sans
- Espiritualidad → mode:light, accent:#7c3aed, bg:#f5f0ff, font:serif
- Nutrición → mode:light, accent:#16a34a, bg:#f0fdf4, font:sans
- Maternidad/infantil → mode:light, accent:#ec4899, bg:#fff5f7, font:serif

Devuelve SOLO este JSON sin texto adicional:
{"mode":"light","accent":"#hex","accent2":"#hex","bg":"#hex","card":"#hex","text":"#hex","muted":"#hex","font":"sans"}`;

    const text = await this._call([{ role: 'user', content: prompt }], 400);
    return this._parseJSON(text);
  },

  async generateMiniAppContent(appIdea, product, niche, creatorCtx = null) {
    const { type, name, description, features = [] } = appIdea;
    const featuresCtx = features.length ? `\nFunciones que debe incluir: ${features.join(', ')}` : '';
    const nicheBlock = buildNichePromptBlock(niche);
    const ctx = getNicheContext(niche);
    const exForType = ctx?.examples || {};

    const typeInstructions = {
      reto: `Genera contenido guiado para un reto de 7 días llamado "${name}".
${nicheBlock}${featuresCtx}
IMPORTANTE: Cada día debe tener contenido ÚNICO y progresivo — día 1 no puede parecerse a día 7.
- Día 1-2: Fundamentos y primeras acciones simples del nicho
- Día 3-4: Profundización con técnicas específicas
- Día 5-6: Desafíos más intensos con vocabulario técnico del nicho
- Día 7: Integración y plan de continuidad
Las instrucciones deben mencionar herramientas, técnicas o conceptos REALES del nicho, no generalidades.
Devuelve SOLO este JSON:
{"retoDays":7,"retoContent":[{"day":1,"title":"Título con vocabulario del nicho","icon":"emoji","quote":"Insight basado en conocimiento real del nicho (2-3 oraciones)","instructions":"Instrucciones paso a paso usando terminología del nicho (3-5 oraciones)","reflectionPrompt":"Pregunta de reflexión que use conceptos del nicho"}]}`,

      chatbot: `Diseña un asistente IA especializado en "${name}".
${nicheBlock}${featuresCtx}
El asistente debe:
- Tener personalidad alineada con el tono del nicho (${ctx ? 'vocabulario: ' + ctx.vocabulary.slice(0, 5).join(', ') : 'profesional y cercano'})
- Responder SOLO sobre temas del nicho — redirigir lo demás amablemente
- Las preguntas sugeridas deben abordar dolores REALES del público
Devuelve SOLO este JSON sin texto adicional:
{"chatbotName":"Nombre que refleje la experticia del nicho","chatbotGreeting":"Bienvenida que demuestre conocimiento del nicho y sus dolores (1-2 oraciones)","chatbotSystemPrompt":"Eres [nombre], experto en [área específica del nicho]. Conoces: [${ctx ? ctx.vocabulary.slice(0, 4).join(', ') : 'conceptos clave del tema'}]. Ayudas a resolver: [${ctx ? ctx.painPoints.slice(0, 3).join(', ') : 'problemas del público'}]. Responde en español, máximo 4 oraciones por respuesta. Usa vocabulario técnico del nicho pero explícalo si es necesario. Si preguntan algo ajeno, redirige amablemente.","chatbotSuggestions":["Pregunta sobre dolor real #1 del nicho","Pregunta técnica #2","Pregunta práctica #3"]}`,

      checklist: `Genera 12-15 ítems de checklist para que el USUARIO FINAL los marque mientras avanza en "${name}".
${nicheBlock}${featuresCtx}
IMPORTANTE: Los ítems son acciones que el usuario hace en su vida real, NO funciones del producto ni ideas para el creador.
${exForType.checklist ? `Ejemplo correcto para este nicho: "✓ ${exForType.checklist}"` : ''}
Ejemplo INCORRECTO: "Desarrollar plan de...", "Crear sección de...", "Implementar sistema de..."
Cada ítem debe usar VOCABULARIO TÉCNICO del nicho y ser una acción medible y concreta.
Devuelve SOLO este JSON: {"initialItems":["acción medible con vocabulario del nicho 1","acción concreta 2",...]}`,

      planificador: `Genera 10-12 tareas concretas que el USUARIO FINAL debe completar para avanzar en "${name}".
${nicheBlock}${featuresCtx}
IMPORTANTE: Son tareas que el usuario realiza en su vida real, en orden lógico de ejecución.
${exForType.planner ? `Ejemplo correcto para este nicho: "${exForType.planner}"` : ''}
Ejemplo INCORRECTO: "Desarrollar herramienta de...", "Crear sección de..."
Cada tarea debe usar terminología del nicho y ser específica (no "mejorar mi salud" sino "medir mi porcentaje de grasa corporal").
Devuelve SOLO este JSON: {"initialTasks":["tarea concreta con vocabulario del nicho 1","tarea 2",...]}`,

      tracker: `Define el hábito y duración para "${name}".
${nicheBlock}${featuresCtx}
${exForType.tracker ? `Ejemplo de hábito para este nicho: "${exForType.tracker}"` : ''}
El hábito debe ser específico del nicho, medible y realista para hacer diariamente.
Devuelve SOLO este JSON: {"trackerDays":30,"trackerHabit":"hábito diario específico con vocabulario del nicho"}`,

      calculadora: `Diseña una calculadora práctica y útil para "${name}".
${nicheBlock}${featuresCtx}
${exForType.calculator ? `Ejemplo de cálculo para este nicho: "${exForType.calculator}"` : ''}
Los campos deben usar etiquetas con TERMINOLOGÍA REAL del nicho (no "valor A", sino "${ctx ? ctx.metrics[0] || 'métrica del nicho' : 'métrica del nicho'}").
La fórmula debe calcular algo que realmente le importe al público de este nicho.
Define 2-3 campos con etiquetas claras y una fórmula JS simple usando las variables a, b, c.
Devuelve SOLO este JSON: {"calcFields":[{"id":"a","label":"Etiqueta con terminología del nicho","placeholder":"valor ejemplo realista"}],"calcFormula":"a * b","calcResultLabel":"Nombre del resultado usando vocabulario del nicho"}`,

      generador: `Define el prompt y etiquetas para el generador "${name}".
${nicheBlock}${featuresCtx}
El generador debe producir contenido que un profesional del nicho valoraría — no texto genérico.
Devuelve SOLO este JSON: {"generatorPrompt":"Genera [tipo de contenido específico del nicho] personalizado para: [input del usuario]. Usa terminología de ${niche}. Incluye: [elementos específicos del nicho]. Responde en español con formato claro y accionable.","inputLabel":"Etiqueta con contexto del nicho","inputPlaceholder":"Ejemplo realista del nicho..."}`,

      simulador: `Define el prompt y etiquetas para el simulador "${name}".
${nicheBlock}${featuresCtx}
El simulador debe recrear escenarios REALES que el público de ${niche} enfrenta.
Devuelve SOLO este JSON: {"generatorPrompt":"Simula un escenario de ${niche} basado en: [input del usuario]. Usa datos y terminología real del nicho. Explica paso a paso qué pasaría, con números y ejemplos concretos. Responde en español.","inputLabel":"Describe tu situación en ${niche}","inputPlaceholder":"Ejemplo realista de escenario del nicho..."}`,

      roadmap: `Genera 8-12 pasos que el USUARIO FINAL debe recorrer en su camino con "${name}".
${nicheBlock}${featuresCtx}
IMPORTANTE: Cada paso debe usar vocabulario técnico del nicho y representar un LOGRO REAL del usuario — no pasos de desarrollo.
Los pasos deben seguir una progresión lógica: Fundamentos → Práctica → Dominio → Maestría.
Devuelve SOLO este JSON:
{"roadmapSteps":["Paso 1: acción concreta con vocabulario del nicho","Paso 2: siguiente logro medible","Paso 3: ..."]}`,

      diagnostico: `Genera 6-8 preguntas de diagnóstico para evaluar al usuario sobre "${name}".
${nicheBlock}${featuresCtx}
Las preguntas deben evaluar DIMENSIONES REALES del nicho (${ctx ? ctx.metrics.slice(0, 3).join(', ') : 'aspectos clave del tema'}).
Las opciones deben representar niveles de experiencia/habilidad reconocibles en el nicho.
Devuelve SOLO este JSON:
{"diagQuestions":[{"q":"¿Pregunta que evalúe un aspecto real del nicho?","opts":["Nivel 1: principiante reconocible","Nivel 2: intermedio","Nivel 3: avanzado","Nivel 4: experto"]}]}`,

      meditacion: `Crea una meditación guiada completa para "${name}".
${nicheBlock}${featuresCtx}
IMPORTANTE: La meditación debe estar CONTEXTUALIZADA al nicho. No es una meditación genérica — incorpora visualizaciones y metáforas específicas del tema.
${ctx?.id === 'fitness' ? 'Enfócate en visualización del cuerpo, conexión mente-músculo y recuperación.' : ''}${ctx?.id === 'finance' ? 'Enfócate en abundancia, claridad financiera y soltar el estrés del dinero.' : ''}${ctx?.id === 'business' ? 'Enfócate en visualización de metas empresariales, claridad estratégica y liderazgo.' : ''}
El script debe ser cálido, fluido y listo para TTS. Usa "..." para pausas de respiración.
Devuelve SOLO este JSON:
{"meditationDuration":10,"meditationScript":"Texto completo (400-600 palabras). Comienza con respiración. Incluye visualizaciones y metáforas específicas del nicho. Segunda persona, tono cálido.","meditationTips":["Tip práctico 1 usando vocabulario del nicho","Tip 2","Tip 3"],"bellFreq":432}`,

      afirmaciones: `Genera 12-18 afirmaciones poderosas y específicas para "${name}" en el nicho "${niche}".
${nicheBlock}${featuresCtx}
REGLAS:
- Primera persona, presente, positivas
- CADA afirmación debe contener vocabulario técnico del nicho (${ctx ? ctx.vocabulary.slice(0, 4).join(', ') : 'términos del tema'})
- NO clichés genéricos como "Soy capaz de todo" o "Merezco lo mejor"
- SÍ afirmaciones específicas como: ${ctx?.id === 'fitness' ? '"Mi cuerpo responde a cada repetición con fuerza renovada"' : ctx?.id === 'finance' ? '"Cada peso que ahorro trabaja para mí mientras duermo"' : ctx?.id === 'spirituality' ? '"Mi tiempo devocional transforma mi perspectiva cada mañana"' : '"Domino [habilidad del nicho] con cada día de práctica"'}
Devuelve SOLO este JSON:
{"affirmations":["Afirmación con vocabulario del nicho 1","Afirmación 2","..."],"affirmationInstruction":"Instrucción contextualizada al nicho sobre cómo usar estas afirmaciones"}`,

      faq: `Genera 8-12 preguntas frecuentes con respuestas para "${name}".
${nicheBlock}${featuresCtx}
Las preguntas deben ser dudas REALES que el público de ${niche} tiene — no genéricas.
Las respuestas deben usar vocabulario técnico del nicho y ser útiles (3-4 oraciones cada una).
Devuelve SOLO este JSON:
{"faqItems":[{"q":"¿Pregunta real que se haría alguien del nicho?","a":"Respuesta con vocabulario técnico del nicho, útil y accionable"}]}`,

      flashcards: `Genera 12-15 flashcards educativas para "${name}".
${nicheBlock}${featuresCtx}
El frente debe ser un concepto/término REAL del nicho y el reverso su explicación práctica.
Devuelve SOLO este JSON:
{"cards":[{"front":"Concepto/término técnico del nicho","back":"Explicación práctica y clara con vocabulario del nicho"}]}`,

      glosario: `Genera 10-15 términos clave con definiciones para "${name}".
${nicheBlock}${featuresCtx}
Los términos deben ser vocabulario REAL que alguien en ${niche} necesita dominar (${ctx ? ctx.vocabulary.slice(0, 5).join(', ') + ', etc.' : 'términos técnicos del nicho'}).
Devuelve SOLO este JSON:
{"glossaryTerms":[{"term":"Término técnico del nicho","def":"Definición clara y práctica con ejemplo de uso"}]}`,

      comparador: `Genera una tabla comparativa útil para "${name}".
${nicheBlock}${featuresCtx}
Compara 2-3 opciones/enfoques/métodos REALES que el público de ${niche} debate frecuentemente.
Devuelve SOLO este JSON:
{"comparatorTitle":"¿Qué se compara?","comparatorItems":[{"name":"Opción/método A del nicho","pros":["Ventaja real 1","Ventaja 2"],"cons":["Desventaja real 1","Desventaja 2"]},{"name":"Opción/método B del nicho","pros":["Ventaja 1","Ventaja 2"],"cons":["Desventaja 1","Desventaja 2"]}]}`,

      biblioteca: `Genera 6-10 recursos recomendados para "${name}".
${nicheBlock}${featuresCtx}
Los recursos deben ser útiles para alguien en ${niche}: guías, herramientas, lecturas, videos.
Devuelve SOLO este JSON:
{"resources":[{"title":"Nombre del recurso relevante al nicho","url":"#","description":"Por qué es útil para alguien en ${niche} (1 oración)"}]}`,

      devocional: `Genera un devocional/reflexión guiada para "${name}".
${nicheBlock}${featuresCtx}
El texto debe ser profundo, usar vocabulario del nicho, y guiar al usuario a reflexionar sobre su proceso.
Devuelve SOLO este JSON:
{"devotionalText":"Texto de reflexión guiada (200-300 palabras) con vocabulario del nicho, tono cálido, invitando a la introspección"}`,

      diario: `Genera 8-12 prompts de journaling para "${name}".
${nicheBlock}${featuresCtx}
Cada prompt debe invitar a reflexionar sobre un aspecto REAL del nicho — no preguntas genéricas.
Devuelve SOLO este JSON:
{"journalPrompts":["¿Pregunta de reflexión sobre aspecto real del nicho?","Prompt 2","..."]}`,
    };
    const instruction = typeInstructions[type] || typeInstructions.generador;

    const creatorNote = creatorCtx
      ? `\n\nEl creador ya definió parte del contenido — inclúyelo exactamente en el JSON y completa los demás campos:\n${JSON.stringify(creatorCtx)}`
      : '';

    const prompt = `Eres experto en crear contenido para apps de usuarios finales. Contexto: el creador tiene un producto llamado "${product}" en el nicho "${niche || 'infoproductos'}" y está creando una mini-app llamada "${name}" (${description}) para que sus CLIENTES la usen.

El contenido que generes es para los USUARIOS FINALES de la app — personas reales que usarán la app en su día a día. NO es contenido sobre cómo construir el producto ni ideas para el creador.

${instruction}${creatorNote}

IMPORTANTE: Devuelve SOLO el JSON válido, sin markdown, sin texto antes ni después.`;

    const text = await this._call([{ role: 'user', content: prompt }], 2000);
    return this._parseJSON(text);
  },
};

// ── Groq API (vía proxy con master key de la plataforma) ───
const Groq = {
  async _call(messages, maxTokens = 3000) {
    const doRequest = async (token) => fetch(`${SUPABASE_URL}/functions/v1/groq-proxy`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: maxTokens,
        messages,
      }),
    });

    let token = await Auth.getToken();
    if (!token) throw new Error('Sesión inválida. Inicia sesión de nuevo.');

    let res = await doRequest(token);
    if (res.status === 401) {
      // Retry once with fresh token
      token = await Auth.getToken();
      if (token) res = await doRequest(token);
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Error ${res.status}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  },

  _parseJSON(text) {
    // Strip markdown code blocks if present
    const stripped = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const match = stripped.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Respuesta de IA inválida: no se encontró JSON');
    try {
      return JSON.parse(match[0]);
    } catch {
      // Try to extract valid JSON by finding last closing brace
      const lastBrace = stripped.lastIndexOf('}');
      if (lastBrace > -1) {
        const firstBrace = stripped.indexOf('{');
        try { return JSON.parse(stripped.slice(firstBrace, lastBrace + 1)); } catch {}
      }
      throw new Error('Respuesta de IA inválida: JSON malformado');
    }
  },

  async generateQuiz(productName, description, niche, numQ, numOpts) {
    return Claude.generateQuiz.call(
      { _call: this._call.bind(this), _parseJSON: this._parseJSON },
      productName, description, niche, numQ, numOpts
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

  async generateMiniAppContent(appIdea, product, niche, creatorCtx = null) {
    return Claude.generateMiniAppContent.call(
      { _call: this._call.bind(this), _parseJSON: this._parseJSON },
      appIdea, product, niche, creatorCtx
    );
  },

  async generateAppTheme(niche, product) {
    return Claude.generateAppTheme.call(
      { _call: this._call.bind(this), _parseJSON: this._parseJSON },
      niche, product
    );
  },
};

// ── AI helper: CREACIÓN paga por la plataforma ─────────────
// Tareas complejas/críticas → Claude (mejor calidad).
// Tareas simples/listas → Groq (rápido y económico).
// Si Groq falla, fallback automático a Claude.
const AI = {
  // Complejo: quiz completo con preguntas + perfiles + CTAs
  async generateQuiz(product, desc, niche, numQ, numOpts) {
    return Claude.generateQuiz(product, desc, niche, numQ, numOpts);
  },
  // Simple: lista de ideas — si falla Groq, cae a Claude
  async generateMiniAppIdeas(product, desc, niche) {
    try { return await Groq.generateMiniAppIdeas(product, desc, niche); }
    catch (e) { console.warn('Groq falló, cayendo a Claude:', e.message); return Claude.generateMiniAppIdeas(product, desc, niche); }
  },
  // Simple: mejora breve de una pregunta
  async improveQuestion(question, context) {
    try { return await Groq.improveQuestion(question, context); }
    catch (e) { return Claude.improveQuestion(question, context); }
  },
  // Complejo: contenido estructurado de mini-app (días, scripts, etc.)
  async generateMiniAppContent(appIdea, product, niche, creatorCtx = null) {
    return Claude.generateMiniAppContent(appIdea, product, niche, creatorCtx);
  },
  // Simple: paleta de colores
  async generateAppTheme(niche, product) {
    try { return await Groq.generateAppTheme(niche, product); }
    catch (e) { return Claude.generateAppTheme(niche, product); }
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
    free:    { label: 'Free',    color: 'text-on-surface-variant border-outline-variant' },
    starter: { label: 'Starter', color: 'text-secondary border-secondary/50' },
    pro:     { label: 'Pro',     color: 'text-primary border-primary/60' },
    growth:  { label: 'Growth',  color: 'text-purple-400 border-purple-400/50' },
    elite:   { label: 'Elite',   color: 'text-yellow-400 border-yellow-400/50' },
    // legacy
    business: { label: 'Business', color: 'text-secondary border-secondary' },
  };
  return badges[plan] || badges.free;
}

// ── Plan capabilities ─────────────────────────────────────
const PlanLimits = {
  free:    { quizzes: 1,   responses: 500,      leads: false, ai: false, miniApps: 2,       customDomain: false, metaPixel: false, integrations: false, whiteLabel: false, subdomains: 0, nicheAssistant: false, botLab: false },
  starter: { quizzes: 3,   responses: 5000,     leads: true,  ai: false, miniApps: 5,       customDomain: false, metaPixel: true,  integrations: false, whiteLabel: false, subdomains: 0, nicheAssistant: false, botLab: true  },
  pro:     { quizzes: 999, responses: 50000,    leads: true,  ai: true,  miniApps: 999,     customDomain: true,  metaPixel: true,  integrations: true,  whiteLabel: false, subdomains: 0, nicheAssistant: false, botLab: true  },
  growth:  { quizzes: 999, responses: 150000,   leads: true,  ai: true,  miniApps: 999,     customDomain: true,  metaPixel: true,  integrations: true,  whiteLabel: false, subdomains: 0, nicheAssistant: true,  botLab: true  },
  elite:   { quizzes: 999, responses: Infinity, leads: true,  ai: true,  miniApps: 999,     customDomain: true,  metaPixel: true,  integrations: true,  whiteLabel: true,  subdomains: 5, nicheAssistant: true,  botLab: true  },
};

function getPlanCaps(plan) {
  return PlanLimits[plan] || PlanLimits.free;
}

function canUsePlanFeature(feature) {
  const plan = Settings.get().plan || 'free';
  const caps = getPlanCaps(plan);
  return !!caps[feature];
}

function getPlanUpgradeMsg(feature) {
  const msgs = {
    leads: 'La captura de leads requiere plan Starter o superior.',
    ai: 'La generación con IA requiere plan Pro o superior.',
    customDomain: 'El dominio personalizado requiere plan Pro o superior.',
    metaPixel: 'Meta Pixel requiere plan Pro o superior.',
    integrations: 'Las integraciones requieren plan Pro o superior.',
    botLab: 'Bot Lab requiere plan Starter o superior.',
    nicheAssistant: 'El Asistente IA del nicho requiere plan Growth o superior.',
    whiteLabel: 'White-label requiere plan Elite.',
    subdomains: 'Los subdominios requieren plan Elite.',
  };
  return msgs[feature] || 'Esta función requiere un plan superior.';
}

// ── Response tracking ─────────────────────────────────────
// Cuenta cada sesión única de un visitante en un quiz o mini-app.
// Usa fingerprint local + mes actual para evitar duplicados.
const ResponseTracker = {
  _visitorId() {
    let vid = localStorage.getItem('ls_visitor_id');
    if (!vid) {
      vid = 'v_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('ls_visitor_id', vid);
    }
    return vid;
  },
  _monthKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  },
  _storageKey(ownerId) {
    return `ls_responses_${ownerId}_${this._monthKey()}`;
  },
  // Registra una respuesta única (mismo visitante en el mismo contenido = no cuenta)
  async track(ownerId, contentType, contentId) {
    if (!ownerId || !contentId) return { counted: false };
    const vid = this._visitorId();
    const seenKey = `ls_seen_${contentType}_${contentId}_${this._monthKey()}`;
    if (localStorage.getItem(seenKey)) return { counted: false, reason: 'already_counted' };
    localStorage.setItem(seenKey, '1');
    // localStorage counter (fast path)
    const sk = this._storageKey(ownerId);
    const current = parseInt(localStorage.getItem(sk) || '0', 10);
    localStorage.setItem(sk, String(current + 1));
    // Supabase persistence
    try {
      if (typeof DB !== 'undefined' && DB.responses?.track) {
        await DB.responses.track({ ownerId, contentType, contentId, visitorId: vid, month: this._monthKey() });
      }
    } catch (_) {}
    return { counted: true, total: current + 1 };
  },
  // Obtiene el conteo del mes actual para el usuario logueado
  async getCurrentMonthCount(ownerId) {
    if (!ownerId) return 0;
    const sk = this._storageKey(ownerId);
    let count = parseInt(localStorage.getItem(sk) || '0', 10);
    try {
      if (typeof DB !== 'undefined' && DB.responses?.getMonthCount) {
        const remote = await DB.responses.getMonthCount(ownerId, this._monthKey());
        if (remote != null) {
          count = remote;
          localStorage.setItem(sk, String(count));
        }
      }
    } catch (_) {}
    return count;
  },
  // Devuelve estado: usado, límite, porcentaje, si está cerca/excedido
  async getUsageStatus(ownerId) {
    const plan = Settings.get().plan || 'free';
    const caps = getPlanCaps(plan);
    const limit = caps.responses;
    const used = await this.getCurrentMonthCount(ownerId);
    const unlimited = limit === Infinity;
    const pct = unlimited ? 0 : Math.min(100, Math.round((used / limit) * 100));
    return {
      used,
      limit: unlimited ? '∞' : limit,
      limitRaw: limit,
      percent: pct,
      unlimited,
      nearLimit: !unlimited && pct >= 80 && pct < 100,
      exceeded: !unlimited && used >= limit,
      plan,
    };
  },
};

// ── Integrations (Zapier / Mailchimp / etc.) ─────────────
// Dispara webhooks reales cuando se captura un lead.
// Configuración se guarda en localStorage bajo 'ls_integrations'.
const Integrations = {
  _getState() {
    try { return JSON.parse(localStorage.getItem('ls_integrations') || '{}'); }
    catch { return {}; }
  },

  // Envía lead a todas las integraciones conectadas (fire-and-forget, no bloquea)
  async fireLeadCaptured(lead) {
    const state = this._getState();

    // Zapier: POST directo al webhook URL del usuario (no requiere CORS proxy)
    try {
      const zap = state.zapier;
      if (zap?.connected && zap.webhookUrl && /^https?:\/\//.test(zap.webhookUrl)) {
        fetch(zap.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'lead_captured',
            timestamp: new Date().toISOString(),
            ...lead,
          }),
          mode: 'no-cors', // Zapier acepta no-cors
        }).catch(() => {});
      }
    } catch (_) {}

    // Mailchimp: CORS bloquea la API directa. Se usa webhook de Zapier como puente
    // o el creador debe conectar via Zapier. Guardamos el intento para auditoría.
    try {
      const mc = state.mailchimp;
      if (mc?.connected && mc.apiKey && mc.listId) {
        // Log local (no llamada directa por CORS)
        const queue = JSON.parse(localStorage.getItem('ls_mailchimp_queue') || '[]');
        queue.push({ ...lead, ts: Date.now() });
        if (queue.length > 100) queue.shift();
        localStorage.setItem('ls_mailchimp_queue', JSON.stringify(queue));
      }
    } catch (_) {}
  },
};

// ── Hotmart checkout URLs ──────────────────────────────────
function getHotmartUrl(plan) {
  const s = Settings.get();
  const DEFAULTS = {
    starter: 'https://pay.hotmart.com/W105245250P',
    pro:     'https://pay.hotmart.com/P105245330A',
    growth:  'https://pay.hotmart.com/A105245379C',
    elite:   'https://pay.hotmart.com/U105245430N',
  };
  const urls = {
    starter: s.hotmartStarter || DEFAULTS.starter,
    pro:     s.hotmartPro     || DEFAULTS.pro,
    growth:  s.hotmartGrowth  || DEFAULTS.growth,
    elite:   s.hotmartElite   || DEFAULTS.elite,
  };
  return urls[plan] || './precios.html';
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
