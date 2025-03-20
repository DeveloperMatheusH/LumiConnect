
import React, { useState } from 'react';
import { ActivityType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Paperclip } from 'lucide-react';
import ActivityIcon from '../ActivityIcon';

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
                <SelectValue placeholder="Tipo de atividade">
                  <div className="flex items-center">
                    <ActivityIcon type={selectedActivityType} className="mr-2" size={16} />
                    <span>
                      {selectedActivityType === 'general' ? 'Geral' : 
                       selectedActivityType === 'therapy' ? 'Terapia' :
                       selectedActivityType === 'school' ? 'Escola' :
                       selectedActivityType === 'leisure' ? 'Lazer' :
                       selectedActivityType === 'meal' ? 'Refeição' :
                       selectedActivityType === 'progress' ? 'Progresso' :
                       selectedActivityType === 'challenge' ? 'Desafio' :
                       'Importante'}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">
                  <div className="flex items-center">
                    <ActivityIcon type="general" className="mr-2" size={16} />
                    <span>Geral</span>
                  </div>
                </SelectItem>
                <SelectItem value="therapy">
                  <div className="flex items-center">
                    <ActivityIcon type="therapy" className="mr-2" size={16} />
                    <span>Terapia</span>
                  </div>
                </SelectItem>
                <SelectItem value="school">
                  <div className="flex items-center">
                    <ActivityIcon type="school" className="mr-2" size={16} />
                    <span>Escola</span>
                  </div>
                </SelectItem>
                <SelectItem value="leisure">
                  <div className="flex items-center">
                    <ActivityIcon type="leisure" className="mr-2" size={16} />
                    <span>Lazer</span>
                  </div>
                </SelectItem>
                <SelectItem value="meal">
                  <div className="flex items-center">
                    <ActivityIcon type="meal" className="mr-2" size={16} />
                    <span>Refeição</span>
                  </div>
                </SelectItem>
                <SelectItem value="progress">
                  <div className="flex items-center">
                    <ActivityIcon type="progress" className="mr-2" size={16} />
                    <span>Progresso</span>
                  </div>
                </SelectItem>
                <SelectItem value="challenge">
                  <div className="flex items-center">
                    <ActivityIcon type="challenge" className="mr-2" size={16} />
                    <span>Desafio</span>
                  </div>
                </SelectItem>
                <SelectItem value="important">
                  <div className="flex items-center">
                    <ActivityIcon type="important" className="mr-2" size={16} />
                    <span>Importante</span>
                  </div>
                </SelectItem>
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
