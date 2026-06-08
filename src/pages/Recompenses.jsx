import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Flame, Target, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import BadgeCard from '../components/gamification/BadgeCard';
import ProgressBar from '../components/gamification/ProgressBar';
import StreakCounter from '../components/gamification/StreakCounter';

const categories = [
  { id: 'all', label: 'Tous', icon: Star },
  { id: 'mood', label: 'Humeur', icon: '😊' },
  { id: 'journal', label: 'Journal', icon: '📔' },
  { id: 'addiction', label: 'Habitudes', icon: '🎯' },
  { id: 'streak', label: 'Séries', icon: '🔥' },
  { id: 'milestone', label: 'Jalons', icon: '🏆' },
];

export default function Recompenses() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock data
  const userProgress = {
    totalPoints: 1250,
    currentLevel: 8,
    pointsToNextLevel: 200,
    currentStreak: 12,
    longestStreak: 28,
    achievementsUnlocked: 15
  };
  
  const achievements = [
    {
      achievement_id: 'first_steps',
      title: 'Premiers pas',
      description: 'Complète ton premier check-in émotionnel',
      category: 'mood',
      icon: '🌟',
      points: 10,
      rarity: 'common',
      unlocked: true,
      unlocked_date: '2025-01-10'
    },
    {
      achievement_id: 'week_warrior',
      title: 'Guerrier hebdo',
      description: 'Maintiens une série de 7 jours',
      category: 'streak',
      icon: '🔥',
      points: 50,
      rarity: 'rare',
      unlocked: true,
      unlocked_date: '2025-01-15'
    },
    {
      achievement_id: 'journal_master',
      title: 'Maître du journal',
      description: 'Écris 20 entrées de journal',
      category: 'journal',
      icon: '📚',
      points: 100,
      rarity: 'epic',
      unlocked: true,
      unlocked_date: '2025-01-18'
    },
    {
      achievement_id: 'emotion_expert',
      title: 'Expert émotionnel',
      description: 'Enregistre 50 états émotionnels',
      category: 'mood',
      icon: '💎',
      points: 75,
      rarity: 'rare',
      unlocked: false,
      progress: 68,
      target: 50
    },
    {
      achievement_id: 'clean_month',
      title: 'Un mois propre',
      description: 'Reste sobre pendant 30 jours',
      category: 'addiction',
      icon: '🏆',
      points: 200,
      rarity: 'legendary',
      unlocked: false,
      progress: 40,
      target: 30
    },
    {
      achievement_id: 'mindful_monk',
      title: 'Moine mindful',
      description: 'Accède à 15 ressources de méditation',
      category: 'milestone',
      icon: '🧘',
      points: 60,
      rarity: 'rare',
      unlocked: false,
      progress: 80,
      target: 15
    },
    {
      achievement_id: 'consistency_king',
      title: 'Roi de la constance',
      description: 'Série de 30 jours',
      category: 'streak',
      icon: '👑',
      points: 150,
      rarity: 'epic',
      unlocked: false,
      progress: 40,
      target: 30
    },
    {
      achievement_id: 'early_bird',
      title: 'Lève-tôt',
      description: 'Check-in avant 8h pendant 5 jours',
      category: 'mood',
      icon: '🌅',
      points: 40,
      rarity: 'common',
      unlocked: true,
      unlocked_date: '2025-01-12'
    },
    {
      achievement_id: 'wellness_warrior',
      title: 'Guerrier bien-être',
      description: 'Complète tous les types d\'activités',
      category: 'milestone',
      icon: '⚔️',
      points: 250,
      rarity: 'legendary',
      unlocked: false,
      progress: 60,
      target: 100
    },
  ];
  
  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  
  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] px-6 pt-12 pb-8 rounded-b-[48px]">
        <div className="flex items-center justify-between mb-6">
          <Link to={createPageUrl('Profil')}>
            <button className="w-10 h-10 rounded-[14px] bg-white/20 backdrop-blur-lg flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          </Link>
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-[16px]">
            <Trophy className="w-5 h-5 text-white" />
            <span className="text-sm font-bold text-white">{unlockedCount}/{totalCount}</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Récompenses</h1>
        <p className="text-white/80 font-light">Tes succès et accomplissements</p>
      </div>
      
      {/* Stats Section */}
      <div className="px-6 py-6 space-y-4">
        <ProgressBar
          currentLevel={userProgress.currentLevel}
          totalPoints={userProgress.totalPoints}
          pointsToNextLevel={userProgress.pointsToNextLevel}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <StreakCounter
            currentStreak={userProgress.currentStreak}
            longestStreak={userProgress.longestStreak}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[24px] p-5 card-shadow"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 rounded-[16px] bg-[#8CB8E8]/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[#8CB8E8]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Débloqués</p>
                <p className="text-2xl font-bold text-[#2E4057]">{unlockedCount}</p>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5]"
                initial={{ width: 0 }}
                animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {((unlockedCount / totalCount) * 100).toFixed(0)}% complété
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Category Filter */}
      <div className="px-6 mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-[16px] whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] text-white card-shadow'
                    : 'bg-white text-gray-600 card-shadow'
                }`}
              >
                {typeof category.icon === 'string' ? (
                  <span className="text-base">{category.icon}</span>
                ) : (
                  React.createElement(category.icon, { className: "w-4 h-4" })
                )}
                <span className="text-sm font-medium">{category.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Achievements Grid */}
      <div className="px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-4"
        >
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.achievement_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <BadgeCard achievement={achievement} size="medium" showDetails={true} />
            </motion.div>
          ))}
        </motion.div>
        
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-light">Aucun succès dans cette catégorie</p>
          </div>
        )}
      </div>
    </div>
  );
}