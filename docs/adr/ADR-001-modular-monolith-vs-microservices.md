# ADR-001: Modular Monolith First, Domain-Driven Modularization Later

- Status: Accepted
- Date: 2026-09-28

## Context

Sakina is a digital health platform with strong constraints: safety, privacy, human oversight, multilingual support, and future scale. We must avoid building a fragile chatbot app with a single database around it. At the same time, we must not prematurely create 20+ microservices.

The product must evolve from a prototype to a serious digital health platform that can support millions of users, AI-driven workflows, human review, and future interoperability.

## Decision

We will start with a modular monolith as the primary architecture for the first production-ready release, while designing every module to be independently extractable later.

## Rationale

1. Product and safety logic are tightly coupled in early phases.
2. We need one transaction boundary, one consistent authorization model, and one identity layer.
3. A modular monolith reduces operational complexity in v1.
4. AI orchestration, worker queues, and temporal workflows can be introduced in a controlled way without breaking the domain.
5. We can later split modules into services when traffic, data isolation, or team ownership justify it.

## Consequences

### Positive

- Faster delivery for core product domains.
- Simpler dev and deploy story.
- Easier audits for privacy and safety.
- Clear domain boundaries.
- Better fit for an initial clinical-grade product.

### Negative

- Some team coordination is required to avoid cross-domain coupling.
- We must enforce architecture boundaries through package and module rules.
- Later extraction will require deliberate refactoring.

## Architecture Boundary

The app will be structured as:

- API layer
- domain modules
- application services
- infrastructure adapters
- workers and temporal workflows
- AI orchestration layer

Each bounded context remains logically separate even if all run within one process.

## Follow-up

Continue with ADR-002, ADR-003, ADR-004, ADR-005, ADR-006, ADR-007, ADR-008.
