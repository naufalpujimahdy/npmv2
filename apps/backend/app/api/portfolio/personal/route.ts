import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling, ApiError } from '@/src/lib/error-handler';

export async function GET(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const personalInfo = await prisma.personalInfo.findFirst();
    if (!personalInfo) {
      throw new ApiError(404, 'Personal info not found', 'NOT_FOUND');
    }
    return [personalInfo, { status: 200 }];
  });
}

export async function PUT(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const body = await request.json();
    const personalInfo = await prisma.personalInfo.upsert({
      where: { email: body.email },
      update: body,
      create: body,
    });
    return [personalInfo, { status: 200 }];
  });
}
