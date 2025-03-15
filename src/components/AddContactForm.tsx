
import React, { useState } from 'react';
import { useContacts } from '@/context/ContactsContext';
import { Contact } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AvatarUpload from './AvatarUpload';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { X, Plus } from 'lucide-react';

interface AddContactFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  existingContact?: Contact;
}

const AddContactForm: React.FC<AddContactFormProps> = ({ 
  onSuccess, 
  onCancel,
  existingContact 
}) => {
  const { addContact, updateContact } = useContacts();
  const isMobile = useIsMobile();
  
  const [name, setName] = useState(existingContact?.name || '');
  const [age, setAge] = useState(existingContact?.age.toString() || '');
  const [intellectualDisability, setIntellectualDisability] = useState(existingContact?.intellectualDisability || '');
  const [assistanceLevel, setAssistanceLevel] = useState<'low' | 'medium' | 'high'>(
    existingContact?.assistanceLevel || 'medium'
  );
  const [cid, setCid] = useState(existingContact?.cid || '');
  const [avatar, setAvatar] = useState(existingContact?.avatar || '');
  
  const [newStereotypy, setNewStereotypy] = useState('');
  const [stereotypies, setStereotypies] = useState(existingContact?.stereotypies || []);
  
  const [newLike, setNewLike] = useState('');
  const [likes, setLikes] = useState(existingContact?.likes || []);
  
  const [newDislike, setNewDislike] = useState('');
  const [dislikes, setDislikes] = useState(existingContact?.dislikes || []);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'O nome é obrigatório';
    if (!age.trim()) newErrors.age = 'A idade é obrigatória';
    else if (isNaN(Number(age)) || Number(age) <= 0) newErrors.age = 'Idade inválida';
    if (!intellectualDisability.trim()) newErrors.intellectualDisability = 'A deficiência intelectual é obrigatória';
    if (!cid.trim()) newErrors.cid = 'O CID é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const contactData = {
      name,
      age: Number(age),
      intellectualDisability,
      assistanceLevel: assistanceLevel as 'low' | 'medium' | 'high',
      cid,
      stereotypies,
      likes,
      dislikes,
      avatar
    };
    
    if (existingContact) {
      updateContact(existingContact.id, contactData);
    } else {
      addContact(contactData);
    }
    
    if (onSuccess) onSuccess();
  };
  
  const addItem = (
    item: string, 
    setter: React.Dispatch<React.SetStateAction<string>>,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (!item.trim()) return;
    setItems([...items, item.trim()]);
    setter('');
  };
  
  const removeItem = (
    index: number,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const handleAssistanceLevelChange = (value: string) => {
    if (value === 'low' || value === 'medium' || value === 'high') {
      setAssistanceLevel(value);
    }
  };

  const handleAvatarChange = (avatarData: string) => {
    setAvatar(avatarData);
  };
  
  return (
    <div className={`mx-auto py-4 animate-fade-in ${isMobile ? 'w-full px-4' : 'max-w-2xl'}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-medium">
          {existingContact ? 'Editar Contato' : 'Adicionar Novo Contato'}
        </h1>
        {onCancel && (
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-4">
          <AvatarUpload 
            name={name || 'Contato'}
            avatarUrl={avatar}
            onAvatarChange={handleAvatarChange}
            size="lg"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Toque para adicionar foto
          </p>
        </div>

        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-4`}>
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Idade</Label>
            <Input
              id="age"
              type="number"
              min="0"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Idade"
              className={errors.age ? 'border-destructive' : ''}
            />
            {errors.age && <p className="text-destructive text-xs">{errors.age}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="intellectualDisability">Deficiência Intelectual (DI)</Label>
          <Input
            id="intellectualDisability"
            value={intellectualDisability}
            onChange={(e) => setIntellectualDisability(e.target.value)}
            placeholder="Descreva a deficiência intelectual"
            className={errors.intellectualDisability ? 'border-destructive' : ''}
          />
          {errors.intellectualDisability && (
            <p className="text-destructive text-xs">{errors.intellectualDisability}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assistanceLevel">Nível de Auxílio</Label>
            <Select
              value={assistanceLevel}
              onValueChange={handleAssistanceLevelChange}
            >
              <SelectTrigger id="assistanceLevel">
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixo</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cid">CID</Label>
            <Input
              id="cid"
              value={cid}
              onChange={(e) => setCid(e.target.value)}
              placeholder="Código CID"
              className={errors.cid ? 'border-destructive' : ''}
            />
            {errors.cid && <p className="text-destructive text-xs">{errors.cid}</p>}
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Estereotipias</Label>
          <div className="flex">
            <Input
              value={newStereotypy}
              onChange={(e) => setNewStereotypy(e.target.value)}
              placeholder="Adicionar estereotipia"
              className="rounded-r-none"
            />
            <Button 
              type="button"
              onClick={() => addItem(newStereotypy, setNewStereotypy, stereotypies, setStereotypies)}
              className="rounded-l-none px-3"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {stereotypies.map((item, index) => (
              <div 
                key={index} 
                className="bg-accent text-accent-foreground text-sm px-3 py-1 rounded-full flex items-center gap-1"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem(index, stereotypies, setStereotypies)}
                  className="h-4 w-4 rounded-full hover:bg-background/20 flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {stereotypies.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma estereotipia adicionada</p>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Gostos</Label>
          <div className="flex">
            <Input
              value={newLike}
              onChange={(e) => setNewLike(e.target.value)}
              placeholder="Adicionar gosto"
              className="rounded-r-none"
            />
            <Button 
              type="button"
              onClick={() => addItem(newLike, setNewLike, likes, setLikes)}
              className="rounded-l-none px-3"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {likes.map((item, index) => (
              <div 
                key={index} 
                className="bg-primary/15 text-primary-foreground text-sm px-3 py-1 rounded-full flex items-center gap-1"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem(index, likes, setLikes)}
                  className="h-4 w-4 rounded-full hover:bg-background/20 flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {likes.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum gosto adicionado</p>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Desgostos</Label>
          <div className="flex">
            <Input
              value={newDislike}
              onChange={(e) => setNewDislike(e.target.value)}
              placeholder="Adicionar desgosto"
              className="rounded-r-none"
            />
            <Button 
              type="button"
              onClick={() => addItem(newDislike, setNewDislike, dislikes, setDislikes)}
              className="rounded-l-none px-3"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {dislikes.map((item, index) => (
              <div 
                key={index} 
                className="bg-destructive/15 text-destructive-foreground text-sm px-3 py-1 rounded-full flex items-center gap-1"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem(index, dislikes, setDislikes)}
                  className="h-4 w-4 rounded-full hover:bg-background/20 flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {dislikes.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum desgosto adicionado</p>
            )}
          </div>
        </div>
        
        <div className="pt-2 flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit">
            {existingContact ? 'Salvar Alterações' : 'Adicionar Contato'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddContactForm;
