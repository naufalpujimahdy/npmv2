# npmv2 - Portfolio CMS

Monorepo full-stack Next.js dengan backend API dan frontend CMS untuk portfolio interaktif.

- `apps/backend`: Next.js API dengan Prisma ORM & autentikasi JWT (port 3000)
- `apps/frontend`: Next.js frontend dengan CMS interface (port 3001)

## Fitur

✅ **Authentication**: Register, Login, JWT Token Refresh  
✅ **Portfolio Management**: Skills, Experience, Projects, Education, Certifications, Testimonials  
✅ **Dynamic Content**: CMS untuk mengelola portfolio entries  
✅ **Admin Panel**: Dashboard CMS dengan sidebar navigation  
✅ **API Endpoints**: RESTful API untuk semua portfolio data

## Struktur Direktori

```
npmv2/
├── apps/
│   ├── backend/           # Next.js API server
│   │   ├── app/api/       # Route handlers
│   │   ├── prisma/        # Database schema & migrations
│   │   └── src/lib/       # Utilities (auth, db, validation)
│   └── frontend/          # Next.js CMS client
│       ├── app/cms/       # CMS pages & login
│       └── components/    # Reusable UI components
├── eslint.config.mjs      # ESLint config (workspace-wide)
├── tsconfig.json          # TypeScript config (workspace-wide)
└── pnpm-workspace.yaml    # Workspace configuration
```

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Konfigurasi Environment Variables

Backend (`apps/backend/.env`):

```env
DATABASE_URL=mysql://root:password@localhost:3306/npmv2
JWT_SECRET=your-secret-key-here
```

Frontend (`apps/frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Inisialisasi Database

```bash
cd apps/backend

# Generate Prisma Client
pnpm prisma:generate

# Jalankan migrations
pnpm prisma migrate deploy

# Seed database (optional)
pnpm seed
```

### 4. Jalankan Development Server

Terminal 1 - Backend:

```bash
pnpm dev:backend
```

Terminal 2 - Frontend:

```bash
pnpm dev:frontend
```

## Akses Aplikasi

- **Frontend CMS**: http://localhost:3001
- **Backend Health Check**: http://localhost:3000/api/health
- **API Documentation**: Lihat endpoint di `apps/backend/app/api/`

## Endpoints Utama

### Authentication

- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login & dapatkan JWT token
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get user profile

### Portfolio

- `GET /api/portfolio/skills` - Daftar skills
- `GET /api/portfolio/experience` - Daftar experience
- `GET /api/portfolio/projects` - Daftar projects
- `GET /api/portfolio/education` - Daftar education
- `GET /api/portfolio/certifications` - Daftar certifications
- `GET /api/portfolio/testimonials` - Daftar testimonials
- `GET /api/portfolio/contact` - Contact info

### Content Management

- `GET /api/content` - Daftar semua content
- `GET /api/content/[id]` - Get content by ID
- `GET /api/content/slug/[slug]` - Get content by slug

## Scripts

```bash
# Development
pnpm dev:backend       # Start backend server
pnpm dev:frontend      # Start frontend server
pnpm dev               # Start both (dari root)

# Production
pnpm build:backend     # Build backend
pnpm build:frontend    # Build frontend

# Database
pnpm db:seed           # Seed database
pnpm db:reset          # Reset database (dev only)

# Linting
pnpm lint              # Run ESLint
```

## Database Schema

Lihat [PORTFOLIO_DATABASE_DESIGN.md](./PORTFOLIO_DATABASE_DESIGN.md) untuk dokumentasi lengkap database schema.
