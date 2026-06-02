import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, Alert, Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "../src/api/base44Client";
import { ArrowLeft, Plus, Trash2, Edit, X, Check } from "lucide-react-native";

export default function Journal() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["journal"],
    queryFn: () => base44.entities.JournalEntry.list("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.JournalEntry.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.JournalEntry.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.JournalEntry.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journal"] }),
  });

  const resetForm = () => {
    setTitle(""); setContent(""); setEditingEntry(null); setShowEditor(false);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    const data = { title: title.trim() || "Sans titre", content };
    if (editingEntry) {
      updateMutation.mutate({ id: editingEntry.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setShowEditor(true);
  };

  const handleDelete = (id) => {
    Alert.alert("Supprimer ?", "Cette entrée sera définitivement supprimée.", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Journal</Text>
          <Text style={styles.headerSub}>Espace d'écriture libre</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowEditor(true)}>
          <Plus size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 12 }} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <Text style={styles.emptyText}>Chargement...</Text>
        ) : entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 48 }}>📖</Text>
            <Text style={styles.emptyTitle}>Ton journal est vide</Text>
            <Text style={styles.emptyText}>Commence à écrire tes pensées, émotions et réflexions.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setShowEditor(true)}>
              <Text style={styles.emptyBtnText}>Écrire ma première entrée</Text>
            </TouchableOpacity>
          </View>
        ) : (
          entries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle} numberOfLines={1}>{entry.title}</Text>
                <View style={styles.entryActions}>
                  <TouchableOpacity onPress={() => handleEdit(entry)} style={styles.actionBtn}>
                    <Edit size={16} color="#7BA9D8" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(entry.id)} style={[styles.actionBtn, { backgroundColor: "#FEF2F2" }]}>
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.entryDate}>{formatDate(entry.created_date)}</Text>
              <Text style={styles.entryContent} numberOfLines={3}>{entry.content}</Text>
            </View>
          ))
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Editor Modal */}
      <Modal visible={showEditor} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editingEntry ? "Modifier" : "Nouvelle entrée"}</Text>
            <TouchableOpacity onPress={resetForm}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
            <TextInput
              style={styles.titleInput}
              placeholder="Titre (optionnel)"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <TextInput
              style={styles.contentInput}
              placeholder="Écris tes pensées ici..."
              placeholderTextColor="#9CA3AF"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              autoFocus
            />
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
              <Text style={styles.cancelBtnText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, !content.trim() && { opacity: 0.5 }]}
              onPress={handleSubmit}
              disabled={!content.trim()}
            >
              <Text style={styles.saveBtnText}>
                {editingEntry ? "Mettre à jour" : "Enregistrer"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#8CB8E8", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    flexDirection: "row", alignItems: "center", gap: 14,
  },
  backBtn: { padding: 4 },
  addBtn: {
    width: 40, height: 40, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center",
  },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#2E4057" },
  emptyText: { color: "#9CA3AF", fontSize: 14, textAlign: "center" },
  emptyBtn: { marginTop: 8, backgroundColor: "#8CB8E8", borderRadius: 20, paddingHorizontal: 24, paddingVertical: 12 },
  emptyBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  entryCard: {
    backgroundColor: "#fff", borderRadius: 24, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  entryHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  entryTitle: { fontSize: 16, fontWeight: "700", color: "#2E4057", flex: 1 },
  entryActions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: "rgba(123,169,216,0.1)", alignItems: "center", justifyContent: "center",
  },
  entryDate: { fontSize: 11, color: "#9CA3AF", marginBottom: 8 },
  entryContent: { fontSize: 14, color: "#6B7280", lineHeight: 20 },
  modalHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#2E4057" },
  titleInput: {
    fontSize: 18, fontWeight: "700", color: "#2E4057",
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", marginBottom: 16,
  },
  contentInput: {
    fontSize: 16, color: "#2E4057", lineHeight: 26,
    minHeight: 300,
  },
  modalFooter: {
    flexDirection: "row", gap: 12, padding: 20,
    borderTopWidth: 1, borderTopColor: "#F3F4F6",
  },
  cancelBtn: { flex: 1, borderRadius: 20, padding: 14, alignItems: "center", backgroundColor: "#F3F4F6" },
  cancelBtnText: { color: "#6B7280", fontSize: 15, fontWeight: "600" },
  saveBtn: { flex: 2, borderRadius: 20, padding: 14, alignItems: "center", backgroundColor: "#8CB8E8" },
  saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
