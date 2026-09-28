# Privacy and Data Governance for Sakina

## Privacy Principles

Sakina is built on the following principles:

1. Privacy by design
2. Data minimization
3. Purpose limitation
4. Consent before processing
5. User control over their data
6. Explicit retention and deletion policy
7. Strong separation of identity and health data
8. No raw sensitive content in technical logs

## Sensitive Data Categories

- identity data
- demographic data
- emotional and mental health data
- journal data
- conversation content
- location and device metadata
- audio and transcript data
- referral data
- professional directory access data

## Consent Model

Every consent record must include:

- type
- version
- purpose
- status
- source
- timestamp
- legal basis when relevant
- revocation timestamp if revoked

Examples:
- AI consent
- privacy consent
- voice consent
- research consent
- referral consent
- marketing consent

## User Rights

The platform must support:

- access to own data
- correction of inaccurate records
- deletion of personal data
- export of personal data
- revocation of consent
- view of what is stored and why

## Health Data Isolation

Mental health and emotional data require an elevated protection posture. Access should not be implicit, and admin access must be auditable.

## Data Residency

Sakina must support `DATA_RESIDENCY_POLICY` by country. This is important for African geographies and cross-border processing constraints.

## Retention and Deletion

- keep only what is necessary
- set explicit retention windows per data category
- support deletion workflows and anonymization
- maintain logs that do not expose sensitive content

## Related Documents

- `docs/security/THREAT_MODEL.md`
- `docs/architecture/DATA_MODEL.md`
- `docs/adr/ADR-005-health-data-isolation.md`
