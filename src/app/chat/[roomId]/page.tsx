import ChatInput from '@/components/ChatInput';
import React from 'react';
import ChatMessageList from '@/components/ChatMessageList';
import { getMessages } from '@/lib/dbQueries';
import { initialMessages } from '@/lib/types';
import { auth } from '@/lib/auth';
import AddUsernameModal from '@/components/AddUsernameModal';

interface ChatroomProps {
  params: {
    roomId: string;
  };
}

export default async function Chatroom({ params }: ChatroomProps) {
  const { roomId } = params;
  const session = await auth();

  const messages: initialMessages[] | undefined = await getMessages(
    parseInt(roomId)
  );
  if (!messages) throw new Error('no messages');
  return (
    <div className="h-full">
      <h1 className="text-2xl font-semibold">Global Chat</h1>
      {!session?.user.username && <AddUsernameModal />}
      <div className="h-full w-full flex flex-col items-center">
        <ChatMessageList initialMessages={messages} roomId={parseInt(roomId)} />
        <ChatInput className="w-11/12 mb-5" roomId={parseInt(roomId)} />
      </div>
    </div>
  );
}
