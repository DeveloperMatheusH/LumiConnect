
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Contact, Conversation, Message } from '@/types';
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
  addMessage: (contactId: string, content: string, isUser: boolean) => void;
  getContactById: (id: string) => Contact | undefined;
  getConversationByContactId: (contactId: string) => Conversation | undefined;
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
    
    setContacts((prev) => [...prev, newContact]);
    
    // Initialize empty conversation for new contact
    setConversations((prev) => [
      ...prev, 
      { contactId: newContact.id, messages: [] }
    ]);
    
    toast({
      title: "Contato adicionado",
      description: `${contact.name} foi adicionado à sua lista de contatos.`
    });
  };

  const updateContact = (id: string, updatedFields: Partial<Contact>) => {
    setContacts((prev) => 
      prev.map((contact) => 
        contact.id === id ? { ...contact, ...updatedFields } : contact
      )
    );
    
    toast({
      title: "Contato atualizado",
      description: "As informações do contato foram atualizadas."
    });
  };

  const deleteContact = (id: string) => {
    const contactToDelete = contacts.find(c => c.id === id);
    if (!contactToDelete) return;
    
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
    setConversations((prev) => prev.filter((convo) => convo.contactId !== id));
    
    if (selectedContactId === id) {
      setSelectedContactId(null);
    }
    
    toast({
      title: "Contato removido",
      description: `${contactToDelete.name} foi removido da sua lista de contatos.`,
      variant: "destructive"
    });
  };

  const selectContact = (id: string | null) => {
    setSelectedContactId(id);
  };

  const addMessage = (contactId: string, content: string, isUser: boolean) => {
    const newMessage: Message = {
      id: uuidv4(),
      contactId,
      content,
      timestamp: new Date(),
      isUser
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
        getConversationByContactId
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
