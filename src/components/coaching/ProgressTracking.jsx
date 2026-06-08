import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ProgressTracking({ userData, nextMilestone }) {
  const { moodEntries, sleepEntries } = userData;

  // Calculate trends (last 7 days vs previous 7 days)
  const last7Days = moodEntries.slice(0, 7);
  const previous7Days = moodEntries.slice(7, 14);

  const avgLast7 = last7Days.length > 0 
    ? last7Days.reduce((sum, e) => sum + e.mood_value, 0) / last7Days.length 
    : 0;
  const avgPrevious7 = previous7Days.length > 0 
    ? previous7Days.reduce((sum, e) => sum + e.mood_value, 0) / previous7Days.length 
    : 0;

  const moodTrend = avgLast7 > avgPrevious7 ? 'up' : avgLast7 < avgPrevious7 ? 'down' : 'stable';
  const moodChange = Math.abs(((avgLast7 - avgPrevious7) / avgPrevious7) * 100).toFixed(0);

  const avgSleepLast7 = sleepEntries.slice(0, 7).length > 0
    ? sleepEntries.slice(0, 7).reduce((sum, e) => sum + e.sleep_quality, 0) / sleepEntries.slice(0, 7).length
    : 0;
  const avgSleepPrevious7 = sleepEntries.slice(7, 14).length > 0
    ? sleepEntries.slice(7, 14).reduce((sum, e) => sum + e.sleep_quality, 0) / sleepEntries.slice(7, 14).length
    : 0;

  const sleepTrend = avgSleepLast7 > avgSleepPrevious7 ? 'up' : avgSleepLast7 < avgSleepPrevious7 ? 'down' : 'stable';
  const sleepChange = Math.abs(((avgSleepLast7 - avgSleepPrevious7) / avgSleepPrevious7) * 100).toFixed(0);

  const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-[24px] p-5 card-shadow"
    >
      <h3 className="text-lg font-bold text-[#2E4057] mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-[#8CB8E8]" />
        Évolution cette semaine
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[16px] p-4 border border-blue-100">
          <p className="text-xs text-gray-600 mb-2">Humeur moyenne</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-[#2E4057]">{avgLast7.toFixed(1)}</p>
            <div className="flex items-center space-x-1">
              <TrendIcon trend={moodTrend} />
              {moodTrend !== 'stable' && (
                <span className={`text-xs font-semibold ${
                  moodTrend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {moodChange}%
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[16px] p-4 border border-purple-100">
          <p className="text-xs text-gray-600 mb-2">Sommeil moyen</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-[#2E4057]">{avgSleepLast7.toFixed(1)}</p>
            <div className="flex items-center space-x-1">
              <TrendIcon trend={sleepTrend} />
              {sleepTrend !== 'stable' && (
                <span className={`text-xs font-semibold ${
                  sleepTrend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {sleepChange}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#CFE2F3] to-[#E8F4F8] rounded-[16px] p-4">
        <p className="text-xs font-medium text-[#2E4057] mb-2">Prochain objectif</p>
        <p className="text-sm text-gray-700 font-medium">{nextMilestone}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Analyse basée sur {moodEntries.length} entrées émotionnelles et {sleepEntries.length} nuits
        </p>
      </div>
    </motion.div>
  );
}