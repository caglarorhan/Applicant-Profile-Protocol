# APP → HR-XML Mapping

This guide outlines how to export APP profiles into a simplified HR-XML Resume.

References:
- HR-XML / OASIS: https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=hr-xml

## Field Mapping (Simplified)

Resume root
- `<Resume>` is the root element.

Person Name
- APP `basics.name` → `<PersonName><GivenName>` / `<FamilyName>`

Competencies / Skills
- APP `skills[]` → `<Competencies><Competency>`
- `name` → `<CompetencyName>`
- `level` → `<CompetencyLevel>`

Employment History
- APP `experience[]` → `<EmploymentHistory><EmployerOrg>`
- `organization.name` → `<EmployerOrgName>`
- `role` → `<PositionHistory><Title>`
- `start` → `<StartDate>`
- `end` → `<EndDate>` (omit if current)

Education History
- APP `education[]` → `<EducationHistory><SchoolOrInstitution>`
- `institution` → `<SchoolName>`
- `degree` → `<Degree>`
- `area` → `<Major>`

## Notes
- HR-XML is broad; this mapping targets a minimal subset.
- Unsupported APP fields are omitted.

## Example
See exporter implementation in `src/exporters/hrxml.js`.
