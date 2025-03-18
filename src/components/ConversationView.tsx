
import React, { useState, useRef, useEffect } from 'react';
import { useContacts } from '@/context/ContactsContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Info, Image, Paperclip, FolderOpen } from 'lucide-react';
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
import MediaMessage from './MediaMessage';
import MediaUpload from './MediaUpload';
import MediaGallery from './MediaGallery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [activeTabInfo, setActiveTabInfo] = useState('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isMobile = useIsMobile();
  
  const selectedContact = selectedContactId 
    ? getContactById(selectedContactId) 
    : null;
    
  const conversation = selectedContactId
    ? getConversationByContactId(selectedContactId)
    : null;
  
  // Rolar para o final das mensagens quando uma nova mensagem for adicionada
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages.length]);
  
  if (!selectedContact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-xl font-medium">Selecione uma anotação do aluno(a)</h2>
          <p className="text-muted-foreground">
            Selecione na lista para visualizar ou iniciar uma anotação na conversa.
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
  
  const renderMessageContent = (message: any) => {
    // Verificar se a mensagem tem anexos de mídia
    if (message.mediaAttachments && message.mediaAttachments.length > 0) {
      return (
        <div className="space-y-2">
          {message.content && (
            <p className="text-sm mb-2">{message.content}</p>
          )}
          {message.mediaAttachments.map((media: any) => (
            <MediaMessage 
              key={media.id} 
              media={media} 
              isUser={message.isUser} 
            />
          ))}
        </div>
      );
    }
    
    // Mensagem de texto normal
    return <p className="text-sm">{message.content}</p>;
  };
  
  return (
    <div className="flex-1 flex flex-col h-full animate-fade-in relative">
      {/* Componentes de sobreposição */}
      {showMediaUpload && selectedContactId && (
        <MediaUpload 
          contactId={selectedContactId} 
          onClose={() => setShowMediaUpload(false)} 
        />
      )}
      
      {showMediaGallery && selectedContactId && (
        <MediaGallery
          contactId={selectedContactId}
          onClose={() => setShowMediaGallery(false)}
        />
      )}
      
      {/* Contact Info */}
      {showContactInfo && (
        <div className="absolute inset-0 z-20 bg-background/95 p-4 flex flex-col animate-fade-in overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Informações do Aluno</h2>
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
          
          <Tabs defaultValue="general" value={activeTabInfo} onValueChange={setActiveTabInfo}>
            <TabsList className="w-full">
              <TabsTrigger value="general" className="flex-1">Geral</TabsTrigger>
              <TabsTrigger value="communication" className="flex-1">Comunicação</TabsTrigger>
              <TabsTrigger value="mobility" className="flex-1">Mobilidade</TabsTrigger>
              <TabsTrigger value="others" className="flex-1">Outros</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4 glass-card p-4 rounded-lg mt-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Deficiência Intelectual</h4>
                <p>{selectedContact.intellectualDisability}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Nível de Auxílio</h4>
                <p>
                  {selectedContact.assistanceLevel === 'leve' && 'Leve'}
                  {selectedContact.assistanceLevel === 'moderado' && 'Moderado'}
                  {selectedContact.assistanceLevel === 'severo' && 'Severo'}
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
            </TabsContent>
            
            <TabsContent value="communication" className="space-y-4 glass-card p-4 rounded-lg mt-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Comunicação Verbal</h4>
                {selectedContact.communication?.verbalCommunication ? (
                  <p>{selectedContact.communication.verbalCommunication}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma informação cadastrada</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Comunicação Não-Verbal</h4>
                {selectedContact.communication?.nonVerbalCommunication ? (
                  <p>{selectedContact.communication.nonVerbalCommunication}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma informação cadastrada</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Uso de Símbolos</h4>
                {selectedContact.communication?.symbolsUse ? (
                  <p>{selectedContact.communication.symbolsUse}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma informação cadastrada</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="mobility" className="space-y-4 glass-card p-4 rounded-lg mt-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Capacidade de Locomoção</h4>
                {selectedContact.mobility?.locomotionCapacity ? (
                  <p>
                    {selectedContact.mobility.locomotionCapacity === 'independente' && 'Independente'}
                    {selectedContact.mobility.locomotionCapacity === 'com_auxilio' && 'Com auxílio'}
                    {selectedContact.mobility.locomotionCapacity === 'cadeira_de_rodas' && 'Cadeira de rodas'}
                    {selectedContact.mobility.locomotionCapacity === 'outro' && 'Outro'}
                    {!['independente', 'com_auxilio', 'cadeira_de_rodas', 'outro'].includes(selectedContact.mobility.locomotionCapacity) && 
                      selectedContact.mobility.locomotionCapacity}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma informação cadastrada</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Dificuldades Motoras Específicas</h4>
                {selectedContact.mobility?.specificMotorDifficulties ? (
                  <p>{selectedContact.mobility.specificMotorDifficulties}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma informação cadastrada</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="others" className="space-y-4 glass-card p-4 rounded-lg mt-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Outras Necessidades Específicas</h4>
                {selectedContact.specificNeeds ? (
                  <p>{selectedContact.specificNeeds}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma informação cadastrada</p>
                )}
              </div>
              
              {selectedContact.medications && selectedContact.medications.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Medicamentos</h4>
                  <div className="space-y-2 mt-1">
                    {selectedContact.medications.map((medication) => (
                      <div key={medication.id} className="border rounded-md p-3 bg-accent/10">
                        <h5 className="font-medium">{medication.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          Dosagem: {medication.dosage} | Frequência: {medication.frequency}
                        </p>
                        {medication.effects.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium mb-1">Efeitos:</p>
                            <div className="flex flex-wrap gap-1">
                              {medication.effects.map((effect, i) => (
                                <span 
                                  key={i} 
                                  className="text-xs bg-accent/30 px-2 py-0.5 rounded-full"
                                >
                                  {effect}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowContactInfo(false);
                setShowEditForm(true);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Informações
            </Button>
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
            onClick={() => setShowMediaGallery(true)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Galeria de mídia"
          >
            <FolderOpen className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowContactInfo(true)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Informações do aluno"
          >
            <Info className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEditForm(true)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Editar informações"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDeleteAlertOpen(true)}
            className="h-8 w-8 text-destructive/80 hover:text-destructive"
            title="Excluir aluno"
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
                  {renderMessageContent(message)}
                  <p className="text-xs opacity-70 text-right mt-1">{formattedTime}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <div className="p-3 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowMediaUpload(true)}
              className="h-9 w-9 rounded-full"
              title="Adicionar mídia"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            
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
