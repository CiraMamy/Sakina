import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "../src/api/base44Client";
import { ArrowLeft } from "lucide-react-native";

const QUALITY_LABELS = { 1: "Très mauvais", 2: "Mauvais", 3: "Moyen", 4: "Bon", 5: "Excellent" };
const QUALITY_EMOJIS = { 1: "😫", 2: "😴", 3: "😐", 4: "😊", 5: "🌟" };

export default function Sommeil() {
  const [bedtime, setBedtime] = useState("22:30");
  const [waketime, setWaketime] = useState("07:00");
  const [quality, setQuality] = useState(null);
  const [notes, setNotes] = useState("");
  const queryClient = useQueryClient();

  const { data: entries = [] } = useQuery({
    queryKey: ["sleepEntries"],
    queryFn: () => base44.entities.SleepEntry.list("-sleep_date", 14),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.SleepEntry.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleepEntries"] });
      setQuality(null); setNotes("");
      Alert.alert("✅ Enregistré !", "Ton sommeil a été sauvegardé.");
    },
  });

  const calcDuration = () => {
    try {
      const [bH, bM] = bedtime.split(":").map(Number);
      const [wH, wM] = waketime.split(":").map(Number);
      let mins = (wH * 60 + wM) - (bH * 60 + bM);
      if (mins < 0) mins += 24 * 60;
      return `${Math.floor(mins / 60)}h${String(mins % 60).padStart(2, "0")}`;
    } catch { return "—"; }
  };

  const avgQuality = entries.length > 0
    ? (entries.reduce((s, e) => s + (e.sleep_quality || 0), 0) / entries.length).toFixed(1)
    : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Suivi du sommeil</Text>
            <Text style={styles.headerSub}>Comprends l'impact de ton repos</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 16, gap: 16 }}>
          {/* Log card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Enregistrer cette nuit</Text>

            <View style={styles.timeRow}>
              <View style={styles.timeBox}>
                <Text style={styles.timeLabel}>Coucher 🌙</Text>
                <TextInput
                  style={styles.timeInput}
                  value={bedtime}
                  onChangeText={setBedtime}
                  placeholder="22:30"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numbers-and-punctuation"
                />
              </View>
              <View style={styles.timeDivider}>
                <Text style={styles.durationText}>{calcDuration()}</Text>
                <Text style={styles.durationLabel}>durée</Text>
              </View>
              <View style={styles.timeBox}>
                <Text style={styles.timeLabel}>Réveil ☀️</Text>
                <TextInput
                  style={styles.timeInput}
                  value={waketime}
                  onChangeText={setWaketime}
                  placeholder="07:00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            </View>

            <Text style={[styles.cardTitle, { marginTop: 16, marginBottom: 10 }]}>Qualité du sommeil</Text>
            <View style={styles.qualityRow}>
              {[1, 2, 3, 4, 5].map(q => (
                <TouchableOpacity
                  key={q}
                  style={[styles.qualityBtn, quality === q && styles.qualityBtnSelected]}
                  onPress={() => setQuality(q)}
                >
                  <Text style={{ fontSize: 28 }}>{QUALITY_EMOJIS[q]}</Text>
                  <Text style={[styles.qualityLabel, quality === q && { color: "#fff" }]}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {quality && <Text style={styles.qualityText}>{QUALITY_LABELS[quality]}</Text>}

            <TextInput
              style={styles.noteInput}
              placeholder="Notes (cauchemars, réveils nocturnes...)"
              placeholderTextColor="#9CA3AF"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={2}
            />

            <TouchableOpacity
              style={[styles.saveBtn, !quality && { opacity: 0.5 }]}
              onPress={() => saveMutation.mutate({
                sleep_date: new Date().toISOString().split("T")[0],
                bedtime, wake_time: waketime,
                sleep_quality: quality, notes,
              })}
              disabled={!quality}
            >
              <Text style={styles.saveBtnText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          {avgQuality && (
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={{ fontSize: 28 }}>{QUALITY_EMOJIS[Math.round(parseFloat(avgQuality))]}</Text>
                <Text style={styles.statValue}>{avgQuality}/5</Text>
                <Text style={styles.statLabel}>Qualité moy.</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={{ fontSize: 28 }}>📅</Text>
                <Text style={styles.statValue}>{entries.length}</Text>
                <Text style={styles.statLabel}>Nuits suiv.</Text>
              </View>
            </View>
          )}

          {/* History */}
          {entries.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Historique</Text>
              <View style={{ gap: 10 }}>
                {entries.slice(0, 7).map((entry, i) => (
                  <View key={i} style={styles.histRow}>
                    <Text style={{ fontSize: 24 }}>{QUALITY_EMOJIS[entry.sleep_quality] || "😐"}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.histDate}>{entry.sleep_date}</Text>
                      <Text style={styles.histDetail}>
                        {entry.bedtime} → {entry.wake_time} · Qualité {entry.sleep_quality}/5
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
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
    backgroundColor: "#6366F1", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    flexDirection: "row", alignItems: "flex-start", gap: 14,
  },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  card: {
    backgroundColor: "#fff", borderRadius: 28, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#2E4057", marginBottom: 14 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  timeBox: { flex: 1, alignItems: "center" },
  timeLabel: { fontSize: 12, color: "#6B7280", marginBottom: 8 },
  timeInput: {
    backgroundColor: "#F9FAFB", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 20, fontWeight: "700", color: "#2E4057", textAlign: "center", width: "100%",
  },
  timeDivider: { alignItems: "center" },
  durationText: { fontSize: 18, fontWeight: "700", color: "#7BA9D8" },
  durationLabel: { fontSize: 10, color: "#9CA3AF" },
  qualityRow: { flexDirection: "row", gap: 8, justifyContent: "space-between", marginBottom: 8 },
  qualityBtn: {
    flex: 1, alignItems: "center", padding: 10, borderRadius: 18,
    backgroundColor: "#F9FAFB",
  },
  qualityBtnSelected: { backgroundColor: "#6366F1" },
  qualityLabel: { fontSize: 12, fontWeight: "600", color: "#6B7280", marginTop: 2 },
  qualityText: { textAlign: "center", color: "#6366F1", fontWeight: "600", fontSize: 14, marginBottom: 12 },
  noteInput: {
    backgroundColor: "#F9FAFB", borderRadius: 16, padding: 12, fontSize: 14, color: "#2E4057",
    textAlignVertical: "top", marginBottom: 16, marginTop: 8,
  },
  saveBtn: {
    backgroundColor: "#6366F1", borderRadius: 20, padding: 14, alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  statsRow: { flexDirection: "row", gap: 12 },
  statBox: {
    flex: 1, backgroundColor: "#fff", borderRadius: 20, padding: 16, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: "700", color: "#2E4057", marginTop: 4 },
  statLabel: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
  histRow: { flexDirection: "row", gap: 12, alignItems: "center", paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  histDate: { fontSize: 14, fontWeight: "600", color: "#2E4057" },
  histDetail: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
});
