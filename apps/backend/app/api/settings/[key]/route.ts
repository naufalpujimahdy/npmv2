import { deleteSiteSetting, getSiteSettingByKey, upsertSiteSetting } from '@/src/modules/settings/model';
import { errorResponse, jsonResponse, parseJsonBody, requireAdminRequest, withErrorHandling } from '@/src/lib/api';
import { validateSettingInput } from '@/src/modules/settings/validation';

type RouteContext = {
  params: Promise<{ key: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  return withErrorHandling(async () => {
    const { key } = await params;
    const setting = await getSiteSettingByKey(key);
    if (!setting) return errorResponse(404, 'Setting tidak ditemukan.');
    return jsonResponse({ ok: true, data: setting });
  });
}

export async function PUT(request: Request, { params }: RouteContext) {
  return withErrorHandling(async () => {
    requireAdminRequest(request);

    const { key } = await params;
    const body = await parseJsonBody(request);
    const data = validateSettingInput({ ...body, key });
    const setting = await upsertSiteSetting(key, {
      key,
      value: String(data.value),
      description: (data.description as string | null | undefined) ?? null,
    });

    return jsonResponse({ ok: true, data: setting });
  });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  return withErrorHandling(async () => {
    requireAdminRequest(request);

    const { key } = await params;
    await deleteSiteSetting(key);

    return jsonResponse({ ok: true, message: 'Setting berhasil dihapus.' });
  });
}
