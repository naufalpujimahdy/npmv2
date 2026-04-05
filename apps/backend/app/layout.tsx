import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'npmv2 Backend',
  description: 'Backend app for the npmv2 workspace',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '24px',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: '#0f172a',
          color: '#e2e8f0',
        }}
      >
        {children}
      </body>
    </html>
  );
}
