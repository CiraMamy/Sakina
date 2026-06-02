import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, Plus } from "lucide-react-native";

const DEFAULT_HABITS = [
  { id: "1", title: "Paris sportifs", emoji: "🎰", streak: 0, description: "Résister aux jeux d'argent", category: "Jeux" },
  { id: "2", title: "Réseaux sociaux", emoji: "📱", streak: 3, description: "Limiter le temps d'écran", category: "Écrans" },
  { id: "3", title: "Pornographie", emoji: "🔒", streak: 7, description: "Adopter de saines habitudes", category: "Comportement" },
];

function HabitCard({ habit, onCheckin }) {
  const getStreakEmoji = (streak) => {
    if (streak === 0) return "🌱";
    if (streak < 7) return "🔥";
    if (streak < 30) return "⚡";
    return "🌟";
  };

  return (
    <View style={styles.habitCard}>
      <View style={styles.habitTop}>
        <View style={styles.habitIcon}>
          <Text style={{ fontSize: 28 }}>{habit.emoji}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.habitTitle}>{habit.title}</Text>
          <Text style={styles.habitDesc}>{habit.description}</Text>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{habit.category}</Text>
          </View>
        </View>
        <View style={styles.streakBox}>
          <Text style={{ fontSize: 20 }}>{getStreakEmoji(habit.streak)}</Text>
          <Text style={styles.streakNumber}>{habit.streak}</Text>
          <Text style={styles.streakLabel}>jours</Text>
        </View>
      </View>

      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${Math.min((habit.streak / 30) * 100, 100)}%` }]} />
      </View>
      <Text style={styles.progressLabel}>{habit.streak}/30 jours · objectif mensuel</Text>

      <TouchableOpacity style={styles.checkinBtn} onPress={() => onCheckin(habit.id)}>
        <Text style={styles.checkinBtnText}>✅ Cocher aujourd'hui</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function Addictions() {
  const [habits, setHabits] = useState(DEFAULT_HABITS);

  const handleCheckin = (id) => {
    setHabits(prev =>
      prev.map(h => h.id === id ? { ...h, streak: h.streak + 1 } : h)
    );
    Alert.alert("🎉 Bravo !", "Continue comme ça, tu fais du super travail !");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Gestion des habitudes</Text>
            <Text style={styles.headerSub}>Plans d'aide personnalisés</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => Alert.alert("Bientôt disponible", "Cette fonctionnalité arrive prochainement !")}>
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 20, gap: 16 }}>
          {/* Stats overview */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={{ fontSize: 26 }}>🔥</Text>
              <Text style={styles.statValue}>{Math.max(...habits.map(h => h.streak))}</Text>
              <Text style={styles.statLabel}>Meilleure série</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={{ fontSize: 26 }}>✅</Text>
              <Text style={styles.statValue}>{habits.filter(h => h.streak > 0).length}</Text>
              <Text style={styles.statLabel}>Habitudes actives</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={{ fontSize: 26 }}>💪</Text>
              <Text style={styles.statValue}>{habits.reduce((s, h) => s + h.streak, 0)}</Text>
              <Text style={styles.statLabel}>Total jours</Text>
            </View>
          </View>

          {/* Encouragement */}
          <View style={styles.encourageCard}>
            <Text style={styles.encourageTitle}>💙 Tu n'es pas seul(e)</Text>
            <Text style={styles.encourageText}>
              Chaque jour sans céder est une victoire. Sakina est là pour t'accompagner à chaque étape.
            </Text>
            <TouchableOpacity style={styles.chatBtn} onPress={() => router.push("/(tabs)/chat")}>
              <Text style={styles.chatBtnText}>Parler à Sakina</Text>
            </TouchableOpacity>
          </View>

          {habits.map(habit => (
            <HabitCard key={habit.id} habit={habit} onCheckin={handleCheckin} />
          ))}

          {/* Resources */}
          <View style={styles.resourcesCard}>
            <Text style={styles.resourcesTitle}>🆘 Ressources d'urgence</Text>
            <View style={{ gap: 8 }}>
              {[
                { name: "Joueurs Info Service", number: "09 74 75 13 13" },
                { name: "Addiction France", number: "3114" },
              ].map((r, i) => (
                <TouchableOpacity key={i} style={styles.resourceRow} onPress={() => Alert.alert(r.name, `Appelle le ${r.number}`)}>
                  <Text style={styles.resourceName}>{r.name}</Text>
                  <Text style={styles.resourceNumber}>📞 {r.number}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#10B981", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    flexDirection: "row", alignItems: "flex-start", gap: 14,
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  addBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center",
  },
  statsRow: { flexDirection: "row", gap: 12 },
  statBox: {
    flex: 1, backgroundColor: "#fff", borderRadius: 20, padding: 14, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: "700", color: "#2E4057", marginTop: 4 },
  statLabel: { fontSize: 10, color: "#9CA3AF", marginTop: 2, textAlign: "center" },
  encourageCard: {
    backgroundColor: "#E8F1F8", borderRadius: 24, padding: 20,
  },
  encourageTitle: { fontSize: 16, fontWeight: "700", color: "#2E4057", marginBottom: 8 },
  encourageText: { fontSize: 14, color: "#6B7280", lineHeight: 20, marginBottom: 14 },
  chatBtn: { backgroundColor: "#7BA9D8", borderRadius: 16, padding: 12, alignItems: "center" },
  chatBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  habitCard: {
    backgroundColor: "#fff", borderRadius: 28, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  habitTop: { flexDirection: "row", alignItems: "flex-start", marginBottom: 14 },
  habitIcon: {
    width: 52, height: 52, borderRadius: 18,
    backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center",
  },
  habitTitle: { fontSize: 16, fontWeight: "700", color: "#2E4057", marginBottom: 3 },
  habitDesc: { fontSize: 12, color: "#6B7280", marginBottom: 6 },
  categoryPill: { backgroundColor: "#E8F1F8", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, alignSelf: "flex-start" },
  categoryText: { color: "#7BA9D8", fontSize: 10, fontWeight: "600" },
  streakBox: { alignItems: "center", minWidth: 50 },
  streakNumber: { fontSize: 22, fontWeight: "700", color: "#2E4057" },
  streakLabel: { fontSize: 10, color: "#9CA3AF" },
  progressBg: { height: 6, backgroundColor: "#F3F4F6", borderRadius: 3, overflow: "hidden", marginBottom: 4 },
  progressFill: { height: 6, backgroundColor: "#10B981", borderRadius: 3 },
  progressLabel: { fontSize: 11, color: "#9CA3AF", marginBottom: 12 },
  checkinBtn: {
    backgroundColor: "#E8F9F0", borderRadius: 16, padding: 12, alignItems: "center",
  },
  checkinBtnText: { color: "#10B981", fontSize: 14, fontWeight: "600" },
  resourcesCard: {
    backgroundColor: "#FEF2F2", borderRadius: 24, padding: 20,
  },
  resourcesTitle: { fontSize: 15, fontWeight: "700", color: "#2E4057", marginBottom: 12 },
  resourceRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 14, padding: 12,
  },
  resourceName: { fontSize: 13, fontWeight: "600", color: "#2E4057" },
  resourceNumber: { fontSize: 13, color: "#EF4444", fontWeight: "600" },
});
