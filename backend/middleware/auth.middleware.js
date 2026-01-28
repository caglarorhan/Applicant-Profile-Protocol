import { getAuth } from '../config/firebase.config.js';

/**
 * Middleware to authenticate user via Firebase Auth
 */
export async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - No token provided'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify Firebase ID token
    const decodedToken = await getAuth().verifyIdToken(token);
    
    // Attach user to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid token'
    });
  }
}

/**
 * Optional authentication - continues if no token provided
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await getAuth().verifyIdToken(token);
      
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified
      };
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}
