# PetVoice AI — Contexto Completo para Claude Code

## REPOSITORIO
`sandramon2412-png/mi-quizzes`
Branch de desarrollo: `claude/nice-cannon-EGA9L` (auto-merge a `main` via GitHub Actions)

## Ubicación de archivos en el repo
Todos los archivos de PetVoice viven en: `petvoice-export/`
El proyecto real de Sandra está en: `C:\Users\moras\Downloads\petvoiceai\petvoice-ai\`
**Flujo**: Claude edita en `/home/user/mi-quizzes/petvoice-export/` → commits/push → Sandra descarga via SendUserFile y arrastra a su carpeta local → `npx expo start --clear`

---

## Stack Técnico
- **React Native + Expo SDK 54** — Android (Samsung Galaxy)
- **Expo Go** para testing (no build nativa)
- **expo-linear-gradient** — DEBE estar instalado: `npx expo install expo-linear-gradient`
- **react-native-safe-area-context** — `SafeAreaView edges={["top","bottom"]}` en todas las pantallas
- **@expo/vector-icons → MaterialCommunityIcons** — todos los íconos
- **expo-av** — grabación de audio
- **expo-image-picker** — foto de mascota
- **@expo-google-fonts/inter** — familia tipográfica Inter (400/500/600/700/800)
- **@react-navigation/native + native-stack** — navegación

---

## Estructura de Archivos

```
petvoice-export/
├── App.js                          # Entry point: fonts, SafeAreaProvider, AppProvider
├── src/
│   ├── context/AppContext.js       # Estado global: pet, analysisResult, canRecord
│   ├── navigation/AppNavigator.js  # Stack: Onboarding → Home → Loading → Result
│   ├── screens/
│   │   ├── OnboardingScreen.js     # 5 pasos: especie, nombre, edad, foto, confirmación
│   │   ├── HomeScreen.js           # Grabadora principal con postura/contexto
│   │   ├── LoadingScreen.js        # Espectrograma animado mientras analiza
│   │   └── ResultScreen.js         # Resultado del análisis con emoción y consejo
│   └── services/
│       └── aiService.js            # Llamadas a OpenAI (GPT-4o) o Claude (Haiku)
```

---

## Identidad Visual — MUY IMPORTANTE

### Colores de marca
```js
indigo:     "#4F46E5"   // color principal de marca
violet:     "#7C3AED"   // secundario
indigoLight:"#EEF2FF"   // fondo activo suave
text:       "#1E293B"   // texto principal
muted:      "#64748B"   // texto secundario
border:     "#E2E8F0"   // bordes
coral:      "#FF8A65"   // botón grabar (inactivo)
coralDark:  "#F4511E"   // botón grabar (activo/grabando)
```

### Gradiente de fondo de pantallas (modo claro)
```js
["#F8FAFC", "#EEF2FF", "#F5F3FF"]   // blanco → índigo suave → violeta suave
```

### GLASS constant (cards con efecto vidrio — CORRECTO para Android)
```js
const GLASS = {
  backgroundColor: "rgba(255,255,255,0.92)",
  borderWidth: 1, borderColor: "rgba(0,0,0,0.05)",
  shadowColor: "#0F172A",   // NUNCA "#4F46E5" — Android pinta aureola morada
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 12,
  elevation: 4,
};
```

### REGLA CRÍTICA — Sombras en Android
**NUNCA usar `shadowColor: "#4F46E5"` con `elevation > 3`.**
En Android, `elevation` usa el `shadowColor` para pintar la sombra → produce una aureola morada gruesa alrededor de TODAS las tarjetas, haciéndolas ver como si tuvieran un borde morado opaco.
Siempre usar `shadowColor: "#0F172A"` (azul muy oscuro casi negro) para sombras naturales.
La excepción permitida: `speciesCardActive` puede tener `shadowColor: "#4F46E5"` con `elevation: 4` máx y `shadowOpacity: 0.12` máx.

### Tipografía
```js
Inter_400Regular  → cuerpo, notas
Inter_500Medium   → texto de botones secundarios, mensajes
Inter_600SemiBold → labels, chips inactivos
Inter_700Bold     → títulos de sección, nombres
Inter_800ExtraBold→ cifras grandes, títulos principales
```

### PressableScale (componente de micro-animación — en TODOS los archivos)
```jsx
function PressableScale({ onPress, style, children, disabled, activeScale = 0.97 }) {
  const anim = useRef(new Animated.Value(1)).current;
  const cfg = { useNativeDriver: true };
  const press = () => Animated.spring(anim, { toValue: activeScale, tension: 300, friction: 12, ...cfg }).start();
  const release = () => Animated.spring(anim, { toValue: 1, tension: 200, friction: 8, ...cfg }).start();
  return (
    <TouchableOpacity onPressIn={press} onPressOut={release} onPress={onPress} disabled={disabled} activeOpacity={1} style={style}>
      <Animated.View style={[style, { transform: [{ scale: anim }] }]}>{children}</Animated.View>
    </TouchableOpacity>
  );
}
```
**IMPORTANTE**: pasar `style` tanto al `TouchableOpacity` COMO al `Animated.View` para que el flex layout se propague correctamente.

---

## Estado Actual de Cada Pantalla

### OnboardingScreen.js ✅ COMPLETO
- 5 pasos (TOTAL_STEPS = 4, steps 0–4)
- Tarjetas de especie: 110×110px fijas (`CARD_SIZE = 110`), fondo `#F8FAFC` inactivo, `#EEF2FF` activo, borde `#4F46E5` activo
- Paso 4 (completión): ícono check + "¡Todo listo!" + texto descriptivo — NO hay óvalo vacío
- Botón "Atrás" en pasos > 0
- GLASS con `shadowColor: "#0F172A"`
- Todos los textos con acentos correctos: "análisis", "precisión", "años", "Aparecerá", "Opcional (JPG o PNG)"

### HomeScreen.js ✅ COMPLETO
- Chips de postura activos: `View` con `backgroundColor: "rgba(79,70,229,0.10)"` + `borderColor: "rgba(79,70,229,0.25)"` + ícono/texto en `#4F46E5` (NO LinearGradient oscuro)
- Chips inactivos: GLASS con ícono/texto en `#64748B`
- Botón grabar coral con WaveRings animados
- `recordingRef` + cleanup en unmount → el micrófono se libera al navegar
- GLASS con `shadowColor: "#0F172A"` (elevation 4)
- Dropdown de contexto/entorno en Modal
- SafeAreaView `edges={["top","bottom"]}`

### LoadingScreen.js ✅ COMPLETO
- Fondo oscuro: `["#08091A", "#0D1030", "#0A0F2E"]`
- 36 barras de espectrograma animadas (azul→índigo→violeta→rosa)
- Barra de progreso con LinearGradient
- Mensajes rotativos de análisis con fade
- Navega a Result después de TOTAL_DURATION (4200ms) o cuando llega analysisResult

### ResultScreen.js ✅ COMPLETO
- Emotion pill con ícono vectorial (`emo.icon`) + texto, en colores del EMOTION_MAP
- Tarjeta de traducción: fondo `emo.cardBg` (tintado por emoción, ~5% opacidad), borde `rgba(255,255,255,0.65)`, sombra negra suave — glassmorphism real
- Tarjeta unificada: barra de confianza animada con colores `emo.barColors` + consejo del propietario
- AdBlock + CTA "Analizar otro sonido"
- Botón "Atrás" (arrow-left) en top-left navega a Home
- Todas las sombras con `shadowColor: "#0F172A"`

### EMOTION_MAP (en ResultScreen.js)
```js
const EMOTION_MAP = {
  Feliz:      { pillBg: "rgba(16,185,129,0.13)",  pillText: "#059669", barColors: ["#10B981","#34D399"], icon: "emoticon-happy-outline",  cardBg: "rgba(16,185,129,0.07)"  },
  Juguetón:   { pillBg: "rgba(16,185,129,0.13)",  pillText: "#059669", barColors: ["#10B981","#34D399"], icon: "emoticon-excited-outline", cardBg: "rgba(16,185,129,0.07)"  },
  Alerta:     { pillBg: "rgba(245,158,11,0.13)",  pillText: "#D97706", barColors: ["#F59E0B","#FBBF24"], icon: "alert-circle-outline",     cardBg: "rgba(245,158,11,0.07)"  },
  Curioso:    { pillBg: "rgba(251,191,36,0.13)",  pillText: "#B45309", barColors: ["#FBBF24","#FCD34D"], icon: "help-circle-outline",      cardBg: "rgba(251,191,36,0.07)"  },
  Estresado:  { pillBg: "rgba(239,68,68,0.13)",   pillText: "#DC2626", barColors: ["#EF4444","#F87171"], icon: "emoticon-sad-outline",     cardBg: "rgba(239,68,68,0.08)"   },
  Asustado:   { pillBg: "rgba(220,38,38,0.13)",   pillText: "#B91C1C", barColors: ["#DC2626","#EF4444"], icon: "shield-alert-outline",     cardBg: "rgba(220,38,38,0.08)"   },
  Tranquilo:  { pillBg: "rgba(100,116,139,0.13)", pillText: "#475569", barColors: ["#64748B","#94A3B8"], icon: "sleep",                    cardBg: "rgba(100,116,139,0.07)" },
  Hambriento: { pillBg: "rgba(249,115,22,0.13)",  pillText: "#EA580C", barColors: ["#F97316","#FB923C"], icon: "food-outline",             cardBg: "rgba(249,115,22,0.07)"  },
};
```

---

## AppContext — Estado Global
```js
// useApp() devuelve:
pet                   // { name, species, age, photo } o null
savePet(data)         // guarda el perfil de mascota
analysisResult        // resultado del AI { emocion_principal, porcentaje_confianza, ... }
saveResult(result)    // guarda resultado + incrementa contador
canRecord             // boolean — false cuando recordingsToday >= 5
remaining             // número de grabaciones restantes hoy
lastAnalysisAudio     // URI del audio grabado
setLastAnalysisAudio
lastPosture           // "relajado" | "alerta" | etc.
setLastPosture
lastEnvironment       // "llegada" | "comida" | etc.
setLastEnvironment
```

---

## aiService.js

### Flujo de análisis
1. Si hay `EXPO_PUBLIC_OPENAI_API_KEY` → usa GPT-4o
2. Si hay `EXPO_PUBLIC_ANTHROPIC_KEY` → usa Claude Haiku
3. Si no hay ninguna → `getDemoResult()` (modo demo con datos ficticios reales, con tildes correctas)

### Demo entries disponibles (sin API key)
Feliz, Alerta, Estresado, Tranquilo, Hambriento, Curioso

### Respuesta esperada del AI
```json
{
  "emocion_principal": "Feliz|Alerta|Estresado|Curioso|Hambriento|Juguetón|Asustado|Tranquilo",
  "porcentaje_confianza": 60-98,
  "color_interfaz": "#hex",
  "traduccion_humana": "frase en primera persona del animal",
  "consejo_propietario": "consejo para el dueño",
  "keyword_publicidad": "comida_mascotas|veterinario|juguetes|bienestar_animal|adiestramiento"
}
```

---

## Flujo de Navegación
```
Onboarding (si !pet) → Home → Loading (gestureEnabled:false) → Result → Home
```
- `AppNavigator` usa `initialRouteName={pet ? "Home" : "Onboarding"}`
- `LoadingScreen` navega con `navigation.replace("Result")` (no push) para que back no vuelva a Loading
- `ResultScreen` tiene botón back (arrow-left) y CTA "Analizar otro sonido" que van a "Home"

---

## Errores Frecuentes y Sus Soluciones

### "Unable to resolve expo-linear-gradient"
```powershell
npx expo install expo-linear-gradient
```

### Metro cache viejo después de copiar archivos
```powershell
Remove-Item .expo -Recurse -Force
Remove-Item node_modules\.cache -Recurse -Force
npx expo start --clear
```

### `style` no propaga en `PressableScale`
Pasar `style` a AMBOS: `TouchableOpacity` Y `Animated.View` — si solo va en uno, el flex layout se rompe.

### Tarjetas de especie no se centran / no llenan el espacio
Usar dimensiones fijas `width: CARD_SIZE, height: CARD_SIZE` (110). No usar `flex:1` en tarjetas de selección.

### `import` ordering bug
Todos los `import` van PRIMERO. Las `const` (como `const CARD_SIZE = 110`) van DESPUÉS de todos los imports. Si se mezclan, metro tira SyntaxError.

### Sombra morada visible en Android (el más común)
Cambiar `shadowColor: "#4F46E5"` → `shadowColor: "#0F172A"` en todos los estilos. Bajar `elevation` a 4-5 máximo en cards normales.

### `backdrop-filter: blur()` no existe en React Native
Android/RN no soporta backdrop-filter. Glassmorphism se simula con `backgroundColor: rgba(255,255,255,0.88-0.92)` + borde blanco semitransparente + sombra suave.

---

## Cómo Enviar Archivos a Sandra
1. Editar en `/home/user/mi-quizzes/petvoice-export/src/screens/` o `src/services/`
2. `git add ... && git commit && git push -u origin claude/nice-cannon-EGA9L`
3. `SendUserFile` con los archivos modificados
4. Sandra arrastra a `C:\Users\moras\Downloads\petvoiceai\petvoice-ai\src\screens\` (o services/)
5. Sandra recarga Expo Go (r en terminal o shake → Reload)

---

## Pendientes / Ideas para Próximas Sesiones
- Persistencia de `pet` con AsyncStorage (ahora se pierde al cerrar la app)
- Contador de grabaciones persistente por día con AsyncStorage
- Pantalla de historial de análisis pasados
- Compartir resultado (Share API de React Native)
- Animación de entrada en ResultScreen más refinada
- Prueba real con API key de OpenAI o Claude configurada en `.env`
- Publicación en Play Store (build con EAS)
