'use client';
import React, { useState } from 'react';
import { Textarea, useMantineColorScheme } from '@mantine/core';
import { BsEmojiSmile } from 'react-icons/bs';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { useClickOutside } from '@mantine/hooks';
import { cn } from '@/lib/utils';
import { socket } from '@/socket';
import { useSession } from 'next-auth/react';

type ChatInputProps = {
  roomId: number;
} & React.ComponentPropsWithoutRef<'textarea'>;

export default function ChatInput({ roomId, ...props }: ChatInputProps) {
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
    const date = new Date();
    const msg: { message: string; author: string; date: Date } = {
      message: value,
      author: session?.user?.name as string,
      date: date,
    };
    socket.emit('message', { room: roomId, msg });
    setValue('');
  };

  return (
    <div className={cn('relative', props.className)}>
      <Textarea
        rightSection={
          <div
            ref={setButton}
            className="w-fit h-fit flex justify-center align-middle"
          >
            <EmojiButton onClick={handleClick} />
          </div>
        }
        rightSectionPointerEvents="all"
        autosize
        minRows={1}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
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
      <button onClick={sendMessage}>send</button>
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
