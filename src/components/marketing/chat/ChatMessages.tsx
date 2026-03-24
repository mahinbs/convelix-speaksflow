
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Message } from './types';

interface ChatMessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, messagesEndRef }) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.isBot ? "justify-start" : "justify-end"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] p-3 rounded-lg text-sm",
                message.isBot
                  ? "bg-muted/90 text-foreground"
                  : "bg-gradient-to-r from-brand-500 to-brand-700 text-primary-foreground"
              )}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
