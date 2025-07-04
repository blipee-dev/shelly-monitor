'use client';

import { SnackbarProvider as NotistackProvider } from 'notistack';
import { ReactNode } from 'react';

interface SnackbarProviderProps {
  children: ReactNode;
}

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  return (
    <NotistackProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      autoHideDuration={3000}
    >
      {children}
    </NotistackProvider>
  );
}