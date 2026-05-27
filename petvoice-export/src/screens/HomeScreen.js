import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Animated, Dimensions, Image, StatusBar, Modal,
  ActivityIndicator, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useApp } from "../context/AppContext";
import { analyzeSound } from "../services/aiService";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const BTN_SIZE = 96;
const WAVE_COUNT = 3;

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  indigo: "#4F46E5",
  indigoLight: "#EEF2FF",
  coral: "#FF8A65",
  coralDark: "#F4511E",
  text: "#1E293B",
  muted: "#64748B",
  border: "#E2E8F0",
  shadow: "#94A3B8",
};

// ─── Body Posture Data ────────────────────────────────────────────────────────
const POSTURES_CAT = [
  { key: "relajado",   label: "Relajado",   icon: "cat" },
  { key: "alerta",     label: "Alerta",     icon: "eye-outline" },
  { key: "arqueado",   label: "Arqueado",   icon: "arrow-up-bold" },
  { key: "sentado",    label: "Sentado",    icon: "seat" },
  { key: "tumbado",    label: "Tumbado",    icon: "sleep" },
  { key: "jugueton",   label: "Juguetón",   icon: "run-fast" },
];

const POSTURES_DOG = [
  { key: "relajado",   label: "Relajado",   icon: "dog" },
  { key: "alerta",     label: "Alerta",     icon: "eye-outline" },
  { key: "sentado",    label: "Sentado",    icon: "seat" },
  { key: "tumbado",    label: "Tumbado",    icon: "sleep" },
  { key: "jugueton",   label: "Juguetón",   icon: "run-fast" },
  { key: "sumiso",     label: "Sumiso",     icon: "paw-outline" },
];

const ENVIRONMENTS = [
  { key: "llegada",   label: "Llegada a casa",         icon: "home-heart" },
  { key: "comida",    label: "Hora de comida",          icon: "food-variant" },
  { key: "extrano",   label: "Extraños / ruido",        icon: "account-alert" },
  { key: "juego",     label: "Sesión de juego",         icon: "toy-brick" },
  { key: "descanso",  label: "Hora de descanso",        icon: "moon-waning-crescent" },
];

// ─── Wave Ring ────────────────────────────────────────────────────────────────
function WaveRing({ delay, isRecording }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let anim;
    if (isRecording) {
      anim = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, { toValue: 2.8, duration: 1400, useNativeDriver: true }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 1400,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.45, duration: 0, useNativeDriver: true }),
          ]),
        ])
      );
      opacity.setValue(0.45);
      anim.start();
    } else {
      scale.setValue(1);
      opacity.setValue(0);
    }
    return () => anim?.stop();
  }, [isRecording, delay]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wave,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
}

// ─── Environment Dropdown Modal ───────────────────────────────────────────────
function EnvDropdown({ visible, onClose, selected, onSelect }) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.dropOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.dropSheet}>
          <Text style={styles.dropTitle}>Contexto / Estímulo</Text>
          {ENVIRONMENTS.map((env) => (
            <TouchableOpacity
              key={env.key}
              style={[styles.dropItem, selected === env.key && styles.dropItemSelected]}
              onPress={() => { onSelect(env.key); onClose(); }}
            >
              <MaterialCommunityIcons
                name={env.icon}
                size={20}
                color={selected === env.key ? C.indigo : C.muted}
                style={{ marginRight: 12 }}
              />
              <Text style={[styles.dropItemText, selected === env.key && styles.dropItemTextSelected]}>
                {env.label}
              </Text>
              {selected === env.key && (
                <MaterialCommunityIcons name="check" size={18} color={C.indigo} style={{ marginLeft: "auto" }} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
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

  const selectedEnv = ENVIRONMENTS.find((e) => e.key === environment) || ENVIRONMENTS[0];

  // Dim overlay on record
  useEffect(() => {
    Animated.timing(dimAnim, {
      toValue: isRecording ? 0.1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isRecording]);

  // ── Recording ──
  const startRecording = useCallback(async () => {
    if (!canRecord) return;
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecordingObj(recording);
      setIsRecording(true);
    } catch (e) {
      console.warn("startRecording error:", e);
    }
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

      // Run analysis in parallel while loading screen is shown
      const result = await analyzeSound(
        pet?.species || "dog",
        pet?.name || "Tu mascota",
        posture,
        environment,
        "sonido grabado"
      );
      saveResult(result);
    } catch (e) {
      console.warn("analyze error:", e);
      setLoading(false);
    }
  }, [recordingObj, posture, environment, pet, navigation]);

  const handleRecordPress = useCallback(() => {
    if (loading) return;
    if (isRecording) {
      stopAndAnalyze();
    } else {
      startRecording();
    }
  }, [isRecording, loading, startRecording, stopAndAnalyze]);

  const petInitial = pet?.name ? pet.name[0].toUpperCase() : "?";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── Dim overlay ── */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: "#000", opacity: dimAnim }]}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoMark}>
              <MaterialCommunityIcons name="waveform" size={16} color="#fff" />
            </View>
            <Text style={styles.appLabel}>PetVoice AI</Text>
          </View>
          <View style={styles.headerRight}>
            {pet?.photo ? (
              <Image source={{ uri: pet.photo }} style={styles.petAvatar} />
            ) : (
              <View style={[styles.petAvatar, styles.petAvatarFallback]}>
                <Text style={styles.petAvatarLetter}>{petInitial}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.upgradeBtn}>
              <MaterialCommunityIcons name="crown-outline" size={14} color={C.indigo} />
              <Text style={styles.upgradeBtnText}>Pro</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Pet status card ── */}
        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <Text style={styles.petName}>{pet?.name || "Tu Mascota"}</Text>
            <Text style={styles.petBreed}>
              {species === "cat" ? "Gato" : "Perro"}
              {pet?.age ? ` · ${pet.age} años` : ""}
            </Text>
          </View>
          <View style={styles.statusRight}>
            <View style={[styles.limitBadge, !canRecord && styles.limitBadgeWarn]}>
              <MaterialCommunityIcons
                name="microphone"
                size={13}
                color={canRecord ? C.indigo : "#DC2626"}
              />
              <Text style={[styles.limitText, !canRecord && styles.limitTextWarn]}>
                {canRecord ? `${remaining} restantes` : "Límite alcanzado"}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Body Posture Selector ── */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Postura corporal</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {postures.map((p) => {
              const active = posture === p.key;
              return (
                <TouchableOpacity
                  key={p.key}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setPosture(p.key)}
                  activeOpacity={0.75}
                >
                  <MaterialCommunityIcons
                    name={p.icon}
                    size={18}
                    color={active ? C.indigo : C.muted}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Environment Selector ── */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Contexto / Estímulo</Text>
          <TouchableOpacity
            style={styles.envSelector}
            onPress={() => setEnvDropOpen(true)}
            activeOpacity={0.8}
          >
            <View style={styles.envSelectorLeft}>
              <MaterialCommunityIcons
                name={selectedEnv.icon}
                size={20}
                color={C.indigo}
                style={{ marginRight: 10 }}
              />
              <Text style={styles.envSelectorText}>{selectedEnv.label}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-down" size={20} color={C.muted} />
          </TouchableOpacity>
        </View>

        {/* ── Record section ── */}
        <View style={styles.recordSection}>
          <Text style={styles.recordHint}>
            {isRecording
              ? "Grabando… presiona para analizar"
              : canRecord
              ? "Presiona y mantén para grabar"
              : "Actualiza a Pro para más análisis"}
          </Text>

          {/* Waves + button */}
          <View style={styles.btnOuter}>
            {[...Array(WAVE_COUNT)].map((_, i) => (
              <WaveRing key={i} delay={i * 380} isRecording={isRecording} />
            ))}

            <TouchableOpacity
              style={[
                styles.recordBtn,
                isRecording && styles.recordBtnActive,
                !canRecord && styles.recordBtnDisabled,
                loading && styles.recordBtnLoading,
              ]}
              onPress={handleRecordPress}
              disabled={loading || !canRecord}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <MaterialCommunityIcons
                  name={isRecording ? "stop" : "microphone"}
                  size={40}
                  color="#fff"
                />
              )}
            </TouchableOpacity>
          </View>

          {isRecording && (
            <View style={styles.recIndicator}>
              <View style={styles.recDot} />
              <Text style={styles.recText}>REC</Text>
            </View>
          )}
        </View>

        {/* ── Tip ── */}
        <View style={styles.tipCard}>
          <MaterialCommunityIcons name="lightbulb-outline" size={18} color={C.indigo} style={{ marginRight: 8 }} />
          <Text style={styles.tipText}>
            Graba 3–10 segundos de forma natural. Cuanto más contexto des, más precisa es la traducción.
          </Text>
        </View>

      </ScrollView>

      <EnvDropdown
        visible={envDropOpen}
        onClose={() => setEnvDropOpen(false)}
        selected={environment}
        onSelect={setEnvironment}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Header
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 14,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoMark: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: C.indigo, alignItems: "center", justifyContent: "center",
  },
  appLabel: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  petAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.indigoLight },
  petAvatarFallback: { alignItems: "center", justifyContent: "center" },
  petAvatarLetter: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.indigo },
  upgradeBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: C.indigoLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  upgradeBtnText: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.indigo },

  // Status card
  statusCard: {
    marginHorizontal: 20, marginBottom: 20,
    backgroundColor: C.card, borderRadius: 16, padding: 16,
    flexDirection: "row", alignItems: "center",
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  statusLeft: { flex: 1 },
  petName: { fontFamily: "Inter_800ExtraBold", fontSize: 18, color: C.text, marginBottom: 2 },
  petBreed: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.muted },
  statusRight: {},
  limitBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: C.indigoLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  limitBadgeWarn: { backgroundColor: "#FEE2E2" },
  limitText: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: C.indigo },
  limitTextWarn: { color: "#DC2626" },

  // Section blocks
  sectionBlock: { marginHorizontal: 20, marginBottom: 20 },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.muted,
    marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5,
  },

  // Posture chips
  chipsRow: { paddingRight: 4, gap: 8, flexDirection: "row" },
  chip: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.card, borderRadius: 24, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1.5, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  chipActive: {
    backgroundColor: C.indigoLight, borderColor: C.indigo,
  },
  chipText: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.muted },
  chipTextActive: { color: C.indigo, fontFamily: "Inter_600SemiBold" },

  // Environment selector
  envSelector: {
    backgroundColor: C.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderWidth: 1.5, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  envSelectorLeft: { flexDirection: "row", alignItems: "center" },
  envSelectorText: { fontFamily: "Inter_500Medium", fontSize: 15, color: C.text },

  // Record section
  recordSection: { alignItems: "center", paddingVertical: 24, marginBottom: 8 },
  recordHint: {
    fontFamily: "Inter_400Regular", fontSize: 14, color: C.muted, marginBottom: 28,
  },
  btnOuter: {
    width: BTN_SIZE * 3, height: BTN_SIZE * 3,
    alignItems: "center", justifyContent: "center",
  },
  wave: {
    position: "absolute",
    width: BTN_SIZE, height: BTN_SIZE, borderRadius: BTN_SIZE / 2,
    backgroundColor: C.coral,
  },
  recordBtn: {
    width: BTN_SIZE, height: BTN_SIZE, borderRadius: BTN_SIZE / 2,
    backgroundColor: C.coral, alignItems: "center", justifyContent: "center",
    shadowColor: C.coral, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45, shadowRadius: 14, elevation: 8,
  },
  recordBtnActive: {
    backgroundColor: C.coralDark,
    shadowOpacity: 0.6,
  },
  recordBtnDisabled: {
    backgroundColor: "#CBD5E1", shadowOpacity: 0,
  },
  recordBtnLoading: {
    backgroundColor: C.indigo,
  },
  recIndicator: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 20 },
  recDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444",
  },
  recText: { fontFamily: "Inter_800ExtraBold", fontSize: 13, color: "#EF4444", letterSpacing: 2 },

  // Tip
  tipCard: {
    marginHorizontal: 20, backgroundColor: C.indigoLight, borderRadius: 14,
    padding: 14, flexDirection: "row", alignItems: "flex-start",
  },
  tipText: {
    fontFamily: "Inter_400Regular", fontSize: 13, color: C.indigo,
    flex: 1, lineHeight: 20,
  },

  // Env dropdown
  dropOverlay: {
    flex: 1, backgroundColor: "rgba(15,23,42,0.45)", justifyContent: "flex-end",
  },
  dropSheet: {
    backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 20, paddingBottom: Platform.OS === "ios" ? 36 : 24, paddingHorizontal: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 12,
  },
  dropTitle: {
    fontFamily: "Inter_700Bold", fontSize: 16, color: C.text, marginBottom: 16,
  },
  dropItem: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  dropItemSelected: { backgroundColor: C.indigoLight, marginHorizontal: -20, paddingHorizontal: 20 },
  dropItemText: { fontFamily: "Inter_400Regular", fontSize: 15, color: C.text },
  dropItemTextSelected: { fontFamily: "Inter_600SemiBold", color: C.indigo },
});
