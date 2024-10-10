'use client';
import {
  MantineProvider,
  createTheme,
  ColorSchemeScript,
  MantineColorsTuple,
} from '@mantine/core';
import React, { PropsWithChildren } from 'react';

const primary: MantineColorsTuple = [
  '#eafbfb',
  '#c4f4f3',
  '#9fedec',
  '#7ae5e4',
  '#54dedd',
  '#2fd7d5',
  '#23b7b6',
  '#1c9392',
  '#156f6e',
  '#0e4b4a',
  '#072626',
];

const theme = createTheme({
  colors: {
    primary,
  },
  primaryColor: 'primary',
});

export default function ThemeProvider({ children }: PropsWithChildren) {
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
