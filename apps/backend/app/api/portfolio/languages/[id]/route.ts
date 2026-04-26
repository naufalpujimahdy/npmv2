import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling, ApiError, requireApiKey } from '@/src/lib/error-handler';
import { languageSchema } from '@/src/modules/portfolio/validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    const { id } = await params;
    const language = await prisma.language.findUnique({ where: { id } });
    if (!language) throw new ApiError(404, 'Data bahasa tidak ditemukan.', 'NOT_FOUND');
    return [language, { status: 200 }];
  });
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);
    const { id } = await params;
    const body = await request.json();
    const validated = languageSchema.partial().parse(body);
    const language = await prisma.language.update({ where: { id }, data: validated });
    return [language, { status: 200 }];
  });
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);
    const { id } = await params;
    await prisma.language.delete({ where: { id } });
    return [{ id }, { status: 200 }];
  });
}
