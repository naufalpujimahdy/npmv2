import { ThemeProvider } from '@/components/providers/theme-provider';
import { CmsLayoutClient } from './layout-client';

export default function CmsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <CmsLayoutClient>{children}</CmsLayoutClient>
    </ThemeProvider>
  );
}
