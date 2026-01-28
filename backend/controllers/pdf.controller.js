import pdfParse from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';
import { getStorage, getFirestore } from '../config/firebase.config.js';
import { performOCR, needsOCR } from '../config/google-vision.config.js';
import { extractWithAI, calculateConfidenceWithAI } from '../config/openai.config.js';
import { mapToAPP, validateAPP } from '../services/app-mapper.service.js';
import { addToQueue } from '../services/queue.service.js';

/**
 * Upload and process PDF
 */
export async function uploadPDF(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No PDF file provided'
      });
    }

    const userId = req.user.uid;
    const jobId = uuidv4();
    const filename = `${userId}/${jobId}.pdf`;

    // Upload to Firebase Storage
    const bucket = getStorage().bucket();
    const file = bucket.file(filename);
    
    await file.save(req.file.buffer, {
      metadata: {
        contentType: 'application/pdf',
        metadata: {
          userId: userId,
          uploadedAt: new Date().toISOString()
        }
      }
    });

    console.log(`✅ PDF uploaded: ${filename}`);

    // Add to processing queue
    const job = await addToQueue('process-pdf', {
      jobId,
      userId,
      filename,
      fileSize: req.file.size
    });

    res.status(202).json({
      success: true,
      message: 'PDF uploaded successfully, processing started',
      jobId: jobId,
      status: 'processing'
    });

  } catch (error) {
    console.error('Upload error:', error);
    next(error);
  }
}

/**
 * Process PDF (called by queue or directly)
 */
export async function processPDF(req, res, next) {
  try {
    const { jobId, userId, filename, fileBuffer } = req.body;

    console.log(`🔄 Processing PDF: ${jobId}`);

    // Step 1: Extract text from PDF
    let extractedText = '';
    let extractionMethod = 'pdf-parse';
    
    const pdfData = await pdfParse(fileBuffer);
    extractedText = pdfData.text;

    console.log(`📝 Extracted ${extractedText.length} characters`);

    // Step 2: Check if OCR is needed
    if (needsOCR(extractedText)) {
      console.log('🔍 Performing OCR...');
      const ocrResult = await performOCR(fileBuffer);
      
      if (ocrResult.success) {
        extractedText = ocrResult.text;
        extractionMethod = 'google-vision-ocr';
        console.log(`✅ OCR completed: ${extractedText.length} characters`);
      }
    }

    // Step 3: AI-powered entity extraction using OpenAI
    console.log('🤖 Extracting entities with OpenAI...');
    const aiResult = await extractWithAI(extractedText);

    if (!aiResult.success) {
      throw new Error('Failed to extract data with AI');
    }

    const extractedData = aiResult.data;
    console.log('✅ Entities extracted');

    // Step 4: Map to APP format
    console.log('🗺️ Mapping to APP format...');
    const appProfile = mapToAPP(extractedData, userId);
    console.log('✅ Mapped to APP');

    // Step 5: Validate against schema
    console.log('✅ Validating against schema...');
    const validation = validateAPP(appProfile);

    if (!validation.valid) {
      console.warn('⚠️ Validation warnings:', validation.errors);
    }

    // Step 6: Calculate confidence scores
    console.log('📊 Calculating confidence scores...');
    const confidence = await calculateConfidenceWithAI(extractedData, extractedText);
    console.log(`✅ Overall confidence: ${confidence.overall}%`);

    // Step 7: Save to Firestore
    const db = getFirestore();
    const profileRef = db.collection('profiles').doc(appProfile.protocol.id);
    
    await profileRef.set({
      userId: userId,
      profileId: appProfile.protocol.id,
      jobId: jobId,
      data: appProfile,
      confidence: confidence,
      validation: validation,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'pdf-extractor',
        extractionMethod: extractionMethod,
        fileSize: fileBuffer.length,
        textLength: extractedText.length
      }
    });

    console.log(`✅ Profile saved: ${appProfile.protocol.id}`);

    // Return response
    return res.json({
      success: true,
      message: 'PDF processed successfully',
      profile: appProfile,
      confidence: confidence,
      validation: validation,
      profileId: appProfile.protocol.id
    });

  } catch (error) {
    console.error('Processing error:', error);
    next(error);
  }
}

/**
 * Get processing status
 */
export async function getProcessingStatus(req, res, next) {
  try {
    const { jobId } = req.params;
    const userId = req.user.uid;

    const db = getFirestore();
    const jobRef = db.collection('jobs').doc(jobId);
    const jobDoc = await jobRef.get();

    if (!jobDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    const jobData = jobDoc.data();

    // Check ownership
    if (jobData.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    res.json({
      success: true,
      job: {
        id: jobId,
        status: jobData.status,
        progress: jobData.progress || 0,
        result: jobData.result || null,
        error: jobData.error || null,
        createdAt: jobData.createdAt,
        completedAt: jobData.completedAt || null
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    next(error);
  }
}
