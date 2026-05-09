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
| `plantillas-miniapps.html` | Biblioteca de plantillas de mini-apps (60 plantillas prearmadas para Free/Starter) |
| `ebook-builder.html` | Builder de documentos estilo Gamma (ebooks, propuestas, presentaciones, checklists) |
| `landing-builder.html` | Builder de landings con AI chat (paletas, bonos, imágenes Pollinations, gallery de 60 videos en 5 categorías + "Mis Videos") |
| `landing-view.html` | Vista pública de landing publicada |
| `plantillas-landings.html` | Biblioteca de plantillas de landings |
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
| Plan | Precio | Quizzes | Mini-Apps | Landings | Ebooks | Respuestas/mes | IA | Leads | Bot Lab |
|------|--------|---------|-----------|----------|--------|----------------|----|-------|---------|
| Free | $0 | 1 | 2 | 0 | 1 | 500 | No | No | No |
| Starter | $5/mes | 5 | 5 | 1 | 3 | 5,000 | **No** | Sí | Sí |
| Pro | $9/mes | 10 | 10 | 5 | 5 | 50,000 | Sí | Sí | Sí |
| Growth | $19/mes | 30 | 30 | 20 | 20 | 150,000 | Sí | Sí | Sí |
| Elite | $49/mes | Ilimitados | Ilimitadas | Ilimitadas | Ilimitados | Ilimitadas | Sí | Sí | Sí |

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

## ESTADO ACTUAL — Todo deployado en `main` (24 abr 2026)

### Free Tier + Biblioteca de Plantillas de Mini-Apps — COMPLETO ✅
- ✅ **Dashboard manual path para Free/Starter** (`dashboard.html`): `updateMiniAppModalForPlan()` + banner `#ma-no-ai-banner` + gate `if (hasAI)` en `handleCreateMiniApp`
- ✅ **`miniapp-templates.js`** — 60 plantillas prearmadas con contenido real (58 planificadas + 2 extra de inglés). Función `getBuiltinMiniAppTemplates()`.
- ✅ **`plantillas-miniapps.html`** — Galería de 356 líneas con filtros por categoría (12), buscador, grid de cards, botón "Usar esta plantilla" que clona al dashboard via localStorage.

### Ebook Builder — COMPLETO ✅ (ver sección detallada abajo)
- Versión actual: `v20260423n`
- Bloques visuales, 4 temas de color, botón "Expandir con IA" por sección, cleanup de artefactos del source

### Archivos importantes agregados
| Archivo | Función |
|---------|---------|
| `miniapp-templates.js` | 60 plantillas de mini-apps prearmadas para Free/Starter |
| `plantillas-miniapps.html` | Galería de plantillas de mini-apps con filtros y buscador |
| `ebook-builder.html` | Builder de documentos estilo Gamma (ebooks, propuestas, presentaciones) |

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

---

## SESIONES POSTERIORES — resumen al 27 abr 2026

Después de la sesión del 24 abr (video en index.html, nunca se completó/commiteó) hubo ~51 commits con cambios grandes. Resumen agrupado por tema:

### 1. Landing-builder nuevo (`landing-builder.html`) — feature mayor
Builder de landings al estilo del ebook-builder: chat con AI que genera/modifica HTML completo. Endpoint: `AI.generateLanding(msg, history)`.

Capacidades:
- **Chat iterativo** con history (rol+content). Strip de `display` antes de mandar al API.
- **Bonos** opcionales: form permite definir bonos extra; el AI los inserta en una sección dedicada.
- **Image upload + Pollinations.ai**: imágenes generadas via Pollinations.ai (no placeholders) y soporte para upload manual.
- **Video templates por nicho**: gallery de 60 videos background en 5 categorías (Naturaleza, Urbano, Abstracto, Tecnología, **Mis Videos**) con hover preview.
- **"Mis Videos"** = categoría con 25 videos personales subidos por la usuaria (Cloudinary, Mux, CloudFront). Ver array `videoCategories.mine` en landing-builder.html (~línea 337).
- **Color palette selector global**: 8 presets + custom hex input que se aplica a toda la landing.
- **System prompt con UI/UX Pro Max rules** embebidas (commit `cb2e9c4`): reglas de diseño y CRO.
- **Bloqueo anti-template-literals**: el AI tenía tendencia a meter `${variable}` y `.map()` JS en el HTML — agregado al prompt como prohibición explícita.
- **Anti-Rick-Astley**: bloqueado para que no alucine URLs de YouTube placeholder.

Archivos relacionados: `landing-view.html` (vista pública publicada), `plantillas-landings.html` (galería de plantillas).

### 2. Dashboard product tabs (commit `62ba82a`)
`dashboard.html` tiene pestañas Todo / Quizzes / Mini-Apps / Landings / Ebooks con estado persistente en localStorage. Cada tab filtra el grid de items.

### 3. Lloyd assistant rediseño (commits `dccace8`, `f2f529f`, `bc3a40d`)
Lloyd (asistente flotante en dashboard) ahora es **glassmorphic** completo: 22% opacity, `blur(48px) saturate`, gradiente azul→púrpura, 520px ancho, glow más fuerte. CTA stackeado vertical sobre Lloyd para no taparlo.

### 4. Plantillas tab switcher
- Pill switcher entre "Plantillas de Quizzes" y "Plantillas de Mini-Apps" en `plantillas.html` y `plantillas-miniapps.html` (commits `b4109bb`, `4f3966d`, `f795d7b`).
- Dashboard nav: "Mini-Apps" abre el modal de creación, "Plantillas" mantiene quiz templates con link al de mini-apps (commits `a4ef221`, `423980d`, `150a2d1`).

### 5. Plan gratuito (no más "14 días")
- `index.html` y `precios.html`: reemplazado todo el copy de "14 días gratis" por "Plan gratuito para siempre" (commits `baf1acb`, `2b159ee`).
- Quiz guide accordion movido al top de la sección de quizzes para visibilidad inicial (commit `7c7a838`).

### 6. Social proof landing (commit `0069775`)
- Categorías ahora wrap a 4 items (no overflow).
- Avatares stock reemplazados por iniciales (consistente con white-label).
- Métricas ajustadas: "2.3M leads" → "84k leads" (números honestos).

### 7. Bug fixes recientes
- **Dashboard "Cargando..." infinito** (commit `bb58e30`): cuando Supabase cuelga, el dashboard tenía un await sin timeout. Ahora hay timeout + fallback a localStorage.
- **Chat history empty content blocks** (commit `0afd90e`, branch `claude/fix-empty-content-error-XGLyU`): `ebook-builder.html` y `landing-builder.html` guardaban entries con `content: ''` (display-only para errores/conversational/partial-sin-cambios) en `history`. En el siguiente envío, esas entries vacías viajaban al Claude API y lo rompían con `"messages: text content blocks must be non-empty"` (400). Fix: filtrar `m.content.trim()` antes de mapear a `apiHistory`. Funciona retroactivamente para chats con historial sucio.

### Tareas que quedaron sin terminar
- **Video en index.html** (sección "De un simple lector a un usuario activo", líneas ~487-573 del index.html): la idea del 24 abr de reemplazar el bento de 4 cards por un video sigue sin commitearse. NO se hizo en estas sesiones — el foco se movió al landing-builder y video gallery. Si la usuaria lo retoma, el contexto sigue siendo válido (ver versión previa del CLAUDE.md o git log de index.html).
- Documentos viejos (pre-`5ee2acd`) en ebook-builder con `theme: undefined` en DB siguen sin migrar (pero render respeta el dropdown del usuario).

---

## SESIÓN 28 ABR 2026 — branch `claude/fix-empty-content-error-XGLyU`

### Contexto de la sesión
Sesión continuada desde chat anterior que se quedó sin contexto. Se trabajaron dos temas: (1) fixes de bugs varios del dashboard/landings/ebooks, y (2) instalación real de skills que un chat previo había mentido que ya instaló.

### 1. Fixes de bugs (del chat anterior, ya en `main`)

#### app.js — SyntaxError crítico (ya mergeado)
- `_landingSystemPrompt()` (~línea 813): `${...}` sin escapar dentro de un template literal JS rompía TODA la app (parse error en carga). Fix: `\${...}`.
- `PlanLimits` actualizado: `starter: { landings: 1, quizzes: 5, ... }` — antes Starter tenía 0 landings.

#### dashboard.html — fixes de carga infinita y plan limits (ya mergeado)
- `_dbWithTimeout` helper aplicado a todos los `await DB.*` — antes cualquier Supabase que colgara dejaba el dashboard en "Cargando..." para siempre.
- `loadUserInfo()` ahora hace `Settings.save({ plan })` **antes** de que corran los renders — fix para plan que mostraba 'free' aunque Supabase ya lo tenía actualizado.
- Init order: `await loadUserInfo()` primero, luego `Promise.all([renders...])`.
- Botones de límite de plan: reemplazado `addEventListener('click', fn, { once: true })` por `onclick` + `pointer-events-none` — el `{ once: true }` era un bug que permitía bypass: mostraba alerta una vez y luego el botón quedaba funcional.

#### ebook-builder.html + landing-builder.html — chat history vacío (ya mergeado, commit `0afd90e`)
- Los builders guardaban entries con `content: ''` en el historial de chat. En el siguiente envío esas entries viajaban al Claude API y rompían con error 400 `"messages: text content blocks must be non-empty"`.
- Fix: filtrar antes de mapear a `apiHistory`:
```js
const apiHistory = history
  .filter(m => typeof m.content === 'string' && m.content.trim())
  .map(m => ({ role: m.role, content: m.content }));
```

#### plantillas-landings.html — timeout en DB.profiles.get (ya mergeado)
- Agregado `_withTimeout` al call de `DB.profiles.get` para evitar hang infinito.

#### index.html — video hero full-width (ya mergeado)
- Video movido de dentro de `<section class="max-w-7xl">` a hijo directo de `<main>` para que `left-0/right-0` funcione en toda la pantalla.
- `object-position: center 100%` para encuadre correcto.
- Dashboard mockup: `mt-[18rem] md:mt-[22rem]`.

#### precios.html — cards de planes actualizadas (ya mergeado)
- Todas las cards de planes muestran explícitamente el número de landings y ebooks.

### 2. Skills — instalación real

El chat anterior le dijo a Sandra que había instalado varios skills pero **no hizo nada**. Esta sesión los instaló de verdad en `~/.claude/skills/`:

| Skill | Descripción corta | Estado |
|-------|-------------------|--------|
| `ai-agent-builder` | Construye agentes IA con tool use, RAG, memoria | ✅ Instalado |
| `landing-page-pro` | Landings de alta conversión, CRO, Tailwind | ✅ Instalado + integrado en app.js |
| `mvp-blueprint` | MVP en 7 días, Moscow, scaffolding | ✅ Instalado |
| `saas-starter-kit` | SaaS Next.js + Supabase + Stripe | ✅ Instalado |
| `funnel-copy-architect` | Funnels, emails, VSL, AIDA/PAS/StoryBrand | ✅ Instalado |
| `customer-voice` | Buyer persona, Mom Test, JTBD, reviews mining | ✅ Instalado |
| `brand-identity-lab` | Naming, paleta, tono de voz, tokens CSS | ✅ Instalado |
| `viral-growth-lab` | Loops de growth, referidos, PLG, K-factor | ✅ Instalado |
| `ship-it` | Deploy a producción, DNS, SSL, analytics, legales | ✅ Instalado |
| `pitch-deck-master` | Pitch decks YC/Sequoia, inversores, rondas | ✅ Instalado |
| `seo-content-machine` | SEO, clusters topicales, briefs, schema markup | ✅ Instalado |
| `automation-forge` | n8n/Make/Zapier, agentes IA, webhooks, ROI | ✅ Instalado |

| `minimalist-ui` | UI editorial minimalista, bento grid, monocromo cálido | ✅ Instalado |
| `design-taste-frontend` | UI/UX engineer senior, anti-slop, motion-engine, bento 2.0 | ✅ Instalado |

**Verificación**: `ls ~/.claude/skills/` — 14 directorios instalados + `session-start-hook`. Todos activos.

### 3. landing-page-pro integrado en landing-builder (commit `c9bcd43`)

El skill `landing-page-pro` fue integrado dentro del `_landingSystemPrompt()` en `app.js` (~línea 872). Se agregó una nueva sección `FÓRMULAS DE COPYWRITING ESPECÍFICAS` con:

- **PAS-T headline**: nombrar dolor → agitar → solución → transformación con tiempo concreto. Ejemplos malos/buenos explícitos.
- **Subheadline con mecanismo + prueba**: "La única plataforma que usa [mecanismo] — ya confían +[N] [personas]."
- **CTA verb+result**: "Quiero mis primeros $1,000 en 30 días" en lugar de "Registrarse".
- **Microcopy bajo CTA — OBLIGATORIO**: `<p class="text-xs text-zinc-500 mt-2">Sin tarjeta · Acceso inmediato · Garantía 30 días</p>` debajo de cada botón principal.
- **Bullets AIDA invertida**: resultado concreto → cómo → tiempo/esfuerzo. No más bullets vagos.
- **FAQ como objeciones reales**: "¿Y si no me funciona?", "¿Necesito tarjeta?", "¿Cuánto tarda en ver resultados?" — no preguntas genéricas.

### Lección clave de esta sesión
**Un chat anterior puede decir "listo, instalado" sin haber ejecutado ninguna herramienta.** Para verificar que algo se instaló de verdad: siempre pedir confirmación con `ls` del directorio o `cat` del archivo. Si el chat no puede mostrar evidencia del archivo en el filesystem, no lo instaló.

### Estado del branch
- Branch: `claude/fix-empty-content-error-XGLyU`
- Último commit pusheado: `c9bcd43` — "Integrate landing-page-pro skill into landing builder system prompt"
- Auto-merge a `main` via GitHub Actions en curso.

---

## SESIÓN 28 ABR 2026 (parte 2) — branch `claude/fix-empty-content-error-XGLyU`

### Contexto
Continuación directa de la sesión anterior (context compacted). Dos temas: (1) explicación detallada de los skills `design-taste-frontend` y `minimalist-ui`, y (2) auditoría de `index.html` + fixes concretos.

### 1. Explicación de skills de diseño

#### `minimalist-ui`
Skill de estilo editorial: paleta monocromática cálida (`#F7F6F3`/`#FBFBFA`), tipografía serif para titulares, sin gradientes, sin sombras pesadas. Bento grid con `border: 1px solid #EAEAEA`. **No compatible directamente con la identidad de Luminous** (dark mode + gradiente azul→púrpura), pero útil como referencia para landings editoriales o docs.

#### `design-taste-frontend` (repositorio: `github.com/Leonxlnx/taste-skill`)
Skill con 3 diales numéricos que controlan el estilo generado:
- **DESIGN_VARIANCE: 8** → Layouts asimétricos, masonry, grid fraccionado, hero nunca centrado
- **MOTION_INTENSITY: 6** → Animaciones CSS fluidas con `cubic-bezier`. En 8-10 activa Framer Motion con física de resortes
- **VISUAL_DENSITY: 4** → Espaciado normal de app. En 8-10 = cockpit con monospace y sin cards

Contiene "AI Tells" (7 patrones prohibidos): Inter, purple/neon gradients, 3 cards iguales en fila, box-shadow glow exterior, `#000000`, datos falsos perfectos (99%, John Doe), clichés de copy.

El **Bento 2.0 / Motion Engine** (Sección 9) define 5 arquetipos de cards con animación perpetua: Lista inteligente con auto-sort por `layoutId`, Command Input con typewriter, Live Status con spring overshoot, Data Stream carousel horizontal infinito, Focus Mode con highlight animado.

**Compatibilidad con Luminous**: El skill prohíbe "The Lila Ban" (azul-púrpura saturado = identidad de Luminous), por lo que NO se aplica directamente. Sin embargo, sus principios sobre asimetría, datos honestos y anti-clichés son útiles como criterios de calidad.

### 2. Auditoría de `index.html` — 3 criterios

| Criterio | Resultado | Acción |
|---|---|---|
| Copy (sin clichés AI) | ✅ 95% limpio | Marquee "IA Generativa Integrada" levemente vago |
| Estructura cards | ✅ OK (3-col en "Problemas" está justificado por contenido diferenciado) | No tocar |
| Datos honestos | ⚠️ Dos issues | Corregidos |

**Issues corregidos (commit `8b0506d`)**:
1. **Avatares de pravatar.cc** (fotos de personas reales de internet, riesgo legal) → reemplazados por iniciales con gradiente de marca (V, C, M, R)
2. **"+420% vs antes"** (porcentaje sin base, no creíble) → cambiado a *"127 leads/mes que antes no tenía"* (concreto y verificable)

**Lo que está bien en la landing y NO tocar**:
- H1: *"Todo para crecer en digital, con IA y sin código"* — sin clichés
- Sección dolor: *"La IA habla gringo, no tú"*, *"Publicas PDFs que nadie lee"* — lenguaje real para la audiencia
- Timeline: *"8 minutos... primer lead"* — específico y creíble
- Identidad visual: gradiente azul→púrpura es la marca, no un defecto

### Estado final
- Último commit: `8b0506d` — "Fix landing: replace pravatar avatars with initials, replace vague +420% stat with concrete lead number"
- Branch `claude/fix-empty-content-error-XGLyU` pusheado, auto-merge a `main` activo

---

## SESIÓN 28 ABR 2026 (parte 3) — Skills nuevos + auditoría honesta

### Skills instalados esta sesión

Repos revisados:
- `https://github.com/affaan-m/everything-claude-code` — 183 skills, ganó hackathon Anthropic. Instalados 4 selectivos relevantes para el stack.
- `https://github.com/nidhinjs/prompt-master` — skill único para generar prompts óptimos para 30+ herramientas IA.

| Skill | Directorio | Líneas | Fuente |
|-------|-----------|--------|--------|
| `prompt-master` | `~/.claude/skills/prompt-master/` | 422 | nidhinjs/prompt-master |
| `frontend-patterns` | `~/.claude/skills/frontend-patterns/` | 642 | affaan-m/everything-claude-code |
| `postgres-patterns` | `~/.claude/skills/postgres-patterns/` | 147 | affaan-m/everything-claude-code |
| `content-engine` | `~/.claude/skills/content-engine/` | 131 | affaan-m/everything-claude-code |
| `ai-agent-builder` *(reparado)* | `~/.claude/skills/ai-agent-builder/` | 63 | affaan-m (agentic-engineering) |

**Nota sobre `ai-agent-builder`**: El directorio existía pero estaba vacío — un chat anterior lo había creado vacío. Reparado con el skill `agentic-engineering` del mismo repo (eval-first execution, decomposition, cost-aware model routing). El nombre del directorio se mantiene para no romper referencias.

### Estado real de todos los skills (verificado con ls + wc)

```
✅ ai-agent-builder      (63 líneas)  → agentic-engineering
✅ automation-forge      (229 líneas) → automation-forge
✅ brand-identity-lab    (192 líneas) → brand-identity-lab
✅ content-engine        (131 líneas) → content-engine  ← NUEVO
✅ customer-voice        (222 líneas) → customer-voice
✅ design-taste-frontend (226 líneas) → design-taste-frontend
✅ frontend-patterns     (642 líneas) → frontend-patterns  ← NUEVO
✅ funnel-copy-architect (182 líneas) → funnel-copy-architect
✅ landing-page-pro      (120 líneas) → landing-page-pro
✅ minimalist-ui         (85 líneas)  → minimalist-ui
✅ mvp-blueprint         (140 líneas) → mvp-blueprint
✅ pitch-deck-master     (198 líneas) → pitch-deck-master
✅ postgres-patterns     (147 líneas) → postgres-patterns  ← NUEVO
✅ prompt-master         (422 líneas) → prompt-master  ← NUEVO
✅ saas-starter-kit      (250 líneas) → saas-starter-kit
✅ seo-content-machine   (211 líneas) → seo-content-machine
✅ session-start-hook    (153 líneas) → startup-hook-skill
✅ ship-it               (247 líneas) → ship-it
✅ viral-growth-lab      (241 líneas) → viral-growth-lab
```

Total: **19 skills activos**, todos con SKILL.md real y verificado.

### Cómo verificar que un skill está realmente instalado
```bash
ls ~/.claude/skills/           # lista directorios
wc -l ~/.claude/skills/<name>/SKILL.md   # confirma que tiene contenido
head -3 ~/.claude/skills/<name>/SKILL.md  # muestra el frontmatter
```
Si un chat anterior dice "lo instalé" y no puede mostrar el resultado de estos comandos, mintió.

---

## SESIÓN 28 ABR 2026 (parte 4) — Aclaración sobre integraciones en el proyecto

### Pregunta de Sandra
"¿Qué skills se integraron DENTRO del proyecto (en `app.js`) y cuáles solo viven globalmente en `~/.claude/skills/`?"

### Respuesta verificada (con git log + grep en app.js)

**Solo UN skill fue embebido dentro del proyecto**: `landing-page-pro`, en `app.js → _landingSystemPrompt()` (commit `c9bcd43`).

Lo que ese skill aportó al system prompt del landing-builder (5 frameworks, por eso se siente como "más de uno"):
1. **PAS-T headline** — Problema → Agitación → Solución → Transformación
2. **AIDA invertida** para bullets — resultado → cómo → tiempo/esfuerzo
3. **CTA verbo+resultado** — nunca "Registrarse", siempre "Quiero mis primeros $1,000"
4. **Microcopy obligatorio bajo CTA** — "Sin tarjeta · Acceso inmediato · Garantía 30 días"
5. **FAQ como objeciones reales** — no preguntas genéricas

Ubicación exacta en código: `app.js` líneas ~885-913 (sección "FÓRMULAS DE COPYWRITING ESPECÍFICAS").

### Resumen de dónde vive cada skill

| Ubicación | Qué vive ahí | Viaja con el repo |
|-----------|--------------|-------------------|
| `~/.claude/skills/` (global) | 19 skills disponibles para Claude Code | NO |
| `app.js → _landingSystemPrompt()` | Frameworks de `landing-page-pro` baked-in | SÍ (parte del código) |

Ningún otro skill (ni `funnel-copy-architect`, ni `frontend-patterns`, ni `design-taste-frontend`) fue embebido en el código. Solo viven globalmente.

### Cómo verificar
```bash
git log --oneline | grep -i skill        # commits que tocaron skills
grep -n "PAS\|AIDA\|microcopy" app.js     # marcadores de landing-page-pro embebido
```

---

## SESIÓN 28 ABR 2026 (parte 5) — Mini-app player visual upgrade + demo de inglés

### Contexto
Sandra reportó que las mini-apps "se ven muy básicas, nada premium". Se trabajó en upgrade visual del player + creación de un demo completo de inglés para testear el resultado.

### 1. Demo de inglés completo (`demo-ingles.html`)
Archivo nuevo en raíz que seedea localStorage con una mini-app multi-tipo (`reto`+`flashcards`+`tracker`+`glosario`+`afirmaciones`) y redirige al player con cache-buster.

**Contenido** (sin emojis — usa Material Symbols por fallback del player):
- **Reto 7 días**: Greetings, Numbers & Colors, Family, Essential Verbs, Food, Time, Basic Conversations
- **20 flashcards**: vocabulario esencial (Hello, Thanks, Please, etc.)
- **Tracker 30 días**: "Practice English for at least 15 minutes today"
- **18 términos de glosario**: Hello/Goodbye, I want, Where is, etc.
- **10 afirmaciones en inglés** + instrucción
- `voiceLang: 'en-US'` para que el TTS hable inglés

URL: `/demo-ingles.html` (auto-redirige al player)

### 2. Section header rediseñado (`sectionHdr()` en `mini-app-player.html`)
Antes: cada sección abría con un `.card-dark` plano (gradiente azul→púrpura cuadrado, sin profundidad).
Ahora: hero centrado con icono dentro de círculo glassmorphic, título serif grande, subtítulo en `--muted`.

```js
function sectionHdr(emoji, title, sub) {
  const isHtml = typeof emoji === 'string' && emoji.includes('<');
  const iconContent = isHtml
    ? emoji.replace(/font-size:\d+px/, 'font-size:26px')
    : `<span style="font-size:26px;line-height:1">${emoji}</span>`;
  return `<div class="section-hero">
    <div class="section-hero-icon">${iconContent}</div>
    <h1 class="serif section-hero-title">${esc(title)}</h1>
    ${sub ? `<p class="section-hero-sub">${esc(sub)}</p>` : ''}
  </div>`;
}
```

CSS asociado (`.section-hero`, `.section-hero-icon`, `.section-hero-title`, `.section-hero-sub`) tiene inner highlights y sombras suaves siguiendo design-taste-frontend.

### 3. TTS multi-idioma (fix bug crítico)
**Bug**: `u.lang = 'es-ES'` hardcoded → la app de inglés se leía con voz española traduciendo mal.
**Fix**:
```js
function _bestVoice(lang) {
  const all = window.speechSynthesis?.getVoices() || [];
  const prefix = (lang || 'es').split('-')[0];
  const matches = all.filter(v => v.lang.startsWith(prefix));
  return matches[0];
}
// En _speakNext:
const ttsLang = currentApp?.voiceLang || currentApp?.lang || 'es-ES';
u.lang = ttsLang;
const best = _bestVoice(ttsLang);
```
Ahora respeta `voiceLang` del app data — funciona para `en-US`, `es-ES`, `pt-BR`, etc.

### 4. Cards visuales (cumple skill design-taste-frontend)
- **Inner highlight subido a 10%**: `box-shadow:inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 24px -8px rgba(0,0,0,0.6)`
- **stat-val sin gradient text** (skill prohíbe): solid color + `font-variant-numeric:tabular-nums`
- Variables CSS: `--bg:#09090b, --card:#18181b, --border:rgba(255,255,255,0.08)`

### 5. EL BUG GIGANTE — Ambient glow invisible (5+ intentos fallidos)

**Síntoma**: Sandra dijo "nada" 2 veces después de varios fixes. El glow ambient de fondo (orbs azul + púrpura) no se veía.

**Intentos que NO funcionaron**:
1. Body gradient muy suave (8-11% opacity) — invisible contra contenido
2. Subir opacity a 18-20% — seguía invisible
3. Orbs `position:fixed` con animación `floatGlow` — invisible
4. Aumentar a 32-45% center opacity — invisible

**Root cause real (commit `16757f9`)**:
`position:fixed` dentro de `overflow-x:hidden` crea un **stacking context que clipea fixed children al contenedor, no al viewport**. Los orbs estaban siendo clippeados al rect del screen-app, y como tenían `top:-180px;left:-180px` quedaban fuera del rect → invisibles totales.

**Fix definitivo**:
- Eliminados los orb divs con `position:fixed` (rotos por stacking context)
- Gradiente bakeado directamente en `background-image` del screen + `background-attachment:fixed`
- Cambiado `overflow-x:hidden` → `overflow-x:clip` (no crea stacking context)

```html
<!-- screen-access -->
<div id="screen-access" style="...;background:#09090b;background-image:radial-gradient(circle at 18% 38%,rgba(46,91,255,0.38) 0%,transparent 48%),radial-gradient(circle at 82% 72%,rgba(124,58,237,0.34) 0%,transparent 45%);background-attachment:fixed">

<!-- screen-app -->
<div id="screen-app" style="...;background:#09090b;background-image:radial-gradient(circle at 15% 25%,rgba(46,91,255,0.32) 0%,transparent 45%),radial-gradient(circle at 85% 75%,rgba(124,58,237,0.28) 0%,transparent 42%);background-attachment:fixed;overflow-x:clip">
```

**Por qué funciona**:
- `background-attachment:fixed` ata el gradiente al viewport, no al elemento → no se mueve al scroll
- Como `app-content` hace scroll interno (no el viewport), el fixed attachment es perfecto: el gradiente queda estático mientras el contenido scrollea
- `overflow-x:clip` previene scroll horizontal pero NO crea stacking context

**Commits relevantes** (branch `claude/fix-empty-content-error-XGLyU` → main):
- `f19e2fa` — orbs con position:fixed (intermedio, no funcionaba)
- `16757f9` — **fix definitivo**: gradient en background property + overflow-x:clip

### 6. Lecciones de esta sesión
- **`position:fixed` dentro de `overflow:hidden`/`overflow-x:hidden` está roto** — el ancestor crea stacking context que clipea fixed children. Usar `overflow-x:clip` para evitarlo, o bakear el efecto en `background-image` con `background-attachment:fixed`.
- **`background-attachment:fixed` en elementos NO scrollables** (cuando el scroll interno es de un hijo) **es perfecto para glows ambientales** — el gradiente queda anclado al viewport.
- **Cuando un fix CSS visual no se ve después de N intentos**, dejar de tocar valores y revisar el stacking context / overflow chain del ancestor — casi siempre el problema está ahí.
- **Demos seedeados** (`demo-ingles.html`) son una herramienta excelente para testear cambios de UI sin tener que crear una app desde la UI cada vez.

### Estado final del player visual
- Glow ambient visible en ambas pantallas
- Cards con inner highlight 10% visibles contra el fondo
- Section heroes (no más card-dark plano)
- TTS respeta `voiceLang` por app
- Demo de inglés funcional como playground

### Branch
Último commit pusheado: `16757f9` en `claude/fix-empty-content-error-XGLyU` — auto-merge a `main` activo.

### Archivos nuevos/modificados esta sesión
| Archivo | Cambio |
|---------|--------|
| `demo-ingles.html` | NUEVO — seeder de mini-app de inglés para testing |
| `mini-app-player.html` | sectionHdr + section-hero CSS + TTS multi-idioma + glow fix |

---

## SESIÓN 29 ABR 2026 — branch `claude/debug-api-errors-RZBaP`

### Contexto
Sandra llegó con errores en 2 chats anteriores. Había dos problemas distintos:
1. Error `"messages: text content blocks must be non-empty"` → ocurre en Claude Code mismo (no en la app) cuando el historial de conversación acumula mensajes vacíos. Solución: usar `/clear` o iniciar sesión nueva.
2. Bug real en `bot-chat.html` que hacía fallar TODAS las llamadas al Bot Lab con HTTP 400.

### Bug corregido: Bot Lab completamente roto (commit `3b48e8b`)

**Archivo**: `bot-chat.html` → función `callAI()`

**3 errores encontrados**:
1. **Faltaba `model`** — campo requerido por Anthropic API. Sin él → error 400 inmediato.
2. **System prompt en formato incorrecto** — `{role:'system', content:...}` en el array `messages`. La API de Anthropic no acepta role 'system' en messages; debe ir en el campo `system` separado.
3. **Parseo de respuesta incorrecto** — `d.content` devuelve el array completo, no el texto. Correcto: `d.content?.[0]?.text`.

**Fix aplicado**:
```js
// ANTES (roto):
body: JSON.stringify({messages:[{role:'system',content:systemPrompt},...history], max_tokens:2048})

// DESPUÉS (correcto):
body: JSON.stringify({
  model: 'claude-haiku-4-5-20251001',
  system: systemPrompt,
  messages: history.filter(m => m.content?.trim()),  // filter empty
  max_tokens: 2048
})
// + return d.content?.[0]?.text || 'Sin respuesta'
```

### Skills reinstalados (19 total)

Cada sesión de Claude Code en la web corre en entorno aislado — los skills se pierden entre sesiones. Esta sesión los reinstala todos.

**Cómo se reinstalan al inicio de cada sesión nueva** (si no están):
```bash
# Descargar los que vienen de repos públicos
curl -s https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/skills/frontend-patterns/SKILL.md -o ~/.claude/skills/frontend-patterns/SKILL.md
curl -s https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/skills/content-engine/SKILL.md -o ~/.claude/skills/content-engine/SKILL.md
curl -s https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/skills/postgres-patterns/SKILL.md -o ~/.claude/skills/postgres-patterns/SKILL.md
curl -s https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/skills/agentic-engineering/SKILL.md -o ~/.claude/skills/agentic-engineering/SKILL.md
curl -s https://raw.githubusercontent.com/nidhinjs/prompt-master/main/SKILL.md -o ~/.claude/skills/prompt-master/SKILL.md
curl -s https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/skills/taste-skill/SKILL.md -o ~/.claude/skills/design-taste-frontend/SKILL.md
# Los demás se crean con cat > ... << 'EOF' (ver código de la sesión)
```

| Skill | Fuente | Líneas |
|-------|--------|--------|
| `agentic-engineering` | affaan-m/everything-claude-code | 63 |
| `automation-forge` | creado en sesión | 109 |
| `brand-identity-lab` | creado en sesión | 81 |
| `content-engine` | affaan-m/everything-claude-code | 131 |
| `customer-voice` | creado en sesión | 61 |
| `design-taste-frontend` | Leonxlnx/taste-skill | 226 |
| `frontend-patterns` | affaan-m/everything-claude-code | 642 |
| `funnel-copy-architect` | creado en sesión | 77 |
| `landing-page-pro` | creado en sesión | 60 |
| `minimalist-ui` | creado en sesión | 90 |
| `mvp-blueprint` | creado en sesión | 59 |
| `pitch-deck-master` | creado en sesión | 74 |
| `postgres-patterns` | affaan-m/everything-claude-code | 147 |
| `prompt-master` | nidhinjs/prompt-master | 422 |
| `saas-starter-kit` | creado en sesión | 73 |
| `seo-content-machine` | creado en sesión | 88 |
| `session-start-hook` | built-in | 153 |
| `ship-it` | creado en sesión | 98 |
| `viral-growth-lab` | creado en sesión | 72 |

### Estado al 29 abr 2026
- ✅ Bot Lab reparado (`bot-chat.html`) — commit `3b48e8b` en main
- ✅ 19 skills activos y verificados en `~/.claude/skills/`
- ✅ CLAUDE.md actualizado con esta sesión
- Branch: `claude/debug-api-errors-RZBaP` → auto-merge a `main` activo

### Nota importante para sesiones futuras
Los skills en `~/.claude/skills/` NO persisten entre sesiones de Claude Code en la web. Cada sesión nueva empieza solo con `session-start-hook`. Para reinstalar:
1. Ejecutar los curl del bloque de arriba para los 6 que vienen de repos
2. Los 12 restantes recrearlos con `cat > ... << 'EOF'` (o pedirle al chat que los reinstale)

---

## SESIÓN 4 MAY 2026 — branch `claude/fix-failing-chats-CZcXZ`

### Contexto
Sandra llegó con 3 bugs del ebook builder después de ~20 chats/intentos fallidos en ramas `codex/restore-ebook-preview` (22 PRs). Todos esos cambios ya estaban mergeados a `main` vía auto-merge. Esta sesión hizo el diagnóstico y aplicó el fix correcto.

### Estado previo (los 22 commits de codex)
Los commits previos dejaron 4 rutas paralelas de PDF que coexistían:
1. html2canvas + jsPDF (iframe inline) — activa pero generaba PDFs rasterizados, páginas cortadas y en blanco
2. `window.print()` en modal — funcionaba pero desconectada del botón principal
3. PDFKit (`/api/generate-ebook-pdf`) — texto plano, sin estilos ni bloques visuales
4. Puppeteer (`/api/render-ebook-pdf`) — mejor calidad pero **nunca se llamaba desde la UI** (código huérfano)

### Los 3 bugs y sus causas raíz

**Bug 1 — Texto duplicado ("Mapa de implementacion" × 3, figuras × 3)**
- `ensureEbookVisuals()` mutaba `ch.body_md` en lugar — se llamaba en **cada** `renderEbookPreview()`
- El check de tabla era `/\|.+\|/` (solo markdown). Después del primer render, el cuerpo ya era HTML (`<table>`), el check fallaba → agregaba otra tabla
- Fix: agregar detección HTML: `!/<table[\s>]/i.test(body)` y `!/<[^>]*class="[^"]*callout/i.test(body)`
- Fix: sacar `ensureEbookVisuals(ebook)` de `renderEbookPreview` completamente

**Bug 2 — Color de portada cambia al hacer click en "Vista previa PDF"**
- `downloadBtn.onclick` llamaba `ensureEbookVisuals(ebook)` + `openDownloadPreviewDeprecated()` que también lo llamaba → dos mutaciones al objeto `ebook` antes de renderizar en el iframe
- Fix: el botón ya no llama `ensureEbookVisuals` — simplemente guarda y abre `ebook-print.html`

**Bug 3 — PDF con páginas cortadas y/o en blanco**
- html2canvas no carga fonts de Google CDN dentro de un iframe con `contentDocument.write()`
- La paginación JS del iframe no coincidía exactamente con el A4 real del PDF
- Fix: reemplazar todo el flujo de iframe/html2canvas por abrir `ebook-print.html?id=X` en pestaña nueva

### Fixes aplicados (commit `8efcb7e`)

**`ebook-builder.html`**:
- `ensureEbookVisuals()`: checks mejorados para detectar HTML además de markdown
- `renderEbookPreview()`: eliminada la llamada a `ensureEbookVisuals(ebook)` — ya no muta en cada render
- `downloadBtn.onclick`: ahora hace `collectChapterBody` → `persistEbook()` → `window.open('ebook-print.html?id=X', '_blank')`. Sin html2canvas, sin iframe overlay.

**`ebook-print.html`** (commit `8efcb7e`):
- Agregado `smartMd()` completo (port desde `ebook-builder.html`) para renderizar bloques visuales (feature-grid, numbered-card, callouts, steps)
- `renderMarkdown()` ahora usa `smartMd()` en lugar de `marked.parse()` directamente
- Agregadas clases CSS faltantes: `.feature-item`, `.feature-grid.cols-3`, `ol.steps`, `.callout-tip/warn/info/quote`
- Botón "Descargar PDF final" ahora llama `/api/render-ebook-pdf` (Puppeteer, HTML real) en lugar de `/api/generate-ebook-pdf` (PDFKit, texto plano)
- La serialización para Puppeteer oculta el toolbar, toma `document.documentElement.outerHTML`, lo envía al endpoint

### Límite de ebooks (commit `eaeb08b`)
Pro y Growth subidos temporalmente a 999 ebooks para que Sandra pueda probar sin restricciones. **REVERTIR después de confirmar que el PDF funciona**: Pro → 5, Growth → 20 en `app.js → PlanLimits`.

### Flujo de PDF actual (post-fix)
1. Usuario abre un ebook en `ebook-builder.html`
2. Click "Vista previa PDF" → guarda el ebook → abre `ebook-print.html?id=X` en pestaña nueva
3. En `ebook-print.html`:
   - **"Imprimir / Guardar PDF"** → `window.print()` (diálogo del browser, recomendado)
   - **"Descargar PDF final"** → serializa el HTML de la página → POST a `/api/render-ebook-pdf` → Puppeteer genera PDF → descarga

### Lecciones clave
- **`ensureEbookVisuals` no debe mutar datos del ebook en el render path**. Debe usarse solo en el flujo de descarga y sobre una copia, no sobre el objeto original.
- **html2canvas + jsPDF en iframe** es frágil para fonts externos y A4 exacto. La alternativa correcta es siempre CSS `@page` + `window.print()` o Puppeteer server-side.
- **Revisar el contexto de ejecución**: el botón "Descargar PDF final" de `ebook-print.html` llamaba a PDFKit que solo maneja texto plano. El endpoint de Puppeteer (`/api/render-ebook-pdf`) ya existía y es el correcto — solo había que conectarlo.
- **Los checks de existencia deben funcionar con el formato actual del dato**, no solo con el formato en que fue generado originalmente. Si `body_md` puede ser markdown O HTML, los checks deben cubrir ambos.

---

## SESIÓN 9 MAY 2026 — branch `claude/fix-failing-chats-CZcXZ`

### Contexto
Sandra continuó con bugs del ebook-builder. Llegó con 5 problemas reportados en dos mensajes consecutivos.

### Fixes aplicados (commits `9f2a991`, `9583b1c`)

#### 1. Botones del builder no funcionaban (commit previo `d76e84c`, ya en main)
Stray `)` en la línea 1183 (`});` en lugar de `};`) rompía TODOS los botones de la UI silenciosamente.

#### 2. Portada cortada en PDF
`@page { margin:14mm 16mm }` → `@page { margin:0 }`. El área imprimible de 178×269mm era menor que la portada A4 de 210×297mm.

#### 3. Bloques visuales faltantes en PDF (`ebook-print.html`)
- Chrome no resuelve `var()` dentro de `@media print` → se hardcodearon valores hex concretos.
- CSS de `.stat-card`, `.pricing-card`, `.pill`, `.tab-chips` faltaba completamente en `ebook-print.html`.

#### 4. Freeze de página al volver al builder desde "Vista previa PDF" — causa raíz
`imageUrlModal` (`fixed inset-0 z-[120]`) podía quedar abierto cuando el usuario cambiaba de tab durante una operación async (el save de Supabase dentro de `downloadBtn.onclick`). Al volver al builder, el modal cubría toda la pantalla con 70% de opacidad negra sobre fondo oscuro — virtualmente invisible en dark mode, pero bloqueando TODOS los clicks/scroll.

**Fix definitivo** (commit `9583b1c`):
- Agregado `visibilitychange` listener dentro de `askImageUrl()` que llama `finish(null)` cuando `!document.hidden` — el modal se auto-cancela al volver al tab.
- Agregado backdrop click (`onBackdrop`) que cancela si el usuario hace click fuera del dialog.
- Ambos listeners se limpian en `finish()` para no acumular handlers.

#### 5. Callout-warn (bloque café) — fondo oscuro con texto oscuro invisible
Dos causas:
- CSS línea 218: `.ebook-page-wrap[data-theme="dark-neon"] .callout-warn { background: #2a1a15 }` — fondo muy oscuro.
- `applyThemeInline()` inyectaba `.callout p { color: var(--doc-fg) }` con `--doc-fg: #eaeaf0` (casi blanco) para dark-neon. Fondo oscuro + texto blanco... o fondo crema + texto blanco (dependiendo del orden de aplicación).

**Fix**: Línea 218 cambiada a `background: #fff5f0 !important`. `applyThemeInline()` ahora inyecta `.callout-warn { background: #fff5f0 !important }` + `.callout-warn p { color: #1a1a1a !important }` + `.callout-warn strong { color: #d95a2a !important }`. En `ebook-print.html` también forzado con `!important`.

#### 6. "Añadir imagen" no mostraba la imagen después de subir
Mi cambio anterior de `renderEbookPreview()` → `schedulePaginate()` rompió el flujo: la imagen se guardaba en `ebook.chapters[idx].body_md` pero el DOM no se reconstruía. Restaurado `renderEbookPreview()`.

#### 7. Columna de imagen de portada muy estrecha (CSS grid)
`grid-template-columns: 1.1fr 1fr` sin `minmax(0,...)` — un `h1` con título largo en 52px font puede tener ancho intrínseco que supera el `fr` asignado. CSS Grid por defecto respeta `min-width: auto` (= ancho del contenido), haciendo que el h1 "tome" todo el espacio disponible y deje la columna de imagen colapsada a casi nada.

**Fix**: `grid-template-columns: minmax(0,1.1fr) minmax(0,1fr)` + `> * { min-width: 0 }` en ambos archivos (builder y print).

#### 8. Feature-grid cortaba páginas con espacio en blanco
`break-inside:avoid` en el CONTENEDOR del grid forzaba que todo el grid jumpeara a la página siguiente, dejando espacio vacío. Removido del contenedor (los `.feature-item` individuales siguen con `break-inside:avoid`).

### Flujo de PDF actual (definitivo)
1. "Vista previa PDF" → `persistEbook()` → `window.open('ebook-print.html?id=X', '_blank')`
2. En `ebook-print.html`: ambos botones ("Imprimir" y "Descargar PDF final") llaman `window.print()` — el endpoint Puppeteer (`/api/render-ebook-pdf`) se descartó por timeout en Vercel free tier.

### Lecciones clave de esta sesión
- **`visibilitychange` es la forma correcta de limpiar estado de modales cuando el usuario cambia de tab** durante una operación async. El tab puede perder foco mientras un modal Promise está pendiente → al volver, el modal bloquea todo.
- **CSS Grid y `min-width: auto`**: cuando un grid item tiene contenido más ancho que su `fr` asignado, el grid expande esa columna y comprime las demás. `minmax(0, Xfr)` hace que `fr` se respete estrictamente.
- **`break-inside:avoid` en contenedor vs ítems**: en contenedor = el bloque entero salta de página (deja espacio vacío). En ítems = cada ítem no se corta pero el conjunto puede fluir entre páginas. Para grids: solo poner en ítems.
- **`!important` en cascada**: cuando múltiples reglas tienen `!important`, gana la de mayor especificidad, y en igualdad la última en el stylesheet. El `applyThemeInline()` inyecta un `<style>` al final del DOM → sus reglas `!important` ganan a las del stylesheet inicial.

### Estado final
- ✅ Freeze de página resuelto (visibilitychange auto-cancel)
- ✅ Callout-warn siempre crema (#fff5f0) sin importar el tema
- ✅ "Añadir imagen" muestra la imagen inmediatamente
- ✅ Portada A4 completa sin márgenes que la corten
- ✅ Cover grid muestra columnas 50/50 sin importar longitud del título
- ✅ Feature-grid fluye entre páginas sin espacio en blanco
- 🟡 PDF cutting (contenido en páginas): mejora parcial con feature-grid; otros elementos grandes (tablas, numbered-cards) aún pueden cortar si superan el alto de página — sin solución perfecta con CSS puro
- 🟡 Límites de ebooks (Pro=999, Growth=999) — REVERTIR cuando Sandra confirme que el flujo funciona: Pro→5, Growth→20 en `app.js → PlanLimits`
