import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling, ApiError, requireApiKey } from '@/src/lib/error-handler';
import { testimonialSchema } from '@/src/modules/portfolio/validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    const { id } = await params;
    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) throw new ApiError(404, 'Testimoni tidak ditemukan.', 'NOT_FOUND');
    return [testimonial, { status: 200 }];
  });
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);
    const { id } = await params;
    const body = await request.json();
    const validated = testimonialSchema.partial().parse(body);
    const testimonial = await prisma.testimonial.update({ where: { id }, data: validated });
    return [testimonial, { status: 200 }];
  });
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } });
    return [{ id }, { status: 200 }];
  });
}
