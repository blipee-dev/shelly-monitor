'use client';

import { useEffect, useState } from 'react';

interface HydrationWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Wrapper component that ensures children are only rendered after hydration
 * This prevents hydration mismatches for dynamic content
 */
export function HydrationWrapper({ children, fallback = null }: HydrationWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}