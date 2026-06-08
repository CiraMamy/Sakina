import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';

const rarityColors = {
  common: {
    gradient: 'from-gray-400 to-gray-500',
    glow: 'shadow-gray-300',
    bg: 'bg-gray-50',
    text: 'text-gray-600'
  },
  rare: {
    gradient: 'from-blue-400 to-blue-600',
    glow: 'shadow-blue-300',
    bg: 'bg-blue-50',
    text: 'text-blue-600'
  },
  epic: {
    gradient: 'from-purple-400 to-purple-600',
    glow: 'shadow-purple-300',
    bg: 'bg-purple-50',
    text: 'text-purple-600'
  },
  legendary: {
    gradient: 'from-yellow-400 to-orange-500',
    glow: 'shadow-yellow-300',
    bg: 'bg-yellow-50',
    text: 'text-orange-600'
  }
};

export default function BadgeCard({ achievement, size = 'medium', showDetails = true }) {
  const { unlocked, icon, title, description, points, rarity = 'common', progress = 0, target } = achievement;
  const colors = rarityColors[rarity];
  
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-20 h-20',
    large: 'w-24 h-24'
  };
  
  const iconSize = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl'
  };
  
  return (
    <motion.div
      whileHover={unlocked ? { scale: 1.05, y: -4 } : {}}
      className={`${showDetails ? 'bg-white rounded-[20px] p-4 card-shadow' : ''}`}
    >
      <div className={`flex ${showDetails ? 'flex-col items-center' : 'flex-col items-center'}`}>
        {/* Badge Icon */}
        <div className="relative">
          <motion.div
            animate={unlocked ? {
              boxShadow: [
                '0 0 20px rgba(140, 184, 232, 0.3)',
                '0 0 30px rgba(140, 184, 232, 0.5)',
                '0 0 20px rgba(140, 184, 232, 0.3)',
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className={`${sizeClasses[size]} rounded-[20px] ${
              unlocked 
                ? `bg-gradient-to-br ${colors.gradient} ${colors.glow}` 
                : 'bg-gray-200'
            } flex items-center justify-center relative overflow-hidden`}
          >
            {/* Shine effect for unlocked badges */}
            {unlocked && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
            )}
            
            <div className={`relative z-10 ${iconSize[size]}`}>
              {unlocked ? icon : <Lock className="w-6 h-6 text-gray-400" />}
            </div>
            
            {unlocked && (
              <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            )}
          </motion.div>
          
          {/* Progress ring for locked achievements */}
          {!unlocked && target && progress > 0 && (
            <svg className="absolute inset-0 -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="#8CB8E8"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
                transition={{ duration: 1 }}
              />
            </svg>
          )}
        </div>
        
        {/* Badge Details */}
        {showDetails && (
          <div className={`mt-3 text-center ${unlocked ? '' : 'opacity-60'}`}>
            <div className="flex items-center justify-center space-x-2 mb-1">
              <h4 className="text-sm font-bold text-[#2E4057]">{title}</h4>
              {unlocked && (
                <span className="text-xs bg-[#8CB8E8]/10 text-[#8CB8E8] px-2 py-0.5 rounded-full font-bold">
                  +{points}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
            
            {!unlocked && target && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Progrès</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}