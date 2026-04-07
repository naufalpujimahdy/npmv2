import type { Metadata } from 'next';
import './globals.css';

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
        className="min-h-screen bg-transparent text-[var(--foreground)]"
      >
        {children}
      </body>
    </html>
  );
}
