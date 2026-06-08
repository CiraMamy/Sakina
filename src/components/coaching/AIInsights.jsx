import React from 'react';
import { motion } from 'framer-motion';
import { Brain, AlertCircle, TrendingUp, Moon, Heart } from 'lucide-react';

const PriorityCard = ({ priority, index }) => {
  const urgencyColors = {
    high: { bg: 'from-red-500 to-orange-500', icon: 'text-red-500', border: 'border-red-200' },
    medium: { bg: 'from-yellow-500 to-orange-400', icon: 'text-yellow-600', border: 'border-yellow-200' },
    low: { bg: 'from-blue-500 to-cyan-500', icon: 'text-blue-500', border: 'border-blue-200' }
  };

  const categoryIcons = {
    sleep: Moon,
    mood: Heart,
    stress: AlertCircle,
    routine: TrendingUp
  };

  const colors = urgencyColors[priority.urgency] || urgencyColors.medium;
  const Icon = categoryIcons[priority.category] || AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-[20px] p-4 card-shadow border-l-4 ${colors.border}`}
    >
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 rounded-[14px] bg-gradient-to-br ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-[#2E4057]">{priority.title}</h4>
            <span className={`text-xs font-semibold px-2 py-1 rounded-[8px] ${
              priority.urgency === 'high' ? 'bg-red-100 text-red-700' :
              priority.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {priority.urgency === 'high' ? 'Urgent' : priority.urgency === 'medium' ? 'Important' : 'À suivre'}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{priority.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function AIInsights({ analysis, insights, priorities }) {
  return (
    <div className="space-y-4">
      {/* Main Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] rounded-[24px] p-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-[14px] bg-white/20 backdrop-blur-lg flex items-center justify-center"
            >
              <Brain className="w-5 h-5 text-white" />
            </motion.div>
            <h3 className="text-lg font-bold text-white">Analyse Sakina</h3>
          </div>
          <p className="text-white/90 leading-relaxed">{analysis}</p>
        </div>
      </motion.div>

      {/* Key Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[24px] p-5 card-shadow"
      >
        <h3 className="text-lg font-bold text-[#2E4057] mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-[#8CB8E8]" />
          Points clés
        </h3>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-start space-x-3"
            >
              <div className="w-2 h-2 rounded-full bg-[#8CB8E8] mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Priorities */}
      {priorities && priorities.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-[#2E4057] mb-3 px-2">Priorités identifiées</h3>
          <div className="space-y-3">
            {priorities.map((priority, index) => (
              <PriorityCard key={index} priority={priority} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}