import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface ChatToggleButtonProps {
  onClick: () => void;
}

export const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ onClick }) => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <Button
      onClick={onClick}
      className={`
        h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300
        ${isDashboard 
          ? 'bg-gradient-to-r from-brand-600 to-brand-800 hover:from-primary/90 hover:to-brand-800'
          : 'bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 animate-pulse'
        }
      `}
      size="icon"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </Button>
  );
};
