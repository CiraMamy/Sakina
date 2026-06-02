import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "../../src/api/base44Client";
import {
  Bell, Lock, Heart, HelpCircle, LogOut, ChevronRight,
  Edit2, Trophy, Star, Flame, Zap, Check, X, Settings,
} from "lucide-react-native";

function SettingItem({ emoji, title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Text style={{ fontSize: 20 }}>{emoji}</Text>
        </View>
        <View>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <ChevronRight size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

export default function Profil() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: progress } = useQuery({
    queryKey: ["userProgress"],
    queryFn: () => base44.entities.UserProgress.list(),
  });

  const { data: achievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: () => base44.entities.Achievement.list(),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setIsEditing(false);
    },
  });

  const prog = progress?.[0];
  const userName = user?.full_name || "Utilisateur";
  const initials = userName.charAt(0).toUpperCase();
  const unlockedCount = achievements?.filter((a) => a.unlocked)?.length || 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
          <Text style={styles.headerSub}>Gérer ton compte et préférences</Text>
        </View>

        {/* Profile card */}
        <View style={{ paddingHorizontal: 20, marginTop: -48 }}>
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View>
                <View style={styles.avatarBig}>
                  <Text style={styles.avatarBigLetter}>{initials}</Text>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{prog?.current_level || 1}</Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                {isEditing ? (
                  <View style={styles.editRow}>
                    <TextInput
                      style={styles.nameInput}
                      value={editedName}
                      onChangeText={setEditedName}
                      autoFocus
                    />
                    <TouchableOpacity onPress={() => updateMutation.mutate({ full_name: editedName })} style={styles.editBtn}>
                      <Check size={16} color="#8CB8E8" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsEditing(false)} style={[styles.editBtn, { backgroundColor: "#FEF2F2" }]}>
                      <X size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.nameRow}>
                    <Text style={styles.profileName}>{userName}</Text>
                    <TouchableOpacity onPress={() => { setEditedName(userName); setIsEditing(true); }}>
                      <Edit2 size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                )}
                <View style={styles.levelPill}>
                  <Text style={styles.levelPillText}>Niveau {prog?.current_level || 1} · {prog?.total_points || 0} pts</Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              {[
                { emoji: "🔥", value: prog?.current_streak || 0, label: "Série" },
                { emoji: "⭐", value: unlockedCount, label: "Succès" },
                { emoji: "💬", value: prog?.total_chat_sessions || 0, label: "Sessions" },
              ].map((s, i) => (
                <View key={i} style={styles.statBox}>
                  <Text style={{ fontSize: 20 }}>{s.emoji}</Text>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Settings list */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mon espace</Text>
            <View style={styles.settingsList}>
              <SettingItem emoji="🏆" title="Récompenses" subtitle="Badges & niveaux" onPress={() => router.push("/recompenses")} />
              <SettingItem emoji="🎯" title="Mes objectifs" subtitle="Gérer mes buts" onPress={() => router.push("/preferences")} />
              <SettingItem emoji="📊" title="Tendances" subtitle="Analyser mon évolution" onPress={() => router.push("/tendances")} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Paramètres</Text>
            <View style={styles.settingsList}>
              <SettingItem emoji="🔔" title="Notifications" onPress={() => router.push("/parametres")} />
              <SettingItem emoji="🎨" title="Apparence" subtitle="Thème sombre / clair" onPress={() => router.push("/parametres")} />
              <SettingItem emoji="🔒" title="Confidentialité" onPress={() => Alert.alert("Confidentialité", "Tes données sont sécurisées.")} />
              <SettingItem emoji="❓" title="Aide & Support" onPress={() => Alert.alert("Support", "Contacte-nous à support@sakina.app")} />
            </View>
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => Alert.alert("Déconnexion", "Es-tu sûr(e) ?", [
              { text: "Annuler", style: "cancel" },
              { text: "Déconnecter", style: "destructive", onPress: () => base44.auth.logout?.() },
            ])}
          >
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#7BA9D8", paddingHorizontal: 20,
    paddingTop: 16, paddingBottom: 72,
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
  },
  headerTitle: { color: "#fff", fontSize: 28, fontWeight: "700", marginBottom: 4 },
  headerSub: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  profileCard: {
    backgroundColor: "#fff", borderRadius: 28, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4,
    marginBottom: 20,
  },
  profileRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 20 },
  avatarBig: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: "#7BA9D8", alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  avatarBigLetter: { color: "#fff", fontSize: 28, fontWeight: "700" },
  levelBadge: {
    position: "absolute", bottom: -4, right: -4,
    width: 24, height: 24, borderRadius: 8,
    backgroundColor: "#F97316", alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#fff",
  },
  levelText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  editRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  nameInput: {
    flex: 1, backgroundColor: "#F9FAFB", borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 6, fontSize: 18, fontWeight: "700", color: "#2E4057",
  },
  editBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: "rgba(140,184,232,0.15)", alignItems: "center", justifyContent: "center",
  },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  profileName: { fontSize: 20, fontWeight: "700", color: "#2E4057" },
  levelPill: {
    backgroundColor: "#E8F1F8", borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start",
  },
  levelPillText: { color: "#7BA9D8", fontSize: 12, fontWeight: "600" },
  statsRow: { flexDirection: "row", gap: 12 },
  statBox: {
    flex: 1, alignItems: "center", backgroundColor: "#F9FAFB",
    borderRadius: 16, paddingVertical: 12,
  },
  statValue: { fontSize: 20, fontWeight: "700", color: "#2E4057", marginTop: 2 },
  statLabel: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#2E4057", marginBottom: 12 },
  settingsList: { gap: 8 },
  settingItem: {
    backgroundColor: "#fff", borderRadius: 20, padding: 14,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  settingIcon: {
    width: 44, height: 44, borderRadius: 16,
    backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center",
  },
  settingTitle: { fontSize: 14, fontWeight: "600", color: "#2E4057" },
  settingSubtitle: { fontSize: 12, color: "#9CA3AF", marginTop: 1 },
  logoutBtn: {
    backgroundColor: "#FEF2F2", borderRadius: 20, padding: 16,
    alignItems: "center", marginBottom: 8,
  },
  logoutText: { color: "#EF4444", fontSize: 15, fontWeight: "600" },
});
