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
  company: z.string().min(1, "Nama perusahaan wajib diisi"),
  position: z.string().min(1, "Jabatan wajib diisi"),
  location: z.string().optional().default(""), // Paksa jadi string kosong jika kosong
  description: z.string().min(1, "Deskripsi wajib diisi"),
  
  // Ini kuncinya: gunakan .default("") agar TS tahu ini pasti string
  achievements: z.string().default(""), 
  technologies: z.string().default(""),
  
  startDate: z.string().or(z.date()), // Bisa string ISO atau objek Date
  endDate: z.string().or(z.date()).optional().nullable(),
  isCurrent: z.boolean().default(false),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  companyUrl: z.string().url().optional().or(z.literal("")).default(""),
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
  title: z.string().min(1, "Title wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().min(1, "Description wajib diisi"),
  
  // Field ini opsional di Prisma (String?), jadi boleh .nullable()
  longDescription: z.string().optional().nullable(), 
  
  // Field ini WAJIB di Prisma (LongText tanpa ?), 
  // jadi kita paksa default string kosong jika tidak diisi
  technologies: z.string().default(""), 
  images: z.string().default(""), 
  
  // Field opsional di Prisma
  demoUrl: z.string().url().optional().nullable().or(z.literal("")),
  sourceUrl: z.string().url().optional().nullable().or(z.literal("")),
  
  featured: z.boolean().default(false),
  status: z.enum(["completed", "in-progress", "planned"]).default("completed"),
  
  // Handle tanggal sebagai string ISO atau objek Date
  startDate: z.string().optional().nullable().or(z.date()),
  endDate: z.string().optional().nullable().or(z.date()),
  
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
