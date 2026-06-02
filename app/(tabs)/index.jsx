import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MessageCircle, TrendingUp, Target, BookMarked, Moon, Users,
  ChevronRight, Flame, Star, Sparkles,
} from "lucide-react-native";

function FeatureCard({ title, description, emoji, to, isPrimary = false }) {
  return (
    <TouchableOpacity
      style={[styles.featureCard, isPrimary && styles.featureCardPrimary]}
      onPress={() => router.push(to)}
      activeOpacity={0.85}
    >
      <View style={styles.featureCardDecor} />
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={styles.featureCardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.featureCardTitle, isPrimary && { color: "#fff" }]}>{title}</Text>
            <Text style={[styles.featureCardDesc, isPrimary && { color: "rgba(255,255,255,0.85)" }]}>
              {description}
            </Text>
          </View>
          <View style={[styles.featureIconBox, isPrimary && { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Text style={{ fontSize: 22 }}>{emoji}</Text>
          </View>
        </View>
        <ChevronRight size={16} color={isPrimary ? "rgba(255,255,255,0.6)" : "#9CA3AF"} />
      </View>
    </TouchableOpacity>
  );
}

export default function Accueil() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerGreeting}>Bonjour</Text>
              <Text style={styles.headerName}>Cira</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/(tabs)/profil")} style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Text style={styles.avatarLetter}>C</Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>8</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Quick stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={{ fontSize: 18 }}>🔥</Text>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Série</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={{ fontSize: 18 }}>⭐</Text>
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>Succès</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={{ fontSize: 18 }}>✨</Text>
              <Text style={styles.statValue}>47</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          {/* Quick Actions */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: "#7BA9D8" }]}
              onPress={() => router.push("/(tabs)/chat")}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 28, marginBottom: 8 }}>💬</Text>
              <Text style={styles.quickActionTitle}>Parler à Sakina</Text>
              <Text style={styles.quickActionSub}>Disponible maintenant</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: "#A8C5E6" }]}
              onPress={() => router.push("/professionnels")}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 28, marginBottom: 8 }}>👥</Text>
              <Text style={styles.quickActionTitle}>Professionnels</Text>
              <Text style={styles.quickActionSub}>Trouve du soutien</Text>
            </TouchableOpacity>
          </View>

          {/* Quote du jour */}
          <View style={styles.quoteCard}>
            <Text style={styles.quoteLabel}>Citation du jour</Text>
            <Text style={styles.quoteText}>"Un jour à la fois. C'est déjà beaucoup."</Text>
          </View>

          {/* Feature grid */}
          <Text style={styles.sectionTitle}>Tes outils bien-être</Text>
          <View style={styles.featureGrid}>
            <View style={{ width: "100%" }}>
              <FeatureCard
                title="Parler à Sakina"
                description="Ton espace d'écoute personnalisé"
                emoji="💬"
                to="/(tabs)/chat"
                isPrimary
              />
            </View>
            <View style={styles.featureRow}>
              <View style={{ flex: 1 }}>
                <FeatureCard
                  title="Suivi émotionnel"
                  description="Visualise ton humeur"
                  emoji="📊"
                  to="/emotions"
                />
              </View>
              <View style={{ flex: 1 }}>
                <FeatureCard
                  title="Addictions"
                  description="Plans d'aide personnalisés"
                  emoji="🎯"
                  to="/addictions"
                />
              </View>
            </View>
            <View style={styles.featureRow}>
              <View style={{ flex: 1 }}>
                <FeatureCard
                  title="Sommeil"
                  description="Suivi de ton repos"
                  emoji="🌙"
                  to="/sommeil"
                />
              </View>
              <View style={{ flex: 1 }}>
                <FeatureCard
                  title="Journal"
                  description="Écris tes pensées"
                  emoji="📖"
                  to="/journal"
                />
              </View>
            </View>
          </View>

          {/* Action rapide humeur */}
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <TouchableOpacity style={styles.moodQuickCard} onPress={() => router.push("/emotions")}>
            <View style={styles.moodQuickLeft}>
              <View style={styles.moodQuickIcon}>
                <Text style={{ fontSize: 28 }}>😊</Text>
              </View>
              <View>
                <Text style={styles.moodQuickTitle}>Comment tu te sens ?</Text>
                <Text style={styles.moodQuickSub}>Enregistre ton humeur</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#7BA9D8",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  headerGreeting: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginBottom: 2 },
  headerName: { color: "#fff", fontSize: 28, fontWeight: "700" },
  avatarWrapper: { position: "relative" },
  avatar: {
    width: 52, height: 52, borderRadius: 18,
    backgroundColor: "#5A8BBD",
    alignItems: "center", justifyContent: "center",
  },
  avatarLetter: { color: "#fff", fontSize: 20, fontWeight: "700" },
  levelBadge: {
    position: "absolute", bottom: -4, right: -4,
    width: 22, height: 22, borderRadius: 8,
    backgroundColor: "#F97316",
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#fff",
  },
  levelText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1, alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16, paddingVertical: 12,
  },
  statValue: { color: "#fff", fontSize: 20, fontWeight: "700", marginTop: 2 },
  statLabel: { color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 },
  quickActionsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  quickAction: {
    flex: 1, borderRadius: 24, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 4,
    overflow: "hidden",
  },
  quickActionTitle: { color: "#fff", fontSize: 15, fontWeight: "700", marginBottom: 2 },
  quickActionSub: { color: "rgba(255,255,255,0.75)", fontSize: 11 },
  quoteCard: {
    backgroundColor: "#E8F1F8", borderRadius: 24, padding: 20,
    marginBottom: 24,
  },
  quoteLabel: { color: "#7BA9D8", fontSize: 12, fontWeight: "600", marginBottom: 8 },
  quoteText: { color: "#2E4057", fontSize: 16, fontWeight: "300", lineHeight: 24, fontStyle: "italic" },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#2E4057", marginBottom: 14 },
  featureGrid: { gap: 12, marginBottom: 24 },
  featureRow: { flexDirection: "row", gap: 12 },
  featureCard: {
    backgroundColor: "#FFFFFF", borderRadius: 28, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
    minHeight: 130,
    overflow: "hidden",
  },
  featureCardPrimary: {
    backgroundColor: "#7BA9D8", minHeight: 140,
  },
  featureCardDecor: {
    position: "absolute", top: 0, right: 0, width: 80, height: 80,
    borderRadius: 40, backgroundColor: "rgba(255,255,255,0.08)",
    transform: [{ translateX: 20 }, { translateY: -20 }],
  },
  featureCardHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 },
  featureCardTitle: { fontSize: 16, fontWeight: "700", color: "#2E4057", marginBottom: 4 },
  featureCardDesc: { fontSize: 12, color: "#6B7280" },
  featureIconBox: {
    width: 44, height: 44, borderRadius: 16,
    backgroundColor: "rgba(123,169,216,0.1)",
    alignItems: "center", justifyContent: "center",
  },
  moodQuickCard: {
    backgroundColor: "#fff", borderRadius: 24, padding: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  moodQuickLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  moodQuickIcon: {
    width: 48, height: 48, borderRadius: 18,
    backgroundColor: "rgba(123,169,216,0.1)",
    alignItems: "center", justifyContent: "center",
  },
  moodQuickTitle: { fontSize: 15, fontWeight: "600", color: "#2E4057" },
  moodQuickSub: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
});
