import { cn } from '@/lib/utils';
import { Avatar } from '@mantine/core';
import React from 'react';

interface ChatBubbleProps extends React.ComponentPropsWithRef<'div'> {
  message: {
    date: Date;
    content: string;
    author: {
      name: string | null;
      username: string | null;
    };
  };
}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, message, ...props }, ref) => {
    return (
      <div
        className={cn('flex items-start gap-2.5', className)}
        {...props}
        ref={ref}
      >
        <Avatar src="https://github.com/shadcn.png" />
        <div className="flex flex-col w-full max-w-[320px] leading-1.5">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {message.author.name}
            </span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {message.date.toString()}
            </span>
          </div>
          <p className="text-sm font-normal py-2 text-gray-900 dark:text-white">
            {message.content}
          </p>
        </div>
      </div>
    );
  }
);

ChatBubble.displayName = 'ChatBubble';

export default ChatBubble;
