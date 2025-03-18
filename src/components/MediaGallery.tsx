
import React, { useState } from 'react';
import { useContacts } from '@/context/ContactsContext';
import { MediaAttachment } from '@/types';
import { Button } from '@/components/ui/button';
import { X, Calendar, Image, Video, Music } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaGalleryProps {
  contactId: string;
  onClose: () => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ contactId, onClose }) => {
  const { getMediaAttachments } = useContacts();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedMedia, setSelectedMedia] = useState<MediaAttachment | null>(null);
  
  const allMedia = getMediaAttachments(contactId);
  const images = allMedia.filter(media => media.type === 'image');
  const videos = allMedia.filter(media => media.type === 'video');
  const audios = allMedia.filter(media => media.type === 'audio');
  
  // Agrupar mídia por data
  const groupByDate = (media: MediaAttachment[]) => {
    const groups: Record<string, MediaAttachment[]> = {};
    
    media.forEach(item => {
      const date = format(new Date(item.timestamp), 'dd/MM/yyyy');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });
    
    return Object.entries(groups).sort((a, b) => {
      const dateA = new Date(a[0].split('/').reverse().join('-'));
      const dateB = new Date(b[0].split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    });
  };
  
  const getMediaToShow = () => {
    switch (activeTab) {
      case 'images':
        return images;
      case 'videos':
        return videos;
      case 'audios':
        return audios;
      default:
        return allMedia;
    }
  };
  
  const groupedMedia = groupByDate(getMediaToShow());
  
  // Componente de visualização de mídia selecionada
  const MediaViewer = () => {
    if (!selectedMedia) return null;
    
    return (
      <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="relative max-w-4xl w-full">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSelectedMedia(null)}
            className="absolute top-2 right-2 z-10 bg-background/50 hover:bg-background"
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="bg-card rounded-lg overflow-hidden shadow-xl">
            {selectedMedia.type === 'image' && (
              <img 
                src={selectedMedia.url} 
                alt="" 
                className="max-h-[80vh] w-auto mx-auto"
              />
            )}
            
            {selectedMedia.type === 'video' && (
              <video 
                src={selectedMedia.url} 
                controls 
                autoPlay 
                className="max-h-[80vh] w-auto mx-auto"
              />
            )}
            
            {selectedMedia.type === 'audio' && (
              <div className="p-8">
                <audio 
                  src={selectedMedia.url} 
                  controls 
                  autoPlay 
                  className="w-full"
                />
              </div>
            )}
            
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {format(new Date(selectedMedia.timestamp), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const MediaThumbnail = ({ media }: { media: MediaAttachment }) => {
    return (
      <div 
        className="relative rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setSelectedMedia(media)}
      >
        {media.type === 'image' && (
          <div className="aspect-square bg-accent">
            <img 
              src={media.url} 
              alt="" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {media.type === 'video' && (
          <div className="aspect-square bg-accent relative">
            <video 
              src={media.url}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Video className="h-10 w-10 text-white" />
            </div>
          </div>
        )}
        
        {media.type === 'audio' && (
          <div className="aspect-square bg-accent flex items-center justify-center">
            <Music className="h-10 w-10" />
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 bg-background/95 z-50 flex flex-col animate-fade-in">
      {selectedMedia && <MediaViewer />}
      
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-medium">Galeria de Mídia</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-4 border-b">
            <TabsList className="mb-2">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Todos ({allMedia.length})</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span>Imagens ({images.length})</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span>Vídeos ({videos.length})</span>
              </TabsTrigger>
              <TabsTrigger value="audios" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                <span>Áudios ({audios.length})</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="overflow-y-auto h-full p-4 pb-20">
            {groupedMedia.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-2">Nenhuma mídia encontrada</p>
                <p className="text-sm">Comece a enviar fotos, vídeos ou áudios para visualizá-los aqui.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {groupedMedia.map(([date, items]) => (
                  <div key={date} className="space-y-2">
                    <h3 className="text-sm font-medium">{date}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {items.map(media => (
                        <MediaThumbnail key={media.id} media={media} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MediaGallery;
