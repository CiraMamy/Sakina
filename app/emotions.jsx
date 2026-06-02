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

const MOODS = [
  { value: 1, emoji: "😔", label: "Très mal", color: "#E57373" },
  { value: 2, emoji: "😟", label: "Mal", color: "#FFB74D" },
  { value: 3, emoji: "😐", label: "Neutre", color: "#FFD54F" },
  { value: 4, emoji: "😊", label: "Bien", color: "#A7D7C5" },
  { value: 5, emoji: "😄", label: "Très bien", color: "#8CB8E8" },
];

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function Emotions() {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const queryClient = useQueryClient();

  const { data: entries = [] } = useQuery({
    queryKey: ["moodEntries"],
    queryFn: () => base44.entities.MoodEntry.list("-entry_date", 30),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.MoodEntry.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moodEntries"] });
      setSaved(true);
      setSelected(null);
      setNote("");
      setTimeout(() => setSaved(false), 2500);
    },
    onError: () => Alert.alert("Erreur", "Impossible d'enregistrer l'humeur."),
  });

  const handleSave = () => {
    if (!selected) return;
    saveMutation.mutate({
      mood_value: selected,
      mood_label: MOODS.find(m => m.value === selected)?.label,
      note,
      entry_date: new Date().toISOString().split("T")[0],
    });
  };

  const avgMood = entries.length > 0
    ? (entries.reduce((s, e) => s + (e.mood_value || 0), 0) / entries.length).toFixed(1)
    : null;

  const last7 = entries.slice(0, 7).reverse();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Suivi émotionnel</Text>
            <Text style={styles.headerSub}>Comprends ton évolution au fil du temps</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: -36 }}>
          {/* Check-in card */}
          <View style={styles.card}>
            {saved ? (
              <View style={styles.successBox}>
                <Text style={{ fontSize: 32 }}>✅</Text>
                <Text style={styles.successText}>Humeur enregistrée !</Text>
              </View>
            ) : (
              <>
                <Text style={styles.cardTitle}>Comment te sens-tu ?</Text>
                <Text style={styles.cardSub}>Aujourd'hui</Text>
                <View style={styles.moodRow}>
                  {MOODS.map(m => (
                    <TouchableOpacity
                      key={m.value}
                      style={[styles.moodBtn, selected === m.value && { backgroundColor: "#8CB8E8" }]}
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
                    placeholder="Ajoute une note (optionnel)"
                    placeholderTextColor="#9CA3AF"
                    value={note}
                    onChangeText={setNote}
                    multiline
                    numberOfLines={2}
                  />
                )}
                <TouchableOpacity
                  style={[styles.saveBtn, !selected && styles.saveBtnDisabled]}
                  onPress={handleSave}
                  disabled={!selected || saveMutation.isPending}
                >
                  <Text style={styles.saveBtnText}>
                    {saveMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Stats */}
          {entries.length > 0 && (
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={{ fontSize: 24 }}>{MOODS.find(m => m.value === Math.round(parseFloat(avgMood || 3)))?.emoji || "😐"}</Text>
                <Text style={styles.statValue}>{avgMood}/5</Text>
                <Text style={styles.statLabel}>Moyenne</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={{ fontSize: 24 }}>📅</Text>
                <Text style={styles.statValue}>{entries.length}</Text>
                <Text style={styles.statLabel}>Entrées</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={{ fontSize: 24 }}>📈</Text>
                <Text style={styles.statValue}>{last7.length}</Text>
                <Text style={styles.statLabel}>Ce mois</Text>
              </View>
            </View>
          )}

          {/* Week chart */}
          {last7.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Cette semaine</Text>
              <View style={styles.weekChart}>
                {last7.map((entry, i) => {
                  const h = ((entry.mood_value || 1) / 5) * 80;
                  const color = MOODS.find(m => m.value === entry.mood_value)?.color || "#8CB8E8";
                  return (
                    <View key={i} style={styles.dayBar}>
                      <Text style={{ fontSize: 14 }}>{MOODS.find(m => m.value === entry.mood_value)?.emoji || "😐"}</Text>
                      <View style={[styles.dayBarFill, { height: h, backgroundColor: color }]} />
                      <Text style={styles.dayLabel}>
                        {DAYS[new Date(entry.entry_date || Date.now()).getDay() === 0 ? 6 : new Date(entry.entry_date || Date.now()).getDay() - 1] || "—"}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* History */}
          {entries.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Historique récent</Text>
              <View style={{ gap: 10 }}>
                {entries.slice(0, 10).map((entry, i) => {
                  const mood = MOODS.find(m => m.value === entry.mood_value);
                  return (
                    <View key={i} style={styles.historyRow}>
                      <Text style={{ fontSize: 28 }}>{mood?.emoji || "😐"}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.historyMood}>{mood?.label || "Inconnu"}</Text>
                        <Text style={styles.historyDate}>{entry.entry_date || "—"}</Text>
                        {entry.note ? <Text style={styles.historyNote}>{entry.note}</Text> : null}
                      </View>
                      <View style={[styles.moodDot, { backgroundColor: mood?.color || "#ccc" }]} />
                    </View>
                  );
                })}
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
    background: "linear-gradient(135deg, #8CB8E8, #A7D7C5)",
    backgroundColor: "#8CB8E8",
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 64,
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
    flexDirection: "row", alignItems: "flex-start", gap: 14,
  },
  backBtn: { marginTop: 4, padding: 4 },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "700", marginBottom: 4 },
  headerSub: { color: "rgba(255,255,255,0.85)", fontSize: 13 },
  card: {
    backgroundColor: "#fff", borderRadius: 28, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 17, fontWeight: "700", color: "#2E4057", marginBottom: 4 },
  cardSub: { fontSize: 13, color: "#9CA3AF", marginBottom: 16 },
  moodRow: { flexDirection: "row", gap: 6, justifyContent: "space-between", marginBottom: 16 },
  moodBtn: {
    flex: 1, alignItems: "center", padding: 10, borderRadius: 20,
    backgroundColor: "#F9FAFB",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  moodLabel: { fontSize: 9, color: "#6B7280", textAlign: "center", fontWeight: "500" },
  noteInput: {
    backgroundColor: "#F9FAFB", borderRadius: 16, padding: 12, fontSize: 14, color: "#2E4057",
    textAlignVertical: "top", marginBottom: 14, minHeight: 60,
  },
  saveBtn: {
    backgroundColor: "#8CB8E8", borderRadius: 20, padding: 14,
    alignItems: "center",
    shadowColor: "#8CB8E8", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 3,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  successBox: { alignItems: "center", paddingVertical: 20, gap: 10 },
  successText: { fontSize: 18, fontWeight: "700", color: "#10B981" },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  statBox: {
    flex: 1, backgroundColor: "#fff", borderRadius: 20, padding: 14, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  statValue: { fontSize: 20, fontWeight: "700", color: "#2E4057", marginTop: 4 },
  statLabel: { fontSize: 11, color: "#9CA3AF" },
  weekChart: { flexDirection: "row", alignItems: "flex-end", height: 110, gap: 6, justifyContent: "space-around", marginTop: 12 },
  dayBar: { flex: 1, alignItems: "center", gap: 4 },
  dayBarFill: { width: "100%", borderRadius: 6, minHeight: 8 },
  dayLabel: { fontSize: 9, color: "#9CA3AF" },
  historyRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  historyMood: { fontSize: 14, fontWeight: "600", color: "#2E4057" },
  historyDate: { fontSize: 11, color: "#9CA3AF", marginTop: 1 },
  historyNote: { fontSize: 12, color: "#6B7280", marginTop: 2, fontStyle: "italic" },
  moodDot: { width: 10, height: 10, borderRadius: 5 },
});
