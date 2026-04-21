# 🚀 Quick Start Guide

## Dalam 5 Menit Bisa Running

### Step 1: Install & Setup (1 menit)

```bash
# Install semua dependencies
pnpm install

# Setup environment (cek existing .env files)
# Backend: apps/backend/.env
# Frontend: apps/frontend/.env.local
```

### Step 2: Database Setup (1 menit)

```bash
# Reset dan seed database dengan portfolio data
cd apps/backend
prisma migrate reset --force
```

✅ Database siap dengan:

- 17 skills
- 5 experiences
- 2 educations
- 3 projects
- 3 certifications
- Admin user (admin@example.com / admin123)

### Step 3: Run Backend (1 menit)

```bash
# Terminal 1
pnpm dev:backend
```

Wait sampai muncul: `✓ Ready in ...`

### Step 4: Run Frontend (1 menit)

```bash
# Terminal 2
pnpm dev:frontend
```

### Step 5: Open Browser (1 menit)

```
http://localhost:3001
```

---

## Apa yang Bisa Dilihat

### 👤 Public Portfolio

- Personal profile section
- Skills (grouped by category)
- Work experience timeline
- Featured projects
- Contact information
- Responsive design (coba di mobile!)

### 🔐 Admin CMS (Optional)

- Login: http://localhost:3001/cms
- Credentials: admin@example.com / admin123
- Manage portfolio data (masih dalam development)

### 🔧 API Endpoints

Semua endpoint sudah tested:

```bash
# Check backend health
curl http://localhost:3000/api/health

# Get personal info
curl http://localhost:3000/api/portfolio/personal

# Get all skills
curl http://localhost:3000/api/portfolio/skills

# Get experience
curl http://localhost:3000/api/portfolio/experience

# Get projects
curl http://localhost:3000/api/portfolio/projects

# Submit contact form
curl -X POST http://localhost:3000/api/portfolio/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","subject":"Hi","message":"Hello"}'
```

---

## Struktur Project

```
npmv2/
├── apps/
│   ├── backend/         ← API server (port 3000)
│   │   ├── prisma/      ← Database schema & seed
│   │   ├── app/api/     ← API endpoints
│   │   └── src/lib/     ← Utilities
│   │
│   └── frontend/        ← Web app (port 3001)
│       ├── app/         ← Pages
│       └── lib/         ← API client
│
├── COMPLETION_REPORT.md ← Apa yang sudah jadi
├── IMPLEMENTATION.md    ← Technical details
└── README.md           ← Project overview
```

---

## Features yang Sudah Ada

### Backend ✅

- [x] 12 database models (Prisma)
- [x] 10 API endpoint groups
- [x] Input validation (Zod)
- [x] JWT authentication
- [x] Error handling
- [x] CORS support
- [x] Seed data dengan portfolio lengkap

### Frontend ✅

- [x] Portfolio display component
- [x] Dark theme
- [x] Responsive design
- [x] API client functions
- [x] Loading states
- [x] Type-safe data

### Data ✅

- [x] Naufal's profile
- [x] 17 skills (categorized)
- [x] 5 work experiences
- [x] 2 educations
- [x] 3 projects
- [x] 3 certifications
- [x] 2 languages
- [x] 2 testimonials

---

## Troubleshooting

### ❌ "Database connection error"

```bash
# Check .env di apps/backend/
# DATABASE_URL harus sesuai dengan MySQL setup kamu
# Default: mysql://root:password@localhost:3306/npmv2

# Pastikan MySQL running:
mysql -u root -p
```

### ❌ "Cannot find module"

```bash
# Install ulang dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### ❌ "Port already in use"

```bash
# Backend port 3000:
lsof -i :3000
kill -9 <PID>

# Frontend port 3001:
lsof -i :3001
kill -9 <PID>
```

### ❌ "API 404 error"

```bash
# Pastikan backend running di terminal 1
# Check: http://localhost:3000/api/health

# Response should be: {"ok": true}
```

---

## Useful Commands

```bash
# Development
pnpm dev:backend        # Run backend
pnpm dev:frontend       # Run frontend
pnpm dev:both          # Run both (if supported)

# Database
pnpm seed              # Run seed script
pnpm prisma studio    # Open database GUI

# Building
pnpm build:backend     # Build for production
pnpm build:frontend    # Build for production

# Linting
pnpm lint              # Run ESLint

# Database management
cd apps/backend && prisma migrate status   # Check migrations
cd apps/backend && prisma migrate reset --force  # Reset + seed
```

---

## API Documentation

### Base URL

```
http://localhost:3000
```

### Personal Info

```
GET    /api/portfolio/personal
PUT    /api/portfolio/personal
```

### Skills

```
GET    /api/portfolio/skills
POST   /api/portfolio/skills
GET    /api/portfolio/skills?category=Backend
```

### Experience

```
GET    /api/portfolio/experience
POST   /api/portfolio/experience
```

### Education

```
GET    /api/portfolio/education
POST   /api/portfolio/education
```

### Projects

```
GET    /api/portfolio/projects
POST   /api/portfolio/projects
GET    /api/portfolio/projects?featured=true
```

### Certifications

```
GET    /api/portfolio/certifications
POST   /api/portfolio/certifications
```

### Languages

```
GET    /api/portfolio/languages
POST   /api/portfolio/languages
```

### Testimonials

```
GET    /api/portfolio/testimonials
POST   /api/portfolio/testimonials
```

### Contact Messages

```
GET    /api/portfolio/contact
POST   /api/portfolio/contact
```

---

## Example API Usage

### Get All Data

```bash
curl http://localhost:3000/api/portfolio/personal
curl http://localhost:3000/api/portfolio/skills
curl http://localhost:3000/api/portfolio/experience
curl http://localhost:3000/api/portfolio/projects
```

### Filter Skills by Category

```bash
curl "http://localhost:3000/api/portfolio/skills?category=Backend"
curl "http://localhost:3000/api/portfolio/skills?category=Frontend"
```

### Submit Contact Form

```bash
curl -X POST http://localhost:3000/api/portfolio/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "I would like to discuss a project"
  }'
```

### Add New Skill

```bash
curl -X POST http://localhost:3000/api/portfolio/skills \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Python",
    "category": "Backend",
    "proficiency": "Intermediate",
    "order": 18,
    "isVisible": true
  }'
```

---

## What's Next?

### Optional Enhancements:

1. **Admin Dashboard** - Full CRUD UI for managing portfolio
2. **Blog Section** - Add blog posts capability
3. **Analytics** - Track portfolio views
4. **Internationalization** - Multi-language support
5. **Image Uploads** - File management
6. **Email Notifications** - Send alerts on new messages
7. **Dark/Light Toggle** - Theme switcher
8. **SEO Optimization** - Meta tags, sitemap
9. **Performance** - Image optimization, caching
10. **PWA** - Progressive Web App capabilities

---

## File Locations

```
Key Files:
├── COMPLETION_REPORT.md          ← Summary of what's done
├── IMPLEMENTATION.md             ← Technical documentation
├── README.md                     ← Project overview
│
├── apps/backend/
│   ├── prisma/schema.prisma     ← Database models
│   ├── prisma/seed.js           ← Seed data
│   └── app/api/portfolio/       ← API endpoints
│
└── apps/frontend/
    ├── lib/portfolio-api.ts     ← API client
    └── app/components/          ← React components
```

---

## Support

For issues or questions:

1. Check COMPLETION_REPORT.md for feature status
2. Check IMPLEMENTATION.md for technical details
3. Check existing API endpoints in apps/backend/app/api/
4. Check frontend components in apps/frontend/app/

---

**Happy coding! 🚀**
