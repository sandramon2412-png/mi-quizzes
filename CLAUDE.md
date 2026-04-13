# Luminous Studio — Contexto del Proyecto

## Resumen
Plataforma SaaS para creadores de infoproductos hispanohablantes. Permite crear quizzes interactivos, mini-apps (retos, devocionales, trackers, chatbots IA, etc.) y capturar leads. Stack: HTML + JS vanilla + Tailwind CDN + Supabase (auth + DB). Desplegado en Vercel desde la rama `main`.

## Stack Técnico
- **Frontend**: HTML estático, JavaScript vanilla, Tailwind CSS via CDN
- **Backend**: Supabase (auth, PostgreSQL, Edge Functions)
- **IA**: Groq API (Llama 3.3 70B) como primario, Claude como proxy fallback via Supabase Edge Function
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
| Free | $0 | 1 | 2 | 100 | No | No | No |
| Starter | $5/mes | 3 | 5 | 1,000 | **No** | Sí | No |
| Pro | $9/mes | Ilimitados | Ilimitadas | 10,000 | Sí | Sí | Sí |
| Growth | $19/mes | Ilimitados | Ilimitadas | 25,000 | Sí | Sí | Sí |
| Elite | $49/mes | Ilimitados | Ilimitadas | Ilimitadas | Sí | Sí | Sí |

**Decisión**: Starter NO incluye IA — la IA es el diferenciador clave para upgrade a Pro ($9).

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
