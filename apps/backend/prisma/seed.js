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
    where: { email: "portfolio@example.com" },
    update: {},
    create: {
      fullName: "John Doe",
      title: "Full Stack Developer",
      bio: "Passionate full stack developer with 5+ years of experience building web applications. Specialized in React, Node.js, and cloud technologies.",
      email: "portfolio@example.com",
      phone: "+62 812-3456-7890",
      location: "Jakarta, Indonesia",
      linkedinUrl: "https://linkedin.com/in/johndoe",
      githubUrl: "https://github.com/johndoe",
      websiteUrl: "https://johndoe.dev",
    },
  });

  // Skills
  const skills = [
    {
      name: "JavaScript",
      category: "Frontend",
      proficiency: "Expert",
      order: 1,
      id: "javascript",
    },
    {
      name: "TypeScript",
      category: "Frontend",
      proficiency: "Advanced",
      order: 2,
      id: "typescript",
    },
    {
      name: "React",
      category: "Frontend",
      proficiency: "Expert",
      order: 3,
      id: "react",
    },
    {
      name: "Next.js",
      category: "Frontend",
      proficiency: "Advanced",
      order: 4,
      id: "nextjs",
    },
    {
      name: "Node.js",
      category: "Backend",
      proficiency: "Expert",
      order: 5,
      id: "nodejs",
    },
    {
      name: "Express.js",
      category: "Backend",
      proficiency: "Advanced",
      order: 6,
      id: "expressjs",
    },
    {
      name: "MySQL",
      category: "Database",
      proficiency: "Advanced",
      order: 7,
      id: "mysql",
    },
    {
      name: "MongoDB",
      category: "Database",
      proficiency: "Intermediate",
      order: 8,
      id: "mongodb",
    },
    {
      name: "Git",
      category: "Tools",
      proficiency: "Expert",
      order: 9,
      id: "git",
    },
    {
      name: "Docker",
      category: "Tools",
      proficiency: "Intermediate",
      order: 10,
      id: "docker",
    },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { id: skill.id },
      update: {},
      create: skill,
    });
  }

  // Experience
  await prisma.experience.upsert({
    where: { id: "senior-developer" },
    update: {},
    create: {
      company: "Tech Corp Indonesia",
      position: "Senior Full Stack Developer",
      location: "Jakarta",
      startDate: new Date("2022-01-01"),
      isCurrent: true,
      description:
        "Leading development of enterprise web applications using modern technologies.",
      achievements: JSON.stringify([
        "Led a team of 5 developers in delivering 3 major projects",
        "Improved application performance by 40%",
        "Implemented CI/CD pipelines reducing deployment time by 60%",
      ]),
      technologies: JSON.stringify(["React", "Node.js", "MySQL", "AWS"]),
      companyUrl: "https://techcorp.id",
      order: 1,
    },
  });

  await prisma.experience.upsert({
    where: { id: "fullstack-developer" },
    update: {},
    create: {
      company: "StartupXYZ",
      position: "Full Stack Developer",
      location: "Jakarta",
      startDate: new Date("2020-03-01"),
      endDate: new Date("2021-12-31"),
      description:
        "Developed and maintained multiple client projects using MERN stack.",
      achievements: JSON.stringify([
        "Built 10+ client websites from scratch",
        "Reduced loading time by 50% through optimization",
        "Mentored junior developers",
      ]),
      technologies: JSON.stringify(["React", "Node.js", "MongoDB", "Express"]),
      order: 2,
    },
  });

  // Education
  await prisma.education.upsert({
    where: { id: "computer-science" },
    update: {},
    create: {
      institution: "Universitas Indonesia",
      degree: "Bachelor of Computer Science",
      field: "Computer Science",
      location: "Depok, Indonesia",
      startDate: new Date("2016-09-01"),
      endDate: new Date("2020-06-01"),
      gpa: "3.8",
      description: "Focused on software engineering and web development.",
      achievements: JSON.stringify([
        "Dean's List for 3 semesters",
        "Winner of National Programming Competition",
        "Active in Google Developer Student Club",
      ]),
      order: 1,
    },
  });

  // Projects
  await prisma.project.upsert({
    where: { slug: "e-commerce-platform" },
    update: {},
    create: {
      title: "E-Commerce Platform",
      slug: "e-commerce-platform",
      description:
        "A full-featured e-commerce platform with payment integration, inventory management, and admin dashboard.",
      longDescription:
        "Built a comprehensive e-commerce solution using Next.js, Stripe for payments, and PostgreSQL. Features include user authentication, product catalog, shopping cart, order management, and admin analytics dashboard.",
      technologies: JSON.stringify([
        "Next.js",
        "TypeScript",
        "Stripe",
        "PostgreSQL",
        "Tailwind CSS",
      ]),
      images: JSON.stringify([
        "/images/projects/ecommerce-1.jpg",
        "/images/projects/ecommerce-2.jpg",
      ]),
      demoUrl: "https://ecommerce-demo.vercel.app",
      sourceUrl: "https://github.com/johndoe/ecommerce-platform",
      featured: true,
      status: "completed",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-06-01"),
      order: 1,
    },
  });

  await prisma.project.upsert({
    where: { slug: "task-management-app" },
    update: {},
    create: {
      title: "Task Management App",
      slug: "task-management-app",
      description:
        "A collaborative task management application with real-time updates and team features.",
      technologies: JSON.stringify([
        "React",
        "Node.js",
        "Socket.io",
        "MongoDB",
      ]),
      images: JSON.stringify(["/images/projects/taskapp-1.jpg"]),
      demoUrl: "https://taskapp-demo.herokuapp.com",
      sourceUrl: "https://github.com/johndoe/task-management",
      featured: true,
      status: "completed",
      startDate: new Date("2022-08-01"),
      endDate: new Date("2022-12-01"),
      order: 2,
    },
  });

  // Certifications
  await prisma.certification.upsert({
    where: { id: "aws-certified-developer" },
    update: {},
    create: {
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      issueDate: new Date("2023-05-15"),
      expiryDate: new Date("2026-05-15"),
      credentialId: "AWS-DEV-123456",
      credentialUrl: "https://aws.amazon.com/verification",
      description:
        "Demonstrated proficiency in developing and maintaining applications on AWS platform.",
      order: 1,
    },
  });

  // Languages
  const languages = [
    { name: "Indonesian", proficiency: "Native", order: 1, id: "indonesian" },
    { name: "English", proficiency: "Fluent", order: 2, id: "english" },
    {
      name: "Japanese",
      proficiency: "Conversational",
      order: 3,
      id: "japanese",
    },
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
      name: "Sarah Johnson",
      position: "CTO",
      company: "Tech Corp Indonesia",
      content:
        "John is an exceptional developer who consistently delivers high-quality code. His attention to detail and problem-solving skills are outstanding.",
      linkedinUrl: "https://linkedin.com/in/sarahjohnson",
      order: 1,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
