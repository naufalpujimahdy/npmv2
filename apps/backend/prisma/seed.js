const { PrismaClient } = require("@prisma/client");
const { randomBytes, scryptSync } = require("node:crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  // Admin User
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

  // Personal Info
  await prisma.personalInfo.upsert({
    where: { email: "naufalpm230800@gmail.com" },
    update: {},
    create: {
      fullName: "Naufal Puji Mahdy",
      title: "Full Stack Web Developer",
      bio: "Full Stack Developer dengan pengalaman luas dalam membuat website dan web aplikasi berkualitas tinggi dan responsif untuk bisnis dan organisasi. Spesialisasi dalam Laravel (Backend), Express JS (Backend), Next JS (Frontend), MySQL/PostgreSQL (Database), dan deployment menggunakan Docker ke VPS/Nginx.",
      email: "naufalpm230800@gmail.com",
      phone: "082391782895",
      location: "Jakarta Selatan, DKI Jakarta, Indonesia",
      websiteUrl: "https://naufalpujimahdy.id",
      linkedinUrl: "https://linkedin.com/in/naufalpujimahdy",
      githubUrl: "https://github.com/naufalpujimahdy",
      avatarUrl: null,
      resumeUrl: null,
    },
  });

  // Skills
  const skillsData = [
    { name: "Laravel", category: "Backend", proficiency: "Expert", order: 1 },
    {
      name: "Express JS",
      category: "Backend",
      proficiency: "Advanced",
      order: 2,
    },
    {
      name: "React JS",
      category: "Frontend",
      proficiency: "Advanced",
      order: 3,
    },
    {
      name: "Next JS",
      category: "Frontend",
      proficiency: "Intermediate",
      order: 4,
    },
    {
      name: "Tailwind CSS",
      category: "Frontend",
      proficiency: "Advanced",
      order: 5,
    },
    {
      name: "React Native",
      category: "Mobile",
      proficiency: "Intermediate",
      order: 6,
    },
    {
      name: "PostgreSQL",
      category: "Database",
      proficiency: "Advanced",
      order: 7,
    },
    { name: "MySQL", category: "Database", proficiency: "Advanced", order: 8 },
    {
      name: "Firebase",
      category: "Database",
      proficiency: "Intermediate",
      order: 9,
    },
    { name: "Git", category: "DevOps", proficiency: "Expert", order: 10 },
    { name: "Docker", category: "DevOps", proficiency: "Advanced", order: 11 },
    { name: "Nginx", category: "DevOps", proficiency: "Advanced", order: 12 },
    { name: "VPS", category: "DevOps", proficiency: "Advanced", order: 13 },
    { name: "REST API", category: "Backend", proficiency: "Expert", order: 14 },
    {
      name: "JWT Authentication",
      category: "Backend",
      proficiency: "Advanced",
      order: 15,
    },
    {
      name: "Prisma",
      category: "Backend",
      proficiency: "Intermediate",
      order: 16,
    },
    {
      name: "Figma",
      category: "Design",
      proficiency: "Intermediate",
      order: 17,
    },
  ];

  for (const skill of skillsData) {
    await prisma.skill.upsert({
      where: { id: `skill-${skill.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: {
        ...skill,
        id: `skill-${skill.name.toLowerCase().replace(/\s+/g, "-")}`,
        isVisible: true,
      },
    });
  }

  // Experience
  const experienceData = [
    {
      company: "PT Lawencon Internasional",
      position: "PHP Developer",
      location: "Jakarta, Indonesia",
      startDate: new Date("2025-07-01"),
      endDate: null,
      isCurrent: true,
      description:
        "Mengembangkan HR System yang mencakup Assessment, IDP, HAV, RTC, dan ICP modules. Bekerja dengan Laravel untuk backend API dan MySQL untuk database management.",
      technologies: JSON.stringify(["Laravel", "MySQL", "REST API", "JWT"]),
      achievements: JSON.stringify([
        "Implementasi 5 modules HR System",
        "Mengoptimalkan query database untuk performa lebih baik",
        "Integrasi API dengan sistem eksternal",
      ]),
      companyUrl: "https://lawencon.com",
      order: 1,
      isVisible: true,
    },
    {
      company: "PT Digital Teknologi Quantum",
      position: "Fullstack Web Developer",
      location: "Jakarta, Indonesia",
      startDate: new Date("2025-03-01"),
      endDate: new Date("2025-07-31"),
      isCurrent: false,
      description:
        "Mengembangkan merchant system dan API integration. Menangani payment gateway integration dan order management system.",
      technologies: JSON.stringify([
        "Express JS",
        "React JS",
        "PostgreSQL",
        "Payment Gateway",
      ]),
      achievements: JSON.stringify([
        "Implementasi payment gateway integration",
        "Merchant dashboard development",
        "API testing dan documentation",
      ]),
      companyUrl: null,
      order: 2,
      isVisible: true,
    },
    {
      company: "PT Loh Jinawi Teknologi",
      position: "Jr. Full Stack Web Developer",
      location: "Jakarta, Indonesia",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2025-03-31"),
      isCurrent: false,
      description:
        "Mengembangkan aplikasi web dengan fokus pada backend API dan frontend integration. Menangani QR code dan payment integration.",
      technologies: JSON.stringify([
        "Laravel",
        "React JS",
        "MySQL",
        "QR Code Library",
      ]),
      achievements: JSON.stringify([
        "Implementasi QR code generation system",
        "Payment gateway integration (Midtrans, Xendit)",
        "REST API development",
      ]),
      companyUrl: null,
      order: 3,
      isVisible: true,
    },
    {
      company: "PT Sistem Kesehatan Indonesia",
      position: "Junior Web Developer",
      location: "Jakarta, Indonesia",
      startDate: new Date("2023-08-01"),
      endDate: new Date("2023-12-31"),
      isCurrent: false,
      description:
        "Mengembangkan HR System untuk manajemen karyawan. Fokus pada database optimization dan feature development.",
      technologies: JSON.stringify(["Laravel", "MySQL", "jQuery"]),
      achievements: JSON.stringify([
        "Implementasi HR Module features",
        "Database query optimization",
        "Bug fixing dan maintenance",
      ]),
      companyUrl: null,
      order: 4,
      isVisible: true,
    },
    {
      company: "SMK PL Leonardo Klaten",
      position: "Kerja Praktik (Internship)",
      location: "Klaten, Indonesia",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-07-31"),
      isCurrent: false,
      description:
        "Mengembangkan PPDB System (Penerimaan Peserta Didik Baru). Backend menggunakan Laravel dan Frontend menggunakan React JS.",
      technologies: JSON.stringify([
        "Laravel",
        "React JS",
        "MySQL",
        "Tailwind CSS",
      ]),
      achievements: JSON.stringify([
        "PPDB System full development",
        "User authentication implementation",
        "Responsive design implementation",
      ]),
      companyUrl: null,
      order: 5,
      isVisible: true,
    },
  ];

  for (const exp of experienceData) {
    await prisma.experience.create({
      data: { ...exp },
    });
  }

  // Education
  const educationData = [
    {
      institution: "Universitas Teknologi Yogyakarta",
      degree: "S1",
      field: "Informatika",
      location: "Yogyakarta, Indonesia",
      startDate: new Date("2020-09-01"),
      endDate: new Date("2024-08-31"),
      gpa: "3.45",
      description:
        "Program studi informatika dengan fokus pada pengembangan software dan web development.",
      achievements: JSON.stringify([
        "Anggota HIMATIKA 2020-2021",
        "Tugas Akhir: Aplikasi Wisata Kabupaten Siak",
        "GPA: 3.45/4.0",
      ]),
      institutionUrl: "https://uty.ac.id",
      order: 1,
      isVisible: true,
    },
    {
      institution: "SMK YPPI TUALANG",
      degree: "SMK",
      field: "Teknik Komputer dan Jaringan",
      location: "Tualang, Riau, Indonesia",
      startDate: new Date("2016-07-01"),
      endDate: new Date("2019-06-30"),
      gpa: null,
      description:
        "Sekolah Menengah Kejuruan dengan fokus pada Teknik Komputer dan Jaringan.",
      achievements: JSON.stringify([
        "Asisten Lab Komputer 2018-2019",
        "Juara Lomba Jaringan Tingkat Sekolah",
      ]),
      institutionUrl: null,
      order: 2,
      isVisible: true,
    },
  ];

  for (const edu of educationData) {
    await prisma.education.create({
      data: { ...edu },
    });
  }

  // Projects
  const projectsData = [
    {
      title: "Aplikasi Pengenalan Objek Wisata Kabupaten Siak",
      slug: "aplikasi-wisata-siak",
      description:
        "Mobile dan web app untuk mengenali dan memberikan informasi objek wisata di Kabupaten Siak.",
      longDescription:
        "Tugas akhir yang menggunakan React Native untuk mobile app dan React JS untuk web version. Mengintegrasikan Firebase untuk backend dan Google Maps API untuk lokasi. Menggunakan Redux untuk state management.",
      technologies: JSON.stringify([
        "React Native",
        "React JS",
        "Firebase",
        "Google Maps API",
        "Redux",
      ]),
      images: JSON.stringify([
        "https://via.placeholder.com/600x400?text=Wisata+Mobile",
        "https://via.placeholder.com/600x400?text=Wisata+Web",
      ]),
      demoUrl: null,
      sourceUrl: null,
      featured: true,
      status: "completed",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2024-02-29"),
      order: 1,
      isVisible: true,
    },
    {
      title: "Sistem PPDB SMK PL Leonardo",
      slug: "sistem-ppdb-leonardo",
      description:
        "Sistem Penerimaan Peserta Didik Baru (PPDB) untuk SMK PL Leonardo Klaten.",
      longDescription:
        "Web application untuk manajemen pendaftaran siswa baru. Fitur include authentication, form submission, payment processing, dan admin dashboard. Built dengan Laravel dan React JS.",
      technologies: JSON.stringify([
        "Laravel",
        "React JS",
        "MySQL",
        "Tailwind CSS",
        "Payment Gateway",
      ]),
      images: JSON.stringify([
        "https://via.placeholder.com/600x400?text=PPDB+Dashboard",
        "https://via.placeholder.com/600x400?text=PPDB+Form",
      ]),
      demoUrl: null,
      sourceUrl: null,
      featured: true,
      status: "completed",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-07-31"),
      order: 2,
      isVisible: true,
    },
    {
      title: "HR System - PT Lawencon",
      slug: "hr-system-lawencon",
      description:
        "Enterprise HR System dengan multiple modules untuk PT Lawencon Internasional.",
      longDescription:
        "Comprehensive HR management system mencakup Assessment, IDP, HAV, RTC, dan ICP modules. Fitur include employee database, performance tracking, development planning, dan reporting.",
      technologies: JSON.stringify([
        "Laravel",
        "MySQL",
        "REST API",
        "JWT",
        "Docker",
      ]),
      images: JSON.stringify([
        "https://via.placeholder.com/600x400?text=HR+Dashboard",
        "https://via.placeholder.com/600x400?text=HR+Report",
      ]),
      demoUrl: null,
      sourceUrl: null,
      featured: false,
      status: "in-progress",
      startDate: new Date("2025-07-01"),
      endDate: null,
      order: 3,
      isVisible: true,
    },
  ];

  for (const project of projectsData) {
    await prisma.project.create({
      data: { ...project },
    });
  }

  // Certifications
  const certificationsData = [
    {
      name: "Complete UI Design: Visual Design, Prototype, Usability Test",
      issuer: "BuildWithAngga",
      issueDate: new Date("2021-09-01"),
      expiryDate: null,
      credentialId: null,
      credentialUrl: null,
      description:
        "Comprehensive course tentang UI/UX design process dari visual design hingga usability testing.",
      imageUrl: null,
      order: 1,
      isVisible: true,
    },
    {
      name: "UX Mini Bootcamp",
      issuer: "Design Jam Indonesia",
      issueDate: new Date("2021-06-01"),
      expiryDate: null,
      credentialId: null,
      credentialUrl: null,
      description:
        "Intensive bootcamp tentang User Experience design principles dan best practices.",
      imageUrl: null,
      order: 2,
      isVisible: true,
    },
    {
      name: "Membuat Halaman Belanja E-Commerce Yang Ramah Bagi Pengguna",
      issuer: "Skilvul",
      issueDate: new Date("2021-02-01"),
      expiryDate: null,
      credentialId: null,
      credentialUrl: null,
      description:
        "Course tentang membangun e-commerce page yang user-friendly dengan best practices.",
      imageUrl: null,
      order: 3,
      isVisible: true,
    },
  ];

  for (const cert of certificationsData) {
    await prisma.certification.create({
      data: { ...cert },
    });
  }

  // Languages
  const languagesData = [
    {
      name: "Bahasa Indonesia",
      proficiency: "Native",
      order: 1,
      isVisible: true,
    },
    {
      name: "English",
      proficiency: "Conversational",
      order: 2,
      isVisible: true,
    },
  ];

  for (const lang of languagesData) {
    await prisma.language.create({
      data: { ...lang },
    });
  }

  // Testimonials
  const testimonialsData = [
    {
      name: "John Doe",
      position: "Project Manager",
      company: "PT Digital Teknologi Quantum",
      content:
        "Naufal adalah developer yang sangat professional dan dedicated. Dia berhasil mengdelivery merchant system dengan kualitas tinggi dan tepat waktu. Highly recommended!",
      avatarUrl: null,
      linkedinUrl: null,
      order: 1,
      isVisible: true,
    },
    {
      name: "Jane Smith",
      position: "CTO",
      company: "PT Loh Jinawi Teknologi",
      content:
        "Bekerja dengan Naufal sangat menyenangkan. Technical knowledge-nya sangat baik dan komunikasinya jelas. Dia siap untuk senior role.",
      avatarUrl: null,
      linkedinUrl: null,
      order: 2,
      isVisible: true,
    },
  ];

  for (const testimonial of testimonialsData) {
    await prisma.testimonial.create({
      data: { ...testimonial },
    });
  }

  // Site Settings
  await prisma.siteSetting.upsert({
    where: { key: "site_name" },
    update: {},
    create: {
      key: "site_name",
      value: JSON.stringify("Naufal Puji Mahdy - Portfolio"),
      description: "Website title",
    },
  });

  await prisma.siteSetting.upsert({
    where: { key: "site_description" },
    update: {},
    create: {
      key: "site_description",
      value: JSON.stringify(
        "Full Stack Web Developer Portfolio - Showcasing projects and skills",
      ),
      description: "Website meta description",
    },
  });

  console.log("✅ Seed data berhasil ditambahkan!");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
