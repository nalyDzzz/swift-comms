'use client';
import React, { useEffect, useRef } from 'react';
import ChatBubble from '@/components/chat/ChatBubble';
import { useSocket } from '@/components/SocketProvider';
import { initialMessages } from '@/lib/types';
import { useMessages } from '@/components/MessageProvider';
import { ScrollArea } from '@mantine/core';

const ChatMessageList = ({
  initialMessages,
  roomId,
}: {
  initialMessages: initialMessages[];
  roomId: number;
}) => {
  const { socket, joinRoom, leaveRoom } = useSocket();
  const messageDiv = useRef<HTMLDivElement | null>(null);
  const { realTimeMessages, addRealTimeMessage } = useMessages();
  const scrollToBottom = () => {
    messageDiv.current?.scrollTo(0, messageDiv.current.scrollHeight);
  };
  useEffect(() => {
    scrollToBottom();
  }, [realTimeMessages]);

  useEffect(() => {
    joinRoom(roomId.toString());

    return () => {
      leaveRoom(roomId.toString());
    };
  }, [roomId, joinRoom, leaveRoom]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (msg: initialMessages) => {
        addRealTimeMessage(roomId, msg);
      });
    }

    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket, roomId, addRealTimeMessage]);

  return (
    <ScrollArea.Autosize w={'100%'} h={'100%'} viewportRef={messageDiv}>
      <div className="flex flex-col gap-10 relative md:p-10">
        {initialMessages.map((e, i) => (
          <ChatBubble message={e} key={i} />
        ))}
        {realTimeMessages[roomId]?.map((e, i) => (
          <ChatBubble message={e} key={i} />
        ))}
      </div>
    </ScrollArea.Autosize>
  );
};

export default ChatMessageList;
