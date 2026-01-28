# Quick Start Guide

Get the PDF Extractor backend running in 5 minutes!

## Step 1: Install Node.js

Download and install Node.js 18+ from [nodejs.org](https://nodejs.org/)

## Step 2: Install Dependencies

```bash
cd backend
npm install
```

## Step 3: Set Up Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable these services:
   - **Firestore Database**
   - **Storage**
   - **Authentication** (Email/Password + Google)
3. Download service account key:
   - Project Settings → Service Accounts → Generate New Private Key
   - Save as `config/firebase-admin-key.json`

## Step 4: Get API Keys

### OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com/)
2. Create API key
3. Copy the key (starts with `sk-proj-...`)

### Google Cloud Vision
1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Enable "Cloud Vision API"
3. Create Service Account → Download JSON key
4. Save as `config/google-cloud-key.json`

## Step 5: Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Firebase - Get from firebase-admin-key.json
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=./config/google-cloud-key.json
```

## Step 6: Start Server

```bash
npm run dev
```

Server starts at: **http://localhost:3000**

## Step 7: Test

Open your browser: **http://localhost:3000/api/health**

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 1.23
}
```

## Step 8: Update Frontend

Edit `public/tools/pdf-extractor-backend.html`:

```javascript
// Replace with your Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

Get Firebase config from: **Project Settings → General → Your apps → Firebase SDK snippet**

## Step 9: Open Frontend

Open `public/tools/pdf-extractor-backend.html` in your browser

1. Click "Sign in with Google"
2. Upload a PDF resume
3. Watch the AI extract data!

---

## Troubleshooting

### "Cannot connect to Firebase"
- Check `.env` values match `firebase-admin-key.json`
- Ensure Firestore and Storage are enabled

### "OpenAI API Error"
- Verify API key is correct
- Check you have billing enabled at OpenAI

### "Google Vision Error"
- Ensure Vision API is enabled in GCP
- Check `google-cloud-key.json` path is correct

### "Port 3000 already in use"
- Change `PORT=3001` in `.env`
- Update `API_BASE_URL` in frontend

---

## What's Next?

✅ Backend is running!
✅ Frontend can upload PDFs
✅ AI extracts resume data

### Optional Enhancements:

1. **Add Redis for Queue** (optional, for better performance)
   ```bash
   # Install Redis
   # Windows: https://github.com/tporadowski/redis/releases
   # Mac: brew install redis
   # Linux: apt-get install redis-server
   
   # Update .env
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

2. **Deploy to Production**
   - See [README.md](./README.md) for deployment guides

3. **Monitor Usage**
   - Check Firebase Console for storage/database usage
   - Monitor OpenAI API usage and costs

---

## Cost Estimates

For **1000 PDF resumes/month**:

| Service | Cost |
|---------|------|
| Firebase Firestore | ~$2 |
| Firebase Storage | ~$1 |
| OpenAI GPT-4 | ~$10 |
| Google Vision OCR | ~$1.50 |
| **Total** | **~$15/month** |

*First 1000 Vision API calls are free!*

---

**Need help?** Check [README.md](./README.md) for detailed documentation or open an issue on GitHub.
