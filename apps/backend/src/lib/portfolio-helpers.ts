import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getPersonalInfo() {
  return prisma.personalInfo.findFirst();
}

export async function getVisibleSkills() {
  return prisma.skill.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  });
}

export async function getSkillsByCategory(category: string) {
  return prisma.skill.findMany({
    where: { category, isVisible: true },
    orderBy: { order: 'asc' },
  });
}

export async function getVisibleExperience() {
  return prisma.experience.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  });
}

export async function getVisibleEducation() {
  return prisma.education.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  });
}

export async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { featured: true, isVisible: true },
    orderBy: { order: 'asc' },
  });
}

export async function getVisibleProjects() {
  return prisma.project.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
  });
}

export async function getVisibleCertifications() {
  return prisma.certification.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  });
}

export async function getVisibleLanguages() {
  return prisma.language.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  });
}

export async function getVisibleTestimonials() {
  return prisma.testimonial.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  });
}

export async function getContactInfo() {
  const info = await prisma.personalInfo.findFirst();
  return {
    email: info?.email,
    phone: info?.phone,
    location: info?.location,
    linkedinUrl: info?.linkedinUrl,
    githubUrl: info?.githubUrl,
  };
}

export function parseJsonField(field: string | null | undefined): any[] {
  if (!field) return [];
  try {
    return JSON.parse(field);
  } catch (error) {
    console.error('Error parsing JSON field:', error);
    return [];
  }
}

export function stringifyJsonField(data: any): string {
  return JSON.stringify(data);
}
