# ADR-007: Use OIDC / Keycloak for Identity and Access

- Status: Accepted
- Date: 2026-09-28

## Context

Sakina demands secure identity management, device/session awareness, MFA readiness, token rotation, and account recovery. A custom auth implementation would be inappropriate for a digital health product.

## Decision

We will integrate Keycloak and OIDC-compatible identity providers as the primary authentication authority.

## Why

- Standards-based and interoperable
- Good support for PKCE, refresh token rotation, MFA, and delegated auth
- Easier future integration with organizations and professional accounts
- Reduced custom cryptographic and session logic

## Consequences

### Positive

- Mature security story
- Better support for multi-tenant and org-based accounts
- Easier standardization across web, mobile, and future channels

### Negative

- Requires operational deployment of identity infrastructure
- Must be correctly configured for healthcare data privacy needs

## Guardrails

- Use short-lived access tokens
- Enable refresh token rotation
- Distinguish user identity from medical data identity
- Keep admin and professional flows explicit and separate

## Follow-up

This informs RBAC/ABAC and admin/professional access domains.
