const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const colors = {
  card: '#fffaf0',
  accent: '#2f6b4f',
  muted: '#66756d',
};

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '32px',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '760px',
          background: colors.card,
          border: '1px solid rgba(30, 42, 35, 0.08)',
          borderRadius: '28px',
          padding: '32px',
          boxShadow: '0 24px 80px rgba(30, 42, 35, 0.12)',
        }}
      >
        <p
          style={{
            margin: 0,
            color: colors.accent,
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Frontend Ready
        </p>
        <h1 style={{ marginBottom: '12px', fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
          Workspace ini sekarang punya frontend yang bisa dijalankan.
        </h1>
        <p
          style={{
            margin: '0 0 24px',
            maxWidth: '56ch',
            color: colors.muted,
            fontSize: '1.05rem',
            lineHeight: 1.7,
          }}
        >
          Jalankan backend di port 3000 dan frontend di port 3001. Nilai
          <code
            style={{
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            }}
          >
            {' '}
            NEXT_PUBLIC_API_URL
          </code>{' '}
          saat ini diarahkan ke:
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <code
            style={{
              padding: '12px 16px',
              borderRadius: '999px',
              background: 'rgba(47, 107, 79, 0.08)',
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            }}
          >
            {apiUrl}
          </code>
          <a
            href={`${apiUrl}/api/health`}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '12px 18px',
              borderRadius: '999px',
              background: colors.accent,
              color: '#fff',
              fontWeight: 600,
            }}
          >
            Cek backend health
          </a>
        </div>
      </section>
    </main>
  );
}
