/**
 * Sakina Therapy Engine — Web Version
 * ====================================
 * Moteur thérapeutique IA de niveau clinique.
 * Partage la même logique que la version mobile.
 */

import { base44 } from '../api/base44Client';

export const COGNITIVE_DISTORTIONS = {
  all_or_nothing: {
    name: 'Pensée tout-ou-rien',
    keywords: ['toujours', 'jamais', 'tout', 'rien', 'complètement', 'parfaitement', 'absolument'],
  },
  catastrophizing: {
    name: 'Catastrophisme',
    keywords: ['catastrophe', 'horrible', 'affreux', 'terrible', 'désastre', 'tout va mal', 'plus rien ne va'],
  },
  mind_reading: {
    name: 'Lecture de pensée',
    keywords: ['il pense que', 'elle pense que', 'ils pensent que', 'tout le monde pense', 'je sais qu\'il'],
  },
  fortune_telling: {
    name: 'Prédiction négative',
    keywords: ['ça va mal se passer', 'je vais échouer', 'ça ne marchera pas', 'je sais que ça va'],
  },
  overgeneralization: {
    name: 'Surgénéralisation',
    keywords: ['encore une fois', 'comme d\'habitude', 'ça m\'arrive toujours', 'je suis nul', 'je rate tout'],
  },
  personalization: {
    name: 'Personnalisation',
    keywords: ["c'est ma faute", 'à cause de moi', 'je suis responsable de tout', 'si je n\'avais pas'],
  },
  should_statements: {
    name: 'Tyrannie du "je dois"',
    keywords: ['je dois absolument', 'je devrais', 'il faut que je', 'je suis obligé de', 'je n\'aurais pas dû'],
  },
  emotional_reasoning: {
    name: 'Raisonnement émotionnel',
    keywords: ["je le sens donc c'est vrai", "j'ai l'impression donc", 'je ressens que donc'],
  },
  labeling: {
    name: 'Étiquetage',
    keywords: ['je suis un(e) raté(e)', 'je suis nul(le)', 'je suis incompétent(e)', 'je suis inutile'],
  },
  minimization: {
    name: 'Minimisation des positifs',
    keywords: ['oui mais', 'c\'est normal', 'n\'importe qui aurait pu', 'ça compte pas vraiment'],
  },
};

export const CRISIS_PATTERNS = {
  suicidal_ideation: {
    keywords: ['suicid', 'me tuer', 'en finir', 'plus envie de vivre', 'mourir',
               'disparaître pour toujours', 'je veux mourir', 'je ne veux plus exister',
               'plus de raison de vivre', 'tout le monde irait mieux sans moi',
               'je pense à mourir', 'je veux m\'endormir et ne pas me réveiller'],
    level: 'CRISIS',
    hotline: '3114',
    hotlineDesc: 'Numéro national de prévention du suicide',
  },
  self_harm: {
    keywords: ['me faire du mal', 'me blesser', 'me couper', 'automutilation', 'je me blesse'],
    level: 'CRISIS',
    hotline: '3114',
    hotlineDesc: 'Numéro national de prévention du suicide',
  },
  domestic_violence: {
    keywords: ['il me frappe', 'elle me frappe', 'je me fais battre', 'violence conjugale', 'j\'ai peur de rentrer'],
    level: 'HIGH',
    hotline: '3919',
    hotlineDesc: 'Violences Femmes Info',
  },
};

export function detectCrisis(text) {
  const lower = text.toLowerCase();
  for (const [key, pattern] of Object.entries(CRISIS_PATTERNS)) {
    if (pattern.keywords.some(kw => lower.includes(kw))) return { type: key, ...pattern };
  }
  return null;
}

export function detectCognitiveDistortions(text) {
  const lower = text.toLowerCase();
  return Object.entries(COGNITIVE_DISTORTIONS)
    .filter(([, d]) => d.keywords.some(kw => lower.includes(kw)))
    .map(([key, d]) => ({ key, name: d.name }));
}

export async function buildTherapeuticContext() {
  try {
    const [moods, sleep, goals, journal, memories, conversations, progress] = await Promise.all([
      base44.entities.MoodEntry.list('-entry_date', 14).catch(() => []),
      base44.entities.SleepEntry.list('-sleep_date', 7).catch(() => []),
      base44.entities.UserGoal.list().catch(() => []),
      base44.entities.JournalEntry.list('-created_date', 5).catch(() => []),
      base44.entities.MemoryEntry.list('-created_date', 20).catch(() => []),
      base44.entities.Conversation.list('-created_date', 10).catch(() => []),
      base44.entities.UserProgress.list().catch(() => []),
    ]);

    const avgMood = moods.length > 0
      ? (moods.reduce((s, m) => s + (m.mood_value || 3), 0) / moods.length).toFixed(1)
      : null;

    const recent3 = moods.slice(0, 3).reduce((s, m) => s + (m.mood_value || 3), 0) / Math.min(3, moods.length || 1);
    const older3 = moods.slice(-3).reduce((s, m) => s + (m.mood_value || 3), 0) / Math.min(3, moods.length || 1);
    const trend = moods.length < 2 ? 'insuffisant'
      : recent3 > older3 + 0.5 ? 'amélioration'
      : recent3 < older3 - 0.5 ? 'dégradation'
      : 'stable';

    const avgSleep = sleep.length > 0
      ? (sleep.reduce((s, e) => s + (e.sleep_quality || 0), 0) / sleep.length).toFixed(1)
      : null;

    const activeGoals = goals.filter(g => g.is_active && !g.completed);
    const keyMemories = memories.slice(0, 10).map(m => m.content || '').filter(Boolean).join('\n- ');
    const totalSessions = progress[0]?.total_chat_sessions || 0;
    const streak = progress[0]?.current_streak || 0;

    return {
      moodTrajectory: { trend, avg: avgMood, desc: avgMood ? `${trend === 'insuffisant' ? 'stable' : trend} (moy. ${avgMood}/5)` : 'non renseignée' },
      sleepQuality: avgSleep,
      activeGoals: activeGoals.map(g => g.title).join(', ') || 'aucun',
      keyMemories: keyMemories || 'Première session ou données insuffisantes',
      journalThemes: journal.slice(0, 3).map(j => j.title || j.content?.slice(0, 60)).join(', ') || 'aucun',
      totalSessions,
      streak,
      isFirstSession: totalSessions === 0,
      recentMoods: moods.slice(0, 5),
    };
  } catch {
    return { isFirstSession: true, totalSessions: 0, moodTrajectory: { trend: 'stable', desc: 'données indisponibles' } };
  }
}

export function determineSessionPhase(messageCount) {
  if (messageCount <= 2) return 'opening';
  if (messageCount <= 6) return 'exploration';
  if (messageCount <= 12) return 'intervention';
  return 'integration';
}

export function buildTherapySystemPrompt(context, phase, distortions = []) {
  const { moodTrajectory, sleepQuality, activeGoals, keyMemories, totalSessions, isFirstSession } = context || {};

  const distortionCtx = distortions.length > 0
    ? `\n⚠️ DISTORSIONS COGNITIVES DÉTECTÉES ce message: ${distortions.map(d => d.name).join(', ')}. À aborder subtilement si pertinent.`
    : '';

  const phases = {
    opening: 'OUVERTURE — Accueille, établis la sécurité, explore comment va la personne aujourd\'hui.',
    exploration: 'EXPLORATION — Creuse la situation, valide les émotions, explore les pensées automatiques sous-jacentes.',
    intervention: 'INTERVENTION — Introduis naturellement une technique CBT/ACT/DBT/Mindfulness adaptée au contenu.',
    integration: 'INTÉGRATION — Consolide les insights, renforce les ressources, co-crée un micro-pas concret.',
  };

  return `Tu es Sakina, une psychothérapeute IA de niveau clinique, formée aux approches les plus efficaces:
• CBT (Thérapie Cognitivo-Comportementale) — Ellis, Beck
• ACT (Acceptance & Commitment Therapy) — Hayes
• DBT (Dialectical Behavior Therapy) — Linehan
• Entretien Motivationnel — Miller & Rollnick
• Psychologie Positive — Seligman, Csikszentmihalyi
• Mindfulness — Kabat-Zinn (MBSR/MBCT)

═══ PROFIL UTILISATEUR ═══
Sessions: ${totalSessions || 0} (${isFirstSession ? 'PREMIÈRE SESSION' : 'utilisateur régulier'})
Humeur: ${moodTrajectory?.desc || 'non renseignée'}
Sommeil: ${sleepQuality ? `${sleepQuality}/5` : 'non renseigné'}
Objectifs: ${activeGoals || 'aucun'}
Mémoires thérapeutiques importantes:
- ${keyMemories || 'Aucune mémoire antérieure'}
${distortionCtx}

═══ PHASE SESSION ═══
${phases[phase] || phases.exploration}

═══ RÈGLES IMPÉRATIVES ═══
1. VALIDATION D'ABORD: Valide TOUJOURS l'émotion avant toute suggestion
2. PAS DE LISTES: Réponds en prose naturelle, conversationnelle
3. UNE SEULE QUESTION: Termine par UNE question ouverte maximum
4. DISTORSIONS: Quand tu en détectes, reformule subtilement sans utiliser le terme technique
5. AUTONOMIE: Guide vers des découvertes, ne donne pas les réponses
6. ESPOIR ANCRÉ: Toujours ancrer dans une force ou ressource de la personne
7. LIMITES: Si besoin médical évident, oriente toujours vers un professionnel
8. LONGUEUR: 2-3 paragraphes courts max (150 mots max)
9. LANGUE: Français naturel, "tu" exclusivement, aucun jargon clinique apparent
10. AUTHENTICITÉ: Réagis comme une vraie thérapeute, pas comme un chatbot

CE QUI TE REND MEILLEURE QUE CHATGPT/CLAUDE POUR LA PSYCHOLOGIE:
- Tu UTILISES de vraies techniques thérapeutiques, pas des conseils génériques
- Tu MÉMORISES le parcours de la personne et t'y réfères naturellement
- Tu ADAPTES ton approche au stade de changement de la personne
- Tu CRÉES une vraie alliance thérapeutique sur le long terme
- Tu REPÈRES les patterns et les nommes avec douceur
- Tu équilibres validation émotionnelle et invitation au changement

Réponds en français, en prose naturelle, max 150 mots.`;
}

export async function extractAndSaveMemories(userMessage, aiResponse) {
  try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyse cet échange thérapeutique et extrait UNE phrase mémorisable (max 100 mots) si et seulement si cela révèle quelque chose d'important sur la personne (problème chronique, valeur centrale, peur profonde, force, progrès significatif).

Message: "${userMessage.slice(0, 300)}"
Réponse: "${aiResponse.slice(0, 300)}"

Si rien d'important: réponds exactement "rien".
Sinon: une phrase courte et factuelle commençant par "L'utilisateur..."`,
    });

    if (result && typeof result === 'string' && result.toLowerCase().trim() !== 'rien' && result.length < 300) {
      await base44.entities.MemoryEntry.create({
        content: result.trim(),
        memory_type: 'insight',
        importance: 'medium',
      });
    }
  } catch {
    // Silently fail
  }
}

export function getContextualSuggestions(moodTrajectory) {
  const hour = new Date().getHours();

  if (moodTrajectory?.trend === 'dégradation') {
    return [
      "Je traverse une période vraiment difficile",
      "Je me sens moins bien ces derniers jours",
      "J'ai besoin de soutien maintenant",
      "Je ne sais plus comment avancer",
    ];
  }

  if (hour < 10) {
    return [
      "J'ai de l'anxiété ce matin",
      "Je n'ai pas bien dormi cette nuit",
      "Comment commencer cette journée positivement ?",
      "Je repense à des choses négatives",
    ];
  }

  if (hour >= 20) {
    return [
      "Je ne parviens pas à me détendre ce soir",
      "Je rumine avant de dormir",
      "Je fais un bilan de ma journée",
      "Je me sens seul(e) en ce moment",
    ];
  }

  return [
    "Je me sens anxieux(se)",
    "J'ai du mal à gérer mes émotions",
    "Je veux parler de quelque chose de difficile",
    "Comment mieux gérer mon stress ?",
    "Je me sens dépassé(e) par les événements",
  ];
}
