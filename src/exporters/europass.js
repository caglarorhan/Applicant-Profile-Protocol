import fs from 'fs';
import path from 'path';

function loadJSON(p) {
  const abs = path.resolve(p);
  return JSON.parse(fs.readFileSync(abs, 'utf-8'));
}

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function toEuropassXML(app) {
  const basics = app.basics || {};
  const name = basics.name || {};
  const contact = basics.contact || {};
  const loc = basics.location || {};

  const work = (app.experience || []).map(exp => `
    <WorkExperience>
      <Employer>${esc(exp.organization?.name)}</Employer>
      <Position>${esc(exp.role)}</Position>
      <Period>
        <From>${esc(exp.start)}</From>
        ${exp.current ? '' : `<To>${esc(exp.end || '')}</To>`}
      </Period>
      <ActivitiesAndResponsibilities>${esc((exp.highlights || []).join('; '))}</ActivitiesAndResponsibilities>
    </WorkExperience>
  `).join('\n');

  const edu = (app.education || []).map(ed => `
    <Education>
      <Organisation>${esc(ed.institution)}</Organisation>
      <Title>${esc(ed.degree)}</Title>
      <StudiesField>${esc(ed.area)}</StudiesField>
      <Period><From>${esc(ed.start)}</From><To>${esc(ed.end)}</To></Period>
    </Education>
  `).join('\n');

  const languages = (app.languages || []).map(l => `
    <Language>
      <Name>${esc(l.name)}</Name>
      <Level>${esc(l.proficiency)}</Level>
    </Language>
  `).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<EuropassCV>
  <Identification>
    <PersonName>
      <FirstName>${esc(name.given)}</FirstName>
      <LastName>${esc(name.family)}</LastName>
    </PersonName>
    <Address>
      <Country>${esc(loc.country || '')}</Country>
      <Region>${esc(loc.region || '')}</Region>
      <City>${esc(loc.city || '')}</City>
    </Address>
    <ContactInfo>
      <Email>${esc(contact.email || '')}</Email>
      <Phone>${esc(contact.phone || '')}</Phone>
      <Website>${esc(contact.website || '')}</Website>
    </ContactInfo>
  </Identification>
  <WorkExperiences>
    ${work}
  </WorkExperiences>
  <Educations>
    ${edu}
  </Educations>
  <Languages>
    ${languages}
  </Languages>
</EuropassCV>`;
  return xml;
}

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node src/exporters/europass.js <path/to/app.json>');
  process.exit(2);
}
const app = loadJSON(arg);
const out = toEuropassXML(app);
process.stdout.write(out);
