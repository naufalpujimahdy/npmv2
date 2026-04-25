import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling } from '@/src/lib/error-handler';
import { educationSchema } from '@/src/modules/portfolio/validation';

export async function GET(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const includeHidden = new URL(request.url).searchParams.get('include_hidden') === 'true';
    const education = await prisma.education.findMany({
      where: includeHidden ? {} : { isVisible: true },
      orderBy: { order: 'asc' },
    });
    return [education, { status: 200 }];
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const body = await request.json();
    const validated = educationSchema.parse(body);
    const education = await prisma.education.create({ data: validated });
    return [education, { status: 201 }];
  });
}
