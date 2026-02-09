# PDF Resume Extractor

AI-powered resume extraction tool that converts PDF resumes into structured Applicant Profile Protocol (APP) JSON format.

## Features

### 🚀 Complete Processing Pipeline

```
PDF → Text Extraction → OCR (optional) → Section Detection → 
Entity Extraction → Normalization → APP Mapping → 
Schema Validation → Confidence Scoring
```

### 📊 Intelligent Extraction

- **Text Extraction**: Uses PDF.js to extract text from PDF files
- **OCR Support**: Optional OCR for scanned documents
- **Section Detection**: Automatically identifies resume sections (experience, education, skills, etc.)
- **Entity Recognition**: Extracts contact info, skills, dates, and more
- **Data Normalization**: Cleans and standardizes extracted data
- **APP Mapping**: Converts to standard APP JSON format
- **Schema Validation**: Ensures compliance with APP schema
- **Confidence Scoring**: Provides quality metrics for extracted data

### 💾 Flexible Storage

- **Local Storage**: Save profiles to browser localStorage (no account needed)
- **Cloud Storage**: Save to Firebase/Firestore (requires authentication)
- **Sync**: Sync profiles between local and cloud storage
- **Export**: Download profiles as JSON files
- **Import**: Restore from JSON backups

## How to Use

### 1. Upload PDF Resume

- Click the drop zone or drag & drop a PDF file
- Supports single or multi-page resumes
- Displays file info (name, size)

### 2. Process

Click "Process PDF" to start the extraction pipeline:

1. **Text Extraction** - Extracts text from PDF pages
2. **OCR Processing** - Optional, for scanned documents
3. **Section Detection** - Identifies resume sections
4. **Entity Extraction** - Pulls out contact info, skills, etc.
5. **Data Normalization** - Cleans and formats data
6. **APP Mapping** - Converts to APP JSON format
7. **Schema Validation** - Checks against APP schema
8. **Confidence Scoring** - Calculates quality score

### 3. Review Results

View extracted data in multiple formats:

- **APP JSON**: Standard APP profile format
- **Extracted Entities**: All detected entities with confidence scores
- **Raw Text**: Original extracted text

Key metrics displayed:
- Overall confidence score (0-100%)
- Section counts (experience, education, skills, etc.)
- Individual entity confidence scores

### 4. Save Profile

Choose storage option:

- **Local Storage**: Saves to browser (offline-capable)
- **Cloud Storage**: Saves to Firebase/Firestore (requires login)

## Technical Details

### Architecture

The tool consists of three main components:

1. **pdf-extractor.html** - User interface
2. **pdf-processor.js** - Core extraction logic
3. **storage-manager.js** - Data persistence

### Dependencies

- **PDF.js** (v3.11.174+) - PDF text extraction
- **Firebase SDK** (optional) - Cloud storage

### Extraction Algorithm

#### Section Detection

Identifies common resume sections using keyword matching:
- Contact Information
- Summary/Objective
- Work Experience
- Education
- Skills
- Projects
- Certifications
- Languages
- Awards
- Publications

#### Entity Recognition

Extracts structured data using regex patterns:
- **Email**: Standard email validation
- **Phone**: International phone formats
- **URLs**: Web addresses (LinkedIn, GitHub, personal sites)
- **Dates**: Various date formats (MM/YYYY, Month Year, etc.)
- **Skills**: 50+ common technical skills
- **Degrees**: PhD, Masters, Bachelors, etc.

#### Confidence Scoring

Calculates confidence based on:
- **Basics** (40%): Contact information completeness
- **Skills** (30%): Number and relevance of skills
- **Experience** (20%): Work history entries
- **Education** (10%): Educational background

## Firebase Setup (Optional)

To enable cloud storage:

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (Email/Google)
4. Add Firebase configuration to the page

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize storage manager with Firebase
const storage = new StorageManager();
await storage.initFirebase(firebaseConfig);
```

### Security Rules

Recommended Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/profiles/{profileId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## API Reference

### PDFProcessor

```javascript
const processor = new PDFProcessor();

// Process PDF file
const result = await processor.process(pdfFile, options);

// Result structure
{
  text: string,              // Extracted text
  sections: object,          // Detected sections
  entities: object,          // Extracted entities
  normalized: object,        // Normalized data
  appProfile: object,        // APP JSON format
  validation: object,        // Validation results
  confidence: object         // Confidence scores
}
```

### StorageManager

```javascript
const storage = new StorageManager();

// Local Storage
storage.saveToLocal(profile, metadata);
storage.getFromLocal();
storage.getLocalById(id);
storage.deleteFromLocal(id);
storage.exportLocal();
storage.importLocal(jsonData);

// Cloud Storage (requires Firebase)
await storage.initFirebase(config);
await storage.saveToFirestore(profile, metadata);
await storage.getFromFirestore();
await storage.getFirestoreById(id);
await storage.deleteFromFirestore(id);

// Sync
await storage.syncToCloud();
await storage.syncFromCloud();

// Stats
storage.getStats();
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires:
- ES6+ support
- localStorage API
- FileReader API
- Blob API

## Limitations

### Current Limitations

1. **Text-Based PDFs Only**: Works best with PDFs that have selectable text
2. **English Language**: Optimized for English resumes
3. **Standard Formats**: Works best with traditional resume layouts
4. **Client-Side Processing**: Large PDFs may be slow
5. **Pattern-Based**: Uses regex patterns, not true AI/ML

### Known Issues

- Complex multi-column layouts may have text ordering issues
- Scanned PDFs require OCR (not yet implemented)
- Custom resume formats may not be recognized
- Date formats vary internationally

## Future Enhancements

### Planned Features

- [ ] True OCR integration (Tesseract.js)
- [ ] Machine learning-based entity extraction
- [ ] Multi-language support
- [ ] Advanced layout analysis
- [ ] Resume quality scoring
- [ ] Duplicate detection
- [ ] Batch processing
- [ ] Browser extension version
- [ ] Mobile app version

### Browser Extension

A browser extension is planned that will:
- Process PDFs without uploading
- Keep all data on user's machine
- Work offline
- Integrate with job boards
- Auto-fill application forms

## Privacy & Security

### Data Privacy

- **Local First**: All processing happens in the browser
- **No Server Upload**: PDFs never leave your machine
- **Optional Cloud**: Cloud storage is opt-in
- **User Control**: You own your data

### Security Best Practices

1. Never share Firebase credentials
2. Use authentication for cloud storage
3. Implement proper Firestore security rules
4. Regularly backup local storage
5. Clear sensitive data after use

## Contributing

To improve the PDF extractor:

1. Enhance entity recognition patterns
2. Add support for more resume formats
3. Improve section detection accuracy
4. Add multi-language support
5. Optimize performance for large PDFs

## License

Part of the Applicant Profile Protocol project.
See main LICENSE file for details.

## Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check the documentation at app-protocol.org
- Review example resumes in /examples

---

**Note**: This tool is in active development. Extraction accuracy will improve over time with community feedback and contributions.
