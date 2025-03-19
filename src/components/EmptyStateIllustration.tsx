
import React from 'react';

interface EmptyStateIllustrationProps {
  type: 'no-contacts' | 'no-messages';
  className?: string;
}

const EmptyStateIllustration: React.FC<EmptyStateIllustrationProps> = ({ type, className }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {type === 'no-contacts' ? (
        <div className="w-64 h-64">
          <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="128" cy="128" r="128" fill="#8B5CF6" fillOpacity="0.1" />
            <circle cx="128" cy="100" r="32" fill="#8B5CF6" fillOpacity="0.2" />
            <circle cx="128" cy="100" r="24" fill="#8B5CF6" fillOpacity="0.4" />
            <path d="M80 176C80 149.49 101.49 128 128 128C154.51 128 176 149.49 176 176" stroke="#8B5CF6" strokeWidth="8" strokeLinecap="round" />
            <path d="M176 72C176 83.0457 167.046 92 156 92C144.954 92 136 83.0457 136 72C136 60.9543 144.954 52 156 52C167.046 52 176 60.9543 176 72Z" fill="#8B5CF6" fillOpacity="0.2" />
            <path d="M80 72C80 83.0457 71.0457 92 60 92C48.9543 92 40 83.0457 40 72C40 60.9543 48.9543 52 60 52C71.0457 52 80 60.9543 80 72Z" fill="#8B5CF6" fillOpacity="0.2" />
            <path d="M208 132C208 143.046 199.046 152 188 152C176.954 152 168 143.046 168 132C168 120.954 176.954 112 188 112C199.046 112 208 120.954 208 132Z" fill="#8B5CF6" fillOpacity="0.2" />
            <path d="M48 132C48 143.046 39.0457 152 28 152C16.9543 152 8 143.046 8 132C8 120.954 16.9543 112 28 112C39.0457 112 48 120.954 48 132Z" fill="#8B5CF6" fillOpacity="0.2" />
            <path d="M188 188C188 199.046 179.046 208 168 208C156.954 208 148 199.046 148 188C148 176.954 156.954 168 168 168C179.046 168 188 176.954 188 188Z" fill="#8B5CF6" fillOpacity="0.2" />
            <path d="M108 188C108 199.046 99.0457 208 88 208C76.9543 208 68 199.046 68 188C68 176.954 76.9543 168 88 168C99.0457 168 108 176.954 108 188Z" fill="#8B5CF6" fillOpacity="0.2" />
            <circle cx="128" cy="100" r="8" fill="#8B5CF6" />
          </svg>
        </div>
      ) : (
        <div className="w-64 h-64">
          <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="128" cy="128" r="128" fill="#8B5CF6" fillOpacity="0.1" />
            <rect x="72" y="56" width="112" height="144" rx="8" fill="#8B5CF6" fillOpacity="0.2" />
            <rect x="88" y="88" width="80" height="16" rx="4" fill="#8B5CF6" fillOpacity="0.4" />
            <rect x="88" y="120" width="80" height="16" rx="4" fill="#8B5CF6" fillOpacity="0.4" />
            <rect x="88" y="152" width="80" height="16" rx="4" fill="#8B5CF6" fillOpacity="0.4" />
            <path d="M196 60C196 64.4183 192.418 68 188 68C183.582 68 180 64.4183 180 60C180 55.5817 183.582 52 188 52C192.418 52 196 55.5817 196 60Z" fill="#8B5CF6" fillOpacity="0.6" />
            <path d="M76 60C76 64.4183 72.4183 68 68 68C63.5817 68 60 64.4183 60 60C60 55.5817 63.5817 52 68 52C72.4183 52 76 55.5817 76 60Z" fill="#8B5CF6" fillOpacity="0.6" />
            <path d="M196 196C196 200.418 192.418 204 188 204C183.582 204 180 200.418 180 196C180 191.582 183.582 188 188 188C192.418 188 196 191.582 196 196Z" fill="#8B5CF6" fillOpacity="0.6" />
            <path d="M76 196C76 200.418 72.4183 204 68 204C63.5817 204 60 200.418 60 196C60 191.582 63.5817 188 68 188C72.4183 188 76 191.582 76 196Z" fill="#8B5CF6" fillOpacity="0.6" />
            <path d="M128 42V214" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" />
            <path d="M214 128L42 128" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default EmptyStateIllustration;
