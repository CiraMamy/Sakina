import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { base44 } from "../src/api/base44Client";

const { width } = Dimensions.get("window");

const MOODS = [
  { value: 1, emoji: "😔", label: "Très mal" },
  { value: 2, emoji: "😟", label: "Mal" },
  { value: 3, emoji: "😐", label: "Neutre" },
  { value: 4, emoji: "😊", label: "Bien" },
  { value: 5, emoji: "😄", label: "Très bien" },
];

const GOALS = [
  { type: "sleep", emoji: "🌙", title: "Mieux dormir", desc: "Améliorer ma qualité de sommeil" },
  { type: "mood", emoji: "❤️", title: "Stabiliser mon humeur", desc: "Comprendre et gérer mes émotions" },
  { type: "stress", emoji: "🎯", title: "Réduire le stress", desc: "Apprendre à me détendre" },
  { type: "mindfulness", emoji: "✨", title: "Être plus zen", desc: "Pratiquer la pleine conscience" },
];

const FEATURES = [
  { emoji: "💬", title: "Sakina IA", desc: "Discute avec ton assistante empathique 24h/24", color: "#7BA9D8" },
  { emoji: "✨", title: "Coaching personnalisé", desc: "Plans d'action adaptés à tes besoins", color: "#8B5CF6" },
  { emoji: "🌙", title: "Suivi du sommeil", desc: "Comprends l'impact du repos sur ton humeur", color: "#6366F1" },
  { emoji: "👥", title: "Professionnels", desc: "Accède à un réseau de spécialistes", color: "#10B981" },
];

function IntroStep({ onNext }) {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.logoBig}>
        <Text style={{ fontSize: 64 }}>🌸</Text>
      </View>
      <Text style={styles.stepTitle}>Bienvenue sur Sakina</Text>
      <Text style={styles.stepDesc}>
        Ton espace d'écoute bienveillant pour le bien-être mental. Un accompagnement doux, sans jugement, à ton rythme.
      </Text>
      <TouchableOpacity style={styles.btnPrimary} onPress={onNext}>
        <Text style={styles.btnText}>Découvrir Sakina →</Text>
      </TouchableOpacity>
    </View>
  );
}

function FeaturesStep({ onNext }) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tes outils bien-être</Text>
      <Text style={styles.stepSubtitle}>Tout ce dont tu as besoin pour prendre soin de toi</Text>
      <View style={styles.featureList}>
        {FEATURES.map((f, i) => (
          <View key={i} style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: f.color + "20" }]}>
              <Text style={{ fontSize: 24 }}>{f.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.btnPrimary} onPress={onNext}>
        <Text style={styles.btnText}>Continuer →</Text>
      </TouchableOpacity>
    </View>
  );
}

function MoodStep({ onNext }) {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");

  const handleSubmit = async () => {
    if (!selected) return;
    try {
      await base44.entities.MoodEntry.create({
        mood_value: selected,
        mood_label: MOODS.find(m => m.value === selected)?.label,
        note,
        entry_date: new Date().toISOString().split("T")[0],
      });
    } catch (e) {
      console.warn("Mood save error:", e);
    }
    onNext();
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Comment te sens-tu aujourd'hui ?</Text>
      <Text style={styles.stepSubtitle}>Commence ton suivi émotionnel</Text>
      <View style={styles.moodGrid}>
        {MOODS.map((m) => (
          <TouchableOpacity
            key={m.value}
            style={[styles.moodBtn, selected === m.value && styles.moodBtnSelected]}
            onPress={() => setSelected(m.value)}
          >
            <Text style={{ fontSize: 36, marginBottom: 4 }}>{m.emoji}</Text>
            <Text style={[styles.moodLabel, selected === m.value && { color: "#fff" }]}>
              {m.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {selected && (
        <TextInput
          style={styles.noteInput}
          placeholder="Veux-tu ajouter une note ? (optionnel)"
          placeholderTextColor="#9CA3AF"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
        />
      )}
      <TouchableOpacity
        style={[styles.btnPrimary, !selected && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={!selected}
      >
        <Text style={styles.btnText}>Enregistrer →</Text>
      </TouchableOpacity>
    </View>
  );
}

function GoalsStep({ onNext }) {
  const [selected, setSelected] = useState([]);

  const toggle = (type) => {
    setSelected(prev =>
      prev.includes(type) ? prev.filter(g => g !== type) : [...prev, type]
    );
  };

  const handleSubmit = async () => {
    try {
      await Promise.all(
        selected.map(type => {
          const g = GOALS.find(g => g.type === type);
          return base44.entities.UserGoal.create({
            goal_type: type,
            title: g.title,
            description: g.desc,
            target_value: 30,
            is_active: true,
          });
        })
      );
    } catch (e) {
      console.warn("Goals save error:", e);
    }
    onNext();
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tes objectifs</Text>
      <Text style={styles.stepSubtitle}>Qu'aimerais-tu améliorer ? (choix multiple)</Text>
      <View style={{ gap: 12, marginBottom: 24 }}>
        {GOALS.map((g) => {
          const isSelected = selected.includes(g.type);
          return (
            <TouchableOpacity
              key={g.type}
              style={[styles.goalCard, isSelected && styles.goalCardSelected]}
              onPress={() => toggle(g.type)}
            >
              <View style={[styles.goalIcon, isSelected && { backgroundColor: "#8CB8E8" }]}>
                <Text style={{ fontSize: 24 }}>{g.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.goalTitle}>{g.title}</Text>
                <Text style={styles.goalDesc}>{g.desc}</Text>
              </View>
              {isSelected && <Text style={{ color: "#8CB8E8", fontSize: 18 }}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity
        style={[styles.btnPrimary, selected.length === 0 && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={selected.length === 0}
      >
        <Text style={styles.btnText}>Commencer mon voyage →</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onNext} style={{ marginTop: 12 }}>
        <Text style={styles.skipBtn}>Passer cette étape</Text>
      </TouchableOpacity>
    </View>
  );
}

const STEPS = [IntroStep, FeaturesStep, MoodStep, GoalsStep];

export default function Onboarding() {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      router.replace("/(tabs)/");
    }
  };

  const StepComponent = STEPS[step];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <TouchableOpacity style={styles.skipTop} onPress={() => router.replace("/(tabs)/")}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} showsVerticalScrollIndicator={false}>
        <StepComponent onNext={next} />
      </ScrollView>
      {/* Progress dots */}
      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.dotIndicator, i === step && styles.dotIndicatorActive]} />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stepContainer: { paddingHorizontal: 24, paddingVertical: 32, alignItems: "center" },
  logoBig: {
    width: 128, height: 128, borderRadius: 32,
    backgroundColor: "#E8F4FD",
    alignItems: "center", justifyContent: "center",
    marginBottom: 32,
    shadowColor: "#7BA9D8", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 8,
  },
  stepTitle: { fontSize: 28, fontWeight: "700", color: "#2E4057", textAlign: "center", marginBottom: 12 },
  stepSubtitle: { fontSize: 15, color: "#6B7280", textAlign: "center", marginBottom: 24 },
  stepDesc: { fontSize: 16, color: "#6B7280", textAlign: "center", lineHeight: 24, marginBottom: 32, maxWidth: 320 },
  featureList: { gap: 12, marginBottom: 24, width: "100%" },
  featureCard: {
    flexDirection: "row", alignItems: "center", gap: 16,
    backgroundColor: "#FFFFFF", borderRadius: 20, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  featureIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  featureTitle: { fontSize: 15, fontWeight: "700", color: "#2E4057", marginBottom: 2 },
  featureDesc: { fontSize: 12, color: "#6B7280" },
  moodGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20, justifyContent: "center" },
  moodBtn: {
    width: 64, alignItems: "center", padding: 10, borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  moodBtnSelected: { backgroundColor: "#8CB8E8" },
  moodLabel: { fontSize: 10, color: "#6B7280", textAlign: "center", fontWeight: "500" },
  noteInput: {
    width: "100%", backgroundColor: "#FFFFFF", borderRadius: 16,
    padding: 16, fontSize: 14, color: "#2E4057",
    minHeight: 80, textAlignVertical: "top",
    marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  goalCard: {
    flexDirection: "row", alignItems: "center", gap: 16,
    backgroundColor: "#FFFFFF", borderRadius: 20, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  goalCardSelected: { borderWidth: 2, borderColor: "#8CB8E8", backgroundColor: "rgba(140,184,232,0.05)" },
  goalIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" },
  goalTitle: { fontSize: 15, fontWeight: "700", color: "#2E4057", marginBottom: 2 },
  goalDesc: { fontSize: 12, color: "#6B7280" },
  btnPrimary: {
    width: "100%", height: 56, borderRadius: 24,
    backgroundColor: "#8CB8E8",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#8CB8E8", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: "#FFFFFF", fontSize: 17, fontWeight: "600" },
  skipBtn: { color: "#9CA3AF", fontSize: 14, textAlign: "center", marginTop: 4 },
  skipTop: { position: "absolute", top: 56, right: 24, zIndex: 10 },
  skipText: { color: "#9CA3AF", fontSize: 14, fontWeight: "500" },
  dots: { flexDirection: "row", justifyContent: "center", gap: 8, paddingBottom: 24 },
  dotIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#D1D5DB" },
  dotIndicatorActive: { width: 24, backgroundColor: "#8CB8E8" },
});
