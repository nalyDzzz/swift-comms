'use client';
import { Message } from '@/lib/dummy-messages';
import React, { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';

const ChatMessageList = ({ messages }: { messages: Message[] }) => {
  const messagesEnd = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'instant' });
  };
  useEffect(() => {
    scrollToBottom();
  }, []);
  return (
    <div className=" w-full h-[92%] flex flex-col gap-10 overflow-y-scroll p-10 relative">
      {messages.map((e, i) => (
        <ChatBubble message={e} key={i} />
      ))}
      <div className="absolute bottom-0" ref={messagesEnd}></div>
    </div>
  );
};

export default ChatMessageList;
