import Sidebar from '@/components/AppLayout';
import React from 'react';
import type { PropsWithChildren } from 'react';
import Providers from './providers';

export default function ChatLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      <main className="h-full">
        <Sidebar>{children}</Sidebar>
      </main>
    </Providers>
  );
}
