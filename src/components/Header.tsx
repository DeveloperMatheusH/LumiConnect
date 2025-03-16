
import React from 'react';
import { useContacts } from '@/context/ContactsContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  openAddContactForm: () => void;
}

const Header: React.FC<HeaderProps> = ({ openAddContactForm }) => {
  const { selectedContactId, selectContact, getContactById } = useContacts();
  const isMobile = useIsMobile();
  
  const selectedContact = selectedContactId 
    ? getContactById(selectedContactId) 
    : null;
    
  return (
    <header className="h-16 border-b border-border backdrop-blur-sm bg-background/90 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-3 min-w-0 flex-1 max-w-[60%]">
        {isMobile && selectedContactId && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => selectContact(null)}
            className="mr-2 flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl font-medium truncate">
          {selectedContact ? selectedContact.name : "Pessoas"}
        </h1>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={openAddContactForm}
        className={`flex items-center gap-1 transition-all duration-300 hover:bg-primary/10 ${isMobile ? 'px-2' : ''}`}
      >
        <PlusCircle className="h-4 w-4 mr-1" />
        {isMobile ? "Adicionar" : "Adicionar Nova Pessoa"}
      </Button>
    </header>
  );
};

export default Header;
