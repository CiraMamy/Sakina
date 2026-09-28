# Sakina API Bootstrapping

This directory is reserved for the NestJS API application that will serve the production backend.

Planned structure:

- `src/app.module.ts`
- `src/main.ts`
- `src/common/`
- `src/config/`
- `src/modules/` for identity, profile, consent, conversation, safety, etc.
- `src/shared/`
- `src/swagger/`

The API must follow:

- NestJS
- OpenAPI 3.1
- DTO validation
- role-based and object-level authorization
- authenticated routes with explicit ownership checks
- standardized error model
- audit logging
