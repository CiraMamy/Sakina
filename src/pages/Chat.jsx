import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Brain, Phone, Send } from 'lucide-react'
import { toast } from 'sonner'
import { base44 } from '../api/base44Client'
import {
  buildTherapeuticContext,
  buildTherapySystemPrompt,
  detectCognitiveDistortions,
  detectCrisis,
  determineSessionPhase,
  getContextualSuggestions,
} from '../engine/therapyEngine'

function MessageBubble({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          message.isUser ? 'bg-sakina-500 text-white rounded-br-[6px]' : 'bg-white text-slate-700 rounded-bl-[6px] border border-slate-100'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
      </div>
    </motion.div>
  )
}

function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
      <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-[6px] px-4 py-3">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-sakina-400"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, delay: i * 0.25, repeat: Infinity }}
            />
          ))}
          <span className="text-[11px] text-slate-400">Sakina réfléchit...</span>
        </div>
      </div>
    </motion.div>
  )
}

function CrisisAlert({ crisis, onDismiss }) {
  if (!crisis) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border-l-4 border-red-500 px-4 py-3 mx-4 rounded-xl mb-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-[13px] font-bold text-red-700">Besoin d'aide immédiate</span>
        </div>
        <button onClick={onDismiss} className="text-red-400 text-lg">×</button>
      </div>
      <p className="text-[12px] text-gray-600 mt-2">
        Si tu es en danger, appelle le <strong>{crisis.hotline}</strong> — {crisis.hotlineDesc}.
      </p>
      <a href={`tel:${crisis.hotline}`} className="inline-flex items-center gap-2 mt-3 bg-red-500 text-white px-4 py-2 rounded-xl text-[13px] font-bold">
        <Phone className="w-3 h-3" />
        Appeler le {crisis.hotline}
      </a>
    </motion.div>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [crisis, setCrisis] = useState(null)
  const [userContext, setUserContext] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const endRef = useRef(null)
  const messageCount = useRef(0)

  useEffect(() => {
    const init = async () => {
      try {
        const ctx = await buildTherapeuticContext()
        setUserContext(ctx)
        setSuggestions(getContextualSuggestions(ctx.moodTrajectory).slice(0, 5))
        setMessages([
          {
            id: 'opening',
            text: "Bonjour 🌸\n\nJe suis Sakina — ton espace de soutien psychologique personnalisé.\n\nComment tu te sens aujourd'hui ?",
            isUser: false,
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      } catch {
        setMessages([
          {
            id: 'opening',
            text: "Bonjour 🌸\n\nJe suis Sakina.\nComment tu te sens aujourd'hui ?",
            isUser: false,
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      }
    }

    init()
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (value = input.trim()) => {
    if (!value || isTyping) return

    const detectedCrisis = detectCrisis(value)
    if (detectedCrisis) setCrisis(detectedCrisis)

    const distortions = detectCognitiveDistortions(value)

    const userMessage = {
      id: `u-${Date.now()}`,
      text: value,
      isUser: true,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    messageCount.current += 1
    setIsTyping(true)

    try {
      const phase = determineSessionPhase(messageCount.current)
      const ctx = userContext || {}
      const systemPrompt = buildTherapySystemPrompt(ctx, phase, distortions)

      const history = messages.slice(-8)
        .map((m) => `${m.isUser ? 'Utilisateur' : 'Sakina'}: ${m.text}`)
        .join('\n')

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\nHISTORIQUE:\n${history}\n\nUtilisateur: ${value}\n\nSakina:`,
      })

      const aiText = typeof aiResponse === 'string'
        ? aiResponse
        : aiResponse?.response || aiResponse?.text || "Je suis là pour toi. Prends le temps d'exprimer ce que tu ressens. 💙"

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          text: aiText,
          isUser: false,
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        },
      ])

      if (distortions.length > 0) {
        toast.info(`💡 Distorsion détectée : ${distortions[0].name}`)
      }
    } catch (err) {
      console.error(err)
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          text: "Je rencontre une difficulté technique. Peux-tu réessayer ? 🌸",
          isUser: false,
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F6FC] flex flex-col max-w-md mx-auto">
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

      <AnimatePresence>
        {crisis && <CrisisAlert crisis={crisis} onDismiss={() => setCrisis(null)} />}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>
        {isTyping && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      {suggestions.length > 0 && (
        <div className="px-4 pb-2">
          <p className="text-[10px] text-gray-400 mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="text-[12px] text-[#7BA9D8] bg-[#E8F1F8] border border-[#C5D9F0] rounded-full px-3 py-1.5"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-[#7BA9D8]">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Exprime-toi librement..."
              className="w-full bg-transparent text-[14px] text-[#2E4057] placeholder-gray-400 resize-none outline-none max-h-32"
              maxLength={3000}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className={`w-11 h-11 rounded-full flex items-center justify-center ${input.trim() && !isTyping ? 'bg-[#7BA9D8] hover:bg-[#5A8BBD]' : 'bg-gray-200 cursor-not-allowed'}`}
          >
            {isTyping ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
