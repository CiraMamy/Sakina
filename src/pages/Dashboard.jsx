import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Settings, Eye, EyeOff } from 'lucide-react';
import { base44 } from '../api/base44Client';
import { useQuery } from '@tanstack/react-query';
import QuickStats from '../components/dashboard/QuickStats';
import MoodTrendChart from '../components/dashboard/MoodTrendChart';
import GoalsProgress from '../components/dashboard/GoalsProgress';
import RecentAchievements from '../components/dashboard/RecentAchievements';
import SakinaInsights from '../components/dashboard/SakinaInsights';

export default function Dashboard() {
  const [visibleWidgets, setVisibleWidgets] = useState({
    stats: true,
    moodTrend: true,
    goals: true,
    achievements: true,
    insights: true
  });
  const [showCustomize, setShowCustomize] = useState(false);

  // Fetch all user data
  const { data: moodEntries, isLoading: loadingMoods } = useQuery({
    queryKey: ['moodEntries'],
    queryFn: () => base44.entities.MoodEntry.list('-entry_date', 30)
  });

  const { data: userGoals, isLoading: loadingGoals } = useQuery({
    queryKey: ['userGoals'],
    queryFn: () => base44.entities.UserGoal.list('-created_date')
  });

  const { data: achievements, isLoading: loadingAchievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => base44.entities.Achievement.list()
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: () => base44.entities.UserProgress.list()
  });

  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list('-created_date', 50)
  });

  const { data: sleepEntries } = useQuery({
    queryKey: ['sleepEntries'],
    queryFn: () => base44.entities.SleepEntry.list('-sleep_date', 7)
  });

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  // Prepare stats for QuickStats component
  const stats = {
    currentStreak: userProgress?.[0]?.current_streak || 0,
    activeGoals: userGoals?.filter(g => g.is_active && !g.completed).length || 0,
    achievementsUnlocked: achievements?.filter(a => a.unlocked).length || 0,
    chatSessions: userProgress?.[0]?.total_chat_sessions || 0,
    moodTrend: moodEntries?.length > 1 ? 
      (moodEntries[0]?.mood_value > moodEntries[Math.min(6, moodEntries.length - 1)]?.mood_value ? 'up' : 
       moodEntries[0]?.mood_value < moodEntries[Math.min(6, moodEntries.length - 1)]?.mood_value ? 'down' : 'stable') : 'stable'
  };

  // Prepare user data for Sakina insights
  const userData = {
    recentMoods: moodEntries?.slice(0, 7) || [],
    currentStreak: stats.currentStreak,
    activeGoals: userGoals?.filter(g => g.is_active && !g.completed) || [],
    chatSessions: stats.chatSessions,
    avgSleepQuality: sleepEntries?.length > 0 ? 
      (sleepEntries.reduce((sum, s) => sum + (s.sleep_quality || 0), 0) / sleepEntries.length).toFixed(1) : null
  };

  const toggleWidget = (widget) => {
    setVisibleWidgets(prev => ({ ...prev, [widget]: !prev[widget] }));
  };

  const widgets = [
    { id: 'stats', label: 'Statistiques rapides' },
    { id: 'moodTrend', label: 'Tendance d\'humeur' },
    { id: 'goals', label: 'Progrès des objectifs' },
    { id: 'achievements', label: 'Réalisations' },
    { id: 'insights', label: 'Insights Sakina' }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-8">
      {/* Header */}
      <div className="bg-[#7BA9D8] px-6 pt-12 pb-24 rounded-b-[48px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-[18px] bg-white/20 backdrop-blur-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-white/80 font-light">Bonjour {currentUser?.full_name?.split(' ')[0] || 'toi'} 👋</p>
            </div>
          </div>
          <button
            onClick={() => setShowCustomize(!showCustomize)}
            className="w-10 h-10 rounded-[16px] bg-white/20 backdrop-blur-lg hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Customize Panel */}
      {showCustomize && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-6 -mt-16 mb-6"
        >
          <div className="bg-white rounded-[24px] p-5 card-shadow">
            <h3 className="font-bold text-[#2E4057] mb-3">Personnaliser le dashboard</h3>
            <div className="space-y-2">
              {widgets.map(widget => (
                <button
                  key={widget.id}
                  onClick={() => toggleWidget(widget.id)}
                  className="w-full flex items-center justify-between p-3 rounded-[16px] bg-[#FAFAFA] hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm text-[#2E4057]">{widget.label}</span>
                  {visibleWidgets[widget.id] ? (
                    <Eye className="w-4 h-4 text-[#7BA9D8]" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="px-6 -mt-16 space-y-6">
        {/* Quick Stats */}
        {visibleWidgets.stats && (
          <QuickStats stats={stats} loading={loadingMoods} />
        )}

        {/* Sakina Insights */}
        {visibleWidgets.insights && (
          <SakinaInsights userData={userData} />
        )}

        {/* Mood Trend Chart */}
        {visibleWidgets.moodTrend && (
          <MoodTrendChart 
            data={moodEntries?.slice(0, 7)} 
            loading={loadingMoods} 
          />
        )}

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Goals Progress */}
          {visibleWidgets.goals && (
            <GoalsProgress goals={userGoals} loading={loadingGoals} />
          )}

          {/* Recent Achievements */}
          {visibleWidgets.achievements && (
            <RecentAchievements 
              achievements={achievements} 
              loading={loadingAchievements} 
            />
          )}
        </div>
      </div>
    </div>
  );
}