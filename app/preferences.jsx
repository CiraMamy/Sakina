import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "../src/api/base44Client";
import { ArrowLeft } from "lucide-react-native";

const TONES = [
  { id: "empathetic", emoji: "💙", label: "Empathique", desc: "Doux et à l'écoute" },
  { id: "motivating", emoji: "⚡", label: "Motivant", desc: "Dynamique et encourageant" },
  { id: "professional", emoji: "🎯", label: "Professionnel", desc: "Structuré et factuel" },
];

const GOAL_OPTIONS = [
  { id: "sleep", emoji: "🌙", label: "Améliorer mon sommeil" },
  { id: "mood", emoji: "❤️", label: "Stabiliser mon humeur" },
  { id: "stress", emoji: "🎯", label: "Réduire le stress" },
  { id: "mindfulness", emoji: "✨", label: "Pleine conscience" },
  { id: "relationships", emoji: "👥", label: "Relations sociales" },
  { id: "addiction", emoji: "💪", label: "Gestion des addictions" },
];

export default function Preferences() {
  const [tone, setTone] = useState("empathetic");
  const [goals, setGoals] = useState([]);
  const [crisisName, setCrisisName] = useState("");
  const [crisisPhone, setCrisisPhone] = useState("");
  const queryClient = useQueryClient();

  const toggleGoal = (id) => setGoals(prev =>
    prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
  );

  const saveMutation = useMutation({
    mutationFn: async () => {
      const goalPromises = goals.map(goalId => {
        const goal = GOAL_OPTIONS.find(g => g.id === goalId);
        return base44.entities.UserGoal.create({
          goal_type: goalId,
          title: goal?.label,
          is_active: true,
        });
      });
      await Promise.all(goalPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userGoals"] });
      Alert.alert("✅ Enregistré !", "Tes préférences ont été sauvegardées.");
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Préférences</Text>
            <Text style={styles.headerSub}>Personnalise ton expérience</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 16, gap: 16 }}>
          {/* Communication tone */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🗣 Style de communication</Text>
            <Text style={styles.cardDesc}>Comment Sakina doit-elle te parler ?</Text>
            <View style={{ gap: 10 }}>
              {TONES.map(t => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.optionCard, tone === t.id && styles.optionCardActive]}
                  onPress={() => setTone(t.id)}
                >
                  <Text style={{ fontSize: 24 }}>{t.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionLabel, tone === t.id && { color: "#7BA9D8" }]}>{t.label}</Text>
                    <Text style={styles.optionDesc}>{t.desc}</Text>
                  </View>
                  {tone === t.id && <Text style={{ fontSize: 18, color: "#7BA9D8" }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Therapy goals */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎯 Objectifs thérapeutiques</Text>
            <Text style={styles.cardDesc}>Quels aspects veux-tu travailler ? (choix multiple)</Text>
            <View style={styles.goalsGrid}>
              {GOAL_OPTIONS.map(g => (
                <TouchableOpacity
                  key={g.id}
                  style={[styles.goalChip, goals.includes(g.id) && styles.goalChipActive]}
                  onPress={() => toggleGoal(g.id)}
                >
                  <Text style={{ fontSize: 18 }}>{g.emoji}</Text>
                  <Text style={[styles.goalChipText, goals.includes(g.id) && { color: "#fff" }]}>
                    {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Crisis contact */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🆘 Contact d'urgence</Text>
            <Text style={styles.cardDesc}>Personne à contacter en cas de crise (optionnel)</Text>
            <TextInput
              style={styles.input}
              placeholder="Prénom et nom"
              placeholderTextColor="#9CA3AF"
              value={crisisName}
              onChangeText={setCrisisName}
            />
            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder="Numéro de téléphone"
              placeholderTextColor="#9CA3AF"
              value={crisisPhone}
              onChangeText={setCrisisPhone}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={() => saveMutation.mutate()}>
            <Text style={styles.saveBtnText}>Enregistrer mes préférences</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#7BA9D8", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    flexDirection: "row", alignItems: "flex-start", gap: 14,
  },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  card: {
    backgroundColor: "#fff", borderRadius: 28, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#2E4057", marginBottom: 4 },
  cardDesc: { fontSize: 13, color: "#9CA3AF", marginBottom: 16 },
  optionCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "#F9FAFB", borderRadius: 18, padding: 14,
  },
  optionCardActive: { backgroundColor: "rgba(123,169,216,0.1)", borderWidth: 1.5, borderColor: "#7BA9D8" },
  optionLabel: { fontSize: 15, fontWeight: "600", color: "#2E4057", marginBottom: 2 },
  optionDesc: { fontSize: 12, color: "#9CA3AF" },
  goalsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  goalChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#F9FAFB", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10,
  },
  goalChipActive: { backgroundColor: "#7BA9D8" },
  goalChipText: { fontSize: 13, fontWeight: "500", color: "#6B7280" },
  input: {
    backgroundColor: "#F9FAFB", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: "#2E4057",
  },
  saveBtn: {
    backgroundColor: "#7BA9D8", borderRadius: 24, padding: 16, alignItems: "center",
    shadowColor: "#7BA9D8", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
