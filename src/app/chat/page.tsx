import ChatInput from '@/components/ChatInput';
import React from 'react';
import ChatMessageList from '@/components/ChatMessageList';
import { getMessages } from '@/lib/dbQueries';
import { initialMessages } from '@/lib/types';

export default async function Chat() {
  const messages: initialMessages[] | undefined = await getMessages(1);
  if (!messages) throw new Error('no messages');
  return (
    <div className="h-full">
      <h1 className="text-xl font-semibold">Global Chat</h1>
      <div className="h-full w-full flex flex-col items-center">
        <ChatMessageList initialMessages={messages} roomId={1} />
        <ChatInput className="w-11/12 mb-5" roomId={1} />
      </div>
    </div>
  );
}
