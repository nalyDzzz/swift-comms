import ChatInput from '@/components/chat/ChatInput';
import React from 'react';
import ChatMessageList from '@/components/chat/ChatMessageList';
import { getMessages } from '@/lib/dbQueries';
import { initialMessages } from '@/lib/types';
import { auth } from '@/lib/auth';
import AddUsernameModal from '@/components/AddUsernameModal';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global Chat',
};

export default async function Chat() {
  const session = await auth();
  const limit = 20;
  const messages: initialMessages = await getMessages('1', limit);
  const emoji = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');
  const data = await emoji.json();
  return (
    <div className="h-full">
      <h1 className="text-2xl font-semibold">Global Chat</h1>
      {!session?.user.username && <AddUsernameModal />}
      <div className="h-full w-full flex flex-col items-center relative">
        <ChatMessageList initialMessages={messages} roomId={'1'} />
        <ChatInput
          className="w-11/12 mb-5"
          roomId={'1'}
          emojis={data}
          chatroomName="Global"
        />
      </div>
    </div>
  );
}
