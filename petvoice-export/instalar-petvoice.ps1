# ============================================================
# PetVoice AI — Instalador automático
# Ejecuta este script UNA VEZ desde PowerShell:
#   cd C:\Users\moras\Downloads\petvoiceai\petvoice-ai
#   .\instalar-petvoice.ps1
# ============================================================

$base = "C:\Users\moras\Downloads\petvoiceai\petvoice-ai"

# Crear carpetas necesarias
New-Item -ItemType Directory -Force -Path "$base\src\context"    | Out-Null
New-Item -ItemType Directory -Force -Path "$base\src\navigation" | Out-Null
New-Item -ItemType Directory -Force -Path "$base\src\screens"    | Out-Null
New-Item -ItemType Directory -Force -Path "$base\src\services"   | Out-Null

Write-Host "Carpetas creadas" -ForegroundColor Green

# ── App.js ────────────────────────────────────────────────────
Set-Content -Path "$base\App.js" -Encoding UTF8 -Value @'
import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import { AppProvider } from "./src/context/AppContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
});
'@

Write-Host "App.js instalado" -ForegroundColor Green

# ── AppContext.js ─────────────────────────────────────────────
Set-Content -Path "$base\src\context\AppContext.js" -Encoding UTF8 -Value @'
import React, { createContext, useContext, useState, useCallback } from "react";

const AppContext = createContext(null);

const FREE_DAILY_LIMIT = 5;

export function AppProvider({ children }) {
  const [pet, setPet] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [recordingsToday, setRecordingsToday] = useState(0);
  const [lastAnalysisAudio, setLastAnalysisAudio] = useState(null);
  const [lastPosture, setLastPosture] = useState(null);
  const [lastEnvironment, setLastEnvironment] = useState(null);

  const savePet = useCallback((data) => { setPet(data); }, []);

  const saveResult = useCallback((result) => {
    setAnalysisResult(result);
    setRecordingsToday((n) => n + 1);
  }, []);

  const canRecord = recordingsToday < FREE_DAILY_LIMIT;
  const remaining = FREE_DAILY_LIMIT - recordingsToday;

  return (
    <AppContext.Provider
      value={{
        pet, savePet,
        analysisResult, saveResult,
        recordingsToday, remaining, canRecord,
        lastAnalysisAudio, setLastAnalysisAudio,
        lastPosture, setLastPosture,
        lastEnvironment, setLastEnvironment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
'@

Write-Host "AppContext.js instalado" -ForegroundColor Green

# ── AppNavigator.js ───────────────────────────────────────────
Set-Content -Path "$base\src\navigation\AppNavigator.js" -Encoding UTF8 -Value @'
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/OnboardingScreen";
import HomeScreen from "../screens/HomeScreen";
import LoadingScreen from "../screens/LoadingScreen";
import ResultScreen from "../screens/ResultScreen";
import { useApp } from "../context/AppContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { pet } = useApp();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={pet ? "Home" : "Onboarding"}
        screenOptions={{ headerShown: false, animation: "fade" }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
'@

Write-Host "AppNavigator.js instalado" -ForegroundColor Green

# ── aiService.js ──────────────────────────────────────────────
Set-Content -Path "$base\src\services\aiService.js" -Encoding UTF8 -Value @'
const OPENAI_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || "";
const ANTHROPIC_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_KEY || "";

const POSTURE_LABELS = {
  relajado: "postura relajada, cuerpo suelto",
  alerta:   "postura alerta, orejas erguidas, cuerpo tenso",
  arqueado: "espalda arqueada, pelo erizado",
  sentado:  "sentado tranquilamente",
  tumbado:  "tumbado de lado o boca abajo",
  jugueton: "postura ludica, cuartos traseros elevados",
  sumiso:   "postura sumisa, cola baja",
};

const ENV_LABELS = {
  llegada:  "llegada del duenio a casa",
  comida:   "hora de la comida",
  extrano:  "presencia de extranos o ruido repentino",
  juego:    "sesion de juego activo",
  descanso: "ambiente tranquilo de descanso",
};

function buildPrompt(species, name, posture, environment) {
  return `Eres un etologo experto en comunicacion animal. Analiza el sonido de ${species} llamado ${name}.
POSTURA: ${POSTURE_LABELS[posture] || posture}
CONTEXTO: ${ENV_LABELS[environment] || environment}
Responde UNICAMENTE con este JSON:
{"emocion_principal":"Feliz|Alerta|Estresado|Curioso|Hambriento|Jugueton|Asustado|Tranquilo","porcentaje_confianza":<60-98>,"color_interfaz":"#10B981|#F59E0B|#EF4444|#6366F1|#F97316|#8B5CF6|#DC2626|#64748B","traduccion_humana":"<frase primera persona 10-20 palabras>","consejo_propietario":"<consejo breve 15-25 palabras>","keyword_publicidad":"comida_mascotas|veterinario|juguetes|bienestar_animal|adiestramiento"}
COLORES: Feliz/Jugueton=#10B981 | Alerta/Curioso=#F59E0B | Estresado/Asustado=#EF4444 | Tranquilo=#64748B | Hambriento=#F97316`;
}

function parseAIResponse(text) {
  if (!text) throw new Error("Respuesta vacia del AI");
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("El AI no devolvio JSON valido");
  const result = JSON.parse(m[0]);
  if (!result.emocion_principal) throw new Error("JSON incompleto");
  return result;
}

export async function analyzeSound(species, name, posture, environment) {
  if (OPENAI_KEY) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 300,
        temperature: 0.3,
        messages: [{ role: "user", content: buildPrompt(species, name, posture, environment) }],
      }),
    });
    const data = await res.json();
    return parseAIResponse(data.choices?.[0]?.message?.content);
  }
  if (ANTHROPIC_KEY) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [{ role: "user", content: buildPrompt(species, name, posture, environment) }],
      }),
    });
    const data = await res.json();
    return parseAIResponse(data.content?.[0]?.text);
  }
  // Demo mode — sin API key
  const demos = [
    { emocion_principal: "Feliz", porcentaje_confianza: 91, color_interfaz: "#10B981", traduccion_humana: "Estoy tan contento de verte! Eres mi persona favorita en el mundo.", consejo_propietario: "Tu mascota esta muy feliz. Refuerza con una caricia o juguete.", keyword_publicidad: "bienestar_animal" },
    { emocion_principal: "Alerta", porcentaje_confianza: 78, color_interfaz: "#F59E0B", traduccion_humana: "Hay algo ahi afuera. No se si es peligroso pero lo estoy vigilando.", consejo_propietario: "Tu mascota detecto algo inusual. Tranquilizala con voz suave.", keyword_publicidad: "adiestramiento" },
    { emocion_principal: "Estresado", porcentaje_confianza: 85, color_interfaz: "#EF4444", traduccion_humana: "Me siento incomodo y necesito tu ayuda. Por favor quedate cerca.", consejo_propietario: "Aleja de la fuente de estres y ofrece un espacio seguro.", keyword_publicidad: "veterinario" },
  ];
  return Promise.resolve(demos[Math.floor(Math.random() * demos.length)]);
}
'@

Write-Host "aiService.js instalado" -ForegroundColor Green

# ── OnboardingScreen.js ───────────────────────────────────────
Set-Content -Path "$base\src\screens\OnboardingScreen.js" -Encoding UTF8 -Value @'
import React, { useState, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, ScrollView, Animated, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useApp } from "../context/AppContext";

const C = {
  bg: "#F8FAFC", card: "#FFFFFF", indigo: "#4F46E5", indigoLight: "#EEF2FF",
  text: "#1E293B", muted: "#64748B", border: "#E2E8F0", shadow: "#94A3B8", inputBorder: "#CBD5E1",
};
const TOTAL_STEPS = 4;

export default function OnboardingScreen({ navigation }) {
  const { savePet } = useApp();
  const [step, setStep] = useState(0);
  const [species, setSpecies] = useState(null);
  const [petName, setPetName] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petPhoto, setPetPhoto] = useState(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: -20, duration: 120, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0,   duration: 180, useNativeDriver: true }),
    ]).start();
    setStep((s) => s + 1);
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const r = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1,1], quality: 0.7 });
    if (!r.canceled && r.assets?.[0]?.uri) setPetPhoto(r.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;
    const r = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1,1], quality: 0.7 });
    if (!r.canceled && r.assets?.[0]?.uri) setPetPhoto(r.assets[0].uri);
  };

  const finish = () => {
    savePet({ name: petName.trim(), species, age: petAge.trim(), photo: petPhoto });
    navigation.replace("Home");
  };

  const canContinue = () => {
    if (step === 0) return !!species;
    if (step === 1) return petName.trim().length > 0;
    return true;
  };

  return (
    <SafeAreaView style={s.safe} edges={["top","bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <View style={s.logoSection}>
          <View style={s.logoCircle}>
            <MaterialCommunityIcons name="waveform" size={28} color="#fff" />
          </View>
          <Text style={s.logoTitle}>PetVoice AI</Text>
          <Text style={s.logoTagline}>Entiende a tu mascota con inteligencia artificial</Text>
          <View style={s.badge}>
            <MaterialCommunityIcons name="flask-outline" size={13} color={C.indigo} style={{ marginRight: 4 }} />
            <Text style={s.badgeText}>Etologia computacional</Text>
          </View>
        </View>

        <View style={s.progressSection}>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${(step / TOTAL_STEPS) * 100}%` }]} />
          </View>
          <Text style={s.progressLabel}>Paso {step + 1} de {TOTAL_STEPS + 1}</Text>
        </View>

        <Animated.View style={[s.card, { transform: [{ translateX: slideAnim }] }]}>
          {step === 0 && (
            <View>
              <Text style={s.title}>Que tipo de mascota tienes?</Text>
              <Text style={s.subtitle}>El modelo de analisis se adapta por especie</Text>
              <View style={s.speciesRow}>
                {[{key:"dog",label:"Perro",icon:"dog"},{key:"cat",label:"Gato",icon:"cat"}].map(sp => (
                  <TouchableOpacity key={sp.key} style={[s.speciesCard, species===sp.key && s.speciesCardActive]} onPress={() => setSpecies(sp.key)} activeOpacity={0.8}>
                    <MaterialCommunityIcons name={sp.icon} size={52} color={species===sp.key ? C.indigo : C.muted} />
                    <Text style={[s.speciesLabel, species===sp.key && s.speciesLabelActive]}>{sp.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 1 && (
            <View>
              <Text style={s.title}>Como se llama?</Text>
              <Text style={s.subtitle}>Usaremos el nombre en las traducciones</Text>
              <Text style={s.fieldLabel}>Nombre de tu mascota</Text>
              <TextInput style={s.input} placeholder="Ej: Max, Luna, Pelusa..." placeholderTextColor={C.muted}
                value={petName} onChangeText={setPetName} autoFocus maxLength={24} />
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={s.title}>Cuantos anos tiene?</Text>
              <Text style={s.subtitle}>Opcional — mejora la precision del analisis</Text>
              <Text style={s.fieldLabel}>Edad (anos)</Text>
              <TextInput style={[s.input, { width: 120 }]} placeholder="Ej: 2" placeholderTextColor={C.muted}
                value={petAge} onChangeText={setPetAge} keyboardType="numeric" maxLength={2} autoFocus />
              <Text style={s.skipNote}>Puedes dejarlo en blanco y continuar</Text>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={s.title}>Agrega una foto</Text>
              <Text style={s.subtitle}>Aparecera en la pantalla de resultados</Text>
              <View style={s.photoArea}>
                {petPhoto ? (
                  <TouchableOpacity onPress={pickPhoto} activeOpacity={0.85} style={{ position: "relative" }}>
                    <Image source={{ uri: petPhoto }} style={s.photoPreview} />
                    <View style={s.photoEditOverlay}>
                      <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={s.photoPlaceholder}>
                    <View style={s.cameraCircle}>
                      <MaterialCommunityIcons name="camera-outline" size={30} color={C.indigo} />
                    </View>
                    <Text style={s.photoHint}>Foto de {petName || "tu mascota"}</Text>
                    <Text style={s.photoSubHint}>Opcional · JPG o PNG</Text>
                  </View>
                )}
              </View>
              <View style={s.photoActions}>
                <TouchableOpacity style={s.photoBtn} onPress={takePhoto} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="camera" size={17} color={C.indigo} style={{ marginRight: 6 }} />
                  <Text style={s.photoBtnText}>Camara</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.photoBtn} onPress={pickPhoto} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="image-outline" size={17} color={C.indigo} style={{ marginRight: 6 }} />
                  <Text style={s.photoBtnText}>Galeria</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>

        <View style={s.navRow}>
          {step > 0 && (
            <TouchableOpacity style={s.backBtn} onPress={goBack}>
              <MaterialCommunityIcons name="arrow-left" size={17} color={C.muted} style={{ marginRight: 4 }} />
              <Text style={s.backBtnText}>Atras</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={[s.primaryBtn, !canContinue() && s.primaryBtnDisabled]}
            onPress={step < TOTAL_STEPS ? goNext : finish}
            disabled={!canContinue()}
          >
            <Text style={s.primaryBtnText}>{step < TOTAL_STEPS ? "Continuar" : "Empezar!"}</Text>
            <MaterialCommunityIcons name={step < TOTAL_STEPS ? "arrow-right" : "check"} size={17} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        <View style={s.dotsRow}>
          {[...Array(TOTAL_STEPS+1)].map((_,i) => (
            <View key={i} style={[s.dot, i===step && s.dotActive]} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 24, paddingBottom: 32, flexGrow: 1 },
  logoSection: { alignItems: "center", paddingTop: 24, paddingBottom: 24 },
  logoCircle: { width: 64, height: 64, borderRadius: 20, backgroundColor: C.indigo, alignItems: "center", justifyContent: "center", marginBottom: 12, shadowColor: C.indigo, shadowOffset: {width:0,height:4}, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6 },
  logoTitle: { fontFamily: "Inter_800ExtraBold", fontSize: 26, color: C.text, marginBottom: 6, letterSpacing: -0.5 },
  logoTagline: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.muted, textAlign: "center", lineHeight: 21, marginBottom: 12 },
  badge: { flexDirection: "row", alignItems: "center", backgroundColor: C.indigoLight, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  badgeText: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.indigo },
  progressSection: { marginBottom: 20 },
  progressTrack: { height: 6, backgroundColor: C.border, borderRadius: 3, overflow: "hidden", marginBottom: 6 },
  progressFill: { height: "100%", backgroundColor: C.indigo, borderRadius: 3 },
  progressLabel: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.muted, textAlign: "right" },
  card: { backgroundColor: C.card, borderRadius: 20, padding: 24, marginBottom: 24, shadowColor: C.shadow, shadowOffset:{width:0,height:2}, shadowOpacity:0.08, shadowRadius:12, elevation:3 },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text, marginBottom: 6, letterSpacing: -0.3 },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.muted, marginBottom: 24, lineHeight: 21 },
  speciesRow: { flexDirection: "row", gap: 16 },
  speciesCard: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 28, backgroundColor: C.bg, borderRadius: 16, borderWidth: 2, borderColor: C.border },
  speciesCardActive: { backgroundColor: C.indigoLight, borderColor: C.indigo },
  speciesLabel: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.muted, marginTop: 8 },
  speciesLabelActive: { color: C.indigo },
  fieldLabel: { fontFamily: "Inter_700Bold", fontSize: 13, color: C.text, marginBottom: 8 },
  input: { backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.inputBorder, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontFamily: "Inter_500Medium", fontSize: 16, color: C.text },
  skipNote: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.muted, marginTop: 10 },
  photoArea: { alignItems: "center", marginBottom: 20 },
  photoPlaceholder: { width: 160, height: 160, borderRadius: 80, backgroundColor: C.indigoLight, borderWidth: 2, borderColor: C.border, borderStyle: "dashed", alignItems: "center", justifyContent: "center", padding: 16 },
  cameraCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: C.card, alignItems: "center", justifyContent: "center", marginBottom: 10, shadowColor: C.shadow, shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:6, elevation:2 },
  photoHint: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.indigo, textAlign: "center" },
  photoSubHint: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.muted, marginTop: 3, textAlign: "center" },
  photoPreview: { width: 160, height: 160, borderRadius: 80, borderWidth: 3, borderColor: C.indigo },
  photoEditOverlay: { position: "absolute", bottom: 6, right: 6, width: 32, height: 32, borderRadius: 16, backgroundColor: C.indigo, alignItems: "center", justifyContent: "center" },
  photoActions: { flexDirection: "row", gap: 12, justifyContent: "center" },
  photoBtn: { flexDirection: "row", alignItems: "center", backgroundColor: C.indigoLight, borderRadius: 24, paddingHorizontal: 18, paddingVertical: 10 },
  photoBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.indigo },
  navRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 12 },
  backBtnText: { fontFamily: "Inter_500Medium", fontSize: 15, color: C.muted },
  primaryBtn: { flexDirection: "row", alignItems: "center", backgroundColor: C.indigo, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14, shadowColor: C.indigo, shadowOffset:{width:0,height:4}, shadowOpacity:0.3, shadowRadius:10, elevation:5 },
  primaryBtnDisabled: { backgroundColor: "#CBD5E1", shadowOpacity: 0 },
  primaryBtnText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
  dotsRow: { flexDirection: "row", justifyContent: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.border },
  dotActive: { width: 24, backgroundColor: C.indigo },
});
'@

Write-Host "OnboardingScreen.js instalado" -ForegroundColor Green

# ── HomeScreen.js ─────────────────────────────────────────────
Set-Content -Path "$base\src\screens\HomeScreen.js" -Encoding UTF8 -Value @'
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Animated, Dimensions, Image, StatusBar, Modal, ActivityIndicator, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useApp } from "../context/AppContext";
import { analyzeSound } from "../services/aiService";

const { width: SCREEN_W } = Dimensions.get("window");
const BTN_SIZE = 96;
const C = {
  bg:"#F8FAFC", card:"#FFFFFF", indigo:"#4F46E5", indigoLight:"#EEF2FF",
  coral:"#FF8A65", coralDark:"#F4511E", text:"#1E293B", muted:"#64748B",
  border:"#E2E8F0", shadow:"#94A3B8",
};
const POSTURES_CAT = [
  {key:"relajado",label:"Relajado",icon:"cat"},
  {key:"alerta",label:"Alerta",icon:"eye-outline"},
  {key:"arqueado",label:"Arqueado",icon:"arrow-up-bold"},
  {key:"sentado",label:"Sentado",icon:"seat"},
  {key:"tumbado",label:"Tumbado",icon:"sleep"},
  {key:"jugueton",label:"Jugueton",icon:"run-fast"},
];
const POSTURES_DOG = [
  {key:"relajado",label:"Relajado",icon:"dog"},
  {key:"alerta",label:"Alerta",icon:"eye-outline"},
  {key:"sentado",label:"Sentado",icon:"seat"},
  {key:"tumbado",label:"Tumbado",icon:"sleep"},
  {key:"jugueton",label:"Jugueton",icon:"run-fast"},
  {key:"sumiso",label:"Sumiso",icon:"paw-outline"},
];
const ENVIRONMENTS = [
  {key:"llegada",label:"Llegada a casa",icon:"home-heart"},
  {key:"comida",label:"Hora de comida",icon:"food-variant"},
  {key:"extrano",label:"Extranos / ruido",icon:"account-alert"},
  {key:"juego",label:"Sesion de juego",icon:"toy-brick"},
  {key:"descanso",label:"Hora de descanso",icon:"moon-waning-crescent"},
];

function WaveRing({ delay, isRecording }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let anim;
    if (isRecording) {
      opacity.setValue(0.45);
      anim = Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale,   { toValue: 2.8, duration: 1400, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0,   duration: 1400, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale,   { toValue: 1,    duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.45, duration: 0, useNativeDriver: true }),
        ]),
      ]));
      anim.start();
    } else { scale.setValue(1); opacity.setValue(0); }
    return () => anim?.stop();
  }, [isRecording, delay]);
  return <Animated.View pointerEvents="none" style={[s.wave, { opacity, transform:[{scale}] }]} />;
}

function EnvDropdown({ visible, onClose, selected, onSelect }) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={s.dropOverlay} activeOpacity={1} onPress={onClose}>
        <View style={s.dropSheet}>
          <Text style={s.dropTitle}>Contexto / Estimulo</Text>
          {ENVIRONMENTS.map(env => (
            <TouchableOpacity key={env.key} style={[s.dropItem, selected===env.key && s.dropItemSel]}
              onPress={() => { onSelect(env.key); onClose(); }}>
              <MaterialCommunityIcons name={env.icon} size={20} color={selected===env.key ? C.indigo : C.muted} style={{marginRight:12}} />
              <Text style={[s.dropItemText, selected===env.key && s.dropItemTextSel]}>{env.label}</Text>
              {selected===env.key && <MaterialCommunityIcons name="check" size={18} color={C.indigo} style={{marginLeft:"auto"}} />}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default function HomeScreen({ navigation }) {
  const { pet, canRecord, remaining, setLastPosture, setLastEnvironment, setLastAnalysisAudio, saveResult } = useApp();
  const species = pet?.species || "dog";
  const postures = species === "cat" ? POSTURES_CAT : POSTURES_DOG;
  const [posture, setPosture] = useState(postures[0].key);
  const [environment, setEnvironment] = useState("llegada");
  const [envDropOpen, setEnvDropOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recordingObj, setRecordingObj] = useState(null);
  const dimAnim = useRef(new Animated.Value(0)).current;
  const selectedEnv = ENVIRONMENTS.find(e => e.key === environment) || ENVIRONMENTS[0];
  const petInitial = pet?.name ? pet.name[0].toUpperCase() : "?";

  useEffect(() => {
    Animated.timing(dimAnim, { toValue: isRecording ? 0.1 : 0, duration: 300, useNativeDriver: true }).start();
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    if (!canRecord) return;
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecordingObj(recording);
      setIsRecording(true);
    } catch (e) { console.warn("startRecording:", e); }
  }, [canRecord]);

  const stopAndAnalyze = useCallback(async () => {
    if (!recordingObj) return;
    setIsRecording(false);
    setLoading(true);
    try {
      await recordingObj.stopAndUnloadAsync();
      const uri = recordingObj.getURI();
      setLastAnalysisAudio(uri);
      setRecordingObj(null);
      setLastPosture(posture);
      setLastEnvironment(environment);
      navigation.navigate("Loading", { posture, environment });
      const result = await analyzeSound(pet?.species||"dog", pet?.name||"Tu mascota", posture, environment);
      saveResult(result);
    } catch (e) { console.warn("analyze:", e); setLoading(false); }
  }, [recordingObj, posture, environment, pet, navigation]);

  const handlePress = useCallback(() => {
    if (loading) return;
    isRecording ? stopAndAnalyze() : startRecording();
  }, [isRecording, loading, startRecording, stopAndAnalyze]);

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: "#000", opacity: dimAnim }]} />
      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={s.header}>
          <View style={s.headerLeft}>
            <View style={s.logoMark}><MaterialCommunityIcons name="waveform" size={16} color="#fff" /></View>
            <Text style={s.appLabel}>PetVoice AI</Text>
          </View>
          <View style={s.headerRight}>
            {pet?.photo
              ? <Image source={{ uri: pet.photo }} style={s.petAvatar} />
              : <View style={[s.petAvatar, s.petAvatarFb]}><Text style={s.petAvatarLetter}>{petInitial}</Text></View>}
            <TouchableOpacity style={s.upgradeBtn}>
              <MaterialCommunityIcons name="crown-outline" size={13} color={C.indigo} />
              <Text style={s.upgradeBtnText}>Pro</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.statusCard}>
          <View style={{flex:1}}>
            <Text style={s.petName}>{pet?.name || "Tu Mascota"}</Text>
            <Text style={s.petBreed}>{species==="cat"?"Gato":"Perro"}{pet?.age ? ` · ${pet.age} anos` : ""}</Text>
          </View>
          <View style={[s.limitBadge, !canRecord && s.limitBadgeWarn]}>
            <MaterialCommunityIcons name="microphone" size={13} color={canRecord ? C.indigo : "#DC2626"} />
            <Text style={[s.limitText, !canRecord && s.limitTextWarn]}>
              {canRecord ? `${remaining} restantes` : "Limite alcanzado"}
            </Text>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionLabel}>Postura corporal</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsRow}>
            {postures.map(p => {
              const active = posture === p.key;
              return (
                <TouchableOpacity key={p.key} style={[s.chip, active && s.chipActive]} onPress={() => setPosture(p.key)} activeOpacity={0.75}>
                  <MaterialCommunityIcons name={p.icon} size={17} color={active ? C.indigo : C.muted} style={{marginRight:6}} />
                  <Text style={[s.chipText, active && s.chipTextActive]}>{p.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={s.section}>
          <Text style={s.sectionLabel}>Contexto / Estimulo</Text>
          <TouchableOpacity style={s.envSelector} onPress={() => setEnvDropOpen(true)} activeOpacity={0.8}>
            <View style={{flexDirection:"row",alignItems:"center"}}>
              <MaterialCommunityIcons name={selectedEnv.icon} size={20} color={C.indigo} style={{marginRight:10}} />
              <Text style={s.envText}>{selectedEnv.label}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-down" size={20} color={C.muted} />
          </TouchableOpacity>
        </View>

        <View style={s.recordSection}>
          <Text style={s.recordHint}>
            {isRecording ? "Grabando... presiona para analizar"
              : canRecord ? "Presiona y manten para grabar"
              : "Actualiza a Pro para mas analisis"}
          </Text>
          <View style={s.btnOuter}>
            {[0,1,2].map(i => <WaveRing key={i} delay={i*380} isRecording={isRecording} />)}
            <TouchableOpacity
              style={[s.recordBtn, isRecording&&s.recordBtnActive, !canRecord&&s.recordBtnDisabled, loading&&s.recordBtnLoading]}
              onPress={handlePress} disabled={loading || !canRecord} activeOpacity={0.85}>
              {loading
                ? <ActivityIndicator size="large" color="#fff" />
                : <MaterialCommunityIcons name={isRecording?"stop":"microphone"} size={40} color="#fff" />}
            </TouchableOpacity>
          </View>
          {isRecording && (
            <View style={{flexDirection:"row",alignItems:"center",gap:8,marginTop:20}}>
              <View style={s.recDot} />
              <Text style={s.recText}>REC</Text>
            </View>
          )}
        </View>

        <View style={s.tip}>
          <MaterialCommunityIcons name="lightbulb-outline" size={18} color={C.indigo} style={{marginRight:8}} />
          <Text style={s.tipText}>Graba 3-10 segundos de forma natural. Mas contexto = traduccion mas precisa.</Text>
        </View>
      </ScrollView>
      <EnvDropdown visible={envDropOpen} onClose={() => setEnvDropOpen(false)} selected={environment} onSelect={setEnvironment} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg}, scroll:{flex:1}, scrollContent:{paddingBottom:40},
  header:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:20,paddingVertical:14},
  headerLeft:{flexDirection:"row",alignItems:"center",gap:8},
  logoMark:{width:30,height:30,borderRadius:8,backgroundColor:C.indigo,alignItems:"center",justifyContent:"center"},
  appLabel:{fontFamily:"Inter_700Bold",fontSize:17,color:C.text},
  headerRight:{flexDirection:"row",alignItems:"center",gap:10},
  petAvatar:{width:36,height:36,borderRadius:18,backgroundColor:C.indigoLight},
  petAvatarFb:{alignItems:"center",justifyContent:"center"},
  petAvatarLetter:{fontFamily:"Inter_700Bold",fontSize:16,color:C.indigo},
  upgradeBtn:{flexDirection:"row",alignItems:"center",gap:4,backgroundColor:C.indigoLight,borderRadius:20,paddingHorizontal:10,paddingVertical:5},
  upgradeBtnText:{fontFamily:"Inter_700Bold",fontSize:12,color:C.indigo},
  statusCard:{marginHorizontal:20,marginBottom:20,backgroundColor:C.card,borderRadius:16,padding:16,flexDirection:"row",alignItems:"center",shadowColor:C.shadow,shadowOffset:{width:0,height:2},shadowOpacity:0.08,shadowRadius:8,elevation:3},
  petName:{fontFamily:"Inter_800ExtraBold",fontSize:18,color:C.text,marginBottom:2},
  petBreed:{fontFamily:"Inter_400Regular",fontSize:13,color:C.muted},
  limitBadge:{flexDirection:"row",alignItems:"center",gap:5,backgroundColor:C.indigoLight,borderRadius:20,paddingHorizontal:10,paddingVertical:5},
  limitBadgeWarn:{backgroundColor:"#FEE2E2"},
  limitText:{fontFamily:"Inter_600SemiBold",fontSize:12,color:C.indigo},
  limitTextWarn:{color:"#DC2626"},
  section:{marginHorizontal:20,marginBottom:20},
  sectionLabel:{fontFamily:"Inter_600SemiBold",fontSize:12,color:C.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:0.5},
  chipsRow:{paddingRight:4,gap:8,flexDirection:"row"},
  chip:{flexDirection:"row",alignItems:"center",backgroundColor:C.card,borderRadius:24,paddingHorizontal:13,paddingVertical:8,borderWidth:1.5,borderColor:C.border,shadowColor:C.shadow,shadowOffset:{width:0,height:1},shadowOpacity:0.06,shadowRadius:3,elevation:1},
  chipActive:{backgroundColor:C.indigoLight,borderColor:C.indigo},
  chipText:{fontFamily:"Inter_500Medium",fontSize:13,color:C.muted},
  chipTextActive:{color:C.indigo,fontFamily:"Inter_600SemiBold"},
  envSelector:{backgroundColor:C.card,borderRadius:14,paddingHorizontal:16,paddingVertical:14,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderWidth:1.5,borderColor:C.border,shadowColor:C.shadow,shadowOffset:{width:0,height:1},shadowOpacity:0.06,shadowRadius:3,elevation:1},
  envText:{fontFamily:"Inter_500Medium",fontSize:15,color:C.text},
  recordSection:{alignItems:"center",paddingVertical:24,marginBottom:8},
  recordHint:{fontFamily:"Inter_400Regular",fontSize:14,color:C.muted,marginBottom:28},
  btnOuter:{width:BTN_SIZE*3,height:BTN_SIZE*3,alignItems:"center",justifyContent:"center"},
  wave:{position:"absolute",width:BTN_SIZE,height:BTN_SIZE,borderRadius:BTN_SIZE/2,backgroundColor:C.coral},
  recordBtn:{width:BTN_SIZE,height:BTN_SIZE,borderRadius:BTN_SIZE/2,backgroundColor:C.coral,alignItems:"center",justifyContent:"center",shadowColor:C.coral,shadowOffset:{width:0,height:4},shadowOpacity:0.45,shadowRadius:14,elevation:8},
  recordBtnActive:{backgroundColor:C.coralDark,shadowOpacity:0.6},
  recordBtnDisabled:{backgroundColor:"#CBD5E1",shadowOpacity:0},
  recordBtnLoading:{backgroundColor:C.indigo},
  recDot:{width:8,height:8,borderRadius:4,backgroundColor:"#EF4444"},
  recText:{fontFamily:"Inter_800ExtraBold",fontSize:13,color:"#EF4444",letterSpacing:2},
  tip:{marginHorizontal:20,backgroundColor:C.indigoLight,borderRadius:14,padding:14,flexDirection:"row",alignItems:"flex-start"},
  tipText:{fontFamily:"Inter_400Regular",fontSize:13,color:C.indigo,flex:1,lineHeight:20},
  dropOverlay:{flex:1,backgroundColor:"rgba(15,23,42,0.45)",justifyContent:"flex-end"},
  dropSheet:{backgroundColor:C.card,borderTopLeftRadius:24,borderTopRightRadius:24,paddingTop:20,paddingBottom:Platform.OS==="ios"?36:24,paddingHorizontal:20,shadowColor:"#000",shadowOffset:{width:0,height:-4},shadowOpacity:0.12,shadowRadius:16,elevation:12},
  dropTitle:{fontFamily:"Inter_700Bold",fontSize:16,color:C.text,marginBottom:16},
  dropItem:{flexDirection:"row",alignItems:"center",paddingVertical:14,borderBottomWidth:1,borderBottomColor:C.border},
  dropItemSel:{backgroundColor:C.indigoLight,marginHorizontal:-20,paddingHorizontal:20},
  dropItemText:{fontFamily:"Inter_400Regular",fontSize:15,color:C.text},
  dropItemTextSel:{fontFamily:"Inter_600SemiBold",color:C.indigo},
});
'@

Write-Host "HomeScreen.js instalado" -ForegroundColor Green

# ── LoadingScreen.js ──────────────────────────────────────────
Set-Content -Path "$base\src\screens\LoadingScreen.js" -Encoding UTF8 -Value @'
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";

const { width: W } = Dimensions.get("window");
const BAR_COUNT = 40;
const MESSAGES = [
  "Extrayendo frecuencia fundamental (F0)...",
  "Analizando variaciones de tono y ritmo...",
  "Detectando patrones de vocalizacion...",
  "Cruzando datos con postura corporal...",
  "Generando traduccion personalizada...",
];
const C = { bg:"#0F172A", indigo:"#6366F1", coral:"#FF8A65", text:"#F1F5F9", muted:"#94A3B8", card:"#1E293B" };

function Bar({ index, total }) {
  const anim = useRef(new Animated.Value(0.15)).current;
  useEffect(() => {
    const d = 400 + Math.random()*300;
    const loop = Animated.loop(Animated.sequence([
      Animated.delay((index/total)*300),
      Animated.timing(anim, { toValue: 0.2+Math.random()*0.8, duration: d, useNativeDriver: false }),
      Animated.timing(anim, { toValue: 0.1+Math.random()*0.3, duration: d*0.7, useNativeDriver: false }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [index]);
  const barH = anim.interpolate({ inputRange:[0,1], outputRange:[3,64] });
  const color = index > total*0.6 ? C.coral : index > total*0.35 ? C.indigo : "#60A5FA";
  return <Animated.View style={{ width: Math.floor((W-48-(BAR_COUNT-1)*2)/BAR_COUNT), borderRadius:2, backgroundColor:color, height:barH, opacity:anim }} />;
}

export default function LoadingScreen({ navigation }) {
  const { analysisResult } = useApp();
  const [msgIndex, setMsgIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const navigated = useRef(false);

  useEffect(() => {
    Animated.timing(progress, { toValue:1, duration:3800, useNativeDriver:false }).start();
  }, []);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      Animated.sequence([
        Animated.timing(fade, {toValue:0,duration:150,useNativeDriver:true}),
        Animated.timing(fade, {toValue:1,duration:200,useNativeDriver:true}),
      ]).start();
      i++;
      if (i < MESSAGES.length) setMsgIndex(i);
      else clearInterval(iv);
    }, 800);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!navigated.current) { navigated.current = true; navigation.replace("Result"); }
    }, 4200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (analysisResult && !navigated.current) {
      const t = setTimeout(() => { navigated.current = true; navigation.replace("Result"); }, 1800);
      return () => clearTimeout(t);
    }
  }, [analysisResult]);

  const barW = progress.interpolate({ inputRange:[0,1], outputRange:["0%","100%"] });

  return (
    <SafeAreaView style={s.safe} edges={["top","bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={s.container}>
        <View style={{flexDirection:"row",alignItems:"center",gap:10,marginBottom:40}}>
          <View style={{width:10,height:10,borderRadius:5,backgroundColor:C.coral}} />
          <Text style={s.topLabel}>Analizando...</Text>
        </View>
        <View style={{width:W-48,marginBottom:8}}>
          <View style={{flexDirection:"row",alignItems:"flex-end",justifyContent:"space-between",height:80}}>
            {[...Array(BAR_COUNT)].map((_,i) => <Bar key={i} index={i} total={BAR_COUNT} />)}
          </View>
          <View style={{height:1,backgroundColor:"#334155",marginTop:0}} />
        </View>
        <View style={{flexDirection:"row",justifyContent:"space-between",width:W-48,marginBottom:36}}>
          {["0 Hz","500 Hz","2 kHz","8 kHz"].map(l => (
            <Text key={l} style={{fontFamily:"Inter_400Regular",fontSize:10,color:C.muted}}>{l}</Text>
          ))}
        </View>
        <View style={{height:44,alignItems:"center",justifyContent:"center",marginBottom:28}}>
          <Animated.Text style={{fontFamily:"Inter_500Medium",fontSize:14,color:"#CBD5E1",textAlign:"center",opacity:fade}}>
            {MESSAGES[msgIndex]}
          </Animated.Text>
        </View>
        <View style={{width:W-48,height:4,backgroundColor:C.card,borderRadius:2,overflow:"hidden",marginBottom:24}}>
          <Animated.View style={{height:"100%",borderRadius:2,backgroundColor:C.indigo,width:barW}} />
        </View>
        <View style={{borderWidth:1,borderColor:"#334155",borderRadius:20,paddingHorizontal:14,paddingVertical:6}}>
          <Text style={{fontFamily:"Inter_400Regular",fontSize:11,color:C.muted,letterSpacing:0.2}}>
            Modelo de etologia computacional · Analisis multimodal
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg},
  container:{flex:1,alignItems:"center",justifyContent:"center",paddingHorizontal:24},
  topLabel:{fontFamily:"Inter_700Bold",fontSize:22,color:C.text,letterSpacing:-0.3},
});
'@

Write-Host "LoadingScreen.js instalado" -ForegroundColor Green

# ── ResultScreen.js ───────────────────────────────────────────
Set-Content -Path "$base\src\screens\ResultScreen.js" -Encoding UTF8 -Value @'
import React, { useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Animated, ScrollView, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";

const C = { bg:"#F8FAFC", card:"#FFFFFF", indigo:"#4F46E5", indigoLight:"#EEF2FF", text:"#1E293B", muted:"#64748B", border:"#E2E8F0", shadow:"#94A3B8" };
const EMO = {
  Feliz:      {bg:"#ECFDF5",text:"#065F46",bar:"#10B981",icon:"emoticon-happy-outline"},
  Jugueton:   {bg:"#ECFDF5",text:"#065F46",bar:"#10B981",icon:"emoticon-excited-outline"},
  Alerta:     {bg:"#FFFBEB",text:"#92400E",bar:"#F59E0B",icon:"alert-circle-outline"},
  Curioso:    {bg:"#FFFBEB",text:"#92400E",bar:"#FBBF24",icon:"help-circle-outline"},
  Estresado:  {bg:"#FEF2F2",text:"#991B1B",bar:"#EF4444",icon:"emoticon-sad-outline"},
  Asustado:   {bg:"#FEF2F2",text:"#991B1B",bar:"#DC2626",icon:"shield-alert-outline"},
  Tranquilo:  {bg:"#F0F9FF",text:"#0C4A6E",bar:"#64748B",icon:"sleep"},
  Hambriento: {bg:"#FFF7ED",text:"#9A3412",bar:"#F97316",icon:"food-outline"},
};

function Bar({ pct, color }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: pct/100, tension:60, friction:8, useNativeDriver:false }).start();
  }, [pct]);
  return (
    <View style={s.barTrack}>
      <Animated.View style={[s.barFill, { width: anim.interpolate({inputRange:[0,1],outputRange:["0%","100%"]}), backgroundColor: color }]} />
    </View>
  );
}

export default function ResultScreen({ navigation }) {
  const { pet, analysisResult } = useApp();
  const cardSlide = useRef(new Animated.Value(40)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardSlide, { toValue:0, tension:80, friction:10, useNativeDriver:true }),
      Animated.timing(cardOpacity, { toValue:1, duration:400, useNativeDriver:true }),
    ]).start();
  }, []);

  const result = analysisResult || {
    emocion_principal:"Feliz", porcentaje_confianza:87,
    traduccion_humana:"Estoy tan contento de verte! Eres mi persona favorita.",
    consejo_propietario:"Refuerza con una caricia o juguete favorito.",
    keyword_publicidad:"bienestar_animal",
  };
  const emo = EMO[result.emocion_principal] || EMO["Tranquilo"];
  const petName = pet?.name || "Tu mascota";

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={s.topBar}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.navigate("Home")}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={C.text} />
          </TouchableOpacity>
          <Text style={s.topBarTitle}>Traduccion</Text>
          <View style={{width:38}} />
        </View>

        <View style={s.avatarSection}>
          {pet?.photo
            ? <Image source={{uri:pet.photo}} style={s.petCircle} />
            : <View style={[s.petCircle, s.petCircleFb]}><Text style={s.petCircleLetter}>{petName[0]?.toUpperCase()||"?"}</Text></View>}
          <Text style={s.petSaysLabel}>{petName} dice:</Text>
        </View>

        <Animated.View style={[s.emoCard, {backgroundColor:emo.bg}, {opacity:cardOpacity,transform:[{translateY:cardSlide}]}]}>
          <View style={{flexDirection:"row",alignItems:"center",gap:10,marginBottom:14}}>
            <MaterialCommunityIcons name={emo.icon} size={32} color={emo.bar} />
            <Text style={[s.emoLabel,{color:emo.bar}]}>{result.emocion_principal}</Text>
          </View>
          <Text style={[s.translation,{color:emo.text}]}>"{result.traduccion_humana}"</Text>
        </Animated.View>

        <View style={s.confCard}>
          <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <Text style={s.confLabel}>Confianza del analisis</Text>
            <Text style={[s.confPct,{color:emo.bar}]}>{result.porcentaje_confianza}%</Text>
          </View>
          <Bar pct={result.porcentaje_confianza} color={emo.bar} />
          <Text style={s.confNote}>Basado en audio, postura corporal y contexto del entorno</Text>
        </View>

        <View style={s.adviceCard}>
          <View style={{flexDirection:"row",alignItems:"center",gap:8,marginBottom:8}}>
            <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color={C.indigo} />
            <Text style={s.adviceTitle}>{petName} tambien te dice:</Text>
          </View>
          <Text style={s.adviceText}>{result.consejo_propietario}</Text>
        </View>

        <View style={s.adBlock}>
          <Text style={s.adLabel}>Patrocinado</Text>
          <View style={{flexDirection:"row",alignItems:"center"}}>
            <MaterialCommunityIcons name="paw" size={24} color={C.indigo} style={{marginRight:12}} />
            <View style={{flex:1}}>
              <Text style={s.adTitle}>Productos para tu mascota</Text>
              <Text style={s.adSub}>
                {result.keyword_publicidad==="veterinario"
                  ? "Consulta online con veterinarios certificados"
                  : "Alimento premium y juguetes recomendados por expertos"}
              </Text>
            </View>
            <MaterialCommunityIcons name="open-in-new" size={16} color={C.muted} />
          </View>
        </View>

        <TouchableOpacity style={s.ctaBtn} onPress={() => navigation.navigate("Home")} activeOpacity={0.85}>
          <MaterialCommunityIcons name="microphone" size={20} color="#fff" style={{marginRight:8}} />
          <Text style={s.ctaBtnText}>Analizar otro sonido</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg}, scroll:{flex:1}, scrollContent:{paddingBottom:40},
  topBar:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:20,paddingVertical:14},
  backBtn:{width:38,height:38,borderRadius:19,backgroundColor:C.card,alignItems:"center",justifyContent:"center",shadowColor:C.shadow,shadowOffset:{width:0,height:1},shadowOpacity:0.08,shadowRadius:4,elevation:2},
  topBarTitle:{fontFamily:"Inter_700Bold",fontSize:17,color:C.text},
  avatarSection:{alignItems:"center",paddingVertical:24},
  petCircle:{width:88,height:88,borderRadius:44,borderWidth:3,borderColor:C.card,shadowColor:C.shadow,shadowOffset:{width:0,height:4},shadowOpacity:0.15,shadowRadius:10,elevation:4},
  petCircleFb:{backgroundColor:C.indigoLight,alignItems:"center",justifyContent:"center"},
  petCircleLetter:{fontFamily:"Inter_800ExtraBold",fontSize:34,color:C.indigo},
  petSaysLabel:{fontFamily:"Inter_600SemiBold",fontSize:16,color:C.muted,marginTop:12},
  emoCard:{marginHorizontal:20,borderRadius:20,padding:24,marginBottom:16,shadowColor:C.shadow,shadowOffset:{width:0,height:4},shadowOpacity:0.1,shadowRadius:12,elevation:4},
  emoLabel:{fontFamily:"Inter_800ExtraBold",fontSize:22,letterSpacing:-0.3},
  translation:{fontFamily:"Inter_500Medium",fontSize:17,lineHeight:26},
  confCard:{marginHorizontal:20,backgroundColor:C.card,borderRadius:16,padding:18,marginBottom:16,shadowColor:C.shadow,shadowOffset:{width:0,height:2},shadowOpacity:0.07,shadowRadius:8,elevation:2},
  confLabel:{fontFamily:"Inter_600SemiBold",fontSize:14,color:C.text},
  confPct:{fontFamily:"Inter_800ExtraBold",fontSize:22},
  barTrack:{height:8,backgroundColor:C.border,borderRadius:4,overflow:"hidden",marginBottom:8},
  barFill:{height:"100%",borderRadius:4},
  confNote:{fontFamily:"Inter_400Regular",fontSize:12,color:C.muted},
  adviceCard:{marginHorizontal:20,backgroundColor:C.indigoLight,borderRadius:16,padding:18,marginBottom:16},
  adviceTitle:{fontFamily:"Inter_700Bold",fontSize:14,color:C.indigo},
  adviceText:{fontFamily:"Inter_400Regular",fontSize:14,color:"#312E81",lineHeight:22},
  adBlock:{marginHorizontal:20,marginBottom:20,borderWidth:1,borderColor:C.border,borderRadius:14,padding:14,backgroundColor:C.card},
  adLabel:{fontFamily:"Inter_400Regular",fontSize:10,color:C.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:0.5},
  adTitle:{fontFamily:"Inter_600SemiBold",fontSize:13,color:C.text,marginBottom:2},
  adSub:{fontFamily:"Inter_400Regular",fontSize:12,color:C.muted},
  ctaBtn:{marginHorizontal:20,backgroundColor:C.indigo,borderRadius:16,paddingVertical:16,flexDirection:"row",alignItems:"center",justifyContent:"center",shadowColor:C.indigo,shadowOffset:{width:0,height:4},shadowOpacity:0.3,shadowRadius:10,elevation:6},
  ctaBtnText:{fontFamily:"Inter_700Bold",fontSize:16,color:"#fff"},
});
'@

Write-Host "ResultScreen.js instalado" -ForegroundColor Green

# ── Verificacion final ────────────────────────────────────────
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Instalacion completada exitosamente!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Archivos instalados:" -ForegroundColor White
Write-Host "  App.js" -ForegroundColor Gray
Write-Host "  src\context\AppContext.js" -ForegroundColor Gray
Write-Host "  src\navigation\AppNavigator.js" -ForegroundColor Gray
Write-Host "  src\screens\OnboardingScreen.js" -ForegroundColor Gray
Write-Host "  src\screens\HomeScreen.js" -ForegroundColor Gray
Write-Host "  src\screens\LoadingScreen.js" -ForegroundColor Gray
Write-Host "  src\screens\ResultScreen.js" -ForegroundColor Gray
Write-Host "  src\services\aiService.js" -ForegroundColor Gray
Write-Host ""
Write-Host "Ahora ejecuta:" -ForegroundColor Yellow
Write-Host "  npx expo start --clear" -ForegroundColor White
Write-Host ""
