'use client';
import { createContext, useContext, useState } from 'react';
import { initialMessages } from '@/lib/types';

interface MessageContextProps {
  realTimeMessages: { [roomId: number]: initialMessages[] };
  addRealTimeMessage: (roomId: number, message: initialMessages) => void;
  clearRealTimeMessages: (roomId: number) => void;
}

const MessageContext = createContext<MessageContextProps>({
  realTimeMessages: {},
  addRealTimeMessage: () => {},
  clearRealTimeMessages: () => {},
});

export const useMessages = () => {
  return useContext(MessageContext);
};

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [realTimeMessages, setRealTimeMessages] = useState<{
    [roomId: number]: initialMessages[];
  }>({});

  const addRealTimeMessage = (roomId: number, message: initialMessages) => {
    setRealTimeMessages((prevMessages) => ({
      ...prevMessages,
      [roomId]: [...(prevMessages[roomId] || []), message],
    }));
    console.log(realTimeMessages);
  };

  const clearRealTimeMessages = (roomId: number) => {
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
