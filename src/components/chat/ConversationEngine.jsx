// Advanced Conversation Engine for Sakina
// Manages intelligent dialogue flow and context-aware responses
import { base44 } from '@/api/base44Client';

export class ConversationEngine {
  constructor(context, user, longTermAnalysis, memories = []) {
    this.context = context;
    this.user = user;
    this.longTermAnalysis = longTermAnalysis;
    this.memories = memories;
  }

  // Extract important memories from conversation
  async extractAndStoreMemory(userMessage, aiResponse, emotionalAnalysis) {
    try {
      // Analyze if this conversation contains something worth remembering
      const memoryAnalysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse cette conversation pour déterminer s'il contient un souvenir important à conserver.

MESSAGE UTILISATEUR: "${userMessage}"
RÉPONSE IA: "${aiResponse}"
ÉMOTION: ${emotionalAnalysis.primary_emotion} (intensité ${emotionalAnalysis.intensity}/10)

UN SOUVENIR EST IMPORTANT SI:
- Exercice qui a fonctionné (respiration, grounding, etc.)
- Moment de crise ou de détresse aiguë
- Breakthrough émotionnel (prise de conscience, progrès significatif)
- Événement important mentionné (rupture, perte emploi, etc.)
- Nouvelle stratégie de coping découverte
- Déclencheur identifié clairement
- Milestone personnel (1 mois sobre, objectif atteint)
- Relation importante (famille, ami, thérapeute)

Si OUI, retourne:
{
  "is_important": true,
  "memory_type": "crisis|breakthrough|effective_exercise|important_event|milestone|relationship|trigger_discovered|coping_strategy",
  "title": "Titre court (5-7 mots)",
  "content": "Description détaillée (ce qui s'est passé, pourquoi c'est important)",
  "importance": 1-10,
  "tags": ["tag1", "tag2", "tag3"],
  "context": {
    "emotion": "${emotionalAnalysis.primary_emotion}",
    "intensity": ${emotionalAnalysis.intensity},
    "what_worked": "ce qui a aidé si applicable",
    "lesson_learned": "leçon apprise si applicable"
  }
}

Si NON, retourne: {"is_important": false}`,
        response_json_schema: {
          type: "object",
          properties: {
            is_important: { type: "boolean" },
            memory_type: { type: "string" },
            title: { type: "string" },
            content: { type: "string" },
            importance: { type: "number" },
            tags: { type: "array", items: { type: "string" } },
            context: { type: "object", additionalProperties: true }
          }
        }
      });

      if (memoryAnalysis.is_important) {
        await base44.entities.MemoryEntry.create({
          memory_type: memoryAnalysis.memory_type,
          title: memoryAnalysis.title,
          content: memoryAnalysis.content,
          importance: memoryAnalysis.importance,
          tags: memoryAnalysis.tags,
          context: memoryAnalysis.context,
          referenced_count: 0
        });
      }
    } catch (error) {
      console.error('Error extracting memory:', error);
    }
  }

  // Find relevant memories for current context
  findRelevantMemories(currentMessage, emotionalAnalysis) {
    if (!this.memories || this.memories.length === 0) return [];

    // Filter memories by relevance
    const relevantMemories = this.memories.filter(memory => {
      // Check if tags match current context
      const currentTags = [
        emotionalAnalysis.primary_emotion,
        ...emotionalAnalysis.triggers_detected || [],
        ...currentMessage.toLowerCase().split(' ').filter(w => w.length > 4)
      ];

      const tagMatch = memory.tags?.some(tag => 
        currentTags.some(ct => ct.toLowerCase().includes(tag.toLowerCase()))
      );

      // Check importance threshold
      const isImportant = memory.importance >= 7;

      return tagMatch || isImportant;
    });

    // Sort by importance and recency
    return relevantMemories
      .sort((a, b) => {
        const aScore = a.importance + (a.referenced_count * 0.1);
        const bScore = b.importance + (b.referenced_count * 0.1);
        return bScore - aScore;
      })
      .slice(0, 5); // Top 5 most relevant
  }

  // Update memory reference count
  async updateMemoryReference(memoryId) {
    try {
      const memory = await base44.entities.MemoryEntry.list();
      const targetMemory = memory.find(m => m.id === memoryId);
      if (targetMemory) {
        await base44.entities.MemoryEntry.update(memoryId, {
          referenced_count: (targetMemory.referenced_count || 0) + 1,
          last_referenced: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating memory reference:', error);
    }
  }

  // Generate intelligent system prompt
  generateSystemPrompt(emotionalAnalysis, text) {
    const conversationStyle = this.getConversationStyle();
    const theoreticalFoundations = this.getTheoreticalFoundations();
    const contextualInsights = this.getContextualInsights(emotionalAnalysis, text);
    const therapeuticStrategy = this.getTherapeuticStrategy(emotionalAnalysis);
    
    return `Tu es Sakina, une IA thérapeutique de nouvelle génération avec intelligence émotionnelle avancée.

${theoreticalFoundations}

${conversationStyle}

${contextualInsights}

${therapeuticStrategy}

MESSAGE UTILISATEUR: "${text}"

RÉPONSE ATTENDUE:
- Naturelle et spontanée comme une vraie conversation
- Adaptée au profil et à l'historique
- Focus sur l'émotion, pas juste les mots
- Référence le passé si pertinent
- Propose action concrète si approprié

LONGUEUR: ${this.user.communication_length === 'concise' ? '1-2 phrases max' : this.user.communication_length === 'detailed' ? '3-4 phrases' : '2-3 phrases'}`;
  }

  getTheoreticalFoundations() {
    return `📚 FONDATIONS THÉORIQUES:

MODÈLE TCC (Aaron Beck) - Triangle cognitif:
PENSÉES AUTOMATIQUES → ÉMOTIONS → COMPORTEMENTS
→ Identifie les pensées automatiques dysfonctionnelles
→ Questionne leur validité avec bienveillance
→ Propose alternatives plus adaptatives

INTERACTION PENSÉES/ÉMOTIONS:
Les émotions ne sont pas des faits, mais des interprétations
→ "Tu ressens X parce que tu penses Y. Et si on vérifiait Y ?"
→ Distingue ressenti (valide) et interprétation (questionnable)

MODES DE PENSÉE (Minsky):
Les émotions sont des "modes de pensée" qui filtrent la réalité
→ Anxiété = mode "détection de danger" hyperactif
→ Tristesse = mode "conservation d'énergie"
→ Aide l'utilisateur à reconnaître le mode actif et à en sortir

SIGNAUX FAIBLES (ML & Mental Health):
Détecte patterns subtils avant crise:
→ Changement vocabulaire (appauvrissement, négativité croissante)
→ Timing messages (insomnie, évitement social)
→ Thèmes récurrents non résolus
→ Diminution engagement (réponses courtes, moins fréquentes)
→ Escalade émotionnelle progressive

LIMITES & ÉTHIQUE (IA en santé mentale):
✓ Validation émotionnelle inconditionnelle
✓ Non-jugement absolu
✓ Sécurité avant tout (détection crise)
✗ Pas de diagnostic médical
✗ Pas de prescription/conseil médicamenteux
✗ Orientation vers professionnels si dépassé
`;
  }

  getConversationStyle() {
    const style = this.user.communication_style || 'balanced';
    
    const styles = {
      direct: `STYLE: ULTRA-DIRECT
- Phrases de 5-8 mots maximum
- Va droit au but, zéro superflu
- Format: [Constat]. [Question/Action].
Exemple: "Ça déborde. C'est quoi le pire ?"`,

      gentle: `STYLE: TRÈS DOUX
- Ton empathique maximal, beaucoup de validation
- Vocabulaire apaisant: "doucement", "à ton rythme", "c'est OK"
- Jamais de confrontation, toujours du soutien
Exemple: "Je sens que c'est vraiment difficile pour toi. Prends ton temps, je suis là."`,

      balanced: `STYLE: ÉQUILIBRÉ
- Mélange empathie et pragmatisme
- Valide l'émotion puis oriente vers solution
- Ton chaleureux mais pas trop "mou"
Exemple: "Ça fait mal. Tu veux qu'on trouve une issue ?"`,

      motivating: `STYLE: MOTIVANT
- Ton encourageant et orienté solutions
- Focus sur forces et capacités
- Renforcement positif constant
Exemple: "Tu as déjà surmonté ça avant. Qu'est-ce qui avait marché ?"`
    };

    return styles[style] || styles.balanced;
  }

  getContextualInsights(emotionalAnalysis, text) {
    let insights = `🧠 CONTEXTE INTELLIGENT:\n`;

    // Long-term memories
    const relevantMemories = this.findRelevantMemories(text, emotionalAnalysis);
    if (relevantMemories.length > 0) {
      insights += `\n📚 MÉMOIRES LONG TERME PERTINENTES (${relevantMemories.length}):\n`;
      relevantMemories.forEach((memory, idx) => {
        insights += `\n${idx + 1}. [${memory.memory_type}] ${memory.title}\n`;
        insights += `   Détail: ${memory.content.substring(0, 150)}...\n`;
        insights += `   Importance: ${memory.importance}/10\n`;
        if (memory.context?.what_worked) {
          insights += `   ✅ Ce qui avait marché: ${memory.context.what_worked}\n`;
        }
        if (memory.context?.lesson_learned) {
          insights += `   💡 Leçon: ${memory.context.lesson_learned}\n`;
        }
        insights += `   → RÉFÉRENCE CE SOUVENIR EXPLICITEMENT dans ta réponse si pertinent\n`;
        insights += `   → Exemple: "Tu te souviens quand..." ou "La dernière fois que..."\n`;
      });
      insights += `\n`;
    }

    // Pattern recognition
    if (this.longTermAnalysis.recurring_themes?.some(t => 
      text.toLowerCase().includes(t.toLowerCase()))) {
      const theme = this.longTermAnalysis.recurring_themes.find(t => 
        text.toLowerCase().includes(t.toLowerCase()));
      insights += `⚠️ THÈME RÉCURRENT: "${theme}"\n`;
      insights += `→ Référence conversations passées: "On en a déjà parlé" ou "Ça revient souvent"\n`;
      insights += `→ Propose évolution: "Qu'est-ce qui a changé depuis ?"\n\n`;
    }

    // Known triggers
    if (this.longTermAnalysis.frequent_triggers?.some(t => 
      text.toLowerCase().includes(t.toLowerCase()))) {
      insights += `🎯 DÉCLENCHEUR CONNU DÉTECTÉ\n`;
      insights += `→ Utilise stratégie efficace du passé: ${this.longTermAnalysis.effective_strategies?.[0] || 'respiration'}\n`;
      insights += `→ Ne demande pas "c'est quoi le pire", tu SAIS déjà\n\n`;
    }

    // Time context
    const hour = this.context.patterns?.currentHour || new Date().getHours();
    if (hour >= 22 || hour < 6) {
      insights += `🌙 MESSAGE NOCTURNE (${hour}h)\n`;
      insights += `→ Probable insomnie/anxiété\n`;
      insights += `→ Focus: apaisement, pas de solutions complexes\n`;
      insights += `→ Propose: respiration, body scan pour dormir\n\n`;
    }

    // Activity patterns
    if (this.context.patterns?.activityLevel === 'élevée' && 
        this.context.patterns?.hoursSinceLastChat < 3) {
      insights += `📊 UTILISATION INTENSIVE\n`;
      insights += `→ Possiblement en crise\n`;
      insights += `→ Vérifie niveau de détresse\n`;
      insights += `→ Propose ressources d'urgence si nécessaire\n\n`;
    }

    // Weather impact
    if (this.context.weather?.mood_impact === 'négatif') {
      insights += `🌧️ MÉTÉO DIFFICILE\n`;
      insights += `→ Valide impact: "Le temps joue pas en ta faveur."\n`;
      insights += `→ Normalise baisse énergie\n\n`;
    }

    // User preferences
    if (this.user.preferred_exercises?.length > 0) {
      insights += `💡 EXERCICES PRÉFÉRÉS: ${this.user.preferred_exercises.join(', ')}\n`;
      insights += `→ Priorise ces exercices dans tes suggestions\n\n`;
    }

    // User's therapeutic goals
    if (this.context.activeGoals?.length > 0) {
      insights += `🎯 OBJECTIFS THÉRAPEUTIQUES ACTIFS:\n`;
      this.context.activeGoals.forEach((goal, idx) => {
        insights += `${idx + 1}. [${goal.goal_type}] ${goal.title}\n`;
        if (goal.description) {
          insights += `   Pourquoi: ${goal.description}\n`;
        }
        insights += `   → ALIGNE tes suggestions avec cet objectif\n`;
      });
      insights += `\nSi pertinent, MENTIONNE l'objectif: "Pour ton objectif de ${this.context.activeGoals[0]?.title}..."\n\n`;
    }

    return insights;
  }

  getTherapeuticStrategy(emotionalAnalysis) {
    const emotion = emotionalAnalysis.primary_emotion;
    const intensity = emotionalAnalysis.intensity;

    let strategy = `🎯 STRATÉGIE THÉRAPEUTIQUE (TCC + Validation):\n`;
    strategy += `Émotion: ${emotion} (${intensity}/10)\n`;
    strategy += `Énergie: ${emotionalAnalysis.energy_level || 'inconnue'}\n\n`;

    // Beck's cognitive triangle application
    if (emotionalAnalysis.cognitive_distortions?.length > 0) {
      strategy += `TRIANGLE COGNITIF (Beck) DÉTECTÉ:\n`;
      const distortion = emotionalAnalysis.cognitive_distortions[0];
      strategy += `PENSÉE AUTOMATIQUE: "${distortion.evidence}" (${distortion.type})\n`;
      strategy += `↓\n`;
      strategy += `ÉMOTION: ${emotion} (${intensity}/10)\n`;
      strategy += `↓\n`;
      strategy += `COMPORTEMENT probable: ${this._inferBehavior(emotion)}\n\n`;
      
      strategy += `INTERVENTION TCC:\n`;
      strategy += `1. VALIDE l'émotion: "Normal de ressentir ça."\n`;
      strategy += `2. QUESTIONNE la pensée: "Cette pensée est-elle 100% vraie ?"\n`;
      strategy += `3. EXPLORE alternatives: "Qu'est-ce qui pourrait nuancer ça ?"\n`;
      strategy += `4. ANCRE dans le présent: "Que se passe-t-il vraiment là, maintenant ?"\n\n`;
    }

    // Intensity-based approach
    if (intensity >= 8) {
      strategy += `⚠️ INTENSITÉ TRÈS ÉLEVÉE\n`;
      strategy += `→ PRIORITÉ: Régulation émotionnelle immédiate\n`;
      strategy += `→ Pas de questions complexes, juste ancrage\n`;
      strategy += `→ Exercice simple: respiration ou grounding\n\n`;
    } else if (intensity >= 5) {
      strategy += `→ Validation + recadrage doux\n`;
      strategy += `→ Propose exercice court (30-60 sec)\n`;
      strategy += `→ Explore situation si énergie suffisante\n\n`;
    } else {
      strategy += `→ Exploration en profondeur possible\n`;
      strategy += `→ Travail sur patterns et solutions\n`;
      strategy += `→ Exercices plus longs si pertinent\n\n`;
    }

    // Weak signals detection
    strategy += `SIGNAUX FAIBLES:\n`;
    if (emotionalAnalysis.isolation_indicators) {
      strategy += `⚠️ Isolement détecté - Encourage connexion douce\n`;
    }
    if (emotionalAnalysis.pattern_break) {
      strategy += `⚠️ Rupture pattern - Explore avec curiosité bienveillante\n`;
    }
    if (emotionalAnalysis.energy_level === 'épuisé' || emotionalAnalysis.energy_level === 'très bas') {
      strategy += `⚠️ Fatigue importante - Priorité repos, micro-actions\n`;
    }
    if (emotionalAnalysis.weak_signals?.vocabulary_impoverishment) {
      strategy += `⚠️ Appauvrissement vocabulaire - Signe fatigue cognitive\n`;
    }
    if (emotionalAnalysis.weak_signals?.increasing_negativity) {
      strategy += `⚠️ Négativité croissante - Possible début dépression\n`;
    }
    if (emotionalAnalysis.weak_signals?.progressive_disengagement) {
      strategy += `⚠️ Désengagement progressif - Vérifie motivation/espoir\n`;
    }
    if (emotionalAnalysis.weak_signals?.stuck_thinking_mode !== 'none') {
      strategy += `⚠️ Mode de pensée bloqué (${emotionalAnalysis.weak_signals.stuck_thinking_mode}) - Aide à changer de filtre\n`;
    }
    strategy += `\n`;

    // Therapeutic approach based on context
    if (this.longTermAnalysis.overall_trend === 'amélioration') {
      strategy += `\n✅ TENDANCE POSITIVE\n`;
      strategy += `→ Renforce progrès: "Tu avances bien."\n`;
      strategy += `→ Valorise changements observés\n`;
    } else if (this.longTermAnalysis.overall_trend === 'dégradation') {
      strategy += `\n⚠️ TENDANCE NÉGATIVE\n`;
      strategy += `→ Intensifie soutien\n`;
      strategy += `→ Suggère aide pro si pattern persiste\n`;
    }

    // Align with user goals
    if (this.context.activeGoals?.length > 0) {
      strategy += `\n🎯 ALIGNEMENT OBJECTIFS:\n`;
      this.context.activeGoals.forEach(goal => {
        const alignments = {
          sleep: 'Propose routines sommeil, relaxation nocturne',
          mood: 'Focus sur régulation émotionnelle, mood tracking',
          stress: 'Exercices respiration, grounding, CBT',
          addiction: 'Stratégies coping, gestion envies, accountability',
          mindfulness: 'Méditation, présence, body scan',
          social: 'Techniques communication, exposition graduelle, affirmation de soi'
        };
        strategy += `→ ${goal.title}: ${alignments[goal.goal_type]}\n`;
      });
    }

    return strategy;
  }

  _inferBehavior(emotion) {
    const behaviorMap = {
      'anxiété': 'évitement, rumination, hypervigilance',
      'tristesse': 'retrait social, inactivité, isolement',
      'colère': 'confrontation, irritabilité, tension',
      'stress': 'suractivité, difficulté concentration',
      'fatigue': 'procrastination, désengagement',
      'honte': 'évitement regard d\'autrui, autocritique',
      'peur': 'évitement, paralysie décisionnelle',
      'solitude': 'retrait, difficulté tendre la main'
    };
    return behaviorMap[emotion] || 'réaction émotionnelle';
  }

  // Post-process AI response for naturalness
  postProcessResponse(rawResponse) {
    let processed = rawResponse.trim();

    // Remove overly clinical language
    const replacements = {
      'Je comprends que': 'Je vois que',
      'Il est normal de': 'Normal de',
      'Je suis là pour t\'accompagner': 'Je suis là',
      'N\'hésite pas à': 'Tu peux',
      'Comment te sens-tu': 'Ça va',
      'Qu\'est-ce que tu ressens': 'Tu ressens quoi',
    };

    for (const [formal, casual] of Object.entries(replacements)) {
      processed = processed.replace(new RegExp(formal, 'gi'), casual);
    }

    // Ensure it's not too long based on preferences
    const sentences = processed.match(/[^.!?]+[.!?]+/g) || [processed];
    const maxSentences = this.user.communication_length === 'concise' ? 2 : 
                        this.user.communication_length === 'detailed' ? 4 : 3;
    
    if (sentences.length > maxSentences) {
      processed = sentences.slice(0, maxSentences).join(' ');
    }

    return processed;
  }
}

export default ConversationEngine;