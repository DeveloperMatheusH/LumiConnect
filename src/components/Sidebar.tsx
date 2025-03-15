import React, { useMemo } from 'react';
import { useContacts } from '@/context/ContactsContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar: React.FC = () => {
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
  
  // If mobile and there's a selected contact, hide the sidebar
  if (isMobile && selectedContactId) return null;
  
  return (
    <div className="w-full md:w-80 border-r border-border flex flex-col h-full animate-fade-in">
      <div className="p-3 sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar contatos..."
            className="pl-9 bg-secondary/50 border-border/70 focus-visible:ring-1 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin">
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
                onClick={() => selectContact(contact.id)}
              >
                <Avatar className="h-10 w-10 border border-border/40">
                  <AvatarFallback className="bg-primary/10 text-primary-foreground">
                    {contact.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start gap-0.5 overflow-hidden">
                  <span className="font-medium text-sm">{contact.name}</span>
                  <span className="text-xs text-muted-foreground truncate w-full">
                    {contact.intellectualDisability} • CID: {contact.cid}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
