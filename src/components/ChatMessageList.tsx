'use client';
import React, { useEffect, useRef, useState } from 'react';
import ChatBubble from './ChatBubble';
import { useSocket } from './SocketProvider';
import { initialMessages } from '@/lib/types';

const ChatMessageList = ({
  initialMessages,
  roomId,
}: {
  initialMessages: initialMessages[];
  roomId: number;
}) => {
  const { socket, joinRoom, leaveRoom } = useSocket();
  const messageDiv = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<initialMessages[]>([]);
  const scrollToBottom = () => {
    messageDiv.current?.scrollTo(0, messageDiv.current.scrollHeight);
  };
  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    joinRoom(roomId.toString());

    return () => {
      leaveRoom(roomId.toString());
    };
  }, [roomId, joinRoom, leaveRoom]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (msg: initialMessages) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
    }

    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div
      className=" w-full h-[92%] flex flex-col gap-10 overflow-y-scroll md:p-10 relative"
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
