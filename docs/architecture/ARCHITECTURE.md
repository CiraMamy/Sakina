# Sakina Architecture Overview

## Mission

Sakina is a Digital Health platform for mental wellbeing. The goal is not to create a single chatbot but an operational digital health infrastructure where AI is one component among several core systems: identity, consent, conversation, safety, memory, recommendations, professional referral, analytics, and privacy.

## Architectural Principles

1. Safety before features
2. Privacy before analytics
3. Human oversight remains central
4. AI never diagnoses alone
5. All emotional inference is probabilistic
6. Consent and correction are first-class
7. The system must remain modular and extensible
8. The first version must be production-oriented, not a toy prototype

## High-Level Architecture

```text
CLIENTS
├── Web
├── Mobile
├── Future channels (WhatsApp, SMS, Telegram, USSD)

API GATEWAY
└── SAKINA BACKEND
    ├── Identity & Access
    ├── User Profile
    ├── Consent & Privacy
    ├── Conversations
    ├── Emotion Engine
    ├── Safety Engine
    ├── Memory Engine
    ├── Personalization
    ├── Journal
    ├── Mental Wellness Modules
    ├── Addiction Support
    ├── Sleep
    ├── Recommendations
    ├── Professional Directory
    ├── Referral
    ├── Notifications
    ├── Content & Knowledge
    ├── Analytics
    ├── Admin
    ├── Audit
    └── FHIR Interoperability

AI ORCHESTRATION
├── Model Gateway
├── LLM providers
├── Local models
├── Emotion models
├── Safety models
├── Embedding models
└── Moderation and speech models

DATA LAYER
├── PostgreSQL 18 + pgvector
├── Valkey / Redis-compatible cache
├── Object storage (S3-compatible)
├── Event stream (NATS JetStream)
└── Audit storage

INFRA
├── Docker Compose
├── Kubernetes
├── Terraform
├── Prometheus + Grafana
├── OpenTelemetry
├── Keycloak / OIDC
├── Backup / DR
└── Secrets management
```

## Target Deployment Pattern

The project will begin as:

- modular monolith in the main backend
- separate AI orchestration layer
- event-driven worker layer
- Temporal workflows for long-running and resumable operations

The design deliberately allows extraction into isolated services later if scale or team ownership requires it.

## Domain Boundaries

We will keep bounded contexts distinct, even within a single repository:

- identity
- profile
- consent
- conversation
- journal
- emotion
- safety
- knowledge
- professional directory
- referral
- notifications
- analytics
- audit
- FHIR

## Security Model

- Zero trust approach
- Authentication and authorization required on all sensitive routes
- Object-level authorization
- Explicit consent checks before processing and storage
- Strong separation between identity and health data
- Audit logs for privileged actions
- No raw sensitive content in ordinary technical logs

## Technology Baseline

- TypeScript
- Node.js LTS
- NestJS
- PostgreSQL 18
- pgvector
- Prisma
- Valkey
- NATS JetStream
- Temporal
- OpenTelemetry
- Docker / Compose / Kubernetes
- Terraform
- Keycloak / OIDC

## Implementation Sequence

Phase 1
- security foundation
- auth and consent
- core data model
- API skeleton
- modular monolith structure

Phase 2
- conversation domain
- messaging and event contracts
- notifications and workers

Phase 3
- AI gateway and knowledge retrieval
- affect engine
- safety engine

Phase 4
- professional directory and referrals
- FHIR adapters
- observability and resilience

Phase 5
- scale, backups, DR, multi-region readiness

## Non-Negotiables

- No fake AI confidence
- No “single provider” architecture dependency
- No “medical diagnosis by LLM” behavior
- No unauthorized data sharing
- No use of raw health data in ordinary logs
- No unsafe emotional dependency creation

## Related Documents

- `docs/adr/ADR-001-modular-monolith-vs-microservices.md`
- `docs/security/THREAT_MODEL.md`
- `docs/privacy/PRIVACY.md`
- `docs/architecture/DATA_MODEL.md`
- `docs/architecture/AI_ARCHITECTURE.md`
