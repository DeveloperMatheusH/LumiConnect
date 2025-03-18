
import React from 'react';
import { MediaAttachment } from '@/types';
import { format } from 'date-fns';

interface MediaMessageProps {
  media: MediaAttachment;
  isUser: boolean;
}

const MediaMessage: React.FC<MediaMessageProps> = ({ media, isUser }) => {
  const mediaDate = new Date(media.timestamp);
  const formattedTime = format(mediaDate, 'HH:mm');
  
  return (
    <div 
      className={`max-w-[80%] rounded-lg p-2 ${
        isUser 
          ? 'bg-primary text-primary-foreground rounded-tr-none' 
          : 'bg-secondary rounded-tl-none'
      }`}
    >
      {media.type === 'image' && (
        <div className="relative w-full rounded-md overflow-hidden">
          <img 
            src={media.url} 
            alt={media.name} 
            className="w-full object-contain max-h-[300px]"
          />
        </div>
      )}
      
      {media.type === 'video' && (
        <div className="relative w-full rounded-md overflow-hidden">
          <video 
            src={media.url} 
            controls
            className="w-full max-h-[300px]"
          >
            Seu navegador não suporta a reprodução de vídeo.
          </video>
        </div>
      )}
      
      {media.type === 'audio' && (
        <div className="relative w-full">
          <audio
            src={media.url}
            controls
            className="w-full"
          >
            Seu navegador não suporta a reprodução de áudio.
          </audio>
        </div>
      )}
      
      <p className="text-xs opacity-70 text-right mt-1">{formattedTime}</p>
    </div>
  );
};

export default MediaMessage;
