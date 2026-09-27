# Threat Model for Sakina

## Scope

This threat model covers the Digital Health platform, AI integration, user-sensitive data, crisis workflows, and future professional interfaces.

## Primary assets

- user identity and credentials
- mental health and journaling data
- emotion and health-related inferences
- consent records
- referrals and professional records
- models and knowledge sources
- admin access and audit trail

## Key threats

### Identity and access threats

- account takeover
- session hijacking
- privilege escalation
- IDOR
- admin misuse

### Data privacy threats

- leakage through logs
- unauthorized export
- cross-user access
- unauthorized inference from metadata

### AI-specific threats

- prompt injection
- jailbreak
- unsafe crisis advice
- model hallucination
- data leakage from model providers
- dependency formation and manipulative personalization

### Operational threats

- dependency outage
- rate abuse
- model cost blow-up
- malicious payloads in uploads
- supply chain vulnerability

## Mitigations

- OIDC / Keycloak with MFA readiness
- RBAC + ABAC-ready authorization model
- row-level security and ownership checks
- no raw sensitive data in technical logs
- model gateway abstraction with allowlists
- versioned safety policy engine
- strict prompt injection defenses
- rate limiting and quotas
- secure upload validation and malware scanning strategy
- dependency scanning and SBOM generation

## Security posture

The platform should be built according to OWASP API Security Top 10 and should require explicit human oversight for risky AI outputs.

