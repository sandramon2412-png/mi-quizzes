(function () {
  const now = new Date().toISOString();
  const QUIZ_ID = 'skinglow-skin-quiz';
  const MINIAPP_ID = 'skinglow-miniapp';
  const EBOOK_ID = 'skinglow-ebook';
  const LANDING_ID = 'skinglow-landing';
  const PROJECT_ID = 'skinglow-project';
  const TEMPLATE_ID = 'tmpl-skinglow-ai';

  const skinGlowQuiz = {
    id: QUIZ_ID,
    title: '¿Qué necesita tu piel ahora mismo?',
    subtitle: 'Responde 6 preguntas y recibe una ruta personalizada para cuidar tu piel sin comprar productos al azar.',
    product: 'SkinGlow AI: Reto Piel Clara en 21 días',
    niche: 'skincare, belleza, análisis de piel, rutina facial, piel sensible, manchas, acné',
    brandName: 'SkinGlow AI',
    category: 'Belleza',
    icon: 'face_retouching_natural',
    status: 'active',
    created: now,
    updated_at: now,
    estimatedMinutes: 2,
    leadCapture: false,
    showAllProfiles: false,
    showLuminousCta: false,
    brandColor: '#db2777',
    accentColor: '#0f9f93',
    themeColor: '#db2777',
    coverImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=80',
    postQuizAction: 'result_page',
    productUrl: './skinglow-landing-demo.html?v=video1',
    landingUrl: './skinglow-landing-demo.html?v=video1',
    landingId: LANDING_ID,
    paymentUrl: './skinglow-checkout-demo.html?v=checkoutpremium4',
    ebookTitle: 'Guía SkinGlow: 7 días para entender tu piel',
    ebookDescription: 'Lead magnet educativo para observar señales, simplificar tu rutina y preparar el reto de 21 días.',
    ebookUrl: './skinglow-ebook-demo.html?v=iconfix1',
    leadMagnetUrl: './skinglow-ebook-demo.html?v=iconfix1',
    miniAppId: MINIAPP_ID,
    questions: [
      {
        id: 'q1',
        category: 'sensación',
        text: 'Cuando limpias tu rostro, ¿cómo se siente tu piel después de 10 minutos?',
        options: [
          { text: 'Tirante, opaca o con sensación de sequedad', profiles: ['deshidratada'] },
          { text: 'Brillante en zona T pero seca en mejillas', profiles: ['mixta'] },
          { text: 'Con picor, ardor o rojeces fácilmente', profiles: ['sensible'] },
          { text: 'Grasa rápido y con poros muy visibles', profiles: ['grasa'] }
        ]
      },
      {
        id: 'q2',
        category: 'prioridad',
        text: '¿Qué te gustaría mejorar primero?',
        options: [
          { text: 'Calmar rojeces y dejar de reaccionar a todo', profiles: ['sensible'] },
          { text: 'Recuperar luminosidad y suavidad', profiles: ['deshidratada'] },
          { text: 'Controlar brillo, granitos y puntos negros', profiles: ['grasa'] },
          { text: 'Manchas, textura y tono irregular', profiles: ['manchas'] }
        ]
      },
      {
        id: 'q3',
        category: 'rutina',
        text: '¿Cómo es tu rutina actual?',
        options: [
          { text: 'Uso muchos productos pero no sé si combinan', profiles: ['sensible', 'manchas'] },
          { text: 'Solo limpio mi cara y a veces uso crema', profiles: ['deshidratada'] },
          { text: 'Uso productos para acné que a veces resecan', profiles: ['grasa', 'sensible'] },
          { text: 'Tengo rutina, pero los resultados no son constantes', profiles: ['mixta', 'manchas'] }
        ]
      },
      {
        id: 'q4',
        category: 'hábitos',
        text: '¿Qué paso se te olvida con más frecuencia?',
        options: [
          { text: 'Protector solar en cantidad suficiente', profiles: ['manchas'] },
          { text: 'Hidratante o reparación de barrera', profiles: ['deshidratada', 'sensible'] },
          { text: 'Limpieza nocturna suave', profiles: ['grasa', 'mixta'] },
          { text: 'Ser constante más de una semana', profiles: ['mixta', 'deshidratada'] }
        ]
      },
      {
        id: 'q5',
        category: 'reacción',
        text: 'Cuando pruebas un producto nuevo, tu piel suele...',
        options: [
          { text: 'Enrojecerse o arder con facilidad', profiles: ['sensible'] },
          { text: 'Sentirse mejor unos días y luego volver a lo mismo', profiles: ['mixta'] },
          { text: 'Brotes o brillo si es muy pesado', profiles: ['grasa'] },
          { text: 'No reaccionar mucho, pero tampoco mejorar manchas', profiles: ['manchas'] }
        ]
      },
      {
        id: 'q6',
        category: 'meta',
        text: 'Si esta rutina funcionara, ¿qué resultado te haría decir “valió la pena”?',
        options: [
          { text: 'Piel tranquila, sin ardor ni rojeces constantes', profiles: ['sensible'] },
          { text: 'Piel jugosa, suave y con glow natural', profiles: ['deshidratada'] },
          { text: 'Menos brotes y brillo controlado', profiles: ['grasa'] },
          { text: 'Tono más parejo y textura más lisa', profiles: ['manchas'] }
        ]
      }
    ],
    profiles: [
      {
        id: 'sensible',
        name: 'Piel Reactiva que Necesita Calma',
        emoji: 'spa',
        matchScore: 89,
        description: 'Tu piel parece pedir menos agresión y más reparación. El foco no es probar más productos, sino bajar irritación, ordenar ingredientes y fortalecer la barrera cutánea.',
        recommendation: 'Empieza con una rutina corta: limpiador suave, hidratante reparadora y protector solar. La mini app te guía día a día para detectar qué dispara rojeces sin convertirlo en diagnóstico médico.',
        cta: 'Ver mi rutina calmante',
        ctaUrl: './skinglow-checkout-demo.html?v=checkoutpremium4',
        ebookUrl: './skinglow-ebook-demo.html?v=iconfix1',
        ebookTitle: 'Guía SkinGlow: 7 días para entender tu piel'
      },
      {
        id: 'deshidratada',
        name: 'Piel Apagada con Falta de Hidratación',
        emoji: 'water_drop',
        matchScore: 86,
        description: 'Tu piel puede estar produciendo menos confort del que necesita. La tirantez y la opacidad suelen mejorar cuando la rutina deja de perseguir cambios extremos y se vuelve constante.',
        recommendation: 'Prioriza humectantes, reparación nocturna y protector solar. El reto SkinGlow te ayuda a construir una rutina simple para recuperar suavidad y luminosidad.',
        cta: 'Recuperar mi glow',
        ctaUrl: './skinglow-checkout-demo.html?v=checkoutpremium4',
        ebookUrl: './skinglow-ebook-demo.html?v=iconfix1',
        ebookTitle: 'Guía SkinGlow: 7 días para entender tu piel'
      },
      {
        id: 'grasa',
        name: 'Piel Grasa que Necesita Equilibrio',
        emoji: 'balance',
        matchScore: 88,
        description: 'Tu piel no necesita castigo ni resecarse para mejorar. Necesita una estrategia que controle brillo sin romper la barrera, porque ahí suelen aparecer más brotes.',
        recommendation: 'Trabaja con limpieza suave, hidratación ligera y exfoliación responsable. La mini app te permite registrar brotes, brillo y hábitos para encontrar patrones.',
        cta: 'Controlar brillo sin resecar',
        ctaUrl: './skinglow-checkout-demo.html?v=checkoutpremium4',
        ebookUrl: './skinglow-ebook-demo.html?v=iconfix1',
        ebookTitle: 'Guía SkinGlow: 7 días para entender tu piel'
      },
      {
        id: 'manchas',
        name: 'Piel con Manchas y Textura Irregular',
        emoji: 'auto_fix_high',
        matchScore: 84,
        description: 'Tu prioridad está en constancia y protección. Las manchas y la textura no mejoran con un producto milagroso, sino con una rutina que evite irritación y sostenga el protector solar.',
        recommendation: 'Ordena tu rutina AM/PM, registra exposición solar y evita mezclar activos sin guía. SkinGlow te da una ruta visual para no saltarte pasos clave.',
        cta: 'Ver plan para tono uniforme',
        ctaUrl: './skinglow-checkout-demo.html?v=checkoutpremium4',
        ebookUrl: './skinglow-ebook-demo.html?v=iconfix1',
        ebookTitle: 'Guía SkinGlow: 7 días para entender tu piel'
      }
    ]
  };

  const skinGlowMiniApp = {
    id: MINIAPP_ID,
    name: 'SkinGlow AI',
    description: 'Rutina facial inteligente con checklist AM/PM, ruta visual, registro de piel y asistente educativo.',
    niche: 'skincare, belleza, piel sensible, acné, manchas, rutina facial',
    category: 'Belleza',
    subcategory: 'Skincare',
    product: 'SkinGlow AI: Reto Piel Clara en 21 días',
    contentVersion: 'skinglow-premium-v4',
    status: 'active',
    created: now,
    icon: 'spa',
    type: 'checklist',
    types: ['skin-scan', 'reto', 'checklist', 'tracker', 'diario', 'chatbot', 'roadmap', 'faq'],
    disableSignalMap: true,
    disableBodyMapToday: true,
    accessCodes: [],
    mode: 'light',
    accent: '#c84f78',
    accent2: '#6f9d92',
    primaryColor: '#c84f78',
    secondaryColor: '#6f9d92',
    bgColor: '#f8eee7',
    headerGradient: 'linear-gradient(135deg,#c84f78,#70405d)',
    bg: '#f8eee7',
    card: '#fffdf9',
    text: '#21161b',
    muted: '#75616a',
    todayPrompt: 'Observa tu piel sin juzgarla: ¿qué señal aparece hoy y qué necesita tu rutina?',
    initialItems: [
      'AM: limpiar sin tallar y revisar si hay tirantez, brillo o rojez.',
      'AM: hidratar segun sensacion y aplicar protector solar en cantidad suficiente.',
      'Durante el dia: anotar si aparece ardor, brote, brillo intenso o resequedad.',
      'PM: retirar protector/maquillaje con suavidad y repetir hidratacion.',
      'PM: registrar una senal de piel y una posible causa: producto, estres, sueno, comida o clima.'
    ],
    retoDays: 21,
    retoContent: [
      { title: 'Dia 1: foto y punto de partida', icon: 'photo_camera', instructions: 'Toma una foto con luz natural. No busques piel perfecta; solo crea una referencia. Anota tu senal principal: rojez, brillo, brotes, manchas, tirantez o textura.', reflectionPrompt: 'Que senal veo hoy y que me gustaria entender mejor?' },
      { title: 'Dia 2: limpieza sin agresion', icon: 'water_drop', instructions: 'Limpia suave. Si despues de 10 minutos sientes tirantez fuerte, tu limpieza puede estar siendo demasiado agresiva.', reflectionPrompt: 'Como se sintio mi piel despues de limpiar?' },
      { title: 'Dia 3: hidratacion inteligente', icon: 'spa', instructions: 'Elige una textura coherente: ligera si hay brillo, mas reparadora si hay ardor o tirantez. No sumes activos nuevos hoy.', reflectionPrompt: 'Que textura tolero mejor mi piel?' },
      { title: 'Dia 4: protector solar visible', icon: 'wb_sunny', instructions: 'Pon el protector junto a algo que ya uses cada manana. La constancia importa mas que buscar un producto perfecto.', reflectionPrompt: 'Que me ayuda a no olvidarlo?' },
      { title: 'Dia 5: pausa de activos', icon: 'pause_circle', instructions: 'Si hay irritacion, evita exfoliantes, retinoides o acidos por impulso. Dale 48 horas de rutina simple a la piel.', reflectionPrompt: 'Estoy usando algo por ansiedad o por necesidad real?' },
      { title: 'Dia 6: revisar brotes y brillo', icon: 'monitoring', instructions: 'Observa si el brillo aparece por zona, hora o producto. No castigues la piel con limpieza excesiva.', reflectionPrompt: 'Cuando aparece mas brillo o brotes?' },
      { title: 'Dia 7: primera revision', icon: 'insights', instructions: 'Compara notas. El objetivo de la semana no es transformar la piel, es entender que la altera y que la calma.', reflectionPrompt: 'Que patron se repitio esta semana?' },
      { title: 'Dia 8: rutina AM estable', icon: 'routine', instructions: 'Repite la rutina AM sin agregar pasos. La piel necesita estabilidad para mostrar senales claras.', reflectionPrompt: 'Que paso de la manana me cuesta mas sostener?' },
      { title: 'Dia 9: rutina PM estable', icon: 'nightlight', instructions: 'En la noche enfocate en retirar el dia y reparar. Evita probar algo nuevo si hubo rojez o ardor.', reflectionPrompt: 'Que cambio noto al dormir con rutina simple?' },
      { title: 'Dia 10: textura y manchas', icon: 'auto_fix_high', instructions: 'Observa textura y tono sin obsesionarte. Para manchas, el protector solar constante es la base del avance.', reflectionPrompt: 'Estoy protegiendo mi piel o solo buscando activos?' },
      { title: 'Dia 11: revisar barrera', icon: 'health_and_safety', instructions: 'Si hay ardor con casi todo, prioriza barrera: limpieza suave, hidratante y SPF. Menos pasos, mas calma.', reflectionPrompt: 'Que senal me dice que mi barrera necesita pausa?' },
      { title: 'Dia 12: detectar disparadores', icon: 'search', instructions: 'Cruza tus notas: clima, estres, ciclo, comida, producto nuevo, poco sueno. Busca patrones, no culpas.', reflectionPrompt: 'Que factor aparece junto a mi senal principal?' },
      { title: 'Dia 13: limpiar el neceser', icon: 'inventory_2', instructions: 'Elige tus basicos y separa productos que no sabes por que usas. Una rutina premium tambien es una rutina editada.', reflectionPrompt: 'Que producto estoy usando sin una razon clara?' },
      { title: 'Dia 14: segunda revision', icon: 'analytics', instructions: 'Mira avances pequenos: menos ardor, menos tirantez, mejor constancia o mas claridad. Eso tambien cuenta.', reflectionPrompt: 'Que mejoro aunque sea un poco?' },
      { title: 'Dia 15: ajustar una sola cosa', icon: 'tune', instructions: 'Si todo va estable, ajusta solo una variable: cantidad, textura, horario o constancia. No cambies todo junto.', reflectionPrompt: 'Que unica variable quiero probar esta semana?' },
      { title: 'Dia 16: senales de alerta', icon: 'warning', instructions: 'Si hay dolor, infeccion, alergia fuerte, heridas o brotes persistentes, busca apoyo dermatologico. La app no reemplaza atencion medica.', reflectionPrompt: 'Hay algo que deberia consultar con una profesional?' },
      { title: 'Dia 17: constancia sin perfeccion', icon: 'favorite', instructions: 'Si fallaste un dia, vuelve al siguiente. La rutina que vende resultados reales debe permitir vida real.', reflectionPrompt: 'Que puedo hacer facil para volver hoy?' },
      { title: 'Dia 18: preparar recomendacion', icon: 'edit_note', instructions: 'Resume tu patron: senal principal, disparadores probables, pasos que ayudan y pasos que irritan.', reflectionPrompt: 'Como describiria mi piel en una frase clara?' },
      { title: 'Dia 19: elegir siguiente paso', icon: 'alt_route', instructions: 'Decide si necesitas calma, hidratacion, equilibrio de brillo o enfoque en manchas. Esa claridad guia la compra.', reflectionPrompt: 'Que prioridad tiene mas sentido ahora?' },
      { title: 'Dia 20: plan de mantenimiento', icon: 'event_available', instructions: 'Define tu rutina minima para sostener: 2 pasos AM, 2 pasos PM y un registro semanal.', reflectionPrompt: 'Que rutina puedo sostener sin sentirla pesada?' },
      { title: 'Dia 21: cierre y continuidad', icon: 'workspace_premium', instructions: 'Compara la foto inicial, tus notas y tu sensacion. El objetivo es salir con mas claridad y una rutina que puedas repetir.', reflectionPrompt: 'Que aprendi de mi piel en estos 21 dias?' }
    ],
    roadmapSteps: [
      { title: 'Día 1: observar sin cambiar todo', description: 'Registra tirantez, brillo, rojez, brotes o manchas antes de sumar productos.' },
      { title: 'Día 2: limpieza suave', description: 'Evita tallar. La meta es dejar la piel cómoda, no completamente tirante.' },
      { title: 'Día 3: hidratación inteligente', description: 'Elige textura según sensación: ligera si hay brillo, reparadora si hay ardor o tirantez.' },
      { title: 'Día 4: protector solar visible', description: 'Ponlo junto a algo que uses cada mañana para reducir olvidos.' },
      { title: 'Día 5: pausa de activos', description: 'Si hay irritación, no mezcles exfoliantes, retinoides o ácidos por impulso.' },
      { title: 'Día 6-7: revisar patrón', description: 'Compara notas antes de decidir qué ajustar la siguiente semana.' }
    ],
    trackerHabit: 'Rutina AM/PM + protector solar',
    trackerDays: 21,
    journalPrompts: [
      '¿Cómo amaneció mi piel hoy: tirante, tranquila, brillante, sensible o con brotes?',
      '¿Qué producto o hábito pudo influir en la señal de hoy?',
      '¿Qué paso de mi rutina quiero repetir mañana porque sí me ayudó?'
    ],
    chatbotGreeting: 'Hola, soy tu asistente SkinGlow. Cuentame que senal ves hoy en tu piel: rojez, brillo, brotes, manchas, tirantez o textura. Te ayudo a ordenar una rutina simple y responsable. No reemplazo una consulta medica.',
    chatbotSystemPrompt: 'Eres una asistente educativa de skincare para el producto SkinGlow AI: Reto Piel Clara en 21 dias. Hablas en espanol calido, especifico y responsable. No diagnosticas enfermedades ni sustituyes dermatologia. Si hay dolor, heridas, infeccion, alergia fuerte o brotes persistentes recomiendas consultar a dermatologia. Tu marco de respuesta es: 1) validar la senal, 2) preguntar una observacion clave, 3) sugerir un paso seguro de rutina, 4) pedir registro en diario. Pasos seguros: limpieza suave, hidratacion, protector solar, pausa de activos, constancia y registro de senales. Evita prometer curas o resultados garantizados.',
    chatbotSuggestions: [
      'Tengo rojez y ardor, que hago hoy?',
      'Mi piel esta grasa pero tirante',
      'Que registro en el diario esta noche?',
      'Como se si debo pausar activos?'
    ],
    faqItems: [
      { q: 'Esto diagnostica enfermedades de la piel?', a: 'No. Es una herramienta educativa para observar senales y ordenar habitos. Si hay dolor, heridas, infeccion, alergia fuerte o brotes persistentes, consulta con dermatologia.' },
      { q: 'Cuantos productos necesito?', a: 'La demo recomienda empezar con pocos pasos: limpieza suave, hidratacion y protector solar. Luego se agregan activos solo si la piel esta estable.' },
      { q: 'Por que registrar la piel?', a: 'Porque muchas personas cambian productos sin saber que funciono. Registrar ayuda a ver patrones de rojez, brillo, brotes, sueno, estres y constancia.' },
      { q: 'Que pasa despues de los 21 dias?', a: 'La clienta sale con un resumen de senales, pasos que le ayudan y una rutina minima de mantenimiento. Desde ahi se puede vender asesoria, kit de productos o membresia.' },
      { q: 'Como lo venderia una creadora?', a: 'Como reto de entrada: quiz gratuito, resultado personalizado, guia de valor, landing del reto y mini app privada para seguimiento.' }
    ]
  };

  const skinGlowEbook = {
    id: EBOOK_ID,
    title: 'Guía SkinGlow: 7 días para entender tu piel',
    brief: 'Lead magnet educativo para preparar a la clienta antes del reto de 21 días.',
    topic: 'skincare y rutina facial',
    audience: 'mujeres que quieren ordenar su rutina de piel',
    tone: 'cálido, claro y premium',
    docType: 'ebook',
    theme: 'beauty',
    publicUrl: './skinglow-ebook-demo.html?v=iconfix1',
    created_at: now,
    updated_at: now
  };

  const skinGlowLanding = {
    id: LANDING_ID,
    title: 'SkinGlow AI: Reto Piel Clara en 21 dias',
    slug: 'skinglow-reto-piel-clara',
    brief: 'Landing premium para vender el reto SkinGlow despues del quiz y el resultado personalizado.',
    published: false,
    visits: 0,
    settings: {
      demoPreviewUrl: './skinglow-landing-demo.html?v=video1',
      checkoutUrl: './skinglow-checkout-demo.html?v=checkoutpremium4',
      projectId: PROJECT_ID
    },
    messages: [
      { role: 'assistant', content: 'Landing demo conectada al ecosistema SkinGlow.', display: 'Landing demo conectada al ecosistema SkinGlow.' }
    ],
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SkinGlow AI: Reto Piel Clara en 21 dias</title>
  <style>
    body{margin:0;font-family:Inter,system-ui,sans-serif;color:#24151d;background:#fff8f4}
    .hero{min-height:100vh;display:grid;place-items:end start;padding:8vw;background:linear-gradient(90deg,rgba(35,21,28,.82),rgba(35,21,28,.36)),url('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1600&q=80') center/cover;color:white}
    h1{max-width:760px;font-family:Georgia,serif;font-size:clamp(52px,8vw,96px);line-height:.9;font-weight:400;margin:16px 0}
    p{max-width:620px;font-size:20px;line-height:1.55;color:rgba(255,255,255,.82)}
    a{display:inline-flex;margin-top:22px;padding:15px 22px;border-radius:999px;background:linear-gradient(135deg,#c84f78,#70405d);color:white;text-decoration:none;font-weight:900}
  </style>
</head>
<body>
  <section class="hero">
    <div>
      <strong>SKINGLOW AI</strong>
      <h1>Reto Piel Clara en 21 dias</h1>
      <p>Una experiencia guiada con escaneo visual, quiz, resultado, guia y mini app de seguimiento diario.</p>
      <a href="./skinglow-checkout-demo.html?v=checkoutpremium4">Quiero empezar el reto</a>
    </div>
  </section>
</body>
</html>`,
    created_at: now,
    updated_at: now
  };

  const skinGlowProject = {
    id: PROJECT_ID,
    title: 'SkinGlow AI: Reto Piel Clara en 21 dias',
    name: 'SkinGlow AI',
    niche: 'Skincare premium',
    status: 'ready',
    stage: 'demo',
    summary: 'Proyecto completo para mostrar como Luminous conecta investigacion, oferta, captacion, diagnostico, entrega, publicidad, leads y venta.',
    creatorWorkspaceUrl: './skinglow-creator-workspace.html?v=launchpanel1',
    workspaceUrl: './skinglow-creator-workspace.html?v=launchpanel1',
    clientPreviewUrl: './skinglow-client-demo.html?v=gridfix2',
    primaryCtaUrl: './skinglow-creator-workspace.html?v=launchpanel1',
    accent: '#c84f78',
    accent2: '#6f9d92',
    assets: [
      { type: 'market', id: 'skinglow-market', label: 'Spy Lab mercado', status: 'ready', previewUrl: './market-research-demo.html?v=brief1' },
      { type: 'offer', id: 'skinglow-offer', label: 'Offer Lab', status: 'ready', previewUrl: './skinglow-offer-lab.html?v=offerlab1' },
      { type: 'landing', id: LANDING_ID, label: 'Landing de venta', status: 'ready', previewUrl: './skinglow-landing-demo.html?v=video1', editUrl: './landing-builder.html?id=skinglow-landing' },
      { type: 'scan', id: 'skinglow-scan', label: 'Escaneo visual', status: 'ready', previewUrl: './skinglow-scan-demo.html?v=scan1' },
      { type: 'quiz', id: QUIZ_ID, label: 'Quiz diagnostico', status: 'ready', previewUrl: './quiz.html?quiz=skinglow-skin-quiz', editUrl: './generador-ia.html?id=skinglow-skin-quiz' },
      { type: 'result', id: 'skinglow-result', label: 'Resultado personalizado', status: 'ready', previewUrl: './resultado-quiz.html?quiz=skinglow-skin-quiz&v=resultpremium1' },
      { type: 'ebook', id: EBOOK_ID, label: 'Ebook / guia', status: 'ready', previewUrl: './skinglow-ebook-demo.html?v=iconfix1', editUrl: './ebook-builder.html?id=skinglow-ebook' },
      { type: 'checkout', id: 'skinglow-checkout', label: 'Checkout demo', status: 'ready', previewUrl: './skinglow-checkout-demo.html?v=checkoutpremium4' },
      { type: 'access', id: 'skinglow-thankyou', label: 'Acceso posterior', status: 'ready', previewUrl: './skinglow-thankyou-demo.html?v=accesspremium1' },
      { type: 'miniapp', id: MINIAPP_ID, label: 'Mini app privada', status: 'ready', previewUrl: './mini-app-player.html?id=skinglow-miniapp&open=1', editUrl: './dashboard.html?tab=miniapps' },
      { type: 'ads', id: 'skinglow-ads', label: 'Ads Lab', status: 'ready', previewUrl: './skinglow-ads-lab.html?v=adslab1' },
      { type: 'leads', id: 'skinglow-leads', label: 'Lead Desk', status: 'ready', previewUrl: './skinglow-leads-demo.html?v=leaddesk1' }
    ],
    created_at: now,
    updated_at: now
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function buildTemplateQuiz() {
    const quiz = clone(skinGlowQuiz);
    quiz.id = TEMPLATE_ID;
    quiz.status = 'draft';
    return quiz;
  }

  function seedSkinGlowDemo(options = {}) {
    const setAnswers = options.setAnswers !== false;
    const quiz = clone(skinGlowQuiz);
    const miniApp = clone(skinGlowMiniApp);
    const ebook = clone(skinGlowEbook);
    const landing = clone(skinGlowLanding);
    const project = clone(skinGlowProject);
    if (typeof Quizzes !== 'undefined') Quizzes.save(quiz);
    if (typeof MiniApps !== 'undefined') MiniApps.save(miniApp);
    if (typeof Ebooks !== 'undefined') Ebooks.save(ebook);
    if (typeof Landings !== 'undefined') Landings.save(landing);
    if (typeof Projects !== 'undefined') {
      Projects.save(project);
    } else {
      try {
        const all = JSON.parse(localStorage.getItem('ls_projects') || '[]');
        const idx = all.findIndex(item => item && item.id === PROJECT_ID);
        project.updated_at = new Date().toISOString();
        if (idx >= 0) all[idx] = { ...all[idx], ...project };
        else all.unshift(project);
        localStorage.setItem('ls_projects', JSON.stringify(all));
      } catch {}
    }
    if (setAnswers && typeof Session !== 'undefined') {
      Session.setCurrentQuiz(QUIZ_ID);
      Session.setAnswers([
        { questionId: 'q1', optionIndex: 2 },
        { questionId: 'q2', optionIndex: 0 },
        { questionId: 'q3', optionIndex: 0 },
        { questionId: 'q4', optionIndex: 1 },
        { questionId: 'q5', optionIndex: 0 },
        { questionId: 'q6', optionIndex: 0 }
      ]);
    }
    return { quiz, miniApp, ebook, landing, project };
  }

  function getSkinGlowQuiz(id) {
    return id === QUIZ_ID || id === TEMPLATE_ID ? clone(id === TEMPLATE_ID ? buildTemplateQuiz() : skinGlowQuiz) : null;
  }

  function getSkinGlowMiniApp(id) {
    return id === MINIAPP_ID ? clone(skinGlowMiniApp) : null;
  }

  function patchBuiltinTemplates() {
    if (typeof window.getBuiltinTemplates === 'function' && !window.__skinGlowQuizTemplatePatched) {
      const original = window.getBuiltinTemplates;
      window.getBuiltinTemplates = function () {
        const list = original.apply(this, arguments) || [];
        if (list.some(item => item && item.id === TEMPLATE_ID)) return list;
        return [buildTemplateQuiz(), ...list];
      };
      window.__skinGlowQuizTemplatePatched = true;
    }
    if (typeof window.getBuiltinMiniAppTemplates === 'function' && !window.__skinGlowMiniAppTemplatePatched) {
      const originalMini = window.getBuiltinMiniAppTemplates;
      window.getBuiltinMiniAppTemplates = function () {
        const list = originalMini.apply(this, arguments) || [];
        if (list.some(item => item && item.id === MINIAPP_ID)) return list;
        return [clone(skinGlowMiniApp), ...list];
      };
      window.__skinGlowMiniAppTemplatePatched = true;
    }
  }

  window.SKINGLOW_QUIZ_ID = QUIZ_ID;
  window.SKINGLOW_MINIAPP_ID = MINIAPP_ID;
  window.SKINGLOW_LANDING_ID = LANDING_ID;
  window.SKINGLOW_PROJECT_ID = PROJECT_ID;
  window.SKINGLOW_TEMPLATE_ID = TEMPLATE_ID;
  window.SKINGLOW_QUIZ = clone(skinGlowQuiz);
  window.SKINGLOW_MINIAPP = clone(skinGlowMiniApp);
  window.SKINGLOW_EBOOK = clone(skinGlowEbook);
  window.SKINGLOW_LANDING = clone(skinGlowLanding);
  window.SKINGLOW_PROJECT = clone(skinGlowProject);
  window.seedSkinGlowDemo = seedSkinGlowDemo;
  window.getSkinGlowQuiz = getSkinGlowQuiz;
  window.getSkinGlowMiniApp = getSkinGlowMiniApp;
  window.patchSkinGlowTemplates = patchBuiltinTemplates;

  patchBuiltinTemplates();
  document.addEventListener('DOMContentLoaded', patchBuiltinTemplates);
})();
