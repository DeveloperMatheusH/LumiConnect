
import React from 'react';

interface PuzzlePieceIconProps {
  className?: string;
  size?: number;
}

const PuzzlePieceIcon: React.FC<PuzzlePieceIconProps> = ({ 
  className = "", 
  size = 24 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20.5 7.5 16 12l4.5 4.5c1-1 1.5-2.2 1.5-3.5s-.5-2.5-1.5-3.5Z" />
      <path d="M16 12V4c-1-.5-2.2-.8-3.5-.8-1.3 0-2.5.3-3.5.8L13.5 12 9 16.5c1 .5 2.2.8 3.5.8 1.3 0 2.5-.3 3.5-.8L12 12.5 16 8.5" />
      <path d="M3.5 7.5c-1 1-1.5 2.2-1.5 3.5s.5 2.5 1.5 3.5L8 10l-4.5-4.5Z" />
      <path d="M7.5 3.5C6.5 2.5 5.3 2 4 2s-2.5.5-3.5 1.5L5 8 7.5 5.5" />
      <path d="M7.5 20.5c1 1 2.2 1.5 3.5 1.5s2.5-.5 3.5-1.5L9 16l-4.5 4.5" />
    </svg>
  );
};

export default PuzzlePieceIcon;
