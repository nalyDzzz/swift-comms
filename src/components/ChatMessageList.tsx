'use client';
import { Message } from '@/lib/dummy-messages';
import React, { useEffect, useRef, useState } from 'react';
import ChatBubble from './ChatBubble';
import { socket } from '@/socket';

const ChatMessageList = ({
  initialMessages,
}: {
  initialMessages: Message[];
}) => {
  const messagesEnd = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'instant' });
  };
  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    socket.on('message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      scrollToBottom();
      console.log(messages);
    });

    return () => {
      socket.off('message');
    };
  }, []);
  return (
    <div className=" w-full h-[92%] flex flex-col gap-10 overflow-y-scroll p-10 relative">
      {initialMessages.map((e, i) => (
        <ChatBubble message={e} key={i} />
      ))}
      {messages.map((e) => (
        <p>{e}</p>
      ))}
      <div className="absolute bottom-0" ref={messagesEnd}></div>
    </div>
  );
};

export default ChatMessageList;
