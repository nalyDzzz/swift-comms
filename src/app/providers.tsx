'use client';
import { MantineProvider, createTheme, ColorSchemeScript } from '@mantine/core';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = createTheme({});

  return (
    <SessionProvider>
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
