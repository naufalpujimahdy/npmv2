import { z } from 'zod';

// Personal Info
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').trim(),
  title: z.string().min(1, 'Title is required').trim(),
  bio: z.string().min(1, 'Bio is required').trim(),
  email: z.string().email('Invalid email'),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  resumeUrl: z.string().url().optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable(),
  githubUrl: z.string().url().optional().nullable(),
  websiteUrl: z.string().url().optional().nullable(),
});

// Skills
export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').trim(),
  category: z.string().min(1, 'Category is required').trim(),
  proficiency: z.enum(['Expert', 'Advanced', 'Intermediate', 'Beginner']),
  iconUrl: z.string().url().optional().nullable(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

// Experience
export const experienceSchema = z.object({
  company: z.string().min(1, 'Company name is required').trim(),
  position: z.string().min(1, 'Position is required').trim(),
  location: z.string().optional().nullable(),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date').optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().min(1, 'Description is required').trim(),
  achievements: z.string().optional().nullable(), // JSON array as string
  technologies: z.string().optional().nullable(), // JSON array as string
  companyUrl: z.string().url().optional().nullable(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

// Education
export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution name is required').trim(),
  degree: z.string().min(1, 'Degree is required').trim(),
  field: z.string().min(1, 'Field of study is required').trim(),
  location: z.string().optional().nullable(),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date').optional().nullable(),
  gpa: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  achievements: z.string().optional().nullable(), // JSON array as string
  institutionUrl: z.string().url().optional().nullable(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

// Project
export const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required').trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  description: z.string().min(1, 'Description is required').trim(),
  longDescription: z.string().optional().nullable(),
  technologies: z.string().optional().nullable(), // JSON array as string
  images: z.string().optional().nullable(), // JSON array as string
  demoUrl: z.string().url().optional().nullable(),
  sourceUrl: z.string().url().optional().nullable(),
  featured: z.boolean().default(false),
  status: z.enum(['completed', 'in-progress', 'planned']).default('completed'),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

// Certification
export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required').trim(),
  issuer: z.string().min(1, 'Issuer name is required').trim(),
  issueDate: z.string().datetime('Invalid issue date'),
  expiryDate: z.string().datetime().optional().nullable(),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

// Language
export const languageSchema = z.object({
  name: z.string().min(1, 'Language name is required').trim(),
  proficiency: z.enum(['Native', 'Fluent', 'Conversational', 'Basic']),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

// Testimonial
export const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  position: z.string().min(1, 'Position is required').trim(),
  company: z.string().min(1, 'Company is required').trim(),
  content: z.string().min(1, 'Content is required').trim(),
  avatarUrl: z.string().url().optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable(),
  isVisible: z.boolean().default(true),
  order: z.number().int().default(0),
});

// Contact Message
export const contactMessageSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email'),
  subject: z.string().min(1, 'Subject is required').trim(),
  message: z.string().min(1, 'Message is required').trim(),
});
