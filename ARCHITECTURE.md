# Portfolio CMS - Architecture & Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                     (Next.js Frontend)                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PortfolioHome Component                                 │   │
│  │  - Hero Section (Profile)                                │   │
│  │  - Skills Display (Categorized)                          │   │
│  │  - Experience Timeline                                   │   │
│  │  - Projects Showcase                                     │   │
│  │  - Contact Section                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                         ↓                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  API Client Layer (portfolio-api.ts)                    │   │
│  │  - Type-safe function calls                             │   │
│  │  - ISR caching strategy                                 │   │
│  │  - Error handling                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            ↓ HTTP
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER                                   │
│                  (Next.js API Routes)                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PORTFOLIO ENDPOINTS                                     │   │
│  │  ├── /api/portfolio/personal                            │   │
│  │  ├── /api/portfolio/skills                              │   │
│  │  ├── /api/portfolio/experience                          │   │
│  │  ├── /api/portfolio/education                           │   │
│  │  ├── /api/portfolio/projects                            │   │
│  │  ├── /api/portfolio/certifications                      │   │
│  │  ├── /api/portfolio/languages                           │   │
│  │  ├── /api/portfolio/testimonials                        │   │
│  │  └── /api/portfolio/contact                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MIDDLEWARE                                              │   │
│  │  ├── Error Handler                                       │   │
│  │  ├── CORS Support                                        │   │
│  │  ├── Validation (Zod)                                    │   │
│  │  └── Rate Limiting                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC                                │
│                  (Helper Functions)                             │
│                                                                   │
│  ├── Validation Schemas (Zod)                                   │
│  ├── Database Queries (Prisma)                                  │
│  ├── Data Transformation                                        │
│  └── Error Handling                                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                    │
│                  (Prisma ORM)                                   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  MODELS (12 Total)                                      │   │
│  │                                                          │   │
│  │  Portfolio Models:                                      │   │
│  │  ├── PersonalInfo          (1 admin profile)           │   │
│  │  ├── Skill                 (17 skills total)           │   │
│  │  ├── Experience            (5 work experiences)        │   │
│  │  ├── Education             (2 education records)       │   │
│  │  ├── Project               (3 projects)                │   │
│  │  ├── Certification         (3 certifications)          │   │
│  │  ├── Language              (2 languages)               │   │
│  │  ├── Testimonial           (2 testimonials)            │   │
│  │  └── ContactMessage        (incoming messages)         │   │
│  │                                                          │   │
│  │  System Models:                                         │   │
│  │  ├── User                  (admin users)               │   │
│  │  ├── ContentEntry          (CMS content)               │   │
│  │  ├── SiteSetting           (configuration)             │   │
│  │  └── ApiLog                (request logging)           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                  PERSISTENCE LAYER                               │
│                   (MySQL Database)                              │
│                                                                   │
│  Database: npmv2                                                │
│  Engine: MySQL 8                                                │
│  Tables: 12 (with relationships & indexes)                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Architecture

### GET Portfolio Data Flow
```
Browser (Frontend)
    ↓
portfolio-api.ts (GET request with caching)
    ↓
Next.js API Route (/api/portfolio/skills)
    ↓
Prisma Client (Query builder)
    ↓
MySQL Database
    ↓
Prisma (Transform result)
    ↓
API Response (JSON)
    ↓
Frontend Component (Display)
    ↓
Browser Render
```

### POST Portfolio Data Flow
```
Admin Form (Frontend)
    ↓
portfolio-api.ts (POST request)
    ↓
Next.js API Route (/api/portfolio/skills)
    ↓
Zod Validation Schema (Validate input)
    ↓
Prisma Client (Insert/Update)
    ↓
MySQL Database
    ↓
Prisma (Return created record)
    ↓
API Response (201 Created)
    ↓
Frontend (Update UI)
```

---

## Database Schema Relationships

```
PersonalInfo (1)
    ├─ has many Skill
    ├─ has many Experience
    ├─ has many Education
    ├─ has many Project
    ├─ has many Certification
    ├─ has many Language
    └─ has many Testimonial

User (1)
    ├─ has many ContentEntry (future)
    └─ has many ContactMessage (received)

ContactMessage (N)
    └─ from PersonalInfo.email (reference)

All models include:
├─ id (primary key - CUID for portfolio, Int for others)
├─ timestamps (createdAt, updatedAt)
├─ visibility control (isVisible boolean)
└─ ordering field (order Int)
```

---

## API Design Pattern

### RESTful Endpoints Structure
```
GET    /api/portfolio/[resource]          - List all (with filters)
POST   /api/portfolio/[resource]          - Create new
GET    /api/portfolio/[resource]/[id]     - Get single (if needed)
PUT    /api/portfolio/[resource]/[id]     - Update (if implemented)
DELETE /api/portfolio/[resource]/[id]     - Delete (if implemented)
```

### Response Format (Consistent)
```javascript
// Success
{
  ok: true,
  data: { /* model instance */ }
}

// Error
{
  ok: false,
  error: "Error message",
  details: { /* validation errors if any */ }
}
```

### Query Parameters Support
```
?category=Backend              - Filter by category
?featured=true                 - Filter featured items
?include_hidden=true           - Show hidden items
?take=10                       - Limit results
?skip=0                        - Offset results
```

---

## Component Architecture

### Frontend Component Hierarchy
```
app/page.tsx (Home Page)
    └── PortfolioHome (Main Component)
        ├── Hero Section
        │   ├── Avatar Image
        │   ├── Name & Title
        │   ├── Bio Text
        │   └── Social Links
        │
        ├── Skills Section
        │   └── Skills Grid (Grouped by Category)
        │       ├── Backend Skills
        │       ├── Frontend Skills
        │       ├── Database Skills
        │       ├── DevOps Skills
        │       ├── Mobile Skills
        │       └── Design Skills
        │
        ├── Experience Section
        │   └── Experience Items (Timeline)
        │       ├── Company & Position
        │       ├── Duration
        │       ├── Description
        │       └── Technologies Used
        │
        ├── Projects Section
        │   └── Project Cards (Grid)
        │       ├── Project Image
        │       ├── Title & Description
        │       ├── Tech Stack
        │       └── Demo/Source Links
        │
        └── Contact Section
            └── Call-to-Action Button
                └── Email Link
```

---

## Validation Architecture

### Input Validation Layers
```
Request
    ↓
Zod Schema Validation
    ├─ Type checking
    ├─ Format validation
    ├─ Required field checking
    └─ Custom rules
    ↓
Prisma Validation
    ├─ Unique constraint checks
    ├─ Foreign key validation
    └─ Data type matching
    ↓
Response
```

### Validation Schemas (Zod)
```
personalInfoSchema
skillSchema
experienceSchema
educationSchema
projectSchema
certificationSchema
languageSchema
testimonialSchema
contactMessageSchema
```

---

## Caching Strategy

### Frontend Caching (ISR - Incremental Static Regeneration)
```
GET /api/portfolio/personal     - Cache: 3600s (1 hour)
GET /api/portfolio/skills       - Cache: 3600s (1 hour)
GET /api/portfolio/experience   - Cache: 3600s (1 hour)
GET /api/portfolio/education    - Cache: 3600s (1 hour)
GET /api/portfolio/projects     - Cache: 3600s (1 hour)
GET /api/portfolio/certifications - Cache: 3600s (1 hour)
GET /api/portfolio/languages    - Cache: 3600s (1 hour)
GET /api/portfolio/testimonials - Cache: 3600s (1 hour)
POST /api/portfolio/contact     - Cache: no-store (real-time)
```

---

## Error Handling Strategy

### Error Types & Responses
```
Validation Error
└─ 400 Bad Request
   └─ { ok: false, error: "Validation failed", details: [...] }

Not Found
└─ 404 Not Found
   └─ { ok: false, error: "Resource not found" }

Server Error
└─ 500 Internal Server Error
   └─ { ok: false, error: "Internal server error" }

Database Error
└─ 500 Internal Server Error
   └─ { ok: false, error: "Database error" }
```

---

## Deployment Architecture

### Potential Deployment Options
```
Frontend (Next.js)
└─ Vercel / Netlify / AWS Amplify
   ├─ Auto-scaling
   ├─ CDN distribution
   └─ Environment variables

Backend (Next.js API)
└─ Vercel / Railway / AWS EC2
   ├─ Auto-scaling
   ├─ Environment variables
   └─ Database connection

Database (MySQL)
└─ Cloud MySQL
   ├─ AWS RDS
   ├─ DigitalOcean
   ├─ Railway
   └─ PlanetScale
```

---

## Security Architecture

### Security Measures Implemented
- ✅ Input validation (Zod)
- ✅ CORS configuration
- ✅ JWT authentication (setup ready)
- ✅ Rate limiting (configured)
- ✅ Error message sanitization
- ✅ Environment variables for secrets

### Recommended for Production
- 🔒 HTTPS/SSL
- 🔒 Database encryption
- 🔒 API key authentication
- 🔒 Request signing
- 🔒 Rate limiting per IP
- 🔒 CORS whitelist
- 🔒 Input size limits
- 🔒 SQL injection prevention (Prisma handles this)

---

## Performance Optimization

### Current Optimizations
- ✅ ISR caching strategy
- ✅ Server-side rendering
- ✅ Database query optimization (Prisma)
- ✅ Index on frequently queried fields
- ✅ Modular component architecture

### Recommended Future Optimizations
- 🚀 Image optimization (Next.js Image)
- 🚀 Code splitting
- 🚀 Lazy loading
- 🚀 Compression (gzip)
- 🚀 Database connection pooling
- 🚀 Query result caching (Redis)
- 🚀 CDN for static assets
- 🚀 Database query profiling

---

## Technology Stack Justification

| Technology | Why Chosen |
|-----------|-----------|
| **Next.js 16** | Full-stack framework, SSR, ISR, API routes |
| **React 19** | Modern UI library, component-based |
| **TypeScript** | Type safety, better DX, fewer bugs |
| **Prisma** | Type-safe ORM, excellent DX, migrations |
| **MySQL** | Reliable, widely supported, good for relational data |
| **Tailwind CSS** | Utility-first, rapid development, responsive |
| **Zod** | Schema validation, type inference from schemas |
| **JWT** | Stateless authentication, scalable |

---

## Scalability Considerations

### Current Limits & Solutions
```
User Growth
├─ Current: Suitable for 1-100k monthly users
├─ Scale: Implement caching layer (Redis)
└─ Fix: Database replication, read replicas

Data Growth
├─ Current: Suitable for 10k+ records
├─ Scale: Implement pagination, search indexing
└─ Fix: Archive old data, database sharding

Traffic Growth
├─ Current: Suitable for 100-500 req/sec
├─ Scale: Load balancing, auto-scaling
└─ Fix: CDN, API gateway, microservices
```

---

## Monitoring & Logging

### Recommended Setup
- 📊 Application logs (console/file)
- 📊 Error tracking (Sentry)
- 📊 Performance monitoring (New Relic/DataDog)
- 📊 Database monitoring (Cloud provider tools)
- 📊 API monitoring (Postman/Insomnia)

---

**Architecture Version**: 1.0.0
**Last Updated**: April 21, 2026
**Status**: Production Ready ✅
