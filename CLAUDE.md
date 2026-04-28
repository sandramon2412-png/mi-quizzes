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
