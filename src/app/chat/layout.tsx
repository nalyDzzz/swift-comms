import AppLayout from '@/components/AppLayout';
import React from 'react';
import type { PropsWithChildren } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ChatLayout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session) redirect('/auth/login');
  return (
    <main className="h-full">
      <AppLayout>{children}</AppLayout>
    </main>
  );
}
