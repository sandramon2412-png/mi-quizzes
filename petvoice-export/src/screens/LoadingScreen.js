import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, Animated, Dimensions, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";

const { width: SCREEN_W } = Dimensions.get("window");
const BAR_COUNT = 40;
const MESSAGES = [
  "Extrayendo frecuencia fundamental (F0)...",
  "Analizando variaciones de tono y ritmo...",
  "Detectando patrones de vocalización...",
  "Cruzando datos con postura corporal...",
  "Generando traducción personalizada...",
];
const MSG_INTERVAL = 800; // ms per message (5 × 800 = 4000ms)
const TOTAL_DURATION = 4200; // ms before navigating

const C = {
  bg: "#0F172A",
  card: "#1E293B",
  indigo: "#6366F1",
  indigoGlow: "#4F46E5",
  coral: "#FF8A65",
  text: "#F1F5F9",
  muted: "#94A3B8",
  barBase: "#334155",
};

// ─── Spectrogram bar ──────────────────────────────────────────────────────────
function SpectroBar({ index, total }) {
  const anim = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    const delay = (index / total) * 300;
    const duration = 400 + Math.random() * 300;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 0.2 + Math.random() * 0.8,
          duration,
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0.1 + Math.random() * 0.3,
          duration: duration * 0.7,
          useNativeDriver: false,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [index]);

  const maxHeight = 60;
  const barHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, maxHeight],
  });

  // Color varies across the spectrum
  const isHighFreq = index > total * 0.6;
  const isMidFreq = index > total * 0.35;
  const barColor = isHighFreq ? C.coral : isMidFreq ? C.indigo : "#60A5FA";

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          height: barHeight,
          backgroundColor: barColor,
          opacity: anim,
        },
      ]}
    />
  );
}

// ─── LoadingScreen ────────────────────────────────────────────────────────────
export default function LoadingScreen({ navigation, route }) {
  const { analysisResult } = useApp();
  const [msgIndex, setMsgIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const navigatedRef = useRef(false);

  // Progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: TOTAL_DURATION - 200,
      useNativeDriver: false,
    }).start();
  }, []);

  // Cycle messages
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      current += 1;
      if (current < MESSAGES.length) {
        setMsgIndex(current);
      } else {
        clearInterval(interval);
      }
    }, MSG_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Navigate to results when analysis is ready (or after max duration)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!navigatedRef.current) {
        navigatedRef.current = true;
        navigation.replace("Result");
      }
    }, TOTAL_DURATION);

    return () => clearTimeout(timer);
  }, []);

  // If result arrives before timeout, navigate immediately
  useEffect(() => {
    if (analysisResult && !navigatedRef.current) {
      const minTimer = setTimeout(() => {
        navigatedRef.current = true;
        navigation.replace("Result");
      }, 1800); // minimum 1.8s for UX
      return () => clearTimeout(minTimer);
    }
  }, [analysisResult]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <View style={styles.container}>

        {/* ── Top label ── */}
        <View style={styles.topRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.topLabel}>Analizando...</Text>
        </View>

        {/* ── Spectrogram ── */}
        <View style={styles.spectroWrap}>
          <View style={styles.spectroContainer}>
            {[...Array(BAR_COUNT)].map((_, i) => (
              <SpectroBar key={i} index={i} total={BAR_COUNT} />
            ))}
          </View>
          <View style={styles.spectroAxisLine} />
        </View>

        {/* ── Frequency labels ── */}
        <View style={styles.freqLabels}>
          <Text style={styles.freqLabel}>0 Hz</Text>
          <Text style={styles.freqLabel}>500 Hz</Text>
          <Text style={styles.freqLabel}>2 kHz</Text>
          <Text style={styles.freqLabel}>8 kHz</Text>
        </View>

        {/* ── Sequential message ── */}
        <View style={styles.msgWrap}>
          <Animated.Text style={[styles.msgText, { opacity: fadeAnim }]}>
            {MESSAGES[msgIndex]}
          </Animated.Text>
        </View>

        {/* ── Progress bar ── */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, { width: progressWidth }]}
          />
        </View>

        {/* ── Science badge ── */}
        <View style={styles.scienceBadge}>
          <Text style={styles.scienceText}>
            Modelo de etología computacional · Análisis multimodal
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  container: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingHorizontal: 24,
  },

  // Top row
  topRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 40 },
  pulseDot: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: C.coral,
  },
  topLabel: {
    fontFamily: "Inter_700Bold", fontSize: 22, color: C.text, letterSpacing: -0.3,
  },

  // Spectrogram
  spectroWrap: {
    width: SCREEN_W - 48, marginBottom: 8, position: "relative",
  },
  spectroContainer: {
    flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
    height: 80, width: "100%",
  },
  bar: {
    width: Math.floor((SCREEN_W - 48 - (BAR_COUNT - 1) * 2) / BAR_COUNT),
    borderRadius: 2, minHeight: 3,
  },
  spectroAxisLine: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: 1, backgroundColor: "#334155",
  },

  // Freq labels
  freqLabels: {
    flexDirection: "row", justifyContent: "space-between",
    width: SCREEN_W - 48, marginBottom: 36,
  },
  freqLabel: { fontFamily: "Inter_400Regular", fontSize: 10, color: C.muted },

  // Message
  msgWrap: { height: 44, alignItems: "center", justifyContent: "center", marginBottom: 28 },
  msgText: {
    fontFamily: "Inter_500Medium", fontSize: 14, color: "#CBD5E1",
    textAlign: "center", letterSpacing: 0.1,
  },

  // Progress
  progressTrack: {
    width: SCREEN_W - 48, height: 4, backgroundColor: C.card,
    borderRadius: 2, overflow: "hidden", marginBottom: 24,
  },
  progressFill: {
    height: "100%", borderRadius: 2,
    backgroundColor: C.indigoGlow,
  },

  // Science badge
  scienceBadge: {
    borderWidth: 1, borderColor: "#334155", borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  scienceText: {
    fontFamily: "Inter_400Regular", fontSize: 11, color: C.muted, letterSpacing: 0.2,
  },
});
