
import React, { useMemo } from 'react';
import { useContacts } from '@/context/ContactsContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarProvider,
  useSidebar
} from '@/components/ui/sidebar';

const SidebarContents = () => {
  const { contacts, selectContact, selectedContactId } = useContacts();
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  
  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      // Sort by last message time if available
      if (a.lastMessageTime && b.lastMessageTime) {
        return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
      }
      // Otherwise sort by name
      return a.name.localeCompare(b.name);
    });
  }, [contacts]);
  
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return sortedContacts;
    
    const query = searchQuery.toLowerCase();
    return sortedContacts.filter(
      contact => 
        contact.name.toLowerCase().includes(query) ||
        contact.intellectualDisability.toLowerCase().includes(query) ||
        contact.cid.toLowerCase().includes(query)
    );
  }, [sortedContacts, searchQuery]);
  
  return (
    <>
      <SidebarHeader>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar contatos..."
            className="pl-9 bg-secondary/50 border-border/70 focus-visible:ring-1 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-0">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm p-4">
            <p>Nenhum contato encontrado</p>
          </div>
        ) : (
          <div className="space-y-px">
            {filteredContacts.map((contact) => (
              <Button
                key={contact.id}
                variant="ghost"
                className={`w-full justify-start p-3 h-auto gap-3 rounded-none hover-glass ${
                  selectedContactId === contact.id ? 'bg-accent/70 hover:bg-accent/70' : ''
                }`}
                onClick={() => {
                  selectContact(contact.id);
                  if (isMobile) {
                    // Close sidebar on mobile after selecting a contact
                    const { setOpen } = useSidebar();
                    setOpen(false);
                  }
                }}
              >
                <Avatar className="h-10 w-10 border border-border/40 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary-foreground">
                    {contact.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start gap-0.5 min-w-0 flex-1">
                  <span className="font-medium text-sm truncate w-full">{contact.name}</span>
                  <span className="text-xs text-muted-foreground truncate w-full">
                    {contact.intellectualDisability} • CID: {contact.cid}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        )}
      </SidebarContent>
    </>
  );
};

const Sidebar = () => {
  const { selectedContactId } = useContacts();
  const isMobile = useIsMobile();
  
  // If mobile and there's a selected contact, hide the sidebar
  if (isMobile && selectedContactId) return null;
  
  return (
    <SidebarComponent 
      className="border-r border-border"
      // On mobile, we want the sidebar to be collapsed by default
      variant="sidebar"
      collapsible={isMobile ? "offcanvas" : "none"}
    >
      <SidebarContents />
    </SidebarComponent>
  );
};

export default Sidebar;
