
import React, { useState, useRef } from 'react';
import { Camera, Video, Mic, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContacts } from '@/context/ContactsContext';
import { MediaAttachment } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface MediaUploadProps {
  contactId: string;
  onClose: () => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ contactId, onClose }) => {
  const { addMediaAttachment } = useContacts();
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'audio'>('image');
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tamanho (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setIsLoading(false);
    };
    reader.onerror = () => {
      toast({
        title: "Erro ao carregar arquivo",
        description: "Não foi possível processar o arquivo selecionado",
        variant: "destructive"
      });
      setIsLoading(false);
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleUpload = () => {
    if (!preview) return;
    
    addMediaAttachment(contactId, activeTab, preview, `${activeTab}_${new Date().getTime()}`);
    onClose();
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="fixed inset-0 bg-background/95 z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Adicionar mídia</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex border-b">
          <button
            className={`flex-1 p-3 text-center ${activeTab === 'image' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('image')}
          >
            <Camera className="h-5 w-5 mx-auto mb-1" />
            <span className="text-sm">Imagem</span>
          </button>
          <button
            className={`flex-1 p-3 text-center ${activeTab === 'video' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            <Video className="h-5 w-5 mx-auto mb-1" />
            <span className="text-sm">Vídeo</span>
          </button>
          <button
            className={`flex-1 p-3 text-center ${activeTab === 'audio' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            <Mic className="h-5 w-5 mx-auto mb-1" />
            <span className="text-sm">Áudio</span>
          </button>
        </div>
        
        <div className="p-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={
              activeTab === 'image' ? 'image/*' : 
              activeTab === 'video' ? 'video/*' : 
              'audio/*'
            }
            onChange={handleFileChange}
          />
          
          {!preview ? (
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-accent/10"
              onClick={triggerFileInput}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Clique para selecionar um arquivo</p>
              <p className="text-xs text-muted-foreground mt-1">
                {activeTab === 'image' ? 'JPG, PNG ou GIF' : 
                 activeTab === 'video' ? 'MP4, WebM ou MOV' : 
                 'MP3, WAV ou OGG'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Tamanho máximo: 10MB</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'image' && (
                <div className="relative w-full aspect-video bg-black/10 rounded-lg overflow-hidden">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              {activeTab === 'video' && (
                <div className="relative w-full aspect-video bg-black/10 rounded-lg overflow-hidden">
                  <video 
                    src={preview} 
                    controls 
                    className="w-full h-full"
                  />
                </div>
              )}
              {activeTab === 'audio' && (
                <div className="relative w-full p-4 bg-accent/10 rounded-lg">
                  <audio 
                    src={preview} 
                    controls 
                    className="w-full"
                  />
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setPreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  Alterar
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleUpload}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processando...' : 'Enviar'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;
