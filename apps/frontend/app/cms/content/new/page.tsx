import { CmsAppLayout } from '@/components/cms/CmsAppLayout';
import { ContentForm } from '@/modules/content/ContentForm';

export default function NewContentPage() {
  return (
    <CmsAppLayout>
      <ContentForm isNew />
    </CmsAppLayout>
  );
}
