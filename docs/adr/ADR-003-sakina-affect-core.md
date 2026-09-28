# ADR-003: Introduce SAKINA AFFECT CORE as a Separate Domain Concern

- Status: Accepted
- Date: 2026-09-28

## Context

The product is not a generic emotional chatbot. Sakina must estimate emotional states probabilistically and with explicit uncertainty, while preserving privacy and human oversight.

A simple sentiment label like “happy” or “sad” is insufficient. The platform must capture multiple dimensions: valence, arousal, dominance, needs, intent, context, and uncertainty.

## Decision

We will build a dedicated subsystem named SAKINA AFFECT CORE, separated from the core conversation generation logic.

## Product Need

The engine must support:

- emotion categories
- valence, arousal, dominance
- needs and intent inference
- contextual analysis
- temporal trajectory
- confidence and uncertainty calibration
- user correction loop
- explicit abstention when confidence is low

## Architecture

The engine will produce an `AffectState` object, not a final emotional diagnosis.

Example:

```json
{
  "emotion_distribution": [],
  "valence": 0.4,
  "arousal": 0.6,
  "dominance": 0.3,
  "needs": ["validation", "rest"],
  "conversational_state": "distressed",
  "uncertainty": 0.42,
  "evidence": ["language", "temporal context"],
  "modality_quality": "text-only",
  "temporal_trend": "worsening",
  "user_correction_available": true
}
```

## Consequences

### Positive

- Clear separation between emotion estimation and response generation
- Better explainability and safety validation
- Easier calibration and privacy-safe telemetry
- Better future support for text, voice, and multimodal inputs

### Negative

- Requires strict evaluation discipline and benchmarking
- Must prevent false confidence
- Requires careful handling of cultural nuance and ambiguity

## Guardrails

- Never claim certainty about an emotional state
- Never diagnose mental illness from a single inference
- Always surface uncertainty and enable user correction
- Do not log raw sensitive content in technical logs

## Follow-up

This decision feeds the AI architecture, safety decisions, and evaluation strategy.
