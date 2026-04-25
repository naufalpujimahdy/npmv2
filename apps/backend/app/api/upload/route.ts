import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { withErrorHandling, ApiError, requireApiKey } from '@/src/lib/error-handler';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  return withErrorHandling(request, async () => {
    requireApiKey(request);

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      throw new ApiError(400, 'File tidak ditemukan', 'MISSING_FILE');
    }

    if (file.size > MAX_SIZE) {
      throw new ApiError(400, 'Ukuran file maksimal 5MB', 'FILE_TOO_LARGE');
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new ApiError(400, 'Format tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF', 'INVALID_FILE_TYPE');
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/uploads/${filename}`;

    return [{ url, filename }, { status: 201 }];
  });
}
