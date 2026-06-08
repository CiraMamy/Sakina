import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, TrendingUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ChallengeCard from '../gamification/ChallengeCard';
import BadgeShowcase from '../gamification/BadgeShowcase';
import { toast } from 'sonner';

export default function ChallengesSection() {
  const [activeTab, setActiveTab] = useState('active');
  const queryClient = useQueryClient();

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => base44.entities.Challenge.list('-created_date')
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => base44.entities.Achievement.list()
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progress = await base44.entities.UserProgress.list();
      return progress[0] || null;
    }
  });

  const startChallengeMutation = useMutation({
    mutationFn: (challenge) => base44.entities.Challenge.update(challenge.id, { is_active: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success('Défi commencé! 💪');
    }
  });

  const activeChallenges = challenges.filter(c => c.is_active && !c.completed);
  const availableChallenges = challenges.filter(c => !c.is_active && !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  const unlockedBadges = achievements.filter(a => a.unlocked);
  const lockedBadges = achievements.filter(a => !a.unlocked).slice(0, 6);

  const displayedChallenges = activeTab === 'active' ? activeChallenges : 
                               activeTab === 'available' ? availableChallenges : 
                               completedChallenges;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] rounded-[24px] p-5 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Trophy className="w-6 h-6" />
          <h3 className="text-lg font-bold">Ton parcours</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{activeChallenges.length}</p>
            <p className="text-sm text-white/80">Actifs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{completedChallenges.length}</p>
            <p className="text-sm text-white/80">Complétés</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{unlockedBadges.length}</p>
            <p className="text-sm text-white/80">Badges</p>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      {(unlockedBadges.length > 0 || lockedBadges.length > 0) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#2E4057]">Badges déblocables</h3>
            <Sparkles className="w-5 h-5 text-[#8CB8E8]" />
          </div>
          <div className="bg-white rounded-[24px] p-5 card-shadow">
            <div className="grid grid-cols-4 gap-4">
              {[...unlockedBadges.slice(0, 4), ...lockedBadges.slice(0, 4 - unlockedBadges.length)].map((badge) => (
                <BadgeShowcase key={badge.id || badge.achievement_id} badge={badge} size="md" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenges Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#2E4057]">Défis</h3>
          <TrendingUp className="w-5 h-5 text-[#8CB8E8]" />
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-4">
          {[
            { key: 'active', label: 'Actifs' },
            { key: 'available', label: 'Disponibles' },
            { key: 'completed', label: 'Complétés' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-[16px] text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-[#8CB8E8] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Challenges List */}
        <div className="space-y-3">
          {displayedChallenges.length > 0 ? (
            displayedChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onStart={() => startChallengeMutation.mutate(challenge)}
              />
            ))
          ) : (
            <div className="bg-white rounded-[24px] p-8 text-center card-shadow">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucun défi {activeTab === 'active' ? 'actif' : activeTab === 'available' ? 'disponible' : 'complété'}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}