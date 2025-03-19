
import React, { useState } from 'react';
import { useContacts } from '@/context/ContactsContext';
import AddContactForm from './AddContactForm';
import ContactHeader from './contact/ContactHeader';
import ContactInfoPanel from './contact/ContactInfoPanel';
import MessagesFeed from './chat/MessagesFeed';
import MessageInput from './chat/MessageInput';
import DeleteContactDialog from './contact/DeleteContactDialog';
import MediaUpload from './MediaUpload';
import MediaGallery from './MediaGallery';
import { ActivityType } from '@/types';

const ConversationView: React.FC = () => {
  const { 
    selectedContactId, 
    getContactById, 
    getConversationByContactId,
    addMessage,
    deleteContact,
    updateAvatar
  } = useContacts();
  
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState<boolean | ActivityType>(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  
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
          <h2 className="text-xl font-medium">Selecione uma anotação do aluno(a)</h2>
          <p className="text-muted-foreground">
            Selecione na lista para visualizar ou iniciar uma anotação na conversa.
          </p>
        </div>
      </div>
    );
  }
  
  const handleSendMessage = (messageContent: string, activityType: ActivityType) => {
    if (!messageContent.trim() || !selectedContactId) return;
    addMessage(selectedContactId, messageContent, true, undefined, activityType);
  };

  const handleAvatarChange = (avatarData: string) => {
    if (selectedContactId) {
      updateAvatar(selectedContactId, avatarData);
    }
  };
  
  const handleConfirmDelete = () => {
    if (selectedContactId) {
      deleteContact(selectedContactId);
    }
  };
  
  return (
    <div className="flex-1 flex flex-col h-full animate-fade-in relative">
      {showMediaUpload && selectedContactId && (
        <MediaUpload 
          contactId={selectedContactId} 
          onClose={() => setShowMediaUpload(false)} 
          activityType={typeof showMediaUpload === 'string' ? showMediaUpload as ActivityType : 'general'}
        />
      )}
      
      {showMediaGallery && selectedContactId && (
        <MediaGallery
          contactId={selectedContactId}
          onClose={() => setShowMediaGallery(false)}
        />
      )}
      
      {showContactInfo && (
        <ContactInfoPanel
          contact={selectedContact}
          onEditClick={() => {
            setShowContactInfo(false);
            setShowEditForm(true);
          }}
          onClose={() => setShowContactInfo(false)}
          onAvatarChange={handleAvatarChange}
        />
      )}
      
      {showEditForm && (
        <div className="absolute inset-0 z-10 bg-background/95 p-4 animate-fade-in">
          <AddContactForm 
            existingContact={selectedContact}
            onCancel={() => setShowEditForm(false)}
          />
        </div>
      )}
      
      <ContactHeader 
        contact={selectedContact}
        onInfoClick={() => setShowContactInfo(true)}
        onEditClick={() => setShowEditForm(true)}
        onDeleteClick={() => setIsDeleteAlertOpen(true)}
        onGalleryClick={() => setShowMediaGallery(true)}
        onAvatarChange={handleAvatarChange}
      />
      
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        <MessagesFeed conversation={conversation} />
      </div>
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        onMediaUploadClick={() => setShowMediaUpload(true)}
      />
      
      <DeleteContactDialog
        contact={selectedContact}
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default ConversationView;
