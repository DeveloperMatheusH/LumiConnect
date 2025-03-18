
import React, { useState } from 'react';
import { ContactsProvider, useContacts } from '@/context/ContactsContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ConversationView from '@/components/ConversationView';
import AddContactForm from '@/components/AddContactForm';
import { SidebarProvider } from '@/components/ui/sidebar';

// Main application layout
const AppLayout = () => {
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const { selectedContactId } = useContacts();
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        <Header openAddContactForm={() => setShowAddContactForm(true)} />
        
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <ConversationView />
        </div>
        
        {showAddContactForm && (
          <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto animate-fade-in p-4">
            <AddContactForm
              onSuccess={() => setShowAddContactForm(false)}
              onCancel={() => setShowAddContactForm(false)}
            />
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

// Wrapper with context provider
const Index = () => {
  return (
    <ContactsProvider>
      <AppLayout />
    </ContactsProvider>
  );
};

export default Index;
