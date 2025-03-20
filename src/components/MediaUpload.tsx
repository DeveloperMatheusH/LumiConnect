
import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useContacts } from '@/context/ContactsContext';
import { ActivityType } from '@/types';
import { Button } from '@/components/ui/button';
import { X, Upload, Camera, Film, Mic } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaUploadProps {
  contactId: string;
  onClose: () => void;
  activityType?: ActivityType;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ 
  contactId, 
  onClose,
  activityType = 'general'
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "record">("upload");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };
  
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
        }
      };
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
        setMediaFile(audioFile);
        setMediaPreview(URL.createObjectURL(audioFile));
        setAudioChunks([]);
        setIsRecording(false);
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Erro ao iniciar a gravação:", error);
    }
  };
  
  const handleStopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
  };
  
  const handleUpload = async () => {
    if (!mediaFile || !contactId) return;
    
    setUploading(true);
    
    try {
      const fileURL = mediaPreview || '';
      
      // FIX #1: Ensure the media type is explicitly one of the allowed values
      const mediaType = mediaFile.type.startsWith('image')
        ? 'image' as const
        : mediaFile.type.startsWith('video')
          ? 'video' as const
          : 'audio' as const;
      
      const newMedia = {
        id: uuidv4(),
        type: mediaType, // Now correctly typed as "image" | "video" | "audio"
        url: fileURL,
        name: mediaFile.name,
        timestamp: new Date(),
      };
      
      useContacts().addMessage(contactId, '', true, [newMedia], activityType);
      onClose();
    } catch (error) {
      console.error("Erro ao enviar mídia:", error);
    } finally {
      setUploading(false);
    }
  };
  
  const handleCancel = () => {
    setMediaFile(null);
    setMediaPreview(null);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-secondary rounded-lg shadow-lg w-full max-w-md flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-medium">Adicionar Mídia</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* FIX #2: Use type assertion to match the expected function signature */}
        <Tabs 
          defaultValue="upload" 
          value={activeTab} 
          onValueChange={(value: "upload" | "record") => setActiveTab(value)}
        >
          <TabsList className="m-2">
            <TabsTrigger value="upload" className="flex-1">Enviar</TabsTrigger>
            <TabsTrigger value="record" className="flex-1">Gravar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="p-4 flex flex-col gap-4">
            {mediaPreview ? (
              <div className="relative w-full rounded-md overflow-hidden">
                {mediaFile?.type.startsWith('image') && (
                  <img 
                    src={mediaPreview} 
                    alt="Pré-visualização" 
                    className="w-full object-contain max-h-[300px]"
                  />
                )}
                {mediaFile?.type.startsWith('video') && (
                  <video 
                    src={mediaPreview} 
                    controls
                    className="w-full max-h-[300px]"
                  >
                    Seu navegador não suporta a reprodução de vídeo.
                  </video>
                )}
                {mediaFile?.type.startsWith('audio') && (
                  <audio 
                    src={mediaPreview} 
                    controls
                    className="w-full"
                  >
                    Seu navegador não suporta a reprodução de áudio.
                  </audio>
                )}
              </div>
            ) : (
              <div 
                className="border-dashed border-2 border-border rounded-md p-6 text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">
                  Clique para selecionar um arquivo
                </p>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*, video/*, audio/*"
            />
          </TabsContent>
          
          <TabsContent value="record" className="p-4 flex flex-col gap-4">
            {mediaPreview ? (
              <div className="relative w-full rounded-md overflow-hidden">
                <audio 
                  src={mediaPreview} 
                  controls
                  className="w-full"
                >
                  Seu navegador não suporta a reprodução de áudio.
                </audio>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Button 
                  variant={isRecording ? "destructive" : "outline"}
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  disabled={uploading}
                >
                  {isRecording ? (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Parar de gravar
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Gravar áudio
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="p-4 border-t border-border flex justify-end gap-2">
          <Button variant="ghost" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!mediaFile || uploading}
          >
            {uploading ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;
