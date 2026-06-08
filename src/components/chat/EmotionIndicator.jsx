import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Wind, Cloud, Zap, Battery, Smile } from 'lucide-react';

const emotionConfig = {
  stress: { icon: Zap, color: '#F59E0B', bg: '#FEF3C7', label: 'Stress détecté' },
  anxiété: { icon: Wind, color: '#8B5CF6', bg: '#EDE9FE', label: 'Anxiété ressentie' },
  tristesse: { icon: Cloud, color: '#6366F1', bg: '#E0E7FF', label: 'Tristesse présente' },
  colère: { icon: Zap, color: '#EF4444', bg: '#FEE2E2', label: 'Colère exprimée' },
  fatigue: { icon: Battery, color: '#64748B', bg: '#F1F5F9', label: 'Fatigue remarquée' },
  joie: { icon: Smile, color: '#10B981', bg: '#D1FAE5', label: 'Joie partagée' },
  solitude: { icon: Heart, color: '#EC4899', bg: '#FCE7F3', label: 'Solitude vécue' },
  honte: { icon: Cloud, color: '#78716C', bg: '#F5F5F4', label: 'Honte ressentie' },
  culpabilité: { icon: Heart, color: '#DC2626', bg: '#FEE2E2', label: 'Culpabilité présente' },
  peur: { icon: Wind, color: '#7C3AED', bg: '#F3E8FF', label: 'Peur détectée' },
  confusion: { icon: Wind, color: '#64748B', bg: '#F1F5F9', label: 'Confusion exprimée' },
  neutre: { icon: Heart, color: '#8CB8E8', bg: '#E0F2FE', label: 'À l\'écoute' }
};

export default function EmotionIndicator({ emotion, intensity, mixedEmotions, energyLevel, distortions, show = true }) {
  if (!show || !emotion) return null;

  const config = emotionConfig[emotion] || emotionConfig.neutre;
  const Icon = config.icon;

  const energyIndicator = {
    'épuisé': '🪫',
    'très bas': '🔋',
    'bas': '🔋',
    'moyen': '⚡',
    'élevé': '⚡⚡',
    'agité': '⚡⚡⚡'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center justify-center mb-4"
    >
      <div className="flex items-center gap-2">
        <div 
          className="flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-medium"
          style={{ backgroundColor: config.bg, color: config.color }}
        >
          <Icon className="w-4 h-4" />
          <span>{config.label}</span>
          {intensity && (
            <span className="opacity-70">• {intensity}/10</span>
          )}
          {mixedEmotions && (
            <span className="opacity-60">• mixte</span>
          )}
        </div>
        {energyLevel && (
          <div className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">
            {energyIndicator[energyLevel] || '⚡'}
          </div>
        )}
        {distortions > 0 && (
          <div className="px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs">
            💭 TCC
          </div>
        )}
      </div>
    </motion.div>
  );
}