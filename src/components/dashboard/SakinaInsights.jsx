import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Heart, Brain, RefreshCw } from 'lucide-react';
import { base44 } from '../../api/base44Client';
import { toast } from 'sonner';

export default function SakinaInsights({ userData, onRefresh }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    setLoading(true);
    
    try {
      const prompt = `Tu es Sakina. Analyse ces données utilisateur et donne UN SEUL insight personnalisé et bienveillant (2-3 phrases max).
      
      DONNÉES:
      - Humeur récente: ${userData.recentMoods?.map(m => `${m.mood_label} (${m.mood_value}/5)`).join(', ') || 'aucune'}
      - Série actuelle: ${userData.currentStreak || 0}j
      - Objectifs actifs: ${userData.activeGoals?.map(g => g.title).join(', ') || 'aucun'}
      - Sessions récentes: ${userData.chatSessions || 0}
      - Sommeil moyen: ${userData.avgSleepQuality || 'inconnu'}
      
      Donne un insight actionnable, encourageant et personnalisé basé sur ces données. Soit concret et humain.`;
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt
      });
      
      setInsight(response);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Erreur lors de la génération');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!insight && userData) {
      generateInsight();
    }
  }, [userData]);

  const insightCategories = [
    { icon: TrendingUp, label: 'Progrès', color: 'text-green-500', bg: 'bg-green-50' },
    { icon: Heart, label: 'Bien-être', color: 'text-pink-500', bg: 'bg-pink-50' },
    { icon: Brain, label: 'Mental', color: 'text-purple-500', bg: 'bg-purple-50' }
  ];

  const randomCategory = insightCategories[Math.floor(Math.random() * insightCategories.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#7BA9D8] to-[#5A8BBD] rounded-[32px] p-6 card-shadow text-white"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-[16px] bg-white/20 backdrop-blur-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Insight de Sakina</h3>
            <p className="text-sm text-white/70">Personnalisé pour toi</p>
          </div>
        </div>
        <button
          onClick={generateInsight}
          disabled={loading}
          className="w-10 h-10 rounded-[14px] bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-6"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-6 h-6 text-white/70" />
              </motion.div>
              <p className="text-white/70">Sakina analyse tes données...</p>
            </div>
          </motion.div>
        ) : insight ? (
          <motion.div
            key="insight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-[12px] ${randomCategory.bg} mb-3`}>
              <randomCategory.icon className={`w-4 h-4 ${randomCategory.color}`} />
              <span className={`text-xs font-semibold ${randomCategory.color}`}>
                {randomCategory.label}
              </span>
            </div>
            <p className="text-white/95 leading-relaxed">{insight}</p>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-6"
          >
            <p className="text-white/70">Aucun insight disponible</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}