# v1.0.1 - Initial Public Release

🎉 **First official release of the Applicant Profile Protocol (APP)**

An open, JSON-based protocol for representing job applicant profiles in a structured, interoperable, and extensible manner.

## ✨ Features

### Core Protocol
- **JSON Schema v1.0** - Complete schema for validating APP profiles (draft 2020-12)
- **Full Specification** - Detailed protocol documentation covering all fields and design decisions

### 🛠️ Online Tools
Browser-based tools at [app-protocol.org](https://app-protocol.org) — no installation required:
- **Profile Builder** — Create APP profiles with an intuitive form interface (auto-saves to localStorage)
- **Validator** — Validate JSON against the official schema with detailed error messages
- **Converter** — Export to JSON Resume, Europass XML, HR-XML, or JSON-LD
- **Importer** — Import from JSON Resume, Europass, HR-XML, or LinkedIn formats

### 💻 CLI Tools
```bash
npm install -g applicant-profile-protocol

app validate profile.json
app export:jsonresume profile.json > resume.json
app export:europass profile.json > europass.xml
app export:hrxml profile.json > hrxml.xml
app export:jsonld profile.json > profile.jsonld
```

### 📄 Export Formats
- ✅ JSON Resume
- ✅ Europass XML (EU standard)
- ✅ HR-XML (Enterprise standard)
- ✅ JSON-LD (Schema.org semantic data)

## 📦 Installation

### From npm
```bash
npm install -g applicant-profile-protocol
```

### From GitHub Packages
```bash
npm config set @caglarorhan:registry https://npm.pkg.github.com
npm install -g @caglarorhan/applicant-profile-protocol
```

## 🔗 Links

- **Website:** https://app-protocol.org
- **npm:** https://www.npmjs.com/package/applicant-profile-protocol
- **GitHub Packages:** https://github.com/caglarorhan/Applicant-Profile-Protocol/packages
- **Specification:** https://app-protocol.org/spec/1.0
- **Schema:** https://app-protocol.org/schema/app-1.0.json

## 📝 License

Apache 2.0
