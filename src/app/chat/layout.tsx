import AppLayout from '@/components/AppLayout';
import React from 'react';
import type { PropsWithChildren } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SocketProvider } from '@/components/SocketProvider';
import { getChatrooms } from '@/lib/dbQueries';
import { MessageProvider } from '@/components/MessageProvider';

export default async function ChatLayout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session?.user.email) redirect('/auth/login');
  const chatrooms = await getChatrooms(session.user.email);
  return (
    <main className="h-full">
      <SocketProvider>
        <MessageProvider>
          <AppLayout chatrooms={chatrooms}>{children}</AppLayout>
        </MessageProvider>
      </SocketProvider>
    </main>
  );
}
