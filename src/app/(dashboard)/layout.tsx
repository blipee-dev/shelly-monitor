import { PremiumDashboardLayout } from '@/components/layout/PremiumDashboardLayout';
import { PremiumThemeProvider } from '@/components/premium';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PremiumThemeProvider>
      <PremiumDashboardLayout>{children}</PremiumDashboardLayout>
    </PremiumThemeProvider>
  );
}