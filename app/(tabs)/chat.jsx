/**
 * Sakina — Chat IA Thérapeutique
 * Interface conversationnelle avec moteur de psychologie clinique
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
  ScrollView, Alert, Linking, Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { base44 } from "../../src/api/base44Client";
import {
  Send, Sparkles, AlertTriangle, Heart, Brain,
} from "lucide-react-native";
import {
  buildTherapeuticContext,
  buildTherapySystemPrompt,
  detectCognitiveDistortions,
  detectCrisis,
  extractAndSaveMemories,
  determineSessionPhase,
  getContextualSuggestions,
  CRISIS_PATTERNS,
  EMOTIONAL_STATES,
} from "../../src/engine/therapyEngine";

// ─── Composants UI ───────────────────────────────────────────────────────────

function MessageBubble({ message }) {
  const isUser = message.isUser;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bubbleRow,
        isUser && styles.bubbleRowUser,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {!isUser && (
        <View style={styles.avatarBot}>
          <Text style={{ fontSize: 15 }}>✨</Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
        {message.technique && (
          <View style={styles.techniqueBadge}>
            <Text style={styles.techniqueText}>{message.technique}</Text>
          </View>
        )}
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
          {message.text}
        </Text>
        <View style={styles.bubbleMeta}>
          {message.emotion && !isUser && (
            <Text style={styles.emotionTag}>{message.emotion}</Text>
          )}
          <Text style={[styles.bubbleTime, isUser && { color: "rgba(255,255,255,0.6)" }]}>
            {message.time}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0.4)).current;
  const dot2 = useRef(new Animated.Value(0.4)).current;
  const dot3 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animate = (dot, delay) => Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0.4, duration: 400, useNativeDriver: true }),
      ])
    ).start();
    animate(dot1, 0); animate(dot2, 200); animate(dot3, 400);
  }, []);

  return (
    <View style={styles.bubbleRow}>
      <View style={styles.avatarBot}><Text style={{ fontSize: 15 }}>✨</Text></View>
      <View style={[styles.bubble, styles.bubbleBot, { paddingVertical: 14 }]}>
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          {[dot1, dot2, dot3].map((d, i) => (
            <Animated.View key={i} style={[styles.typingDot, { opacity: d }]} />
          ))}
          <Text style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 6 }}>Sakina réfléchit...</Text>
        </View>
      </View>
    </View>
  );
}

function CrisisAlert({ crisis, onDismiss }) {
  if (!crisis) return null;
  return (
    <View style={styles.crisisAlert}>
      <View style={styles.crisisHeader}>
        <AlertTriangle size={18} color="#EF4444" />
        <Text style={styles.crisisTitle}>Besoin d'aide immédiate</Text>
        <TouchableOpacity onPress={onDismiss} style={{ padding: 4 }}>
          <Text style={{ color: "#EF4444", fontSize: 18 }}>×</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.crisisText}>{crisis.response?.split('\n')[0]}</Text>
      <TouchableOpacity
        style={styles.crisisBtn}
        onPress={() => Linking.openURL(`tel:${crisis.hotline || '3114'}`)}
      >
        <Text style={styles.crisisBtnText}>📞 Appeler le {crisis.hotline || '3114'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function SessionInsight({ insight, onClose }) {
  if (!insight) return null;
  return (
    <View style={styles.insightBanner}>
      <Brain size={14} color="#8B5CF6" />
      <Text style={styles.insightText} numberOfLines={2}>{insight}</Text>
      <TouchableOpacity onPress={onClose}><Text style={{ color: "#8B5CF6" }}>×</Text></TouchableOpacity>
    </View>
  );
}

// ─── Composant principal ─────────────────────────────────────────────────────

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [crisisAlert, setCrisisAlert] = useState(null);
  const [sessionInsight, setSessionInsight] = useState(null);
  const [userContext, setUserContext] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionMood, setSessionMood] = useState(null); // humeur détectée en session
  const flatRef = useRef(null);
  const messageCount = useRef(0);

  const formatTime = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  // ─── Initialisation : chargement du contexte + message d'ouverture ───────
  useEffect(() => {
    const init = async () => {
      try {
        const ctx = await buildTherapeuticContext();
        setUserContext(ctx);

        const contextualSuggestions = getContextualSuggestions(ctx.moodTrajectory, new Date().getHours());
        setSuggestions(contextualSuggestions.slice(0, 4));

        // Message d'ouverture personnalisé selon le contexte
        const openingMessage = generateOpeningMessage(ctx);
        setMessages([{
          id: "opening",
          text: openingMessage,
          isUser: false,
          time: formatTime(),
          technique: ctx.isFirstSession ? null : "Alliance thérapeutique",
        }]);
      } catch {
        setMessages([{
          id: "opening",
          text: "Bonjour 🌸\n\nJe suis Sakina, ton espace d'écoute bienveillant.\n\nComment tu vas aujourd'hui ?",
          isUser: false,
          time: formatTime(),
        }]);
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, []);

  const generateOpeningMessage = (ctx) => {
    if (ctx.isFirstSession) {
      return "Bonjour 🌸\n\nJe suis Sakina — ton espace de soutien psychologique personnalisé. Je suis ici pour t'écouter sans jugement, à ton rythme.\n\nComment tu te sens aujourd'hui ?";
    }

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bonjour" : "Bonsoir";
    const moodContext = ctx.moodTrajectory?.trend === 'dégradation'
      ? "J'ai remarqué que ces derniers jours semblent plus difficiles. "
      : ctx.moodTrajectory?.trend === 'amélioration'
      ? "Je vois que tu progresses — c'est vraiment bien. "
      : "";

    return `${greeting} 🌸\n\n${moodContext}Je suis là pour toi. Comment tu vas en ce moment ?`;
  };

  // ─── Envoi d'un message ──────────────────────────────────────────────────
  const sendMessage = useCallback(async (text = input.trim()) => {
    if (!text || isTyping) return;
    setInput("");
    setShowSuggestions(false);
    messageCount.current += 1;

    // Détecter une crise
    const crisis = detectCrisis(text);
    if (crisis && (crisis.level === 'CRISIS' || crisis.level === 'HIGH')) {
      setCrisisAlert(crisis);
    }

    // Détecter les distorsions cognitives
    const distortions = detectCognitiveDistortions(text);

    // Message utilisateur
    const userMsg = { id: `u-${Date.now()}`, text, isUser: true, time: formatTime() };
    setMessages(prev => [...prev, userMsg]);

    setIsTyping(true);
    try {
      // Phase de la session
      const phase = determineSessionPhase(messageCount.current);

      // Contexte enrichi
      const ctx = userContext || {};

      // Historique des 8 derniers messages pour le contexte
      const history = messages.slice(-8).map(m =>
        `${m.isUser ? "Utilisateur" : "Sakina"}: ${m.text}`
      ).join("\n");

      // Prompt système thérapeutique
      const systemPrompt = buildTherapySystemPrompt(ctx, phase, distortions);

      // Appel LLM avec prompt clinique
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}

═══════════════════════════════════════════
HISTORIQUE DE LA SESSION ACTUELLE
═══════════════════════════════════════════
${history}

Utilisateur: ${text}

Sakina:`,
      });

      const aiText = typeof response === 'string' ? response : response?.response || response?.text || "Je suis là pour toi. Continue... 💙";

      // Détecter la technique utilisée (pour l'affichage discret)
      const technique = detectTechniqueUsed(aiText);

      const botMsg = {
        id: `a-${Date.now()}`,
        text: aiText,
        isUser: false,
        time: formatTime(),
        technique: technique || undefined,
      };
      setMessages(prev => [...prev, botMsg]);

      // Sauvegarder la conversation + extraire les mémoires en arrière-plan
      Promise.all([
        base44.entities.Conversation.create({
          user_message: text,
          ai_response: aiText,
        }).catch(() => {}),
        extractAndSaveMemories(text, aiText),
      ]);

      // Afficher un insight discret si une distorsion a été identifiée
      if (distortions.length > 0) {
        setSessionInsight(`💡 Sakina a identifié : ${distortions[0].name}`);
        setTimeout(() => setSessionInsight(null), 6000);
      }

    } catch (err) {
      console.error("Chat error:", err);
      const fallback = getFallbackResponse(messageCount.current);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        text: fallback,
        isUser: false,
        time: formatTime(),
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, messages, userContext]);

  // Scroll automatique
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 150);
    }
  }, [messages, isTyping]);

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const detectTechniqueUsed = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('respir') && lower.includes('seconde')) return 'Mindfulness';
    if (lower.includes('qu\'est-ce que tu remarques') || lower.includes('observ')) return 'Pleine conscience';
    if (lower.includes('pense') && lower.includes('vrai')) return 'Restructuration cognitive';
    if (lower.includes('valeur') || lower.includes('ce qui compte')) return 'ACT — Valeurs';
    if (lower.includes('toléranc') || lower.includes('accepte')) return 'Tolérance à la détresse';
    if (lower.includes('gratitud')) return 'Psychologie positive';
    if (lower.includes('force') || lower.includes('capaci')) return 'Entretien motivationnel';
    return null;
  };

  const getFallbackResponse = (count) => {
    const fallbacks = [
      "Je t'entends. Peux-tu me dire un peu plus ce que tu ressens en ce moment ? 💙",
      "Merci de partager ça avec moi. C'est courageux. Qu'est-ce qui se passe pour toi là ?",
      "Je suis là. Prends le temps qu'il te faut pour trouver les mots. 🌸",
    ];
    return fallbacks[count % fallbacks.length];
  };

  // ─── Rendu ────────────────────────────────────────────────────────────────

  if (isInitializing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F0F6FC", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 36, marginBottom: 16 }}>✨</Text>
        <ActivityIndicator size="large" color="#7BA9D8" />
        <Text style={{ color: "#9CA3AF", marginTop: 12, fontSize: 14 }}>Sakina se prépare pour toi...</Text>
      </SafeAreaView>
    );
  }

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
            <View style={styles.statusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusText}>
                {isTyping ? "En train de répondre..." : "Psychologue IA · En ligne"}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.approachBadge}>
            <Brain size={12} color="#8B5CF6" />
            <Text style={styles.approachText}>CBT · ACT · DBT</Text>
          </View>
        </View>
      </View>

      {/* Alerte de crise */}
      <CrisisAlert crisis={crisisAlert} onDismiss={() => setCrisisAlert(null)} />

      {/* Insight de session */}
      <SessionInsight insight={sessionInsight} onClose={() => setSessionInsight(null)} />

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

        {/* Suggestions contextuelles */}
        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsWrapper}>
            <Text style={styles.suggestionsLabel}>Suggestions</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            >
              {suggestions.map((s, i) => (
                <TouchableOpacity key={i} style={styles.suggestionChip} onPress={() => sendMessage(s)}>
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Barre de saisie */}
        <View style={styles.inputBar}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Exprime-toi librement..."
              placeholderTextColor="#9CA3AF"
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={2000}
              onFocus={() => setShowSuggestions(false)}
              onSubmitEditing={() => sendMessage()}
              returnKeyType="send"
              blurOnSubmit={false}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || isTyping) && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            activeOpacity={0.85}
          >
            {isTyping
              ? <ActivityIndicator size="small" color="#fff" />
              : <Send size={18} color="#fff" />
            }
          </TouchableOpacity>
        </View>

        {/* Numéros d'urgence discrets */}
        <View style={styles.emergencyBar}>
          <TouchableOpacity onPress={() => Linking.openURL("tel:3114")} style={styles.emergencyItem}>
            <Text style={styles.emergencyText}>🆘 3114</Text>
          </TouchableOpacity>
          <View style={styles.emergencyDivider} />
          <TouchableOpacity onPress={() => Linking.openURL("tel:15")} style={styles.emergencyItem}>
            <Text style={styles.emergencyText}>🏥 15 SAMU</Text>
          </TouchableOpacity>
          <View style={styles.emergencyDivider} />
          <TouchableOpacity onPress={() => Linking.openURL("tel:3919")} style={styles.emergencyItem}>
            <Text style={styles.emergencyText}>💜 3919</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1, borderBottomColor: "#EEF2F7",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerAvatar: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: "#E8F1F8", alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#7BA9D8",
  },
  headerName: { fontSize: 15, fontWeight: "700", color: "#2E4057" },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 1 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#10B981" },
  statusText: { fontSize: 10, color: "#6B7280" },
  headerRight: { alignItems: "flex-end" },
  approachBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#EDE7F6", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4,
  },
  approachText: { fontSize: 9, color: "#8B5CF6", fontWeight: "700" },
  crisisAlert: {
    backgroundColor: "#FFF0F0", borderBottomWidth: 2, borderBottomColor: "#EF4444",
    paddingHorizontal: 16, paddingVertical: 12,
  },
  crisisHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  crisisTitle: { flex: 1, fontSize: 13, fontWeight: "700", color: "#DC2626" },
  crisisText: { fontSize: 12, color: "#6B7280", marginBottom: 8, lineHeight: 17 },
  crisisBtn: {
    backgroundColor: "#EF4444", borderRadius: 12, paddingVertical: 10,
    paddingHorizontal: 16, alignSelf: "flex-start",
  },
  crisisBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  insightBanner: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#EDE7F6", paddingHorizontal: 16, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: "#DDD6FE",
  },
  insightText: { flex: 1, fontSize: 11, color: "#8B5CF6" },
  messagesList: { paddingHorizontal: 14, paddingVertical: 12, gap: 10, paddingBottom: 4 },
  bubbleRow: { flexDirection: "row", alignItems: "flex-end", gap: 7, marginBottom: 2 },
  bubbleRowUser: { flexDirection: "row-reverse" },
  avatarBot: {
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: "#E8F1F8", alignItems: "center", justifyContent: "center",
    marginBottom: 2,
  },
  bubble: {
    maxWidth: "78%", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  bubbleBot: { backgroundColor: "#FFFFFF", borderBottomLeftRadius: 5 },
  bubbleUser: { backgroundColor: "#7BA9D8", borderBottomRightRadius: 5 },
  techniqueBadge: {
    backgroundColor: "rgba(139,92,246,0.1)", borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 2, alignSelf: "flex-start", marginBottom: 6,
  },
  techniqueText: { fontSize: 9, color: "#8B5CF6", fontWeight: "600" },
  bubbleText: { fontSize: 14, color: "#2E4057", lineHeight: 21 },
  bubbleTextUser: { color: "#FFFFFF" },
  bubbleMeta: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: 4, gap: 6 },
  emotionTag: { fontSize: 9, color: "#8B5CF6", backgroundColor: "rgba(139,92,246,0.08)", borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1 },
  bubbleTime: { fontSize: 9, color: "#9CA3AF" },
  typingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#7BA9D8" },
  suggestionsWrapper: { paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#F0F4F8" },
  suggestionsLabel: { fontSize: 10, color: "#9CA3AF", paddingHorizontal: 16, marginBottom: 6 },
  suggestionChip: {
    backgroundColor: "#E8F1F8", borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: "rgba(123,169,216,0.3)",
  },
  suggestionText: { color: "#7BA9D8", fontSize: 12, fontWeight: "500" },
  inputBar: {
    flexDirection: "row", alignItems: "flex-end", gap: 10,
    paddingHorizontal: 14, paddingTop: 10, paddingBottom: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1, borderTopColor: "#EEF2F7",
  },
  inputWrapper: {
    flex: 1, backgroundColor: "#F3F4F6", borderRadius: 24,
    paddingHorizontal: 16, paddingVertical: 10, maxHeight: 120,
    borderWidth: 1, borderColor: "#E5E7EB",
  },
  input: { fontSize: 14, color: "#2E4057", maxHeight: 100 },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#7BA9D8", alignItems: "center", justifyContent: "center",
    shadowColor: "#7BA9D8", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 6, elevation: 4,
  },
  sendBtnDisabled: { backgroundColor: "#C5D9F0", shadowOpacity: 0 },
  emergencyBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 6, backgroundColor: "#FAFAFA",
    borderTopWidth: 1, borderTopColor: "#F3F4F6",
  },
  emergencyItem: { paddingHorizontal: 14, paddingVertical: 3 },
  emergencyText: { fontSize: 10, color: "#9CA3AF" },
  emergencyDivider: { width: 1, height: 12, backgroundColor: "#E5E7EB" },
});
