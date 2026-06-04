/**
 * Sakina — Chat IA Thérapeutique (Version Web)
 * =============================================
 * Interface conversationnelle avec moteur de psychologie clinique
 * CBT · ACT · DBT · Entretien Motivationnel · Mindfulness
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, AlertTriangle, Brain, Phone, X, Heart } from 'lucide-react';
import { base44 } from '../api/base44Client';
import { toast } from 'sonner';
import {
  buildTherapeuticContext,
  buildTherapySystemPrompt,
  detectCognitiveDistortions,
  detectCrisis,
  extractAndSaveMemories,
  determineSessionPhase,
  getContextualSuggestions,
} from '../engine/therapyEngine';

// ─── MessageBubble ────────────────────────────────────────────────────────────

function MessageBubble({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex items-end gap-2 ${message.isUser ? 'flex-row-reverse' : ''}`}
    >
      {!message.isUser && (
        <div className="w-8 h-8 rounded-[10px] bg-[#E8F1F8] flex items-center justify-center flex-shrink-0 mb-1">
          <span className="text-base">✨</span>
        </div>
      )}
      <div className={`max-w-[78%] ${message.isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {message.technique && (
          <span className="text-[9px] font-semibold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full self-start">
            {message.technique}
          </span>
        )}
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          message.isUser
            ? 'bg-[#7BA9D8] rounded-br-[5px]'
            : 'bg-white rounded-bl-[5px]'
        }`}>
          <p className={`text-[14px] leading-relaxed whitespace-pre-wrap ${
            message.isUser ? 'text-white' : 'text-[#2E4057]'
          }`}>
            {message.text}
          </p>
        </div>
        <span className={`text-[10px] text-gray-400 px-1 ${message.isUser ? 'self-end' : 'self-start'}`}>
          {message.time}
        </span>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="flex items-end gap-2"
    >
      <div className="w-8 h-8 rounded-[10px] bg-[#E8F1F8] flex items-center justify-center">
        <span className="text-base">✨</span>
      </div>
      <div className="bg-white rounded-2xl rounded-bl-[5px] px-4 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#7BA9D8]"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, delay: i * 0.25, repeat: Infinity }}
            />
          ))}
          <span className="text-[11px] text-gray-400 ml-1">Sakina réfléchit...</span>
        </div>
      </div>
    </motion.div>
  );
}

function CrisisAlert({ crisis, onDismiss }) {
  if (!crisis) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border-l-4 border-red-500 px-4 py-3 mx-4 rounded-xl mb-2"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-[13px] font-bold text-red-700">Besoin d'aide immédiate</span>
        </div>
        <button onClick={onDismiss} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
      </div>
      <p className="text-[12px] text-gray-600 mb-3">
        Si tu es en danger, appelle le <strong>{crisis.hotline}</strong> — {crisis.hotlineDesc} (gratuit, 24h/24).
      </p>
      <a
        href={`tel:${crisis.hotline}`}
        className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-red-600 transition-colors"
      >
        <Phone className="w-3 h-3" />
        Appeler le {crisis.hotline}
      </a>
    </motion.div>
  );
}

function InsightBadge({ insight, onClose }) {
  if (!insight) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2 bg-purple-50 border-b border-purple-100 px-4 py-2"
    >
      <Brain className="w-3 h-3 text-purple-500 flex-shrink-0" />
      <p className="text-[11px] text-purple-600 flex-1">{insight}</p>
      <button onClick={onClose} className="text-purple-400 text-sm">×</button>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [crisis, setCrisis] = useState(null);
  const [insight, setInsight] = useState(null);
  const [userContext, setUserContext] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const messageCount = useRef(0);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const formatTime = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  // ── Initialisation ─────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const ctx = await buildTherapeuticContext();
        setUserContext(ctx);
        setSuggestions(getContextualSuggestions(ctx.moodTrajectory).slice(0, 5));

        const opening = generateOpening(ctx);
        setMessages([{ id: 'opening', text: opening, isUser: false, time: formatTime() }]);
      } catch {
        setMessages([{
          id: 'opening',
          text: "Bonjour 🌸\n\nJe suis Sakina — ton espace de soutien psychologique personnalisé.\n\nComment tu te sens aujourd'hui ?",
          isUser: false,
          time: formatTime(),
        }]);
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, []);

  const generateOpening = (ctx) => {
    if (ctx.isFirstSession) {
      return "Bonjour 🌸\n\nJe suis Sakina — une psychothérapeute IA formée aux approches les plus efficaces (CBT, ACT, DBT, Mindfulness).\n\nJe suis là pour t'accompagner avec bienveillance, sans jugement.\n\nComment tu te sens en ce moment ?";
    }
    const hour = new Date().getHours();
    const greet = hour < 18 ? 'Bonjour' : 'Bonsoir';
    const moodCtx = ctx.moodTrajectory?.trend === 'dégradation'
      ? "\n\nJ'ai remarqué que ces derniers jours semblent plus difficiles pour toi. "
      : ctx.moodTrajectory?.trend === 'amélioration'
      ? "\n\nJe vois que tu progresses — continue comme ça. "
      : '';
    return `${greet} 🌸${moodCtx}\n\nComment tu vas aujourd'hui ?`;
  };

  // ── Scroll ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [messages, isTyping]);

  // ── Envoi ───────────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text = input.trim()) => {
    if (!text || isTyping) return;
    setInput('');
    setShowSuggestions(false);
    messageCount.current += 1;

    // Détection crise
    const detectedCrisis = detectCrisis(text);
    if (detectedCrisis) setCrisis(detectedCrisis);

    // Distorsions cognitives
    const distortions = detectCognitiveDistortions(text);

    const userMsg = { id: `u-${Date.now()}`, text, isUser: true, time: formatTime() };
    setMessages(prev => [...prev, userMsg]);

    setIsTyping(true);
    try {
      const phase = determineSessionPhase(messageCount.current);
      const ctx = userContext || {};
      const systemPrompt = buildTherapySystemPrompt(ctx, phase, distortions);

      const history = messages.slice(-8)
        .map(m => `${m.isUser ? 'Utilisateur' : 'Sakina'}: ${m.text}`)
        .join('\n');

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}

═══ HISTORIQUE SESSION ═══
${history}

Utilisateur: ${text}

Sakina:`,
      });

      const aiText = typeof aiResponse === 'string' ? aiResponse
        : aiResponse?.response || aiResponse?.text
        || "Je suis là pour toi. Prends le temps d'exprimer ce que tu ressens. 💙";

      // Détecter la technique employée
      const technique = detectTechniqueFromResponse(aiText);

      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        text: aiText,
        isUser: false,
        time: formatTime(),
        technique,
      }]);

      // Sauvegarde asynchrone
      Promise.all([
        base44.entities.Conversation.create({ user_message: text, ai_response: aiText }).catch(() => {}),
        extractAndSaveMemories(text, aiText),
      ]);

      // Insight discret
      if (distortions.length > 0) {
        setInsight(`💡 Distorsion identifiée : ${distortions[0].name}`);
        setTimeout(() => setInsight(null), 7000);
      }

    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        text: "Je rencontre une difficulté technique. Peux-tu réessayer ? 🌸",
        isUser: false,
        time: formatTime(),
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, messages, userContext]);

  const detectTechniqueFromResponse = (text) => {
    const l = text.toLowerCase();
    if (l.includes('respir') && (l.includes('seconde') || l.includes('inspire') || l.includes('expire'))) return 'Mindfulness';
    if (l.includes('remarques') || l.includes('observes') || l.includes('qu\'est-ce que tu ressens')) return 'Pleine conscience';
    if (l.includes('cette pensée') && (l.includes('vrai') || l.includes('preuve'))) return 'Restructuration cognitive';
    if (l.includes('valeur') || l.includes('ce qui compte vraiment')) return 'ACT';
    if (l.includes('toléranc') || l.includes('accepte') || l.includes('accueill')) return 'DBT';
    if (l.includes('force') || l.includes('capacit') || l.includes('ressource')) return 'Motivation';
    return null;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Rendu ──────────────────────────────────────────────────────────────────

  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F6FC]">
        <span className="text-5xl mb-4">✨</span>
        <div className="w-8 h-8 border-3 border-[#7BA9D8] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-gray-400 text-sm">Sakina se prépare pour toi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F6FC] flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-[#E8F1F8] flex items-center justify-center border-2 border-[#7BA9D8]">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <p className="text-[15px] font-bold text-[#2E4057]">Sakina</p>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`} />
              <p className="text-[10px] text-gray-500">
                {isTyping ? 'En train de répondre...' : 'Psychologue IA · En ligne'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-purple-50 border border-purple-100 rounded-full px-2 py-1">
          <Brain className="w-3 h-3 text-purple-500" />
          <span className="text-[9px] font-bold text-purple-600">CBT · ACT · DBT</span>
        </div>
      </div>

      {/* Alerte crise */}
      <AnimatePresence>
        {crisis && <CrisisAlert crisis={crisis} onDismiss={() => setCrisis(null)} />}
      </AnimatePresence>

      {/* Insight badge */}
      <AnimatePresence>
        {insight && <InsightBadge insight={insight} onClose={() => setInsight(null)} />}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="px-4 pb-2">
          <p className="text-[10px] text-gray-400 mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="text-[12px] text-[#7BA9D8] bg-[#E8F1F8] border border-[#C5D9F0] rounded-full px-3 py-1.5 hover:bg-[#D0E8F5] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-[#7BA9D8] focus-within:ring-2 focus-within:ring-[#7BA9D8]/20 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(false)}
              placeholder="Exprime-toi librement..."
              className="w-full bg-transparent text-[14px] text-[#2E4057] placeholder-gray-400 resize-none outline-none max-h-32"
              style={{ fieldSizing: 'content' }}
              maxLength={3000}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              input.trim() && !isTyping
                ? 'bg-[#7BA9D8] shadow-lg shadow-[#7BA9D8]/40 hover:bg-[#5A8BBD]'
                : 'bg-gray-200 cursor-not-allowed'
            }`}
          >
            {isTyping
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Send className="w-4 h-4 text-white" />
            }
          </button>
        </div>
      </div>

      {/* Urgences discrètes */}
      <div className="flex items-center justify-center gap-4 py-2 bg-gray-50 border-t border-gray-100">
        {[
          { n: '3114', label: '🆘 Suicide' },
          { n: '15', label: '🏥 SAMU' },
          { n: '3919', label: '💜 Violences' },
        ].map((item, i) => (
          <React.Fragment key={item.n}>
            {i > 0 && <span className="text-gray-200">|</span>}
            <a href={`tel:${item.n}`} className="text-[10px] text-gray-400 hover:text-[#7BA9D8] transition-colors">
              {item.label} {item.n}
            </a>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
