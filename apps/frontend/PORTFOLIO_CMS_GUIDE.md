# Frontend CMS Portfolio - Petunjuk Implementasi & Penggunaan

## ✅ Status Implementasi

Frontend CMS Portfolio telah **SELESAI DIKERJAKAN** dengan fitur CRUD lengkap untuk semua modul portfolio.

---

## 📋 Daftar Komponen yang Telah Dibuat

### 1. Dashboard & Navigation

- **PortfolioManager.tsx** - Dashboard utama dengan stats dan tab navigation

### 2. Section Components (8 sections)

Setiap section adalah komponen React dengan CRUD lengkap:

| #   | Section           | File                      | Features                             |
| --- | ----------------- | ------------------------- | ------------------------------------ |
| 1   | Informasi Pribadi | PersonalInfoSection.tsx   | Form update, multiple fields         |
| 2   | Proyek            | ProjectsSection.tsx       | List, Search, CRUD dengan form modal |
| 3   | Pengalaman Kerja  | ExperienceSection.tsx     | Table view, CRUD dengan form modal   |
| 4   | Pendidikan        | EducationSection.tsx      | Table view, CRUD dengan form modal   |
| 5   | Keahlian          | SkillsSection.tsx         | Grid view, CRUD dengan form modal    |
| 6   | Sertifikasi       | CertificationsSection.tsx | Table view, CRUD dengan form modal   |
| 7   | Bahasa            | LanguagesSection.tsx      | Grid view, CRUD dengan form modal    |
| 8   | Testimoni         | TestimonialsSection.tsx   | Card grid, CRUD dengan form modal    |

### 3. Form Components (7 forms)

Modal form untuk setiap tipe data:

- ProjectForm.tsx - Slug auto-generator, multiple fields
- ExperienceForm.tsx - Date handling, current job flag
- EducationForm.tsx - Full education management
- SkillForm.tsx - Dropdown categories & levels
- CertificationForm.tsx - Credential management
- LanguageForm.tsx - Proficiency levels
- TestimonialForm.tsx - Review management

---

## 🚀 Quick Start

### 1. Akses CMS Portfolio

```
1. Navigate ke: http://localhost:3000/cms/portfolio
2. Akan redirect ke login jika belum authenticated
3. Setelah login, dashboard ditampilkan
```

### 2. Tab Navigation

Dashboard menampilkan 8 tab:

- **Info** - Update profil pribadi
- **Proyek** - Kelola proyek portfolio
- **Kerja** - Riwayat pengalaman kerja
- **Pendidikan** - Riwayat pendidikan
- **Keahlian** - Skill/keahlian teknis
- **Sertifikat** - Sertifikasi profesional
- **Bahasa** - Bahasa yang dikuasai
- **Testimoni** - Review dari klien/kolega

### 3. CRUD Operations

#### CREATE (Tambah Data)

```
1. Click tombol "Tambah" di section apapun
2. Modal form akan terbuka
3. Isi form fields yang diperlukan (bertanda *)
4. Click "Simpan"
5. List akan auto-refresh
```

#### READ (Lihat Data)

```
1. Setiap section menampilkan list/grid data
2. Gunakan search field untuk filter
3. Data ditampilkan dengan status visibility
4. Stats cards menunjukkan jumlah item per section
```

#### UPDATE (Edit Data)

```
1. Click tombol "Edit" (pensil icon) pada item
2. Modal form terbuka dengan data existing
3. Ubah fields yang diinginkan
4. Click "Simpan"
5. List akan auto-refresh
```

#### DELETE (Hapus Data)

```
1. Click tombol "Hapus" (trash icon) pada item
2. Konfirmasi dialog akan muncul
3. Click "OK" untuk confirm atau "Cancel"
4. Jika confirm, item akan dihapus
5. List akan auto-refresh
```

---

## 🎯 Fitur Per Section

### Info Pribadi (PersonalInfoSection)

```
Fields:
- Nama Lengkap (required)
- Gelar/Profesi (required)
- Bio (required)
- Email (required)
- Nomor Telepon (optional)
- Lokasi (optional)
- Avatar URL (optional)
- Resume URL (optional)
- LinkedIn URL (optional)
- GitHub URL (optional)
- Website URL (optional)

Notes:
- Form langsung update, bukan modal
- Single record (hanya 1 profil)
```

### Proyek (ProjectsSection)

```
Fields:
- Judul (required)
- Slug (required, auto-generate)
- Deskripsi Singkat (required)
- Deskripsi Lengkap (optional)
- Teknologi (required, comma-separated)
- Gambar URLs (comma-separated)
- Demo URL (optional)
- Source Code URL (optional)
- Status (completed, in-progress, planned)
- Tanggal Mulai (optional)
- Tanggal Selesai (optional)
- Proyek Unggulan (checkbox)
- Tampilkan (checkbox)

Features:
- Auto-generate slug dari judul
- Search by title
- Status badge (Unggulan/Biasa)
- Visibility toggle
```

### Pengalaman Kerja (ExperienceSection)

```
Fields:
- Perusahaan (required)
- Posisi (required)
- Lokasi (optional)
- URL Perusahaan (optional)
- Tanggal Mulai (required)
- Tanggal Berakhir (optional, disabled jika "current")
- Saat ini bekerja di sini (checkbox)
- Deskripsi (required)
- Pencapaian (optional)
- Teknologi (comma-separated, optional)
- Tampilkan (checkbox)

Features:
- Toggle end date based on "current job"
- Search by company/position
- Status visibility
```

### Pendidikan (EducationSection)

```
Fields:
- Institusi (required)
- Gelar (required)
- Bidang Studi (required)
- Lokasi (optional)
- URL Institusi (optional)
- Tanggal Mulai (required)
- Tanggal Selesai (optional)
- GPA (optional)
- Deskripsi (optional)
- Pencapaian (optional)
- Tampilkan (checkbox)

Features:
- Search by institution/degree
- Date range display
- Achievement tracking
```

### Keahlian (SkillsSection)

```
Fields:
- Nama Keahlian (required)
- Kategori (required: Frontend/Backend/Database/Tools/DevOps/Design/Mobile/Other)
- Tingkat Keahlian (Expert/Advanced/Intermediate/Beginner)
- Icon URL (optional)
- Tampilkan (checkbox)

Features:
- Grid layout (3 columns)
- Category filter
- Proficiency level display
- Search functionality
```

### Sertifikasi (CertificationsSection)

```
Fields:
- Nama Sertifikat (required)
- Penerbit (required)
- Tanggal Penerbitan (required)
- Tanggal Berakhir (optional)
- ID Kredensial (optional)
- URL Kredensial (optional)
- URL Gambar (optional)
- Deskripsi (optional)
- Tampilkan (checkbox)

Features:
- Search by cert name/issuer
- Expiry date display
- Credential management
```

### Bahasa (LanguagesSection)

```
Fields:
- Nama Bahasa (required)
- Tingkat Kemampuan (required: Native/Fluent/Conversational/Basic)
- Tampilkan (checkbox)

Features:
- Grid layout (3 columns)
- Proficiency level display
- Search functionality
```

### Testimoni (TestimonialsSection)

```
Fields:
- Nama (required)
- Posisi (required)
- Perusahaan (required)
- Testimoni (required)
- Avatar URL (optional)
- LinkedIn URL (optional)
- Tampilkan (checkbox)

Features:
- Card grid layout (2 columns)
- Search by name/company
- Preview of testimonial text
- Avatar display
```

---

## 🔧 Validasi & Error Handling

### Form Validation

✅ Required fields marked dengan asterisk (\*)
✅ Email validation untuk email fields
✅ URL validation untuk URL fields
✅ Date picker untuk date fields
✅ Dropdown untuk enum values
✅ Character limit untuk textarea

### Error States

- API error → Toast notification (error style)
- Network error → User-friendly message
- Validation error → Highlight invalid fields
- Delete confirmation → Cancel option

### Loading States

- Spinner saat fetch data
- "Menyimpan..." button saat submit
- Disabled buttons saat loading
- Auto-dismiss notifications

---

## 🎨 UI/UX Patterns

### List Views

- **Search bar** dengan filter real-time
- **Status badges** untuk visibility
- **Action buttons** (Edit/Delete)
- **Loading skeleton** saat fetch
- **Empty state** message

### Modal Forms

- **Header** dengan title & close button
- **Form fields** organized in sections
- **Action buttons** (Cancel/Save)
- **Loading state** pada save button
- **Auto-close** setelah sukses

### Grid Views (Skills, Languages, Testimonials)

- **Card-based layout** untuk better UX
- **2-3 columns** responsive grid
- **Compact action buttons**
- **Badge status** untuk visibility

### Stats Cards

- **Icon + count** for each section
- **Color-coded** untuk setiap section
- **Real-time** count updates
- **Grid layout** responsive

---

## 📊 API Endpoints Required

Backend HARUS provide endpoints dalam format:

```
GET    /api/portfolio/{section}?include_hidden=true
GET    /api/portfolio/{section}/{id}
POST   /api/portfolio/{section}
PUT    /api/portfolio/{section}/{id}
DELETE /api/portfolio/{section}/{id}
```

Supported sections:

- projects
- experience
- education
- skills
- certifications
- languages
- testimonials
- personal

Response format:

```json
{
  "ok": true,
  "data": {
    /* item or array */
  }
}
```

---

## 🔐 Authentication

Frontend menggunakan token dari `sessionStorage`:

```typescript
const token = sessionStorage.getItem("cms-access-token");
// Attached to Authorization header: "Bearer {token}"
```

Token di-set oleh login page setelah authentication sukses.

---

## 📱 Responsive Design

- **Mobile** (< 640px): Stack layouts, single column
- **Tablet** (640px - 1024px): 2 columns grid
- **Desktop** (> 1024px): 3-4 columns grid
- **Full viewport**: Min-height responsive

---

## 🚨 Common Issues & Solutions

### Issue: Form tidak close setelah submit

**Solution**: Check API response format, harus return data dengan `ok: true`

### Issue: List tidak refresh setelah delete

**Solution**: Verify delete endpoint returns success, then `loadItems()` called

### Issue: Search tidak filter dengan benar

**Solution**: Check field names, filter berjalan pada `name`, `title`, `company`, etc.

### Issue: Modal overlap

**Solution**: Z-index set to 50, ensure no higher z-index divs

---

## ✨ Best Practices

1. **Always confirm delete** - Prevent accidental deletion
2. **Use auto-generate slug** - For URL-safe identifiers
3. **Set default order=0** - For future ordering features
4. **Include visibility toggle** - Control what's public
5. **Use dates consistently** - ISO format in DB, formatted for display
6. **Search is case-insensitive** - Better UX
7. **Auto-refresh after operation** - Keep UI in sync

---

## 📝 Contoh Penggunaan API

### Create Project

```javascript
POST /api/portfolio/projects
{
  "title": "E-Commerce Platform",
  "slug": "e-commerce-platform",
  "description": "Platform e-commerce modern",
  "longDescription": "Platform e-commerce dengan fitur...",
  "technologies": "React,Node.js,MongoDB",
  "images": "https://...,https://...",
  "demoUrl": "https://demo.example.com",
  "sourceUrl": "https://github.com/...",
  "featured": true,
  "status": "completed",
  "startDate": "2024-01-01",
  "endDate": "2024-06-30",
  "order": 0,
  "isVisible": true
}
```

### Update Experience

```javascript
PUT /api/portfolio/experience/{id}
{
  "company": "PT Tech Indonesia",
  "position": "Full Stack Developer",
  "location": "Jakarta",
  "startDate": "2023-01-15",
  "endDate": null,
  "isCurrent": true,
  "description": "Develop and maintain web applications...",
  "achievements": "- Led team of 3...",
  "technologies": "React,Node.js,PostgreSQL",
  "companyUrl": "https://tech-indonesia.com",
  "isVisible": true
}
```

---

## 🎓 Learn More

See backend implementation in:

- `/apps/backend/app/api/portfolio/` - API routes
- `/apps/backend/prisma/schema.prisma` - Data models
- `/apps/backend/src/lib/portfolio-crud.ts` - Business logic

---

**Status**: ✅ PRODUCTION READY
**Last Updated**: April 23, 2026
**Version**: 1.0.0
