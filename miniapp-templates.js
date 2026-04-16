// Luminous Studio — Mini-App Templates Library
// 58 plantillas organizadas por categoría con contenido real en español

function getBuiltinMiniAppTemplates() {
  return [

// ═══════════════ BIENESTAR Y SALUD MENTAL ═══════════════

{
  id:'tpl-ansiedad-21', name:'Calmar la Ansiedad en 21 Días',
  types:['reto','meditacion','afirmaciones','diario','checklist'],
  niche:'ansiedad, bienestar mental', category:'Bienestar', subcategory:'Ansiedad',
  description:'Técnicas diarias de respiración, journaling y meditación para reducir la ansiedad paso a paso.',
  icon:'🧘', primaryColor:'#6366f1', secondaryColor:'#818cf8', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#6366f1,#818cf8)',
  retoContent:[
    {title:'Día 1: Respiración 4-7-8', instructions:'Inhala 4 segundos, sostén 7, exhala 8. Repite 4 veces. Esta técnica activa tu sistema nervioso parasimpático y reduce el cortisol.', reflectionPrompt:'¿Cómo se siente tu cuerpo después de respirar conscientemente?'},
    {title:'Día 2: Body Scan', instructions:'Acuéstate y recorre mentalmente cada parte de tu cuerpo desde los pies hasta la cabeza. Nota tensiones sin juzgar. Dedica 10 minutos.', reflectionPrompt:'¿En qué zona de tu cuerpo guardas más tensión?'},
    {title:'Día 3: Journaling de preocupaciones', instructions:'Escribe todas tus preocupaciones en papel durante 10 minutos. No las analices, solo sácalas. Luego cierra el cuaderno.', reflectionPrompt:'¿Qué preocupación aparece con más frecuencia?'},
    {title:'Día 4: Caminata consciente', instructions:'Sal a caminar 15 minutos prestando atención solo a tus sentidos: qué ves, oyes, hueles. Sin teléfono.', reflectionPrompt:'¿Qué descubriste al caminar sin distracciones?'},
    {title:'Día 5: Técnica 5-4-3-2-1', instructions:'Nombra 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles, 1 que saboreas. Úsala cuando sientas ansiedad aguda.', reflectionPrompt:'¿En qué momento del día la ansiedad fue más fuerte hoy?'},
    {title:'Día 6: Meditación guiada', instructions:'Usa la meditación incluida en esta app. Siéntate cómodo, cierra los ojos y sigue la guía durante 10 minutos.', reflectionPrompt:'¿Qué pensamientos aparecieron durante la meditación?'},
    {title:'Día 7: Día de integración', instructions:'Elige la técnica que mejor te funcionó esta semana y practícala dos veces hoy: al despertar y antes de dormir.', reflectionPrompt:'¿Cuál técnica sientes que te ayuda más? ¿Por qué?'}
  ],
  meditationScript:'Cierra los ojos suavemente. Toma una respiración profunda... inhala por la nariz... exhala por la boca. Siente cómo tu cuerpo se apoya en la superficie donde estás. Con cada exhalación, suelta un poco más de tensión. Ahora lleva tu atención a tus pies... nota cualquier sensación sin juzgar. Sube lentamente por tus piernas... tu abdomen... tu pecho. Siente cómo tu respiración mueve tu pecho suavemente. Llega a tus hombros... suéltalos. Tu cuello... tu rostro. Suaviza tu frente, tu mandíbula. Ahora simplemente observa tu respiración natural. No la cambies. Solo obsérvala. Estás seguro/a aquí. Todo está bien en este momento. Quédate aquí unos minutos más... y cuando estés listo/a, mueve suavemente los dedos y abre los ojos.',
  affirmations:['Yo elijo la calma en este momento','Mi ansiedad no me define, es solo una emoción pasajera','Merezco paz interior y la estoy cultivando','Soy capaz de manejar lo que venga','Mi respiración es mi ancla al presente','Cada día me siento más tranquilo/a','Confío en mi capacidad de superar esto','Mi mente se calma cuando yo lo decido','Suelto lo que no puedo controlar','Estoy aprendiendo a ser amable conmigo mismo/a'],
  journalPrompts:['¿Qué situación me generó más ansiedad hoy y cómo reaccioné?','¿Qué pensamiento recurrente alimenta mi ansiedad?','¿Cuándo fue la última vez que me sentí verdaderamente en calma?','¿Qué necesito soltar para sentirme más ligero/a?','¿Qué haría diferente si no tuviera miedo?'],
  initialItems:['Hacer 3 respiraciones profundas al despertar','Limitar redes sociales a 30 minutos','Caminar al menos 15 minutos','Escribir en mi diario antes de dormir','Practicar la técnica 5-4-3-2-1 si siento ansiedad','Tomar suficiente agua (8 vasos)','Evitar cafeína después de las 2pm','Hacer la meditación guiada de la app']
},

{
  id:'tpl-burnout-30', name:'Reset Mental: Superar el Burnout',
  types:['reto','checklist','diario','afirmaciones','meditacion'],
  niche:'burnout, estrés laboral', category:'Bienestar', subcategory:'Burnout',
  description:'Recupera tu energía y establece límites saludables con este plan de 30 días contra el agotamiento.',
  icon:'🔋', primaryColor:'#059669', secondaryColor:'#34d399', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#059669,#34d399)',
  retoContent:[
    {title:'Día 1: Reconoce tu agotamiento', instructions:'Hoy solo observa. Anota en tu diario los síntomas de burnout que reconoces: fatiga constante, cinismo, baja productividad, dolores físicos.', reflectionPrompt:'¿Cuándo empezaste a sentirte agotado/a?'},
    {title:'Día 2: Define un límite', instructions:'Elige UNA cosa que dejarás de hacer esta semana: revisar emails después de las 7pm, decir sí a todo, trabajar fines de semana. Solo una.', reflectionPrompt:'¿Qué límite elegiste y por qué te cuesta ponerlo?'},
    {title:'Día 3: Micro-descansos', instructions:'Programa 3 pausas de 5 minutos durante tu jornada. Levántate, estira, mira por la ventana. Sin teléfono.', reflectionPrompt:'¿Cómo te sentiste después de las pausas?'},
    {title:'Día 4: Di que no', instructions:'Hoy practica decir no a una solicitud que no es urgente ni importante. Usa la fórmula: "Gracias por pensar en mí, pero no puedo en este momento."', reflectionPrompt:'¿Qué sentiste al decir no?'},
    {title:'Día 5: Reconecta con algo que disfrutas', instructions:'Dedica 30 minutos a una actividad que te gustaba antes del burnout: leer, cocinar, dibujar, caminar. Sin productividad, solo disfrute.', reflectionPrompt:'¿Qué actividad elegiste y cómo te hizo sentir?'},
    {title:'Día 6: Desconexión digital', instructions:'Apaga las notificaciones de trabajo desde las 6pm. El mundo no se acaba. Tu descanso es tan importante como tu trabajo.', reflectionPrompt:'¿Qué descubriste al desconectarte?'},
    {title:'Día 7: Evalúa tu semana', instructions:'Revisa los límites que pusiste esta semana. ¿Cuáles mantuviste? ¿Cuáles te costaron? Ajusta para la próxima semana.', reflectionPrompt:'¿Qué cambio pequeño tuvo el mayor impacto?'}
  ],
  meditationScript:'Siéntate cómodo y cierra los ojos. Imagina que cada preocupación del trabajo es una hoja flotando en un río. No la atrapes, solo mírala pasar. Inhala profundamente... y al exhalar, suelta la tensión de tus hombros. Repite mentalmente: "He hecho suficiente hoy. Merezco descansar." Siente cómo tu cuerpo se relaja con cada respiración. No tienes que resolver nada ahora. Este momento es solo para ti. Quédate aquí, respirando, durante unos minutos más.',
  affirmations:['Mi valor no depende de mi productividad','Merezco descansar sin culpa','Poner límites es un acto de amor propio','Soy más que mi trabajo','Mi salud mental es mi prioridad','Puedo decir no sin dar explicaciones','Descansar me hace más efectivo/a','No tengo que hacerlo todo hoy','Mi energía es un recurso valioso que protejo','Elijo la calma sobre la urgencia'],
  journalPrompts:['¿Qué creencia sobre el trabajo me está agotando?','¿Cuándo fue la última vez que descansé sin sentir culpa?','¿Qué pasaría si hiciera menos pero mejor?','¿Quién soy cuando no estoy trabajando?','¿Qué necesito para sentirme renovado/a?'],
  initialItems:['Definir hora de inicio y fin de trabajo','Tomar al menos 3 pausas durante el día','No revisar email/mensajes fuera de horario','Hacer una actividad placentera no productiva','Dormir mínimo 7 horas','Delegar o eliminar una tarea innecesaria','Salir a caminar sin teléfono','Decir no a algo que no es prioritario']
},

{
  id:'tpl-dormir-21', name:'Mejor Sueño en 21 Días',
  types:['reto','checklist','tracker','meditacion'],
  niche:'sueño, insomnio, descanso', category:'Bienestar', subcategory:'Sueño',
  description:'Transforma tu higiene del sueño con hábitos nocturnos que te ayudarán a dormir profundamente.',
  icon:'🌙', primaryColor:'#4338ca', secondaryColor:'#6366f1', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#4338ca,#6366f1)',
  retoContent:[
    {title:'Día 1: Establece tu horario', instructions:'Elige una hora fija para acostarte y despertar. Mantén máximo 30 min de variación incluso fines de semana. Tu reloj biológico necesita consistencia.'},
    {title:'Día 2: Crea tu ritual nocturno', instructions:'Diseña una rutina de 30 minutos antes de dormir: bajar luces, té sin cafeína, lectura o estiramientos suaves. Nada de pantallas.'},
    {title:'Día 3: Optimiza tu cuarto', instructions:'Oscurece tu habitación completamente. Temperatura ideal: 18-20°C. Usa tapones si hay ruido. Tu cuarto es solo para dormir.'},
    {title:'Día 4: Corta la cafeína', instructions:'No consumas cafeína después de las 2pm. Esto incluye café, té negro, chocolate y refrescos. Sustituye por infusiones de manzanilla o valeriana.'},
    {title:'Día 5: Pantallas fuera', instructions:'Deja el teléfono fuera de la habitación (usa un despertador real). La luz azul y las notificaciones son enemigos del sueño profundo.'},
    {title:'Día 6: Meditación para dormir', instructions:'Practica la meditación de relajación incluida en esta app acostado en tu cama. Deja que te lleve al sueño naturalmente.'},
    {title:'Día 7: Evalúa y ajusta', instructions:'¿Cómo dormiste esta semana? Anota qué funcionó mejor. Ajusta tu ritual para las próximas semanas.'}
  ],
  trackerHabit:'Dormir 7+ horas sin interrupciones',
  meditationScript:'Acuéstate boca arriba con los brazos a los lados. Cierra los ojos. Toma tres respiraciones profundas y lentas. Con cada exhalación, siente cómo tu cuerpo se hunde más en el colchón. Relaja los dedos de los pies... las piernas... el abdomen. Suelta toda tensión del pecho. Deja caer los hombros. Suaviza tu rostro... la frente... los ojos... la mandíbula. Ahora imagina una oscuridad cálida y suave que te envuelve como una manta. Estás seguro/a. Estás en calma. Con cada respiración te acercas más al sueño... más y más profundo...',
  initialItems:['Acostarme a la misma hora cada noche','No usar pantallas 1 hora antes de dormir','Oscurecer completamente la habitación','No tomar cafeína después de las 2pm','Hacer mi ritual nocturno de 30 minutos','Dejar el teléfono fuera de la habitación','Escribir preocupaciones en papel antes de acostarme','Hacer 3 respiraciones profundas ya en la cama','No cenar pesado ni muy tarde','Mantener la habitación fresca (18-20°C)']
},

{
  id:'tpl-autoestima-30', name:'Autoestima Inquebrantable',
  types:['reto','afirmaciones','diario','flashcards'],
  niche:'autoestima, amor propio', category:'Bienestar', subcategory:'Autoestima',
  description:'Transforma tu diálogo interno y construye una autoestima sólida con ejercicios diarios.',
  icon:'💎', primaryColor:'#e11d48', secondaryColor:'#fb7185', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#e11d48,#fb7185)',
  retoContent:[
    {title:'Día 1: Tu diálogo interno', instructions:'Hoy observa cómo te hablas a ti mismo/a. Cada vez que notes un pensamiento negativo, escríbelo. No lo juzgues, solo regístralo.', reflectionPrompt:'¿Qué frases negativas te dices con más frecuencia?'},
    {title:'Día 2: Carta a tu yo de 10 años', instructions:'Escríbele una carta al niño/a que fuiste. Dile todo lo que necesitaba escuchar. Sé compasivo/a y amoroso/a.', reflectionPrompt:'¿Qué sentiste al escribir esa carta?'},
    {title:'Día 3: Lista de logros', instructions:'Escribe 20 cosas que has logrado en tu vida, desde las más pequeñas hasta las más grandes. No minimices ninguna.', reflectionPrompt:'¿Cuál logro te sorprendió recordar?'},
    {title:'Día 4: Espejo', instructions:'Mírate al espejo 2 minutos. Di en voz alta 3 cosas que te gustan de ti (físicas o no). Puede ser incómodo, hazlo igual.', reflectionPrompt:'¿Qué sentiste al mirarte y hablarte positivamente?'},
    {title:'Día 5: Límites con la comparación', instructions:'Hoy no uses redes sociales. Nota cuántas veces quieres revisarlas y qué buscas ahí. La comparación roba tu paz.', reflectionPrompt:'¿Con quién te comparas más y por qué?'},
    {title:'Día 6: Afirmaciones en acción', instructions:'Elige 3 afirmaciones de la lista y repítelas en voz alta al despertar y antes de dormir. Siéntelas, no solo las digas.', reflectionPrompt:'¿Cuál afirmación te costó más creer? ¿Por qué?'},
    {title:'Día 7: Celebra tu progreso', instructions:'Revisa tu semana. ¿Cómo cambió tu diálogo interno? Escríbete una nota de agradecimiento a ti mismo/a por hacer este trabajo.', reflectionPrompt:'¿Qué descubriste sobre ti esta semana?'}
  ],
  affirmations:['Yo soy suficiente tal como soy','Merezco amor, respeto y cosas buenas','Mi valor no depende de la opinión de otros','Soy capaz de lograr lo que me propongo','Me acepto completamente, incluyendo mis imperfecciones','Merezco ocupar espacio en este mundo','Mi voz importa y merece ser escuchada','Soy digno/a de amor incondicional','Cada día me conozco y me quiero más','Elijo creer en mí, incluso cuando es difícil','Mis errores no me definen, me enseñan','Soy la persona más importante en mi vida'],
  journalPrompts:['¿Cuándo empecé a dudar de mi valor y qué lo provocó?','¿Qué haría diferente si realmente creyera que soy suficiente?','¿De quién necesito aprobación y por qué?','¿Qué cualidad mía admiro pero nunca reconozco en voz alta?','¿Qué le diría a mi mejor amigo/a si se hablara como yo me hablo?','¿Qué necesito perdonarme?','¿Cómo sería mi vida si mi autoestima fuera inquebrantable?'],
  cards:[
    {front:'No soy suficiente', back:'Soy suficiente TAL COMO SOY. Mi valor es inherente, no depende de lo que hago o tengo.'},
    {front:'Nadie me quiere de verdad', back:'Soy digno/a de amor. Las personas que me importan están ahí. El amor empieza por mí.'},
    {front:'Todo me sale mal', back:'He superado muchas cosas difíciles. Tengo logros reales. Los errores son aprendizaje.'},
    {front:'No merezco cosas buenas', back:'Merezco abundancia, amor y paz. No necesito ganarme el derecho a ser feliz.'},
    {front:'Soy un fraude', back:'El síndrome del impostor es normal. Mis logros son REALES. Estoy donde estoy por mérito.'},
    {front:'Debería ser como los demás', back:'Mi camino es único. Compararme roba mi energía. Mi ritmo es válido.'},
    {front:'No puedo cambiar', back:'El cambio es gradual. Ya estoy cambiando al hacer este ejercicio. Cada paso cuenta.'},
    {front:'Soy demasiado sensible', back:'Mi sensibilidad es una fortaleza. Me permite conectar profundamente con otros.'},
    {front:'No soy atractivo/a', back:'La belleza va mucho más allá de lo físico. Mi energía, mi risa y mi presencia son atractivas.'},
    {front:'Siempre decepciono a todos', back:'No soy responsable de las expectativas de otros. Hago lo mejor que puedo y eso es suficiente.'}
  ]
},

{
  id:'tpl-mindfulness-21', name:'Mindfulness para Principiantes',
  types:['reto','meditacion','tracker','diario'],
  niche:'mindfulness, meditación, atención plena', category:'Bienestar', subcategory:'Mindfulness',
  description:'Aprende a vivir en el presente con ejercicios simples de atención plena para cada día.',
  icon:'🍃', primaryColor:'#0d9488', secondaryColor:'#2dd4bf', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#0d9488,#2dd4bf)',
  retoContent:[
    {title:'Día 1: Respiración consciente', instructions:'Siéntate 5 minutos y cuenta tus respiraciones del 1 al 10. Cuando pierdas la cuenta (vas a perderla), vuelve a empezar sin juzgarte.'},
    {title:'Día 2: Comer con atención', instructions:'Elige una comida y cómela sin teléfono, sin TV. Nota los colores, olores, texturas y sabores. Mastica lento.'},
    {title:'Día 3: Escaneo de emociones', instructions:'3 veces hoy, para y pregúntate: ¿Qué estoy sintiendo AHORA? Ponle nombre a la emoción sin intentar cambiarla.'},
    {title:'Día 4: Caminar presente', instructions:'Camina 10 minutos prestando atención a cada paso: cómo se siente el pie al tocar el suelo, el movimiento de tus piernas.'},
    {title:'Día 5: Escucha activa', instructions:'En tu próxima conversación, escucha sin preparar tu respuesta. Solo escucha. Nota la diferencia.'},
    {title:'Día 6: Meditación sentada', instructions:'Medita 10 minutos con la guía incluida. Si tu mente se va, no pasa nada — regrésala gentilmente a la respiración.'},
    {title:'Día 7: Gratitud presente', instructions:'Antes de dormir, nombra 3 momentos del día en que estuviste realmente presente. ¿Cómo se sintieron?'}
  ],
  trackerHabit:'Meditar 10 minutos hoy',
  meditationScript:'Siéntate con la espalda recta pero relajada. Cierra los ojos. Lleva toda tu atención a la respiración. No la cambies, solo obsérvala. Nota el aire entrando por tu nariz... fresco. Nota el aire saliendo... tibio. Tu mente va a pensar — eso es normal. Cuando notes que estás pensando, simplemente regresa a la respiración. Sin juicio. Sin frustración. Solo regresa. Cada vez que regresas, estás entrenando tu atención. Eso es meditar. No se trata de no pensar, sino de notar cuándo piensas y volver al presente. Quédate aquí unos minutos más, respirando.',
  journalPrompts:['¿En qué momento del día estuve más presente hoy?','¿Qué me saca del presente con más frecuencia?','¿Cómo se siente mi cuerpo cuando estoy en modo automático vs. cuando estoy presente?','¿Qué descubrí al comer/caminar con atención plena?','¿Cómo cambió mi experiencia al simplemente observar mis pensamientos?']
},

  ];
}
