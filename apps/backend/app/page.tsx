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
        Gunakan endpoint health check untuk memastikan server aktif, lalu
        lanjutkan menambahkan route auth, user, atau integrasi database Prisma.
      </p>
      <code
        style={{
          display: 'inline-block',
          padding: '10px 14px',
          borderRadius: '999px',
          background: 'rgba(56, 189, 248, 0.12)',
        }}
      >
        GET /api/health
      </code>
    </main>
  );
}
