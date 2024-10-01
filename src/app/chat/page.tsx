import ChatInput from '@/components/ChatInput';
import React from 'react';
import { dummyMessages } from '@/lib/dummy-messages';

export default function Chat() {
  return (
    <div className="h-full">
      <h1 className="text-xl font-semibold absolute">Global Chat</h1>
      <div className="h-full flex flex-col items-center">
        <div className="h-full w-full"></div>
        <ChatInput className="w-11/12 mb-5" />
      </div>
    </div>
  );
}
