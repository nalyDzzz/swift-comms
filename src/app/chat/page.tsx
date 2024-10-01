import ChatInput from '@/components/ChatInput';
import React from 'react';
import { dummyMessages } from '@/lib/dummy-messages';
import ChatBubble from '@/components/ChatBubble';

export default function Chat() {
  return (
    <div className="h-full">
      <h1 className="text-xl font-semibold">Global Chat</h1>
      <div className="h-full w-full flex flex-col items-center">
        <div className=" w-full h-[92%] flex flex-col gap-10 overflow-y-scroll p-10">
          {dummyMessages.map((e, i) => (
            <ChatBubble message={e} key={i} />
          ))}
        </div>
        <ChatInput className="w-11/12 mb-5" />
      </div>
    </div>
  );
}
