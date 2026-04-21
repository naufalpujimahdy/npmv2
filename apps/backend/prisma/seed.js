const { PrismaClient } = require("@prisma/client");
const { randomBytes, scryptSync } = require("node:crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const adminPassword = hashPassword("admin123");

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      password: adminPassword,
    },
  });

  await prisma.contentEntry.upsert({
    where: { slug: "welcome" },
    update: {},
    create: {
      type: "PAGE",
      status: "PUBLISHED",
      slug: "welcome",
      title: "Welcome to Your CMS",
      summary: "A starter content page for your new project.",
      body: "This is a seeded content entry. Edit or remove it as needed.",
      locale: "id",
      section: "home",
      coverImageUrl: null,
      sortOrder: 0,
      metadata: JSON.stringify({ featured: true, tags: ["welcome", "cms"] }),
      publishedAt: new Date(),
    },
  });

  await prisma.contentEntry.upsert({
    where: { slug: "about-us" },
    update: {},
    create: {
      type: "PAGE",
      status: "PUBLISHED",
      slug: "about-us",
      title: "About Us",
      summary: "Seeded about page describing the project.",
      body: "This seeded entry describes your new CMS project and can be updated anytime.",
      locale: "id",
      section: "about",
      coverImageUrl: null,
      sortOrder: 1,
      metadata: JSON.stringify({ featured: false, author: "seed" }),
      publishedAt: new Date(),
    },
  });

  await prisma.siteSetting.upsert({
    where: { key: "site_name" },
    update: {},
    create: {
      key: "site_name",
      value: JSON.stringify({ text: "My CMS" }),
      description: "The title of the site displayed in the CMS.",
    },
  });

  await prisma.siteSetting.upsert({
    where: { key: "default_locale" },
    update: {},
    create: {
      key: "default_locale",
      value: JSON.stringify({ locale: "id" }),
      description: "Default locale for content rendering.",
    },
  });

  // Portfolio Seed Data
  await prisma.personalInfo.upsert({
    where: { email: "naufalpm230800@gmail.com" },
    update: {},
    create: {
      fullName: "Naufal Puji Mahdy",
      title: "Full Stack Web Developer",
      bio: "Full Stack Developer dengan pengalaman luas dalam membuat website dan web aplikasi berkualitas tinggi dan responsif untuk bisnis dan organisasi. Spesialisasi dalam Laravel (Backend), Express JS (Backend), Next JS (Frontend), MySQL/PostgreSQL (Database), dan deployment menggunakan Docker ke VPS/Nginx. Dedicated untuk terus belajar dan meningkatkan keterampilan untuk memastikan performa optimal dan fungsionalitas yang sangat baik.",
      email: "naufalpm230800@gmail.com",
      phone: "082391782895",
      location: "Jakarta Selatan, DKI Jakarta, Indonesia",
      websiteUrl: "https://naufalpujimahdy.id",
      resumeUrl: null,
      linkedinUrl: null,
      githubUrl: null,
    },
  });

  // Skills
  const skills = [
    {
      name: "Laravel",
      category: "Backend",
      proficiency: "Expert",
      order: 1,
      id: "laravel",
    },
    {
      name: "Express JS",
      category: "Backend",
      proficiency: "Advanced",
      order: 2,
      id: "expressjs",
    },
    {
      name: "React JS",
      category: "Frontend",
      proficiency: "Advanced",
      order: 3,
      id: "reactjs",
    },
    {
      name: "Next JS",
      category: "Frontend",
      proficiency: "Intermediate",
      order: 4,
      id: "nextjs",
    },
    {
      name: "Tailwind CSS",
      category: "Frontend",
      proficiency: "Advanced",
      order: 5,
      id: "tailwindcss",
    },
    {
      name: "Inertia JS",
      category: "Frontend",
      proficiency: "Intermediate",
      order: 6,
      id: "inertiajo",
    },
    {
      name: "React Native",
      category: "Mobile",
      proficiency: "Intermediate",
      order: 7,
      id: "reactnative",
    },
    {
      name: "PostgreSQL",
      category: "Database",
      proficiency: "Advanced",
      order: 8,
      id: "postgresql",
    },
    {
      name: "MySQL",
      category: "Database",
      proficiency: "Advanced",
      order: 9,
      id: "mysql",
    },
    {
      name: "Firebase",
      category: "Database",
      proficiency: "Intermediate",
      order: 10,
      id: "firebase",
    },
    {
      name: "Git",
      category: "DevOps",
      proficiency: "Expert",
      order: 11,
      id: "git",
    },
    {
      name: "Docker",
      category: "DevOps",
      proficiency: "Advanced",
      order: 12,
      id: "docker",
    },
    {
      name: "Nginx",
      category: "DevOps",
      proficiency: "Advanced",
      order: 13,
      id: "nginx",
    },
    {
      name: "VPS",
      category: "DevOps",
      proficiency: "Advanced",
      order: 14,
      id: "vps",
    },
    {
      name: "REST API",
      category: "Backend",
      proficiency: "Expert",
      order: 15,
      id: "restapi",
    },
    {
      name: "JWT Authentication",
      category: "Backend",
      proficiency: "Advanced",
      order: 16,
      id: "jwt",
    },
    {
      name: "Eloquent ORM",
      category: "Backend",
      proficiency: "Advanced",
      order: 17,
      id: "eloquent",
    },
    {
      name: "Prisma",
      category: "Backend",
      proficiency: "Intermediate",
      order: 18,
      id: "prisma",
    },
    {
      name: "jQuery",
      category: "Frontend",
      proficiency: "Intermediate",
      order: 19,
      id: "jquery",
    },
    {
      name: "Figma",
      category: "Design",
      proficiency: "Intermediate",
      order: 20,
      id: "figma",
    },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: {},
      create: skill,
    });
  }

  // Experience - Sesuai CV Naufal
  await prisma.experience.upsert({
    where: { id: "php-developer-lawencon" },
    update: {},
    create: {
      company: "PT Lawencon Internasional",
      position: "PHP Developer",
      location: "Jakarta",
      startDate: new Date("2025-07-01"),
      isCurrent: true,
      description:
        "Mengembangkan aplikasi HR System berbasis Laravel untuk modul Assessment, IDP, HAV, RTC, dan ICP dengan integrasi ke sistem PT Aisin Indonesia Automotive.",
      achievements: JSON.stringify([
        "Mengembangkan fitur validasi & penyimpanan data ICP dengan kompetensi teknis dan non-teknis karyawan",
        "Merancang dan implementasi IDP module dengan transactional handling untuk data pengembangan karyawan",
        "Mengembangkan Assessment module dengan upload dokumen dan integrasi ke HAV",
        "Menerapkan HAV module untuk manajemen otorisasi jabatan dan kontrol akses berbasis struktur organisasi",
        "Mengoptimalkan proses dengan Laravel best practices: validation, Eloquent ORM, transaction, exception handling",
      ]),
      technologies: JSON.stringify([
        "Laravel",
        "MySQL",
        "REST API",
        "User Access Control",
        "File Handling",
      ]),
      companyUrl: null,
      order: 1,
    },
  });

  await prisma.experience.upsert({
    where: { id: "fullstack-developer-freelance" },
    update: {},
    create: {
      company: "Freelance Web Development",
      position: "Freelance Web Developer",
      location: "Remote",
      startDate: new Date("2022-06-01"),
      isCurrent: true,
      description:
        "Menggali kebutuhan klien, menyusun spesifikasi & milestone, lalu mengeksekusi solusi web end-to-end dari design hingga deployment.",
      achievements: JSON.stringify([
        "Desain UI/UX di Figma dengan responsif & konsisten menggunakan design system dan komponen reusable",
        "Backend Node.js/Express + PostgreSQL/MySQL: REST API, auth JWT/RBAC, validasi & logging terstruktur",
        "Integrasi pembayaran (Midtrans, QRIS/Winpay) termasuk webhook/callback handling",
        "Mengintegrasikan API eksternal sesuai kebutuhan klien",
        "Deploy Docker (docker-compose) ke VPS/Nginx + HTTPS dengan monitoring log & health-check",
      ]),
      technologies: JSON.stringify([
        "Node.js",
        "Express",
        "PostgreSQL",
        "MySQL",
        "Sequelize",
        "Prisma",
        "Socket.IO",
        "JWT",
        "Docker",
        "Nginx",
      ]),
      companyUrl: null,
      order: 2,
    },
  });

  await prisma.experience.upsert({
    where: { id: "fullstack-developer-dtq" },
    update: {},
    create: {
      company: "PT Digital Teknologi Quantum",
      position: "Fullstack Web Developer",
      location: "Jakarta",
      startDate: new Date("2025-03-01"),
      endDate: new Date("2025-07-01"),
      description:
        "Melakukan analisis dan riset kebutuhan sistem, mengelola dokumentasi proyek, dan mengintegrasikan third-party API sesuai kebutuhan.",
      achievements: JSON.stringify([
        "Melakukan analisis dan riset kebutuhan sistem sebelum tahap pengembangan",
        "Mengelola dokumentasi proyek menggunakan Trello dan Notion",
        "Mengelola dokumentasi REST API menggunakan Postman",
        "Mengintegrasikan third-party API sesuai kebutuhan proyek",
        "Mengembangkan sistem yang dapat digunakan oleh berbagai merchant secara fleksibel dan skalabel",
      ]),
      technologies: JSON.stringify(["Docker", "REST API", "Postman"]),
      companyUrl: null,
      order: 3,
    },
  });

  await prisma.experience.upsert({
    where: { id: "jr-fullstack-developer-loh" },
    update: {},
    create: {
      company: "PT Loh Jinawi Teknologi",
      position: "Jr. Full Stack Web Developer",
      location: "Jakarta",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2025-03-01"),
      description:
        "Mengembangkan aplikasi web berbasis Laravel dengan integrasi API pihak ketiga, fitur pembayaran, dan dashboard berbasis microservices.",
      achievements: JSON.stringify([
        "Mengembangkan aplikasi web berbasis Laravel, Tailwind CSS, dan jQuery",
        "Mengintegrasikan API pihak ketiga untuk fitur QR code, pembayaran, dan layanan lainnya",
        "Membangun webview dan dashboard berbasis microservices untuk berbagai layanan",
        "Menambahkan fitur notifikasi pembayaran, e-tiket, dan laporan penjualan",
        "Mengembangkan REST API dengan autentikasi Laravel Sanctum untuk web dan mobile",
      ]),
      technologies: JSON.stringify([
        "Laravel",
        "Tailwind CSS",
        "jQuery",
        "REST API",
        "Laravel Sanctum",
      ]),
      companyUrl: null,
      order: 4,
    },
  });

  await prisma.experience.upsert({
    where: { id: "junior-web-developer-ski" },
    update: {},
    create: {
      company: "PT Sistem Kesehatan Indonesia",
      position: "Junior Web Development",
      location: "Jakarta",
      startDate: new Date("2023-08-01"),
      endDate: new Date("2023-12-01"),
      description:
        "Berkontribusi dalam pengembangan aplikasi web sistem manajemen rumah sakit berbasis Laravel dengan fokus pada efisiensi proses operasional.",
      achievements: JSON.stringify([
        "Berkontribusi dalam pengembangan aplikasi web sistem manajemen rumah sakit berbasis Laravel",
        "Mengembangkan dan memodifikasi fitur baru atau form request sesuai kebutuhan klien",
        "Meningkatkan performa aplikasi melalui optimasi query database menggunakan Eloquent ORM",
        "Berkolaborasi dengan tim menggunakan Git dengan pengelolaan proyek terstruktur",
      ]),
      technologies: JSON.stringify([
        "Laravel",
        "Blade Template",
        "Eloquent ORM",
        "Git",
      ]),
      companyUrl: null,
      order: 5,
    },
  });

  // Experience - Kerja Praktik
  await prisma.experience.upsert({
    where: { id: "kerja-praktik-leonardo" },
    update: {},
    create: {
      company: "SMK PL Leonardo Klaten",
      position: "Kerja Praktik",
      location: "Klaten",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-07-01"),
      description:
        "Mengembangkan Sistem Penerimaan Peserta Didik Baru (PPDB) berbasis web untuk mempermudah proses pendaftaran online dan pengelolaan data calon siswa.",
      achievements: JSON.stringify([
        "Mengembangkan Sistem PPDB berbasis web untuk SMK PL Leonardo Klaten",
        "Backend Laravel untuk mengelola logika bisnis, validasi data, autentikasi pengguna",
        "Frontend React JS untuk membangun antarmuka interaktif dan responsif",
        "Tailwind CSS untuk menciptakan desain antarmuka modern dan konsisten",
      ]),
      technologies: JSON.stringify(["Laravel", "React JS", "Tailwind CSS"]),
      companyUrl: null,
      order: 6,
    },
  });

  // Education - Sesuai CV Naufal
  await prisma.education.upsert({
    where: { id: "s1-informatika-uty" },
    update: {},
    create: {
      institution: "Universitas Teknologi Yogyakarta (UTY)",
      degree: "S1",
      field: "Informatika",
      location: "Yogyakarta, Indonesia",
      startDate: new Date("2020-09-01"),
      endDate: new Date("2024-06-01"),
      description:
        "Pendidikan formal dalam ilmu informatika dengan fokus pada software engineering dan web development.",
      achievements: JSON.stringify([
        "Anggota Media Himpunan Mahasiswa Informatika (HIMATIKA) Periode 2020-2021",
        "Menyelesaikan tugas akhir: Aplikasi Pengenalan Objek Wisata Di Kabupaten Siak Berbasis Mobile",
      ]),
      order: 1,
    },
  });

  await prisma.education.upsert({
    where: { id: "smk-yppi-tualang" },
    update: {},
    create: {
      institution: "SMK YPPI TUALANG",
      degree: "SMK",
      field: "Teknik Komputer dan Jaringan",
      location: "Tualang, Indonesia",
      startDate: new Date("2016-09-01"),
      endDate: new Date("2019-06-01"),
      description:
        "Pendidikan sekolah menengah kejuruan dengan fokus pada teknik komputer dan jaringan.",
      achievements: JSON.stringify([
        "Asisten Laboratorium Komputer 2018 - 2019",
      ]),
      order: 2,
    },
  });

  // Projects - Dari CV Naufal
  await prisma.project.upsert({
    where: { slug: "objek-wisata-siak-mobile" },
    update: {},
    create: {
      title: "Aplikasi Pengenalan Objek Wisata Kabupaten Siak",
      slug: "objek-wisata-siak-mobile",
      description:
        "Aplikasi mobile dan web untuk pengenalan objek wisata di Kabupaten Siak dengan navigasi Google Maps.",
      longDescription:
        "Mengembangkan dua aplikasi terintegrasi yaitu aplikasi mobile berbasis React Native dan aplikasi web berbasis React JS untuk perkenalan objek wisata di Kabupaten Siak. Menggunakan Firebase sebagai database backend dengan fitur authentication, real-time database, dan cloud storage. Menerapkan Redux untuk state management dan Google Maps API untuk navigasi lokasi.",
      technologies: JSON.stringify([
        "React Native",
        "React JS",
        "Firebase",
        "Redux",
        "Google Maps API",
        "Tailwind CSS",
      ]),
      images: JSON.stringify([]),
      featured: true,
      status: "completed",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2024-02-01"),
      order: 1,
    },
  });

  await prisma.project.upsert({
    where: { slug: "ppdb-smk-leonardo" },
    update: {},
    create: {
      title: "Sistem Penerimaan Peserta Didik Baru (PPDB) SMK PL Leonardo",
      slug: "ppdb-smk-leonardo",
      description:
        "Sistem PPDB berbasis web untuk mempermudah proses pendaftaran online dan pengelolaan data calon siswa.",
      longDescription:
        "Mengembangkan sistem PPDB berbasis web untuk SMK PL Leonardo Klaten yang dirancang untuk mempermudah proses pendaftaran online dan pengelolaan data calon siswa. Backend Laravel untuk mengelola logika bisnis dan validasi data, frontend React JS dengan Tailwind CSS untuk antarmuka yang modern dan responsif.",
      technologies: JSON.stringify(["Laravel", "React JS", "Tailwind CSS"]),
      images: JSON.stringify([]),
      featured: true,
      status: "completed",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-07-01"),
      order: 2,
    },
  });

  await prisma.project.upsert({
    where: { slug: "hr-system-laravel" },
    update: {},
    create: {
      title: "HR System - Assessment, IDP, HAV, RTC, ICP Modules",
      slug: "hr-system-laravel",
      description:
        "Aplikasi HR System berbasis Laravel untuk manajemen Assessment, IDP, HAV, RTC, dan ICP dengan integrasi PT Aisin Indonesia Automotive.",
      longDescription:
        "Mengembangkan aplikasi HR System berbasis Laravel untuk modul Assessment, IDP, HAV, RTC, dan ICP. Mencakup fitur validasi & penyimpanan data ICP, IDP module dengan transactional handling, Assessment module dengan upload dokumen, dan HAV module untuk manajemen otorisasi jabatan dengan kontrol akses berbasis struktur organisasi.",
      technologies: JSON.stringify([
        "Laravel",
        "MySQL",
        "REST API",
        "Eloquent ORM",
        "User Access Control",
      ]),
      images: JSON.stringify([]),
      featured: true,
      status: "in-progress",
      startDate: new Date("2025-07-01"),
      order: 3,
    },
  });

  // Certifications - Dari CV Naufal
  await prisma.certification.upsert({
    where: { id: "complete-ui-design-bwa" },
    update: {},
    create: {
      name: "Complete UI Design: Visual Design, Prototype, Usability Test",
      issuer: "BuildWithAngga",
      issueDate: new Date("2021-09-01"),
      description:
        "Sertifikasi dalam UI Design mencakup visual design, prototyping, dan usability testing.",
      order: 1,
    },
  });

  await prisma.certification.upsert({
    where: { id: "ux-mini-bootcamp-dji" },
    update: {},
    create: {
      name: "UX Mini Bootcamp",
      issuer: "Design Jam Indonesia",
      issueDate: new Date("2021-06-01"),
      description:
        "Bootcamp mini dalam UX design untuk meningkatkan kemampuan user experience design.",
      order: 2,
    },
  });

  await prisma.certification.upsert({
    where: { id: "ecommerce-user-friendly-skilvul" },
    update: {},
    create: {
      name: "Membuat Halaman Belanja E-Commerce Yang Ramah Bagi Pengguna",
      issuer: "Skilvul",
      issueDate: new Date("2021-02-01"),
      description:
        "Sertifikasi dalam membuat halaman e-commerce yang user-friendly dan responsif.",
      order: 3,
    },
  });

  // Languages - Dari CV Naufal
  const languages = [
    {
      name: "Bahasa Indonesia",
      proficiency: "Native",
      order: 1,
      id: "bahasa-indonesia",
    },
    { name: "English", proficiency: "Dasar", order: 2, id: "english-basic" },
  ];

  for (const language of languages) {
    await prisma.language.upsert({
      where: { id: language.id },
      update: {},
      create: language,
    });
  }

  // Testimonials
  await prisma.testimonial.upsert({
    where: { id: "testimonial-1" },
    update: {},
    create: {
      name: "PT Aisin Indonesia Automotive",
      position: "Client",
      company: "Sistem Manajemen HR",
      content:
        "Naufal adalah developer yang sangat profesional dan responsif. Kemampuannya dalam merancang dan mengimplementasikan sistem HR yang kompleks sangat luar biasa.",
      order: 1,
    },
  });

  console.log(
    "Database seeded successfully with Naufal Puji Mahdy portfolio data!",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
