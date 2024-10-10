/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { Popover, Textarea, useMantineColorScheme } from '@mantine/core';
import { BsEmojiSmile } from 'react-icons/bs';
import { getHotkeyHandler } from '@mantine/hooks';
import { cn } from '@/lib/utils';
import { useSocket } from '@/components/context/SocketProvider';
import { useSession } from 'next-auth/react';
import Picker from '@emoji-mart/react';
import { SendMessage } from '@/lib/types';

type ChatInputProps = {
  roomId: string;
  emojis: any;
} & React.ComponentPropsWithoutRef<'textarea'>;

export default function ChatInput({
  roomId,
  emojis,
  ...props
}: ChatInputProps) {
  const { socket } = useSocket();
  const { data: session } = useSession();
  const [value, setValue] = useState('');
  const handleEmojiPick = (emoji: string) => {
    setValue(value + emoji);
  };

  const sendMessage = () => {
    if (value.trim() === '') return;
    const date = new Date();
    const msg: SendMessage = {
      content: value,
      author: {
        username: session?.user?.username as string,
        name: session?.user.name as string,
        picture: session?.user?.image || null,
      },
      date: date,
    };
    if (!socket) console.log('No socket found', socket);
    if (socket) socket.emit('message', { room: roomId, msg });
    setValue('');
  };

  return (
    <div className={cn('relative', props.className)}>
      <Textarea
        rightSection={
          <EmojiPickerPopover
            handleEmojiPick={handleEmojiPick}
            emojis={emojis}
          />
        }
        placeholder="Type something"
        rightSectionPointerEvents="all"
        autosize
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={getHotkeyHandler([['Enter', sendMessage]])}
      />
    </div>
  );
}

type EmojiPickerPopoverProps = {
  handleEmojiPick: (emoji: string) => void;
  emojis: any;
};

const EmojiPickerPopover = ({
  handleEmojiPick,
  emojis,
}: EmojiPickerPopoverProps) => {
  const [opened, setOpened] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      offset={{ crossAxis: -160, mainAxis: 10 }}
      position="top"
    >
      <Popover.Target>
        <button
          className="hover:cursor-pointer w-fit h-fit justify-center align-middle hidden sm:flex"
          onClick={() => setOpened((o) => !o)}
        >
          <BsEmojiSmile />
        </button>
      </Popover.Target>
      <Popover.Dropdown className="p-0 bg-transparent border-0 shadow-none">
        <Picker
          data={emojis}
          theme={colorScheme}
          onEmojiSelect={(e: any) => {
            console.log(e);
            handleEmojiPick(e.native);
            setOpened(false);
          }}
        />
      </Popover.Dropdown>
    </Popover>
  );
};
