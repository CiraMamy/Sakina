import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Heart, Moon, Coffee, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TriggerItem = ({ icon: Icon, label, impact, frequency, color }) => {
  const impactWidth = Math.abs(impact);
  const isPositive = impact > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-[16px] p-4 card-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-[12px] flex items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
            <Icon className="w-4 h-4" style={{ color }} strokeWidth={2} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#2E4057]">{label}</h4>
            <p className="text-xs text-gray-500">{frequency} mentions</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-[10px] ${isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
          <span className={`text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{impact}%
          </span>
        </div>
      </div>
      
      {/* Impact Bar */}
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${impactWidth}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`absolute top-0 ${isPositive ? 'right-0 bg-gradient-to-l from-green-400 to-green-500' : 'left-0 bg-gradient-to-r from-red-400 to-red-500'} h-full rounded-full`}
        />
      </div>
    </motion.div>
  );
};

const CorrelationCard = ({ factor1, factor2, correlation, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-[20px] p-4 card-shadow"
  >
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-sm font-bold text-[#2E4057]">Corrélation découverte</h4>
      <div className="bg-[#8CB8E8]/10 px-2.5 py-1 rounded-[10px]">
        <span className="text-xs font-bold text-[#8CB8E8]">{correlation}%</span>
      </div>
    </div>
    
    <div className="flex items-center space-x-2 mb-2">
      <span className="text-xs bg-[#CFE2F3] text-[#2E4057] px-2.5 py-1 rounded-[8px] font-medium">
        {factor1}
      </span>
      <span className="text-xs text-gray-400">→</span>
      <span className="text-xs bg-[#A7D7C5] text-[#2E4057] px-2.5 py-1 rounded-[8px] font-medium">
        {factor2}
      </span>
    </div>
    
    <p className="text-xs text-gray-600 leading-relaxed font-light">{description}</p>
  </motion.div>
);

export default function TriggerInsights({ triggers, correlations }) {
  const [sleepData, setSleepData] = useState(null);
  const [moodData, setMoodData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sleep, mood] = await Promise.all([
          base44.entities.SleepEntry.list('-sleep_date', 30).catch(() => []),
          base44.entities.MoodEntry.list('-entry_date', 30).catch(() => [])
        ]);
        setSleepData(sleep);
        setMoodData(mood);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  
  // Calculate sleep impact on mood
  const calculateSleepImpact = () => {
    if (!sleepData || !moodData || sleepData.length === 0 || moodData.length === 0) {
      return { impact: 42, frequency: 15 };
    }
    
    const goodSleep = sleepData.filter(s => s.sleep_quality >= 4);
    const avgMoodWithGoodSleep = goodSleep.length > 0 
      ? moodData.filter(m => goodSleep.some(s => s.sleep_date === m.entry_date))
               .reduce((sum, m) => sum + m.mood_value, 0) / goodSleep.length
      : 3;
    
    const avgMood = moodData.reduce((sum, m) => sum + m.mood_value, 0) / moodData.length;
    const impact = Math.round(((avgMoodWithGoodSleep - avgMood) / avgMood) * 100);
    
    return { impact, frequency: goodSleep.length };
  };
  
  const sleepImpact = calculateSleepImpact();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-bold text-[#2E4057] mb-4">Déclencheurs identifiés</h2>
      
      <div className="space-y-3 mb-6">
        <TriggerItem
          icon={Moon}
          label="Qualité du sommeil"
          impact={sleepImpact.impact}
          frequency={sleepImpact.frequency}
          color="#8CB8E8"
        />
        <TriggerItem
          icon={Briefcase}
          label="Travail intense"
          impact={-28}
          frequency={12}
          color="#E57373"
        />
        <TriggerItem
          icon={Users}
          label="Temps en famille"
          impact={35}
          frequency={8}
          color="#A7D7C5"
        />
        <TriggerItem
          icon={Coffee}
          label="Caféine excessive"
          impact={-18}
          frequency={10}
          color="#FFB74D"
        />
      </div>
      
      {/* Correlations */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[#2E4057] mb-3">Connexions</h3>
        <div className="space-y-3">
          {sleepData && sleepData.length > 0 && (
            <CorrelationCard
              factor1="Sommeil de qualité"
              factor2="Humeur positive"
              correlation={Math.abs(sleepImpact.impact)}
              description={`Ton sommeil a un impact de ${sleepImpact.impact > 0 ? '+' : ''}${sleepImpact.impact}% sur ton humeur générale`}
            />
          )}
          <CorrelationCard
            factor1="Sommeil 7h+"
            factor2="Humeur positive"
            correlation={87}
            description="Quand tu dors plus de 7h, ton humeur est excellente dans 87% des cas"
          />
          <CorrelationCard
            factor1="Exercice matin"
            factor2="Niveau d'énergie"
            correlation={76}
            description="L'activité physique matinale boost ton énergie pour toute la journée"
          />
        </div>
      </div>
      
      {/* Action Items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-[#FFE5E5] to-[#FFF0E5] rounded-[20px] p-4 border border-red-100"
      >
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-[12px] bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#2E4057] mb-1">Points d'attention</h4>
            <ul className="space-y-1.5">
              <li className="text-xs text-[#2E4057]/70 leading-relaxed font-light flex items-start">
                <span className="mr-2">•</span>
                <span>Réduire la charge de travail le mercredi après-midi</span>
              </li>
              <li className="text-xs text-[#2E4057]/70 leading-relaxed font-light flex items-start">
                <span className="mr-2">•</span>
                <span>Maintenir une routine de sommeil de 7h minimum</span>
              </li>
              <li className="text-xs text-[#2E4057]/70 leading-relaxed font-light flex items-start">
                <span className="mr-2">•</span>
                <span>Limiter la caféine après 14h pour améliorer le sommeil</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}