# Applicant Profile Protocol (APP)

[![npm version](https://img.shields.io/npm/v/applicant-profile-protocol.svg)](https://www.npmjs.com/package/applicant-profile-protocol)
[![npm downloads](https://img.shields.io/npm/dm/applicant-profile-protocol.svg)](https://www.npmjs.com/package/applicant-profile-protocol)
[![GitHub Package](https://img.shields.io/badge/GitHub%20Packages-@caglarorhan/applicant--profile--protocol-blue?logo=github)](https://github.com/caglarorhan/Applicant-Profile-Protocol/packages)
[![License](https://img.shields.io/github/license/caglarorhan/Applicant-Profile-Protocol.svg)](https://github.com/caglarorhan/Applicant-Profile-Protocol/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/caglarorhan/Applicant-Profile-Protocol.svg)](https://github.com/caglarorhan/Applicant-Profile-Protocol/stargazers)

An open, JSON-based protocol for representing job applicant profiles in a structured, interoperable, and extensible manner.

🌐 **Website:** [app-protocol.org](https://app-protocol.org) | 📦 **npm:** [applicant-profile-protocol](https://www.npmjs.com/package/applicant-profile-protocol)

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

This repository contains the draft specification, JSON Schema, and examples for the Applicant Profile Protocol (APP).

## Contents

- `SPEC.md`: Full protocol specification (draft)
- `schema/app.schema.json`: JSON Schema (v1) for validating APP profiles
- `examples/minimal.json`: Minimal valid APP profile
- `examples/full.json`: Full featured example with semantic and evidence layers
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
