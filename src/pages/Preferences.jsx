import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, MessageCircle, Target, Wind, Heart, Book, Activity, Eye, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { base44 } from '../api/base44Client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createPageUrl } from '../utils';

const PreferenceCard = ({ title, description, children, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-[24px] p-6 card-shadow mb-4"
  >
    <div className="flex items-start space-x-3 mb-4">
      <div className="w-10 h-10 rounded-[16px] bg-[#8CB8E8]/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#8CB8E8]" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-[#2E4057]">{title}</h3>
        <p className="text-sm text-gray-500 font-light">{description}</p>
      </div>
    </div>
    {children}
  </motion.div>
);

const ToggleButton = ({ selected, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 rounded-[16px] text-sm font-medium transition-all ${
      selected
        ? 'bg-[#8CB8E8] text-white shadow-md'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

export default function Preferences() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  
  const [preferences, setPreferences] = useState({
    communication_style: 'balanced',
    preferred_exercises: [],
    communication_length: 'moderate',
    avoid_topics: [],
    preferred_language_tone: 'tutoiement',
    crisis_contact_name: '',
    crisis_contact_phone: '',
    therapy_goals: []
  });

  const [customGoal, setCustomGoal] = useState('');
  const [customTopic, setCustomTopic] = useState('');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      setPreferences({
        communication_style: currentUser.communication_style || 'balanced',
        preferred_exercises: currentUser.preferred_exercises || [],
        communication_length: currentUser.communication_length || 'moderate',
        avoid_topics: currentUser.avoid_topics || [],
        preferred_language_tone: currentUser.preferred_language_tone || 'tutoiement',
        crisis_contact_name: currentUser.crisis_contact_name || '',
        crisis_contact_phone: currentUser.crisis_contact_phone || '',
        therapy_goals: currentUser.therapy_goals || []
      });
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe(preferences);
      toast.success('Préférences enregistrées');
      navigate(createPageUrl('Profil'));
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const toggleExercise = (exercise) => {
    setPreferences(prev => ({
      ...prev,
      preferred_exercises: prev.preferred_exercises.includes(exercise)
        ? prev.preferred_exercises.filter(e => e !== exercise)
        : [...prev.preferred_exercises, exercise]
    }));
  };

  const addGoal = () => {
    if (customGoal.trim()) {
      setPreferences(prev => ({
        ...prev,
        therapy_goals: [...prev.therapy_goals, customGoal.trim()]
      }));
      setCustomGoal('');
    }
  };

  const removeGoal = (goal) => {
    setPreferences(prev => ({
      ...prev,
      therapy_goals: prev.therapy_goals.filter(g => g !== goal)
    }));
  };

  const addAvoidTopic = () => {
    if (customTopic.trim()) {
      setPreferences(prev => ({
        ...prev,
        avoid_topics: [...prev.avoid_topics, customTopic.trim()]
      }));
      setCustomTopic('');
    }
  };

  const removeAvoidTopic = (topic) => {
    setPreferences(prev => ({
      ...prev,
      avoid_topics: prev.avoid_topics.filter(t => t !== topic)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-[#8CB8E8]" />
        </motion.div>
      </div>
    );
  }

  const exerciseOptions = [
    { value: 'respiration', label: 'Respiration', icon: Wind },
    { value: 'meditation', label: 'Méditation', icon: Sparkles },
    { value: 'grounding', label: 'Ancrage', icon: Target },
    { value: 'body_scan', label: 'Body Scan', icon: Activity },
    { value: 'journaling', label: 'Écriture', icon: Book },
    { value: 'movement', label: 'Mouvement', icon: Activity },
    { value: 'visualization', label: 'Visualisation', icon: Eye }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Header */}
      <div className="bg-[#7BA9D8] px-6 pt-12 pb-8 rounded-b-[32px]">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate(createPageUrl('Profil'))}
            className="w-10 h-10 rounded-[16px] bg-white/20 backdrop-blur-lg flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Préférences</h1>
            <p className="text-sm text-white/80 font-light">Personnalise Sakina pour toi</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Communication Style */}
        <PreferenceCard
          title="Style de communication"
          description="Comment Sakina doit te parler"
          icon={MessageCircle}
        >
          <div className="grid grid-cols-2 gap-3">
            <ToggleButton
              selected={preferences.communication_style === 'direct'}
              onClick={() => setPreferences(prev => ({ ...prev, communication_style: 'direct' }))}
            >
              Direct
            </ToggleButton>
            <ToggleButton
              selected={preferences.communication_style === 'gentle'}
              onClick={() => setPreferences(prev => ({ ...prev, communication_style: 'gentle' }))}
            >
              Doux
            </ToggleButton>
            <ToggleButton
              selected={preferences.communication_style === 'balanced'}
              onClick={() => setPreferences(prev => ({ ...prev, communication_style: 'balanced' }))}
            >
              Équilibré
            </ToggleButton>
            <ToggleButton
              selected={preferences.communication_style === 'motivating'}
              onClick={() => setPreferences(prev => ({ ...prev, communication_style: 'motivating' }))}
            >
              Motivant
            </ToggleButton>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            {preferences.communication_style === 'direct' && '→ Phrases courtes, va droit au but'}
            {preferences.communication_style === 'gentle' && '→ Ton très doux, beaucoup de validation'}
            {preferences.communication_style === 'balanced' && '→ Mélange empathie et pragmatisme'}
            {preferences.communication_style === 'motivating' && '→ Encourageant, focus solutions'}
          </div>
        </PreferenceCard>

        {/* Communication Length */}
        <PreferenceCard
          title="Longueur de réponse"
          description="Détail des messages de Sakina"
          icon={MessageCircle}
        >
          <div className="flex gap-3">
            <ToggleButton
              selected={preferences.communication_length === 'concise'}
              onClick={() => setPreferences(prev => ({ ...prev, communication_length: 'concise' }))}
            >
              Court
            </ToggleButton>
            <ToggleButton
              selected={preferences.communication_length === 'moderate'}
              onClick={() => setPreferences(prev => ({ ...prev, communication_length: 'moderate' }))}
            >
              Moyen
            </ToggleButton>
            <ToggleButton
              selected={preferences.communication_length === 'detailed'}
              onClick={() => setPreferences(prev => ({ ...prev, communication_length: 'detailed' }))}
            >
              Détaillé
            </ToggleButton>
          </div>
        </PreferenceCard>

        {/* Preferred Exercises */}
        <PreferenceCard
          title="Exercices préférés"
          description="Types d'exercices que tu aimes"
          icon={Heart}
        >
          <div className="grid grid-cols-2 gap-3">
            {exerciseOptions.map((exercise) => {
              const Icon = exercise.icon;
              return (
                <button
                  key={exercise.value}
                  onClick={() => toggleExercise(exercise.value)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-[16px] text-sm font-medium transition-all ${
                    preferences.preferred_exercises.includes(exercise.value)
                      ? 'bg-[#8CB8E8] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{exercise.label}</span>
                </button>
              );
            })}
          </div>
        </PreferenceCard>

        {/* Therapy Goals */}
        <PreferenceCard
          title="Objectifs thérapeutiques"
          description="Sur quoi tu veux travailler"
          icon={Target}
        >
          <div className="space-y-3">
            {preferences.therapy_goals.map((goal, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 rounded-[16px] px-4 py-3">
                <span className="text-sm text-[#2E4057]">{goal}</span>
                <button
                  onClick={() => removeGoal(goal)}
                  className="text-red-500 text-sm font-medium"
                >
                  Retirer
                </button>
              </div>
            ))}
            <div className="flex space-x-2">
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                placeholder="Ex: Gérer mon anxiété"
                className="flex-1 bg-gray-50 rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8CB8E8]/30"
              />
              <Button
                onClick={addGoal}
                disabled={!customGoal.trim()}
                className="bg-[#8CB8E8] hover:bg-[#8CB8E8]/90"
              >
                Ajouter
              </Button>
            </div>
          </div>
        </PreferenceCard>

        {/* Avoid Topics */}
        <PreferenceCard
          title="Sujets sensibles"
          description="Sujets à éviter en conversation"
          icon={Heart}
        >
          <div className="space-y-3">
            {preferences.avoid_topics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 rounded-[16px] px-4 py-3">
                <span className="text-sm text-[#2E4057]">{topic}</span>
                <button
                  onClick={() => removeAvoidTopic(topic)}
                  className="text-red-500 text-sm font-medium"
                >
                  Retirer
                </button>
              </div>
            ))}
            <div className="flex space-x-2">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAvoidTopic()}
                placeholder="Ex: Famille"
                className="flex-1 bg-gray-50 rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8CB8E8]/30"
              />
              <Button
                onClick={addAvoidTopic}
                disabled={!customTopic.trim()}
                className="bg-[#8CB8E8] hover:bg-[#8CB8E8]/90"
              >
                Ajouter
              </Button>
            </div>
          </div>
        </PreferenceCard>

        {/* Crisis Contact */}
        <PreferenceCard
          title="Contact d'urgence"
          description="Personne à contacter si besoin"
          icon={Heart}
        >
          <div className="space-y-3">
            <input
              type="text"
              value={preferences.crisis_contact_name}
              onChange={(e) => setPreferences(prev => ({ ...prev, crisis_contact_name: e.target.value }))}
              placeholder="Nom"
              className="w-full bg-gray-50 rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8CB8E8]/30"
            />
            <input
              type="tel"
              value={preferences.crisis_contact_phone}
              onChange={(e) => setPreferences(prev => ({ ...prev, crisis_contact_phone: e.target.value }))}
              placeholder="Téléphone"
              className="w-full bg-gray-50 rounded-[16px] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8CB8E8]/30"
            />
          </div>
        </PreferenceCard>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-14 bg-[#7BA9D8] text-white rounded-[24px] font-semibold text-base shadow-lg"
          >
            {saving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Enregistrer mes préférences
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}