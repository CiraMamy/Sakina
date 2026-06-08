import React from 'react';
import { motion } from 'framer-motion';
import { Award, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-pink-500',
  legendary: 'from-yellow-400 to-orange-500'
};

export default function RecentAchievements({ achievements, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-[32px] p-6 card-shadow animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-[16px]" />
          ))}
        </div>
      </div>
    );
  }

  const recentUnlocked = achievements?.filter(a => a.unlocked).slice(0, 6) || [];

  if (recentUnlocked.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] p-6 card-shadow"
      >
        <h3 className="text-xl font-bold text-[#2E4057] mb-4">Réalisations récentes</h3>
        <div className="text-center py-8">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">Aucune réalisation débloquée</p>
          <p className="text-sm text-gray-400">Continue à utiliser l'app pour débloquer des succès</p>
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
          <h3 className="text-xl font-bold text-[#2E4057]">Réalisations récentes</h3>
          <p className="text-sm text-gray-500 mt-1">{recentUnlocked.length} débloquées</p>
        </div>
        <Link to={createPageUrl('Recompenses')}>
          <button className="text-[#7BA9D8] hover:text-[#5A8BBD] text-sm font-semibold">
            Voir tout
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {recentUnlocked.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            <div className={`bg-gradient-to-br ${rarityColors[achievement.rarity]} rounded-[20px] p-4 text-center text-white`}>
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <h4 className="font-bold text-sm line-clamp-1">{achievement.title}</h4>
              <p className="text-xs opacity-90 mt-1">+{achievement.points} pts</p>
            </div>
            {achievement.rarity === 'legendary' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}