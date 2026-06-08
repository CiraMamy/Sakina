import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, TrendingUp } from 'lucide-react';

export default function ContextIndicator({ context }) {
  if (!context || Object.keys(context).length === 0) return null;
  
  const hasRecentMood = context.recentMoods && context.recentMoods.length > 0;
  const hasStreak = context.progress?.current_streak > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 py-3 bg-gradient-to-r from-[#CFE2F3] to-[#E8F4F8] border-b border-[#8CB8E8]/20"
    >
      <div className="flex items-center space-x-2">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Brain className="w-4 h-4 text-[#8CB8E8]" />
        </motion.div>
        <div className="flex-1">
          <p className="text-xs text-[#2E4057] font-medium">
            Sakina prend en compte ton contexte :
          </p>
          <div className="flex items-center space-x-3 mt-1">
            {hasRecentMood && (
              <span className="text-xs text-[#2E4057]/70 flex items-center space-x-1">
                <span>Humeur : {context.recentMoods[0].mood_label}</span>
              </span>
            )}
            {hasStreak && (
              <span className="text-xs text-[#2E4057]/70 flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>Série de {context.progress.current_streak}j</span>
              </span>
            )}
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-[#8CB8E8]" />
      </div>
    </motion.div>
  );
}