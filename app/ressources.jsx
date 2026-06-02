import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

const CATEGORIES = ["Tous", "Méditation", "Articles", "Vidéos", "Exercices"];

const RESOURCES = [
  {
    id: "1", title: "Méditation pleine conscience", category: "Méditation",
    duration: "10 min", emoji: "🧘", description: "Apaise ton esprit avec cette méditation guidée pour débutants.",
    color: "#E8F4FD",
  },
  {
    id: "2", title: "Comprendre l'anxiété", category: "Articles",
    duration: "5 min", emoji: "📖", description: "Les mécanismes de l'anxiété et comment la gérer au quotidien.",
    color: "#E8F9F0",
  },
  {
    id: "3", title: "Exercice de respiration 4-7-8", category: "Exercices",
    duration: "3 min", emoji: "💨", description: "Technique de respiration pour calmer le système nerveux rapidement.",
    color: "#FFF3E0",
  },
  {
    id: "4", title: "Améliorer la qualité du sommeil", category: "Vidéos",
    duration: "15 min", emoji: "🌙", description: "Conseils scientifiques pour mieux dormir et récupérer.",
    color: "#EDE7F6",
  },
  {
    id: "5", title: "Gestion du stress au travail", category: "Articles",
    duration: "7 min", emoji: "💼", description: "Stratégies concrètes pour gérer le stress professionnel.",
    color: "#FCE4EC",
  },
  {
    id: "6", title: "Body scan de relaxation", category: "Méditation",
    duration: "20 min", emoji: "✨", description: "Détente profonde du corps et de l'esprit, idéal avant le coucher.",
    color: "#E8F4FD",
  },
  {
    id: "7", title: "Journaling thérapeutique", category: "Exercices",
    duration: "Quotidien", emoji: "✍️", description: "Comment utiliser l'écriture pour mieux comprendre ses émotions.",
    color: "#E8F9F0",
  },
];

export default function Ressources() {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filtered = activeCategory === "Tous"
    ? RESOURCES
    : RESOURCES.filter(r => r.category === activeCategory);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Ressources</Text>
            <Text style={styles.headerSub}>Méditations, articles & exercices</Text>
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          {/* Programme featured */}
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <TouchableOpacity style={styles.programCard} onPress={() => Alert.alert("Programme 7 jours", "Ce programme arrive bientôt !")}>
              <View>
                <Text style={styles.programLabel}>Programme recommandé</Text>
                <Text style={styles.programTitle}>7 jours pour aller mieux</Text>
                <Text style={styles.programDesc}>Un parcours guidé pour retrouver l'équilibre</Text>
                <View style={styles.programBtn}>
                  <Text style={styles.programBtnText}>Démarrer →</Text>
                </View>
              </View>
              <Text style={{ fontSize: 64 }}>🌱</Text>
            </TouchableOpacity>
          </View>

          {/* Category filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.filterChip, activeCategory === cat && styles.filterChipActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.filterText, activeCategory === cat && styles.filterTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Resources grid */}
          <View style={{ paddingHorizontal: 20, gap: 12 }}>
            {filtered.map(res => (
              <TouchableOpacity
                key={res.id}
                style={[styles.resourceCard, { backgroundColor: res.color }]}
                onPress={() => Alert.alert(res.title, res.description)}
                activeOpacity={0.85}
              >
                <View style={styles.resourceLeft}>
                  <Text style={{ fontSize: 36 }}>{res.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.resourceMeta}>
                    <View style={styles.categoryPill}>
                      <Text style={styles.categoryText}>{res.category}</Text>
                    </View>
                    <Text style={styles.durationText}>⏱ {res.duration}</Text>
                  </View>
                  <Text style={styles.resourceTitle}>{res.title}</Text>
                  <Text style={styles.resourceDesc} numberOfLines={2}>{res.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#8CB8E8", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    flexDirection: "row", alignItems: "flex-start", gap: 14,
  },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  programCard: {
    backgroundColor: "#7BA9D8", borderRadius: 28, padding: 20,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    shadowColor: "#7BA9D8", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
    overflow: "hidden",
  },
  programLabel: { color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: "600", marginBottom: 4 },
  programTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 4 },
  programDesc: { color: "rgba(255,255,255,0.85)", fontSize: 12, marginBottom: 14 },
  programBtn: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 7, alignSelf: "flex-start" },
  programBtnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  filterChipActive: { backgroundColor: "#7BA9D8" },
  filterText: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  filterTextActive: { color: "#fff", fontWeight: "600" },
  resourceCard: {
    borderRadius: 24, padding: 18, flexDirection: "row", alignItems: "flex-start", gap: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  resourceLeft: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.6)", alignItems: "center", justifyContent: "center",
  },
  resourceMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  categoryPill: { backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  categoryText: { color: "#6B7280", fontSize: 10, fontWeight: "600" },
  durationText: { fontSize: 10, color: "#6B7280" },
  resourceTitle: { fontSize: 15, fontWeight: "700", color: "#2E4057", marginBottom: 4 },
  resourceDesc: { fontSize: 12, color: "#6B7280", lineHeight: 17 },
});
