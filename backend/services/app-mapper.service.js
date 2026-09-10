import { v4 as uuidv4 } from 'uuid';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load APP schema
const schemaPath = join(__dirname, '../../schema/app.schema.json');
const appSchema = JSON.parse(readFileSync(schemaPath, 'utf-8'));

// Remove $schema property to avoid AJV validation issues
delete appSchema.$schema;

// Initialize AJV with proper configuration
const ajv = new Ajv({ 
  allErrors: true,
  strict: false,
  validateFormats: true
});
addFormats(ajv);

const validate = ajv.compile(appSchema);

/**
 * Map extracted data to APP format
 */
export function mapToAPP(extractedData, userId) {
  // Handle nested contactInformation if present
  const contact = extractedData.contactInformation || extractedData;
  const workExp = extractedData.workExperience || extractedData.experience;
  
  const profile = {
    protocol: {
      name: 'ApplicantProfileProtocol',
      shortName: 'APP',
      version: '1.0.0',
      uri: 'https://app-protocol.org',
      id: uuidv4()
    },
    basics: {
      name: toPersonName(contact.name || extractedData.name),
      headline: contact.headline || extractedData.headline,
      summary: contact.summary || extractedData.summary,
      contact: {
        email: contact.email || extractedData.email,
        phone: contact.phone || extractedData.phone,
        website: contact.website || extractedData.website,
        social: []
      },
      location: (contact.location || extractedData.location) ? {
        city: contact.location?.city || extractedData.location?.city,
        region: contact.location?.region || contact.location?.state || extractedData.location?.region || extractedData.location?.state,
        country: contact.location?.country || contact.location?.countryCode || extractedData.location?.country || extractedData.location?.countryCode
      } : undefined,
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    credentials: [],
    languages: [],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'pdf-extractor',
      version: '1.0.0',
      userId: userId
    }
  };

  // Map social profiles
  const linkedin = contact.LinkedIn || contact.linkedin || extractedData.linkedin;
  const github = contact.GitHub || contact.github || extractedData.github;
  
  if (linkedin) {
    profile.basics.contact.social.push({
      label: 'LinkedIn',
      url: linkedin,
    });
  }
  if (github) {
    profile.basics.contact.social.push({
      label: 'GitHub',
      url: github,
    });
  }

  // Map work experience
  if (workExp && Array.isArray(workExp)) {
    profile.experience = workExp.map(exp => {
      const mapped = {
        role: exp.title || exp.position || exp.jobTitle || exp.role,
        organization: { name: getOrganizationName(exp.company || exp.organization || exp.employer) },
        start: normalizeYearMonth(exp.startDate || exp.start),
        current: Boolean(exp.current),
        highlights: exp.highlights || exp.achievements || [],
        technologies: exp.technologies || exp.skills || []
      };

      const location = toLocation(exp.location);
      if (location) mapped.location = location;
      if (!mapped.current && (exp.endDate || exp.end)) mapped.end = normalizeYearMonth(exp.endDate || exp.end);
      if (exp.employmentType) mapped.employmentType = exp.employmentType;
      return removeUndefined(mapped);
    });
  }

  // Map education
  if (extractedData.education && Array.isArray(extractedData.education)) {
    profile.education = extractedData.education.map(edu => ({
      institution: edu.institution || edu.school || '',
      degree: edu.degree || edu.studyType,
      area: edu.field || edu.major || edu.area || '',
      start: normalizeYear(edu.startDate || edu.start),
      end: normalizeYear(edu.endDate || edu.end || (edu.graduated ? edu.graduationDate : undefined)),
      grade: edu.gpa || edu.score
    })).map(removeUndefined);
  }

  // Map skills
  if (extractedData.skills) {
    if (Array.isArray(extractedData.skills)) {
      profile.skills = extractedData.skills.map(skill => ({
        name: typeof skill === 'string' ? skill : skill.name,
        level: normalizeSkillLevel(typeof skill === 'string' ? undefined : skill.level),
        aliases: typeof skill === 'string' ? undefined : skill.aliases
      }));
    } else if (typeof extractedData.skills === 'object') {
      // Skills categorized by type
      for (const [category, skillList] of Object.entries(extractedData.skills)) {
        if (Array.isArray(skillList)) {
          skillList.forEach(skill => {
            profile.skills.push({
              name: skill,
              level: 'Intermediate'
            });
          });
        }
      }
    }
  }

  // Map projects
  if (extractedData.projects && Array.isArray(extractedData.projects)) {
    profile.projects = extractedData.projects.map(proj => ({
      name: proj.name || proj.title || '',
      description: proj.description || '',
      links: (proj.url || proj.link) ? { website: proj.url || proj.link } : undefined,
      stack: proj.technologies || proj.skills || [],
      highlights: proj.highlights || [],
    })).map(removeUndefined);
  }

  // Map certifications
  if (extractedData.certifications && Array.isArray(extractedData.certifications)) {
    profile.credentials = extractedData.certifications.map(cert => ({
      name: cert.name || cert.title || '',
      issuer: cert.issuer || cert.organization || '',
      date: normalizeYearMonth(cert.date || cert.issueDate),
      id: cert.id,
      url: cert.url || cert.verificationUrl || ''
    })).map(removeUndefined);
  }

  // Map languages
  if (extractedData.languages && Array.isArray(extractedData.languages)) {
    profile.languages = extractedData.languages.map(lang => ({
      name: typeof lang === 'string' ? lang : lang.name || lang.language,
      proficiency: normalizeProficiency(typeof lang === 'string' ? undefined : lang.proficiency || lang.fluency || lang.level)
    })).map(removeUndefined);
  }

  // Remove undefined fields
  profile.basics = removeUndefined(profile.basics);
  profile.basics.contact = removeUndefined(profile.basics.contact);
  profile.metadata = { created: profile.metadata.createdAt, updated: profile.metadata.updatedAt, source: 'Generated' };

  return profile;
}

/**
 * Validate APP profile against schema
 */
export function validateAPP(profile) {
  const valid = validate(profile);
  
  return {
    valid: valid,
    errors: validate.errors || []
  };
}

/**
 * Normalize date formats
 */
function normalizeDate(dateStr) {
  if (!dateStr) return '';
  
  // Handle "Present" or "Current"
  if (/present|current/i.test(dateStr)) {
    return 'Present';
  }

  // Try to parse and format as YYYY-MM-DD
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (e) {
    // Return as-is if can't parse
  }

  return dateStr;
}

function normalizeYearMonth(value) {
  if (!value || /present|current/i.test(value)) return undefined;
  const text = String(value);
  const monthNames = {
    january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
  };
  const namedMonth = text.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i);
  if (namedMonth) return `${namedMonth[2]}-${monthNames[namedMonth[1].toLowerCase()]}`;

  const match = text.match(/(\d{4})[-/]?(\d{1,2})?/);
  if (!match) return undefined;
  return `${match[1]}-${String(match[2] || '01').padStart(2, '0')}`;
}

function normalizeYear(value) {
  if (!value || /present|current/i.test(value)) return undefined;
  const match = String(value).match(/\d{4}/);
  return match ? match[0] : undefined;
}

function toPersonName(value) {
  const name = String(value || '').trim().split(/\s+/).filter(Boolean);
  return {
    given: name.shift() || 'Unknown',
    family: name.pop() || name[0] || 'Applicant',
    ...(name.length ? { middle: name.join(' ') } : {})
  };
}

function toLocation(value) {
  if (!value) return undefined;
  if (typeof value === 'object') return removeUndefined({
    country: value.country || value.countryCode,
    region: value.region || value.state,
    city: value.city
  });
  const parts = String(value).split(',').map(part => part.trim()).filter(Boolean);
  return removeUndefined({ city: parts[0], region: parts[1], country: parts[2] });
}

function getOrganizationName(value) {
  return typeof value === 'object' ? value.name || '' : value || '';
}

function normalizeSkillLevel(value) {
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  return levels.find(level => level.toLowerCase() === String(value || '').toLowerCase()) || 'Intermediate';
}

function normalizeProficiency(value) {
  const levels = ['Basic', 'Conversational', 'Professional', 'Fluent', 'Native'];
  return levels.find(level => level.toLowerCase() === String(value || '').toLowerCase()) || 'Professional';
}

function removeUndefined(value) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== ''));
}

/**
 * Extract username from social media URL
 */
function extractUsernameFromURL(url, platform) {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    if (platform === 'linkedin') {
      const match = pathname.match(/\/in\/([^\/]+)/);
      return match ? match[1] : '';
    } else if (platform === 'github') {
      const parts = pathname.split('/').filter(p => p);
      return parts[0] || '';
    }
  } catch (e) {
    return '';
  }
  
  return '';
}
