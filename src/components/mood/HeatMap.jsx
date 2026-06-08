import React from 'react';
import { motion } from 'framer-motion';

const HeatMapCell = ({ value, day, hour, delay }) => {
  const getColor = (val) => {
    if (val === 0) return 'bg-gray-100';
    if (val <= 2) return 'bg-red-200';
    if (val <= 3) return 'bg-yellow-200';
    if (val <= 4) return 'bg-[#A7D7C5]';
    return 'bg-[#8CB8E8]';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`${getColor(value)} rounded-[6px] aspect-square flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#8CB8E8]/50 transition-all`}
      title={`${day} ${hour}h - Humeur: ${value}/5`}
    />
  );
};

export default function HeatMap() {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const hours = ['Matin', 'Midi', 'Soir'];
  
  // Mock data - matrice jour x moment de journée
  const data = [
    [4, 3, 3], // Lundi
    [3, 4, 3], // Mardi
    [3, 2, 3], // Mercredi
    [4, 4, 4], // Jeudi
    [4, 5, 4], // Vendredi
    [5, 5, 5], // Samedi
    [4, 4, 4], // Dimanche
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-[24px] p-5 card-shadow"
    >
      <h3 className="text-lg font-bold text-[#2E4057] mb-4">Carte thermique hebdomadaire</h3>
      
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-2 mb-2">
          <div className="text-xs font-medium text-gray-500" />
          {hours.map((hour, i) => (
            <div key={i} className="text-xs font-medium text-gray-500 text-center">
              {hour}
            </div>
          ))}
        </div>
        
        {days.map((day, dayIndex) => (
          <div key={day} className="grid grid-cols-4 gap-2">
            <div className="text-xs font-medium text-gray-600 flex items-center">
              {day}
            </div>
            {data[dayIndex].map((value, hourIndex) => (
              <HeatMapCell
                key={`${dayIndex}-${hourIndex}`}
                value={value}
                day={day}
                hour={hours[hourIndex]}
                delay={0.05 * (dayIndex * 3 + hourIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">Légende</span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Bas</span>
          <div className="flex space-x-1">
            <div className="w-4 h-4 rounded bg-red-200" />
            <div className="w-4 h-4 rounded bg-yellow-200" />
            <div className="w-4 h-4 rounded bg-[#A7D7C5]" />
            <div className="w-4 h-4 rounded bg-[#8CB8E8]" />
          </div>
          <span className="text-xs text-gray-500">Haut</span>
        </div>
      </div>
    </motion.div>
  );
}