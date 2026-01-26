import fs from 'fs';
import path from 'path';

function loadJSON(p) {
  const abs = path.resolve(p);
  return JSON.parse(fs.readFileSync(abs, 'utf-8'));
}

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function yyyymm(ym) { return esc(ym || ''); }

function toHRXML(app) {
  const basics = app.basics || {};
  const name = basics.name || {};

  const skills = (app.skills || []).map(sk => `
      <Competency>
        <CompetencyName>${esc(sk.name)}</CompetencyName>
        ${sk.level ? `<CompetencyLevel>${esc(sk.level)}</CompetencyLevel>` : ''}
      </Competency>
  `).join('\n');

  const work = (app.experience || []).map(exp => `
      <EmployerOrg>
        <EmployerOrgName>${esc(exp.organization?.name)}</EmployerOrgName>
        <PositionHistory>
          <Title>${esc(exp.role)}</Title>
          <StartDate>${yyyymm(exp.start)}</StartDate>
          ${exp.current ? '' : `<EndDate>${yyyymm(exp.end)}</EndDate>`}
        </PositionHistory>
      </EmployerOrg>
  `).join('\n');

  const edu = (app.education || []).map(ed => `
      <SchoolOrInstitution>
        <SchoolName>${esc(ed.institution)}</SchoolName>
        <Degree>${esc(ed.degree || '')}</Degree>
        <Major>${esc(ed.area || '')}</Major>
        <DatesOfAttendance>
          <StartDate>${esc(ed.start || '')}</StartDate>
          <EndDate>${esc(ed.end || '')}</EndDate>
        </DatesOfAttendance>
      </SchoolOrInstitution>
  `).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Resume>
  <StructuredXMLResume>
    <ContactInfo>
      <PersonName>
        <GivenName>${esc(name.given)}</GivenName>
        <FamilyName>${esc(name.family)}</FamilyName>
      </PersonName>
    </ContactInfo>
    <EmploymentHistory>
${work}
    </EmploymentHistory>
    <EducationHistory>
${edu}
    </EducationHistory>
    <Competencies>
${skills}
    </Competencies>
  </StructuredXMLResume>
</Resume>`;
  return xml;
}

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node src/exporters/hrxml.js <path/to/app.json>');
  process.exit(2);
}
const app = loadJSON(arg);
const out = toHRXML(app);
process.stdout.write(out);
