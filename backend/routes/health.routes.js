import express from 'express';

const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

/**
 * GET /api/health/ready
 * Readiness check (for Kubernetes/Docker)
 */
router.get('/ready', async (req, res) => {
  try {
    // Check Firebase connection
    const { getFirestore } = await import('../config/firebase.config.js');
    const db = getFirestore();
    await db.collection('_health').doc('check').get();

    res.json({
      status: 'ready',
      checks: {
        firebase: 'ok',
        openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
        googleVision: process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'configured' : 'not configured'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error.message
    });
  }
});

export default router;
