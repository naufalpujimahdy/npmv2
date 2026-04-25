import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public headers?: HeadersInit
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type ErrorResponse = {
  ok: false;
  error: string;
  code?: string;
  details?: Record<string, string[]>;
  timestamp: string;
};

function buildErrorBody(
  statusCode: number,
  error: string,
  code?: string,
  details?: Record<string, string[]>
): [ErrorResponse, number] {
  return [
    { ok: false, error, code, details, timestamp: new Date().toISOString() },
    statusCode,
  ];
}

function handleValidationError(error: ZodError): Record<string, string[]> {
  const details: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    (details[path] ??= []).push(issue.message);
  }
  return details;
}

export async function withErrorHandling<T>(
  _request: Request,
  handler: () => Promise<[T, { status?: number; headers?: HeadersInit }] | Response>
): Promise<Response> {
  try {
    const result = await handler();

    if (result instanceof Response) return result;

    const [data, options] = result;
    return Response.json(
      { ok: true, data },
      {
        status: options.status ?? 200,
        headers: options.headers,
      }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      const [body, status] = buildErrorBody(error.statusCode, error.message, error.code);
      return Response.json(body, { status, headers: error.headers });
    }

    if (error instanceof ZodError) {
      const details = handleValidationError(error);
      const [body, status] = buildErrorBody(400, 'Validasi input gagal.', 'VALIDATION_ERROR', details);
      return Response.json(body, { status });
    }

    console.error('Unhandled error:', error);
    const [body, status] = buildErrorBody(500, 'Terjadi kesalahan server.', 'INTERNAL_SERVER_ERROR');
    return Response.json(body, { status });
  }
}
