import Queue from 'bull';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Bull queue with Redis (optional)
let pdfQueue = null;

try {
  if (process.env.REDIS_HOST) {
    pdfQueue = new Queue('pdf-processing', {
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT || 6379
      }
    });

    // Configure queue settings
    pdfQueue.on('error', (error) => {
      console.error('Queue error:', error);
    });

    pdfQueue.on('completed', (job) => {
      console.log(`✅ Job ${job.id} completed`);
    });

    pdfQueue.on('failed', (job, err) => {
      console.error(`❌ Job ${job.id} failed:`, err.message);
    });

    console.log('✅ Bull queue initialized with Redis');
  } else {
    console.warn('⚠️  Redis not configured. Queue features will be disabled. Processing will be synchronous.');
  }
} catch (error) {
  console.error('❌ Failed to initialize queue:', error.message);
  console.warn('⚠️  Continuing without queue. Processing will be synchronous.');
}

/**
 * Add job to processing queue
 */
export async function addToQueue(jobType, data) {
  if (!pdfQueue) {
    console.warn('⚠️  Queue not available. Processing synchronously.');
    // Return a mock job object
    return {
      id: `sync-${Date.now()}`,
      data: data
    };
  }

  try {
    const job = await pdfQueue.add(jobType, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      removeOnComplete: true,
      removeOnFail: false
    });

    console.log(`📋 Job ${job.id} added to queue`);
    return job;
  } catch (error) {
    console.error('Queue add error:', error);
    throw error;
  }
}

/**
 * Process jobs from queue
 */
export function startQueueProcessor() {
  if (!pdfQueue) {
    console.warn('⚠️  Queue not available. Queue processor not started.');
    return;
  }

  pdfQueue.process('process-pdf', async (job) => {
    const { jobId, userId, filename } = job.data;

    console.log(`🔄 Processing job ${job.id}: ${jobId}`);

    try {
      // Update job status in Firestore
      const db = getFirestore();
      await db.collection('jobs').doc(jobId).set({
        status: 'processing',
        progress: 10,
        createdAt: new Date()
      });

      // Download PDF from Firebase Storage
      const bucket = getStorage().bucket();
      const file = bucket.file(filename);
      const [fileBuffer] = await file.download();

      // Update progress
      job.progress(30);

      // Process PDF (call controller function)
      const { processPDF } = await import('../controllers/pdf.controller.js');
      
      // Create mock request/response for processing
      const mockReq = {
        body: { jobId, userId, filename, fileBuffer },
        user: { uid: userId }
      };
      
      const mockRes = {
        json: (data) => data,
        status: (code) => ({ json: (data) => data })
      };

      const result = await processPDF(mockReq, mockRes, (err) => {
        throw err;
      });

      // Update job as completed
      await db.collection('jobs').doc(jobId).update({
        status: 'completed',
        progress: 100,
        result: result,
        completedAt: new Date()
      });

      job.progress(100);
      return result;

    } catch (error) {
      // Update job as failed
      const db = getFirestore();
      await db.collection('jobs').doc(jobId).update({
        status: 'failed',
        error: error.message,
        completedAt: new Date()
      });

      throw error;
    }
  });

  console.log('✅ Queue processor started');
}

export default pdfQueue;
