'use client';
import React, { useEffect, useRef, useState } from 'react';
import ChatBubble from '@/components/chat/ChatBubble';
import { useSocket } from '@/components/SocketProvider';
import { initialMessages } from '@/lib/types';
import { useMessages } from '@/components/MessageProvider';
import { Button, Transition } from '@mantine/core';
import { useSession } from 'next-auth/react';

const ChatMessageList = ({
  initialMessages,
  roomId,
}: {
  initialMessages: initialMessages[];
  roomId: number;
}) => {
  const { data: session } = useSession();
  const { socket, joinRoom, leaveRoom } = useSocket();
  const messageDiv = useRef<HTMLDivElement | null>(null);
  const { realTimeMessages, addRealTimeMessage } = useMessages();
  const [messageCount, setMessageCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollToBottom = () => {
    if (!messageDiv.current) return;
    messageDiv.current.scrollTop = messageDiv.current.scrollHeight;
    setIsAtBottom(true);
    setMessageCount(0);
  };

  const handleScroll = () => {
    if (!messageDiv.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messageDiv.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 10;

    setIsAtBottom(atBottom);
    if (atBottom) {
      setMessageCount(0);
    }
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
        addRealTimeMessage(roomId, msg);
        if (msg.author.name === session?.user.username || isAtBottom) {
          scrollToBottom();
        } else {
          setMessageCount((c) => c + 1);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket, roomId, addRealTimeMessage, session?.user.username, isAtBottom]);

  useEffect(() => {
    const scrollContainer = messageDiv.current;
    if (scrollContainer && isAtBottom) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [realTimeMessages, isAtBottom]);

  return (
    <>
      <Transition
        transition="slide-down"
        mounted={!isAtBottom && messageCount > 0}
        duration={200}
      >
        {(transitionStyles) => (
          <Button
            className="absolute right-1/2 z-50"
            onClick={scrollToBottom}
            style={{ ...transitionStyles }}
            radius="lg"
          >
            {messageCount} new messages!
          </Button>
        )}
      </Transition>

      <div
        className="w-full h-[92%] flex flex-col gap-10 overflow-y-scroll md:p-10 relative"
        ref={messageDiv}
        onScroll={handleScroll}
      >
        {initialMessages.map((e, i) => (
          <ChatBubble message={e} key={i + initialMessages.length} />
        ))}
        {realTimeMessages[roomId]?.map((e, i) => (
          <ChatBubble message={e} key={i + realTimeMessages[roomId].length} />
        ))}
      </div>
    </>
  );
};

export default ChatMessageList;
