import { CmsLayoutClient } from './layout-client';

export default function CmsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CmsLayoutClient>{children}</CmsLayoutClient>;
}
