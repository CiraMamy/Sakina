import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Smartphone, Eye, ChevronRight, Plus } from 'lucide-react';
import { createPageUrl } from '../utils';

const AddictionCard = ({ title, icon: Icon, color, gradient, streak, lastCheck }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white rounded-[24px] p-5 card-shadow hover:shadow-lg transition-all"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-14 h-14 rounded-[20px] bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
    
    <h3 className="text-lg font-bold text-[#2E4057] mb-1">{title}</h3>
    <p className="text-sm text-gray-500 mb-4">Dernier check : {lastCheck}</p>
    
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-[12px] bg-[#8CB8E8]/10 flex items-center justify-center">
          <Trophy className="w-4 h-4 text-[#8CB8E8]" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Série</p>
          <p className="text-sm font-bold text-[#2E4057]">{streak} jours</p>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function Addictions() {
  const addictions = [
    {
      title: 'Paris sportifs',
      icon: Trophy,
      gradient: 'from-[#FFB74D] to-[#FF9800]',
      streak: 12,
      lastCheck: "Hier"
    },
    {
      title: 'Réseaux sociaux',
      icon: Smartphone,
      gradient: 'from-[#8CB8E8] to-[#5C9BCF]',
      streak: 5,
      lastCheck: "Il y a 2h"
    },
    {
      title: 'Pornographie',
      icon: Eye,
      gradient: 'from-[#E57373] to-[#D32F2F]',
      streak: 28,
      lastCheck: "Aujourd'hui"
    },
  ];
  
  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] px-6 pt-12 pb-8 rounded-b-[48px]">
        <h1 className="text-3xl font-bold text-white mb-2">Mes habitudes</h1>
        <p className="text-white/80 font-light">Surmonte tes défis, un jour à la fois</p>
      </div>
      
      {/* Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 -mt-4 mb-6"
      >
        <div className="bg-white rounded-[24px] p-5 card-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#A7D7C5] to-[#8CB8E8] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-light">Meilleure série</p>
                <p className="text-2xl font-bold text-[#2E4057]">28 jours</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-light">Total habitudes</p>
              <p className="text-2xl font-bold text-[#2E4057]">{addictions.length}</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#2E4057]">Suivi actif</h2>
          <button className="text-sm text-[#8CB8E8] font-medium flex items-center">
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </button>
        </div>
        
        {/* Addictions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {addictions.map((addiction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <AddictionCard {...addiction} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-[#CFE2F3] to-[#A7D7C5] rounded-[24px] p-6"
        >
          <h3 className="text-lg font-bold text-[#2E4057] mb-2">
            Besoin d'aide ?
          </h3>
          <p className="text-sm text-[#2E4057]/70 mb-4 font-light leading-relaxed">
            Parler de tes défis peut être le premier pas vers la guérison. Sakina est là pour t'écouter sans jugement.
          </p>
          <Link to={createPageUrl('Chat')}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-[#2E4057] font-semibold py-3 rounded-[20px] flex items-center justify-center space-x-2 card-shadow"
            >
              <span>Parler à Sakina</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}