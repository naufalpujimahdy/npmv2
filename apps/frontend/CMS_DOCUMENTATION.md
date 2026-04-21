# Portfolio CMS - Frontend Documentation

## Overview
Frontend CMS untuk management konten portfolio Anda. Dibangun dengan Next.js 16 dan Tailwind CSS.

## Features

### 1. Authentication
- Login page dengan form sederhana
- JWT token management dengan refresh token
- Session storage untuk token
- Auto-logout jika token expired

### 2. Dashboard
- Overview statistik konten
- Quick stats cards
- Recent activity tracking
- Content status overview

### 3. Content Management
- Manage artikel/halaman konten
- Create, read, update, delete konten
- Filter berdasarkan judul
- Status badges (Draft, Published, Archived)
- Type indicators (Article, Page, Snippet)

### 4. Portfolio Management
- **Projects**: Manage portfolio projects dengan featured flag
- **Skills**: Manage skills by category dengan level
- **Experience**: (coming soon)
- **Education**: (coming soon)
- **Certifications**: (coming soon)
- **Languages**: (coming soon)
- **Testimonials**: (coming soon)

### 5. Site Settings
- General site configuration
- Contact information management
- API key management (coming soon)

## Project Structure

```
apps/frontend/
├── app/
│   └── cms/
│       ├── page.tsx                 # Dashboard
│       ├── content/
│       │   ├── page.tsx             # Content list
│       │   └── new/page.tsx         # Create content
│       ├── portfolio/
│       │   └── page.tsx             # Portfolio manager
│       ├── settings/
│       │   └── page.tsx             # Settings page
│       └── login/
│           └── page.tsx             # Login page
├── components/
│   ├── cms/
│   │   ├── CmsShell.tsx             # Old shell (deprecated)
│   │   ├── CmsSidebar.tsx           # Navigation sidebar
│   │   ├── DashboardOverview.tsx    # Dashboard component
│   │   ├── ContentManager.tsx       # Content table manager
│   │   ├── PortfolioManager.tsx     # Portfolio tabs manager
│   │   ├── ContentForm.tsx          # Content form
│   │   ├── ProjectsSection.tsx      # Projects list
│   │   └── SkillsSection.tsx        # Skills grid
│   └── ui/                          # UI components
├── hooks/
│   ├── useCmsAuth.ts                # Auth hook
│   └── useCmsApi.ts                 # API request hook
└── lib/
    └── portfolio-api.ts             # Portfolio API client
```

## Hooks

### `useCmsAuth()`
Mengelola authentication state dan token.

```typescript
const { user, token, loading, error, logout, isAuthenticated } = useCmsAuth();
```

### `useCmsApi()`
Membuat API requests dengan auth headers otomatis.

```typescript
const { request, loading, error } = useCmsApi();
const data = await request('/api/endpoint', {
  method: 'POST',
  body: { ... }
});
```

## API Endpoints

### Content
- `GET /api/content` - List all content
- `GET /api/content?status=DRAFT` - Filter by status
- `POST /api/content` - Create content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

### Portfolio
- `GET /api/portfolio/projects?include_hidden=true`
- `GET /api/portfolio/skills?include_hidden=true`
- `GET /api/portfolio/experience?include_hidden=true`
- `GET /api/portfolio/education?include_hidden=true`
- `GET /api/portfolio/certifications?include_hidden=true`
- `GET /api/portfolio/languages?include_hidden=true`
- `GET /api/portfolio/testimonials?include_hidden=true`

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Running the CMS

### Development
```bash
cd apps/frontend
pnpm dev
```
CMS akan berjalan di `http://localhost:3001`

### Production Build
```bash
pnpm build
pnpm start
```

## UI Components

Semua komponen UI berada di `components/ui/`:
- `avatar.tsx` - Avatar component
- `badge.tsx` - Badge/label component
- `button.tsx` - Button component
- `card.tsx` - Card component
- `input.tsx` - Input field component
- `separator.tsx` - Separator/divider
- `skeleton.tsx` - Loading skeleton
- `table.tsx` - Data table
- `tabs.tsx` - Tab navigation (Radix UI)

## Navigation

Sidebar navigation mengarah ke:
- `/cms` - Dashboard
- `/cms/content` - Content manager
- `/cms/portfolio` - Portfolio manager
- `/cms/settings` - Site settings

## Styling

Menggunakan Tailwind CSS v4 dengan:
- Custom CSS variables untuk styling konsisten
- Responsive design (mobile-first)
- Dark mode ready

## Authentication Flow

1. User login di `/cms/login`
2. Token disimpan di `sessionStorage`
3. `layout-client.tsx` mengecek token pada mount
4. Jika tidak ada token, redirect ke login
5. API requests otomatis include Authorization header
6. Jika token expired, bisa refresh atau logout

## Next Steps

### High Priority
1. ✅ Setup dashboard & basic layout
2. ✅ Content management UI
3. ✅ Portfolio sections overview
4. 🔄 Complete portfolio section editors (Experience, Education, etc.)
5. 🔄 Delete functionality untuk all sections
6. 🔄 Image/file upload

### Medium Priority
- Rich text editor untuk konten
- Search & filter improvements
- Bulk operations
- Analytics dashboard

### Low Priority
- Dark mode toggle
- User preferences
- Activity log
- Notifications

## Notes

- Frontend dan backend harus running untuk CMS berfungsi
- Backend berjalan di port 3000
- Frontend berjalan di port 3001
- Semua komunikasi melalui REST API dengan JWT auth
