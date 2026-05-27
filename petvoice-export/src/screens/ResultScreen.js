import React, { useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Animated, Dimensions, ScrollView, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";

const { width: SCREEN_W } = Dimensions.get("window");

const C = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  indigo: "#4F46E5",
  indigoLight: "#EEF2FF",
  text: "#1E293B",
  muted: "#64748B",
  border: "#E2E8F0",
  shadow: "#94A3B8",
};

// Emotion → color + icon
const EMOTION_MAP = {
  Feliz:      { bg: "#ECFDF5", text: "#065F46", bar: "#10B981", icon: "emoticon-happy-outline",  label: "Feliz" },
  Juguetón:   { bg: "#ECFDF5", text: "#065F46", bar: "#10B981", icon: "emoticon-excited-outline", label: "Juguetón" },
  Alerta:     { bg: "#FFFBEB", text: "#92400E", bar: "#F59E0B", icon: "alert-circle-outline",     label: "Alerta" },
  Curioso:    { bg: "#FFFBEB", text: "#92400E", bar: "#FBBF24", icon: "help-circle-outline",      label: "Curioso" },
  Estresado:  { bg: "#FEF2F2", text: "#991B1B", bar: "#EF4444", icon: "emoticon-sad-outline",     label: "Estresado" },
  Asustado:   { bg: "#FEF2F2", text: "#991B1B", bar: "#DC2626", icon: "shield-alert-outline",     label: "Asustado" },
  Tranquilo:  { bg: "#F0F9FF", text: "#0C4A6E", bar: "#64748B", icon: "sleep",                    label: "Tranquilo" },
  Hambriento: { bg: "#FFF7ED", text: "#9A3412", bar: "#F97316", icon: "food-outline",             label: "Hambriento" },
};

function getEmotionStyle(emocion) {
  return EMOTION_MAP[emocion] || EMOTION_MAP["Tranquilo"];
}

// ─── Confidence bar ───────────────────────────────────────────────────────────
function ConfidenceBar({ pct, color }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: pct / 100,
      tension: 60,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const barWidth = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.barTrack}>
      <Animated.View style={[styles.barFill, { width: barWidth, backgroundColor: color }]} />
    </View>
  );
}

// ─── Admob placeholder ────────────────────────────────────────────────────────
function AdBlock({ keyword }) {
  return (
    <View style={styles.adBlock}>
      <Text style={styles.adLabel}>Patrocinado</Text>
      <View style={styles.adInner}>
        <MaterialCommunityIcons name="paw" size={24} color={C.indigo} style={{ marginRight: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.adTitle}>Productos para tu mascota</Text>
          <Text style={styles.adSub}>
            {keyword === "veterinario"
              ? "Consulta online con veterinarios certificados"
              : keyword === "comida_mascotas"
              ? "Alimento premium con envío gratis"
              : "Juguetes y accesorios recomendados por expertos"}
          </Text>
        </View>
        <MaterialCommunityIcons name="open-in-new" size={16} color={C.muted} />
      </View>
    </View>
  );
}

// ─── ResultScreen ─────────────────────────────────────────────────────────────
export default function ResultScreen({ navigation }) {
  const { pet, analysisResult } = useApp();

  const cardSlide = useRef(new Animated.Value(40)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardSlide, {
        toValue: 0, tension: 80, friction: 10, useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1, duration: 400, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Demo fallback
  const result = analysisResult || {
    emocion_principal: "Feliz",
    porcentaje_confianza: 87,
    traduccion_humana: "¡Estoy tan contento de verte! Eres mi persona favorita.",
    consejo_propietario: "Refuerza este momento con una caricia o juguete favorito.",
    keyword_publicidad: "bienestar_animal",
  };

  const emo = getEmotionStyle(result.emocion_principal);
  const petName = pet?.name || "Tu mascota";
  const petInitial = petName[0]?.toUpperCase() || "?";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Back header ── */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate("Home")}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color={C.text} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Traducción</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* ── Pet avatar + heading ── */}
        <View style={styles.avatarSection}>
          {pet?.photo ? (
            <Image source={{ uri: pet.photo }} style={styles.petCircle} />
          ) : (
            <View style={[styles.petCircle, styles.petCircleFallback]}>
              <Text style={styles.petCircleLetter}>{petInitial}</Text>
            </View>
          )}
          <Text style={styles.petSaysLabel}>{petName} dice:</Text>
        </View>

        {/* ── Animated emotion card ── */}
        <Animated.View
          style={[
            styles.emotionCard,
            { backgroundColor: emo.bg },
            { opacity: cardOpacity, transform: [{ translateY: cardSlide }] },
          ]}
        >
          <View style={styles.emotionHeader}>
            <MaterialCommunityIcons name={emo.icon} size={32} color={emo.bar} />
            <Text style={[styles.emotionLabel, { color: emo.bar }]}>
              {result.emocion_principal}
            </Text>
          </View>

          <Text style={[styles.translationText, { color: emo.text }]}>
            "{result.traduccion_humana}"
          </Text>
        </Animated.View>

        {/* ── Confidence ── */}
        <View style={styles.confCard}>
          <View style={styles.confHeader}>
            <Text style={styles.confLabel}>Confianza del análisis</Text>
            <Text style={[styles.confPct, { color: emo.bar }]}>
              {result.porcentaje_confianza}%
            </Text>
          </View>
          <ConfidenceBar pct={result.porcentaje_confianza} color={emo.bar} />
          <Text style={styles.confNote}>
            Basado en audio, postura corporal y contexto del entorno
          </Text>
        </View>

        {/* ── Advice card ── */}
        <View style={styles.adviceCard}>
          <View style={styles.adviceHeader}>
            <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color={C.indigo} />
            <Text style={styles.adviceTitle}>{petName} también te dice:</Text>
          </View>
          <Text style={styles.adviceText}>{result.consejo_propietario}</Text>
        </View>

        {/* ── AdMob placeholder ── */}
        <AdBlock keyword={result.keyword_publicidad} />

        {/* ── CTA ── */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate("Home")}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="microphone" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.ctaBtnText}>Analizar otro sonido</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Top bar
  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 14,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: C.card, alignItems: "center", justifyContent: "center",
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  topBarTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text },

  // Avatar
  avatarSection: { alignItems: "center", paddingVertical: 24 },
  petCircle: {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 3, borderColor: C.card,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 10, elevation: 4,
  },
  petCircleFallback: {
    backgroundColor: C.indigoLight, alignItems: "center", justifyContent: "center",
  },
  petCircleLetter: { fontFamily: "Inter_800ExtraBold", fontSize: 34, color: C.indigo },
  petSaysLabel: {
    fontFamily: "Inter_600SemiBold", fontSize: 16, color: C.muted, marginTop: 12,
  },

  // Emotion card
  emotionCard: {
    marginHorizontal: 20, borderRadius: 20, padding: 24, marginBottom: 16,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 4,
  },
  emotionHeader: {
    flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14,
  },
  emotionLabel: {
    fontFamily: "Inter_800ExtraBold", fontSize: 22, letterSpacing: -0.3,
  },
  translationText: {
    fontFamily: "Inter_500Medium", fontSize: 17, lineHeight: 26,
    letterSpacing: 0.1,
  },

  // Confidence
  confCard: {
    marginHorizontal: 20, backgroundColor: C.card, borderRadius: 16,
    padding: 18, marginBottom: 16,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  confHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10,
  },
  confLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text },
  confPct: { fontFamily: "Inter_800ExtraBold", fontSize: 22 },
  barTrack: {
    height: 8, backgroundColor: C.border, borderRadius: 4,
    overflow: "hidden", marginBottom: 8,
  },
  barFill: { height: "100%", borderRadius: 4 },
  confNote: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.muted },

  // Advice
  adviceCard: {
    marginHorizontal: 20, backgroundColor: C.indigoLight, borderRadius: 16,
    padding: 18, marginBottom: 16,
  },
  adviceHeader: {
    flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8,
  },
  adviceTitle: { fontFamily: "Inter_700Bold", fontSize: 14, color: C.indigo },
  adviceText: {
    fontFamily: "Inter_400Regular", fontSize: 14, color: "#312E81", lineHeight: 22,
  },

  // AdMob
  adBlock: {
    marginHorizontal: 20, marginBottom: 20,
    borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14,
    backgroundColor: C.card,
  },
  adLabel: {
    fontFamily: "Inter_400Regular", fontSize: 10, color: C.muted,
    marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5,
  },
  adInner: { flexDirection: "row", alignItems: "center" },
  adTitle: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.text, marginBottom: 2 },
  adSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.muted },

  // CTA
  ctaBtn: {
    marginHorizontal: 20, backgroundColor: C.indigo, borderRadius: 16,
    paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center",
    shadowColor: C.indigo, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  ctaBtnText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
});
