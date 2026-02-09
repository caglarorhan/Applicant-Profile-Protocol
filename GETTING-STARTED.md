# 🚀 Getting Started with PDF Extractor

Extract resume data from PDF files with AI in just a few steps!

## What You'll Get

Upload a PDF resume and get back a structured APP JSON profile with:
- ✅ Contact information (name, email, phone, location, links)
- ✅ Work experience with dates and descriptions
- ✅ Education history
- ✅ Skills and proficiencies
- ✅ Projects and certifications
- ✅ Languages spoken
- ✅ Confidence score (90-95% accuracy)

## Prerequisites

- **Node.js 18+** ([download](https://nodejs.org/))
- **Firebase account** ([create free](https://console.firebase.google.com/))
- **OpenAI API key** ([get key](https://platform.openai.com/))
- **Google Cloud account** ([sign up](https://console.cloud.google.com/))

## Installation (5 minutes)

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it (e.g., "resume-extractor")
4. Enable these services:
   - **Firestore Database** → Create database → Start in production mode
   - **Storage** → Get started
   - **Authentication** → Get started → Enable Google sign-in

### 3. Download Firebase Credentials

1. Go to Project Settings (gear icon)
2. Click **Service Accounts** tab
3. Click **Generate New Private Key**
4. Save JSON file

### 4. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Click **API Keys** in sidebar
3. Click **Create new secret key**
4. Copy the key (starts with `sk-proj-...`)

### 5. Enable Google Cloud Vision

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Search for "Cloud Vision API"
4. Click **Enable**
5. Go to **IAM & Admin** → **Service Accounts**
6. Click **Create Service Account**
7. Name it "vision-ocr"
8. Grant role: **Cloud Vision API User**
9. Click **Done**
10. Click on the service account
11. Go to **Keys** tab → **Add Key** → **Create new key** → **JSON**
12. Save JSON file

### 6. Configure Environment

Create a `.env` file in the `backend/` folder:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server
PORT=3000
NODE_ENV=development

# Firebase - From the service account JSON you downloaded
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# OpenAI - Your API key
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Cloud - Path to the JSON key file
GOOGLE_APPLICATION_CREDENTIALS=./config/google-cloud-key.json
```

**Important:** Copy your Google Cloud Vision JSON key to `backend/config/google-cloud-key.json`

### 7. Start the Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 3000
✓ Firebase initialized successfully
```

## Using the Tool

### Option 1: Web Interface (Recommended)

1. **Open the frontend:**
   - Open `public/tools/pdf-extractor-backend.html` in your browser
   - Or serve it: `npx http-server public -p 8080`

2. **Configure Firebase in frontend:**
   - Open `public/tools/pdf-extractor-backend.html` in a text editor
   - Find the `firebaseConfig` object (around line 400)
   - Replace with your Firebase config:
     - Get it from: Firebase Console → Project Settings → General → Your apps
     - Click "Add app" if needed, choose Web (</>) icon

3. **Upload a resume:**
   - Click "Sign in with Google"
   - Drop a PDF file or click to browse
   - Watch the progress bar as AI extracts data
   - Download the APP JSON profile

### Option 2: API (For Developers)

```bash
# 1. Get Firebase ID Token
# Sign in at frontend first, or use Firebase Admin SDK

# 2. Upload PDF
curl -X POST http://localhost:3000/api/pdf/upload \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -F "pdf=@resume.pdf"

# Response:
# {"jobId": "550e8400-e29b-41d4-a716-446655440000", "status": "processing"}

# 3. Check status (poll every 2 seconds)
curl http://localhost:3000/api/pdf/status/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"

# When complete, you get the full APP JSON profile!
```

## How It Works

```
1. Upload PDF (1s)
   ↓
2. Extract text with pdf-parse (2-5s)
   ↓
3. If scanned, perform OCR with Google Vision (5-10s)
   ↓
4. Extract entities with OpenAI GPT-4 (3-8s)
   - Contact info
   - Work experience
   - Education
   - Skills
   - Projects
   - Certifications
   - Languages
   ↓
5. Map to APP format (1s)
   ↓
6. Validate against schema (1s)
   ↓
7. Calculate confidence score (1s)
   ↓
8. Save to Firestore (1s)
   ↓
✅ Done! (5-30 seconds total)
```

## What You Can Do With the Result

Once you have the APP JSON profile:

1. **Download JSON** — Save to file
2. **Copy to Clipboard** — Paste into other apps
3. **Open in Builder** — Edit in the APP Profile Builder
4. **Convert to other formats:**
   - JSON Resume
   - Europass XML
   - HR-XML
   - LinkedIn format

## Costs

For **100 PDF resumes:**

| Service | Cost |
|---------|------|
| OpenAI GPT-4 | ~$1.00 |
| Google Vision OCR | ~$0.15 (first 1000 free!) |
| Firebase | ~$0.50 |
| **Total** | **~$1.65** |

**Free tier:** Google Vision gives you 1,000 OCR pages/month for free!

## Troubleshooting

### "Cannot connect to Firebase"

Check your `.env` file:
- `FIREBASE_PROJECT_ID` matches your Firebase project
- `FIREBASE_PRIVATE_KEY` includes the full key with `\n` line breaks
- `FIREBASE_CLIENT_EMAIL` matches your service account

### "OpenAI API key invalid"

- Copy the key exactly (starts with `sk-proj-`)
- Make sure you have billing enabled at OpenAI
- Check you're using the right key (not an old one)

### "Google Vision error"

- Ensure Vision API is enabled in Google Cloud Console
- Check the JSON key file is in `backend/config/google-cloud-key.json`
- Verify the service account has "Cloud Vision API User" role

### "Rate limit exceeded"

You've hit the rate limit (10 uploads per 15 minutes by default).

Wait 15 minutes, or increase the limit in `.env`:
```env
UPLOAD_RATE_LIMIT_MAX=20
```

### "Port 3000 already in use"

Another app is using port 3000.

Change the port in `.env`:
```env
PORT=3001
```

Then update the frontend `API_BASE_URL` to `http://localhost:3001/api`

## Next Steps

- ✅ **Read the full API docs:** [backend/API-DOCS.md](backend/API-DOCS.md)
- ✅ **Deploy to production:** [backend/README.md](backend/README.md#deployment)
- ✅ **Integrate into your app:** See API examples above
- ✅ **Customize extraction:** Edit OpenAI prompts in `config/openai.config.js`

## Support

- **Documentation:** [backend/README.md](backend/README.md)
- **Issues:** [GitHub Issues](https://github.com/caglarorhan/Applicant-Profile-Protocol/issues)
- **Questions:** [GitHub Discussions](https://github.com/caglarorhan/Applicant-Profile-Protocol/discussions)

---

**Happy extracting! 🎉**

Need help? Open an issue or check the docs linked above.
