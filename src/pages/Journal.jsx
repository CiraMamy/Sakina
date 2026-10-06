import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Calendar, Trash2, Edit, NotebookPen } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F7F5F2] pb-8">
      <div className="bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_20%),linear-gradient(135deg,#A7C7E7_0%,#C9E8D2_100%)] px-6 pt-12 pb-8 rounded-b-[42px]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/70">Écriture</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Journal</h1>
          </div>
          <button
            onClick={() => setShowEditor(true)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="px-6 mt-6">
        <AnimatePresence>
          {showEditor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sakina-card p-5 mb-6"
            >
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre (optionnel)"
                className="w-full bg-transparent text-xl font-bold text-sakina-700 mb-4 focus:outline-none placeholder:text-[#7A8190]"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Écris tes pensées, tes émotions, tes réflexions..."
                className="w-full bg-transparent text-sakina-700 focus:outline-none resize-none min-h-[180px] placeholder:text-[#7A8190]"
              />
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                  className="flex-1 h-12 rounded-[16px] bg-[#24313A] text-white disabled:opacity-50"
                >
                  {editingEntry ? 'Mettre à jour' : 'Enregistrer'}
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="h-12 px-6 rounded-[16px] border-[#E9E0D4]"
                >
                  Annuler
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {entries.length === 0 && !showEditor && (
          <div className="sakina-card p-12 text-center">
            <NotebookPen className="w-16 h-16 text-[#7A8190] mx-auto mb-4" />
            <p className="text-[#5E6E7A] mb-2">Ton journal est vide</p>
            <p className="text-sm text-[#7A8190]">Commence à écrire pour libérer tes pensées</p>
          </div>
        )}

        <div className="space-y-4">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sakina-card p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-sakina-700 mb-1">{entry.title}</h3>
                  <div className="flex items-center space-x-2 text-xs text-[#5E6E7A]">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(entry.created_date), 'PPP', { locale: fr })}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-[#E6DFF5]"
                  >
                    <Edit className="w-4 h-4 text-sakina-700" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(entry.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <p className="text-sakina-700 text-sm leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}