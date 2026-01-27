# Contributing to Applicant Profile Protocol

Thank you for your interest in contributing to APP! 🎉

## How to Contribute

### 🐛 Reporting Bugs

1. Check [existing issues](https://github.com/caglarorhan/Applicant-Profile-Protocol/issues) first
2. Open a new issue using the **Bug Report** template
3. Include: expected behavior, actual behavior, steps to reproduce

### 💡 Suggesting Features

1. Open an issue using the **Feature Request** template
2. Describe the use case and proposed solution
3. Be open to discussion and iteration

### 🔧 Submitting Code

1. **Fork** the repository
2. **Create a branch** for your change:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** with clear, focused commits
4. **Test** your changes:
   ```bash
   npm run validate
   npm test
   ```
5. **Push** and open a **Pull Request**

### 📝 Documentation

Documentation improvements are always welcome! This includes:
- README enhancements
- SPEC.md clarifications
- Mapping guides in `docs/`
- Code comments and JSDoc

## Development Setup

```bash
# Clone the repo
git clone https://github.com/caglarorhan/Applicant-Profile-Protocol.git
cd Applicant-Profile-Protocol

# Install dependencies
npm install

# Run the server locally
npm start

# Validate example profiles
npm run validate
```

## Code Style

- Use **ES Modules** (`import`/`export`)
- Follow existing code patterns
- Add comments for complex logic
- Keep functions focused and small

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add LinkedIn import support
fix: correct XML encoding in Europass export
docs: update CLI usage examples
```

Prefixes: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

## Pull Request Guidelines

- Keep PRs focused on a single change
- Update documentation if needed
- Ensure all tests pass
- Be responsive to feedback

## Schema Changes

Changes to `schema/app.schema.json` require:
1. Update `SPEC.md` with field definitions
2. Update mapping docs if export behavior changes
3. Ensure backward compatibility when possible
4. Bump version appropriately

## Questions?

- Open a [Discussion](https://github.com/caglarorhan/Applicant-Profile-Protocol/discussions) for questions
- Use [Issues](https://github.com/caglarorhan/Applicant-Profile-Protocol/issues) for bugs/features

---

**Thank you for helping make APP better!** 💙
