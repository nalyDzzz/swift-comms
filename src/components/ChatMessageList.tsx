'use client';
import { Message } from '@/lib/dummy-messages';
import React, { useEffect, useRef, useState } from 'react';
import ChatBubble from './ChatBubble';
import { socket } from '@/socket';

const ChatMessageList = ({
  initialMessages,
  roomId,
}: {
  initialMessages: Message[];
  roomId: number;
}) => {
  const messagesEnd = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'instant' });
  };
  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    socket.emit('joinRoom', roomId);
    socket.on('message', (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off('message');
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div className=" w-full h-[92%] flex flex-col gap-10 overflow-y-scroll p-10 relative">
      {initialMessages.map((e, i) => (
        <ChatBubble message={e} key={i} />
      ))}
      {messages.map((e, i) => (
        <ChatBubble message={e} key={i} />
      ))}
      <div className="absolute bottom-0" ref={messagesEnd}></div>
    </div>
  );
};

export default ChatMessageList;
