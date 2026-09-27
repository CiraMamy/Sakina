# Sakina

Sakina is a Digital Health platform for mental wellbeing, designed for adolescents and young adults in African contexts.

This repository now contains a front-end prototype plus a backend architecture foundation for the next production phases.

## Current state

- Front-end prototype in `src/`
- Vite + React app
- Therapeutic chat prototype, dashboard, onboarding, emotion and mental wellbeing concepts
- Architecture and security foundations being prepared for the backend transition

## Phase A: Architecture foundation

The repository now includes the first production architecture scaffolding under:

- `docs/architecture/ARCHITECTURE.md`
- `docs/adr/`
- `docs/security/THREAT_MODEL.md`
- `docs/privacy/PRIVACY.md`
- `apps/`
- `packages/`

## Mission

Build a Digital Health infrastructure where AI is one component among several core domains:

- Identity & Access
- Consent & Privacy
- Conversations
- Journal & Emotion tracking
- Safety & crisis escalation
- Memory & personalization
- Professional referral
- Notifications
- Knowledge & RAG
- Analytics
- Interoperability and FHIR

## Technical direction

- TypeScript / Node.js / NestJS
- PostgreSQL 18 + pgvector
- Valkey / Redis compatible cache
- Temporal for resilience and orchestration
- NATS JetStream or Redpanda (selected/constrained in architecture docs)
- Docker / Compose / Kubernetes / Terraform
- OpenTelemetry + Prometheus + Grafana
- Keycloak / OIDC

## Non-negotiables

- Safety before features
- Privacy before analytics
- Human oversight always in the loop
- AI never diagnoses alone
- User consent and user correction are first-class
- Transparent provenance of medical knowledge
- No raw sensitive data in technical logs

## Next step

Phase B begins with the real backend implementation scaffold:

- NestJS app bootstrap
- Prisma schema
- PostgreSQL migrations
- Auth/tenant/user foundation
- DTOs and validation
- Domain and service structure
- Health modules and scaffolding

