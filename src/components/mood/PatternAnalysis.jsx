import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, Clock, Zap } from 'lucide-react';

const PatternCard = ({ icon: Icon, title, description, trend, color, gradient }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`bg-gradient-to-br ${gradient} rounded-[20px] p-4 relative overflow-hidden`}
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-[14px] bg-white/20 backdrop-blur-sm flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        {trend && (
          <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-[12px] px-2 py-1">
            {trend > 0 ? (
              <TrendingUp className="w-3 h-3 text-white" />
            ) : (
              <TrendingDown className="w-3 h-3 text-white" />
            )}
            <span className="text-xs font-bold text-white">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-base font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-white/80 font-light leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export default function PatternAnalysis({ patterns }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#2E4057]">Schémas détectés</h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">IA</span>
      </div>
      
      <div className="space-y-3">
        <PatternCard
          icon={Calendar}
          title="Meilleur jour"
          description="Tes samedis sont généralement plus positifs (+23% que la moyenne)"
          trend={23}
          gradient="from-[#8CB8E8] to-[#A7D7C5]"
        />
        
        <PatternCard
          icon={Clock}
          title="Moment optimal"
          description="Ton humeur est meilleure en matinée, pic vers 10h"
          trend={18}
          gradient="from-[#A7D7C5] to-[#CFE2F3]"
        />
        
        <PatternCard
          icon={Zap}
          title="Cycle identifié"
          description="Baisse d'énergie récurrente les mercredis après-midi"
          trend={-15}
          gradient="from-[#FFB74D] to-[#FF9800]"
        />
      </div>
      
      {/* Insight Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 bg-gradient-to-r from-[#CFE2F3] to-[#E8F4F8] rounded-[20px] p-4 border border-[#8CB8E8]/20"
      >
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-[12px] bg-[#8CB8E8]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-lg">💡</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#2E4057] mb-1">Conseil personnalisé</h4>
            <p className="text-xs text-[#2E4057]/70 leading-relaxed font-light">
              Planifie tes tâches importantes le samedi matin quand ton humeur est à son pic. Prends des pauses le mercredi pour recharger ton énergie.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}