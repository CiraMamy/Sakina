import React from "react";
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "../src/api/base44Client";
import { ArrowLeft } from "lucide-react-native";

const RARITY_COLORS = { common: "#9CA3AF", rare: "#3B82F6", epic: "#8B5CF6", legendary: "#F59E0B" };
const RARITY_LABELS = { common: "Commun", rare: "Rare", epic: "Épique", legendary: "Légendaire" };

export default function Recompenses() {
  const { data: achievements = [] } = useQuery({
    queryKey: ["achievements"],
    queryFn: () => base44.entities.Achievement.list(),
  });

  const { data: progress } = useQuery({
    queryKey: ["userProgress"],
    queryFn: () => base44.entities.UserProgress.list(),
  });

  const prog = progress?.[0];
  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);
  const level = prog?.current_level || 1;
  const totalPoints = prog?.total_points || 0;
  const pointsToNext = 500 - (totalPoints % 500);
  const progressPct = ((totalPoints % 500) / 500) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Récompenses</Text>
            <Text style={styles.headerSub}>Tes succès et badges</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 16, gap: 16 }}>
          {/* Level card */}
          <View style={styles.levelCard}>
            <View style={styles.levelRow}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelNumber}>Niv. {level}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.levelTitle}>Niveau {level}</Text>
                <Text style={styles.levelPoints}>{totalPoints} points · encore {pointsToNext} pts</Text>
              </View>
              <Text style={{ fontSize: 32 }}>🏆</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={{ fontSize: 28 }}>🔥</Text>
              <Text style={styles.statValue}>{prog?.current_streak || 0}</Text>
              <Text style={styles.statLabel}>Jours de série</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={{ fontSize: 28 }}>⭐</Text>
              <Text style={styles.statValue}>{unlocked.length}</Text>
              <Text style={styles.statLabel}>Succès</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={{ fontSize: 28 }}>✨</Text>
              <Text style={styles.statValue}>{totalPoints}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>

          {/* Unlocked achievements */}
          {unlocked.length > 0 && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>🏅 Succès débloqués ({unlocked.length})</Text>
              <View style={styles.badgeGrid}>
                {unlocked.map((a, i) => (
                  <View key={i} style={styles.badgeCard}>
                    <Text style={{ fontSize: 36, marginBottom: 6 }}>{a.icon || "🏅"}</Text>
                    <Text style={styles.badgeName}>{a.title || "Succès"}</Text>
                    <View style={[styles.rarityPill, { backgroundColor: (RARITY_COLORS[a.rarity] || "#9CA3AF") + "20" }]}>
                      <Text style={[styles.rarityText, { color: RARITY_COLORS[a.rarity] || "#9CA3AF" }]}>
                        {RARITY_LABELS[a.rarity] || "Commun"}
                      </Text>
                    </View>
                    <Text style={styles.badgePts}>{a.points || 0} pts</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Locked achievements */}
          {locked.length > 0 && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>🔒 À débloquer ({locked.length})</Text>
              <View style={{ gap: 10 }}>
                {locked.slice(0, 5).map((a, i) => (
                  <View key={i} style={[styles.lockedRow, { opacity: 0.6 }]}>
                    <Text style={{ fontSize: 28 }}>🔒</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.lockedTitle}>{a.title || "Succès mystère"}</Text>
                      <Text style={styles.lockedDesc}>{a.description || "Continue ton parcours"}</Text>
                    </View>
                    <Text style={styles.lockedPts}>{a.points || 0} pts</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {achievements.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 48 }}>🌱</Text>
              <Text style={styles.emptyTitle}>Continue ton parcours !</Text>
              <Text style={styles.emptyText}>Utilise Sakina chaque jour pour débloquer des récompenses.</Text>
            </View>
          )}
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#F59E0B", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    flexDirection: "row", alignItems: "flex-start", gap: 14,
  },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  levelCard: {
    backgroundColor: "#fff", borderRadius: 28, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  levelRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 },
  levelBadge: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: "#F59E0B",
    alignItems: "center", justifyContent: "center",
  },
  levelNumber: { color: "#fff", fontSize: 13, fontWeight: "700" },
  levelTitle: { fontSize: 18, fontWeight: "700", color: "#2E4057" },
  levelPoints: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  progressBarBg: { height: 8, backgroundColor: "#F3F4F6", borderRadius: 4, overflow: "hidden" },
  progressBarFill: { height: 8, backgroundColor: "#F59E0B", borderRadius: 4 },
  statsRow: { flexDirection: "row", gap: 12 },
  statBox: {
    flex: 1, backgroundColor: "#fff", borderRadius: 20, padding: 14, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: "700", color: "#2E4057", marginTop: 4 },
  statLabel: { fontSize: 10, color: "#9CA3AF", marginTop: 2, textAlign: "center" },
  sectionCard: {
    backgroundColor: "#fff", borderRadius: 28, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#2E4057", marginBottom: 16 },
  badgeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  badgeCard: {
    width: "29%", alignItems: "center", backgroundColor: "#F9FAFB",
    borderRadius: 20, padding: 14,
  },
  badgeName: { fontSize: 11, fontWeight: "600", color: "#2E4057", textAlign: "center", marginBottom: 4 },
  rarityPill: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 4 },
  rarityText: { fontSize: 10, fontWeight: "600" },
  badgePts: { fontSize: 10, color: "#9CA3AF" },
  lockedRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  lockedTitle: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  lockedDesc: { fontSize: 12, color: "#9CA3AF", marginTop: 1 },
  lockedPts: { fontSize: 12, color: "#9CA3AF", fontWeight: "600" },
  emptyState: { alignItems: "center", paddingTop: 40, gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#2E4057" },
  emptyText: { color: "#9CA3AF", fontSize: 14, textAlign: "center", paddingHorizontal: 20 },
});
