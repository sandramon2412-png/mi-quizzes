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

{
  id:'tpl-ruptura', name:'Superar una Ruptura Emocional',
  types:['diario','afirmaciones','checklist','roadmap'],
  niche:'ruptura, duelo emocional, amor propio', category:'Bienestar', subcategory:'Sanación',
  description:'Un camino guiado para procesar el duelo, reconstruirte y volver a ti misma/o con amor.',
  icon:'💔', primaryColor:'#db2777', secondaryColor:'#f472b6', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#db2777,#f472b6)',
  affirmations:['Merezco un amor que me sume, no que me reste','Esta pérdida está creando espacio para algo mejor','Mi valor no depende de nadie más','Elijo sanar a mi ritmo','Soltar es un acto de amor propio','Estoy reaprendiendo a habitarme','El amor empieza dentro de mí','Soy suficiente tal como soy','Permito que las emociones pasen por mí','Cada día me siento más completo/a'],
  journalPrompts:['¿Qué extraño exactamente: a esta persona o lo que representaba?','¿Qué aprendí de mí en esta relación?','¿Qué patrones quiero dejar de repetir?','¿Qué necesito perdonarme?','¿Cómo sería mi vida si me pusiera primero?','¿Qué me da miedo de estar solo/a y por qué?','Carta que nunca enviaré: escribe todo lo que necesitas decir.'],
  initialItems:['Dejar de revisar sus redes sociales','Escribir cómo me siento hoy','Hacer una actividad nueva o que disfrutaba','Salir a caminar o hacer ejercicio','Hablar con alguien de confianza','No enviar ese mensaje','Cuidar mi alimentación y sueño','Guardar fotos/recuerdos en una carpeta cerrada'],
  roadmapSteps:[
    {title:'Fase 1: Aceptación (días 1-14)', description:'Permítete sentir. No reprimas el llanto ni la rabia. Corta el contacto total con la persona.'},
    {title:'Fase 2: Desintoxicación (días 15-30)', description:'Elimina recuerdos físicos, bloquea redes, evita lugares que duelen. Enfócate en rutinas de cuidado.'},
    {title:'Fase 3: Reconexión contigo (días 31-60)', description:'Retoma hobbies, reconecta con amigos, descubre qué te gusta hacer sola/o.'},
    {title:'Fase 4: Reflexión (días 61-75)', description:'Con distancia, analiza la relación con honestidad. ¿Qué fue real y qué idealizaste?'},
    {title:'Fase 5: Crecimiento (días 76-90)', description:'Identifica qué quieres diferente en tu próxima relación. Trabaja en tus patrones.'},
    {title:'Fase 6: Apertura (día 90+)', description:'Estás lista/o para abrirte a lo nuevo cuando sientas deseo genuino, no miedo a estar solo/a.'}
  ]
},

{
  id:'tpl-tdah', name:'Gestionar el TDAH',
  types:['checklist','planificador','flashcards','faq'],
  niche:'tdah, déficit de atención, productividad neurodivergente', category:'Bienestar', subcategory:'TDAH',
  description:'Estrategias prácticas para personas con TDAH: organización, foco y autocompasión.',
  icon:'🧠', primaryColor:'#7c3aed', secondaryColor:'#a78bfa', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#7c3aed,#a78bfa)',
  initialItems:['Preparar la ropa la noche anterior','Usar la regla de los 2 minutos (si toma menos, hazlo ya)','Timer Pomodoro para tareas largas','Escribir TODO en un solo lugar (no confiar en memoria)','Dejar llaves/cartera siempre en el mismo lugar','Body doubling: trabajar junto a alguien (real o por video)','Tomar medicación/suplementos a la misma hora','Moverme al menos 20 minutos','Descansar sin culpa cuando la batería se acabó'],
  initialTasks:['Revisar calendario y elegir 3 prioridades','Dividir tareas grandes en pasos de 15 min','Preparar agua, snacks y todo lo necesario ANTES de empezar','Usar timer visual (Time Timer) para no perder noción','Bloquear redes sociales en horas de foco','Cerrar el día anotando lo logrado (no lo faltante)'],
  cards:[
    {front:'¿Qué es el body doubling?', back:'Trabajar en presencia de otra persona (real o por videollamada) para aumentar el foco sin interacción directa.'},
    {front:'Regla de los 2 minutos', back:'Si una tarea toma menos de 2 minutos, hazla inmediatamente. Evita la acumulación de micro-tareas.'},
    {front:'Parálisis por análisis', back:'Incapacidad de empezar por exceso de opciones. Solución: elige la primera opción "suficientemente buena" y empieza.'},
    {front:'Hiperfoco', back:'Concentración extrema en una tarea de interés. Úsalo a tu favor pero programa alarmas para no olvidar comer o dormir.'},
    {front:'Disregulación emocional', back:'Reacciones emocionales intensas y rápidas. Técnica: pausa 5 segundos + respirar antes de responder.'},
    {front:'Ceguera al tiempo', back:'Dificultad para percibir el paso del tiempo. Usa timers visuales y alarmas múltiples.'},
    {front:'Decision fatigue', back:'Agotamiento por tomar muchas decisiones pequeñas. Automatiza (misma ropa, mismo desayuno) las que no importan.'},
    {front:'Disfunción ejecutiva', back:'Saber qué hacer pero no poder empezar. No es pereza. Técnica: reducir el primer paso a algo ridículamente pequeño.'}
  ],
  faqItems:[
    {q:'¿El TDAH en adultos existe?', a:'Sí. No es una "moda". Muchos adultos lo tienen sin diagnosticar, especialmente mujeres que lo compensan con perfeccionismo.'},
    {q:'¿La medicación es adictiva?', a:'Los estimulantes a dosis terapéuticas no causan adicción en personas con TDAH. De hecho, reducen el riesgo de otras adicciones.'},
    {q:'¿Puedo gestionarlo sin medicación?', a:'Sí, muchas personas lo logran con rutinas, ejercicio, terapia cognitivo-conductual y estructura. Otros necesitan medicación. No hay una sola respuesta.'},
    {q:'¿Por qué procrastino si me importa?', a:'El TDAH es un problema de regulación, no de voluntad. Tu cerebro no libera la dopamina necesaria para iniciar tareas poco estimulantes.'},
    {q:'¿Cómo lo explico a mi pareja/familia?', a:'Comparte recursos confiables. Pide paciencia, no condescendencia. Propón estrategias concretas (recordatorios, body doubling).'},
    {q:'¿El TDAH desaparece con la edad?', a:'No desaparece pero puede transformarse. Los síntomas externos (hiperactividad) suelen disminuir; los internos (desorganización, procrastinación) persisten.'}
  ]
},

{
  id:'tpl-gratitud-30', name:'Diario de Gratitud 30 Días',
  types:['diario','afirmaciones','tracker','reto'],
  niche:'gratitud, mindset positivo, bienestar', category:'Bienestar', subcategory:'Gratitud',
  description:'Cultiva el hábito de notar lo bueno con prompts diarios de gratitud durante 30 días.',
  icon:'🌻', primaryColor:'#f59e0b', secondaryColor:'#fbbf24', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#f59e0b,#fbbf24)',
  trackerHabit:'Escribir 3 cosas por las que estoy agradecido/a hoy',
  affirmations:['Mi vida está llena de razones para agradecer','La gratitud atrae más bendiciones','Aprecio las pequeñas cosas','Soy afortunado/a de estar donde estoy','Elijo enfocarme en lo que tengo','Cada día descubro nuevas razones para agradecer','Mi corazón está abierto al bien','Agradezco mi cuerpo, mi mente y mi camino','Reconozco la belleza en lo cotidiano','La gratitud me conecta con el presente'],
  journalPrompts:['Escribe 3 cosas simples por las que estás agradecido/a hoy.','¿Qué persona hizo tu día mejor hoy y por qué?','Recuerda un reto del pasado que ahora agradeces haber vivido.','¿Qué parte de tu cuerpo agradeces hoy y por qué?','¿Qué comodidad das por sentada y en realidad es un privilegio?','Escribe una carta de gratitud (sin enviar) a alguien que te marcó.','¿Qué habilidad tuya agradeces tener?','Describe tu lugar favorito y por qué agradeces poder estar ahí.'],
  retoContent:[
    {title:'Día 1: Gratitud básica', instructions:'Escribe 3 cosas por las que estás agradecido/a hoy. Sé específico: no "mi familia" sino "que mi hermana me llamó".', reflectionPrompt:'¿Cuál te costó más reconocer?'},
    {title:'Día 2: Tu cuerpo', instructions:'Escribe 5 cosas que tu cuerpo hace por ti que normalmente no aprecias: respirar, digerir, ver colores...', reflectionPrompt:'¿Qué parte de tu cuerpo criticas y podrías empezar a agradecer?'},
    {title:'Día 3: Carta de gratitud', instructions:'Escribe una carta detallada a alguien que te haya ayudado (no tienes que enviarla). Sé específico sobre cómo te impactó.', reflectionPrompt:'¿Qué sentiste al escribirla?'},
    {title:'Día 4: Agradecer un reto', instructions:'Piensa en una dificultad pasada que ahora agradeces. ¿Qué aprendiste? ¿Quién te hizo ser?', reflectionPrompt:'¿Qué reto actual podrías empezar a ver diferente?'},
    {title:'Día 5: Gratitud en lo cotidiano', instructions:'Durante el día, pausa 5 veces y agradece mentalmente algo del momento: el café caliente, la luz del sol, un mensaje.', reflectionPrompt:'¿Cómo cambió tu ánimo al hacer pausas de gratitud?'},
    {title:'Día 6: Gratitud hacia ti', instructions:'Escribe 5 cosas que agradeces de ti: una cualidad, una decisión, un logro, una fortaleza, una forma de tratar a otros.', reflectionPrompt:'¿Cuál te costó más? ¿Por qué?'},
    {title:'Día 7: Gratitud en voz alta', instructions:'Dile a 3 personas hoy algo específico que agradeces de ellas. En persona, llamada o mensaje.', reflectionPrompt:'¿Cómo reaccionaron? ¿Cómo te sentiste tú?'}
  ]
},

// ═══════════════ FITNESS ═══════════════

{
  id:'tpl-fitness-30', name:'Transformación Fitness 30 días',
  types:['reto','tracker','checklist','faq'],
  niche:'fitness, ejercicio, transformación corporal', category:'Fitness', subcategory:'General',
  description:'Plan progresivo de 30 días con entrenamiento en casa, alimentación y hábitos clave.',
  icon:'💪', primaryColor:'#dc2626', secondaryColor:'#f87171', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#dc2626,#f87171)',
  trackerHabit:'Entrené y seguí mi plan de alimentación hoy',
  retoContent:[
    {title:'Día 1: Evaluación y foto', instructions:'Toma fotos frontales y laterales, mide cintura, cadera y brazo. Anota peso. Estos datos son tu punto de partida, no un juicio.', reflectionPrompt:'¿Qué te motivó a empezar hoy?'},
    {title:'Día 2: Full body básico', instructions:'20 sentadillas, 10 flexiones (pueden ser de rodillas), 20 crunches, 30 seg plancha. Repite 3 rondas con 1 min de descanso.', reflectionPrompt:'¿Qué ejercicio te costó más?'},
    {title:'Día 3: Cardio ligero', instructions:'30 minutos de caminata rápida o trote suave. Mantén la capacidad de hablar pero sintiendo esfuerzo.', reflectionPrompt:'¿Cómo se sintió tu cuerpo al día siguiente del entrenamiento de fuerza?'},
    {title:'Día 4: Tren superior', instructions:'15 flexiones, 20 remo con botella de agua, 15 fondos en silla, 20 elevaciones laterales. 3 rondas.', reflectionPrompt:'¿Qué músculo sentiste trabajar más?'},
    {title:'Día 5: Tren inferior y core', instructions:'20 sentadillas, 20 zancadas (10 por pierna), 15 puentes de glúteo, 30 seg plancha. 3 rondas.', reflectionPrompt:'¿Notas más energía en las actividades cotidianas?'},
    {title:'Día 6: HIIT 20 min', instructions:'20 seg máximo esfuerzo + 40 seg descanso × 20 minutos. Alterna: burpees, jumping jacks, mountain climbers, high knees.', reflectionPrompt:'¿Cómo manejaste la intensidad?'},
    {title:'Día 7: Descanso activo', instructions:'Caminata de 30 min + estiramiento de 15 min. El descanso es parte del progreso, no lo saltes.', reflectionPrompt:'¿Qué has aprendido sobre tu cuerpo esta semana?'}
  ],
  initialItems:['Entrenar mínimo 30 min','Tomar 2-3 litros de agua','Dormir 7-8 horas','Comer proteína en cada comida','Reducir azúcar añadido','Sumar pasos (objetivo 8000+)','Estirar después de entrenar','No pesarme a diario (solo semanal)'],
  faqItems:[
    {q:'¿Puedo hacerlo sin equipo?', a:'Sí. Todos los ejercicios usan peso corporal. Opcional: una mochila cargada o botellas de agua como pesas.'},
    {q:'¿Cuántas calorías debo comer?', a:'Depende de tu objetivo y peso actual. Regla general: déficit de 300-500 kcal para bajar grasa. Prioriza proteína (1.6-2g por kg).'},
    {q:'Me duelen los músculos, ¿entreno igual?', a:'El dolor muscular leve (DOMS) es normal y puedes entrenar otro grupo muscular. Si es dolor agudo o articular, descansa.'},
    {q:'¿Puedo bajar grasa y ganar músculo a la vez?', a:'Sí, si eres principiante o regresas tras pausa larga (recomposición). Requiere suficiente proteína y entrenamiento de fuerza.'},
    {q:'¿Cuánto tardo en ver resultados?', a:'Energía: 1 semana. Ropa más holgada: 3-4 semanas. Cambios visibles en espejo: 6-8 semanas. Sé paciente.'},
    {q:'¿Necesito suplementos?', a:'No son imprescindibles. Los más útiles: proteína en polvo (si no llegas con comida), creatina, vitamina D, magnesio.'}
  ]
},

{
  id:'tpl-yoga-21', name:'Yoga para Principiantes',
  types:['reto','glosario','meditacion','flashcards'],
  niche:'yoga, flexibilidad, mente-cuerpo', category:'Fitness', subcategory:'Yoga',
  description:'21 días para construir una práctica de yoga estable desde cero, con posturas y filosofía.',
  icon:'🧘‍♀️', primaryColor:'#0891b2', secondaryColor:'#22d3ee', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#0891b2,#22d3ee)',
  retoContent:[
    {title:'Día 1: Saludo al sol básico', instructions:'Aprende el Surya Namaskar (saludo al sol A): montaña → flexión → plancha → cobra → perro boca abajo → flexión → montaña. 5 rondas.', reflectionPrompt:'¿Qué postura sentiste más extraña?'},
    {title:'Día 2: Apertura de caderas', instructions:'15 minutos enfocados en caderas: mariposa, paloma, guirnalda (malasana), media paloma. Mantén cada postura 5 respiraciones.', reflectionPrompt:'¿Cómo tenías las caderas, flexibles o rígidas?'},
    {title:'Día 3: Equilibrio', instructions:'Árbol (vrksasana), guerrero III, silla en puntillas. 5 respiraciones por lado. Usa una pared si necesitas apoyo.', reflectionPrompt:'¿Qué aprendiste sobre tu concentración?'},
    {title:'Día 4: Vinyasa suave', instructions:'Enlaza 5 saludos al sol B con guerrero I y II. Fluye al ritmo de tu respiración.', reflectionPrompt:'¿Lograste sincronizar respiración y movimiento?'},
    {title:'Día 5: Yin yoga', instructions:'Mantén cada postura 2-3 minutos: mariposa, dragón, deshilachado (thread the needle), savasana. Suelta y respira.', reflectionPrompt:'¿Qué sentiste al permanecer tanto tiempo en una postura?'},
    {title:'Día 6: Inversiones suaves', instructions:'Práctica piernas arriba de la pared (viparita karani) 10 min, flexión adelante, postura del niño. Día de calma.', reflectionPrompt:'¿Cómo se siente tu sistema nervioso?'},
    {title:'Día 7: Práctica libre 20 min', instructions:'Diseña tu propia secuencia con las posturas aprendidas. Confía en lo que tu cuerpo pide hoy.', reflectionPrompt:'¿Qué postura elegiste como favorita y por qué?'}
  ],
  meditationScript:'Siéntate en postura cómoda con la columna recta. Junta las palmas al corazón. Inhala por la nariz... exhala por la nariz. Llamamos a esto Ujjayi, la respiración del océano. Siente el aire pasar por la parte trasera de tu garganta creando un sonido suave. Este es tu ancla durante toda la práctica. Establece una intención (sankalpa): una palabra o frase para hoy. Puede ser "presencia", "apertura", "paciencia". Repítela mentalmente. Ahora déjala ir y simplemente respira. Tu práctica es tu ofrenda. Namaste.',
  glossaryTerms:[
    {term:'Asana', def:'Postura física. Cada nombre en sánscrito termina en -asana (ej: tadasana = postura de la montaña).'},
    {term:'Pranayama', def:'Control consciente de la respiración. Técnicas para regular energía vital.'},
    {term:'Vinyasa', def:'Flujo donde cada movimiento se sincroniza con una respiración.'},
    {term:'Yin yoga', def:'Estilo pasivo donde las posturas se mantienen 2-5 minutos para trabajar fascia y tejido profundo.'},
    {term:'Savasana', def:'Postura del cadáver. Relajación final, considerada la postura más importante.'},
    {term:'Om / Aum', def:'Mantra primordial. El sonido universal. Se canta al inicio y final de la práctica.'},
    {term:'Namaste', def:'"La luz en mí honra la luz en ti". Saludo respetuoso con las palmas al corazón.'},
    {term:'Drishti', def:'Punto de enfoque visual. Ayuda a mantener equilibrio y concentración.'},
    {term:'Chakra', def:'Centros energéticos del cuerpo. Los 7 principales se alinean a lo largo de la columna.'},
    {term:'Sankalpa', def:'Intención o propósito que se establece al inicio de la práctica.'}
  ],
  cards:[
    {front:'Tadasana', back:'Postura de la montaña. Base de todas las posturas de pie. Pies juntos, columna alargada.'},
    {front:'Adho Mukha Svanasana', back:'Perro boca abajo. Forma de V invertida. Estira piernas, columna y hombros.'},
    {front:'Balasana', back:'Postura del niño. Descanso activo. Rodillas abiertas, frente al suelo, brazos extendidos.'},
    {front:'Virabhadrasana I', back:'Guerrero I. Pie delantero doblado a 90°, trasero en diagonal, brazos arriba.'},
    {front:'Bhujangasana', back:'Cobra. De boca abajo, elevas pecho apoyando las manos. Abre el pecho.'},
    {front:'Utkatasana', back:'Silla. De pie con rodillas dobladas como sentado en silla imaginaria, brazos arriba.'}
  ]
},

{
  id:'tpl-running-5k', name:'De Cero a 5K',
  types:['reto','roadmap','tracker','faq'],
  niche:'running, correr, cardio', category:'Fitness', subcategory:'Running',
  description:'Plan de 8 semanas para personas sedentarias que quieren completar su primer 5K corriendo.',
  icon:'🏃', primaryColor:'#ea580c', secondaryColor:'#fb923c', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#ea580c,#fb923c)',
  trackerHabit:'Completé mi sesión de running de hoy',
  retoContent:[
    {title:'Semana 1: Caminar con intervalos', instructions:'3 sesiones. Alterna 1 min trote suave + 2 min caminata. Total 20 min. Descansa un día entre sesiones.', reflectionPrompt:'¿Cómo estuvo tu respiración?'},
    {title:'Semana 2: Aumentando el trote', instructions:'3 sesiones. Alterna 90 seg trote + 90 seg caminata. Total 22 min. Zapatillas adecuadas son clave.', reflectionPrompt:'¿Qué notas diferente del cuerpo respecto a la semana 1?'},
    {title:'Semana 3: Intervalos más largos', instructions:'3 sesiones. Alterna 2 min trote + 1 min caminata. Total 24 min. Calienta con 5 min de caminata.', reflectionPrompt:'¿Dónde sientes tensión al correr?'},
    {title:'Semana 4: Primer intervalo de 5 min', instructions:'3 sesiones. 3 min trote + 1 min caminata, luego 5 min trote + 2 min caminata, luego 3 min trote. Calienta + enfría.', reflectionPrompt:'¿Cómo manejaste el intervalo de 5 min?'},
    {title:'Semana 5: Corriendo más que caminando', instructions:'3 sesiones. 5 min trote + 1 min caminata + 8 min trote + 1 min caminata + 5 min trote. Respira por nariz si puedes.', reflectionPrompt:'¿Qué ritmo te sientes cómodo/a manteniendo?'},
    {title:'Semana 6: Trotes continuos', instructions:'3 sesiones. 10 min trote + 2 min caminata + 10 min trote. Te acercas mucho al objetivo.', reflectionPrompt:'¿Estás disfrutando más o menos que al empezar?'},
    {title:'Semana 7: 25 min continuos', instructions:'3 sesiones. 25 minutos trotando sin parar. Ritmo conversacional, no te importe ir lento/a.', reflectionPrompt:'¿Qué cambió en tu mente en 7 semanas?'},
    {title:'Semana 8: ¡Tu 5K!', instructions:'Sesión 1 y 2: 25-30 min trote. Sesión 3: completa tus 5K. Celebra — empezaste desde cero.', reflectionPrompt:'¿Qué aprendiste sobre ti?'}
  ],
  roadmapSteps:[
    {title:'Paso 1: Zapatillas adecuadas', description:'Invierte en zapatillas de running según tu pisada. Visita una tienda especializada si puedes.'},
    {title:'Paso 2: Calentar siempre', description:'5 min de caminata + movilidad articular antes de cada sesión. Previene lesiones.'},
    {title:'Paso 3: Técnica básica', description:'Cadencia 170-180 pasos/min, mirada al frente, hombros relajados, pisar bajo tu centro de gravedad.'},
    {title:'Paso 4: Respiración', description:'3 pasos inhalando, 2 pasos exhalando. Ajusta según ritmo. Si no puedes hablar, vas demasiado rápido.'},
    {title:'Paso 5: Descanso y sueño', description:'El progreso ocurre en el descanso. Mínimo 7h de sueño y un día de descanso completo por semana.'},
    {title:'Paso 6: Hidratación y alimentación', description:'Agua antes, durante (si pasa 40 min) y después. Come carbos complejos 2h antes de correr.'},
    {title:'Paso 7: Tu primer 5K', description:'Inscríbete en una carrera popular. El ambiente y la meta física son increíbles. No busques ritmo, busca terminar.'}
  ],
  faqItems:[
    {q:'¿Debo correr todos los días?', a:'No. 3 sesiones por semana con descanso es óptimo para principiantes. Más aumenta riesgo de lesión.'},
    {q:'Me duelen las rodillas, ¿debo parar?', a:'Reduce distancia y revisa calzado + técnica. Si el dolor persiste tras descansar 3 días, consulta fisio.'},
    {q:'¿Es normal caminar durante la sesión?', a:'Totalmente. El método run-walk es usado incluso por corredores avanzados en entrenamientos largos.'},
    {q:'¿Correr daña las rodillas?', a:'Hecho bien, correr fortalece articulaciones. El problema es aumentar distancia muy rápido o mala técnica.'},
    {q:'¿Necesito GPS/reloj?', a:'No al principio. Apps gratuitas como Strava usan el GPS del teléfono y son suficientes.'}
  ]
},

{
  id:'tpl-funcional', name:'Rutina Funcional en Casa',
  types:['reto','checklist','flashcards','tracker'],
  niche:'entrenamiento funcional, fitness en casa', category:'Fitness', subcategory:'Funcional',
  description:'Entrenamiento funcional sin equipo: fuerza, cardio y movilidad en 30 min diarios.',
  icon:'🏋️', primaryColor:'#16a34a', secondaryColor:'#4ade80', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#16a34a,#4ade80)',
  trackerHabit:'Entrené funcional hoy',
  retoContent:[
    {title:'Día 1: Patrones básicos', instructions:'10 sentadillas, 10 flexiones, 10 zancadas por pierna, 10 remos con mochila, 30 seg plancha. 3 rondas.', reflectionPrompt:'¿Qué ejercicio tienes que mejorar técnica?'},
    {title:'Día 2: Circuito metabólico', instructions:'Tabata: 20 seg trabajo / 10 seg descanso × 8 rondas. Ejercicios: burpees, jumping jacks, mountain climbers, squat jumps.', reflectionPrompt:'¿Cómo manejaste la intensidad?'},
    {title:'Día 3: Fuerza tren inferior', instructions:'Sentadilla goblet con mochila 3×12, zancadas búlgaras 3×10 por pierna, puente de glúteo 3×15, sentadilla en pared 3×45 seg.', reflectionPrompt:'¿Qué pierna es más débil?'},
    {title:'Día 4: Core avanzado', instructions:'Plancha 3×45 seg, plancha lateral 3×30 seg por lado, hollow body 3×20 seg, dead bug 3×10 por lado, bicicleta 3×20.', reflectionPrompt:'¿Sientes tu core más fuerte?'},
    {title:'Día 5: EMOM 20 min', instructions:'Cada minuto en el minuto: 5 burpees + 10 sentadillas + resto del minuto descanso. Por 20 minutos.', reflectionPrompt:'¿Cuándo perdiste forma?'},
    {title:'Día 6: Tren superior', instructions:'Flexiones 3×max, flexiones diamante 3×max, fondos silla 3×15, remos mochila 3×12, pike push-ups 3×8.', reflectionPrompt:'¿Qué empujón o jalón te cuesta más?'},
    {title:'Día 7: Movilidad y recuperación', instructions:'30 min de movilidad: caderas, columna, hombros, tobillos. Foam roller si tienes. Estiramiento profundo.', reflectionPrompt:'¿Qué zona está más tensa?'}
  ],
  initialItems:['Calentar 5 min antes','Tomar 500ml agua durante sesión','Grabar video de técnica 1 vez/semana','Registrar reps y cargas','Comer proteína post-entreno','Estirar 10 min post-entreno','Dormir 7h+','1 día de descanso completo'],
  cards:[
    {front:'Sentadilla goblet', back:'Sostén peso frente al pecho a la altura del esternón. Baja con espalda recta hasta que codos toquen rodillas.'},
    {front:'Burpee completo', back:'Desde pie → sentadilla → plancha → flexión → salto → arriba con aplauso. Movimiento explosivo.'},
    {front:'Plancha correcta', back:'Alineación cabeza-espalda-caderas-talones. Glúteos y core contraídos. NO hundas caderas ni las eleves.'},
    {front:'Zancada búlgara', back:'Pie trasero elevado en silla. Baja la rodilla delantera 90°. Desafía glúteos y equilibrio.'},
    {front:'EMOM', back:'Every Minute On the Minute. Ejecutas reps al inicio de cada minuto. El resto descansas.'},
    {front:'Hollow body', back:'Tumbado boca arriba, brazos extendidos atrás, piernas elevadas. Lumbar pegada al suelo. Isométrico brutal.'},
    {front:'Pike push-ups', back:'Flexión con caderas elevadas (V invertida). Trabaja hombros. Progresión hacia handstand.'},
    {front:'Dead bug', back:'Tumbado boca arriba, brazos arriba, piernas 90°. Alternas brazo y pierna contraria sin arquear lumbar.'}
  ]
},

{
  id:'tpl-movilidad-21', name:'Movilidad y Flexibilidad',
  types:['reto','flashcards','checklist'],
  niche:'movilidad articular, flexibilidad, recuperación', category:'Fitness', subcategory:'Movilidad',
  description:'21 días para mejorar tu rango de movimiento, prevenir lesiones y aliviar rigidez.',
  icon:'🤸', primaryColor:'#0d9488', secondaryColor:'#5eead4', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#0d9488,#5eead4)',
  retoContent:[
    {title:'Día 1: Cadera profunda', instructions:'Malasana (sentadilla profunda) 2 min + mariposa 2 min + 90/90 stretch 1 min por lado + paloma 1 min por lado.', reflectionPrompt:'¿Qué cadera está más rígida?'},
    {title:'Día 2: Columna y espalda', instructions:'Gato-vaca 2 min, cobra 30 seg × 5, rotaciones torácicas 10 por lado, estiramiento de niño 2 min.', reflectionPrompt:'¿Dónde sientes más tensión en la espalda?'},
    {title:'Día 3: Isquios y piernas', instructions:'Flexión de pie 2 min, piernas arriba de pared 5 min, estocada con isquio estirado 1 min por lado.', reflectionPrompt:'¿Tus isquios están muy rígidos? Es normal tras años sentado/a.'},
    {title:'Día 4: Hombros y pecho', instructions:'Doorway stretch 1 min por lado, thread the needle 1 min por lado, rotaciones de hombro 20, dislocates con toalla 15.', reflectionPrompt:'¿Notas asimetría entre hombro derecho e izquierdo?'},
    {title:'Día 5: Tobillos y pies', instructions:'Sentadilla mantenida 2 min, movilidad de tobillo en pared 15 por lado, rolling de planta del pie 2 min por lado.', reflectionPrompt:'¿Cómo está tu rango de dorsiflexión?'},
    {title:'Día 6: Full body flow', instructions:'Secuencia de 20 min combinando todo lo aprendido. Fluye sin pausa larga, mantén cada postura 30-60 seg.', reflectionPrompt:'¿Cómo se siente tu cuerpo después?'},
    {title:'Día 7: Foam rolling', instructions:'Si tienes foam roller: 2 min por cuadríceps, isquios, glúteos, espalda alta, pantorrillas. Sin roller: pelota de tenis.', reflectionPrompt:'¿Encontraste puntos gatillo dolorosos?'}
  ],
  initialItems:['Movilidad articular 10 min al despertar','Pausas de 2 min cada hora de trabajo','Estirar después de entrenar','Dormir en postura neutra','Hidratarme bien (fascia sana)','Respiraciones profundas al estirar','No forzar, escuchar al cuerpo','Consistencia > intensidad'],
  cards:[
    {front:'Movilidad vs flexibilidad', back:'Flexibilidad es rango pasivo (cuánto estiras). Movilidad es rango activo (cuánto controlas ese rango).'},
    {front:'Dorsiflexión', back:'Capacidad del tobillo de acercar los dedos del pie a la espinilla. Clave para sentadilla profunda y correr.'},
    {front:'Anteversión pélvica', back:'Cadera inclinada hacia adelante. Común por estar sentado. Causa dolor lumbar y glúteos débiles.'},
    {front:'Kifosis torácica', back:'Espalda redondeada en zona alta. Por pantallas y mala postura. Se corrige con movilidad torácica.'},
    {front:'Cadera 90/90', back:'Sentado con una pierna delante 90° y otra al lado 90°. Excelente para rotación interna y externa de cadera.'},
    {front:'Fascia', back:'Tejido conectivo que envuelve músculos. Se adhiere y causa rigidez. Foam rolling ayuda a hidratarla.'}
  ]
},

{
  id:'tpl-calistenia', name:'Calistenia: Tu Primer Muscle-Up',
  types:['roadmap','flashcards','glosario','tracker'],
  niche:'calistenia, peso corporal, street workout', category:'Fitness', subcategory:'Calistenia',
  description:'Plan progresivo hacia tu primer muscle-up con progresiones de pull-up, dip y core.',
  icon:'🤾', primaryColor:'#1e40af', secondaryColor:'#60a5fa', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#1e40af,#60a5fa)',
  trackerHabit:'Entrené calistenia hoy',
  roadmapSteps:[
    {title:'Paso 1: Dominadas con banda elástica', description:'Objetivo: 3×8 con banda gruesa. Enfócate en bajar despacio (excéntrica 3 seg).'},
    {title:'Paso 2: Dominadas con salto + negativa', description:'Salta a la posición alta y baja lentamente 5 segundos. 5 reps × 3 series.'},
    {title:'Paso 3: Primera dominada completa', description:'Cuando logres 1-2 completas, enfócate en acumular volumen: 10 dominadas totales al día en sets cortos.'},
    {title:'Paso 4: Dominadas al pecho', description:'Jala hasta que pecho toque la barra. Requiere fuerza extra en dorsales y bíceps. Trabaja hasta 3×5.'},
    {title:'Paso 5: Fondos profundos en paralelas', description:'Baja hasta que hombros queden bajo codos. Objetivo: 3×10. Esencial para muscle-up.'},
    {title:'Paso 6: Explosividad', description:'Dominadas explosivas (tocar pecho o por encima de la barra). Trabaja potencia, no solo fuerza. 5×3.'},
    {title:'Paso 7: Transición asistida', description:'Con banda elástica, practica el "false grip" y la transición de pull a dip. 3-5 reps × 5 series.'},
    {title:'Paso 8: Tu primer muscle-up', description:'Usa banda ligera primero, luego sin asistencia. Impulso limpio: pull explosivo + volteo de muñecas + push.'}
  ],
  cards:[
    {front:'False grip', back:'Agarre con la muñeca por encima de la barra. Esencial para la transición del muscle-up.'},
    {front:'Dominada estricta', back:'Sin impulso. Cuerpo estable, solo trabajan brazos y espalda.'},
    {front:'Dominada kipping', back:'Usa impulso de cadera. Más fácil pero menos fuerza pura.'},
    {front:'L-sit', back:'Sentado en paralelas con piernas extendidas al frente. Core + hombros. Progresión hacia V-sit.'},
    {front:'Front lever', back:'Colgado horizontal frente a la barra, cuerpo paralelo al suelo. Nivel avanzado.'},
    {front:'Progresión', back:'Variación más fácil de un ejercicio que permite entrenar el patrón antes de dominarlo completo.'}
  ],
  glossaryTerms:[
    {term:'Rep (repetición)', def:'Una ejecución completa del ejercicio.'},
    {term:'Set (serie)', def:'Grupo de repeticiones consecutivas sin descanso.'},
    {term:'RPE', def:'Rate of Perceived Exertion. Escala 1-10 de qué tan duro fue el esfuerzo. 8-9 para hipertrofia.'},
    {term:'Tempo', def:'Velocidad de ejecución. Ej: 3-1-1 = 3 seg bajada, 1 seg pausa, 1 seg subida.'},
    {term:'Excéntrica', def:'Fase de alargamiento muscular (bajada en dominada). Controlarla genera mucha fuerza.'},
    {term:'Isométrica', def:'Contracción sin movimiento (mantener una postura).'},
    {term:'Greasing the groove', def:'Técnica de hacer muchas series cortas a lo largo del día, lejos del fallo. Acelera skill.'},
    {term:'Muscle-up', def:'Movimiento avanzado: dominada explosiva + transición + fondo. Símbolo de fuerza en calistenia.'}
  ]
},

// ═══════════════ NUTRICIÓN ═══════════════

{
  id:'tpl-alimentacion-21', name:'Alimentación Balanceada',
  types:['reto','checklist','flashcards','faq'],
  niche:'nutrición, alimentación saludable', category:'Nutrición', subcategory:'General',
  description:'21 días para crear hábitos de alimentación equilibrada sin dietas restrictivas.',
  icon:'🥗', primaryColor:'#65a30d', secondaryColor:'#a3e635', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#65a30d,#a3e635)',
  retoContent:[
    {title:'Día 1: Vaso de agua al despertar', instructions:'Antes de café o desayuno, toma 500ml de agua. Hidrata tras 8h de ayuno nocturno y activa metabolismo.', reflectionPrompt:'¿Cómo te sentiste?'},
    {title:'Día 2: Proteína en cada comida', instructions:'Asegura una fuente de proteína en desayuno, almuerzo y cena: huevos, pollo, pescado, lentejas, tofu, yogur griego.', reflectionPrompt:'¿Qué comida te costó más incluir proteína?'},
    {title:'Día 3: Verduras en 2 comidas', instructions:'Incluye verduras en almuerzo Y cena. Mitad del plato idealmente. Variedad de colores = variedad de nutrientes.', reflectionPrompt:'¿Qué verdura nueva probaste?'},
    {title:'Día 4: Elimina bebidas azucaradas', instructions:'Hoy cero refrescos, jugos envasados, café con azúcar. Solo agua, infusiones, café/té sin azúcar.', reflectionPrompt:'¿Cuántos gramos de azúcar líquida evitaste?'},
    {title:'Día 5: Comer sin pantallas', instructions:'Todas las comidas sin TV, teléfono ni trabajo. Mastica despacio, nota sabores. Comer consciente reduce porciones.', reflectionPrompt:'¿Notaste saciedad antes que de costumbre?'},
    {title:'Día 6: Planifica mañana', instructions:'Esta noche, planifica qué comerás mañana. Prepara lo que puedas. Evitas decisiones impulsivas cuando tienes hambre.', reflectionPrompt:'¿Qué te costará más seguir?'},
    {title:'Día 7: Comida casera 100%', instructions:'Hoy cocina todas tus comidas. Sin pedidos, sin empacado. Tú controlas ingredientes y porciones.', reflectionPrompt:'¿Qué aprendiste sobre tu relación con la comida?'}
  ],
  initialItems:['Desayunar con proteína','Comer 5 porciones de frutas/verduras','Mínimo 2 litros de agua','Evitar ultraprocesados','Masticar despacio (20 veces)','Parar al 80% de saciedad','Planear comidas de la semana','Un día de comida libre (sin culpa)'],
  cards:[
    {front:'Proteínas', back:'1.2-1.6g por kg de peso. Reparan músculo y dan saciedad. Fuentes: carne, pescado, huevo, lácteos, legumbres.'},
    {front:'Carbohidratos complejos', back:'Libera energía lenta. Avena, arroz integral, quinoa, tubérculos, legumbres, pan integral.'},
    {front:'Grasas saludables', back:'Aguacate, aceite de oliva, frutos secos, pescado graso, semillas. Esenciales para hormonas.'},
    {front:'Ultraprocesados', back:'Productos industriales con aditivos, azúcares añadidos, grasas trans. Evitar: galletas, snacks, embutidos baratos.'},
    {front:'Método del plato', back:'1/2 verduras + 1/4 proteína + 1/4 carbohidrato complejo. Simple y efectivo.'},
    {front:'Hambre real vs emocional', back:'Hambre real: aparece gradual, cualquier comida sirve. Emocional: súbita, antojo específico (dulce o salado).'},
    {front:'Micronutrientes', back:'Vitaminas y minerales. Se obtienen variando colores de frutas y verduras.'},
    {front:'Índice glucémico', back:'Rapidez con que un alimento eleva glucosa. Bajo (legumbres, avena) = saciedad prolongada.'}
  ],
  faqItems:[
    {q:'¿Debo contar calorías?', a:'No es obligatorio. Empieza con método del plato y escucha tu cuerpo. Contar ayuda si tienes objetivo específico.'},
    {q:'¿El desayuno es la comida más importante?', a:'No necesariamente. Lo importante es que todas tus comidas sean nutritivas. Si no tienes hambre, no fuerces.'},
    {q:'¿Puedo comer carbohidratos en la noche?', a:'Sí. No engordan en la noche. Lo que importa es el total diario, no el horario.'},
    {q:'¿Son malas las grasas?', a:'No. Las grasas saludables son esenciales. Evita trans (procesados) y modera saturadas.'},
    {q:'¿Qué hago con antojos de dulce?', a:'Pregúntate si tienes hambre real. Si no, distráete 20 min. Si persiste, come la versión más natural posible (fruta, chocolate 70%+).'},
    {q:'¿Necesito suplementos?', a:'Depende. Si tu dieta es variada, probablemente no. Vitamina D es común déficit. B12 si eres vegetariano/vegano.'}
  ]
},

{
  id:'tpl-keto-30', name:'Reset Keto 30 Días',
  types:['reto','glosario','faq','checklist'],
  niche:'keto, dieta cetogénica, low carb', category:'Nutrición', subcategory:'Keto',
  description:'Plan de 30 días para entrar en cetosis, quemar grasa y estabilizar energía.',
  icon:'🥑', primaryColor:'#047857', secondaryColor:'#6ee7b7', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#047857,#6ee7b7)',
  retoContent:[
    {title:'Día 1: Limpia la despensa', instructions:'Regala o tira: pan, pasta, arroz, galletas, azúcar, refrescos, cereales. Llena con: huevos, carne, pescado, aguacate, aceite oliva, verduras bajas en carbo.', reflectionPrompt:'¿Qué fue más difícil tirar?'},
    {title:'Día 2: 20g carbos netos máximo', instructions:'Cuenta carbohidratos netos (totales - fibra). Apps útiles: MyFitnessPal, Carb Manager. Bebe mucha agua con sal.', reflectionPrompt:'¿Qué comiste hoy?'},
    {title:'Día 3: Electrolitos', instructions:'Suma 3-5g de sal adicional, 300mg magnesio, 1000mg potasio. Previene la "keto flu" (gripe keto).', reflectionPrompt:'¿Síntomas de keto flu?'},
    {title:'Día 4: Ayuno 16:8', instructions:'Come solo entre 12pm y 8pm. Acelera entrada en cetosis. Café con mantequilla (opcional) no rompe el ayuno.', reflectionPrompt:'¿Cómo manejaste el hambre?'},
    {title:'Día 5: Revisa cetosis', instructions:'Tiras de orina (baratas) o sangre (precisas). 0.5-3.0 mmol/L = cetosis nutricional. Aliento con sabor afrutado = señal.', reflectionPrompt:'¿Estás en cetosis?'},
    {title:'Día 6: Comida social', instructions:'Practica salir a comer keto: ensalada + proteína + aguacate, o bistec con verduras. Evita pan y postres.', reflectionPrompt:'¿Cómo fue socialmente?'},
    {title:'Día 7: Semana 1 completa', instructions:'Mide cintura, pesa, nota energía y sueño. Los primeros kg son agua (glucógeno). Grasa viene después.', reflectionPrompt:'¿Qué cambios notaste?'}
  ],
  initialItems:['20g carbos netos máximo','3L agua + sal','Electrolitos (Na, K, Mg)','70% grasa, 25% proteína, 5% carbos','Cocinar en casa','Sin productos "keto procesados"','Dormir 7h+','Ayuno 14-16h'],
  glossaryTerms:[
    {term:'Cetosis', def:'Estado metabólico donde el cuerpo quema grasa (cuerpos cetónicos) en lugar de glucosa.'},
    {term:'Cetoadaptación', def:'Proceso de 3-6 semanas donde el cuerpo optimiza el uso de cetonas. Energía estable tras esto.'},
    {term:'Keto flu', def:'Síntomas gripales los primeros días: fatiga, dolor cabeza, irritabilidad. Se soluciona con electrolitos.'},
    {term:'Carbos netos', def:'Carbohidratos totales menos fibra menos polialcoholes. Los que impactan glucosa.'},
    {term:'BHB', def:'Beta-hidroxibutirato. Principal cuerpo cetónico. Se mide en sangre.'},
    {term:'MCT oil', def:'Triglicéridos de cadena media (aceite de coco). Se convierte rápido en cetonas.'},
    {term:'Lazy keto', def:'Versión simplificada: solo cuentas carbos, sin medir grasa ni proteína. Menos preciso.'},
    {term:'Ayuno intermitente', def:'Comer en ventana restringida. Combina muy bien con keto.'}
  ],
  faqItems:[
    {q:'¿Cuánto tiempo para entrar en cetosis?', a:'2-5 días con 20g carbos o menos. Ayuno acelera a 24-48h. Ejercicio también ayuda.'},
    {q:'¿Puedo hacer ejercicio en keto?', a:'Sí. Los primeros días bajarás rendimiento. Tras cetoadaptación, cardio largo mejora; explosividad puede bajar algo.'},
    {q:'¿Es peligroso keto?', a:'Para persona sana, no. Contraindicado en diabetes tipo 1, pancreatitis, problemas hepáticos/renales. Consulta médico.'},
    {q:'¿Cuánto puedo bajar?', a:'Primera semana: 2-4 kg (agua). Luego 0.5-1 kg por semana de grasa real.'},
    {q:'¿Puedo comer fruta?', a:'Solo berries (frambuesa, fresa) en cantidades pequeñas. Plátano, uva, mango = muchos carbos.'},
    {q:'¿Qué pasa si como carbos?', a:'Sales de cetosis. Vuelves a glucógeno. Tardas 1-3 días en regresar. No arruina todo, solo reinicia.'}
  ]
},

{
  id:'tpl-mealprep', name:'Meal Prep Semanal',
  types:['planificador','checklist','flashcards'],
  niche:'meal prep, cocina semanal, organización', category:'Nutrición', subcategory:'Meal Prep',
  description:'Organiza tu cocina semanal en 2 horas: comidas ricas, saludables y sin estrés.',
  icon:'🥘', primaryColor:'#ea580c', secondaryColor:'#fdba74', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#ea580c,#fdba74)',
  initialTasks:['Domingo 10am: Planear menú de la semana','Domingo 11am: Hacer lista de compras','Domingo 12pm: Comprar en el super','Domingo 2pm: Lavar y cortar verduras','Domingo 3pm: Cocinar proteínas de la semana','Domingo 4pm: Cocinar carbohidratos (arroz, quinoa)','Domingo 5pm: Preparar 2-3 salsas/aderezos','Domingo 6pm: Porcionar en taper','Lunes-Viernes 7am: Llevar taper al trabajo'],
  initialItems:['10 tapers con tapa','Básculas digital','Cuchillo bien afilado','Tabla de cortar','Etiquetas para fecha','Olla arrocera o Instant Pot','Sartén antiadherente grande','Bolsas ziploc para congelar','Hierbas y especias básicas'],
  cards:[
    {front:'Fórmula base meal prep', back:'1 proteína + 1 carbohidrato complejo + 2 verduras + 1 salsa = comida completa. Varía la salsa para evitar aburrirte.'},
    {front:'¿Cuántos días aguanta?', a:'Pollo cocido: 4 días. Pescado: 2 días. Arroz/quinoa: 5 días. Verduras cocidas: 4 días. Salsas con crema: 3 días.', back:'Pollo cocido: 4 días. Pescado: 2 días. Arroz/quinoa: 5 días. Verduras cocidas: 4 días. Salsas con crema: 3 días.'},
    {front:'Verduras que aguantan crudas', back:'Zanahoria, pepino, apio, pimiento, brócoli, coliflor. Córtalas domingo, úsalas toda la semana.'},
    {front:'Proteínas ideales meal prep', back:'Pollo desmechado, carne molida, atún, huevos duros, tofu horneado, lentejas. Se recalientan bien.'},
    {front:'Congela porciones extra', back:'Cocina doble y congela la mitad. Etiqueta con fecha. Duración: 3 meses.'},
    {front:'Regla de las 3 salsas', back:'Ten siempre 3 salsas listas (ej: vinagreta, pesto, yogur con hierbas). Mismo ingrediente se siente diferente.'},
    {front:'Batch cooking vs meal prep', back:'Batch: cocinas ingredientes separados, combinas al momento. Meal prep: platos ya armados en taper.'}
  ]
},

{
  id:'tpl-ayuno', name:'Ayuno Intermitente 16:8',
  types:['reto','tracker','faq','glosario'],
  niche:'ayuno intermitente, ayuno 16:8', category:'Nutrición', subcategory:'Ayuno',
  description:'Implementa el ayuno intermitente 16:8 de forma sostenible en 21 días.',
  icon:'⏰', primaryColor:'#7c2d12', secondaryColor:'#fb923c', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#7c2d12,#fb923c)',
  trackerHabit:'Completé mi ventana de ayuno 16h hoy',
  retoContent:[
    {title:'Día 1: Ayuno 12:12', instructions:'Empieza suave. Última comida 8pm, primera 8am. Si normalmente cenas tarde, ya has ayunado 12h muchas veces sin notarlo.', reflectionPrompt:'¿Cómo te sentiste?'},
    {title:'Día 2: Ayuno 14:10', instructions:'Extiende ayuno a 14h. Última comida 8pm, primera 10am. Agua, café negro o té sin azúcar están permitidos.', reflectionPrompt:'¿Tuviste hambre en la mañana?'},
    {title:'Día 3: Ayuno 16:8 (primera vez)', instructions:'La ventana oficial: 16h ayuno, 8h comida. Última comida 8pm, primera 12pm. Mantén hidratación alta.', reflectionPrompt:'¿Llegaste hasta las 12?'},
    {title:'Día 4: Hidratación máxima', instructions:'3L agua mínimo durante el ayuno. Agrega pizca de sal rosa si sientes mareo. Café y té SIN azúcar.', reflectionPrompt:'¿Notas más energía sin desayuno?'},
    {title:'Día 5: Rompe el ayuno bien', instructions:'Primera comida: proteína + verduras + grasas. Evita azúcar y carbos refinados al romper. Picos de glucosa = hambre de rebote.', reflectionPrompt:'¿Qué comiste primero?'},
    {title:'Día 6: Ayuno y ejercicio', instructions:'Entrena durante el ayuno (si cardio ligero o fuerza corta). Luego come proteína + carbos. Recuperación post-ayuno es potente.', reflectionPrompt:'¿Cómo fue tu rendimiento?'},
    {title:'Día 7: Revisión', instructions:'¿Te sientes con más energía? ¿Menos antojos? ¿Mejor digestión? El ayuno no es magia, es una herramienta. Úsala si te funciona.', reflectionPrompt:'¿Vas a seguir?'}
  ],
  glossaryTerms:[
    {term:'Ayuno intermitente', def:'Patrón de comida que alterna ventanas de ayuno con ventanas de alimentación.'},
    {term:'16:8', def:'Protocolo más popular: 16h sin comer, 8h para comer. Ejemplo: 12pm a 8pm.'},
    {term:'OMAD', def:'One Meal A Day. Ayuno 23:1. Solo una comida al día. Avanzado.'},
    {term:'Autofagia', def:'Proceso celular de "limpieza" que se activa tras 16-24h sin comer. Renueva células dañadas.'},
    {term:'Ventana de alimentación', def:'Horas permitidas para comer (ej: 12pm-8pm).'},
    {term:'Romper el ayuno', def:'Primera comida tras el ayuno. Importante que sea equilibrada, no azucarada.'},
    {term:'Cetosis inducida', def:'Al alargar ayuno, el cuerpo entra en cetosis leve. Quema grasa.'},
    {term:'5:2', def:'Protocolo alternativo: 5 días comida normal, 2 días a 500-600 kcal. Menos popular que 16:8.'}
  ],
  faqItems:[
    {q:'¿El ayuno intermitente baja de peso?', a:'Sí, porque comprime las horas de comida. Pero solo si mantienes déficit calórico. No es magia.'},
    {q:'¿Puedo tomar café o té durante el ayuno?', a:'Sí, sin azúcar ni leche. Agua, café negro, té, infusiones. Algo de sal está permitido.'},
    {q:'¿Rompe el ayuno el chicle o los suplementos?', a:'Chicle con azúcar sí. Sin azúcar técnicamente no, pero puede activar digestión. Suplementos con calorías (BCAA, colágeno): sí rompen.'},
    {q:'¿Es seguro para mujeres?', a:'En general sí, pero las mujeres son más sensibles. Empieza con 12:12 y aumenta gradual. Si se altera tu ciclo, reduce ayuno.'},
    {q:'¿Puedo ayunar si hago ejercicio intenso?', a:'Sí pero ajusta. Entrena al final del ayuno o dentro de la ventana de comida. Carga de glucógeno es importante para fuerza.'},
    {q:'¿Es bueno a largo plazo?', a:'La evidencia es reciente pero positiva: mejora sensibilidad a insulina, marcadores inflamatorios, pérdida de grasa visceral.'}
  ]
},

{
  id:'tpl-vegano', name:'Nutrición Vegana Completa',
  types:['glosario','faq','flashcards','checklist'],
  niche:'veganismo, plant based, nutrición vegetal', category:'Nutrición', subcategory:'Vegano',
  description:'Guía completa para una alimentación vegana equilibrada y sin déficits nutricionales.',
  icon:'🌱', primaryColor:'#15803d', secondaryColor:'#86efac', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#15803d,#86efac)',
  glossaryTerms:[
    {term:'Vegano', def:'No consume ningún producto de origen animal: carne, pescado, lácteos, huevos, miel.'},
    {term:'Plant based', def:'Alimentación principalmente vegetal. No necesariamente estricta como veganismo.'},
    {term:'Proteína completa', def:'Contiene los 9 aminoácidos esenciales. Ejemplos vegetales: quinoa, soja, garbanzo + arroz.'},
    {term:'B12', def:'Vitamina solo en alimentos animales (o enriquecidos). Los veganos DEBEN suplementar. No negociable.'},
    {term:'Hierro hemo/no hemo', def:'Hemo (animal) se absorbe mejor. No hemo (vegetal) se absorbe con vitamina C cerca.'},
    {term:'Omega 3 vegetal', def:'ALA en semillas de lino, chía, nuez. Conversión a EPA/DHA es baja. Algunos suplementan con algas.'},
    {term:'Tempeh', def:'Soja fermentada. Textura firme, sabor a nuez. Más digestible que tofu.'},
    {term:'Seitán', def:'Gluten de trigo cocido. Alta proteína, textura de carne. No apto celíacos.'},
    {term:'Levadura nutricional', def:'Copos amarillos con sabor a queso. Aporta B12 (enriquecida) y proteína.'},
    {term:'Calcio vegetal', def:'Brócoli, col rizada, tofu con sulfato de calcio, tahini, almendras, bebidas vegetales fortificadas.'}
  ],
  faqItems:[
    {q:'¿De dónde saco proteína?', a:'Legumbres (lentejas, garbanzos, alubias), soja (tofu, tempeh, edamame), seitán, quinoa, frutos secos, semillas.'},
    {q:'¿Necesito combinar proteínas?', a:'No en la misma comida. Si comes variedad durante el día, obtienes todos los aminoácidos.'},
    {q:'¿Qué suplementos son imprescindibles?', a:'B12 siempre. Vitamina D si poco sol. Omega 3 (algas) opcional pero recomendado.'},
    {q:'¿Puedo hacer ejercicio y crecer músculo?', a:'Absolutamente. Requiere 1.6-2g proteína/kg, variedad de fuentes, y calorías suficientes.'},
    {q:'¿Es caro ser vegano?', a:'Los básicos son baratísimos: legumbres, arroz, verduras, avena. Los procesados veganos sí son caros pero no necesarios.'},
    {q:'¿Puedo ser vegano durante embarazo?', a:'Sí, con planificación y suplementación adecuada (B12, hierro, omega 3). Consulta nutricionista.'},
    {q:'¿Los niños pueden ser veganos?', a:'Sí con seguimiento profesional. Requiere atención especial a B12, hierro, calcio, zinc, omega 3.'},
    {q:'¿Qué pasa si solo reduzco carne?', a:'¡Excelente! Cualquier reducción es beneficiosa. No hace falta ser 100% para ver beneficios.'}
  ],
  cards:[
    {front:'Proteínas vegetales top', back:'Seitán (75g/100g), soja (36g), lentejas (25g), quinoa (14g), avena (13g), garbanzos (19g).'},
    {front:'Combinaciones proteicas clásicas', back:'Arroz + frijoles, hummus + pan, tortilla + frijoles, lentejas + arroz. Perfiles aminoácidos completos.'},
    {front:'Hierro vegetal', back:'Lentejas, tofu, espinacas, semillas de calabaza, quinoa. Come con vitamina C (limón, pimiento) para mejor absorción.'},
    {front:'Calcio sin lácteos', back:'Tofu (con calcio), bebidas vegetales fortificadas, brócoli, col rizada, tahini, almendras, higos secos.'},
    {front:'Omega 3 vegetal', back:'2 cucharadas diarias de semillas de chía o lino molidas. Nueces como snack. Aceite de algas como suplemento.'},
    {front:'Sustituto de huevo', back:'1 cda semillas de lino + 3 cdas agua = 1 huevo (para hornear). Tofu revuelto = huevos revueltos. Aquafaba = claras.'},
    {front:'Zinc vegetal', back:'Semillas de calabaza, lentejas, garbanzos, avena, anacardos, tempeh. Absorción menor que animal, come variado.'},
    {front:'Errores comunes', back:'No suplementar B12, abusar de procesados veganos, baja proteína, poca variedad, olvidar omega 3.'}
  ],
  initialItems:['B12 diaria o semanal','Vitamina D si poco sol','1.6g proteína por kg de peso','Legumbres en 2 comidas al día','Fruta fresca cada día','Frutos secos/semillas 30g','Verdura de hoja verde diaria','Variar fuentes (no solo tofu)']
},

  ];
}
