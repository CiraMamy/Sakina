import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

const goalTypeIcons = {
  sleep: '😴',
  mood: '😊',
  stress: '🧘',
  addiction: '💪',
  mindfulness: '🌿',
  social: '👥'
};

export default function GoalsProgress({ goals, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-[32px] p-6 card-shadow animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-[16px]" />
          ))}
        </div>
      </div>
    );
  }

  const activeGoals = goals?.filter(g => g.is_active && !g.completed) || [];
  const completedCount = goals?.filter(g => g.completed)?.length || 0;

  if (activeGoals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] p-6 card-shadow"
      >
        <h3 className="text-xl font-bold text-[#2E4057] mb-4">Progrès des objectifs</h3>
        <div className="text-center py-8">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">Aucun objectif actif</p>
          <Link to={createPageUrl('Profil')}>
            <button className="mt-2 px-4 py-2 bg-[#7BA9D8] text-white rounded-[16px] text-sm hover:bg-[#5A8BBD]">
              Créer un objectif
            </button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[32px] p-6 card-shadow"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-[#2E4057]">Progrès des objectifs</h3>
          <p className="text-sm text-gray-500 mt-1">{activeGoals.length} actifs · {completedCount} complétés</p>
        </div>
        <Link to={createPageUrl('Profil')}>
          <button className="text-[#7BA9D8] hover:text-[#5A8BBD] text-sm font-semibold">
            Voir tout
          </button>
        </Link>
      </div>

      <div className="space-y-4">
        {activeGoals.slice(0, 3).map((goal, index) => {
          const progress = goal.target_value ? 
            Math.min((goal.current_progress / goal.target_value) * 100, 100) : 0;
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#FAFAFA] rounded-[20px] p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                  <span className="text-2xl">{goalTypeIcons[goal.goal_type] || '🎯'}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#2E4057] mb-1">{goal.title}</h4>
                    {goal.description && (
                      <p className="text-xs text-gray-600 line-clamp-1">{goal.description}</p>
                    )}
                  </div>
                </div>
                {progress >= 100 && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
              </div>

              {goal.target_value && (
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>Progression</span>
                    <span className="font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#7BA9D8] to-[#5A8BBD] rounded-full"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}