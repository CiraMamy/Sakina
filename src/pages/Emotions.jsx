import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Smile, Meh, Frown, ChevronRight, BarChart3, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { createPageUrl } from '../utils';

const moodEmojis = [
  { emoji: '😔', label: 'Très mal', value: 1, color: '#E57373' },
  { emoji: '😟', label: 'Mal', value: 2, color: '#FFB74D' },
  { emoji: '😐', label: 'Neutre', value: 3, color: '#FFD54F' },
  { emoji: '😊', label: 'Bien', value: 4, color: '#A7D7C5' },
  { emoji: '😄', label: 'Très bien', value: 5, color: '#8CB8E8' },
];

const MoodButton = ({ emoji, label, value, selected, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => onClick(value)}
    className={`flex flex-col items-center justify-center p-4 rounded-[24px] transition-all ${
      selected === value
        ? 'bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] card-shadow scale-105'
        : 'bg-white card-shadow hover:shadow-lg'
    }`}
  >
    <span className="text-4xl mb-2">{emoji}</span>
    <span className={`text-xs font-medium ${selected === value ? 'text-white' : 'text-gray-600'}`}>
      {label}
    </span>
  </motion.button>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-[24px] p-4 card-shadow">
    <div className="flex items-center justify-between mb-2">
      <div className={`w-10 h-10 rounded-[16px] flex items-center justify-center`} style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-5 h-5" style={{ color }} strokeWidth={2} />
      </div>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
    <p className="text-2xl font-bold text-[#2E4057]">{value}</p>
  </div>
);

export default function Emotions() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleSaveMood = () => {
    if (selectedMood) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedMood(null);
        setNote('');
      }, 2000);
    }
  };
  
  // Mock data for chart
  const weekData = [
    { day: 'Lun', mood: 3 },
    { day: 'Mar', mood: 4 },
    { day: 'Mer', mood: 3 },
    { day: 'Jeu', mood: 5 },
    { day: 'Ven', mood: 4 },
    { day: 'Sam', mood: 5 },
    { day: 'Dim', mood: 4 },
  ];
  
  const maxMood = 5;
  
  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] px-6 pt-12 pb-32 rounded-b-[48px]">
        <h1 className="text-3xl font-bold text-white mb-2">Suivi émotionnel</h1>
        <p className="text-white/80 font-light">Comprends ton évolution au fil du temps</p>
      </div>
      
      {/* Main Card */}
      <div className="px-6 -mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-6 card-shadow mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#2E4057]">Comment te sens-tu ?</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Aujourd'hui</span>
            </div>
          </div>
          
          {/* Mood Selector */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {moodEmojis.map((mood) => (
              <MoodButton
                key={mood.value}
                emoji={mood.emoji}
                label={mood.label}
                value={mood.value}
                selected={selectedMood}
                onClick={setSelectedMood}
              />
            ))}
          </div>
          
          {/* Note Input */}
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <label className="text-sm font-medium text-[#2E4057] mb-2 block">
                Ajoute une note (optionnel)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Qu'est-ce qui t'a fait ressentir ça aujourd'hui ?"
                className="w-full bg-[#FAFAFA] rounded-[24px] px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#8CB8E8]/30 transition-all resize-none h-24"
              />
            </motion.div>
          )}
          
          {/* Save Button */}
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                onClick={handleSaveMood}
                className="w-full h-12 rounded-[24px] bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] hover:shadow-lg transition-all text-white font-semibold"
              >
                {showSuccess ? '✓ Enregistré !' : 'Enregistrer mon humeur'}
              </Button>
            </motion.div>
          )}
        </motion.div>
        
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <StatCard icon={TrendingUp} label="Moyenne" value="4.2" color="#8CB8E8" />
          <StatCard icon={Smile} label="Meilleur" value="5.0" color="#A7D7C5" />
          <StatCard icon={Calendar} label="Série" value="7j" color="#FFB74D" />
        </motion.div>
        
        {/* Analysis CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Link to={createPageUrl('Tendances')}>
            <div className="bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] rounded-[24px] p-5 mb-6 relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-[16px] bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-base font-bold text-white">Analyse approfondie</h3>
                      <Sparkles className="w-4 h-4 text-white/80" />
                    </div>
                    <p className="text-sm text-white/80 font-light">Découvre tes schémas et tendances</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>
        
        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[32px] p-6 card-shadow"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#2E4057]">Cette semaine</h2>
            <Link to={createPageUrl('Tendances')}>
              <button className="text-sm text-[#8CB8E8] font-medium flex items-center hover:text-[#7AA5D1] transition-colors">
                Voir plus
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </Link>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between h-40 space-x-2">
            {weekData.map((day, index) => {
              const height = (day.mood / maxMood) * 100;
              const color = moodEmojis.find(m => m.value === day.mood)?.color || '#8CB8E8';
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="w-full rounded-t-[12px] mb-2"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-500 font-medium">{day.day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}