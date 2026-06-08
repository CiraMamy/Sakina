import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Calendar, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import TrendChart from '../components/mood/TrendChart';
import PatternAnalysis from '../components/mood/PatternAnalysis';
import TriggerInsights from '../components/mood/TriggerInsights';
import HeatMap from '../components/mood/HeatMap';
import { Button } from '../components/ui/button';

export default function Tendances() {
  const [timeRange, setTimeRange] = useState('30d');
  
  // Mock data pour le graphique
  const mockData = [
    { date: '1 Jan', mood: 3, note: 'Début d\'année calme' },
    { date: '3 Jan', mood: 4, note: 'Bonne journée' },
    { date: '5 Jan', mood: 3, note: 'Neutre' },
    { date: '7 Jan', mood: 5, note: 'Excellent weekend' },
    { date: '9 Jan', mood: 4, note: 'Productif' },
    { date: '11 Jan', mood: 2, note: 'Stress au travail' },
    { date: '13 Jan', mood: 3, note: 'Mieux' },
    { date: '15 Jan', mood: 4, note: 'Repos' },
    { date: '17 Jan', mood: 5, note: 'Très bien' },
    { date: '19 Jan', mood: 4, note: 'Stable' },
    { date: '21 Jan', mood: 3, note: 'Fatigué' },
    { date: '23 Jan', mood: 4, note: 'Récupération' },
    { date: '25 Jan', mood: 5, note: 'Super journée' },
    { date: '27 Jan', mood: 4, note: 'Bien' },
    { date: '29 Jan', mood: 4, note: 'Constant' },
  ];
  
  const timeRanges = [
    { value: '7d', label: '7 jours' },
    { value: '30d', label: '30 jours' },
    { value: '90d', label: '3 mois' },
    { value: '1y', label: '1 an' },
  ];
  
  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] px-6 pt-12 pb-8 rounded-b-[48px] sticky top-0 z-10">
        <div className="flex items-center justify-between mb-6">
          <Link to={createPageUrl('Emotions')}>
            <button className="w-10 h-10 rounded-[14px] bg-white/20 backdrop-blur-lg flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          </Link>
          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 rounded-[14px] bg-white/20 backdrop-blur-lg flex items-center justify-center hover:bg-white/30 transition-colors">
              <Share2 className="w-4 h-4 text-white" />
            </button>
            <button className="w-10 h-10 rounded-[14px] bg-white/20 backdrop-blur-lg flex items-center justify-center hover:bg-white/30 transition-colors">
              <Download className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Analyse approfondie</h1>
        <p className="text-white/80 font-light">Insights générés par intelligence artificielle</p>
        
        {/* Time Range Selector */}
        <div className="flex space-x-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-4 py-2 rounded-[16px] whitespace-nowrap text-sm font-medium transition-all ${
                timeRange === range.value
                  ? 'bg-white text-[#8CB8E8]'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-6"
      >
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-[20px] p-4 card-shadow text-center">
            <p className="text-2xl font-bold text-[#8CB8E8] mb-1">3.8</p>
            <p className="text-xs text-gray-500">Moyenne</p>
          </div>
          <div className="bg-white rounded-[20px] p-4 card-shadow text-center">
            <p className="text-2xl font-bold text-[#A7D7C5] mb-1">+12%</p>
            <p className="text-xs text-gray-500">Évolution</p>
          </div>
          <div className="bg-white rounded-[20px] p-4 card-shadow text-center">
            <p className="text-2xl font-bold text-[#FFB74D] mb-1">18</p>
            <p className="text-xs text-gray-500">Check-ins</p>
          </div>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="px-6 space-y-6">
        {/* Trend Chart */}
        <TrendChart data={mockData} showArea={true} />
        
        {/* Heat Map */}
        <HeatMap />
        
        {/* Pattern Analysis */}
        <PatternAnalysis />
        
        {/* Trigger Insights */}
        <TriggerInsights />
        
        {/* AI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] rounded-[24px] p-6 text-white"
        >
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-10 h-10 rounded-[14px] bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Résumé IA</h3>
              <p className="text-sm text-white/90 leading-relaxed font-light">
                Sur les 30 derniers jours, ton humeur globale s'améliore (+12%). 
                Les facteurs positifs principaux sont le temps en famille et un bon sommeil. 
                Pour continuer cette progression, considère réduire ta charge de travail le mercredi 
                et maintenir ta routine de sommeil.
              </p>
            </div>
          </div>
          
          <Button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0 h-11 rounded-[16px] font-semibold">
            Parler à Sakina de ces insights
          </Button>
        </motion.div>
        
        {/* Export Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-[24px] p-5 card-shadow"
        >
          <h3 className="text-base font-bold text-[#2E4057] mb-3">Exporter ton analyse</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-[#FAFAFA] rounded-[16px] py-3 text-sm font-medium text-[#2E4057] hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button className="bg-[#FAFAFA] rounded-[16px] py-3 text-sm font-medium text-[#2E4057] hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>CSV</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}