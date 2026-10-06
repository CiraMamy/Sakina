import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Calendar, BarChart3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import TrendChart from '../components/mood/TrendChart';
import PatternAnalysis from '../components/mood/PatternAnalysis';
import TriggerInsights from '../components/mood/TriggerInsights';
import HeatMap from '../components/mood/HeatMap';
import { Button } from '../components/ui/button';

export default function Tendances() {
  const [timeRange, setTimeRange] = useState('30d');

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
    <div className="min-h-screen bg-[#F7F5F2] pb-8">
      <div className="bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_20%),linear-gradient(135deg,#A7C7E7_0%,#C9E8D2_100%)] px-6 pt-12 pb-8 rounded-b-[42px] sticky top-0 z-10">
        <div className="flex items-center justify-between mb-6">
          <Link to={createPageUrl('Emotions')}>
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Analyse approfondie</h1>
        <p className="text-sm text-white/80">Insights générés par intelligence artificielle</p>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
                timeRange === range.value ? 'bg-white text-sakina-700' : 'bg-white/20 text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-6 py-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="sakina-card p-4 text-center">
            <p className="text-2xl font-bold text-sakina-700 mb-1">3.8</p>
            <p className="text-xs text-[#5E6E7A]">Moyenne</p>
          </div>
          <div className="sakina-card p-4 text-center">
            <p className="text-2xl font-bold text-sakina-700 mb-1">+12%</p>
            <p className="text-xs text-[#5E6E7A]">Évolution</p>
          </div>
          <div className="sakina-card p-4 text-center">
            <p className="text-2xl font-bold text-sakina-700 mb-1">18</p>
            <p className="text-xs text-[#5E6E7A]">Check-ins</p>
          </div>
        </div>
      </motion.div>

      <div className="px-6 space-y-6">
        <TrendChart data={mockData} showArea={true} />
        <HeatMap />
        <PatternAnalysis />
        <TriggerInsights />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-[28px] bg-gradient-to-br from-[#A7C7E7] to-[#C9E8D2] p-6 text-sakina-700"
        >
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Résumé IA</h3>
              <p className="text-sm leading-relaxed text-sakina-700/80">
                Sur les 30 derniers jours, ton humeur globale s'améliore (+12%). Les facteurs positifs principaux sont le temps en famille et un bon sommeil.
                Pour continuer cette progression, considère réduire ta charge de travail le mercredi et maintenir ta routine de sommeil.
              </p>
            </div>
          </div>

          <Button className="h-11 w-full rounded-[16px] bg-white/20 text-sakina-700 hover:bg-white/30 border-0">
            Parler à Sakina de ces insights
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="sakina-card p-5">
          <h3 className="text-base font-bold text-sakina-700 mb-3">Exporter ton analyse</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-[16px] bg-[#F7F5F2] py-3 text-sm font-medium text-sakina-700">
              <Download className="h-4 w-4" />
              PDF
            </button>
            <button className="flex items-center justify-center gap-2 rounded-[16px] bg-[#F7F5F2] py-3 text-sm font-medium text-sakina-700">
              <Calendar className="h-4 w-4" />
              CSV
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}