import React from "react";
import {
  View, Text, ScrollView, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "../../src/api/base44Client";

function StatCard({ emoji, label, value, sublabel, color = "#7BA9D8" }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color, borderTopWidth: 3 }]}>
      <Text style={{ fontSize: 28 }}>{emoji}</Text>
      <Text style={styles.statValue}>{value ?? "—"}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sublabel ? <Text style={styles.statSublabel}>{sublabel}</Text> : null}
    </View>
  );
}

function SectionCard({ title, children }) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const MOOD_EMOJIS = { 1: "😔", 2: "😟", 3: "😐", 4: "😊", 5: "😄" };
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function Dashboard() {
  const { data: moodEntries = [] } = useQuery({
    queryKey: ["moodEntries"],
    queryFn: () => base44.entities.MoodEntry.list("-entry_date", 30),
  });

  const { data: userGoals = [] } = useQuery({
    queryKey: ["userGoals"],
    queryFn: () => base44.entities.UserGoal.list("-created_date"),
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ["achievements"],
    queryFn: () => base44.entities.Achievement.list(),
  });

  const { data: progress } = useQuery({
    queryKey: ["userProgress"],
    queryFn: () => base44.entities.UserProgress.list(),
  });

  const { data: sleepEntries = [] } = useQuery({
    queryKey: ["sleepEntries"],
    queryFn: () => base44.entities.SleepEntry.list("-sleep_date", 7),
  });

  const prog = progress?.[0];
  const activeGoals = userGoals.filter(g => g.is_active && !g.completed);
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const avgMood = moodEntries.length > 0
    ? (moodEntries.reduce((s, e) => s + (e.mood_value || 0), 0) / moodEntries.length).toFixed(1)
    : null;
  const avgSleep = sleepEntries.length > 0
    ? (sleepEntries.reduce((s, e) => s + (e.sleep_quality || 0), 0) / sleepEntries.length).toFixed(1)
    : null;

  // Weekly mood mini chart (last 7 entries)
  const last7 = moodEntries.slice(0, 7).reverse();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSub}>Ton aperçu global</Text>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          {/* Stats grid */}
          <View style={styles.statsGrid}>
            <StatCard emoji="🔥" label="Série" value={prog?.current_streak || 0} sublabel="jours" color="#F97316" />
            <StatCard emoji="🎯" label="Objectifs actifs" value={activeGoals.length} color="#10B981" />
            <StatCard emoji="⭐" label="Succès" value={unlockedAchievements.length} color="#F59E0B" />
            <StatCard emoji="💬" label="Sessions" value={prog?.total_chat_sessions || 0} color="#7BA9D8" />
          </View>

          {/* Mood trend */}
          <SectionCard title="📊 Humeur des 7 derniers jours">
            {last7.length === 0 ? (
              <Text style={styles.emptyText}>Aucune donnée d'humeur encore</Text>
            ) : (
              <View style={styles.moodChart}>
                {last7.map((entry, i) => {
                  const h = ((entry.mood_value || 1) / 5) * 80;
                  return (
                    <View key={i} style={styles.moodBar}>
                      <Text style={{ fontSize: 16 }}>{MOOD_EMOJIS[entry.mood_value] || "😐"}</Text>
                      <View style={[styles.moodBarFill, { height: h, backgroundColor: "#8CB8E8" }]} />
                      <Text style={styles.moodBarDay}>{DAYS[new Date(entry.entry_date || Date.now()).getDay() === 0 ? 6 : new Date(entry.entry_date || Date.now()).getDay() - 1] || "—"}</Text>
                    </View>
                  );
                })}
              </View>
            )}
            {avgMood && (
              <Text style={styles.avgText}>Humeur moyenne : {avgMood}/5</Text>
            )}
          </SectionCard>

          {/* Goals */}
          <SectionCard title="🎯 Objectifs en cours">
            {activeGoals.length === 0 ? (
              <Text style={styles.emptyText}>Aucun objectif actif. Ajoute-en dans Préférences !</Text>
            ) : (
              <View style={{ gap: 10 }}>
                {activeGoals.slice(0, 4).map((g, i) => (
                  <View key={i} style={styles.goalRow}>
                    <Text style={styles.goalTitle}>{g.title}</Text>
                    <View style={styles.goalBadge}>
                      <Text style={styles.goalBadgeText}>En cours</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </SectionCard>

          {/* Achievements */}
          <SectionCard title="🏆 Derniers succès">
            {unlockedAchievements.length === 0 ? (
              <Text style={styles.emptyText}>Commence à utiliser Sakina pour débloquer des succès !</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -8 }}>
                {unlockedAchievements.slice(0, 6).map((a, i) => (
                  <View key={i} style={styles.achievCard}>
                    <Text style={{ fontSize: 32, marginBottom: 6 }}>{a.icon || "🏅"}</Text>
                    <Text style={styles.achievTitle}>{a.title || "Succès"}</Text>
                    <Text style={styles.achievPts}>{a.points || 0} pts</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </SectionCard>

          {/* Sleep */}
          {avgSleep && (
            <SectionCard title="🌙 Qualité du sommeil (7 jours)">
              <View style={styles.sleepRow}>
                <Text style={styles.sleepAvg}>{avgSleep}/5</Text>
                <Text style={styles.sleepLabel}>qualité moyenne</Text>
              </View>
            </SectionCard>
          )}
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#7BA9D8", paddingHorizontal: 20,
    paddingTop: 16, paddingBottom: 28,
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
  },
  headerTitle: { color: "#fff", fontSize: 28, fontWeight: "700", marginBottom: 4 },
  headerSub: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  statCard: {
    width: "47%", backgroundColor: "#fff", borderRadius: 20,
    padding: 16, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  statValue: { fontSize: 28, fontWeight: "700", color: "#2E4057", marginTop: 6 },
  statLabel: { fontSize: 12, color: "#6B7280", marginTop: 2, textAlign: "center" },
  statSublabel: { fontSize: 11, color: "#9CA3AF" },
  sectionCard: {
    backgroundColor: "#fff", borderRadius: 24, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#2E4057", marginBottom: 16 },
  emptyText: { color: "#9CA3AF", fontSize: 13, textAlign: "center", paddingVertical: 8 },
  moodChart: { flexDirection: "row", alignItems: "flex-end", height: 110, gap: 6, justifyContent: "space-around" },
  moodBar: { flex: 1, alignItems: "center", gap: 4 },
  moodBarFill: { width: "100%", borderRadius: 6, minHeight: 8 },
  moodBarDay: { fontSize: 10, color: "#9CA3AF" },
  avgText: { textAlign: "center", marginTop: 12, fontSize: 13, color: "#7BA9D8", fontWeight: "600" },
  goalRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
  },
  goalTitle: { fontSize: 14, color: "#2E4057", fontWeight: "500", flex: 1 },
  goalBadge: { backgroundColor: "#E8F1F8", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  goalBadgeText: { color: "#7BA9D8", fontSize: 11, fontWeight: "600" },
  achievCard: {
    width: 90, alignItems: "center", backgroundColor: "#F9FAFB",
    borderRadius: 20, padding: 12, margin: 4,
  },
  achievTitle: { fontSize: 11, fontWeight: "600", color: "#2E4057", textAlign: "center" },
  achievPts: { fontSize: 10, color: "#9CA3AF", marginTop: 2 },
  sleepRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  sleepAvg: { fontSize: 40, fontWeight: "700", color: "#7BA9D8" },
  sleepLabel: { fontSize: 14, color: "#6B7280" },
});
