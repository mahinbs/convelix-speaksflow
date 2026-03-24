import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { Message } from './types';
import { useLocation } from 'react-router-dom';

interface ChatWindowProps {
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  getPlaceholder: () => string;
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  inputValue,
  setInputValue,
  messagesEndRef,
  handleSendMessage,
  handleKeyPress,
  getPlaceholder,
  onClose
}) => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className={`w-80 h-[500px] flex flex-col shadow-2xl border-0 ${isDashboard ? 'bg-white' : 'bg-white/95 backdrop-blur-md'}`}
      onClick={handleStopPropagation}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-brand-500 to-brand-700 text-primary-foreground rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Convelix Assistant</h3>
            <p className="text-xs opacity-90">Here to help</p>
          </div>
        </div>
        <Button
          
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20 hover:text-white h-8 w-8 p-0 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col">
        <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          handleKeyPress={handleKeyPress}
          placeholder={getPlaceholder()}
        />
      </CardContent>
    </Card>
  );
};
