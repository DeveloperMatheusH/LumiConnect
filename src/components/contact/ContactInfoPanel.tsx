
import React, { useState } from 'react';
import { Contact, Medication } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AvatarUpload from '../AvatarUpload';
import { Edit } from 'lucide-react';

interface ContactInfoPanelProps {
  contact: Contact;
  onEditClick: () => void;
  onClose: () => void;
  onAvatarChange: (avatarData: string) => void;
}

const ContactInfoPanel: React.FC<ContactInfoPanelProps> = ({
  contact,
  onEditClick,
  onClose,
  onAvatarChange
}) => {
  const [activeTabInfo, setActiveTabInfo] = useState('general');

  return (
    <div className="absolute inset-0 z-20 bg-background/95 p-4 flex flex-col animate-fade-in overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Informações do Aluno</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
        >
          Fechar
        </Button>
      </div>
      
      <div className="flex flex-col items-center mb-6">
        <AvatarUpload 
          name={contact.name}
          avatarUrl={contact.avatar}
          onAvatarChange={onAvatarChange}
          size="lg"
        />
        <h3 className="text-xl font-medium mt-3">{contact.name}</h3>
        <p className="text-sm text-muted-foreground">{contact.age} anos</p>
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
            <p>{contact.intellectualDisability}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Nível de Auxílio</h4>
            <p>
              {contact.assistanceLevel === 'leve' && 'Leve'}
              {contact.assistanceLevel === 'moderado' && 'Moderado'}
              {contact.assistanceLevel === 'severo' && 'Severo'}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">CID</h4>
            <p>{contact.cid}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Estereotipias</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {contact.stereotypies.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma estereotipia cadastrada</p>
              ) : (
                contact.stereotypies.map((item, index) => (
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
              {contact.likes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum gosto cadastrado</p>
              ) : (
                contact.likes.map((item, index) => (
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
              {contact.dislikes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum desgosto cadastrado</p>
              ) : (
                contact.dislikes.map((item, index) => (
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
            {contact.communication?.verbalCommunication ? (
              <p>{contact.communication.verbalCommunication}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma informação cadastrada</p>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Comunicação Não-Verbal</h4>
            {contact.communication?.nonVerbalCommunication ? (
              <p>{contact.communication.nonVerbalCommunication}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma informação cadastrada</p>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Uso de Símbolos</h4>
            {contact.communication?.symbolsUse ? (
              <p>{contact.communication.symbolsUse}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma informação cadastrada</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="mobility" className="space-y-4 glass-card p-4 rounded-lg mt-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Capacidade de Locomoção</h4>
            {contact.mobility?.locomotionCapacity ? (
              <p>
                {contact.mobility.locomotionCapacity === 'independente' && 'Independente'}
                {contact.mobility.locomotionCapacity === 'com_auxilio' && 'Com auxílio'}
                {contact.mobility.locomotionCapacity === 'cadeira_de_rodas' && 'Cadeira de rodas'}
                {contact.mobility.locomotionCapacity === 'outro' && 'Outro'}
                {!['independente', 'com_auxilio', 'cadeira_de_rodas', 'outro'].includes(contact.mobility.locomotionCapacity) && 
                  contact.mobility.locomotionCapacity}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma informação cadastrada</p>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Dificuldades Motoras Específicas</h4>
            {contact.mobility?.specificMotorDifficulties ? (
              <p>{contact.mobility.specificMotorDifficulties}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma informação cadastrada</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="others" className="space-y-4 glass-card p-4 rounded-lg mt-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Outras Necessidades Específicas</h4>
            {contact.specificNeeds ? (
              <p>{contact.specificNeeds}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma informação cadastrada</p>
            )}
          </div>
          
          {contact.medications && contact.medications.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Medicamentos</h4>
              <div className="space-y-2 mt-1">
                {contact.medications.map((medication) => (
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
          onClick={onEditClick}
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar Informações
        </Button>
      </div>
    </div>
  );
};

export default ContactInfoPanel;
