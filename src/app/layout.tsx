import type { Metadata } from 'next';
import '@mantine/core/styles.css';
import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth';
import ThemeProvider from '@/components/context/ThemeProvider';

export const metadata: Metadata = {
  title: 'Swift Comms',
  description: 'A chatroom web app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-screen overflow-y-hidden">
        <SessionProvider session={session} refetchOnWindowFocus={false}>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
