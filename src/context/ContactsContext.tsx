import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Contact, Conversation, Message, Medication, MediaAttachment, ActivityType } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface ContactsContextType {
  contacts: Contact[];
  conversations: Conversation[];
  selectedContactId: string | null;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  selectContact: (id: string | null) => void;
  addMessage: (contactId: string, content: string, isUser: boolean, mediaAttachments?: MediaAttachment[], activityType?: ActivityType) => void;
  getContactById: (id: string) => Contact | undefined;
  getConversationByContactId: (contactId: string) => Conversation | undefined;
  updateAvatar: (contactId: string, avatarData: string) => void;
  addMediaAttachment: (contactId: string, type: "image" | "video" | "audio", url: string, name: string, activityType?: ActivityType) => void;
  getMediaAttachments: (contactId: string) => MediaAttachment[];
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export function ContactsProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useLocalStorage<Contact[]>('contacts', []);
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('conversations', []);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newContact = { 
      ...contact, 
      id: uuidv4(),
      lastMessageTime: new Date() 
    };
    
    // Update contacts state with new contact
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    
    // Initialize empty conversation for new contact
    const updatedConversations = [
      ...conversations, 
      { contactId: newContact.id, messages: [] }
    ];
    setConversations(updatedConversations);

    // Add introduction message with simplified text
    const introMessage = "Todo o progresso do seu aluno em um só lugar! Aqui você encontrará um panorama completo de atividades que ele realizou, seus interesses e o que ele aprendeu hoje. Acompanhe a evolução e celebre cada aprendizado!";
    
    // Add message directly to the updated conversations array
    const newMessage: Message = {
      id: uuidv4(),
      contactId: newContact.id,
      content: introMessage,
      timestamp: new Date(),
      isUser: false,
      activityType: 'important'
    };
    
    // Find the conversation we just added and update it with the intro message
    const convoIndex = updatedConversations.findIndex(
      (convo) => convo.contactId === newContact.id
    );
    
    if (convoIndex >= 0) {
      const finalConversations = [...updatedConversations];
      finalConversations[convoIndex] = {
        ...finalConversations[convoIndex],
        messages: [...finalConversations[convoIndex].messages, newMessage]
      };
      
      setConversations(finalConversations);
    }
    
    // Select the newly created contact
    setSelectedContactId(newContact.id);
    
    const toastId = toast({
      title: "Contato adicionado",
      description: `${contact.name} foi adicionado à sua lista de contatos.`
    });
    
    // Auto-dismiss the toast after 3 seconds
    setTimeout(() => {
      toast.dismiss(toastId);
    }, 3000);
  };

  const updateContact = (id: string, updatedFields: Partial<Contact>) => {
    setContacts((prev) => 
      prev.map((contact) => 
        contact.id === id ? { ...contact, ...updatedFields } : contact
      )
    );
    
    const toastId = toast({
      title: "Contato atualizado",
      description: "As informações do contato foram atualizadas."
    });
    
    // Auto-dismiss the toast after 3 seconds
    setTimeout(() => {
      toast.dismiss(toastId);
    }, 3000);
  };

  const updateAvatar = (contactId: string, avatarData: string) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === contactId
          ? { ...contact, avatar: avatarData }
          : contact
      )
    );

    const toastId = toast({
      title: "Foto atualizada",
      description: "A foto do perfil foi atualizada com sucesso."
    });
    
    // Auto-dismiss the toast after 3 seconds
    setTimeout(() => {
      toast.dismiss(toastId);
    }, 3000);
  };

  const deleteContact = (id: string) => {
    const contactToDelete = contacts.find(c => c.id === id);
    if (!contactToDelete) return;
    
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
    setConversations((prev) => prev.filter((convo) => convo.contactId !== id));
    
    if (selectedContactId === id) {
      setSelectedContactId(null);
    }
    
    const toastId = toast({
      title: "Contato removido",
      description: `${contactToDelete.name} foi removido da sua lista de contatos.`,
      variant: "destructive"
    });
    
    // Auto-dismiss the toast after 3 seconds
    setTimeout(() => {
      toast.dismiss(toastId);
    }, 3000);
  };

  const selectContact = (id: string | null) => {
    setSelectedContactId(id);
  };

  const addMessage = (
    contactId: string, 
    content: string, 
    isUser: boolean, 
    mediaAttachments?: MediaAttachment[],
    activityType: ActivityType = 'general'
  ) => {
    const newMessage: Message = {
      id: uuidv4(),
      contactId,
      content,
      timestamp: new Date(),
      isUser,
      mediaAttachments,
      activityType
    };

    setConversations((prev) => {
      const existingConvoIndex = prev.findIndex(
        (convo) => convo.contactId === contactId
      );

      if (existingConvoIndex >= 0) {
        const updatedConversations = [...prev];
        updatedConversations[existingConvoIndex] = {
          ...updatedConversations[existingConvoIndex],
          messages: [...updatedConversations[existingConvoIndex].messages, newMessage]
        };
        return updatedConversations;
      } else {
        return [...prev, { contactId, messages: [newMessage] }];
      }
    });

    // Update last message time for the contact
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === contactId
          ? { ...contact, lastMessageTime: new Date() }
          : contact
      )
    );
  };

  const addMediaAttachment = (
    contactId: string, 
    type: "image" | "video" | "audio", 
    url: string, 
    name: string,
    activityType: ActivityType = 'general'
  ) => {
    const newMediaAttachment: MediaAttachment = {
      id: uuidv4(),
      type,
      url,
      name,
      timestamp: new Date()
    };

    // Create a message with the media attachment
    addMessage(
      contactId,
      type === "image" ? "Imagem enviada" : 
      type === "video" ? "Vídeo enviado" : 
      "Áudio enviado",
      true,
      [newMediaAttachment],
      activityType
    );

    const toastId = toast({
      title: `${type === "image" ? "Imagem" : type === "video" ? "Vídeo" : "Áudio"} enviado`,
      description: "Mídia adicionada com sucesso!"
    });
    
    // Auto-dismiss the toast after 3 seconds
    setTimeout(() => {
      toast.dismiss(toastId);
    }, 3000);
  };

  const getMediaAttachments = (contactId: string): MediaAttachment[] => {
    const conversation = getConversationByContactId(contactId);
    if (!conversation) return [];

    // Extrair e aplanar todos os anexos de mídia de todas as mensagens
    return conversation.messages
      .filter(message => message.mediaAttachments && message.mediaAttachments.length > 0)
      .flatMap(message => message.mediaAttachments || []);
  };

  const getContactById = (id: string) => {
    return contacts.find((contact) => contact.id === id);
  };

  const getConversationByContactId = (contactId: string) => {
    return conversations.find((convo) => convo.contactId === contactId);
  };

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        conversations,
        selectedContactId,
        addContact,
        updateContact,
        deleteContact,
        selectContact,
        addMessage,
        getContactById,
        getConversationByContactId,
        updateAvatar,
        addMediaAttachment,
        getMediaAttachments
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
}
