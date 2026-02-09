/**
 * Storage Manager
 * Handles data persistence to localStorage and Firebase/Firestore
 */

class StorageManager {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'app-profiles';
    this.firebaseConfig = options.firebaseConfig || null;
    this.firebaseApp = null;
    this.firestore = null;
    this.auth = null;
    this.isFirebaseInitialized = false;
  }

  /**
   * Initialize Firebase (optional)
   */
  async initFirebase(config) {
    if (typeof firebase === 'undefined') {
      console.warn('Firebase SDK not loaded');
      return false;
    }

    try {
      this.firebaseConfig = config;
      
      // Initialize Firebase
      if (!firebase.apps.length) {
        this.firebaseApp = firebase.initializeApp(config);
      } else {
        this.firebaseApp = firebase.app();
      }

      // Initialize Firestore
      this.firestore = firebase.firestore();
      
      // Initialize Auth
      this.auth = firebase.auth();
      
      this.isFirebaseInitialized = true;
      return true;
    } catch (error) {
      console.error('Firebase initialization error:', error);
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.auth && this.auth.currentUser !== null;
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.auth ? this.auth.currentUser : null;
  }

  /**
   * Sign in with email/password
   */
  async signIn(email, password) {
    if (!this.auth) {
      throw new Error('Firebase Auth not initialized');
    }

    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle() {
    if (!this.auth) {
      throw new Error('Firebase Auth not initialized');
    }

    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await this.auth.signInWithPopup(provider);
      return {
        success: true,
        user: result.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sign out
   */
  async signOut() {
    if (!this.auth) {
      throw new Error('Firebase Auth not initialized');
    }

    try {
      await this.auth.signOut();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Save profile to localStorage
   */
  saveToLocal(profile, metadata = {}) {
    try {
      // Get existing profiles
      const profiles = this.getFromLocal();
      
      // Create profile entry
      const entry = {
        id: profile.protocol.id,
        name: profile.basics?.name || 'Unnamed Profile',
        email: profile.basics?.email || '',
        createdAt: metadata.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: metadata.source || 'unknown',
        confidence: metadata.confidence || 0,
        data: profile
      };

      // Check if profile already exists
      const existingIndex = profiles.findIndex(p => p.id === entry.id);
      if (existingIndex >= 0) {
        // Update existing
        profiles[existingIndex] = entry;
      } else {
        // Add new
        profiles.push(entry);
      }

      // Save to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(profiles));

      return {
        success: true,
        id: entry.id,
        message: 'Profile saved to local storage'
      };
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all profiles from localStorage
   */
  getFromLocal() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  /**
   * Get single profile from localStorage
   */
  getLocalById(id) {
    const profiles = this.getFromLocal();
    return profiles.find(p => p.id === id);
  }

  /**
   * Delete profile from localStorage
   */
  deleteFromLocal(id) {
    try {
      const profiles = this.getFromLocal();
      const filtered = profiles.filter(p => p.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      
      return {
        success: true,
        message: 'Profile deleted from local storage'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Clear all profiles from localStorage
   */
  clearLocal() {
    try {
      localStorage.removeItem(this.storageKey);
      return {
        success: true,
        message: 'All profiles cleared from local storage'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Export profiles as JSON
   */
  exportLocal() {
    const profiles = this.getFromLocal();
    const dataStr = JSON.stringify(profiles, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `app-profiles-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Import profiles from JSON
   */
  importLocal(jsonData) {
    try {
      const imported = JSON.parse(jsonData);
      if (!Array.isArray(imported)) {
        throw new Error('Invalid data format');
      }

      const existing = this.getFromLocal();
      const merged = [...existing];

      // Merge imported profiles
      for (const profile of imported) {
        const existingIndex = merged.findIndex(p => p.id === profile.id);
        if (existingIndex >= 0) {
          // Update if imported is newer
          if (new Date(profile.updatedAt) > new Date(merged[existingIndex].updatedAt)) {
            merged[existingIndex] = profile;
          }
        } else {
          merged.push(profile);
        }
      }

      localStorage.setItem(this.storageKey, JSON.stringify(merged));

      return {
        success: true,
        count: imported.length,
        message: `Imported ${imported.length} profiles`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Save profile to Firestore
   */
  async saveToFirestore(profile, metadata = {}) {
    if (!this.isFirebaseInitialized || !this.firestore) {
      return {
        success: false,
        error: 'Firestore not initialized'
      };
    }

    if (!this.isAuthenticated()) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    try {
      const user = this.getCurrentUser();
      const profileData = {
        userId: user.uid,
        userEmail: user.email,
        profileId: profile.protocol.id,
        name: profile.basics?.name || 'Unnamed Profile',
        email: profile.basics?.email || '',
        createdAt: metadata.createdAt || firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        source: metadata.source || 'unknown',
        confidence: metadata.confidence || 0,
        data: profile
      };

      // Save to user's profiles collection
      const docRef = await this.firestore
        .collection('users')
        .doc(user.uid)
        .collection('profiles')
        .doc(profile.protocol.id)
        .set(profileData, { merge: true });

      return {
        success: true,
        id: profile.protocol.id,
        message: 'Profile saved to cloud'
      };
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all profiles from Firestore for current user
   */
  async getFromFirestore() {
    if (!this.isFirebaseInitialized || !this.firestore) {
      return {
        success: false,
        error: 'Firestore not initialized',
        profiles: []
      };
    }

    if (!this.isAuthenticated()) {
      return {
        success: false,
        error: 'User not authenticated',
        profiles: []
      };
    }

    try {
      const user = this.getCurrentUser();
      const snapshot = await this.firestore
        .collection('users')
        .doc(user.uid)
        .collection('profiles')
        .orderBy('updatedAt', 'desc')
        .get();

      const profiles = [];
      snapshot.forEach(doc => {
        profiles.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        success: true,
        profiles
      };
    } catch (error) {
      console.error('Error reading from Firestore:', error);
      return {
        success: false,
        error: error.message,
        profiles: []
      };
    }
  }

  /**
   * Get single profile from Firestore
   */
  async getFirestoreById(profileId) {
    if (!this.isFirebaseInitialized || !this.firestore) {
      return {
        success: false,
        error: 'Firestore not initialized'
      };
    }

    if (!this.isAuthenticated()) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    try {
      const user = this.getCurrentUser();
      const doc = await this.firestore
        .collection('users')
        .doc(user.uid)
        .collection('profiles')
        .doc(profileId)
        .get();

      if (!doc.exists) {
        return {
          success: false,
          error: 'Profile not found'
        };
      }

      return {
        success: true,
        profile: {
          id: doc.id,
          ...doc.data()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete profile from Firestore
   */
  async deleteFromFirestore(profileId) {
    if (!this.isFirebaseInitialized || !this.firestore) {
      return {
        success: false,
        error: 'Firestore not initialized'
      };
    }

    if (!this.isAuthenticated()) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    try {
      const user = this.getCurrentUser();
      await this.firestore
        .collection('users')
        .doc(user.uid)
        .collection('profiles')
        .doc(profileId)
        .delete();

      return {
        success: true,
        message: 'Profile deleted from cloud'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sync local profiles to Firestore
   */
  async syncToCloud() {
    if (!this.isAuthenticated()) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    try {
      const localProfiles = this.getFromLocal();
      const synced = [];
      const failed = [];

      for (const profile of localProfiles) {
        const result = await this.saveToFirestore(profile.data, {
          createdAt: profile.createdAt,
          source: profile.source,
          confidence: profile.confidence
        });

        if (result.success) {
          synced.push(profile.id);
        } else {
          failed.push({ id: profile.id, error: result.error });
        }
      }

      return {
        success: true,
        synced: synced.length,
        failed: failed.length,
        details: { synced, failed }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sync Firestore profiles to local
   */
  async syncFromCloud() {
    if (!this.isAuthenticated()) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    try {
      const result = await this.getFromFirestore();
      if (!result.success) {
        return result;
      }

      const cloudProfiles = result.profiles;
      const localProfiles = this.getFromLocal();
      const merged = [...localProfiles];

      for (const cloudProfile of cloudProfiles) {
        const existingIndex = merged.findIndex(p => p.id === cloudProfile.profileId);
        
        if (existingIndex >= 0) {
          // Update if cloud version is newer
          const cloudDate = cloudProfile.updatedAt?.toDate?.() || new Date(cloudProfile.updatedAt);
          const localDate = new Date(merged[existingIndex].updatedAt);
          
          if (cloudDate > localDate) {
            merged[existingIndex] = {
              id: cloudProfile.profileId,
              name: cloudProfile.name,
              email: cloudProfile.email,
              createdAt: cloudProfile.createdAt?.toDate?.()?.toISOString() || cloudProfile.createdAt,
              updatedAt: cloudProfile.updatedAt?.toDate?.()?.toISOString() || cloudProfile.updatedAt,
              source: cloudProfile.source,
              confidence: cloudProfile.confidence,
              data: cloudProfile.data
            };
          }
        } else {
          // Add new profile from cloud
          merged.push({
            id: cloudProfile.profileId,
            name: cloudProfile.name,
            email: cloudProfile.email,
            createdAt: cloudProfile.createdAt?.toDate?.()?.toISOString() || cloudProfile.createdAt,
            updatedAt: cloudProfile.updatedAt?.toDate?.()?.toISOString() || cloudProfile.updatedAt,
            source: cloudProfile.source,
            confidence: cloudProfile.confidence,
            data: cloudProfile.data
          });
        }
      }

      localStorage.setItem(this.storageKey, JSON.stringify(merged));

      return {
        success: true,
        synced: cloudProfiles.length,
        message: `Synced ${cloudProfiles.length} profiles from cloud`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get storage statistics
   */
  getStats() {
    const profiles = this.getFromLocal();
    
    return {
      totalProfiles: profiles.length,
      totalSize: new Blob([JSON.stringify(profiles)]).size,
      sources: this.groupBy(profiles, 'source'),
      oldest: profiles.length > 0 ? 
        profiles.reduce((min, p) => new Date(p.createdAt) < new Date(min.createdAt) ? p : min).createdAt : 
        null,
      newest: profiles.length > 0 ? 
        profiles.reduce((max, p) => new Date(p.createdAt) > new Date(max.createdAt) ? p : max).createdAt : 
        null
    };
  }

  /**
   * Helper: Group array by key
   */
  groupBy(array, key) {
    return array.reduce((result, item) => {
      const value = item[key];
      result[value] = (result[value] || 0) + 1;
      return result;
    }, {});
  }
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
} else if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
}
