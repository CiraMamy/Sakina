import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 64, marginBottom: 20 }}>🌸</Text>
      <Text style={styles.title}>Page introuvable</Text>
      <Text style={styles.desc}>Cette page n'existe pas encore.</Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.replace("/(tabs)/")}>
        <Text style={styles.btnText}>Retour à l'accueil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FAFAFA", padding: 40 },
  title: { fontSize: 24, fontWeight: "700", color: "#2E4057", marginBottom: 8 },
  desc: { fontSize: 15, color: "#9CA3AF", marginBottom: 32, textAlign: "center" },
  btn: { backgroundColor: "#7BA9D8", borderRadius: 20, paddingHorizontal: 28, paddingVertical: 14 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
