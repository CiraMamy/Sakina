import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Smartphone, Eye, ChevronRight, Plus } from 'lucide-react';
import { createPageUrl } from '../utils';

const AddictionCard = ({ title, icon: Icon, gradient, streak, lastCheck }) => (
  <motion.div whileHover={{ scale: 1.01, y: -4 }} whileTap={{ scale: 0.99 }} className="sakina-card p-5 transition-all hover:shadow-lg">
    <div className="mb-4 flex items-start justify-between">
      <div className={`flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br ${gradient}`}>
        <Icon className="h-7 w-7 text-white" strokeWidth={1.5} />
      </div>
      <ChevronRight className="h-5 w-5 text-[#A8B2BC]" />
    </div>

    <h3 className="mb-1 text-lg font-bold text-sakina-700">{title}</h3>
    <p className="mb-4 text-sm text-[#5E6E7A]">Dernier check : {lastCheck}</p>

    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-[#EAF2FB]">
        <Trophy className="h-4 w-4 text-[#7EA7D8]" />
      </div>
      <div>
        <p className="text-[11px] text-[#5E6E7A]">Série</p>
        <p className="text-sm font-bold text-sakina-700">{streak} jours</p>
      </div>
    </div>
  </motion.div>
);

export default function Addictions() {
  const addictions = [
    { title: 'Paris sportifs', icon: Trophy, gradient: 'from-[#FFB74D] to-[#FF9800]', streak: 12, lastCheck: 'Hier' },
    { title: 'Réseaux sociaux', icon: Smartphone, gradient: 'from-[#A7C7E7] to-[#7EA7D8]', streak: 5, lastCheck: 'Il y a 2h' },
    { title: 'Pornographie', icon: Eye, gradient: 'from-[#E57373] to-[#D32F2F]', streak: 28, lastCheck: "Aujourd'hui" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F2] pb-8">
      <div className="rounded-b-[42px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.3),_transparent_20%),linear-gradient(135deg,#A7C7E7_0%,#C9E8D2_100%)] px-6 pb-8 pt-12">
        <h1 className="mb-2 text-3xl font-bold text-white">Mes habitudes</h1>
        <p className="text-sm text-white/80">Surmonte tes défis, un jour à la fois</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-6 -mt-4 mb-6">
        <div className="sakina-card p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#C9E8D2] to-[#A7C7E7]">
                <Trophy className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm text-[#5E6E7A]">Meilleure série</p>
                <p className="text-2xl font-bold text-sakina-700">28 jours</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#5E6E7A]">Total habitudes</p>
              <p className="text-2xl font-bold text-sakina-700">{addictions.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-sakina-700">Suivi actif</h2>
          <button className="flex items-center text-sm font-medium text-sakina-700">
            <Plus className="mr-1 h-4 w-4" />
            Ajouter
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          {addictions.map((addiction, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }}>
              <AddictionCard {...addiction} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8 rounded-[28px] bg-gradient-to-r from-[#E6DFF5] to-[#C9E8D2] p-6">
          <h3 className="mb-2 text-lg font-bold text-sakina-700">Besoin d'aide ?</h3>
          <p className="mb-4 text-sm leading-relaxed text-sakina-700/75">
            Parler de tes défis peut être le premier pas vers la guérison. Sakina est là pour t'écouter sans jugement.
          </p>
          <Link to={createPageUrl('Chat')}>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-white py-3 font-semibold text-sakina-700 shadow-sm">
              <span>Parler à Sakina</span>
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
