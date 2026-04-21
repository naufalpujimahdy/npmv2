# Struktur Project - Portfolio + CMS

## Overview Lengkap

Project ini adalah portfolio personal website dengan CMS backend untuk management konten.

```
npmv2/ (root)
├── apps/
│   ├── backend/           # API Server (Port 3000)
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── api/       # REST API Endpoints
│   │   │       ├── auth/
│   │   │       ├── content/
│   │   │       ├── portfolio/
│   │   │       ├── settings/
│   │   │       └── health/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.js
│   │   ├── src/
│   │   │   ├── lib/       # Utilities & helpers
│   │   │   └── models/    # Database models
│   │   └── package.json
│   │
│   └── frontend/          # Frontend App (Port 3001)
│       ├── app/
│       │   ├── page.tsx   # Public portfolio page
│       │   ├── layout.tsx
│       │   └── cms/       # CMS Routes
│       │       ├── page.tsx         # Dashboard
│       │       ├── layout.tsx
│       │       ├── login/
│       │       ├── content/         # Content manager
│       │       ├── portfolio/       # Portfolio manager
│       │       └── settings/        # Settings page
│       ├── components/
│       │   ├── cms/       # CMS Components
│       │   │   ├── CmsSidebar.tsx
│       │   │   ├── DashboardOverview.tsx
│       │   │   ├── ContentManager.tsx
│       │   │   ├── ContentForm.tsx
│       │   │   ├── PortfolioManager.tsx
│       │   │   ├── ProjectsSection.tsx
│       │   │   └── SkillsSection.tsx
│       │   ├── ui/        # UI Components
│       │   └── PortfolioHome.tsx   # Public portfolio display
│       ├── hooks/
│       │   ├── useCmsAuth.ts       # Auth management
│       │   └── useCmsApi.ts        # API requests
│       ├── lib/
│       │   ├── portfolio-api.ts    # Public API client
│       │   └── utils.ts
│       └── package.json
│
├── public/                # Static assets
├── QUICKSTART_CMS.md      # CMS Quick Start
├── CMS_DOCUMENTATION.md   # CMS Docs
├── CMS_FEATURES.md        # CMS Features
├── README.md              # Project README
└── pnpm-workspace.yaml    # Monorepo config
```

## Service Breakdown

### 1. Backend API (Port 3000)

**Teknologi:**

- Next.js 16
- Prisma ORM
- SQLite/PostgreSQL Database
- JWT Authentication

**Fungsi:**

- REST API endpoints
- Database management
- Authentication & authorization
- Content & portfolio data

**Key Routes:**

```
Authentication:
  POST   /api/auth/register      - Register user
  POST   /api/auth/login         - Login
  POST   /api/auth/refresh       - Refresh token
  GET    /api/auth/me            - Current user

Content Management:
  GET    /api/content            - List content
  POST   /api/content            - Create content
  PUT    /api/content/:id        - Update content
  DELETE /api/content/:id        - Delete content

Portfolio:
  GET    /api/portfolio/projects
  GET    /api/portfolio/skills
  GET    /api/portfolio/experience
  GET    /api/portfolio/education
  GET    /api/portfolio/certifications
  GET    /api/portfolio/languages
  GET    /api/portfolio/testimonials

Settings:
  GET    /api/settings
  POST   /api/settings

Health:
  GET    /api/health             - Health check
```

### 2. Frontend - Public Portfolio (Port 3001)

**Teknologi:**

- Next.js 16
- React 19
- Tailwind CSS
- TypeScript

**Fungsi:**

- Display portfolio website
- Show projects, skills, experience
- Contact information
- Public-facing content

**Pages:**

- `/` - Home page
- `/projects` - Projects listing
- `/about` - About page
- `/contact` - Contact page

### 3. Frontend - CMS Admin (Port 3001)

**Teknologi:**

- Next.js 16 (same frontend)
- React hooks
- Radix UI components
- JWT authentication

**Fungsi:**

- Manage content
- Manage portfolio items
- Configure site settings
- Admin dashboard

**Pages:**

- `/cms/login` - Login
- `/cms` - Dashboard
- `/cms/content` - Content manager
- `/cms/portfolio` - Portfolio manager
- `/cms/settings` - Settings

## Database Schema

```sql
-- Users
CREATE TABLE "User" (
  id INT PRIMARY KEY,
  username VARCHAR UNIQUE,
  email VARCHAR UNIQUE,
  passwordHash VARCHAR,
  createdAt DATETIME,
  updatedAt DATETIME
)

-- Content Entries
CREATE TABLE "ContentEntry" (
  id INT PRIMARY KEY,
  slug VARCHAR UNIQUE,
  title VARCHAR,
  content TEXT,
  type VARCHAR,
  status VARCHAR,
  locale VARCHAR,
  section VARCHAR,
  createdAt DATETIME,
  updatedAt DATETIME
)

-- Site Settings
CREATE TABLE "SiteSetting" (
  id INT PRIMARY KEY,
  key VARCHAR UNIQUE,
  value TEXT,
  description TEXT,
  updatedAt DATETIME
)

-- Portfolio Items (Projects, Skills, Experience, etc.)
-- Managed via separate Prisma models
```

## Authentication Flow

```
User Login
    ↓
POST /api/auth/login (username, password)
    ↓
Backend validates & returns JWT token
    ↓
Frontend stores token in sessionStorage
    ↓
All subsequent requests include Authorization header
    ↓
If token expires, refresh using refresh token
    ↓
If refresh fails, redirect to login
```

## API Response Format

**Success Response:**

```json
{
  "ok": true,
  "data": {
    "id": 1,
    "title": "My Project",
    ...
  }
}
```

**Error Response:**

```json
{
  "ok": false,
  "error": "Error message here"
}
```

## Development Workflow

### Start Development

```bash
# Terminal 1 - Backend API
cd apps/backend
pnpm dev
# Runs on http://localhost:3000

# Terminal 2 - Frontend
cd apps/frontend
pnpm dev
# Runs on http://localhost:3001
```

### Build for Production

```bash
# Backend
cd apps/backend
pnpm build
pnpm start

# Frontend
cd apps/frontend
pnpm build
pnpm start
```

## Environment Variables

**.env (Backend)**

```env
DATABASE_URL=file:./dev.db
JWT_SECRET=your_secret_key
JWT_EXPIRE=1h
REFRESH_TOKEN_SECRET=refresh_secret
REFRESH_TOKEN_EXPIRE=7d
ADMIN_API_KEY=admin_key_here
```

**.env.local (Frontend)**

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Deployment

For production deployment:

1. Set environment variables
2. Build both apps
3. Deploy backend to server/cloud
4. Deploy frontend to Vercel/server
5. Update NEXT_PUBLIC_API_URL to production API
6. Setup database (PostgreSQL recommended)
7. Run migrations

## Key Features

✅ **CMS System**

- Content management
- Portfolio management
- Settings configuration
- User authentication

✅ **Public Portfolio**

- Display projects
- Show skills & experience
- Contact information
- About section

✅ **Security**

- JWT authentication
- Token refresh
- Protected routes
- Admin API keys

✅ **Database**

- Prisma ORM
- Type-safe queries
- Migrations support
- Seed data

✅ **Responsive Design**

- Mobile-friendly
- Desktop optimized
- Tablet support
- Dark navigation

## Technology Stack Summary

| Layer              | Technology      |
| ------------------ | --------------- |
| Frontend Framework | Next.js 16      |
| Language           | TypeScript      |
| Styling            | Tailwind CSS    |
| UI Components      | Radix UI        |
| Icons              | Lucide React    |
| Database ORM       | Prisma          |
| Authentication     | JWT             |
| API Style          | REST            |
| Monorepo           | pnpm workspaces |
| Runtime            | Node.js         |

## Project Status

✅ Backend API - Complete
✅ Public Portfolio - Complete
✅ CMS Frontend - Complete
✅ Authentication System - Complete
✅ Database Schema - Complete
✅ Documentation - Complete

🔄 In Progress:

- Advanced features (image upload, rich text)
- Analytics dashboard
- User management

📋 Planned:

- Dark mode
- Multi-language support
- Email notifications
- API rate limiting

## Getting Help

1. Check documentation files
2. Review API endpoints
3. Check browser console for errors
4. Check backend logs
5. Verify environment variables

## Next Steps

1. Customize portfolio content
2. Add your projects
3. Configure site settings
4. Deploy to production
5. Add custom domain

---

**Proyek sudah siap untuk production! 🚀**
