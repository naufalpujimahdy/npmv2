export default function BackendHomePage() {
  return (
    <main
      style={{
        width: '100%',
        maxWidth: '720px',
        borderRadius: '24px',
        background: 'rgba(15, 23, 42, 0.72)',
        border: '1px solid rgba(148, 163, 184, 0.24)',
        padding: '28px',
      }}
    >
      <p
        style={{
          margin: 0,
          color: '#38bdf8',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        Backend Ready
      </p>
      <h1>Service backend berjalan di Next App Router.</h1>
      <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
        Backend ini sekarang disiapkan untuk mengelola konten web personal:
        halaman, section homepage, project, pengalaman, post, sampai site
        setting.
      </p>
      <div
        style={{
          display: 'grid',
          gap: '12px',
          marginTop: '20px',
        }}
      >
        {[
          'GET /api/health',
          'GET /api/content',
          'GET /api/content/slug/:slug',
          'POST /api/content',
          'POST /api/auth/register',
          'POST /api/auth/login',
          'GET /api/auth/me',
          'GET /api/settings',
          'PUT /api/settings',
        ].map((endpoint) => (
          <code
            key={endpoint}
            style={{
              display: 'inline-block',
              padding: '10px 14px',
              borderRadius: '999px',
              background: 'rgba(56, 189, 248, 0.12)',
              width: 'fit-content',
            }}
          >
            {endpoint}
          </code>
        ))}
      </div>
      <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: 0 }}>
        Untuk operasi tulis, sertakan header
        <code style={{ marginLeft: '6px' }}>x-admin-api-key</code>
        yang cocok dengan
        <code style={{ marginLeft: '6px' }}>ADMIN_API_KEY</code>.
      </p>
    </main>
  );
}
