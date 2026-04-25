import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling } from '@/src/lib/error-handler';
import { certificationSchema } from '@/src/modules/portfolio/validation';

export async function GET(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const includeHidden = new URL(request.url).searchParams.get('include_hidden') === 'true';
    const certifications = await prisma.certification.findMany({
      where: includeHidden ? {} : { isVisible: true },
      orderBy: { order: 'asc' },
    });
    return [certifications, { status: 200 }];
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const body = await request.json();
    const validated = certificationSchema.parse(body);
    const certification = await prisma.certification.create({ data: validated });
    return [certification, { status: 201 }];
  });
}
