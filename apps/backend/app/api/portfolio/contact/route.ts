import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling } from '@/src/lib/error-handler';
import { contactMessageSchema } from '@/src/modules/portfolio/validation';

export async function GET(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return [messages, { status: 200 }];
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const body = await request.json();
    const validated = contactMessageSchema.parse(body);
    const message = await prisma.contactMessage.create({ data: validated });
    return [message, { status: 201 }];
  });
}
