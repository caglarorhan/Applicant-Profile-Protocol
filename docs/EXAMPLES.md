# APP Profile Examples

**Protocol Version:** 1.0  
**Last Updated:** January 2026

This page showcases real-world Applicant Profile Protocol (APP) examples across different industries and career stages.

## Table of Contents

1. [Software Engineer](#1-software-engineer)
2. [Healthcare Professional](#2-healthcare-professional-nurse)
3. [Marketing Manager](#3-marketing-manager)
4. [Data Scientist](#4-data-scientist)
5. [Mechanical Engineer](#5-mechanical-engineer)
6. [UX Designer](#6-ux-designer)
7. [Financial Analyst](#7-financial-analyst)
8. [Sales Representative](#8-sales-representative)
9. [Teacher / Educator](#9-teacher--educator)
10. [Recent Graduate](#10-recent-graduate)

---

## 1. Software Engineer

**Industry:** Technology  
**Level:** Senior

```json
{
  "protocol": {
    "name": "ApplicantProfileProtocol",
    "shortName": "APP",
    "version": "1.0.0",
    "uri": "https://app-protocol.org/spec/1.0",
    "id": "urn:app-protocol:profile:se-001"
  },
  "basics": {
    "name": {
      "given": "Alex",
      "family": "Chen"
    },
    "headline": "Senior Full-Stack Engineer",
    "summary": "Experienced software engineer specializing in scalable web applications and cloud infrastructure. Led teams of 5+ engineers and reduced deployment time by 60% through CI/CD automation.",
    "contact": {
      "email": "alex.chen@example.com",
      "phone": "+1-555-0123",
      "website": "https://alexchen.dev",
      "social": [
        {"platform": "GitHub", "url": "https://github.com/alexchen"},
        {"platform": "LinkedIn", "url": "https://linkedin.com/in/alexchen"}
      ]
    },
    "location": {
      "city": "San Francisco",
      "region": "California",
      "country": "US"
    }
  },
  "skills": [
    {"name": "JavaScript", "level": "Expert", "years": 8},
    {"name": "TypeScript", "level": "Expert", "years": 5},
    {"name": "React", "level": "Expert", "years": 6},
    {"name": "Node.js", "level": "Expert", "years": 7},
    {"name": "AWS", "level": "Advanced", "years": 5},
    {"name": "Docker", "level": "Advanced", "years": 4},
    {"name": "PostgreSQL", "level": "Advanced", "years": 6},
    {"name": "GraphQL", "level": "Advanced", "years": 3}
  ],
  "experience": [
    {
      "organization": {"name": "TechCorp Inc."},
      "role": "Senior Software Engineer",
      "start": "2021-03",
      "current": true,
      "location": {"city": "San Francisco", "country": "US"},
      "highlights": [
        "Led migration from monolith to microservices, improving system reliability to 99.9%",
        "Architected real-time notification system handling 10M+ events daily",
        "Mentored 3 junior engineers and conducted weekly code reviews"
      ],
      "technologies": ["TypeScript", "React", "Node.js", "AWS Lambda", "DynamoDB"]
    },
    {
      "organization": {"name": "StartupXYZ"},
      "role": "Full-Stack Developer",
      "start": "2018-06",
      "end": "2021-02",
      "location": {"city": "Palo Alto", "country": "US"},
      "highlights": [
        "Built MVP from scratch, acquired 10,000 users in first 6 months",
        "Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes",
        "Developed RESTful APIs serving 1M+ requests daily"
      ],
      "technologies": ["JavaScript", "Vue.js", "Express", "MongoDB", "Docker"]
    }
  ],
  "education": [
    {
      "institution": "Stanford University",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "start": "2014-09",
      "end": "2018-06",
      "location": {"city": "Stanford", "country": "US"}
    }
  ],
  "certifications": [
    {
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "date": "2022-08",
      "url": "https://aws.amazon.com/verification/XXXXX"
    }
  ]
}
```

---

## 2. Healthcare Professional (Nurse)

**Industry:** Healthcare  
**Level:** Mid-Career

```json
{
  "protocol": {
    "name": "ApplicantProfileProtocol",
    "shortName": "APP",
    "version": "1.0.0",
    "uri": "https://app-protocol.org/spec/1.0",
    "id": "urn:app-protocol:profile:nurse-001"
  },
  "basics": {
    "name": {
      "given": "Maria",
      "family": "Rodriguez"
    },
    "headline": "Registered Nurse - ICU Specialist",
    "summary": "Compassionate RN with 7 years of critical care experience. Skilled in patient assessment, emergency response, and collaborating with multidisciplinary teams to deliver high-quality patient care.",
    "contact": {
      "email": "maria.rodriguez@example.com",
      "phone": "+1-555-0456"
    },
    "location": {
      "city": "Chicago",
      "region": "Illinois",
      "country": "US"
    }
  },
  "skills": [
    {"name": "Critical Care Nursing", "level": "Expert", "years": 7},
    {"name": "Patient Assessment", "level": "Expert", "years": 7},
    {"name": "Emergency Response", "level": "Advanced", "years": 7},
    {"name": "Ventilator Management", "level": "Advanced", "years": 5},
    {"name": "ACLS", "level": "Advanced", "years": 7},
    {"name": "Electronic Health Records (Epic)", "level": "Advanced", "years": 6}
  ],
  "experience": [
    {
      "organization": {"name": "Chicago Medical Center"},
      "role": "ICU Registered Nurse",
      "start": "2019-01",
      "current": true,
      "location": {"city": "Chicago", "country": "US"},
      "highlights": [
        "Managed care for 4-6 critically ill patients per shift in 20-bed ICU",
        "Trained 8 new nurses on ICU protocols and equipment",
        "Recognized as Employee of the Quarter (Q2 2023) for exceptional patient care"
      ]
    },
    {
      "organization": {"name": "Community Hospital"},
      "role": "Registered Nurse - Med-Surg",
      "start": "2017-06",
      "end": "2018-12",
      "location": {"city": "Chicago", "country": "US"},
      "highlights": [
        "Provided comprehensive care for medical-surgical patients",
        "Collaborated with physicians and care teams on treatment plans",
        "Administered medications and monitored patient vital signs"
      ]
    }
  ],
  "education": [
    {
      "institution": "University of Illinois at Chicago",
      "degree": "Bachelor of Science in Nursing",
      "field": "Nursing",
      "start": "2013-08",
      "end": "2017-05",
      "location": {"city": "Chicago", "country": "US"}
    }
  ],
  "certifications": [
    {
      "name": "Registered Nurse (RN)",
      "issuer": "Illinois Board of Nursing",
      "date": "2017-06"
    },
    {
      "name": "ACLS (Advanced Cardiovascular Life Support)",
      "issuer": "American Heart Association",
      "date": "2023-08"
    },
    {
      "name": "CCRN (Critical Care Registered Nurse)",
      "issuer": "AACN",
      "date": "2020-11"
    }
  ]
}
```

---

## 3. Marketing Manager

**Industry:** Marketing / E-commerce  
**Level:** Mid to Senior

```json
{
  "protocol": {
    "name": "ApplicantProfileProtocol",
    "shortName": "APP",
    "version": "1.0.0",
    "uri": "https://app-protocol.org/spec/1.0",
    "id": "urn:app-protocol:profile:mkt-001"
  },
  "basics": {
    "name": {
      "given": "Sarah",
      "family": "Thompson"
    },
    "headline": "Digital Marketing Manager",
    "summary": "Results-driven marketing professional with 6+ years driving growth through data-driven campaigns. Increased e-commerce revenue by 45% YoY through SEO, paid media, and email marketing strategies.",
    "contact": {
      "email": "sarah.thompson@example.com",
      "social": [
        {"platform": "LinkedIn", "url": "https://linkedin.com/in/sarahthompson"}
      ]
    },
    "location": {
      "city": "New York",
      "region": "New York",
      "country": "US"
    }
  },
  "skills": [
    {"name": "Digital Marketing Strategy", "level": "Expert", "years": 6},
    {"name": "SEO", "level": "Expert", "years": 6},
    {"name": "Google Ads", "level": "Advanced", "years": 5},
    {"name": "Marketing Analytics", "level": "Advanced", "years": 6},
    {"name": "Email Marketing", "level": "Advanced", "years": 6},
    {"name": "Social Media Marketing", "level": "Advanced", "years": 6},
    {"name": "A/B Testing", "level": "Advanced", "years": 5}
  ],
  "experience": [
    {
      "organization": {"name": "ShopNow E-commerce"},
      "role": "Digital Marketing Manager",
      "start": "2021-05",
      "current": true,
      "location": {"city": "New York", "country": "US"},
      "highlights": [
        "Increased online revenue by 45% YoY through multi-channel campaigns",
        "Reduced customer acquisition cost by 30% through SEO optimization",
        "Managed $500K annual marketing budget across paid and organic channels",
        "Led team of 4 marketing specialists"
      ]
    },
    {
      "organization": {"name": "BrandBoost Agency"},
      "role": "Marketing Specialist",
      "start": "2018-07",
      "end": "2021-04",
      "location": {"city": "New York", "country": "US"},
      "highlights": [
        "Executed campaigns for 12+ B2C clients across retail and tech sectors",
        "Improved average client ROI by 35% through data-driven optimization",
        "Managed Google Ads budgets totaling $2M+ annually"
      ]
    }
  ],
  "education": [
    {
      "institution": "New York University",
      "degree": "Bachelor of Science",
      "field": "Marketing",
      "start": "2014-09",
      "end": "2018-05",
      "location": {"city": "New York", "country": "US"}
    }
  ],
  "certifications": [
    {
      "name": "Google Ads Certification",
      "issuer": "Google",
      "date": "2023-06"
    },
    {
      "name": "HubSpot Content Marketing Certification",
      "issuer": "HubSpot Academy",
      "date": "2022-03"
    }
  ]
}
```

---

## 4. Data Scientist

**Industry:** Technology / Analytics  
**Level:** Mid-Career

```json
{
  "protocol": {
    "name": "ApplicantProfileProtocol",
    "shortName": "APP",
    "version": "1.0.0",
    "uri": "https://app-protocol.org/spec/1.0",
    "id": "urn:app-protocol:profile:ds-001"
  },
  "basics": {
    "name": {
      "given": "David",
      "family": "Kim"
    },
    "headline": "Data Scientist specializing in ML and Predictive Analytics",
    "summary": "Data scientist with expertise in machine learning, statistical modeling, and big data analytics. Built recommendation systems serving 5M+ users and fraud detection models with 95% accuracy.",
    "contact": {
      "email": "david.kim@example.com",
      "website": "https://davidkim-data.com",
      "social": [
        {"platform": "GitHub", "url": "https://github.com/davidkim"},
        {"platform": "LinkedIn", "url": "https://linkedin.com/in/davidkim"}
      ]
    },
    "location": {
      "city": "Seattle",
      "region": "Washington",
      "country": "US"
    }
  },
  "skills": [
    {"name": "Python", "level": "Expert", "years": 6},
    {"name": "Machine Learning", "level": "Expert", "years": 5},
    {"name": "SQL", "level": "Expert", "years": 6},
    {"name": "TensorFlow", "level": "Advanced", "years": 4},
    {"name": "PyTorch", "level": "Advanced", "years": 3},
    {"name": "R", "level": "Advanced", "years": 4},
    {"name": "Apache Spark", "level": "Advanced", "years": 3},
    {"name": "Data Visualization", "level": "Advanced", "years": 5}
  ],
  "experience": [
    {
      "organization": {"name": "StreamTech Inc."},
      "role": "Senior Data Scientist",
      "start": "2022-01",
      "current": true,
      "location": {"city": "Seattle", "country": "US"},
      "highlights": [
        "Built recommendation engine increasing user engagement by 28%",
        "Developed fraud detection model reducing false positives by 40%",
        "Led A/B testing framework used by 15+ product teams",
        "Presented findings to C-suite executives quarterly"
      ],
      "technologies": ["Python", "TensorFlow", "Spark", "Snowflake", "Tableau"]
    },
    {
      "organization": {"name": "FinanceAI Corp"},
      "role": "Data Scientist",
      "start": "2019-06",
      "end": "2021-12",
      "location": {"city": "Seattle", "country": "US"},
      "highlights": [
        "Created credit risk models for loan approval automation",
        "Reduced model training time by 50% through pipeline optimization",
        "Collaborated with engineering team to deploy 8 ML models to production"
      ],
      "technologies": ["Python", "Scikit-learn", "PostgreSQL", "AWS SageMaker"]
    }
  ],
  "education": [
    {
      "institution": "University of Washington",
      "degree": "Master of Science",
      "field": "Data Science",
      "start": "2017-09",
      "end": "2019-06",
      "location": {"city": "Seattle", "country": "US"}
    },
    {
      "institution": "UC Berkeley",
      "degree": "Bachelor of Science",
      "field": "Statistics",
      "start": "2013-08",
      "end": "2017-05",
      "location": {"city": "Berkeley", "country": "US"}
    }
  ],
  "publications": [
    {
      "title": "Deep Learning Approaches for Fraud Detection in Financial Transactions",
      "authors": ["Kim, D.", "Johnson, L."],
      "date": "2023-05",
      "url": "https://arxiv.org/example"
    }
  ]
}
```

---

## 5. Mechanical Engineer

**Industry:** Manufacturing / Automotive  
**Level:** Mid-Career

```json
{
  "protocol": {
    "name": "ApplicantProfileProtocol",
    "shortName": "APP",
    "version": "1.0.0",
    "uri": "https://app-protocol.org/spec/1.0",
    "id": "urn:app-protocol:profile:me-001"
  },
  "basics": {
    "name": {
      "given": "James",
      "family": "Peterson"
    },
    "headline": "Mechanical Engineer - Product Design",
    "summary": "Mechanical engineer with 8 years of experience in automotive product design and manufacturing. Specialized in CAD modeling, FEA analysis, and DFM optimization. Led design of 15+ production parts.",
    "contact": {
      "email": "james.peterson@example.com",
      "phone": "+1-555-0789"
    },
    "location": {
      "city": "Detroit",
      "region": "Michigan",
      "country": "US"
    }
  },
  "skills": [
    {"name": "CAD (SolidWorks)", "level": "Expert", "years": 8},
    {"name": "FEA (Finite Element Analysis)", "level": "Advanced", "years": 7},
    {"name": "GD&T", "level": "Expert", "years": 8},
    {"name": "Design for Manufacturing", "level": "Advanced", "years": 7},
    {"name": "Project Management", "level": "Advanced", "years": 5},
    {"name": "AutoCAD", "level": "Advanced", "years": 8}
  ],
  "experience": [
    {
      "organization": {"name": "AutoMotive Solutions"},
      "role": "Senior Mechanical Engineer",
      "start": "2020-03",
      "current": true,
      "location": {"city": "Detroit", "country": "US"},
      "highlights": [
        "Led design of engine mounting system for new EV platform",
        "Reduced part weight by 15% through material optimization and FEA",
        "Managed cross-functional team of 6 engineers and technicians",
        "Ensured compliance with ISO 9001 and automotive safety standards"
      ]
    },
    {
      "organization": {"name": "Industrial Parts Co."},
      "role": "Mechanical Engineer",
      "start": "2016-07",
      "end": "2020-02",
      "location": {"city": "Ann Arbor", "country": "US"},
      "highlights": [
        "Designed 12 production parts from concept to manufacturing",
        "Collaborated with suppliers to optimize tooling and reduce costs by 20%",
        "Conducted root cause analysis for product failures and implemented fixes"
      ]
    }
  ],
  "education": [
    {
      "institution": "University of Michigan",
      "degree": "Bachelor of Science",
      "field": "Mechanical Engineering",
      "start": "2012-09",
      "end": "2016-05",
      "location": {"city": "Ann Arbor", "country": "US"}
    }
  ],
  "certifications": [
    {
      "name": "Professional Engineer (PE)",
      "issuer": "Michigan Board of Professional Engineers",
      "date": "2020-08"
    },
    {
      "name": "SolidWorks Certified Professional (CSWP)",
      "issuer": "Dassault Systèmes",
      "date": "2018-03"
    }
  ]
}
```

---

## 6. UX Designer

**Industry:** Technology / Design  
**Level:** Mid-Career

```json
{
  "protocol": {
    "name": "ApplicantProfileProtocol",
    "shortName": "APP",
    "version": "1.0.0",
    "uri": "https://app-protocol.org/spec/1.0",
    "id": "urn:app-protocol:profile:ux-001"
  },
  "basics": {
    "name": {
      "given": "Emily",
      "family": "Zhang"
    },
    "headline": "UX/UI Designer",
    "summary": "Creative UX designer with 5 years of experience crafting user-centered digital experiences. Led redesign projects that improved user satisfaction scores by 35% and reduced support tickets by 25%.",
    "contact": {
      "email": "emily.zhang@example.com",
      "website": "https://emilyzhang.design",
      "social": [
        {"platform": "Behance", "url": "https://behance.net/emilyzhang"},
        {"platform": "LinkedIn", "url": "https://linkedin.com/in/emilyzhang"}
      ]
    },
    "location": {
      "city": "Austin",
      "region": "Texas",
      "country": "US"
    }
  },
  "skills": [
    {"name": "User Research", "level": "Expert", "years": 5},
    {"name": "Wireframing", "level": "Expert", "years": 5},
    {"name": "Prototyping", "level": "Expert", "years": 5},
    {"name": "Figma", "level": "Expert", "years": 4},
    {"name": "Adobe XD", "level": "Advanced", "years": 5},
    {"name": "Usability Testing", "level": "Advanced", "years": 5},
    {"name": "Design Systems", "level": "Advanced", "years": 3}
  ],
  "experience": [
    {
      "organization": {"name": "CloudApp Inc."},
      "role": "Senior UX Designer",
      "start": "2022-02",
      "current": true,
      "location": {"city": "Austin", "country": "US"},
      "highlights": [
        "Led redesign of mobile app, increasing user retention by 28%",
        "Conducted 40+ user interviews and usability tests",
        "Created comprehensive design system adopted by 3 product teams",
        "Collaborated with PM and engineering in agile sprints"
      ]
    },
    {
      "organization": {"name": "DesignStudio Agency"},
      "role": "UX Designer",
      "start": "2019-06",
      "end": "2022-01",
      "location": {"city": "Austin", "country": "US"},
      "highlights": [
        "Designed user flows and interfaces for 8 client projects",
        "Reduced average task completion time by 40% through iterative testing",
        "Presented design concepts to stakeholders and incorporated feedback"
      ]
    }
  ],
  "education": [
    {
      "institution": "Rhode Island School of Design",
      "degree": "Bachelor of Fine Arts",
      "field": "Graphic Design",
      "start": "2015-09",
      "end": "2019-05",
      "location": {"city": "Providence", "country": "US"}
    }
  ],
  "certifications": [
    {
      "name": "Google UX Design Professional Certificate",
      "issuer": "Google / Coursera",
      "date": "2021-08"
    }
  ]
}
```

---

## 7. Financial Analyst

**Industry:** Finance / Investment Banking  
**Level:** Entry to Mid

```json
{
  "protocol": {
    "name": "ApplicantProfileProtocol",
    "shortName": "APP",
    "version": "1.0.0",
    "uri": "https://app-protocol.org/spec/1.0",
    "id": "urn:app-protocol:profile:fa-001"
  },
  "basics": {
    "name": {
      "given": "Michael",
      "family": "Johnson"
    },
    "headline": "Financial Analyst",
    "summary": "Detail-oriented financial analyst with 4 years of experience in corporate finance and investment analysis. Proficient in financial modeling, valuation, and data-driven decision making.",
    "contact": {
      "email": "michael.johnson@example.com",
      "phone": "+1-555-0321"
    },
    "location": {
      "city": "Boston",
      "region": "Massachusetts",
      "country": "US"
    }
  },
  "skills": [
    {"name": "Financial Modeling", "level": "Expert", "years": 4},
    {"name": "Excel", "level": "Expert", "years": 5},
    {"name": "Valuation (DCF, Comps)", "level": "Advanced", "years": 4},
    {"name": "Financial Analysis", "level": "Advanced", "years": 4},
    {"name": "SQL", "level": "Intermediate", "years": 2},
    {"name": "PowerPoint", "level": "Advanced", "years": 4}
  ],
  "experience": [
    {
      "organization": {"name": "Investment Partners LLC"},
      "role": "Financial Analyst",
      "start": "2021-08",
      "current": true,
      "location": {"city": "Boston", "country": "US"},
      "highlights": [
        "Built financial models for 15+ M&A transactions totaling $500M+",
        "Conducted due diligence and valuation analysis for acquisition targets",
        "Prepared investment memos and presentations for senior leadership",
        "Analyzed industry trends and competitive landscapes"
      ]
    },
    {
      "organization": {"name": "Corporate Finance Services"},
      "role": "Junior Analyst",
      "start": "2020-06",
      "end": "2021-07",
      "location": {"city": "Boston", "country": "US"},
      "highlights": [
        "Supported budgeting and forecasting processes for $50M revenue company",
        "Created monthly financial reports and variance analysis",
        "Automated reporting processes, saving 10 hours per month"
      ]
    }
  ],
  "education": [
    {
      "institution": "Boston University",
      "degree": "Bachelor of Science",
      "field": "Finance",
      "start": "2016-09",
      "end": "2020-05",
      "location": {"city": "Boston", "country": "US"},
      "gpa": 3.7
    }
  },
  "certifications": [
    {
      "name": "CFA Level I",
      "issuer": "CFA Institute",
      "date": "2022-02"
    }
  ]
}
```

---

## 8. Sales Representative

**Industry:** B2B SaaS Sales  
**Level:** Mid-Career

```json
{
  "protocol": {
    "name": "ApplicantProfileProtocol",
    "shortName": "APP",
    "version": "1.0.0",
    "uri": "https://app-protocol.org/spec/1.0",
    "id": "urn:app-protocol:profile:sales-001"
  },
  "basics": {
    "name": {
      "given": "Jennifer",
      "family": "Martinez"
    },
    "headline": "Enterprise Sales Representative",
    "summary": "Top-performing sales professional with 6 years of B2B SaaS experience. Consistently exceeded quota by 120%+ and closed $3.5M in new business annually. Skilled in consultative selling and relationship building.",
    "contact": {
      "email": "jennifer.martinez@example.com",
      "phone": "+1-555-0654",
      "social": [
        {"platform": "LinkedIn", "url": "https://linkedin.com/in/jennifermartinez"}
      ]
    },
    "location": {
      "city": "Atlanta",
      "region": "Georgia",
      "country": "US"
    }
  },
  "skills": [
    {"name": "B2B Sales", "level": "Expert", "years": 6},
    {"name": "Enterprise Sales", "level": "Expert", "years": 4},
    {"name": "Salesforce CRM", "level": "Advanced", "years": 6},
    {"name": "Consultative Selling", "level": "Expert", "years": 6},
    {"name": "Cold Calling", "level": "Advanced", "years": 6},
    {"name": "Negotiation", "level": "Advanced", "years": 6}
  ],
  "experience": [
    {
      "organization": {"name": "CloudSoft Solutions"},
      "role": "Enterprise Account Executive",
      "start": "2021-01",
      "current": true,
      "location": {"city": "Atlanta", "country": "US"},
      "highlights": [
        "Generated $3.5M in new business annually (125% of quota)",
        "Closed 18 enterprise deals averaging $200K ACV",
        "Maintained 95% customer retention rate",
        "Ranked Top 5% of sales team company-wide (2023)"
      ]
    },
    {
      "organization": {"name": "SaaS Dynamics"},
      "role": "Sales Development Representative",
      "start": "2018-06",
      "end": "2020-12",
      "location": {"city": "Atlanta", "country": "US"},
      "highlights": [
        "Qualified 400+ leads resulting in $1.2M pipeline",
        "Achieved 135% of monthly quota for 18 consecutive months",
        "Promoted to Account Executive role within 18 months"
      ]
    }
  ],
  "education": [
    {
      "institution": "Georgia State University",
      "degree": "Bachelor of Business Administration",
      "field": "Marketing",
      "start": "2014-08",
      "end": "2018-05",
      "location": {"city": "Atlanta", "country": "US"}
    }
  ],
  "awards": [
    {
      "title": "President's Club Award",
      "date": "2023-12",
      "issuer": "CloudSoft Solutions",
      "description": "Top 10% sales performers company-wide"
    }
  ]
}
```

---

## 9. Teacher / Educator

**Industry:** Education  
**Level:** Mid-Career

```json
{
  "protocol": {
    "name": "ApplicantProfileProtocol",
    "shortName": "APP",
    "version": "1.0.0",
    "uri": "https://app-protocol.org/spec/1.0",
    "id": "urn:app-protocol:profile:teacher-001"
  },
  "basics": {
    "name": {
      "given": "Robert",
      "family": "Williams"
    },
    "headline": "High School Mathematics Teacher",
    "summary": "Dedicated educator with 9 years of experience teaching mathematics to diverse student populations. Improved student test scores by 22% through differentiated instruction and innovative teaching methods.",
    "contact": {
      "email": "robert.williams@example.com",
      "phone": "+1-555-0987"
    },
    "location": {
      "city": "Portland",
      "region": "Oregon",
      "country": "US"
    }
  },
  "skills": [
    {"name": "Curriculum Development", "level": "Expert", "years": 9},
    {"name": "Differentiated Instruction", "level": "Expert", "years": 9},
    {"name": "Classroom Management", "level": "Expert", "years": 9},
    {"name": "Educational Technology", "level": "Advanced", "years": 6},
    {"name": "Student Assessment", "level": "Advanced", "years": 9},
    {"name": "Google Classroom", "level": "Advanced", "years": 5}
  ],
  "experience": [
    {
      "organization": {"name": "Lincoln High School"},
      "role": "Mathematics Teacher",
      "start": "2018-08",
      "current": true,
      "location": {"city": "Portland", "country": "US"},
      "highlights": [
        "Teach Algebra I, Geometry, and AP Calculus to 120+ students annually",
        "Increased AP Calculus pass rate from 68% to 85% over 3 years",
        "Developed project-based learning curriculum adopted school-wide",
        "Mentor 2 new teachers annually through school mentorship program"
      ]
    },
    {
      "organization": {"name": "Washington Middle School"},
      "role": "Mathematics Teacher",
      "start": "2015-08",
      "end": "2018-06",
      "location": {"city": "Portland", "country": "US"},
      "highlights": [
        "Taught 7th and 8th grade mathematics",
        "Improved student proficiency scores by 18% in 3 years",
        "Led after-school math club with 25+ student participants"
      ]
    }
  ],
  "education": [
    {
      "institution": "Portland State University",
      "degree": "Master of Education",
      "field": "Curriculum and Instruction",
      "start": "2016-09",
      "end": "2019-06",
      "location": {"city": "Portland", "country": "US"}
    },
    {
      "institution": "University of Oregon",
      "degree": "Bachelor of Science",
      "field": "Mathematics",
      "start": "2011-09",
      "end": "2015-06",
      "location": {"city": "Eugene", "country": "US"}
    }
  ],
  "certifications": [
    {
      "name": "Oregon Teaching License - Mathematics",
      "issuer": "Oregon Teacher Standards and Practices Commission",
      "date": "2015-07"
    },
    {
      "name": "Google Certified Educator Level 2",
      "issuer": "Google for Education",
      "date": "2021-03"
    }
  ]
}
```

---

## 10. Recent Graduate

**Industry:** Computer Science / Entry-Level  
**Level:** Entry-Level / New Grad

```json
{
  "protocol": {
    "name": "ApplicantProfileProtocol",
    "shortName": "APP",
    "version": "1.0.0",
    "uri": "https://app-protocol.org/spec/1.0",
    "id": "urn:app-protocol:profile:newgrad-001"
  },
  "basics": {
    "name": {
      "given": "Priya",
      "family": "Patel"
    },
    "headline": "Software Engineer (New Graduate)",
    "summary": "Recent computer science graduate passionate about web development and building user-friendly applications. Completed 2 internships and multiple personal projects demonstrating full-stack capabilities.",
    "contact": {
      "email": "priya.patel@example.com",
      "website": "https://priyapatel.dev",
      "social": [
        {"platform": "GitHub", "url": "https://github.com/priyapatel"},
        {"platform": "LinkedIn", "url": "https://linkedin.com/in/priyapatel"}
      ]
    },
    "location": {
      "city": "San Jose",
      "region": "California",
      "country": "US"
    }
  },
  "skills": [
    {"name": "JavaScript", "level": "Intermediate", "years": 3},
    {"name": "Python", "level": "Intermediate", "years": 3},
    {"name": "React", "level": "Intermediate", "years": 2},
    {"name": "Node.js", "level": "Beginner", "years": 2},
    {"name": "Git", "level": "Intermediate", "years": 3},
    {"name": "SQL", "level": "Beginner", "years": 2}
  ],
  "experience": [
    {
      "organization": {"name": "TechStartup Inc."},
      "role": "Software Engineering Intern",
      "start": "2024-06",
      "end": "2024-08",
      "location": {"city": "San Francisco", "country": "US"},
      "highlights": [
        "Developed 3 new features for customer-facing web application",
        "Fixed 15+ bugs and improved page load time by 20%",
        "Collaborated with team of 5 engineers using Agile methodology",
        "Participated in code reviews and daily standups"
      ],
      "technologies": ["React", "JavaScript", "Node.js", "MongoDB"]
    },
    {
      "organization": {"name": "University IT Department"},
      "role": "Student Web Developer",
      "start": "2023-09",
      "end": "2024-05",
      "location": {"city": "San Jose", "country": "US"},
      "highlights": [
        "Built internal tools used by 50+ staff members",
        "Created responsive landing pages for university events",
        "Maintained WordPress sites and updated content"
      ],
      "technologies": ["HTML", "CSS", "JavaScript", "WordPress"]
    }
  ],
  "education": [
    {
      "institution": "San Jose State University",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "start": "2020-08",
      "end": "2024-05",
      "location": {"city": "San Jose", "country": "US"},
      "gpa": 3.6
    }
  ],
  "projects": [
    {
      "name": "Task Manager App",
      "description": "Full-stack task management application with authentication",
      "url": "https://github.com/priyapatel/task-manager",
      "technologies": ["React", "Express", "PostgreSQL"]
    },
    {
      "name": "Weather Dashboard",
      "description": "Real-time weather app consuming OpenWeather API",
      "url": "https://github.com/priyapatel/weather-app",
      "technologies": ["JavaScript", "HTML/CSS", "OpenWeather API"]
    }
  ],
  "certifications": [
    {
      "name": "AWS Certified Cloud Practitioner",
      "issuer": "Amazon Web Services",
      "date": "2024-03"
    }
  ]
}
```

---

## How to Use These Examples

1. **Copy and modify** any example to match your profile
2. **Validate** using the [APP Validator](https://app-protocol.org/tools/validator.html)
3. **Export** to other formats using the [Converter](https://app-protocol.org/tools/converter.html)
4. **Build your own** using the [Profile Builder](https://app-protocol.org/tools/builder.html)

## See Also

- [Minimal Example](https://app-protocol.org/examples/minimal.json)
- [Full Featured Example](https://app-protocol.org/examples/full.json)
- [SPEC.md](https://app-protocol.org/spec/1.0) - Complete protocol specification
