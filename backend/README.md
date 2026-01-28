# Backend Setup Guide

## Prerequisites

1. **Node.js** 18+ installed
2. **Firebase Project** created
3. **OpenAI API Key**
4. **Google Cloud Project** with Vision API enabled
5. **Redis** (optional, for queue)

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server
PORT=3000
NODE_ENV=development

# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx
OPENAI_MODEL=gpt-4-turbo-preview

# Google Cloud Vision
GOOGLE_APPLICATION_CREDENTIALS=./config/google-cloud-key.json
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project
```

## Step 3: Firebase Setup

### Get Firebase Admin Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Save JSON file as `config/firebase-admin-key.json`
6. Extract values for `.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

### Enable Services

1. **Firestore**: Database > Create Database
2. **Storage**: Storage > Get Started
3. **Authentication**: Authentication > Get Started > Enable Email/Password and Google

### Security Rules

**Firestore** (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /profiles/{profileId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /jobs/{jobId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

**Storage** (`storage.rules`):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 4: OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create API Key
3. Add to `.env` as `OPENAI_API_KEY`

## Step 5: Google Cloud Vision Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Cloud Vision API
4. Create Service Account:
   - IAM & Admin > Service Accounts > Create
   - Grant "Cloud Vision API User" role
   - Create JSON key
5. Save key as `backend/config/google-cloud-key.json`
6. Add path to `.env` as `GOOGLE_APPLICATION_CREDENTIALS`

## Step 6: Start Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server will start on `http://localhost:3000`

## Step 7: Test API

### Health Check

```bash
curl http://localhost:3000/api/health
```

### Upload PDF (requires auth token)

```bash
curl -X POST http://localhost:3000/api/pdf/upload \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -F "pdf=@resume.pdf"
```

## API Endpoints

### Public Endpoints

- `GET /api` - API documentation
- `GET /api/health` - Health check
- `GET /api/health/ready` - Readiness check

### Protected Endpoints (require authentication)

- `POST /api/pdf/upload` - Upload and process PDF
- `GET /api/pdf/status/:jobId` - Get processing status
- `GET /api/profiles` - List user's profiles
- `GET /api/profiles/:id` - Get single profile
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile

## Authentication

### Get Firebase ID Token (Frontend)

```javascript
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const idToken = await userCredential.user.getIdToken();

// Use token in API requests
fetch('http://localhost:3000/api/pdf/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${idToken}`
  },
  body: formData
});
```

## Troubleshooting

### Firebase Connection Error

**Error**: `Failed to initialize Firebase Admin SDK`

**Solution**:
- Check `.env` values match Firebase console
- Ensure `FIREBASE_PRIVATE_KEY` includes newlines (`\n`)
- Verify service account has correct permissions

### OpenAI API Error

**Error**: `OpenAI API key invalid`

**Solution**:
- Verify API key in OpenAI dashboard
- Check billing is enabled
- Ensure key has correct permissions

### Google Vision Error

**Error**: `Could not load the default credentials`

**Solution**:
- Check `GOOGLE_APPLICATION_CREDENTIALS` path is correct
- Ensure JSON key file exists
- Verify Vision API is enabled in GCP project

### Rate Limit Error

**Error**: `Too many requests`

**Solution**:
- Adjust `RATE_LIMIT_MAX_REQUESTS` in `.env`
- Wait for rate limit window to reset
- Consider upgrading to paid tier

## Deployment

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create app-pdf-extractor

# Set env vars
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set FIREBASE_PROJECT_ID=...

# Deploy
git push heroku main
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
docker build -t app-pdf-extractor .
docker run -p 3000:3000 --env-file .env app-pdf-extractor
```

## Monitoring

### Logs

```bash
# View logs
npm start | tee app.log

# In production
pm2 start server.js --name app-pdf-extractor
pm2 logs app-pdf-extractor
```

### Metrics

Add monitoring with:
- Datadog
- New Relic
- Google Cloud Monitoring

## Security Checklist

- [ ] Environment variables not committed to git
- [ ] Firebase security rules configured
- [ ] Rate limiting enabled
- [ ] CORS configured properly
- [ ] Helmet security headers enabled
- [ ] File upload size limits set
- [ ] Authentication required for sensitive endpoints
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] HTTPS enabled in production

## Performance Optimization

1. **Enable Redis for Queue**: Speeds up async processing
2. **CDN for Static Files**: Use Cloud Storage + CDN
3. **Caching**: Implement caching for frequent queries
4. **Horizontal Scaling**: Deploy multiple instances
5. **Database Indexing**: Index Firestore queries

## Cost Estimation

### Firebase (Blaze Plan - Pay as you go)

- Firestore: $0.18/GB storage, $0.06 per 100K reads
- Storage: $0.026/GB
- Authentication: Free

### OpenAI

- GPT-4 Turbo: ~$0.01 per resume (1K-2K tokens)
- Budget ~$10/month for 1000 resumes

### Google Cloud Vision

- OCR: $1.50 per 1000 pages
- First 1000 free/month

### Total for 1000 resumes/month

- ~$20-30/month with moderate usage
- Scale up as needed

---

**Ready to go!** 🚀

Next: [Update Frontend](./FRONTEND-UPDATE.md)
