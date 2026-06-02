import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
  ScrollView, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { base44 } from "../../src/api/base44Client";
import { Send, Mic, Sparkles, X } from "lucide-react-native";

const SMART_SUGGESTIONS = [
  "Je me sens anxieux(se)",
  "J'ai du mal à dormir",
  "Je veux parler de mes émotions",
  "Comment réduire mon stress ?",
  "Je me sens seul(e)",
];

const CRISIS_KEYWORDS = [
  "suicid", "mourir", "en finir", "plus envie de vivre",
  "me tuer", "me faire du mal", "disparaître",
];

function MessageBubble({ message }) {
  const isUser = message.isUser;
  return (
    <View style={[styles.bubbleRow, isUser && styles.bubbleRowUser]}>
      {!isUser && (
        <View style={styles.avatarBot}>
          <Text style={{ fontSize: 16 }}>✨</Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
          {message.text}
        </Text>
        <Text style={[styles.bubbleTime, isUser && { color: "rgba(255,255,255,0.6)" }]}>
          {message.time}
        </Text>
      </View>
    </View>
  );
}

function TypingIndicator() {
  return (
    <View style={styles.bubbleRow}>
      <View style={styles.avatarBot}>
        <Text style={{ fontSize: 16 }}>✨</Text>
      </View>
      <View style={[styles.bubble, styles.bubbleBot, styles.typingBubble]}>
        <View style={styles.typingDots}>
          {[0, 1, 2].map(i => (
            <View key={i} style={styles.typingDot} />
          ))}
        </View>
      </View>
    </View>
  );
}

const getUserContext = async () => {
  try {
    const [moodEntries, sleepEntries, goals] = await Promise.all([
      base44.entities.MoodEntry.list("-entry_date", 5).catch(() => []),
      base44.entities.SleepEntry.list("-sleep_date", 3).catch(() => []),
      base44.entities.UserGoal.list().catch(() => []),
    ]);
    const latestMood = moodEntries[0];
    const avgSleep = sleepEntries.length > 0
      ? (sleepEntries.reduce((s, e) => s + (e.sleep_quality || 0), 0) / sleepEntries.length).toFixed(1)
      : null;
    const activeGoals = goals.filter(g => g.is_active && !g.completed).map(g => g.title);
    return {
      latestMood: latestMood ? `${latestMood.mood_label || latestMood.mood_value}/5 (${latestMood.entry_date})` : "non renseigné",
      avgSleep: avgSleep ? `${avgSleep}/5` : "non renseigné",
      activeGoals: activeGoals.join(", ") || "aucun",
    };
  } catch {
    return {};
  }
};

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: "init",
      text: "Bonjour 🌸\n\nComment tu vas aujourd'hui ?",
      isUser: false,
      time: "À l'instant",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const flatRef = useRef(null);

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  const detectCrisis = (text) => {
    const lower = text.toLowerCase();
    return CRISIS_KEYWORDS.some(kw => lower.includes(kw));
  };

  const sendMessage = async (text = input.trim()) => {
    if (!text) return;
    setInput("");
    setShowSuggestions(false);

    // Detect crisis
    if (detectCrisis(text)) {
      Alert.alert(
        "🆘 Besoin d'aide immédiate ?",
        "Si tu traverses une crise, appelle le 3114 (numéro national de prévention du suicide, disponible 24h/24).",
        [
          { text: "Fermer", style: "cancel" },
          { text: "Appeler le 3114", style: "destructive", onPress: () => {} },
        ]
      );
    }

    const userMsg = {
      id: Date.now().toString(),
      text,
      isUser: true,
      time: formatTime(),
    };
    setMessages(prev => [...prev, userMsg]);

    setIsTyping(true);
    try {
      const ctx = await getUserContext();
      const history = messages
        .slice(-6)
        .map(m => `${m.isUser ? "Utilisateur" : "Sakina"}: ${m.text}`)
        .join("\n");

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es Sakina, une assistante IA bienveillante spécialisée en bien-être mental et accompagnement émotionnel. Tu parles en français, avec empathie, douceur et sans jugement. Tu adaptes ton ton au contexte émotionnel.

Contexte utilisateur:
- Dernière humeur: ${ctx.latestMood || "inconnue"}
- Qualité sommeil (moy.): ${ctx.avgSleep || "inconnue"}
- Objectifs actifs: ${ctx.activeGoals || "aucun"}

Historique récent:
${history}

Utilisateur: ${text}

Réponds de manière empathique, naturelle et utile. Max 3 paragraphes courts. Utilise occasionnellement des emojis doux (🌸 ✨ 💙).`,
      });

      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: response || "Je suis là pour toi. Dis-m'en plus. 💙",
        isUser: false,
        time: formatTime(),
      };

      // Save conversation
      try {
        await base44.entities.Conversation.create({
          user_message: text,
          ai_response: botMsg.text,
        });
      } catch {}

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errMsg = {
        id: (Date.now() + 1).toString(),
        text: "Désolée, je rencontre un problème technique. Tu peux réessayer ? 🌸",
        isUser: false,
        time: formatTime(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, isTyping]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F0F6FC" }} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}>
            <Text style={{ fontSize: 22 }}>✨</Text>
          </View>
          <View>
            <Text style={styles.headerName}>Sakina</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>En ligne</Text>
            </View>
          </View>
        </View>
        <Sparkles size={22} color="#7BA9D8" />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />

        {/* Smart suggestions */}
        {showSuggestions && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestionsScroll}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {SMART_SUGGESTIONS.map((s, i) => (
              <TouchableOpacity
                key={i}
                style={styles.suggestionChip}
                onPress={() => sendMessage(s)}
              >
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Écris un message..."
              placeholderTextColor="#9CA3AF"
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={1000}
              onFocus={() => setShowSuggestions(false)}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || isTyping}
          >
            {isTyping ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Send size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1, borderBottomColor: "#EEF2F7",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerAvatar: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: "#E8F1F8", alignItems: "center", justifyContent: "center",
  },
  headerName: { fontSize: 16, fontWeight: "700", color: "#2E4057" },
  onlineRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#10B981" },
  onlineText: { fontSize: 11, color: "#10B981", fontWeight: "500" },
  messagesList: { paddingHorizontal: 16, paddingVertical: 16, gap: 12 },
  bubbleRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  bubbleRowUser: { flexDirection: "row-reverse" },
  avatarBot: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: "#E8F1F8", alignItems: "center", justifyContent: "center",
  },
  bubble: {
    maxWidth: "78%", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  bubbleBot: { backgroundColor: "#FFFFFF", borderBottomLeftRadius: 6 },
  bubbleUser: { backgroundColor: "#7BA9D8", borderBottomRightRadius: 6 },
  typingBubble: { paddingVertical: 14 },
  bubbleText: { fontSize: 15, color: "#2E4057", lineHeight: 22 },
  bubbleTextUser: { color: "#FFFFFF" },
  bubbleTime: { fontSize: 10, color: "#9CA3AF", marginTop: 4, alignSelf: "flex-end" },
  typingDots: { flexDirection: "row", gap: 4 },
  typingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#9CA3AF" },
  suggestionsScroll: { maxHeight: 48, paddingVertical: 8 },
  suggestionChip: {
    backgroundColor: "#E8F1F8", borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  suggestionText: { color: "#7BA9D8", fontSize: 13, fontWeight: "500" },
  inputBar: {
    flexDirection: "row", alignItems: "flex-end", gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1, borderTopColor: "#EEF2F7",
  },
  inputWrapper: {
    flex: 1, backgroundColor: "#F3F4F6", borderRadius: 24,
    paddingHorizontal: 16, paddingVertical: 10, maxHeight: 120,
  },
  input: { fontSize: 15, color: "#2E4057", maxHeight: 100 },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#7BA9D8", alignItems: "center", justifyContent: "center",
    shadowColor: "#7BA9D8", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
  },
  sendBtnDisabled: { backgroundColor: "#C5D9F0" },
});
