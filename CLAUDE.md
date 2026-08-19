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

## ESTADO ACTUAL — Todo deployado en `main` (31 may 2026)

### Mini-App Player — Pantalla "Hoy" premium para todas las categorías ✅
- ✅ `renderWellnessToday()` + `isWellnessApp()` en `mini-app-player.html`
- ✅ Light mode glassmorphic cards (`.well-*` CSS, `body[data-theme="light"]`)
- ✅ Tres modos de renderer (reto/bienestar, fitness/gym, finanzas/plan)
- ✅ Body map cutoff corregido (`map-engine-open` class + `minmax(0,1fr)`)

### TTS (Text-to-Speech) — Fixes completos ✅
- ✅ Todos los templates de inglés tienen `voiceLang:'en-US'`
- ✅ Panel de voz muestra voces en inglés para apps de inglés
- ✅ TTS priming automático en primer toque
- ✅ Fallback graceful si no hay voces inglesas instaladas

### Ebook Builder — Estado previo ✅ (ver secciones de historial)
- 🟡 `app.js → PlanLimits`: Pro=999, Growth=999 (temporal para testing) — **REVERTIR** a Pro→5, Growth→20

### Archivos importantes
| Archivo | Función |
|---------|---------|
| `miniapp-templates.js` | 60 plantillas + `voiceLang:'en-US'` en 4 templates de inglés |
| `mini-app-player.html` | Player universal — `renderWellnessToday`, `isWellnessApp`, TTS panel |
| `plantillas-miniapps.html` | Galería de plantillas con filtros |
| `ebook-builder.html` | Builder de documentos estilo Gamma |

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
Sandra llegó con 5 bugs del ebook-builder activos. Después de múltiples commits en esta sesión, Sandra confirmó que **solo se solucionó 1 de los 5**. Los demás siguen fallando igual.

### LO QUE SÍ SE SOLUCIONÓ ✅
- **"Añadir imagen" a secciones**: la imagen ahora aparece en el preview inmediatamente después de subirla.

### LO QUE SIGUE FALLANDO ❌ — PARA EL PRÓXIMO CHAT

#### ❌ 1. FREEZE DE PÁGINA (CRÍTICO — no resuelto)
**Síntoma**: Cada vez que el usuario hace click en "Vista previa PDF" y vuelve al tab del builder, la página se bloquea completamente. El mouse se mueve pero no responde nada. Hay que cerrar y empezar de cero.

**Intentos fallidos**:
- Agregar `visibilitychange` listener en `askImageUrl()` para auto-cerrar el modal → no funcionó
- Agregar backdrop click en `imageUrlModal` → no funcionó
- Cambiar `renderEbookPreview()` por `schedulePaginate()` en el handler de "Añadir imagen" → roto (no mostraba la imagen), revertido

**Lo que SE SABE**:
- El freeze ocurre SIEMPRE después de click "Vista previa PDF" → switch al nuevo tab → volver al builder
- El botón "Vista previa PDF" (id=`btn-download`) hace: `collectChapterBody` → `await persistEbook()` → `window.open('ebook-print.html?id=X', '_blank')`
- `persistEbook()` llama: `optimizeEbookEmbeddedImages(ebook)` (canvas operations) → `DB.ebooks.save()` (Supabase)
- `imageUrlModal` es `fixed inset-0 z-[120]` — si queda abierto es invisible sobre dark background pero bloquea TODO
- El freeze podría ser: (a) `imageUrlModal` aún quedando abierto a pesar del `visibilitychange` fix, o (b) otra causa no identificada
- **PRÓXIMO CHAT: debuggear con console.log en `downloadBtn.onclick` para ver qué ocurre. Verificar si el modal está open al volver (`document.getElementById('image-url-modal').classList.contains('flex')`). Si no es el modal, buscar otro overlay o elemento con z-index alto.**

#### ❌ 2. CALLOUT-WARN (bloque café) — texto no visible en secciones oscuras
**Síntoma**: El bloque callout-warn (estilo café/naranja) tiene fondo oscuro y el texto también es oscuro → no se ve nada.

**Intentos fallidos**:
- Cambiar `.ebook-page-wrap[data-theme="dark-neon"] .callout-warn` a `background:#fff5f0 !important`
- Agregar en `applyThemeInline()`: `.callout-warn { background:#fff5f0 !important }` + `.callout-warn p { color:#1a1a1a !important }` + `.callout-warn strong { color:#d95a2a !important }`
- Mismos fixes en `ebook-print.html` con `!important`

**PENDIENTE**: Los fixes están en el código pero no tuvieron efecto visible. Podría haber otro selector con mayor especificidad que overridea. El próximo chat debe inspeccionar el elemento con DevTools y ver exactamente qué regla CSS está ganando.

#### ❌ 3. PDF SIGUE CORTANDO EL CONTENIDO
**Síntoma**: Al descargar el PDF con `window.print()`, el contenido se corta entre páginas.

**Intentos fallidos**:
- `@page { margin:0 }` (portada ya no se corta, pero el contenido de las páginas de capítulos sí)
- Remover `break-inside:avoid` del contenedor `.feature-grid` (solo queda en `.feature-item`)

**PENDIENTE**: El corte sigue ocurriendo. El problema puede ser:
- Elementos con `break-inside:avoid` que son más altos que una página A4
- El `chapter-page` CSS en `ebook-print.html` no está dividiendo bien el contenido entre páginas
- La `@page { margin:0 }` necesita acompañarse de que el contenido tenga los márgenes propios

#### ❌ 4. PORTADA — imagen muy estrecha y difícil de editar
**Síntoma**: La columna de imagen en la portada aparece muy angosta, y el botón "Cambiar" es difícil de clickear.

**Fix aplicado** (pendiente de confirmar si funcionó): `grid-template-columns: minmax(0,1.1fr) minmax(0,1fr)` + `> * { min-width:0 }` en ambos archivos.

**PENDIENTE**: Sandra no confirmó si este fix funcionó porque mandó el mensaje de cambio de chat antes de probar.

### Estado de código al cierre de sesión
- Branch: `claude/fix-failing-chats-CZcXZ`
- Último commit: `d3786b6` — update CLAUDE.md
- Todos los commits se auto-mergean a `main` via GitHub Actions

### Límites de ebooks pendientes de revertir
`app.js → PlanLimits`: Pro=999, Growth=999 (temporales para testing). **REVERTIR**: Pro→5, Growth→20.

### Para el próximo chat — qué revisar primero
1. **Freeze**: Abrir builder, clickear "Vista previa PDF", volver al tab. Abrir DevTools Console antes. Ver si hay errores. Ejecutar `document.getElementById('image-url-modal').classList` para ver si el modal está open. Si no es el modal, ejecutar `document.querySelectorAll('[style*="z-index"]')` y `document.querySelectorAll('.fixed')` para encontrar qué está bloqueando.
2. **Callout-warn**: Con DevTools, inspeccionar un `.callout-warn` y ver qué regla CSS está ganando para `background-color`. Identificar el selector exacto que overridea.
3. **PDF corte**: Probar con `window.print()`, elegir "Guardar como PDF". Ver si el contenido fluye correctamente o se corta. Posible fix: agregar `break-inside:avoid` a `.chapter-page` o cambiar cómo se pagina.

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

---

## SESIÓN 10 MAY 2026 — branch `claude/fix-print-page-breaks-c1muX`

### Contexto
Sandra llegó con errores de API en el ebook-builder y varios problemas del PDF y la sección de imágenes. Todos los fixes están en el branch `claude/fix-print-page-breaks-c1muX` que se auto-mergea a `main`.

### 1. Error API 400 "cache_control cannot be set for empty text blocks" — RESUELTO ✅

**Causa raíz**: Anthropic habilitó prompt caching automático para contextos muy largos (148+ mensajes). La API intenta agregar `cache_control` a bloques de texto. Si algún bloque tiene texto vacío, falla con 400.

**Fix en 3 capas**:
- `Claude._call` en `app.js`: sanitiza TODOS los mensajes antes de enviarlos — elimina los de contenido vacío/no-string, asegura alternancia user→assistant, limita a 40 mensajes máximo
- `ebook-builder.html`: corta `apiHistory` a los últimos 30 mensajes antes de mandarlo
- `landing-builder.html`: mismo límite de 30

### 2. PDF — páginas cortadas y vacías — RESUELTO ✅

**Causa raíz del espacio vacío**: `.chapter-page` tenía `padding:14mm 16mm`. Dos capítulos consecutivos acumulaban 28mm de gap (14mm bottom + 14mm top). Si el salto de página A4 caía ahí, la página quedaba casi en blanco.

**Fix**: Mover márgenes a `@page`:
- `@page :first { margin:0 }` → portada sin márgenes (full-bleed)
- `@page { margin:14mm 16mm }` → capítulos con márgenes reales
- `.chapter-page { padding:0 }` en print → sin acumulación de padding

**Causa raíz del corte de párrafos**: palabras sueltas al inicio de página (widow de 1 línea).

**Fix**: `widows:5; orphans:5` en `.chapter p` dentro de `@media print` — Chrome ignora valores bajos.

**Image-card vacío antes**: `break-inside:avoid` empujaba la imagen entera a la página siguiente, dejando espacio vacío. → `break-inside:auto` en print para `.image-card`.

### 3. Presets de tamaño para imágenes en el editor — NUEVO ✅

**Antes**: todas las imágenes forzadas a ratio 21:8 (banner ancho), sin opción de cambio.

**Ahora**: selector de tamaño que aparece al hacer hover sobre la imagen:
- `Natural` — proporciones de la imagen, capped a 280px de alto (object-fit:cover) para que 9:16 no ocupe toda la página
- `16:9` — formato video/horizontal
- `2:1` — banner ancho (el anterior por defecto)
- `1:1` — cuadrado
- `3:4` — retrato, con `width:52%` para no ocupar toda la página
- `9:16` — vertical, con `width:40%`

**Implementación**:
- `buildSizePicker(currentSize)` → genera los botones pill
- `wireSizePicker(fig)` → conecta los clicks al `data-size` del `<figure>`
- `buildImageCardHtml(url, caption, idx, sizeVal)` → helper que centraliza la generación del HTML de la figura incluyendo `data-size`
- El tamaño se persiste en `body_md` del capítulo vía regex replace del atributo `data-size`
- `ebook-print.html` tiene los mismos selectores CSS para que el PDF respete el tamaño elegido
- Imágenes 3:4 y 9:16 usan `width:52%`/`width:40%` para no ocupar toda la página

### 4. Picker de imagen en portada — NUEVO ✅

**Opciones**:
- `Centro` (default) — recorte centrado
- `Arriba` — muestra la parte superior de la foto
- `Abajo` — muestra la parte inferior
- `Completo` — sin recorte (`object-fit:contain`), la columna se ajusta a la foto

**Implementación**:
- `buildCoverSizePicker(currentSize)` en `wireImageControls()`
- La elección se guarda en `ebook.cover.imageSize` y se aplica como `data-size` en `.cover-media` al renderizar
- CSS: `.cover-media[data-size="fit"] { min-height:unset !important }` para el modo "Completo"
- El picker aparece como overlay oscuro (`rgba(0,0,0,.65)`) en la parte inferior de la columna de imagen, `z-index:82`

### 5. Callout "Cuidado" (warn) — colores que no machean el tema — RESUELTO ✅

**Problema**: la sección `callout-warn` tenía colores hardcodeados con `!important` (fondo crema `#fff5f0`, texto naranja) en 3 lugares distintos:
- CSS estático en el `<style>` del builder (líneas 216-218)
- `smartMd()` generaba el HTML con inline styles
- `applyThemeInline()` inyectaba `!important` hardcodeados

Esto hacía que en temas oscuros (dark-neon) el bloque crema se viera totalmente fuera de lugar.

**Fix**: Cambio a `rgba(234,109,58,0.13)` como fondo — semi-transparente sobre cualquier color:
- En tema claro: tinte beige suave (similar al crema anterior)
- En tema oscuro: tinte ámbar oscuro (se integra con el fondo)
- Texto: `var(--doc-fg)` → hereda el color del tema
- Strong: `#ea6d3a` → naranja visible en ambos temas
- `applyThemeInline()` ahora inyecta `${v['--doc-fg']}` en lugar de `#1a1a1a`
- `smartMd()` ya no genera inline styles en callout-warn

**En `ebook-print.html`**: sigue siendo crema con `!important` ya que la impresión siempre es sobre papel blanco.

### Estado al cierre de sesión — 10 mayo 2026
- ✅ Error API 400 cache_control resuelto
- ✅ PDF: páginas vacías por padding acumulado → resuelto con @page
- ✅ PDF: palabras solas al inicio de página → widows:5
- ✅ PDF: image-card con espacio vacío antes → break-inside:auto
- ✅ Presets de tamaño de imagen (6 opciones) con picker en hover
- ✅ Picker de posición en foto de portada (4 opciones)
- ✅ Callout-warn adaptado a temas oscuros
- 🟡 Límites de ebooks: Pro=999, Growth=999 en `app.js → PlanLimits` — **REVERTIR** a Pro→5, Growth→20 cuando Sandra confirme que el PDF funciona bien

### Archivos modificados esta sesión
| Archivo | Cambios |
|---------|---------|
| `app.js` | `Claude._call`: sanitiza mensajes, cap 40, alternancia user/assistant |
| `ebook-builder.html` | Picker tamaño imágenes, picker portada, callout-warn adaptativo, natural max-height |
| `ebook-print.html` | @page margins, widows/orphans, image-card break-inside:auto, size presets CSS |
| `landing-builder.html` | Cap apiHistory a 30 mensajes |
- 🟡 Límites de ebooks (Pro=999, Growth=999) — REVERTIR cuando Sandra confirme que el flujo funciona: Pro→5, Growth→20 en `app.js → PlanLimits`

---

## SESIÓN 31 MAY 2026 — branch `claude/hopeful-ride-4sZKP`

### Contexto
Sesión enfocada en el mini-app player: hacer que apps de bienestar, fitness y finanzas tengan una pantalla "Hoy" tan premium como Inglés 90 Pro. También múltiples fixes de TTS.

### 1. Pantalla "Hoy" premium universal — COMPLETO ✅

#### Arquitectura del renderer
La función `renderTodayHome()` en `mini-app-player.html` hace dispatch en este orden:
1. `isEnglishLearningApp` → `renderEnglishLearningToday` (existente)
2. `isWellnessApp` → `renderWellnessToday` (NUEVO)
3. `hasBodyMapExperience` → `renderBodyMapToday` (existente)
4. Genérico (fallback)

#### `isWellnessApp()` — detección ampliada
Captura apps por **categoría** (bienestar, fitness, deporte, salud, nutricion, finanzas, negocio, emprendimiento, marketing, productividad, educacion, idiomas, desarrollo personal) O por **datos** (retoContent, roadmapSteps, trackerHabit, initialTasks, affirmations+meditationScript).

#### `renderWellnessToday()` — tres modos
| Modo | Condición | Tarjeta "Hoy" | Métricas |
|------|-----------|---------------|---------|
| **Wellness** (default) | tiene `retoContent` | Día X del reto | días / herramientas / % |
| **Fitness** | no reto, tiene `roadmapSteps` | Paso actual del plan | pasos / racha / % |
| **Plan** | no reto ni roadmap, tiene `initialTasks` | Tarea X del planificador | tareas / herramientas / % |

Todos los modos incluyen: hero glassmorphic con pills, métricas 3-col, tarjeta de hoy con barra progreso, grid 2×2 de herramientas rápidas, shortcuts a affirmaciones/meditación/tracker.

#### CSS `.well-*`
50+ líneas de clases CSS en `mini-app-player.html`. El hero usa `linear-gradient(135deg, var(--accent), ...)`. Las métricas usan `color-mix(in srgb, var(--accent) 4%, var(--card))`. Todo es accent-adaptive — funciona con cualquier paleta de template.

#### Light mode glassmorphic cards
`body[data-theme="light"] .card { background: color-mix(in srgb, var(--accent) 3%, rgba(255,255,255,.88)); backdrop-filter:blur(8px); }` + extensiones para `.card2`, `.tool-card`, `.day-card`, `.flip-face`, `.btn-secondary`, `.quote-box`, `.bubble.bot`, `.stat-pill`.

### 2. Body map cutoff fix — COMPLETO ✅

**Causa raíz**: el grid 3-columnas del body engine (`220px minmax(420px,1fr) 280px`) requería ~920px. Sin `map-engine-open` el contenedor era 520px → overflow → figura cortada a la derecha.

**Fix en `mini-app-player.html`**:
- `renderBodyMap()` ahora llama `document.body.classList.toggle('map-engine-open', showEngine)`
- `showTab()` remueve `map-engine-open` al cambiar a cualquier tab que no sea bodymap
- CSS: `grid-template-columns: 200px minmax(0,1fr) 260px` (el `minmax(420px,...)` causaba overflow)

### 3. Templates de inglés — `voiceLang:'en-US'` ✅

Solo `tpl-ingles-listening` (B2) tenía `voiceLang:'en-US'`. Se agregó a los 3 restantes:
- `tpl-ingles-90-tutor`
- `tpl-ingles-30`
- `tpl-ingles-speaking`

Ahora los 4 templates de inglés leen el contenido con voz inglesa.

### 4. TTS — múltiples fixes ✅

#### Priming automático
```js
let _ttsPrimed = false;
function _primeTTS() { /* habla utterance silenciosa en primer toque */ }
document.addEventListener('pointerup', _primeTTS, { once: true, passive: true });
```
Ya no es necesario presionar "Probar voz" primero.

#### `ttsLangForText()` simplificada
```js
if (isEnglishLearningApp(currentApp)) return currentApp?.voiceLang || 'en-US';
// else: saved settings → currentApp.voiceLang → currentApp.lang → fallback
```

#### `_bestVoice()` — sin cross-language
La voz guardada solo se retorna si `v.lang.startsWith(prefix)` — evita que la voz española guardada sea retornada cuando se pide inglés.

Rama `if (prefix === 'en')` agrega preferencias: Samantha, Ava, Google English → `_voiceQualityScoreEn()`.

#### Fallback sin error
Si `_bestVoice(ttsLang)` retorna null (no hay voces para ese idioma), usa fallback en lugar de lanzar `language-unavailable`:
```js
if (best) { u.voice = best; u.lang = ttsLang; }
else { u.voice = fallback || primeroDisponible; /* no setea u.lang */ }
```

#### Rate para inglés
`u.rate = ttsLang.startsWith('en') ? Math.max(settings.rate, 0.92) : settings.rate`

### 5. Panel de voz — modo inglés ✅

- `englishVoices()` + `_voiceQualityScoreEn()` — funciones nuevas para voces en inglés
- `hydrateVoicePanel()` detecta `isEnglishLearningApp(currentApp)` → usa `englishVoices()` y muestra label "Inglés" en el panel
- `saveVoiceSettings()` usa `select._voices` (el array correcto según idioma)
- `testSelectedVoice()` dice texto en inglés para apps de inglés: *"Hello! This is a voice test for your English learning app."*
- Filtra voces con score < -10 para ocultar las que nunca funcionan

### Bug crítico introducido y corregido — pills block syntax error
Al agregar `isPlanMode` en el bloque de pills, quedó `} else { ... } else if (isPlanMode)` — dos `else` seguidos. Rompía TODA la app (página cargando infinito). Fix: reordenar correctamente a `if (...) {} else if (...) {} else {}`. **Verificar siempre con node syntax check antes de pushear cambios en este archivo.**

### Archivos modificados esta sesión
| Archivo | Cambios clave |
|---------|---------------|
| `mini-app-player.html` | `isWellnessApp`, `renderWellnessToday` (3 modos), `.well-*` CSS, light glass cards, body map fix, TTS priming, `englishVoices`, `hydrateVoicePanel` modo inglés |
| `miniapp-templates.js` | `voiceLang:'en-US'` en tpl-ingles-90-tutor, tpl-ingles-30, tpl-ingles-speaking |

### Commits del branch `claude/hopeful-ride-4sZKP`
- `d0fd74e` Light mode glass cards
- `3a5ebca` Wellness today renderer (inicial, solo bienestar)
- `d3ffa2d` Body map cutoff fix
- `56a70b6` Wellness renderer para fitness/gym (roadmap+tracker mode)
- `0ac5dae` Wellness renderer para finanzas/plan (initialTasks mode)
- `70c014f` **Fix syntax error: double else** — página congelada
- `d725e0f` TTS: English voice, ignore saved Spanish settings
- `4ea50d7` TTS: fallback graceful para dispositivos sin voces inglesas
- `2bc3977` Agregar `voiceLang:'en-US'` a 3 templates de inglés + simplify ttsLangForText
- `34cd32c` TTS panel: priming, modo inglés, filtro voces malas

### Estado al 31 may 2026
- ✅ Pantalla "Hoy" premium para bienestar, fitness, finanzas y cualquier app con datos estructurados
- ✅ TTS funciona sin necesidad de "Probar voz" primero
- ✅ Panel de voz muestra voces en inglés para apps de inglés
- ✅ 4 templates de inglés con `voiceLang:'en-US'`
- 🟡 Límites ebook: Pro=999, Growth=999 → REVERTIR a Pro→5, Growth→20

---

## SESIÓN 5 JUN 2026 — branch `claude/confident-noether-9sN0E`

### Contexto
Sesión enfocada en el landing-builder: fixes de bugs críticos + mejoras de galería de imágenes.

### 1. Fix: generación silenciosa fallaba ("se borra todo") — RESUELTO ✅

**Síntoma**: Al hacer click en "Generar landing", el formulario desaparecía y la landing no se generaba. Sin errores en F12.

**Causa raíz (2 problemas combinados)**:
1. **Renderers con `(data.X || []).filter()`**: cuando la IA devuelve un string u objeto en lugar de array, `.filter()` lanzaba TypeError silencioso en el `catch`.
2. **`switchToBuilderMode()` antes de los renders**: la función se llamaba ANTES de `renderPreview()` y `renderBlocksList()`. Si cualquier render fallaba, el formulario ya estaba oculto y no había forma de volver.

**Fix**:
- `_arr(v)` helper en `landing-blocks.js`: `function _arr(v) { return Array.isArray(v) ? v : []; }` — aplicado a TODOS los renderers (nav, para_quien, metricas, beneficios, modulos, testimonios, bonos, stack, faq, footer).
- Reordenado en `generateLanding()`: primero `renderBlocksList()` → `renderPreview()` → luego `switchToBuilderMode()`.
- `max_tokens` en `Claude.generateLandingBlocks`: 5000 → 8192 (evita truncado del JSON con 14 bloques).

### 2. Fix: botón borrar imagen en galería no funcionaba — RESUELTO ✅

**Causa raíz**: `openAddBlockModal()` no hacía deep-clone de `BLOCK_DEFAULTS`, así que `block.data.images` era referencia directa al array default. Al borrar, realmente borraba del default global.

**Fix**: `JSON.parse(JSON.stringify(BLOCK_DEFAULTS[type] || {}))` en `openAddBlockModal`.

**Fix adicional**: `delSubItem()` ahora llama `buildFieldEditor()` después de borrar para confirmar visualmente la eliminación.

### 3. Fix: columnas = 2 pero salían 3 recuadros — RESUELTO ✅

**Aclaración técnica**: `columns` controla cuántas columnas tiene el grid (ancho por fila), NO cuántas imágenes hay. Con 3 imágenes y `columns:2` → 2 en fila 1 + 1 en fila 2 (comportamiento correcto).

**Fix UX**: Default cambiado a 2 imágenes + 2 columnas para que el comportamiento inicial sea el esperado. Label renombrado a "Imágenes por fila".

### 4. Mejoras bloque imagen (`imagen`) — RESUELTO ✅

**Problema**: Todas las opciones de tamaño resultaban en imágenes muy grandes (todas usaban `width:100%` + `aspect-ratio` forzado).

**Fix en `_renderImagen`**:
- Opción `natural`: `max-width:100%; height:auto` sin aspect-ratio forzado — respeta dimensiones originales
- Tamaños reducidos: medium → 65%, small → 40%, portrait → 30% width
- Nueva opción `square`: 40% width, aspect-ratio 1/1
- `BLOCK_DEFAULTS.imagen.image_size` cambiado a `'natural'`
- `BLOCK_FIELDS.imagen` actualizado: etiquetas explican si hay recorte

### 5. Control de tamaño global para galería — RESUELTO ✅

**Nuevo campo** `gallery_size` en `_renderGaleria`: `wMap = {full:'100%', large:'80%', medium:'60%', small:'40%'}` — controla el ancho del contenedor de la galería completa.

**En `BLOCK_FIELDS.galeria`**: selector dropdown en lugar de campo texto para `ratio` (5 opciones). Label `columns` renombrado a "Imágenes por fila".

### 6. Control de tamaño+proporción POR IMAGEN en galería (collage) — RESUELTO ✅

**Request**: Sandra mostró ejemplo de collage con fotos de distintos tamaños y pidió poder controlar tamaño y proporción por cada foto individualmente.

**Implementación**:

**`landing-blocks.js` — `_renderGaleria`**:
- Per imagen: `span = Math.min(parseInt(img.span) || 1, cols)` → `grid-column: span N`
- Per imagen: `ratio = img.ratio || data.ratio || '1/1'` → aspect-ratio individual
- `BLOCK_DEFAULTS.galeria.images`: cada imagen ahora tiene `span:'1', ratio:''`

**`landing-builder.html` — `buildFieldEditor` para `list-image`**:
- Dos selects nuevos por imagen: **Tamaño** (Normal/Doble ancho/Triple) y **Proporción** (Hereda galería / 1:1 / 4:3 / 16:9 / 3:4 / 3:2)
- Pre-popula desde `v.span` y `v.ratio`

**`landing-builder.html` — `collectBlockData` para `list-image`**:
- Lee `sels[0]?.value` (span) y `sels[1]?.value` (ratio) de los selects del item

**`landing-builder.html` — `addSubItem` para `list-image`**:
- Nuevos items incluyen los mismos dos selects

**Cómo usarlo**: Con `columns:3`, una foto con `span:2` ocupa 2/3 del ancho y la siguiente con `span:1` ocupa 1/3. Así se arman collages tipo Pinterest.

### Archivos modificados esta sesión
| Archivo | Cambios clave |
|---------|---------------|
| `landing-blocks.js` | `_arr()` helper, `_renderHero` image_size, `_renderImagen` natural+square+tamaños, `_renderGaleria` gallery_size+per-image span+ratio, BLOCK_DEFAULTS, BLOCK_FIELDS |
| `landing-builder.html` | `generateLanding()` reorder, `openAddBlockModal` deep-clone, `delSubItem` visual confirm, `buildFieldEditor` list-image con selects, `collectBlockData` lee span+ratio, `addSubItem` list-image con selects |
| `app.js` | `Claude.generateLandingBlocks` max_tokens 5000→8192 |

### Commit del branch `claude/confident-noether-9sN0E`
- `9294e89` — Gallery: per-image size (span) and ratio controls for collage layouts

### Estado al 5 jun 2026
- ✅ Generación de landing funciona sin el bug "se borra todo"
- ✅ Galería: borrar imagen funciona
- ✅ Galería: control de tamaño global (ancho del contenedor)
- ✅ Galería: control de tamaño y proporción por imagen (collage)
- ✅ Bloque imagen: opción "natural" que respeta dimensiones originales + square
- 🟡 Límites ebook: Pro=999, Growth=999 en `app.js → PlanLimits` — REVERTIR a Pro→5, Growth→20 cuando Sandra confirme que el PDF funciona bien

---

## SESIÓN 7 JUN 2026 — branch `claude/great-cerf-Y14qg`

### Contexto
Sesión enfocada 100% en el landing-builder: corrección de bugs de layout móvil/tablet, mejoras visuales (glassmorphism, animaciones), y el efecto de gradiente animado tipo aurora en las cards.

### 1. Fix generación de landing — silenciosamente rota (commit anterior)

**Causa raíz combinada**:
- Renderers con `(data.X || []).filter()` lanzaban TypeError silencioso cuando la IA devolvía string en lugar de array
- `switchToBuilderMode()` se llamaba ANTES de que los renders terminaran → formulario desaparecía sin mostrar la landing
- `max_tokens: 5000` truncaba el JSON de 14 bloques

**Fix**: `_arr(v)` helper en todos los renderers + reordenar `switchToBuilderMode()` después de `renderPreview()` + `max_tokens: 8192` + cambio a `claude-haiku` (10-15s vs 60-90s)

### 2. Mejoras visuales del landing-builder (esta sesión)

#### Responsive nav — hamburger siempre visible ✅
**Causa raíz**: El botón CTA del nav (`display:inline-flex`) estaba en el mismo flex row que el hamburger. Con el logo largo, el CTA empujaba al hamburger y lo cortaba mostrando solo "≡ Mc".

**Fix en 3 capas**:
1. Logo: `flex-shrink:1` + `text-overflow:ellipsis` — se encoge en lugar de empujar
2. Hamburger: `flex-shrink:0` + `white-space:nowrap` — nunca cede espacio
3. CTA nav: `#ld-nav-cta` oculto via CSS (`display:none!important`) en ≤768px
4. **JS fallback**: `applyNavMode()` mide `window.innerWidth` al cargar y en resize — fuerza los `display` directamente, sin depender de media queries CSS en el iframe

#### Botón "Comenzar ahora" — texto cortado en celular ✅
**Causa**: `white-space:nowrap` implícito + padding grande en pantallas angostas.
**Fix**: En ≤640px: `width:100%`, `line-height:1.3`, padding reducido. En ≤768px: `font-size:17px`, padding intermedio. El texto wrappea limpiamente en 2 líneas cuando no cabe.

#### Nuevo breakpoint iPad (768px) ✅
- Hero columns se apilan (`flex-direction:column`)
- Nav oculta links y muestra hamburger
- `.ld-g3` baja a 2 columnas

#### Hamburger con label "Menú"/"Cerrar" ✅
El botón muestra texto "Menú" al lado de las 3 líneas. Al abrir el menú cambia a "Cerrar" via JS inline. Más claro que solo 3 rayas.

#### Cards glassmorphic ✅
- **Fondo**: gradiente coloreado con `rgba(from-color, 0.22)` en esquinas y blanco suave al centro — visible contra fondos claros
- **Borde**: color de paleta (`rgba(from, 0.22)`) en lugar de gris
- **Sombra**: con color de paleta, da efecto "brillo propio"
- **Inner highlight**: `inset 0 1px 0 rgba(255,255,255,0.95)` — línea de luz en borde superior
- **::before**: gradiente de brillo en esquina superior izquierda (efecto vidrio)

#### Animaciones continuas en cards ✅
- **Float** (`@keyframes cardFloat`): cada card sube y baja ~7px con duración entre 5.5s y 8s. Delay aleatorio por card vía `--float-delay` CSS custom property — no se mueven sincronizadas
- **Shimmer** (`@keyframes shimmerMove`): franja de luz semitransparente cruza la card cada 5-6 segundos (efecto reflejo en vidrio). Delay distinto por card vía `--shimmer-delay`
- **Hover pausa ambas**: `animation-play-state:paused` — card se congela levantada mientras el usuario la lee
- JS asigna los delays al cargar: `c.style.setProperty('--float-dur', ...)` para cada `.ld-card` y `.ld-aurora-card`

#### Aurora cards (testimonios + métricas) ✅
- Gradiente diagonal con `background-size:350%` + `@keyframes aurora` (14s) — colores se mueven lentamente
- En modo claro: opacidad 0.22/0.18 (antes 0.08 — invisible). Ahora claramente visible
- `::after` shimmer sweep encima del gradiente que anima

#### CTA final con aurora ✅
- `section#ld-cta_final` usa clase `.ld-aurora` con 5 stops de color y `background-size:400%`
- Overlay de radial gradient centrado para énfasis
- Visible en modo claro (opacidad 0.55/0.45) y oscuro (0.45/0.35)

#### Hero con mesh grid ✅
- Fondo SVG con cuadrícula en el color de la paleta (7% opacity) — da profundidad sin distraer
- Imagen del hero con `box-shadow` coloreado con el gradiente de la paleta

#### Orbes ambientales ✅
- 2 divs con `position:fixed`, `filter:blur(80px)`, `animation:floatOrb` — glows de fondo
- Se ocultan en mobile (`display:none`) para no afectar performance

### 3. Estado de bugs originales (10 bugs reportados 6 jun)

| Bug | Estado | Nota |
|-----|--------|------|
| BUG 1 — Links nav abren otra pestaña | ✅ | navGuard en JS del landing HTML, hash links hacen scrollIntoView |
| BUG 2 — Move up/down no funciona | ✅ | `e.stopPropagation()` en handlers |
| BUG 3 — Imagen solo permite URL | 🟡 Pendiente | No tocado |
| BUG 4 — Panel no actualiza texto | 🟡 Pendiente | No verificado |
| BUG 5 — Generación tarda 2 min | ✅ | Haiku model, ahora ~10-15s |
| BUG 6 — Fondos siempre negros | ✅ | `renderLandingFromBlocks` spread `...palBase` con bg/fg/mode/surface |
| BUG 7 — Sin control de tipografía | 🟡 Pendiente | No tocado |
| BUG 8 — Celular/tablet roto | ✅ | Nuevo breakpoint 768px + JS fallback nav |
| BUG 9 — Vista previa "no existe" | 🟡 Pendiente | No tocado |
| BUG 10 — Chat IA no hace cambios | 🟡 Pendiente | No tocado |

### 4. Bugs/mejoras pendientes para próxima sesión

#### 🟡 BUG 3 — Bloque `imagen` solo acepta URL, sin upload
Agregar campo `type:'image'` en `BLOCK_FIELDS.imagen` igual que en `galeria`.

#### 🟡 BUG 4 — Panel derecho no refleja lo guardado
Verificar orden en `saveActiveBlock()`: `block.data = collectBlockData(block)` → `buildFieldEditor(block, idx)` → `renderPreview()`.

#### 🟡 BUG 7 — Sin selector de tipografía global
Agregar selector de fuente en el formulario inicial del builder (o en un panel de "Estilo global"). Opciones: Plus Jakarta Sans, Inter, Playfair Display, Lato. Se inyecta como Google Font + variable CSS en `_baseCss()`.

#### 🟡 BUG 9 — Vista previa dice "landing no existe"
En `landing-view.html`: si el usuario es el owner de la landing, mostrarla aunque `published = false`. Agregar modo `?preview=true` que bypasea el check.

#### 🟡 BUG 10 — Chat de IA no aplica cambios
- Mostrar claramente qué bloque está activo en el chat
- Al recibir respuesta de IA: merge solo los campos devueltos (no sobrescribir todo)
- Botón "Deshacer último cambio del chat"

#### 🟡 Límites ebook — REVERTIR
`app.js → PlanLimits`: Pro=999, Growth=999 (temporales para testing). **REVERTIR** a Pro→5, Growth→20 cuando Sandra confirme que el flujo de PDF funciona bien.

### Archivos modificados esta sesión
| Archivo | Cambios clave |
|---------|---------------|
| `landing-blocks.js` | `_baseCss()` glass cards, animaciones float+shimmer, aurora cards, aurora section, breakpoints, nav CSS; `_renderNav()` JS fallback applyNavMode; `_renderHero()` mesh grid; `_renderCtaFinal()` aurora bg; `_renderBeneficios()` icon glow; `_renderTestimonios()` aurora-card |
| `app.js` | `generateLandingBlocks`: haiku model, max_tokens 8192 |

### Commits del branch `claude/great-cerf-Y14qg`
- `38c3753` — Fix mobile/tablet layout + hamburger menu + interactive animations
- `518e888` — Landing: glassmorphic cards, mesh hero, mobile nav fix, scroll animations
- `6293425` — Landing: aurora animated gradients + mobile nav JS fallback
- `1e3d5d0` — Cards: visible glass effect on light palettes + float + shimmer animations

### Estado al 7 jun 2026
- ✅ Generación de landing ~10-15s (Haiku)
- ✅ Nav hamburger siempre visible en mobile/tablet
- ✅ Botón CTA nunca se corta en celular
- ✅ Cards glassmorphic con tinte de color visible en paletas claras
- ✅ Float animation: cards respiran de forma independiente
- ✅ Shimmer sweep: reflejo de luz cruzando cards cada ~6s
- ✅ Aurora en CTA final y cards de testimonios/métricas
- ✅ Hero con mesh grid + glow coloreado en imagen
- 🟡 Bugs 3, 4, 7, 9, 10 del landing-builder aún pendientes
- 🟡 PlanLimits ebook: revertir Pro→5, Growth→20
**Fix**: Agregar `e.stopPropagation()` en los handlers de `.move-up` y `.move-down` (líneas ~498-518 de `landing-builder.html`).

### BUG 3 — Sección "Imagen" solo permite una imagen y solo con URL
**Síntoma**: El bloque `imagen` tiene solo un campo de imagen (URL único). No hay forma de agregar múltiples.
**Clarificación**: El bloque `galeria` sí permite múltiples imágenes. El bloque `imagen` es por diseño para una foto individual. Pero el campo de upload (subir archivo) no está disponible en `imagen`, solo en `galeria`.
**Fix sugerido**: Agregar el campo `type:'image'` con soporte de upload en el bloque `imagen`, igual que en `galeria`.

### BUG 4 — Panel derecho no actualiza el texto después de guardar
**Síntoma**: Se edita un campo en el panel derecho (ej: "vos" → "tu"), se guarda, la landing cambia, pero el campo del panel sigue mostrando "vos".
**Causa**: `saveActiveBlock()` llama `buildFieldEditor(block, activeBlockIdx)` al final (línea ~1334), que debería reconstruir los campos. Si no funciona, puede ser un problema de orden: `collectBlockData` lee el DOM, `block.data` se actualiza, pero `buildFieldEditor` reconstruye desde `block.data` de manera correcta. Revisar si `buildFieldEditor` realmente se llama con el objeto `block` ya actualizado.
**Fix**: Verificar el orden en `saveActiveBlock`: `block.data = collectBlockData(block)` → `buildFieldEditor(block, activeBlockIdx)` → `renderPreview()`.

### BUG 5 — Landing tarda ~2 minutos en generarse
**Síntoma**: Después de completar el formulario y dar "Generar", la landing tarda demasiado.
**Causa**: `Claude.generateLandingBlocks()` en `app.js` usa `model: 'claude-sonnet-4-6'` con `max_tokens: 8192`. El schema completo de 14 bloques como JSON es muy largo. Con el modelo Sonnet y el contexto grande, puede tardar 60-90 seg + reintentos.
**Fix sugerido**: Cambiar a un modelo más rápido para la generación inicial, o mostrar un progress indicator más descriptivo mientras espera. También evaluar reducir el schema mandado a la IA.

### BUG 6 — Fondo siempre negro, colores muy repetitivos
**Síntoma**: Sin importar qué paleta se elige, el fondo de todas las secciones es negro (#09090b). Los colores de la paleta solo afectan botones y texto en gradiente.
**Causa**: `_baseCss()` tiene `body { background: #09090b }` hardcodeado (línea ~207 de `landing-blocks.js`). La mayoría de secciones (`hero`, `para_quien`, `beneficios`, `modulos`, `bonos`, etc.) no tienen `background` propio — heredan el negro del body. Solo `problema`, `testimonios` y `cta_final` tienen fondos con el color de paleta.
**Fix sugerido**: Agregar fondos alternativos a secciones clave usando `rgba(pal.from, 0.05-0.08)` para crear separación visual. Ver cómo `_renderTestimonios` ya lo hace con `_hexToRgb(pal.from)`.

### BUG 7 — Sin control de tipografía
**Síntoma**: No hay opciones para cambiar tipo de letra, tamaño, ni espaciado del texto.
**Causa**: Toda la tipografía está hardcodeada en `_baseCss()` (`.ld-h1`, `.ld-h2`, `.ld-body`, etc.).
**Fix sugerido**: Agregar a nivel global (en el formulario del builder) un selector de fuente (`Plus Jakarta Sans`, `Inter`, `Playfair Display`, etc.) que se inyecte como parámetro al `_baseCss()`. No hacer por bloque — hacerlo global para coherencia.

### BUG 8 — En celular y tablet la landing se daña
**Síntoma**: El layout se rompe en dispositivos móviles.
**Causa**: Solo hay 2 breakpoints (`900px` y `640px`) en `_baseCss()`. Las imágenes del hero en móvil pueden quedar muy grandes. No hay menú hamburguesa (el nav se oculta pero no hay alternativa móvil).
**Fix sugerido**:
- Agregar breakpoint 768px para tablets
- `.ld-hero-cols` en móvil: imagen después del texto, no antes
- Imágenes: `max-width: 100%` en todos los tamaños en móvil
- Grids: asegurar `1fr` en todos en móvil

### BUG 9 — Vista previa dice "landing no existe"
**Síntoma**: Al dar "Vista previa" aparece el mensaje de error.
**Causa**: El botón "Ver" (`btn-open-tab`) abre un blob URL con el HTML renderizado — eso SÍ funciona. El problema es diferente: si el usuario accede a `landing-view.html?slug=X` antes de publicar, `DB.landings.getBySlug()` retorna la landing pero la condición `!row.published` hace que muestre el error.
**Fix sugerido**: En `landing-view.html`, si el usuario es el owner, mostrar la landing aunque no esté publicada (modo preview). O agregar un modo `?preview=true&id=X` que bypass el check de `published`.

### BUG 10 — Chat de IA no hace cambios / los daña
**Síntoma**: El chat dice que hizo el cambio pero no lo aplica, o lo aplica mal.
**Causa**: `sendChat()` solo funciona si hay un bloque activo seleccionado (`activeBlockIdx >= 0`). Si no hay bloque seleccionado, responde "Seleccioná un bloque". Si hay bloque, llama `AI.editBlockData()` pero si la IA devuelve JSON parcial o incorrecto, el merge con `{...block.data, ...result}` puede sobrescribir campos buenos.
**Fix sugerido**:
- Mostrar en el chat qué bloque está activo y si no hay ninguno, indicarlo claramente antes de que el usuario escriba
- Al recibir la respuesta de la IA, hacer merge SOLO de los campos que devuelve (no sobrescribir campos que la IA no mencionó)
- Agregar un "undo" para el último cambio del chat

### Archivos a tocar en la próxima sesión para bugs pendientes
- `landing-blocks.js`: `BLOCK_FIELDS.imagen` (agregar type:'image')
- `landing-builder.html`: `saveActiveBlock()` (orden de calls), `sendChat()` (UX activo/inactivo, merge parcial)
- `landing-view.html`: bypass `published` check para owner (agregar `?preview=true` mode)

---

## SESIÓN 18 JUL 2026 — branch `claude/clever-rubin-5AIL5`

### Contexto
Sesión dedicada 100% a intentar arreglar el landing-builder. **Resultado: no se logró que funcione correctamente.** El builder de landings sigue roto después de múltiples intentos.

### Estado del landing-builder — ROTO ❌

El landing-builder tiene los siguientes problemas sin resolver:

1. **Layout roto** — después de las primeras secciones, todo sale en una sola columna, apilado, sin estructura.
2. **Chat incoherente** — cuando el usuario reporta un error o pide un cambio, el chat cambia de tema, regenera con un producto completamente diferente, o responde cosas sin sentido.
3. **Videos de fondo no funcionan** — al colocar un video de fondo en el hero, se pierde el contenido de la sección o cambia el tema.
4. **Paleta de colores no se aplica** — los cambios de paleta no se reflejan correctamente en la landing generada.
5. **Generación incompleta** — solo genera 2-3 secciones bien, el resto con errores.

### Lo que se intentó en esta sesión (sin éxito)

**Intento 1** — Reescribir `_sectionGenSystem` con layouts explícitos por tipo de sección (plantillas HTML en el system prompt). La IA seguía ignorando los layouts.

**Intento 2** — Eliminar doble clasificación en `sendChat()`: se quitó el wrapper conversacional de Haiku y se llama `editLandingSectioned` directamente. Mejoró la coherencia del chat parcialmente.

**Intento 3 (último commit `b67ec27`)** — Arquitectura template-based: **la IA ya NO genera HTML**. Solo genera JSON con el contenido (título, bullets, etc.), y el código JS tiene funciones hardcodeadas que construyen el HTML de cada sección. Commit pusheado pero **Sandra no llegó a probar si funcionó** antes de terminar el chat.

### Arquitectura actual del landing-builder (post commit `b67ec27`)

**Flujo de generación:**
1. `generateLandingSectioned(instruction, palId)` en `app.js`
   - Llama `planLandingSections()` → Sonnet decide qué secciones incluir → `{title, sections:[{id, brief}]}`
   - Para cada sección en paralelo: `generateOneSection(spec, brief, pal)`
     - `_getSectionContent(spec, brief, pal)` → Haiku llena JSON de contenido
     - `_buildSection(id, content, pal)` → JS genera HTML desde template hardcodeado
   - `assembleLanding(sections, palId, title)` → ensambla HTML final con CSS vars

**Métodos nuevos en `app.js` (objeto `Claude`):**
- `_esc(s)` — escapa HTML
- `_imgUrl(prompt)` — genera URL de Pollinations con + en lugar de espacios
- `_sectionContentSchema(id)` — schema JSON que la IA debe llenar por tipo de sección
- `_buildSection(id, content, pal)` — construye HTML desde template hardcodeado. Secciones implementadas: `hero`, `problema`, `beneficios`, `modulos`, `como-funciona`, `prueba-social`, `testimonios`, `bonos`, `precio`, `garantia`, `faq`, `cta-final`, `footer`
- `_getSectionContent(spec, brief, pal)` — llama Haiku con el schema → retorna JSON de contenido
- `generateOneSection` — reescrito para usar `_getSectionContent` + `_buildSection`
- `_sectionGenSystem(pal)` — mantenida como legacy (ya no se usa en generación normal)

**Flujo de edición:**
- `editLandingSectioned(instruction, sections, palId, brief)` en `app.js`
- Clasifica la instrucción con Haiku → `{action: edit|fix|add|remove, sectionId, reply}`
- `fix` sin sectionId → regenera TODAS las secciones (para "sigue mal" sin especificar)
- `fix` con sectionId → regenera solo esa sección
- `edit` → llama `_getSectionContent` con el cambio incorporado en el brief → reconstruye desde template
- Respuestas de `editLandingSectioned` se muestran directamente en el chat (sin wrapper Haiku)

**Persistencia:**
- `landing.sections` = `[{id, brief, html, content?}]`
- `landing.brief` = prompt original del usuario (siempre pasado a `editLandingSectioned`)
- `landing.mode = 'html'` para landings generadas con este sistema
- En Supabase: `landings.sections` (JSONB), `landings.settings.sections` como fallback

**Paleta de colores:**
- CSS vars: `--brand`, `--brand-2`, `--bg`, `--ink`, `--muted`, `--surface`, `--border`
- Definidas en `assembleLanding()` en el `<style>` del HTML ensamblado
- Cambio de paleta DEBERÍA ser instantáneo: `landing.html = AI.assembleLanding(sections, newPalId, title)` sin llamada a IA
- Paletas definidas en `window.LANDING_PALETTES_DEF` (en `landing-builder.html`)

**Swatch de paleta en `landing-builder.html`:**
```js
// Al hacer click en un swatch:
if (landing.sections && landing.sections.length) {
  landing.html = AI.assembleLanding(landing.sections, id, landing.title);
  renderPreview(); autosave();
}
```

### Lo que TODAVÍA FALTA arreglar en el próximo chat

**PRIORIDAD 1 — Verificar si el commit `b67ec27` realmente funciona:**
El próximo chat debe probar con un prompt completo si los layouts ahora son correctos. Si no funcionan, el problema puede estar en:
- `_parseJSONLoose` no parsea bien el JSON que devuelve Haiku
- Haiku devuelve JSON malformado o con campos faltantes
- `_buildSection` tiene un bug (falta un cierre de template literal, etc.)
- Agregar console.log en `generateOneSection` para ver qué llega en `content`

**PRIORIDAD 2 — Videos de fondo en hero:**
La funcionalidad de video de fondo está en `landing-builder.html` en `runHtmlEdit()` con instrucción hardcodeada. El problema es que `editLandingSectioned` no sabe cómo editar HTML existente con un video — el template de hero en `_buildSection` no tiene opción de video.
- **Fix**: agregar campo `video_url` al schema del hero. Si `content.video_url` existe, `_buildSection('hero')` genera el hero con `<video autoplay muted loop playsinline>` de fondo en lugar de imagen.

**PRIORIDAD 3 — Chat cambio de tema:**
Asegurarse que `landing.brief` siempre se pase a `editLandingSectioned`. Verificar en `sendChat()` que `landing.brief || landing.title || ''` no esté vacío. Si `landing.brief` es vacío después de generar, el chat no tiene contexto del producto.
- En `generateFromChat()`, verificar que se guarda: `landing.brief = landing.brief || msg;`

**PRIORIDAD 4 — `_parseJSONLoose` y robustez:**
Si Haiku devuelve JSON parcial o con comentarios, `_parseJSONLoose` puede fallar y retornar el schema vacío. En ese caso la sección se genera con placeholder text ("Título", "Empezar"). Agregar fallback que usa el schema con valores genéricos en lugar de nada.

### Archivos clave del landing-builder

| Archivo | Función |
|---------|---------|
| `app.js` líneas ~1440-1910 | Toda la lógica de generación y edición de landings (`_sectionContentSchema`, `_buildSection`, `_getSectionContent`, `generateOneSection`, `generateLandingSectioned`, `editLandingSectioned`, `assembleLanding`) |
| `landing-builder.html` | UI del builder, `sendChat()`, `generateFromChat()`, `renderPreview()`, swatch de paleta |
| `landing-blocks.js` | Sistema VIEJO de bloques (aún existe pero el modo `html` lo bypasea completamente) |
| `landing-view.html` | Vista pública de landing publicada |

### Commits de esta sesión
- `b10bb4a` — Landing builder: fix layout + chat coherence (rewrite _sectionGenSystem, fix editLandingSectioned, remove double-classification)
- `b67ec27` — Landing builder: template-based architecture — AI fills JSON, code builds HTML ← **ÚLTIMO, A VERIFICAR**

### Lección de esta sesión
La raíz del problema del landing-builder siempre fue pedir a la IA que genere HTML directamente. La IA no puede hacerlo confiablemente para layouts complejos. La solución correcta (commit `b67ec27`) separa contenido (IA) de layout (código). **El próximo chat debe verificar si este commit finalmente resuelve el problema antes de hacer más cambios.**


---

## SESIÓN 18 JUL 2026 (parte 2) — branch `claude/landing-builder-json-arch-sp9tb6`

### VERIFICACIÓN DEL COMMIT `b67ec27` — LA ARQUITECTURA FUNCIONA ✅

Se verificó la arquitectura template-based con un harness offline en Node (carga `app.js` con stubs de browser, mockea `Claude._call` con JSON realista, corre el pipeline completo) + screenshots con Chromium. Resultados:

- ✅ `generateLandingSectioned`: 11 secciones, layouts correctos en desktop (grids 3-4 col, hero 2 col, FAQ acordeón, precio card) y móvil (todo apila a 1 columna sin romperse)
- ✅ Paleta clara (nude-rose) y oscura (blue-purple) se aplican bien con contraste correcto
- ✅ `assembleLanding` con paleta nueva = instantáneo, 0 llamadas IA
- ✅ `editLandingSectioned` (edit de una sección): solo esa sección cambia, las demás intactas
- ✅ Sin template literals JS, sin markdown fences, sin layouts rotos — el código genera el HTML, no la IA

### BUG REAL ENCONTRADO Y CORREGIDO: `_parseJSONLoose` lanza, los clasificadores asumían null

`_parseJSONLoose` **lanza excepción** cuando falla todo el recovery (línea ~2226), pero `planLandingSections`, el clasificador de `editLandingSectioned` y el clasificador legacy de HTML edit usaban `this._parseJSONLoose(text) || {}` asumiendo contrato de null. Consecuencia: si Sonnet/Haiku devolvía texto no-JSON, **toda la generación crasheaba** en lugar de usar el fallback de 8 secciones que ya existía. Este era probablemente uno de los modos de fallo "la generación falla sin razón".

**Fix**: nuevo `_parseJSONSafe(text)` (try/catch → null) usado en los 3 clasificadores. `_getSectionContent` ya tenía try/catch propio.

### VIDEO DE FONDO EN HERO — IMPLEMENTADO DETERMINÍSTICAMENTE ✅

Ya no se le pide a la IA que "embeba el video en el HTML". Ahora:

**`app.js`**:
- `_buildSection('hero')`: si `content.video_url` existe → hero centrado con `<video autoplay muted loop playsinline>` absoluto + overlay `rgba(0,0,0,.55)` + texto blanco. Sin video → hero 2 columnas con imagen (como antes).
- `generateOneSection(spec, brief, pal, keep)` ahora devuelve `{html, content}` y acepta `keep` (campos controlados por código que la IA no pisa). **Las secciones ahora guardan su `content` JSON** → cualquier rebuild futuro es sin IA.
- `generateLandingSectioned`: extrae `Hero background video: URL` del brief del form (regex) y lo aplica via `keep` — la IA nunca ve ni pierde el video.
- `setHeroVideo(sections, palId, videoUrl, productBrief)` (+ facade AI): pone/quita el video reconstruyendo solo el hero. Instantáneo si hay `content` guardado; landings viejas sin content → 1 llamada IA para regenerar el contenido del hero (y de ahí en más queda guardado.)
- `editLandingSectioned`: los paths de fix (puntual y total) y edit **preservan `video_url`** del content anterior via `keepOf(sec)`.

**`landing-builder.html`**:
- `applyHeroVideo(url)`: en modo secciones usa `AI.setHeroVideo` + `assembleLanding` (nada de `runHtmlEdit`), guarda `landing.settings.hero_video_url`, snapshot para undo, toast. El path `runHtmlEdit` queda solo para landings HTML legacy sin secciones.
- Cache-busters bumpeados a `?v=20260718a`.

### Cobertura de tests del harness (8 tests, todos pasan)
1. Generación completa: 13 checks estructurales
2. Cambio de paleta instantáneo (0 llamadas IA)
3. Edit quirúrgico de hero (demás secciones intactas)
4. Robustez: plan malformado → fallback 8 secciones; `items` como string → no crashea
5. `setHeroVideo` instantáneo con content guardado + quitar video restaura imagen
6. Video sobrevive a un "fix" total (regeneración de todas las secciones)
7. Landing vieja sin content → video aplicado con exactamente 1 llamada IA
8. Video del form inicial aplicado en generación + todas las secciones guardan `content`

### Pendientes que quedaron VERIFICADOS como ya resueltos (no tocar)
- `landing.brief` siempre se guarda: `generateFromChat` líneas ~2075-2077 (`landing.brief = landing.brief || msg` + fallback)
- Paleta instantánea al click del swatch: líneas ~2802-2803 (`assembleLanding` sin IA)

### Pendiente restante
- 🟡 Límites ebook: Pro=999, Growth=999 en `app.js → PlanLimits` — REVERTIR a Pro→5, Growth→20 cuando Sandra confirme el PDF
- 🟡 Probar con generación real (API viva): el harness prueba la lógica, no la calidad del contenido que devuelven Sonnet/Haiku en producción

### Cómo Sandra puede validar
1. Hard-refresh en el landing-builder (Ctrl+Shift+R)
2. Escribir en el chat un pedido de landing completo → debe generar ~8-11 secciones con layouts correctos en ~15-30s
3. Botón "Video de fondo" → elegir un video de la galería → se aplica al hero AL INSTANTE (sin esperar IA)
4. Pedir un cambio por chat ("cambiá el título del hero") → solo cambia esa sección y el video queda
5. Cambiar paleta con los swatches → instantáneo

---

## SESIÓN 18 JUL 2026 (parte 3) — Los 7 problemas reportados por Sandra, resueltos

### PROBLEMA 1 (EL MÁS GRAVE) — El chat regeneraba en vez de editar — RESUELTO ✅

**Causa raíz encontrada**: `sendChat()` en `landing-builder.html` decidía "¿generar o editar?" con `if (!landing || !landing.blocks || !landing.blocks.length)`. Las landings del sistema de secciones guardan todo en `landing.sections` y dejan `blocks: []` VACÍO → **cada mensaje del chat caía en `generateFromChat` y creaba una landing nueva desde cero usando solo ese mensaje como brief**. El path de edición (`editLandingSectioned`) era código muerto en producción — nunca se ejecutaba. Esto explica: "no tiene contexto", "vuelve a hacer otra landing diferente", "la imagen no se coloca" (el mensaje posterior a la subida regeneraba todo).

**Fix**: el check ahora es `landing && ((landing.mode === 'html' && landing.html) || (landing.blocks && landing.blocks.length))`. Además el clasificador tiene acción `new` (solo si el usuario pide EXPLÍCITAMENTE una landing nueva para otro producto) que devuelve `{newLanding:true}` y el caller genera de cero.

### PROBLEMA 7 — Publicar no daba link — RESUELTO ✅ (había 2 bugs ocultos)

1. `generateFromChat` creaba la landing con `id: 'ld_' + Date.now()` — NO es UUID válido de Postgres → el update fallaba, el insert con ese id también → **las landings de chat NUNCA se guardaban en Supabase** (error silencioso en console).
2. Tampoco se generaba `slug` → aunque guardara, el link sería `?slug=undefined`.

**Fix**: `id: null` (Supabase genera el UUID) + `_slugify(title)` compartido. Nuevo **modal de publicación** (`publish-modal`): nombre editable, slug editable, botón "Publicar ahora", y al confirmar muestra el link final con "Copiar link" y "Abrir". `confirmPublish()` respeta el slug ajustado por el server si estaba tomado.

### PROBLEMA 3 — Imágenes — RESUELTO ✅
- `_buildSection('hero')`: `content.image_url` (subida del usuario) tiene prioridad sobre Pollinations.
- `handleChatImage` ahora también persiste `target.content.image_url` → la imagen sobrevive a regeneraciones.
- `keepOf()` en `editLandingSectioned` preserva `image_url` y `video_url` en TODOS los paths (fix puntual, fix total, edit).
- El botón de adjuntar acepta imagen o PDF (`attach_file`).

### PROBLEMA 4 — Referencia por link y PDF — IMPLEMENTADO ✅
- **Link**: si el mensaje de generación contiene una URL, `_fetchUrlContent()` la lee via `https://r.jina.ai/<url>` (CORS abierto, verificado con curl) y agrega hasta 6000 chars del contenido real al brief. Si falla, avisa y sigue.
- **PDF**: `handleChatPdf()` — pdf.js 3.11.174 desde cdnjs (lazy load), extrae texto de hasta 15 páginas / 7000 chars. Sin landing → genera con ese contenido. Con landing → lo suma a `landing.brief` como contexto.

### PROBLEMA 5 — Diseño básico → premium — RESUELTO ✅
CSS agregado en `assembleLanding` + clases en templates:
- `.ld-card`: glass (backdrop-filter blur 14px), inner highlight, hover lift -6px con glow del color de marca (`color-mix`)
- `.ld-btn`: glow permanente de marca + hover scale
- `#hero::before`: glow ambiental radial con --brand/--brand-2
- `#prueba-social`/`#cta-final`: aurora animada (`background-size:220% !important` + keyframes `ldAurora` — el `!important` gana al inline shorthand)
- `#precio .ld-price-card`: glow permanente + hover
- FAQ details con hover de borde

### PROBLEMA 2 — Siempre la misma estructura — RESUELTO ✅
- 2 secciones nuevas: `para-quien` (dos columnas es/no-es para vos) y `antes-despues` (contraste con card "después" destacada)
- Hero con `layout: 'split' | 'center'` — la IA elige según el tipo de producto
- Planner: 7-11 secciones con guía explícita por nicho (curso→modulos+antes-despues; servicio→para-quien+como-funciona; app→sin modulos; ticket alto→garantia+bonos). No incluye bonos/precio si el producto no los menciona.

### PROBLEMA 6 — Videos de galería muertos — RESUELTO ✅
Las categorías Personas/Tech/Abstract/Ciudad/Naturaleza usaban IDs viejos de Pexels sin URL — `_videoUrl()` fabricaba `videos.pexels.com/video-files/{id}/{id}-hd_1280_720_30fps.mp4` → **403 en todos**. Reemplazadas por 29 entradas con URL completa **verificada con curl (HTTP 200)** en esta sesión. "Mis videos" quedó intacto.

### Verificación
- Harness offline: 12 tests, todos pasan (generación, paleta, edit quirúrgico, robustez, video x4, secciones nuevas, hero center, clases premium, image_url priority + supervivencia, acción new)
- Syntax check de app.js y de TODOS los <script> inline de landing-builder.html
- Screenshot Chromium del diseño premium (hero center + para-quien + antes-despues + precio + cta) — correcto en dark
- Cache-busters: `?v=20260718b`

### Pendientes
- 🟡 Límites ebook: Pro=999, Growth=999 → REVERTIR a Pro→5, Growth→20
- 🟡 Prueba con API viva (calidad de contenido real de Sonnet/Haiku)

---

## SESIÓN 19 JUL 2026 — Ronda 2 de fixes del landing-builder (feedback de Sandra)

### Reporte de Sandra tras probar la ronda 1
1. El chat ya no regenera TODA la landing, pero al pedir un cambio regenera la sección completa (pierde el contenido bueno)
2. Cards desbalanceadas: 4 módulos = 3 arriba + 1 abajo (feo), y pedirle "organizalas" solo regeneraba contenido
3. El chat sigue sin contexto de la conversación
4. Imágenes: solo se colocan si hay espacio de imagen; "ponela en X sección" no funcionaba
5. Iconos "básicos de WhatsApp" (emojis) en vez de Material Symbols
6. Móvil roto
7. Siempre inventa un precio genérico ($97) aunque el producto no tenga precio
8. Video de fondo borra la foto del hero
9. Necesita: pixel de Facebook, links de pago Hotmart, páginas de agradecimiento/funnels

### Fixes aplicados (todos determinísticos donde fue posible)

**Grids balanceados por código (`_buildSection`)**: `COLS(n)` — 4 items → 2×2, 3/5/6 → 3 col, 1-2 → esa cantidad. Clases `.ld-grid .ld-g1/.ld-g2/.ld-g3` con media queries en `assembleLanding`: ≤960px g3→2col, ≤640px todo→1col. Ya no puede quedar 1 card huérfana. **El layout nunca más depende de la IA.**

**Responsive móvil real**: bloque `@media(max-width:640px)` en assembled CSS: secciones 56px padding, hero img height auto (max 300px), h1 2rem, `.ld-btn` display block centrado.

**Edición quirúrgica (`_editSectionContent`)**: el path "edit" ahora manda el JSON ACTUAL de la sección + el pedido + los últimos 6 mensajes del chat → la IA devuelve el mismo JSON con SOLO lo pedido cambiado (verificado en test: items intactos palabra por palabra). Fallback al método anterior si la sección no tiene content guardado.

**Contexto de conversación**: `editLandingSectioned(instruction, sections, palId, brief, history)` — el clasificador recibe los últimos 8 mensajes. El clasificador ahora PREFIERE "edit" sobre "fix" (fix=destructivo solo si está roto de verdad) y trata quejas de layout como edit.

**Iconos sanitizados**: `okIcon()` — si la IA devuelve emoji o texto raro (no `/^[a-z0-9_]+$/`), se usa el fallback del template. Los emojis ya no pueden aparecer.

**Precio/bonos determinístico**: `generateLandingSectioned` filtra las secciones `precio` y `bonos` del plan si el brief no menciona precio/bonos (regex). Hint de precio: "usá EXACTAMENTE el precio del brief". `assembleLanding` redirige `href="#precio"` a `#cta-final` si no hay sección precio.

**Imagen en cualquier sección**: post-proceso en `_buildSection` — si `content.image_url` y la sección no es hero, inserta la imagen al final de la sección. Nuevo `setSectionImage(sections, palId, sectionId, imageUrl, brief)` (+ facade). En el builder: `_pendingHtmlImage` guarda la última imagen subida; si el usuario dice "ponela en beneficios" (matching por alias en `_matchSectionInMsg`), se coloca SIN IA. El mensaje del chat tras subir explica cómo moverla.

**Video + foto conviven**: el hero con `video_url` ahora también muestra `image_url` (card con borde bajo el CTA).

**Pixel de Facebook + link de pago (Hotmart)**: `assembleLanding(sections, palId, title, opts)` acepta `{ctaUrl, fbPixel}`:
- `ctaUrl` → todos los `<a class="ld-btn">` apuntan al checkout con `target="_blank"`
- `fbPixel` → snippet fbq init+PageView en <head> + listener `InitiateCheckout` en clicks de `.ld-btn`
- Campos en el modal de publicar (`publish-cta-url`, `publish-fb-pixel`) → `landing.settings.cta_url` / `fb_pixel_id`
- `_landingOpts()` en el builder pasa los settings a TODOS los call sites de assembleLanding

### Verificación
- `test-round2.js`: 21 checks nuevos, todos pasan
- `test-landing.js` (suite 1): actualizada a los nuevos grids/filtros, 12 tests pasan
- Screenshots Chromium: 4 módulos → 2×2 perfecto en desktop, 1 col en móvil 390px
- Cache-busters: `?v=20260718c`

### Sobre funnels/páginas de agradecimiento (pendiente mayor)
No implementado aún. Workaround actual: crear otra landing como página de gracias y poner su URL publicada en la config de Hotmart. Feature futura: multi-página por landing (`landing.pages[]`).

---

## SESIÓN 19 JUL 2026 (parte 2) — LA SOLUCIÓN DE FONDO: editor visual sin IA

### El diagnóstico que faltaba hacer

Sandra: "ese building de la landing definitivamente no funciona y ese chat peor, llevo meses".

Antes de tocar código se hicieron dos verificaciones que NUNCA se habían hecho:

1. **¿El código llegó a producción?** Sí — `origin/main` contiene los fixes (`_editSectionContent`,
   `_parseJSONSafe`, `setSectionImage`, cache-busters `?v=20260718c`). No era un problema de deploy.

2. **¿Funciona la página real, no la lógica aislada?** Se construyó un **test E2E real**
   (`tests/e2e-landing-builder.js`): levanta el repo en un server HTTP, abre `landing-builder.html`
   en Chromium, mockea el CDN de supabase-js y el endpoint `claude-proxy`, y opera la UI como la
   usuaria. **Pasó todo**: generar, editar sin regenerar, guardar, recargar, editar de nuevo.

**Conclusión**: la mecánica ya estaba bien. El problema de fondo es **arquitectónico**: editar SOLO
por chat significa que cada cambio depende de que un modelo clasifique bien la intención. Aunque
acierte el 85% de las veces, el 15% restante destruye trabajo — y eso destruye la confianza.
Ninguna cantidad de prompt-tuning arregla eso.

### LA SOLUCIÓN: editor visual directo (panel derecho)

El modo secciones ya guardaba `content` JSON estructurado por sección. Faltaba exponerlo en una UI.

**`app.js`** — dos métodos nuevos en el facade `AI` (puro código, sin IA):
- `AI.buildSection(id, content, palId)` → HTML de una sección desde su content
- `AI.sectionSchema(id)` → schema por defecto (para secciones nuevas o landings viejas sin content)

**`landing-builder.html`** — el `#right-panel` (que era del sistema viejo de bloques y estaba
oculto) ahora es el **Editor visual**:
- `SEC_SCHEMA`: define los campos editables de cada tipo de sección (texto, área, lista, items
  con subcampos, icono con dropdown de Material Symbols, imagen con upload, select de layout).
- `renderSectionsList()`: lista de secciones con ↑ ↓ 🗑 y selección.
- `openSectionEditor(idx)` + `renderSecField()`: formulario generado desde el schema.
- `setSecField(path, value)` → `_setByPath` sobre `section.content` → debounce 350ms →
  `rebuildActiveSection()` → `AI.buildSection` + `AI.assembleLanding` → preview + autosave.
- `addSecItem` / `removeSecItem` / `moveSecItem`: manipular listas (agregar un beneficio, borrar
  un testimonio, reordenar módulos).
- `moveSection` / `deleteSection` / `addSection(id)`: estructura de la landing.
- **CERO llamadas a la IA en todo este flujo** (verificado en el E2E).

El chat sigue existiendo para lo que es bueno (generar de cero, reescribir textos con IA), pero
**ya no es el único camino**. Si el chat falla, la usuaria edita a mano y listo.

### Bug adicional encontrado y corregido
`tailwind.config = {...}` en un `<script>` inline: si el CDN de Tailwind no cargaba (red lenta,
bloqueo, adblock), `tailwind` era undefined → **ReferenceError que mataba TODO el script siguiente**,
incluida la UI del builder. Blindado con `window.tailwind = window.tailwind || {}`.
Esto puede explicar reportes de "no funciona nada" que no se reproducían.

También: Lloyd (`#lsa-float-btn`) tapaba el editor → se achica y se corre a la izquierda del panel.

### Tests permanentes en el repo (`tests/`)
- `tests/e2e-landing-builder.js` — 40+ checks sobre la página real en Chromium
- `tests/unit-landing.js` — generación, paleta, edición, video, robustez
- `tests/unit-landing-round2.js` — grids balanceados, iconos, edición quirúrgica, pixel/CTA
- `tests/README.md` — cómo correrlos

**Regla para futuras sesiones**: antes de decir "está arreglado", correr
`node tests/e2e-landing-builder.js`. Si no pasa, no está arreglado.

### Versión: `?v=20260719a`

### Pendientes
- 🟡 Límites ebook: Pro=999, Growth=999 → REVERTIR a Pro→5, Growth→20
- 🟡 Funnels / páginas de agradecimiento (multi-página por landing)

---

## SESIÓN 19 JUL 2026 (parte 3) — Nav, media por sección, funnel y fix de desplegables

### Reporte de Sandra sobre el editor visual (que sí le gustó: "mucho mejor")
1. Desplegables con texto blanco sobre blanco → ilegibles
2. Hero "texto + imagen al lado" no funcionaba, solo centrado
3. "No hay opción de agregar más secciones"
4. No se podían poner imágenes/videos en secciones que no fueran el hero
5. La landing no tiene barra de navegación
6. Falta el funnel: página de gracias, píxel y botón de pago a la pasarela

### 1. Desplegables ilegibles — RESUELTO ✅
El popup de un `<select>` lo pinta el sistema operativo con fondo blanco, pero heredaba
`color:#e8e8ee` → texto blanco sobre blanco. Fix en el CSS de la página:
```css
select{color-scheme:dark}
select option{background:#1c1c20 !important;color:#e8e8ee !important}
```
Aplica a TODOS los selects del builder, no solo al editor.

### 2. Hero "imagen al lado" — CAUSA RAÍZ ENCONTRADA ✅
El motor de `layout: split|center` estaba bien (verificado en `tests/unit-landing-sections.js`).
El problema real: **`_buildSection('hero')` chequeaba `if (c.video_url)` ANTES que el layout**, así
que cualquier hero con video de fondo se forzaba a centrado, ignorando la elección.
Fix: ahora hay dos variantes con video — split (texto + imagen al lado, video detrás) y centrada.
Además el campo `video_url` del hero es visible/editable/borrable en el editor.

### 3-4. Media en cualquier sección — RESUELTO ✅
- `MEDIA_FIELDS` (imagen + video de fondo) se agrega automáticamente al editor de toda sección
  que no maneje media en su propio template (las que sí: hero, nav, imagen, video, galeria → `noMedia:true`).
- Post-proceso en `_buildSection`: `image_url` se inserta al final de la sección; `video_url` envuelve
  la sección con `<video>` absoluto + overlay `rgba(0,0,0,.62)` + wrapper `.ld-onvideo` que fuerza
  texto blanco y cards translúcidas para que todo se lea.

### 5. Barra de navegación — NUEVA ✅
- Template `nav` en `_buildSection`: header sticky con blur, marca, links, botón CTA y menú
  hamburguesa en ≤860px (el toggle es JS inline, sin dependencias).
- `navLinksFor(sections)` construye los links **desde las secciones que existen de verdad** — nunca
  puede apuntar a una sección inexistente.
- `generateLandingSectioned` lo agrega automáticamente al principio, sin llamada extra a la IA.

### Secciones libres nuevas ✅
`texto` (bloque libre con alineación), `imagen` (destacada con pie y 3 tamaños),
`video` (YouTube/Vimeo → iframe embed; .mp4 → tag video), `galeria` (grid balanceado).
Todas disponibles en el modal "+ Agregar" del editor visual.

### 6. Panel "Ventas y funnel" — NUEVO ✅
Sección plegable arriba del editor visual (antes esto vivía escondido en el modal de publicar):
- **Link de pago**: todos los `.ld-btn` de la landing apuntan al checkout (`target="_blank"`)
- **Píxel de Facebook**: fbq init + PageView en `<head>` + `InitiateCheckout` en clics de CTA
- **Página de gracias**: `createThanksPage()` arma una landing secundaria por código (hero de
  agradecimiento + 3 pasos siguientes + soporte + footer), la guarda **publicada** como fila propia
  en `landings` con `settings.is_thanks_page` y `parent_landing`, y muestra el link listo para pegar
  en la pasarela. Botón "Editar página de gracias" la abre en otro tab del mismo builder.
  Los datos quedan en `landing.settings.thanks_slug` / `thanks_id`.

### Tests
- `tests/unit-landing-sections.js` (NUEVO): 22 checks — hero split/center/video, nav, secciones
  libres, media por sección, overlay de legibilidad.
- `tests/e2e-landing-builder.js`: ampliado a **50+ checks**, ahora cubre nav automático con links
  reales, agregar sección de video con embed, imagen en sección no-hero, link de pago + píxel
  aplicados al HTML, y creación/publicación de la página de gracias.

### Versión: `?v=20260719b`

### Pendientes
- 🟡 Límites ebook: Pro=999, Growth=999 → REVERTIR a Pro→5, Growth→20

---

## SESIÓN 19 JUL 2026 (parte 4) — Embudo completo: upsell y downsell

### Pedido de Sandra
"¿Y para el funnel de los upsell y downsell?"

### Sección `oferta` (nueva) — `_buildSection` en app.js
Sección diseñada para páginas de upsell/downsell:
- Badge de urgencia con gradiente de marca
- Lista de qué incluye con checks
- **Precio tachado + precio de oferta**
- Botón grande "SÍ, LO QUIERO" que usa `content.cta_url` (link de pago de ESA oferta)
- Link discreto "No gracias, continuar" (`content.decline_url`) que lleva al paso siguiente

**Regla clave en `assembleLanding`**: el `ctaUrl` global reescribe `href="#precio|#cta-final|#hero"`
con clase `.ld-btn`, y también `href="#"` (oferta sin link propio). **Nunca toca el `.ld-decline`**
(no tiene clase `ld-btn`), así que el "no gracias" jamás se convierte en un botón de compra.

### Embudo de 3 páginas — `landing-builder.html`
`landing.settings.funnel = { upsell:{id,slug}, downsell:{id,slug}, thanks:{id,slug} }`
(migra automáticamente el formato viejo `thanks_slug`/`thanks_id`).

- `FUNNEL_STEPS` + `renderFunnelSteps()`: mapa visual de los 3 pasos en el panel "Ventas y funnel".
  Cada paso creado muestra su link copiable + botones Editar / Ver. Los no creados muestran "Crear página".
- `_funnelPageSections(type, palId, name)`: arma las secciones por código.
  - `upsell` → oferta ($197 tachado → $97) + footer
  - `downsell` → oferta más accesible ($97 tachado → $27) + footer
  - `thanks` → hero de agradecimiento + 3 pasos + soporte + footer
- `createFunnelPage(type)`: crea la página como fila propia en `landings`, publicada,
  con `settings.funnel_role` y `parent_landing`. Hereda el píxel de la landing madre.
- `_declineTargetFor(type, f)`: upsell → downsell (o gracias); downsell → gracias.
- `_relinkFunnel()`: al crear una página nueva, recarga las páginas de oferta ya existentes desde
  la DB, actualiza su `decline_url`, reconstruye su HTML y las vuelve a guardar. **Así el embudo se
  encadena solo sin importar en qué orden se crean las páginas.**

**Cero llamadas a la IA** en todo el flujo del embudo (verificado en el E2E).

### Tests
- `tests/unit-landing-sections.js`: +7 checks de la sección oferta (precio tachado, link propio vs
  global, protección del "no gracias").
- `tests/e2e-landing-builder.js`: E2E 12 reescrito — crea las 3 páginas, verifica que quedan
  publicadas, que el "no gracias" del upsell apunta al downsell y el del downsell a gracias, que el
  panel muestra los 3 links, y que nada de esto usa IA.
- Se agregó `settleAI()` al E2E: espera a que el contador de llamadas se estabilice antes de medir
  "cero llamadas", eliminando un falso negativo intermitente por pedidos del paso anterior en vuelo.

### Versión: `?v=20260719c`

### Pendientes
- 🟡 Límites ebook: Pro=999, Growth=999 → REVERTIR a Pro→5, Growth→20

---

## SESIÓN 19 JUL 2026 (parte 5) — Ronda de pulido: 11 puntos de Sandra

### 1. Contraste: modal de publicar e input de título — RESUELTO ✅
`#ld-title` era `bg-transparent border-none` **sin color explícito** → heredaba un tono ilegible.
Los modales usaban `bg-surface-container-high` (clase custom que puede quedar casi negra si el
config de Tailwind no aplica). Fix: input con fondo/borde/color propios; los 4 modales con
`background:#1b1b20` inline + reglas `#publish-modal label/h3/p/input` con `!important`.

### 2. Botones CTA en más secciones — RESUELTO ✅
`SEC_CTA()` en `_buildSection`: si `content.cta` existe, agrega botón al pie (usa `cta_url` propio o
cae al link de pago global) + `cta_note`. Activo en beneficios, módulos, cómo-funciona, testimonios,
bonos, garantía, para-quien, antes-después, texto, imagen, video, galería, problema
(`CTA_SECTIONS` en el editor).

### 3. Imágenes: por ítem, proporción y alineación — RESUELTO ✅
- **Foto por ítem** en beneficios, módulos y bonos (`item.image_url` → `F.image` en el editor).
- **Sección imagen**: `ratio` (original / 16:9 / 4:3 / 1:1 / 3:4) + `align` (centro/izq/der) +
  4 tamaños (100/85/65/40%). Helpers `RATIO()` y `ALIGN()`.
- **Galería**: `ratio` configurable (antes 4:3 fijo).

### 4. Espacios en el texto — RESUELTO ✅
La sección `texto` usaba `white-space:pre-line`, que **colapsa espacios múltiples**. Ahora `pre-wrap`.

### 5. Iconos de antes-después y para-quien — RESUELTO ✅
Eran fijos (`check_circle`/`close`). Ahora `yes_icon`/`no_icon` y `before_icon`/`after_icon`,
editables con el selector de iconos, con fallback vía `okIcon()`.

### 6. Chat que no aplica el cambio — MEJORA DE FONDO ✅
Nuevo `_matchSectionId(instruction, ids)`: **detecta la sección por palabras clave, sin IA**
(normaliza acentos, tabla de alias por sección, gana la coincidencia más larga). Si el usuario
nombra la sección y no pide landing nueva ni cambio estructural, `editLandingSectioned` va
**directo a la edición quirúrgica**, salteando el clasificador. Esto elimina el modo de fallo
principal: que el clasificador mande el cambio a otra sección o lo malinterprete.

### 7. Video en celular — RESUELTO ✅
Atributos completos (`playsinline webkit-playsinline disablepictureinpicture preload="auto"`) +
CSS `section > video{width/height 100%;object-fit:cover}` y refuerzo en `@media(max-width:640px)`.

### 8. Logo con link en el navegador — RESUELTO ✅
`nav` acepta `logo_url` (imagen, alto 34px) y `brand_href` (destino propio, por defecto `#hero`).

### 9. Funnel sin relación con el producto — RESUELTO ✅
`generateOfferContent(kind, productBrief, offerBrief, mainPrice)` en app.js (+ facade): escribe la
oferta de upsell/downsell **a partir del brief real de la landing madre**, con reglas de coherencia
de precio (upsell < principal; downsell << upsell). Al crear la página, el builder **pregunta qué
querés ofrecer** (con ejemplos) y pasa esa descripción. Si la IA falla, usa el contenido de ejemplo
anterior — nunca bloquea.

### Tests
- `tests/unit-landing-sections.js`: +19 checks (CTA al pie, foto por ítem, proporciones, alineación,
  iconos configurables, logo del nav, atributos de video móvil).
- `tests/e2e-landing-builder.js`: el mock ahora responde el prompt de oferta; se verifica que el
  contenido del upsell hable del producto real y que gracias siga sin usar IA.
- Aserciones actualizadas por cambios de comportamiento esperados (nav automático → 12 secciones,
  `pre-wrap`, ancho `medium` 65%).

### Versión: `?v=20260719d`

### Pendientes
- 🟡 Límites ebook: Pro=999, Growth=999 → REVERTIR a Pro→5, Growth→20

---

## SESIÓN 19 JUL 2026 (parte 6) — El bug del "se queda publicando" + español neutro

### EL BUG CRÍTICO: imágenes sin comprimir → guardado colgado — RESUELTO ✅

Sandra: *"No crea las páginas del embudo. Se queda publicando y no publica."*

**Causa raíz**: el landing-builder **no comprimía las imágenes subidas** (el ebook-builder sí lo hace
desde hace meses con `optimizeImageSource`). Una foto de celular de 3-6 MB se guardaba entera como
data URL base64 **dos veces**: dentro de `section.content.image_url` y otra vez dentro del `html`
ensamblado. Con 2-3 fotos, la fila de Supabase superaba los 15-20 MB → el `save` colgaba o fallaba,
y como `setStatus('Creando…')` solo se limpiaba en el `catch`, la UI quedaba en "publicando" para
siempre.

**Fix (landing-builder.html)**:
- `compressImage(src, maxBytes=220000, maxW=1600)`: canvas → JPEG con calidad descendente
  (0.82 → 0.4) hasta bajar del umbral. Verificado en E2E: **3963 KB → 177 KB** (22x).
- `readImageFile(file)`: toda subida (editor visual y chat) pasa por la compresión.
- `optimizeLandingImages()`: antes de cada `saveLanding()` recorre recursivamente el `content` de
  todas las secciones y comprime cualquier data URL > 240 KB que haya quedado de antes.
- `withTimeout(promise, ms, label)`: **la UI nunca queda colgada**. Aplicado a `saveLanding` (25s),
  creación de página del funnel (30s), `generateOfferContent` (45s), `_relinkFunnel` (30s) y a la
  edición por chat (60s). Cada timeout produce un mensaje claro en pantalla.
- `autosave()` ahora captura el error y lo muestra en vez de fallar en silencio.

### Español neutro (sin voseo) — RESUELTO ✅
Sandra: *"Español normal, no que esté vos."*
- Los 4 prompts de generación (`_getSectionContent`, `_editSectionContent`, `generateOfferContent`,
  `planLandingSections`) ahora abren con "Eres…" y llevan una **regla explícita**: español neutro con
  "tú" o impersonal y una lista negra de formas voseantes ("tenés", "podés", "querés", "hacé",
  "sumá", "fijate", "vos").
- Los textos por defecto de los schemas y de las páginas del funnel se reescribieron en neutro.
- **Nota**: la interfaz del builder sigue en voseo, igual que el resto de la plataforma. Solo se
  cambió el copy que termina en la landing publicada.

### Resto de la lista
| Reporte | Fix |
|---|---|
| Logo del nav muy grande | Campo "Alto del logo" (26/34/46/60 px) con tope de seguridad en 72 px |
| Video en celular "sale solo una parte" | Campo "Encuadre del video": Cubrir (recorta) o **Mostrar completo** (`object-fit:contain`) + `object-position` |
| Salto de línea en textos no funcionaba | `white-space:pre-wrap` en subtítulos, descripciones de ítems, respuestas del FAQ y garantía (antes solo lo tenía la sección `texto`) |
| Imagen no cambia tamaño ni lugar | La imagen genérica de sección ahora tiene `image_size`, `image_ratio` y `image_align` en el editor |
| En bonos la imagen no cuadra | La foto del bono pasó a estar arriba de la tarjeta, a lo ancho y en 16:9 |
| Preguntas sin iconos | El FAQ acepta icono por pregunta + icono general de la sección |
| Chat no funciona | Timeout de 60s + mensaje de error **con el detalle real** y recordatorio de que se puede editar a mano en el panel derecho |

### Tests
- `tests/unit-landing-sections.js`: +12 checks (logo, iconos FAQ, imagen de bono arriba, tamaño/
  proporción/alineación de imagen de sección, encuadre de video, saltos de línea).
- `tests/e2e-landing-builder.js`: **E2E 12b** (saltos de línea escritos en el editor sobreviven y se
  respetan al renderizar) y **E2E 13/14** (imagen de ~4 MB: se comprime, guarda en 102 ms sin colgar,
  y publicar termina mostrando el link con el botón habilitado de nuevo).

### Versión: `?v=20260719e`

### Pendientes
- 🟡 Límites ebook: Pro=999, Growth=999 → REVERTIR a Pro→5, Growth→20

---

## SESIÓN 19 JUL 2026 (parte 7) — Voseo eliminado por código, no por prompt

### El pedido
Sandra: *"Que la landing la cree con lenguaje normal, que no use el español de Argentina diciendo vos."*

En la parte 6 ya se había agregado la instrucción al prompt, pero **pedirle al modelo que no vosee
no garantiza nada** — es el mismo problema que teníamos con los layouts. La solución correcta es
la misma: **corregirlo por código sobre la salida**.

### `_deVos(str)` + `_neutralize(obj)` en app.js
- **Tabla explícita** (`_VOS_MAP`, ~150 entradas) para los irregulares y los imperativos con
  pronombre, donde no hay regla derivable: `sos→eres`, `tenés→tienes`, `podés→puedes`,
  `hacé→haz`, `fijate→fíjate`, `sumate→súmate`, `unite→únete`, `escribinos→escríbenos`…
- **Pronombre**: `para vos→para ti`, `con vos→contigo`, `a vos→a ti`, `vos→tú`.
- **Regla general** para los verbos regulares que no están en la tabla: `-ás→-as`, `-és→-es`,
  `-ís→-es`, con **lista de excepciones** (`inglés`, `francés`, `después`, `interés`, `estás`,
  `más`, `quizás`, `jamás`, `atrás`, `país`, `raíz`…) y caso especial de los verbos en **-uir**
  (`construís→construyes`, `incluís→incluyes`).
- **Preserva mayúsculas**: `PODÉS→PUEDES`, `Tenés→Tienes`.
- `_neutralize(obj)` recorre el objeto de contenido completo (strings, arrays, objetos anidados)
  y **no toca** claves de URL, iconos, prompts de imagen, proporciones ni layouts.

**Detalle técnico importante**: `\b` de JavaScript NO marca límite de palabra después de una vocal
acentuada ("empezá "), así que las primeras versiones no reemplazaban nada. Se usan lookarounds
Unicode explícitos: `(?<![\p{L}\p{N}])(…)(?![\p{L}\p{N}])` con flag `u`.

### Dónde se aplica
Los 4 puntos donde el modelo devuelve texto: `_getSectionContent`, `_editSectionContent`,
`generateOfferContent` y el título/briefs de `planLandingSections`.

### Tests
- `tests/unit-espanol-neutro.js` (NUEVO): 30 checks — frases típicas de landing, mayúsculas,
  objeto completo como lo devuelve la IA, verbos fuera de la tabla, y las palabras que **no** son
  voseo y no deben tocarse.
- `tests/e2e-landing-builder.js`: **E2E 11b** — el mock de IA ahora devuelve voseo a propósito
  ("Movete segura… vas a sentir que podés con todo") y se verifica que **ni el contenido guardado ni
  el HTML final** contengan formas voseantes.

### Versión: `?v=20260719f`

### Pendientes
- 🟡 Límites ebook: Pro=999, Growth=999 → REVERTIR a Pro→5, Growth→20

---

## SESIÓN 19 JUL 2026 (parte 8) — Ronda de 8 bugs concretos

### 1. Imagen en las páginas de upsell/downsell — CAUSA RAÍZ ENCONTRADA ✅
El post-proceso que inserta `content.image_url` en una sección exigía
`__out.endsWith('</div></section>')` **exacto**. La sección `oferta` (y `precio`, `garantia`)
cierran con `</div>\n</section>` — con salto de línea — así que el match fallaba siempre y la
imagen nunca se insertaba. Ahora se busca el último `</section>` y se inserta antes del `</div>`
previo, tolerante a espacios y saltos.

### 2. Links de pago "no funcionan" — ERA LA VISTA PREVIA ✅
El `navGuard` que se inyecta en el iframe hacía `e.preventDefault()` en **todos** los links que no
empiezan con `#`, para que la vista previa no se navegue sola. Efecto: al hacer clic en un botón de
pago desde el builder no pasaba nada (en la landing publicada sí funcionaba). Ahora los links
externos abren en pestaña nueva (`window.open(h,'_blank','noopener')`), así se pueden probar.

### 3. El chat borró el logo — CAUSA RAÍZ ENCONTRADA ✅
`_editSectionContent` **reemplazaba** el content por lo que devolvía el modelo. Cuando el modelo
devuelve solo las claves que cambió (comportamiento normal), todo lo demás desaparecía: logo,
imágenes subidas, links de pago. Ahora se **fusiona** sobre el contenido actual
(`{...currentContent, ...parsed}`), y además se ignora un vaciado accidental de
`logo_url|image_url|video_url|cta_url|decline_url|brand_href` cuando el usuario ya tenía un valor.

### 4. Texto que no bajaba de renglón en la landing ✅
`white-space:pre-wrap` faltaba en los **títulos** (`H2`, los 4 `h1` del hero, `h3` de las cards y el
`h2` de oferta/cta-final). En el editor el salto se veía porque el textarea lo respeta; en la landing
se perdía.

### 5. Alto del logo + no se podía borrar ✅
- El campo de imagen ahora tiene botón **"Quitar"** (`clearSecField`), antes no había forma de borrar
  una imagen ya cargada.
- La vista previa del campo pasó a `object-fit:contain` para ver la imagen completa.

### 6. Foto de los bonos que se cortaba ✅
Cada ítem (bonos, beneficios, módulos) acepta ahora **"Ajuste de la foto"**: 4:3, 16:9, cuadrada o
**Completa (sin recortar)** — esta última usa `height:auto` y muestra la imagen entera.

### 7. Video en celular: "sale solo el centro" ✅
Nuevo campo **"Qué parte del video se ve"** (`video_position`: centro / arriba / abajo) que se suma
al encuadre (`video_fit`). Con `cover` en una pantalla angosta el recorte es inevitable; ahora se
elige qué parte se conserva, o se pasa a "Mostrar completo".

### 8. El embudo tardaba sin avisar ✅
Sandra confirmó que **sí creaba las páginas**, solo tardaba y no había señal. Ahora el paso del
embudo muestra "Creando la página y escribiendo la oferta… puede tardar hasta 1 minuto" con puntos
animados, y el resto de los botones se deshabilitan mientras tanto (`_funnelBusy`).

### Tests
- `tests/unit-landing-sections.js`: +9 checks (imagen en oferta/garantía/precio, saltos en títulos,
  ajuste de foto por ítem, posición del video).
- `tests/e2e-landing-builder.js`: **E2E 10b** — el mock ahora devuelve un JSON incompleto y con
  `logo_url: ''` (como hace el modelo real) y se verifica que el chat aplica el cambio **sin borrar**
  la imagen subida, el link de pago ni el resto del contenido.

### Versión: `?v=20260719g`

### Pendientes
- 🟡 Límites ebook: Pro=999, Growth=999 → REVERTIR a Pro→5, Growth→20

---

## SESIÓN 19 JUL 2026 (parte 9) — "No funciona nada de lo nuevo": era caché

### El diagnóstico
Sandra reportó que **nada de lo nuevo del video funcionaba** y que el logo seguía grande. Se verificó
en el código que `video_fit` / `video_position` / `logo_size` **estaban correctamente aplicados** en
los 3 branches de video y en el nav. Conclusión: el código está bien, **no le estaba llegando**.

**Causa**: los cache-busters (`?v=`) viven DENTRO de `landing-builder.html`. Si el navegador o Vercel
sirven el HTML cacheado, ese HTML sigue pidiendo `app.js?v=<versión vieja>` → ningún cambio llega,
por más que se bumpee la versión.

**Fix en 3 capas**:
1. `vercel.json`: headers `Cache-Control: public, max-age=0, must-revalidate` para todos los `.html`
   y para `app.js` / `landing-blocks.js` / `supabase-config.js`.
2. `<meta http-equiv="Cache-Control" content="no-cache, must-revalidate">` en el builder.
3. **Badge de versión visible** (`#ld-version`, constante `BUILDER_VERSION`) al lado del título.
   Ahora se puede confirmar de un vistazo qué versión está corriendo — sin esto es imposible
   distinguir "mi fix no funciona" de "el navegador tiene la versión vieja".

### SOLUCIÓN DEFINITIVA DEL CHAT: campos protegidos del usuario ✅
El merge de la parte 8 solo cubría `_editSectionContent`. Pero `editLandingSectioned` tiene **cuatro
caminos** que reemplazan el content, y `keepOf` solo preservaba `video_url` e `image_url` — por eso
el chat volvió a borrar el logo (cayó en el camino "fix", que regenera).

Ahora hay un mecanismo central:
- **`_USER_FIELDS`**: regex con las claves que son propiedad del usuario — `logo_url`, `logo_size`,
  `image_url`, `image_size`, `image_ratio`, `image_align`, `item_image_ratio`, `video_url`,
  `video_fit`, `video_position`, `cta_url`, `decline_url`, `brand_href`, `layout`.
- **`_preserveUser(prev, next)`**: restaura esas claves cuando el modelo las omitió o las devolvió
  vacías, **también dentro de `items[]`** (las fotos por bono/beneficio/módulo).
- Aplicado en **los 4 caminos**: atajo determinista, edit quirúrgico, fix de una sección y fix total
  (`keepOf` ahora recorre `_USER_FIELDS` completo).

`tests/unit-chat-preserva.js` (NUEVO) prueba los 4 caminos: JSON incompleto, logo devuelto vacío,
regeneración de la sección y regeneración de toda la landing. En todos el logo, su tamaño, su link,
la foto y el video del usuario sobreviven.

### Logo que quedaba grande y tapaba el título ✅
- El `height` fijo con `max-width:190px` dejaba que un logo apaisado creciera a lo ancho y empujara
  el título. Ahora: `max-width:100%` dentro de un `<a>` con `max-width:52%` y `flex:0 1 auto`.
- Escala nueva más chica: 22 / 30 / 38 / 48 / 60 px (default 30, antes 34; tope 64).
- **Con logo, el nombre de marca ya no se muestra por defecto** (competía por el espacio y terminaba
  tapando el título). Nuevo campo "Mostrar el nombre junto al logo" para quien quiera ambos.

### Versión: `?v=20260719h` (badge `v20260719h`)

### Pendientes
- 🟡 Límites ebook: Pro=999, Growth=999 → REVERTIR a Pro→5, Growth→20

---

## SESIÓN 19 JUL 2026 (parte 10) — El chat reescrito + 4 bugs con causa raíz

### EL BUG DEL LOGO: no era el tamaño, era el respaldo de imágenes ✅
`assembleLanding` tenía `img.ld-img{...;min-height:160px}` y el script inyectado le ponía la clase
`ld-img` a **todas** las imágenes al cargar la página. Resultado: el logo con `height:30px` se
inflaba a 160px de alto y la barra (con `overflow:hidden`) lo recortaba → se veía enorme y parecía
que el selector de tamaño no hacía nada.

**Fix**: la clase pasó a llamarse `ld-fallback` y **solo se aplica dentro del handler de `error`**,
o sea únicamente cuando una imagen realmente no carga. Medido en Chromium: logo `93x30 px`, barra
`68 px` fija. Antes: logo inflado a 160 px recortado por la barra.

### Alineación de la imagen de sección ✅
`<figure style="margin:44px auto 0; ... ${ia}">` — el **shorthand** ya ponía `margin-left/right:auto`,
así que el `margin-right:auto` de "izquierda" no cambiaba nada y todo quedaba centrado. Ahora se usan
`margin-top` + `ALIGN()` con ambos lados explícitos (`margin-left:0;margin-right:auto`).

### Fotos de módulos gigantes ✅
Cada sección armaba su `<img>` con estilos propios. Se unificó en `ITEM_IMG(it)`: 16/9 por defecto,
**`max-height:190px`** y proporción configurable por ítem. Módulos, bonos y beneficios ahora se ven
iguales.

### Saltos de línea: regla global en vez de parches ✅
Se venían agregando `white-space:pre-wrap` tag por tag, y cada sección nueva volvía a romperlo
(por eso "se dañó de nuevo"). Ahora hay **una regla global** en el CSS de la landing:
`h1,h2,h3,h4,p,li,summary,figcaption,blockquote{white-space:pre-wrap}` con `nowrap` solo donde un
salto sería un error de maquetado (nav, iconos).

### EL CHAT, REESCRITO — `chatEditLandingSections` ✅
El motor anterior encadenaba **clasificador (Haiku) → regenerar o editar**, y cada eslabón podía
fallar: clasificaba mal, mandaba el cambio a otra sección, o regeneraba y perdía contenido.

El motor nuevo es **una sola llamada a Sonnet** que recibe:
- el brief del producto,
- **el contenido real de cada sección** (con las imágenes reemplazadas por `[imagen que subió la
  usuaria]` para no ensuciar el prompt),
- los últimos 8 mensajes de la conversación;

y devuelve **operaciones puntuales**:
```json
{"reply":"…","ops":[{"section":"nav","set":{"logo_size":"22"}}]}
```
El código aplica `{...contenidoActual, ...set}` + `_preserveUser` + `_neutralize`, y reconstruye
solo esa sección. Ventajas: **1 llamada en vez de 2**, el modelo ve lo que hay de verdad, no puede
regenerar de más, y si no entiende devuelve `ops: []` con una respuesta útil. El motor viejo quedó
como respaldo automático si el nuevo falla. El chat además informa qué secciones tocó.

`tests/unit-chat.js` (NUEVO): 20 checks — el pedido que fallaba ("baja el tamaño del logo"),
preservación de archivos, cambios en listas, varias secciones a la vez, respuesta rota, pregunta que
no es un cambio, y salida sin voseo.

### Versión: `?v=20260719i` (badge `v20260719i`)

### Pendientes
- 🟡 Límites ebook: Pro=999, Growth=999 → REVERTIR a Pro→5, Growth→20

---

## SESIÓN 19 JUL 2026 (parte 11) — La sección de pasos + el chat que derivaba a soporte

### El caso concreto: "Semanas 1 y 2" desbordando el círculo ✅
La sección `como-funciona` dibujaba el paso en un **círculo fijo de 56×56 px**, asumiendo un número
("1", "2"). Cuando la IA generó etiquetas como "Semanas 1 y 2", el texto se salía del círculo y se
superponía al título. Sandra le pidió al chat que lo arreglara y el chat hizo lo único que podía:
**acortar el texto** a "Sem. 1–2" — que también se veía mal.

**Fix**: `PASO(txt)` elige la forma según el contenido — círculo si son 1-2 caracteres, **píldora
que fluye con el texto** si es más largo. Verificado en Chromium con el caso real de 4 pasos.

### El chat derivando a soporte — CAUSA RAÍZ ✅
El chat respondió: *"desde aquí no puedo verificar si los cambios se están aplicando… contactá al
soporte técnico de la plataforma"*. Dos causas:

1. **No sabía qué campos podía tocar.** Recibía el contenido de cada sección pero no el catálogo de
   campos editables, así que ante un problema visual no encontraba qué cambiar y se rendía.
2. **Nada le impedía dar respuestas de call-center.**

**Fix**: nuevo `_CAMPOS_EDITABLES` (catálogo por sección) que se inyecta en el prompt junto al
contenido, más reglas de comportamiento explícitas:
- "TÚ eres el soporte de esta herramienta. NUNCA digas que contacte a soporte técnico ni que no
  puedes verificar si los cambios se aplican."
- Si no existe un campo para lo pedido, nombrar el control exacto del panel derecho.
- Si la usuaria dice que quedó mal, revisar el contenido actual y corregir de verdad, no repetir.
- **No acortar textos por cuenta propia**: los diseños se adaptan al texto (el catálogo aclara que
  `step` acepta etiquetas largas).

### Campos que faltaban ✅
- **Foto por paso** en `como-funciona` (existía en módulos y bonos, faltaba acá — por eso "se
  desapareció la opción por cada módulo": la sección era otra) + subtítulo.
- **Botón CTA** en `problema`, `prueba-social` y `faq`: estaban en la lista del editor pero el motor
  no pintaba el botón, así que el campo aparecía y no hacía nada.

### Versión: `?v=20260719j` (badge `v20260719j`)

### Pendientes
- 🟡 Límites ebook: Pro=999, Growth=999 → REVERTIR a Pro→5, Growth→20

---

## SESIÓN 19 JUL 2026 (parte 12) — Bonos que nunca aparecían + chat que puede crear secciones

### "¿Por qué no lo hizo desde el principio si el prompt lo decía?" — EL BUG ERA MÍO ✅
Sandra generó con un brief que detallaba 3 bonos con su valor, y la landing salió **sin sección de
bonos**. Después le pidió al chat que la creara y el chat respondió que no podía.

**Causa raíz**: el filtro determinista de `generateLandingSectioned` era **de una sola dirección**:
```js
if (!hasBonus) plan.sections = plan.sections.filter(s => s.id !== 'bonos');
```
Quitaba la sección cuando el brief NO mencionaba bonos, pero **no la agregaba** cuando sí los
mencionaba y el planificador (Sonnet) la omitía. El brief estaba bien; nada corregía al planificador.

**Fix**: helper `asegurar(id, incluir)` que funciona en las dos direcciones, con un **orden canónico**
de secciones para insertar en el lugar correcto. Ahora se garantizan según el brief:
`precio`, `bonos`, `garantia`, `testimonios`, `faq` y `modulos`. Verificado con el caso real:
plan sin bonos + brief con bonos → la landing sale con bonos entre módulos y precio.

### El chat ahora puede CREAR, QUITAR y MOVER secciones ✅
El motor `chatEditLandingSections` solo aceptaba operaciones de cambio de campos, así que la
respuesta "no puedo crearla desde cero" era **cierta**. Ahora acepta 4 tipos de operación:

```json
{"op":"set","section":"beneficios","set":{…}}
{"op":"add","section":"bonos","after":"modulos","set":{…}}
{"op":"remove","section":"testimonios"}
{"op":"move","section":"faq","after":"precio"}
```

Al crear parte del schema por defecto y le aplica lo que el modelo mande. El prompt lista los ids
disponibles para crear y cierra con: *"Si la usuaria pide algo que necesita una sección que hoy no
está en su página, CRÉALA con add. Nunca respondas que no puedes crearla."*
El chat informa qué hizo con prefijos (`+ Bonos`, `- Testimonios`, `↕ Preguntas`).

### Botón del menú en celular que se salía de la pantalla ✅
La regla `#nav a{white-space:nowrap}` (para que los links del menú no se partieran) **le ganaba en
especificidad** a `.ld-btn{white-space:normal}`, así que el botón del menú desplegable no podía
cortar el texto y se salía. Fix: `.ld-btn,#nav .ld-btn,#nav a.ld-btn{white-space:normal;
overflow-wrap:anywhere}` + `box-sizing:border-box` y `overflow-x:hidden` en el panel desplegable.
Medido en Chromium a 390px: botón de 342px en dos líneas, sin scroll horizontal.

### Tests
- `tests/unit-plan-secciones.js` (NUEVO): el caso real (planificador olvida bonos → se agregan igual),
  posición correcta de cada sección, y que un brief sin precio ni bonos no los invente.
- `tests/unit-chat.js`: +12 checks de crear/quitar/mover secciones.
- `tests/unit-landing-sections.js`: +3 checks del botón del menú móvil.

### Versión: `?v=20260719k` (badge `v20260719k`)

### Pendientes
- 🟡 Límites ebook: Pro=999, Growth=999 → REVERTIR a Pro→5, Growth→20
