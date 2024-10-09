import { initialMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import React from 'react';
import Avatar from '@/components/Avatar';
import { isToday, isYesterday } from 'date-fns';
import { toZonedTime, format as formatTz } from 'date-fns-tz';

interface ChatBubbleProps extends React.ComponentPropsWithRef<'div'> {
  message: initialMessage;
}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, message, ...props }, ref) => {
    const dateFormat = () => {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const date = toZonedTime(message.date, timeZone);
      if (isToday(date)) {
        return `Today at ${formatTz(date, 'hh:mm a', { timeZone })}`;
      } else if (isYesterday(date)) {
        return `Yesterday at ${formatTz(date, 'hh:mm a', { timeZone })}`;
      } else {
        return formatTz(date, 'MM/dd/yyyy hh:mm a', {
          timeZone,
        });
      }
    };
    return (
      <div
        className={cn('flex items-start gap-2.5', className)}
        {...props}
        ref={ref}
      >
        <Avatar
          src={message.author.picture}
          alt={message.author.name || 'profile pic'}
        >
          {message?.author?.name?.[0]}
        </Avatar>
        <div className="flex flex-col w-full max-w-[320px] leading-1.5">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="font-semibold text-dark-9 dark:text-dark-1">
              {message.author.username ?? message.author.name}
            </span>
            <span className="text-xs font-normal text-dark-4 dark:text-dark-3">
              {dateFormat()}
            </span>
          </div>
          <p
            className=" font-normal py-2 text-dark-9 dark:text-dark-1"
            style={{ whiteSpace: 'pre-line' }}
          >
            {message.content}
          </p>
        </div>
      </div>
    );
  }
);

ChatBubble.displayName = 'ChatBubble';

export default ChatBubble;
