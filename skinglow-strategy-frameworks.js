(function () {
  const KEY = "luminous_strategy_framework_selected";
  const MAP_KEY = "luminous_strategy_bot_map";

  const frameworks = [
    {
      id: "research",
      icon: "travel_explore",
      title: "Investigacion y voz del cliente",
      label: "Mercado",
      bestFor: "Spy Lab",
      inspiredBy: "Eugene Schwartz, Ryan Levesque, Joanna Wiebe, Claude Hopkins",
      focus: "Detectar deseos, objeciones, lenguaje real, promesas repetidas y huecos de mercado.",
      use: "Ideal para el bot de espionaje, analisis de competencia y brief de mercado.",
      outputs: ["Dolores", "Deseos", "Objeciones", "Angulos", "Lenguaje"],
      botInstruction: "Analiza el mercado antes de vender: identifica deseo principal, nivel de conciencia, promesas repetidas, objeciones, palabras textuales de la audiencia, competidores y oportunidades para diferenciar la oferta."
    },
    {
      id: "offer",
      icon: "deployed_code",
      title: "Oferta irresistible",
      label: "Oferta",
      bestFor: "Offer Lab",
      inspiredBy: "Alex Hormozi, Dan Kennedy, Russell Brunson",
      focus: "Subir valor percibido, ordenar promesa, mecanismo, bonos, riesgo y precio.",
      use: "Ideal para el bot de producto y el empaque de la oferta.",
      outputs: ["Promesa", "Mecanismo", "Bonos", "Precio", "Garantia"],
      botInstruction: "Convierte la idea en una oferta clara: cliente ideal, dolor urgente, promesa concreta, mecanismo unico, pila de valor, objeciones, garantia, precio, CTA y siguiente paso."
    },
    {
      id: "product",
      icon: "deployed_code_account",
      title: "Producto premium",
      label: "Mini app",
      bestFor: "Mini app",
      inspiredBy: "Productized services, membership design, customer success",
      focus: "Convertir contenido en experiencia: diagnostico, seguimiento, rutina, progreso y soporte.",
      use: "Ideal para decidir que herramientas hacen que la oferta se vea mas premium.",
      outputs: ["Herramientas", "Ruta", "Seguimiento", "Retencion", "Soporte"],
      botInstruction: "Transforma una promesa en experiencia usable: define herramientas, flujo diario, checklist, registro, seguimiento, puntos de valor percibido, momentos de progreso y soporte educativo responsable."
    },
    {
      id: "education",
      icon: "auto_stories",
      title: "Ebook que prepara la venta",
      label: "Ebook",
      bestFor: "Ebook Builder",
      inspiredBy: "Content marketing, lead magnets, tutorial design",
      focus: "Educar sin regalar toda la solucion y preparar el deseo por el siguiente paso.",
      use: "Ideal para guias, lead magnets, bonus educativos y materiales de entrega.",
      outputs: ["Indice", "Guia", "Checklist", "Errores", "CTA"],
      botInstruction: "Estructura un ebook util pero estrategico: ensena el problema, ordena conceptos, evita sobrecargar, muestra errores comunes, da victorias rapidas y conecta naturalmente con la oferta principal."
    },
    {
      id: "vsl",
      icon: "movie",
      title: "VSL y carta de venta",
      label: "Video ventas",
      bestFor: "VSL / Carta",
      inspiredBy: "Eugene Schwartz, Jon Benson, Joseph Sugarman, John Caples",
      focus: "Construir una historia de venta con gancho, problema, mecanismo, prueba y cierre.",
      use: "Ideal para guiones de video, carta de venta y estructura de landing larga.",
      outputs: ["Hook", "Historia", "Mecanismo", "Prueba", "Cierre"],
      botInstruction: "Escribe como estratega de VSL: hook fuerte, conciencia del problema, enemigo comun, nuevo mecanismo, prueba, oferta, objeciones y cierre con urgencia responsable."
    },
    {
      id: "landing",
      icon: "web",
      title: "Landing clara",
      label: "Landing",
      bestFor: "Landing Builder",
      inspiredBy: "StoryBrand, Copyhackers, David Ogilvy",
      focus: "Que la pagina explique rapido para quien es, que obtiene y cual es el siguiente paso.",
      use: "Ideal para landing, resultado de quiz, hero, beneficios y CTA.",
      outputs: ["Hero", "Beneficios", "Prueba", "CTA", "FAQ"],
      botInstruction: "Ordena el mensaje con claridad: cliente como protagonista, problema visible, plan simple, beneficios concretos, prueba, CTA unico y reduccion de riesgo."
    },
    {
      id: "quiz",
      icon: "quiz",
      title: "Quiz diagnostico",
      label: "Quiz",
      bestFor: "Quiz Builder",
      inspiredBy: "Ryan Levesque, customer research, niveles de conciencia",
      focus: "Segmentar por deseo, dolor, objecion y siguiente accion de compra.",
      use: "Ideal para preguntas, perfiles, resultado y recomendacion personalizada.",
      outputs: ["Preguntas", "Perfiles", "Resultado", "Objecion", "CTA"],
      botInstruction: "Disena un quiz que descubra deseo principal, situacion actual, barrera, urgencia y perfil. Cada resultado debe llevar a una recomendacion y un CTA coherente."
    },
    {
      id: "ads",
      icon: "campaign",
      title: "Creativos y test",
      label: "Ads",
      bestFor: "Ads Lab",
      inspiredBy: "Molly Pittman, Nick Shackelford, Ezra Firestone, Savannah Sanchez",
      focus: "Crear hooks, angulos, scripts cortos, variaciones y plan de prueba.",
      use: "Ideal para Facebook Ads, TikTok, Reels, UGC y mensajes de retargeting.",
      outputs: ["Hooks", "Copy", "Guiones", "Angulos", "Tests"],
      botInstruction: "Piensa como media buyer creativo: separa angulos por dolor, deseo, prueba, objecion y curiosidad. Entrega hooks, texto primario, titular, guion corto y plan de test."
    },
    {
      id: "launch",
      icon: "rocket_launch",
      title: "Lanzamiento de infoproducto",
      label: "Launch",
      bestFor: "Ruta de venta",
      inspiredBy: "Jeff Walker, Ryan Deiss, Dean Graziosi",
      focus: "Preparar el recorrido completo: expectativa, contenido, prueba, oferta y seguimiento.",
      use: "Ideal para calendario de lanzamiento, eventos, emails, WhatsApp y secuencias.",
      outputs: ["Calendario", "Contenido", "Oferta", "Cierre", "Reactivacion"],
      botInstruction: "Crea una ruta de lanzamiento: precontenido, activacion de deseo, prueba, oferta, cierre, seguimiento y reactivacion de leads tibios."
    },
    {
      id: "followup",
      icon: "chat",
      title: "Seguimiento y cierre",
      label: "Leads",
      bestFor: "Lead Desk",
      inspiredBy: "Frank Kern, Dan Kennedy, Ryan Deiss",
      focus: "Convertir leads con mensajes humanos, objeciones y siguientes pasos.",
      use: "Ideal para WhatsApp, email, abandono de checkout y recuperacion.",
      outputs: ["WhatsApp", "Email", "Objeciones", "Cierre", "Recuperacion"],
      botInstruction: "Escribe seguimiento consultivo: contexto del lead, validacion, pregunta, micro-prueba, objecion probable, siguiente paso y CTA suave."
    },
    {
      id: "dtc",
      icon: "storefront",
      title: "Ecommerce y DTC",
      label: "Ecommerce",
      bestFor: "Bundles",
      inspiredBy: "Nik Sharma, Taylor Holiday, Ezra Firestone",
      focus: "Alinear producto, oferta, creativos, pagina, prueba social y recompra.",
      use: "Ideal si el infoproducto se vende con kits, productos fisicos o bundles.",
      outputs: ["Bundle", "Pagina", "Checkout", "Upsell", "Recompra"],
      botInstruction: "Optimiza como DTC: propuesta clara, bundle, prueba visual, comparacion, riesgo bajo, checkout simple, upsell y recompra."
    }
  ];

  const recommendedMap = {
    spy: "research",
    offer: "offer",
    miniapp: "product",
    ebook: "education",
    quiz: "quiz",
    landing: "landing",
    vsl: "vsl",
    ads: "ads",
    launch: "launch",
    leads: "followup",
    ecommerce: "dtc"
  };

  const tasks = [
    { id: "spy", title: "Mercado / espionaje", icon: "travel_explore", note: "Dolores, lenguaje, competidores y angulos" },
    { id: "offer", title: "Oferta", icon: "deployed_code", note: "Promesa, mecanismo, bonos y precio" },
    { id: "miniapp", title: "Mini app", icon: "deployed_code_account", note: "Experiencia premium y seguimiento" },
    { id: "ebook", title: "Ebook", icon: "auto_stories", note: "Educacion, guia y confianza" },
    { id: "quiz", title: "Quiz", icon: "quiz", note: "Segmentacion y recomendacion" },
    { id: "landing", title: "Landing", icon: "web", note: "Mensaje claro y CTA" },
    { id: "ads", title: "Facebook Ads", icon: "campaign", note: "Hooks, guiones y test" },
    { id: "leads", title: "Leads", icon: "chat", note: "WhatsApp, email y cierre" }
  ];

  function findFramework(id) {
    return frameworks.find(item => item.id === id) || frameworks[0];
  }

  function getSavedFramework() {
    try {
      return findFramework(localStorage.getItem(KEY) || recommendedMap.offer);
    } catch {
      return findFramework(recommendedMap.offer);
    }
  }

  function saveFramework(id) {
    const framework = findFramework(id);
    try {
      localStorage.setItem(KEY, framework.id);
    } catch {}
    return framework;
  }

  function getSavedStrategyMap() {
    try {
      const saved = JSON.parse(localStorage.getItem(MAP_KEY) || "{}") || {};
      return { ...recommendedMap, ...saved };
    } catch {
      return { ...recommendedMap };
    }
  }

  function saveStrategyFor(taskId, frameworkId) {
    const framework = findFramework(frameworkId);
    try {
      const nextMap = { ...getSavedStrategyMap(), [taskId]: framework.id };
      localStorage.setItem(MAP_KEY, JSON.stringify(nextMap));
      return nextMap;
    } catch {
      return getSavedStrategyMap();
    }
  }

  function saveRecommendedMap() {
    try {
      localStorage.setItem(MAP_KEY, JSON.stringify(recommendedMap));
    } catch {}
    return getSavedStrategyMap();
  }

  function getStrategyFor(taskId) {
    const map = getSavedStrategyMap();
    return findFramework(map[taskId] || recommendedMap[taskId] || getSavedFramework().id);
  }

  function buildPrompt(framework, brief, taskId) {
    const current = framework || getStrategyFor(taskId || "offer");
    const safeBrief = brief || {};
    const outputs = Array.isArray(current.outputs) ? current.outputs.join(", ") : "estructura, copy y siguiente paso";
    return `Marco estrategico: ${current.title}
Bot recomendado: ${current.bestFor}
Inspirado en frameworks publicos de: ${current.inspiredBy}
Uso recomendado: ${current.use}
Entregables esperados: ${outputs}

Instruccion para el chatbot:
${current.botInstruction}

Producto:
${safeBrief.name || "SkinGlow AI"}

Promesa:
${safeBrief.promise || "Ayudar a entender la piel y seguir una rutina simple de 21 dias."}

Cliente ideal:
${safeBrief.audience || "Mujeres que quieren ordenar su rutina de skincare."}

Siguiente paso:
${safeBrief.nextStep || "Responder el quiz y entrar al reto."}`;
  }

  function buildPromptForTask(taskId, brief) {
    return buildPrompt(getStrategyFor(taskId), brief, taskId);
  }

  window.SKINGLOW_STRATEGY = {
    KEY,
    MAP_KEY,
    frameworks,
    recommendedMap,
    tasks,
    findFramework,
    getSavedFramework,
    saveFramework,
    getSavedStrategyMap,
    saveStrategyFor,
    saveRecommendedMap,
    getStrategyFor,
    buildPrompt,
    buildPromptForTask
  };
})();
