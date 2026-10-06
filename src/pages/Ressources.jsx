import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Headphones, BookOpen, Video, FileText, Play, Clock, ChevronRight, Sparkles } from 'lucide-react';

const categories = [
  { id: 'all', label: 'Tout', icon: null },
  { id: 'meditations', label: 'Méditations', icon: Headphones },
  { id: 'audios', label: 'Audios', icon: Play },
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'videos', label: 'Vidéos', icon: Video },
];

const resources = [
  {
    id: 1,
    title: 'Respiration profonde guidée',
    category: 'meditations',
    duration: '10 min',
    gradient: 'from-[#A7C7E7] to-[#E6DFF5]',
    emoji: '🌬️',
  },
  {
    id: 2,
    title: 'Comprendre l’anxiété',
    category: 'articles',
    duration: '5 min',
    gradient: 'from-[#C9E8D2] to-[#A7C7E7]',
    emoji: '🧠',
  },
  {
    id: 3,
    title: 'Sons apaisants de la nature',
    category: 'audios',
    duration: '30 min',
    gradient: 'from-[#F5EFE6] to-[#E6DFF5]',
    emoji: '🌿',
  },
  {
    id: 4,
    title: 'Méditation du matin',
    category: 'meditations',
    duration: '15 min',
    gradient: 'from-[#A7C7E7] to-[#C9E8D2]',
    emoji: '☀️',
  },
];

export default function Ressources() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredResources = selectedCategory === 'all'
    ? resources
    : resources.filter((resource) => resource.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F7F5F2] pb-8">
      <div className="bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_20%),linear-gradient(135deg,#A7C7E7_0%,#C9E8D2_100%)] px-6 pt-12 pb-8 rounded-b-[42px]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Ressources</h1>
            <p className="text-sm text-white/80">Outils pour ton bien-être quotidien</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                  isActive ? 'bg-[#24313A] text-white' : 'bg-white text-[#5E6E7A] border border-[#E9E0D4]'
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-sakina-700">Toutes les ressources</h2>
          <span className="text-sm text-[#5E6E7A]">{filteredResources.length} items</span>
        </div>

        <div className="space-y-4">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="sakina-card overflow-hidden"
            >
              <div className={`relative flex h-28 items-end bg-gradient-to-r ${resource.gradient} p-4`}>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-2xl backdrop-blur-sm">
                  {resource.emoji}
                </div>
                <div className="ml-auto flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-sakina-700 backdrop-blur-sm">
                  <Clock className="h-3.5 w-3.5" />
                  {resource.duration}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-sakina-700">{resource.title}</h3>
                  <ChevronRight className="h-4 w-4 text-[#5E6E7A]" />
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#5E6E7A]">
                  <span>{resource.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 rounded-[28px] bg-gradient-to-r from-[#E6DFF5] to-[#C9E8D2] p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-sakina-700">Programme de 7 jours</h3>
              <p className="mt-2 text-sm leading-6 text-sakina-700/80">Un programme complet pour retrouver la paix intérieure.</p>
              <button className="sakina-button sakina-button-soft mt-4">Commencer</button>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-white/50 backdrop-blur-sm">
              <BookOpen className="h-8 w-8 text-sakina-700" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}