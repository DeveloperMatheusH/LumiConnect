
import React from 'react';
import { Contact } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2, MessageSquare } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onSelect, onDelete }) => {
  return (
    <Card className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border/40">
            <AvatarFallback className="bg-primary/10 text-primary-foreground">
              {contact.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{contact.name}</h3>
            <p className="text-xs text-muted-foreground">
              {contact.age} anos • {contact.intellectualDisability}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="mb-3">
          <p className="text-sm"><span className="text-muted-foreground">CID:</span> {contact.cid}</p>
          <p className="text-sm">
            <span className="text-muted-foreground">Nível de auxílio:</span>{' '}
            {contact.assistanceLevel === 'low' && 'Baixo'}
            {contact.assistanceLevel === 'medium' && 'Médio'}
            {contact.assistanceLevel === 'high' && 'Alto'}
          </p>
        </div>
        
        <div className="flex justify-between gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onSelect(contact.id)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Conversar
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(contact.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
