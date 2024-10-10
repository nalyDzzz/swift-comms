'use client';
import React, { useState } from 'react';
import { Textarea, useMantineColorScheme } from '@mantine/core';
import { BsEmojiSmile } from 'react-icons/bs';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { getHotkeyHandler, useClickOutside } from '@mantine/hooks';
import { cn } from '@/lib/utils';
import { useSocket } from '@/components/context/SocketProvider';
import { useSession } from 'next-auth/react';
import { SendMessage } from '@/lib/types';

type ChatInputProps = {
  roomId: string;
} & React.ComponentPropsWithoutRef<'textarea'>;

export default function ChatInput({ roomId, ...props }: ChatInputProps) {
  const { socket } = useSocket();
  const { data: session } = useSession();
  const [button, setButton] = useState<HTMLDivElement | null>(null);
  const [picker, setPicker] = useState<HTMLDivElement | null>(null);
  const { colorScheme } = useMantineColorScheme();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const handleClick = () => {
    return open ? setOpen(false) : setOpen(true);
  };
  const handleEmojiPick = (emoji: string) => {
    setValue(value + emoji);
    setOpen(false);
  };

  useClickOutside(() => setOpen(false), null, [button, picker]);

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
          <div
            ref={setButton}
            className="w-fit h-fit justify-center align-middle hidden sm:flex"
          >
            <EmojiButton onClick={handleClick} />
          </div>
        }
        placeholder="Type something"
        rightSectionPointerEvents="all"
        autosize
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={getHotkeyHandler([['Enter', sendMessage]])}
      />
      <div
        ref={setPicker}
        className="w-fit h-fit z-10 absolute bottom-9 right-0"
      >
        <EmojiPicker
          className="bg-gray-800"
          open={open}
          theme={
            colorScheme === 'auto'
              ? Theme.AUTO
              : colorScheme === 'dark'
              ? Theme.DARK
              : Theme.LIGHT
          }
          emojiStyle={EmojiStyle.GOOGLE}
          onEmojiClick={(e) => handleEmojiPick(e.emoji)}
        />
      </div>
    </div>
  );
}

const EmojiButton: React.FC<React.ComponentPropsWithRef<'button'>> = (
  props
) => {
  return (
    <>
      <button className="hover:cursor-pointer" {...props}>
        <BsEmojiSmile />
      </button>
    </>
  );
};
