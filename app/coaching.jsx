import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "../src/api/base44Client";
import { ArrowLeft, Sparkles } from "lucide-react-native";

export default function Coaching() {
  const [insights, setInsights] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: moodEntries = [] } = useQuery({
    queryKey: ["moodEntries"],
    queryFn: () => base44.entities.MoodEntry.list("-entry_date", 14),
  });

  const { data: goals = [] } = useQuery({
    queryKey: ["userGoals"],
    queryFn: () => base44.entities.UserGoal.list(),
  });

  const { data: sleepEntries = [] } = useQuery({
    queryKey: ["sleepEntries"],
    queryFn: () => base44.entities.SleepEntry.list("-sleep_date", 7),
  });

  const generateInsights = async () => {
    setIsAnalyzing(true);
    try {
      const avgMood = moodEntries.length > 0
        ? (moodEntries.reduce((s, e) => s + (e.mood_value || 0), 0) / moodEntries.length).toFixed(1)
        : "non disponible";
      const avgSleep = sleepEntries.length > 0
        ? (sleepEntries.reduce((s, e) => s + (e.sleep_quality || 0), 0) / sleepEntries.length).toFixed(1)
        : "non disponible";
      const activeGoals = goals.filter(g => g.is_active && !g.completed).map(g => g.title).join(", ") || "aucun";

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es un coach bien-être bienveillant. Analyse ces données et donne des conseils personnalisés en français.

Données:
- Humeur moyenne (14 jours): ${avgMood}/5
- Qualité sommeil moyenne (7 jours): ${avgSleep}/5
- Objectifs actifs: ${activeGoals}
- Nombre d'entrées humeur: ${moodEntries.length}

Fournis:
1. Une analyse courte (2-3 phrases)
2. 3 actions concrètes pour aller mieux
3. Un exercice pratique du jour

Réponds en JSON avec les champs: analysis (string), actions (array of strings), exercise (string avec name et description)`,
        response_json_schema: {
          type: "object",
          properties: {
            analysis: { type: "string" },
            actions: { type: "array", items: { type: "string" } },
            exercise: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
              },
            },
          },
        },
      });

      setInsights(result);
    } catch (err) {
      Alert.alert("Erreur", "Impossible de générer les insights. Réessaie plus tard.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const EXERCISES = [
    { emoji: "🧘", name: "Respiration 4-7-8", desc: "Inspire 4 sec, retiens 7 sec, expire 8 sec. Répète 4 fois." },
    { emoji: "🚶", name: "Marche consciente", desc: "5 minutes de marche lente en observant 5 choses autour de toi." },
    { emoji: "✍️", name: "Gratitude du jour", desc: "Écris 3 choses pour lesquelles tu es reconnaissant(e) aujourd'hui." },
    { emoji: "💆", name: "Scan corporel", desc: "Allonge-toi et relâche chaque partie de ton corps en 5 minutes." },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Coaching IA</Text>
            <Text style={styles.headerSub}>Ton accompagnement personnalisé</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 16, gap: 16 }}>
          {/* AI Analysis trigger */}
          <View style={styles.analyzeCard}>
            <View style={styles.analyzeTop}>
              <Text style={{ fontSize: 36 }}>✨</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.analyzeTitle}>Analyse IA personnalisée</Text>
                <Text style={styles.analyzeDesc}>Basée sur tes données d'humeur, sommeil et objectifs</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.analyzeBtn, isAnalyzing && { opacity: 0.7 }]}
              onPress={generateInsights}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <View style={styles.analyzingRow}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.analyzeBtnText}>Analyse en cours...</Text>
                </View>
              ) : (
                <Text style={styles.analyzeBtnText}>Générer mon analyse →</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* AI Insights */}
          {insights && (
            <>
              <View style={styles.insightCard}>
                <Text style={styles.insightTitle}>📊 Analyse de ta situation</Text>
                <Text style={styles.insightText}>{insights.analysis}</Text>
              </View>

              {insights.actions && insights.actions.length > 0 && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>🎯 Actions recommandées</Text>
                  <View style={{ gap: 10 }}>
                    {insights.actions.map((action, i) => (
                      <View key={i} style={styles.actionRow}>
                        <View style={styles.actionNumber}>
                          <Text style={styles.actionNumberText}>{i + 1}</Text>
                        </View>
                        <Text style={styles.actionText}>{action}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {insights.exercise && (
                <View style={[styles.card, { backgroundColor: "#E8F4FD" }]}>
                  <Text style={styles.cardTitle}>💪 Exercice du jour</Text>
                  <Text style={styles.exerciseName}>{insights.exercise.name}</Text>
                  <Text style={styles.exerciseDesc}>{insights.exercise.description}</Text>
                </View>
              )}
            </>
          )}

          {/* Static exercises */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🧘 Exercices recommandés</Text>
            <View style={{ gap: 12 }}>
              {EXERCISES.map((ex, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.exerciseCard}
                  onPress={() => Alert.alert(ex.name, ex.desc)}
                >
                  <Text style={{ fontSize: 28 }}>{ex.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exerciseName}>{ex.name}</Text>
                    <Text style={styles.exerciseDesc} numberOfLines={2}>{ex.desc}</Text>
                  </View>
                  <Text style={{ color: "#7BA9D8", fontSize: 18 }}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick chat */}
          <TouchableOpacity style={styles.chatCard} onPress={() => router.push("/(tabs)/chat")}>
            <Text style={{ fontSize: 28 }}>💬</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatCardTitle}>Parler à Sakina</Text>
              <Text style={styles.chatCardDesc}>Discute de tes progrès avec ton assistante IA</Text>
            </View>
            <Text style={{ color: "#fff", fontSize: 18 }}>›</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#8B5CF6", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    flexDirection: "row", alignItems: "flex-start", gap: 14,
  },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  analyzeCard: {
    backgroundColor: "#8B5CF6", borderRadius: 28, padding: 20,
    shadowColor: "#8B5CF6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
  },
  analyzeTop: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 },
  analyzeTitle: { color: "#fff", fontSize: 17, fontWeight: "700", marginBottom: 4 },
  analyzeDesc: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  analyzeBtn: {
    backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 18, padding: 14, alignItems: "center",
  },
  analyzingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  analyzeBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  insightCard: {
    backgroundColor: "#EDE7F6", borderRadius: 24, padding: 20,
    borderLeftWidth: 4, borderLeftColor: "#8B5CF6",
  },
  insightTitle: { fontSize: 15, fontWeight: "700", color: "#2E4057", marginBottom: 10 },
  insightText: { fontSize: 14, color: "#6B7280", lineHeight: 22 },
  card: {
    backgroundColor: "#fff", borderRadius: 28, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#2E4057", marginBottom: 14 },
  actionRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  actionNumber: {
    width: 28, height: 28, borderRadius: 10, backgroundColor: "#8B5CF6",
    alignItems: "center", justifyContent: "center",
  },
  actionNumberText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  actionText: { flex: 1, fontSize: 14, color: "#2E4057", lineHeight: 20 },
  exerciseCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "#F9FAFB", borderRadius: 18, padding: 14,
  },
  exerciseName: { fontSize: 15, fontWeight: "700", color: "#2E4057", marginBottom: 3 },
  exerciseDesc: { fontSize: 12, color: "#6B7280", lineHeight: 18 },
  chatCard: {
    backgroundColor: "#7BA9D8", borderRadius: 24, padding: 20,
    flexDirection: "row", alignItems: "center", gap: 14,
  },
  chatCardTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 3 },
  chatCardDesc: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
});
