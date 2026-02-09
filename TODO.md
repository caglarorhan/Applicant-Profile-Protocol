# APP Roadmap & TODO

**Last Updated:** January 26, 2026

## Pending

- [ ] **Register with SchemaStore** — Submit PR to [SchemaStore](https://github.com/SchemaStore/schemastore) for IDE autocomplete and validation support. File pattern: `*.app.json`.
- [ ] **Add real-world adoption examples** — Document companies/projects using APP
- [ ] **Create video tutorials** — Profile creation, validation, export workflows
- [ ] **Internationalization** — Support for non-English profiles
- [ ] **ATS integration guides** — Workday, Greenhouse, Lever connectors
- [ ] **PDF Extractor Enhancements**:
  - [ ] Implement true OCR (Tesseract.js integration)
  - [ ] Add machine learning entity extraction
  - [ ] Multi-language support for resumes
  - [ ] Advanced layout analysis for complex formats
  - [ ] Batch processing support
  - [ ] Browser extension version
  - [ ] Mobile app version

## Completed (v1.1.0 - Jan 2026)

- [x] **PDF Resume Extractor Tool** — New online tool for extracting APP profiles from PDF resumes
  - [x] PDF.js integration for text extraction
  - [x] Intelligent section detection (experience, education, skills, etc.)
  - [x] Entity recognition (contact info, skills, dates, degrees)
  - [x] Data normalization and APP mapping
  - [x] Schema validation with confidence scoring
  - [x] localStorage support for offline use
  - [x] Firebase/Firestore integration for cloud storage
  - [x] Profile sync between local and cloud
  - [x] Modular architecture (PDFProcessor + StorageManager)
- [x] Documentation: PDF-EXTRACTOR.md and FIREBASE-SETUP.md

## Completed (v1.0.1 - Jan 2026)

- [x] GitHub release v1.0.1 with release notes
- [x] Community files: CONTRIBUTING.md, CODE_OF_CONDUCT.md, CHANGELOG.md
- [x] GitHub issue templates and labels
- [x] Unified version management system
- [x] Standards comparison table on website
- [x] README improvements (Why APP, Who Should Use)
- [x] npm package published (npmjs.com + GitHub Packages)
- [x] GitHub CLI setup and authentication

## Completed (v1.0.0 - Jan 2025)

- [x] Core specification (SPEC.md)
- [x] JSON Schema v1.0
- [x] CLI validator and exporters
- [x] Export mappings: JSON Resume, Europass, HR-XML, JSON-LD
- [x] Railway deployment with HTTP server
- [x] HTML landing page and documentation
- [x] Namespace registration (app-protocol.org)
- [x] Online Tools:
  - [x] Profile Builder (form-based creation with localStorage save)
  - [x] JSON Validator (AJV-based schema validation)
  - [x] Format Converter (APP → JSON Resume, Europass, HR-XML, JSON-LD)
  - [x] Profile Importer (JSON Resume, Europass, HR-XML, LinkedIn → APP)
