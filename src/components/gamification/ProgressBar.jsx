import React from 'react';
import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';

export default function ProgressBar({ currentLevel, totalPoints, pointsToNextLevel, showInHeader = false }) {
  const progressPercentage = ((totalPoints % pointsToNextLevel) / pointsToNextLevel) * 100;
  const currentLevelPoints = totalPoints % pointsToNextLevel;
  
  if (showInHeader) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-[20px] p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-[12px] bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Star className="w-4 h-4 text-white" fill="white" />
            </div>
            <div>
              <p className="text-xs text-white/70 font-light">Niveau</p>
              <p className="text-sm font-bold text-white">{currentLevel}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/70 font-light">Points</p>
            <p className="text-sm font-bold text-white">{totalPoints.toLocaleString()}</p>
          </div>
        </div>
        <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-white/70 text-center mt-1.5">
          {currentLevelPoints} / {pointsToNextLevel} pour niveau {currentLevel + 1}
        </p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] rounded-[24px] p-5 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-14 h-14 rounded-[18px] bg-white/20 backdrop-blur-lg flex items-center justify-center"
            >
              <Star className="w-7 h-7 text-white" fill="white" />
            </motion.div>
            <div>
              <p className="text-sm text-white/80 font-light">Niveau actuel</p>
              <p className="text-3xl font-bold text-white">{currentLevel}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-white/80 font-light">Total points</p>
            <p className="text-2xl font-bold text-white">{totalPoints.toLocaleString()}</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Zap className="w-3 h-3 text-[#8CB8E8]" fill="#8CB8E8" />
              </div>
            </motion.div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/90 font-medium">
              {currentLevelPoints} / {pointsToNextLevel} XP
            </span>
            <span className="text-white/90 font-medium">
              Niveau {currentLevel + 1}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}