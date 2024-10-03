import AppLayout from '@/components/AppLayout';
import React from 'react';
import type { PropsWithChildren } from 'react';

export default function ChatLayout({ children }: PropsWithChildren) {
  return (
    <main className="h-full">
      <AppLayout>{children}</AppLayout>
    </main>
  );
}
