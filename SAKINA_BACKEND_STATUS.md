# Sakina Backend Status

## Completed

- repository audit completed
- architecture documentation created
- ADRs created
- monorepo structure scaffolded
- NestJS API foundation scaffolded
- Prisma schema initial foundation prepared
- auth, users, consent, conversation, profile, audit, identity modules scaffolded
- security guard and exception filter scaffolded

## In Progress

- full Prisma integration and migration setup
- concrete role-based authorization layer
- OIDC / Keycloak integration design
- journal / wellness / emotion / safety domain modules
- API validation and error contract alignment
- audit pipeline and data retention flow

## Blocked

- production-grade database runtime not yet connected to a live PostgreSQL instance
- full security review and policy enforcement not yet implemented in production code
- AI model gateway and safety engine not yet wired to actual model providers

## Decisions

- modular monolith first, with domain boundaries that support future extraction
- Prisma selected as the primary ORM
- NATS JetStream selected for internal eventing
- OIDC / Keycloak selected for identity and access
- strong separation between identity data and mental health data

## Security Risks

- raw health data must never be logged in standard logs
- model provider integration must include consent and policy controls
- complex AI workflows must remain behind a safety verifier and human oversight layer

## AI Risks

- emotional inference must remain probabilistic and uncertain
- no diagnosis claims by the AI without explicit human review and clinical governance
- crisis workflows must use verified safety policies and never form dependency on the user

## Next Milestones

1. complete DB + Prisma migration readiness
2. finalize role and permission layer
3. add journal and wellness core services
4. add AI gateway and safety policy scaffolds
5. add observability and CI/CD baseline
6. validate build and security checks before production evolution

## Summary

The repository has successfully passed the architecture and foundation phase for Sakina. The backend is now moving from design scaffolding to actual domain implementation. The remaining work is targeted, security-driven, and must remain grounded in the product's non-negotiables.
