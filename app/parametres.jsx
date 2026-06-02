import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Parametres() {
  const [notifications, setNotifications] = useState({
    daily_reminder: true,
    mood_reminder: true,
    sleep_reminder: false,
    achievements: true,
  });
  const [darkMode, setDarkMode] = useState(false);

  const toggleNotif = async (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    await AsyncStorage.setItem("sakina-notifications", JSON.stringify(updated));
  };

  const toggleDark = async () => {
    setDarkMode(!darkMode);
    await AsyncStorage.setItem("sakina-theme", darkMode ? "light" : "dark");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Paramètres</Text>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 20, gap: 16 }}>
          {/* Apparence */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Apparence</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={{ fontSize: 22 }}>🌙</Text>
                <View>
                  <Text style={styles.settingTitle}>Mode sombre</Text>
                  <Text style={styles.settingDesc}>Activer le thème sombre</Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={toggleDark}
                trackColor={{ false: "#F3F4F6", true: "#7BA9D8" }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            {[
              { key: "daily_reminder", emoji: "🌅", title: "Rappel quotidien", desc: "Check-in du matin" },
              { key: "mood_reminder", emoji: "😊", title: "Rappel humeur", desc: "Enregistre ton humeur" },
              { key: "sleep_reminder", emoji: "🌙", title: "Rappel sommeil", desc: "N'oublie pas de noter ton sommeil" },
              { key: "achievements", emoji: "🏆", title: "Succès débloqués", desc: "Reçois tes notifications de succès" },
            ].map(n => (
              <View key={n.key} style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Text style={{ fontSize: 22 }}>{n.emoji}</Text>
                  <View>
                    <Text style={styles.settingTitle}>{n.title}</Text>
                    <Text style={styles.settingDesc}>{n.desc}</Text>
                  </View>
                </View>
                <Switch
                  value={notifications[n.key]}
                  onValueChange={() => toggleNotif(n.key)}
                  trackColor={{ false: "#F3F4F6", true: "#7BA9D8" }}
                  thumbColor="#fff"
                />
              </View>
            ))}
          </View>

          {/* Support */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Support</Text>
            {[
              { emoji: "❓", title: "Aide & FAQ", action: () => Alert.alert("Aide", "Consulte notre FAQ sur sakina.app/help") },
              { emoji: "📧", title: "Contacter le support", action: () => Alert.alert("Support", "support@sakina.app") },
              { emoji: "⭐", title: "Évaluer l'app", action: () => Alert.alert("Merci !", "Ça nous aide beaucoup 🙏") },
              { emoji: "🔒", title: "Politique de confidentialité", action: () => {} },
              { emoji: "📋", title: "Conditions d'utilisation", action: () => {} },
            ].map((item, i) => (
              <TouchableOpacity key={i} style={styles.linkRow} onPress={item.action}>
                <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
                <Text style={styles.linkText}>{item.title}</Text>
                <Text style={styles.linkArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.versionBox}>
            <Text style={styles.versionText}>Sakina v1.0.0</Text>
            <Text style={styles.versionSub}>Fait avec 💙 pour ton bien-être</Text>
          </View>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#7BA9D8", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    flexDirection: "row", alignItems: "center", gap: 14,
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "700" },
  card: {
    backgroundColor: "#fff", borderRadius: 28, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#2E4057", marginBottom: 16 },
  settingRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#F9FAFB",
  },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  settingTitle: { fontSize: 14, fontWeight: "600", color: "#2E4057" },
  settingDesc: { fontSize: 11, color: "#9CA3AF", marginTop: 1 },
  linkRow: {
    flexDirection: "row", alignItems: "center", gap: 14,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F9FAFB",
  },
  linkText: { flex: 1, fontSize: 14, color: "#2E4057", fontWeight: "500" },
  linkArrow: { fontSize: 20, color: "#9CA3AF" },
  versionBox: { alignItems: "center", paddingVertical: 16 },
  versionText: { fontSize: 14, color: "#9CA3AF" },
  versionSub: { fontSize: 12, color: "#C4C4C4", marginTop: 4 },
});
