import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Award, TrendingUp } from 'lucide-react';

export default function StreakCounter({ currentStreak, longestStreak, compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-[16px] border border-orange-100">
        <Flame className="w-5 h-5 text-orange-500" fill="#F97316" />
        <div>
          <p className="text-xs text-gray-500">Série</p>
          <p className="text-lg font-bold text-orange-500">{currentStreak}</p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-orange-400 to-red-500 rounded-[24px] p-5 relative overflow-hidden"
    >
      {/* Animated flames */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Flame className="w-32 h-32 text-white" />
        </motion.div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-4">
          <motion.div
            animate={{
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-14 h-14 rounded-[18px] bg-white/20 backdrop-blur-lg flex items-center justify-center"
          >
            <Flame className="w-7 h-7 text-white" fill="white" />
          </motion.div>
          <div>
            <p className="text-sm text-white/90 font-light">Série actuelle</p>
            <p className="text-3xl font-bold text-white">{currentStreak} jours</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-white/80" />
            <div>
              <p className="text-xs text-white/70 font-light">Record</p>
              <p className="text-lg font-bold text-white">{longestStreak} jours</p>
            </div>
          </div>
          
          {currentStreak === longestStreak && currentStreak > 0 && (
            <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-[12px]">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white">Record battu!</span>
            </div>
          )}
        </div>
        
        {/* Motivational message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 bg-white/10 backdrop-blur-sm rounded-[16px] p-3"
        >
          <p className="text-xs text-white/90 leading-relaxed">
            {currentStreak === 0 && "Commence ta série aujourd'hui! 🌟"}
            {currentStreak >= 1 && currentStreak < 7 && "Continue comme ça! Chaque jour compte 💪"}
            {currentStreak >= 7 && currentStreak < 30 && "Incroyable progression! Tu es sur la bonne voie 🎯"}
            {currentStreak >= 30 && "Tu es une inspiration! Continue cette excellence 🏆"}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}