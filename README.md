# Applicant Profile Protocol (APP)

[![npm version](https://img.shields.io/npm/v/applicant-profile-protocol.svg)](https://www.npmjs.com/package/applicant-profile-protocol)
[![npm downloads](https://img.shields.io/npm/dm/applicant-profile-protocol.svg)](https://www.npmjs.com/package/applicant-profile-protocol)
[![GitHub Package](https://img.shields.io/badge/GitHub%20Packages-@caglarorhan/applicant--profile--protocol-blue?logo=github)](https://github.com/caglarorhan/Applicant-Profile-Protocol/packages)
[![License](https://img.shields.io/github/license/caglarorhan/Applicant-Profile-Protocol.svg)](https://github.com/caglarorhan/Applicant-Profile-Protocol/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/caglarorhan/Applicant-Profile-Protocol.svg)](https://github.com/caglarorhan/Applicant-Profile-Protocol/stargazers)

An open, JSON-based protocol for representing job applicant profiles in a structured, interoperable, and extensible manner.

🌐 **Website:** [app-protocol.org](https://app-protocol.org) | 📦 **npm:** [applicant-profile-protocol](https://www.npmjs.com/package/applicant-profile-protocol)

---

## 🤔 Why APP Exists

There are many competing applicant profile formats — **JSON Resume**, **Europass**, **HR-XML**, and countless proprietary ATS schemas. Each has limitations:

- **JSON Resume** — Developer-friendly but limited scope. No confidence metrics or verification.
- **Europass** — EU-focused, not globally adopted. Tied to government infrastructure.
- **HR-XML** — Enterprise-grade but heavyweight XML. Complex to implement.
- **ATS Vendors** — Proprietary, fragmented. No interoperability between systems.

**APP unifies these** into a single JSON protocol that is:
- ✅ **Interoperable** — Export to all major formats
- ✅ **Machine-readable** — JSON Schema validation, AI-ready
- ✅ **Extensible** — Layered architecture (core + enrichment + evidence)
- ✅ **Open** — Community-governed, Apache 2.0 license

---

## 👥 Who Should Use This?

| Use Case | APP Helps You... |
|----------|------------------|
| **HR Tech Companies** | Build interoperable applicant systems |
| **ATS/CRM Developers** | Import/export profiles across platforms |
| **Job Boards** | Standardize applicant data formats |
| **AI/ML Engineers** | Access structured data with confidence scores |
| **Career Platforms** | Give users portable, verifiable profiles |
| **Individual Developers** | Create validated, schema-compliant resumes |

---

## Installation

### From npm (recommended)

```bash
# Install globally for CLI usage
npm install -g applicant-profile-protocol

# Or install locally in your project
npm install applicant-profile-protocol
```

### From GitHub Packages

```bash
# Configure npm to use GitHub Packages for @caglarorhan scope
npm config set @caglarorhan:registry https://npm.pkg.github.com

# Install globally
npm install -g @caglarorhan/applicant-profile-protocol

# Or locally
npm install @caglarorhan/applicant-profile-protocol
```

## Quick Start

```bash
# Validate an APP profile
app validate your-profile.json

# Export to JSON Resume format
app export:jsonresume your-profile.json > resume.json

# Export to Europass XML
app export:europass your-profile.json > europass.xml

# Export to HR-XML
app export:hrxml your-profile.json > hrxml.xml

# Export to JSON-LD (Schema.org)
app export:jsonld your-profile.json > profile.jsonld
```

## Contents

This repository contains the specification, JSON Schema, validation tools, and examples for the Applicant Profile Protocol (APP).

### Core Files
- `SPEC.md`: Full protocol specification
- `schema/app.schema.json`: JSON Schema (v1.0) for validating APP profiles
- `CHANGELOG.md`: Version history and release notes

### Examples
- `examples/minimal.json`: Minimal valid APP profile
- `examples/full.json`: Full featured example with semantic and evidence layers
- **[docs/EXAMPLES.md](docs/EXAMPLES.md)**: 10 detailed real-world examples across industries (Software Engineer, Nurse, Marketing Manager, Data Scientist, Mechanical Engineer, UX Designer, Financial Analyst, Sales Rep, Teacher, Recent Graduate)

### Documentation
- `docs/mappings/`: Export mapping guides for JSON Resume, Europass, HR-XML
- `docs/semantic/json-ld.md`: Guidance for the optional JSON-LD semantic layer
- `src/`: Validator and exporters (Node.js)
- `public/tools/`: Online tools for creating, validating, and converting profiles

## Validate an APP Profile

You can validate APP JSON using common validators.

### Node.js (Ajv)

```bash
npm init -y
npm install ajv@8 ajv-formats
node -e "const Ajv=require('ajv');const addFormats=require('ajv-formats');const fs=require('fs');const schema=JSON.parse(fs.readFileSync('schema/app.schema.json'));const data=JSON.parse(fs.readFileSync('examples/full.json'));const ajv=new Ajv({allErrors:true});addFormats(ajv);const validate=ajv.compile(schema);console.log(validate(data)?'valid':'invalid',validate.errors||'');"
```

### Python (jsonschema)

```bash
pip install jsonschema
python - << 'PY'
import json
from jsonschema import validate, Draft202012Validator
schema = json.load(open('schema/app.schema.json'))
instance = json.load(open('examples/full.json'))
Draft202012Validator.check_schema(schema)
validate(instance=instance, schema=schema)
print('valid')
PY
```

## Online Tools

Use the browser-based tools at [app-protocol.org](https://app-protocol.org) — no installation required:

- **[Profile Builder](https://app-protocol.org/tools/builder.html)** — Create APP profiles using an intuitive form interface. Saves drafts to localStorage.
- **[Validator](https://app-protocol.org/tools/validator.html)** — Validate your APP JSON against the official schema with detailed error messages.
- **[Converter](https://app-protocol.org/tools/converter.html)** — Export APP profiles to JSON Resume, Europass XML, HR-XML, or JSON-LD.
- **[Importer](https://app-protocol.org/tools/importer.html)** — Import existing profiles from JSON Resume, Europass, HR-XML, or LinkedIn formats.
- **[PDF Extractor](https://app-protocol.org/tools/pdf-extractor-backend.html)** — **NEW!** AI-powered PDF resume extraction with OpenAI GPT-4 and Google Vision OCR. Achieves 90-95% accuracy.

## 🆕 AI-Powered PDF Extraction

We've added a powerful backend service that extracts resume data from PDF files using AI:

### Features

- **AI Entity Extraction** — OpenAI GPT-4 intelligently extracts contact info, experience, education, skills, projects, certifications, and more
- **OCR Support** — Google Cloud Vision automatically detects and processes scanned PDFs
- **High Accuracy** — 90-95% extraction accuracy vs 60-75% with pattern matching
- **Async Processing** — Bull queue with Redis handles large files efficiently
- **Secure Storage** — Firebase Storage + Firestore for authenticated users
- **Real-time Status** — Poll API for processing progress with detailed stages

### Quick Start

1. Set up the backend (see [backend/QUICKSTART.md](backend/QUICKSTART.md))
2. Configure Firebase, OpenAI, and Google Cloud credentials
3. Start server: `cd backend && npm run dev`
4. Open `public/tools/pdf-extractor-backend.html` in your browser
5. Sign in and upload a PDF resume

### Architecture

```
PDF Upload → Text Extraction → OCR (if needed) → AI Extraction (GPT-4) 
  → APP Mapping → Schema Validation → Confidence Scoring → Firestore
```

**Processing Time:** 5-30 seconds depending on PDF complexity

**Cost:** ~$0.01 per resume (OpenAI) + ~$0.0015 per page (Vision API)

### Documentation

- [Backend Setup Guide](backend/README.md) — Detailed configuration
- [Quick Start](backend/QUICKSTART.md) — Get running in 5 minutes
- [API Documentation](backend/API-DOCS.md) — Full API reference
- [Docker Setup](backend/docker-compose.yml) — Container deployment

## CLI Usage (Node)

Install dependencies and run the CLI:

```bash
npm install
npx app validate examples/full.json
npx app export:jsonresume examples/full.json > dist/full.jsonresume.json
npx app export:europass examples/full.json > dist/full.europass.xml
npx app export:hrxml examples/full.json > dist/full.hrxml.xml
```

Or via npm scripts:

```bash
npm run validate
npm run export:jsonresume
npm run export:europass
npm run export:hrxml
npm run export:jsonld
```

## Exporters

Export APP profiles to other formats:
- ✅ JSON Resume (implemented)
- ✅ Europass XML (implemented)
- ✅ HR-XML (implemented)
- ✅ JSON-LD / Schema.org (implemented)
- 🔜 ATS-specific payloads (planned)

## Versioning

- Protocol uses Semantic Versioning.
- See `SPEC.md` for versioning policy.

## License

[Apache 2.0](LICENSE) — Open source, free to use and modify.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Governance (Draft)

Open specification, community proposals, and backward compatibility encouraged.
