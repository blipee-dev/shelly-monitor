'use client';

import { useEffect } from 'react';
import { initializeI18n } from '@/lib/i18n';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeI18n();
  }, []);

  return <>{children}</>;
}