'use client';
import React, { startTransition, useEffect, useRef, useState } from 'react';
import ChatBubble from '@/components/chat/ChatBubble';
import { useSocket } from '@/components/context/SocketProvider';
import type { initialMessage, initialMessages } from '@/lib/types';
import { useMessages } from '@/components/context/MessageProvider';
import { Button, Loader, Transition } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { getMessages } from '@/lib/dbQueries';

type ChatMessageListProps = {
  initialMessages: initialMessages;
  roomId: string;
};

const ChatMessageList = ({ initialMessages, roomId }: ChatMessageListProps) => {
  const { data: session } = useSession();
  const { socket, joinRoom, leaveRoom } = useSocket();
  const messageDiv = useRef<HTMLDivElement | null>(null);
  const { realTimeMessages, addRealTimeMessage } = useMessages();
  const [messages, setMessages] = useState(initialMessages);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const loadMoreMessages = async () => {
    if (loadingMore || !hasMore || !messageDiv.current) return;

    const previousScrollHeight = messageDiv.current.scrollHeight;
    const previousScrollTop = messageDiv.current.scrollTop;

    setLoadingMore(true);
    const oldestMessage = messages[0];

    startTransition(async () => {
      const newMessages = await getMessages(roomId, 20, oldestMessage.id);

      if (newMessages.length > 0) {
        setMessages((prev) => [...newMessages, ...prev]);

        setTimeout(() => {
          if (messageDiv.current) {
            const newScrollHeight = messageDiv.current.scrollHeight;
            messageDiv.current.scrollTop =
              newScrollHeight - previousScrollHeight + previousScrollTop;
          }
        }, 1);
      }

      setHasMore(newMessages.length > 0);
      setLoadingMore(false);
    });
  };

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
    if (scrollTop === 0) {
      loadMoreMessages();
    }
    setIsAtBottom(atBottom);
    if (atBottom) {
      setMessageCount(0);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    if (socket) joinRoom(roomId);

    return () => {
      if (socket) leaveRoom(roomId);
    };
  }, [roomId, joinRoom, leaveRoom, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (msg: initialMessage) => {
        addRealTimeMessage(roomId, msg);
        if (msg.author.username === session?.user.username || isAtBottom) {
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
        {loadingMore && <Loading />}
        {messages.map((e, i) => (
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

const Loading = () => {
  return (
    <div className="flex items-center justify-center">
      <Loader />
    </div>
  );
};
