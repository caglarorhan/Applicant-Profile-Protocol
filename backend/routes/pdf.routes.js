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
