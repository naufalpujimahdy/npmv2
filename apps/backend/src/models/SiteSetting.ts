import type { Prisma } from '@prisma/client';

import prisma from '../lib/prisma';

export const listSiteSettings = async (
  where: Prisma.SiteSettingWhereInput = {}
) => {
  return prisma.siteSetting.findMany({
    where,
    orderBy: { key: 'asc' },
  });
};

export const getSiteSettingByKey = async (key: string) => {
  return prisma.siteSetting.findUnique({ where: { key } });
};

export const upsertSiteSetting = async (
  key: string,
  data: Prisma.SiteSettingUncheckedCreateInput
) => {
  return prisma.siteSetting.upsert({
    where: { key },
    create: data,
    update: {
      value: data.value,
      description: data.description,
    },
  });
};

export const deleteSiteSetting = async (key: string) => {
  return prisma.siteSetting.delete({ where: { key } });
};
