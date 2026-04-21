# Portfolio Database Design - Naufal Puji Mahdy

## 📋 Overview

Database portfolio schema dirancang khusus untuk menampilkan profil profesional Naufal Puji Mahdy sebagai Full Stack Web Developer. Schema mencakup 10 model utama dengan relasi yang terstruktur untuk mendukung website portfolio yang dinamis dan mudah dikelola.

---

## 🗄️ Database Models

### 1. **PersonalInfo**

Menyimpan informasi pribadi dan kontak dasar.

| Field         | Type            | Description                                     |
| ------------- | --------------- | ----------------------------------------------- |
| `id`          | String (CUID)   | Primary key                                     |
| `fullName`    | String          | Nama lengkap: "Naufal Puji Mahdy"               |
| `title`       | String          | Profesi: "Full Stack Web Developer"             |
| `bio`         | LongText        | Deskripsi profil profesional                    |
| `email`       | String (Unique) | Email: naufalpm230800@gmail.com                 |
| `phone`       | String          | No. telepon: 082391782895                       |
| `location`    | String          | Lokasi: Jakarta Selatan, DKI Jakarta, Indonesia |
| `avatarUrl`   | String          | URL foto profil (optional)                      |
| `resumeUrl`   | String          | URL download CV (optional)                      |
| `linkedinUrl` | String          | LinkedIn profile URL (optional)                 |
| `githubUrl`   | String          | GitHub profile URL (optional)                   |
| `websiteUrl`  | String          | Website portfolio: https://naufalpujimahdy.id   |
| `createdAt`   | DateTime        | Timestamp pembuatan                             |
| `updatedAt`   | DateTime        | Timestamp update terakhir                       |

---

### 2. **Skill**

Daftar skills dan teknologi yang dikuasai.

| Field         | Type          | Description                                                   |
| ------------- | ------------- | ------------------------------------------------------------- |
| `id`          | String (CUID) | Primary key                                                   |
| `name`        | String        | Nama skill (e.g., "Laravel", "React JS")                      |
| `category`    | String        | Kategori: Backend, Frontend, Mobile, Database, DevOps, Design |
| `proficiency` | String        | Level: Expert, Advanced, Intermediate, Beginner               |
| `iconUrl`     | String        | URL icon/logo skill (optional)                                |
| `order`       | Int           | Urutan tampilan (1-20+)                                       |
| `isVisible`   | Boolean       | Kontrol visibilitas di portfolio                              |
| `createdAt`   | DateTime      | Timestamp                                                     |
| `updatedAt`   | DateTime      | Timestamp                                                     |

**Skills Naufal:**

- **Backend (Expert):** Laravel, Express JS, REST API
- **Frontend (Advanced):** React JS, React Native, Next JS, Tailwind CSS
- **Database (Advanced):** PostgreSQL, MySQL, Firebase
- **DevOps (Advanced):** Git, Docker, Nginx, VPS, JWT
- **Other:** Eloquent ORM, Prisma, jQuery, Figma, Inertia JS

---

### 3. **Experience**

Riwayat pengalaman kerja profesional.

| Field          | Type          | Description                                       |
| -------------- | ------------- | ------------------------------------------------- |
| `id`           | String (CUID) | Primary key                                       |
| `company`      | String        | Nama perusahaan                                   |
| `position`     | String        | Posisi/jabatan                                    |
| `location`     | String        | Lokasi kerja                                      |
| `startDate`    | DateTime      | Tanggal mulai bekerja                             |
| `endDate`      | DateTime      | Tanggal selesai (null jika masih bekerja)         |
| `isCurrent`    | Boolean       | Status pekerjaan saat ini                         |
| `description`  | LongText      | Deskripsi pekerjaan                               |
| `achievements` | LongText      | JSON array - Pencapaian (disimpan sebagai string) |
| `technologies` | LongText      | JSON array - Tech stack yang digunakan            |
| `companyUrl`   | String        | Website perusahaan (optional)                     |
| `order`        | Int           | Urutan tampilan (terbaru ke terlama)              |
| `isVisible`    | Boolean       | Kontrol visibilitas                               |
| `createdAt`    | DateTime      | Timestamp                                         |
| `updatedAt`    | DateTime      | Timestamp                                         |

**Pengalaman Naufal:**

1. **PHP Developer** - PT Lawencon Internasional (07/2025 - Sekarang)
   - HR System (Assessment, IDP, HAV, RTC, ICP modules)
   - Laravel, MySQL, REST API

2. **Freelance Web Developer** - Remote (06/2022 - Sekarang)
   - End-to-end web solutions, payment integration
   - Node.js, Express, PostgreSQL/MySQL, Docker

3. **Fullstack Web Developer** - PT Digital Teknologi Quantum (03/2025 - 07/2025)
   - API integration, merchant system development

4. **Jr. Full Stack Web Developer** - PT Loh Jinawi Teknologi (03/2024 - 03/2025)
   - Laravel, QR code, payment integration, REST API

5. **Junior Web Development** - PT Sistem Kesehatan Indonesia (08/2023 - 12/2023)
   - HR System development, query optimization

6. **Kerja Praktik** - SMK PL Leonardo Klaten (01/2023 - 07/2023)
   - PPDB System (Laravel + React JS)

---

### 4. **Education**

Riwayat pendidikan formal.

| Field            | Type          | Description                    |
| ---------------- | ------------- | ------------------------------ |
| `id`             | String (CUID) | Primary key                    |
| `institution`    | String        | Nama institusi pendidikan      |
| `degree`         | String        | Jenjang: S1, D3, SMK, dll      |
| `field`          | String        | Program studi/jurusan          |
| `location`       | String        | Lokasi sekolah/universitas     |
| `startDate`      | DateTime      | Tahun mulai                    |
| `endDate`        | DateTime      | Tahun lulus                    |
| `gpa`            | String        | IPK/GPA (optional)             |
| `description`    | LongText      | Deskripsi program studi        |
| `achievements`   | LongText      | JSON array - Prestasi akademik |
| `institutionUrl` | String        | Website institusi (optional)   |
| `order`          | Int           | Urutan tampilan                |
| `isVisible`      | Boolean       | Kontrol visibilitas            |
| `createdAt`      | DateTime      | Timestamp                      |
| `updatedAt`      | DateTime      | Timestamp                      |

**Pendidikan Naufal:**

1. **S1 Informatika** - Universitas Teknologi Yogyakarta (2020-2024)
   - Anggota HIMATIKA 2020-2021
   - Tugas Akhir: Aplikasi Wisata Kabupaten Siak

2. **SMK** - SMK YPPI TUALANG (2016-2019)
   - Teknik Komputer dan Jaringan
   - Asisten Lab Komputer 2018-2019

---

### 5. **Project**

Portfolio projects dan karya profesional.

| Field             | Type            | Description                             |
| ----------------- | --------------- | --------------------------------------- |
| `id`              | String (CUID)   | Primary key                             |
| `title`           | String          | Judul project                           |
| `slug`            | String (Unique) | URL-friendly identifier                 |
| `description`     | LongText        | Deskripsi singkat project               |
| `longDescription` | LongText        | Deskripsi detail project                |
| `technologies`    | LongText        | JSON array - Tech stack yang digunakan  |
| `images`          | LongText        | JSON array - URL gambar/screenshot      |
| `demoUrl`         | String          | Link demo/live project (optional)       |
| `sourceUrl`       | String          | Link GitHub repository (optional)       |
| `featured`        | Boolean         | Tampilkan di featured section           |
| `status`          | String          | Status: completed, in-progress, planned |
| `startDate`       | DateTime        | Tanggal mulai project                   |
| `endDate`         | DateTime        | Tanggal selesai project                 |
| `order`           | Int             | Urutan tampilan                         |
| `isVisible`       | Boolean         | Kontrol visibilitas                     |
| `createdAt`       | DateTime        | Timestamp                               |
| `updatedAt`       | DateTime        | Timestamp                               |

**Projects Naufal:**

1. **Aplikasi Pengenalan Objek Wisata Kabupaten Siak** (Tugas Akhir)
   - React Native (Mobile) + React JS (Web)
   - Firebase, Redux, Google Maps API
   - 09/2023 - 02/2024

2. **Sistem PPDB SMK PL Leonardo**
   - Laravel Backend, React JS Frontend
   - Tailwind CSS, responsive design
   - 01/2023 - 07/2023

3. **HR System - PT Lawencon** (In Progress)
   - Laravel, MySQL, REST API
   - Assessment, IDP, HAV, RTC, ICP modules
   - 07/2025 - Present

---

### 6. **Certification**

Sertifikasi dan training yang telah diselesaikan.

| Field           | Type          | Description                     |
| --------------- | ------------- | ------------------------------- |
| `id`            | String (CUID) | Primary key                     |
| `name`          | String        | Nama sertifikasi                |
| `issuer`        | String        | Penerbit/organizer sertifikasi  |
| `issueDate`     | DateTime      | Tanggal diterbitkan             |
| `expiryDate`    | DateTime      | Tanggal kadaluarsa (optional)   |
| `credentialId`  | String        | ID kredensial (optional)        |
| `credentialUrl` | String        | URL verifikasi (optional)       |
| `description`   | LongText      | Deskripsi sertifikasi           |
| `imageUrl`      | String        | URL badge/sertifikat (optional) |
| `order`         | Int           | Urutan tampilan                 |
| `isVisible`     | Boolean       | Kontrol visibilitas             |
| `createdAt`     | DateTime      | Timestamp                       |
| `updatedAt`     | DateTime      | Timestamp                       |

**Sertifikasi Naufal:**

1. Complete UI Design: Visual Design, Prototype, Usability Test - BuildWithAngga (09/2021)
2. UX Mini Bootcamp - Design Jam Indonesia (06/2021)
3. Membuat Halaman Belanja E-Commerce Yang Ramah Bagi Pengguna - Skilvul (02/2021)

---

### 7. **Language**

Bahasa yang dikuasai.

| Field         | Type          | Description                                  |
| ------------- | ------------- | -------------------------------------------- |
| `id`          | String (CUID) | Primary key                                  |
| `name`        | String        | Nama bahasa                                  |
| `proficiency` | String        | Level: Native, Fluent, Conversational, Basic |
| `order`       | Int           | Urutan tampilan                              |
| `isVisible`   | Boolean       | Kontrol visibilitas                          |
| `createdAt`   | DateTime      | Timestamp                                    |
| `updatedAt`   | DateTime      | Timestamp                                    |

**Bahasa Naufal:**

1. Bahasa Indonesia - Native
2. English - Dasar

---

### 8. **Testimonial**

Testimoni dari client/rekan kerja.

| Field         | Type          | Description                |
| ------------- | ------------- | -------------------------- |
| `id`          | String (CUID) | Primary key                |
| `name`        | String        | Nama pemberi testimoni     |
| `position`    | String        | Posisi/jabatan             |
| `company`     | String        | Nama perusahaan/organisasi |
| `content`     | LongText      | Isi testimonial            |
| `avatarUrl`   | String        | URL foto profil (optional) |
| `linkedinUrl` | String        | URL LinkedIn (optional)    |
| `isVisible`   | Boolean       | Kontrol visibilitas        |
| `order`       | Int           | Urutan tampilan            |
| `createdAt`   | DateTime      | Timestamp                  |
| `updatedAt`   | DateTime      | Timestamp                  |

---

### 9. **ContactMessage**

Pesan dari pengunjung portfolio.

| Field       | Type          | Description         |
| ----------- | ------------- | ------------------- |
| `id`        | String (CUID) | Primary key         |
| `name`      | String        | Nama pengirim       |
| `email`     | String        | Email pengirim      |
| `subject`   | String        | Subject pesan       |
| `message`   | LongText      | Isi pesan           |
| `isRead`    | Boolean       | Status dibaca admin |
| `createdAt` | DateTime      | Timestamp pesan     |

---

### 10. **SiteSetting** (Existing)

Pengaturan global website/portfolio.

| Field         | Type            | Description                                          |
| ------------- | --------------- | ---------------------------------------------------- |
| `id`          | Int             | Primary key                                          |
| `key`         | String (Unique) | Nama setting (e.g., "site_name", "site_description") |
| `value`       | LongText        | Nilai setting (JSON string)                          |
| `description` | String          | Deskripsi setting                                    |
| `category`    | String          | Kategori: general, seo, social, contact              |
| `createdAt`   | DateTime        | Timestamp                                            |
| `updatedAt`   | DateTime        | Timestamp                                            |

---

## 🔗 API Endpoints

### Personal Info

- `GET /api/portfolio/personal` - Dapatkan informasi pribadi
- `PUT /api/portfolio/personal` - Update informasi pribadi

### Skills

- `GET /api/portfolio/skills` - Dapatkan daftar skills
- `POST /api/portfolio/skills` - Tambah skill baru

### Experience

- `GET /api/portfolio/experience` - Dapatkan riwayat pekerjaan
- `POST /api/portfolio/experience` - Tambah pengalaman baru

### Education

- `GET /api/portfolio/education` - Dapatkan riwayat pendidikan
- `POST /api/portfolio/education` - Tambah pendidikan baru

### Projects

- `GET /api/portfolio/projects` - Dapatkan daftar projects
- `GET /api/portfolio/projects/[slug]` - Dapatkan detail project
- `POST /api/portfolio/projects` - Tambah project baru

### Certifications

- `GET /api/portfolio/certifications` - Dapatkan daftar sertifikasi
- `POST /api/portfolio/certifications` - Tambah sertifikasi baru

### Languages

- `GET /api/portfolio/languages` - Dapatkan daftar bahasa
- `POST /api/portfolio/languages` - Tambah bahasa baru

### Testimonials

- `GET /api/portfolio/testimonials` - Dapatkan testimoni
- `POST /api/portfolio/testimonials` - Tambah testimoni baru

### Contact Messages

- `GET /api/portfolio/contact` - Dapatkan semua pesan
- `POST /api/portfolio/contact` - Kirim pesan baru

### Settings

- `GET /api/portfolio/settings` - Dapatkan pengaturan portfolio
- `PUT /api/portfolio/settings` - Update pengaturan portfolio

---

## 📊 Data Structure & Constraints

### JSON Arrays (Stored as LongText)

Beberapa field menyimpan JSON array sebagai string untuk kompatibilitas dengan MariaDB:

```javascript
// achievements - array of strings
["Pencapaian 1", "Pencapaian 2", "Pencapaian 3"][
  // technologies - array of strings
  ("Laravel", "MySQL", "REST API", "Docker")
][
  // images - array of image URLs
  ("/images/project-1.jpg", "/images/project-2.jpg")
];
```

### Visibility & Ordering

- `isVisible` boolean mengontrol apakah item ditampilkan di frontend
- `order` integer mengontrol urutan tampilan di UI
- Items dengan `order` lebih kecil ditampilkan lebih dulu

### Relationships

- Semua model independent (no direct foreign keys)
- Relasi dikelola di application layer
- Personal info hanya 1 record
- Lainnya memiliki banyak records

---

## 🚀 Seed Data Status

✅ **Database telah di-seed dengan data Naufal Puji Mahdy:**

- 1 Personal Info record
- 20 Skills (berbagai kategori)
- 6 Experience records
- 2 Education records
- 3 Projects
- 3 Certifications
- 2 Languages
- 1 Testimonial

---

## 📝 Usage Examples

### Get All Skills

```bash
curl http://localhost:3000/api/portfolio/skills
```

### Get Personal Info

```bash
curl http://localhost:3000/api/portfolio/personal
```

### Get Experience

```bash
curl http://localhost:3000/api/portfolio/experience
```

### Get Project by Slug

```bash
curl http://localhost:3000/api/portfolio/projects/hr-system-laravel
```

### Add New Skill

```bash
curl -X POST http://localhost:3000/api/portfolio/skills \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TypeScript",
    "category": "Frontend",
    "proficiency": "Advanced",
    "order": 21
  }'
```

---

## 📋 Next Steps

1. **Frontend Portfolio Pages** - Buat halaman portfolio untuk menampilkan data
2. **CMS Admin Panel** - Tambahkan interface untuk mengelola data portfolio
3. **Image Upload** - Implementasi upload untuk avatar, project images, dll
4. **Email Notification** - Setup email untuk contact messages
5. **SEO Optimization** - Meta tags dinamis untuk setiap halaman
6. **Analytics** - Track pengunjung dan interactions

---

## 🔐 Security Notes

- Semua API endpoints menggunakan CORS headers
- Contact messages disimpan untuk review admin
- Personal info bisa di-update (pastikan autentikasi untuk update)
- Visibility controls membantu manage konten sensitive

---

**Database Schema Designed for:** Naufal Puji Mahdy Full Stack Web Developer Portfolio  
**Design Date:** April 20, 2026  
**Status:** ✅ Production Ready
