# Privacy Architecture for Sakina

## Design principles

- privacy by design
- data minimization
- explicit consent
- purpose limitation
- user control and deletion
- access restrictions
- retention and data residency policies

## Sensitive data categories

- identity data
- profile data
- journaling content
- emotional state data
- crisis indicators
- health events
- referral data
- professional metadata

## Consent model

Consent must be:

- explicit
- versioned
- revocable
- auditable
- purpose-specific

## Data separation

Identity, profile, mental health, AI metadata, analytics, and audit data must be isolated logically and practically.

## User rights

Users must be able to:

- access their data
- correct data
- delete data
- revoke consent
- export data
- disable AI memory selectively

## Retention policy

Retention must be configurable by data category, jurisdiction, and use case.

## Critical rule

No sensitive health content should be stored in regular operational logs or debug output.

