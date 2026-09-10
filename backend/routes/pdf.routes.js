import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { 
  uploadPDF, 
  processPDF, 
  getProcessingStatus 
} from '../controllers/pdf.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { uploadRateLimiter } from '../middleware/ratelimit.middleware.js';
import { needsOCR, performOCR } from '../config/google-vision.config.js';

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
router.post('/extract', uploadRateLimiter, upload.single('pdf'), async (req, res, next) => {
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
    let text = pdfData.text;
    console.log(`✅ Extracted ${text.length} characters from ${pdfData.numpages} pages`);

    let extractionMethod = 'pdf-parse';
    if (needsOCR(text)) {
      console.log('🔍 Insufficient PDF text detected; attempting OCR...');
      const ocrResult = await performOCR(req.file.buffer);
      if (ocrResult.success) {
        text = ocrResult.text;
        extractionMethod = 'google-vision-ocr';
      } else if (!text.trim()) {
        return res.status(422).json({
          success: false,
          error: 'No text found in PDF and OCR is unavailable.'
        });
      }
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No text found in PDF'
      });
    }

    // Extract structured data with AI
    console.log('🤖 Calling OpenAI for data extraction...');
    const aiResult = await extractWithAI(text);
    
    if (!aiResult.success) {
      console.error('❌ AI extraction failed:', aiResult.error);
      return res.status(500).json({
        success: false,
        error: 'Failed to extract data with AI: ' + (aiResult.error || 'Unknown error')
      });
    }
    
    console.log('✅ AI extracted data successfully');
    
    // Map to APP format
    console.log('🗺️ Mapping to APP format...');
    const appProfile = mapToAPP(aiResult.data);
    console.log('✅ Mapped to APP format');
    
    // Validate
    console.log('✅ Validating...');
    const validation = validateAPP(appProfile);
    console.log('✅ Validation result:', validation.valid ? 'Valid' : `Invalid: ${validation.errors?.length} errors`);

    res.json({
      success: true,
      profile: appProfile,
      validation: validation,
      extractedText: text, // Send full text for debugging
      aiExtractedData: aiResult.data, // Include raw AI extraction
      metadata: {
        pages: pdfData.numpages,
        textLength: text.length,
        extractionMethod
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
