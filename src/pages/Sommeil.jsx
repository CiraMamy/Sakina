import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Plus, TrendingUp, Clock, Zap, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const SleepQualitySelector = ({ value, onChange }) => {
  const qualities = [
    { value: 1, emoji: '😫', label: 'Très mauvais' },
    { value: 2, emoji: '😕', label: 'Mauvais' },
    { value: 3, emoji: '😐', label: 'Moyen' },
    { value: 4, emoji: '😊', label: 'Bon' },
    { value: 5, emoji: '😴', label: 'Excellent' }
  ];

  return (
    <div className="grid grid-cols-5 gap-2">
      {qualities.map((quality) => (
        <motion.button
          key={quality.value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(quality.value)}
          className={`flex flex-col items-center p-3 rounded-[16px] transition-all ${
            value === quality.value
              ? 'bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] text-white scale-105'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="text-2xl mb-1">{quality.emoji}</span>
          <span className="text-xs font-medium text-center">{quality.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

const DisruptionTag = ({ label, selected, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-4 py-2 rounded-[16px] text-sm font-medium transition-all ${
      selected
        ? 'bg-[#8CB8E8] text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {label}
  </motion.button>
);

export default function Sommeil() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    sleep_date: format(new Date(), 'yyyy-MM-dd'),
    bedtime: '22:00',
    wake_time: '07:00',
    sleep_quality: 3,
    disruptions: [],
    notes: '',
    felt_rested: true
  });

  const queryClient = useQueryClient();

  const { data: sleepEntries = [], isLoading } = useQuery({
    queryKey: ['sleepEntries'],
    queryFn: () => base44.entities.SleepEntry.list('-sleep_date', 30)
  });

  const createSleepEntry = useMutation({
    mutationFn: (data) => {
      // Calculate sleep duration
      const bedHour = parseInt(data.bedtime.split(':')[0]);
      const bedMin = parseInt(data.bedtime.split(':')[1]);
      const wakeHour = parseInt(data.wake_time.split(':')[0]);
      const wakeMin = parseInt(data.wake_time.split(':')[1]);
      
      let duration = (wakeHour + wakeMin/60) - (bedHour + bedMin/60);
      if (duration < 0) duration += 24;
      
      return base44.entities.SleepEntry.create({
        ...data,
        sleep_duration: Math.round(duration * 10) / 10
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sleepEntries']);
      setShowForm(false);
      setFormData({
        sleep_date: format(new Date(), 'yyyy-MM-dd'),
        bedtime: '22:00',
        wake_time: '07:00',
        sleep_quality: 3,
        disruptions: [],
        notes: '',
        felt_rested: true
      });
    }
  });

  const disruptions = [
    'Caféine', 'Stress', 'Bruit', 'Chaleur', 'Lumière', 
    'Écrans', 'Douleur', 'Pensées', 'Autre'
  ];

  const toggleDisruption = (disruption) => {
    setFormData(prev => ({
      ...prev,
      disruptions: prev.disruptions.includes(disruption)
        ? prev.disruptions.filter(d => d !== disruption)
        : [...prev.disruptions, disruption]
    }));
  };

  const avgQuality = sleepEntries.length > 0
    ? (sleepEntries.reduce((sum, e) => sum + e.sleep_quality, 0) / sleepEntries.length).toFixed(1)
    : 0;

  const avgDuration = sleepEntries.length > 0
    ? (sleepEntries.reduce((sum, e) => sum + (e.sleep_duration || 0), 0) / sleepEntries.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 px-6 pt-12 pb-8 rounded-b-[48px]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Suivi du sommeil</h1>
            <p className="text-white/80 font-light">Ton repos, ta santé mentale</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="w-14 h-14 rounded-[20px] bg-white/20 backdrop-blur-lg flex items-center justify-center"
          >
            <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-lg rounded-[16px] p-3 text-center">
            <Moon className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{avgQuality}</p>
            <p className="text-xs text-white/70">Qualité moy.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-[16px] p-3 text-center">
            <Clock className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{avgDuration}h</p>
            <p className="text-xs text-white/70">Durée moy.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-[16px] p-3 text-center">
            <Zap className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{sleepEntries.length}</p>
            <p className="text-xs text-white/70">Nuits suivies</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-[24px] p-5 card-shadow"
            >
              <h3 className="text-lg font-bold text-[#2E4057] mb-4">Nouvelle nuit</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#2E4057] block mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.sleep_date}
                    onChange={(e) => setFormData({...formData, sleep_date: e.target.value})}
                    className="w-full bg-[#FAFAFA] rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8CB8E8]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-[#2E4057] block mb-2">
                      Coucher
                    </label>
                    <input
                      type="time"
                      value={formData.bedtime}
                      onChange={(e) => setFormData({...formData, bedtime: e.target.value})}
                      className="w-full bg-[#FAFAFA] rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8CB8E8]/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#2E4057] block mb-2">
                      Réveil
                    </label>
                    <input
                      type="time"
                      value={formData.wake_time}
                      onChange={(e) => setFormData({...formData, wake_time: e.target.value})}
                      className="w-full bg-[#FAFAFA] rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8CB8E8]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#2E4057] block mb-3">
                    Qualité du sommeil
                  </label>
                  <SleepQualitySelector
                    value={formData.sleep_quality}
                    onChange={(value) => setFormData({...formData, sleep_quality: value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#2E4057] block mb-3">
                    Facteurs perturbateurs
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {disruptions.map((disruption) => (
                      <DisruptionTag
                        key={disruption}
                        label={disruption}
                        selected={formData.disruptions.includes(disruption)}
                        onClick={() => toggleDisruption(disruption)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#2E4057] block mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Comment s'est passée ta nuit ?"
                    className="w-full bg-[#FAFAFA] rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8CB8E8]/30 resize-none h-20"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="felt_rested"
                    checked={formData.felt_rested}
                    onChange={(e) => setFormData({...formData, felt_rested: e.target.checked})}
                    className="w-5 h-5 rounded accent-[#8CB8E8]"
                  />
                  <label htmlFor="felt_rested" className="text-sm text-[#2E4057]">
                    Je me sens reposé(e)
                  </label>
                </div>

                <div className="flex space-x-3 pt-2">
                  <Button
                    onClick={() => setShowForm(false)}
                    className="flex-1 h-11 rounded-[16px] bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={() => createSleepEntry.mutate(formData)}
                    disabled={createSleepEntry.isPending}
                    className="flex-1 h-11 rounded-[16px] bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg text-white"
                  >
                    {createSleepEntry.isPending ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sleep History */}
        <div>
          <h2 className="text-xl font-bold text-[#2E4057] mb-4">Historique</h2>
          <div className="space-y-3">
            {sleepEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[20px] p-4 card-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-[#2E4057]">
                      {format(parseISO(entry.sleep_date), 'EEEE d MMMM', { locale: fr })}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {entry.bedtime} → {entry.wake_time} ({entry.sleep_duration}h)
                    </p>
                  </div>
                  <div className="text-2xl">
                    {entry.sleep_quality === 5 ? '😴' : entry.sleep_quality === 4 ? '😊' : entry.sleep_quality === 3 ? '😐' : entry.sleep_quality === 2 ? '😕' : '😫'}
                  </div>
                </div>

                {entry.disruptions && entry.disruptions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {entry.disruptions.map((d, i) => (
                      <span key={i} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-[8px]">
                        {d}
                      </span>
                    ))}
                  </div>
                )}

                {entry.notes && (
                  <p className="text-sm text-gray-600 italic mt-2">"{entry.notes}"</p>
                )}
              </motion.div>
            ))}

            {sleepEntries.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Moon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucune nuit enregistrée</p>
                <p className="text-sm text-gray-400 mt-1">Commence à suivre ton sommeil</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}