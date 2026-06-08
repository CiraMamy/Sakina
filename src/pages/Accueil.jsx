import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, TrendingUp, Target, BookMarked, Sparkles, ChevronRight, Star, Flame, Moon, Users, Phone } from 'lucide-react';
import { createPageUrl } from '../utils';
import ProgressBar from '../components/gamification/ProgressBar';

const FeatureCard = ({ title, description, icon: Icon, gradient, to, isPrimary = false }) => (
  <Link to={createPageUrl(to)}>
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`${
        isPrimary 
          ? 'col-span-2 bg-[#7BA9D8] hover:bg-[#5A8BBD] text-white h-48' 
          : 'bg-white hover:bg-[#E8F1F8] text-[#2E4057] h-40'
      } rounded-[32px] p-6 card-shadow transition-all duration-300 relative overflow-hidden group cursor-pointer`}
    >
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${
        isPrimary ? 'bg-white/10' : 'bg-[#7BA9D8]/5'
      } rounded-full blur-2xl transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-500`} />
      
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-2 ${isPrimary ? 'text-white' : 'text-[#2E4057]'}`}>
              {title}
            </h3>
            <p className={`text-sm font-light ${isPrimary ? 'text-white/90' : 'text-gray-600'}`}>
              {description}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-2xl ${
            isPrimary ? 'bg-white/20' : 'bg-[#7BA9D8]/10'
          } flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${isPrimary ? 'text-white' : 'text-[#7BA9D8]'}`} strokeWidth={1.5} />
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 ${isPrimary ? 'text-white/60' : 'text-gray-400'}`} />
      </div>
    </motion.div>
  </Link>
);

export default function Accueil() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-8">
      {/* Header */}
      <div className="bg-[#7BA9D8] px-6 pt-12 pb-8 rounded-b-[48px]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/80 text-sm font-light mb-1">Bonjour</p>
            <h1 className="text-3xl font-bold text-white">Cira</h1>
          </div>
          <Link to={createPageUrl('Profil')}>
            <div className="relative">
              <div className="w-14 h-14 rounded-[20px] bg-white/20 backdrop-blur-lg flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                <div className="w-12 h-12 rounded-[18px] bg-[#7BA9D8] flex items-center justify-center text-white font-bold text-lg">
                  C
                </div>
              </div>
              {/* Level badge */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-[8px] bg-orange-500 flex items-center justify-center border-2 border-white">
                <span className="text-xs font-bold text-white">8</span>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <ProgressBar
            currentLevel={8}
            totalPoints={1250}
            pointsToNextLevel={200}
            showInHeader={true}
          />
        </motion.div>
        
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-[16px] p-3 text-center">
            <Flame className="w-5 h-5 text-orange-300 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">12</p>
            <p className="text-xs text-white/70 font-light">Série</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-[16px] p-3 text-center">
            <Star className="w-5 h-5 text-yellow-300 mx-auto mb-1" fill="currentColor" />
            <p className="text-xl font-bold text-white">15</p>
            <p className="text-xs text-white/70 font-light">Succès</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-[16px] p-3 text-center">
            <Sparkles className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-xl font-bold text-white">47</p>
            <p className="text-xs text-white/70 font-light">Sessions</p>
          </div>
        </motion.div>
      </div>
      
      {/* Main Content */}
      <div className="px-6 mt-8">
        {/* Quick Actions Shortcuts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          <Link to={createPageUrl('Chat')}>
            <div className="bg-[#7BA9D8] hover:bg-[#5A8BBD] rounded-[24px] p-5 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <MessageCircle className="w-8 h-8 text-white mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">Parler à Sakina</h3>
                <p className="text-xs text-white/80">Disponible maintenant</p>
              </div>
            </div>
          </Link>
          <Link to={createPageUrl('Professionnels')}>
            <div className="bg-[#A8C5E6] hover:bg-[#7BA9D8] rounded-[24px] p-5 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <Users className="w-8 h-8 text-white mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">Professionnels</h3>
                <p className="text-xs text-white/80">Trouve du soutien</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Daily Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[#E8F1F8] rounded-[24px] p-6 mb-8 relative overflow-hidden"
        >
          <Sparkles className="absolute top-4 right-4 w-6 h-6 text-white/40" />
          <p className="text-sm text-[#2E4057]/60 font-medium mb-2">Citation du jour</p>
          <p className="text-lg text-[#2E4057] font-light leading-relaxed">
            "Un jour à la fois. C'est déjà beaucoup."
          </p>
        </motion.div>
        

        
        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-[#2E4057] mb-4">Tes outils bien-être</h2>
          <div className="grid grid-cols-2 gap-4">
            <FeatureCard
              title="Parler à Sakina"
              description="Ton espace d'écoute personnalisé"
              icon={MessageCircle}
              to="Chat"
              isPrimary
            />
            <FeatureCard
              title="Suivi émotionnel"
              description="Visualise ton humeur"
              icon={TrendingUp}
              to="Emotions"
            />
            <FeatureCard
              title="Addictions"
              description="Plans d'aide personnalisés"
              icon={Target}
              to="Addictions"
            />
            <FeatureCard
              title="Sommeil"
              description="Suivi de ton repos"
              icon={Moon}
              to="Sommeil"
            />
            <FeatureCard
              title="Journal"
              description="Écris tes pensées"
              icon={BookMarked}
              to="Journal"
            />
          </div>
        </motion.div>
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-[#2E4057] mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <Link to={createPageUrl('Emotions')}>
              <div className="bg-white hover:bg-[#E8F1F8] rounded-[24px] p-4 flex items-center justify-between card-shadow hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#7BA9D8]/10 flex items-center justify-center">
                    <span className="text-2xl">😊</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#2E4057]">Comment tu te sens ?</p>
                    <p className="text-sm text-gray-500 font-light">Enregistre ton humeur</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}