import { ApiError } from '../../lib/api';

type SiteSettingInput = {
  key?: unknown;
  value?: unknown;
  description?: unknown;
};

function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeOptionalString(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  if (typeof value !== 'string') throw new ApiError(400, 'Field teks harus berupa string.');
  return value.trim();
}

function toJsonValue(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    throw new ApiError(400, 'value harus bisa diserialisasi ke JSON.');
  }
}

export function validateSettingInput(
  input: SiteSettingInput,
  options: { partial?: boolean } = {}
) {
  const { partial = false } = options;

  if (!partial && !isNonEmptyString(input.key)) throw new ApiError(400, 'key wajib diisi.');
  if (!partial && input.value === undefined) throw new ApiError(400, 'value wajib diisi.');

  const data: Record<string, unknown> = {};

  if (input.key !== undefined) {
    if (!isNonEmptyString(input.key)) throw new ApiError(400, 'key wajib berupa string non-kosong.');
    data.key = String(input.key).trim();
  }

  if (input.value !== undefined) data.value = toJsonValue(input.value);

  if (input.description !== undefined) data.description = normalizeOptionalString(input.description);

  return data;
}
