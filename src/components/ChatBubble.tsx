import { Message } from '@/lib/dummy-messages';
import { cn } from '@/lib/utils';
import { Avatar } from '@mantine/core';
import React from 'react';

interface ChatBubbleProps extends React.ComponentPropsWithRef<'div'> {
  message: Message;
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
              {message.author}
            </span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {message.date}
            </span>
          </div>
          <p className="text-sm font-normal py-2 text-gray-900 dark:text-white">
            {message.message}
          </p>
        </div>
      </div>
    );
  }
);

ChatBubble.displayName = 'ChatBubble';

export default ChatBubble;
