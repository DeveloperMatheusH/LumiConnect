
import React, { useRef, useEffect } from 'react';
import { Conversation } from '@/types';
import TimelineMessage from '../TimelineMessage';
import { PenLine } from 'lucide-react';

interface MessagesFeedProps {
  conversation: Conversation | null;
}

const MessagesFeed: React.FC<MessagesFeedProps> = ({ conversation }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages.length]);

  if (!conversation || conversation.messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
        <p className="max-w-xs">
          Nenhuma mensagem ainda. Envie uma mensagem para começar uma conversa.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
          <PenLine size={12} className="mr-1" />
          <span>Linha do tempo visual</span>
        </div>
      </div>
      
      {conversation.messages.map((message) => (
        <TimelineMessage key={message.id} message={message} />
      ))}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesFeed;
