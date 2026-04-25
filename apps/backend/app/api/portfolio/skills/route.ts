import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling } from '@/src/lib/error-handler';
import { skillSchema } from '@/src/modules/portfolio/validation';

export async function GET(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const includeHidden = searchParams.get('include_hidden') === 'true';

    const where: Record<string, unknown> = includeHidden ? {} : { isVisible: true };
    if (category) where.category = category;

    const skills = await prisma.skill.findMany({ where, orderBy: { order: 'asc' } });
    return [skills, { status: 200 }];
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const body = await request.json();
    const validated = skillSchema.parse(body);
    const skill = await prisma.skill.create({ data: validated });
    return [skill, { status: 201 }];
  });
}
