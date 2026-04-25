import { CmsSidebar } from './CmsSidebar';
import { CmsHeader } from './CmsHeader';

interface CmsAppLayoutProps {
  children: React.ReactNode;
}

export function CmsAppLayout({ children }: CmsAppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — always-dark, fixed width */}
      <CmsSidebar />

      {/* Right panel: header + scrollable content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <CmsHeader />

        <main className="flex-1 overflow-y-auto bg-muted/25 scrollbar-thin">
          <div className="mx-auto max-w-6xl p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
