import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling, ApiError, requireApiKey } from '@/src/lib/error-handler';
import { certificationSchema } from '@/src/modules/portfolio/validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    const { id } = await params;
    const cert = await prisma.certification.findUnique({ where: { id } });
    if (!cert) throw new ApiError(404, 'Sertifikat tidak ditemukan.', 'NOT_FOUND');
    return [cert, { status: 200 }];
  });
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);
    const { id } = await params;
    const body = await request.json();
    const validated = certificationSchema.partial().parse(body);
    const data: Record<string, unknown> = { ...validated };
    if (data.issueDate) data.issueDate = new Date(data.issueDate as string);
    if ('expiryDate' in data) data.expiryDate = data.expiryDate ? new Date(data.expiryDate as string) : null;
    const cert = await prisma.certification.update({ where: { id }, data });
    return [cert, { status: 200 }];
  });
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);
    const { id } = await params;
    await prisma.certification.delete({ where: { id } });
    return [{ id }, { status: 200 }];
  });
}
