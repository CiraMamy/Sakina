import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Calendar, Heart, Trash2, Edit } from 'lucide-react';
import { Button } from '../components/ui/button';
import { base44 } from '../api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

export default function Journal() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const { data: entries = [] } = useQuery({
    queryKey: ['journal'],
    queryFn: () => base44.entities.JournalEntry.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.JournalEntry.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      resetForm();
      toast.success('Entrée enregistrée 📝');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.JournalEntry.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      resetForm();
      toast.success('Entrée mise à jour');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.JournalEntry.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      toast.success('Entrée supprimée');
    }
  });

  const resetForm = () => {
    setTitle('');
    setContent('');
    setEditingEntry(null);
    setShowEditor(false);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;

    const data = { title: title || 'Sans titre', content };

    if (editingEntry) {
      updateMutation.mutate({ id: editingEntry.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setShowEditor(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-gray-900 pb-8">
      <div className="bg-gradient-to-br from-[#8CB8E8] to-[#A7D7C5] px-6 pt-12 pb-8 rounded-b-[48px]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-3xl font-bold text-white">Journal</h1>
            <p className="text-white/80 font-light">Espace d'écriture libre</p>
          </div>
          <Button
            onClick={() => setShowEditor(true)}
            className="w-12 h-12 rounded-[16px] bg-white/20 backdrop-blur-lg hover:bg-white/30"
          >
            <Plus className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>

      <div className="px-6 mt-6">
        <AnimatePresence>
          {showEditor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-[24px] p-6 card-shadow mb-6"
            >
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre (optionnel)"
                className="w-full bg-transparent text-xl font-bold text-[#2E4057] dark:text-white mb-4 focus:outline-none placeholder:text-gray-400"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Écris tes pensées, tes émotions, tes réflexions..."
                className="w-full bg-transparent text-[#2E4057] dark:text-gray-300 focus:outline-none resize-none min-h-[200px] placeholder:text-gray-400"
              />
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                  className="flex-1 h-12 rounded-[16px] bg-gradient-to-r from-[#8CB8E8] to-[#A7D7C5] hover:shadow-lg disabled:opacity-50"
                >
                  {editingEntry ? 'Mettre à jour' : 'Enregistrer'}
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="h-12 px-6 rounded-[16px]"
                >
                  Annuler
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {entries.length === 0 && !showEditor && (
          <div className="bg-white dark:bg-gray-800 rounded-[24px] p-12 text-center card-shadow">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">Ton journal est vide</p>
            <p className="text-sm text-gray-400">Commence à écrire pour libérer tes pensées</p>
          </div>
        )}

        <div className="space-y-4">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-[24px] p-5 card-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-[#2E4057] dark:text-white mb-1">{entry.title}</h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(entry.created_date), 'PPP', { locale: fr })}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="w-8 h-8 rounded-[12px] bg-[#8CB8E8]/10 hover:bg-[#8CB8E8]/20 flex items-center justify-center transition-colors"
                  >
                    <Edit className="w-4 h-4 text-[#8CB8E8]" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(entry.id)}
                    className="w-8 h-8 rounded-[12px] bg-red-50 hover:bg-red-100 dark:bg-red-900/20 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <p className="text-[#2E4057] dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}