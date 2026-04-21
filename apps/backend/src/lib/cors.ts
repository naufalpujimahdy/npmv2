export function corsHeaders(request: Request): HeadersInit {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
  const origin = request.headers.get('origin');

  // Allow only configured frontend URL in production
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [frontendUrl]
    : ['http://localhost:3001', 'http://localhost:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3000'];

  const allowOrigin = allowedOrigins.includes(origin || '') ? origin || frontendUrl : null;

  return {
    'Access-Control-Allow-Origin': allowOrigin || frontendUrl,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

export function handleCorsPreFlight(request: Request): Response | null {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(request),
    });
  }
  return null;
}
