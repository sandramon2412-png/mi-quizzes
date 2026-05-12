// ============================================================
// Luminous Studio — Core App Library
// Storage, Claude API, Quiz Logic, Analytics
// ============================================================

// ── Storage keys ──────────────────────────────────────────
const KEYS = {
  SETTINGS: 'ls_settings',
  QUIZZES:  'ls_quizzes',
  MINI_APPS: 'ls_mini_apps',
  LANDINGS: 'ls_landings',
  EBOOKS:   'ls_ebooks',
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

// ── Landings (Landing Builder) ────────────────────────────
const Landings = {
  getAll() { return Store.get(KEYS.LANDINGS) || []; },
  get(id) { return this.getAll().find(l => l.id === id) || null; },
  save(landing) {
    const all = this.getAll();
    const idx = all.findIndex(l => l.id === landing.id);
    landing.updated_at = new Date().toISOString();
    if (idx >= 0) all[idx] = landing;
    else all.unshift(landing);
    Store.set(KEYS.LANDINGS, all);
    return landing;
  },
  create(data) {
    const landing = {
      id: crypto.randomUUID(),
      slug: data.slug || this._genSlug(data.title || 'landing'),
      title: data.title || 'Nueva landing',
      brief: data.brief || '',
      html: data.html || '',
      messages: data.messages || [],
      published: false,
      visits: 0,
      settings: data.settings || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return this.save(landing);
  },
  delete(id) {
    Store.set(KEYS.LANDINGS, this.getAll().filter(l => l.id !== id));
  },
  canCreate() {
    const plan = Settings.get().plan;
    const cap = getPlanCaps(plan).landings || 0;
    return this.getAll().length < cap;
  },
  getLimit() {
    const plan = Settings.get().plan;
    return getPlanCaps(plan).landings || 0;
  },
  _genSlug(title) {
    return (title || 'landing').toString()
      .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'landing';
  },
};

// ── Ebooks (Ebook Packager) ────────────────────────────────
const Ebooks = {
  getAll() { return Store.get(KEYS.EBOOKS) || []; },
  get(id) { return this.getAll().find(e => e.id === id) || null; },
  save(ebook) {
    const all = this.getAll();
    const idx = all.findIndex(e => e.id === ebook.id);
    ebook.updated_at = new Date().toISOString();
    if (idx >= 0) all[idx] = ebook;
    else all.unshift(ebook);
    Store.set(KEYS.EBOOKS, all);
    return ebook;
  },
  create(data) {
    const ebook = {
      id: crypto.randomUUID(),
      title: data.title || 'Mi ebook',
      brief: data.brief || '',
      topic: data.topic || '',
      audience: data.audience || '',
      tone: data.tone || '',
      source: data.source || '',
      docType: data.docType || 'ebook',
      theme: data.theme || 'light',
      chapters: data.chapters || [],
      cover: data.cover || { gradientFrom: '#2E5BFF', gradientTo: '#7c3aed', subtitle: '' },
      messages: data.messages || [],
      settings: data.settings || {},
      downloads: 0,
      created_at: new Date().toISOString(),
    };
    return this.save(ebook);
  },
  delete(id) { Store.set(KEYS.EBOOKS, this.getAll().filter(e => e.id !== id)); },
  capFor(plan) { return getPlanCaps(plan).ebooks || 0; },
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

window.getPremiumNicheTheme = function getPremiumNicheTheme(niche = '', product = '') {
  const text = `${niche} ${product}`.toLowerCase();
  const themes = [
    { id:'spiritual', test:/espirit|bibl|fe\b|dios|oraci|cristi|religi|angel|sagr|devocional|comuni[oó]n|iglesi/, mode:'light', accent:'#B96F5F', accent2:'#D8A06F', bg:'#FBF4ED', card:'#FFFAF6', text:'#372620', muted:'#8B7065', font:'serif', imageKeywords:'spiritual journal warm light', coverImage:'https://source.unsplash.com/featured/1200x630/?spiritual,journal,warm-light' },
    { id:'wellness', test:/bienestar|wellness|ansiedad|estr[eé]s|mindful|medita|terapia|autoestima|habitos|hábitos|autocuidado|sue[nñ]o/, mode:'light', accent:'#4F8A8B', accent2:'#D6A77A', bg:'#F6F3EE', card:'#FFFDF8', text:'#273A38', muted:'#75827B', font:'serif', imageKeywords:'calm wellness journal', coverImage:'https://source.unsplash.com/featured/1200x630/?wellness,journal,calm' },
    { id:'beauty', test:/belleza|skincare|maquill|est[eé]tic|cosmet|cabello|piel|salon|u[nñ]as/, mode:'light', accent:'#B85C8E', accent2:'#D9A66A', bg:'#FFF6F8', card:'#FFFFFF', text:'#3A2431', muted:'#9A7587', font:'serif', imageKeywords:'premium beauty skincare', coverImage:'https://source.unsplash.com/featured/1200x630/?beauty,skincare,premium' },
    { id:'motherhood', test:/maternidad|mam[aá]|madre|beb[eé]|embaraz|crianza|lactancia|posparto|hijo|infantil|ni[nñ]o|familia/, mode:'light', accent:'#D96F8C', accent2:'#E7B86B', bg:'#FFF7F3', card:'#FFFFFF', text:'#3B2528', muted:'#9C7478', font:'serif', imageKeywords:'warm motherhood lifestyle', coverImage:'https://source.unsplash.com/featured/1200x630/?motherhood,warm,lifestyle' },
    { id:'nutrition', test:/nutri|dieta|alimenta|comida|receta|cocina|meal|keto|vegano|ayuno|saludable/, mode:'light', accent:'#2F8F5B', accent2:'#E2A950', bg:'#F3FAF2', card:'#FFFFFF', text:'#1F3A2B', muted:'#6E8374', font:'sans', imageKeywords:'healthy food fresh kitchen', coverImage:'https://source.unsplash.com/featured/1200x630/?healthy-food,fresh,kitchen' },
    { id:'fitness', test:/fitness|gym|ejercicio|entren|peso|muscul|cardio|crossfit|deport|pilates/, mode:'dark', accent:'#F97316', accent2:'#EF4444', bg:'#0A0A0A', card:'#18181B', text:'#F7F7F5', muted:'#A3A3A3', font:'sans', imageKeywords:'premium fitness training', coverImage:'https://source.unsplash.com/featured/1200x630/?fitness,training,premium' },
    { id:'finance', test:/finanz|dinero|ahorro|invers|deuda|presupuesto|wealth|money|trading|cripto|bolsa|forex/, mode:'dark', accent:'#1F7A5A', accent2:'#C8A24A', bg:'#0D1117', card:'#151B24', text:'#F4F7F5', muted:'#8FA199', font:'sans', imageKeywords:'personal finance savings', coverImage:'https://source.unsplash.com/featured/1200x630/?personal-finance,savings' },
    { id:'business', test:/negocio|marketing|ventas|ads|emprend|startup|copy|email|lanzamiento|funnel|embudo|redes|contenido|lider/, mode:'dark', accent:'#3157C9', accent2:'#31C48D', bg:'#0B1020', card:'#141B2F', text:'#F3F7FF', muted:'#94A3B8', font:'sans', imageKeywords:'digital business strategy', coverImage:'https://source.unsplash.com/featured/1200x630/?digital-business,strategy' },
    { id:'education', test:/educaci|curso|idioma|ingl[eé]s|aprendiz|estudi|escuela|lectura|academ/, mode:'light', accent:'#3157C9', accent2:'#E0A84E', bg:'#F5F7FB', card:'#FFFFFF', text:'#1D2A3B', muted:'#6F7B8D', font:'sans', imageKeywords:'premium education study', coverImage:'https://source.unsplash.com/featured/1200x630/?education,study,premium' },
    { id:'relationships', test:/relacion|pareja|amor|cita|matrimon|divorcio|seducci|atracci|noviazgo/, mode:'light', accent:'#B96072', accent2:'#C79A63', bg:'#FFF5F2', card:'#FFFFFF', text:'#392428', muted:'#8F7073', font:'serif', imageKeywords:'warm relationship journal', coverImage:'https://source.unsplash.com/featured/1200x630/?relationship,journal,warm' },
  ];
  const theme = themes.find(t => t.test.test(text)) || { id:'premium', mode:'light', accent:'#7A5C8F', accent2:'#C4A7D7', bg:'#F7F4FA', card:'#FFFFFF', text:'#2F2837', muted:'#7A7082', font:'sans', imageKeywords:'premium digital product', coverImage:'https://source.unsplash.com/featured/1200x630/?premium,digital-product' };
  return { ...theme, brandColor: theme.accent, accentColor: theme.accent2 };
};

window.getSuggestedOfferTheme = function getSuggestedOfferTheme(niche = '', product = '') {
  return { ...window.getPremiumNicheTheme(niche, product) };
};

// ── Claude API ─────────────────────────────────────────────
const Claude = {
  async _call(messages, maxTokens = 3000, opts = {}) {
    const model = opts.model || 'claude-haiku-4-5-20251001';
    const body = { model, max_tokens: maxTokens, messages };
    if (opts.system) body.system = opts.system;
    const doRequest = async (token) => fetch(`${SUPABASE_URL}/functions/v1/claude-proxy`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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

    // Retry once on 504/502/524/546 (transient gateway/CPU limits on long prompts)
    if (res.status === 504 || res.status === 502 || res.status === 524 || res.status === 546) {
      await new Promise(r => setTimeout(r, 1500));
      res = await doRequest(token);
    }

    // On 401, sign out and tell user to re-login
    if (res.status === 401) {
      throw new Error('Sesión expirada. Por favor recarga la página e inicia sesión de nuevo. O configura tu API key de Groq en Ajustes para no depender del proxy.');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.error?.message || `Error ${res.status}`;
      if (res.status === 429) throw new Error('Límite de peticiones alcanzado. Espera un momento e intenta de nuevo.');
      if (res.status === 504 || res.status === 502 || res.status === 524 || res.status === 546) {
        throw new Error('La IA excedió el tiempo permitido. Reducí los capítulos (probá 6) o acortá el material de entrada.');
      }
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
    const optionJsonExample = Array.from({ length: nO }, (_, i) => {
      const profiles = i === 2 ? '["id_perfil", "id_perfil2"]' : '["id_perfil"]';
      return `        {"text": "situacion reconocible del nicho con jerga real", "profiles": ${profiles}}`;
    }).join(',\n');
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
- NO uses emojis. El diseño visual usa iconos premium de la interfaz, no caracteres emoji.

═══ REGLAS PARA LOS PERFILES (3 perfiles) ═══${archetypeHint}
• name: Identidad poderosa y específica del nicho (NO genérica como "El Principiante")
• emoji: déjalo vacío como "".
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
${optionJsonExample}
      ]
    }
  ],
  "profiles": [
    {
      "id": "id_perfil",
      "name": "Nombre Identidad Específica del Nicho",
      "emoji": "",
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
{"apps":[{"name":"Nombre específico del nicho","icon":"nombre de Material Symbol en inglés, ejemplo: checklist, route, psychology","type":"tipo_elegido","description":"Qué hace exactamente y cómo ayuda al usuario con un dolor real del nicho en 1 oración","features":["Función clave específica del nicho 1","Función clave 2","Función clave 3"]}]}

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

  // ── Landing Builder ───────────────────────────────────────
  _landingSystemPrompt() {
    return `Eres un diseñador web senior (nivel Stripe, Linear, Vercel) especializado en landing pages de alta conversión para infoproductos hispanohablantes. Tu estética es moderna, premium, con tipografía grande y mucho espacio. Cada landing que generas convierte visitantes en compradores aplicando principios de CRO profesional.

REGLAS TÉCNICAS:
1. Devuelve SIEMPRE una landing COMPLETA como un único fragmento HTML autocontenido.
2. Empieza DIRECTAMENTE con <!DOCTYPE html>. NO envuelvas en markdown, NO agregues explicaciones antes o después.
3. Incluye <script src="https://cdn.tailwindcss.com"></script> en el <head>.
4. Fuente: Plus Jakarta Sans (weight 300 a 800) via Google Fonts.
5. NUNCA uses emojis. Usa Material Symbols Outlined (<link href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined" rel="stylesheet">).
6. Debe ser 100% RESPONSIVE (mobile first).
7. Prohibido incluir scripts externos, fetches a otros dominios ni tracking pixels. Sí podés usar <script> inline para interacciones (acordeones, animaciones, tabs) si el brief lo pide.
8. Si el usuario pide cambios, devuelve la landing COMPLETA con los cambios aplicados — no diffs ni parches.
9. INSTRUCCIONES DEL CREADOR: si el brief incluye "INSTRUCCIONES DE DISEÑO DEL CREADOR" o "INSTRUCCIÓN EXACTA", esas instrucciones tienen MÁXIMA PRIORIDAD sobre cualquier regla estética por defecto.
10. ABSOLUTAMENTE PROHIBIDO dentro del HTML: template literals JavaScript (\${...}), .map(), .filter(), .forEach(), arrow functions (=>), expresiones JSX, JSON objects, arrays literales, o cualquier sintaxis de código fuera de un <script>. Todo el contenido de la página debe ser texto HTML estático — escribí cada <li>, <div>, <p> manualmente con su texto final. Si una sección tiene 5 items, escribís 5 elementos HTML, no un array con .map(). NUNCA pongas [{...}].map() dentro del HTML.

ESTÉTICA OBLIGATORIA (salvo que el creador indique otra cosa):
• Dark mode: fondo base #0a0a0a o #0e0e0e; superficies #18181b, #27272a. Textos #fff / #a1a1aa.
• Gradiente de marca: from-[#2E5BFF] via-[#6366f1] to-[#7c3aed].
• Tipografía: titulares h1 de 48-84px (text-5xl a text-7xl), font-extrabold o font-black, tracking-tight, leading-[1.05].
• Gradientes en texto para palabras clave: bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent.
• Spacing generoso: secciones py-20 a py-32, contenedores max-w-6xl mx-auto px-6.
• Cards: bg-zinc-900/60 border border-zinc-800 rounded-2xl con backdrop-blur cuando aplique.
• Botones primarios: gradient background, h-12, px-8, rounded-xl, font-bold, hover:opacity-90, shadow-lg shadow-blue-500/20.
• Glow effects en elementos hero. Borders sutiles border-white/5 o border-zinc-800.
• Radial gradients de fondo en hero con blur-3xl.

MANEJO DE IMÁGENES (leer del brief):
• Si el brief dice IMÁGENES tipo="placeholder": usa Pollinations.ai para generar imágenes IA reales y relevantes al producto. Formato: <img src="https://image.pollinations.ai/prompt/PROMPT?width=800&height=500&nologo=true" alt="..." class="w-full rounded-2xl object-cover" loading="lazy"/>
  - Construí el PROMPT en inglés, específico al nicho del producto, siempre terminando con: +professional+high+quality+modern+dark+background
  - Ejemplos: curso de finanzas → "financial+freedom+laptop+woman+entrepreneur+professional+high+quality+modern+dark+background"; fitness → "woman+fitness+workout+healthy+lifestyle+professional+high+quality+modern+dark+background"; coaching → "business+coaching+success+mentor+professional+high+quality+modern+dark+background"; espiritualidad → "meditation+zen+peaceful+spiritual+woman+professional+high+quality+modern+dark+background"
  - IMPORTANTE: variá los prompts entre imágenes — no uses el mismo para todas. Una puede mostrar al usuario ideal, otra el producto/resultado, otra el proceso.
  - Cada imagen diferente = prompt diferente y descriptivo del contexto donde aparece.
• Si el brief dice IMÁGENES tipo="upload": usa divs de upload: <div data-upload-slot="true" class="w-full aspect-video rounded-2xl border-2 border-dashed border-zinc-700 hover:border-blue-500/50 transition flex flex-col items-center justify-center gap-3 bg-zinc-900/40 cursor-pointer"><span class="material-symbols-outlined text-zinc-500" style="font-size:40px">cloud_upload</span><p class="text-sm text-zinc-500 font-medium">Clic para agregar imagen</p></div>
• Si el brief dice IMÁGENES tipo="none": no incluyas imágenes de producto.
• Siempre distribuí las imágenes a lo largo de la landing (hero, módulos, testimonios), no todas juntas.

MANEJO DE VIDEO (leer del brief):
• Si el brief incluye "VIDEO:" seguido de una URL real, añadí una sección dedicada con el video embebido RESPONSIVE justo después del hero o donde tenga más sentido.
• YouTube (contiene youtube.com o youtu.be): extrae el ID y usa <iframe class="w-full aspect-video rounded-2xl shadow-2xl" src="https://www.youtube.com/embed/ID" frameborder="0" allowfullscreen loading="lazy"></iframe>
• Video directo (.mp4, .webm): usa <video class="w-full rounded-2xl shadow-2xl" controls preload="metadata"><source src="URL" type="video/mp4"></video>
• Envolvé en <div class="max-w-4xl mx-auto"> con un título de sección y subtítulo.
• PROHIBIDO ABSOLUTAMENTE inventar URLs de video. NUNCA uses URLs como dQw4w9WgXcQ, Rick Astley, ni ningún otro ID que no esté literalmente en el brief.
• Si el brief NO incluye "VIDEO:" pero alguna otra parte (custom, extras, plantilla) menciona "video preview" o similar: NO embebas un video. En su lugar, agregá un placeholder visual: <div data-upload-slot="true" class="w-full aspect-video rounded-2xl border-2 border-dashed border-zinc-700 hover:border-blue-500/50 transition flex flex-col items-center justify-center gap-3 bg-zinc-900/40 cursor-pointer"><span class="material-symbols-outlined text-zinc-500" style="font-size:48px">play_circle</span><p class="text-sm text-zinc-400 font-medium">Tu video va acá</p><p class="text-xs text-zinc-500">Pegá la URL desde el editor</p></div>
• En resumen: VIDEO REAL solo si el brief tiene URL explícita. NUNCA inventes URLs.

MANEJO DE FONDO DEL HERO (leer del brief):
• Si el brief dice FONDO tipo="color": aplica ese color como background del hero con style="background-color: X".
• Si el brief dice FONDO tipo="image": hero con style="background-image: url('URL'); background-size: cover; background-position: center;" + div overlay oscuro: <div class="absolute inset-0 bg-black/65 backdrop-blur-sm"></div>
• Si el brief dice FONDO tipo="video": hero con position:relative, overflow:hidden. Incluye: <video class="absolute inset-0 w-full h-full object-cover opacity-35" autoplay muted loop playsinline><source src="URL" type="video/mp4"></video> + div overlay negro/40.
• Si el brief dice FONDO tipo="dark" o no dice nada: usa el gradiente radial por defecto.

INTERACTIVIDAD (solo si el brief incluye "INTERACTIVIDAD:"):
• Usa <script> inline al final del body (no externo).
• Implementa: contadores animados en estadísticas (IntersectionObserver), FAQ accordion con smooth expand (max-height transition), tabs en secciones de módulos o beneficios, efecto parallax leve en hero.
• CSS transitions con duration-300 y ease-in-out.

ESTRUCTURA OBLIGATORIA DE ALTA CONVERSIÓN:
1. Nav fijo: logo a la izquierda, 2-3 links ancla, CTA pequeño a la derecha con gradiente.
2. Hero: titular grande con gradiente en 1-2 palabras clave + PROMESA DE TRANSFORMACIÓN ESPECÍFICA, subtítulo con el problema que resuelve, 2 CTAs (primario + secundario outline), prueba social con avatares apilados + número de alumnos/clientes, badge de urgencia ("Precio de lanzamiento — sube en 48h").
3. "¿Para quién es esto?": 2 columnas — "Es para vos si..." (checks verdes) y "No es para vos si..." (X rojos). OBLIGATORIO, ayuda a pre-calificar.
4. Problema/Agitación: sección que nombra el dolor del avatar con especificidad. Empieza con "¿Te suena esto?" y lista 4-5 situaciones de frustración.
5. Métricas/logros: fila de 3-4 stats con números grandes y gradiente (ej: "2.400 alumnos", "97% tasa de éxito").
6. Beneficios: grid 2-3 columnas, mínimo 6 beneficios, cada uno con icono Material Symbols en gradiente. Verbos de acción.
7. "Qué incluye" / Módulos: lista numerada o timeline con cada módulo/entregable y su transformación concreta.
8. Testimonios: mínimo 3 cards con avatar placeholder, nombre latino, rol, quote con resultado ESPECÍFICO MEDIBLE ("pasé de 0 a $3,400 en 60 días"), rating 5 estrellas.
9. ★ BONOS ★ — SECCIÓN OBLIGATORIA: cards visuales para cada bono con nombre, descripción de 1 línea, valor tachado en gris y badge "INCLUIDO GRATIS" en gradiente. Si el brief no especifica bonos, inventa 2-3 bonos creativos y coherentes con el producto (plantillas, sesión grupal, comunidad, checklist, etc.). NUNCA omitas esta sección.
10. Stack de valor: tabla o lista "Todo lo que recibís" con precio de cada elemento tachado vs. precio final. Genera sensación de deal irresistible.
11. Garantía: card destacada con icono de escudo, badge "Garantía de 30 días" y texto tranquilizador. Elimina el riesgo de compra.
12. FAQ: mínimo 6 preguntas con <details>/<summary>, cada una con border-b border-zinc-800. Responde objeciones reales de compra.
13. CTA final: sección full-width con gradiente, urgencia ("Solo X cupos disponibles" o "El precio sube en 48h"), precio visible con anchoring (tachado + actual), botón grande.
14. Footer: logo, copyright, links legales.

COPYWRITING DE ALTA CONVERSIÓN:
• Framework Dolor→Agitación→Solución: nombra el problema, intensifica el dolor, presenta el producto como LA solución.
• Titulares que prometen transformación específica: "De [estado actual] a [estado deseado] en [tiempo]".
• Especificidad con números: "87% de los alumnos", "en 6 semanas", "$1,200 en el primer mes" — no vagas.
• Español latinoamericano neutro, tono profesional pero cercano.
• Bullets que empiecen con verbo de acción: Domina, Conquista, Transforma, Descubre, Aprende, Implementa.
• Precio con anchoring: siempre mostrar precio original tachado + precio actual. Ej: <span class="line-through text-zinc-500">$297</span> <span class="text-4xl font-black">$97</span>
• Testimonios con resultado medible, no solo "me gustó mucho".
• Urgencia real: cupos limitados, precio de lanzamiento, fecha de cierre.
• Llamadas a la acción en primera persona: "Quiero empezar hoy", "Sí, lo quiero".

FÓRMULAS DE COPYWRITING ESPECÍFICAS (aplicar siempre):

HEADLINE — fórmula PAS-T (Problema → Agitación → Solución → Transformación):
• MAL: "La mejor herramienta de gestión" / "Aprende finanzas personales" / "El método definitivo"
• BIEN: "Deja de perder 4 horas al día en reuniones. Automatiza las decisiones de tu equipo en 15 minutos." / "Pasá de vivir de sueldo en sueldo a tener tu primer colchón de $5,000 en 90 días, sin renunciar a lo que disfrutás."
• El h1 debe nombrar el DOLOR concreto del avatar, agitarlo, y prometer la transformación con tiempo específico.

SUBHEADLINE — fórmula MECANISMO + PRUEBA SOCIAL:
• MAL: "Te enseñamos todo lo que necesitás saber." / "Un curso completo para todos los niveles."
• BIEN: "El único método que combina [mecanismo único] con [resultado probado]. Ya lo aplicaron +[número] [tipo de persona] con resultados reales."
• Siempre explicá POR QUÉ funciona (el mecanismo), no solo QUÉ hace.

CTA — fórmula VERBO + RESULTADO (nunca función):
• MAL: "Enviar", "Registrarse", "Comprar", "Acceder"
• BIEN: "Quiero mis primeros $1,000 en 30 días", "Empezar mi transformación ahora", "Sí, quiero el método completo", "Reservar mi lugar hoy"
• El CTA debe describir lo que el usuario OBTIENE, no lo que hace.

MICROCOPY BAJO EL CTA — OBLIGATORIO en cada botón CTA principal:
• Agregar siempre una línea pequeña debajo del botón: "Sin tarjeta de crédito" / "Garantía de 30 días" / "Acceso inmediato" / "Podés cancelar cuando quieras" / "Solo X lugares disponibles"
• Formato: <p class="text-xs text-zinc-500 mt-2 text-center">Sin tarjeta · Acceso inmediato · Garantía 30 días</p>
• Este microcopy elimina el miedo de compra. NUNCA omitirlo.

BULLETS DE BENEFICIOS — fórmula AIDA invertida (resultado → cómo → tiempo/esfuerzo):
• MAL: "Aprenderás a invertir" / "Técnicas de productividad" / "Mindset emprendedor"
• BIEN: "Generá tus primeros $500 de ingreso extra → con el sistema de [mecanismo] → en tu primer fin de semana de implementación"
• Cada bullet = resultado concreto + método que lo produce + cuánto tarda. Verbos de acción al inicio.

FAQ — escribir como OBJECIONES REALES, no preguntas genéricas:
• MAL: "¿Qué es este curso?" / "¿Cuándo empieza?" / "¿Cómo funciona?"
• BIEN: "¿Y si lo compro y no me funciona a mí?" / "¿Necesito experiencia previa?" / "¿Cuánto tiempo tengo que dedicarle?" / "¿Es diferente a lo que ya probé?" / "¿Puedo pagar en cuotas?" / "¿Tenés tarjeta?" / "¿Cuánto tarda en ver resultados reales?"
• Las FAQs deben responder las 3-5 objeciones más comunes del nicho. Cada respuesta: 2-3 oraciones directas, sin rodeos.

TIPOGRAFÍA AVANZADA (UI/UX Pro Max):
• Titulares h1: Plus Jakarta Sans 800, tamaño mínimo 56px mobile / 80px desktop, tracking-tighter, line-height 1.05.
• Body: Plus Jakarta Sans 400-500, 17-18px, line-height 1.65, color #a1a1aa para párrafos secundarios.
• Subtítulos de sección (h2): 36-48px, font-bold o font-extrabold, tracking-tight. NUNCA texto en mayúsculas para párrafos (solo badges/labels cortos).
• Pares tipográficos por nicho — usá siempre Plus Jakarta Sans pero variá pesos:
  - Finanzas/negocios: titulares font-black con número en gradiente, body compact y confiable.
  - Bienestar/espiritualidad: titulares font-light o font-extralight en h1, body con más line-height (1.8).
  - Fitness/salud: titulares font-black uppercase con letter-spacing normal, body sans conciso.
  - Tecnología/SaaS: titulares font-extrabold tracking-tighter, labels en font-mono para métricas.
• NUNCA mezcles más de 2 tamaños de fuente en el mismo bloque de card.

ESTILOS VISUALES PREMIUM (elegí según el nicho del brief):
• Glassmorphism hero: bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl — ideal para tecnología, coaching premium, salud.
• Bento grid para "Qué incluye": grid 2-3 cols con cards de tamaños variables (algunas col-span-2), cada una con icono Material grande (text-5xl) en gradiente. Moderno, alto impacto visual.
• Numbered timeline para módulos: barra vertical izquierda con línea gradiente + círculos numerados, texto a la derecha con h3 + p.
• Feature grid para beneficios: 2-3 cols, cada card con border-l-2 border-blue-500 o border-violet-500, icono arriba, título, descripción corta (máx 2 líneas).
• Testimonios con avatar real (Pollinations.ai): foto de perfil cuadrada 60x60 redondeada + comilla decorativa grande en gradiente como elemento de fondo.
• Stats/métricas: números muy grandes (text-6xl font-black) con gradiente, label pequeño debajo, disposición en fila de 3-4 con separadores sutiles.
• DARK MODE siempre: nunca pongas secciones completamente blancas — en todo caso bg-zinc-950 o bg-zinc-900 para alternar el ritmo visual.

REGLAS UX DE CONVERSIÓN (UI/UX Pro Max — 99 guidelines):
• Botones CTA: height mínima 52px (h-13), border-radius rounded-xl, SIEMPRE texto en primera persona ("Quiero acceso ahora").
• Todos los botones interactivos: transition-all duration-200 ease-in-out + hover:scale-[1.02] + active:scale-[0.98].
• Touch targets mínimos: todo elemento clickeable ≥ 44x44px. Nunca botones pequeños en mobile.
• Espaciado entre CTAs: si hay 2 en el mismo row, gap mínimo de 12px para evitar clics accidentales.
• Acordeones FAQ: max-height transition (max-h-0 → max-h-96), no display:none/block — smooth UX.
• Anchoring de precio: siempre 3 elementos → precio original tachado (text-zinc-500 line-through text-xl) + precio actual (text-5xl font-black text-white) + equivalencia ("= menos que un café por día").
• Garantía: posicionala JUSTO antes del CTA final — es el último empuje para quitar el miedo.
• Urgencia visual: badge rojo o ámbar con borde, texto MAYÚSCULAS, nunca invisible. Posicioná en hero Y en CTA final.
• Progressive disclosure: hero → problema → solución → prueba → oferta. Este orden es el flujo de confianza, nunca lo rompas.
• Formularios de captura de lead: solo 1-2 campos visibles (nombre + email). Input rounded-xl, py-3 px-4, bg-zinc-800 border border-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20.

ANTI-PATTERNS PROHIBIDOS (UI/UX Pro Max):
• NUNCA pongas todas las imágenes en el hero y el resto de la landing sin imágenes — distribuílas.
• NUNCA hagas secciones de más de 3 párrafos sin un elemento visual que corte el bloque de texto.
• NUNCA uses colores saturados brillantes para fondos de sección completos (quema los ojos en dark mode).
• NUNCA generes menos de 3 testimonios — la prueba social múltiple aumenta conversión un 30%+.
• NUNCA pongas el precio sin anchoring — precio solo sin referencia no convierte.
• NUNCA uses la misma estructura de card para todas las secciones — variá glassmorphism, border-gradient, solid, outline.
• NUNCA hagas un hero sin una stat de prueba social (ej: "Más de 2.400 alumnos") — valida la oferta desde arriba.
• NUNCA uses más de 3 colores de acento distintos en una misma landing — genera ruido visual.

CALIDAD:
• NO uses texto placeholder tipo "Lorem ipsum". Genera copy real y específico basado en el brief.
• NO dejes secciones vacías. Si faltan datos, inventa testimonios realistas (nombres latinos), cifras creíbles y bonos coherentes.
• Cada sección debe tener PERSONALIDAD VISUAL propia: variá entre glassmorphism, bento grid, timeline, feature-grid, cards con gradiente.
• Mínimo 12 secciones. Una landing corta NO convierte.

LINKS Y NAVEGACIÓN:
• Todos los <a> y botones CTA deben tener href="#" SIEMPRE.
• NUNCA uses href con rutas del proyecto (./dashboard.html, /login, etc.).
• Los <form> no deben tener action ni method — solo elementos visuales.
• Prohibido window.location o navegación automática.

AUTOCHECK OBLIGATORIO ANTES DE DEVOLVER EL HTML:
Revisá que la landing contiene TODAS estas secciones (si alguna falta, agregala antes de responder):
☑ Hero con titular grande y CTA
☑ Sección "¿Para quién es / No es para quién"
☑ Sección de problema/dolor del avatar
☑ Beneficios en grid
☑ Qué incluye / módulos
☑ Testimonios (mínimo 3)
☑ BONOS — si no está, AGREGALA AHORA. Es la sección más importante para la conversión.
☑ Stack de valor con precios tachados
☑ Garantía
☑ FAQ (mínimo 6)
☑ CTA final con urgencia
Si encontrás que BONOS no está en el HTML generado, insertá la sección completa ANTES de devolver.`;
  },

  async generateLanding(brief, history = []) {
    const messages = [...history, { role: 'user', content: brief }];
    const text = await this._call(messages, 8000, {
      model: 'claude-sonnet-4-6',
      system: this._landingSystemPrompt(),
    });
    // Extract pure HTML: strip any markdown fences or preamble
    let html = text.trim();
    html = html.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const docStart = html.search(/<!DOCTYPE\s+html/i);
    if (docStart > 0) html = html.slice(docStart);
    return html;
  },

  _ebookSystemPrompt() {
    return `Eres un escritor profesional y editor experto en crear ebooks en español estilo Gamma — con bloques visuales, callouts y stats destacados.

FORMATO DE SALIDA — devolvé ÚNICAMENTE un objeto JSON válido, sin markdown, sin \`\`\`, sin texto antes o después. Schema exacto:
{
  "title": "Título del ebook",
  "subtitle": "Subtítulo (1 frase vendedora)",
  "chapters": [
    { "title": "Título de la sección (limpio, sin prefijos como 'Capítulo N:')", "body_md": "Contenido con markdown y HTML embebido..." },
    ...
  ]
}

REGLAS DE CONTENIDO:
- Mínimo 6 capítulos, máximo 10.
- Cada capítulo: 400–650 palabras. Intercalá markdown + bloques HTML visuales.
- Bloques visuales disponibles (incluí al menos 1 por capítulo):
  <div class="callout callout-tip"><strong>Tip</strong><p>…</p></div>
  <div class="callout callout-warn"><strong>Cuidado</strong><p>…</p></div>
  <div class="callout callout-info"><strong>Dato clave</strong><p>…</p></div>
  <div class="callout callout-quote"><p>…cita…</p><cite>— fuente</cite></div>
  <div class="stat-card"><span class="stat-number">75%</span><span class="stat-label">descripción</span></div>
  <ol class="steps"><li>Paso 1…</li><li>Paso 2…</li></ol>
- Usá ## para subsecciones, **negrita** para conceptos clave.
- Primer capítulo = "Introducción" con hook fuerte. Último = "Conclusión y próximos pasos" con CTA.
- Nada de relleno. Valor concreto: ejemplos, pasos, datos.
- Segunda persona (tú/vos según tono).
- NO saludes, entrá directo al contenido.`;
  },

  // Visual blocks available in every document (same CSS in preview + PDF).
  _docBlocksReference() {
    return `BLOQUES VISUALES disponibles (HTML embebido en el body_md):
- <div class="callout callout-tip"><strong>Tip</strong><p>…</p></div>  (tip)
- <div class="callout callout-warn"><strong>Cuidado</strong><p>…</p></div>  (advertencia)
- <div class="callout callout-info"><strong>Dato clave</strong><p>…</p></div>  (dato importante)
- <div class="callout callout-quote"><p>…cita…</p><cite>— fuente</cite></div>
- <div class="stat-card"><span class="stat-number">75%</span><span class="stat-label">descripción</span></div>
- <ol class="steps"><li>Paso 1…</li><li>Paso 2…</li></ol>
- <div class="feature-grid"><div class="feature-item"><div class="feature-icon">check_circle</div><h4 class="feature-title">Título</h4><p class="feature-desc">Descripción breve</p></div>…2 o 4 items…</div>  (grid 2 col; agregá class="cols-3" para 3 col; el feature-icon usa nombres de Material Symbols)
- <div class="numbered-card"><div class="n">1</div><div class="body"><h4>Paso/Item</h4><p>Descripción</p></div></div>  (repetir por cada item; útil para "Lo que lograremos" o pasos grandes)
- <span class="pill">ETIQUETA</span>  /  <span class="pill accent">DESTACADA</span>  /  <span class="pill ghost">SECUNDARIA</span>
- <div class="tab-chips"><span class="chip active">Opción 1</span><span class="chip">Opción 2</span></div>
- <div class="pricing-card"><div class="plan">Plan</div><div class="price">$900 <small>USD</small></div><ul><li>Feature</li><li>Feature</li></ul></div>  (ideal para propuestas; hasta 3 seguidos en una línea)
- Tablas markdown con | col | col | funcionan y toman estilo premium automáticamente.`;
  },

  // Pattern → block mapping. Generic rules that apply to ANY topic/project.
  // This is what turns plain markdown into a Gamma-style visual layout.
  _docPatternRules() {
    return `DISEÑO VISUAL OBLIGATORIO — estas reglas NO son opcionales:

PROHIBICIONES ABSOLUTAS (usar cualquiera de estas opciones arruina el documento):
✗ NO escribas listas markdown "- item" o "- **item**" para 3+ items descriptivos → usá feature-grid o numbered-card
✗ NO escribas listas numeradas "1. item" para pasos/etapas → usá numbered-card o <ol class="steps">
✗ NO uses blockquotes markdown "> texto" → usá siempre <div class="callout callout-tip/warn/info/quote">
✗ NO dejes números, precios o porcentajes importantes dentro de párrafos → usá stat-card o pricing-card
✗ NO entregues secciones con solo párrafos de texto → SIEMPRE al menos 1 bloque visual

CONVERSIONES OBLIGATORIAS (las más frecuentes):
• Lista de servicios / features / beneficios / módulos / pilares (3+) → feature-grid con <div class="feature-item"> + icono Material Symbol
• Pasos / etapas / hitos / fases (2–6) → numbered-card (<div class="numbered-card">) uno por paso
• Pasos rápidos o checklist (3+) → <ol class="steps"><li>…</li></ol>
• Tip / nota / advertencia / cita → <div class="callout callout-tip|warn|info|quote">
• Número, precio, porcentaje, métrica aislada → <div class="stat-card">
• Opciones / planes comparados (2–4) → pricing-card lado a lado
• Etiqueta de categoría / cliente / fecha → <span class="pill accent">ETIQUETA</span>

FORMATO DE CADA BLOQUE:
• feature-grid: <div class="feature-grid"><div class="feature-item"><div class="feature-icon">ICON</div><h4 class="feature-title">Título</h4><p class="feature-desc">Descripción breve</p></div>…</div>
• numbered-card: <div class="numbered-card"><div class="n">1</div><div class="body"><h4>Título</h4><p>Descripción</p></div></div>
• ol.steps: <ol class="steps"><li>Paso claro y accionable</li>…</ol>
• callout: <div class="callout callout-tip"><strong>Tip</strong><p>texto</p></div>
• stat-card: <div class="stat-card"><span class="stat-number">75%</span><span class="stat-label">descripción</span></div>

AUTOCHECK (hacelo ANTES de entregar cada sección):
① ¿Tengo 3+ items descriptivos? → feature-grid ¿Lo usé?
② ¿Tengo 2+ pasos/etapas? → numbered-card ¿Lo usé?
③ ¿Tengo alguna advertencia/tip/nota? → callout ¿Lo usé?
④ ¿La sección tiene al menos 2 bloques HTML visuales? Si no → reformateá ahora.`;
  },

  _docTypePrompt(docType) {
    switch ((docType || 'ebook').toLowerCase()) {
      case 'presentacion':
        return `TIPO DE DOCUMENTO: PRESENTACIÓN / SLIDES.
- Cada sección = una slide. Títulos cortos (3–7 palabras).
- 60–160 palabras por slide. Prioridad al bloque visual por sobre el texto.
- OBLIGATORIO: cada slide tiene MÍNIMO 1 bloque visual. Slides de solo párrafos: PROHIBIDAS.
- 8–12 slides totales.`;

      case 'propuesta':
        return `TIPO DE DOCUMENTO: PROPUESTA / PRESUPUESTO COMERCIAL.
- Tono: profesional cálido, formal ("vos/usted" según el brief).
- 6–9 secciones (portada, entendimiento, servicios, metodología, cronograma, inversión, términos, próximos pasos — adaptá al proyecto real).
- La portada SIEMPRE lleva un <span class="pill accent"> con el cliente o destinatario.
- CADA SECCIÓN DEBE LLENAR SU PÁGINA A4: mínimo 220 palabras de contenido útil + 2 bloques visuales sustanciales. Una sección con 3 oraciones y listo está PROHIBIDA.
- OBLIGATORIO: al menos UNA sección con tabla markdown (el cronograma, el desglose de inversión, o la comparativa de planes). Sin tabla, la propuesta se ve incompleta.
- OBLIGATORIO: la sección "Servicios" o equivalente usa feature-grid con 3–6 items (no lista markdown).
- OBLIGATORIO: la sección "Inversión" o "Precios" usa pricing-card lado a lado (2–3 opciones) o stat-card para valores clave.
- OBLIGATORIO: la sección "Metodología" o "Proceso" usa numbered-card (una por fase/etapa).
- Introducción/Resumen ejecutivo: expandí con 2 párrafos + feature-grid de "qué incluye este documento" (3 items). NUNCA solo el título del material fuente.
- Si el material de base es escaso, INVENTÁ contenido coherente con el brief (no inventes datos específicos como precios, pero sí descripciones de servicios y metodología).
- IGNORÁ marcadores del source tipo "PÁGINA N – TITLE", "text", "Slide N:", "PROPUESTA COMPLETA PARA X" (si es solo header) — son artefactos, no contenido.`;

      case 'checklist':
        return `TIPO DE DOCUMENTO: CHECKLIST / GUÍA PASO A PASO.
- 5–10 secciones. Cada paso = una sección.
- OBLIGATORIO por sección: 1 párrafo corto de objetivo + 1 ol.steps o 1 numbered-card. Sin párrafos largos.
- Intro con feature-grid de 3–4 "qué vas a lograr". Cierre con ol.steps recopilando los hitos.
- Callout-tip / callout-warn mínimo 1 cada 2 secciones.`;

      case 'documento':
        return `TIPO DE DOCUMENTO: DOCUMENTO LIBRE.
- Respetá la estructura del brief/material. No fuerces intro+desarrollo+conclusión.
- Usá los bloques visuales que mejoren la lectura (sin ignorar los patrones).
- Longitud y tono: lo que pida el brief.`;

      case 'ebook':
      default:
        return `TIPO DE DOCUMENTO: EBOOK.
- 6–10 capítulos narrativos, 400–650 palabras cada uno.
- Primera sección = introducción con hook; última = conclusión con CTA/próximos pasos.
- OBLIGATORIO por capítulo: 2+ bloques visuales (mezclá callout, stat-card, feature-grid, numbered-card, ol.steps, tabla).
- Tono narrativo en segunda persona. Valor concreto: ejemplos, pasos, datos.`;
    }
  },

  _ebookChatSystemPrompt(docType = 'ebook') {
    return `Sos un editor+diseñador de documentos (tipo actual: ${docType}). El usuario te pide cambios puntuales sobre un documento existente. Respondés con un JSON chico que describe SOLO lo que cambia — NUNCA devuelvas el documento completo.

Cuando escribís body_md nuevo (en updates o insert_after), aplicás las mismas reglas de patrón visual que en una generación fresca:

${this._docPatternRules()}

${this._docBlocksReference()}

FORMATO DE SALIDA — ÚNICAMENTE un JSON válido, sin markdown, sin \`\`\`, sin prosa antes o después.

Elegí UNA de estas opciones según el pedido:

(A) Cambios al contenido — partial updates. Incluí solo las claves que aplican:
{
  "title": "Nuevo título del libro",                        // opcional: solo si cambia
  "subtitle": "Nuevo subtítulo",                            // opcional: solo si cambia
  "updates": {                                              // opcional: capítulos a modificar
    "<índice>": { "title": "…", "body_md": "…" }            // incluí solo los campos que cambian
  },
  "delete": [<índices a borrar>],                           // opcional, ej: [3]
  "insert_after": [                                         // opcional: capítulos nuevos
    { "index": 1, "title": "…", "body_md": "…" }            // se inserta DESPUÉS de ese índice
  ],
  "message": "Una oración amigable explicando lo que cambiaste"
}

(B) Conversación — si el pedido no implica modificar contenido (pregunta general, aclaración, pedido ambiguo o sobre layout/visual):
{ "conversation": "mensaje al usuario en prosa clara" }

REGLAS CRÍTICAS:
- Los índices son 0-based sobre el array actual de capítulos.
- "pag 4" / "página 4" usualmente se refiere al capítulo 4 (índice 3). Si dudás, usá "conversation" para preguntar.
- NUNCA devuelvas el array completo de chapters. Solo lo que cambia.
- Si el usuario pide algo de layout (espacios en blanco, orden visual, cortes de página), respondé con "conversation" diciendo que eso se edita en la preview (hay botones Subir/Bajar/Cortar página/Borrar al pasar el mouse).
- body_md puede tener markdown + HTML (callouts, stat-cards, ol.steps, tablas | col | col |).
- JSON VÁLIDO OBLIGATORIO: dentro de los strings, los saltos de línea van como \\n, las comillas como \\", las tabulaciones como \\t. Nunca pongas saltos de línea crudos dentro de un string.
- Si el pedido no entra en este schema (ej: "mejorá el texto", "hacelo más corto", "agregá una tabla" sin índice claro), respondé con "conversation" pidiendo la aclaración mínima necesaria.
- Sé breve. JSON chico = menos truncación.`;
  },

  _parseJSONLoose(text) {
    let json = (text || '').trim();
    json = json.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const start = json.indexOf('{');
    const end = json.lastIndexOf('}');
    if (start >= 0 && end > start) json = json.slice(start, end + 1);
    try { return JSON.parse(json); } catch {}
    // Try a couple of common fixups before giving up.
    let fixed = json
      .replace(/[‘’]/g, "'")       // smart single quotes → straight
      .replace(/[“”]/g, '"')       // smart double quotes → straight
      .replace(/,(\s*[}\]])/g, '$1');        // trailing commas
    try { return JSON.parse(fixed); } catch {}
    // Last resort: escape raw newlines/tabs that appear inside string values.
    // Walk the JSON, tracking whether we're inside a string, and escape any
    // unescaped control chars. This rescues responses where the model wrote
    // multi-line markdown bodies without \n escapes.
    let out = '', inStr = false, esc = false;
    for (const ch of fixed) {
      if (esc) { out += ch; esc = false; continue; }
      if (ch === '\\') { out += ch; esc = true; continue; }
      if (ch === '"') { inStr = !inStr; out += ch; continue; }
      if (inStr && ch === '\n') { out += '\\n'; continue; }
      if (inStr && ch === '\r') { out += '\\r'; continue; }
      if (inStr && ch === '\t') { out += '\\t'; continue; }
      out += ch;
    }
    return JSON.parse(out);
  },

  _extractFromBadJSON(text) {
    // Rescue a conversational reply from a truncated/malformed JSON response.
    const pick = (k) => {
      const re = new RegExp('"' + k + '"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"');
      const m = (text || '').match(re);
      if (!m) return null;
      try { return JSON.parse('"' + m[1] + '"'); } catch { return m[1]; }
    };
    return pick('conversation') || pick('message') || null;
  },

  async generateEbookOutline(brief, docType = 'ebook') {
    const system = `Eres un editor profesional de documentos en español. Tu tarea es generar SOLO el outline.
Devolvé ÚNICAMENTE JSON válido, sin markdown, sin \`\`\`. Schema exacto:
{
  "title": "Título del documento",
  "subtitle": "Subtítulo (1 frase vendedora)",
  "chapterTitles": ["Título de la primera sección", "Título de la segunda sección", ..., "Título de la última sección"]
}
REGLAS:
- Los títulos son LIMPIOS: sin prefijos tipo "Capítulo 1:", "Sección N —", "Slide 3:". Solo el nombre real de la sección.
- Títulos específicos y accionables, no genéricos.
- Si el brief indica material de base, los títulos deben reflejar ese contenido.

${this._docTypePrompt(docType)}`;
    const text = await this._call([{ role: 'user', content: brief }], 1200, {
      model: 'claude-sonnet-4-6', system,
    });
    try { return this._parseJSONLoose(text); }
    catch { throw new Error('No pude generar el outline. Intentá de nuevo.'); }
  },

  async generateEbookChapter({ bookTitle, bookSubtitle, chapterTitle, chapterIndex, totalChapters, tone, sourceExcerpt, audience, docType = 'ebook' }) {
    const system = `Eres un escritor+diseñador profesional de documentos en español estilo Gamma. Tu trabajo NO es escribir prosa plana; es DISEÑAR la sección con bloques visuales que comuniquen mejor el mensaje.

Devolvé ÚNICAMENTE el contenido de la sección en markdown con HTML embebido. NO devuelvas JSON, NO uses \`\`\`, NO incluyas el título (ya lo tengo).

${this._docTypePrompt(docType)}

${this._docPatternRules()}

${this._docBlocksReference()}

REGLAS GENERALES:
- Usá ## para subsecciones (SIN prefijar con "Capítulo N" / "Sección N" / dos puntos finales).
- **Negrita** para conceptos clave, listas con -, citas con >.
- NO saludes, entrá directo al contenido.
- Si hay material de base, preservá sus ejemplos y datos — no inventes.
- IGNORÁ totalmente marcadores del material fuente tipo "PÁGINA 1 – PORTADA", "PÁGINA 2 – OBJETIVOS", "Slide N:", "Página N:", y palabras sueltas "text" / "placeholder" / "[Fecha actual]" — ES SUCIEDAD del source, no la copies. Si el source dice "PÁGINA 3 – CLIENTE text\\nSpark Group...", entregá SOLO "Spark Group..." reestructurado con bloques visuales.
- EXTENSIÓN MÍNIMA: cada sección debe llenar la página A4 con contenido útil. Si tenés poco material, desarrollá con ejemplos, pasos, detalles, datos. NUNCA entregues una sección con menos de 180 palabras visibles más 2 bloques visuales que ocupen espacio (feature-grid, numbered-card, stat-card, tabla, pricing-card).
- Material Symbols válidos para .feature-icon: 'check_circle', 'rocket_launch', 'insights', 'support_agent', 'verified', 'campaign', 'shopping_cart', 'description', 'edit', 'videocam', 'language', 'auto_awesome', 'paid', 'schedule', 'workspace_premium', 'savings', 'analytics', 'design_services', 'groups', 'handshake', 'target', 'trending_up', 'article', 'palette'.`;
    // Pre-clean source excerpt: strip literal page markers and stray "text" placeholders
    // so they don't bleed into the generated output.
    const cleanSource = (sourceExcerpt || '')
      .replace(/P[ÁA]GINA\s+\d+\s*[–\-—]\s*[^\n]*?\btext\b/gi, '')
      .replace(/P[ÁA]GINA\s+\d+\s*[–\-—]\s*[A-ZÁÉÍÓÚÑ ]{2,}$/gim, '')
      .replace(/\bSlide\s+\d+\s*[:\-–—][^\n]*/gi, '')
      .replace(/^\s*text\s*$/gim, '')
      .replace(/\[Fecha\s+actual\]/gi, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    const userMsg = [
      `Documento: "${bookTitle}"${bookSubtitle ? ` — ${bookSubtitle}` : ''}.`,
      audience ? `Audiencia: ${audience}.` : '',
      `Tono: ${tone}.`,
      `Sección ${chapterIndex + 1} de ${totalChapters}: "${chapterTitle}".`,
      cleanSource ? `\nMaterial de base relevante para esta sección:\n---\n${cleanSource}\n---\nUsá este material como fuente principal. Preservá ejemplos y datos — pero ignorá los marcadores "PÁGINA N – TITLE", "text", "[Fecha actual]" y demás artefactos del formato original.` : '',
      `\nEscribí el contenido completo de la sección ahora (solo el cuerpo, sin título, sin JSON, sin el prefijo "Capítulo N"). DEBE llenar la página: mínimo 180 palabras + 2 bloques visuales.`,
    ].filter(Boolean).join(' ');
    const text = await this._call([{ role: 'user', content: userMsg }], 3000, {
      model: 'claude-sonnet-4-6', system,
    });
    // Strip any accidental JSON wrapping or code fences
    let body = text.trim();
    body = body.replace(/^```(?:markdown|md)?\s*/i, '').replace(/```\s*$/i, '').trim();
    // If Claude accidentally returned JSON, try to extract body_md
    if (body.startsWith('{') && body.includes('body_md')) {
      try {
        const parsed = this._parseJSONLoose(body);
        if (parsed.body_md) body = parsed.body_md;
      } catch {}
    }
    // Final cleanup: strip artifacts that may have slipped through from source material
    body = body
      .replace(/P[ÁA]GINA\s+\d+\s*[–\-—]\s*[^\n]*?\btext\b/gi, '')
      .replace(/P[ÁA]GINA\s+\d+\s*[–\-—]\s*[A-ZÁÉÍÓÚÑ ]{3,}$/gim, '')
      .replace(/^\s*text\s*$/gim, '')
      .replace(/\[Fecha\s+actual\]/gi, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    return { title: chapterTitle, body_md: body };
  },

  async generateEbook(brief, history = [], onProgress, docType = 'ebook') {
    // Chat iteration: partial-updates protocol (small JSON, no full-ebook regen).
    if (history.length > 0) {
      const messages = [...history, { role: 'user', content: brief }];
      const text = await this._call(messages, 3000, {
        model: 'claude-sonnet-4-6',
        system: this._ebookChatSystemPrompt(docType),
      });
      try {
        const data = this._parseJSONLoose(text);
        if (data && typeof data.conversation === 'string') {
          return { __conversational: true, reply: data.conversation };
        }
        return { __partial: true, ...data };
      } catch {
        // Log the raw response so it's inspectable from the browser console.
        try { console.warn('[ebook-chat] unparseable AI response:', text); } catch {}
        const rescued = this._extractFromBadJSON(text);
        if (rescued) return { __conversational: true, reply: rescued };
        return { __conversational: true, reply: (text || '').slice(0, 600) };
      }
    }

    // Fresh generation: outline then chapter-by-chapter (avoids CPU/timeout limits)
    // Prefer the docType param, but fall back to parsing it out of the brief
    // (some callers inject "Tipo de documento: <x>." at the top).
    if (!docType || docType === 'ebook') {
      const dtMatch = brief.match(/Tipo de documento:\s*([a-z]+)/i);
      if (dtMatch?.[1]) docType = dtMatch[1].toLowerCase();
    }

    onProgress?.({ stage: 'outline' });
    const outline = await this.generateEbookOutline(brief, docType);
    const chapterTitles = outline.chapterTitles || [];
    if (!chapterTitles.length) throw new Error('El outline no tiene capítulos.');

    // Extract tone/audience/source from brief for chapter calls
    const toneMatch = brief.match(/Tono:\s*([^.]+)\./i);
    const tone = toneMatch?.[1]?.trim() || 'conversacional';
    const audienceMatch = brief.match(/Audiencia:\s*([^.]+)\./i);
    const audience = audienceMatch?.[1]?.trim() || '';
    const sourceMatch = brief.match(/---MATERIAL---\n([\s\S]*?)\n---FIN MATERIAL---/);
    const source = sourceMatch?.[1] || '';

    const chapters = [];
    const total = chapterTitles.length;
    const chunkSize = source ? Math.floor(source.length / total) : 0;

    for (let i = 0; i < total; i++) {
      onProgress?.({ stage: 'chapter', current: i + 1, total });
      const sourceExcerpt = source ? source.slice(i * chunkSize, (i + 1) * chunkSize + 400).trim() : '';
      const ch = await this.generateEbookChapter({
        bookTitle: outline.title,
        bookSubtitle: outline.subtitle,
        chapterTitle: chapterTitles[i],
        chapterIndex: i,
        totalChapters: total,
        tone, audience, sourceExcerpt, docType,
      });
      chapters.push(ch);
    }

    return { title: outline.title, subtitle: outline.subtitle, chapters };
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
  // Complejo: landing completa en HTML+Tailwind con Sonnet 4.6
  async generateLanding(brief, history = []) {
    return Claude.generateLanding(brief, history);
  },
  // Complejo: ebook estructurado (JSON con capítulos en Markdown)
  async generateEbook(brief, history = [], onProgress, docType = 'ebook') {
    return Claude.generateEbook(brief, history, onProgress, docType);
  },
  // Complejo: regenera UNA sola sección de un documento (usado por el botón
  // "Expandir con IA" del builder para rellenar páginas cortas sin regenerar todo)
  async generateEbookChapter(params) {
    return Claude.generateEbookChapter(params);
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
    try {
      const input = document.createElement('textarea');
      input.value = text;
      input.setAttribute('readonly', '');
      input.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, input.value.length);
      const ok = document.execCommand('copy');
      input.remove();
      if (ok) showToast('¡Enlace copiado!');
      else throw new Error('copy failed');
    } catch {
      window.prompt('Copia este enlace:', text);
      showToast('Te dejé el enlace listo para copiar', 'info');
    }
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
  free:    { quizzes: 1,   responses: 500,      leads: false, ai: false, miniApps: 2,   customDomain: false, metaPixel: false, integrations: false, whiteLabel: false, subdomains: 0, nicheAssistant: false, botLab: false, landings: 0,   ebooks: 1   },
  starter: { quizzes: 5,   responses: 5000,     leads: true,  ai: false, miniApps: 5,   customDomain: false, metaPixel: true,  integrations: false, whiteLabel: false, subdomains: 0, nicheAssistant: false, botLab: true,  landings: 1,   ebooks: 3   },
  pro:     { quizzes: 10,  responses: 50000,    leads: true,  ai: true,  miniApps: 10,  customDomain: true,  metaPixel: true,  integrations: true,  whiteLabel: false, subdomains: 0, nicheAssistant: false, botLab: true,  landings: 5,   ebooks: 5   },
  growth:  { quizzes: 30,  responses: 150000,   leads: true,  ai: true,  miniApps: 30,  customDomain: true,  metaPixel: true,  integrations: true,  whiteLabel: false, subdomains: 0, nicheAssistant: true,  botLab: true,  landings: 20,  ebooks: 20  },
  elite:   { quizzes: 999, responses: Infinity, leads: true,  ai: true,  miniApps: 999, customDomain: true,  metaPixel: true,  integrations: true,  whiteLabel: true,  subdomains: 5, nicheAssistant: true,  botLab: true,  landings: 999, ebooks: 999 },
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
    metaPixel: 'Meta Pixel requiere plan Starter o superior.',
    integrations: 'Las integraciones (Zapier, Mailchimp) requieren plan Pro o superior.',
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

    const payload = {
      event: 'lead_captured',
      timestamp: new Date().toISOString(),
      ...lead,
    };

    // Zapier: POST al webhook del usuario (no requiere CORS proxy)
    try {
      const zap = state.zapier;
      if (zap?.connected && zap.webhookUrl && /^https?:\/\//.test(zap.webhookUrl)) {
        fetch(zap.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          mode: 'no-cors',
        }).catch(() => {});
      }
    } catch (_) {}

    // Webhook genérico (Make, n8n, endpoints custom)
    try {
      const wh = state.webhook;
      if (wh?.connected && wh.webhookUrl && /^https?:\/\//.test(wh.webhookUrl)) {
        fetch(wh.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          mode: 'no-cors',
        }).catch(() => {});
      }
    } catch (_) {}

    // Discord: mensaje formateado con embed
    try {
      const dc = state.discord;
      if (dc?.connected && dc.webhookUrl && /^https:\/\/(discord|discordapp)\.com\/api\/webhooks\//.test(dc.webhookUrl)) {
        const embed = {
          title: '🎯 Nuevo lead capturado',
          color: 0x7c3aed,
          fields: [
            { name: 'Nombre', value: lead.name || '—', inline: true },
            { name: 'Email', value: lead.email || '—', inline: true },
            { name: 'Quiz', value: lead.quizTitle || lead.quizId || '—' },
            ...(lead.profileName ? [{ name: 'Perfil', value: lead.profileName, inline: true }] : []),
          ],
          timestamp: new Date().toISOString(),
        };
        fetch(dc.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ embeds: [embed] }),
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
      category: 'Finanzas & Negocios',
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
      category: 'Bienestar',
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
    {
      id: 'tmpl-autoestima',
      title: '¿Qué tan fuerte es tu autoestima realmente?',
      subtitle: 'Descubre tu nivel y el trabajo interior que necesitas',
      category: 'Bienestar',
      icon: 'favorite',
      product: 'Programa de Autoestima',
      niche: 'autoestima, desarrollo personal, bienestar emocional',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Cómo reaccionas cuando alguien te critica?', options: [
          { text: 'Me lo tomo muy personal y me quedo días pensando en ello', profiles: ['baja'] },
          { text: 'Me afecta pero lo proceso y sigo adelante', profiles: ['media'] },
          { text: 'Evalúo si es constructiva y la uso para crecer', profiles: ['alta'] },
          { text: 'Me pongo a la defensiva automáticamente', profiles: ['baja'] },
        ]},
        { id: 'q2', text: '¿Cómo te hablas a ti mismo/a cuando cometes un error?', options: [
          { text: 'Soy muy duro/a conmigo, me insulto internamente', profiles: ['baja'] },
          { text: 'Me regaño pero luego me perdono', profiles: ['media'] },
          { text: 'Aprendo de ello y sigo sin castigarme', profiles: ['alta'] },
          { text: 'Me cuesta perdonarme, cargó la culpa mucho tiempo', profiles: ['baja'] },
        ]},
        { id: 'q3', text: '¿Qué tan fácil te resulta poner límites?', options: [
          { text: 'Casi imposible, siempre digo que sí por miedo al rechazo', profiles: ['baja'] },
          { text: 'Con algunas personas sí, con otras no puedo', profiles: ['media'] },
          { text: 'Me cuesta pero cada vez lo hago mejor', profiles: ['media'] },
          { text: 'Lo hago con claridad y sin culpa', profiles: ['alta'] },
        ]},
        { id: 'q4', text: '¿Necesitas la aprobación de otros para sentirte bien?', options: [
          { text: 'Sí, constantemente busco validación externa', profiles: ['baja'] },
          { text: 'A veces, depende del contexto o la persona', profiles: ['media'] },
          { text: 'Prefiero la aprobación pero no la necesito', profiles: ['media'] },
          { text: 'Me valido internamente y la opinión ajena no me define', profiles: ['alta'] },
        ]},
      ],
      profiles: [
        { id: 'baja', name: 'La Autoestima que Necesita Reparación', emoji: '🌱', description: 'Has cargado heridas que no son tuyas durante demasiado tiempo. La buena noticia: la autoestima no es fija, se construye paso a paso con las herramientas correctas.', recommendation: 'El programa empieza desde las raíces: identifica las creencias limitantes heredadas y las reemplaza por una identidad sólida desde adentro.', cta: 'Quiero sanarme' },
        { id: 'media', name: 'La Autoestima en Construcción', emoji: '🔨', description: 'Tienes una base pero hay grietas. Hay días buenos y días en que la voz crítica interna gana. Con trabajo consistente, puedes solidificar esa base para siempre.', recommendation: 'El módulo intermedio del programa trabaja exactamente los patrones que aparecen y desaparecen — para que la confianza en ti sea constante.', cta: 'Quiero ser constante' },
        { id: 'alta', name: 'La Autoestima que se Afina', emoji: '💎', description: 'Tu base es sólida pero siempre hay capas más profundas. Las personas con alta autoestima siguen creciendo porque saben que es un viaje, no un destino.', recommendation: 'El nivel avanzado del programa va a las capas más sutiles: propósito, valores y liderazgo personal que emana desde adentro.', cta: 'Llevarme al siguiente nivel' },
      ],
    },
    {
      id: 'tmpl-ansiedad',
      title: '¿Qué tipo de ansiedad está frenando tu vida?',
      subtitle: 'Identifica tu patrón y descubre cómo gestionarlo',
      category: 'Bienestar',
      icon: 'psychology',
      product: 'Guía para Gestionar la Ansiedad',
      niche: 'ansiedad, salud mental, bienestar emocional, estrés',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Cuándo sientes más ansiedad?', options: [
          { text: 'Antes de eventos sociales o situaciones nuevas', profiles: ['social'] },
          { text: 'Pensando en el futuro y lo que puede salir mal', profiles: ['anticipatoria'] },
          { text: 'En el trabajo o cuando tengo mucha responsabilidad', profiles: ['rendimiento'] },
          { text: 'De forma constante, casi siempre estoy en tensión', profiles: ['generalizada'] },
        ]},
        { id: 'q2', text: '¿Cómo se manifiesta físicamente tu ansiedad?', options: [
          { text: 'Palpitaciones, sudor frío, sensación de peligro', profiles: ['generalizada'] },
          { text: 'Tensión muscular y dificultad para respirar', profiles: ['rendimiento'] },
          { text: 'Malestar estomacal antes de situaciones sociales', profiles: ['social'] },
          { text: 'Insomnio y pensamientos en bucle por las noches', profiles: ['anticipatoria'] },
        ]},
        { id: 'q3', text: '¿Qué haces cuando sientes que la ansiedad sube?', options: [
          { text: 'Evito la situación que la genera', profiles: ['social'] },
          { text: 'Busco distracciones (teléfono, comida, TV)', profiles: ['generalizada'] },
          { text: 'Me paralizo y no puedo actuar', profiles: ['rendimiento'] },
          { text: 'Rumio los pensamientos hasta agotarme', profiles: ['anticipatoria'] },
        ]},
        { id: 'q4', text: '¿Cuánto afecta la ansiedad tu vida diaria?', options: [
          { text: 'Me impide hacer cosas que quiero hacer', profiles: ['social', 'generalizada'] },
          { text: 'La gestiono pero me consume mucha energía', profiles: ['rendimiento'] },
          { text: 'Aparece en momentos específicos y los boicotea', profiles: ['anticipatoria'] },
          { text: 'Se ha convertido en mi estado normal', profiles: ['generalizada'] },
        ]},
      ],
      profiles: [
        { id: 'social', name: 'Ansiedad Social', emoji: '🌸', description: 'El miedo al juicio ajeno y el rechazo te hace achicarte en situaciones donde quieres brillar. No es timidez — es una respuesta aprendida que se puede desaprender.', recommendation: 'La guía incluye técnicas específicas para la ansiedad social: exposición gradual, reprogramación cognitiva y habilidades de presencia en situaciones sociales.', cta: 'Quiero sentirme libre en sociedad' },
        { id: 'anticipatoria', name: 'Ansiedad Anticipatoria', emoji: '🌀', description: 'Tu mente vive en el futuro catastrófico que (casi nunca) llega. El problema no es lo que pasa sino lo que imaginas que podría pasar. Eso también tiene solución.', recommendation: 'La sección de "defusión cognitiva" de la guía te enseña a separarte de los pensamientos de catástrofe para vivir en el presente.', cta: 'Quiero vivir en el presente' },
        { id: 'rendimiento', name: 'Ansiedad de Rendimiento', emoji: '🎯', description: 'El perfeccionismo y el miedo a fallar te tienen en tensión constante. Tu valor no depende de tus resultados — y hay técnicas para que tu sistema nervioso también lo entienda.', recommendation: 'La guía trabaja la relación entre identidad y rendimiento para que tu autoestima deje de depender de tus logros.', cta: 'Quiero rendir sin tensión' },
        { id: 'generalizada', name: 'Ansiedad Generalizada', emoji: '⚡', description: 'Vives en alerta constante sin un detonante claro. Tu sistema nervioso está en modo supervivencia y necesita aprender que el peligro no es permanente.', recommendation: 'La guía empieza con regulación del sistema nervioso — técnicas somáticas y de respiración que bajan el nivel de alerta de base en días.', cta: 'Quiero estar en calma' },
      ],
    },
    {
      id: 'tmpl-fitness-tipo',
      title: '¿Cuál es tu perfil de entrenamiento?',
      subtitle: 'Descubre el tipo de ejercicio que realmente funciona para ti',
      category: 'Fitness',
      icon: 'fitness_center',
      product: 'Plan de Entrenamiento Personalizado',
      niche: 'fitness, ejercicio, entrenamiento, deporte',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Cuánto tiempo tienes disponible para entrenar?', options: [
          { text: 'Menos de 20 minutos al día', profiles: ['hiit'] },
          { text: 'Entre 30 y 45 minutos, 3-4 veces por semana', profiles: ['funcional'] },
          { text: 'Una hora o más, 4-5 veces por semana', profiles: ['fuerza'] },
          { text: 'Tengo el tiempo pero no la constancia', profiles: ['hiit'] },
        ]},
        { id: 'q2', text: '¿Cuál es tu objetivo principal?', options: [
          { text: 'Perder grasa rápido y definirme', profiles: ['hiit'] },
          { text: 'Ganar músculo y fuerza real', profiles: ['fuerza'] },
          { text: 'Mejorar mi condición física general y energía', profiles: ['funcional'] },
          { text: 'Reducir el estrés y sentirme bien conmigo', profiles: ['funcional'] },
        ]},
        { id: 'q3', text: '¿Dónde prefieres entrenar?', options: [
          { text: 'En casa sin equipamiento o con poco', profiles: ['hiit'] },
          { text: 'En el gimnasio con máquinas y pesas', profiles: ['fuerza'] },
          { text: 'Al aire libre, me gusta moverme en espacios abiertos', profiles: ['funcional'] },
          { text: 'Me da igual el lugar, necesito que sea eficiente', profiles: ['hiit', 'funcional'] },
        ]},
        { id: 'q4', text: '¿Qué tipo de entrenamiento has probado antes?', options: [
          { text: 'Cardio tradicional (correr, bicicleta) pero me aburre', profiles: ['hiit'] },
          { text: 'Pesas y máquinas en el gimnasio', profiles: ['fuerza'] },
          { text: 'Clases grupales, yoga, crossfit esporádico', profiles: ['funcional'] },
          { text: 'Casi nada, soy principiante total', profiles: ['funcional'] },
        ]},
      ],
      profiles: [
        { id: 'hiit', name: 'El Guerrero del HIIT', emoji: '⚡', description: 'Eres de los que quieren máximo resultado en mínimo tiempo. El HIIT es tu arma: sesiones de 15-20 minutos que queman más grasa que una hora de cardio tradicional.', recommendation: 'El plan incluye 12 semanas de HIIT progresivo diseñado para que puedas hacerlo en casa o en el gym sin necesitar equipamiento especial.', cta: 'Quiero el plan HIIT' },
        { id: 'fuerza', name: 'El Constructor de Fuerza', emoji: '💪', description: 'Tu cuerpo está hecho para levantar y ganar masa muscular real. El entrenamiento de fuerza no solo transforma tu físico — mejora tu metabolismo, postura y confianza.', recommendation: 'El programa de fuerza de 16 semanas lleva tu 1RM actual al siguiente nivel con periodización científica y técnica impecable.', cta: 'Quiero ganar fuerza' },
        { id: 'funcional', name: 'El Atleta Funcional', emoji: '🏃', description: 'Tu cuerpo necesita moverse bien antes de moverse mucho. El entrenamiento funcional desarrolla fuerza, movilidad y resistencia que se traduce en una mejor vida diaria.', recommendation: 'El plan funcional combina movimientos multiarticulares, core y movilidad para que te sientas ágil, fuerte y sin lesiones.', cta: 'Quiero moverme mejor' },
      ],
    },
    {
      id: 'tmpl-nutricion-tipo',
      title: '¿Cuál es tu relación con la comida y la nutrición?',
      subtitle: 'Descubre tu perfil nutricional y el plan que se adapta a ti',
      category: 'Nutrición',
      icon: 'restaurant',
      product: 'Guía Nutricional Personalizada',
      niche: 'nutrición, alimentación saludable, dieta, hábitos alimenticios',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Cómo describes tu alimentación actual?', options: [
          { text: 'Como de todo sin control, sin horarios ni rutinas', profiles: ['emocional'] },
          { text: 'Intento comer sano pero los antojos me ganan', profiles: ['inconsistente'] },
          { text: 'Sigo planes pero siempre los abandono al mes', profiles: ['inconsistente'] },
          { text: 'Como bien pero no veo los resultados que espero', profiles: ['optimo'] },
        ]},
        { id: 'q2', text: '¿Por qué sueles comer de más o mal?', options: [
          { text: 'Por ansiedad, estrés o aburrimiento', profiles: ['emocional'] },
          { text: 'Por falta de tiempo para preparar comida sana', profiles: ['inconsistente'] },
          { text: 'Porque no sé realmente qué debo comer', profiles: ['inconsistente'] },
          { text: 'Por eventos sociales y compromisos', profiles: ['optimo'] },
        ]},
        { id: 'q3', text: '¿Cómo te sientes después de comer?', options: [
          { text: 'Con culpa, especialmente si comí algo "malo"', profiles: ['emocional'] },
          { text: 'Hinchado/a o con poca energía', profiles: ['inconsistente'] },
          { text: 'Bien generalmente, pero inconsistente', profiles: ['optimo'] },
          { text: 'Depende mucho del día y mi estado emocional', profiles: ['emocional'] },
        ]},
        { id: 'q4', text: '¿Cuál es tu mayor objetivo nutricional?', options: [
          { text: 'Dejar de comer por emociones y tener una relación sana con la comida', profiles: ['emocional'] },
          { text: 'Crear hábitos simples que pueda mantener para siempre', profiles: ['inconsistente'] },
          { text: 'Optimizar mi rendimiento, energía y composición corporal', profiles: ['optimo'] },
          { text: 'Entender mi cuerpo y qué alimentos me benefician', profiles: ['inconsistente'] },
        ]},
      ],
      profiles: [
        { id: 'emocional', name: 'El Comer Emocional', emoji: '💙', description: 'La comida se convirtió en tu forma de manejar emociones. Eso no es debilidad — es una respuesta aprendida. Liberarte de ese patrón cambia tu relación con la comida para siempre.', recommendation: 'La guía incluye un módulo dedicado a la alimentación consciente (mindful eating) y técnicas para identificar el hambre emocional vs. el hambre real.', cta: 'Quiero sanar mi relación con la comida' },
        { id: 'inconsistente', name: 'El Necesita Estructura', emoji: '🗓️', description: 'Sabes que quieres comer bien pero sin un sistema claro todo se derrumba. No es falta de voluntad — es falta de un plan concreto adaptado a tu vida real.', recommendation: 'La guía te da un sistema de meal prep semanal de 45 minutos y plantillas de comidas que eliminan la decisión diaria sobre qué comer.', cta: 'Quiero mi plan de comidas' },
        { id: 'optimo', name: 'El Optimizador Nutricional', emoji: '🎯', description: 'Tienes buenas bases pero hay espacio para optimizar. Ya seas atleta o simplemente alguien que quiere el máximo de su alimentación, hay ajustes clave que marcan la diferencia.', recommendation: 'La guía avanzada cubre nutrición por fases, sincronización circadiana de comidas y suplementación inteligente para llevar tus resultados al siguiente nivel.', cta: 'Quiero optimizar mi nutrición' },
      ],
    },
    {
      id: 'tmpl-relaciones',
      title: '¿Qué patrón de relación estás repitiendo?',
      subtitle: 'Descubre el origen de tus dinámicas en pareja y cómo transformarlas',
      category: 'Relaciones',
      icon: 'favorite_border',
      product: 'Programa de Relaciones Conscientes',
      niche: 'relaciones, pareja, amor, vínculos emocionales',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Cómo te comportas al inicio de una relación?', options: [
          { text: 'Me entrego por completo muy rápido y pierdo mi identidad', profiles: ['ansioso'] },
          { text: 'Disfruto la conexión pero mantengo mis espacios', profiles: ['seguro'] },
          { text: 'Me cuesta confiar y bajo las barreras muy lentamente', profiles: ['evitativo'] },
          { text: 'Alterno entre querer mucho cercanía y necesitar distancia', profiles: ['ansioso'] },
        ]},
        { id: 'q2', text: '¿Qué pasa cuando hay un conflicto en pareja?', options: [
          { text: 'Entro en pánico, tengo miedo al abandono y me vuelvo demandante', profiles: ['ansioso'] },
          { text: 'Me cierro emocionalmente y prefiero distanciarme', profiles: ['evitativo'] },
          { text: 'Lo hablo directamente aunque me cueste', profiles: ['seguro'] },
          { text: 'Cedo siempre para evitar el conflicto aunque no quiera', profiles: ['ansioso'] },
        ]},
        { id: 'q3', text: '¿Cómo te sientes con la intimidad emocional?', options: [
          { text: 'La anhelo pero cuando la tengo me abruma', profiles: ['evitativo'] },
          { text: 'La necesito constantemente para sentirme seguro/a', profiles: ['ansioso'] },
          { text: 'La disfruto y puedo estar presente en ella', profiles: ['seguro'] },
          { text: 'Me cuesta mostrar vulnerabilidad, prefiero parecer fuerte', profiles: ['evitativo'] },
        ]},
        { id: 'q4', text: '¿Cuál frase te describe mejor en el amor?', options: [
          { text: '"Siempre termino con personas que no valoran lo que doy"', profiles: ['ansioso'] },
          { text: '"Me enamoro pero llega un punto en que necesito escapar"', profiles: ['evitativo'] },
          { text: '"He tenido relaciones difíciles pero he aprendido mucho de ellas"', profiles: ['seguro'] },
          { text: '"Doy todo de mí y no recibo lo mismo a cambio"', profiles: ['ansioso'] },
        ]},
      ],
      profiles: [
        { id: 'ansioso', name: 'El Apego Ansioso', emoji: '🌊', description: 'Amas intensamente y eso es hermoso. Pero el miedo al abandono te lleva a dinámicas donde das de más y te pierdes a ti mismo/a. Sanar el apego ansioso transforma todo.', recommendation: 'El programa empieza con el origen del apego ansioso — por qué se formó y cómo reprogramar la respuesta de miedo en las relaciones paso a paso.', cta: 'Quiero amar sin miedo' },
        { id: 'evitativo', name: 'El Apego Evitativo', emoji: '🏔️', description: 'Anhelas conexión pero cuando alguien se acerca demasiado, algo en ti activa la señal de huida. No es que no quieras amar — es que tienes que protegerte.', recommendation: 'El programa trabaja la regulación emocional y la tolerancia a la intimidad para que puedas recibir amor sin sentirte amenazado/a.', cta: 'Quiero conectar de verdad' },
        { id: 'seguro', name: 'El Apego Seguro en Desarrollo', emoji: '💚', description: 'Tienes una base sana para las relaciones. Quizás ya lo trabajaste o tuviste la suerte de crecer con buenos modelos. Ahora se trata de llevar esa seguridad al siguiente nivel.', recommendation: 'El programa avanzado te lleva a construir relaciones con mayor profundidad, comunicación no violenta y convivencia desde la libertad.', cta: 'Quiero relaciones más profundas' },
      ],
    },
    {
      id: 'tmpl-fe',
      title: '¿Cómo está tu vida espiritual en este momento?',
      subtitle: 'Descubre en qué etapa de tu fe te encuentras y el siguiente paso',
      category: 'Fe y Espiritualidad',
      icon: 'light_mode',
      product: 'Devocional de Crecimiento Espiritual',
      niche: 'fe, espiritualidad, cristiano, propósito de vida',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Cómo describes tu relación con Dios hoy?', options: [
          { text: 'Distante — siento que me alejé y no sé cómo volver', profiles: ['restauracion'] },
          { text: 'Buscando — tengo preguntas y necesito respuestas', profiles: ['crecimiento'] },
          { text: 'Activa — tengo disciplinas espirituales pero quiero más profundidad', profiles: ['profundidad'] },
          { text: 'Intensa — hay un llamado en mi corazón que necesito discernir', profiles: ['proposito'] },
        ]},
        { id: 'q2', text: '¿Cuál es tu mayor desafío espiritual?', options: [
          { text: 'La culpa y el sentir que no soy suficiente para Dios', profiles: ['restauracion'] },
          { text: 'Dudar de mi fe cuando vienen las pruebas difíciles', profiles: ['crecimiento'] },
          { text: 'Mantener mis tiempos devocionales con constancia', profiles: ['profundidad'] },
          { text: 'Encontrar claridad sobre mi propósito y vocación', profiles: ['proposito'] },
        ]},
        { id: 'q3', text: '¿Con qué frecuencia lees la Biblia o oras?', options: [
          { text: 'Casi nunca, me da vergüenza admitirlo', profiles: ['restauracion'] },
          { text: 'Esporádicamente, cuando estoy en crisis', profiles: ['crecimiento'] },
          { text: 'Algunas veces por semana con cierta consistencia', profiles: ['profundidad'] },
          { text: 'Diariamente — es mi fundamento', profiles: ['proposito'] },
        ]},
        { id: 'q4', text: '¿Qué esperas de un devocional?', options: [
          { text: 'Recordar que fui perdonado/a y que puedo comenzar de nuevo', profiles: ['restauracion'] },
          { text: 'Entender mejor las Escrituras y fortalecer mi fe', profiles: ['crecimiento'] },
          { text: 'Profundizar mi comunión con Dios más allá de lo rutinario', profiles: ['profundidad'] },
          { text: 'Escuchar la voz de Dios para los pasos que debo dar', profiles: ['proposito'] },
        ]},
      ],
      profiles: [
        { id: 'restauracion', name: 'Tiempo de Restauración', emoji: '🌅', description: 'Dios no te ha olvidado ni te ha juzgado. Cada momento es una oportunidad para volver a Él. La restauración no empieza con perfección — empieza con un sí.', recommendation: 'El devocional de 30 días empieza con la gracia y el perdón — el fundamento desde el que todo lo demás puede crecer.', cta: 'Quiero volver a empezar' },
        { id: 'crecimiento', name: 'Tiempo de Crecimiento', emoji: '🌿', description: 'Las dudas no son el enemigo de la fe — son su combustible cuando se llevan a Dios. Estás en la etapa más formativa de tu vida espiritual y eso es un regalo.', recommendation: 'El devocional incluye pasajes clave de las Escrituras con preguntas de reflexión profunda para procesar tus dudas desde la fe.', cta: 'Quiero crecer en mi fe' },
        { id: 'profundidad', name: 'Tiempo de Profundidad', emoji: '🌊', description: 'Tienes las disciplinas, ahora necesitas que se conviertan en encuentro real. La diferencia entre religiosidad y vida espiritual viva está en la intimidad con Dios.', recommendation: 'El devocional de profundidad incluye lectio divina, oración contemplativa y ayuno espiritual para transformar tus tiempos en experiencias genuinas.', cta: 'Quiero más de Dios' },
        { id: 'proposito', name: 'Tiempo de Propósito', emoji: '🔥', description: 'Dios ha puesto un llamado específico en tu vida. El reto es discernirlo con claridad y tener el valor de dar el paso. Este es un tiempo de activación.', recommendation: 'El devocional de propósito usa textos de vocación bíblica y ejercicios prácticos para ayudarte a descubrir y confirmar el llamado que llevas dentro.', cta: 'Quiero descubrir mi llamado' },
      ],
    },
    {
      id: 'tmpl-ventas',
      title: '¿Qué tipo de vendedor eres y qué te está frenando?',
      subtitle: 'Descubre tu perfil de ventas y el ajuste que multiplica tus cierres',
      category: 'Finanzas & Negocios',
      icon: 'trending_up',
      product: 'Curso de Ventas para Infoproductores',
      niche: 'ventas, negocios digitales, infoproductos, conversión',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Qué pasa cuando llega el momento de hablar del precio?', options: [
          { text: 'Me pongo nervioso/a y casi pido disculpas por el costo', profiles: ['inseguro'] },
          { text: 'Lo digo rápido para que no sea incómodo', profiles: ['inseguro'] },
          { text: 'Lo digo con calma porque confío en el valor que ofrezco', profiles: ['consultivo'] },
          { text: 'Bajo el precio o doy descuentos antes de que pidan', profiles: ['inseguro'] },
        ]},
        { id: 'q2', text: '¿Cuál es tu mayor miedo al vender?', options: [
          { text: 'Parecer desesperado/a o necesitado/a', profiles: ['inseguro'] },
          { text: 'Que me digan que no y sentirlo como un rechazo personal', profiles: ['emocional'] },
          { text: 'Presionar demasiado y perder la relación con el cliente', profiles: ['consultivo'] },
          { text: 'No saber qué decir cuando me hacen objeciones', profiles: ['tecnico'] },
        ]},
        { id: 'q3', text: '¿Cómo describes tu proceso de venta actual?', options: [
          { text: 'Improviso mucho, cada venta es diferente y no tengo un guión', profiles: ['tecnico'] },
          { text: 'Explico mucho el producto pero no cierro bien', profiles: ['tecnico'] },
          { text: 'Construyo relación primero, luego ofrezco — pero tarda mucho', profiles: ['consultivo'] },
          { text: 'No hago seguimiento porque me da miedo molestar', profiles: ['emocional'] },
        ]},
        { id: 'q4', text: '¿Qué resultado quieres en los próximos 90 días?', options: [
          { text: 'Sentirme seguro/a de mi precio y valor sin bajar tarifas', profiles: ['inseguro'] },
          { text: 'Tener un guión de ventas claro que funcione siempre', profiles: ['tecnico'] },
          { text: 'Cerrar más sin presionar ni manipular', profiles: ['consultivo'] },
          { text: 'Desconectar mis emociones del resultado de cada venta', profiles: ['emocional'] },
        ]},
      ],
      profiles: [
        { id: 'inseguro', name: 'El Vendedor que no Cree en su Precio', emoji: '💡', description: 'El problema no es tu producto — es que tú mismo/a no lo valoras lo suficiente. Cuando subas tu precio en la mente, los clientes lo subirán automáticamente.', recommendation: 'El módulo de "identidad de vendedor" del curso trabaja las creencias sobre el dinero y el valor antes de enseñar técnicas — porque sin ese fundamento nada funciona.', cta: 'Quiero creer en mi precio' },
        { id: 'tecnico', name: 'El Vendedor Técnico', emoji: '🔧', description: 'Sabes mucho sobre tu producto pero la venta no es un examen — es una conversación que guías. Con el framework correcto, tus conocimientos se convierten en cierres.', recommendation: 'El framework de ventas del curso estructura cada conversación en 5 pasos: calificar, conectar, descubrir, presentar y cerrar — sin improvisar nunca más.', cta: 'Quiero un sistema de ventas' },
        { id: 'consultivo', name: 'El Vendedor Consultivo', emoji: '🤝', description: 'Tienes la mejor base: la relación. Ahora necesitas acortar los tiempos y aprender a hacer la pregunta de cierre con la misma naturalidad con que conectas.', recommendation: 'El módulo de cierre consultivo del curso te enseña a hacer la transición de la conversación al cierre de forma natural y sin presión.', cta: 'Quiero cerrar con naturalidad' },
        { id: 'emocional', name: 'El Vendedor Emocional', emoji: '🌊', description: 'Eres empático/a y eso es un superpoder en ventas. Pero mezclar tu autoestima con el resultado de cada venta te agota. Vender es un servicio — no un juicio sobre ti.', recommendation: 'El módulo de "desapego del resultado" te enseña a ver cada no como información valiosa, no como rechazo personal.', cta: 'Quiero vender con ligereza' },
      ],
    },
    {
      id: 'tmpl-ingles-nivel',
      title: '¿Cuál es tu nivel real de inglés?',
      subtitle: 'Descubre exactamente dónde estás y el camino más corto al siguiente nivel',
      category: 'Educación',
      icon: 'language',
      product: 'Curso de Inglés Acelerado',
      niche: 'inglés, idiomas, educación, aprendizaje',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Qué tan cómodo/a te sientes leyendo en inglés?', options: [
          { text: 'No entiendo casi nada sin traductor', profiles: ['basico'] },
          { text: 'Entiendo lo básico pero me pierdo en textos largos', profiles: ['intermedio'] },
          { text: 'Leo bien pero me tardo más que en español', profiles: ['avanzado'] },
          { text: 'Leo con fluidez y comodidad', profiles: ['avanzado'] },
        ]},
        { id: 'q2', text: '¿Qué pasa cuando intentas hablar en inglés?', options: [
          { text: 'Me bloqueo totalmente, no sale nada', profiles: ['basico'] },
          { text: 'Digo frases sencillas pero con muchos errores y lentitud', profiles: ['intermedio'] },
          { text: 'Me comunico pero me frustro cuando no encuentro las palabras', profiles: ['avanzado'] },
          { text: 'Hablo con confianza aunque cometa algunos errores', profiles: ['avanzado'] },
        ]},
        { id: 'q3', text: '¿Cuánto tiempo llevas estudiando inglés?', options: [
          { text: 'Nunca lo estudié formalmente o fue hace muchos años', profiles: ['basico'] },
          { text: 'Lo estudié en el colegio/academia pero olvidé mucho', profiles: ['intermedio'] },
          { text: 'He tomado varios cursos pero sin avanzar consistentemente', profiles: ['intermedio'] },
          { text: 'Tengo base sólida pero quiero alcanzar fluidez total', profiles: ['avanzado'] },
        ]},
        { id: 'q4', text: '¿Para qué necesitas el inglés principalmente?', options: [
          { text: 'Para el trabajo o para mejorar mis oportunidades laborales', profiles: ['intermedio', 'avanzado'] },
          { text: 'Para viajar y comunicarme en el extranjero', profiles: ['basico', 'intermedio'] },
          { text: 'Para consumir contenido (películas, libros, podcasts) sin subtítulos', profiles: ['intermedio'] },
          { text: 'Para negocios y comunicarme con clientes internacionales', profiles: ['avanzado'] },
        ]},
      ],
      profiles: [
        { id: 'basico', name: 'El Punto de Partida', emoji: '🚀', description: 'Todos los fluidos en inglés empezaron exactamente donde estás tú. La ventaja de empezar desde cero: no tienes malos hábitos que corregir. Con el método correcto, el progreso es rápido y visible.', recommendation: 'El curso empieza con las 300 palabras de inglés más usadas y estructuras de oración simples que te dan comunicación real desde la primera semana.', cta: 'Quiero empezar bien' },
        { id: 'intermedio', name: 'El Plateau del Intermedio', emoji: '🎯', description: 'Este es el nivel donde la mayoría se estanca años. Tienes base pero falta fluidez. La solución no es más gramática — es más exposición al idioma en contexto real.', recommendation: 'El módulo de inmersión del curso te sumerge en inglés real con técnicas de shadowing y comprensión auditiva que aceleran el progreso en semanas.', cta: 'Quiero salir del plateau' },
        { id: 'avanzado', name: 'El Paso a la Fluidez', emoji: '💎', description: 'Estás muy cerca. La fluidez no es perfección — es comodidad. Ese salto final requiere práctica intencional enfocada en velocidad de procesamiento y vocabulario activo.', recommendation: 'El nivel avanzado del curso trabaja específicamente el thinking in English, el acento y el vocabulario de negocios para sonar natural y profesional.', cta: 'Quiero sonar natural' },
      ],
    },
    {
      id: 'tmpl-skincare',
      title: '¿Cuál es tu tipo de piel y qué necesita realmente?',
      subtitle: 'Descubre tu perfil cutáneo y la rutina exacta que transforma tu piel',
      category: 'Belleza',
      icon: 'face_retouching_natural',
      product: 'Guía de Skincare Personalizada',
      niche: 'skincare, piel, belleza, cuidado personal',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Cómo se siente tu piel a las pocas horas de lavarla?', options: [
          { text: 'Tirante, incómoda y con sensación de sequedad', profiles: ['seca'] },
          { text: 'Brilla en la zona T (nariz, frente y mentón)', profiles: ['mixta'] },
          { text: 'Brilla en todas partes y los poros se ven grandes', profiles: ['grasa'] },
          { text: 'Bien pero se irrita fácilmente con productos nuevos', profiles: ['sensible'] },
        ]},
        { id: 'q2', text: '¿Cuál es tu mayor problema de piel?', options: [
          { text: 'Líneas de expresión y pérdida de luminosidad', profiles: ['seca'] },
          { text: 'Poros dilatados y grasa en zonas específicas', profiles: ['mixta'] },
          { text: 'Acné, puntos negros y exceso de brillo constante', profiles: ['grasa'] },
          { text: 'Rojeces, picor y reacciones a productos o cambios de clima', profiles: ['sensible'] },
        ]},
        { id: 'q3', text: '¿Cuántos productos usas actualmente en tu rutina?', options: [
          { text: 'Solo agua y a veces jabón de tocador', profiles: ['seca', 'grasa'] },
          { text: 'Limpiador y crema hidratante, nada más', profiles: ['mixta'] },
          { text: 'Tengo varios productos pero no sé si van en orden', profiles: ['sensible'] },
          { text: 'Tengo rutina AM y PM completa pero sin resultados claros', profiles: ['mixta', 'sensible'] },
        ]},
        { id: 'q4', text: '¿Qué resultado quieres lograr con tu piel?', options: [
          { text: 'Piel hidratada, nutrida y con efecto glow natural', profiles: ['seca'] },
          { text: 'Equilibrar zonas grasas sin resecar las secas', profiles: ['mixta'] },
          { text: 'Controlar el acné y reducir el brillo sin agredir la piel', profiles: ['grasa'] },
          { text: 'Fortalecer la barrera cutánea y reducir la reactividad', profiles: ['sensible'] },
        ]},
      ],
      profiles: [
        { id: 'seca', name: 'Piel Seca — La que Necesita Nutrición', emoji: '🌺', description: 'Tu piel pide hidratación y nutrición profunda. Con los ingredientes correctos (ácido hialurónico, ceramidas, aceites vegetales) tu piel puede transformarse en semanas.', recommendation: 'La guía incluye una rutina de 4 pasos para piel seca con los ingredientes clave en cada paso y recomendaciones de productos para todos los presupuestos.', cta: 'Quiero piel hidratada y luminosa' },
        { id: 'mixta', name: 'Piel Mixta — La que Necesita Equilibrio', emoji: '⚖️', description: 'El reto de la piel mixta es tratar dos tipos de piel en una sola cara. Con la rutina correcta y el orden de productos adecuado, puedes tener equilibrio real.', recommendation: 'La guía para piel mixta incluye técnicas de aplicación por zonas y los productos multiusos que simplifican la rutina sin comprometer resultados.', cta: 'Quiero equilibrar mi piel' },
        { id: 'grasa', name: 'Piel Grasa — La que Necesita Control', emoji: '🌿', description: 'Contraintuitivo pero cierto: la piel grasa a menudo está deshidratada y produce más sebo como compensación. La solución no es agresividad — es balance.', recommendation: 'La guía explica el ciclo de deshidratación-exceso de grasa y da una rutina que regula la producción de sebo desde adentro sin resecar.', cta: 'Quiero controlar el brillo' },
        { id: 'sensible', name: 'Piel Sensible — La que Necesita Calma', emoji: '🤍', description: 'Tu piel tiene una barrera cutánea comprometida que reacciona a casi todo. La prioridad no es tratar problemas — es fortalecer la barrera primero.', recommendation: 'La guía empieza con los 5 ingredientes prohibidos para piel sensible y construye una rutina minimalista que restaura la barrera antes de agregar activos.', cta: 'Quiero piel calmada y fuerte' },
      ],
    },
    {
      id: 'tmpl-crianza',
      title: '¿Cuál es tu estilo de crianza y cómo impacta a tu hijo/a?',
      subtitle: 'Descubre tu perfil como papá o mamá y las herramientas que necesitas',
      category: 'Relaciones',
      icon: 'child_care',
      product: 'Guía de Crianza Consciente',
      niche: 'crianza, maternidad, paternidad, hijos, familia',
      estimatedMinutes: 3,
      questions: [
        { id: 'q1', text: '¿Cómo reaccionas cuando tu hijo/a tiene una rabieta o crisis emocional?', options: [
          { text: 'Me pongo firme e impongo consecuencias inmediatamente', profiles: ['autoritario'] },
          { text: 'Me desbordo yo también y luego me siento culpable', profiles: ['permisivo'] },
          { text: 'Intento calmarlos antes de cualquier corrección', profiles: ['consciente'] },
          { text: 'Cedo en todo para evitar el conflicto', profiles: ['permisivo'] },
        ]},
        { id: 'q2', text: '¿Qué pasa con los límites en tu casa?', options: [
          { text: 'Hay muchas reglas y las hago cumplir siempre', profiles: ['autoritario'] },
          { text: 'Hay pocas reglas y a veces no se cumplen', profiles: ['permisivo'] },
          { text: 'Tenemos acuerdos claros que negociamos con los niños', profiles: ['consciente'] },
          { text: 'Varío mucho — a veces firme, a veces dejo pasar todo', profiles: ['permisivo'] },
        ]},
        { id: 'q3', text: '¿Cómo manejas los errores o fallas de tus hijos?', options: [
          { text: 'Con consecuencias claras para que aprendan que las acciones tienen peso', profiles: ['autoritario'] },
          { text: 'Los perdono rápido para no hacerlos sentir mal', profiles: ['permisivo'] },
          { text: 'Hablo con ellos para entender qué pasó y aprender juntos', profiles: ['consciente'] },
          { text: 'Depende de mi estado emocional del día', profiles: ['permisivo'] },
        ]},
        { id: 'q4', text: '¿Qué te preocupa más de tu crianza?', options: [
          { text: 'Que sean demasiado rebeldes o no me respeten', profiles: ['autoritario'] },
          { text: 'Que no tengan estructura y esto les afecte de adultos', profiles: ['permisivo'] },
          { text: 'Que sientan que no los entiendo emocionalmente', profiles: ['consciente'] },
          { text: 'Estar repitiendo patrones de mi propia crianza', profiles: ['autoritario', 'permisivo'] },
        ]},
      ],
      profiles: [
        { id: 'autoritario', name: 'Crianza con Límites Rígidos', emoji: '🏛️', description: 'Tu prioridad es el respeto y la disciplina y eso tiene valor. Pero los límites rígidos sin conexión emocional crean hijos obedientes por miedo, no por convicción.', recommendation: 'La guía trabaja cómo mantener autoridad real (no miedo) mientras construyes una conexión emocional que hace la disciplina innecesaria a largo plazo.', cta: 'Quiero autoridad con conexión' },
        { id: 'permisivo', name: 'Crianza sin Estructura Clara', emoji: '🌸', description: 'Tu amor por tus hijos es enorme y eso se nota. Pero los niños necesitan estructura para sentirse seguros. Los límites amorosos son un acto de amor, no de dureza.', recommendation: 'La guía da un sistema de límites claros y consistentes que se sienten amorosos tanto para ti como para tus hijos.', cta: 'Quiero límites amorosos' },
        { id: 'consciente', name: 'Crianza Consciente en Proceso', emoji: '💚', description: 'Ya tienes las bases de la crianza consciente. Ahora se trata de profundizar las herramientas para los momentos más difíciles y construir una familia que se comunica de verdad.', recommendation: 'La guía avanzada incluye comunicación no violenta con niños, co-regulación emocional y cómo reparar la conexión después de los momentos difíciles.', cta: 'Quiero profundizar mi crianza' },
      ],
    },
    {
      id: 'tmpl-mascotas',
      title: '¿Qué tipo de dueño de mascota eres?',
      subtitle: 'Descubre tu perfil y lo que realmente necesita tu perro o gato',
      category: 'Mascotas',
      icon: 'pets',
      product: 'Guía de Bienestar Animal',
      niche: 'mascotas, perros, gatos, bienestar animal, entrenamiento',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Cómo describes tu relación con tu mascota?', options: [
          { text: 'Es mi mejor amigo/a, duermo con él/ella y va a todos lados conmigo', profiles: ['apegado'] },
          { text: 'La quiero mucho pero me cuesta darle el tiempo que necesita', profiles: ['ocupado'] },
          { text: 'Soy su cuidador responsable, tengo rutinas claras para él/ella', profiles: ['disciplinado'] },
          { text: 'Recién llegó a casa y estamos en período de adaptación', profiles: ['nuevo'] },
        ]},
        { id: 'q2', text: '¿Cuál es tu mayor reto con tu mascota?', options: [
          { text: 'Tiene ansiedad por separación y destruye cosas cuando me voy', profiles: ['apegado'] },
          { text: 'No hago ejercicio con él/ella suficiente por falta de tiempo', profiles: ['ocupado'] },
          { text: 'Quiero mejorar su obediencia y reforzar comandos', profiles: ['disciplinado'] },
          { text: 'No sé exactamente qué necesita ni cómo leer sus señales', profiles: ['nuevo'] },
        ]},
        { id: 'q3', text: '¿Cómo manejas el comportamiento inapropiado de tu mascota?', options: [
          { text: 'Casi siempre lo dejo pasar porque no quiero que sufra', profiles: ['apegado'] },
          { text: 'Lo corrijo pero no de forma consistente', profiles: ['ocupado'] },
          { text: 'Tengo protocolo claro y lo aplico siempre igual', profiles: ['disciplinado'] },
          { text: 'No sé si lo que hago está bien o mal', profiles: ['nuevo'] },
        ]},
        { id: 'q4', text: '¿Qué quieres lograr con tu mascota?', options: [
          { text: 'Que sea más independiente y esté tranquila cuando no estoy', profiles: ['apegado'] },
          { text: 'Crear una rutina sostenible que se adapte a mi vida ocupada', profiles: ['ocupado'] },
          { text: 'Perfeccionar comandos y comportamientos avanzados', profiles: ['disciplinado'] },
          { text: 'Entender sus necesidades básicas y crear un vínculo sano', profiles: ['nuevo'] },
        ]},
      ],
      profiles: [
        { id: 'apegado', name: 'El Dueño Ultra Apegado', emoji: '🐾', description: 'Tu amor por tu mascota es enorme y eso es maravilloso. Pero el exceso de apego puede crear ansiedad en tu peludo/a. Aprender a darle seguridad independiente es el mayor regalo que puedes hacerle.', recommendation: 'La guía incluye el protocolo de independencia gradual: enseña a tu mascota que estar solo es seguro, reduciendo ansiedad de separación sin trauma.', cta: 'Quiero que mi mascota esté tranquila' },
        { id: 'ocupado', name: 'El Dueño Ocupado con Culpa', emoji: '⏰', description: 'Amas a tu mascota pero la vida no para. La buena noticia: la calidad de la interacción importa más que la cantidad. Con las estrategias correctas, 30 minutos pueden ser transformadores.', recommendation: 'La guía de enriquecimiento ambiental muestra cómo mantener a tu mascota estimulada y feliz incluso en los días más ocupados.', cta: 'Quiero aprovechar mejor mi tiempo' },
        { id: 'disciplinado', name: 'El Dueño Estructurado', emoji: '🏆', description: 'Tienes la base perfecta: consistencia y rutinas. Ahora puedes ir al siguiente nivel con técnicas avanzadas de refuerzo positivo que fortalecen el vínculo mientras entrenas.', recommendation: 'La guía avanzada incluye trucos de nivel experto, deportes caninos básicos y cómo mantener la motivación de tu mascota en los entrenamientos.', cta: 'Quiero llevar el entrenamiento al siguiente nivel' },
        { id: 'nuevo', name: 'El Dueño Primerizo', emoji: '🌟', description: 'Cada experto fue principiante alguna vez. Tienes la ventaja de aprender bien desde el inicio — los primeros meses son los más importantes para construir la base de toda la vida.', recommendation: 'La guía primero-pasos cubre todo: alimentación, vacunas, socialización, primeros comandos y cómo leer el lenguaje corporal de tu mascota.', cta: 'Quiero empezar bien' },
      ],
    },
    {
      id: 'tmpl-liderazgo',
      title: '¿Qué tipo de líder eres en tu negocio o equipo?',
      subtitle: 'Descubre tu estilo de liderazgo y lo que necesitas para multiplicar tu impacto',
      category: 'Finanzas & Negocios',
      icon: 'groups',
      product: 'Programa de Liderazgo para Emprendedores',
      niche: 'liderazgo, emprendimiento, equipos, management, negocios',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Cómo tomas decisiones importantes en tu negocio?', options: [
          { text: 'Solo/a — confío en mi criterio y no consulto mucho', profiles: ['solitario'] },
          { text: 'Consulto con el equipo pero la decisión final siempre es mía', profiles: ['directivo'] },
          { text: 'Busco consenso y tardo mucho en decidir por no querer equivocarme', profiles: ['indeciso'] },
          { text: 'Delego en quien tenga más expertise en el tema', profiles: ['empoderador'] },
        ]},
        { id: 'q2', text: '¿Qué pasa cuando un miembro de tu equipo falla?', options: [
          { text: 'Me frustro y termino haciendo yo mismo/a el trabajo', profiles: ['solitario'] },
          { text: 'Doy retroalimentación directa y establezco consecuencias', profiles: ['directivo'] },
          { text: 'Evito el conflicto y dejo pasar por no incomodar', profiles: ['indeciso'] },
          { text: 'Entiendo el contexto, apoyo y busco solución conjunta', profiles: ['empoderador'] },
        ]},
        { id: 'q3', text: '¿Cómo describes tu comunicación como líder?', options: [
          { text: 'Clara y directa — espero que las cosas se hagan bien y rápido', profiles: ['directivo'] },
          { text: 'Inconsistente — a veces soy muy directo/a y a veces no digo nada', profiles: ['indeciso'] },
          { text: 'Prefiero hacer que delegar porque nadie lo hace como yo', profiles: ['solitario'] },
          { text: 'Empática y motivadora — creo en las personas antes de los resultados', profiles: ['empoderador'] },
        ]},
        { id: 'q4', text: '¿Cuál es tu mayor punto ciego como líder?', options: [
          { text: 'No saber soltar el control y delegar de verdad', profiles: ['solitario'] },
          { text: 'Ser demasiado exigente y quemar a las personas', profiles: ['directivo'] },
          { text: 'La indecisión y el miedo a tomar decisiones equivocadas', profiles: ['indeciso'] },
          { text: 'Ser demasiado flexible y que el equipo no tenga suficiente dirección', profiles: ['empoderador'] },
        ]},
      ],
      profiles: [
        { id: 'solitario', name: 'El Líder Solitario', emoji: '🦅', description: 'Eres altamente capaz pero cargas solo/a todo el peso. El negocio no puede crecer más allá de lo que tú puedes hacer. Aprender a liderar es aprender a multiplicarte a través de otros.', recommendation: 'El programa trabaja el sistema de delegación efectiva: cómo construir confianza en el equipo, documentar procesos y soltar el control sin perder calidad.', cta: 'Quiero dejar de hacerlo todo yo' },
        { id: 'directivo', name: 'El Líder Directivo', emoji: '🎯', description: 'Tu claridad y exigencia producen resultados. El riesgo es el agotamiento del equipo. Los mejores líderes combinan alta exigencia con alto soporte — eso retiene talento.', recommendation: 'El programa de liderazgo situacional te enseña cuándo ser directivo y cuándo dar más autonomía según el nivel de cada persona en tu equipo.', cta: 'Quiero liderar con balance' },
        { id: 'indeciso', name: 'El Líder en Busca de Claridad', emoji: '🔭', description: 'La indecisión en el liderazgo no es debilidad — es falta de un marco claro para tomar decisiones bajo incertidumbre. Con el sistema correcto, decides rápido y bien.', recommendation: 'El programa incluye el framework de toma de decisiones de los mejores CEOs: cómo evaluar opciones rápido, aceptar la imperfección y actuar.', cta: 'Quiero decidir con confianza' },
        { id: 'empoderador', name: 'El Líder que Empodera', emoji: '🌱', description: 'Tienes el estilo de liderazgo más sostenible. Tu reto ahora es mantener la dirección estratégica clara mientras empoderas al equipo. Liderazgo con visión y corazón.', recommendation: 'El programa avanzado trabaja planificación estratégica, OKRs simples y cómo comunicar la visión de forma que el equipo la haga propia.', cta: 'Quiero escalar mi liderazgo' },
      ],
    },
    {
      id: 'tmpl-mindfulness',
      title: '¿Cuánto control tienes sobre tu mente y tus pensamientos?',
      subtitle: 'Descubre tu nivel de mindfulness y el método que más te funciona',
      category: 'Bienestar',
      icon: 'self_improvement',
      product: 'Programa de Mindfulness Moderno',
      niche: 'mindfulness, meditación, bienestar mental, estrés, atención plena',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Qué pasa cuando intentas quedarte quieto/a sin el teléfono?', options: [
          { text: 'Me pongo ansioso/a rápidamente y necesito hacer algo', profiles: ['desconectado'] },
          { text: 'Aguanto un rato pero los pensamientos no paran', profiles: ['principiante'] },
          { text: 'Puedo estar solo/a con mis pensamientos pero me cuesta', profiles: ['intermedio'] },
          { text: 'Lo disfruto, es mi tiempo de recarga', profiles: ['avanzado'] },
        ]},
        { id: 'q2', text: '¿Cuándo sueles darte cuenta de que estás estresado/a?', options: [
          { text: 'Cuando ya explotó — después de un berrinche o crisis', profiles: ['desconectado'] },
          { text: 'Cuando tengo síntomas físicos como tensión o dolor de cabeza', profiles: ['principiante'] },
          { text: 'Cuando noto que me irrito o pienso en bucle', profiles: ['intermedio'] },
          { text: 'Lo noto casi en tiempo real y lo proceso antes de que crezca', profiles: ['avanzado'] },
        ]},
        { id: 'q3', text: '¿Has probado alguna práctica de meditación o mindfulness?', options: [
          { text: 'No, nunca lo he intentado o me parece difícil', profiles: ['desconectado'] },
          { text: 'Sí, empecé pero lo dejé porque no veía resultados rápidos', profiles: ['principiante'] },
          { text: 'Sí, lo hago ocasionalmente pero sin consistencia', profiles: ['intermedio'] },
          { text: 'Tengo alguna práctica regular aunque sea breve', profiles: ['avanzado'] },
        ]},
        { id: 'q4', text: '¿Qué te gustaría lograr con el mindfulness?', options: [
          { text: 'Dejar de vivir en piloto automático y empezar a disfrutar el presente', profiles: ['desconectado'] },
          { text: 'Bajar el nivel de estrés y ansiedad del día a día', profiles: ['principiante'] },
          { text: 'Crear una práctica que pueda mantener para siempre', profiles: ['intermedio'] },
          { text: 'Profundizar y llevar el mindfulness a todas las áreas de mi vida', profiles: ['avanzado'] },
        ]},
      ],
      profiles: [
        { id: 'desconectado', name: 'El Piloto Automático', emoji: '🌑', description: 'Vives tan rápido que casi nunca estás presente en tu propia vida. No es tu culpa — la cultura actual diseña el piloto automático. La buena noticia: basta con 5 minutos al día para empezar a cambiar eso.', recommendation: 'El programa empieza con el "microhábito de presencia": 5 prácticas de 1-3 minutos que caben en cualquier día sin importar lo ocupado que estés.', cta: 'Quiero empezar a estar presente' },
        { id: 'principiante', name: 'El Que Quiere pero No Puede', emoji: '🌒', description: 'Ya sabes que el mindfulness funciona — solo necesitas el enfoque correcto. La mayoría abandona porque empieza con métodos que no son para ellos.', recommendation: 'El programa identifica tu estilo de mindfulness (movimiento, respiración, contemplativo o sensorial) para que encuentres el que encaja contigo.', cta: 'Quiero encontrar mi práctica' },
        { id: 'intermedio', name: 'El Inconsistente Consciente', emoji: '🌓', description: 'Tienes los beneficios en los días que practicas pero pierdes la racha fácilmente. El secreto de la consistencia no es la disciplina — es anclar la práctica a algo que ya haces.', recommendation: 'El módulo de habit stacking del programa te enseña a conectar tu práctica de mindfulness con hábitos existentes para hacerla automática.', cta: 'Quiero ser consistente' },
        { id: 'avanzado', name: 'El Practicante que Profundiza', emoji: '🌕', description: 'Tienes la base. Ahora el mindfulness puede ir más allá de la meditación para convertirse en una forma de vivir: relaciones más presentes, trabajo más fluido, vida más plena.', recommendation: 'El nivel avanzado integra mindfulness en conversaciones difíciles, toma de decisiones y estados de flow para que sea una herramienta en cada área de tu vida.', cta: 'Quiero el mindfulness como forma de vida' },
      ],
    },
    {
      id: 'tmpl-email-marketing',
      title: '¿Qué tan efectiva es tu lista de email realmente?',
      subtitle: 'Descubre tu perfil como email marketer y lo que frena tus ventas',
      category: 'Finanzas & Negocios',
      icon: 'email',
      product: 'Curso de Email Marketing para Infoproductores',
      niche: 'email marketing, lista, automatización, infoproductos, conversión',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Con qué frecuencia envías emails a tu lista?', options: [
          { text: 'No tengo lista o no la uso', profiles: ['sin-lista'] },
          { text: 'Solo cuando voy a vender algo', profiles: ['venta-directa'] },
          { text: 'Intento enviar pero no tengo un calendario claro', profiles: ['inconsistente'] },
          { text: 'Tengo frecuencia regular pero mis tasas de apertura no mejoran', profiles: ['optimizacion'] },
        ]},
        { id: 'q2', text: '¿Qué tipo de emails envías principalmente?', options: [
          { text: 'No envío emails todavía', profiles: ['sin-lista'] },
          { text: 'Casi solo emails de venta o lanzamiento', profiles: ['venta-directa'] },
          { text: 'Una mezcla de valor y venta pero sin estrategia clara', profiles: ['inconsistente'] },
          { text: 'Secuencias automáticas de bienvenida y nurturing', profiles: ['optimizacion'] },
        ]},
        { id: 'q3', text: '¿Cuánto sabes sobre métricas de email (open rate, CTR)?', options: [
          { text: 'No sé qué significan esos términos', profiles: ['sin-lista'] },
          { text: 'Los conozco pero no los reviso regularmente', profiles: ['venta-directa'] },
          { text: 'Los reviso pero no sé bien cómo mejorarlos', profiles: ['inconsistente'] },
          { text: 'Los monitoreo y hago pruebas A/B para optimizarlos', profiles: ['optimizacion'] },
        ]},
        { id: 'q4', text: '¿Cuál es tu mayor problema con el email marketing?', options: [
          { text: 'No sé cómo empezar a construir mi lista', profiles: ['sin-lista'] },
          { text: 'Mi lista existe pero no compra cuando lanzo', profiles: ['venta-directa'] },
          { text: 'No sé qué escribir o se me acaban las ideas', profiles: ['inconsistente'] },
          { text: 'Mis métricas están bien pero quiero escalar las ventas por email', profiles: ['optimizacion'] },
        ]},
      ],
      profiles: [
        { id: 'sin-lista', name: 'El que Aún no Construye', emoji: '🏗️', description: 'El email sigue siendo el canal de mayor ROI en marketing digital. Cada día sin lista es una oportunidad perdida. Pero construir bien desde el inicio hace toda la diferencia.', recommendation: 'El curso empieza desde cero: elegir la plataforma correcta, crear el lead magnet irresistible y configurar la secuencia de bienvenida que convierte suscriptores en compradores.', cta: 'Quiero construir mi lista' },
        { id: 'venta-directa', name: 'El que Solo Aparece para Vender', emoji: '📢', description: 'Tu lista sabe que cuando les escribes es para pedirles algo. La solución es simple: dar valor primero. Los suscriptores que confían en ti compran más y te recomiendan.', recommendation: 'El módulo de "email de valor" del curso te da 12 tipos de emails de contenido que nutren la relación y precondicionan la compra sin vender directamente.', cta: 'Quiero una lista que confíe en mí' },
        { id: 'inconsistente', name: 'El Email Marketer Intermitente', emoji: '📨', description: 'El email marketing funciona por consistencia acumulada. Las listas que abren bien son las que reciben emails regulares de calidad. Con un sistema de contenido, la consistencia es fácil.', recommendation: 'El módulo de sistema de contenido del curso te da un calendario editorial trimestral y plantillas de los 7 tipos de email que siempre funcionan.', cta: 'Quiero un sistema de emails' },
        { id: 'optimizacion', name: 'El Email Marketer Avanzado', emoji: '🚀', description: 'Tienes la base — ahora se trata de escalar y optimizar. Pequeñas mejoras en open rate y CTR multiplican los ingresos sin necesitar más suscriptores.', recommendation: 'El módulo avanzado cubre segmentación conductual, automatizaciones de reactivación, split testing de subject lines y la secuencia de abandono de carrito perfecta.', cta: 'Quiero escalar mis resultados' },
      ],
    },
    {
      id: 'tmpl-redes-sociales',
      title: '¿Por qué tus redes sociales no convierten en ventas?',
      subtitle: 'Descubre tu bloqueo y el tipo de contenido que realmente funciona para ti',
      category: 'Finanzas & Negocios',
      icon: 'smartphone',
      product: 'Curso de Contenido que Vende',
      niche: 'redes sociales, contenido, Instagram, TikTok, marketing digital',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Cuál es tu mayor problema con tus redes sociales?', options: [
          { text: 'No sé qué publicar y me bloqueo', profiles: ['ideas'] },
          { text: 'Publico pero casi nadie lo ve o interactúa', profiles: ['alcance'] },
          { text: 'Tengo seguidores pero nadie compra', profiles: ['conversion'] },
          { text: 'Empiezo bien y luego abandono por semanas', profiles: ['consistencia'] },
        ]},
        { id: 'q2', text: '¿Con qué frecuencia publicas contenido actualmente?', options: [
          { text: 'Casi nunca — llevo semanas o meses sin publicar', profiles: ['consistencia'] },
          { text: '1-2 veces por semana sin calendario fijo', profiles: ['ideas'] },
          { text: 'Regularmente pero sin ver resultados', profiles: ['alcance'] },
          { text: 'Publico mucho pero el contenido no genera ventas directas', profiles: ['conversion'] },
        ]},
        { id: 'q3', text: '¿Qué tipo de contenido creas principalmente?', options: [
          { text: 'Casi no creo — no sé por dónde empezar', profiles: ['ideas'] },
          { text: 'Fotos bonitas o quotes motivacionales', profiles: ['alcance'] },
          { text: 'Contenido educativo pero sin llamada a la acción', profiles: ['conversion'] },
          { text: 'De todo un poco sin una estrategia clara', profiles: ['consistencia'] },
        ]},
        { id: 'q4', text: '¿Cuánto tiempo llevas con tu negocio en redes?', options: [
          { text: 'Recién empecé o estoy pensando en empezar', profiles: ['ideas'] },
          { text: 'Más de 6 meses y siento que no crezco', profiles: ['alcance'] },
          { text: 'Tengo audiencia pero el embudo no convierte', profiles: ['conversion'] },
          { text: 'Llevo tiempo pero con muchos altos y bajos', profiles: ['consistencia'] },
        ]},
      ],
      profiles: [
        { id: 'ideas', name: 'El Bloqueo de Ideas', emoji: '💡', description: 'La parálisis frente al contenido en blanco es el enemigo número uno del creador. No es falta de creatividad — es falta de un sistema para generar ideas en minutos.', recommendation: 'El curso incluye el banco de 50 tipos de contenido reutilizables y el método de reciclaje de contenido que convierte una idea en 10 publicaciones diferentes.', cta: 'Quiero nunca quedarme sin ideas' },
        { id: 'alcance', name: 'El Alcance que No Crece', emoji: '📡', description: 'El algoritmo no es el enemigo — es la oportunidad. El contenido que se distribuye solo tiene características específicas que se pueden aprender y replicar.', recommendation: 'El módulo de contenido viral del curso analiza los 5 formatos con mayor alcance orgánico en Instagram y TikTok y cómo aplicarlos a cualquier nicho.', cta: 'Quiero que me vean más personas' },
        { id: 'conversion', name: 'El Seguidor que No Compra', emoji: '🎯', description: 'Tienes audiencia pero no clientes. El contenido que atrae no es el mismo que vende. Necesitas un embudo de contenido que lleve a tu seguidor de "me gusta" a "quiero comprar".', recommendation: 'El módulo de contenido con intención trabaja la secuencia de contenido que calienta la audiencia: awareness → consideración → conversión.', cta: 'Quiero convertir seguidores en clientes' },
        { id: 'consistencia', name: 'El Creador Inconsistente', emoji: '🔄', description: 'Los algoritmos premian la consistencia y tu audiencia también. El problema no es la motivación — es la falta de un sistema que no dependa de ella.', recommendation: 'El sistema de batching del curso te enseña a crear contenido de un mes en 2 horas para que la constancia no dependa de cómo te sientas cada día.', cta: 'Quiero un sistema de contenido' },
      ],
    },
    {
      id: 'tmpl-habitos-emprendedor',
      title: '¿Qué hábito de emprendedor está saboteando tu éxito?',
      subtitle: 'Identifica el patrón que te frena y la solución exacta para superarlo',
      category: 'Productividad',
      icon: 'loop',
      product: 'Programa de Hábitos para Emprendedores',
      niche: 'hábitos, emprendimiento, productividad, mentalidad, disciplina',
      estimatedMinutes: 2,
      questions: [
        { id: 'q1', text: '¿Cuándo eres más productivo/a?', options: [
          { text: 'Cuando se acerca el deadline y ya no queda otro remedio', profiles: ['procrastinador'] },
          { text: 'Cuando me siento inspirado/a — que es pocas veces', profiles: ['dependiente'] },
          { text: 'Cuando tengo mi lista de tareas clara y priorizada', profiles: ['organizado'] },
          { text: 'No tengo un patrón claro, varía mucho', profiles: ['inconsistente'] },
        ]},
        { id: 'q2', text: '¿Cómo es tu mañana típica de trabajo?', options: [
          { text: 'Abro el teléfono y ya me perdí una hora en redes', profiles: ['inconsistente'] },
          { text: 'Espero sentirme listo/a para empezar, que puede tardar mucho', profiles: ['dependiente'] },
          { text: 'Hago lo urgente aunque no sea lo importante', profiles: ['procrastinador'] },
          { text: 'Tengo un ritual de inicio que me pone en modo trabajo', profiles: ['organizado'] },
        ]},
        { id: 'q3', text: '¿Qué pasa con tus proyectos grandes y estratégicos?', options: [
          { text: 'Los postergó hasta que se vuelven urgentes', profiles: ['procrastinador'] },
          { text: 'Los empiezo con entusiasmo pero los abandono a la mitad', profiles: ['dependiente'] },
          { text: 'No los hago nunca porque lo cotidiano me absorbe', profiles: ['inconsistente'] },
          { text: 'Avanzo pero más lento de lo que quisiera', profiles: ['organizado'] },
        ]},
        { id: 'q4', text: '¿Cuántas horas al día realmente trabajas en lo que importa?', options: [
          { text: 'Menos de 2 horas, aunque esté "ocupado/a" todo el día', profiles: ['inconsistente'] },
          { text: 'Depende completamente de mi estado de ánimo', profiles: ['dependiente'] },
          { text: 'Trabajo muchas horas pero en las tareas equivocadas', profiles: ['procrastinador'] },
          { text: 'Tengo bloques definidos pero me interrumpen constantemente', profiles: ['organizado'] },
        ]},
      ],
      profiles: [
        { id: 'procrastinador', name: 'El Héroe del Último Minuto', emoji: '⏰', description: 'Eres capaz — lo demuestras cada vez que la presión llega. El reto es crear esa misma presión de forma intencional antes de que sea crisis.', recommendation: 'El programa trabaja la técnica de "fecha de entrega falsa" y los sistemas de accountability personal que replican la presión del deadline sin el estrés.', cta: 'Quiero dejar de procrastinar' },
        { id: 'dependiente', name: 'El Esclavo de la Inspiración', emoji: '🌊', description: 'Esperar la motivación para trabajar es como esperar que el clima sea perfecto para salir. Los profesionales trabajan con o sin inspiración — y la acción crea la motivación.', recommendation: 'El módulo de "comienzo mínimo viable" te enseña el ritual de 2 minutos que activa el estado de trabajo sin necesitar sentirte listo/a.', cta: 'Quiero trabajar sin esperar inspiración' },
        { id: 'inconsistente', name: 'El Que No Tiene Sistema', emoji: '🌀', description: 'Sin sistema, dependes de la fuerza de voluntad — que es un recurso agotable. Un sistema externaliza las decisiones para que no tengas que tomar la misma decisión dos veces.', recommendation: 'El programa te ayuda a diseñar tu sistema operativo personal: agenda, herramientas, rituales y reglas que funcionan en piloto automático.', cta: 'Quiero mi sistema personal' },
        { id: 'organizado', name: 'El Que Necesita Optimizar', emoji: '🎯', description: 'Tienes estructura — eso ya te pone delante del 80%. Ahora se trata de eliminar los ladrones de tiempo que quedan y proteger mejor tus horas de alto impacto.', recommendation: 'El módulo avanzado trabaja la auditoría de tiempo, la eliminación de reuniones innecesarias y el diseño de "tiempo profundo" protegido para trabajo estratégico.', cta: 'Quiero optimizar mi tiempo' },
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
