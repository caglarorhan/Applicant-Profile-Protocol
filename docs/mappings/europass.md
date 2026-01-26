# APP → Europass XML Mapping

This guide outlines how to export APP profiles into Europass CV XML.

References:
- Europass: https://europa.eu/europass/en
- ESCO (optional): https://ec.europa.eu/esco/portal

## Field Mapping (Core)

Personal Information
- APP `basics.name` → `<Identification><PersonName>`
- APP `basics.contact.email` → `<ContactInfo><Email>`
- APP `basics.location` → `<Identification><Address>`

Work Experience
- APP `experience[]` → `<WorkExperience>` entries
- `organization.name` → `<Employer>`
- `role` → `<Position>`
- `start`/`end` → `<Period><From>` / `<To>` (YYYY-MM)
- `highlights[]` → `<ActivitiesAndResponsibilities>` (concatenated)

Education and Training
- APP `education[]` → `<Education>` entries
- `institution` → `<Organisation>`
- `degree` → `<Title>`
- `area` → `<StudiesField>`
- `start`/`end` → `<Period>`

Skills
- APP `skills[]` → `<Skills>` group
- `name` → `<Skill>`
- `level` (if present) → attribute or text

Languages
- APP `languages[]` → `<Languages>` with `<Language>` entries

## Notes
- Europass XML expects specific element names; this exporter uses a minimal subset.
- ESCO bindings MAY be added via `<Skill>` attributes or separate sections.
- Unsupported APP fields (confidence, usage, evidence) are omitted.

## Example
See exporter implementation in `src/exporters/europass.js`.
