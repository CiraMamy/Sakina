import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Plus, Clock, Zap, Calendar, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

const SleepQualitySelector = ({ value, onChange }) => {
  const qualities = [
    { value: 1, emoji: '😫', label: 'Très mauvais' },
    { value: 2, emoji: '😕', label: 'Mauvais' },
    { value: 3, emoji: '😐', label: 'Moyen' },
    { value: 4, emoji: '😊', label: 'Bon' },
    { value: 5, emoji: '😴', label: 'Excellent' },
  ];

  return (
    <div className="grid grid-cols-5 gap-2">
      {qualities.map((quality) => (
        <motion.button
          key={quality.value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(quality.value)}
          className={`flex flex-col items-center rounded-[16px] p-3 transition-all ${
            value === quality.value ? 'bg-gradient-to-br from-[#A7C7E7] to-[#C9E8D2] text-sakina-700 scale-105' : 'bg-[#F7F5F2] text-[#5E6E7A]'
          }`}
        >
          <span className="mb-1 text-2xl">{quality.emoji}</span>
          <span className="text-center text-[10px] font-medium">{quality.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

const DisruptionTag = ({ label, selected, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`rounded-full px-3 py-2 text-sm font-medium ${
      selected ? 'bg-[#A7C7E7] text-sakina-700' : 'bg-[#F7F5F2] text-[#5E6E7A]'
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
    felt_rested: true,
  });

  const queryClient = useQueryClient();

  const { data: sleepEntries = [], isLoading } = useQuery({
    queryKey: ['sleepEntries'],
    queryFn: () => base44.entities.SleepEntry.list('-sleep_date', 30),
  });

  const createSleepEntry = useMutation({
    mutationFn: (data) => {
      const bedHour = Number(data.bedtime.split(':')[0]);
      const bedMin = Number(data.bedtime.split(':')[1]);
      const wakeHour = Number(data.wake_time.split(':')[0]);
      const wakeMin = Number(data.wake_time.split(':')[1]);

      let duration = wakeHour + wakeMin / 60 - (bedHour + bedMin / 60);
      if (duration < 0) duration += 24;

      return base44.entities.SleepEntry.create({
        ...data,
        sleep_duration: Math.round(duration * 10) / 10,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleepEntries'] });
      setShowForm(false);
      setFormData({
        sleep_date: format(new Date(), 'yyyy-MM-dd'),
        bedtime: '22:00',
        wake_time: '07:00',
        sleep_quality: 3,
        disruptions: [],
        notes: '',
        felt_rested: true,
      });
    },
  });

  const disruptions = ['Caféine', 'Stress', 'Bruit', 'Chaleur', 'Lumière', 'Écrans', 'Douleur', 'Pensées', 'Autre'];

  const toggleDisruption = (disruption) => {
    setFormData((prev) => ({
      ...prev,
      disruptions: prev.disruptions.includes(disruption)
        ? prev.disruptions.filter((item) => item !== disruption)
        : [...prev.disruptions, disruption],
    }));
  };

  const avgQuality = sleepEntries.length > 0
    ? (sleepEntries.reduce((sum, entry) => sum + entry.sleep_quality, 0) / sleepEntries.length).toFixed(1)
    : '0.0';

  const avgDuration = sleepEntries.length > 0
    ? (sleepEntries.reduce((sum, entry) => sum + (entry.sleep_duration || 0), 0) / sleepEntries.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-[#F7F5F2] pb-8">
      <div className="bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_20%),linear-gradient(135deg,#A7C7E7_0%,#E6DFF5_100%)] px-6 pt-12 pb-8 rounded-b-[42px]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Suivi du sommeil</h1>
            <p className="text-sm text-white/80">Ton repos, ta santé mentale</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)} className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-white/20 backdrop-blur-sm text-white">
            <Plus className="h-6 w-6" strokeWidth={2.5} />
          </motion.button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-[18px] bg-white/10 p-3 text-center backdrop-blur-sm">
            <Moon className="mx-auto mb-1 h-5 w-5 text-white" />
            <p className="text-xl font-bold text-white">{avgQuality}</p>
            <p className="text-[10px] text-white/70">Qualité moy.</p>
          </div>
          <div className="rounded-[18px] bg-white/10 p-3 text-center backdrop-blur-sm">
            <Clock className="mx-auto mb-1 h-5 w-5 text-white" />
            <p className="text-xl font-bold text-white">{avgDuration}h</p>
            <p className="text-[10px] text-white/70">Durée moy.</p>
          </div>
          <div className="rounded-[18px] bg-white/10 p-3 text-center backdrop-blur-sm">
            <Zap className="mx-auto mb-1 h-5 w-5 text-white" />
            <p className="text-xl font-bold text-white">{sleepEntries.length}</p>
            <p className="text-[10px] text-white/70">Nuits suivies</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="sakina-card p-5">
              <h3 className="mb-4 text-lg font-bold text-sakina-700">Nouvelle nuit</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-sakina-700">Date</label>
                  <input type="date" value={formData.sleep_date} onChange={(e) => setFormData({ ...formData, sleep_date: e.target.value })} className="w-full rounded-[16px] bg-[#F7F5F2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#A7C7E7]" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-sakina-700">Coucher</label>
                    <input type="time" value={formData.bedtime} onChange={(e) => setFormData({ ...formData, bedtime: e.target.value })} className="w-full rounded-[16px] bg-[#F7F5F2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#A7C7E7]" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-sakina-700">Réveil</label>
                    <input type="time" value={formData.wake_time} onChange={(e) => setFormData({ ...formData, wake_time: e.target.value })} className="w-full rounded-[16px] bg-[#F7F5F2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#A7C7E7]" />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-sakina-700">Qualité de sommeil</p>
                  <SleepQualitySelector value={formData.sleep_quality} onChange={(value) => setFormData({ ...formData, sleep_quality: value })} />
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-sakina-700">Perturbations</p>
                  <div className="flex flex-wrap gap-2">
                    {disruptions.map((item) => (
                      <DisruptionTag key={item} label={item} selected={formData.disruptions.includes(item)} onClick={() => toggleDisruption(item)} />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-sakina-700">Notes</label>
                  <textarea rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full resize-none rounded-[16px] bg-[#F7F5F2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#A7C7E7]" placeholder="Comment s’est passée cette nuit ?" />
                </div>

                <div className="flex items-center justify-between rounded-[18px] bg-[#F7F5F2] px-4 py-3 text-sm text-sakina-700">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-[#24313A]" />
                    <span>Repos profond ?</span>
                  </div>
                  <button onClick={() => setFormData({ ...formData, felt_rested: !formData.felt_rested })} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${formData.felt_rested ? 'bg-[#C9E8D2] text-sakina-700' : 'bg-[#E9E0D4] text-[#5E6E7A]'}`}>
                    {formData.felt_rested ? 'Oui' : 'Non'}
                  </button>
                </div>

                <Button onClick={() => createSleepEntry.mutate(formData)} className="h-12 w-full rounded-[16px] bg-[#24313A] text-white">
                  Enregistrer
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isLoading && sleepEntries.length === 0 && !showForm && (
          <div className="sakina-card p-12 text-center">
            <Moon className="mx-auto mb-4 h-14 w-14 text-[#7A8190]" />
            <p className="text-[#5E6E7A]">Aucune nuit enregistrée</p>
          </div>
        )}

        {sleepEntries.map((entry) => (
          <div key={entry.id} className="sakina-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-sakina-700">{entry.sleep_date}</p>
                <p className="text-xs text-[#5E6E7A]">{entry.sleep_quality}/5 • {entry.sleep_duration || 0}h</p>
              </div>
              <div className="rounded-full bg-[#E6DFF5] px-2 py-1 text-[10px] font-semibold text-sakina-700">
                {entry.felt_rested ? 'Reposé' : 'Fatigué'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
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