import React, { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, Phone, Mail, Star } from "lucide-react-native";

const PROFESSIONALS = [
  {
    id: "1", name: "Dr. Amina Benali", specialty: "Psychologue clinicienne",
    description: "Spécialisée en TCC, anxiété et dépression.",
    rating: 4.9, reviews: 87, phone: "+33 1 23 45 67 89",
    email: "a.benali@psy-paris.fr", avatar: "👩‍⚕️", available: true,
    tags: ["TCC", "Anxiété", "Dépression"],
  },
  {
    id: "2", name: "Dr. Karim Okoye", specialty: "Psychiatre",
    description: "Spécialiste des troubles de l'humeur et addictions.",
    rating: 4.8, reviews: 124, phone: "+33 1 98 76 54 32",
    email: "k.okoye@psychiatre.fr", avatar: "👨‍⚕️", available: false,
    tags: ["Bipolarité", "Addictions", "Dépression"],
  },
  {
    id: "3", name: "Sarah Lefebvre", specialty: "Psychothérapeute",
    description: "Approche humaniste et thérapie de soutien.",
    rating: 4.7, reviews: 56, phone: "+33 6 12 34 56 78",
    email: "sarah.l@therapie.fr", avatar: "👩‍💼", available: true,
    tags: ["Soutien", "Trauma", "Relations"],
  },
];

const FILTERS = ["Tous", "Psychologue", "Psychiatre", "Thérapeute"];

export default function Professionnels() {
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filtered = activeFilter === "Tous"
    ? PROFESSIONALS
    : PROFESSIONALS.filter(p => p.specialty.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Professionnels</Text>
            <Text style={styles.headerSub}>Trouvez un soutien qualifié</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 16, gap: 16 }}>
          {/* Emergency banner */}
          <View style={styles.emergencyBanner}>
            <Text style={styles.emergencyTitle}>🆘 Besoin urgent ?</Text>
            <Text style={styles.emergencyText}>Numéro national prévention suicide : </Text>
            <TouchableOpacity onPress={() => Linking.openURL("tel:3114")}>
              <Text style={styles.emergencyNumber}>📞 3114 (gratuit, 24h/24)</Text>
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Professionals list */}
          {filtered.map(pro => (
            <View key={pro.id} style={styles.proCard}>
              <View style={styles.proHeader}>
                <View style={styles.proAvatar}>
                  <Text style={{ fontSize: 36 }}>{pro.avatar}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.proName}>{pro.name}</Text>
                  <Text style={styles.proSpecialty}>{pro.specialty}</Text>
                  <View style={styles.ratingRow}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.ratingText}>{pro.rating} ({pro.reviews} avis)</Text>
                    <View style={[styles.availBadge, { backgroundColor: pro.available ? "#D1FAE5" : "#FEF3C7" }]}>
                      <Text style={[styles.availText, { color: pro.available ? "#059669" : "#D97706" }]}>
                        {pro.available ? "Disponible" : "Bientôt libre"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <Text style={styles.proDesc}>{pro.description}</Text>

              <View style={styles.tagRow}>
                {pro.tags.map((tag, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.contactRow}>
                <TouchableOpacity
                  style={[styles.contactBtn, { backgroundColor: "#E8F1F8" }]}
                  onPress={() => Linking.openURL(`tel:${pro.phone}`)}
                >
                  <Phone size={16} color="#7BA9D8" />
                  <Text style={styles.contactBtnText}>Appeler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.contactBtn, { backgroundColor: "#E8F4F0" }]}
                  onPress={() => Linking.openURL(`mailto:${pro.email}`)}
                >
                  <Mail size={16} color="#10B981" />
                  <Text style={[styles.contactBtnText, { color: "#10B981" }]}>E-mail</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  emergencyBanner: {
    backgroundColor: "#FEF2F2", borderRadius: 20, padding: 16,
    borderLeftWidth: 4, borderLeftColor: "#EF4444",
  },
  emergencyTitle: { fontSize: 15, fontWeight: "700", color: "#DC2626", marginBottom: 4 },
  emergencyText: { fontSize: 13, color: "#6B7280" },
  emergencyNumber: { fontSize: 14, fontWeight: "700", color: "#EF4444", marginTop: 2 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  filterChipActive: { backgroundColor: "#7BA9D8" },
  filterText: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  filterTextActive: { color: "#fff", fontWeight: "600" },
  proCard: {
    backgroundColor: "#fff", borderRadius: 28, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  proHeader: { flexDirection: "row", gap: 14, marginBottom: 12 },
  proAvatar: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center",
  },
  proName: { fontSize: 17, fontWeight: "700", color: "#2E4057", marginBottom: 2 },
  proSpecialty: { fontSize: 13, color: "#7BA9D8", fontWeight: "500", marginBottom: 6 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  ratingText: { fontSize: 11, color: "#6B7280" },
  availBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  availText: { fontSize: 10, fontWeight: "600" },
  proDesc: { fontSize: 13, color: "#6B7280", lineHeight: 18, marginBottom: 12 },
  tagRow: { flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 14 },
  tag: { backgroundColor: "#E8F1F8", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  tagText: { color: "#7BA9D8", fontSize: 11, fontWeight: "600" },
  contactRow: { flexDirection: "row", gap: 12 },
  contactBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 16, padding: 12 },
  contactBtnText: { color: "#7BA9D8", fontSize: 13, fontWeight: "600" },
});
