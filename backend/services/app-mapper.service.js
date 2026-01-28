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
      name: contact.name || extractedData.name || '',
      email: contact.email || extractedData.email || '',
      phone: contact.phone || extractedData.phone || '',
      url: contact.website || contact.LinkedIn || contact.linkedin || extractedData.website || extractedData.linkedin || '',
      summary: contact.summary || extractedData.summary || '',
      location: (contact.location || extractedData.location) ? {
        address: (contact.location?.address || extractedData.location?.address || contact.location || extractedData.location),
        city: contact.location?.city || extractedData.location?.city,
        region: contact.location?.region || contact.location?.state || extractedData.location?.region || extractedData.location?.state,
        postalCode: contact.location?.postalCode || extractedData.location?.postalCode,
        countryCode: contact.location?.countryCode || extractedData.location?.countryCode || 'US'
      } : undefined,
      profiles: []
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
    profile.basics.profiles.push({
      network: 'LinkedIn',
      url: linkedin,
      username: extractUsernameFromURL(linkedin, 'linkedin')
    });
  }
  if (github) {
    profile.basics.profiles.push({
      network: 'GitHub',
      url: github,
      username: extractUsernameFromURL(github, 'github')
    });
  }

  // Map work experience
  if (workExp && Array.isArray(workExp)) {
    profile.experience = workExp.map(exp => ({
      title: exp.title || exp.position || exp.jobTitle || '',
      company: exp.company || exp.organization || exp.employer || '',
      location: exp.location || '',
      startDate: normalizeDate(exp.startDate),
      endDate: normalizeDate(exp.endDate) || (exp.current ? 'Present' : ''),
      summary: exp.description || exp.summary || exp.responsibilities || '',
      highlights: exp.highlights || exp.achievements || [],
      keywords: exp.skills || []
    }));
  }

  // Map education
  if (extractedData.education && Array.isArray(extractedData.education)) {
    profile.education = extractedData.education.map(edu => ({
      institution: edu.institution || edu.school || '',
      studyType: edu.degree || edu.studyType || '',
      area: edu.field || edu.major || edu.area || '',
      startDate: normalizeDate(edu.startDate),
      endDate: normalizeDate(edu.endDate) || (edu.graduated ? normalizeDate(edu.graduationDate) : ''),
      score: edu.gpa || edu.score || '',
      courses: edu.courses || [],
      honors: edu.honors || []
    }));
  }

  // Map skills
  if (extractedData.skills) {
    if (Array.isArray(extractedData.skills)) {
      profile.skills = extractedData.skills.map(skill => ({
        name: typeof skill === 'string' ? skill : skill.name,
        level: skill.level || 'intermediate',
        keywords: [typeof skill === 'string' ? skill : skill.name]
      }));
    } else if (typeof extractedData.skills === 'object') {
      // Skills categorized by type
      for (const [category, skillList] of Object.entries(extractedData.skills)) {
        if (Array.isArray(skillList)) {
          skillList.forEach(skill => {
            profile.skills.push({
              name: skill,
              level: 'intermediate',
              keywords: [skill],
              category: category
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
      url: proj.url || proj.link || '',
      startDate: normalizeDate(proj.startDate),
      endDate: normalizeDate(proj.endDate),
      highlights: proj.highlights || [],
      keywords: proj.technologies || proj.skills || []
    }));
  }

  // Map certifications
  if (extractedData.certifications && Array.isArray(extractedData.certifications)) {
    profile.credentials = extractedData.certifications.map(cert => ({
      type: 'certification',
      name: cert.name || cert.title || '',
      issuer: cert.issuer || cert.organization || '',
      date: normalizeDate(cert.date) || normalizeDate(cert.issueDate),
      url: cert.url || cert.verificationUrl || ''
    }));
  }

  // Map languages
  if (extractedData.languages && Array.isArray(extractedData.languages)) {
    profile.languages = extractedData.languages.map(lang => ({
      language: typeof lang === 'string' ? lang : lang.name || lang.language,
      fluency: lang.fluency || lang.level || 'professional'
    }));
  }

  // Remove undefined fields
  Object.keys(profile).forEach(key => {
    if (profile[key] === undefined) {
      delete profile[key];
    }
  });

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
