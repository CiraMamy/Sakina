import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "../src/api/base44Client";
import { ArrowLeft } from "lucide-react-native";

const MOODS = [
  { value: 1, emoji: "😔", label: "Très mal", color: "#E57373" },
  { value: 2, emoji: "😟", label: "Mal", color: "#FFB74D" },
  { value: 3, emoji: "😐", label: "Neutre", color: "#FFD54F" },
  { value: 4, emoji: "😊", label: "Bien", color: "#A7D7C5" },
  { value: 5, emoji: "😄", label: "Très bien", color: "#8CB8E8" },
];

const RANGES = [
  { label: "7 jours", days: 7 },
  { label: "30 jours", days: 30 },
  { label: "90 jours", days: 90 },
];

export default function Tendances() {
  const [range, setRange] = useState(7);

  const { data: allEntries = [] } = useQuery({
    queryKey: ["moodEntries"],
    queryFn: () => base44.entities.MoodEntry.list("-entry_date", 90),
  });

  const cutoff = new Date(Date.now() - range * 24 * 60 * 60 * 1000);
  const entries = allEntries.filter(e => !e.entry_date || new Date(e.entry_date) > cutoff);

  const avg = entries.length > 0
    ? (entries.reduce((s, e) => s + (e.mood_value || 0), 0) / entries.length).toFixed(1)
    : null;

  const moodCounts = MOODS.map(m => ({
    ...m,
    count: entries.filter(e => e.mood_value === m.value).length,
  }));

  const maxCount = Math.max(...moodCounts.map(m => m.count), 1);

  // Group by date for the chart
  const grouped = {};
  entries.slice(0, 30).forEach(e => {
    const d = e.entry_date || new Date().toISOString().split("T")[0];
    if (!grouped[d] || (e.mood_value > grouped[d].mood_value)) {
      grouped[d] = e;
    }
  });
  const chartData = Object.values(grouped).sort((a, b) => new Date(a.entry_date) - new Date(b.entry_date)).slice(-14);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Tendances</Text>
            <Text style={styles.headerSub}>Analyse de tes émotions</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 16, gap: 16 }}>
          {/* Range selector */}
          <View style={styles.rangeRow}>
            {RANGES.map(r => (
              <TouchableOpacity
                key={r.days}
                style={[styles.rangeBtn, range === r.days && styles.rangeBtnActive]}
                onPress={() => setRange(r.days)}
              >
                <Text style={[styles.rangeBtnText, range === r.days && styles.rangeBtnTextActive]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {entries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 48 }}>📊</Text>
              <Text style={styles.emptyTitle}>Pas encore de données</Text>
              <Text style={styles.emptyText}>Enregistre ton humeur chaque jour pour voir tes tendances.</Text>
            </View>
          ) : (
            <>
              {/* Summary */}
              <View style={styles.summaryRow}>
                <View style={styles.summaryCard}>
                  <Text style={{ fontSize: 32 }}>{MOODS.find(m => m.value === Math.round(parseFloat(avg || 3)))?.emoji}</Text>
                  <Text style={styles.summaryValue}>{avg}/5</Text>
                  <Text style={styles.summaryLabel}>Humeur moy.</Text>
                </View>
                <View style={styles.summaryCard}>
                  <Text style={{ fontSize: 32 }}>📅</Text>
                  <Text style={styles.summaryValue}>{entries.length}</Text>
                  <Text style={styles.summaryLabel}>Entrées</Text>
                </View>
                <View style={styles.summaryCard}>
                  <Text style={{ fontSize: 32 }}>{entries.filter(e => e.mood_value >= 4).length > entries.filter(e => e.mood_value <= 2).length ? "📈" : "📉"}</Text>
                  <Text style={styles.summaryValue}>{Math.round(entries.filter(e => e.mood_value >= 4).length / entries.length * 100)}%</Text>
                  <Text style={styles.summaryLabel}>Jours positifs</Text>
                </View>
              </View>

              {/* Chart */}
              {chartData.length > 0 && (
                <View style={styles.chartCard}>
                  <Text style={styles.cardTitle}>Évolution de l'humeur</Text>
                  <View style={styles.chart}>
                    {chartData.map((entry, i) => {
                      const h = ((entry.mood_value || 1) / 5) * 80;
                      const color = MOODS.find(m => m.value === entry.mood_value)?.color || "#8CB8E8";
                      return (
                        <View key={i} style={styles.chartBar}>
                          <Text style={{ fontSize: 12 }}>{MOODS.find(m => m.value === entry.mood_value)?.emoji || "😐"}</Text>
                          <View style={[styles.chartBarFill, { height: h, backgroundColor: color }]} />
                          <Text style={styles.chartLabel}>
                            {new Date(entry.entry_date || Date.now()).getDate()}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Distribution */}
              <View style={styles.chartCard}>
                <Text style={styles.cardTitle}>Répartition des humeurs</Text>
                <View style={{ gap: 10 }}>
                  {moodCounts.filter(m => m.count > 0).map(m => (
                    <View key={m.value} style={styles.distRow}>
                      <Text style={{ fontSize: 20, width: 28 }}>{m.emoji}</Text>
                      <Text style={styles.distLabel}>{m.label}</Text>
                      <View style={styles.distBarBg}>
                        <View style={[styles.distBarFill, {
                          width: `${(m.count / maxCount) * 100}%`,
                          backgroundColor: m.color,
                        }]} />
                      </View>
                      <Text style={styles.distCount}>{m.count}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}
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
  rangeRow: { flexDirection: "row", gap: 8 },
  rangeBtn: { flex: 1, paddingVertical: 10, borderRadius: 16, backgroundColor: "#fff", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  rangeBtnActive: { backgroundColor: "#8B5CF6" },
  rangeBtnText: { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  rangeBtnTextActive: { color: "#fff" },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#2E4057" },
  emptyText: { color: "#9CA3AF", fontSize: 14, textAlign: "center", paddingHorizontal: 20 },
  summaryRow: { flexDirection: "row", gap: 12 },
  summaryCard: {
    flex: 1, backgroundColor: "#fff", borderRadius: 20, padding: 14, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  summaryValue: { fontSize: 20, fontWeight: "700", color: "#2E4057", marginTop: 4 },
  summaryLabel: { fontSize: 10, color: "#9CA3AF", marginTop: 2, textAlign: "center" },
  chartCard: {
    backgroundColor: "#fff", borderRadius: 28, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#2E4057", marginBottom: 16 },
  chart: { flexDirection: "row", alignItems: "flex-end", height: 110, gap: 4, justifyContent: "space-around" },
  chartBar: { flex: 1, alignItems: "center", gap: 3 },
  chartBarFill: { width: "100%", borderRadius: 4, minHeight: 6 },
  chartLabel: { fontSize: 9, color: "#9CA3AF" },
  distRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  distLabel: { fontSize: 12, color: "#6B7280", width: 70 },
  distBarBg: { flex: 1, height: 8, backgroundColor: "#F3F4F6", borderRadius: 4, overflow: "hidden" },
  distBarFill: { height: 8, borderRadius: 4, minWidth: 4 },
  distCount: { fontSize: 12, fontWeight: "600", color: "#6B7280", width: 20, textAlign: "right" },
});
