# Changelog

All notable changes to the Applicant Profile Protocol will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-01-26

### Added
- Online tools (Profile Builder, Validator, Converter, Importer)
- GitHub Packages distribution (`@caglarorhan/applicant-profile-protocol`)
- GitHub issue templates (Bug Report, Feature Request, Design Questions, Getting Started)
- GitHub release v1.0.1 with release notes
- Community files: CONTRIBUTING.md, CODE_OF_CONDUCT.md
- Badge improvements (GitHub Packages, License badge fix)
- Installation instructions for both npm and GitHub Packages

### Changed
- Updated README with "Why APP Exists" and "Who Should Use This?" sections
- Improved documentation structure and beginner-friendliness
- Enhanced website with better CLI installation examples

### Fixed
- Server routing for `/tools/*` paths (404 issue resolved)
- CLI paths for global npm installation
- License badge now uses GitHub source instead of npm

## [1.0.0] - 2026-01-25

### Added
- Initial draft specification (SPEC.md)
- JSON Schema v1.0 (draft 2020-12)
- Example profiles (minimal and full)
- Export formats: JSON Resume, Europass XML, HR-XML, JSON-LD
- CLI tools for validation and export
- Mapping documentation for all export formats
- Apache 2.0 license
- Basic website with specification and schema

### Documentation
- Full protocol specification
- Semantic layer guidance (JSON-LD)
- Export mapping guides for:
  - JSON Resume
  - Europass XML
  - HR-XML
  - Schema.org / JSON-LD

---

## Future Releases

### Planned Features
- ATS-specific export formats
- Import validation tools
- Schema versioning system
- Community governance templates
- Multi-language support

---

[1.0.1]: https://github.com/caglarorhan/Applicant-Profile-Protocol/releases/tag/v1.0.1
[1.0.0]: https://github.com/caglarorhan/Applicant-Profile-Protocol/releases/tag/v1.0.0
