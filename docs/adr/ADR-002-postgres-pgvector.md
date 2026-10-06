# ADR-002: PostgreSQL 18 + pgvector as System of Record

Status: Accepted

## Context

The platform needs ACID guarantees, relational integrity, high-quality analytics, and vector search for knowledge retrieval and memory support.

## Decision

Use PostgreSQL 18 with pgvector as the primary data store.

## Rationale

- strong transaction guarantees
- schema validation and constraints
- safe for sensitive health data
- vector search supports retrieval and memory
- avoids maintain two separate storage systems

## Consequences

### Positive

- simpler operations
- easier migrations
- easier security model
- better future analytics integration

### Negative

- need careful indexing and partition design
- must protect sensitive data with explicit access rules

## Operational requirement

- versioned migrations
- backup and PITR
- indexes for queries and joins
- row-level security when necessary

