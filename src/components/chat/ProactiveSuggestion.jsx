import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, TrendingUp, AlertCircle, Target } from 'lucide-react';

export default function ProactiveSuggestion({ suggestion, onAccept, onDismiss }) {
  if (!suggestion) return null;

  const iconMap = {
    improvement: TrendingUp,
    pattern: Lightbulb,
    concern: AlertCircle,
    goal: Target
  };

  const Icon = iconMap[suggestion.type] || Lightbulb;

  const colorMap = {
    improvement: 'from-green-50 to-emerald-50 border-green-200',
    pattern: 'from-blue-50 to-indigo-50 border-blue-200',
    concern: 'from-orange-50 to-red-50 border-orange-200',
    goal: 'from-purple-50 to-pink-50 border-purple-200'
  };

  const bgClass = colorMap[suggestion.type] || 'from-gray-50 to-slate-50 border-gray-200';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`bg-gradient-to-r ${bgClass} border rounded-[20px] p-4 mx-6 mb-4 shadow-md`}
      >
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-[14px] bg-white shadow-sm flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-[#8CB8E8]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#2E4057] mb-1">
              {suggestion.title}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {suggestion.message}
            </p>
            {suggestion.action && (
              <div className="flex items-center space-x-2 mt-3">
                <button
                  onClick={onAccept}
                  className="px-4 py-2 bg-[#8CB8E8] text-white text-xs font-medium rounded-[12px] hover:bg-[#8CB8E8]/90 transition-colors"
                >
                  {suggestion.action}
                </button>
                <button
                  onClick={onDismiss}
                  className="px-4 py-2 bg-white text-gray-600 text-xs font-medium rounded-[12px] hover:bg-gray-50 transition-colors"
                >
                  Plus tard
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}