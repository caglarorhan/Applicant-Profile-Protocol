# Semantic Layer (JSON-LD)

This document describes how to attach an optional JSON-LD semantic layer to an APP profile for interoperability with linked data ecosystems (Schema.org, ESCO, O*NET).

## Purpose
- Enable search/AI systems to consume applicant profiles as linked data.
- Preserve APP as the source of truth; semantic is an overlay.

## Placement
APP reserves the top-level field `semantic` for the JSON-LD object:

```json
{
  "semantic": {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Example Person"
  }
}
```

## Recommended Schema.org Types
- Person: core identity (`name`, `email`, `url`)
- Organization (for employers in experience): `worksFor`
- EducationalOccupationalCredential: degrees, certificates (`hasCredential`)
- DefinedTerm: skills referencing taxonomies (`knowsAbout`)

## Example (Person + Skills)
```json
{
  "semantic": {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Caglar Orhan",
    "knowsAbout": [
      { "@type": "DefinedTerm", "name": "TypeScript", "inDefinedTermSet": "ESCO" },
      { "@type": "DefinedTerm", "name": "Next.js" }
    ],
    "hasCredential": [
      { "@type": "EducationalOccupationalCredential", "name": "AWS SAA" }
    ]
  }
}
```

## Mapping Guidance
- Basics → Person fields: `name`, `email`, `url`
- Skills → `knowsAbout` entries; optionally use `DefinedTerm`
- Credentials → `hasCredential` with `EducationalOccupationalCredential`
- Experience → Consider `Role` and `Organization`; minimal mapping is acceptable

## Validation
- JSON-LD is not validated by the APP JSON Schema.
- Use JSON-LD tooling (e.g., RDF libraries) if needed; otherwise basic structural checks suffice.

## Export
A helper exporter is provided at `src/exporters/jsonld.js` to generate a minimal JSON-LD overlay from APP basics, skills, and credentials.
