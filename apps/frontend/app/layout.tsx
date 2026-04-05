import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'npmv2 Frontend',
  description: 'Frontend app for the npmv2 workspace',
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
          background:
            'radial-gradient(circle at top, rgba(47, 107, 79, 0.18), transparent 32%), linear-gradient(180deg, #f8f4eb 0%, #efe4d3 100%)',
          color: '#1e2a23',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
