'use client';
import { createContext, useContext, useState } from 'react';
import { initialMessage, initialMessages } from '@/lib/types';

interface MessageContextProps {
  realTimeMessages: { [roomId: string]: initialMessages };
  addRealTimeMessage: (roomId: string, message: initialMessage) => void;
  clearRealTimeMessages: (roomId: string) => void;
}

const MessageContext = createContext<MessageContextProps>(
  {} as MessageContextProps
);

export const useMessages = () => {
  return useContext(MessageContext);
};

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [realTimeMessages, setRealTimeMessages] = useState<{
    [roomId: string]: initialMessages;
  }>({});

  const addRealTimeMessage = (roomId: string, message: initialMessage) => {
    setRealTimeMessages((prevMessages) => ({
      ...prevMessages,
      [roomId]: [...(prevMessages[roomId] || []), message],
    }));
  };

  const clearRealTimeMessages = (roomId: string) => {
    setRealTimeMessages((prevMessages) => ({
      ...prevMessages,
      [roomId]: [],
    }));
  };

  return (
    <MessageContext.Provider
      value={{ realTimeMessages, addRealTimeMessage, clearRealTimeMessages }}
    >
      {children}
    </MessageContext.Provider>
  );
};
