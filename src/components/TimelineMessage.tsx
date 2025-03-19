
import React from 'react';
import { Message } from '@/types';
import { format } from 'date-fns';
import ActivityIcon from './ActivityIcon';
import MediaMessage from './MediaMessage';

interface TimelineMessageProps {
  message: Message;
}

const TimelineMessage: React.FC<TimelineMessageProps> = ({ message }) => {
  const messageDate = new Date(message.timestamp);
  const formattedTime = format(messageDate, 'HH:mm');
  const activityType = message.activityType || 'general';
  
  // Render media attachments if present
  const renderMediaAttachments = () => {
    if (!message.mediaAttachments || message.mediaAttachments.length === 0) {
      return null;
    }
    
    return (
      <div className="space-y-2">
        {message.mediaAttachments.map(media => (
          <MediaMessage 
            key={media.id} 
            media={media} 
            isUser={message.isUser}
            activityType={activityType}
          />
        ))}
      </div>
    );
  };
  
  // Get background color class based on activity type
  const getBackgroundClass = () => {
    switch (activityType) {
      case 'progress':
        return 'bg-green-500/10 hover:bg-green-500/20';
      case 'challenge':
        return 'bg-yellow-500/10 hover:bg-yellow-500/20';
      case 'important':
        return 'bg-blue-500/10 hover:bg-blue-500/20';
      case 'therapy':
        return 'bg-purple-500/10 hover:bg-purple-500/20';
      case 'school':
        return 'bg-indigo-500/10 hover:bg-indigo-500/20';
      case 'leisure':
        return 'bg-teal-500/10 hover:bg-teal-500/20';
      case 'meal':
        return 'bg-orange-500/10 hover:bg-orange-500/20';
      default:
        return message.isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-secondary';
    }
  };
  
  // Only apply special styling for activity types other than 'general'
  const messageClass = activityType !== 'general' 
    ? `rounded-lg p-3 ${getBackgroundClass()} transition-colors duration-200`
    : `rounded-lg p-3 ${message.isUser 
        ? 'bg-primary text-primary-foreground rounded-tr-none' 
        : 'bg-secondary rounded-tl-none'
      }`;
      
  return (
    <div 
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}
    >
      {!message.isUser && (
        <div className="flex items-start mr-2">
          <ActivityIcon type={activityType} size={18} />
        </div>
      )}
      
      <div className={messageClass}>
        {message.content && <p className="text-sm">{message.content}</p>}
        
        {renderMediaAttachments()}
        
        <div className="flex items-center justify-end space-x-2 mt-1">
          {message.isUser && activityType !== 'general' && (
            <ActivityIcon type={activityType} size={14} />
          )}
          <p className="text-xs opacity-70">{formattedTime}</p>
        </div>
      </div>
      
      {message.isUser && (
        <div className="flex items-start ml-2">
          {activityType !== 'general' && <ActivityIcon type={activityType} size={18} />}
        </div>
      )}
    </div>
  );
};

export default TimelineMessage;
