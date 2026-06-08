import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, BellOff, Check } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Parametres() {
  const [theme, setTheme] = useState(() => localStorage.getItem('sakina-theme') || 'light');
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('sakina-notifications');
    return saved ? JSON.parse(saved) : {
      moodReminder: true,
      streakAlert: true,
      challengeUpdate: false,
      weeklyReport: true
    };
  });

  useEffect(() => {
    localStorage.setItem('sakina-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('sakina-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900 pb-8">
      <div className="bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] px-6 pt-12 pb-8 rounded-b-[48px]">
        <h1 className="text-3xl font-bold text-white mb-2">Paramètres</h1>
        <p className="text-white/80 font-light">Personnalise ton expérience</p>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* Theme Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-[24px] p-6 card-shadow"
        >
          <h2 className="text-lg font-bold text-[#2E4057] dark:text-white mb-4">Thème</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-[16px] border-2 transition-all ${
                theme === 'light'
                  ? 'border-[#8CB8E8] bg-[#8CB8E8]/10'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <Sun className={`w-6 h-6 mx-auto mb-2 ${theme === 'light' ? 'text-[#8CB8E8]' : 'text-gray-400'}`} />
              <p className={`text-sm font-medium ${theme === 'light' ? 'text-[#8CB8E8]' : 'text-gray-600 dark:text-gray-400'}`}>
                Clair
              </p>
              {theme === 'light' && <Check className="w-4 h-4 text-[#8CB8E8] mx-auto mt-2" />}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-[16px] border-2 transition-all ${
                theme === 'dark'
                  ? 'border-[#8CB8E8] bg-[#8CB8E8]/10'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <Moon className={`w-6 h-6 mx-auto mb-2 ${theme === 'dark' ? 'text-[#8CB8E8]' : 'text-gray-400'}`} />
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-[#8CB8E8]' : 'text-gray-600 dark:text-gray-400'}`}>
                Sombre
              </p>
              {theme === 'dark' && <Check className="w-4 h-4 text-[#8CB8E8] mx-auto mt-2" />}
            </button>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-[24px] p-6 card-shadow"
        >
          <h2 className="text-lg font-bold text-[#2E4057] dark:text-white mb-4">Notifications</h2>
          <div className="space-y-4">
            {[
              { key: 'moodReminder', label: 'Rappel check-in humeur', desc: 'Quotidien à 20h' },
              { key: 'streakAlert', label: 'Alerte série', desc: 'Maintiens ta série active' },
              { key: 'challengeUpdate', label: 'Défis et badges', desc: 'Nouveautés gamification' },
              { key: 'weeklyReport', label: 'Rapport hebdomadaire', desc: 'Résumé tous les lundis' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-[#2E4057] dark:text-white text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggleNotification(item.key)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    notifications[item.key] ? 'bg-[#8CB8E8]' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#8CB8E8]/10 dark:bg-[#8CB8E8]/20 rounded-[20px] p-4"
        >
          <p className="text-sm text-[#2E4057] dark:text-gray-300 text-center">
            💡 Tes préférences sont sauvegardées automatiquement
          </p>
        </motion.div>
      </div>
    </div>
  );
}