import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling } from '@/src/lib/error-handler';

export async function GET(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const settings = await prisma.siteSetting.findMany();

    const settingsObj: Record<string, unknown> = {};
    for (const s of settings) {
      try {
        settingsObj[s.key] = JSON.parse(s.value);
      } catch {
        settingsObj[s.key] = s.value;
      }
    }

    return [settingsObj, { status: 200 }];
  });
}

export async function PUT(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const body = await request.json();

    await prisma.$transaction(
      Object.entries(body).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: typeof value === 'string' ? value : JSON.stringify(value) },
          create: {
            key,
            value: typeof value === 'string' ? value : JSON.stringify(value),
          },
        })
      )
    );

    return [{ success: true }, { status: 200 }];
  });
}
