# Luminous Studio — Contexto del Proyecto

## Resumen
Plataforma SaaS para creadores de infoproductos hispanohablantes. Permite crear quizzes interactivos, mini-apps (retos, devocionales, trackers, chatbots IA, etc.) y capturar leads. Stack: HTML + JS vanilla + Tailwind CDN + Supabase (auth + DB). Desplegado en Vercel desde la rama `main`.

## Stack Técnico
- **Frontend**: HTML estático, JavaScript vanilla, Tailwind CSS via CDN
- **Backend**: Supabase (auth, PostgreSQL, Edge Functions)
- **IA**: Arquitectura dividida en tres capas:
  1. **Creación — complejo** (quiz completo, contenido estructurado de mini-apps, Bot Lab, Lloyd): Claude via `claude-proxy` (master key ANTHROPIC_API_KEY de la plataforma).
  2. **Creación — simple** (ideas de mini-apps, mejorar una pregunta, paletas de color): Groq master via `groq-proxy` (master key GROQ_API_KEY de la plataforma). Si Groq falla, cae automáticamente a Claude.
  3. **Runtime** (chatbot y generador dentro de mini-apps publicadas): Groq del **creador** via `creator-ai-proxy` (key en `profiles.groq_api_key`). Si el creador no tiene Groq configurada, cae a Claude master.
- **Deploy**: Vercel desde `main` branch. Pushes a ramas `claude/*` se auto-mergean a `main` via GitHub Actions
- **Iconos**: Material Symbols Outlined (Google Fonts). NO usar emojis en la UI
- **Fuente**: Plus Jakarta Sans

## Identidad Visual — MUY IMPORTANTE
**Todo el proyecto usa UN SOLO color de marca: gradiente azul→púrpura.**

- Gradiente principal: `#2E5BFF → #7c3aed`
- Gradiente para textos/iconos: `#4d7cff → #a78bfa`
- Clase CSS para iconos: `.icon-gradient { background: linear-gradient(135deg, #4d7cff, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }`
- Clase CSS para botones: `.primary-gradient { background: linear-gradient(135deg, #2E5BFF 0%, #7c3aed 100%); }`
- **NUNCA usar**: verde (#69f6b8), rosa (#e879f9), naranja (#FF6B35), amarillo (#FFE01B), colores de marca de terceros
- **NUNCA usar emojis** en la interfaz. Siempre usar Material Symbols Outlined
- Fondo base: `#0e0e0e` (dark mode)

## Archivos Principales

### Páginas HTML
| Archivo | Función |
|---------|---------|
| `index.html` | Landing page pública |
| `login.html` / `registro.html` | Auth (Supabase) |
| `dashboard.html` | Panel principal: lista de quizzes + mini-apps, modal de creación |
| `generador-ia.html` | Creador de quizzes con IA |
| `quiz.html` | Editor de quiz |
| `resultado-quiz.html` | Vista de resultados del quiz |
| `mini-app-player.html` | Player universal de mini-apps (19 tipos de sección) |
| `settings.html` | Ajustes de cuenta, integraciones, API keys |
| `bots.html` | Bot Lab: biblioteca de 16 bots IA especializados |
| `bot-chat.html` | Chat individual con cada bot |
| `leads.html` | Gestión de leads capturados |
| `plantillas.html` | Biblioteca de plantillas de quiz |
| `precios.html` | Página de precios/planes |

### JavaScript
| Archivo | Función |
|---------|---------|
| `app.js` | Core: Storage (localStorage), Settings, MiniApps CRUD, Quiz logic, Claude/Groq API calls, Analytics helpers |
| `supabase-config.js` | Cliente Supabase, Auth, DB helpers (profiles, quizzes, mini_apps, leads), normalización de datos |
| `ai-assistant.js` | Asistente IA flotante (chat widget) |

### Backend
| Archivo | Función |
|---------|---------|
| `api/hotmart-webhook.js` | Webhook para pagos de Hotmart |
| `api/send-email.js` | Envío de emails |
| `schema.sql` | Schema de la base de datos PostgreSQL |
| `.github/workflows/` | GitHub Actions (auto-merge de ramas claude/*) |

## Mini-App Player (mini-app-player.html)
El player soporta **19 tipos de sección** que se combinan en una sola app:
`reto`, `checklist`, `tracker`, `devocional`, `planificador`, `calculadora`, `diario`, `chatbot`, `generador`, `simulador`, `afirmaciones`, `meditacion`, `faq`, `flashcards`, `glosario`, `roadmap`, `diagnostico`, `comparador`, `biblioteca`

### Flujo de datos mini-apps
1. Dashboard: formulario crea mini-app → `MiniApps.create()` en localStorage + `DB.miniApps.save()` en Supabase
2. Los datos de contenido (affirmations, meditationScript, journalPrompts, etc.) se guardan en el campo `content` JSONB de Supabase
3. Player: carga via `MiniApps.get(id)` (localStorage) o `DB.miniApps.get(id)` (Supabase)
4. La normalización `_norm()` en supabase-config.js expande `content` al nivel superior con `...(r.content || {})`

### Audio
- Campana: Web Audio API (`playBell()`) — necesita user interaction para inicializar AudioContext
- Voz guiada: SpeechSynthesis API (TTS del navegador) con chunking para textos largos
- Volumen bell: 0.7 (principal) + 0.25 (armónico)

## Planes de Suscripción
| Plan | Precio | Quizzes | Mini-Apps | Respuestas/mes | IA | Leads | Bot Lab |
|------|--------|---------|-----------|----------------|----|-------|---------|
| Free | $0 | 1 | 2 | 500 | No | No | No |
| Starter | $5/mes | 3 | 5 | 5,000 | **No** | Sí | No |
| Pro | $9/mes | Ilimitados | Ilimitadas | 50,000 | Sí | Sí | Sí |
| Growth | $19/mes | Ilimitados | Ilimitadas | 150,000 | Sí | Sí | Sí |
| Elite | $49/mes | Ilimitados | Ilimitadas | Ilimitadas | Sí | Sí | Sí |

**Decisiones clave**:
- Starter NO incluye IA — la IA es el diferenciador para upgrade a Pro ($9)
- Límites generosos porque Groq es gratis (cada creador usa su propia API key)
- Una "respuesta" = un visitante único completando un quiz o abriendo una mini-app (contado por mes)
- El tracking usa `localStorage ls_visitor_id` + tabla Supabase `response_events` (con UNIQUE constraint)

## Features del Dashboard
- Widget de uso mensual: barra de progreso con % y avisos al 80% y 100%
- `loadUsageWidget()` llama a `ResponseTracker.getUsageStatus(ownerId)`
- Al pasar límite: advertencia visible pero NO bloquea el contenido

## White-label, Custom Domain, Subdominios
- **Dominio propio** (Pro+): `custom_domain` en profile + guía DNS en Settings + verificación via Google DNS
- **White-label** (Elite): `white_label`, `white_label_name`, `white_label_logo` en profile. Oculta "Luminous Studio" del título/meta tags del player
- **Subdominios** (Elite): array `subdomains` en profile, máximo 5

## Groq API Key (runtime de quizzes/mini-apps publicados)
Cada creador configura su propia Groq API key en Settings. **Se usa solo en runtime** — cuando los visitantes del creador interactúan con chatbots/generadores dentro de sus mini-apps publicadas.
- Obtener en console.groq.com/keys (gratis — 30 req/min)
- Se guarda en `profiles.groq_api_key`
- El Edge Function `creator-ai-proxy` (público, sin auth) recibe `{contentType, contentId, messages, ...}`, hace lookup del owner, y llama a Groq con la key del creador. Si no hay key o falla, cae a Claude con la master key de la plataforma.
- **Creación** de contenido (quizzes, mini-apps, Bot Lab, Lloyd) NO usa la Groq del creador — lo cubre la plataforma via `claude-proxy`.

La matriz de capacidades está en `app.js` → `PlanLimits`.

## Sistema IA
- **NICHE_CONTEXTS** en `app.js`: Pattern-matching para 12+ nichos (finanzas, fitness, espiritualidad, etc.) que adapta los prompts de generación
- **Generación de mini-apps**: Cuando el usuario crea una mini-app, la IA genera contenido específico (reto por días, preguntas de diario, guión de meditación, etc.)
- **Bot Lab**: 16 bots especializados con system prompts dedicados (copywriting, ads, producto, contenido)

## Notas de Desarrollo
- Comunicarse con el usuario **en español**
- Los tabs del player usan `flex-wrap` para mostrarse en múltiples líneas
- El modal de creación de mini-apps tiene `max-h-[calc(100vh-3rem)] overflow-y-auto` para scroll
- Cada sección del player tiene fallbacks para datos vacíos (busca en `app.X` y `app.content.X`)
- Afirmaciones genera contenido por defecto si no hay ninguno configurado
- Meditación tiene guión de respiración por defecto si no hay script

---

## TRABAJO PENDIENTE (continuar en nuevo chat)

### Problema detectado
El plan Free/Starter no tiene IA, pero el flujo de creación de mini-apps (`dashboard.html → handleCreateMiniApp`) SIEMPRE llama a la IA (`AI.generateAppTheme` + `AI.generateMiniAppContent`). Para usuarios sin IA esto falla o produce una mini-app vacía. Los quizzes sí tienen camino manual (plantillas + "Crear Manualmente") pero las mini-apps no.

### Solución acordada: Biblioteca de plantillas de mini-apps (Opción C — 58 plantillas)

Crear 58 plantillas prearmadas con contenido real para que Free/Starter puedan clonarlas y usarlas sin IA. Pro+ también las puede usar como atajo.

### Archivos a crear

1. **`miniapp-templates.js`** — función `getBuiltinMiniAppTemplates()` que retorna array de 58 templates. Cada template tiene:
   - Meta: `id`, `name`, `types[]`, `niche`, `category`, `subcategory`, `description`, `icon`, `primaryColor`, `secondaryColor`, `bgColor`, `headerGradient`
   - Content fields (solo los que aplican a los `types` seleccionados):
     - `retoContent: [{title, instructions, reflectionPrompt}]`
     - `initialItems: []` (checklist)
     - `trackerHabit: ''`
     - `devotionalText: ''`
     - `initialTasks: []` (planificador)
     - `journalPrompts: []`
     - `affirmations: []`
     - `meditationScript: ''`
     - `faqItems: [{q, a}]`
     - `cards: [{front, back}]` (flashcards)
     - `glossaryTerms: [{term, def}]`
     - `roadmapSteps: []`
     - `resources: [{title, url}]` (biblioteca)

2. **`plantillas-miniapps.html`** — página de galería estilo `plantillas.html` con:
   - Header "Biblioteca de Plantillas de Mini-Apps"
   - Filtros por categoría (12 categorías)
   - Buscador
   - Grid de cards con preview
   - Botón "Usar esta plantilla" que clona al dashboard

3. **Modificar `dashboard.html`** — en `handleCreateMiniApp()`:
   - Detectar plan: si `!canUsePlanFeature('ai')` → saltar las llamadas a `AI.generateAppTheme` y `AI.generateMiniAppContent`, guardar solo con `creatorContent`
   - Cambiar texto del botón según plan ("Crear con IA" vs "Crear Mini-App")
   - Agregar banner para Free/Starter linkeando a `plantillas-miniapps.html`

### Lista completa de 58 plantillas a crear

**BIENESTAR Y SALUD MENTAL (8):**
1. `tpl-ansiedad-21` Calmar la Ansiedad en 21 Días [reto, meditacion, afirmaciones, diario, checklist]
2. `tpl-burnout-30` Reset Mental: Superar el Burnout [reto, checklist, diario, afirmaciones, meditacion]
3. `tpl-dormir-21` Mejor Sueño en 21 Días [reto, checklist, tracker, meditacion]
4. `tpl-autoestima-30` Autoestima Inquebrantable [reto, afirmaciones, diario, flashcards]
5. `tpl-mindfulness-21` Mindfulness para Principiantes [reto, meditacion, tracker, diario]
6. `tpl-ruptura` Superar una Ruptura Emocional [diario, afirmaciones, checklist, roadmap]
7. `tpl-tdah` Gestionar el TDAH [checklist, planificador, flashcards, faq]
8. `tpl-gratitud-30` Diario de Gratitud 30 Días [diario, afirmaciones, tracker, reto]

**FITNESS (6):**
9. `tpl-fitness-30` Transformación Fitness 30 días [reto, tracker, checklist, faq]
10. `tpl-yoga-21` Yoga para Principiantes [reto, glosario, meditacion, flashcards]
11. `tpl-running-5k` De Cero a 5K [reto, roadmap, tracker, faq]
12. `tpl-funcional` Rutina Funcional en Casa [reto, checklist, flashcards, tracker]
13. `tpl-movilidad-21` Movilidad y Flexibilidad [reto, flashcards, checklist]
14. `tpl-calistenia` Calistenia: Tu Primer Muscle-Up [roadmap, flashcards, glosario, tracker]

**NUTRICIÓN (5):**
15. `tpl-alimentacion-21` Alimentación Balanceada [reto, checklist, flashcards, faq]
16. `tpl-keto-30` Reset Keto 30 Días [reto, glosario, faq, checklist]
17. `tpl-mealprep` Meal Prep Semanal [planificador, checklist, flashcards]
18. `tpl-ayuno` Ayuno Intermitente 16:8 [reto, tracker, faq, glosario]
19. `tpl-vegano` Nutrición Vegana Completa [glosario, faq, flashcards, checklist]

**FE Y ESPIRITUALIDAD (5):**
20. `tpl-devocional-30` Devocional Cristiano 30 Días [reto, devocional, diario, afirmaciones]
21. `tpl-manifestacion-21` Manifestación y Abundancia [reto, afirmaciones, diario, meditacion]
22. `tpl-oracion-30` Oración Intencional [reto, tracker, checklist, diario]
23. `tpl-biblia-30` Memoriza la Biblia [flashcards, reto, tracker]
24. `tpl-meditacion-espiritual` Meditación Espiritual [meditacion, afirmaciones, diario, reto]

**FINANZAS (5):**
25. `tpl-nogastos-30` Sin Gastos Innecesarios [reto, tracker, checklist, diario]
26. `tpl-deudas` Salir de Deudas [roadmap, checklist, flashcards, faq]
27. `tpl-presupuesto` Presupuesto Inteligente [checklist, planificador, flashcards, faq]
28. `tpl-inversion` Inversión para Principiantes [roadmap, glosario, flashcards, faq]
29. `tpl-libertad` Libertad Financiera [roadmap, tracker, diario, afirmaciones]

**NEGOCIOS Y MARKETING (6):**
30. `tpl-infoproducto` Lanzar tu Infoproducto [roadmap, checklist, planificador, faq]
31. `tpl-freelance` Primer Cliente Freelance [roadmap, checklist, flashcards]
32. `tpl-ventas` Framework de Ventas [flashcards, roadmap, glosario, faq]
33. `tpl-copywriting` Copywriting que Vende [flashcards, glosario, checklist, reto]
34. `tpl-seo` SEO desde Cero [roadmap, checklist, glosario, flashcards]
35. `tpl-email` Email Marketing [roadmap, flashcards, checklist, glosario]

**EDUCACIÓN (6):**
36. `tpl-ingles-30` Inglés desde Cero [reto, flashcards, glosario, faq]
37. `tpl-habitos` Productividad y Hábitos [reto, tracker, checklist, flashcards]
38. `tpl-escritura-30` Escritura Creativa [reto, diario, flashcards]
39. `tpl-programacion` Aprende Programación [roadmap, glosario, flashcards, faq]
40. `tpl-estudio` Técnicas de Estudio [flashcards, checklist, roadmap, faq]
41. `tpl-lectura` Club de Lectura [reto, tracker, diario]

**RELACIONES (5):**
42. `tpl-pareja-21` Conexión en Pareja [reto, diario, checklist, afirmaciones]
43. `tpl-embarazo` Primer Trimestre Embarazo [checklist, faq, tracker, diario]
44. `tpl-crianza` Crianza Respetuosa 0-3 [faq, checklist, flashcards, glosario]
45. `tpl-comunicacion` Comunicación Asertiva [reto, flashcards, diario, roadmap]
46. `tpl-codependencia` Superar la Codependencia [diario, afirmaciones, roadmap, flashcards]

**BELLEZA (3):**
47. `tpl-skincare-30` Skincare Nocturna [reto, checklist, glosario, faq]
48. `tpl-colorimetria` Descubre tus Colores [flashcards, glosario, faq, checklist]
49. `tpl-capsula` Cápsula de Armario [checklist, roadmap, flashcards]

**HOGAR (4):**
50. `tpl-limpieza-21` Limpia tu Casa [reto, checklist, planificador]
51. `tpl-minimalismo` Declutter 30 Días [reto, checklist, diario, afirmaciones]
52. `tpl-jardin` Jardín en Casa [roadmap, checklist, glosario, faq]
53. `tpl-zerowaste` Zero Waste [reto, checklist, flashcards, glosario]

**MASCOTAS (2):**
54. `tpl-cachorro` Tu Primer Cachorro [roadmap, checklist, faq, glosario]
55. `tpl-adiestramiento` Adiestramiento Canino [reto, flashcards, roadmap, faq]

**DESARROLLO PERSONAL (3):**
56. `tpl-habitos-atomicos` Hábitos Atómicos 66 Días [reto, tracker, flashcards, diario]
57. `tpl-proposito` Propósito de Vida [diario, roadmap, afirmaciones, flashcards]
58. `tpl-inteligencia-emocional` Inteligencia Emocional [flashcards, diario, glosario, reto]

### Inspiración visual (apps del usuario)
- **Código Cuerpo** (`codigo-cuerpo.vercel.app`): método guiado 5 pasos, selector de zonas corporales, diccionario 60 entradas, diario libre, reto 7 días, meditaciones con audio, estilo suave/floral
- **LittleStar** (`littlestar-app.vercel.app`): jornada 90 días en 4 fases, gamificación (puntos, racha, fases), quiz interactivo con audio, juego de sílabas, chatbot IA con personalidad y botones de sugerencias rápidas

### Reglas de contenido
- Todo en **español**
- Reto: 5-7 días con `title` + `instructions` (2-3 oraciones) + opcional `reflectionPrompt`
- Afirmaciones: estilo "Yo soy...", "Merezco...", "Elijo..." (8-12 por plantilla)
- Journal prompts: preguntas abiertas con "¿" (5-8 por plantilla)
- Flashcards: pares front/back útiles (8-15 por plantilla)
- FAQ: preguntas reales con respuestas de 2-3 oraciones (6-10 por plantilla)
- Glossary: término + definición clara (8-12 por plantilla)
- Roadmap: 5-8 pasos específicos y accionables
- Meditación: script 150-250 palabras en presente
- Checklist: tareas diarias accionables (6-10 items)
- `bgColor: '#0e0e0e'` siempre
- `headerGradient: 'linear-gradient(135deg, primaryColor, secondaryColor)'`

### Estrategia de escritura recomendada
**Escribir el archivo `miniapp-templates.js` en CHUNKS pequeños (5-10 plantillas por Write tool call)** para evitar "Stream idle timeout". NO intentar escribir las 58 de una vez. NO delegar a agentes (se agotan por volumen).

### Pasos de implementación (orden)
1. Crear `miniapp-templates.js` incremental (Write inicial con 5-10 plantillas + `module export`, luego Edit para agregar más bloques)
2. Crear `plantillas-miniapps.html` (copiar estructura de `plantillas.html`, adaptar a mini-apps)
3. Modificar `dashboard.html` para detectar plan y mostrar botón correcto + banner para Free/Starter
4. Commit + push a branch `claude/fix-free-tier-ai-calls-CM1dL`

### Estado actual (18 abr 2026)
- ✅ Arquitectura IA 3 capas deployed (claude-proxy + groq-proxy + creator-ai-proxy)
- ✅ White-label footer en resultado-quiz
- ✅ Gate IA en generador-ia.html corregido (requiere Pro, no Starter)
- ✅ Integraciones Zapier wired
- ✅ **Dashboard manual path para Free/Starter** — LISTO (commit `4974aaf` en `dashboard.html`: `updateMiniAppModalForPlan()` + banner `#ma-no-ai-banner` + gate `if (hasAI)` en `handleCreateMiniApp`)
- 🟡 **Plantillas mini-apps (53/58)** — EN PROGRESO, pusheadas a `claude/fix-free-tier-ai-calls-CM1dL`. Faltan las últimas 5:
  - 54. `tpl-cachorro` Tu Primer Cachorro [roadmap, checklist, faq, glosario]
  - 55. `tpl-adiestramiento` Adiestramiento Canino [reto, flashcards, roadmap, faq]
  - 56. `tpl-habitos-atomicos` Hábitos Atómicos 66 Días [reto, tracker, flashcards, diario]
  - 57. `tpl-proposito` Propósito de Vida [diario, roadmap, afirmaciones, flashcards]
  - 58. `tpl-inteligencia-emocional` Inteligencia Emocional [flashcards, diario, glosario, reto]
- ❌ **Página `plantillas-miniapps.html`** — PENDIENTE (copiar estructura de `plantillas.html`)

### Para continuar en nuevo chat
**Branch activa**: `claude/fix-free-tier-ai-calls-CM1dL` (ya pusheada, 5 commits adelante de su estado inicial)

**Paso 1 — Agregar templates 54-58 a `miniapp-templates.js`**:
- El archivo termina con `]\n},\n\n  ];\n}` en las últimas líneas (~1641-1645)
- Usar Edit tool: `old_string` = `  ];\n}` al final, `new_string` = 5 templates nuevos + `  ];\n}`
- Estructura de cada template: mismo patrón que `tpl-zerowaste` (último agregado, líneas 1622-1642)
- Campos por tipo:
  - `roadmap` → `roadmapSteps: ['paso 1', 'paso 2', ...]` (5-8 pasos)
  - `checklist` → `initialItems: ['tarea 1', ...]` (6-10 items)
  - `faq` → `faqItems: [{q:'?', a:'...'}]` (6-10)
  - `glosario` → `glossaryTerms: [{term:'', def:''}]` (8-12)
  - `reto` → `retoContent: [{title:'Día 1: ...', instructions:'...', reflectionPrompt:'?'}]` (5-7 días)
  - `flashcards` → `cards: [{front:'', back:''}]` (8-15)
  - `tracker` → `trackerHabit: '...'`
  - `diario` → `journalPrompts: ['¿...?', ...]` (5-8)
  - `afirmaciones` → `affirmations: ['Yo soy...', ...]` (8-12)

**Paso 2 — Crear `plantillas-miniapps.html`**:
- Copiar estructura de `plantillas.html` (galería de quizzes existente)
- Adaptar: cargar desde `getBuiltinMiniAppTemplates()` en vez de plantillas de quiz
- Botón "Usar esta plantilla" que pase el template al dashboard via localStorage + redirect
- Filtros por categoría (Bienestar, Fitness, Nutrición, Fe, Finanzas, Negocios, Educación, Relaciones, Belleza, Hogar, Mascotas, Desarrollo Personal)

**Paso 3 — Commit + push**:
```bash
git add miniapp-templates.js plantillas-miniapps.html
git commit -m "Complete 58 mini-app templates + gallery page"
git push -u origin claude/fix-free-tier-ai-calls-CM1dL
```

### Commits ya pusheados en esta rama
- `4974aaf` Fix free tier mini-app creation: skip AI calls for Free/Starter plans
- `44faadc` Add mini-app templates 6-14 (Bienestar + Fitness)
- `21839b6` Add nutrition templates 15-19
- `bfc6ad5` Add Fe y Espiritualidad templates 20-24
- `9914767` Add Finanzas templates 25-29
- `50ab41d` Add Negocios y Marketing templates 30-35
- `cb9f208` Add Educación templates 36-41
- `3b81250` Add Relaciones templates 42-46
- `e730c23` Add Belleza templates 47-49
- `44e8111` Add Hogar templates 50-53

### Lecciones aprendidas (evitar en próximo chat)
- **NO** anunciar "voy a hacer X" sin ejecutar el tool call en el mismo turn — causa respuestas vacías
- **NO** intentar agregar 5+ templates en un solo Edit — fallar por timeout del stream
- **SÍ** hacer los Edits de 1-2 templates por turn y commit seguido
- **SÍ** leer las últimas 15 líneas del archivo antes de cada Edit para conocer el estado exacto

---

## SESIÓN EBOOK-BUILDER (23 abr 2026) — branch `claude/fix-free-tier-ai-calls-yFJpv`

### Contexto
Trabajando sobre el `ebook-builder.html` para que genere documentos estilo Gamma (ebooks, propuestas, presentaciones, checklists). La sesión se enfocó en 3 problemas reportados por la usuaria:
1. Salidas plano/genérico — sin bloques visuales
2. Páginas mayormente vacías
3. Tema de color no respetaba la selección del dropdown

### Cambios que SÍ funcionan (deployed, merged a main vía auto-merge action)

#### Bloques visuales premium
- **`smartMd()` en `ebook-builder.html`** (~línea 562): post-procesador que convierte patrones de markdown a HTML con clases visuales ANTES de `marked.parse()`:
  - `- **Name** — desc` (3+ items) → `feature-grid`
  - `- **Name**` (multi-línea con desc abajo) → `feature-grid`
  - `N. **Title** — desc` (2–8 items) → `numbered-card`
  - `1. paso simple` (3+) → `<ol class="steps">`
  - `> texto` → `<div class="callout callout-tip/warn/info/quote">`
  - Pre-paso: merge de bullets separados por línea en blanco
- **`_docPatternRules()` en `app.js`** (~línea 918): prompt con PROHIBICIONES explícitas (no markdown lists, no blockquotes, no números sueltos en prosa) + AUTOCHECK obligatorio.
- **CSS premium para listas**: `.ebook-page ul li` con fondo de card + bullet gradiente, `.ebook-page ol:not(.steps) li` con número en badge cuadrado gradiente. Funciona aunque el AI genere markdown plano.

#### Limpieza de artefactos del source
- `generateEbookChapter` en `app.js` ahora limpia el `sourceExcerpt` antes de mandarlo al AI y también limpia el output:
  - `PÁGINA N – TITLE text` (de PDFs convertidos)
  - `Slide N:` prefijos
  - `text` suelto al final de línea
  - `[Fecha actual]` placeholders
- Retroactivo: `smartMd()` también aplica la misma limpieza al renderizar, así documentos viejos quedan limpios sin regenerar.

#### Prompt reforzado para contenido
- `_docTypePrompt('propuesta')` exige mínimo 180 palabras + 2 bloques visuales sustanciales por sección.
- `generateEbookChapter` user message: `DEBE llenar la página: mínimo 180 palabras + 2 bloques visuales`.

#### Tipos de documento
- Form tiene selector "Tipo de documento" (ebook/presentacion/propuesta/checklist/documento).
- Selector "Paleta / Tema visual" con 4 opciones (light/dark-neon/pastel/corporate).

### EL BUG GRANDE QUE FINALMENTE RESOLVÍ (al final de la sesión, commit `5ee2acd`)

**`Ebooks.create()` en `app.js` líneas 201-217 estaba descartando silenciosamente los campos `theme`, `docType` y `source`.** Tenía una lista blanca hardcodeada de campos que copiaba al crear:
```js
// ANTES — BUGGY:
create(data) {
  const ebook = {
    id, title, brief, topic, audience, tone,
    chapters, cover, messages, settings, downloads, created_at
    // falta theme, docType, source → se descartan
  };
}
```

**Consecuencia**: sin importar qué tema elegía la usuaria, `ebook.theme` siempre quedaba `undefined`. En `renderEbookPreview`, `ebook.theme || 'light'` caía al default. Las tablas siempre azules, títulos siempre azules.

**Fix**: agregar `source`, `docType`, `theme` al objeto en `Ebooks.create`.

### Cambios que NO eran necesarios / se podrían limpiar

Antes de encontrar el bug real, probé en orden (todos deployed pero no resolvían el tema):
1. CSS vars con attribute selector `[data-theme="X"]` (clásico, debería funcionar)
2. Aplicar CSS vars inline con `element.style.setProperty()`
3. Inyectar `<style>` con `!important` y colores hex concretos
4. Barra de 6px arriba que cambia con el tema (debug visual)
5. Tint del viewport background
6. Fix de race condition entre user picking theme y loadDocument async
7. `dataset.userPicked` para preservar la selección del usuario

Todos estos quedaron en el código y funcionan, pero la raíz del problema era `Ebooks.create`. Se podrían simplificar pero no es prioridad.

### Temas visuales (colores finales)
- **light**: #2E5BFF → #7c3aed (azul/púrpura) — default
- **dark-neon**: #c084fc → #22d3ee (violeta brillante → cyan)
- **pastel**: #e0749c → #f4a261 (rosa → naranja)
- **corporate**: #0a2540 → #059669 (navy oscuro → esmeralda)

### Archivos principales tocados
- `app.js`:
  - `Ebooks.create` ~línea 201 (BUG FIX crítico)
  - `generateEbookChapter` ~línea 1101 (cleanup de source + prompt reforzado)
  - `_docPatternRules` ~línea 918 (reglas con prohibiciones)
  - `_docTypePrompt` ~línea 959 (extensión mínima por tipo)
  - `_parseJSONLoose` ~línea 1030 (3-retry parse para chat responses)
  - `_extractFromBadJSON` ~línea 1069 (rescate de chat replies malformados)
  - `PlanLimits` — Pro ebooks 5→999, Growth 20→999, Free 0→1, Starter 0→3
- `ebook-builder.html`:
  - `smartMd()` + `_upgradeBlock()` ~línea 546 (markdown → visual blocks)
  - `applyThemeInline()` ~línea 767 (inyecta CSS !important por tema)
  - `THEME_VARS` + `THEME_GRADS` + `VIEWPORT_BG` (definiciones de colores)
  - Cover page usa gradiente theme-aware (ya no hardcoded)
  - Cache-buster en script tags `?v=20260423i`
  - Version label visible en header `v20260423i`
  - Console logs de diagnóstico (`[theme] change`, `[render]`)
  - Race-condition fix con `dataset.userPicked`
  - CSS con `:not(.cover)` para no pisar gradiente de portada

### Commits clave de esta sesión (último al primero)
- `f05ee89` Expose generateEbookChapter on AI facade (fix "is not a function")
- `41a132d` Move Expand-with-AI button outside .ebook-page to avoid clip on short pages
- `c2b3fa7` Add per-chapter "Expand with AI" button for retroactive improvement
- `1a5a2c6` Reinforce propuesta prompt: mandatory table + full intro + no copy-paste titles
- `5522fa7` Cover gradient always follows current theme (ignore legacy saved values)
- `5ee2acd` **Fix root cause: Ebooks.create was dropping theme/docType/source fields** ← EL FIX REAL
- `aac4257` Fix theme race condition between user interaction and async loadDocument
- `4f2cef1` Fix cover white-out + make themes visually distinct + cover tables
- `008497e` Add unmissable theme strip + error-log applyThemeInline
- `7cb5706` Inject !important style tag with concrete colors per theme
- `ba85421` Apply theme via inline CSS vars instead of relying on attribute selectors
- `eb99454` Theme handler: always give feedback, even without a loaded ebook
- `a466bb3` Add visible version indicator + theme-reactive viewport bg
- `a42972d` Revert short-page centering + bump cache-buster + add theme debug logs
- `fa63668` Make short chapters look intentional (centered + gradient accent) ← REVERTIDO
- `5cb5b11` Theme-aware cover gradient + cache-bust scripts
- `c112723` Strip source artifacts at render time too (retroactive cleanup)
- `cdcadfd` Strip source artifacts and enforce minimum content per section
- `ec45e7d` Improve list styling + expand smartMd pattern detection
- `820f481` Fix visual blocks: smartMd post-processor + stronger prompt prohibitions

### Funcionalidad "Expandir con IA" — detalles técnicos
**Qué hace**: En cada página de capítulo del documento aparece un botón gradiente al hacer hover. Click → llama a `AI.generateEbookChapter(...)` para esa sección puntual, la regenera con las reglas del docType actual, y reemplaza `ebook.chapters[i].body_md`. Las otras secciones quedan intactas.

**Ubicación en el DOM**: El botón es hermano de `.ebook-page` dentro de `.ebook-page-wrap` (NO dentro de `.ebook-page`). Fue necesario moverlo afuera porque `.chapter-body-scroll` tiene `overflow: hidden` y clippeaba el botón en páginas cortas.

**Cómo se instala**: `addRegenButtons()` en ebook-builder.html itera todos los `.ebook-page-wrap` que contengan un `.chapter-page` (skip cover) y agrega el botón si no existe. Se llama dos veces: después del render inicial y después de `paginateMainPreview()` (para que las páginas de continuación también lo tengan).

**Pass-through en AI facade**: `app.js` tiene `AI.generateEbookChapter = (params) => Claude.generateEbookChapter(params)` expuesto a partir del commit `f05ee89`. Sin esto el botón tira "is not a function".

**Request al AI**: manda el body actual del capítulo como `sourceExcerpt` con la instrucción "expandí y mejorá sobre esto". Preserva contenido real si hay algo sustancial, no empieza de cero si ya tiene algo bueno.

### Propuesta — reglas obligatorias (commit 1a5a2c6)
El prompt de `_docTypePrompt('propuesta')` ahora exige:
- Mínimo 220 palabras por sección (subido de 180)
- Al menos UNA sección con tabla markdown (cronograma, inversión, o comparativa)
- Servicios → feature-grid (no lista markdown)
- Inversión/Precios → pricing-card o stat-card
- Metodología/Proceso → numbered-card
- Introducción → 2 párrafos + feature-grid "qué incluye este documento", NO solo el título del source
- Si source es escaso, AI puede inventar descripciones (no números específicos)
- Filtro de artefactos expandido: también strippea "PROPUESTA COMPLETA PARA X" si es solo header

### Estado final
- ✅ Bloques visuales funcionando (feature-grid, numbered-card, tablas, callouts)
- ✅ Temas realmente aplicándose (rosa, violeta, navy, azul default) — después de commit 5ee2acd
- ✅ Cover gradient sigue al tema sin excepción — después de commit 5522fa7
- ✅ Artefactos del source removidos (PÁGINA N – TITLE text, etc.)
- ✅ Race condition del dropdown resuelta
- ✅ Botón "Expandir con IA" en TODAS las páginas (originales + continuaciones) y funcionando de punta a punta desde commit f05ee89
- 🟡 Páginas vacías en documentos viejos: el botón resuelve puntualmente. No hay auto-merge de secciones cortas.
- 🟡 Documentos VIEJOS (guardados antes de commit 5ee2acd) tienen `theme: undefined`. El render ahora respeta el dropdown del usuario, pero el ebook en DB sigue sin theme hasta que el user interactúe y se guarde.

### Versión actual: `v20260423n`
Visible en badge del header (junto al status). Cache-busters en script tags del mismo valor.

### Cómo el siguiente chat puede validar rápido
1. Hard-refresh sobre el builder (Ctrl+Shift+R)
2. Confirmar `v20260423n` en el header
3. Abrir un documento generado y hacer hover sobre cualquier chapter page (incluidas las vacías)
4. Debería aparecer el botón "✨ Expandir con IA" en la esquina inferior derecha
5. Click → el AI regenera esa sección puntual con las reglas del docType actual
6. Cambiar tema vía el dropdown → se aplica a TODOS los elementos (títulos, tablas, bullets, cover gradient, fondo del viewport)

Si algún botón no aparece:
- F12 → Console → escribir `document.querySelectorAll('.eb-regen-btn').length` — debería devolver `ebook.chapters.length + páginas de continuación`
- Si devuelve 0, `addRegenButtons()` no corrió o falló

Si el click tira error:
- F12 → Console → ver el error exacto
- Si dice "is not a function" sobre AI.X → ese método no está en el facade `AI` de app.js (agregarlo como pass-through a `Claude.X`)

### Lecciones clave de esta sesión
- **Cuando algo "no cambia" a pesar de muchos fixes CSS/JS, mirar la capa de persistencia**. Invertí 10+ commits en CSS/JS cuando el bug era 3 líneas en `Ebooks.create`.
- **Pedir console logs y version labels temprano**. Los logs de `[theme] change → X ebook? false` revelaron la race condition, pero el bug real (`ebook.theme = undefined` después de generar) hubiera salido antes si hubiera mirado el `[render]` log desde el principio.
- **Cache busting con `?v=X` en script tags + version label visible** es fundamental cuando el usuario reporta "sigue igual". Sin eso no hay forma de distinguir "mi fix no funciona" de "el browser sigue con versión vieja".
- **Race conditions entre user interaction y async loads**: cuando un handler lee un estado que se populará después de un `await`, considerar `dataset` flags o diferir la interacción.
- **A4 fijo + contenido variable = empty space inevitable**. Reinforcement del prompt ayuda pero no garantiza. Mejor solución: herramienta in-place (botón "Expandir con IA") que deja al usuario decidir cuándo llenar.
- **Clip sutil de `overflow: hidden`**: cuando un botón absolute-positioned "solo aparece a veces", revisar si su ancestor tiene overflow:hidden y si su bounding box cae fuera del área visible. Moverlo a un wrapper sin overflow lo soluciona.
- **Facades de AI deben exponer TODOS los métodos que el frontend usa**. Si un método nuevo vive solo en el objeto interno (Claude, Groq), hay que re-exportarlo en el facade público AI. Sin esto: `X is not a function` en runtime.
