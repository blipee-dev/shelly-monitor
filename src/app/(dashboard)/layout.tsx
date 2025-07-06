import { PremiumDashboardLayout } from '@/components/layout/PremiumDashboardLayout';
import { PremiumThemeWrapper } from '@/components/premium/PremiumThemeWrapper';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PremiumThemeWrapper>
      <PremiumDashboardLayout>{children}</PremiumDashboardLayout>
    </PremiumThemeWrapper>
  );
}