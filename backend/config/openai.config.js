import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI client
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('✅ OpenAI initialized');
} else {
  console.warn('⚠️  OpenAI API key not configured. AI extraction features will be disabled.');
}

/**
 * Extract structured data from resume text using OpenAI
 */
export async function extractWithAI(resumeText) {
  if (!openai) {
    throw new Error('OpenAI is not configured. Please set OPENAI_API_KEY environment variable.');
  }

  try {
    const prompt = `You are a resume parser. Extract ALL structured information from the following resume text and return it in JSON format.

IMPORTANT: Extract COMPLETE information from the entire resume. Do not truncate or summarize.

Required JSON structure:
{
  "contactInformation": {
    "name": "Full name",
    "email": "email@example.com",
    "phone": "phone number",
    "LinkedIn": "LinkedIn URL",
    "GitHub": "GitHub URL",
    "website": "personal website",
    "location": "City, State ZIP"
  },
  "workExperience": [
    {
      "title": "Job title",
      "company": "Company name",
      "location": "City, State",
      "startDate": "MM/YYYY or Month Year",
      "endDate": "MM/YYYY or Month Year or Present",
      "current": true/false,
      "description": "Job description",
      "responsibilities": "Key responsibilities",
      "highlights": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "University name",
      "degree": "Degree type",
      "field": "Field of study",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY",
      "gpa": "GPA if available"
    }
  ],
  "skills": {
    "languages": ["Programming languages"],
    "frameworks": ["Frameworks"],
    "databases": ["Databases"],
    "tools": ["Tools and technologies"]
  },
  "projects": [
    {
      "name": "Project name",
      "description": "Project description",
      "technologies": ["Tech 1", "Tech 2"]
    }
  ],
  "certifications": [
    {
      "name": "Certification name",
      "issuer": "Issuing organization",
      "date": "MM/YYYY"
    }
  ],
  "languages": [
    {
      "language": "Language name",
      "proficiency": "Proficiency level"
    }
  ]
}

CRITICAL INSTRUCTIONS:
1. Extract ALL work experiences, not just the first few
2. Parse dates in original format (e.g., "07/2013 - 10/2018" or "11/2018 - Present")
3. If a job is current/ongoing, set "current": true and "endDate": "Present"
4. Extract complete job descriptions and responsibilities
5. Parse location information from address (City, State, ZIP)
6. Do NOT skip or truncate any section

Resume Text:
${resumeText}

Return ONLY valid JSON without any markdown formatting or explanations.`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume parser that extracts ALL structured data completely and accurately, returns valid JSON, and never truncates or summarizes information.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    const extractedData = JSON.parse(response.choices[0].message.content);
    
    console.log('✅ OpenAI extraction completed');
    console.log('📊 Extracted sections:', {
      name: extractedData.contactInformation?.name || 'N/A',
      email: extractedData.contactInformation?.email || 'N/A',
      experiences: extractedData.workExperience?.length || 0,
      education: extractedData.education?.length || 0,
      skills: Object.keys(extractedData.skills || {}).length,
      certifications: extractedData.certifications?.length || 0
    });
    
    return {
      success: true,
      data: extractedData,
      usage: response.usage
    };
  } catch (error) {
    console.error('OpenAI extraction error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Calculate confidence score using AI
 */
export async function calculateConfidenceWithAI(extractedData, rawText) {
  try {
    const prompt = `Analyze this extracted resume data and calculate confidence scores (0-100) for each section.

Consider:
- Completeness of information
- Consistency with source text
- Data quality and formatting
- Presence of key fields

Extracted Data:
${JSON.stringify(extractedData, null, 2)}

Return JSON with confidence scores for: basics, experience, education, skills, overall`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Confidence calculation error:', error);
    // Fallback to basic confidence calculation
    return {
      overall: 70,
      basics: 70,
      experience: 70,
      education: 70,
      skills: 70
    };
  }
}

export default openai;
