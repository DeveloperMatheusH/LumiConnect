
import React, { useState } from 'react';
import { ActivityType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string, activityType: ActivityType) => void;
  onMediaUploadClick: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage,
  onMediaUploadClick
}) => {
  const [messageInput, setMessageInput] = useState('');
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType>('general');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    onSendMessage(messageInput, selectedActivityType);
    setMessageInput('');
  };
  
  return (
    <div className="p-3 border-t border-border">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-muted-foreground flex items-center">
            <span className="mr-2">Tipo de atividade:</span>
            <Select 
              value={selectedActivityType}
              onValueChange={(value) => setSelectedActivityType(value as ActivityType)}
            >
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue placeholder="Tipo de atividade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Geral</SelectItem>
                <SelectItem value="therapy">Terapia</SelectItem>
                <SelectItem value="school">Escola</SelectItem>
                <SelectItem value="leisure">Lazer</SelectItem>
                <SelectItem value="meal">Refeição</SelectItem>
                <SelectItem value="progress">Progresso</SelectItem>
                <SelectItem value="challenge">Desafio</SelectItem>
                <SelectItem value="important">Importante</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onMediaUploadClick}
                  className="h-9 w-9 rounded-full"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Adicionar mídia</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex-1 mx-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="bg-secondary/50 border-border/50"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={!messageInput.trim()}
            className="h-9 w-9 rounded-full p-0"
          >
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
