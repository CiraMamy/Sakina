# ADR-001: Modular Monolith First

Status: Accepted

## Context

Sakina is a Digital Health product with AI, health data, crisis safety, and referral workflows. The architecture must support growth without premature fragmentation.

## Decision

Use a modular monolith as the initial implementation strategy, with special AI and worker components separated logically.

## Rationale

- easier transaction management for health data
- easier onboarding for the team
- supports DDD-style modules
- clear later extraction path to services
- less operational complexity in early production phases

## Consequences

### Positive

- faster implementation
- lower initial operational burden
- clearer domain boundaries

### Negative

- less isolated scaling than microservices
- requires discipline to avoid monolith sprawl

## Follow-up decisions

- Keep domain modules separated by bounded context
- Use event-driven patterns for important business events
- Use Temporal for asynchronous workflows
- Split to services only when data and traffic justify it

