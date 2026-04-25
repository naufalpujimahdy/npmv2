import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling, ApiError, requireApiKey } from '@/src/lib/error-handler';
import { experienceSchema } from '@/src/modules/portfolio/validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    const { id } = await params;
    const experience = await prisma.experience.findUnique({ where: { id } });
    if (!experience) throw new ApiError(404, 'Data pengalaman tidak ditemukan.', 'NOT_FOUND');
    return [experience, { status: 200 }];
  });
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);
    const { id } = await params;
    const body = await request.json();
    const validated = experienceSchema.partial().parse(body);
    const data: Record<string, unknown> = { ...validated };
    if (data.startDate) data.startDate = new Date(data.startDate as string);
    if ('endDate' in data) data.endDate = data.endDate ? new Date(data.endDate as string) : null;
    const experience = await prisma.experience.update({ where: { id }, data });
    return [experience, { status: 200 }];
  });
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);
    const { id } = await params;
    await prisma.experience.delete({ where: { id } });
    return [{ id }, { status: 200 }];
  });
}
