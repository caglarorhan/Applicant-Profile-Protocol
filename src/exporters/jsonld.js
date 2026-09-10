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
  const phone = basics.contact?.phone;
  const url = basics.contact?.website;
  const social = (basics.contact?.social || []).map(link => link.url);

  const knowsAbout = (app.skills || []).map(sk => ({
    '@type': 'DefinedTerm',
    name: sk.name
  }));

  const credentials = (app.credentials || []).map(credential => ({
    '@type': 'EducationalOccupationalCredential',
    name: credential.name,
    recognizedBy: {
      '@type': 'Organization',
      name: credential.issuer
    },
    identifier: credential.id,
    url: credential.url
  }));

  const alumniOf = (app.education || []).map(education => ({
    '@type': 'EducationalOrganization',
    name: education.institution
  }));

  const educationCredentials = (app.education || []).map(education => ({
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'Degree',
    name: [education.degree, education.area].filter(Boolean).join(' in ') || education.institution,
    recognizedBy: {
      '@type': 'EducationalOrganization',
      name: education.institution
    }
  }));

  const worksFor = (app.experience || []).map(experience => {
    const organization = {
      '@type': 'Organization',
      name: experience.organization?.name,
      member: {
        '@type': 'OrganizationRole',
        roleName: experience.role,
        startDate: experience.start,
        description: (experience.highlights || []).join(' ')
      }
    };

    if (!experience.current && experience.end) {
      organization.member.endDate = experience.end;
    }

    return organization;
  });

  const hasCredential = [...credentials, ...educationCredentials];

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: basics.headline,
    description: basics.summary,
    email,
    telephone: phone,
    url,
    sameAs: social,
    address: basics.location ? {
      '@type': 'PostalAddress',
      addressLocality: basics.location.city,
      addressRegion: basics.location.region,
      addressCountry: basics.location.country
    } : undefined,
    knowsAbout,
    hasCredential,
    alumniOf,
    worksFor
  };

  return person;
}

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node src/exporters/jsonld.js <path/to/profile.app-profile.json>');
  process.exit(2);
}
const app = loadJSON(arg);
const out = toJSONLD(app);
process.stdout.write(JSON.stringify(out, null, 2));
