import React, { ElementType } from 'react';

interface ChatBubbleProps<T extends ElementType> {
  props: React.ComponentPropsWithRef<T>;
}

export default function ChatBubble({ props }: ChatBubbleProps<'div'>) {
  return <div {...props}>ChatBubble</div>;
}
