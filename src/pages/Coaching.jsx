import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Target, Brain, ChevronRight, Award, Zap } from 'lucide-react';
import { base44 } from '../api/base44Client';
import { useQuery } from '@tanstack/react-query';
import AIInsights from '../components/coaching/AIInsights';
import ActionPlan from '../components/coaching/ActionPlan';
import RecommendedExercises from '../components/coaching/RecommendedExercises';
import ProgressTracking from '../components/coaching/ProgressTracking';
import ChallengesSection from '../components/coaching/ChallengesSection';

export default function Coaching() {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [coachingData, setCoachingData] = useState(null);

  const { data: userData } = useQuery({
    queryKey: ['coachingData'],
    queryFn: async () => {
      const [moodEntries, sleepEntries, conversations, progress] = await Promise.all([
        base44.entities.MoodEntry.list('-entry_date', 30).catch(() => []),
        base44.entities.SleepEntry.list('-sleep_date', 30).catch(() => []),
        base44.entities.Conversation.list('-created_date', 50).catch(() => []),
        base44.entities.UserProgress.list().catch(() => [])
      ]);

      return {
        moodEntries,
        sleepEntries,
        conversations,
        progress: progress[0] || {}
      };
    }
  });

  useEffect(() => {
    if (userData) {
      analyzeUserData();
    }
  }, [userData]);

  const analyzeUserData = async () => {
    setIsAnalyzing(true);
    
    try {
      const { moodEntries, sleepEntries, conversations, progress } = userData;
      
      // Build comprehensive analysis prompt
      const analysisPrompt = `Tu es un coach en santé mentale IA pour Sakina. Analyse les données suivantes et fournis un plan de coaching personnalisé.

DONNÉES UTILISATEUR (30 derniers jours):

HUMEUR:
- ${moodEntries.length} check-ins émotionnels
- Humeur moyenne: ${(moodEntries.reduce((sum, e) => sum + e.mood_value, 0) / moodEntries.length).toFixed(1)}/5
- Tendance: ${moodEntries[0]?.mood_value > moodEntries[moodEntries.length - 1]?.mood_value ? 'amélioration' : 'baisse'}
- Tags récurrents: ${moodEntries.flatMap(e => e.tags || []).slice(0, 5).join(', ')}

SOMMEIL:
- ${sleepEntries.length} nuits enregistrées
- Qualité moyenne: ${(sleepEntries.reduce((sum, e) => sum + e.sleep_quality, 0) / sleepEntries.length).toFixed(1)}/5
- Durée moyenne: ${(sleepEntries.reduce((sum, e) => sum + (e.sleep_duration || 0), 0) / sleepEntries.length).toFixed(1)}h
- Perturbations fréquentes: ${sleepEntries.flatMap(e => e.disruptions || []).slice(0, 5).join(', ')}

ENGAGEMENT:
- Série actuelle: ${progress.current_streak || 0} jours
- Points totaux: ${progress.total_points || 0}
- Niveau: ${progress.current_level || 1}
- Sessions de chat: ${progress.total_chat_sessions || 0}

ANALYSE DES CONVERSATIONS:
${conversations.slice(0, 5).map(c => `- "${c.message.substring(0, 100)}..."`).join('\n')}

INSTRUCTIONS:
Génère un JSON structuré avec:
{
  "overall_analysis": "Analyse générale de l'état mental et des progrès (2-3 phrases)",
  "key_insights": [
    "Insight 1 (1 phrase percutante)",
    "Insight 2",
    "Insight 3"
  ],
  "priorities": [
    {
      "title": "Priorité principale",
      "description": "Explication",
      "urgency": "high|medium|low",
      "category": "sleep|mood|stress|routine"
    }
  ],
  "action_plan": [
    {
      "title": "Action concrète",
      "description": "Comment faire",
      "frequency": "quotidien|hebdomadaire",
      "expected_impact": "Impact attendu",
      "points_reward": 50
    }
  ],
  "recommended_exercises": [
    {
      "title": "Exercice ciblé",
      "type": "breathing|meditation|journaling|gratitude",
      "duration": "5-10 min",
      "description": "Instructions détaillées",
      "best_time": "matin|soir|flexible"
    }
  ],
  "gamification_suggestions": {
    "next_milestone": "Prochain objectif motivant",
    "unlock_suggestion": "Badge à débloquer",
    "streak_goal": 21
  }
}

Sois spécifique, bienveillant et actionable. Adapte les conseils aux données réelles.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: analysisPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            overall_analysis: { type: "string" },
            key_insights: { type: "array", items: { type: "string" } },
            priorities: { 
              type: "array", 
              items: { 
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  urgency: { type: "string" },
                  category: { type: "string" }
                }
              }
            },
            action_plan: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  frequency: { type: "string" },
                  expected_impact: { type: "string" },
                  points_reward: { type: "number" }
                }
              }
            },
            recommended_exercises: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  type: { type: "string" },
                  duration: { type: "string" },
                  description: { type: "string" },
                  best_time: { type: "string" }
                }
              }
            },
            gamification_suggestions: {
              type: "object",
              properties: {
                next_milestone: { type: "string" },
                unlock_suggestion: { type: "string" },
                streak_goal: { type: "number" }
              }
            }
          }
        }
      });

      setCoachingData(response);
    } catch (error) {
      console.error('Error analyzing data:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!userData || isAnalyzing) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] flex items-center justify-center mx-auto mb-4"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-lg font-semibold text-[#2E4057]">Analyse en cours...</p>
          <p className="text-sm text-gray-500 mt-2">Sakina étudie tes données</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] px-6 pt-12 pb-32 rounded-b-[48px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-[16px] bg-white/20 backdrop-blur-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Coaching IA</h1>
              <p className="text-white/80 font-light text-sm">Personnalisé pour toi</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-[16px] p-3 text-center">
            <TrendingUp className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{userData.moodEntries.length}</p>
            <p className="text-xs text-white/70">Check-ins</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-[16px] p-3 text-center">
            <Target className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{userData.progress.current_streak || 0}j</p>
            <p className="text-xs text-white/70">Série</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-[16px] p-3 text-center">
            <Award className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="text-xl font-bold text-white">Niv. {userData.progress.current_level || 1}</p>
            <p className="text-xs text-white/70">Niveau</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-24 space-y-6">
        {/* AI Insights */}
        {coachingData && (
          <>
            <AIInsights 
              analysis={coachingData.overall_analysis}
              insights={coachingData.key_insights}
              priorities={coachingData.priorities}
            />

            <ActionPlan 
              actions={coachingData.action_plan}
              gamification={coachingData.gamification_suggestions}
            />

            <RecommendedExercises 
              exercises={coachingData.recommended_exercises}
            />

            <ChallengesSection />

            <ProgressTracking 
              userData={userData}
              nextMilestone={coachingData.gamification_suggestions.next_milestone}
            />
          </>
        )}
      </div>
    </div>
  );
}