import ChatInput from '@/components/ChatInput';
import React from 'react';
import { dummyMessages } from '@/lib/dummy-messages';
import ChatBubble from '@/components/ChatBubble';
import ChatMessageList from '@/components/ChatMessageList';

export default function Chat() {
  return (
    <div className="h-full">
      <h1 className="text-xl font-semibold">Global Chat</h1>
      <div className="h-full w-full flex flex-col items-center">
        <ChatMessageList messages={dummyMessages} />
        <ChatInput className="w-11/12 mb-5" />
      </div>
    </div>
  );
}
