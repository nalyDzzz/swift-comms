'use client';
import { MantineProvider, createTheme, ColorSchemeScript } from '@mantine/core';
import React from 'react';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = createTheme({});

  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider
        defaultColorScheme="auto"
        theme={theme}
        withStaticClasses={false}
      >
        {children}
      </MantineProvider>
    </>
  );
}
