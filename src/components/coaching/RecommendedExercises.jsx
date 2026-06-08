import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Brain, BookOpen, Heart, Clock, Sunrise, Moon as MoonIcon } from 'lucide-react';

const ExerciseCard = ({ exercise, index }) => {
  const typeIcons = {
    breathing: Wind,
    meditation: Brain,
    journaling: BookOpen,
    gratitude: Heart
  };

  const typeColors = {
    breathing: { bg: 'from-cyan-400 to-blue-500', icon: 'text-cyan-500' },
    meditation: { bg: 'from-purple-400 to-indigo-500', icon: 'text-purple-500' },
    journaling: { bg: 'from-orange-400 to-red-500', icon: 'text-orange-500' },
    gratitude: { bg: 'from-pink-400 to-rose-500', icon: 'text-pink-500' }
  };

  const timeIcons = {
    matin: Sunrise,
    soir: MoonIcon,
    flexible: Clock
  };

  const Icon = typeIcons[exercise.type] || Brain;
  const colors = typeColors[exercise.type] || typeColors.meditation;
  const TimeIcon = timeIcons[exercise.best_time] || Clock;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-[20px] p-5 card-shadow hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-start space-x-4 mb-3">
        <div className={`w-12 h-12 rounded-[16px] bg-gradient-to-br ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-[#2E4057] mb-1">{exercise.title}</h4>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{exercise.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TimeIcon className="w-3 h-3" />
              <span className="capitalize">{exercise.best_time}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-3">
        {exercise.description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className={`text-xs font-semibold px-3 py-1 rounded-[8px] ${colors.icon} bg-opacity-10`}>
          {exercise.type === 'breathing' ? 'Respiration' :
           exercise.type === 'meditation' ? 'Méditation' :
           exercise.type === 'journaling' ? 'Journaling' :
           'Gratitude'}
        </span>
        <button className="text-xs font-semibold text-[#8CB8E8] hover:text-[#7AA5D1] transition-colors">
          Commencer →
        </button>
      </div>
    </motion.div>
  );
};

export default function RecommendedExercises({ exercises }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-[#2E4057] mb-4 px-2 flex items-center">
        <Wind className="w-5 h-5 mr-2 text-[#8CB8E8]" />
        Exercices recommandés
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {exercises.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} index={index} />
        ))}
      </div>
    </div>
  );
}