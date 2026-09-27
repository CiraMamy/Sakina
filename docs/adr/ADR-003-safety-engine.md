# ADR-003: Safety Engine Must Be Independent from the Generative Model

Status: Accepted

## Context

Clinical and emotional support contains sensitive safety scenarios. LLM-only safety is insufficient.

## Decision

Implement a dedicated SAKINA Safety Core using rules, classifiers, and LLM verification before final response generation.

## Rationale

- deterministic layers protect critical cases
- transparent escalation sequencing
- supports high-risk responses without dependency on a single provider
- reduces hallucination and policy bypass risk

## Consequences

### Positive

- crisis-safe response routing
- better policy enforcement
- auditability of safety decisions

### Negative

- more engineering work
- requires evaluation and maintenance

## Mandatory output

Every response must be checked against safety policy before final delivery.

