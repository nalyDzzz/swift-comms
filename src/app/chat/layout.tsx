import Sidebar from '@/components/Sidebar/Sidebar';
import { Avatar } from '@mantine/core';
import React from 'react';
import type { PropsWithChildren } from 'react';

export default function ChatLayout({ children }: PropsWithChildren) {
  return (
    <main className="relative">
      <Avatar className="absolute top-2 right-2">DM</Avatar>
      <Sidebar />
      <div className="p4 sm:ml-64 h-screen">{children}</div>
    </main>
  );
}
