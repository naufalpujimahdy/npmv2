import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling, requireApiKey } from '@/src/lib/error-handler';
import { experienceSchema } from '@/src/modules/portfolio/validation';

export async function GET(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const includeHidden = new URL(request.url).searchParams.get('include_hidden') === 'true';
    const experiences = await prisma.experience.findMany({
      where: includeHidden ? {} : { isVisible: true },
      orderBy: { order: 'asc' },
    });
    return [experiences, { status: 200 }];
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);
    const body = await request.json();
    const validated = experienceSchema.parse(body);
    const experience = await prisma.experience.create({
      data: {
        ...validated,
        startDate: new Date(validated.startDate as string),
        endDate: validated.endDate ? new Date(validated.endDate as string) : null,
      },
    });
    return [experience, { status: 201 }];
  });
}
