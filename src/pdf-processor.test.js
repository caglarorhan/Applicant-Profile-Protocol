/**
 * PDF Processor Test Suite
 * Tests for the PDF resume extraction functionality
 */

// Mock PDF text for testing
const mockResumeText = `
John Doe
john.doe@example.com | (555) 123-4567 | linkedin.com/in/johndoe | github.com/johndoe
San Francisco, CA

PROFESSIONAL SUMMARY
Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. 
Passionate about building scalable applications and mentoring junior developers.

WORK EXPERIENCE

Senior Software Engineer
Tech Corp Inc. | San Francisco, CA
January 2020 - Present
- Led development of microservices architecture serving 10M+ daily users
- Reduced API response time by 40% through performance optimization
- Mentored team of 5 junior engineers
- Tech stack: Node.js, React, AWS, Docker, Kubernetes

Software Engineer
StartupXYZ | San Francisco, CA
June 2017 - December 2019
- Built RESTful APIs and React-based web applications
- Implemented CI/CD pipeline reducing deployment time by 60%
- Collaborated with product team on feature design
- Tech stack: Python, Django, React, PostgreSQL

Junior Developer
WebSolutions LLC | Remote
March 2016 - May 2017
- Developed responsive websites using HTML, CSS, JavaScript
- Fixed bugs and implemented new features
- Participated in code reviews and agile sprints

EDUCATION

Bachelor of Science in Computer Science
University of California, Berkeley | Berkeley, CA
Graduated: May 2016 | GPA: 3.7/4.0
- Dean's List (4 semesters)
- President of Computer Science Club

SKILLS

Programming Languages: JavaScript, TypeScript, Python, Java, Go
Frontend: React, Vue.js, Angular, HTML, CSS, Tailwind
Backend: Node.js, Express, Django, Flask, Spring Boot
Databases: PostgreSQL, MongoDB, Redis, MySQL
Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins, GitLab CI/CD
Tools: Git, JIRA, Figma, VS Code

PROJECTS

E-Commerce Platform
Personal Project | github.com/johndoe/ecommerce
- Built full-stack e-commerce platform with Next.js and Stripe integration
- Implemented shopping cart, payment processing, and order management
- Tech: Next.js, TypeScript, Prisma, PostgreSQL, Stripe

CERTIFICATIONS

AWS Certified Solutions Architect - Associate
Amazon Web Services | Issued: January 2022

LANGUAGES

English - Native
Spanish - Professional Working Proficiency
French - Elementary Proficiency
`;

// Test Suite
class PDFProcessorTests {
  constructor() {
    this.processor = new PDFProcessor();
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  async runAll() {
    console.log('🧪 Starting PDF Processor Tests...\n');

    await this.testSectionDetection();
    await this.testEntityExtraction();
    await this.testExperienceParsing();
    await this.testEducationParsing();
    await this.testSkillsParsing();
    await this.testProjectsParsing();
    await this.testNormalization();
    await this.testAPPMapping();
    await this.testValidation();
    await this.testConfidenceScoring();

    this.printSummary();
  }

  // Test: Section Detection
  async testSectionDetection() {
    console.log('📋 Test: Section Detection');
    
    try {
      const sections = this.processor.detectSections(mockResumeText);
      
      this.assert(sections.raw.experience, 'Should detect experience section');
      this.assert(sections.raw.education, 'Should detect education section');
      this.assert(sections.raw.skills, 'Should detect skills section');
      this.assert(sections.raw.projects, 'Should detect projects section');
      this.assert(sections.raw.certifications, 'Should detect certifications section');
      this.assert(sections.raw.languages, 'Should detect languages section');
      
      console.log('✅ Section detection passed\n');
      this.passed++;
    } catch (error) {
      console.error('❌ Section detection failed:', error.message, '\n');
      this.failed++;
    }
  }

  // Test: Entity Extraction
  async testEntityExtraction() {
    console.log('🔍 Test: Entity Extraction');
    
    try {
      const sections = this.processor.detectSections(mockResumeText);
      const entities = this.processor.extractEntities(mockResumeText, sections);
      
      this.assertEqual(entities.contact.email, 'john.doe@example.com', 'Should extract email');
      this.assert(entities.contact.phone, 'Should extract phone');
      this.assert(entities.contact.name, 'Should extract name');
      this.assert(entities.contact.linkedin, 'Should extract LinkedIn URL');
      this.assert(entities.contact.github, 'Should extract GitHub URL');
      this.assert(entities.contact.location, 'Should extract location');
      
      console.log('✅ Entity extraction passed\n');
      this.passed++;
    } catch (error) {
      console.error('❌ Entity extraction failed:', error.message, '\n');
      this.failed++;
    }
  }

  // Test: Experience Parsing
  async testExperienceParsing() {
    console.log('💼 Test: Experience Parsing');
    
    try {
      const sections = this.processor.detectSections(mockResumeText);
      const experiences = this.processor.parseExperience(sections.raw.experience);
      
      this.assert(experiences.length >= 3, 'Should find at least 3 work experiences');
      this.assert(experiences[0].title, 'Should extract job title');
      this.assert(experiences[0].highlights.length > 0, 'Should extract highlights/bullets');
      
      console.log('✅ Experience parsing passed\n');
      this.passed++;
    } catch (error) {
      console.error('❌ Experience parsing failed:', error.message, '\n');
      this.failed++;
    }
  }

  // Test: Education Parsing
  async testEducationParsing() {
    console.log('🎓 Test: Education Parsing');
    
    try {
      const sections = this.processor.detectSections(mockResumeText);
      const education = this.processor.parseEducation(sections.raw.education);
      
      this.assert(education.length >= 1, 'Should find at least 1 education entry');
      this.assert(education[0].institution, 'Should extract institution');
      this.assert(education[0].degree, 'Should extract degree');
      this.assertEqual(education[0].gpa, '3.7', 'Should extract GPA');
      
      console.log('✅ Education parsing passed\n');
      this.passed++;
    } catch (error) {
      console.error('❌ Education parsing failed:', error.message, '\n');
      this.failed++;
    }
  }

  // Test: Skills Parsing
  async testSkillsParsing() {
    console.log('🛠️ Test: Skills Parsing');
    
    try {
      const sections = this.processor.detectSections(mockResumeText);
      const skills = this.processor.parseSkills(sections.raw.skills);
      
      this.assert(skills.length > 10, 'Should extract at least 10 skills');
      
      // Check for specific skills
      const skillNames = skills.map(s => s.name.toLowerCase());
      this.assert(skillNames.some(s => s.includes('javascript')), 'Should find JavaScript');
      this.assert(skillNames.some(s => s.includes('react')), 'Should find React');
      this.assert(skillNames.some(s => s.includes('python')), 'Should find Python');
      
      console.log('✅ Skills parsing passed\n');
      this.passed++;
    } catch (error) {
      console.error('❌ Skills parsing failed:', error.message, '\n');
      this.failed++;
    }
  }

  // Test: Projects Parsing
  async testProjectsParsing() {
    console.log('📦 Test: Projects Parsing');
    
    try {
      const sections = this.processor.detectSections(mockResumeText);
      const projects = this.processor.parseProjects(sections.raw.projects);
      
      this.assert(projects.length >= 1, 'Should find at least 1 project');
      this.assert(projects[0].name, 'Should extract project name');
      this.assert(projects[0].url, 'Should extract project URL');
      
      console.log('✅ Projects parsing passed\n');
      this.passed++;
    } catch (error) {
      console.error('❌ Projects parsing failed:', error.message, '\n');
      this.failed++;
    }
  }

  // Test: Data Normalization
  async testNormalization() {
    console.log('🔧 Test: Data Normalization');
    
    try {
      const sections = this.processor.detectSections(mockResumeText);
      const entities = this.processor.extractEntities(mockResumeText, sections);
      const normalized = this.processor.normalizeData(entities);
      
      this.assertEqual(normalized.contact.email, normalized.contact.email.toLowerCase(), 
        'Email should be lowercase');
      this.assert(normalized.contact.name.match(/^[A-Z]/), 
        'Name should be title-cased');
      
      if (normalized.contact.linkedin) {
        this.assert(normalized.contact.linkedin.startsWith('http'), 
          'URLs should have protocol');
      }
      
      console.log('✅ Normalization passed\n');
      this.passed++;
    } catch (error) {
      console.error('❌ Normalization failed:', error.message, '\n');
      this.failed++;
    }
  }

  // Test: APP Mapping
  async testAPPMapping() {
    console.log('🗺️ Test: APP Mapping');
    
    try {
      const sections = this.processor.detectSections(mockResumeText);
      const entities = this.processor.extractEntities(mockResumeText, sections);
      const normalized = this.processor.normalizeData(entities);
      const appProfile = this.processor.mapToAPP(normalized, sections);
      
      // Check protocol
      this.assertEqual(appProfile.protocol.name, 'ApplicantProfileProtocol', 
        'Should have correct protocol name');
      this.assertEqual(appProfile.protocol.shortName, 'APP', 
        'Should have correct short name');
      this.assert(appProfile.protocol.id, 'Should have UUID');
      
      // Check basics
      this.assert(appProfile.basics.name, 'Should have name in basics');
      this.assertEqual(appProfile.basics.email, 'john.doe@example.com', 
        'Should have email in basics');
      
      // Check arrays
      this.assert(Array.isArray(appProfile.experience), 'Experience should be array');
      this.assert(Array.isArray(appProfile.education), 'Education should be array');
      this.assert(Array.isArray(appProfile.skills), 'Skills should be array');
      this.assert(Array.isArray(appProfile.projects), 'Projects should be array');
      
      // Check metadata
      this.assert(appProfile.metadata.createdAt, 'Should have createdAt');
      this.assertEqual(appProfile.metadata.source, 'pdf-extractor', 
        'Should have correct source');
      
      console.log('✅ APP mapping passed\n');
      this.passed++;
    } catch (error) {
      console.error('❌ APP mapping failed:', error.message, '\n');
      this.failed++;
    }
  }

  // Test: Validation
  async testValidation() {
    console.log('✔️ Test: Validation');
    
    try {
      const sections = this.processor.detectSections(mockResumeText);
      const entities = this.processor.extractEntities(mockResumeText, sections);
      const normalized = this.processor.normalizeData(entities);
      const appProfile = this.processor.mapToAPP(normalized, sections);
      const validation = this.processor.validate(appProfile);
      
      this.assertEqual(validation.valid, true, 'Profile should be valid');
      this.assertEqual(validation.errors.length, 0, 'Should have no errors');
      
      console.log('✅ Validation passed\n');
      this.passed++;
    } catch (error) {
      console.error('❌ Validation failed:', error.message, '\n');
      this.failed++;
    }
  }

  // Test: Confidence Scoring
  async testConfidenceScoring() {
    console.log('📊 Test: Confidence Scoring');
    
    try {
      const sections = this.processor.detectSections(mockResumeText);
      const entities = this.processor.extractEntities(mockResumeText, sections);
      const normalized = this.processor.normalizeData(entities);
      const appProfile = this.processor.mapToAPP(normalized, sections);
      const confidence = this.processor.calculateConfidence(appProfile, entities);
      
      this.assert(confidence.overall >= 0 && confidence.overall <= 100, 
        'Overall confidence should be 0-100');
      this.assert(confidence.basics >= 0 && confidence.basics <= 100, 
        'Basics confidence should be 0-100');
      this.assert(confidence.overall > 50, 
        'Should have reasonable confidence for good resume');
      
      console.log(`   Overall confidence: ${confidence.overall}%`);
      console.log(`   Basics: ${confidence.basics}%`);
      console.log(`   Experience: ${confidence.experience}%`);
      console.log(`   Education: ${confidence.education}%`);
      console.log(`   Skills: ${confidence.skills}%`);
      
      console.log('✅ Confidence scoring passed\n');
      this.passed++;
    } catch (error) {
      console.error('❌ Confidence scoring failed:', error.message, '\n');
      this.failed++;
    }
  }

  // Assertion helpers
  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message}\n   Expected: ${expected}\n   Actual: ${actual}`);
    }
  }

  // Print test summary
  printSummary() {
    console.log('━'.repeat(50));
    console.log('📈 Test Summary');
    console.log('━'.repeat(50));
    console.log(`Total Tests: ${this.passed + this.failed}`);
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);
    console.log('━'.repeat(50));
  }
}

// Run tests
if (typeof window !== 'undefined') {
  // Browser environment
  window.PDFProcessorTests = PDFProcessorTests;
  
  // Auto-run if PDFProcessor is available
  if (typeof PDFProcessor !== 'undefined') {
    const tests = new PDFProcessorTests();
    tests.runAll();
  }
} else {
  // Node.js environment
  module.exports = PDFProcessorTests;
}
