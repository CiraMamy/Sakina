# ADR-004: Model Gateway Based on Provider Abstraction

- Status: Accepted
- Date: 2026-09-28

## Context

Sakina must support multiple model providers and model types without architectural lock-in. We require a flexible model layer that can switch between cloud-hosted LLMs, local inference, and specialized moderation/emotion models.

## Decision

We will implement a `ModelProvider` abstraction and a central `Sakina Model Gateway` service.

## Responsibilities

The gateway will manage:

- provider selection
- task routing
- retry and fallback logic
- cost tracking
- model versioning
- safety profile selection
- fallback chains
- latency/cost governance

## Interfaces

The system will expose provider capabilities such as:

- `generate()`
- `embed()`
- `classifyEmotion()`
- `classifySafety()`
- `transcribe()`
- `synthesizeSpeech()`

## Consequences

### Positive

- No single vendor is architecturally indispensable
- Easier cost optimization and quality comparison
- Better resilience and redundancy
- Safer staged deployment and canary release

### Negative

- Requires a clear contract between model tasks and model capabilities
- Increases operational complexity in the first stage

## Guardrails

- Provider choice must be explicit and task-aware
- Safety-critical tasks must never depend solely on a single model
- No production model changes without registry, benchmark, and rollout policy

## Follow-up

This ADR pairs with the AI architecture and evaluation lab design.
