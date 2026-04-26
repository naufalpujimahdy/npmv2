# Portfolio CMS - Quick Start Guide

## Getting Started

### 1. Ensure Both Servers Are Running

**Backend (API Server)**

```bash
cd apps/backend
pnpm dev
# Should start on http://localhost:3000
```

**Frontend (CMS)**

```bash
cd apps/frontend
pnpm dev
# Should start on http://localhost:3001
```

### 2. Login to CMS

1. Go to `http://localhost:3001/cms/login`
2. Use your credentials:
   - Username: Your admin username
   - Password: Your admin password
3. After successful login, you'll be redirected to the dashboard

### 3. Navigate the CMS

The CMS has 4 main sections:

#### Dashboard (`/cms`)

- Overview of your content statistics
- Draft vs Published content count
- Portfolio items count
- Recent activity

#### Content Management (`/cms/content`)

- View all content entries
- Search/filter content
- Create new content (`/cms/content/new`)
- Edit existing content
- Delete content

#### Portfolio Management (`/cms/portfolio`)

- Manage all portfolio sections
- Projects - Your work/projects
- Skills - Technical skills
- Experience - Work history
- Education - Education background
- Certifications - Certificates
- Languages - Languages you speak
- Testimonials - Client/colleague testimonials

#### Settings (`/cms/settings`)

- Configure site settings
- Manage contact information
- API key management

### 4. Common Tasks

#### Create New Content

1. Go to **Content** → Click "New Content" button
2. Fill in the form:
   - Title: Main heading
   - Slug: URL-friendly identifier
   - Content: Article content
   - Type: Article, Page, or Snippet
   - Status: Draft or Published
3. Click "Create Content"

#### Create New Project

1. Go to **Portfolio** → Click "Projects" tab
2. Click "Add Project" button
3. Fill in project details
4. Click "Save Project"

#### Add Skill

1. Go to **Portfolio** → Click "Skills" tab
2. Click "Add Skill" button
3. Fill in skill information:
   - Name: Skill name
   - Category: Category (e.g., "Frontend", "Backend")
   - Level: Proficiency level
4. Click "Add Skill"

### 5. Content Status

Content can have different statuses:

- **DRAFT**: Hidden from public, only visible in CMS
- **PUBLISHED**: Visible on your portfolio website
- **ARCHIVED**: Old content, hidden from public

### 6. Tips

- Always save your work frequently
- Use descriptive titles and slugs
- Mark content as Draft first, then publish when ready
- Featured flag on projects makes them appear first
- Hidden items won't show on the public portfolio

## Troubleshooting

### Can't access CMS

- Make sure backend is running on port 3000
- Make sure frontend is running on port 3001
- Clear browser cache and cookies
- Try logging in again

### Content not showing

- Make sure content status is "PUBLISHED"
- Check if you have proper authentication
- Wait a few seconds for content to sync

### Changes not saving

- Check browser console for errors
- Make sure backend API is responding
- Try refreshing the page

## Default Admin Credentials

Set these in your `.env` file:

```env
# Backend
ADMIN_API_KEY=your_admin_key
JWT_SECRET=your_secret_key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Support

For issues, check:

1. Backend logs (port 3000)
2. Frontend console (F12)
3. Browser Network tab
4. API response errors

## Next Features Coming

- [ ] Rich text editor
- [ ] Image upload support
- [ ] Bulk operations
- [ ] Advanced search
- [ ] Analytics dashboard
- [ ] Dark mode
