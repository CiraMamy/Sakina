# ADR-008: Build a Safety Engine Independent from Generation

- Status: Accepted
- Date: 2026-09-28

## Context

The AI layer cannot be trusted to decide safety on its own. Sakina must have a dedicated safety mechanism that evaluates risk before final response generation.

## Decision

We will implement an independent `SAKINA SAFETY CORE` that runs before generation and can block, redirect, or escalate a response.

## Safety Flow

- detect risk signals
- classify severity
- check policy rules
- assess crisis indicators
- apply response policy
- decide whether to escalate to human or local emergency resources

## Risk Categories

- ordinary distress
- emotional crisis
- self-harm concern
- suicidal ideation indicators
- imminent danger indicators
- violence concern
- safeguarding concern
- substance-related crisis

## Consequences

### Positive

- Reduced dangerous response patterns
- Better clinical safety governance
- Stronger trust and auditability

### Negative

- More implementation complexity
- Requires explicit evaluation and regression tests

## Guardrails

- Safety decisions must be deterministic or rule-driven where possible
- The safety engine is not a substitute for a human professional
- No harmful instructions or dependency-forming language may be generated

## Follow-up

This ADR underpins the `Response Policy Engine`, crisis policy, and safety verifier.
