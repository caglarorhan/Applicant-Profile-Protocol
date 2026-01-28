import vision from '@google-cloud/vision';
import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize credentials from environment variables or file
let credentials;
const credFilePath = join(__dirname, 'firebase-admin-key.json');

if (existsSync(credFilePath)) {
  // Use file if it exists (local development)
  credentials = JSON.parse(readFileSync(credFilePath, 'utf8'));
  console.log('📄 Using Google Vision credentials from file');
} else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  // Use environment variables (production/Railway)
  credentials = {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  };
  console.log('🔐 Using Google Vision credentials from environment variables');
} else {
  console.warn('⚠️  Google Vision credentials not configured. OCR features will be disabled.');
  credentials = null;
}

// Initialize Google Cloud Vision client
let client = null;
if (credentials) {
  try {
    client = new vision.ImageAnnotatorClient({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key
      },
      projectId: credentials.project_id
    });
    console.log('✅ Google Cloud Vision initialized');
  } catch (error) {
    console.error('❌ Google Vision initialization error:', error.message);
  }
}

/**
 * Perform OCR on PDF using Google Cloud Vision API
 */
export async function performOCR(fileBuffer) {
  if (!client) {
    return {
      success: false,
      error: 'Google Vision API not configured. Please set up Firebase credentials.'
    };
  }

  try {
    const [result] = await client.documentTextDetection(fileBuffer);
    const fullText = result.fullTextAnnotation;

    if (!fullText) {
      return {
        success: false,
        error: 'No text detected in document'
      };
    }

    return {
      success: true,
      text: fullText.text,
      pages: fullText.pages?.length || 1,
      confidence: calculateOCRConfidence(fullText)
    };
  } catch (error) {
    console.error('Google Vision OCR error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Calculate OCR confidence score
 */
function calculateOCRConfidence(fullTextAnnotation) {
  if (!fullTextAnnotation.pages) return 0;

  let totalConfidence = 0;
  let wordCount = 0;

  for (const page of fullTextAnnotation.pages) {
    for (const block of page.blocks || []) {
      for (const paragraph of block.paragraphs || []) {
        for (const word of paragraph.words || []) {
          if (word.confidence) {
            totalConfidence += word.confidence;
            wordCount++;
          }
        }
      }
    }
  }

  return wordCount > 0 ? Math.round((totalConfidence / wordCount) * 100) : 0;
}

/**
 * Detect if PDF is scanned (needs OCR)
 */
export function needsOCR(extractedText) {
  // If very little text extracted, likely scanned
  return extractedText.trim().length < 100;
}

export default client;
