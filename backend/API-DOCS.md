# API Documentation

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

Get the token from Firebase Auth:
```javascript
const idToken = await user.getIdToken();
```

## Rate Limits

- General API: 10 requests per 15 minutes per IP
- Upload endpoint: 5 uploads per 15 minutes per IP

## Endpoints

### Health Check

#### GET /health

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45
}
```

#### GET /health/ready

Check if the API is ready (including Firebase connection).

**Response:**
```json
{
  "status": "ready",
  "firebase": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### PDF Processing

#### POST /pdf/upload

Upload and process a PDF resume.

**Auth:** Required

**Content-Type:** `multipart/form-data`

**Body:**
- `pdf` (file): PDF file (max 10MB)

**Example:**
```bash
curl -X POST http://localhost:3000/api/pdf/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "pdf=@resume.pdf"
```

**Response:**
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "PDF uploaded successfully. Processing started.",
  "status": "processing"
}
```

**Error Responses:**

- `400 Bad Request`: No file provided or invalid file type
- `401 Unauthorized`: Missing or invalid auth token
- `413 Payload Too Large`: File size exceeds 10MB
- `429 Too Many Requests`: Rate limit exceeded

---

#### GET /pdf/status/:jobId

Get the processing status of an uploaded PDF.

**Auth:** Required

**Parameters:**
- `jobId` (string): Job ID returned from upload

**Example:**
```bash
curl http://localhost:3000/api/pdf/status/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (Processing):**
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "message": "Extracting text from PDF..."
}
```

**Response (Completed):**
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "profile": {
    "$schema": "https://applicant-profile-protocol.org/schema/v1.0.0",
    "basics": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-555-0100",
      // ... full APP profile
    },
    "experience": [...],
    "education": [...],
    "skills": [...]
  },
  "confidence": 0.92,
  "metadata": {
    "ocrUsed": false,
    "processingTime": 5.2
  }
}
```

**Status Values:**
- `pending`: Job is queued
- `processing`: Extracting text from PDF
- `ocr`: Performing OCR (for scanned PDFs)
- `extracting`: Using AI to extract entities
- `mapping`: Mapping to APP format
- `completed`: Processing complete
- `failed`: Processing failed

**Error Response:**
```json
{
  "status": "failed",
  "error": "Failed to extract text from PDF"
}
```

---

### Profile Management

#### GET /profiles

List all profiles for the authenticated user.

**Auth:** Required

**Query Parameters:**
- `limit` (number, optional): Number of profiles per page (default: 20)
- `offset` (number, optional): Pagination offset (default: 0)

**Example:**
```bash
curl http://localhost:3000/api/profiles?limit=10&offset=0 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "profiles": [
    {
      "id": "profile123",
      "basics": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 5,
  "limit": 10,
  "offset": 0
}
```

---

#### GET /profiles/:id

Get a single profile by ID.

**Auth:** Required

**Parameters:**
- `id` (string): Profile ID

**Example:**
```bash
curl http://localhost:3000/api/profiles/profile123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "id": "profile123",
  "$schema": "https://applicant-profile-protocol.org/schema/v1.0.0",
  "basics": {
    "name": "John Doe",
    // ... full profile
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found`: Profile doesn't exist or doesn't belong to user

---

#### PUT /profiles/:id

Update a profile.

**Auth:** Required

**Parameters:**
- `id` (string): Profile ID

**Body:** Partial or complete APP profile object

**Example:**
```bash
curl -X PUT http://localhost:3000/api/profiles/profile123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "basics": {
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }'
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "profile": {
    "id": "profile123",
    // ... updated profile
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid profile data
- `404 Not Found`: Profile doesn't exist or doesn't belong to user

---

#### DELETE /profiles/:id

Delete a profile.

**Auth:** Required

**Parameters:**
- `id` (string): Profile ID

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/profiles/profile123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "message": "Profile deleted successfully"
}
```

**Error Responses:**
- `404 Not Found`: Profile doesn't exist or doesn't belong to user

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE",
  "details": {} // Optional additional details
}
```

### Common HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `413 Payload Too Large`: File size exceeds limit
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## Processing Pipeline

When you upload a PDF, the backend performs these steps:

1. **Upload** (1s): Save PDF to Firebase Storage
2. **Text Extraction** (2-5s): Extract text using pdf-parse
3. **OCR** (5-10s, if needed): Use Google Vision for scanned PDFs
4. **AI Extraction** (3-8s): Use OpenAI GPT-4 to extract entities
5. **Mapping** (1s): Transform to APP format
6. **Validation** (1s): Validate against APP schema
7. **Confidence Scoring** (1s): Calculate confidence with AI
8. **Save** (1s): Store in Firestore

**Total Time:** 5-30 seconds depending on PDF complexity

---

## Data Models

### APP Profile

Full schema: https://applicant-profile-protocol.org/schema/v1.0.0

Key sections:
- `$schema`: Schema version URL
- `basics`: Name, contact info, location, links
- `experience`: Work history
- `education`: Education history
- `skills`: Skills and proficiencies
- `projects`: Personal/professional projects
- `credentials`: Certifications and licenses
- `languages`: Language proficiencies
- `volunteer`: Volunteer work
- `publications`: Publications and papers
- `awards`: Awards and honors
- `interests`: Personal interests

### Job Status

```typescript
interface JobStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'ocr' | 'extracting' | 'mapping' | 'completed' | 'failed';
  profile?: APPProfile;
  confidence?: number;
  error?: string;
  metadata?: {
    ocrUsed: boolean;
    processingTime: number;
  };
}
```

---

## Frontend Integration

### JavaScript Example

```javascript
// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const app = initializeApp({ /* config */ });
const auth = getAuth(app);

// Sign in
const provider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, provider);
const idToken = await result.user.getIdToken();

// Upload PDF
const formData = new FormData();
formData.append('pdf', fileInput.files[0]);

const uploadResponse = await fetch('http://localhost:3000/api/pdf/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${idToken}`
  },
  body: formData
});

const { jobId } = await uploadResponse.json();

// Poll for status
async function checkStatus() {
  const response = await fetch(`http://localhost:3000/api/pdf/status/${jobId}`, {
    headers: {
      'Authorization': `Bearer ${idToken}`
    }
  });
  
  const data = await response.json();
  
  if (data.status === 'completed') {
    console.log('Profile:', data.profile);
    console.log('Confidence:', data.confidence);
  } else if (data.status === 'failed') {
    console.error('Error:', data.error);
  } else {
    setTimeout(checkStatus, 2000);
  }
}

checkStatus();
```

---

## Testing

### Test with cURL

```bash
# Health check
curl http://localhost:3000/api/health

# Upload (requires auth token)
TOKEN="your-firebase-id-token"
curl -X POST http://localhost:3000/api/pdf/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "pdf=@test-resume.pdf"

# Check status
curl http://localhost:3000/api/pdf/status/JOB_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Test with Postman

1. Import collection from `postman_collection.json`
2. Set environment variable `idToken` with your Firebase token
3. Run requests

---

## Security

### Authentication
- All protected endpoints require Firebase ID tokens
- Tokens are verified with Firebase Admin SDK
- Tokens expire after 1 hour (refresh automatically in client)

### Authorization
- Users can only access their own profiles
- Profiles are filtered by `userId` in Firestore queries

### Input Validation
- File type restricted to PDF
- File size limited to 10MB
- Profile data validated against APP schema

### Rate Limiting
- IP-based rate limiting prevents abuse
- Configurable limits in environment variables

### CORS
- Configured for specific origins only in production
- Use environment variable `CORS_ORIGINS`

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/your-repo/issues
- Documentation: https://applicant-profile-protocol.org
- Email: support@example.com
