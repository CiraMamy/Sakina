import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Heart, Brain, Wind, Moon } from 'lucide-react';

const suggestionsByContext = {
  lowMood: [
    { text: "Je traverse une période difficile", icon: Heart },
    { text: "J'ai juste besoin de parler", icon: Brain },
    { text: "Je me sens seul·e", icon: Heart },
  ],
  highStreak: [
    { text: "Je suis fier·e de mes progrès", icon: Lightbulb },
    { text: "Comment continuer sur ma lancée ?", icon: Moon },
    { text: "Un petit encouragement ?", icon: Heart },
  ],
  addiction: [
    { text: "Je lutte avec une addiction", icon: Heart },
    { text: "J'ai besoin de soutien", icon: Brain },
    { text: "C'est difficile aujourd'hui", icon: Lightbulb },
  ],
  default: [
    { text: "Je me sens stressé·e", icon: Heart },
    { text: "J'ai besoin de parler", icon: Brain },
    { text: "Je suis fatigué·e", icon: Wind },
    { text: "Aide-moi à respirer", icon: Lightbulb },
  ]
};

export default function SmartSuggestions({ context = 'default', onSelect }) {
  const suggestions = suggestionsByContext[context] || suggestionsByContext.default;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 pb-4"
    >
      <div className="flex items-center space-x-2 mb-3">
        <Lightbulb className="w-4 h-4 text-[#8CB8E8]" />
        <p className="text-xs text-gray-500 font-medium">Suggestions pour toi</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(suggestion.text)}
            className="flex items-center space-x-2 bg-white hover:bg-[#E8F1F8] rounded-[20px] px-4 py-2.5 card-shadow text-sm text-[#2E4057] transition-all duration-300"
            >
            <suggestion.icon className="w-4 h-4 text-[#8CB8E8]" />
            <span>{suggestion.text}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}