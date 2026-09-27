# Sakina Backend Phase 1

This repository now includes the first backend scaffolding for Sakina, built as a modular monolith in NestJS with Prisma and PostgreSQL.

## Phase 1 deliverables

- NestJS API bootstrap
- Prisma schema with users, profiles, consent, sessions, conversations, messages, audit, safety.
- JWT auth foundation for secure access control
- Domain modules for auth, users, profiles, consents, conversations, health, safety, audit
- Basic OpenAPI documentation
- Docker Compose for PostgreSQL and Redis
- Security and privacy-first scaffolding

## Prerequisites

- Node.js >= 20
- PostgreSQL 18 (or Docker Compose)
- npm

## Setup

```bash
cd apps/api
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

Then visit:

- API: http://localhost:3000/api/v1
- Swagger: http://localhost:3000/docs

## Security note

This is a Phase 1 foundation. It is not yet a fully production-hardened clinical system.

The following remain to be added in later phases:

- Keycloak / OIDC full integration
- policy-based safety engine
- AI model gateway abstraction
- Temporal workflows
- professional directory and referral engine
- observability and tracing
- privacy controls and retention jobs
- load tests and security tests

## Important architecture decision

This phase follows the modular monolith strategy described in the architecture docs. The AI layer and workflows remain intentionally isolated from the core API, so the platform can evolve to a distributed system later without rewriting the domain model.

