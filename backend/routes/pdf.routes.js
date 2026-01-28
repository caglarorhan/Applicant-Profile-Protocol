import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { 
  uploadPDF, 
  processPDF, 
  getProcessingStatus 
} from '../controllers/pdf.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: (process.env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024 // Default 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

/**
 * POST /api/pdf/upload
 * Upload and process PDF resume
 * Requires authentication
 */
router.post('/upload', authenticateUser, upload.single('pdf'), uploadPDF);

/**
 * POST /api/pdf/extract
 * Extract data from PDF (public endpoint, no auth required)
 * Returns APP JSON directly
 */
router.post('/extract', upload.single('pdf'), async (req, res, next) => {
  try {
    console.log('📄 PDF extraction request received');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No PDF file provided'
      });
    }

    console.log(`📊 File size: ${req.file.size} bytes`);

    // Import processing functions
    const pdfParse = (await import('pdf-parse')).default;
    const { extractWithAI } = await import('../config/openai.config.js');
    const { mapToAPP, validateAPP } = await import('../services/app-mapper.service.js');

    // Extract text from PDF
    console.log('📝 Extracting text from PDF...');
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;
    console.log(`✅ Extracted ${text.length} characters from ${pdfData.numpages} pages`);
    console.log('📄 First 500 characters:', text.substring(0, 500));

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No text found in PDF'
      });
    }

    // Extract structured data with AI
    console.log('🤖 Calling OpenAI for data extraction...');
    const aiResult = await extractWithAI(text);
    console.log('🤖 AI extraction result:', JSON.stringify(aiResult, null, 2));
    
    if (!aiResult.success) {
      console.error('❌ AI extraction failed:', aiResult.error);
      return res.status(500).json({
        success: false,
        error: 'Failed to extract data with AI: ' + (aiResult.error || 'Unknown error')
      });
    }
    
    console.log('✅ AI extracted data successfully');
    console.log('📦 Extracted data structure:', Object.keys(aiResult.data));
    
    // Map to APP format
    console.log('🗺️ Mapping to APP format...');
    const appProfile = mapToAPP(aiResult.data);
    console.log('✅ Mapped to APP format');
    console.log('👤 Profile basics:', appProfile.basics);
    
    // Validate
    console.log('✅ Validating...');
    const validation = validateAPP(appProfile);
    console.log('✅ Validation result:', validation.valid ? 'Valid' : `Invalid: ${validation.errors?.length} errors`);

    res.json({
      success: true,
      profile: appProfile,
      validation: validation,
      extractedText: text.substring(0, 1000), // Include first 1000 chars for debugging
      aiExtractedData: aiResult.data, // Include raw AI extraction
      metadata: {
        pages: pdfData.numpages,
        textLength: text.length
      }
    });

  } catch (error) {
    console.error('❌ PDF extraction error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process PDF'
    });
  }
});

/**
 * POST /api/pdf/process
 * Process already uploaded PDF
 * Requires authentication
 */
router.post('/process', authenticateUser, processPDF);

/**
 * GET /api/pdf/status/:jobId
 * Get processing status
 * Requires authentication
 */
router.get('/status/:jobId', authenticateUser, getProcessingStatus);

export default router;
