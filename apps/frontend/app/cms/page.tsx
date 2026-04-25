import { CmsAppLayout } from '@/components/cms/CmsAppLayout';
import { DashboardOverview } from '@/modules/dashboard/DashboardOverview';

export default function CmsDashboardPage() {
  return (
    <CmsAppLayout>
      <DashboardOverview />
    </CmsAppLayout>
  );
}
