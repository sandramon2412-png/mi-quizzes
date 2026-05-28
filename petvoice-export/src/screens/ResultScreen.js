import React, { useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Animated, Dimensions, ScrollView, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";

const { width: SCREEN_W } = Dimensions.get("window");

const GLASS = {
  backgroundColor: "rgba(255,255,255,0.92)",
  borderWidth: 1,
  borderColor: "rgba(0,0,0,0.05)",
  shadowColor: "#4F46E5",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 24,
  elevation: 9,
};

const EMOTION_MAP = {
  Feliz:      { grad: ["#D1FAE5", "#A7F3D0"], text: "#065F46", bar: ["#10B981", "#34D399"], icon: "emoticon-happy-outline" },
  Juguetón:   { grad: ["#D1FAE5", "#A7F3D0"], text: "#065F46", bar: ["#10B981", "#34D399"], icon: "emoticon-excited-outline" },
  Alerta:     { grad: ["#FEF3C7", "#FDE68A"], text: "#92400E", bar: ["#F59E0B", "#FBBF24"], icon: "alert-circle-outline" },
  Curioso:    { grad: ["#FEF3C7", "#FDE68A"], text: "#92400E", bar: ["#FBBF24", "#FCD34D"], icon: "help-circle-outline" },
  Estresado:  { grad: ["#FEE2E2", "#FECACA"], text: "#991B1B", bar: ["#EF4444", "#F87171"], icon: "emoticon-sad-outline" },
  Asustado:   { grad: ["#FEE2E2", "#FECACA"], text: "#991B1B", bar: ["#DC2626", "#EF4444"], icon: "shield-alert-outline" },
  Tranquilo:  { grad: ["#E0F2FE", "#BAE6FD"], text: "#0C4A6E", bar: ["#64748B", "#94A3B8"], icon: "sleep" },
  Hambriento: { grad: ["#FFF7ED", "#FED7AA"], text: "#9A3412", bar: ["#F97316", "#FB923C"], icon: "food-outline" },
};

function getEmotionStyle(emocion) {
  return EMOTION_MAP[emocion] || EMOTION_MAP["Tranquilo"];
}

// ─── PressableScale ───────────────────────────────────────────────────────────
function PressableScale({ onPress, style, children, disabled }) {
  const anim = useRef(new Animated.Value(1)).current;
  const cfg = { useNativeDriver: true };
  const press = () => Animated.spring(anim, { toValue: 0.97, tension: 300, friction: 12, ...cfg }).start();
  const release = () => Animated.spring(anim, { toValue: 1, tension: 200, friction: 8, ...cfg }).start();
  return (
    <TouchableOpacity onPressIn={press} onPressOut={release} onPress={onPress} disabled={disabled} activeOpacity={1}>
      <Animated.View style={[style, { transform: [{ scale: anim }] }]}>{children}</Animated.View>
    </TouchableOpacity>
  );
}

// ─── Confidence bar ───────────────────────────────────────────────────────────
function ConfidenceBar({ pct, colors }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: pct / 100, tension: 60, friction: 8, useNativeDriver: false,
    }).start();
  }, [pct]);

  const barWidth = anim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  return (
    <View style={styles.barTrack}>
      <Animated.View style={{ width: barWidth, height: "100%", overflow: "hidden", borderRadius: 5 }}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

// ─── Ad block ─────────────────────────────────────────────────────────────────
function AdBlock({ keyword }) {
  return (
    <View style={styles.adBlock}>
      <Text style={styles.adLabel}>Patrocinado</Text>
      <View style={styles.adInner}>
        <View style={styles.adIconBox}>
          <MaterialCommunityIcons name="paw" size={20} color="#4F46E5" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.adTitle}>Productos para tu mascota</Text>
          <Text style={styles.adSub}>
            {keyword === "veterinario"
              ? "Consulta online con veterinarios certificados"
              : keyword === "comida_mascotas"
              ? "Alimento premium con envío gratis"
              : "Juguetes y accesorios recomendados por expertos"}
          </Text>
        </View>
        <MaterialCommunityIcons name="open-in-new" size={16} color="#94A3B8" />
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
      Animated.spring(cardSlide, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

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
    <LinearGradient colors={["#F8FAFC", "#EEF2FF", "#F5F3FF"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={["#4F46E5", "#7C3AED"]}
                style={styles.backBtnGrad}
              >
                <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.topBarTitle}>Resultado</Text>
            <View style={{ width: 42 }} />
          </View>

          {/* Pet avatar */}
          <View style={styles.avatarSection}>
            <LinearGradient
              colors={["#4F46E5", "#7C3AED"]}
              style={styles.avatarBorder}
            >
              {pet?.photo ? (
                <Image source={{ uri: pet.photo }} style={styles.petCircle} />
              ) : (
                <View style={[styles.petCircle, styles.petCircleFallback]}>
                  <Text style={styles.petCircleLetter}>{petInitial}</Text>
                </View>
              )}
            </LinearGradient>
            <Text style={styles.petSaysLabel}>{petName} dice:</Text>
          </View>

          {/* Emotion card */}
          <Animated.View
            style={[
              styles.emotionCard,
              GLASS,
              { opacity: cardOpacity, transform: [{ translateY: cardSlide }] },
            ]}
          >
            <LinearGradient colors={emo.grad} style={styles.emotionGradTop} />
            <View style={styles.emotionInner}>
              <View style={styles.emotionHeader}>
                <View style={styles.emotionIconBox}>
                  <MaterialCommunityIcons name={emo.icon} size={26} color={emo.bar[0]} />
                </View>
                <Text style={[styles.emotionLabel, { color: emo.bar[0] }]}>
                  {result.emocion_principal}
                </Text>
              </View>
              <Text style={[styles.translationText, { color: emo.text }]}>
                "{result.traduccion_humana}"
              </Text>
            </View>
          </Animated.View>

          {/* Confidence */}
          <View style={[styles.confCard, GLASS]}>
            <View style={styles.confHeader}>
              <Text style={styles.confLabel}>Confianza del análisis</Text>
              <Text style={[styles.confPct, { color: emo.bar[0] }]}>
                {result.porcentaje_confianza}%
              </Text>
            </View>
            <ConfidenceBar pct={result.porcentaje_confianza} colors={emo.bar} />
            <Text style={styles.confNote}>
              Basado en audio, postura corporal y contexto del entorno
            </Text>
          </View>

          {/* Advice */}
          <View style={[styles.adviceCard, GLASS]}>
            <LinearGradient
              colors={["#4F46E5", "#7C3AED"]}
              style={styles.adviceAccent}
            />
            <View style={styles.adviceContent}>
              <View style={styles.adviceHeader}>
                <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color="#4F46E5" />
                <Text style={styles.adviceTitle}>{petName} también te dice:</Text>
              </View>
              <Text style={styles.adviceText}>{result.consejo_propietario}</Text>
            </View>
          </View>

          {/* AdMob */}
          <AdBlock keyword={result.keyword_publicidad} />

          {/* CTA */}
          <PressableScale onPress={() => navigation.navigate("Home")} style={{ marginHorizontal: 20 }}>
            <LinearGradient
              colors={["#4F46E5", "#7C3AED"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaBtn}
            >
              <MaterialCommunityIcons name="microphone" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.ctaBtnText}>Analizar otro sonido</Text>
            </LinearGradient>
          </PressableScale>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 64 },

  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 14,
  },
  backBtnGrad: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#4F46E5", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  topBarTitle: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#1E293B" },

  avatarSection: { alignItems: "center", paddingVertical: 20 },
  avatarBorder: {
    width: 96, height: 96, borderRadius: 48, padding: 3,
    shadowColor: "#4F46E5", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 16, elevation: 8,
  },
  petCircle: { width: "100%", height: "100%", borderRadius: 45 },
  petCircleFallback: {
    backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center",
    borderRadius: 45,
  },
  petCircleLetter: { fontFamily: "Inter_800ExtraBold", fontSize: 34, color: "#4F46E5" },
  petSaysLabel: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#64748B", marginTop: 12 },

  emotionCard: { marginHorizontal: 20, borderRadius: 24, marginBottom: 16, overflow: "hidden" },
  emotionGradTop: { height: 6 },
  emotionInner: { padding: 22 },
  emotionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  emotionIconBox: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: "rgba(79,70,229,0.08)",
    alignItems: "center", justifyContent: "center",
  },
  emotionLabel: { fontFamily: "Inter_800ExtraBold", fontSize: 24, letterSpacing: -0.5 },
  translationText: { fontFamily: "Inter_600SemiBold", fontSize: 18, lineHeight: 29, letterSpacing: 0.1 },

  confCard: { marginHorizontal: 20, borderRadius: 20, padding: 18, marginBottom: 16 },
  confHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 12,
  },
  confLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#1E293B" },
  confPct: { fontFamily: "Inter_800ExtraBold", fontSize: 24, letterSpacing: -0.5 },
  barTrack: {
    height: 10, backgroundColor: "#E2E8F0", borderRadius: 5,
    overflow: "hidden", marginBottom: 10,
  },
  confNote: { fontFamily: "Inter_400Regular", fontSize: 12, color: "#64748B" },

  adviceCard: {
    marginHorizontal: 20, borderRadius: 20, marginBottom: 16,
    flexDirection: "row", overflow: "hidden",
  },
  adviceAccent: { width: 4 },
  adviceContent: { flex: 1, padding: 18 },
  adviceHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  adviceTitle: { fontFamily: "Inter_700Bold", fontSize: 14, color: "#4F46E5" },
  adviceText: { fontFamily: "Inter_400Regular", fontSize: 14, color: "#312E81", lineHeight: 22 },

  adBlock: {
    marginHorizontal: 20, marginBottom: 20,
    borderWidth: 1, borderColor: "rgba(226,232,240,0.8)",
    borderRadius: 18, padding: 14,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  adLabel: {
    fontFamily: "Inter_400Regular", fontSize: 10, color: "#94A3B8",
    marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5,
  },
  adInner: { flexDirection: "row", alignItems: "center" },
  adIconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center",
  },
  adTitle: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#1E293B", marginBottom: 2 },
  adSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: "#64748B" },

  ctaBtn: {
    borderRadius: 18, paddingVertical: 17,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    shadowColor: "#4F46E5", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  ctaBtnText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
});
