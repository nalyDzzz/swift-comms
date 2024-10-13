import AppLayout from '@/components/AppLayout';
import React from 'react';
import type { PropsWithChildren } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SocketProvider } from '@/components/context/SocketProvider';
import { getAllUsers, getChatrooms, getInvites } from '@/lib/dbQueries';
import { MessageProvider } from '@/components/context/MessageProvider';
import { DataProvider } from '@/components/context/DataProvider';

export default async function ChatLayout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session) redirect('/auth/login');
  const chatrooms = await getChatrooms(session.user.email!);
  const users = await getAllUsers();
  const invites = await getInvites(session.user.id!);
  return (
    <main className="h-full">
      <DataProvider users={users} chatrooms={chatrooms} invites={invites}>
        <SocketProvider>
          <MessageProvider>
            <AppLayout>{children}</AppLayout>
          </MessageProvider>
        </SocketProvider>
      </DataProvider>
    </main>
  );
}
