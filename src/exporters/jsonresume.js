import fs from 'fs';
import path from 'path';

function loadJSON(p) {
  const abs = path.resolve(p);
  return JSON.parse(fs.readFileSync(abs, 'utf-8'));
}

function yyyymmToDate(ym) {
  if (!ym) return undefined;
  if (/^\d{4}$/.test(ym)) return `${ym}-01-01`;
  return `${ym}-01`;
}

function toJSONResume(app) {
  const basics = app.basics || {};
  const name = basics.name ? [basics.name.given, basics.name.middle, basics.name.family].filter(Boolean).join(' ') : undefined;
  const profiles = (basics.contact?.social || []).map(s => ({ network: s.label, url: s.url }));

  const work = (app.experience || []).map(exp => ({
    name: exp.organization?.name,
    position: exp.role,
    location: exp.location?.city,
    startDate: yyyymmToDate(exp.start),
    endDate: exp.current ? undefined : yyyymmToDate(exp.end),
    highlights: exp.highlights || [],
    keywords: exp.technologies || [],
    url: (exp.links || [])[0]?.url
  }));

  const education = (app.education || []).map(ed => ({
    institution: ed.institution,
    area: ed.area,
    studyType: ed.degree,
    startDate: yyyymmToDate(ed.start),
    endDate: yyyymmToDate(ed.end),
    score: ed.grade
  }));

  const experienceTechnologies = (app.experience || []).flatMap(exp => exp.technologies || []);
  const skills = (app.skills || []).map(skill => {
    const aliases = skill.aliases || [];
    const skillNames = [skill.name, ...aliases].map(value => value.toLowerCase());
    const matchingTechnologies = experienceTechnologies.filter(technology =>
      skillNames.includes(technology.toLowerCase())
    );

    return {
      name: skill.name,
      level: skill.level,
      keywords: [...new Set([...aliases, ...matchingTechnologies])]
    };
  });

  const projects = (app.projects || []).map(pr => ({
    name: pr.name,
    description: pr.description,
    roles: pr.role ? [pr.role] : undefined,
    keywords: pr.stack || [],
    url: pr.links?.repository,
    highlights: pr.highlights || []
  }));

  const languages = (app.languages || []).map(l => ({ language: l.name, fluency: l.proficiency }));

  const out = {
    $schema: 'https://jsonresume.org/schema',
    basics: {
      name,
      label: basics.headline,
      email: basics.contact?.email,
      phone: basics.contact?.phone,
      website: basics.contact?.website,
      summary: basics.summary,
      location: { countryCode: basics.location?.country, region: basics.location?.region, city: basics.location?.city },
      profiles
    },
    work,
    education,
    skills,
    projects,
    languages
  };
  return out;
}

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node src/exporters/jsonresume.js <path/to/profile.app-profile.json>');
  process.exit(2);
}
const app = loadJSON(arg);
const out = toJSONResume(app);
process.stdout.write(JSON.stringify(out, null, 2));
