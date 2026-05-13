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
  icon:'self_improvement', primaryColor:'#6366f1', secondaryColor:'#818cf8', bgColor:'#0e0e0e',
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
  icon:'battery_charging_full', primaryColor:'#059669', secondaryColor:'#34d399', bgColor:'#0e0e0e',
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
  icon:'bedtime', primaryColor:'#4338ca', secondaryColor:'#6366f1', bgColor:'#0e0e0e',
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
  icon:'diamond', primaryColor:'#e11d48', secondaryColor:'#fb7185', bgColor:'#0e0e0e',
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
  icon:'self_improvement', primaryColor:'#0d9488', secondaryColor:'#2dd4bf', bgColor:'#0e0e0e',
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
  icon:'diamond', primaryColor:'#db2777', secondaryColor:'#f472b6', bgColor:'#0e0e0e',
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
  icon:'psychology', primaryColor:'#7c3aed', secondaryColor:'#a78bfa', bgColor:'#0e0e0e',
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
  icon:'wb_sunny', primaryColor:'#f59e0b', secondaryColor:'#fbbf24', bgColor:'#0e0e0e',
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
  icon:'fitness_center', primaryColor:'#dc2626', secondaryColor:'#f87171', bgColor:'#0e0e0e',
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
  icon:'self_improvement', primaryColor:'#0891b2', secondaryColor:'#22d3ee', bgColor:'#0e0e0e',
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
  icon:'directions_run', primaryColor:'#ea580c', secondaryColor:'#fb923c', bgColor:'#0e0e0e',
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
  icon:'fitness_center', primaryColor:'#16a34a', secondaryColor:'#4ade80', bgColor:'#0e0e0e',
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
  icon:'sports_gymnastics', primaryColor:'#0d9488', secondaryColor:'#5eead4', bgColor:'#0e0e0e',
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
  icon:'sports_martial_arts', primaryColor:'#1e40af', secondaryColor:'#60a5fa', bgColor:'#0e0e0e',
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
  icon:'nutrition', primaryColor:'#65a30d', secondaryColor:'#a3e635', bgColor:'#0e0e0e',
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
  icon:'eco', primaryColor:'#047857', secondaryColor:'#6ee7b7', bgColor:'#0e0e0e',
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
  icon:'restaurant', primaryColor:'#ea580c', secondaryColor:'#fdba74', bgColor:'#0e0e0e',
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
  icon:'schedule', primaryColor:'#7c2d12', secondaryColor:'#fb923c', bgColor:'#0e0e0e',
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
  icon:'eco', primaryColor:'#15803d', secondaryColor:'#86efac', bgColor:'#0e0e0e',
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

// ═══════════════ FE Y ESPIRITUALIDAD ═══════════════

{
  id:'tpl-devocional-30', name:'Devocional Cristiano 30 Días',
  types:['reto','devocional','diario','afirmaciones'],
  niche:'fe cristiana, devocional, espiritualidad cristiana', category:'Fe', subcategory:'Cristianismo',
  description:'30 días para profundizar tu caminar con Dios: lectura, oración y reflexión diaria.',
  icon:'auto_stories', primaryColor:'#6d28d9', secondaryColor:'#c4b5fd', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#6d28d9,#c4b5fd)',
  devotionalText:'Amado/a, el Señor te llama hoy a caminar con Él. Dios no busca tu perfección, busca tu corazón. Romanos 8:38-39 nos recuerda: "Estoy convencido de que ni la muerte ni la vida, ni ángeles ni demonios, ni lo presente ni lo porvenir... podrá apartarnos del amor que Dios nos ha manifestado en Cristo Jesús." Toma este momento para respirar profundo. Entrégale a Dios esa preocupación que cargas. Él cuida de ti más de lo que imaginas. Oración: "Padre, gracias por tu fidelidad constante. Hoy suelto mis cargas en tus manos. Ayúdame a confiar en tu tiempo y tu voluntad. En el nombre de Jesús, Amén."',
  retoContent:[
    {title:'Día 1: Salmo 23', instructions:'Lee el Salmo 23 lentamente. Léelo 3 veces. ¿Qué frase te resuena hoy? Anótala y llévala contigo.', reflectionPrompt:'¿En qué área necesitas que el Pastor te guíe hoy?'},
    {title:'Día 2: Oración de entrega', instructions:'Dedica 10 min a orar sin pedir nada. Solo agradece y entrega tu día a Dios. La oración es conversación, no lista de peticiones.', reflectionPrompt:'¿Qué descubriste al orar sin pedir?'},
    {title:'Día 3: Mateo 6:25-34', instructions:'Lee el pasaje sobre no angustiarse. Haz una lista de tus mayores preocupaciones y escribe al lado: "Dios tiene control de esto."', reflectionPrompt:'¿Qué preocupación te cuesta más soltar?'},
    {title:'Día 4: Adoración', instructions:'Escoge 3 canciones de adoración. Canta, ora, llora si necesitas. La adoración transforma la atmósfera de tu día.', reflectionPrompt:'¿Cómo te sentiste después de adorar?'},
    {title:'Día 5: Servir a alguien', instructions:'Hoy haz algo por alguien sin que te lo pidan: un mensaje, una oración, un favor pequeño. Así se manifiesta el amor de Cristo.', reflectionPrompt:'¿A quién bendijiste hoy?'},
    {title:'Día 6: Perdón', instructions:'¿A quién debes perdonar? Escribe su nombre. Ora por esa persona. Perdonar no justifica, libera tu corazón.', reflectionPrompt:'¿Qué sentiste al orar por esa persona?'},
    {title:'Día 7: Sábado de reposo', instructions:'Descansa. Dios descansó el 7º día. No es pereza, es obediencia. Comparte tiempo con familia, lee, ora sin agenda.', reflectionPrompt:'¿Qué te enseñó la semana sobre Dios?'}
  ],
  affirmations:['Soy hija/o amado/a de Dios','Por sus llagas fui sanado/a','Mi identidad está en Cristo','Dios tiene planes de bien para mí (Jer 29:11)','Todo lo puedo en Cristo que me fortalece','Soy más que vencedor/a','La paz de Dios guarda mi corazón','Mi Dios suplirá todas mis necesidades','Soy luz en este mundo','El Señor pelea por mí, yo solo descanso'],
  journalPrompts:['¿Dónde sentí la presencia de Dios hoy?','¿Qué me está enseñando Dios en esta temporada?','¿Qué oración necesito hacer hoy?','¿A quién me pide Dios que perdone?','¿Qué le agradezco a Dios hoy?','¿Qué carga necesito entregarle?','¿Qué palabra o versículo me habló hoy?']
},

{
  id:'tpl-manifestacion-21', name:'Manifestación y Abundancia',
  types:['reto','afirmaciones','diario','meditacion'],
  niche:'manifestación, ley atracción, abundancia', category:'Fe', subcategory:'Espiritualidad',
  description:'21 días para alinear tu mente y energía con lo que deseas manifestar en tu vida.',
  icon:'self_improvement', primaryColor:'#a855f7', secondaryColor:'#e9d5ff', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#a855f7,#e9d5ff)',
  retoContent:[
    {title:'Día 1: Visión clara', instructions:'Escribe en detalle tu vida ideal en 1 año: trabajo, salud, relaciones, dinero. Sé específico/a. La claridad es el primer paso.', reflectionPrompt:'¿Qué parte te cuesta más creer posible?'},
    {title:'Día 2: Identifica creencias limitantes', instructions:'Escribe 10 creencias que tienes sobre dinero/éxito (buenas y malas). Reconocerlas es sanarlas.', reflectionPrompt:'¿De quién heredaste esas creencias?'},
    {title:'Día 3: Afirmaciones presentes', instructions:'Transforma cada creencia limitante en afirmación positiva. "No soy bueno con dinero" → "El dinero fluye hacia mí con facilidad."', reflectionPrompt:'¿Cuál afirmación te genera resistencia?'},
    {title:'Día 4: Visualización guiada', instructions:'10 min visualizando tu vida ideal. Siente la emoción como si ya fuera. El universo responde a la vibración, no a las palabras.', reflectionPrompt:'¿Qué sentiste al visualizar?'},
    {title:'Día 5: Gratitud por lo que vendrá', instructions:'Escribe 5 cosas que aún no tienes pero agradeces como si ya las tuvieras. "Gracias por mi nuevo empleo", "Gracias por mi salud."', reflectionPrompt:'¿Qué sentiste diferente?'},
    {title:'Día 6: Acción alineada', instructions:'Manifestar no es solo pensar. Da UN paso físico hacia tu meta: envía ese CV, estudia 30 min, agenda esa llamada.', reflectionPrompt:'¿Qué acción tomaste?'},
    {title:'Día 7: Suelta el control', instructions:'Lo más difícil: suelta el cómo y el cuándo. Confía en que lo que es para ti llega. Ocúpate de vibrar alto, no de controlar.', reflectionPrompt:'¿Qué necesitas soltar?'}
  ],
  meditationScript:'Cierra los ojos y respira profundo 3 veces. Siente cómo tu cuerpo se relaja. Imagina una luz dorada que desciende desde el cielo y envuelve todo tu cuerpo. Esta luz es la energía de la abundancia. La abundancia es tu estado natural. Ahora visualiza tu vida ideal, la que ya vive en ti. ¿Dónde estás? ¿Con quién? ¿Cómo te sientes? Permítete sentir esa alegría ahora mismo. No mañana, ahora. El universo no distingue entre lo que vives y lo que imaginas intensamente. Mientras respiras, repite: "Yo soy abundancia. Yo soy merecedor/a. El universo conspira a mi favor." Deja que esta energía llene cada célula de tu cuerpo. Cuando estés listo/a, abre los ojos lentamente.',
  affirmations:['Soy un imán de abundancia','El dinero fluye hacia mí con facilidad','Merezco todo lo bueno','El universo conspira a mi favor','Soy merecedor/a de amor y éxito','Todo lo que necesito ya está viniendo','Confío en el tiempo perfecto','Vivo en estado de gratitud','Atraigo oportunidades maravillosas','Mi potencial es infinito'],
  journalPrompts:['Escribe tu vida ideal en presente, como si ya fuera realidad.','¿Qué creencia sobre dinero heredaste de tu familia?','¿Qué sentirás cuando manifiestes tu deseo? Siéntelo ahora.','¿Qué acción pequeña puedes dar hoy hacia tu meta?','¿Qué te está costando soltar?','Describe al "yo futuro" que ya logró todo.']
},

{
  id:'tpl-oracion-30', name:'Oración Intencional',
  types:['reto','tracker','checklist','diario'],
  niche:'oración, vida de oración, intimidad con Dios', category:'Fe', subcategory:'Cristianismo',
  description:'30 días para construir una vida de oración profunda y constante.',
  icon:'auto_stories', primaryColor:'#4338ca', secondaryColor:'#a5b4fc', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#4338ca,#a5b4fc)',
  trackerHabit:'Oré hoy (al menos 15 minutos)',
  retoContent:[
    {title:'Día 1: Establece un lugar', instructions:'Designa un rincón para orar: silla, cojín en el suelo, un lugar del jardín. El lugar físico ayuda a construir el hábito.', reflectionPrompt:'¿Dónde elegiste orar?'},
    {title:'Día 2: ACTS (Adoración, Confesión, Gratitud, Súplica)', instructions:'Estructura tu oración hoy con ACTS: 3 min adorando, 3 min confesando, 3 min agradeciendo, 3 min pidiendo.', reflectionPrompt:'¿Qué parte te costó más?'},
    {title:'Día 3: Oración con Salmos', instructions:'Elige un Salmo y úsalo como tu oración. David, Asaf, los salmistas oraban emociones reales. Aprende de su honestidad.', reflectionPrompt:'¿Qué Salmo elegiste?'},
    {title:'Día 4: Oración en silencio', instructions:'10 min sin decir nada. Solo estar. Escucha. La oración no es monólogo. Dios también habla en el silencio.', reflectionPrompt:'¿Qué fue difícil?'},
    {title:'Día 5: Intercesión', instructions:'Haz una lista de 10 personas y ora específicamente por ellas. Pide por sus necesidades reales, no genéricas.', reflectionPrompt:'¿Por quién sentiste más carga?'},
    {title:'Día 6: Oración con la Palabra', instructions:'Elige un versículo y ora a partir de él. Ej: Filipenses 4:6-7 → "Señor, no quiero angustiarme, te presento..."', reflectionPrompt:'¿Qué versículo elegiste?'},
    {title:'Día 7: Ayuno de medios', instructions:'Hoy sustituye 1h de redes/TV por oración. Usa ese tiempo normalmente "perdido" para estar con Dios.', reflectionPrompt:'¿Qué descubriste?'}
  ],
  initialItems:['Orar al despertar (5 min)','Leer un pasaje bíblico','Orar por mi familia','Orar por alguien específico','Guardar silencio ante Dios','Agradecer 5 cosas','Confesar y soltar','Orar al dormir (5 min)'],
  journalPrompts:['¿Qué me está pidiendo Dios en este tiempo?','¿Qué respuesta recibí en oración hoy?','¿Dónde veo a Dios moverse en mi vida?','¿Qué lista de oración tengo para esta semana?','¿Qué me impide orar más? ¿Puedo ajustar eso?']
},

{
  id:'tpl-biblia-30', name:'Memoriza la Biblia',
  types:['flashcards','reto','tracker'],
  niche:'memorizar versículos, biblia, escritura', category:'Fe', subcategory:'Cristianismo',
  description:'Memoriza 30 versículos clave de la Biblia en 30 días usando flashcards y repetición.',
  icon:'auto_stories', primaryColor:'#be123c', secondaryColor:'#fda4af', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#be123c,#fda4af)',
  trackerHabit:'Memoricé el versículo de hoy',
  cards:[
    {front:'Juan 3:16', back:'"Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna."'},
    {front:'Filipenses 4:13', back:'"Todo lo puedo en Cristo que me fortalece."'},
    {front:'Jeremías 29:11', back:'"Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis."'},
    {front:'Proverbios 3:5-6', back:'"Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas."'},
    {front:'Romanos 8:28', back:'"Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados."'},
    {front:'Salmo 23:1', back:'"Jehová es mi pastor; nada me faltará."'},
    {front:'Isaías 40:31', back:'"Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán."'},
    {front:'Mateo 6:33', back:'"Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas."'},
    {front:'2 Timoteo 1:7', back:'"Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio."'},
    {front:'Josué 1:9', back:'"Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas."'},
    {front:'Salmo 46:10', back:'"Estad quietos, y conoced que yo soy Dios."'},
    {front:'Romanos 12:2', back:'"No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento."'},
    {front:'Efesios 2:8-9', back:'"Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios; no por obras, para que nadie se gloríe."'},
    {front:'Salmo 119:105', back:'"Lámpara es a mis pies tu palabra, y lumbrera a mi camino."'},
    {front:'Filipenses 4:6-7', back:'"Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones."'}
  ],
  retoContent:[
    {title:'Día 1: Juan 3:16', instructions:'Escribe el versículo 5 veces. Dilo en voz alta 10 veces. Pégalo en tu espejo. Medita en él durante el día.', reflectionPrompt:'¿Qué significa "de tal manera amó" para ti?'},
    {title:'Día 2: Filipenses 4:13', instructions:'Repite el versículo cada vez que enfrentes algo difícil hoy. "Todo lo puedo en Cristo..."', reflectionPrompt:'¿En qué necesitas fortaleza hoy?'},
    {title:'Día 3: Salmo 23:1', instructions:'Copia el Salmo 23 completo. Medita especialmente en "nada me faltará". Dios como Pastor.', reflectionPrompt:'¿Qué te falta que puedas entregar a Dios?'},
    {title:'Día 4: Jeremías 29:11', instructions:'Memoriza. Cuéntaselo a alguien que esté pasando por incertidumbre. Compartir sella la memoria.', reflectionPrompt:'¿En qué área necesitas recordar este versículo?'},
    {title:'Día 5: Proverbios 3:5-6', instructions:'Medita en "no te apoyes en tu propia prudencia". Identifica 1 área donde quieres control y suéltala.', reflectionPrompt:'¿Qué decisión necesitas entregar?'},
    {title:'Día 6: Revisa los 5 de esta semana', instructions:'Recita todos los versículos aprendidos sin mirar. Identifica cuál se te olvida más y refuérzalo.', reflectionPrompt:'¿Cuál recordaste más fácil?'},
    {title:'Día 7: Día de descanso y meditación', instructions:'Sin versículo nuevo. Elige tu favorito de la semana y medita profundamente en él por 20 min.', reflectionPrompt:'¿Cuál fue tu favorito y por qué?'}
  ]
},

{
  id:'tpl-meditacion-espiritual', name:'Meditación Espiritual',
  types:['meditacion','afirmaciones','diario','reto'],
  niche:'meditación espiritual, conexión interior', category:'Fe', subcategory:'Espiritualidad',
  description:'Conecta con tu esencia a través de la meditación, mantras y reflexión espiritual.',
  icon:'self_improvement', primaryColor:'#9333ea', secondaryColor:'#d8b4fe', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#9333ea,#d8b4fe)',
  meditationScript:'Enciende una vela si puedes. Siéntate cómodo, columna erguida, palmas hacia arriba sobre los muslos. Cierra los ojos suavemente. Respira profundo 3 veces, liberando tensiones. Lleva tu atención al centro de tu pecho, tu corazón. Siente el latido, la presencia de vida. Imagina una luz cálida en ese lugar. Esa luz eres tú, tu esencia pura. Observa cómo esa luz se expande suavemente. Llena tu cuerpo. Trasciende tu cuerpo. Te conecta con todo lo que es. No eres tu mente. No eres tus pensamientos. Eres ese espacio consciente que los observa. Descansa en ese espacio. No hay nada que hacer, solo ser. Ahora repite mentalmente: "Soy paz. Soy luz. Soy amor." Siente cómo cada palabra vibra en ti. Quédate aquí el tiempo que necesites. Cuando estés listo/a, toca suavemente tu corazón, da gracias, y abre los ojos.',
  affirmations:['Soy luz, soy amor, soy paz','Mi esencia es divina','Estoy conectado/a con todo lo que es','El universo me sostiene','Confío en mi camino','Mi intuición me guía','Soy un alma en experiencia humana','La paz que busco vive en mí','Soy uno con la fuente','Todo está bien en este momento'],
  retoContent:[
    {title:'Día 1: Meditación de presencia', instructions:'10 min sentado/a en silencio. Observa tus pensamientos sin engancharte. Son nubes pasando. Tú eres el cielo.', reflectionPrompt:'¿Qué pensamiento era más insistente?'},
    {title:'Día 2: Mantra diario', instructions:'Elige un mantra ("So Ham", "Om", "Soy paz"). Repítelo 108 veces (mala). Mantiene la mente enfocada.', reflectionPrompt:'¿Qué mantra elegiste?'},
    {title:'Día 3: Meditación caminando', instructions:'Camina 20 min en la naturaleza en silencio. Cada paso, un agradecimiento. Siente la tierra sostenerte.', reflectionPrompt:'¿Qué te conmovió?'},
    {title:'Día 4: Respiración cuadrada', instructions:'Inhala 4, sostén 4, exhala 4, sostén 4. Repite 10 min. Balancea sistema nervioso y abre intuición.', reflectionPrompt:'¿Cómo te sentiste?'},
    {title:'Día 5: Meditación del amor', instructions:'Metta: envía amor a ti, a alguien querido, a alguien neutral, a alguien difícil, a todos los seres. 3 min cada uno.', reflectionPrompt:'¿Cuál costó más?'},
    {title:'Día 6: Silencio consciente', instructions:'3 horas sin hablar, sin pantallas, sin música. Solo ser. Observa qué emerge en el silencio.', reflectionPrompt:'¿Qué surgió?'},
    {title:'Día 7: Ritual de gratitud', instructions:'Enciende vela, escribe 10 agradecimientos profundos, medita 15 min, cierra con una oración o intención.', reflectionPrompt:'¿Qué agradecimiento te emocionó?'}
  ],
  journalPrompts:['¿Qué mensaje me dio mi intuición hoy?','¿Qué sincronicidad noté?','¿Qué me está enseñando este momento de mi vida?','¿Dónde siento más conexión: naturaleza, meditación, música, arte?','¿Qué necesita soltar mi alma?','¿Qué me pide mi espíritu?']
},

// ═══════════════ FINANZAS ═══════════════

{
  id:'tpl-nogastos-30', name:'Sin Gastos Innecesarios',
  types:['reto','tracker','checklist','diario'],
  niche:'ahorro, finanzas personales, no spend', category:'Finanzas', subcategory:'Ahorro',
  description:'30 días sin gastos innecesarios para reiniciar tu relación con el dinero y ahorrar.',
  icon:'savings', primaryColor:'#15803d', secondaryColor:'#86efac', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#15803d,#86efac)',
  trackerHabit:'Hoy NO gasté en nada innecesario',
  retoContent:[
    {title:'Día 1: Define las reglas', instructions:'Esenciales: comida básica, transporte, salud, facturas. Prohibido: ropa, restaurantes, delivery, suscripciones nuevas, antojos.', reflectionPrompt:'¿Qué te será más difícil evitar?'},
    {title:'Día 2: Cancela suscripciones', instructions:'Revisa todas las suscripciones activas. Cancela las que no usas semanalmente. Streaming, gym, apps, cajas mensuales.', reflectionPrompt:'¿Cuántos pagos automáticos descubriste?'},
    {title:'Día 3: Cocina todo en casa', instructions:'Cero comida fuera. Aprovecha lo que ya tienes en despensa antes de comprar más. Inventa recetas con lo disponible.', reflectionPrompt:'¿Qué inventaste?'},
    {title:'Día 4: Lista antes de comprar', instructions:'Si DEBES comprar (esencial), haz lista antes y solo compra eso. Nada de "ya que estoy aquí".', reflectionPrompt:'¿Te tentaste con algo extra?'},
    {title:'Día 5: Disfruta sin gastar', instructions:'Hoy diviértete sin dinero: caminata, parque, llamada larga con amiga, leer, película en casa. La diversión no necesita tarjeta.', reflectionPrompt:'¿Qué descubriste?'},
    {title:'Día 6: Vende lo que no usas', instructions:'Identifica 5 cosas que no usaste en último año. Foto, publica en Wallapop/Marketplace. Espacio + dinero extra.', reflectionPrompt:'¿Qué pusiste en venta?'},
    {title:'Día 7: Suma lo ahorrado', instructions:'Calcula cuánto NO gastaste esta semana vs. tu promedio normal. Transfiere ese monto a una cuenta de ahorro.', reflectionPrompt:'¿Cuánto ahorraste?'}
  ],
  initialItems:['Cero comida fuera de casa','Cero compras impulsivas','Cancelar suscripción sin uso','Llevar termo en lugar de comprar café','No abrir apps de compras','Pagar solo en efectivo (siente el gasto)','Dormir antes de comprar (regla 24h)','Anotar cada gasto'],
  journalPrompts:['¿Cuándo compro impulsivamente? ¿Qué emoción busco?','¿Qué creencia tengo sobre el dinero?','¿En qué gastos siento culpa después?','¿Qué quiero hacer con el dinero ahorrado?','¿Cómo era el dinero en mi familia de origen?']
},

{
  id:'tpl-deudas', name:'Salir de Deudas',
  types:['roadmap','checklist','flashcards','faq'],
  niche:'deudas, libertad financiera, plan de pago', category:'Finanzas', subcategory:'Deudas',
  description:'Plan paso a paso para eliminar tus deudas usando el método bola de nieve o avalancha.',
  icon:'credit_score', primaryColor:'#dc2626', secondaryColor:'#fecaca', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#dc2626,#fecaca)',
  roadmapSteps:[
    {title:'Paso 1: Lista todas tus deudas', description:'Tarjetas, préstamos, deudas familiares. Anota: monto, interés, pago mínimo. La claridad es paso 1.'},
    {title:'Paso 2: Construye fondo de emergencia mini', description:'Ahorra primero $1000 (o equivalente local) ANTES de atacar deudas. Sin esto, cualquier imprevisto te endeuda más.'},
    {title:'Paso 3: Elige método: Bola de nieve o avalancha', description:'Bola de nieve: ataca la deuda más PEQUEÑA primero (motivación). Avalancha: ataca la de MAYOR interés (más eficiente).'},
    {title:'Paso 4: Paga mínimos en todas + extra en la elegida', description:'Mantén mínimos para no caer en mora. Todo el dinero extra va a la deuda objetivo hasta liquidar.'},
    {title:'Paso 5: Reduce gastos al máximo', description:'Cancela suscripciones, cocina todo, transporte público, cero compras innecesarias. Esto es temporal.'},
    {title:'Paso 6: Aumenta ingresos', description:'Ventas de cosas no usadas, freelance, segundo trabajo, vender skills. Cada euro extra acelera la salida.'},
    {title:'Paso 7: Negocia intereses', description:'Llama a tus tarjetas y pide reducción de interés. Si llevas tiempo siendo cliente, suelen ceder.'},
    {title:'Paso 8: Liquida y celebra', description:'Cada deuda liquidada es una victoria. Marca el hito visualmente. La sensación es adictiva, te impulsa a seguir.'}
  ],
  initialItems:['Lista total de deudas con interés y monto','Fondo emergencia mini ($1000)','Método elegido (bola/avalancha)','Pagos mínimos al día (sin mora)','Presupuesto del mes con extra para deuda','Ingreso extra mensual identificado','Llamada a tarjetas para negociar interés','Cero deuda nueva durante el plan'],
  cards:[
    {front:'Bola de nieve', back:'Atacas la deuda MENOR primero. Pagas extra ahí, mínimos en el resto. Liquidas → sigues con la siguiente. Motivación alta.'},
    {front:'Avalancha', back:'Atacas la deuda con MAYOR interés primero. Matemáticamente más eficiente. Menos motivación a corto plazo.'},
    {front:'Pago mínimo', back:'Pagar solo el mínimo en tarjetas te tendrá pagando 20+ años. La mayor parte va al interés, no al capital.'},
    {front:'Consolidación de deuda', back:'Unir varias deudas en un solo préstamo de menor interés. Útil pero solo si no generas más deuda nueva.'},
    {front:'Mora', back:'No pagar a tiempo. Genera intereses adicionales y daña tu historial crediticio. Evítala a toda costa.'},
    {front:'Tasa anual (TAE)', back:'Interés total que pagas al año (incluye comisiones). Compara siempre TAE, no solo "interés mensual".'},
    {front:'Capital vs interés', back:'Capital: lo que pediste. Interés: lo que cobra el banco. Tus pagos primero cubren interés, luego capital.'},
    {front:'Refinanciación', back:'Cambiar las condiciones de un préstamo (plazo, interés). Puede ayudar pero a veces alarga la deuda total.'}
  ],
  faqItems:[
    {q:'¿Bola de nieve o avalancha?', a:'Si necesitas motivación: bola. Si eres muy disciplinado/a: avalancha. La mejor es la que te hace seguir.'},
    {q:'¿Debo ahorrar o pagar deudas?', a:'Primero fondo emergencia mini ($1000). Luego enfoca todo en deuda. Después fondo emergencia completo (3-6 meses).'},
    {q:'¿Cancelo tarjetas al pagarlas?', a:'No necesariamente. Cerrar tarjetas afecta tu score. Mejor déjalas activas pero no las uses.'},
    {q:'¿Cuánto tarda salir de deudas?', a:'Depende del monto y tu capacidad de pago extra. Plan típico: 18-36 meses. Lo importante es empezar y no parar.'},
    {q:'¿Y si pierdo el trabajo a mitad?', a:'Por eso primero el fondo emergencia mini. Si ocurre, pagas mínimos y enfocas en sobrevivir hasta nuevo ingreso.'},
    {q:'¿Es legal negociar con bancos?', a:'Totalmente. Llama y pide quita o renegociación. Si llevas tiempo pagando, suelen aceptar.'}
  ]
},

{
  id:'tpl-presupuesto', name:'Presupuesto Inteligente',
  types:['checklist','planificador','flashcards','faq'],
  niche:'presupuesto, control de gastos, finanzas', category:'Finanzas', subcategory:'Presupuesto',
  description:'Crea y mantén un presupuesto que realmente funcione usando el método 50/30/20.',
  icon:'savings', primaryColor:'#1e40af', secondaryColor:'#93c5fd', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#1e40af,#93c5fd)',
  initialItems:['Listar todos los ingresos del mes','Categorizar gastos: necesidades / deseos / ahorro','50% necesidades (techo, comida, transporte)','30% deseos (ocio, hobbies, restaurantes)','20% ahorro e inversión','Anotar cada gasto en app o cuaderno','Revisar presupuesto cada semana','Ajustar al final del mes según realidad'],
  initialTasks:['Día 1: Calcular ingreso neto mensual','Día 2: Sumar gastos fijos (renta, luz, internet)','Día 3: Calcular promedio gastos variables (3 meses)','Día 4: Asignar % según método 50/30/20','Día 5: Configurar app de control (YNAB, Fintonic)','Día 7: Primera revisión semanal','Día 14: Ajuste de medio mes','Día 30: Cierre y planificar siguiente mes'],
  cards:[
    {front:'Método 50/30/20', back:'50% necesidades, 30% deseos, 20% ahorro/inversión. Equilibrio entre vivir hoy y construir mañana.'},
    {front:'Gasto fijo vs variable', back:'Fijo: igual cada mes (renta, internet). Variable: cambia (comida, gasolina). Los variables son donde puedes recortar.'},
    {front:'Ingreso neto', back:'Lo que te queda después de impuestos y deducciones. Es lo que realmente puedes presupuestar.'},
    {front:'Pago a uno mismo primero', back:'Apenas cobras, transfiere ahorro a cuenta separada. Lo que queda es lo que puedes gastar. Truco psicológico clave.'},
    {front:'Sobre/cuenta por categoría', back:'Asigna dinero específico a cada categoría. Cuando se acaba, se acaba. Gran disciplina.'},
    {front:'Fondo emergencia', back:'3-6 meses de gastos esenciales en cuenta líquida. Te protege de imprevistos sin endeudarte.'},
    {front:'Inflación silenciosa', back:'Gastos pequeños que crecen sin notar: suscripciones, café diario, deliveries. Suman cientos al mes.'},
    {front:'Presupuesto base cero', back:'Cada euro tiene una asignación específica antes de empezar el mes. Ingresos - gastos = 0 (todo asignado).'}
  ],
  faqItems:[
    {q:'¿Y si mis ingresos son irregulares?', a:'Calcula promedio de últimos 6-12 meses. Presupuesta sobre el ingreso más bajo. Lo extra va a ahorro/deuda.'},
    {q:'¿Qué app me recomiendas?', a:'YNAB (paga, muy completa), Fintonic (gratis, España), Mint, o simplemente Excel. La mejor es la que usarás.'},
    {q:'No puedo ahorrar 20%, ¿qué hago?', a:'Empieza con 5%. Lo importante es el hábito, no el monto. Cuando reduces gastos o subes ingresos, sube el %.'},
    {q:'¿Debo presupuestar gastos pequeños?', a:'Sí, ahí se va el dinero sin notar. Asigna una categoría "varios" si te abruma detallar todo.'},
    {q:'Mi pareja no quiere presupuestar', a:'Empieza solo/a. Cuando vea resultados, se sumará. Conversen sobre metas comunes, no sobre control.'},
    {q:'¿Es para siempre?', a:'Los primeros 3-6 meses sí, hasta tener consciencia. Luego puedes aflojar y solo monitorear las grandes categorías.'}
  ]
},

{
  id:'tpl-inversion', name:'Inversión para Principiantes',
  types:['roadmap','glosario','flashcards','faq'],
  niche:'inversión, bolsa, fondos indexados', category:'Finanzas', subcategory:'Inversión',
  description:'Empieza a invertir desde cero con conceptos claros y un plan simple a largo plazo.',
  icon:'account_balance_wallet', primaryColor:'#0e7490', secondaryColor:'#67e8f9', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#0e7490,#67e8f9)',
  roadmapSteps:[
    {title:'Paso 1: Salud financiera primero', description:'NO inviertas si tienes deudas de alto interés (>8%) o sin fondo de emergencia. Resuelve eso antes.'},
    {title:'Paso 2: Define tu horizonte', description:'¿Inviertes para 5, 10, 30 años? A más tiempo, más renta variable. A menos tiempo, más conservador.'},
    {title:'Paso 3: Define tu perfil de riesgo', description:'¿Aguantas ver tu cartera bajar 30% sin vender? Si no, empieza con perfil conservador.'},
    {title:'Paso 4: Abre cuenta en bróker', description:'Brokers populares en español: Renta4, ING Direct, Indexa Capital, Trade Republic. Compara comisiones.'},
    {title:'Paso 5: Empieza con fondos indexados', description:'Lo más simple y estadísticamente mejor para principiantes. Diversificación automática y bajas comisiones.'},
    {title:'Paso 6: Aporta sistemáticamente (DCA)', description:'Cantidad fija mensual, invertir siempre el día X. Elimina decidir cuándo entrar. Funciona mejor a largo plazo.'},
    {title:'Paso 7: NO mires todos los días', description:'La bolsa baja. Sube. Repite. Mira tu cartera 1 vez al mes máximo. Pánico = mala decisión.'},
    {title:'Paso 8: Aumenta aporte con cada subida de sueldo', description:'Pagarte primero a ti mismo crece tu patrimonio. La constancia bate al intento de "cazar el momento".'}
  ],
  glossaryTerms:[
    {term:'Acción', def:'Parte de una empresa. Si compras 1 acción de Apple, eres dueño/a de una mini-fracción de Apple.'},
    {term:'Bono', def:'Préstamo que haces a un gobierno o empresa. Te devuelven con interés. Más estable que acciones.'},
    {term:'ETF', def:'Fondo cotizado. Compras una cesta de muchas acciones con una sola operación.'},
    {term:'Fondo indexado', def:'Replica un índice (ej: S&P 500). Bajas comisiones, diversificación automática. Recomendado para principiantes.'},
    {term:'DCA (Dollar Cost Averaging)', def:'Aporte regular fijo (mensual). Compras a precio promedio. Reduce riesgo de comprar en pico.'},
    {term:'Diversificación', def:'No poner todos los huevos en una canasta. Reparte entre sectores, países, tipos de activo.'},
    {term:'Volatilidad', def:'Cuánto sube/baja un activo. Más alta = más riesgo y más potencial.'},
    {term:'Interés compuesto', def:'Interés sobre interés. La 8ª maravilla del mundo (Einstein). Por eso empezar joven importa tanto.'},
    {term:'Rentabilidad histórica', def:'Lo que ha rentado en el pasado. Bolsa global: 7-10% anual histórico. NO garantiza futuro.'},
    {term:'Comisión TER', def:'Total Expense Ratio. % anual que cobra un fondo. Busca menos de 0.3% en indexados.'}
  ],
  cards:[
    {front:'¿Cuánto necesito para empezar?', back:'Desde 50€ al mes en fondos indexados. No necesitas miles. Lo importante es empezar y ser constante.'},
    {front:'¿Mejor activo o pasivo?', back:'90% de fondos activos pierden contra el índice a 10 años. Para principiantes: indexados (pasivos) son mejor opción.'},
    {front:'Regla del 72', back:'Divide 72 entre tu rentabilidad anual = años para duplicar tu inversión. Al 7%: 10 años. Al 10%: 7 años.'},
    {front:'Asignación clásica', back:'(100 - tu edad)% en renta variable. Ej: 30 años → 70% acciones, 30% bonos. Ajusta según riesgo.'},
    {front:'Cripto: ¿sí o no?', back:'Si decides, máximo 5-10% de cartera. Alta volatilidad, alto riesgo. Nunca dinero que necesites en corto plazo.'},
    {front:'Mercado bajista', back:'Caída de 20%+ desde máximos. Suceden cada 5-10 años. NO vendas. Mantén el plan. Es cuando se compra barato.'}
  ],
  faqItems:[
    {q:'¿Es buen momento para entrar?', a:'A largo plazo: siempre. Nadie predice el corto plazo. Empieza con DCA y olvida el "timing perfecto".'},
    {q:'¿Cuánto puedo perder?', a:'A corto plazo, mucho (40%+ en crash). A largo plazo (10+ años), históricamente la bolsa global gana.'},
    {q:'¿Hacienda?', a:'Pagas impuestos al vender (ganancia patrimonial). En España: 19-28% según tramos. Fondos pueden traspasarse sin tributar.'},
    {q:'¿Necesito un asesor?', a:'No para empezar. Roboadvisors (Indexa, MyInvestor) ofrecen carteras automatizadas a bajo coste.'},
    {q:'¿Qué pasa si quiebra el broker?', a:'Tus activos están a tu nombre, no del broker. Aún si quiebra, los recuperas. Garantía de inversiones cubre 100k€.'}
  ]
},

{
  id:'tpl-libertad', name:'Libertad Financiera',
  types:['roadmap','tracker','diario','afirmaciones'],
  niche:'libertad financiera, FIRE, independencia económica', category:'Finanzas', subcategory:'Libertad',
  description:'Plan a largo plazo para alcanzar independencia financiera y vivir según tus términos.',
  icon:'account_balance_wallet', primaryColor:'#0c4a6e', secondaryColor:'#7dd3fc', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#0c4a6e,#7dd3fc)',
  trackerHabit:'Hoy ahorré/invertí algo hacia mi libertad financiera',
  roadmapSteps:[
    {title:'Fase 1: Estabilidad', description:'Sin deudas malas, fondo emergencia 6 meses, presupuesto controlado. Base para construir.'},
    {title:'Fase 2: Seguridad', description:'Inversiones que cubren gastos básicos si pierdes empleo. Plan B activo.'},
    {title:'Fase 3: Flexibilidad', description:'Patrimonio que te permite sabbatical o cambio de carrera sin estrés.'},
    {title:'Fase 4: Independencia', description:'Inversiones generan tu nivel de vida actual. Trabajar es opción, no obligación.'},
    {title:'Fase 5: Abundancia', description:'Tu patrimonio crece más rápido que lo que gastas. Libertad total + capacidad de impacto.'},
    {title:'Cálculo FIRE', description:'Multiplica tus gastos anuales × 25. Ese es tu número FIRE (regla 4%). Ej: 24k anuales → 600k para ser libre.'},
    {title:'Tasas de ahorro y tiempo', description:'Ahorrando 25%: 32 años a libertad. 50%: 17 años. 75%: 7 años. La tasa de ahorro es lo que más importa.'},
    {title:'Aumenta ingresos, no solo recortes', description:'Hay un techo en cuánto puedes recortar. No hay techo en cuánto puedes ganar. Invierte en habilidades.'}
  ],
  affirmations:['Soy capaz de construir mi libertad','Cada euro que invierto trabaja para mí','Soy disciplinado/a y constante','El tiempo es mi mejor aliado','Mi futuro yo me lo agradecerá','Vivo por debajo de mis posibilidades con orgullo','El dinero es una herramienta, no un fin','Estoy construyendo opciones, no solo riqueza','Mi patrimonio crece silenciosamente','La libertad financiera es para mí'],
  journalPrompts:['¿Qué significa libertad para mí, más allá del dinero?','Si no necesitara el dinero, ¿qué haría con mi tiempo?','¿Cuál es mi número FIRE? ¿Cómo me hace sentir saberlo?','¿Qué creencias sobre el dinero me sabotean?','¿Qué estilo de vida es realmente esencial para mí?','¿De qué me arrepentiría a los 80 años de no haber hecho?','¿Qué pequeña acción puedo tomar HOY hacia mi libertad?']
},

// ═══════════════ NEGOCIOS Y MARKETING ═══════════════

{
  id:'tpl-infoproducto', name:'Lanzar tu Infoproducto',
  types:['roadmap','checklist','planificador','faq'],
  niche:'infoproducto, curso online, emprendimiento digital', category:'Negocios', subcategory:'Infoproductos',
  description:'Plan paso a paso para crear, lanzar y vender tu primer infoproducto digital.',
  icon:'rocket_launch', primaryColor:'#2563eb', secondaryColor:'#93c5fd', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#2563eb,#93c5fd)',
  roadmapSteps:[
    {title:'Paso 1: Valida la idea', description:'Habla con 10 personas de tu audiencia. ¿Pagarían por esto? Si no obtienes 3 "sí claros", pivota.'},
    {title:'Paso 2: Define la transformación', description:'¿De qué punto A llevas al cliente al punto B? La promesa clara vende, las features no.'},
    {title:'Paso 3: Crea el esqueleto', description:'Esquema de módulos o capítulos. No es perfecto, es claro. 5-8 módulos para un curso típico.'},
    {title:'Paso 4: Graba el MVP', description:'Producción básica primero. Audio claro > video perfecto. Siempre mejorarás después con feedback real.'},
    {title:'Paso 5: Crea la página de ventas', description:'Una sola página. Estructura: problema → solución → beneficios → quién eres → prueba social → precio → FAQ → CTA.'},
    {title:'Paso 6: Lista de espera', description:'Antes del lanzamiento, construye lista con contenido gratis. Conversión 5x mayor que tráfico frío.'},
    {title:'Paso 7: Lanzamiento', description:'Ventana de venta cerrada (7-10 días). Urgencia real + bonos por acción rápida. Email diario en ventana.'},
    {title:'Paso 8: Iterar con feedback', description:'Pregunta a compradores qué falta, qué sobra. Lanza v2 mejorada. Los infoproductos son ciclos, no one-shot.'}
  ],
  initialItems:['Audiencia de mínimo 500 seguidores','Tema validado con entrevistas','Promesa clara en 1 frase','Plataforma de venta (Hotmart, Teachable, Gumroad)','Página de ventas escrita','Email automation básico','Pasarela de pago funcional','Plan de contenido de prelanzamiento (2-4 semanas)'],
  initialTasks:['Sem 1: Validar idea y encuestar','Sem 2: Esqueleto y guion','Sem 3-4: Grabación de contenido','Sem 5: Montar plataforma y página ventas','Sem 6: Prelanzamiento y lista espera','Sem 7: Lanzamiento','Sem 8: Entrega + feedback'],
  faqItems:[
    {q:'¿Cuántos seguidores necesito?', a:'500 reales y comprometidos valen más que 50k fríos. Validación de idea > tamaño de audiencia.'},
    {q:'¿Qué plataforma usar?', a:'Hotmart (España/LATAM), Gumroad (simple), Teachable/Kajabi (cursos grandes), Systeme.io (todo-en-uno barato).'},
    {q:'¿Qué precio poner?', a:'Mínimo 50€ para que sea negocio. Los baratos atraen peores clientes. Mejor resolver problema caro a pocos.'},
    {q:'¿Cuánto se tarda en crear?', a:'Primer MVP: 4-8 semanas. No busques perfección. Perfección después del primer lanzamiento.'},
    {q:'¿Y si no vendo nada?', a:'Problema 1: audiencia no calificada. Problema 2: promesa débil. Problema 3: falta prueba social. Itera y relánza.'}
  ]
},

{
  id:'tpl-freelance', name:'Primer Cliente Freelance',
  types:['roadmap','checklist','flashcards'],
  niche:'freelance, cliente, trabajo independiente', category:'Negocios', subcategory:'Freelance',
  description:'De cero a tu primer cliente pagando en 30 días, con servicios que sí se venden.',
  icon:'business_center', primaryColor:'#7c2d12', secondaryColor:'#fed7aa', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#7c2d12,#fed7aa)',
  roadmapSteps:[
    {title:'Paso 1: Elige 1 servicio específico', description:'NO "diseño gráfico". SÍ "diseño Reels para nutricionistas". Nicho + servicio = cliente claro.'},
    {title:'Paso 2: Crea portafolio aunque no tengas clientes', description:'3-5 trabajos conceptuales. Inventa briefs para marcas reales. Demuestra habilidad, no solo lista.'},
    {title:'Paso 3: Precio claro', description:'Paquete cerrado: "3 Reels al mes, 300€". Evita cotizar por hora al principio.'},
    {title:'Paso 4: Prospección directa', description:'Lista de 50 clientes ideales. Mensaje personalizado a cada uno. Ofrece algo de valor antes de pedir.'},
    {title:'Paso 5: Primera propuesta', description:'Email/DM con: problema que ves, solución concreta, resultado esperado, precio, siguiente paso.'},
    {title:'Paso 6: Cierra la primera venta', description:'No tengas miedo de cerrar. Agenda una llamada. Escucha más que hablas. Cierra con plazo.'},
    {title:'Paso 7: Entrega por encima', description:'Primer cliente = testimonio crucial. Entrega antes, comunica más, supera expectativas.'},
    {title:'Paso 8: Pide testimonio y referidos', description:'Apenas entregas, pide testimonio. "¿Conoces a alguien que necesite esto?" Los mejores clientes llegan por referidos.'}
  ],
  initialItems:['Servicio específico definido','Portafolio público (web, Behance, Instagram)','Precio paquete claro','Lista de 50 prospects','10 mensajes de prospección enviados por día','Perfil profesional (LinkedIn actualizado)','Contrato básico tipo','Facturación (autónomo, freelance tax)'],
  cards:[
    {front:'Scope creep', back:'Cliente pide más de lo acordado sin pagar extra. Soluciónalo con contrato claro y "eso está fuera del scope, cotizo aparte".'},
    {front:'Discovery call', back:'Primera llamada con prospect. Escucha problemas, no vendas. Vendes en la propuesta, no en la call.'},
    {front:'Retainer', back:'Pago mensual fijo por trabajo continuo. Más estable que proyectos sueltos.'},
    {front:'Red flag de cliente', back:'Regatea desde el primer mensaje. Exige urgencia sin pagar rush. No acepta contrato. Trabajo previo impago.'},
    {front:'Anticipo / deposit', back:'50% al firmar, 50% al entregar. Estándar. Nunca empieces sin al menos 30% pagado.'},
    {front:'Nicho vertical', back:'Especialización en tipo de cliente (nutricionistas, abogados, cafeterías). Menos competencia, precios más altos.'}
  ]
},

{
  id:'tpl-ventas', name:'Framework de Ventas',
  types:['flashcards','roadmap','glosario','faq'],
  niche:'ventas, cierre, persuasión ética', category:'Negocios', subcategory:'Ventas',
  description:'Metodología de ventas consultiva: vender sin vender, escuchar más que hablar.',
  icon:'business_center', primaryColor:'#b45309', secondaryColor:'#fcd34d', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#b45309,#fcd34d)',
  roadmapSteps:[
    {title:'Paso 1: Prospectar correctamente', description:'Cliente ideal claro. Calidad > cantidad. 10 prospects bien calificados > 100 fríos.'},
    {title:'Paso 2: Calificar (BANT)', description:'Budget, Authority, Need, Timing. Si no califica, no pierdas tiempo.'},
    {title:'Paso 3: Descubrir dolor profundo', description:'3 niveles: superficial → real → impacto emocional. Pregunta hasta llegar al dolor emocional del problema.'},
    {title:'Paso 4: Presentar solución como puente', description:'Del dolor al resultado deseado, tu servicio es el puente. No vendes features, vendes transformación.'},
    {title:'Paso 5: Manejar objeciones', description:'Precio, tiempo, urgencia. Usa "sí, y..." en lugar de "pero...". Entiende antes de responder.'},
    {title:'Paso 6: Cierre con compromiso', description:'Pregunta de cierre directa: "¿Qué necesitas para empezar hoy?" Silencio después. Primera persona que habla, pierde.'},
    {title:'Paso 7: Post-venta', description:'La venta empieza después de firmar. Onboarding claro, comunicación proactiva, underpromise/overdeliver.'}
  ],
  glossaryTerms:[
    {term:'SPIN Selling', def:'Situation, Problem, Implication, Need-payoff. Framework de preguntas para descubrir dolor.'},
    {term:'BANT', def:'Budget, Authority, Need, Timing. Criterios para calificar si un prospect vale la pena.'},
    {term:'Objeción', def:'Resistencia del prospect. No es un "no", es un "no me has convencido aún".'},
    {term:'Follow up', def:'Seguimiento tras la primera interacción. 80% de ventas se cierran en el follow up 5-12.'},
    {term:'Pipeline', def:'Prospects en cada etapa del proceso de venta. Te muestra cuánto cerrarás este mes.'},
    {term:'Cierre por alternativa', def:'"¿Prefieres empezar el lunes o miércoles?" Asume la venta, elimina la opción de "no".'},
    {term:'Prueba social', def:'Casos, testimonios, logos de clientes. Reduce riesgo percibido del prospect.'},
    {term:'LTV (Lifetime Value)', def:'Valor total que un cliente aporta. Define cuánto puedes gastar en adquirirlo.'}
  ],
  cards:[
    {front:'"Está caro"', back:'"Entiendo. ¿Comparado con qué? ¿Y cuánto te está costando no resolverlo hoy?"'},
    {front:'"Lo tengo que pensar"', back:'"Claro. ¿Qué específicamente necesitas resolver para decidir?"'},
    {front:'"No tengo presupuesto"', back:'"Si tuvieras el presupuesto, ¿es lo que necesitas? Veamos opciones que funcionen para ambos."'},
    {front:'"No es el momento"', back:'"¿Qué tendría que pasar para que sea el momento? ¿Cuánto te cuesta esperar?"'},
    {front:'"Quiero comparar opciones"', back:'"Perfecto. ¿Qué criterios son clave en tu decisión? Te ayudo a compararnos."'}
  ],
  faqItems:[
    {q:'¿Cómo vendo sin sentirme vendedor agresivo?', a:'Vende escuchando. Venta consultiva: más preguntas, menos discurso. Si tu solución ayuda, no estás presionando.'},
    {q:'¿Qué hago si no cierro ninguna venta?', a:'Revisa: calificación (prospects correctos), descubrimiento (profundidad del dolor), pedido (¿pides el cierre claramente?).'}
  ]
},

{
  id:'tpl-copywriting', name:'Copywriting que Vende',
  types:['flashcards','glosario','checklist','reto'],
  niche:'copywriting, redacción persuasiva, escritura ventas', category:'Negocios', subcategory:'Copywriting',
  description:'Aprende los frameworks de copywriting que convierten lectores en compradores.',
  icon:'business_center', primaryColor:'#831843', secondaryColor:'#fbcfe8', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#831843,#fbcfe8)',
  cards:[
    {front:'AIDA', back:'Atención, Interés, Deseo, Acción. Framework clásico de toda pieza persuasiva.'},
    {front:'PAS', back:'Problema, Agitar, Solución. Identificas el dolor, lo amplificas, ofreces salida.'},
    {front:'Headline', back:'Lo más importante. 80% del tiempo se invierte aquí. Si falla, nadie lee el resto.'},
    {front:'Lead (entrada)', back:'Primer párrafo. Engancha o pierdes al lector. Comienza con conflicto, dato impactante o pregunta.'},
    {front:'CTA (Call to Action)', back:'Acción específica que pides. Verbo + beneficio. "Descarga gratis" mejor que "Click aquí".'},
    {front:'Storytelling', back:'Historia con conflicto + transformación. Conecta emocionalmente, vende racionalmente.'},
    {front:'Beneficios vs features', back:'Feature: lo que tiene. Beneficio: lo que cambia en la vida del cliente. Vende beneficios.'},
    {front:'Objeciones preventivas', back:'Anticipa dudas y resuélvelas en el copy. "Sé que estás pensando..." muestra que conoces al lector.'},
    {front:'Urgencia genuina', back:'Plazo real, stock limitado real. Falsa urgencia mata confianza a largo plazo.'},
    {front:'Voz del cliente', back:'Usa palabras EXACTAS de tu cliente. Encuestas, reseñas, comentarios. Habla su idioma.'}
  ],
  glossaryTerms:[
    {term:'Copy', def:'Texto escrito para persuadir o vender. Diferente de "contenido" (informativo).'},
    {term:'Long-form sales page', def:'Página de ventas larga (3000+ palabras). Funciona para productos caros y complejos.'},
    {term:'Hook', def:'Gancho. Las primeras 3-5 palabras o segundos. Decide si te leen o se van.'},
    {term:'Bullet (fascinación)', def:'Puntos persuasivos en lista. Cada uno promete un beneficio o curiosidad.'},
    {term:'Garantía', def:'Reduce riesgo percibido. "30 días devolución sin preguntas" aumenta conversión 30%+.'},
    {term:'P.S.', def:'Postdata al final. Lo segundo más leído tras el headline. Úsalo para reforzar oferta o urgencia.'},
    {term:'Emoción + lógica', def:'Compramos con emoción, justificamos con lógica. Tu copy debe activar ambas.'},
    {term:'AB testing', def:'Probar dos versiones del mismo copy. Mide qué convierte más. Mejora continua.'}
  ],
  initialItems:['Investigar avatar (encuestas, reseñas)','Lista de beneficios reales (no features)','3-5 versiones de headline','Lead que enganche en 30 segundos','Bullet points específicos (no genéricos)','Prueba social (testimonios, casos)','CTA claro y único','Garantía o reducción de riesgo'],
  retoContent:[
    {title:'Día 1: Headline', instructions:'Escribe 25 versiones del mismo headline. Las primeras 10 son malas. Las últimas 5 brillan. Úsalo como práctica diaria.', reflectionPrompt:'¿Cuál te gustó más?'},
    {title:'Día 2: Reescribir tu propia bio', instructions:'Tu bio de Instagram/LinkedIn. Aplica claridad, especificidad y promesa. ¿Por qué seguirte?', reflectionPrompt:'¿Cómo cambió?'},
    {title:'Día 3: Email de lanzamiento', instructions:'Escribe el primer email de un lanzamiento ficticio. Solo 1 mensaje, 1 acción. Asunto matters más que cuerpo.', reflectionPrompt:'¿Asunto que elegiste?'},
    {title:'Día 4: Análisis competencia', instructions:'Estudia 5 sales pages exitosas en tu nicho. Anota: estructura, hooks, palabras de poder. NO copies, identifica patrones.', reflectionPrompt:'¿Qué patrón viste?'},
    {title:'Día 5: Reescribir un copy aburrido', instructions:'Toma cualquier descripción de producto aburrida (Amazon, web). Reescríbela aplicando todo lo aprendido.', reflectionPrompt:'¿Qué cambió más?'},
    {title:'Día 6: Voz del cliente', instructions:'Lee 30 reseñas/comentarios de clientes ideales. Anota frases textuales. Esa es tu próxima copy.', reflectionPrompt:'¿Qué frase te impactó?'},
    {title:'Día 7: Lanza algo', instructions:'Aplica todo a algo real: tu portfolio, oferta freelance, post de venta. La práctica supera la teoría.', reflectionPrompt:'¿Qué reacción tuvo?'}
  ]
},

{
  id:'tpl-seo', name:'SEO desde Cero',
  types:['roadmap','checklist','glosario','flashcards'],
  niche:'SEO, posicionamiento Google, tráfico orgánico', category:'Negocios', subcategory:'SEO',
  description:'Aprende SEO desde fundamentos hasta ranking en Google con un plan paso a paso.',
  icon:'business_center', primaryColor:'#1d4ed8', secondaryColor:'#bfdbfe', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#1d4ed8,#bfdbfe)',
  roadmapSteps:[
    {title:'Paso 1: Investigación de palabras clave', description:'Usa Google Keyword Planner, Ahrefs, Ubersuggest. Busca volumen + intención + dificultad baja al inicio.'},
    {title:'Paso 2: Análisis de competencia', description:'Estudia top 10 resultados de tu palabra clave. ¿Qué responden? ¿Qué les falta? Ahí está tu oportunidad.'},
    {title:'Paso 3: Optimización on-page', description:'Title, meta description, H1, H2s, URL, alt text imágenes, enlaces internos. Lo básico que muchos ignoran.'},
    {title:'Paso 4: Contenido excepcional', description:'Más completo, mejor estructurado, más útil que la competencia. Google premia el mejor recurso, no el más largo.'},
    {title:'Paso 5: Velocidad y experiencia', description:'Core Web Vitals: LCP, FID, CLS. PageSpeed Insights gratis. Hosting bueno + imágenes optimizadas.'},
    {title:'Paso 6: Backlinks de calidad', description:'Guest posts, menciones en medios, recursos enlazables. 1 link de medio top vale más que 100 de directorios.'},
    {title:'Paso 7: SEO técnico', description:'Sitemap.xml, robots.txt, schema markup, HTTPS, mobile friendly. Search Console te dice si fallas.'},
    {title:'Paso 8: Mide e itera', description:'Search Console (Google) + GA4 + tracking de posiciones. Mide cada 30 días. Ajusta lo que no funciona.'}
  ],
  glossaryTerms:[
    {term:'SERP', def:'Search Engine Results Page. Página de resultados de Google.'},
    {term:'Keyword', def:'Palabra o frase que busca el usuario. Tu objetivo es rankear para las relevantes.'},
    {term:'Long tail', def:'Keyword larga y específica (4+ palabras). Menos volumen, menos competencia, más conversión.'},
    {term:'Intención de búsqueda', def:'Por qué busca el usuario: informativa, navegacional, transaccional. Tu contenido debe coincidir.'},
    {term:'Backlink', def:'Enlace de otra web hacia la tuya. Voto de confianza para Google. Calidad > cantidad.'},
    {term:'DA / DR', def:'Domain Authority / Rating. Métrica de fuerza de un dominio (Moz / Ahrefs). Más alto = más fácil rankear.'},
    {term:'On-page SEO', def:'Lo que controlas en tu web: contenido, estructura, optimización técnica.'},
    {term:'Off-page SEO', def:'Lo que ocurre fuera: backlinks, menciones, autoridad de marca.'},
    {term:'Cannibalization', def:'Dos páginas tuyas compiten por la misma keyword. Confunde a Google. Fusiónalas.'},
    {term:'EEAT', def:'Experience, Expertise, Authority, Trust. Lo que Google evalúa para temas YMYL (salud, finanzas).'}
  ],
  initialItems:['Google Search Console configurado','Google Analytics 4 instalado','Sitemap.xml enviado','Velocidad <3 segundos','Mobile friendly (test Google)','Imágenes con alt text','Enlaces internos en cada post','Backlink strategy mensual'],
  cards:[
    {front:'Title tag óptimo', back:'50-60 caracteres. Incluye keyword principal al inicio. Marca al final. Único por página.'},
    {front:'Meta description', back:'150-160 caracteres. No es factor ranking pero sí CTR. Incluye keyword + beneficio + CTA.'},
    {front:'URL ideal', back:'Corta, con keyword, sin números/fechas. /seo-desde-cero mejor que /post-2024-04-15-seo-tutorial.'},
    {front:'H1 vs H2', back:'H1: uno por página, contiene keyword. H2: estructura del contenido, varios por página.'},
    {front:'Pillar content', back:'Artículo extenso (3000+ palabras) que cubre tema completo. Atrae enlaces y rankea para múltiples keywords.'},
    {front:'Featured snippet', back:'Caja destacada arriba de Google. Optimiza con definición clara, listas, tablas. Roba tráfico al #1.'}
  ]
},

{
  id:'tpl-email', name:'Email Marketing',
  types:['roadmap','flashcards','checklist','glosario'],
  niche:'email marketing, newsletter, automatización', category:'Negocios', subcategory:'Email',
  description:'Construye una lista de email rentable desde cero con automatizaciones y secuencias que venden.',
  icon:'business_center', primaryColor:'#0891b2', secondaryColor:'#a5f3fc', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#0891b2,#a5f3fc)',
  roadmapSteps:[
    {title:'Paso 1: Elige plataforma', description:'MailerLite (gratis hasta 1000 subs), ActiveCampaign (más completo), ConvertKit (creators), Beehiiv (newsletters).'},
    {title:'Paso 2: Lead magnet potente', description:'Algo gratis y específico que tu audiencia desea. PDF, mini-curso, checklist, plantilla. Resuelve un problema concreto.'},
    {title:'Paso 3: Landing page de captura', description:'Una página, una promesa, un formulario. Conversión típica: 25-50% si lead magnet es bueno.'},
    {title:'Paso 4: Bienvenida automática (5-7 emails)', description:'Email 1: lead magnet + bienvenida. Email 2-5: tu historia + contenido valioso. Email 6-7: soft pitch.'},
    {title:'Paso 5: Newsletter regular', description:'Frecuencia consistente: semanal o quincenal. Mejor 1 email espectacular al mes que 4 mediocres.'},
    {title:'Paso 6: Segmentación', description:'Etiqueta a tus suscriptores por interés/comportamiento. Email relevante = mejor engagement.'},
    {title:'Paso 7: Lanzamientos por email', description:'Tu lista es tu activo más rentable. Bien construida, vende 5-10x más que redes sociales.'},
    {title:'Paso 8: Limpieza periódica', description:'Cada 3-6 meses elimina inactivos. Lista limpia = mejor entregabilidad. Calidad > cantidad.'}
  ],
  cards:[
    {front:'Open rate', back:'% de personas que abren tu email. Industria: 15-25%. Si bajas de 15%, revisa asuntos y entregabilidad.'},
    {front:'Click rate', back:'% que clica en algún link. Industria: 2-5%. Mide cuánto enganchó el contenido.'},
    {front:'Asunto que abre', back:'Curiosidad + brevedad + personalización. Pregunta, número, beneficio claro. NO mayúsculas ni emojis exagerados.'},
    {front:'Pre-header', back:'Texto que aparece tras el asunto en bandeja. Complementa, no repite. Refuerza el motivo de abrir.'},
    {front:'Plain text vs HTML', back:'Plain text se siente personal y entrega mejor. HTML más visual. Para newsletters: plain text gana.'},
    {front:'Spam triggers', back:'GRATIS!!! Mayúsculas, signos de exclamación múltiples, palabras como "Viagra", "100% garantizado". Evita.'}
  ],
  initialItems:['Plataforma email elegida y configurada','Lead magnet creado','Landing page activa','Secuencia de bienvenida (5-7 emails)','Newsletter semanal/quincenal programado','Segmentación por etiquetas','Análisis mensual de métricas','Limpieza trimestral de inactivos'],
  glossaryTerms:[
    {term:'Open rate', def:'% de emails abiertos. Mide qué tan buenos son tus asuntos.'},
    {term:'Click-through rate (CTR)', def:'% de receptores que hicieron click en algún enlace.'},
    {term:'Bounce rate', def:'% de emails que no llegaron. Hard bounce = email inválido. Limpia regularmente.'},
    {term:'Unsubscribe rate', def:'% que se borra. Normal: <0.5%. Si sube, revisa frecuencia y relevancia.'},
    {term:'Lead magnet', def:'Recurso gratis a cambio del email. Mejor un mini-curso específico que un ebook genérico.'},
    {term:'Tag/Segmento', def:'Etiqueta para clasificar suscriptores. Permite enviar emails relevantes a cada grupo.'},
    {term:'Automatización', def:'Secuencia de emails programados que se envían según trigger (suscripción, compra, etc).'},
    {term:'Deliverability', def:'Capacidad de llegar a inbox y no spam. Depende de reputación de remitente y calidad de lista.'}
  ]
},

// ═══════════════ EDUCACIÓN ═══════════════

{
  id:'tpl-ingles-30', name:'Inglés desde Cero',
  types:['reto','flashcards','glosario','faq'],
  niche:'inglés, idiomas, aprender inglés', category:'Educación', subcategory:'Idiomas',
  description:'30 días para construir base sólida en inglés con vocabulario, gramática y práctica diaria.',
  icon:'translate', primaryColor:'#1e3a8a', secondaryColor:'#bfdbfe', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#1e3a8a,#bfdbfe)',
  retoContent:[
    {title:'Día 1: Pronunciación básica', instructions:'Vocales del inglés. Hay 12 sonidos vocálicos vs 5 en español. Mira un video de "vowel sounds" y repite cada uno 5 veces.', reflectionPrompt:'¿Qué sonido te costó más?'},
    {title:'Día 2: 50 palabras esenciales', instructions:'Aprende los 50 sustantivos más usados: water, food, time, day, year, man, woman... Crea oraciones simples con cada uno.', reflectionPrompt:'¿Cuántos pudiste recordar?'},
    {title:'Día 3: Verbo "to be" en presente', instructions:'I am, you are, he/she/it is, we are, they are. Forma 10 oraciones afirmativas, 5 negativas, 5 preguntas.', reflectionPrompt:'¿Qué te confunde?'},
    {title:'Día 4: Presente simple', instructions:'I work, you work, he works (tercera persona +s). Estructura: Sujeto + verbo. 15 oraciones sobre tu rutina diaria.', reflectionPrompt:'¿Cómo describes tu día?'},
    {title:'Día 5: Escuchar 10 min nativo', instructions:'Podcast para principiantes (BBC Learning English, Coffee Break English). Sin subtítulos primero. Luego repite con subs.', reflectionPrompt:'¿Cuánto entendiste?'},
    {title:'Día 6: Conversación contigo mismo', instructions:'5 minutos hablando solo en inglés. Describe lo que ves. Aunque sea con errores. Romper el bloqueo es clave.', reflectionPrompt:'¿Cómo te sentiste?'},
    {title:'Día 7: App diaria', instructions:'Instala Duolingo o Babbel. 15 min al día sin falta. La consistencia es 90% del éxito en idiomas.', reflectionPrompt:'¿Qué app elegiste?'}
  ],
  cards:[
    {front:'Hello / Hi', back:'Hola. "Hi" es más informal.'},
    {front:'Thank you', back:'Gracias. Más formal: "Thanks a lot".'},
    {front:'I am from Spain', back:'Soy de España. Estructura: Sujeto + verbo + lugar.'},
    {front:'How are you?', back:'¿Cómo estás? Respuesta clásica: "I\'m fine, thanks. And you?"'},
    {front:'What\'s your name?', back:'¿Cuál es tu nombre? Respuesta: "My name is..."'},
    {front:'I don\'t understand', back:'No entiendo. Útil cuando alguien habla rápido.'},
    {front:'Could you repeat?', back:'¿Podrías repetir? Más amable que "Repeat please".'},
    {front:'Where is the bathroom?', back:'¿Dónde está el baño? Frase de supervivencia 101.'},
    {front:'How much is it?', back:'¿Cuánto cuesta? Esencial para viajar.'},
    {front:'I would like...', back:'Me gustaría... Forma educada de pedir cualquier cosa.'}
  ],
  glossaryTerms:[
    {term:'Phrasal verb', def:'Verbo + preposición que cambia el significado. "Get up" = levantarse. "Look for" = buscar.'},
    {term:'Idiom', def:'Expresión cuyo significado no es literal. "It\'s raining cats and dogs" = llueve a cántaros.'},
    {term:'False friend', def:'Palabra que parece igual al español pero significa algo distinto. "Embarrassed" = avergonzado, NO embarazada.'},
    {term:'Tense (tiempo verbal)', def:'Presente, pasado, futuro. El inglés tiene 12 tiempos verbales. Los más usados: simple present, simple past, present continuous.'},
    {term:'Article', def:'A/An (indefinido), the (definido). Regla: "an" antes de sonido vocálico (an apple, NOT a apple).'},
    {term:'Pronoun', def:'I, you, he, she, it, we, they. Sustituyen al sustantivo.'},
    {term:'Conditional', def:'"Si... entonces". Cuatro tipos. El más usado: First conditional ("If it rains, I will stay home").'}
  ],
  faqItems:[
    {q:'¿Cuánto tiempo para hablar inglés?', a:'15 min/día constante: 1-2 años para nivel B2 (conversación fluida). Sin constancia, nunca.'},
    {q:'¿Mejor app o profesor?', a:'App para vocabulario y gramática. Profesor (incluso online) para conversación. Combinación es lo mejor.'},
    {q:'¿Subtítulos en inglés o español?', a:'Empieza con español. Luego inglés. Luego sin subtítulos. Progresión natural.'},
    {q:'¿Y el acento?', a:'No te obsesiones. La meta es ser entendido, no perfecto. El acento llega con años de práctica.'}
  ]
},

{
  id:'tpl-habitos', name:'Productividad y Hábitos',
  types:['reto','tracker','checklist','flashcards'],
  niche:'productividad, hábitos, gestión tiempo', category:'Educación', subcategory:'Productividad',
  description:'Construye hábitos productivos sostenibles aplicando ciencia conductual y sistemas.',
  icon:'school', primaryColor:'#facc15', secondaryColor:'#fef08a', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#facc15,#fef08a)',
  trackerHabit:'Hoy completé mi rutina productiva clave',
  retoContent:[
    {title:'Día 1: Identifica los 3 grandes', instructions:'Cada noche, define las 3 tareas más importantes del día siguiente. Si solo logras esas, el día es exitoso.', reflectionPrompt:'¿Cuáles fueron tus 3?'},
    {title:'Día 2: Time blocking', instructions:'Bloquea horas específicas para tareas. "10-12am: trabajo profundo. 12-1pm: emails." El calendario decide, no el humor.', reflectionPrompt:'¿Cómo te fue?'},
    {title:'Día 3: Pomodoro', instructions:'25 min trabajo + 5 descanso. Cada 4 ciclos, descanso largo (15 min). Crea sentido de urgencia.', reflectionPrompt:'¿Lograste mantener foco?'},
    {title:'Día 4: Eat the frog', instructions:'Haz primero la tarea más difícil/temida. Lo demás del día se siente fácil después.', reflectionPrompt:'¿Cuál era tu sapo?'},
    {title:'Día 5: Single tasking', instructions:'Hoy SOLO una cosa a la vez. Cierra pestañas, silencia notificaciones. La multitarea es ineficiencia disfrazada.', reflectionPrompt:'¿Notas la diferencia?'},
    {title:'Día 6: Habit stacking', instructions:'Encadena hábitos: "Después de mi café, escribo 30 min". Aprovecha hábitos existentes para construir nuevos.', reflectionPrompt:'¿Qué stack creaste?'},
    {title:'Día 7: Review semanal', instructions:'Revisa la semana: qué funcionó, qué no, qué ajustar. Sin review no hay mejora real.', reflectionPrompt:'¿Mayor aprendizaje?'}
  ],
  initialItems:['Definir 3 tareas top de mañana','Bloque de trabajo profundo (90 min)','Cero notificaciones en bloque profundo','Pausas conscientes (no scroll)','Hidratación y movimiento','Cerrar laptop a hora fija','Review diario 5 min','Review semanal 30 min'],
  cards:[
    {front:'Trabajo profundo', back:'Concentración total sin interrupciones. Cal Newport. 2-4h al día son suficientes para gran impacto.'},
    {front:'Trabajo superficial', back:'Tareas administrativas, emails, reuniones. Necesarias pero no muevan la aguja. Limítalas.'},
    {front:'Ley de Parkinson', back:'El trabajo se expande para llenar el tiempo asignado. Pon plazos cortos para forzar eficiencia.'},
    {front:'Regla de los 2 minutos', back:'Si toma menos de 2 min, hazlo ahora. Evita acumular pendientes triviales.'},
    {front:'Inbox zero', back:'Procesar bandeja a vacío 1-2 veces/día. NO vivir en email. Decide: responder, archivar, agendar, eliminar.'},
    {front:'Habit stacking', back:'Anclar hábito nuevo a uno existente. "Después de X, haré Y". Aumenta probabilidad de éxito.'},
    {front:'2 minute rule (hábitos)', back:'Reduce hábito a 2 min para empezar. "Leer" → "abrir el libro". Después es fácil seguir.'},
    {front:'Atomic habits', back:'Mejora 1% diaria = 37x al año. Pequeños cambios consistentes vencen grandes esfuerzos puntuales.'}
  ]
},

{
  id:'tpl-escritura-30', name:'Escritura Creativa',
  types:['reto','diario','flashcards'],
  niche:'escritura creativa, creatividad, contar historias', category:'Educación', subcategory:'Escritura',
  description:'30 días de prompts creativos para desbloquear tu voz como escritor/a.',
  icon:'draw', primaryColor:'#7c3aed', secondaryColor:'#ddd6fe', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#7c3aed,#ddd6fe)',
  retoContent:[
    {title:'Día 1: Página en blanco', instructions:'Escribe lo que sea durante 15 minutos sin parar. No edites. No juzgues. Free writing despeja la mente.', reflectionPrompt:'¿Qué descubriste?'},
    {title:'Día 2: Describe un objeto', instructions:'Elige un objeto cotidiano y descríbelo en 200 palabras como si nunca lo hubieras visto. Ojo nuevo = creatividad.', reflectionPrompt:'¿Qué objeto elegiste?'},
    {title:'Día 3: Diálogo', instructions:'Escribe una conversación de 1 página entre dos personajes que se acaban de conocer. Solo diálogo, sin descripciones.', reflectionPrompt:'¿Cómo se sintió?'},
    {title:'Día 4: Memoria sensorial', instructions:'Elige un recuerdo y descríbelo enfocándote en los 5 sentidos: vista, oído, olfato, tacto, gusto.', reflectionPrompt:'¿Qué sentido fue más fuerte?'},
    {title:'Día 5: Cambia el final', instructions:'Toma una historia conocida (cuento, película) y reescribe los últimos 200 palabras con un final completamente diferente.', reflectionPrompt:'¿Qué historia elegiste?'},
    {title:'Día 6: Carta al pasado', instructions:'Escribe una carta a tu yo de hace 10 años. ¿Qué le dirías? ¿Qué le advertirías? ¿Qué celebrarías?', reflectionPrompt:'¿Qué sentiste?'},
    {title:'Día 7: Microcuento (100 palabras)', instructions:'Cuenta una historia completa en exactamente 100 palabras: principio, conflicto, final. Disciplina de la concisión.', reflectionPrompt:'¿De qué trató?'}
  ],
  journalPrompts:['¿Qué historia llevo dentro y nunca conté?','Si escribiera un libro, ¿de qué sería?','¿Qué personaje me obsesiona y por qué?','Describe a tu mejor amigo/a sin nombrarlo/a.','¿Qué imagen recurrente aparece en mis sueños?','Escribe la primera línea de 5 historias diferentes.','¿Qué moraleja querría dejar?'],
  cards:[
    {front:'Show, don\'t tell', back:'Muestra a través de acción/diálogo, no expliques. "Estaba enojado" → "Cerró la puerta de un golpe."'},
    {front:'Personaje memorable', back:'Tiene contradicciones, deseo claro, voz única. No son perfectos. Sus defectos los hacen humanos.'},
    {front:'Conflicto', back:'Sin conflicto no hay historia. Interno (vs uno mismo), externo (vs otro), o contra entorno.'},
    {front:'Tres actos', back:'Setup (planteamiento) → Confrontación (escalada) → Resolución. Estructura clásica que funciona.'},
    {front:'Gancho de inicio', back:'Primera frase debe enganchar. Acción, pregunta, dato impactante. NO descripciones largas.'},
    {front:'Voz del autor', back:'Tu sello único. Surge de escribir mucho. No la fuerces, encuéntrala escribiendo.'}
  ]
},

{
  id:'tpl-programacion', name:'Aprende Programación',
  types:['roadmap','glosario','flashcards','faq'],
  niche:'programación, código, desarrollador', category:'Educación', subcategory:'Programación',
  description:'Roadmap para aprender a programar desde cero hasta tu primer proyecto real.',
  icon:'code', primaryColor:'#16a34a', secondaryColor:'#86efac', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#16a34a,#86efac)',
  roadmapSteps:[
    {title:'Paso 1: Elige el lenguaje correcto', description:'Web: JavaScript. Datos/IA: Python. Mobile: Swift/Kotlin. Para empezar: Python o JavaScript.'},
    {title:'Paso 2: Fundamentos sólidos', description:'Variables, tipos de datos, condicionales, loops, funciones, estructuras (arrays, objetos). 4-6 semanas.'},
    {title:'Paso 3: Resolver problemas', description:'Codewars, LeetCode (easy), exercism. La práctica vence a los tutoriales infinitos.'},
    {title:'Paso 4: Primer proyecto pequeño', description:'Calculadora, lista de tareas, conversor. Pequeño pero completo. Mejor terminar 1 que empezar 10.'},
    {title:'Paso 5: Git y GitHub', description:'Control de versiones es esencial. Aprende: clone, add, commit, push, pull, branch, merge.'},
    {title:'Paso 6: Framework moderno', description:'Web: React, Vue. Backend: Node.js, Django. Especialízate en uno antes de saltar al siguiente.'},
    {title:'Paso 7: Proyectos reales en GitHub', description:'3-5 proyectos completos públicos. Es tu portafolio. Mejor que cualquier diploma.'},
    {title:'Paso 8: Aplica a empleos junior', description:'Después de 6-12 meses constantes. No esperes "saberlo todo". Aprenderás el 80% en el trabajo.'}
  ],
  glossaryTerms:[
    {term:'Variable', def:'Espacio en memoria con un nombre que guarda un valor. Como una caja etiquetada.'},
    {term:'Función', def:'Bloque de código reutilizable. Recibe entradas, devuelve resultado.'},
    {term:'API', def:'Application Programming Interface. Forma estándar de comunicación entre programas.'},
    {term:'Framework', def:'Conjunto de herramientas y reglas que aceleran el desarrollo. Ej: React para web.'},
    {term:'Bug', def:'Error en el código que causa comportamiento inesperado. Debugging = corregirlos.'},
    {term:'Stack', def:'Conjunto de tecnologías usadas. Frontend + backend + base de datos = full stack.'},
    {term:'Open source', def:'Código libre y abierto. Cualquiera puede ver, usar, contribuir. Linux, React son open source.'},
    {term:'Algoritmo', def:'Receta paso a paso para resolver un problema. Lo que escribes en cualquier lenguaje.'},
    {term:'Variable global vs local', def:'Global: accesible desde todo el código. Local: solo dentro de una función.'},
    {term:'Refactor', def:'Reescribir código para mejorarlo sin cambiar su funcionamiento. Limpieza necesaria.'}
  ],
  cards:[
    {front:'Variable', back:'`let nombre = "Ana";` — Guarda un valor con un nombre.'},
    {front:'Función', back:'`function saludar(nombre) { return "Hola " + nombre; }` — Bloque reutilizable.'},
    {front:'If/else', back:'`if (edad >= 18) { console.log("adulto"); } else { console.log("menor"); }`'},
    {front:'For loop', back:'`for (let i = 0; i < 10; i++) { console.log(i); }` — Repite código.'},
    {front:'Array', back:'`let frutas = ["manzana", "pera", "uva"];` — Lista ordenada de elementos.'},
    {front:'Object', back:'`let usuario = { nombre: "Ana", edad: 30 };` — Estructura clave-valor.'},
    {front:'Comentario', back:'`// esto es un comentario` — No se ejecuta. Para explicar el código.'},
    {front:'Console.log', back:'Imprime en consola. Tu mejor herramienta de debugging al inicio.'}
  ],
  faqItems:[
    {q:'¿Qué lenguaje aprender primero?', a:'Python por simplicidad, JavaScript por versatilidad. Cualquiera de los dos es buena elección.'},
    {q:'¿Necesito carrera universitaria?', a:'No. Bootcamps + autodidacta + portfolio fuerte funcionan. Muchas empresas ya no piden título.'},
    {q:'¿Cuánto tiempo para conseguir empleo?', a:'6-18 meses con dedicación seria (3+ horas diarias). Depende de constancia y portfolio.'},
    {q:'¿Soy muy mayor para empezar?', a:'No. Hay developers que empezaron a los 40+. Lo que importa es la actitud y constancia.'},
    {q:'¿Necesito ser bueno en matemáticas?', a:'Para programación general no. Para ML/data science sí. Para web/apps básicas, álgebra básica basta.'}
  ]
},

{
  id:'tpl-estudio', name:'Técnicas de Estudio',
  types:['flashcards','checklist','roadmap','faq'],
  niche:'estudio, aprendizaje, técnicas estudiantiles', category:'Educación', subcategory:'Estudio',
  description:'Aprende a estudiar mejor con técnicas científicamente probadas, no estudiando más horas.',
  icon:'school', primaryColor:'#0d9488', secondaryColor:'#5eead4', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#0d9488,#5eead4)',
  roadmapSteps:[
    {title:'Paso 1: Active recall', description:'En lugar de releer, hazte preguntas y responde sin mirar. La mejor técnica científicamente probada.'},
    {title:'Paso 2: Repetición espaciada', description:'Repasa en intervalos crecientes (día 1, 3, 7, 14, 30). Anki es la mejor app gratis para esto.'},
    {title:'Paso 3: Pomodoro', description:'25 min foco + 5 descanso. La pausa consolida memoria. Productivo > horas frente a libro.'},
    {title:'Paso 4: Mapas mentales', description:'Conecta conceptos visualmente. Ayuda a ver el "todo" antes de profundizar partes.'},
    {title:'Paso 5: Enseñar lo aprendido', description:'Técnica Feynman: explica el tema como si fueras profesor de un niño. Si no puedes, no lo entiendes.'},
    {title:'Paso 6: Variar contextos', description:'Cambia de lugar de estudio. La memoria se asocia con entorno. Variarlo mejora retención.'},
    {title:'Paso 7: Sueño y ejercicio', description:'El cerebro consolida durante el sueño. 7-9h. Ejercicio aeróbico aumenta neurogénesis.'}
  ],
  cards:[
    {front:'Active recall', back:'Forzarte a recordar sin mirar el material. Hazte preguntas, responde, verifica. Mucho mejor que releer.'},
    {front:'Repetición espaciada', back:'Repasar en intervalos crecientes (1, 3, 7, 14, 30 días). Aprovecha la curva del olvido.'},
    {front:'Curva del olvido (Ebbinghaus)', back:'Olvidamos 50% en 1 hora si no repasamos. Repasos espaciados frenan el olvido.'},
    {front:'Técnica Feynman', back:'1) Elige tema. 2) Explícalo simple (como a un niño). 3) Identifica huecos. 4) Vuelve al material y repite.'},
    {front:'Interleaving', back:'Mezclar temas en una sesión vs estudiar uno solo (blocking). Mejor retención a largo plazo.'},
    {front:'Doble codificación', back:'Combinar palabras + imágenes. Más rutas en cerebro = mejor recall.'},
    {front:'Subrayado', back:'Sobrevalorado. Da ilusión de aprendizaje sin recall real. Mejor: notas con tus palabras.'},
    {front:'Releer', back:'Técnica menos efectiva. Da familiaridad sin retención profunda. Sustituye por active recall.'}
  ],
  initialItems:['Plan semanal con metas claras','Sesiones Pomodoro (25/5)','Active recall en lugar de releer','Anki o flashcards físicas','Resumen con palabras propias','Sueño 7-9h','Ejercicio aeróbico 3x semana','Eliminar redes durante estudio'],
  faqItems:[
    {q:'¿Cuántas horas debo estudiar?', a:'Calidad > cantidad. 3-4h con Pomodoro y active recall vencen 8h pasivas. Es agotador; descansa.'},
    {q:'¿Música mientras estudio?', a:'Instrumental o sonidos blancos sí. Música con letra distrae si lees/escribes.'},
    {q:'¿Estudio mañana o noche?', a:'Cuando tu cerebro esté más alerta. Para la mayoría: mañana. Pero conoce tu cronotipo.'},
    {q:'¿Anki o cuaderno?', a:'Anki para memorizar (vocabulario, fechas, fórmulas). Cuaderno para entender (mapas, esquemas).'}
  ]
},

{
  id:'tpl-lectura', name:'Club de Lectura',
  types:['reto','tracker','diario'],
  niche:'lectura, libros, hábito lector', category:'Educación', subcategory:'Lectura',
  description:'Construye el hábito de leer todos los días con un reto progresivo de 30 días.',
  icon:'menu_book', primaryColor:'#854d0e', secondaryColor:'#fde68a', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#854d0e,#fde68a)',
  trackerHabit:'Hoy leí al menos 20 minutos',
  retoContent:[
    {title:'Día 1: Define tu por qué', instructions:'¿Por qué quieres leer más? ¿Aprender, escapar, crecer? Escribe tu motivo. Te guiará en días flojos.', reflectionPrompt:'¿Cuál es tu razón?'},
    {title:'Día 2: Elige el libro adecuado', instructions:'No empieces con "Guerra y paz". Elige algo accesible que TE atrape. Ficción ligera, biografía, autoayuda.', reflectionPrompt:'¿Qué libro elegiste?'},
    {title:'Día 3: Establece hora fija', instructions:'Lee a la misma hora cada día. Mañana al despertar o noche antes de dormir suelen ser ideales.', reflectionPrompt:'¿Qué hora elegiste?'},
    {title:'Día 4: 15 minutos sin distracciones', instructions:'Teléfono en otra habitación. Solo tú y el libro. Sin pausas para revisar nada. Construye foco.', reflectionPrompt:'¿Cómo estuvo tu mente?'},
    {title:'Día 5: Subraya o anota', instructions:'Marca pasajes que te impactan. Comprometerse con el libro fija ideas y te hace lector activo, no pasivo.', reflectionPrompt:'¿Qué subrayaste?'},
    {title:'Día 6: Comparte una idea', instructions:'Escribe a alguien o publica una idea del libro. Compartir consolida lo aprendido.', reflectionPrompt:'¿Cuál compartiste?'},
    {title:'Día 7: Aumenta a 30 min', instructions:'Si lograste 15 min consistentes, sube a 30. Avance gradual evita rebote.', reflectionPrompt:'¿Cómo va el libro?'}
  ],
  journalPrompts:['¿Qué idea del libro de hoy quiero recordar?','Si tuviera que resumir el capítulo en 3 frases, ¿cuáles serían?','¿Con qué personaje me identifico y por qué?','¿Cómo aplico esto a mi vida?','¿Qué pregunta me deja este libro?','¿Qué estoy evitando enfrentar que el libro toca?']
},

// ═══════════════ RELACIONES ═══════════════

{
  id:'tpl-pareja-21', name:'Conexión en Pareja',
  types:['reto','diario','checklist','afirmaciones'],
  niche:'pareja, relación, conexión emocional', category:'Relaciones', subcategory:'Pareja',
  description:'21 días para reavivar la conexión y profundizar la intimidad emocional con tu pareja.',
  icon:'favorite', primaryColor:'#e11d48', secondaryColor:'#fda4af', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#e11d48,#fda4af)',
  retoContent:[
    {title:'Día 1: Las 36 preguntas', instructions:'Existen 36 preguntas (Arthur Aron) que generan intimidad. Hagan las primeras 12 hoy en una cita relajada.', reflectionPrompt:'¿Qué descubrieron?'},
    {title:'Día 2: Cita sin tecnología', instructions:'2 horas sin teléfonos. Una caminata, un café. Solo presencia mutua. Redescubre lo que les hizo enamorarse.', reflectionPrompt:'¿Cómo se sintió?'},
    {title:'Día 3: 5 cosas que admiras', instructions:'Dile a tu pareja 5 cosas específicas que admiras de él/ella. Que sean concretas, no genéricas.', reflectionPrompt:'¿Cómo reaccionó?'},
    {title:'Día 4: Lenguaje del amor', instructions:'Identifica el lenguaje principal de tu pareja: palabras, tiempo, regalos, contacto, actos de servicio. Hoy expresa amor en SU lenguaje.', reflectionPrompt:'¿Cuál es el suyo?'},
    {title:'Día 5: Conversación profunda', instructions:'Hagan una pregunta poderosa: "¿Qué sueño que aún no has cumplido?" Escuchen sin interrumpir, sin juzgar.', reflectionPrompt:'¿Qué aprendiste?'},
    {title:'Día 6: Reparación de un pequeño conflicto', instructions:'Si hay algo pendiente sin hablar, ábrelo con ternura. "Me gustaría hablar de... ¿es un buen momento?"', reflectionPrompt:'¿Cómo lo manejaron?'},
    {title:'Día 7: Ritual de cierre semanal', instructions:'Cada domingo: "¿Qué fue lo mejor de la semana? ¿Qué nos gustaría diferente la próxima?" Crea hábito de revisar juntos.', reflectionPrompt:'¿Lo continuarán?'}
  ],
  initialItems:['Cita semanal sin pantallas','Conversación de 30 min sin tema "logístico"','Demostrar amor en SU lenguaje','Agradecer 1 cosa específica al día','Contacto físico no sexual (abrazo largo)','Apoyar un sueño/proyecto del otro','Resolver conflictos sin "ganar"','Ritual de cierre semanal'],
  affirmations:['Elijo el amor cada día','Mi pareja es mi compañero/a, no mi adversario/a','Comunico desde el corazón, no desde el ego','Soy capaz de amar y ser amado/a profundamente','Construyo este amor con acciones diarias','Escucho para entender, no para responder','Honro las diferencias entre nosotros','Soy paciente conmigo y con mi pareja','Nuestra relación crece cada día','Merecemos ser felices juntos'],
  journalPrompts:['¿Qué admiré de mi pareja hoy?','¿En qué necesito mejorar como pareja?','¿Qué emoción no me atrevo a expresarle?','¿Qué hábito está dañando nuestra conexión?','¿Cómo era nuestra relación al principio? ¿Qué se perdió?','¿Qué le pediría a mi pareja si supiera que diría sí?']
},

{
  id:'tpl-embarazo', name:'Primer Trimestre Embarazo',
  types:['checklist','faq','tracker','diario'],
  niche:'embarazo, primer trimestre, maternidad', category:'Relaciones', subcategory:'Embarazo',
  description:'Acompaña tu primer trimestre con información clara, checklists y journaling.',
  icon:'pregnant_woman', primaryColor:'#ec4899', secondaryColor:'#fbcfe8', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#ec4899,#fbcfe8)',
  trackerHabit:'Tomé ácido fólico hoy',
  initialItems:['Confirmar embarazo (test + análisis sangre)','Cita con ginecólogo/a','Ácido fólico 400mcg diario','Eliminar alcohol y tabaco','Reducir cafeína (<200mg/día)','Evitar carnes crudas y pescados altos en mercurio','Hidratarse 2-2.5L agua diarios','Vitaminas prenatales','Investigar baja por maternidad','Empezar diario de embarazo'],
  faqItems:[
    {q:'¿Qué puedo y qué no puedo comer?', a:'Sí: variedad nutritiva. No: alcohol, sushi crudo, embutidos sin curar, quesos sin pasteurizar, atún rojo, hígado en exceso.'},
    {q:'¿Es normal tanto cansancio?', a:'Sí. La progesterona dispara fatiga en T1. Descansa más, no luches contra ello. Mejorará en T2.'},
    {q:'¿Las náuseas son malas señales?', a:'Al contrario. Asociadas con embarazo más estable. Suelen mejorar en semana 12-14.'},
    {q:'¿Puedo hacer ejercicio?', a:'Sí, si ya entrenabas. Adapta intensidad. Caminar, yoga prenatal, natación son ideales. Evita deportes de impacto/contacto.'},
    {q:'¿Cuándo debo decirlo?', a:'Decisión personal. Muchos esperan a semana 12 (pasado mayor riesgo de aborto). Otros lo dicen antes para tener apoyo.'},
    {q:'¿Cuántas ecografías hay?', a:'En España: 3 obligatorias (semana 12, 20, 32). Pueden hacer más según seguimiento.'},
    {q:'¿Puedo seguir trabajando?', a:'Sí, salvo riesgos específicos. Comunica si tu trabajo implica químicos, peso, radiación.'},
    {q:'¿Y los antojos extraños?', a:'Normal y aún sin explicación científica clara. Si son por sustancias no comestibles (tierra, hielo): hierro bajo, consulta.'}
  ],
  journalPrompts:['¿Cómo me sentí hoy físicamente y emocionalmente?','¿Qué miedos tengo sobre la maternidad/paternidad?','¿Qué le quiero decir a mi bebé hoy?','¿Cómo está respondiendo mi pareja/familia?','¿Qué cambio me cuesta más asumir?','¿Qué expectativa quiero soltar?']
},

{
  id:'tpl-crianza', name:'Crianza Respetuosa 0-3',
  types:['faq','checklist','flashcards','glosario'],
  niche:'crianza respetuosa, primeros años, parentalidad positiva', category:'Relaciones', subcategory:'Crianza',
  description:'Guía de crianza respetuosa para los primeros 3 años con bases científicas.',
  icon:'family_restroom', primaryColor:'#7e22ce', secondaryColor:'#e9d5ff', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#7e22ce,#e9d5ff)',
  faqItems:[
    {q:'¿Hasta qué edad colechar?', a:'Decisión familiar. Es seguro siguiendo guías AEPED. Algunos hasta 1-2 años, otros más. No hay edad correcta.'},
    {q:'¿Lactancia o biberón?', a:'OMS recomienda lactancia exclusiva 6m, complementada hasta 2 años. Biberón también es opción válida si no se puede o no se elige amamantar.'},
    {q:'¿Cómo manejar las rabietas?', a:'Valida la emoción ("entiendo que estás enfadado"). Mantén calma. No castigues. La emoción no se controla, se acompaña.'},
    {q:'¿Cuándo introducir BLW o purés?', a:'A partir de 6m si cumple señales (sienta solo, interés, pinza). BLW respeta autonomía. Purés son válidos también.'},
    {q:'¿Pantallas a esta edad?', a:'AEPED recomienda 0 pantallas <2 años. Entre 2-5 años: máximo 1h diaria de contenido educativo con adulto.'},
    {q:'¿Cómo enseñar límites sin castigos?', a:'Límites claros + empatía + consecuencias naturales. "No puedo dejarte pegar. Veo que estás enfadado." Sin amenazas.'},
    {q:'¿Cuándo dejar pañal?', a:'Entre 2-3 años, según señales del niño (interés, control esfínteres, comunica). NO antes ni con presión.'},
    {q:'¿Es malo el chupete?', a:'No. Útil para succión no nutritiva. Retirar gradualmente entre 2-3 años para evitar maloclusión dental.'}
  ],
  initialItems:['Validar emociones siempre','Establecer rutinas predecibles','Tiempo de juego sin pantallas','Lectura diaria (5-15 min)','Contacto físico abundante','No comparar con otros niños','Cuidar mi propio descanso','Pareja unida en criterios de crianza'],
  cards:[
    {front:'Apego seguro', back:'Vínculo emocional estable. Bebé sabe que su cuidador responde. Base de salud mental adulta.'},
    {front:'Autorregulación', back:'Capacidad de manejar emociones. NO se aprende sola. Se desarrolla con co-regulación del adulto (calma compartida).'},
    {front:'Berrinche/rabieta', back:'Descarga emocional normal. Cerebro inmaduro no puede regular. Acompañar > castigar.'},
    {front:'Periodo sensible (Montessori)', back:'Etapas óptimas para aprender ciertas habilidades: orden (0-3), lenguaje (0-6), movimiento (0-5).'},
    {front:'BLW (Baby-Led Weaning)', back:'Alimentación dirigida por el bebé. Sin purés. Trozos blandos para que coma con manos. Promueve autonomía.'},
    {front:'Co-regulación', back:'El adulto regula su propia emoción primero. Su calma se transmite al niño que aún no sabe regularse solo.'}
  ],
  glossaryTerms:[
    {term:'Crianza respetuosa', def:'Estilo basado en respeto a las necesidades infantiles, sin gritos, castigos ni amenazas. Pone límites con empatía.'},
    {term:'Disciplina positiva', def:'Marco creado por Jane Nelsen. Combina firmeza y amabilidad. Enseña habilidades sin castigos.'},
    {term:'Consecuencia natural', def:'Resultado lógico de una acción, sin imponer. "Si no te abrigas, tendrás frío." Aprendizaje real.'},
    {term:'Rabieta vs berrinche', def:'Misma cosa. Crisis emocional normal en niños 1-4 años. Cerebro inmaduro no regula aún.'},
    {term:'Lactancia a demanda', def:'Amamantar cuando el bebé pida, sin horarios. OMS recomienda esto al menos hasta 6m.'},
    {term:'Apego (teoría)', def:'John Bowlby. Vínculo emocional bebé-cuidador determina su sentido de seguridad y relaciones futuras.'},
    {term:'Hito del desarrollo', def:'Logro esperado a cierta edad: caminar (12-18m), primeras palabras (12m), frases (24m).'}
  ]
},

{
  id:'tpl-comunicacion', name:'Comunicación Asertiva',
  types:['reto','flashcards','diario','roadmap'],
  niche:'comunicación, asertividad, relaciones', category:'Relaciones', subcategory:'Comunicación',
  description:'Aprende a expresar lo que sientes y necesitas con respeto, claridad y firmeza.',
  icon:'forum', primaryColor:'#0369a1', secondaryColor:'#7dd3fc', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#0369a1,#7dd3fc)',
  retoContent:[
    {title:'Día 1: Identifica tu estilo', instructions:'¿Pasivo (no dices lo que sientes), agresivo (atacas), pasivo-agresivo (sarcasmo, indirectas) o asertivo? Reconócelo sin juicio.', reflectionPrompt:'¿Cuál es tu patrón?'},
    {title:'Día 2: Mensajes en YO', instructions:'Sustituye "tú me haces enojar" por "yo me siento enojada cuando...". Te apropias de tu emoción sin atacar.', reflectionPrompt:'¿Cómo se sintió?'},
    {title:'Día 3: Decir NO sin culpa', instructions:'Hoy di NO a algo que normalmente aceptarías por compromiso. "No puedo en este momento" es suficiente, sin justificar.', reflectionPrompt:'¿A quién y a qué dijiste no?'},
    {title:'Día 4: Pedir lo que necesitas', instructions:'Identifica algo que necesitas y nadie sabe porque no lo has pedido. Pídelo claro y directo, sin esperar que adivinen.', reflectionPrompt:'¿Qué pediste?'},
    {title:'Día 5: Escucha activa', instructions:'En tu próxima conversación: parafrasea lo que el otro dice antes de responder. "Entonces, lo que escucho es..."', reflectionPrompt:'¿Cómo cambió la conversación?'},
    {title:'Día 6: Manejar críticas', instructions:'Si te critican, no contraataques. Pregunta: "¿Puedes ser más específico?" Distingue crítica útil de descalificación.', reflectionPrompt:'¿Cómo lo manejaste?'},
    {title:'Día 7: Conversación difícil pendiente', instructions:'Esa conversación que evitas. Hoy ábrela con: "Necesito hablar de algo importante. ¿Cuándo es buen momento?"', reflectionPrompt:'¿La tuviste?'}
  ],
  cards:[
    {front:'Comunicación asertiva', back:'Expresar pensamientos, sentimientos y necesidades con respeto. Ni pasivo ni agresivo. Punto medio sano.'},
    {front:'Mensaje en YO', back:'"Yo me siento [emoción] cuando [situación]". No acusa. Permite al otro escuchar sin defenderse.'},
    {front:'Escucha activa', back:'Atención plena al otro. Parafrasear, hacer preguntas, validar antes de opinar.'},
    {front:'Disco rayado', back:'Repetir tu posición con calma cuando el otro insiste. "Entiendo, y mi respuesta sigue siendo no."'},
    {front:'Banco de niebla', back:'Reconocer parte de la crítica sin ceder lo esencial. "Puede que tengas razón. Aún así, mi decisión es..."'},
    {front:'Aserción negativa', back:'Aceptar errores sin desmoronarse. "Sí, fue mi error, lo corrijo." Sin sobreexplicar ni autoflagelarse.'},
    {front:'Preguntar para clarificar', back:'En lugar de asumir, pregunta. "¿A qué te refieres exactamente?" Evita malentendidos.'},
    {front:'Validar emoción del otro', back:'"Entiendo que te sientas así." NO es estar de acuerdo, es reconocer su experiencia. Reduce conflicto.'}
  ],
  journalPrompts:['¿Qué necesidad estoy callando?','¿A quién no me atrevo a decirle algo importante?','¿Qué patrón heredé de mi familia en comunicación?','¿Cuándo evito conflicto a costa mía?','¿Cómo me sentí la última vez que dije NO?','Carta que escribiría sin enviar a alguien que me hizo daño.'],
  roadmapSteps:[
    {title:'Paso 1: Auto-conocimiento', description:'Identifica tu estilo actual y disparadores. Sin juicio. La consciencia es el primer paso.'},
    {title:'Paso 2: Vocabulario emocional', description:'Aprende a nombrar lo que sientes con precisión. No "mal" sino "frustrado, decepcionado, herido".'},
    {title:'Paso 3: Mensajes en YO', description:'Reescribe tus quejas habituales como mensajes en YO. Practica en bajo riesgo.'},
    {title:'Paso 4: Decir NO', description:'Empieza diciendo no a cosas pequeñas. Construye músculo. No requiere justificación.'},
    {title:'Paso 5: Pedir explícitamente', description:'Identifica necesidades no expresadas. Pídelas con claridad. La gente no lee mentes.'},
    {title:'Paso 6: Conversaciones difíciles', description:'Aborda lo que evitabas. Prepárate, pide momento adecuado, mantén foco. La incomodidad pasa.'}
  ]
},

{
  id:'tpl-codependencia', name:'Superar la Codependencia',
  types:['diario','afirmaciones','roadmap','flashcards'],
  niche:'codependencia, dependencia emocional, amor propio', category:'Relaciones', subcategory:'Codependencia',
  description:'Identifica patrones de codependencia y construye relaciones saludables desde el amor propio.',
  icon:'diamond', primaryColor:'#9f1239', secondaryColor:'#fda4af', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#9f1239,#fda4af)',
  affirmations:['Yo no soy responsable de las emociones de otros','Mi valor no depende de ser necesitado/a','Puedo amar sin perderme','Soltar no es abandonar','Merezco amor que no exija renunciar a mí','Pongo límites desde el amor, no desde el miedo','Mi felicidad es mi responsabilidad','No tengo que rescatar a nadie','Estoy completo/a sin pareja','Mi paz vale más que su aprobación'],
  journalPrompts:['¿En qué relaciones me pierdo a mí mismo/a?','¿A quién intento "salvar" y por qué?','¿Qué necesidades propias ignoro por atender a otros?','¿Cómo era el amor en mi familia de origen?','¿Qué temo si pongo un límite?','¿Quién soy cuando estoy sola/o?','¿Qué emoción evito cuando la otra persona se molesta?'],
  roadmapSteps:[
    {title:'Paso 1: Reconocer los patrones', description:'Necesitar aprobación constante, dificultad para decir no, sentirte responsable de emociones ajenas, perderte en relaciones.'},
    {title:'Paso 2: Sanar la herida raíz', description:'La codependencia suele venir de heridas de infancia (abandono, rechazo, padres ausentes/exigentes). Reconócelo.'},
    {title:'Paso 3: Reconstruir identidad propia', description:'¿Quién eres fuera de tus relaciones? Hobbies, valores, sueños. Recupera lo perdido.'},
    {title:'Paso 4: Aprender a poner límites', description:'Empezar pequeño. "No, gracias." "Necesito tiempo para pensar." "Esto no me funciona." Práctica.'},
    {title:'Paso 5: Tolerar el malestar del otro', description:'Cuando pones límites, otros se molestan. Aprender a NO ceder por su incomodidad. Su reacción no es tu responsabilidad.'},
    {title:'Paso 6: Diferenciar empatía de absorber', description:'Sentir CON el otro, no SER el otro. Puedes acompañar sin perderte.'},
    {title:'Paso 7: Soltar el rol de salvador/a', description:'Las personas tienen su propio camino. Tú no puedes/debes resolverles la vida. Es respeto, no abandono.'},
    {title:'Paso 8: Disfrutar de tu propia compañía', description:'Aprender a estar contigo. Comer sola/o, viajar sola/o, disfrutar el silencio. Es liberador.'}
  ],
  cards:[
    {front:'Codependencia', back:'Patrón donde tu autoestima depende de los demás. Necesitas ser necesitado/a. Pierdes identidad en relaciones.'},
    {front:'Síndrome del rescatador', back:'Sentirte responsable de "salvar" a otros (parejas con problemas, familia disfuncional). Drena tu energía.'},
    {front:'Hipervigilancia emocional', back:'Estar siempre pendiente de cómo se siente el otro para anticipar y agradar. Agotador.'},
    {front:'Límite saludable', back:'Decirle al otro qué te funciona y qué no. No es muralla. Es claridad sobre tu espacio.'},
    {front:'Amor propio', back:'Tratar a ti mismo/a con la misma compasión que a un buen amigo. Base de relaciones sanas.'},
    {front:'Apego ansioso', back:'Estilo de apego donde necesitas reasegurarte constantemente. Miedo intenso al abandono. Trabajable en terapia.'}
  ]
},

// ═══════════════ BELLEZA ═══════════════

{
  id:'tpl-skincare-30', name:'Skincare Nocturna',
  types:['reto','checklist','glosario','faq'],
  niche:'skincare, cuidado piel, rutina nocturna', category:'Belleza', subcategory:'Skincare',
  description:'30 días para construir una rutina nocturna efectiva sin gastar fortunas en productos.',
  icon:'spa', primaryColor:'#db2777', secondaryColor:'#fbcfe8', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#db2777,#fbcfe8)',
  retoContent:[
    {title:'Día 1: Conoce tu piel', instructions:'Identifica tu tipo: grasa, seca, mixta, sensible. Test del kleenex 2h tras lavar: brillos = mixta/grasa.', reflectionPrompt:'¿Qué tipo eres?'},
    {title:'Día 2: Doble limpieza', instructions:'Aceite/balm primero (quita SPF, maquillaje), luego limpiador acuoso (limpia poro). Esencial si usas SPF a diario.', reflectionPrompt:'¿Notas diferencia?'},
    {title:'Día 3: Tónico hidratante', instructions:'Olvida los astringentes con alcohol. Usa tónico hidratante (ácido hialurónico, glicerina). Capa fina, golpear con dedos.', reflectionPrompt:'¿Cómo se siente?'},
    {title:'Día 4: Sérum de tratamiento', instructions:'Elige SOLO uno: vitamina C (mañana, antiox), niacinamida (poros, manchas), retinol (antiedad, lento). NO mezclar todos.', reflectionPrompt:'¿Cuál elegiste?'},
    {title:'Día 5: Hidratante', instructions:'Crema según tipo. Grasa: gel ligero. Seca: textura rica. Sella la hidratación. Aplica en piel ligeramente húmeda.', reflectionPrompt:'¿Cómo amaneció tu piel?'},
    {title:'Día 6: Contorno de ojos opcional', instructions:'No esencial pero útil. Cafeína para bolsas, péptidos para arrugas, hidratante para ojeras secas.', reflectionPrompt:'¿Lo necesitas?'},
    {title:'Día 7: SPF mañana siempre', instructions:'El paso más importante. SPF50 todos los días, llueva o haga sol, en interior si hay ventanas. Previene 90% del envejecimiento.', reflectionPrompt:'¿Cuál SPF te gusta?'}
  ],
  initialItems:['Doble limpieza','Tónico hidratante','UN sérum de tratamiento','Hidratante adecuada al tipo','SPF50 cada mañana SIEMPRE','Cambiar funda almohada cada 3 días','Tomar 2L agua','Dormir 7-8 horas (skin sleep)'],
  glossaryTerms:[
    {term:'AHA', def:'Alfahidroxiácidos (glicólico, láctico). Exfolian superficie. Para luminosidad, manchas. Usar de noche.'},
    {term:'BHA', def:'Ácido salicílico. Penetra poro graso. Ideal piel grasa, acné, comedones.'},
    {term:'Niacinamida', def:'Vitamina B3. Reduce poros, manchas, regula sebo, calma rojeces. Apta todos los tipos.'},
    {term:'Retinol', def:'Forma de vitamina A. Acelera renovación celular. Antiedad y antiacné. Empezar 1-2 veces/semana.'},
    {term:'Ácido hialurónico', def:'Hidratante que retiene 1000x su peso en agua. Aplica en piel húmeda, sella con crema.'},
    {term:'Vitamina C', def:'Antioxidante potente. Aclara, ilumina, protege. Aplicar de mañana antes de SPF.'},
    {term:'Péptidos', def:'Cadenas de aminoácidos. Estimulan colágeno. Antiedad sin irritar.'},
    {term:'Ceramidas', def:'Lípidos naturales de la piel. Restauran barrera cutánea. Pieles secas o sensibles los aman.'},
    {term:'SPF (FPS)', def:'Factor de protección solar. SPF30 = 97%, SPF50 = 98%. Reaplica cada 2h al aire libre.'},
    {term:'Comedón', def:'Poro obstruido. Abierto = punto negro. Cerrado = bolita blanca. Tratar con BHA, no apretar.'}
  ],
  faqItems:[
    {q:'¿En qué orden aplico los productos?', a:'De más líquido a más denso: limpieza → tónico → sérum → contorno → crema → SPF (mañana).'},
    {q:'¿Puedo usar retinol y vitamina C juntos?', a:'No al mismo tiempo. Vitamina C de mañana, retinol de noche. O alterna noches.'},
    {q:'¿Por qué me sale más acné desde que empecé skincare?', a:'Purga inicial con ácidos/retinol. Dura 4-6 semanas. Si dura más, algo no funciona para ti.'},
    {q:'¿Productos caros vs farmacia?', a:'Farmacia (CeraVe, La Roche-Posay, Eucerin) suele ser igual o mejor que lujo. El precio no garantiza calidad.'},
    {q:'¿A qué edad empezar antiedad?', a:'25-30 años buen momento. Antes: solo SPF y limpieza/hidratación. La prevención es la mejor "antiedad".'},
    {q:'¿Mancarillas sirven?', a:'Hidratantes sí, ocasionales. No sustituyen rutina. Las que prometen "borrar arrugas en 1 uso" son marketing.'}
  ]
},

{
  id:'tpl-colorimetria', name:'Descubre tus Colores',
  types:['flashcards','glosario','faq','checklist'],
  niche:'colorimetría, estilo personal, paleta de colores', category:'Belleza', subcategory:'Colorimetría',
  description:'Identifica tu paleta personal y aprende a vestir colores que te favorecen.',
  icon:'spa', primaryColor:'#9333ea', secondaryColor:'#e9d5ff', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#9333ea,#e9d5ff)',
  cards:[
    {front:'Subtono cálido', back:'Venas verdosas, pelo dorado/cobre, piel marfil/dorada, ojos cálidos. Te favorecen tonos tierra, mostaza, coral.'},
    {front:'Subtono frío', back:'Venas azuladas, pelo cenizo/oscuro, piel rosada/porcelana, ojos azules/grises. Te favorecen joya, fucsia, azul real.'},
    {front:'Subtono neutro', back:'Venas mixtas, pelo castaño medio. Te favorecen tanto cálidos como fríos. Más versatilidad.'},
    {front:'Primavera', back:'Cálida + clara + brillante. Coral, melocotón, turquesa, amarillo limón, verde primavera.'},
    {front:'Verano', back:'Fría + clara + suave. Lavanda, rosa palo, azul cielo, gris perla, verde menta.'},
    {front:'Otoño', back:'Cálida + oscura + suave. Mostaza, terracota, oliva, marrón chocolate, óxido.'},
    {front:'Invierno', back:'Fría + oscura + brillante. Rojo cereza, fucsia, azul real, esmeralda, blanco puro, negro.'},
    {front:'Test del oro y plata', back:'Pruébate joyería de oro vs plata sobre piel. La que te ilumina marca tu subtono (oro = cálido, plata = frío).'}
  ],
  glossaryTerms:[
    {term:'Subtono', def:'Tono debajo de tu piel. Cálido (amarillo/dorado), frío (rosa/azul), neutro (mezcla).'},
    {term:'Estación cromática', def:'Sistema 12 estaciones (4 base × 3 variantes). Define tu paleta personal.'},
    {term:'Paleta personal', def:'Conjunto de colores que armonizan con tu coloración natural. Te ven más fresca/o.'},
    {term:'Color de impacto', def:'Color que te hace destacar más. Suele ser uno saturado de tu paleta.'},
    {term:'Color base', def:'Neutros de tu paleta (negro, blanco, beige, marrón, gris) que combinan con todo.'},
    {term:'Drape test', def:'Prueba con telas de colores junto al rostro para ver cuáles iluminan vs apagan.'},
    {term:'Saturación', def:'Intensidad del color. Brillante (saturado) vs apagado (suave).'},
    {term:'Valor', def:'Claridad u oscuridad de un color. Pastel = claro. Burdeos = oscuro.'}
  ],
  faqItems:[
    {q:'¿Cómo sé mi subtono sin ayuda?', a:'Mira tus venas con luz natural: verde = cálido, azul/violeta = frío. Test oro vs plata. ¿Te bronceas o te quemas?'},
    {q:'¿Puedo usar colores fuera de mi paleta?', a:'Sí, pero úsalos en piezas alejadas del rostro (zapatos, pantalón). Cerca del rostro: tu paleta.'},
    {q:'¿Y si soy un color "no recomendado" pero me encanta?', a:'Úsalo. La colorimetría es guía, no ley. Lo más importante es cómo te sientes.'},
    {q:'¿Mi color de pelo afecta mi paleta?', a:'Sí. Si te tiñes radicalmente, tu paleta puede cambiar. Lo natural es la referencia base.'},
    {q:'¿Vale la pena un análisis profesional?', a:'Si lo dudas mucho, sí. Detecta matices que solo ves en persona. Inversión de 50-150€ para mejorar todo tu armario.'}
  ],
  initialItems:['Identificar tu subtono','Identificar tu estación cromática','Lista de 5 colores que te favorecen','Lista de 3 colores a evitar cerca del rostro','Renovar 1 prenda al mes con tus colores','Probar colores nuevos en accesorios primero','Foto de cara con cada color (comparar)','Maquillaje en tonos de tu paleta']
},

{
  id:'tpl-capsula', name:'Cápsula de Armario',
  types:['checklist','roadmap','flashcards'],
  niche:'armario cápsula, minimalismo, estilo personal', category:'Belleza', subcategory:'Estilo',
  description:'Crea un armario cápsula con 30-40 piezas que combinan entre sí y reflejan tu estilo.',
  icon:'spa', primaryColor:'#475569', secondaryColor:'#cbd5e1', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#475569,#cbd5e1)',
  initialItems:['Camiseta blanca básica','Camiseta negra básica','Jeans bien cortados (azul oscuro)','Pantalón sastre','Vestido negro versátil','Camisa blanca clásica','Blazer atemporal','Cárdigan o suéter neutro','Falda midi','Chaqueta cuero o denim','Trench o gabardina','Zapatillas blancas','Botines neutros','Bailarinas o mocasines','Tacones nude/negros','Bolso medianos neutros','Cinturón básico','Pañuelo o accesorio statement','Pijama bonito','Ropa interior funcional'],
  roadmapSteps:[
    {title:'Paso 1: Vacía tu armario', description:'Saca TODO. Sí, todo. Es el único modo de ver lo que realmente tienes.'},
    {title:'Paso 2: Categoriza por uso', description:'Tres montones: "uso semanal", "uso ocasional", "no uso hace 1 año". El último: regalar/vender.'},
    {title:'Paso 3: Define tu estilo', description:'Crea moodboard en Pinterest. ¿Clásico, casual, romántico, edgy? Te guía en compras futuras.'},
    {title:'Paso 4: Identifica vacíos', description:'¿Faltan básicos? ¿Te faltan zapatos cómodos? Lista lo que necesitas, no lo que quieres.'},
    {title:'Paso 5: Compra calidad estratégica', description:'Una camisa blanca buena vs cinco baratas. Inversión en básicos paga 10 años, fast fashion 1 estación.'},
    {title:'Paso 6: Regla 1 entra, 1 sale', description:'Si compras algo nuevo, sale algo viejo. Mantén el armario en su número óptimo.'},
    {title:'Paso 7: Renueva por temporada', description:'2 veces al año revisa. Lo que no usaste en 1 año, fuera. Tu cápsula evoluciona contigo.'}
  ],
  cards:[
    {front:'Cápsula de armario', back:'Conjunto reducido de prendas que combinan entre sí. Origen: Susie Faux, 1970s.'},
    {front:'Pieza statement', back:'Prenda llamativa que es centro del look. Combina con básicos. Una a la vez en outfit.'},
    {front:'Básicos', back:'Prendas neutras y atemporales que combinan con todo. Inversión justificada en calidad.'},
    {front:'CPW (Cost Per Wear)', back:'Coste total ÷ veces usado. Una prenda de 200€ usada 100 veces = 2€ por uso. Más barato que fast fashion.'},
    {front:'Slow fashion', back:'Comprar menos pero mejor. Marcas éticas, calidad, atemporalidad. Anti fast fashion.'},
    {front:'Color base', back:'2-3 colores neutros principales (negro, blanco, beige, marino). 70% del armario.'},
    {front:'Color acento', back:'1-2 colores adicionales que aportan personalidad. 20% del armario.'},
    {front:'Versatilidad', back:'Una prenda que crea 5+ outfits diferentes. Métrica clave para incluir en tu cápsula.'}
  ]
},

// ═══════════════ HOGAR ═══════════════

{
  id:'tpl-limpieza-21', name:'Limpia tu Casa',
  types:['reto','checklist','planificador'],
  niche:'limpieza, hogar, organización', category:'Hogar', subcategory:'Limpieza',
  description:'21 días para una limpieza profunda zona por zona, sin agotarte un fin de semana entero.',
  icon:'home', primaryColor:'#0891b2', secondaryColor:'#a5f3fc', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#0891b2,#a5f3fc)',
  retoContent:[
    {title:'Día 1: Cocina - encimeras', instructions:'Despeja todo, limpia a fondo encimeras, azulejos y campana. Solo deja lo esencial visible.', reflectionPrompt:'¿Qué quitarás permanentemente?'},
    {title:'Día 2: Cocina - electrodomésticos', instructions:'Microondas (vapor con limón), nevera (vacía y limpia), horno. 30 min cada uno máximo.', reflectionPrompt:'¿Cuál estaba peor?'},
    {title:'Día 3: Baño - sanitarios', instructions:'Inodoro, lavamanos, ducha/bañera. Antical en grifería. Vinagre + bicarbonato son tus aliados.', reflectionPrompt:'¿Olor diferente?'},
    {title:'Día 4: Salón - polvo y superficies', instructions:'Quita polvo de muebles, marcos, electrónica. De arriba a abajo. Aspirar después.', reflectionPrompt:'¿Cuánto polvo?'},
    {title:'Día 5: Dormitorio - sábanas y colchón', instructions:'Cambia sábanas, aspira colchón, voltéalo si es posible. Bicarbonato 30 min antes de aspirar quita olores.', reflectionPrompt:'¿Mejor descanso?'},
    {title:'Día 6: Suelos toda la casa', instructions:'Aspirar y fregar TODA la casa. Esquinas y debajo de muebles incluidos. Música ayuda mucho.', reflectionPrompt:'¿Cuánto tardaste?'},
    {title:'Día 7: Mantenimiento diario', instructions:'15 min al día: cama hecha, cocina recogida, baño con paño rápido. Previene grandes limpiezas.', reflectionPrompt:'¿Cuál hábito mantendrás?'}
  ],
  initialItems:['Hacer la cama al despertar','Lavar trastes después de cada comida','15 min de orden antes de dormir','Lavadora 2-3 veces por semana','Aspirar zonas de paso 2x semana','Limpieza profunda una zona por semana','Tirar 1 cosa al día (declutter)','Cambiar sábanas semanal'],
  initialTasks:['Lunes: Cocina','Martes: Baño','Miércoles: Salón','Jueves: Dormitorio','Viernes: Lavandería + suelos','Sábado: Limpieza profunda zona del mes','Domingo: Descanso o planificación'],
},

{
  id:'tpl-minimalismo', name:'Declutter 30 Días',
  types:['reto','checklist','diario','afirmaciones'],
  niche:'minimalismo, declutter, ordenar', category:'Hogar', subcategory:'Minimalismo',
  description:'30 días para soltar lo que no necesitas y ganar espacio físico y mental.',
  icon:'home', primaryColor:'#525252', secondaryColor:'#d4d4d4', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#525252,#d4d4d4)',
  retoContent:[
    {title:'Día 1: Tira 1 cosa', instructions:'Cualquier cosa. Algo roto, vencido, sin uso. Establece el ritual: 1 cosa al día = 30 cosas al mes.', reflectionPrompt:'¿Qué tiraste?'},
    {title:'Día 2: Suelta 5 prendas', instructions:'Ropa que no usas hace 1 año. Si dudas, ponla en una caja "¿la extraño?". Si en 3 meses no la abriste, fuera.', reflectionPrompt:'¿Por qué la guardabas?'},
    {title:'Día 3: Cajón del cajón', instructions:'Ese cajón con cosas misceláneas. Vacíalo. Tira basura. Encuentra hogar a lo útil. 30 min.', reflectionPrompt:'¿Qué encontraste?'},
    {title:'Día 4: Libros que no leerás', instructions:'Sé honesto. ¿Lo leerás? Si no en este año, dónalo. Otro lo disfrutará. Liberar libros = liberar expectativas.', reflectionPrompt:'¿Cuántos donaste?'},
    {title:'Día 5: Productos vencidos', instructions:'Cocina, baño, botiquín. Tira lo vencido sin culpa. Caducó porque no lo necesitabas.', reflectionPrompt:'¿Cuántos productos?'},
    {title:'Día 6: Sentimentales', instructions:'Lo más difícil. Foto de objetos antes de soltar. El recuerdo no vive en el objeto, vive en ti.', reflectionPrompt:'¿Qué soltaste?'},
    {title:'Día 7: Digital declutter', instructions:'Borra apps que no usas, fotos repetidas, mails viejos. El espacio digital también pesa.', reflectionPrompt:'¿Cuánto liberaste?'}
  ],
  initialItems:['Tirar 1 cosa al día','Caja "¿la extraño?" para dudas','Donar mensual','Cero compras impulsivas','Pregúntate "¿lo amo o uso?" antes de comprar','Espacio antes de comprar nuevo','Una entrada, una salida','Mantenimiento mensual'],
  affirmations:['Menos cosas, más libertad','Mi valor no está en lo que poseo','Suelto sin culpa lo que ya cumplió su propósito','Mi espacio es mi paz','Compro con intención, no con impulso','Menos es realmente más','Mi mente se calma con espacio físico','Lo que sale crea lugar para lo nuevo','El recuerdo vive en mí, no en el objeto','Menos tener, más ser'],
  journalPrompts:['¿Por qué guardo cosas que no uso?','¿Qué emoción me cuesta soltar junto a este objeto?','¿Cómo me siento en mi espacio actual?','¿Qué definición de éxito heredé que incluía "tener mucho"?','¿Qué haría con el dinero que no gasté esta semana?']
},

{
  id:'tpl-jardin', name:'Jardín en Casa',
  types:['roadmap','checklist','glosario','faq'],
  niche:'jardinería, plantas, huerto urbano', category:'Hogar', subcategory:'Jardinería',
  description:'Crea tu primer jardín o huerto urbano paso a paso, aunque tengas poco espacio.',
  icon:'eco', primaryColor:'#16a34a', secondaryColor:'#86efac', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#16a34a,#86efac)',
  roadmapSteps:[
    {title:'Paso 1: Evalúa tu espacio', description:'Luz: ¿cuántas horas de sol directo? Eso define qué plantas pueden vivir ahí.'},
    {title:'Paso 2: Empieza fácil', description:'Plantas resistentes para principiantes: pothos, sansevieria, suculentas, cintas, monstera mini.'},
    {title:'Paso 3: Macetas con drenaje', description:'Crítico. Sin agujeros = raíz podrida = planta muerta. Plato debajo o autoriego.'},
    {title:'Paso 4: Sustrato adecuado', description:'No tierra del jardín. Sustrato universal o específico (cactus para suculentas, ácido para hortensias).'},
    {title:'Paso 5: Riego según planta', description:'No riegues por calendario. Mete dedo en tierra: si está húmeda, NO riegues. Mata más exceso que falta.'},
    {title:'Paso 6: Luz adecuada', description:'Plantas tropicales: luz indirecta brillante. Suculentas/cactus: sol directo. Cero luz = mueren todas.'},
    {title:'Paso 7: Reproducción', description:'Esquejes en agua o tierra. Multiplica gratis. Pothos, monstera, suculentas son fáciles de reproducir.'}
  ],
  initialItems:['Identificar luz disponible','Elegir 3 plantas resistentes','Macetas con drenaje','Sustrato universal de calidad','Regadera o pulverizador','Calendario de riego adaptado','Limpieza ocasional de hojas','Fertilizar primavera-verano'],
  glossaryTerms:[
    {term:'Sustrato', def:'Mezcla donde crece la planta. NO es tierra de jardín. Tiene perlita, turba, compost.'},
    {term:'Drenaje', def:'Capacidad de la maceta de evacuar agua. Esencial. Sin él, raíces se pudren.'},
    {term:'Esqueje', def:'Trozo de planta cortado para reproducir. Algunas en agua, otras directo en tierra.'},
    {term:'Trasplante', def:'Cambiar planta a maceta más grande cuando raíces llenan la actual. Cada 1-2 años.'},
    {term:'Fertilizante NPK', def:'Nitrógeno (hojas), Fósforo (flores), Potasio (raíces/frutos). Diluir bien siempre.'},
    {term:'Cochinilla / pulgón', def:'Plagas comunes. Tratar con jabón potásico, agua + alcohol, o aceite de neem.'},
    {term:'Estrés hídrico', def:'Falta o exceso de agua. Síntomas: hojas amarillas (exceso), caídas (falta).'},
    {term:'Floración', def:'Periodo en que la planta da flores. Algunas necesitan reposo invernal para florecer en primavera.'}
  ],
  faqItems:[
    {q:'¿Cuánto regar mis plantas?', a:'Depende de la planta, maceta, luz, humedad. Mete el dedo: si está húmedo, NO. Mejor regar menos.'},
    {q:'¿Por qué se ponen amarillas las hojas?', a:'Causa más común: exceso de agua. También: falta de luz, falta de nutrientes, o cambio de estación normal.'},
    {q:'¿Mis plantas pueden vivir sin sol directo?', a:'Sí, muchas. Pothos, sansevieria, ZZ, monstera viven con luz indirecta brillante.'},
    {q:'¿Necesito fertilizar?', a:'En primavera-verano sí, cada 2-4 semanas diluido. Otoño-invierno no.'},
    {q:'¿Por qué mi suculenta se "estira"?', a:'Falta de luz. Se llama etiolación. Mueve a sitio más luminoso. Es irreversible la parte estirada.'}
  ]
},

{
  id:'tpl-zerowaste', name:'Zero Waste',
  types:['reto','checklist','flashcards','glosario'],
  niche:'zero waste, sostenibilidad, vida sin residuos', category:'Hogar', subcategory:'Sostenibilidad',
  description:'30 días para reducir tus residuos y vivir más sostenible sin volverse extremo.',
  icon:'home', primaryColor:'#15803d', secondaryColor:'#bbf7d0', bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg,#15803d,#bbf7d0)',
  retoContent:[
    {title:'Día 1: Auditoría de tu basura', instructions:'Una semana sin tirar nada (lleva contigo en bolsa). El final de semana revisa: ¿de qué es 80% tu basura?', reflectionPrompt:'¿Qué descubriste?'},
    {title:'Día 2: Botella reutilizable', instructions:'Compra una botella buena (acero, vidrio). NUNCA más agua embotellada. Ahorras dinero + plástico.', reflectionPrompt:'¿Cuántas botellas evitarás?'},
    {title:'Día 3: Bolsas de tela', instructions:'5+ bolsas de tela siempre en mochila/coche. Cero bolsas plásticas en compra. Hábito que dura años.', reflectionPrompt:'¿Las llevaste hoy?'},
    {title:'Día 4: Termo para café', instructions:'Si tomas café fuera, lleva termo. Cafeterías suelen aceptarlo y a veces dan descuento.', reflectionPrompt:'¿Lo probaste?'},
    {title:'Día 5: Compra a granel', instructions:'Identifica tienda granel cerca. Frutos secos, legumbres, cereales sin envase. Lleva tarros propios.', reflectionPrompt:'¿Encontraste alguna?'},
    {title:'Día 6: Compostaje básico', instructions:'Restos orgánicos (cáscaras, café, hojas) en compostera. 30% de tu basura desaparece y nutres plantas.', reflectionPrompt:'¿Es viable para ti?'},
    {title:'Día 7: Productos higiene reutilizables', instructions:'Discos desmaquillantes lavables, copa menstrual, cepillo de bambú, navaja. Pequeños cambios, gran impacto.', reflectionPrompt:'¿Cuál cambiaste?'}
  ],
  initialItems:['Botella reutilizable siempre','Bolsas de tela en mochila','Termo para café','Tuppers para llevar','Comprar a granel','Compostaje básico','Productos higiene reutilizables','Cero comida desperdiciada'],
  cards:[
    {front:'5R del zero waste', back:'Refuse (rechazar lo innecesario), Reduce, Reuse, Recycle, Rot (compostar). En ese orden.'},
    {front:'Compostaje doméstico', back:'Restos orgánicos + secos (hojas, cartón) + aire + tiempo = abono gratis. 6 meses para tener.'},
    {front:'Compra a granel', back:'Lleva tarros propios. Compras la cantidad exacta que necesitas. Cero envases.'},
    {front:'Greenwashing', back:'Marketing engañoso de "ecológico". Lee etiquetas. Productos realmente sostenibles son discretos.'},
    {front:'Huella de carbono', back:'CO2 que tu vida emite. Calcula con apps. Identifica dónde reducir más impacto.'},
    {front:'Microplásticos', back:'Partículas <5mm. Vienen de ropa sintética, cosméticos, embalajes. Acaban en agua y alimentos.'}
  ],
  glossaryTerms:[
    {term:'Zero waste', def:'Filosofía de generar la menor basura posible. No es perfección, es progreso constante.'},
    {term:'Granel', def:'Compra sin envase. Llevas tu propio recipiente. Disponible en mercados, tiendas eco.'},
    {term:'Compostaje', def:'Descomposición controlada de materia orgánica para obtener abono. Reduce 30% de basura doméstica.'},
    {term:'Upcycling', def:'Convertir algo viejo en algo de mayor valor (no solo reciclar). Ej: jeans → bolso.'},
    {term:'Slow living', def:'Estilo de vida basado en lo esencial. Conexión con naturaleza, consumo consciente.'},
    {term:'Economía circular', def:'Modelo donde nada se desperdicia. Productos diseñados para repararse, reutilizarse, reciclarse.'}
  ]
},

  {
  id:'tpl-cachorro',
  name:'Tu Primer Cachorro',
  types:['roadmap','checklist','faq','glosario'],
  niche:'mascotas',
  category:'Mascotas',
  subcategory:'Perros',
  description:'Guía completa para recibir y cuidar a tu cachorro en los primeros meses.',
  icon:'pets',
  primaryColor:'#f59e0b',
  secondaryColor:'#d97706',
  bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg, #f59e0b, #d97706)',
  roadmapSteps:[
    'Prepara el hogar: retira cables, plantas tóxicas y objetos peligrosos a ras del suelo',
    'Compra lo esencial: cama, crate, comedero, bebedero, juguetes de mordida y correa',
    'Elige veterinario y agenda primera visita en las 48h de llegada del cachorro',
    'Inicia protocolo de vacunas y desparasitación según calendario veterinario',
    'Comienza socialización: expón al cachorro a sonidos, personas y lugares nuevos antes de los 3 meses',
    'Establece rutina de comidas, salidas y hora de dormir desde el primer día',
    'Inscríbete en clases básicas de adiestramiento: sienta, quieto, ven y no'
  ],
  initialItems:[
    'Cama o crate en lugar tranquilo','Comedero y bebedero de acero inoxidable','Comida específica para cachorros',
    'Juguetes de mordida seguros','Collar + placa con tu teléfono','Correa de 2 metros',
    'Bolsas para excrementos','Champú específico cachorros'
  ],
  faqItems:[
    {q:'¿Cuándo puede salir a la calle?',a:'Tras completar el ciclo de vacunas (aprox. 12-16 semanas). Antes puede salir en brazos para socializar.'},
    {q:'¿Cuántas veces al día come un cachorro?',a:'3-4 veces al día hasta los 6 meses, luego 2-3 veces. Sigue las indicaciones del pienso según peso.'},
    {q:'¿Por qué muerde tanto?',a:'Es normal durante la dentición (2-5 meses). Redirige a juguetes apropiados y di "no" firme cuando muerda piel.'},
    {q:'¿Cómo enseñarle a hacer sus necesidades fuera?',a:'Sácalo cada 2h, después de comer y al despertar. Premio inmediato si lo hace fuera. Nunca castigues accidentes en casa.'},
    {q:'¿Necesita bañarse seguido?',a:'Máximo una vez al mes. El baño excesivo elimina aceites naturales del pelo y puede causar irritación.'},
    {q:'¿Cuándo esterilizar?',a:'Consulta con tu vet. Generalmente entre 6-12 meses según raza y sexo. Reduce ciertos riesgos de salud.'},
    {q:'¿Puede dormir en mi cama?',a:'Es decisión personal, pero establece la norma desde el inicio. Cambiarla después es muy difícil.'},
    {q:'¿Qué alimentos son tóxicos para los perros?',a:'Chocolate, uvas, pasas, cebolla, ajo, xilitol (edulcorante), aguacate y macadamia. Nunca los des.'}
  ],
  glossaryTerms:[
    {term:'Crate',def:'Jaula o transportín que se usa como espacio seguro del perro. Bien introducida, el perro la ve como su cueva.'},
    {term:'Socialización',def:'Proceso de exponer al cachorro a estímulos (personas, animales, sonidos) para que los acepte con normalidad de adulto.'},
    {term:'Refuerzo positivo',def:'Técnica de adiestramiento basada en premiar la conducta correcta en vez de castigar la incorrecta.'},
    {term:'Pienso',def:'Alimento seco granulado formulado específicamente para perros. Elige uno con carne como primer ingrediente.'},
    {term:'Desparasitación',def:'Tratamiento contra parásitos internos (lombrices) y externos (pulgas, garrapatas). Se hace según calendario vet.'},
    {term:'Microchip',def:'Identificador electrónico implantado bajo la piel. Obligatorio en muchos países. Registra al dueño y permite recuperar al perro si se pierde.'},
    {term:'Leishmaniasis',def:'Enfermedad transmitida por mosquitos, grave en perros. Vacuna disponible en zonas de riesgo.'},
    {term:'Rescisión de contrato',def:'En muchos criaderos, derecho de devolver al cachorro si el vet detecta problema grave en 72h.'}
  ]
},

{
  id:'tpl-adiestramiento',
  name:'Adiestramiento Canino',
  types:['reto','flashcards','roadmap','faq'],
  niche:'mascotas',
  category:'Mascotas',
  subcategory:'Adiestramiento',
  description:'Aprende los fundamentos del adiestramiento en positivo y enseña comandos básicos a tu perro.',
  icon:'pets',
  primaryColor:'#10b981',
  secondaryColor:'#059669',
  bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg, #10b981, #059669)',
  retoContent:[
    {title:'Día 1: Responde a su nombre', instructions:'10 repeticiones, di el nombre en tono alegre, cuando te mire premia con golosina pequeña. Breve, 5 min máximo.', reflectionPrompt:'¿Cuántas veces respondió de 10?'},
    {title:'Día 2: Sienta', instructions:'Golosina sobre su nariz, muévela hacia atrás. Al sentarse di "sienta" y premia. 10 repeticiones en 2 sesiones.', reflectionPrompt:'¿Lo logró antes del intento 10?'},
    {title:'Día 3: Quieto', instructions:'Pide sienta, abre palma frente a su cara y di "quieto". Un segundo, luego premia. Aumenta el tiempo gradualmente.', reflectionPrompt:'¿Cuántos segundos aguantó?'},
    {title:'Día 4: Ven', instructions:'Distancia corta, abre brazos y di su nombre + "ven" con entusiasmo. Premio y elogio exagerado al llegar.', reflectionPrompt:'¿Vino sin dudar?'},
    {title:'Día 5: No', instructions:'Cuando haga algo indeseado, di "no" en tono firme (no gritar). Redirige a comportamiento correcto y premia ese.', reflectionPrompt:'¿Lo redirigiste con éxito?'},
    {title:'Día 6: Echado', instructions:'Desde sienta, golosina al suelo entre sus patas. Al echarse di "echado" y premia. Más difícil, sé paciente.', reflectionPrompt:'¿Lo logró sin ayuda al final?'},
    {title:'Día 7: Repaso general', instructions:'Practica los 5 comandos en orden. Varía el contexto (jardín, sala, calle). Sesión de 10 minutos con juego al final.', reflectionPrompt:'¿Cuál fue el más fluido?'}
  ],
  cards:[
    {front:'Timing del premio', back:'El refuerzo debe llegar en los 2 segundos posteriores a la conducta correcta. Después el perro no asocia.'},
    {front:'Sesiones cortas', back:'5-10 minutos máximo por sesión. El perro se cansa y aburre. Mejor 3 sesiones cortas que una larga.'},
    {front:'Jackpot', back:'Premio extra grande por un logro excepcional. Refuerza comportamientos difíciles o nuevos.'},
    {front:'Extinción', back:'Ignorar completamente una conducta indeseada. Sin atención, la conducta desaparece. Funciona para saltar o ladrar por atención.'},
    {front:'Clicker', back:'Sonido neutro que marca exactamente el momento correcto. Más preciso que la voz. Se asocia con premio.'},
    {front:'Luring', back:'Guiar con golosina para inducir postura. Luego se retira el cebo y se trabaja solo con señal.'},
    {front:'Señal de manos', back:'Los perros aprenden mejor señales visuales que verbales. Combina ambas desde el inicio.'},
    {front:'Generalización', back:'Practicar el comando en distintos lugares, con distracciones. El perro debe obedecer en cualquier contexto.'},
    {front:'Curva de aprendizaje', back:'Normal que empeore antes de mejorar. El perro prueba nuevas respuestas. Sé consistente.'},
    {front:'Conducta base', back:'Sienta y contacto visual son base de todo. Perro que se sienta y te mira está listo para aprender.'}
  ],
  roadmapSteps:[
    'Establece comunicación: nombre + contacto visual + un premio cada vez que te mire',
    'Domina los 5 básicos: sienta, quieto, ven, echado, no',
    'Trabaja el paseo con correa: que no tire, que camine a tu lado',
    'Introduce el crate como espacio positivo para gestionar ausencias',
    'Practica en entornos con distracciones: parque, calle, visitas en casa',
    'Añade comandos de seguridad: suelta, déjalo, quieto a distancia',
    'Considera clase grupal para socialización y trabajo con distracciones reales'
  ],
  faqItems:[
    {q:'¿Qué tipo de premio funciona mejor?',a:'Golosinas blandas y pequeñas (tamaño de un guisante). Que el perro pueda comerlas rápido. Varía para mantener motivación.'},
    {q:'¿Puedo adiestrar a un perro adulto?',a:'Absolutamente. Los perros aprenden a cualquier edad. Puede tomar más tiempo desaprender hábitos, pero es totalmente posible.'},
    {q:'¿Cuándo usar castigo?',a:'Nunca castigo físico. El "no" firme y la redirección son suficientes. El castigo crea miedo e inhibe el aprendizaje.'},
    {q:'¿Por qué obedece en casa pero no en la calle?',a:'La calle tiene más distracciones. Hay que generalizar el entrenamiento: practicar en distintos entornos con distracción progresiva.'},
    {q:'¿Mi perro es dominante?',a:'El concepto de dominancia está desactualizado. Los problemas de comportamiento vienen de falta de guía, ejercicio o socialiación, no de dominancia.'},
    {q:'¿Cuánto tiempo al día hay que dedicar al adiestramiento?',a:'15-20 minutos diarios en 2-3 sesiones cortas. La consistencia diaria supera a una hora semanal.'}
  ]
}

  ,{
  id:'tpl-habitos-atomicos',
  name:'Hábitos Atómicos 66 Días',
  types:['reto','tracker','flashcards','diario'],
  niche:'desarrollo_personal',
  category:'Desarrollo Personal',
  subcategory:'Hábitos',
  description:'Construye hábitos que duran aplicando los principios de los hábitos atómicos durante 66 días.',
  icon:'target',
  primaryColor:'#6366f1',
  secondaryColor:'#4f46e5',
  bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg, #6366f1, #4f46e5)',
  retoContent:[
    {title:'Día 1: Elige tu hábito ancla', instructions:'Escoge UN hábito pequeño que quieras instalar. Tan pequeño que no puedas negarte: "Leer 1 página", "5 flexiones". Escríbelo exactamente.', reflectionPrompt:'¿Cuál es tu hábito atómico?'},
    {title:'Día 2: Diseña el cue', instructions:'Define el disparador: hora, lugar, emoción o acción anterior que activará tu hábito. Ej: "Después de café de mañana, leo 1 página".', reflectionPrompt:'¿Cuál es tu cue exacto?'},
    {title:'Día 3: Reducción a 2 minutos', instructions:'Si tu hábito tarda más de 2 minutos, reduce aún más. El objetivo es aparecer, no el rendimiento. Haz solo la versión mínima.', reflectionPrompt:'¿Cuánto duró tu versión mínima?'},
    {title:'Día 7: Revisión de semana 1', instructions:'¿Cuántos días de 7 cumpliste? No busques perfección. 4/7 es éxito. Identifica qué obstáculo apareció y cómo sortearlo.', reflectionPrompt:'¿Qué patrón ves en los días que fallaste?'},
    {title:'Día 21: Punto de inflexión', instructions:'Los estudios muestran que a las 3 semanas el hábito empieza a automatizarse. ¿Lo sientes más natural? Ahora puedes crecer un 10%.', reflectionPrompt:'¿Qué tan automático se siente ya?'},
    {title:'Día 66: Certificación del hábito', instructions:'66 días es el promedio para automatizar un hábito. Celebra. Elige el siguiente hábito atómico y repite el proceso.', reflectionPrompt:'¿Qué hábito construirás ahora?'}
  ],
  trackerHabit:'Mi hábito atómico diario',
  cards:[
    {front:'Ley 1: Hazlo obvio', back:'Diseña tu entorno para que el cue sea visible. Zapatos de correr junto a la cama = más probabilidad de ejercitar.'},
    {front:'Ley 2: Hazlo atractivo', back:'Vincula el hábito a algo que te guste (temptation bundling). Ej: solo música favorita mientras corres.'},
    {front:'Ley 3: Hazlo fácil', back:'Reduce la fricción al mínimo. Prepara todo la noche anterior. La regla de los 2 minutos.'},
    {front:'Ley 4: Hazlo satisfactorio', back:'Agrega recompensa inmediata. Marca el hábito en un tracker visual. La racha es motivación.'},
    {front:'Regla de los 2 minutos', back:'Si un hábito tarda menos de 2 minutos, hazlo ahora. Si no, hazlo tan pequeño que tome 2 minutos.'},
    {front:'Stacking de hábitos', back:'Encadena hábitos: "Después de X, haré Y". Usa un hábito establecido como ancla para el nuevo.'},
    {front:'Plateau de potencial latente', back:'Los cambios no son lineales. Semanas sin resultado visible → cambio brusco. Sigue aunque no veas progreso.'},
    {front:'Identidad > Resultados', back:'No "quiero correr 5K". Sé "soy alguien que corre". El hábito es evidencia de tu identidad deseada.'},
    {front:'Entorno > Motivación', back:'No dependas de fuerza de voluntad. Diseña tu ambiente para que el comportamiento correcto sea el fácil.'},
    {front:'Nunca faltes dos veces seguidas', back:'Un mal día no rompe el hábito. Dos días seguidos sí crean el hábito contrario. Mínimo viable siempre.'}
  ],
  journalPrompts:[
    '¿Qué identidad quiero construir con este hábito? ¿Qué tipo de persona quiero ser?',
    '¿Qué fricción está impidiendo que realice mi hábito? ¿Cómo puedo reducirla?',
    '¿Hubo días que fallé esta semana? ¿Qué situación lo causó y qué haré diferente?',
    '¿Qué recompensa inmediata podría agregar para hacer el hábito más satisfactorio?',
    '¿En qué momento del día me resulta más fácil mantener este hábito? ¿Por qué?',
    '¿Qué evidencia tengo esta semana de que me estoy convirtiendo en la persona que quiero ser?'
  ]
}

  ,{
  id:'tpl-proposito',
  name:'Propósito de Vida',
  types:['diario','roadmap','afirmaciones','flashcards'],
  niche:'desarrollo_personal',
  category:'Desarrollo Personal',
  subcategory:'Propósito',
  description:'Un viaje guiado para descubrir tu propósito, alinear tu vida con tus valores y diseñar el camino hacia quien quieres ser.',
  icon:'explore',
  primaryColor:'#8b5cf6',
  secondaryColor:'#7c3aed',
  bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  journalPrompts:[
    '¿Qué actividades te hacen perder la noción del tiempo? ¿Cuándo fue la última vez que entraste en "flujo"?',
    '¿Qué problemas del mundo te duelen profundamente? ¿Cuáles no puedes ignorar cuando los ves?',
    '¿Qué talentos tienes que la gente cercana reconoce aunque tú los des por normales?',
    '¿Por qué cosas estarías dispuesto a trabajar incluso si no te pagaran?',
    '¿Qué quieres que digan de ti en tu funeral? ¿Cómo quieres ser recordado?',
    '¿Qué versión de ti mismo imaginas en 10 años? Descríbela con el máximo detalle posible.',
    '¿Qué miedos te han impedido perseguir lo que realmente quieres?',
    '¿Cuál es la brecha entre quien eres ahora y quien quieres ser?'
  ],
  roadmapSteps:[
    'Autoevaluación: completa los journals de descubrimiento durante 7 días sin filtros',
    'Identifica intersecciones: busca dónde convergen tus talentos, pasiones, valores y lo que el mundo necesita',
    'Escribe tu enunciado de propósito: "Mi propósito es [verbo] [quién] para [resultado]"',
    'Mapea tu vida actual vs. tu propósito: ¿qué está alineado? ¿qué no?',
    'Define 3 proyectos o experimentos concretos que te acerquen a vivir tu propósito',
    'Establece hábitos de alineación: rituales diarios que te conecten con quien quieres ser',
    'Revisa y ajusta: tu propósito evolucionará. Revísalo cada 90 días'
  ],
  affirmations:[
    'Tengo algo único para ofrecer al mundo que nadie más puede dar exactamente como yo',
    'Mi propósito se revela cuando actúo con valentía y escucho mi intuición',
    'Merezco vivir una vida alineada con mis valores más profundos',
    'Cada paso que doy hacia mi propósito crea ondas positivas en quienes me rodean',
    'Soy capaz de diseñar la vida que quiero vivir, una decisión a la vez',
    'Mi historia y mis cicatrices son parte de lo que me hace único y valioso',
    'Elijo priorizar lo que realmente importa sobre lo urgente pero vacío',
    'Estoy exactamente donde necesito estar para aprender lo que me llevará al siguiente nivel',
    'Mi propósito no depende de la aprobación de otros, solo de mi autenticidad',
    'Tengo el coraje de soltar lo que ya no sirve y espacio para lo que está por venir'
  ],
  cards:[
    {front:'Ikigai', back:'Concepto japonés: intersección de lo que amas, lo que haces bien, lo que el mundo necesita y por lo que te pagan.'},
    {front:'Propósito vs. Pasión', back:'La pasión sigue al dominio, no al revés. El propósito emerge al ser muy bueno en algo que importa.'},
    {front:'Flujo (Flow)', back:'Estado de concentración total donde pierdes noción del tiempo. Señal de que estás en algo alineado con tus fortalezas.'},
    {front:'Valores nucleares', back:'Principios no negociables que guían tus decisiones. Cuando los violas, sientes incomodidad. Identifica tus 5 valores core.'},
    {front:'Legado', back:'Huella que dejas en otros. ¿Qué quieres que exista en el mundo porque tú exististe?'},
    {front:'Zona de genialidad', back:'El nivel más alto de Gay Hendricks: actividades donde eres extraordinario y el tiempo vuela. Vive aquí el máximo posible.'},
    {front:'Contrato con el futuro yo', back:'Carta escrita hoy al yo de dentro de 5 años describiendo quien querías ser. Crea responsabilidad y visión.'},
    {front:'El miedo como brújula', back:'Lo que más te asusta perseguir suele estar más cerca de tu propósito que lo que te resulta fácil.'}
  ]
}

  ,{
  id:'tpl-inteligencia-emocional',
  name:'Inteligencia Emocional',
  types:['flashcards','diario','glosario','reto'],
  niche:'desarrollo_personal',
  category:'Desarrollo Personal',
  subcategory:'IE',
  description:'Desarrolla tu inteligencia emocional: reconoce tus emociones, gestiónalas con madurez y mejora tus relaciones.',
  icon:'psychology',
  primaryColor:'#ec4899',
  secondaryColor:'#db2777',
  bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg, #ec4899, #db2777)',
  cards:[
    {front:'Autoconciencia', back:'Capacidad de reconocer tus propias emociones en el momento en que ocurren. La base de toda IE.'},
    {front:'Autorregulación', back:'Habilidad de manejar emociones perturbadoras e impulsos. No suprimir sino gestionar constructivamente.'},
    {front:'Motivación intrínseca', back:'Impulsarte por pasión y valores propios, no por dinero o reconocimiento externo.'},
    {front:'Empatía', back:'Sentir lo que otro siente. No "te entiendo" sino "puedo imaginar cómo se siente eso para ti".'},
    {front:'Habilidades sociales', back:'Gestionar relaciones para mover a personas hacia metas compartidas. Escucha activa, comunicación asertiva.'},
    {front:'Secuestro amigdalino', back:'Cuando la amígdala toma el control y reacciones sin pensar. 6-8 segundos para que el córtex retome el control.'},
    {front:'Ventana de tolerancia', back:'Zona de activación óptima donde puedes pensar y sentir al mismo tiempo. Objetivo de la regulación emocional.'},
    {front:'Validación emocional', back:'Reconocer que la emoción del otro tiene sentido dado su contexto, aunque no estés de acuerdo con su conducta.'},
    {front:'Emoción vs. Sentimiento', back:'Emoción: respuesta fisiológica automática. Sentimiento: interpretación consciente de esa emoción.'},
    {front:'Granularidad emocional', back:'Capacidad de distinguir emociones con precisión. "Ansioso" vs. "avergonzado" vs. "solo". Más palabras = mejor regulación.'}
  ],
  journalPrompts:[
    '¿Qué emoción fue la más intensa de hoy? ¿En qué parte del cuerpo la sentiste?',
    '¿Hubo algún momento en que reaccionaste de forma que luego lamentaste? ¿Qué emoción lo disparó?',
    '¿Cuándo fue la última vez que genuinamente empatizaste con alguien que piensa diferente a ti?',
    '¿Qué necesidad emocional no está siendo satisfecha en este momento de tu vida?',
    '¿Cómo describes tus emociones al hablar? ¿Usas palabras precisas o categorías amplias (bien/mal)?',
    '¿Qué persona en tu vida activa regularmente emociones difíciles en ti? ¿Qué necesidad tuya está tocando?',
    '¿Cuándo fue la última vez que te permitiste sentir una emoción difícil sin actuar desde ella ni suprimirla?'
  ],
  glossaryTerms:[
    {term:'IE (Inteligencia Emocional)',def:'Conjunto de habilidades para reconocer, comprender, gestionar y usar las emociones propias y ajenas. Modelo de Goleman.'},
    {term:'Amígdala',def:'Estructura cerebral responsable de la respuesta emocional rápida. Activa el modo lucha/huida/parálisis antes que el pensamiento racional.'},
    {term:'Mindfulness emocional',def:'Observar las emociones sin identificarse con ellas. "Siento tristeza" en vez de "soy triste".'},
    {term:'Apego',def:'Estilo relacional formado en la infancia que determina cómo te vinculas de adulto. Seguro, ansioso, evitativo o desorganizado.'},
    {term:'Regulación emocional',def:'Estrategias para modular la intensidad y duración de las emociones. Incluye respiración, reencuadre cognitivo, movimiento.'},
    {term:'Escucha activa',def:'Atención plena a lo que el otro dice, sin preparar respuesta. Incluye parafrasear y validar.'},
    {term:'Comunicación no violenta',def:'Modelo de Rosenberg: observación neutra + emoción + necesidad + petición concreta. Sin juicio ni crítica.'},
    {term:'Zona de confort emocional',def:'Emociones familiares que el sistema nervioso tolera aunque sean negativas. Salir de ella requiere práctica gradual.'}
  ],
  retoContent:[
    {title:'Día 1: Diario emocional', instructions:'3 veces al día, anota: situación, emoción exacta, intensidad 1-10, sensación corporal. Solo observar, sin juzgar.', reflectionPrompt:'¿Cuántas emociones distintas registraste?'},
    {title:'Día 2: Pausa antes de reaccionar', instructions:'Cada vez que sientas emoción fuerte, haz pausa de 10 respiraciones antes de responder. Si puedes, espera 24h para conversaciones difíciles.', reflectionPrompt:'¿Lograste pausar? ¿Cambió tu respuesta?'},
    {title:'Día 3: Practica empatía', instructions:'En cada conversación de hoy, intenta identificar qué emoción está sintiendo el otro antes de responder. Pregunta "¿cómo te sientes con eso?"', reflectionPrompt:'¿Qué descubriste del otro?'},
    {title:'Día 4: Identifica tus disparadores', instructions:'Haz lista de situaciones, personas o frases que te sacan de tu centro emocional. Sin juzgar. Solo mapear tu paisaje interno.', reflectionPrompt:'¿Qué patrón ves?'},
    {title:'Día 5: Comunicación asertiva', instructions:'Exprés UNA necesidad emocional hoy usando: "Cuando X ocurre, yo siento Y, y necesito Z". Sin crítica ni queja.', reflectionPrompt:'¿Cómo respondió el otro?'}
  ]
}

  ,{
  id:'tpl-ingles-speaking',
  name:'Inglés: Habla con IA desde el Día 1',
  types:['chatbot','reto','flashcards','faq'],
  niche:'inglés, idiomas, speaking, conversación',
  category:'Educación',
  subcategory:'Idiomas',
  description:'Practica conversación real en inglés con un chatbot IA que te corrige, responde y te ayuda a perder el miedo a hablar.',
  icon:'translate',
  primaryColor:'#2E5BFF',
  secondaryColor:'#7c3aed',
  bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg, #2E5BFF, #7c3aed)',
  retoContent:[
    {title:'Día 1: Preséntate en inglés', instructions:'Ve al chatbot y escribe: "Hi! My name is [tu nombre]. I am from [país]. Nice to meet you!" El chatbot te responderá y continuará la conversación. Objetivo: 5 intercambios sin parar.', reflectionPrompt:'¿Cuántos mensajes enviaste sin rendirte?'},
    {title:'Día 2: Habla de tu rutina', instructions:'Cuéntale al chatbot qué haces cada día. Empieza con: "Every morning I..." — usa el presente simple. Si te equivocas, el bot te corregirá con amabilidad.', reflectionPrompt:'¿Qué palabras nuevas aprendiste hoy?'},
    {title:'Día 3: Haz preguntas', instructions:'Practica preguntas: "What do you think about...?", "Can you explain...?", "How do I say... in English?". Haz al menos 5 preguntas seguidas al chatbot.', reflectionPrompt:'¿Cuál pregunta te costó más construir?'},
    {title:'Día 4: Simula una situación real', instructions:'Pide al chatbot: "Let\'s practice: I am at a restaurant and you are the waiter." Simula ordenar comida completamente en inglés. Pide la cuenta, pregunta por ingredientes.', reflectionPrompt:'¿Cómo te sentiste roleplaying en inglés?'},
    {title:'Día 5: Debate una opinión', instructions:'Escribe al chatbot tu opinión sobre un tema: trabajo, viajes, tecnología. Usa "I think...", "In my opinion...", "I disagree because...". Mínimo 8 intercambios.', reflectionPrompt:'¿Lograste defender tu opinión en inglés?'},
    {title:'Día 6: Pide correcciones', instructions:'Escribe al chatbot: "Please correct every mistake I make today and explain why." Luego habla libremente 10 minutos. Guarda las correcciones que te dé.', reflectionPrompt:'¿Cuál error repites más seguido?'},
    {title:'Día 7: Conversación libre', instructions:'Sin tema específico. Abre el chatbot y habla de cualquier cosa que quieras por 15 minutos seguidos. No te detengas a traducir — adivina, pregunta, improvisa.', reflectionPrompt:'¿En qué momento te sentiste más fluido?'}
  ],
  cards:[
    {front:'Filler words para ganar tiempo', back:'"Well...", "You know...", "Let me think...", "Actually...", "I mean..." — los nativos los usan constantemente. Úsalos tú también.'},
    {front:'Cómo pedir que repitan', back:'"Could you say that again?", "Sorry, I didn\'t catch that.", "Can you speak more slowly please?"'},
    {front:'Cómo preguntar vocabulario', back:'"How do you say [palabra en español] in English?", "What does [palabra] mean?", "Can you give me an example?"'},
    {front:'Cómo expresar duda', back:'"I\'m not sure, but...", "I think it\'s...", "Correct me if I\'m wrong, but..." — muestra que intentas aunque no estés seguro.'},
    {front:'Para empezar una opinión', back:'"In my opinion...", "I believe that...", "From my perspective...", "Personally, I think..."'},
    {front:'Para estar de acuerdo', back:'"Exactly!", "That\'s a good point.", "I totally agree.", "You\'re right about that."'},
    {front:'Para estar en desacuerdo educadamente', back:'"I see your point, but...", "I\'m not sure I agree because...", "That\'s interesting, however..."'},
    {front:'Phrasal verbs cotidianos', back:'"Wake up", "get up", "work out", "hang out", "look forward to", "give up", "figure out" — aprende 2 por día.'},
    {front:'Small talk starters', back:'"How\'s it going?", "What have you been up to?", "Did you do anything fun this weekend?", "How do you find [ciudad/trabajo]?"'},
    {front:'Cómo el chatbot te ayuda', back:'Escríbele en inglés y pídele que corrija tus errores, que simplifique, que use más vocabulario o que hable más rápido. Personaliza tu práctica.'}
  ],
  faqItems:[
    {q:'¿El chatbot entiende si escribo con errores?',a:'Sí, el chatbot entiende aunque cometas errores gramaticales. De hecho, puedes pedirle explícitamente que los corrija y explique el por qué.'},
    {q:'¿Puedo practicar pronunciación con el chatbot?',a:'El chatbot es texto, pero puedes leer tus respuestas en voz alta antes de enviarlas. Usa el tipo "Listening" para escuchar inglés hablado con audio.'},
    {q:'¿En qué nivel de inglés funciona mejor?',a:'Desde principiante. Si no sabes cómo decir algo, mezcla español e inglés y el bot te ayudará a expresarlo correctamente.'},
    {q:'¿Cómo le pido al chatbot que haga un roleplay?',a:'Simplemente escríbele: "Let\'s do a roleplay. You are [personaje] and I am [personaje]. The situation is [escena]." Y empieza.'},
    {q:'¿Puedo pedirle que use solo inglés?',a:'Sí: escríbele "Please respond only in English, even if I write in Spanish." Ideal cuando quieres inmersión total.'},
    {q:'¿Cuántos minutos al día debo practicar?',a:'15-20 minutos diarios de conversación activa equivalen a una clase particular. La constancia supera la duración.'}
  ]
}

  ,{
  id:'tpl-ingles-listening',
  name:'Inglés B2: Listening & Pronunciación',
  types:['meditacion','flashcards','glosario','checklist','reto'],
  niche:'inglés, idiomas, listening, pronunciación, avanzado',
  category:'Educación',
  subcategory:'Idiomas',
  description:'Entrena tu oído con audios reales en inglés (TTS), aprende idioms avanzados y ejercita pronunciación con retos diarios.',
  icon:'self_improvement',
  primaryColor:'#0891b2',
  secondaryColor:'#0e7490',
  bgColor:'#0e0e0e',
  headerGradient:'linear-gradient(135deg, #0891b2, #0e7490)',
  meditationScript:`Welcome to your English listening session. Close your eyes, relax, and focus on the words.

Today we are going to talk about habits and how they shape our lives.

Every single day, we make hundreds of small decisions. What to eat. What to wear. Whether to exercise or stay in bed. Most of these decisions do not feel like decisions at all — they feel automatic. That is because they are habits.

A habit is a behavior that has been repeated so many times that it becomes almost unconscious. Your brain runs it on autopilot to save energy for more complex tasks.

The good news is that habits can be changed. Research shows that if you repeat a new behavior consistently for about 66 days, it starts to feel natural. The key is consistency, not perfection.

Here is a powerful strategy: attach your new habit to something you already do every day. For example — "After I brush my teeth, I will study English for ten minutes." This is called habit stacking, and it works because your existing routine becomes the trigger for the new one.

Remember: you do not have to be motivated to start. You just have to start. Motivation follows action, not the other way around.

Take a deep breath. Now, think of one habit you want to build this week. Keep it small. Keep it simple. And remember — every expert was once a beginner.

Well done. Open your eyes and keep going.`,
  cards:[
    {front:'To be on the fence', back:'Estar indeciso entre dos opciones. "I\'m still on the fence about changing jobs."'},
    {front:'To bite the bullet', back:'Hacer algo difícil o desagradable que no puedes evitar. "I just bit the bullet and went to the dentist."'},
    {front:'To break the ice', back:'Hacer algo para aliviar la tensión o incomodidad al inicio de una situación. "He told a joke to break the ice."'},
    {front:'To hit the nail on the head', back:'Describir exactamente la situación o problema. "You hit the nail on the head with that analysis."'},
    {front:'Once in a blue moon', back:'Muy raramente. "I only eat fast food once in a blue moon."'},
    {front:'To pull someone\'s leg', back:'Bromear con alguien. "Don\'t worry, I\'m just pulling your leg!"'},
    {front:'To be under the weather', back:'Sentirse enfermo o indispuesto. "I\'m feeling a bit under the weather today."'},
    {front:'To cost an arm and a leg', back:'Ser muy caro. "That new phone costs an arm and a leg."'},
    {front:'To spill the beans', back:'Revelar un secreto accidentalmente. "Don\'t spill the beans about the surprise party!"'},
    {front:'Blessing in disguise', back:'Algo que parece malo al principio pero resulta ser bueno. "Losing that job was a blessing in disguise."'},
    {front:'Phrasal verb: to come across', back:'Encontrar algo por accidente / dar una impresión. "I came across an old photo." / "She comes across as confident."'},
    {front:'Phrasal verb: to bring up', back:'Mencionar un tema / criar un hijo. "He brought up an interesting point." / "She was brought up in Madrid."'}
  ],
  glossaryTerms:[
    {term:'Intonation',def:'La melodía de la voz al hablar. El inglés sube y baja mucho más que el español. Practícala imitando a nativos.'},
    {term:'Stress (acento tónico)',def:'En inglés, ciertas sílabas se pronuncian más fuerte. "PHOtograph" vs "phoTOGraphy" — el significado puede cambiar.'},
    {term:'Schwa /ə/',def:'El sonido más común en inglés. Es una "a" muy débil y relajada. Aparece en palabras como "about", "the", "better".'},
    {term:'Connected speech',def:'Los nativos conectan palabras al hablar. "What are you" suena como "Whadda ya". Aprende a escucharlo, no a hablarlo.'},
    {term:'False friends',def:'Palabras parecidas al español pero con distinto significado. "Embarrassed" = avergonzado (no embarazada). "Eventually" = finalmente (no eventualmente).'},
    {term:'Idiom',def:'Expresión cuyo significado no se puede deducir de las palabras individuales. Esenciales para sonar natural.'},
    {term:'Phrasal verb',def:'Verbo + preposición o adverbio con significado propio. "Give up" = rendirse. No se traduce literal.'},
    {term:'Register',def:'Nivel de formalidad del lenguaje. Formal (business), neutral (daily), informal (slang). Adapta tu inglés al contexto.'},
    {term:'Chunk',def:'Grupo de palabras que se aprenden y usan juntas. "As far as I know", "It depends on". Más eficiente que traducir palabra por palabra.'},
    {term:'Shadowing',def:'Técnica de imitar a un hablante nativo en tiempo real. Mejora pronunciación, ritmo y entonación. Usa podcasts o YouTube.'}
  ],
  initialItems:[
    'Escucha el audio de listening al menos 2 veces por sesión',
    'La primera vez: escucha sin leer el script',
    'La segunda vez: lee el script mientras escuchas',
    'Aprende 2 flashcards nuevas (idioms) por día',
    'Practica shadowing: imita la voz del audio en voz alta',
    'Aprende 1 término nuevo del glosario de pronunciación',
    'Grábate hablando inglés 1 minuto y escúchate'
  ],
  retoContent:[
    {title:'Día 1: Escucha sin leer', instructions:'Reproduce el audio del listening sin mirar el script. Escríbelo que entendiste en español. Luego escúchalo de nuevo leyendo. ¿Cuánto captaste?', reflectionPrompt:'¿Qué porcentaje entendiste a la primera?'},
    {title:'Día 2: Shadowing en voz alta', instructions:'Reproduce el audio y habla AL MISMO TIEMPO que la voz. Imita ritmo, entonación y velocidad. Se siente raro — es exactamente lo que debes sentir.', reflectionPrompt:'¿Qué parte fue más difícil de imitar?'},
    {title:'Día 3: Aprende 4 idioms', instructions:'Elige 4 flashcards de idioms. Léelas, memoriza el significado y escribe una oración original con cada una en tu idioma de destino.', reflectionPrompt:'¿Cuál idiom puedes usar hoy en una conversación?'},
    {title:'Día 4: Pronunciación focalizada', instructions:'Elige 3 términos del glosario (schwa, stress, connected speech). Busca un video de YouTube sobre cada uno y practica 5 minutos cada uno.', reflectionPrompt:'¿Cuál cambió más cómo suenas?'},
    {title:'Día 5: Grábate hablando', instructions:'Graba un audio de 1 minuto hablando inglés sobre cualquier tema. Escúchalo. ¿Qué noti en tu pronunciación? ¿Dónde pausas demasiado?', reflectionPrompt:'¿Cuál es tu mayor área de mejora al escucharte?'}
  ]
}

  ];
}
