'use client';
import React, { useEffect, useRef, useState } from 'react';
import ChatBubble from './ChatBubble';
import { socket } from '@/socket';

type initialMessages = {
  date: Date;
  content: string;
  author: {
    name: string | null;
    username: string | null;
  };
};

const ChatMessageList = ({
  initialMessages,
  roomId,
}: {
  initialMessages: initialMessages[];
  roomId: number;
}) => {
  const messagesEnd = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<initialMessages[]>([]);
  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'instant' });
  };
  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    socket.emit('joinRoom', roomId.toString());
    socket.on('message', (msg: initialMessages) => {
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
