import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling, requireApiKey } from '@/src/lib/error-handler';
import { projectSchema } from '@/src/modules/portfolio/validation';

export async function GET(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const includeHidden = searchParams.get('include_hidden') === 'true';

    const where: Record<string, unknown> = includeHidden ? {} : { isVisible: true };
    if (featured === 'true') where.featured = true;

    const projects = await prisma.project.findMany({ where, orderBy: { order: 'asc' } });
    return [projects, { status: 200 }];
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);
    const body = await request.json();
    const validated = projectSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        ...validated,
        startDate: validated.startDate ? new Date(validated.startDate as string) : null,
        endDate: validated.endDate ? new Date(validated.endDate as string) : null,
      },
    });
    return [project, { status: 201 }];
  });
}
