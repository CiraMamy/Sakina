# ADR-005: Separate Identity Data from Mental Health Data

- Status: Accepted
- Date: 2026-09-28

## Context

Digital health products must be built with stringent isolation between personal identity data and sensitive mental health data. This is both a safety issue and a legal/privacy requirement.

## Decision

We will implement logical separation of schema domains and access patterns:

- `identity`
- `profile`
- `mental_health`
- `ai`
- `analytics`
- `audit`

## Design Principles

1. Identity data is not the same as clinical or emotional data.
2. Mental health data requires stronger access controls and narrower traceability.
3. Users must not be able to access resources solely because they know an identifier.
4. Authorization must validate object ownership and role permission.

## Consequences

### Positive

- Better privacy posture
- Safer future data exports and sharing
- Easier audits and compliance reviews
- Reduced breach impact

### Negative

- Slightly more complex schema design
- More explicit cross-boundary authorization checks

## Guardrails

- Use UUID/UUIDv7 as internal identifiers where appropriate
- Never use email as the primary internal identifier
- Enforce row-level access in the database where relevant
- Require explicit consent before cross-domain data sharing

## Follow-up

This ADR influences data model, consent architecture, and admin access rules.
