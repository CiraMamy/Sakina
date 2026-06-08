import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Check, Trash2, Edit2, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { base44 } from '../../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const goalTypes = [
  { id: 'sleep', label: 'Sommeil', icon: '😴', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'mood', label: 'Humeur', icon: '😊', color: 'bg-blue-100 text-blue-700' },
  { id: 'stress', label: 'Stress', icon: '🧘', color: 'bg-green-100 text-green-700' },
  { id: 'addiction', label: 'Addiction', icon: '💪', color: 'bg-red-100 text-red-700' },
  { id: 'mindfulness', label: 'Pleine conscience', icon: '🌿', color: 'bg-teal-100 text-teal-700' },
  { id: 'social', label: 'Social', icon: '👥', color: 'bg-purple-100 text-purple-700' },
];

export default function GoalsSection() {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({ goal_type: 'mood', title: '', description: '' });
  
  const queryClient = useQueryClient();

  const { data: goals = [] } = useQuery({
    queryKey: ['userGoals'],
    queryFn: () => base44.entities.UserGoal.list('-created_date'),
  });

  const createGoalMutation = useMutation({
    mutationFn: (goalData) => base44.entities.UserGoal.create(goalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGoals'] });
      setShowAddGoal(false);
      setNewGoal({ goal_type: 'mood', title: '', description: '' });
      toast.success('Objectif ajouté');
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.UserGoal.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGoals'] });
      setEditingGoal(null);
      toast.success('Objectif mis à jour');
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (id) => base44.entities.UserGoal.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGoals'] });
      toast.success('Objectif supprimé');
    },
  });

  const handleSaveGoal = () => {
    if (!newGoal.title.trim()) {
      toast.error('Donne un titre à ton objectif');
      return;
    }

    createGoalMutation.mutate({
      ...newGoal,
      is_active: true,
      completed: false,
      current_progress: 0,
    });
  };

  const handleToggleComplete = (goal) => {
    updateGoalMutation.mutate({
      id: goal.id,
      data: {
        ...goal,
        completed: !goal.completed,
        completed_date: !goal.completed ? new Date().toISOString() : null,
      },
    });
  };

  const activeGoals = goals.filter(g => g.is_active && !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  return (
    <div className="bg-white rounded-[32px] p-6 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#7BA9D8]/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-[#7BA9D8]" />
          </div>
          <h3 className="text-lg font-bold text-[#2E4057]">Mes objectifs</h3>
        </div>
        <Button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="w-9 h-9 rounded-[16px] bg-[#7BA9D8] hover:bg-[#5A8BBD]"
          size="icon"
        >
          <Plus className="w-5 h-5 text-white" />
        </Button>
      </div>

      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-[#E8F1F8] rounded-[24px] p-4 space-y-3">
              <select
                value={newGoal.goal_type}
                onChange={(e) => setNewGoal({ ...newGoal, goal_type: e.target.value })}
                className="w-full rounded-[16px] px-4 py-2.5 text-sm bg-white border-0 focus:ring-2 focus:ring-[#7BA9D8]/30"
              >
                {goalTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
              
              <input
                type="text"
                placeholder="Ex: Gérer mon anxiété sociale"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="w-full rounded-[16px] px-4 py-2.5 text-sm bg-white border-0 focus:ring-2 focus:ring-[#7BA9D8]/30"
              />
              
              <textarea
                placeholder="Pourquoi cet objectif est important pour toi..."
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                className="w-full rounded-[16px] px-4 py-2.5 text-sm bg-white border-0 focus:ring-2 focus:ring-[#7BA9D8]/30 resize-none"
                rows={2}
              />

              <div className="flex space-x-2">
                <Button
                  onClick={handleSaveGoal}
                  disabled={createGoalMutation.isPending}
                  className="flex-1 bg-[#7BA9D8] hover:bg-[#5A8BBD] rounded-[16px]"
                >
                  Ajouter
                </Button>
                <Button
                  onClick={() => {
                    setShowAddGoal(false);
                    setNewGoal({ goal_type: 'mood', title: '', description: '' });
                  }}
                  variant="outline"
                  className="flex-1 rounded-[16px]"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Goals */}
      <div className="space-y-3">
        {activeGoals.length === 0 && !showAddGoal && (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Aucun objectif défini</p>
            <p className="text-xs text-gray-400 mt-1">Commence par ajouter un objectif</p>
          </div>
        )}

        <AnimatePresence>
          {activeGoals.map((goal) => {
            const goalTypeConfig = goalTypes.find(t => t.id === goal.goal_type);
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#FAFAFA] rounded-[20px] p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <button
                      onClick={() => handleToggleComplete(goal)}
                      className="w-6 h-6 rounded-full border-2 border-[#7BA9D8] flex items-center justify-center mt-0.5 hover:bg-[#7BA9D8] hover:border-[#7BA9D8] transition-colors group"
                    >
                      <Check className="w-4 h-4 text-transparent group-hover:text-white transition-colors" />
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded-lg ${goalTypeConfig?.color}`}>
                          {goalTypeConfig?.icon} {goalTypeConfig?.label}
                        </span>
                      </div>
                      <h4 className="font-semibold text-[#2E4057] mb-1">{goal.title}</h4>
                      {goal.description && (
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteGoalMutation.mutate(goal.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 mb-3">
            <Check className="w-4 h-4 text-green-500" />
            <h4 className="text-sm font-semibold text-gray-600">Objectifs atteints ({completedGoals.length})</h4>
          </div>
          <div className="space-y-2">
            {completedGoals.slice(0, 3).map((goal) => {
              const goalTypeConfig = goalTypes.find(t => t.id === goal.goal_type);
              return (
                <div key={goal.id} className="flex items-center space-x-2 text-sm text-gray-500">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="line-through flex-1">{goal.title}</span>
                  <span className="text-xs">{goalTypeConfig?.icon}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}