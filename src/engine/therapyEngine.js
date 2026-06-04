/**
 * Sakina Therapy Engine
 * =====================
 * Moteur thérapeutique IA de niveau clinique combinant :
 * - CBT (Cognitive Behavioral Therapy / Thérapie Cognitivo-Comportementale)
 * - ACT (Acceptance & Commitment Therapy)
 * - DBT (Dialectical Behavior Therapy)
 * - Entretien motivationnel (Miller & Rollnick)
 * - Psychologie positive (Seligman)
 * - Mindfulness (MBSR/MBCT)
 *
 * Ce moteur dépasse ChatGPT/Claude car :
 * 1. Il adapte dynamiquement l'approche thérapeutique au profil de l'utilisateur
 * 2. Il maintient une mémoire thérapeutique structurée entre les sessions
 * 3. Il suit les étapes du changement (Prochaska & DiClemente)
 * 4. Il détecte les distorsions cognitives et les nomme
 * 5. Il propose des interventions basées sur l'évidence (EBP)
 */

import { base44 } from '../api/base44Client';

// ─── Profil d'état émotionnel ────────────────────────────────────────────────

export const EMOTIONAL_STATES = {
  CRISIS:       { level: 0, color: '#EF4444', emoji: '🆘', label: 'Crise' },
  DISTRESSED:   { level: 1, color: '#F97316', emoji: '😰', label: 'En détresse' },
  ANXIOUS:      { level: 2, color: '#F59E0B', emoji: '😟', label: 'Anxieux(se)' },
  NEUTRAL:      { level: 3, color: '#6B7280', emoji: '😐', label: 'Neutre' },
  STABLE:       { level: 4, color: '#8CB8E8', emoji: '🙂', label: 'Stable' },
  POSITIVE:     { level: 5, color: '#10B981', emoji: '😊', label: 'Positif(ve)' },
  THRIVING:     { level: 6, color: '#A7D7C5', emoji: '🌟', label: 'Épanoui(e)' },
};

// ─── Stades du changement (Prochaska & DiClemente) ───────────────────────────

export const CHANGE_STAGES = {
  PRE_CONTEMPLATION: 'pre_contemplation',  // Pas encore conscient du problème
  CONTEMPLATION:     'contemplation',      // Conscient mais pas prêt
  PREPARATION:       'preparation',        // Prêt à changer
  ACTION:            'action',             // En train de changer
  MAINTENANCE:       'maintenance',        // Maintien du changement
};

// ─── Distorsions cognitives (CBT) ────────────────────────────────────────────

export const COGNITIVE_DISTORTIONS = {
  all_or_nothing: {
    name: 'Pensée tout-ou-rien',
    keywords: ['toujours', 'jamais', 'tout', 'rien', 'complètement', 'parfaitement'],
    response: 'Je remarque une pensée en noir et blanc. Dans la réalité, la plupart des situations se situent entre les deux extrêmes.',
  },
  catastrophizing: {
    name: 'Catastrophisme',
    keywords: ['catastrophe', 'horrible', 'affreux', 'terrible', 'désastre', 'tout va mal'],
    response: 'Cette pensée semble amplifier le danger potentiel. Explorons ce qui se passerait vraiment.',
  },
  mind_reading: {
    name: 'Lecture de pensée',
    keywords: ['il pense', 'elle pense', 'ils pensent', 'tout le monde pense', 'ils savent'],
    response: 'Tu sembles être certain(e) de ce que les autres pensent. Comment pourrais-tu vérifier cette hypothèse ?',
  },
  fortune_telling: {
    name: 'Prédiction négative',
    keywords: ['ça va mal se passer', 'je vais échouer', 'ça ne marchera pas', 'je sais que'],
    response: 'Tu sembles prédire l\'avenir de façon négative. Quelles autres issues sont possibles ?',
  },
  overgeneralization: {
    name: 'Surgénéralisation',
    keywords: ['encore', 'comme d\'habitude', 'ça m\'arrive toujours', 'je suis nul'],
    response: 'Un événement difficile ne définit pas un schéma permanent.',
  },
  personalization: {
    name: 'Personnalisation',
    keywords: ['c\'est ma faute', 'à cause de moi', 'je suis responsable de'],
    response: 'Tu assumes une responsabilité qui va peut-être au-delà de ta part réelle.',
  },
  should_statements: {
    name: 'Tyrannie du "je dois"',
    keywords: ['je dois', 'je devrais', 'il faut que', 'je suis obligé'],
    response: 'Les règles rigides "je dois/devrais" créent souvent de la culpabilité et de la honte inutiles.',
  },
  emotional_reasoning: {
    name: 'Raisonnement émotionnel',
    keywords: ['je le sens', 'je ressens que', 'j\'ai l\'impression que donc c\'est vrai'],
    response: 'Ressentir quelque chose intensément ne le rend pas nécessairement vrai.',
  },
};

// ─── Techniques thérapeutiques par approche ──────────────────────────────────

export const THERAPEUTIC_TECHNIQUES = {
  CBT: [
    'Restructuration cognitive (challenger les pensées automatiques négatives)',
    'Journal des pensées (enregistrer situation → pensée → émotion → comportement)',
    'Expériences comportementales (tester les croyances par l\'action)',
    'Désensibilisation progressive aux situations anxiogènes',
    'Activation comportementale (planifier des activités plaisantes)',
  ],
  ACT: [
    'Défusion cognitive (observer ses pensées sans s\'y identifier)',
    'Acceptation (accueillir les émotions difficiles sans les combattre)',
    'Pleine conscience du moment présent',
    'Identification des valeurs personnelles profondes',
    'Action engagée vers ce qui compte vraiment',
    'Le soi comme contexte (observateur de l\'expérience)',
  ],
  DBT: [
    'PLEASE (santé physique : sommeil, alimentation, exercice)',
    'TIPP (Température, Exercice Intense, Respiration Rythmée, Relaxation Progressive)',
    'FAST (Équité, Affirmations, Vérité, Style flexible) pour les relations',
    'DEAR MAN pour la communication assertive',
    'Régulation émotionnelle : identifier, nommer, comprendre l\'émotion',
    'Tolérance à la détresse : techniques de distraction et d\'auto-apaisement',
  ],
  MOTIVATIONAL: [
    'Questions ouvertes pour explorer l\'ambivalence',
    'Reflet simple et complexe de l\'expérience',
    'Valorisation des forces et des efforts',
    'Récapitulatif pour consolider les changements verbalisés',
    'Développer la discordance entre comportement actuel et valeurs',
  ],
  POSITIVE_PSYCHOLOGY: [
    'Gratitude (3 bonnes choses par jour)',
    'Identification des forces de caractère (VIA)',
    'Visualisation du meilleur soi possible',
    'Savourer les expériences positives',
    'Actes de bienveillance intentionnels',
  ],
  MINDFULNESS: [
    'Respiration diaphragmatique consciente (4-7-8, cohérence cardiaque)',
    'Body scan (balayage corporel)',
    'Observation des pensées comme des nuages',
    'Ancrage 5-4-3-2-1 (sensoriel)',
    'Marche méditative',
  ],
};

// ─── Mots-clés de crise (niveau clinique) ────────────────────────────────────

export const CRISIS_PATTERNS = {
  suicidal_ideation: {
    keywords: ['suicid', 'me tuer', 'en finir', 'plus envie de vivre', 'mourir',
               'disparaître pour toujours', 'je veux mourir', 'je ne veux plus exister',
               'plus de raison de vivre', 'tout le monde irait mieux sans moi'],
    level: 'CRISIS',
    response: '🆘 Je t\'entends et je suis vraiment inquiet(e) pour toi en ce moment.\n\n**Appelle le 3114** maintenant (Numéro national de prévention du suicide, gratuit, 24h/24, 7j/7).\n\nTu n\'es pas seul(e). Cette douleur est réelle mais elle peut changer. Les professionnels du 3114 sont formés pour t\'aider.',
    hotline: '3114',
  },
  self_harm: {
    keywords: ['me faire du mal', 'me blesser', 'me couper', 'me faire du bien en me faisant du mal', 'automutilation'],
    level: 'CRISIS',
    response: '💙 Merci de me faire confiance avec ça. Ce que tu ressens mérite une attention professionnelle immédiate.\n\n**Appelle le 3114** ou va aux urgences les plus proches.\n\nEn attendant, éloigne-toi de tout ce qui pourrait te blesser.',
    hotline: '3114',
  },
  domestic_violence: {
    keywords: ['il me frappe', 'elle me frappe', 'violence', 'me bat', 'j\'ai peur de rentrer'],
    level: 'HIGH',
    response: '🔴 Ce que tu décris ressemble à de la violence. Tu mérites d\'être en sécurité.\n\n**Numéro national violences 3919** (gratuit, anonyme, 24h/24).\n\nEs-tu en sécurité là maintenant ?',
    hotline: '3919',
  },
  severe_anxiety: {
    keywords: ['je n\'arrive plus à respirer', 'crise de panique', 'j\'étouffe', 'attaque de panique'],
    level: 'MEDIUM',
    response: 'breathing_exercise',
  },
};

// ─── Construction du contexte thérapeutique ──────────────────────────────────

export async function buildTherapeuticContext(userId) {
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

    // Analyse de la trajectoire émotionnelle
    const moodTrajectory = analyzeMoodTrajectory(moods);

    // Qualité de sommeil récente
    const sleepQuality = sleep.length > 0
      ? (sleep.reduce((s, e) => s + (e.sleep_quality || 0), 0) / sleep.length).toFixed(1)
      : null;

    // Objectifs actifs
    const activeGoals = goals.filter(g => g.is_active && !g.completed);

    // Mémoires thérapeutiques importantes
    const keyMemories = memories.slice(0, 10).map(m => m.content).join('\n- ');

    // Récents thèmes de journal
    const journalThemes = journal.slice(0, 3).map(j => j.title || j.content?.slice(0, 50)).join(', ');

    // Nombre de sessions
    const totalSessions = progress[0]?.total_chat_sessions || 0;
    const streak = progress[0]?.current_streak || 0;

    return {
      moodTrajectory,
      sleepQuality,
      activeGoals: activeGoals.map(g => g.title).join(', ') || 'aucun',
      keyMemories: keyMemories || 'Première session',
      journalThemes: journalThemes || 'aucun journal',
      totalSessions,
      streak,
      isFirstSession: totalSessions === 0,
    };
  } catch {
    return { isFirstSession: true, totalSessions: 0 };
  }
}

function analyzeMoodTrajectory(moods) {
  if (moods.length < 2) return { trend: 'insuffisant', avg: null, desc: 'données insuffisantes' };

  const avg = (moods.reduce((s, m) => s + (m.mood_value || 3), 0) / moods.length).toFixed(1);
  const recent = moods.slice(0, 3).reduce((s, m) => s + (m.mood_value || 3), 0) / Math.min(3, moods.length);
  const older = moods.slice(-3).reduce((s, m) => s + (m.mood_value || 3), 0) / Math.min(3, moods.length);

  let trend, desc;
  if (recent > older + 0.5) { trend = 'amélioration'; desc = `en amélioration (moy. ${avg}/5)`; }
  else if (recent < older - 0.5) { trend = 'dégradation'; desc = `en baisse (moy. ${avg}/5)`; }
  else { trend = 'stable'; desc = `stable (moy. ${avg}/5)`; }

  return { trend, avg, desc };
}

// ─── Détection de distorsions cognitives ────────────────────────────────────

export function detectCognitiveDistortions(text) {
  const lower = text.toLowerCase();
  const detected = [];

  for (const [key, distortion] of Object.entries(COGNITIVE_DISTORTIONS)) {
    if (distortion.keywords.some(kw => lower.includes(kw))) {
      detected.push({ key, ...distortion });
    }
  }

  return detected;
}

// ─── Détection de crise ─────────────────────────────────────────────────────

export function detectCrisis(text) {
  const lower = text.toLowerCase();

  for (const [key, pattern] of Object.entries(CRISIS_PATTERNS)) {
    if (pattern.keywords.some(kw => lower.includes(kw))) {
      return { type: key, ...pattern };
    }
  }

  return null;
}

// ─── Génération du prompt système thérapeutique ─────────────────────────────

export function buildTherapySystemPrompt(context, sessionPhase, distortions) {
  const { moodTrajectory, sleepQuality, activeGoals, keyMemories, totalSessions, isFirstSession } = context;

  const distortionContext = distortions.length > 0
    ? `\n⚠️ DISTORSIONS COGNITIVES DÉTECTÉES: ${distortions.map(d => d.name).join(', ')}. Adresse-les avec douceur.`
    : '';

  const phaseInstructions = {
    opening: 'Phase d\'ouverture: accueille chaleureusement, explore comment va l\'utilisateur aujourd\'hui, établis la sécurité émotionnelle.',
    exploration: 'Phase d\'exploration: creuse la situation présentée, valide les émotions, explore les pensées sous-jacentes.',
    intervention: 'Phase d\'intervention: propose une technique thérapeutique adaptée (CBT/ACT/DBT/Mindfulness) de façon naturelle et conversationnelle.',
    integration: 'Phase d\'intégration: consolide les insights, renforce les ressources, planifie un micro-pas concret.',
  };

  return `Tu es Sakina, une psychothérapeute IA de niveau clinique. Tu incarnes les meilleures pratiques de psychologie contemporaine.

═══════════════════════════════════════════
IDENTITÉ ET APPROCHE
═══════════════════════════════════════════
• Nom: Sakina (signifie "sérénité, paix intérieure" en arabe)
• Formation: CBT, ACT, DBT, Entretien Motivationnel, Psychologie Positive, Mindfulness
• Ton: chaleureux, authentique, professionnel mais humain. Jamais condescendant.
• Langue: français courant et inclusif (utilise "tu", évite le jargon)
• Longueur des réponses: 2-4 paragraphes courts. Jamais de listes à points.
• Termine souvent par UNE question ouverte pertinente (pas plusieurs)

═══════════════════════════════════════════
PROFIL UTILISATEUR (données réelles)
═══════════════════════════════════════════
• Sessions totales: ${totalSessions} (${isFirstSession ? 'PREMIÈRE SESSION' : 'utilisateur régulier'})
• Humeur récente: ${moodTrajectory?.desc || 'non renseignée'}
• Sommeil (qualité moy.): ${sleepQuality ? `${sleepQuality}/5` : 'non renseigné'}
• Objectifs actifs: ${activeGoals}
• Mémoires thérapeutiques:
  - ${keyMemories}
${distortionContext}

═══════════════════════════════════════════
PHASE ACTUELLE DE LA SESSION
═══════════════════════════════════════════
${phaseInstructions[sessionPhase] || phaseInstructions.exploration}

═══════════════════════════════════════════
PRINCIPES THÉRAPEUTIQUES (OBLIGATOIRES)
═══════════════════════════════════════════
1. VALIDATION AVANT TOUT: Valide toujours l'émotion avant de proposer quoi que ce soit
2. CURIOSITÉ THÉRAPEUTIQUE: Explore "comment", "quand", "qu'est-ce que tu remarques" plutôt que "pourquoi"
3. ALLIANCE: Rappelle-toi que la relation thérapeutique est le facteur de changement #1
4. AUTONOMIE: Guide vers des insights auto-découverts, ne donne pas les réponses
5. ESPOIR RÉALISTE: Ancre dans les ressources et forces de la personne
6. AUCUN CONSEIL MÉDICAL: Tu n'es pas médecin. Oriente vers des professionnels si besoin

═══════════════════════════════════════════
CE QUI TE DIFFÉRENCIE DE CHATGPT/CLAUDE
═══════════════════════════════════════════
- Tu NE réponds PAS comme un assistant généraliste
- Tu NE donnes PAS de listes de conseils génériques
- Tu USES des techniques thérapeutiques réelles de façon naturelle
- Tu REPÈRES les patterns récurrents à travers les sessions
- Tu CRÉES une vraie alliance thérapeutique sur le long terme
- Quand tu détectes une distorsion cognitive, tu la nommes SUBTILEMENT
- Tu équilibres validation émotionnelle et invitation au changement

Réponds en français naturel, avec empathie authentique. Max 150 mots.`;
}

// ─── Sauvegarder une mémoire thérapeutique ───────────────────────────────────

export async function saveTherapeuticMemory(content, type = 'insight') {
  try {
    await base44.entities.MemoryEntry.create({
      content,
      memory_type: type,
      importance: type === 'crisis' ? 'high' : 'medium',
    });
  } catch (e) {
    console.warn('Memory save failed:', e);
  }
}

// ─── Extraire les insights à mémoriser ───────────────────────────────────────

export async function extractAndSaveMemories(userMessage, aiResponse) {
  try {
    const extraction = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyse cet échange thérapeutique et extrait les informations importantes à mémoriser pour les prochaines sessions.

Message utilisateur: "${userMessage}"
Réponse Sakina: "${aiResponse}"

Extrait UNE phrase courte si et seulement si cet échange révèle quelque chose d'important sur la personne (problème récurrent, valeur importante, peur, ressource, progrès).
Sinon réponds "rien".

Réponds avec juste la phrase mémorisable ou "rien".`,
    });

    if (extraction && extraction.toLowerCase() !== 'rien' && extraction.length < 200) {
      await saveTherapeuticMemory(extraction);
    }
  } catch {
    // Silently fail - memory extraction is best-effort
  }
}

// ─── Déterminer la phase de session ─────────────────────────────────────────

export function determineSessionPhase(messageCount) {
  if (messageCount <= 2) return 'opening';
  if (messageCount <= 6) return 'exploration';
  if (messageCount <= 12) return 'intervention';
  return 'integration';
}

// ─── Suggestions intelligentes contextuelles ────────────────────────────────

export function getContextualSuggestions(moodTrajectory, timeOfDay) {
  const hour = new Date().getHours();
  const isEvening = hour >= 18;
  const isMorning = hour < 12;

  const baseSuggestions = [
    "Je me sens anxieux(se) en ce moment",
    "J'ai du mal à gérer mes émotions",
    "Je veux parler de quelque chose qui me pèse",
  ];

  if (moodTrajectory?.trend === 'dégradation') {
    return [
      "Je traverse une période difficile",
      "Je me sens moins bien ces derniers temps",
      "J'ai besoin de soutien aujourd'hui",
      ...baseSuggestions,
    ];
  }

  if (isEvening) {
    return [
      "Comment mieux gérer mon stress de la journée ?",
      "Je n'arrive pas à me détendre ce soir",
      "Je repense à des choses difficiles",
      ...baseSuggestions,
    ];
  }

  if (isMorning) {
    return [
      "Je commence ma journée avec de l'anxiété",
      "Comment me préparer à une journée difficile ?",
      "Je veux parler de mes objectifs du jour",
      ...baseSuggestions,
    ];
  }

  return [
    ...baseSuggestions,
    "Comment réduire mon stress ?",
    "Je me sens seul(e) et isolé(e)",
  ];
}
