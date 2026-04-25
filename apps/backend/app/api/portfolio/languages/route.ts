import { NextRequest } from 'next/server';
import prisma from '@/src/lib/prisma';
import { withErrorHandling, requireApiKey } from '@/src/lib/error-handler';
import { languageSchema } from '@/src/modules/portfolio/validation';

export async function GET(request: NextRequest) {
  return withErrorHandling(request, async () => {
    const includeHidden = new URL(request.url).searchParams.get('include_hidden') === 'true';
    const languages = await prisma.language.findMany({
      where: includeHidden ? {} : { isVisible: true },
      orderBy: { order: 'asc' },
    });
    return [languages, { status: 200 }];
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);
    const body = await request.json();
    const validated = languageSchema.parse(body);
    const language = await prisma.language.create({ data: validated });
    return [language, { status: 201 }];
  });
}
