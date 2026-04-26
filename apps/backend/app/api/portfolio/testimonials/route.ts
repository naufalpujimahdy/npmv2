import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling, requireApiKey } from '@/src/lib/error-handler';
import { testimonialSchema } from '@/src/modules/portfolio/validation';

export async function GET(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const includeHidden = new URL(request.url).searchParams.get('include_hidden') === 'true';
    const testimonials = await prisma.testimonial.findMany({
      where: includeHidden ? {} : { isVisible: true },
      orderBy: { order: 'asc' },
    });
    return [testimonials, { status: 200 }];
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);
    const body = await request.json();
    const validated = testimonialSchema.parse(body);
    const testimonial = await prisma.testimonial.create({ data: validated });
    return [testimonial, { status: 201 }];
  });
}
