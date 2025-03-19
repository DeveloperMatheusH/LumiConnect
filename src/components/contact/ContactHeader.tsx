
import React from 'react';
import { Contact } from '@/types';
import { Button } from '@/components/ui/button';
import AvatarUpload from '../AvatarUpload';
import { FolderOpen, Info, Edit, Trash2 } from 'lucide-react';

interface ContactHeaderProps {
  contact: Contact;
  onInfoClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onGalleryClick: () => void;
  onAvatarChange: (avatarData: string) => void;
}

const ContactHeader: React.FC<ContactHeaderProps> = ({
  contact,
  onInfoClick,
  onEditClick,
  onDeleteClick,
  onGalleryClick,
  onAvatarChange
}) => {
  return (
    <div className="px-4 py-3 border-b border-border flex justify-between items-center">
      <div className="flex items-center gap-3">
        <AvatarUpload
          name={contact.name}
          avatarUrl={contact.avatar}
          onAvatarChange={onAvatarChange}
          size="sm"
        />
        <div>
          <h2 className="font-medium text-sm">{contact.name}</h2>
          <p className="text-xs text-muted-foreground">{contact.age} anos • {contact.intellectualDisability}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onGalleryClick}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Galeria de mídia"
        >
          <FolderOpen className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onInfoClick}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Informações do aluno"
        >
          <Info className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onEditClick}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Editar informações"
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onDeleteClick}
          className="h-8 w-8 text-destructive/80 hover:text-destructive"
          title="Excluir aluno"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ContactHeader;
