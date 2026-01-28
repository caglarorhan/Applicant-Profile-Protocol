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
    const prompt = `You are a resume parser. Extract structured information from the following resume text and return it in JSON format according to the Applicant Profile Protocol (APP) schema.

Extract:
- Contact information (name, email, phone, LinkedIn, GitHub, website, location)
- Work experience (title, company, dates, location, description, highlights)
- Education (institution, degree, field, dates, GPA)
- Skills (categorized: languages, frameworks, databases, cloud, tools)
- Projects (name, description, URL, technologies)
- Certifications (name, issuer, date)
- Languages (language, proficiency level)

Resume Text:
${resumeText}

Return ONLY valid JSON without any markdown formatting or explanations.`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume parser that extracts structured data and returns valid JSON.'
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
