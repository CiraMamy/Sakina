# ADR-002: Use Prisma as the Primary ORM

- Status: Accepted
- Date: 2026-09-28

## Context

Sakina requires a durable data model with:

- PostgreSQL 18 as the production target
- strong typing
- migrations
- relational integrity
- auditability
- layer separation between identity and mental health data
- future vector search with pgvector

We need one coherent persistence strategy for the first production phase.

## Decision

We will use Prisma as the primary ORM for persistence, schema versioning, and migrations.

## Rationale

1. Prisma provides a robust migration workflow and schema-first development.
2. Strong typing reduces mistakes in therapeutic and health-related data handling.
3. Prisma Studio and migration tooling accelerate safety and audit reviews.
4. It fits a product that must evolve from backend prototype to production-grade digital health infrastructure.
5. It reduces the risk of hand-written SQL complexity in v1.

## Alternatives Considered

### Drizzle

Pros:
- very lightweight
- strong SQL ergonomics
- good for advanced SQL use cases

Cons:
- less mature migration story in our current team context
- less conventional for a clinical platform with audit needs and rapid schema evolution
- weaker out-of-box DX for complex domain modeling and introspection

## Consequences

### Positive

- Good schema evolution and migration safety
- Intuitive API for model relationships
- Strong compatibility with PostgreSQL and pgvector

### Negative

- Some generated artifacts are required in repo
- Less low-level control than raw SQL for highly specialized workload patterns

## Mitigations

- Keep Prisma usage in a dedicated package
- Define strict schema naming and domain rules
- Never mix domain logic into Prisma client usage

## Follow-up

This decision is compatible with future extraction into service boundaries without requiring an immediate rewrite.
