# Applicant Profile Protocol (APP)

Version: 1.0.0 (Draft)
Status: Draft
Authors: Community-driven

---

## 1. Overview

The Applicant Profile Protocol (APP) is an open, JSON-based specification for representing a job applicant’s professional profile in a structured, interoperable, and extensible manner.

APP is designed to act as a canonical source of truth for applicant data, enabling lossless export to existing formats such as ATS schemas, HR-XML, Europass, JSON Resume, and document-based formats (PDF, DOCX).

Key properties:
- Human-readable
- Machine-validatable (JSON Schema)
- AI-compatible (optional enrichment and semantic layers)
- Export-friendly and lossless
- Versioned and evolvable

---

## 2. Definitions

Normative keywords: MUST, SHOULD, MAY follow RFC 2119 semantics.

- Profile: A single APP document describing one applicant.
- Core Layer: The required data model for an APP profile.
- Enrichment Layer: Optional analytical data (e.g., confidence metrics).
- Semantic Layer: Optional JSON-LD overlay for linked data interoperability.
- Evidence Layer: Optional verifiable references to support claims.
- Export Layer: Derived representations (e.g., HR-XML, Europass, JSON Resume).

---

## 2.1 Namespace and Identifiers

The canonical namespace for the Applicant Profile Protocol (APP) is:

```
https://app-protocol.org/
```

All specifications, schemas, and extensions MUST use this namespace.

- Versioned spec URI: `https://app-protocol.org/spec/1.0`
- Schema URI: `https://app-protocol.org/schema/app-1.0.json`
- URN prefix: `urn:app-protocol:profile:<uuid>`

---

## 3. Design Goals

- JSON-first: Canonical representation is JSON.
- Layered Architecture: Core separated from enrichment, semantic, and evidence.
- Export-Oriented: Designed to convert cleanly into other standards.
- Non-Opinionated: No mandatory external taxonomy (ESCO, O*NET, etc.).
- AI-Ready: Confidence metrics, evidence, and embeddings supported.
- Versioned: Explicit protocol and schema versioning.

Non-goals:
- Replace ATS/HR systems
- Enforce a single skills taxonomy
- Define hiring or ranking logic
- Act as an identity/auth protocol (may integrate)

---

## 4. Protocol Architecture

Applicant Profile Protocol (APP)

- Core Layer (Required, stable)
- Enrichment Layer (Optional, analytical)
- Semantic Layer (Optional, JSON-LD)
- Evidence Layer (Optional, verifiable data)
- Export Layer (Derived representations)

Only the Core Layer is required for protocol compliance.

---

## 5. Core Layer (Required)

### 5.1 Top-Level Structure

```json
{
  "protocol": {
    "name": "ApplicantProfileProtocol",
    "version": "1.0.0",
    "id": "urn:app:person:<uuid>"
  },
  "basics": {},
  "experience": [],
  "education": [],
  "skills": [],
  "projects": [],
  "credentials": [],
  "languages": [],
  "preferences": {},
  "metadata": {},
  "semantic": {},
  "enrichment": {},
  "evidence": []
}
```

The JSON Schema for APP v1 is provided in `schema/app.schema.json`.

### 5.2 `basics`

```json
{
  "name": { "given": "First", "family": "Last", "middle": "Optional" },
  "headline": "Professional title",
  "summary": "Short professional summary (max 2000 chars)",
  "location": {
    "country": "US",
    "region": "Texas",
    "city": "Austin",
    "remote": true
  },
  "contact": {
    "email": "user@example.com",
    "phone": "+1-555-555-5555",
    "website": "https://example.com",
    "social": [
      { "label": "GitHub", "url": "https://github.com/username" },
      { "label": "LinkedIn", "url": "https://linkedin.com/in/username" }
    ]
  },
  "links": [
    { "label": "Portfolio", "url": "https://example.com/portfolio" }
  ]
}
```

### 5.3 `experience`

```json
{
  "role": "Job title",
  "organization": { "name": "Company name", "industry": "Technology" },
  "start": "YYYY-MM",
  "end": "YYYY-MM",
  "current": true,
  "location": { "country": "US", "region": "CA", "city": "San Francisco" },
  "employmentType": "Full-time",
  "highlights": ["Key achievement or responsibility"],
  "technologies": ["Technology or method used"],
  "metrics": { "teamSize": 8, "budgetUSD": 250000 },
  "links": [{ "label": "Case Study", "url": "https://example.com/case" }]
}
```

### 5.4 `education`

```json
{
  "institution": "University name",
  "area": "Field of study",
  "degree": "Degree or certification",
  "start": "YYYY",
  "end": "YYYY",
  "completed": true,
  "grade": "GPA or classification",
  "links": [{ "label": "Transcript", "url": "https://example.com/transcript" }]
}
```

### 5.5 `skills`

```json
{
  "name": "Skill name",
  "category": "ProgrammingLanguage | Framework | Library | Tool | CloudService | Platform | Datastore | Methodology | SoftSkill | Domain",
  "level": "Beginner | Intermediate | Advanced | Expert",
  "years": 5,
  "confidence": 0.85,
  "usage": { "lastUsed": "YYYY-MM", "contexts": ["Backend", "Frontend"] },
  "aliases": ["TS"],
  "evidenceRef": ["cred:aws-sa-2024"]
}
```

Notes:
- `confidence` is self-reported or computed (0.0–1.0).
- Exporters MAY ignore unsupported fields.

### 5.6 `projects`

```json
{
  "name": "Project name",
  "description": "Short description",
  "role": "Contributor role",
  "stack": ["Technologies used"],
  "links": {
    "website": "https://example.com",
    "repository": "https://github.com/example"
  },
  "highlights": ["Impact or result"]
}
```

### 5.7 `credentials`

```json
{
  "name": "Credential name",
  "issuer": "Issuing organization",
  "date": "YYYY-MM",
  "id": "Credential identifier (optional)",
  "url": "https://issuer.example/verify/123"
}
```

### 5.8 `languages`

```json
{
  "name": "Language name",
  "proficiency": "Basic | Conversational | Professional | Fluent | Native"
}
```

### 5.9 `preferences`

```json
{
  "employmentType": ["Full-time", "Contract"],
  "workMode": ["Remote", "Hybrid"],
  "relocation": false,
  "preferredLocations": ["US-CA", "US-TX"]
}
```

### 5.10 `metadata`

```json
{
  "created": "ISO-8601 timestamp",
  "updated": "ISO-8601 timestamp",
  "source": "SelfReported | Imported | Generated",
  "tags": ["keyword-1", "keyword-2"]
}
```

---

## 6. Enrichment Layer (Optional)

The enrichment layer adds analytical or AI-oriented data. Examples:
- Skill confidence computation
- Experience weighting
- Career trajectory metrics
- Embedding references (vector IDs or URIs)

This layer MUST NOT alter core semantics.

---

## 7. Semantic Layer (Optional)

APP supports JSON-LD for semantic interoperability.

Example:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Example Person",
  "knowsAbout": [
    { "@type": "DefinedTerm", "name": "TypeScript", "inDefinedTermSet": "ESCO" }
  ]
}
```

The semantic layer MAY reference:
- Schema.org
- ESCO
- O*NET
- Custom vocabularies

---

## 8. Evidence Layer (Optional)

Evidence provides verifiable backing for claims.

Examples:
- Certificates
- Signed documents
- URLs
- Hashes
- Verifiable Credentials (VCs)

Evidence items SHOULD include a `type`, `url` or `hash`, and optional `description`.

---

## 9. Export Layer

APP is designed to export into:
- JSON Resume
- HR-XML
- Europass XML
- ATS-specific schemas
- PDF / DOCX
- Markdown

Exporter guidance:
- Preserve meaning
- Gracefully degrade unsupported fields
- Avoid lossy round-trips
- APP JSON is the source of truth

---

## 10. Versioning

- Protocol versions follow Semantic Versioning (MAJOR.MINOR.PATCH).
- Breaking changes increment MAJOR.
- New optional fields increment MINOR.
- Fixes to schema or clarifications increment PATCH.

---

## 11. Security & Privacy Considerations

- APP does not mandate storage or transport mechanisms.
- Personally identifiable information (PII) MUST be handled by implementers.
- Encryption, signing, and access control are out of scope but recommended.
- Evidence layer MAY include cryptographic proofs and verifiable credentials.

---

## 12. Governance (Proposed)

- Open specification with public versioned repository.
- Community-driven extensions and proposals (APP Enhancement Proposals).
- Backward compatibility encouraged; clear deprecation pathways.

---

## 13. Future Extensions (Non-Normative)

- Cryptographic signing
- Verifiable credentials
- AI embedding registries
- Skill taxonomy bindings
- Real-time profile updates / streaming changes

---

## 14. Rationale and Notes

- The Core remains taxonomy-agnostic to maximize adoption.
- Semantic overlays accommodate ESCO/Schema.org without burdening general users.
- Confidence and enrichment are optional to avoid bias or misuse in basic implementations.
- Exporters act as bridges; APP remains the source of truth.

---

## 15. Examples

See `examples/minimal.json` and `examples/full.json`.

---

## 16. Changelog (Draft)

- 1.0.0 (Draft): Initial public draft with Core, optional layers, schema, and examples.
