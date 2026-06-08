import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';

const rarityConfig = {
  common: { 
    gradient: 'from-gray-400 to-gray-500',
    border: 'border-gray-300',
    glow: 'shadow-gray-200',
    label: 'Commun'
  },
  rare: { 
    gradient: 'from-blue-400 to-blue-600',
    border: 'border-blue-300',
    glow: 'shadow-blue-200',
    label: 'Rare'
  },
  epic: { 
    gradient: 'from-purple-400 to-purple-600',
    border: 'border-purple-300',
    glow: 'shadow-purple-200',
    label: 'Épique'
  },
  legendary: { 
    gradient: 'from-yellow-400 to-orange-500',
    border: 'border-yellow-300',
    glow: 'shadow-yellow-200',
    label: 'Légendaire'
  }
};

export default function BadgeShowcase({ badge, size = 'md' }) {
  const rarity = rarityConfig[badge.rarity] || rarityConfig.common;
  const isUnlocked = badge.unlocked;
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-28 h-28'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: isUnlocked ? 1.1 : 1 }}
      className="relative"
    >
      <div className={`${sizeClasses[size]} rounded-[20px] relative ${
        isUnlocked 
          ? `bg-gradient-to-br ${rarity.gradient} ${rarity.glow} shadow-lg` 
          : 'bg-gray-100 border-2 border-dashed border-gray-300'
      } flex items-center justify-center ${!isUnlocked && 'grayscale opacity-40'}`}>
        {isUnlocked ? (
          <>
            <span className="text-4xl">{badge.icon}</span>
            {badge.rarity === 'legendary' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-[20px]"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)'
                }}
              />
            )}
          </>
        ) : (
          <Lock className="w-8 h-8 text-gray-400" />
        )}
      </div>

      {isUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
        >
          <Sparkles className="w-3 h-3 text-[#8CB8E8]" fill="#8CB8E8" />
        </motion.div>
      )}

      <div className="text-center mt-2">
        <p className={`text-xs font-semibold ${isUnlocked ? 'text-[#2E4057]' : 'text-gray-400'}`}>
          {badge.title}
        </p>
        {isUnlocked && (
          <p className={`text-xs px-2 py-0.5 rounded-[6px] inline-block bg-gradient-to-r ${rarity.gradient} text-white font-semibold mt-1`}>
            {rarity.label}
          </p>
        )}
      </div>
    </motion.div>
  );
}