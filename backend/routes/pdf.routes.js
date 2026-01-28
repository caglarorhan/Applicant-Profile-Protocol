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
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No PDF file provided'
      });
    }

    // Import processing functions
    const pdfParse = (await import('pdf-parse')).default;
    const { extractWithAI } = await import('../config/openai.config.js');
    const { mapToAPP, validateAPP } = await import('../services/app-mapper.service.js');

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No text found in PDF'
      });
    }

    // Extract structured data with AI
    const extractedData = await extractWithAI(text);
    
    // Map to APP format
    const appProfile = mapToAPP(extractedData);
    
    // Validate
    const validation = validateAPP(appProfile);

    res.json({
      success: true,
      profile: appProfile,
      validation: validation,
      metadata: {
        pages: pdfData.numpages,
        textLength: text.length
      }
    });

  } catch (error) {
    console.error('PDF extraction error:', error);
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
