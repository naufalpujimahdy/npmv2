import type { Prisma } from '@prisma/client';
import { ContentStatus } from '@prisma/client';

import { deleteContentEntry, getContentEntryById, updateContentEntry } from '@/src/modules/content/model';
import {
  ApiError,
  errorResponse,
  jsonResponse,
  parseJsonBody,
  requireAdminRequest,
  withErrorHandling,
  isAdminRequest,
} from '@/src/lib/api';
import { validateContentInput } from '@/src/modules/content/validation';

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseId(value: string) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, 'id konten tidak valid.');
  return id;
}

export async function GET(request: Request, { params }: RouteContext) {
  return withErrorHandling(async () => {
    const { id: rawId } = await params;
    const id = parseId(rawId);
    const entry = await getContentEntryById(id);

    if (!entry) return errorResponse(404, 'Konten tidak ditemukan.');
    if (!isAdminRequest(request) && entry.status !== ContentStatus.PUBLISHED) {
      return errorResponse(404, 'Konten tidak ditemukan.');
    }

    return jsonResponse({ ok: true, data: entry });
  });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  return withErrorHandling(async () => {
    requireAdminRequest(request);

    const { id: rawId } = await params;
    const id = parseId(rawId);
    const body = await parseJsonBody(request);
    const data = validateContentInput(body, { partial: true });
    const entry = await updateContentEntry(id, data as Prisma.ContentEntryUpdateInput);

    return jsonResponse({ ok: true, data: entry });
  });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  return withErrorHandling(async () => {
    requireAdminRequest(request);

    const { id: rawId } = await params;
    const id = parseId(rawId);
    await deleteContentEntry(id);

    return jsonResponse({ ok: true, message: 'Konten berhasil dihapus.' });
  });
}
