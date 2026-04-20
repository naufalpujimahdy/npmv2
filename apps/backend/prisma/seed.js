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
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
