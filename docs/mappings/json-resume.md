# APP → JSON Resume Mapping

This guide describes how to export an APP profile to the JSON Resume schema.

References:
- JSON Resume schema: https://jsonresume.org/schema/

## Field Mapping

APP → JSON Resume

- `basics.name`: combine `given`, `middle?`, `family`
- `basics.email`: from `basics.contact.email`
- `basics.phone`: from `basics.contact.phone`
- `basics.website`: from `basics.contact.website`
- `basics.summary`: from `basics.summary`
- `basics.label`: from `basics.headline`
- `basics.location`: map `country`, `region`→`region`, `city`
- `basics.profiles[]`: from `basics.contact.social[]` → `{network,label?,url,username?}`

Work Experience
- APP `experience[]` → JSON Resume `work[]`
- `organization.name` → `name`
- `role` → `position`
- `location.city` → `location`
- `start` → `startDate` (YYYY-MM → YYYY-MM-01)
- `end|null` → `endDate` (omit if `current:true`)
- `highlights[]` → `highlights[]`
- `technologies[]` → `keywords[]`
- `links[]` → `url` (first link)

Education
- APP `education[]` → JSON Resume `education[]`
- `institution` → `institution`
- `area` → `area`
- `degree` → `studyType`
- `start` → `startDate`
- `end` → `endDate`
- `grade` → `score`

Skills
- APP `skills[]` → JSON Resume `skills[]`
- `name` → `name`
- `level` → `level`
- `aliases[]` + `technologies` from experience → `keywords[]`

Projects
- APP `projects[]` → JSON Resume `projects[]`
- `name`, `description`, `role` → `name`, `description`, `roles[]`
- `links.repository` → `url`
- `highlights[]` → `highlights[]`
- `stack[]` → `keywords[]`

Languages
- APP `languages[]` → JSON Resume `languages[]`
- `name` → `language`
- `proficiency` → `fluency`

## Degradation Rules
- Omit unsupported fields (`confidence`, `usage`, `evidenceRef`).
- Convert dates `YYYY-MM` to `YYYY-MM-01` where day is required.
- Keep `current:true` by omitting `endDate`.

## Example
See exporter implementation in `src/exporters/jsonresume.js`.
