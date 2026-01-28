import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

// Import routes
import pdfRoutes from './routes/pdf.routes.js';
import profileRoutes from './routes/profile.routes.js';
import healthRoutes from './routes/health.routes.js';

// Import middleware
import { errorHandler } from './middleware/error.middleware.js';
import { rateLimiter } from './middleware/ratelimit.middleware.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan('combined')); // Logging
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', rateLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/profiles', profileRoutes);

// Serve static files (frontend)
app.use(express.static(join(__dirname, '../public')));

// API documentation
app.get('/api', (req, res) => {
  res.json({
    name: 'APP PDF Extractor API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      uploadPDF: 'POST /api/pdf/upload',
      processPDF: 'POST /api/pdf/process',
      getProfile: 'GET /api/profiles/:id',
      listProfiles: 'GET /api/profiles',
      updateProfile: 'PUT /api/profiles/:id',
      deleteProfile: 'DELETE /api/profiles/:id'
    },
    documentation: 'https://app-protocol.org/docs/pdf-extractor'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🚀 APP PDF Extractor Backend running on ${HOST}:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`📄 Docs: http://localhost:${PORT}/api`);
}).on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, closing server...');
  process.exit(0);
});
