import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling, ApiError } from '@/src/lib/error-handler';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  return withErrorHandling(request, async () => {
    const project = await prisma.project.findUnique({ where: { slug: params.slug } });
    if (!project) {
      throw new ApiError(404, 'Project not found', 'NOT_FOUND');
    }
    return [project, { status: 200 }];
  });
}
