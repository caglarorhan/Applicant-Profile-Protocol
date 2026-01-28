import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
const initFirebase = () => {
  if (admin.apps.length === 0) {
    try {
      // Check if required env vars are present
      if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
        console.warn('⚠️  Firebase credentials not configured. Firebase features will be disabled.');
        return null;
      }

      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });

      console.log('✅ Firebase Admin SDK initialized');
    } catch (error) {
      console.error('❌ Firebase initialization error:', error.message);
      console.warn('⚠️  Continuing without Firebase. Some features may not work.');
      return null;
    }
  }
  
  return admin;
};

// Get Firestore instance
export const getFirestore = () => {
  const firebaseAdmin = initFirebase();
  if (!firebaseAdmin) {
    throw new Error('Firebase not initialized. Please configure Firebase credentials.');
  }
  return firebaseAdmin.firestore();
};

// Get Storage instance
export const getStorage = () => {
  const firebaseAdmin = initFirebase();
  if (!firebaseAdmin) {
    throw new Error('Firebase not initialized. Please configure Firebase credentials.');
  }
  return firebaseAdmin.storage();
};

// Get Auth instance
export const getAuth = () => {
  const firebaseAdmin = initFirebase();
  if (!firebaseAdmin) {
    throw new Error('Firebase not initialized. Please configure Firebase credentials.');
  }
  return firebaseAdmin.auth();
};

export default initFirebase;
