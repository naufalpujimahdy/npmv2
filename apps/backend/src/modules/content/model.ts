import type { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';

export const listContentEntries = async (
  where: Prisma.ContentEntryWhereInput = {}
) => {
  return prisma.contentEntry.findMany({
    where,
    orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }],
  });
};

export const createContentEntry = async (data: Prisma.ContentEntryCreateInput) => {
  return prisma.contentEntry.create({ data });
};

export const getContentEntryById = async (id: number) => {
  return prisma.contentEntry.findUnique({ where: { id } });
};

export const getContentEntryBySlug = async (slug: string) => {
  return prisma.contentEntry.findUnique({ where: { slug } });
};

export const updateContentEntry = async (
  id: number,
  data: Prisma.ContentEntryUpdateInput
) => {
  return prisma.contentEntry.update({ where: { id }, data });
};

export const deleteContentEntry = async (id: number) => {
  return prisma.contentEntry.delete({ where: { id } });
};
