# Sakina Threat Model

## Scope

This threat model covers critical product, security, and AI risks for the Sakina platform.

## Primary Threat Categories

### STRIDE-based Risks

- Spoofing: account takeover and impersonation
- Tampering: unauthorized modification of consent or audit records
- Repudiation: lack of strong logs for privileged operations
- Information Disclosure: harmful exposure of mental health content
- Denial of Service: API abuse, model cost exhaustion, resource starvation
- Elevation of Privilege: admin or professional overreach

## Critical Product Risks

1. Cross-user data leakage
2. IDOR via object IDs
3. Prompt injection affecting system instructions
4. Overreliance on unverified AI output
5. Unsafe crisis handling
6. Unauthorized data export or deletion
7. Insecure third-party model usage
8. Model poisoning or poor evaluation governance

## AI-Specific Risks

- prompt injection / jailbreak
- hallucination in medical or safety advice
- overconfident emotion inference
- false reassurance
- dependency formation
- emotional manipulation
- unsafe escalation decisions

## Security Requirements

- OWASP API Security Top 10 controls
- strict auth and authz
- rate limiting per endpoint and model type
- request validation and typed DTOs
- secure headers and strict CORS
- SSRF and upload protections
- access to sensitive routes must require both identity and role checks

## Privacy Requirements

- data minimization
- purpose limitation
- explicit consent tracking
- data retention policies
- deletion and export flows
- pseudonymization when practical
- no raw health content in technical logs

## Operational Controls

- audit logs for privileged actions
- backup/restore testing
- model rollback and registry
- secret management
- dependency scanning and vulnerability review
- performance, safety, and cost guardrails

## Risk Acceptance Notes

No AI safety policy may be implemented as a single LLM prompt. Safety must be layered with deterministic rules, evaluation, and human oversight.

## Related Documents

- `docs/privacy/PRIVACY.md`
- `docs/architecture/ARCHITECTURE.md`
- `docs/adr/ADR-008-safety-engine.md`
