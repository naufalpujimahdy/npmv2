import { ContentStatus } from '@prisma/client';

import { getContentEntryBySlug } from '@/src/modules/content/model';
import { errorResponse, jsonResponse, withErrorHandling, isAdminRequest } from '@/src/lib/api';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  return withErrorHandling(async () => {
    const { slug } = await params;
    const entry = await getContentEntryBySlug(slug);

    if (!entry) return errorResponse(404, 'Konten tidak ditemukan.');
    if (!isAdminRequest(request) && entry.status !== ContentStatus.PUBLISHED) {
      return errorResponse(404, 'Konten tidak ditemukan.');
    }

    return jsonResponse({ ok: true, data: entry });
  });
}
