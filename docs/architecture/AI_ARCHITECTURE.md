# Sakina AI Architecture

## Overview

Sakina requires a robust AI orchestration layer that is responsible for model access, safety, retrieval, and evaluation without coupling business logic directly to a single provider SDK.

## Core AI Flow

```text
User Input
  ↓
Normalization / Input Validation
  ↓
Language Detection
  ↓
Affect Core
  ↓
Safety Core
  ↓
Memory Engine
  ↓
Knowledge Retrieval
  ↓
Response Policy Engine
  ↓
Model Router
  ↓
Generation
  ↓
Safety Verifier
  ↓
Final Response
```

## SAKINA AFFECT CORE

Purpose:
- estimate emotional state probabilistically
- keep uncertainty explicit
- support user correction
- maintain temporal trends

Core output:
- primary and secondary emotions
- valence
- arousal
- dominance
- needs
- uncertainty
- confidence
- evidence
- source modalities

## SAKINA SAFETY CORE

Purpose:
- assess crisis risk before generation
- apply policy decisions
- redirect to escalation pathways or local resources

This should be independent of the LLM generation step.

## Model Gateway

The gateway abstracts provider implementations and selects the right model for each task.

Examples:
- emotion classification
- moderation
- embeddings
- response generation
- speech-to-text
- transcription
- text synthesis

## Retrieval / Knowledge Engine

Knowledge content must be sourced from trusted references and linked to provenance.

Required metadata:
- source
- title
- version
- review date
- jurisdiction
- language
- evidence level
- reviewed by
- approval status

## Response Policy Engine

The policy engine decides the response mode before generation.

Examples:
- LISTEN
- VALIDATE
- CLARIFY
- EDUCATE
- REFER
- CRISIS
- FOLLOW_UP

## Evaluation and Governance

AI changes must be evaluated with:
- safety evaluation
- bias evaluation
- calibration analysis
- cost/latency review
- language quality review
- regression tests

## Related Documents

- `docs/adr/ADR-003-sakina-affect-core.md`
- `docs/adr/ADR-004-model-gateway.md`
- `docs/adr/ADR-008-safety-engine.md`
- `docs/architecture/ARCHITECTURE.md`
