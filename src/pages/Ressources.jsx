import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Headphones, BookOpen, Video, FileText, Play, Clock, ChevronRight } from 'lucide-react';

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
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    gradient: 'from-[#8CB8E8] to-[#CFE2F3]'
  },
  {
    id: 2,
    title: 'Comprendre l\'anxiété',
    category: 'articles',
    duration: '5 min',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400',
    gradient: 'from-[#A7D7C5] to-[#8CB8E8]'
  },
  {
    id: 3,
    title: 'Sons apaisants de la nature',
    category: 'audios',
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
    gradient: 'from-[#CFE2F3] to-[#A7D7C5]'
  },
  {
    id: 4,
    title: 'Méditation du matin',
    category: 'meditations',
    duration: '15 min',
    image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400',
    gradient: 'from-[#8CB8E8] to-[#A7D7C5]'
  },
];

const ResourceCard = ({ resource }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white rounded-[24px] overflow-hidden card-shadow hover:shadow-lg transition-all cursor-pointer"
  >
    <div className="relative h-40">
      <img 
        src={resource.image} 
        alt={resource.title}
        className="w-full h-full object-cover"
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${resource.gradient} opacity-60`} />
      <div className="absolute bottom-3 left-3 flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-[12px] px-3 py-1">
        <Clock className="w-3 h-3 text-[#8CB8E8]" />
        <span className="text-xs font-medium text-[#2E4057]">{resource.duration}</span>
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-base font-bold text-[#2E4057] mb-1">{resource.title}</h3>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 capitalize">{resource.category}</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  </motion.div>
);

export default function Ressources() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);
  
  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] px-6 pt-12 pb-8 rounded-b-[48px]">
        <h1 className="text-3xl font-bold text-white mb-2">Ressources</h1>
        <p className="text-white/80 font-light">Outils pour ton bien-être quotidien</p>
      </div>
      
      {/* Categories Filter */}
      <div className="px-6 py-6">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-[20px] whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] text-white card-shadow'
                    : 'bg-white text-gray-600 card-shadow hover:shadow-lg'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span className="text-sm font-medium">{category.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Resources Grid */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#2E4057]">
            {selectedCategory === 'all' ? 'Toutes les ressources' : categories.find(c => c.id === selectedCategory)?.label}
          </h2>
          <span className="text-sm text-gray-500">{filteredResources.length} items</span>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-4"
        >
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ResourceCard resource={resource} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Featured Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-[#CFE2F3] to-[#A7D7C5] rounded-[24px] p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#2E4057] mb-2">
                Programme de 7 jours
              </h3>
              <p className="text-sm text-[#2E4057]/70 mb-4 font-light leading-relaxed max-w-xs">
                Un programme complet pour retrouver la paix intérieure
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#2E4057] font-semibold px-6 py-2.5 rounded-[16px] flex items-center space-x-2 card-shadow text-sm"
              >
                <span>Commencer</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="w-16 h-16 rounded-[20px] bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}