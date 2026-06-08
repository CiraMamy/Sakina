import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-[16px] p-3 card-shadow">
        <p className="text-sm font-semibold text-[#2E4057]">{payload[0].payload.date}</p>
        <p className="text-xs text-gray-600 mt-1">
          Humeur: <span className="font-bold text-[#8CB8E8]">{payload[0].value}/5</span>
        </p>
        {payload[0].payload.note && (
          <p className="text-xs text-gray-500 mt-1 italic">"{payload[0].payload.note}"</p>
        )}
      </div>
    );
  }
  return null;
};

export default function TrendChart({ data, showArea = true }) {
  const ChartComponent = showArea ? AreaChart : LineChart;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[24px] p-5 card-shadow"
    >
      <h3 className="text-lg font-bold text-[#2E4057] mb-4">Évolution sur 30 jours</h3>
      <ResponsiveContainer width="100%" height={220}>
        <ChartComponent data={data}>
          <defs>
            <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8CB8E8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8CB8E8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            domain={[1, 5]}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip content={<CustomTooltip />} />
          {showArea && (
            <Area
              type="monotone"
              dataKey="mood"
              stroke="#8CB8E8"
              strokeWidth={3}
              fill="url(#colorMood)"
            />
          )}
          {!showArea && (
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#8CB8E8"
              strokeWidth={3}
              dot={{ fill: '#8CB8E8', r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex items-center justify-center mt-4 space-x-6 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#8CB8E8]" />
          <span className="text-gray-600">Humeur générale</span>
        </div>
      </div>
    </motion.div>
  );
}