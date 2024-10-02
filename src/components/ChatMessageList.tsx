'use client';
import React, { useEffect, useRef, useState } from 'react';
import ChatBubble from './ChatBubble';
import { socket } from '@/socket';
import { initialMessages } from '@/lib/types';

const ChatMessageList = ({
  initialMessages,
  roomId,
}: {
  initialMessages: initialMessages[];
  roomId: number;
}) => {
  const messageDiv = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<initialMessages[]>([]);
  const scrollToBottom = () => {
    messageDiv.current?.scrollTo(0, messageDiv.current.scrollHeight);
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
    <div
      className=" w-full h-[92%] flex flex-col gap-10 overflow-y-scroll p-10 relative"
      ref={messageDiv}
    >
      {initialMessages.map((e, i) => (
        <ChatBubble message={e} key={i} />
      ))}
      {messages.map((e, i) => (
        <ChatBubble message={e} key={i} />
      ))}
    </div>
  );
};

export default ChatMessageList;
