import { Prisma } from '@prisma/client';
import type { ContentStatus, ContentType } from '@prisma/client';

import { ApiError } from './api';

const contentTypes = [
  'PAGE',
  'SECTION',
  'PROJECT',
  'EXPERIENCE',
  'POST',
  'SOCIAL',
  'LINK',
] as const satisfies readonly ContentType[];

const contentStatuses = [
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED',
] as const satisfies readonly ContentStatus[];

type ContentInput = {
  type?: unknown;
  status?: unknown;
  slug?: unknown;
  title?: unknown;
  summary?: unknown;
  body?: unknown;
  locale?: unknown;
  section?: unknown;
  coverImageUrl?: unknown;
  sortOrder?: unknown;
  metadata?: unknown;
  publishedAt?: unknown;
};

type ValidateContentOptions = {
  partial?: boolean;
};

function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeOptionalString(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === '') {
    return null;
  }

  if (typeof value !== 'string') {
    throw new ApiError(400, 'Field teks harus berupa string.');
  }

  return value.trim();
}

function parseEnumValue<T extends readonly string[]>(
  value: unknown,
  allowedValues: T,
  fieldName: string
) {
  if (typeof value !== 'string' || !allowedValues.includes(value)) {
    throw new ApiError(
      400,
      `${fieldName} tidak valid. Nilai yang diperbolehkan: ${allowedValues.join(', ')}.`
    );
  }

  return value as T[number];
}

function toJsonValue(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    throw new ApiError(400, 'metadata atau value harus bisa diserialisasi ke JSON.');
  }
}

export function validateContentInput(
  input: ContentInput,
  options: ValidateContentOptions = {}
) {
  const { partial = false } = options;

  if (!partial) {
    if (!isNonEmptyString(input.slug)) {
      throw new ApiError(400, 'slug wajib diisi.');
    }

    if (!isNonEmptyString(input.title)) {
      throw new ApiError(400, 'title wajib diisi.');
    }

    if (input.type === undefined) {
      throw new ApiError(400, 'type wajib diisi.');
    }
  }

  const data: Record<string, unknown> = {};

  if (input.type !== undefined) {
    data.type = parseEnumValue(input.type, contentTypes, 'type');
  }

  if (input.status !== undefined) {
    data.status = parseEnumValue(input.status, contentStatuses, 'status');
  }

  if (input.slug !== undefined) {
    if (!isNonEmptyString(input.slug)) {
      throw new ApiError(400, 'slug wajib berupa string non-kosong.');
    }

    const normalizedSlug = String(input.slug).trim().toLowerCase();

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) {
      throw new ApiError(
        400,
        'slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.'
      );
    }

    data.slug = normalizedSlug;
  }

  if (input.title !== undefined) {
    if (!isNonEmptyString(input.title)) {
      throw new ApiError(400, 'title wajib berupa string non-kosong.');
    }

    data.title = String(input.title).trim();
  }

  if (input.summary !== undefined) {
    data.summary = normalizeOptionalString(input.summary);
  }

  if (input.body !== undefined) {
    data.body = normalizeOptionalString(input.body);
  }

  if (input.locale !== undefined) {
    if (!isNonEmptyString(input.locale)) {
      throw new ApiError(400, 'locale wajib berupa string non-kosong.');
    }

    data.locale = String(input.locale).trim();
  }

  if (input.section !== undefined) {
    data.section = normalizeOptionalString(input.section);
  }

  if (input.coverImageUrl !== undefined) {
    const coverImageUrl = normalizeOptionalString(input.coverImageUrl);

    if (
      coverImageUrl &&
      !URL.canParse(coverImageUrl) &&
      !coverImageUrl.startsWith('/')
    ) {
      throw new ApiError(
        400,
        'coverImageUrl harus berupa URL absolut atau path relatif.'
      );
    }

    data.coverImageUrl = coverImageUrl;
  }

  if (input.sortOrder !== undefined) {
    if (
      typeof input.sortOrder !== 'number' ||
      !Number.isInteger(input.sortOrder)
    ) {
      throw new ApiError(400, 'sortOrder wajib berupa integer.');
    }

    data.sortOrder = input.sortOrder;
  }

  if (input.metadata !== undefined) {
    data.metadata = toJsonValue(input.metadata);
  }

  if (input.publishedAt !== undefined) {
    if (input.publishedAt === null || input.publishedAt === '') {
      data.publishedAt = null;
    } else if (typeof input.publishedAt === 'string') {
      const publishedAt = new Date(input.publishedAt);

      if (Number.isNaN(publishedAt.getTime())) {
        throw new ApiError(400, 'publishedAt harus berupa tanggal ISO yang valid.');
      }

      data.publishedAt = publishedAt;
    } else {
      throw new ApiError(400, 'publishedAt harus berupa string ISO date.');
    }
  }

  return data;
}

type SiteSettingInput = {
  key?: unknown;
  value?: unknown;
  description?: unknown;
};

export function validateSettingInput(
  input: SiteSettingInput,
  options: { partial?: boolean } = {}
) {
  const { partial = false } = options;

  if (!partial && !isNonEmptyString(input.key)) {
    throw new ApiError(400, 'key wajib diisi.');
  }

  if (!partial && input.value === undefined) {
    throw new ApiError(400, 'value wajib diisi.');
  }

  const data: Record<string, unknown> = {};

  if (input.key !== undefined) {
    if (!isNonEmptyString(input.key)) {
      throw new ApiError(400, 'key wajib berupa string non-kosong.');
    }

    data.key = String(input.key).trim();
  }

  if (input.value !== undefined) {
    data.value = toJsonValue(input.value);
  }

  if (input.description !== undefined) {
    data.description = normalizeOptionalString(input.description);
  }

  return data;
}

export function parseContentStatusFilter(value: string | null) {
  if (!value) {
    return undefined;
  }

  return parseEnumValue(value, contentStatuses, 'status');
}

export function parseContentTypeFilter(value: string | null) {
  if (!value) {
    return undefined;
  }

  return parseEnumValue(value, contentTypes, 'type');
}
