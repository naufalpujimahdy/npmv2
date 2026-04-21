import { ZodError } from 'zod';
import { corsHeaders } from '@/src/lib/cors';

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

export function errorResponse(
  statusCode: number,
  error: string,
  code?: string,
  details?: Record<string, string[]>
): [ErrorResponse, { status: number; headers?: HeadersInit }] {
  return [
    {
      ok: false,
      error,
      code,
      details,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode },
  ];
}

export function handleValidationError(error: ZodError) {
  const details: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!details[path]) {
      details[path] = [];
    }
    details[path].push(issue.message);
  }

  return details;
}

export async function withErrorHandling<T>(
  request: Request,
  handler: () => Promise<[T, { status?: number }] | Response>
): Promise<Response> {
  try {
    const result = await handler();

    if (result instanceof Response) {
      return result;
    }

    const [data, options] = result;
    return Response.json(
      { ok: true, data },
      {
        status: options.status ?? 200,
        headers: corsHeaders(request),
      }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      const [response, options] = errorResponse(
        error.statusCode,
        error.message,
        error.code
      );
      return Response.json(response, {
        status: options.status,
        headers: {
          ...corsHeaders(request),
          ...(error.headers ?? {}),
        },
      });
    }

    if (error instanceof ZodError) {
      const details = handleValidationError(error);
      const [response, options] = errorResponse(
        400,
        'Validasi input gagal.',
        'VALIDATION_ERROR',
        details
      );
      return Response.json(response, {
        ...options,
        headers: corsHeaders(request),
      });
    }

    console.error('Unhandled error:', error);

    const [response, options] = errorResponse(
      500,
      'Terjadi kesalahan server.',
      'INTERNAL_SERVER_ERROR'
    );
    return Response.json(response, {
      ...options,
      headers: corsHeaders(request),
    });
  }
}
