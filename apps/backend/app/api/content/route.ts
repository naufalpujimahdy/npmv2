import type { Prisma } from '@prisma/client';
import { ContentStatus } from '@prisma/client';

import { createContentEntry, listContentEntries } from '@/src/modules/content/model';
import {
  jsonResponse,
  parseJsonBody,
  requireAdminRequest,
  withErrorHandling,
  isAdminRequest,
} from '@/src/lib/api';
import {
  parseContentStatusFilter,
  parseContentTypeFilter,
  validateContentInput,
} from '@/src/modules/content/validation';

export async function GET(request: Request) {
  return withErrorHandling(async () => {
    const { searchParams } = new URL(request.url);
    const isAdmin = isAdminRequest(request);
    const type = parseContentTypeFilter(searchParams.get('type'));
    const requestedStatus = parseContentStatusFilter(searchParams.get('status'));
    const section = searchParams.get('section') || undefined;
    const locale = searchParams.get('locale') || undefined;
    const slug = searchParams.get('slug') || undefined;

    const where: Prisma.ContentEntryWhereInput = {
      ...(type ? { type } : {}),
      ...(section ? { section } : {}),
      ...(locale ? { locale } : {}),
      ...(slug ? { slug } : {}),
      status: isAdmin ? requestedStatus : ContentStatus.PUBLISHED,
    };

    const entries = await listContentEntries(where);

    return jsonResponse({
      ok: true,
      data: entries,
      meta: { isAdmin, total: entries.length },
    });
  });
}

export async function POST(request: Request) {
  return withErrorHandling(async () => {
    requireAdminRequest(request);

    const body = await parseJsonBody(request);
    const data = validateContentInput(body);
    const entry = await createContentEntry(data as Prisma.ContentEntryCreateInput);

    return jsonResponse({ ok: true, data: entry }, { status: 201 });
  });
}
