import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Username atau email wajib diisi.')
    .trim(),
  password: z
    .string()
    .min(1, 'Password wajib diisi.'),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username minimal 3 karakter.')
    .max(50, 'Username maksimal 50 karakter.')
    .regex(/^[a-z0-9_-]+$/, 'Username hanya boleh berisi huruf kecil, angka, underscore, dan tanda hubung.')
    .trim(),
  email: z
    .string()
    .email('Email tidak valid.')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter.'),
});

// Content Schemas
export const contentCreateSchema = z.object({
  type: z.enum(['PAGE', 'SECTION', 'PROJECT', 'EXPERIENCE', 'POST', 'SOCIAL', 'LINK']),
  slug: z
    .string()
    .min(1, 'Slug wajib diisi.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.')
    .trim(),
  title: z
    .string()
    .min(1, 'Title wajib diisi.')
    .max(255, 'Title maksimal 255 karakter.')
    .trim(),
  summary: z
    .string()
    .max(500, 'Summary maksimal 500 karakter.')
    .trim()
    .optional()
    .nullable(),
  body: z
    .string()
    .optional()
    .nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  locale: z
    .string()
    .default('id'),
  section: z
    .string()
    .optional()
    .nullable(),
  coverImageUrl: z
    .string()
    .url('URL gambar tidak valid.')
    .optional()
    .nullable(),
  sortOrder: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .default(0),
  metadata: z
    .record(z.unknown())
    .optional()
    .nullable(),
  publishedAt: z
    .string()
    .datetime()
    .optional()
    .nullable(),
});

export const contentUpdateSchema = contentCreateSchema.partial();

// Settings Schemas
export const settingSchema = z.object({
  key: z
    .string()
    .min(1, 'Key wajib diisi.')
    .regex(/^[a-z0-9_]+$/, 'Key hanya boleh berisi huruf kecil, angka, dan underscore.')
    .trim(),
  value: z.unknown().optional(),
  description: z
    .string()
    .optional()
    .nullable(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ContentCreateInput = z.infer<typeof contentCreateSchema>;
export type ContentUpdateInput = z.infer<typeof contentUpdateSchema>;
export type SettingInput = z.infer<typeof settingSchema>;
