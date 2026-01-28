import { getFirestore } from '../config/firebase.config.js';

/**
 * Get single profile
 */
export async function getProfile(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const db = getFirestore();
    const profileDoc = await db.collection('profiles').doc(id).get();

    if (!profileDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    const profileData = profileDoc.data();

    // Check ownership
    if (profileData.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access'
      });
    }

    res.json({
      success: true,
      profile: profileData
    });
  } catch (error) {
    next(error);
  }
}

/**
 * List all profiles for user
 */
export async function listProfiles(req, res, next) {
  try {
    const userId = req.user.uid;
    const { limit = 50, offset = 0 } = req.query;

    const db = getFirestore();
    const profilesSnapshot = await db
      .collection('profiles')
      .where('userId', '==', userId)
      .orderBy('metadata.createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .get();

    const profiles = [];
    profilesSnapshot.forEach(doc => {
      profiles.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      count: profiles.length,
      profiles: profiles
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update profile
 */
export async function updateProfile(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const updates = req.body;

    const db = getFirestore();
    const profileRef = db.collection('profiles').doc(id);
    const profileDoc = await profileRef.get();

    if (!profileDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    const profileData = profileDoc.data();

    // Check ownership
    if (profileData.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access'
      });
    }

    // Update profile
    await profileRef.update({
      data: updates,
      'metadata.updatedAt': new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete profile
 */
export async function deleteProfile(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const db = getFirestore();
    const profileRef = db.collection('profiles').doc(id);
    const profileDoc = await profileRef.get();

    if (!profileDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    const profileData = profileDoc.data();

    // Check ownership
    if (profileData.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access'
      });
    }

    // Delete profile
    await profileRef.delete();

    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}
