import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling, ApiError, requireApiKey } from '@/src/lib/error-handler';
import { projectSchema } from '@/src/modules/portfolio/validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    const { id } = await params;
    // Accept both cuid (by id) and slug (by slug) in the same segment
    const project = await prisma.project.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
    if (!project) throw new ApiError(404, 'Project tidak ditemukan.', 'NOT_FOUND');
    return [project, { status: 200 }];
  });
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);
    const { id } = await params;
    const body = await request.json();
    const validated = projectSchema.partial().parse(body);
    const data: Record<string, unknown> = { ...validated };
    if ('startDate' in data) data.startDate = data.startDate ? new Date(data.startDate as string) : null;
    if ('endDate' in data) data.endDate = data.endDate ? new Date(data.endDate as string) : null;
    const project = await prisma.project.update({ where: { id }, data });
    return [project, { status: 200 }];
  });
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return [{ id }, { status: 200 }];
  });
}
