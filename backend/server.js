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

console.log('🔧 Starting APP PDF Extractor Backend...');
console.log('📝 Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port:', process.env.PORT || 3000);
console.log('🔑 OpenAI configured:', !!process.env.OPENAI_API_KEY);
console.log('🔥 Firebase configured:', !!process.env.FIREBASE_PROJECT_ID);

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
// Configure Helmet with relaxed CSP for frontend tools
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Required for inline scripts in tools
        "'unsafe-eval'", // Required for AJV schema compilation in validator
        "https://cdnjs.cloudflare.com" // PDF.js and AJV CDN
      ],
      scriptSrcAttr: ["'unsafe-inline'"], // Required for onclick handlers
      workerSrc: ["'self'", "blob:"], // Allow PDF.js web workers
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  }
}));
app.use(compression()); // Compress responses
app.use(morgan('combined')); // Logging

// Railway terminates TLS at a trusted reverse proxy and forwards the client IP.
app.set('trust proxy', 1);

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', rateLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/profiles', profileRoutes);

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

// Serve static files (frontend HTML/CSS/JS)
app.use(express.static(join(__dirname, '../public')));

// Serve schema files
app.use('/schema', express.static(join(__dirname, '../schema')));

// Serve example files
app.use('/examples', express.static(join(__dirname, '../examples')));

// Schema version aliases
app.get('/schema/app-:version.json', (req, res) => {
  // Map versioned requests to actual schema file
  res.sendFile(join(__dirname, '../schema/app.schema.json'));
});

// Fallback to index.html for client-side routing
app.get('/{*splat}', (req, res, next) => {
  // Skip API routes
  if (req.url.startsWith('/api')) {
    return next();
  }
  // Skip schema routes
  if (req.url.startsWith('/schema')) {
    return next();
  }
  res.sendFile(join(__dirname, '../public/index.html'));
});

// 404 handler for API routes only
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    availableEndpoints: {
      api: 'GET /api',
      health: 'GET /api/health'
    }
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
