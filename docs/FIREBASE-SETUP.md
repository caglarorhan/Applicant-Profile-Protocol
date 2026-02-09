# Firebase Configuration Example

This file shows how to set up Firebase for cloud storage in the PDF Resume Extractor.

## Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name (e.g., "app-profiles")
4. Follow setup wizard

### 2. Enable Firestore

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in production mode
4. Choose region (e.g., us-central1)

### 3. Enable Authentication

1. Go to "Authentication" in Firebase Console
2. Click "Get started"
3. Enable sign-in methods:
   - Email/Password
   - Google (recommended)

### 4. Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click "</>" (Web)
4. Register app
5. Copy configuration object

### 5. Add to HTML

Add Firebase SDK and configuration to `pdf-extractor.html`:

```html
<!-- Add before closing </body> tag -->

<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

<!-- Firebase Configuration -->
<script>
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize storage manager with Firebase
  const storage = new StorageManager();
  storage.initFirebase(firebaseConfig).then(success => {
    if (success) {
      console.log('Firebase initialized successfully');
      // Enable cloud storage option
      document.getElementById('storageFirebase').classList.remove('disabled');
    }
  });
</script>
```

## Firestore Security Rules

Set up security rules in Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - only accessible by the owner
    match /users/{userId}/profiles/{profileId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Ensure data has required fields
      allow create: if request.auth != null 
                    && request.auth.uid == userId
                    && request.resource.data.keys().hasAll(['userId', 'profileId', 'data']);
      
      // Allow update only if owner
      allow update: if request.auth != null 
                    && request.auth.uid == userId
                    && request.resource.data.userId == userId;
    }
    
    // User metadata
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Environment Variables (Recommended)

For better security, use environment variables:

### Development (.env.local)

```bash
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### Load in JavaScript

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## Authentication Setup

### Email/Password Sign-In

```javascript
// Sign up
const result = await storage.auth.createUserWithEmailAndPassword(email, password);

// Sign in
const result = await storage.signIn(email, password);

// Sign out
await storage.signOut();
```

### Google Sign-In

```javascript
// Sign in with Google popup
const result = await storage.signInWithGoogle();

if (result.success) {
  console.log('Signed in as:', result.user.displayName);
  // Enable cloud storage features
} else {
  console.error('Sign-in failed:', result.error);
}
```

### Authentication State Listener

```javascript
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    console.log('User:', user.displayName, user.email);
    document.getElementById('storageFirebase').classList.remove('disabled');
    // Load user's profiles from cloud
    storage.getFromFirestore().then(result => {
      if (result.success) {
        console.log('Loaded', result.profiles.length, 'profiles from cloud');
      }
    });
  } else {
    // User is signed out
    console.log('User signed out');
    document.getElementById('storageFirebase').classList.add('disabled');
  }
});
```

## Data Structure

### Firestore Collections

```
/users/{userId}
  /profiles/{profileId}
    - userId: string
    - userEmail: string
    - profileId: string
    - name: string
    - email: string
    - createdAt: timestamp
    - updatedAt: timestamp
    - source: string
    - confidence: number
    - data: object (full APP JSON)
```

### Example Document

```javascript
{
  userId: "abc123def456",
  userEmail: "user@example.com",
  profileId: "12345678-1234-4123-y123-123456789012",
  name: "John Doe",
  email: "john.doe@example.com",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  source: "pdf-extractor",
  confidence: 85,
  data: {
    protocol: { ... },
    basics: { ... },
    experience: [ ... ],
    education: [ ... ],
    skills: [ ... ],
    // ... full APP JSON
  }
}
```

## Usage Limits

### Firebase Free Tier (Spark Plan)

- **Firestore**: 1 GB storage, 50K reads/day, 20K writes/day
- **Authentication**: Unlimited users
- **Hosting**: 10 GB storage, 360 MB/day transfer

### Monitoring Usage

Check usage in Firebase Console:
1. Go to "Usage and billing"
2. Monitor daily/monthly quotas
3. Set up budget alerts

## Testing

### Local Testing

Use Firebase Emulator Suite for local development:

```bash
npm install -g firebase-tools
firebase login
firebase init emulators
firebase emulators:start
```

Point your app to emulators:

```javascript
if (location.hostname === "localhost") {
  firebase.firestore().useEmulator("localhost", 8080);
  firebase.auth().useEmulator("http://localhost:9099");
}
```

## Troubleshooting

### Common Issues

**Error: Missing or insufficient permissions**
- Check Firestore security rules
- Ensure user is authenticated
- Verify userId matches request.auth.uid

**Error: Firebase app not initialized**
- Ensure Firebase SDK is loaded
- Call firebase.initializeApp() with valid config
- Check browser console for errors

**Error: Quota exceeded**
- Check Firebase Console usage
- Upgrade to Blaze (pay-as-you-go) plan
- Optimize read/write operations

### Debug Mode

Enable debug logging:

```javascript
firebase.firestore().settings({
  experimentalForceLongPolling: true,
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

// Enable debug logging
firebase.firestore.setLogLevel('debug');
```

## Best Practices

1. **Never commit** Firebase config to public repos
2. **Use environment variables** for sensitive data
3. **Implement rate limiting** to prevent abuse
4. **Validate data** before writing to Firestore
5. **Index frequently queried fields**
6. **Use batch writes** for multiple operations
7. **Implement offline persistence** for better UX
8. **Monitor usage** and costs regularly
9. **Backup data** periodically
10. **Test security rules** thoroughly

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Authentication Guide](https://firebase.google.com/docs/auth/web/start)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)

---

**Note**: Firebase configuration is optional. The PDF extractor works perfectly with localStorage alone if you don't need cloud sync features.
