import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling, ApiError, requireApiKey } from '@/src/lib/error-handler';
import { skillSchema } from '@/src/modules/portfolio/validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    const { id } = await params;
    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new ApiError(404, 'Keahlian tidak ditemukan.', 'NOT_FOUND');
    return [skill, { status: 200 }];
  });
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);
    const { id } = await params;
    const body = await request.json();
    const validated = skillSchema.partial().parse(body);
    const skill = await prisma.skill.update({ where: { id }, data: validated });
    return [skill, { status: 200 }];
  });
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);
    const { id } = await params;
    await prisma.skill.delete({ where: { id } });
    return [{ id }, { status: 200 }];
  });
}
