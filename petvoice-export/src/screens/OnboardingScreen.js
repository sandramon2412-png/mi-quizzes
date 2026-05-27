import React, { useState, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, ScrollView, Dimensions, Animated, Platform, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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
  inputBorder: "#CBD5E1",
};

const STEPS = ["Especie", "Nombre", "Edad", "Foto", "Listo"];
const TOTAL_STEPS = 4; // 0..3

// ─── OnboardingScreen ─────────────────────────────────────────────────────────
export default function OnboardingScreen({ navigation }) {
  const { savePet } = useApp();

  const [step, setStep] = useState(0);
  const [species, setSpecies] = useState(null); // "dog" | "cat"
  const [petName, setPetName] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petPhoto, setPetPhoto] = useState(null);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: -30, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPetPhoto(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPetPhoto(result.assets[0].uri);
    }
  };

  const finish = () => {
    savePet({ name: petName.trim(), species, age: petAge.trim(), photo: petPhoto });
    navigation.replace("Home");
  };

  const canContinue = () => {
    if (step === 0) return !!species;
    if (step === 1) return petName.trim().length > 0;
    if (step === 2) return true; // age is optional
    if (step === 3) return true; // photo is optional
    return true;
  };

  const progress = step / TOTAL_STEPS;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Logo header ── */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="waveform" size={28} color="#fff" />
          </View>
          <Text style={styles.logoTitle}>PetVoice AI</Text>
          <Text style={styles.logoTagline}>Entiende a tu mascota con inteligencia artificial</Text>
          <View style={styles.scienceBadge}>
            <MaterialCommunityIcons name="flask-outline" size={13} color={C.indigo} style={{ marginRight: 4 }} />
            <Text style={styles.scienceBadgeText}>Etología computacional</Text>
          </View>
        </View>

        {/* ── Progress ── */}
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>Paso {step + 1} de {TOTAL_STEPS + 1}</Text>
        </View>

        {/* ── Step content ── */}
        <Animated.View style={[styles.stepCard, { transform: [{ translateX: slideAnim }] }]}>

          {step === 0 && (
            <View>
              <Text style={styles.stepTitle}>¿Qué tipo de mascota tienes?</Text>
              <Text style={styles.stepSubtitle}>El modelo de análisis se adapta por especie</Text>
              <View style={styles.speciesRow}>
                <TouchableOpacity
                  style={[styles.speciesCard, species === "dog" && styles.speciesCardActive]}
                  onPress={() => setSpecies("dog")}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="dog"
                    size={48}
                    color={species === "dog" ? C.indigo : C.muted}
                  />
                  <Text style={[styles.speciesLabel, species === "dog" && styles.speciesLabelActive]}>
                    Perro
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.speciesCard, species === "cat" && styles.speciesCardActive]}
                  onPress={() => setSpecies("cat")}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="cat"
                    size={48}
                    color={species === "cat" ? C.indigo : C.muted}
                  />
                  <Text style={[styles.speciesLabel, species === "cat" && styles.speciesLabelActive]}>
                    Gato
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step === 1 && (
            <View>
              <Text style={styles.stepTitle}>¿Cómo se llama?</Text>
              <Text style={styles.stepSubtitle}>
                Usaremos el nombre en las traducciones
              </Text>
              <Text style={styles.fieldLabel}>Nombre de tu mascota</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Max, Luna, Pelusa..."
                placeholderTextColor={C.muted}
                value={petName}
                onChangeText={setPetName}
                autoFocus
                maxLength={24}
              />
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.stepTitle}>¿Cuántos años tiene?</Text>
              <Text style={styles.stepSubtitle}>
                Opcional — mejora la precisión del análisis
              </Text>
              <Text style={styles.fieldLabel}>Edad (años)</Text>
              <TextInput
                style={[styles.input, styles.inputSmall]}
                placeholder="Ej: 2"
                placeholderTextColor={C.muted}
                value={petAge}
                onChangeText={setPetAge}
                keyboardType="numeric"
                maxLength={2}
                autoFocus
              />
              <Text style={styles.skipNote}>Puedes dejarlo en blanco y continuar</Text>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={styles.stepTitle}>Agrega una foto</Text>
              <Text style={styles.stepSubtitle}>
                Aparecerá en la pantalla de resultados
              </Text>

              {/* Photo placeholder / preview */}
              <View style={styles.photoArea}>
                {petPhoto ? (
                  <TouchableOpacity onPress={pickPhoto} activeOpacity={0.85}>
                    <Image source={{ uri: petPhoto }} style={styles.photoPreview} />
                    <View style={styles.photoChangeOverlay}>
                      <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <View style={styles.cameraIconCircle}>
                      <MaterialCommunityIcons name="camera-outline" size={32} color={C.indigo} />
                    </View>
                    <Text style={styles.photoHint}>Foto de {petName || "tu mascota"}</Text>
                    <Text style={styles.photoSubHint}>Opcional · JPG o PNG</Text>
                  </View>
                )}
              </View>

              <View style={styles.photoActions}>
                <TouchableOpacity style={styles.photoBtn} onPress={takePhoto} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="camera" size={18} color={C.indigo} style={{ marginRight: 6 }} />
                  <Text style={styles.photoBtnText}>Cámara</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoBtn} onPress={pickPhoto} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="image-outline" size={18} color={C.indigo} style={{ marginRight: 6 }} />
                  <Text style={styles.photoBtnText}>Galería</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </Animated.View>

        {/* ── Navigation buttons ── */}
        <View style={styles.navRow}>
          {step > 0 && (
            <TouchableOpacity style={styles.backBtn} onPress={goBack} activeOpacity={0.8}>
              <MaterialCommunityIcons name="arrow-left" size={18} color={C.muted} style={{ marginRight: 4 }} />
              <Text style={styles.backBtnText}>Atrás</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={[styles.primaryBtn, !canContinue() && styles.primaryBtnDisabled]}
            onPress={step < TOTAL_STEPS ? goNext : finish}
            disabled={!canContinue()}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>
              {step < TOTAL_STEPS ? "Continuar" : "¡Empezar!"}
            </Text>
            <MaterialCommunityIcons
              name={step < TOTAL_STEPS ? "arrow-right" : "check"}
              size={18}
              color="#fff"
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        </View>

        {/* ── Step dots ── */}
        <View style={styles.dotsRow}>
          {[...Array(TOTAL_STEPS + 1)].map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 32, flexGrow: 1 },

  // Logo section
  logoSection: { alignItems: "center", paddingTop: 24, paddingBottom: 24 },
  logoCircle: {
    width: 64, height: 64, borderRadius: 20, backgroundColor: C.indigo,
    alignItems: "center", justifyContent: "center", marginBottom: 12,
    shadowColor: C.indigo, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
  },
  logoTitle: {
    fontFamily: "Inter_800ExtraBold", fontSize: 26, color: C.text,
    marginBottom: 6, letterSpacing: -0.5,
  },
  logoTagline: {
    fontFamily: "Inter_400Regular", fontSize: 14, color: C.muted,
    textAlign: "center", lineHeight: 21, marginBottom: 12,
  },
  scienceBadge: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.indigoLight, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  scienceBadgeText: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.indigo },

  // Progress
  progressSection: { marginBottom: 20 },
  progressTrack: {
    height: 6, backgroundColor: C.border, borderRadius: 3, overflow: "hidden", marginBottom: 6,
  },
  progressFill: {
    height: "100%", backgroundColor: C.indigo, borderRadius: 3,
  },
  progressLabel: {
    fontFamily: "Inter_500Medium", fontSize: 12, color: C.muted, textAlign: "right",
  },

  // Step card
  stepCard: {
    backgroundColor: C.card, borderRadius: 20, padding: 24, marginBottom: 24,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
  },
  stepTitle: {
    fontFamily: "Inter_700Bold", fontSize: 20, color: C.text,
    marginBottom: 6, letterSpacing: -0.3,
  },
  stepSubtitle: {
    fontFamily: "Inter_400Regular", fontSize: 14, color: C.muted, marginBottom: 24, lineHeight: 21,
  },

  // Species selector
  speciesRow: { flexDirection: "row", gap: 16 },
  speciesCard: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingVertical: 24, backgroundColor: C.bg, borderRadius: 16,
    borderWidth: 2, borderColor: C.border,
  },
  speciesCardActive: {
    backgroundColor: C.indigoLight, borderColor: C.indigo,
  },
  speciesLabel: {
    fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.muted, marginTop: 8,
  },
  speciesLabelActive: { color: C.indigo },

  // Text input
  fieldLabel: {
    fontFamily: "Inter_700Bold", fontSize: 13, color: C.text, marginBottom: 8,
  },
  input: {
    backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.inputBorder,
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    fontFamily: "Inter_500Medium", fontSize: 16, color: C.text,
  },
  inputSmall: { width: 120 },
  skipNote: {
    fontFamily: "Inter_400Regular", fontSize: 12, color: C.muted, marginTop: 10,
  },

  // Photo
  photoArea: { alignItems: "center", marginBottom: 20 },
  photoPlaceholder: {
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: C.indigoLight, borderWidth: 2, borderColor: C.border,
    borderStyle: "dashed",
    alignItems: "center", justifyContent: "center",
    padding: 16,
  },
  cameraIconCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: C.card, alignItems: "center", justifyContent: "center",
    marginBottom: 10,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 2,
  },
  photoHint: {
    fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.indigo,
    textAlign: "center",
  },
  photoSubHint: {
    fontFamily: "Inter_400Regular", fontSize: 11, color: C.muted,
    marginTop: 3, textAlign: "center",
  },
  photoPreview: {
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 3, borderColor: C.indigo,
  },
  photoChangeOverlay: {
    position: "absolute", bottom: 6, right: 6,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: C.indigo, alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
  },
  photoActions: { flexDirection: "row", gap: 12, justifyContent: "center" },
  photoBtn: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.indigoLight, borderRadius: 24,
    paddingHorizontal: 18, paddingVertical: 10,
  },
  photoBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.indigo },

  // Navigation
  navRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backBtn: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 8, paddingHorizontal: 12,
  },
  backBtnText: { fontFamily: "Inter_500Medium", fontSize: 15, color: C.muted },
  primaryBtn: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.indigo, borderRadius: 14,
    paddingHorizontal: 24, paddingVertical: 14,
    shadowColor: C.indigo, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  primaryBtnDisabled: { backgroundColor: "#CBD5E1", shadowOpacity: 0 },
  primaryBtnText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },

  // Dots
  dotsRow: { flexDirection: "row", justifyContent: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.border },
  dotActive: { width: 24, backgroundColor: C.indigo },
});
