# Environment Variables Setup for Railway

This document explains how to set up your environment variables for deployment on Railway.

## Required Environment Variables

### 1. Firebase Admin SDK

Get these from your Firebase Console > Project Settings > Service Accounts:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

**Important**: When adding `FIREBASE_PRIVATE_KEY` to Railway:
- Keep the quotes around the value
- Keep the `\n` characters as-is (they represent newlines)
- Or alternatively, upload the entire `firebase-admin-key.json` file and reference it

### 2. OpenAI API

Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys):

```
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```

### 3. Google Cloud Vision API

Uses the same Firebase credentials:

```
GOOGLE_CLOUD_PROJECT_ID=your-firebase-project-id
```

### 4. Server Configuration

```
PORT=3000
NODE_ENV=production
```

### 5. Rate Limiting

```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
```

### 6. File Upload Limits

```
MAX_FILE_SIZE_MB=10
ALLOWED_FILE_TYPES=application/pdf
```

### 7. CORS

```
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://app-protocol.org
```

### 8. Redis (for Bull Queue)

Railway provides a Redis addon. After adding it, use:

```
REDIS_HOST=your-railway-redis-host
REDIS_PORT=6379
```

## How to Add Variables to Railway

### Option 1: Through Railway Dashboard

1. Go to your Railway project
2. Select your service
3. Click on the "Variables" tab
4. Click "New Variable"
5. Add each variable name and value
6. Click "Add" for each variable
7. Railway will automatically redeploy

### Option 2: Using Railway CLI

```bash
railway variables set FIREBASE_PROJECT_ID=your-project-id
railway variables set OPENAI_API_KEY=your-api-key
# ... etc for each variable
```

### Option 3: Bulk Import

1. Create a file with your variables (one per line):
   ```
   FIREBASE_PROJECT_ID=your-project-id
   OPENAI_API_KEY=your-api-key
   ```
2. In Railway dashboard, click "Raw Editor" in the Variables tab
3. Paste all variables
4. Click "Update Variables"

## Security Notes

- **Never commit** `.env` files or `firebase-admin-key.json` to git
- These files are already in `.gitignore`
- Keep your API keys secure and rotate them regularly
- Use Railway's environment variable encryption for sensitive data

## Local Development

For local development:

1. Copy the example files:
   ```bash
   cd backend
   cp .env.example .env
   cp config/firebase-admin-key.example.json config/firebase-admin-key.json
   ```

2. Edit the files with your actual credentials

3. Never commit these files (they're gitignored)

## Verifying Your Setup

After setting up variables on Railway:

1. Check the deployment logs for any missing environment variable errors
2. Test the `/health` endpoint to verify services are initialized
3. Monitor the logs for connection issues with Firebase, OpenAI, or Redis
