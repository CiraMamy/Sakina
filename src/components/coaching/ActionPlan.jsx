import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, Star, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';

const ActionItem = ({ action, index, onComplete }) => {
  const [expanded, setExpanded] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(() => onComplete(action.points_reward), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-[20px] p-4 card-shadow transition-all ${
        completed ? 'opacity-50 scale-95' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-bold text-[#2E4057]">{action.title}</h4>
            <span className="text-xs bg-[#8CB8E8]/10 text-[#8CB8E8] px-2 py-1 rounded-[8px] font-semibold">
              {action.frequency}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-8 h-8 rounded-[12px] bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors ml-2"
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100 pt-3 mt-3"
          >
            <div className="bg-gradient-to-r from-[#CFE2F3] to-[#E8F4F8] rounded-[12px] p-3 mb-3">
              <p className="text-xs font-medium text-[#2E4057] mb-1">Impact attendu :</p>
              <p className="text-sm text-gray-700">{action.expected_impact}</p>
            </div>

            {!completed ? (
              <Button
                onClick={handleComplete}
                className="w-full h-10 rounded-[16px] bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] hover:shadow-lg text-white flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Marquer comme fait</span>
                <div className="flex items-center space-x-1 ml-2">
                  <Star className="w-3 h-3" fill="white" />
                  <span className="text-xs font-bold">+{action.points_reward}</span>
                </div>
              </Button>
            ) : (
              <div className="text-center py-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center space-x-2 text-green-600"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Terminé !</span>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-1 text-[#8CB8E8]">
          <Star className="w-4 h-4" fill="#8CB8E8" />
          <span className="text-sm font-bold">+{action.points_reward} points</span>
        </div>
        <span className="text-xs text-gray-500">{action.frequency}</span>
      </div>
    </motion.div>
  );
};

export default function ActionPlan({ actions, gamification }) {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleActionComplete = (points) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-[20px] p-4 mb-4 border border-yellow-100"
      >
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-[#2E4057] mb-1">Prochain jalon</h4>
            <p className="text-sm text-gray-700">{gamification.next_milestone}</p>
            <p className="text-xs text-gray-500 mt-2">
              Objectif série : {gamification.streak_goal} jours 🔥
            </p>
          </div>
        </div>
      </motion.div>

      <h3 className="text-lg font-bold text-[#2E4057] mb-4 px-2 flex items-center">
        <Target className="w-5 h-5 mr-2 text-[#8CB8E8]" />
        Plan d'action personnalisé
      </h3>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <ActionItem
            key={index}
            action={action}
            index={index}
            onComplete={handleActionComplete}
          />
        ))}
      </div>

      {showConfetti && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-6xl"
        >
          🎉
        </motion.div>
      )}
    </div>
  );
}