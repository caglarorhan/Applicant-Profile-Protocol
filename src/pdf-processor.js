/**
 * PDF Resume Processor
 * Advanced text extraction and entity recognition for resume PDFs
 */

class PDFProcessor {
  constructor() {
    this.nlpPatterns = this.initializePatterns();
  }

  /**
   * Initialize NLP patterns for entity extraction
   */
  initializePatterns() {
    return {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
      phone: /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/g,
      url: /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/gi,
      date: /(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4})|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4})|(?:\d{4}(?:\s*-\s*\d{4})?)|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*-\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})|(?:present|current)/gi,
      linkedin: /(?:linkedin\.com\/in\/|linkedin\.com\/profile\/view\?id=)[\w-]+/gi,
      github: /(?:github\.com\/)[\w-]+/gi,
      degree: /\b(?:PhD|Ph\.D\.|Doctorate|Masters?|M\.S\.|M\.A\.|MBA|Bachelor'?s?|B\.S\.|B\.A\.|B\.Sc\.|Associate|A\.S\.|Diploma|Certificate)\b/gi,
      
      // Section headers
      sections: {
        experience: /\b(?:work\s+)?(?:experience|employment|work\s+history|professional\s+experience|career\s+history)\b/i,
        education: /\b(?:education|academic\s+background|qualifications|degrees?)\b/i,
        skills: /\b(?:skills|technical\s+skills|competencies|expertise|technologies|tools)\b/i,
        projects: /\b(?:projects?|portfolio)\b/i,
        certifications: /\b(?:certifications?|certificates?|licenses?)\b/i,
        languages: /\b(?:languages?|language\s+proficiency)\b/i,
        summary: /\b(?:summary|objective|profile|about\s+me)\b/i,
        awards: /\b(?:awards?|honors?|achievements?|recognition)\b/i,
        publications: /\b(?:publications?|papers?|research)\b/i,
        volunteer: /\b(?:volunteer|community\s+service|volunteering)\b/i
      },

      // Common skills
      techSkills: [
        // Programming Languages
        'javascript', 'typescript', 'python', 'java', 'c\\+\\+', 'c#', 'ruby', 'php', 'swift', 'kotlin',
        'go', 'rust', 'scala', 'perl', 'r', 'matlab', 'dart', 'objective-c',
        
        // Frontend
        'react', 'vue', 'angular', 'svelte', 'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap',
        'jquery', 'webpack', 'vite', 'next\\.js', 'nuxt', 'gatsby',
        
        // Backend
        'node\\.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'asp\\.net',
        'fastapi', 'nestjs',
        
        // Databases
        'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sqlite',
        'dynamodb', 'cassandra', 'neo4j', 'firebase',
        
        // Cloud & DevOps
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github\s+actions',
        'terraform', 'ansible', 'ci/cd', 'circleci', 'travis',
        
        // Tools & Other
        'git', 'linux', 'agile', 'scrum', 'jira', 'figma', 'photoshop', 'illustrator',
        'tensorflow', 'pytorch', 'machine\s+learning', 'deep\s+learning', 'nlp', 'computer\s+vision',
        'rest\s+api', 'graphql', 'microservices', 'serverless', 'blockchain', 'websocket'
      ]
    };
  }

  /**
   * Main processing pipeline
   */
  async process(pdfFile, options = {}) {
    const pipeline = {
      text: null,
      sections: null,
      entities: null,
      normalized: null,
      appProfile: null,
      validation: null,
      confidence: null
    };

    try {
      // Step 1: Extract text
      pipeline.text = await this.extractText(pdfFile, options);
      
      // Step 2: Detect sections
      pipeline.sections = this.detectSections(pipeline.text);
      
      // Step 3: Extract entities
      pipeline.entities = this.extractEntities(pipeline.text, pipeline.sections);
      
      // Step 4: Normalize data
      pipeline.normalized = this.normalizeData(pipeline.entities);
      
      // Step 5: Map to APP
      pipeline.appProfile = this.mapToAPP(pipeline.normalized, pipeline.sections);
      
      // Step 6: Validate
      pipeline.validation = this.validate(pipeline.appProfile);
      
      // Step 7: Calculate confidence
      pipeline.confidence = this.calculateConfidence(pipeline.appProfile, pipeline.entities);
      
      return pipeline;
    } catch (error) {
      console.error('Processing error:', error);
      throw error;
    }
  }

  /**
   * Extract text from PDF
   */
  async extractText(pdfFile, options = {}) {
    // This would be implemented using PDF.js in the browser
    // or pdf-parse in Node.js
    throw new Error('extractText must be implemented by the consumer');
  }

  /**
   * Detect sections in the resume text
   */
  detectSections(text) {
    const sections = {
      raw: {},
      structured: {}
    };

    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    let currentSection = 'header';
    let sectionBuffer = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();

      // Check if this line is a section header
      let foundSection = null;
      for (const [sectionKey, pattern] of Object.entries(this.nlpPatterns.sections)) {
        if (pattern.test(lowerLine) && line.length < 100) {
          foundSection = sectionKey;
          break;
        }
      }

      if (foundSection) {
        // Save previous section
        if (sectionBuffer.length > 0) {
          sections.raw[currentSection] = sectionBuffer.join('\n');
        }
        currentSection = foundSection;
        sectionBuffer = [];
      } else {
        sectionBuffer.push(line);
      }
    }

    // Save last section
    if (sectionBuffer.length > 0) {
      sections.raw[currentSection] = sectionBuffer.join('\n');
    }

    // Structure the sections
    sections.structured = this.structureSections(sections.raw);

    return sections;
  }

  /**
   * Structure section content
   */
  structureSections(rawSections) {
    const structured = {};

    // Structure experience
    if (rawSections.experience) {
      structured.experience = this.parseExperience(rawSections.experience);
    }

    // Structure education
    if (rawSections.education) {
      structured.education = this.parseEducation(rawSections.education);
    }

    // Structure skills
    if (rawSections.skills) {
      structured.skills = this.parseSkills(rawSections.skills);
    }

    // Structure projects
    if (rawSections.projects) {
      structured.projects = this.parseProjects(rawSections.projects);
    }

    return structured;
  }

  /**
   * Parse experience entries
   */
  parseExperience(text) {
    const experiences = [];
    const entries = this.splitIntoEntries(text);

    for (const entry of entries) {
      const exp = {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        highlights: []
      };

      const lines = entry.split('\n').filter(l => l.trim());
      if (lines.length === 0) continue;

      // First line usually contains title and/or company
      exp.title = lines[0];

      // Look for dates
      const dates = this.extractDates(entry);
      if (dates.length >= 2) {
        exp.startDate = dates[0];
        exp.endDate = dates[1];
      } else if (dates.length === 1) {
        exp.startDate = dates[0];
      }

      // Extract bullet points as highlights
      const bullets = lines.filter(line => /^[-•*]/.test(line.trim()));
      exp.highlights = bullets.map(b => b.replace(/^[-•*]\s*/, '').trim());

      // Remaining text is description
      const nonBullets = lines.slice(1).filter(line => !/^[-•*]/.test(line.trim()));
      exp.description = nonBullets.join(' ').trim();

      experiences.push(exp);
    }

    return experiences;
  }

  /**
   * Parse education entries
   */
  parseEducation(text) {
    const education = [];
    const entries = this.splitIntoEntries(text);

    for (const entry of entries) {
      const edu = {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: ''
      };

      const lines = entry.split('\n').filter(l => l.trim());
      if (lines.length === 0) continue;

      // Look for degree
      const degreeMatch = entry.match(this.nlpPatterns.degree);
      if (degreeMatch) {
        edu.degree = degreeMatch[0];
      }

      // First line usually contains institution
      edu.institution = lines[0];

      // Look for dates
      const dates = this.extractDates(entry);
      if (dates.length >= 2) {
        edu.startDate = dates[0];
        edu.endDate = dates[1];
      } else if (dates.length === 1) {
        edu.endDate = dates[0];
      }

      // Look for GPA
      const gpaMatch = entry.match(/GPA:?\s*([\d.]+)/i);
      if (gpaMatch) {
        edu.gpa = gpaMatch[1];
      }

      education.push(edu);
    }

    return education;
  }

  /**
   * Parse skills
   */
  parseSkills(text) {
    const skills = [];
    const foundSkills = new Set();

    // Extract known technical skills
    for (const skill of this.nlpPatterns.techSkills) {
      const regex = new RegExp('\\b' + skill + '\\b', 'gi');
      const matches = text.match(regex);
      if (matches) {
        const normalizedSkill = matches[0].toLowerCase().replace(/\s+/g, ' ');
        if (!foundSkills.has(normalizedSkill)) {
          foundSkills.add(normalizedSkill);
          skills.push({
            name: this.capitalizeSkill(matches[0]),
            category: this.categorizeSkill(normalizedSkill)
          });
        }
      }
    }

    // Also try to extract from comma-separated lists
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.includes(',')) {
        const parts = line.split(',').map(p => p.trim()).filter(p => p.length > 2 && p.length < 30);
        for (const part of parts) {
          const normalized = part.toLowerCase();
          if (!foundSkills.has(normalized) && this.isLikelySkill(part)) {
            foundSkills.add(normalized);
            skills.push({
              name: part,
              category: 'other'
            });
          }
        }
      }
    }

    return skills;
  }

  /**
   * Parse projects
   */
  parseProjects(text) {
    const projects = [];
    const entries = this.splitIntoEntries(text);

    for (const entry of entries) {
      const project = {
        name: '',
        description: '',
        url: '',
        highlights: [],
        technologies: []
      };

      const lines = entry.split('\n').filter(l => l.trim());
      if (lines.length === 0) continue;

      // First line is project name
      project.name = lines[0];

      // Look for URLs
      const urls = entry.match(this.nlpPatterns.url);
      if (urls) {
        project.url = urls[0];
      }

      // Extract bullet points as highlights
      const bullets = lines.filter(line => /^[-•*]/.test(line.trim()));
      project.highlights = bullets.map(b => b.replace(/^[-•*]\s*/, '').trim());

      // Remaining text is description
      const nonBullets = lines.slice(1).filter(line => !/^[-•*]/.test(line.trim()));
      project.description = nonBullets.join(' ').trim();

      projects.push(project);
    }

    return projects;
  }

  /**
   * Extract entities from text
   */
  extractEntities(text, sections) {
    const entities = {
      contact: {},
      all: []
    };

    // Extract email
    const emails = text.match(this.nlpPatterns.email);
    if (emails && emails.length > 0) {
      entities.contact.email = emails[0].toLowerCase();
      entities.all.push({ type: 'email', value: emails[0].toLowerCase(), confidence: 0.95 });
    }

    // Extract phone
    const phones = text.match(this.nlpPatterns.phone);
    if (phones && phones.length > 0) {
      entities.contact.phone = this.normalizePhone(phones[0]);
      entities.all.push({ type: 'phone', value: phones[0], confidence: 0.85 });
    }

    // Extract URLs
    const urls = text.match(this.nlpPatterns.url);
    if (urls) {
      urls.forEach(url => {
        if (url.toLowerCase().includes('linkedin')) {
          entities.contact.linkedin = url;
          entities.all.push({ type: 'linkedin', value: url, confidence: 0.90 });
        } else if (url.toLowerCase().includes('github')) {
          entities.contact.github = url;
          entities.all.push({ type: 'github', value: url, confidence: 0.90 });
        } else if (!entities.contact.website) {
          entities.contact.website = url;
          entities.all.push({ type: 'url', value: url, confidence: 0.80 });
        }
      });
    }

    // Extract name (heuristic: first substantial line that's not email/phone/url)
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    for (const line of lines.slice(0, 5)) {
      if (line.length > 3 && line.length < 50 && 
          /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+$/.test(line) &&
          !this.nlpPatterns.email.test(line) &&
          !this.nlpPatterns.phone.test(line) &&
          !this.nlpPatterns.url.test(line)) {
        entities.contact.name = line;
        entities.all.push({ type: 'name', value: line, confidence: 0.75 });
        break;
      }
    }

    // Extract location
    const locationPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})/;
    const locationMatch = text.match(locationPattern);
    if (locationMatch) {
      entities.contact.location = locationMatch[0];
      entities.all.push({ type: 'location', value: locationMatch[0], confidence: 0.70 });
    }

    return entities;
  }

  /**
   * Normalize extracted data
   */
  normalizeData(entities) {
    const normalized = JSON.parse(JSON.stringify(entities));

    // Normalize email
    if (normalized.contact.email) {
      normalized.contact.email = normalized.contact.email.toLowerCase().trim();
    }

    // Normalize phone
    if (normalized.contact.phone) {
      normalized.contact.phone = this.normalizePhone(normalized.contact.phone);
    }

    // Normalize name (title case)
    if (normalized.contact.name) {
      normalized.contact.name = normalized.contact.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    // Normalize URLs (ensure https)
    ['linkedin', 'github', 'website'].forEach(key => {
      if (normalized.contact[key] && !normalized.contact[key].startsWith('http')) {
        normalized.contact[key] = 'https://' + normalized.contact[key];
      }
    });

    return normalized;
  }

  /**
   * Map to APP format
   */
  mapToAPP(normalizedData, sections) {
    const profile = {
      protocol: {
        name: 'ApplicantProfileProtocol',
        shortName: 'APP',
        version: '1.0.0',
        uri: 'https://app-protocol.org',
        id: this.generateUUID()
      },
      basics: {
        name: normalizedData.contact.name || '',
        email: normalizedData.contact.email || '',
        phone: normalizedData.contact.phone || '',
        url: normalizedData.contact.website || normalizedData.contact.linkedin || '',
        location: normalizedData.contact.location ? {
          address: normalizedData.contact.location
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
        version: '1.0.0'
      }
    };

    // Add social profiles
    if (normalizedData.contact.linkedin) {
      profile.basics.profiles.push({
        network: 'LinkedIn',
        url: normalizedData.contact.linkedin
      });
    }
    if (normalizedData.contact.github) {
      profile.basics.profiles.push({
        network: 'GitHub',
        url: normalizedData.contact.github
      });
    }

    // Add summary
    if (sections.raw.summary) {
      profile.basics.summary = sections.raw.summary.substring(0, 1000);
    } else if (sections.raw.header) {
      // Use header as summary if no dedicated summary section
      const lines = sections.raw.header.split('\n').filter(l => l.trim());
      const summaryLines = lines.filter(line => 
        line.length > 50 && 
        !this.nlpPatterns.email.test(line) &&
        !this.nlpPatterns.phone.test(line) &&
        !this.nlpPatterns.url.test(line)
      );
      if (summaryLines.length > 0) {
        profile.basics.summary = summaryLines.join(' ').substring(0, 1000);
      }
    }

    // Map experience
    if (sections.structured.experience) {
      profile.experience = sections.structured.experience.map(exp => ({
        title: exp.title || '',
        company: exp.company || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        summary: exp.description || '',
        highlights: exp.highlights || []
      }));
    }

    // Map education
    if (sections.structured.education) {
      profile.education = sections.structured.education.map(edu => ({
        institution: edu.institution || '',
        studyType: edu.degree || '',
        area: edu.field || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        score: edu.gpa || '',
        courses: []
      }));
    }

    // Map skills
    if (sections.structured.skills) {
      profile.skills = sections.structured.skills.map(skill => ({
        name: skill.name,
        level: this.inferSkillLevel(skill.name),
        keywords: [skill.name]
      }));
    }

    // Map projects
    if (sections.structured.projects) {
      profile.projects = sections.structured.projects.map(proj => ({
        name: proj.name || '',
        description: proj.description || '',
        url: proj.url || '',
        highlights: proj.highlights || [],
        keywords: proj.technologies || []
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
   * Validate APP profile
   */
  validate(profile) {
    const errors = [];
    const warnings = [];

    // Check required fields
    if (!profile.protocol || !profile.protocol.name) {
      errors.push('Missing protocol.name');
    }
    if (!profile.basics) {
      errors.push('Missing basics section');
    } else {
      if (!profile.basics.name) {
        warnings.push('Missing basics.name');
      }
      if (!profile.basics.email) {
        warnings.push('Missing basics.email');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Calculate confidence scores
   */
  calculateConfidence(profile, entities) {
    const scores = {
      basics: 0,
      experience: 0,
      education: 0,
      skills: 0,
      projects: 0,
      overall: 0,
      breakdown: {}
    };

    // Basics confidence
    let basicsPoints = 0;
    const basicsChecks = {
      name: 30,
      email: 25,
      phone: 15,
      url: 10,
      summary: 10,
      location: 5,
      profiles: 5
    };

    for (const [field, points] of Object.entries(basicsChecks)) {
      if (profile.basics && profile.basics[field]) {
        if (Array.isArray(profile.basics[field])) {
          if (profile.basics[field].length > 0) {
            basicsPoints += points;
            scores.breakdown[`basics.${field}`] = 100;
          }
        } else {
          basicsPoints += points;
          scores.breakdown[`basics.${field}`] = 100;
        }
      } else {
        scores.breakdown[`basics.${field}`] = 0;
      }
    }
    scores.basics = basicsPoints;

    // Experience confidence
    if (profile.experience && profile.experience.length > 0) {
      const expScore = Math.min(100, 30 + (profile.experience.length * 15));
      scores.experience = expScore;
      scores.breakdown.experience = expScore;
    } else {
      scores.experience = 0;
      scores.breakdown.experience = 0;
    }

    // Education confidence
    if (profile.education && profile.education.length > 0) {
      const eduScore = Math.min(100, 40 + (profile.education.length * 20));
      scores.education = eduScore;
      scores.breakdown.education = eduScore;
    } else {
      scores.education = 0;
      scores.breakdown.education = 0;
    }

    // Skills confidence
    if (profile.skills && profile.skills.length > 0) {
      const skillScore = Math.min(100, profile.skills.length * 5);
      scores.skills = skillScore;
      scores.breakdown.skills = skillScore;
    } else {
      scores.skills = 0;
      scores.breakdown.skills = 0;
    }

    // Projects confidence
    if (profile.projects && profile.projects.length > 0) {
      const projScore = Math.min(100, 30 + (profile.projects.length * 20));
      scores.projects = projScore;
      scores.breakdown.projects = projScore;
    } else {
      scores.projects = 20; // Bonus for having no projects
      scores.breakdown.projects = 20;
    }

    // Overall confidence (weighted average)
    scores.overall = Math.round(
      scores.basics * 0.35 +
      scores.experience * 0.25 +
      scores.education * 0.15 +
      scores.skills * 0.15 +
      scores.projects * 0.10
    );

    return scores;
  }

  // Utility methods

  splitIntoEntries(text) {
    // Split text into logical entries (separated by blank lines or date patterns)
    const entries = [];
    let currentEntry = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        if (currentEntry.length > 0) {
          entries.push(currentEntry.join('\n'));
          currentEntry = [];
        }
      } else {
        currentEntry.push(line);
      }
    }

    if (currentEntry.length > 0) {
      entries.push(currentEntry.join('\n'));
    }

    return entries.filter(e => e.trim().length > 20);
  }

  extractDates(text) {
    const dates = [];
    const matches = text.match(this.nlpPatterns.date);
    if (matches) {
      matches.forEach(match => {
        dates.push(match.trim());
      });
    }
    return dates;
  }

  normalizePhone(phone) {
    // Remove all non-digit characters except +
    return phone.replace(/[^\d+]/g, '');
  }

  capitalizeSkill(skill) {
    const lowerSkill = skill.toLowerCase();
    
    // Special cases
    const specialCases = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'nodejs': 'Node.js',
      'nextjs': 'Next.js',
      'vuejs': 'Vue.js',
      'react': 'React',
      'angular': 'Angular',
      'vue': 'Vue',
      'html': 'HTML',
      'css': 'CSS',
      'sql': 'SQL',
      'nosql': 'NoSQL',
      'aws': 'AWS',
      'gcp': 'GCP',
      'api': 'API',
      'rest': 'REST',
      'graphql': 'GraphQL',
      'json': 'JSON',
      'xml': 'XML',
      'ci/cd': 'CI/CD',
      'nlp': 'NLP',
      'ml': 'ML',
      'ai': 'AI'
    };

    if (specialCases[lowerSkill]) {
      return specialCases[lowerSkill];
    }

    // Default: capitalize first letter
    return skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase();
  }

  categorizeSkill(skill) {
    const categories = {
      language: ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust'],
      frontend: ['react', 'vue', 'angular', 'html', 'css', 'sass', 'tailwind', 'bootstrap'],
      backend: ['node.js', 'express', 'django', 'flask', 'spring', 'laravel'],
      database: ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch'],
      cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes'],
      tool: ['git', 'jira', 'figma', 'webpack', 'vite']
    };

    for (const [category, skills] of Object.entries(categories)) {
      if (skills.some(s => skill.includes(s))) {
        return category;
      }
    }

    return 'other';
  }

  isLikelySkill(text) {
    // Simple heuristic: likely a skill if it's short and doesn't look like a sentence
    return text.length < 30 && 
           text.split(' ').length <= 3 &&
           !/^[A-Z][a-z]+\s/.test(text);
  }

  inferSkillLevel(skill) {
    // Could be enhanced with more sophisticated logic
    return 'intermediate';
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PDFProcessor;
} else if (typeof window !== 'undefined') {
  window.PDFProcessor = PDFProcessor;
}
