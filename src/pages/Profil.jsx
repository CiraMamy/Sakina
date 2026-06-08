import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Bell, Lock, Heart, HelpCircle, LogOut, ChevronRight, Edit2, Trophy, Star, Flame, Zap, Check, X, Settings } from 'lucide-react';
import { createPageUrl } from '../utils';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import GoalsSection from '../components/profile/GoalsSection';

const SettingItem = ({ icon: Icon, title, subtitle, onClick, color = '#8CB8E8' }) => (
  <motion.button
    whileHover={{ scale: 1.01, x: 4 }}
    whileTap={{ scale: 0.99 }}
    onClick={onClick}
    className="w-full bg-white rounded-[20px] p-4 card-shadow hover:shadow-lg transition-all flex items-center justify-between"
  >
    <div className="flex items-center space-x-4">
      <div className="w-11 h-11 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} strokeWidth={2} />
      </div>
      <div className="text-left">
        <p className="text-sm font-semibold text-[#2E4057]">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 font-light">{subtitle}</p>}
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </motion.button>
);

export default function Profil() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setIsEditing(false);
      toast.success('Profil mis à jour');
    }
  });

  const startEditing = () => {
    setEditedName(user?.full_name || '');
    setIsEditing(true);
  };

  const saveProfile = () => {
    if (editedName.trim()) {
      updateProfileMutation.mutate({ full_name: editedName });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900 pb-8">
      {/* Header */}
      <div className="bg-[#7BA9D8] px-6 pt-12 pb-24 rounded-b-[48px]">
        <h1 className="text-3xl font-bold text-white mb-2">Profil</h1>
        <p className="text-white/80 font-light">Gérer ton compte et préférences</p>
      </div>
      
      {/* Profile Card */}
      <div className="px-6 -mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-6 card-shadow mb-6 relative"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-[24px] bg-[#7BA9D8] flex items-center justify-center text-white text-3xl font-bold">
                  C
                </div>
                {/* Level badge */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-[10px] bg-orange-500 flex items-center justify-center border-2 border-white">
                  <span className="text-xs font-bold text-white">8</span>
                </div>
              </div>
              <div>
               {isEditing ? (
                 <div className="flex items-center space-x-2">
                   <input
                     type="text"
                     value={editedName}
                     onChange={(e) => setEditedName(e.target.value)}
                     className="bg-[#FAFAFA] dark:bg-gray-700 text-[#2E4057] dark:text-white text-xl font-bold rounded-[12px] px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#8CB8E8]"
                   />
                   <button onClick={saveProfile} className="w-8 h-8 rounded-[12px] bg-[#8CB8E8]/10 hover:bg-[#8CB8E8]/20 flex items-center justify-center">
                     <Check className="w-5 h-5 text-[#8CB8E8]" />
                   </button>
                   <button onClick={() => setIsEditing(false)} className="w-8 h-8 rounded-[12px] bg-red-50 hover:bg-red-100 flex items-center justify-center">
                     <X className="w-5 h-5 text-red-500" />
                   </button>
                 </div>
               ) : (
                 <h2 className="text-2xl font-bold text-[#2E4057] dark:text-white">{user?.full_name || 'Cira'}</h2>
               )}
               <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'cira@sakina.app'}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-4 h-4 text-[#8CB8E8]" fill="#8CB8E8" />
                  <span className="text-xs font-bold text-[#8CB8E8]">1,250 points</span>
                </div>
              </div>
            </div>
            {!isEditing && (
              <button onClick={startEditing} className="w-10 h-10 rounded-[14px] bg-[#FAFAFA] dark:bg-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <Edit2 className="w-4 h-4 text-[#8CB8E8]" />
              </button>
            )}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="w-10 h-10 rounded-[12px] bg-[#8CB8E8]/10 flex items-center justify-center mx-auto mb-2">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-xl font-bold text-[#2E4057]">12</p>
              <p className="text-xs text-gray-500 mt-0.5">Série</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-[12px] bg-[#A7D7C5]/10 flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-5 h-5 text-[#A7D7C5]" />
              </div>
              <p className="text-xl font-bold text-[#2E4057]">15</p>
              <p className="text-xs text-gray-500 mt-0.5">Succès</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-[12px] bg-purple-100 flex items-center justify-center mx-auto mb-2">
                <Zap className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-xl font-bold text-[#2E4057]">47</p>
              <p className="text-xs text-gray-500 mt-0.5">Sessions</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-[12px] bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-xl font-bold text-[#2E4057]">8</p>
              <p className="text-xs text-gray-500 mt-0.5">Niveau</p>
            </div>
          </div>
        </motion.div>
        
        {/* Achievements Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Link to={createPageUrl('Recompenses')}>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-[24px] p-5 mb-6 border border-yellow-100 hover:shadow-lg transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#2E4057]">Récompenses</h3>
                    <p className="text-sm text-gray-600 font-light">Voir tous tes succès</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
              
              {/* Recent badges preview */}
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] flex items-center justify-center text-xl">
                  📚
                </div>
                <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-xl">
                  🔥
                </div>
                <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xl">
                  🌟
                </div>
                <div className="flex-1 text-right">
                  <p className="text-xs text-gray-500">+3 cette semaine</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
        
        {/* Goals Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <GoalsSection />
        </motion.div>
        
        {/* Settings Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Account Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 px-2">
              Compte
            </h3>
            <div className="space-y-3">
              <Link to={createPageUrl('Preferences')}>
                <SettingItem
                  icon={User}
                  title="Préférences"
                  subtitle="Personnaliser Sakina"
                  color="#8CB8E8"
                />
              </Link>
              <Link to={createPageUrl('Parametres')}>
                <SettingItem
                  icon={Settings}
                  title="Paramètres"
                  subtitle="Thème et notifications"
                  color="#8CB8E8"
                />
              </Link>
            </div>
          </div>
          
          {/* Privacy Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 px-2">
              Confidentialité
            </h3>
            <div className="space-y-3">
              <SettingItem
                icon={Lock}
                title="Sécurité"
                subtitle="Mot de passe et authentification"
                color="#2E4057"
              />
              <SettingItem
                icon={Heart}
                title="Mes données"
                subtitle="Exporter ou supprimer mes données"
                color="#E57373"
              />
            </div>
          </div>
          
          {/* Support Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 px-2">
              Support
            </h3>
            <div className="space-y-3">
              <SettingItem
                icon={HelpCircle}
                title="Centre d'aide"
                subtitle="FAQ et assistance"
                color="#FFB74D"
              />
            </div>
          </div>
          
          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-white rounded-[20px] p-4 card-shadow hover:shadow-lg transition-all flex items-center justify-center space-x-3 text-red-500"
          >
            <LogOut className="w-5 h-5" strokeWidth={2} />
            <span className="font-semibold">Se déconnecter</span>
          </motion.button>
        </motion.div>
        
        {/* Version */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Sakina v1.0.0
        </p>
      </div>
    </div>
  );
}