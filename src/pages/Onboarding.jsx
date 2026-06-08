import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MessageCircle, Sparkles, Moon, Users, Heart, Target, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { createPageUrl } from '../utils';
import { base44 } from '../api/base44Client';

const IntroStep = ({ onNext }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center text-center px-6"
  >
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-32 h-32 rounded-[32px] bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] flex items-center justify-center mb-8 card-shadow"
    >
      <span className="text-6xl">🌸</span>
    </motion.div>
    <h1 className="text-4xl font-bold text-[#2E4057] mb-4">Bienvenue sur Sakina</h1>
    <p className="text-lg text-gray-600 leading-relaxed max-w-md mb-8">
      Ton espace d'écoute bienveillant pour le bien-être mental. Un accompagnement doux, sans jugement, à ton rythme.
    </p>
    <Button onClick={onNext} className="w-full h-14 rounded-[24px] bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] hover:shadow-lg text-white font-semibold text-lg">
      Découvrir Sakina <ChevronRight className="ml-2 w-5 h-5" />
    </Button>
  </motion.div>
);

const FeaturesStep = ({ onNext }) => {
  const features = [
    { icon: MessageCircle, title: 'Sakina IA', desc: 'Discute avec ton assistante empathique 24h/24', color: 'from-blue-500 to-cyan-500' },
    { icon: Sparkles, title: 'Coaching personnalisé', desc: 'Plans d\'action adaptés à tes besoins', color: 'from-purple-500 to-indigo-500' },
    { icon: Moon, title: 'Suivi du sommeil', desc: 'Comprends l\'impact du repos sur ton humeur', color: 'from-indigo-500 to-purple-600' },
    { icon: Users, title: 'Professionnels', desc: 'Accède à un réseau de spécialistes', color: 'from-teal-500 to-green-500' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6">
      <h2 className="text-3xl font-bold text-[#2E4057] mb-2 text-center">Tes outils bien-être</h2>
      <p className="text-gray-600 text-center mb-8">Tout ce dont tu as besoin pour prendre soin de toi</p>
      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-[20px] p-4 card-shadow flex items-start space-x-4"
          >
            <div className={`w-12 h-12 rounded-[16px] bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#2E4057] mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <Button onClick={onNext} className="w-full h-14 rounded-[24px] bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] hover:shadow-lg">
        Continuer <ChevronRight className="ml-2 w-5 h-5" />
      </Button>
    </motion.div>
  );
};

const MoodCheckStep = ({ onNext }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');

  const moods = [
    { value: 1, emoji: '😔', label: 'Très mal' },
    { value: 2, emoji: '😟', label: 'Mal' },
    { value: 3, emoji: '😐', label: 'Neutre' },
    { value: 4, emoji: '😊', label: 'Bien' },
    { value: 5, emoji: '😄', label: 'Très bien' }
  ];

  const handleSubmit = async () => {
    if (selectedMood) {
      try {
        await base44.entities.MoodEntry.create({
          mood_value: selectedMood,
          mood_label: moods.find(m => m.value === selectedMood).label,
          note: note,
          entry_date: new Date().toISOString().split('T')[0]
        });
        onNext();
      } catch (error) {
        console.error('Error saving mood:', error);
        onNext();
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6">
      <h2 className="text-3xl font-bold text-[#2E4057] mb-2 text-center">Comment te sens-tu aujourd'hui ?</h2>
      <p className="text-gray-600 text-center mb-8">Commence ton suivi émotionnel</p>
      
      <div className="grid grid-cols-5 gap-2 mb-6">
        {moods.map((mood) => (
          <motion.button
            key={mood.value}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMood(mood.value)}
            className={`flex flex-col items-center p-3 rounded-[16px] transition-all ${
              selectedMood === mood.value ? 'bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] scale-105' : 'bg-white'
            } card-shadow`}
          >
            <span className="text-3xl mb-1">{mood.emoji}</span>
            <span className={`text-xs font-medium text-center ${selectedMood === mood.value ? 'text-white' : 'text-gray-600'}`}>
              {mood.label}
            </span>
          </motion.button>
        ))}
      </div>

      {selectedMood && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Veux-tu ajouter une note ? (optionnel)"
            className="w-full bg-white rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8CB8E8]/30 resize-none h-20 mb-6"
          />
        </motion.div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!selectedMood}
        className="w-full h-14 rounded-[24px] bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] hover:shadow-lg disabled:opacity-50"
      >
        Enregistrer <ChevronRight className="ml-2 w-5 h-5" />
      </Button>
    </motion.div>
  );
};

const GoalsStep = ({ onNext }) => {
  const [selectedGoals, setSelectedGoals] = useState([]);

  const goals = [
    { type: 'sleep', icon: Moon, title: 'Mieux dormir', desc: 'Améliorer ma qualité de sommeil' },
    { type: 'mood', icon: Heart, title: 'Stabiliser mon humeur', desc: 'Comprendre et gérer mes émotions' },
    { type: 'stress', icon: Target, title: 'Réduire le stress', desc: 'Apprendre à me détendre' },
    { type: 'mindfulness', icon: Sparkles, title: 'Être plus zen', desc: 'Pratiquer la pleine conscience' }
  ];

  const toggleGoal = (goalType) => {
    setSelectedGoals(prev =>
      prev.includes(goalType) ? prev.filter(g => g !== goalType) : [...prev, goalType]
    );
  };

  const handleSubmit = async () => {
    try {
      const goalPromises = selectedGoals.map(goalType => {
        const goal = goals.find(g => g.type === goalType);
        return base44.entities.UserGoal.create({
          goal_type: goalType,
          title: goal.title,
          description: goal.desc,
          target_value: 30,
          is_active: true
        });
      });
      await Promise.all(goalPromises);
    } catch (error) {
      console.error('Error saving goals:', error);
    }
    onNext();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6">
      <h2 className="text-3xl font-bold text-[#2E4057] mb-2 text-center">Tes objectifs</h2>
      <p className="text-gray-600 text-center mb-8">Qu'aimerais-tu améliorer ? (choix multiple)</p>
      
      <div className="space-y-3 mb-8">
        {goals.map((goal, index) => (
          <motion.button
            key={goal.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => toggleGoal(goal.type)}
            className={`w-full bg-white rounded-[20px] p-4 card-shadow flex items-start space-x-4 transition-all ${
              selectedGoals.includes(goal.type) ? 'ring-2 ring-[#8CB8E8] bg-[#8CB8E8]/5' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-[16px] ${
              selectedGoals.includes(goal.type) ? 'bg-[#8CB8E8]' : 'bg-gray-100'
            } flex items-center justify-center transition-colors`}>
              <goal.icon className={`w-6 h-6 ${selectedGoals.includes(goal.type) ? 'text-white' : 'text-gray-400'}`} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-[#2E4057] mb-1">{goal.title}</h3>
              <p className="text-sm text-gray-600">{goal.desc}</p>
            </div>
            {selectedGoals.includes(goal.type) && (
              <CheckCircle className="w-6 h-6 text-[#8CB8E8]" fill="#8CB8E8" />
            )}
          </motion.button>
        ))}
      </div>

      <div className="space-y-2">
        <Button onClick={handleSubmit} disabled={selectedGoals.length === 0} className="w-full h-14 rounded-[24px] bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] hover:shadow-lg disabled:opacity-50">
          Commencer mon voyage <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
        <button onClick={onNext} className="w-full text-sm text-gray-500 hover:text-[#8CB8E8] transition-colors">
          Passer cette étape
        </button>
      </div>
    </motion.div>
  );
};

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const steps = [IntroStep, FeaturesStep, MoodCheckStep, GoalsStep];
  const CurrentStepComponent = steps[currentStep];
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate(createPageUrl('Accueil'));
    }
  };
  
  const skipOnboarding = () => {
    navigate(createPageUrl('Accueil'));
  };
  
  return (
    <div className="min-h-screen bg-[#FAFAFA] relative">
      <div className="absolute top-8 right-6 z-10">
        <button onClick={skipOnboarding} className="text-sm text-gray-400 hover:text-[#8CB8E8] transition-colors font-medium">
          Passer
        </button>
      </div>
      
      <div className="flex flex-col justify-between min-h-screen pt-20 pb-12">
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <CurrentStepComponent onNext={nextStep} />
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="flex justify-center space-x-2 px-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep ? 'w-8 bg-[#8CB8E8]' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}