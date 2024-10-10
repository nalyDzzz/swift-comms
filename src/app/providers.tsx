'use client';
import { MantineProvider, createTheme, ColorSchemeScript } from '@mantine/core';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = createTheme({});

  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={60 * 5}>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider
        defaultColorScheme="auto"
        theme={theme}
        withStaticClasses={false}
      >
        {children}
      </MantineProvider>
    </SessionProvider>
  );
}
