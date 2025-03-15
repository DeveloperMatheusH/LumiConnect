
import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface AvatarUploadProps {
  name: string;
  avatarUrl?: string;
  onAvatarChange: (base64Data: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  name,
  avatarUrl,
  onAvatarChange,
  size = 'md',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onAvatarChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const sizeClass = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  }[size];

  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative group">
      <Avatar className={`${sizeClass} border border-border/40 cursor-pointer`} onClick={handleClick}>
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
        ) : null}
        <AvatarFallback className="bg-primary/10 text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <Button
        size="icon"
        variant="secondary"
        className="absolute bottom-0 right-0 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        onClick={handleClick}
      >
        <Camera className="h-3 w-3" />
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        capture="environment"
      />
    </div>
  );
};

export default AvatarUpload;
