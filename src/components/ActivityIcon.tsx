
import React from 'react';
import { ActivityType } from '@/types';
import { 
  Brain, 
  GraduationCap, 
  Trees, 
  Utensils, 
  TrendingUp, 
  AlertTriangle, 
  Star, 
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PuzzlePieceIcon from './PuzzlePieceIcon';

interface ActivityIconProps {
  type: ActivityType;
  className?: string;
  size?: number;
}

const ActivityIcon: React.FC<ActivityIconProps> = ({ 
  type, 
  className,
  size = 16 
}) => {
  // Define colors based on activity type
  const getColor = () => {
    switch (type) {
      case 'progress':
        return 'text-green-500';
      case 'challenge':
        return 'text-yellow-500';
      case 'important':
        return 'text-blue-500';
      case 'therapy':
        return 'text-purple-500';
      case 'school':
        return 'text-indigo-500';
      case 'leisure':
        return 'text-teal-500';
      case 'meal':
        return 'text-orange-500';
      default:
        return 'text-muted-foreground';
    }
  };

  // Return icon based on activity type
  const renderIcon = () => {
    switch (type) {
      case 'therapy':
        return <Brain size={size} />;
      case 'school':
        return <GraduationCap size={size} />;
      case 'leisure':
        return <Trees size={size} />;
      case 'meal':
        return <Utensils size={size} />;
      case 'progress':
        return <TrendingUp size={size} />;
      case 'challenge':
        return <AlertTriangle size={size} />;
      case 'important':
        return <Star size={size} />;
      case 'general':
        return <MessageCircle size={size} />;
      default:
        return <PuzzlePieceIcon size={size} />;
    }
  };

  return (
    <div className={cn("flex items-center justify-center", getColor(), className)}>
      {renderIcon()}
    </div>
  );
};

export default ActivityIcon;
