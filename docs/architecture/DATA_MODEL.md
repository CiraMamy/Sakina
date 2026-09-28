# Sakina Data Model Overview

## Data Strategy

Sakina separates data into logical domains to reduce breach blast radius and improve governance.

## Domain Groups

### 1. Identity

Stores account and auth-related data:

- users
- sessions
- devices
- organizations
- roles
- permissions
- professional identities

### 2. Profile

Stores basic profile and preference data:

- demographics
- country
- language
- timezone
- accessibility
- preferences

### 3. Mental Health

Stores sensitive user wellbeing data:

- conversations
- messages
- journal entries
- mood and emotion states
- safety states
- routines and exercises
- sleep data
- addiction support data

### 4. AI

Stores model and inference context:

- prompts
- model versions
- evaluation results
- memory summaries
- embedding metadata
- safety policy versions

### 5. Analytics

Stores operational and limited product analytics without unnecessary personal data.

### 6. Audit

Stores append-only security, privacy, and action tracing.

## Key Constraints

- Do not store raw sensitive content in ordinary logs
- Health data must have stronger authorization and retention controls
- Use UUIDv7 or strong internal IDs rather than emails as primary access keys
- Store only necessary fields for analytics
- Keep consent versions and revocation statuses explicit and auditable

## Example Core Entities

```text
User
  id
  uuid
  email
  accountStatus
  createdAt
  updatedAt

UserProfile
  id
  userId
  country
  language
  timezone
  preferences

ConsentRecord
  id
  userId
  type
  version
  status
  purpose
  acceptedAt
  revokedAt

Conversation
  id
  userId
  status
  createdAt
  updatedAt

Message
  id
  conversationId
  userId
  role
  content
  safetyState
  affectState
  createdAt

JournalEntry
  id
  userId
  content
  mood
  tags
  private
  createdAt

AffectState
  userId
  valence
  arousal
  dominance
  needs
  uncertainty
  evidence
  modelVersion
  createdAt
```

## Database Baseline

- PostgreSQL 18
- pgvector extensions
- Prisma schema management
- migrations versioned and reproducible
- indexes and partial indexes for high-volume tables
- audit timestamps everywhere
- soft-deletion patterns where legally relevant

## Data Residency

The system must support country policies via `DATA_RESIDENCY_POLICY` to control where data is stored and processed.

## Related Documents

- `docs/architecture/ARCHITECTURE.md`
- `docs/privacy/PRIVACY.md`
- `docs/adr/ADR-005-health-data-isolation.md`
