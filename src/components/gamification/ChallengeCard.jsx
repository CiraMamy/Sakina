import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Moon, Heart, Flame, BookOpen, MessageCircle, Trophy, Lock } from 'lucide-react';
import { Button } from '../ui/button';

const difficultyConfig = {
  easy: { color: 'from-green-400 to-green-500', label: 'Facile', points: '×1' },
  medium: { color: 'from-yellow-400 to-orange-500', label: 'Moyen', points: '×1.5' },
  hard: { color: 'from-red-400 to-pink-500', label: 'Difficile', points: '×2' }
};

const typeIcons = {
  sleep: Moon,
  mood: Heart,
  meditation: Flame,
  journal: BookOpen,
  chat: MessageCircle,
  streak: Trophy
};

export default function ChallengeCard({ challenge, onStart }) {
  const Icon = typeIcons[challenge.challenge_type] || Trophy;
  const difficulty = difficultyConfig[challenge.difficulty] || difficultyConfig.medium;
  const progress = Math.min((challenge.current_progress / challenge.target_value) * 100, 100);
  const isCompleted = challenge.completed;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-[24px] p-5 card-shadow relative overflow-hidden ${
        isCompleted ? 'border-2 border-[#A7D7C5]' : ''
      }`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#8CB8E8]/5 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`w-12 h-12 rounded-[16px] bg-gradient-to-br ${
              isCompleted ? 'from-[#A7D7C5] to-[#8CB8E8]' : 'from-gray-100 to-gray-200'
            } flex items-center justify-center`}>
              {isCompleted ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <Icon className="w-6 h-6 text-gray-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={`font-bold text-[#2E4057] ${isCompleted ? 'line-through' : ''}`}>
                  {challenge.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-[8px] bg-gradient-to-r ${difficulty.color} text-white font-semibold`}>
                  {difficulty.label}
                </span>
                <span className="text-xs bg-[#8CB8E8]/10 text-[#8CB8E8] px-2 py-1 rounded-[8px] font-semibold">
                  +{challenge.points_reward} pts
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {!isCompleted && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Progression</span>
              <span className="font-semibold">{challenge.current_progress}/{challenge.target_value}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] rounded-full"
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        {!isCompleted && !challenge.is_active && (
          <Button
            onClick={() => onStart(challenge)}
            className="w-full h-10 rounded-[16px] bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] hover:shadow-lg"
          >
            Commencer le défi
          </Button>
        )}

        {isCompleted && (
          <div className="bg-[#A7D7C5]/10 rounded-[16px] px-4 py-3 flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-[#A7D7C5]" />
            <span className="text-sm font-semibold text-[#2E4057]">Défi complété! 🎉</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}