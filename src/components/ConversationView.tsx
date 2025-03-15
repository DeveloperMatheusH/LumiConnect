
import React from 'react';
import { useContacts } from '@/context/ContactsContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Info } from 'lucide-react';
import { useState } from 'react';
import AddContactForm from './AddContactForm';
import AvatarUpload from './AvatarUpload';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';

const ConversationView: React.FC = () => {
  const { 
    selectedContactId, 
    getContactById, 
    getConversationByContactId,
    addMessage,
    deleteContact,
    updateAvatar
  } = useContacts();
  
  const [messageInput, setMessageInput] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const isMobile = useIsMobile();
  
  const selectedContact = selectedContactId 
    ? getContactById(selectedContactId) 
    : null;
    
  const conversation = selectedContactId
    ? getConversationByContactId(selectedContactId)
    : null;
    
  if (!selectedContact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-xl font-medium">Selecione um contato</h2>
          <p className="text-muted-foreground">
            Selecione um contato da lista para visualizar ou iniciar uma conversa.
          </p>
        </div>
      </div>
    );
  }
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedContactId) return;
    
    addMessage(selectedContactId, messageInput, true);
    setMessageInput('');
  };

  const handleAvatarChange = (avatarData: string) => {
    if (selectedContactId) {
      updateAvatar(selectedContactId, avatarData);
    }
  };
  
  return (
    <div className="flex-1 flex flex-col h-full animate-fade-in relative">
      {/* Contact Info */}
      {showContactInfo && (
        <div className="absolute inset-0 z-20 bg-background/95 p-4 flex flex-col animate-fade-in overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Informações do Contato</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowContactInfo(false)}
            >
              Fechar
            </Button>
          </div>
          
          <div className="flex flex-col items-center mb-6">
            <AvatarUpload 
              name={selectedContact.name}
              avatarUrl={selectedContact.avatar}
              onAvatarChange={handleAvatarChange}
              size="lg"
            />
            <h3 className="text-xl font-medium mt-3">{selectedContact.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedContact.age} anos</p>
          </div>
          
          <div className="space-y-4 glass-card p-4 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Deficiência Intelectual</h4>
              <p>{selectedContact.intellectualDisability}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Nível de Auxílio</h4>
              <p>
                {selectedContact.assistanceLevel === 'low' && 'Baixo'}
                {selectedContact.assistanceLevel === 'medium' && 'Médio'}
                {selectedContact.assistanceLevel === 'high' && 'Alto'}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">CID</h4>
              <p>{selectedContact.cid}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Estereotipias</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedContact.stereotypies.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma estereotipia cadastrada</p>
                ) : (
                  selectedContact.stereotypies.map((item, index) => (
                    <span key={index} className="text-sm bg-accent px-2 py-1 rounded-md">
                      {item}
                    </span>
                  ))
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Gostos</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedContact.likes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum gosto cadastrado</p>
                ) : (
                  selectedContact.likes.map((item, index) => (
                    <span key={index} className="text-sm bg-primary/10 text-primary-foreground px-2 py-1 rounded-md">
                      {item}
                    </span>
                  ))
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Desgostos</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedContact.dislikes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum desgosto cadastrado</p>
                ) : (
                  selectedContact.dislikes.map((item, index) => (
                    <span key={index} className="text-sm bg-destructive/10 text-destructive-foreground px-2 py-1 rounded-md">
                      {item}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Form */}
      {showEditForm && (
        <div className="absolute inset-0 z-10 bg-background/95 p-4 animate-fade-in">
          <AddContactForm 
            existingContact={selectedContact}
            onCancel={() => setShowEditForm(false)}
          />
        </div>
      )}
      
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-border flex justify-between items-center">
        <div className="flex items-center gap-3">
          <AvatarUpload
            name={selectedContact.name}
            avatarUrl={selectedContact.avatar}
            onAvatarChange={handleAvatarChange}
            size="sm"
          />
          <div>
            <h2 className="font-medium text-sm">{selectedContact.name}</h2>
            <p className="text-xs text-muted-foreground">{selectedContact.age} anos • {selectedContact.intellectualDisability}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowContactInfo(true)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Info className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEditForm(true)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDeleteAlertOpen(true)}
            className="h-8 w-8 text-destructive/80 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {!conversation || conversation.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
            <p className="max-w-xs">
              Nenhuma mensagem ainda. Envie uma mensagem para começar uma conversa.
            </p>
          </div>
        ) : (
          conversation.messages.map((message) => {
            const messageDate = new Date(message.timestamp);
            const formattedTime = format(messageDate, 'HH:mm');
            
            return (
              <div 
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-secondary rounded-tl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 text-right mt-1">{formattedTime}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Message Input */}
      <div className="p-3 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="bg-secondary/50 border-border/50"
          />
          <Button type="submit" disabled={!messageInput.trim()}>
            Enviar
          </Button>
        </form>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className={isMobile ? "w-[90%] max-w-md" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir contato?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o contato {selectedContact.name} e todas as mensagens associadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (selectedContactId) {
                  deleteContact(selectedContactId);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConversationView;
