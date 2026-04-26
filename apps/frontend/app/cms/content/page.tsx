import { CmsAppLayout } from '@/components/cms/CmsAppLayout';
import { ContentManager } from '@/modules/content/ContentManager';

export default function ContentPage() {
  return (
    <CmsAppLayout>
      <ContentManager />
    </CmsAppLayout>
  );
}
