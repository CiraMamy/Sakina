import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function MoodTrendChart({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-[32px] p-6 card-shadow animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-64 bg-gray-100 rounded-[20px]" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-[32px] p-6 card-shadow text-center">
        <p className="text-gray-500">Pas encore de données d'humeur</p>
        <p className="text-sm text-gray-400 mt-1">Commence à enregistrer ton humeur</p>
      </div>
    );
  }

  // Calculate trend
  const trend = data.length > 1 ? 
    (data[data.length - 1].mood_value > data[0].mood_value ? 'up' : 
     data[data.length - 1].mood_value < data[0].mood_value ? 'down' : 'stable') : 'stable';

  const trendConfig = {
    up: { icon: TrendingUp, color: 'text-green-500', label: 'En amélioration', bg: 'bg-green-50' },
    down: { icon: TrendingDown, color: 'text-red-500', label: 'En baisse', bg: 'bg-red-50' },
    stable: { icon: Minus, color: 'text-gray-500', label: 'Stable', bg: 'bg-gray-50' }
  };

  const TrendIcon = trendConfig[trend].icon;

  const chartData = data.map(entry => ({
    date: format(new Date(entry.entry_date || entry.created_date), 'dd MMM', { locale: fr }),
    humeur: entry.mood_value,
    label: entry.mood_label
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-[16px] p-3 card-shadow border border-gray-100">
          <p className="text-sm font-semibold text-[#2E4057]">{payload[0].payload.label}</p>
          <p className="text-xs text-gray-500">{payload[0].payload.date}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[32px] p-6 card-shadow"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-[#2E4057]">Tendance d'humeur</h3>
          <p className="text-sm text-gray-500 mt-1">7 derniers jours</p>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-[16px] ${trendConfig[trend].bg}`}>
          <TrendIcon className={`w-4 h-4 ${trendConfig[trend].color}`} />
          <span className={`text-sm font-semibold ${trendConfig[trend].color}`}>
            {trendConfig[trend].label}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7BA9D8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#7BA9D8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="humeur" 
            stroke="#7BA9D8" 
            strokeWidth={3}
            fill="url(#colorMood)"
            dot={{ fill: '#7BA9D8', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}