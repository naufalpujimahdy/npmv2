import type  Prisma  from '@prisma/client';

import { listSiteSettings, upsertSiteSetting } from '@/src/models/SiteSetting';
import {
  jsonResponse,
  optionsResponse,
  parseJsonBody,
  requireAdminRequest,
  withErrorHandling,
} from '@/src/lib/api';
import { validateSettingInput } from '@/src/lib/content';

export async function GET() {
  return withErrorHandling(async () => {
    const settings = await listSiteSettings();

    return jsonResponse({
      ok: true,
      data: settings,
    });
  });
}

export async function PUT(request: Request) {
  return withErrorHandling(async () => {
    requireAdminRequest(request);

    const body = await parseJsonBody(request);
    const data = validateSettingInput(body);
    const setting = await upsertSiteSetting(
      String(data.key),
      data as Prisma.SiteSettingUncheckedCreateInput
    );

    return jsonResponse({
      ok: true,
      data: setting,
    });
  });
}

export function OPTIONS() {
  return optionsResponse();
}
