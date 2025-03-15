
import React, { useState } from 'react';
import { useContacts } from '@/context/ContactsContext';
import { Contact, Medication } from '@/types';
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
import { v4 as uuidv4 } from 'uuid';

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
  
  // Medication state
  const [medications, setMedications] = useState<Medication[]>(existingContact?.medications || []);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    effect: ''
  });
  const [newEffect, setNewEffect] = useState('');
  const [effectsList, setEffectsList] = useState<string[]>([]);
  const [editingMedicationIndex, setEditingMedicationIndex] = useState<number | null>(null);
  
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
      medications,
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
  
  const handleAddEffect = () => {
    if (!newEffect.trim()) return;
    setEffectsList([...effectsList, newEffect.trim()]);
    setNewEffect('');
  };
  
  const handleRemoveEffect = (index: number) => {
    setEffectsList(effectsList.filter((_, i) => i !== index));
  };
  
  const handleAddMedication = () => {
    if (!newMedication.name.trim() || !newMedication.dosage.trim() || !newMedication.frequency.trim()) {
      return;
    }
    
    const medicationToAdd: Medication = {
      id: uuidv4(),
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      effects: [...effectsList]
    };
    
    if (editingMedicationIndex !== null) {
      const updatedMedications = [...medications];
      updatedMedications[editingMedicationIndex] = medicationToAdd;
      setMedications(updatedMedications);
      setEditingMedicationIndex(null);
    } else {
      setMedications([...medications, medicationToAdd]);
    }
    
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      effect: ''
    });
    setEffectsList([]);
  };
  
  const handleEditMedication = (index: number) => {
    const medication = medications[index];
    setNewMedication({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      effect: ''
    });
    setEffectsList([...medication.effects]);
    setEditingMedicationIndex(index);
  };
  
  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };
  
  return (
    <div className={`mx-auto py-4 animate-fade-in ${isMobile ? 'w-full px-4' : 'max-w-2xl'}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-medium">
          {existingContact ? 'Editar Contato' : 'Adicionar Nova Pessoa'}
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
        
        {/* Medications Section */}
        <div className="space-y-4 pt-2 border-t">
          <h2 className="text-lg font-medium">Medicamentos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medication-name">Nome do Medicamento</Label>
              <Input
                id="medication-name"
                value={newMedication.name}
                onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                placeholder="Nome do medicamento"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="medication-dosage">Dosagem</Label>
              <Input
                id="medication-dosage"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                placeholder="Ex: 100mg"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="medication-frequency">Frequência (intervalo em horas)</Label>
            <Input
              id="medication-frequency"
              value={newMedication.frequency}
              onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
              placeholder="Ex: 8h em 8h"
            />
          </div>
          
          <div className="space-y-3">
            <Label>Efeitos</Label>
            <div className="flex">
              <Input
                value={newEffect}
                onChange={(e) => setNewEffect(e.target.value)}
                placeholder="Adicionar efeito"
                className="rounded-r-none"
              />
              <Button 
                type="button"
                onClick={handleAddEffect}
                className="rounded-l-none px-3"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {effectsList.map((effect, index) => (
                <div 
                  key={index} 
                  className="bg-accent text-accent-foreground text-sm px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <span>{effect}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEffect(index)}
                    className="h-4 w-4 rounded-full hover:bg-background/20 flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {effectsList.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum efeito adicionado</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddMedication}
              className="mt-2"
            >
              {editingMedicationIndex !== null ? 'Atualizar Medicamento' : 'Adicionar Medicamento'}
            </Button>
          </div>
          
          {/* List of added medications */}
          {medications.length > 0 && (
            <div className="mt-4 space-y-3">
              <h3 className="text-sm font-medium">Medicamentos Adicionados</h3>
              <div className="space-y-2">
                {medications.map((medication, index) => (
                  <div key={medication.id} className="border rounded-md p-3 bg-accent/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{medication.name}</h4>
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
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditMedication(index)}
                          className="h-8 px-2"
                        >
                          Editar
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveMedication(index)}
                          className="text-destructive h-8 px-2"
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
