import fs from 'fs';
import path from 'path';

function loadJSON(p) {
  const abs = path.resolve(p);
  return JSON.parse(fs.readFileSync(abs, 'utf-8'));
}

function toJSONLD(app) {
  const basics = app.basics || {};
  const name = basics.name ? [basics.name.given, basics.name.middle, basics.name.family].filter(Boolean).join(' ') : undefined;
  const email = basics.contact?.email;
  const url = basics.contact?.website;

  const knowsAbout = (app.skills || []).map(sk => ({
    '@type': 'DefinedTerm',
    name: sk.name
  }));

  const hasCredential = (app.credentials || []).map(cr => ({
    '@type': 'EducationalOccupationalCredential',
    name: cr.name,
    issuer: cr.issuer,
    identifier: cr.id,
    url: cr.url
  }));

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    email,
    url,
    knowsAbout,
    hasCredential
  };

  return person;
}

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node src/exporters/jsonld.js <path/to/app.json>');
  process.exit(2);
}
const app = loadJSON(arg);
const out = toJSONLD(app);
process.stdout.write(JSON.stringify(out, null, 2));
