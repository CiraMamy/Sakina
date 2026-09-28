# ADR-006: Use NATS JetStream for Internal Eventing

- Status: Accepted
- Date: 2026-09-28

## Context

Sakina needs asynchronous workflows for notifications, safety follow-ups, model evaluation, audit events, data retention, and knowledge refreshes. We also need future resilience when services scale.

## Decision

We will use NATS JetStream as the internal event backbone for asynchronous processing and decoupling.

## Why NATS JetStream

- Good fit for moderate operational complexity
- Lightweight and reliable for internal workflows
- Works well with Temporal for orchestration and durable workflows
- A good step between a single app and a distributed multi-service architecture

## Consequences

### Positive

- Better separation between synchronous API operations and background tasks
- Easier retry and deduplication patterns
- Reduced coupling between domains

### Negative

- Requires operational understanding of stream retention and subscription patterns
- Need careful governance over event naming and payload size

## Guardrails

- Do not put sensitive raw mental health content into event payloads unless explicitly required and protected
- Use typed event contracts
- Keep events auditable and minimal

## Follow-up

This is paired with Temporal workflows and workers.
