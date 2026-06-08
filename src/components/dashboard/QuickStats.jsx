import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Flame, Target, Award, Brain } from 'lucide-react';

export default function QuickStats({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-[24px] p-4 card-shadow animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2" />
            <div className="h-6 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      icon: Flame,
      label: 'Série actuelle',
      value: stats?.currentStreak || 0,
      suffix: 'j',
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500'
    },
    {
      icon: Target,
      label: 'Objectifs actifs',
      value: stats?.activeGoals || 0,
      suffix: '',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      icon: Award,
      label: 'Récompenses',
      value: stats?.achievementsUnlocked || 0,
      suffix: '',
      color: 'from-yellow-400 to-orange-400',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      icon: Brain,
      label: 'Sessions Sakina',
      value: stats?.chatSessions || 0,
      suffix: '',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500'
    }
  ];

  const moodTrendIcon = stats?.moodTrend === 'up' ? TrendingUp : 
                        stats?.moodTrend === 'down' ? TrendingDown : Minus;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.bgColor} rounded-[24px] p-5 border border-gray-100`}
        >
          <div className={`w-12 h-12 rounded-[16px] bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-bold text-[#2E4057]">{stat.value}</span>
            {stat.suffix && <span className="text-lg text-gray-600">{stat.suffix}</span>}
          </div>
          <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}