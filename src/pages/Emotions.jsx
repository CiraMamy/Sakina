import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Smile, ChevronRight, BarChart3, Sparkles } from 'lucide-react';
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
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    onClick={() => onClick(value)}
    className={`flex flex-col items-center justify-center rounded-[24px] p-4 transition-all ${
      selected === value ? 'bg-gradient-to-br from-[#A7C7E7] to-[#C9E8D2] text-white shadow-lg' : 'bg-[#F7F5F2] text-[#5E6E7A]'
    }`}
  >
    <span className="mb-2 text-4xl">{emoji}</span>
    <span className={`text-[11px] font-medium ${selected === value ? 'text-white' : 'text-[#5E6E7A]'}`}>{label}</span>
  </motion.button>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="sakina-card p-4">
    <div className="mb-2 flex items-center justify-between">
      <div className="flex h-10 w-10 items-center justify-center rounded-[16px]" style={{ backgroundColor: `${color}20` }}>
        <Icon className="h-5 w-5" style={{ color }} strokeWidth={2} />
      </div>
      <span className="text-[11px] text-[#5E6E7A]">{label}</span>
    </div>
    <p className="text-2xl font-bold text-sakina-700">{value}</p>
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
    <div className="min-h-screen bg-[#F7F5F2] pb-8">
      <div className="rounded-b-[42px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.3),_transparent_20%),linear-gradient(135deg,#A7C7E7_0%,#C9E8D2_100%)] px-6 pb-32 pt-12">
        <h1 className="mb-2 text-3xl font-bold text-white">Suivi émotionnel</h1>
        <p className="text-sm text-white/80">Comprends ton évolution au fil du temps</p>
      </div>

      <div className="-mt-24 space-y-6 px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sakina-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-sakina-700">Comment te sens-tu ?</h2>
            <div className="flex items-center gap-2 text-sm text-[#5E6E7A]">
              <Calendar className="h-4 w-4" />
              <span>Aujourd'hui</span>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-5 gap-3">
            {moodEmojis.map((mood) => (
              <MoodButton key={mood.value} emoji={mood.emoji} label={mood.label} value={mood.value} selected={selectedMood} onClick={setSelectedMood} />
            ))}
          </div>

          {selectedMood && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6">
              <label className="mb-2 block text-sm font-medium text-sakina-700">Ajoute une note (optionnel)</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Qu'est-ce qui t'a fait ressentir ça aujourd'hui ?" className="h-24 w-full resize-none rounded-[24px] bg-[#F7F5F2] px-5 py-4 text-sm text-sakina-700 outline-none placeholder:text-[#7B8793] focus:bg-white" />
            </motion.div>
          )}

          {selectedMood && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Button onClick={handleSaveMood} className="h-12 w-full rounded-[18px] bg-[#24313A] text-white hover:bg-[#1d2a32]">
                {showSuccess ? '✓ Enregistré !' : 'Enregistrer mon humeur'}
              </Button>
            </motion.div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-3 gap-3">
          <StatCard icon={TrendingUp} label="Moyenne" value="4.2" color="#8CB8E8" />
          <StatCard icon={Smile} label="Meilleur" value="5.0" color="#A7D7C5" />
          <StatCard icon={Calendar} label="Série" value="7j" color="#FFB74D" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Link to={createPageUrl('Tendances')}>
            <div className="group relative mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#A7C7E7] to-[#C9E8D2] p-5">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-white/20 backdrop-blur-sm">
                    <BarChart3 className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">Analyse approfondie</h3>
                      <Sparkles className="h-4 w-4 text-white/80" />
                    </div>
                    <p className="text-sm text-white/80">Découvre tes schémas et tendances</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-white transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="sakina-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-sakina-700">Cette semaine</h2>
            <Link to={createPageUrl('Tendances')}>
              <button className="flex items-center text-sm font-medium text-sakina-700">
                Voir plus
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </Link>
          </div>

          <div className="flex h-40 items-end justify-between gap-2">
            {weekData.map((day, index) => {
              const height = (day.mood / maxMood) * 100;
              const color = moodEmojis.find((m) => m.value === day.mood)?.color || '#8CB8E8';

              return (
                <div key={index} className="flex flex-1 flex-col items-center">
                  <motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }} className="mb-2 w-full rounded-t-[12px]" style={{ backgroundColor: color }} />
                  <span className="text-xs font-medium text-[#5E6E7A]">{day.day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
