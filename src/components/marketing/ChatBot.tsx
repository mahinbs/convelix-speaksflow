import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChatContactForm } from '@/components/contact/ChatContactForm';
import { cn } from '@/lib/utils';
import { ChatBotProps } from './chat/types';
import { useChatLogic } from './chat/useChatLogic';
import { ChatToggleButton } from './chat/ChatToggleButton';
import { ChatWindow } from './chat/ChatWindow';
import { useLocation } from 'react-router-dom';
import { useChatWindow } from '@/hooks/useChatWindow';

export const ChatBot: React.FC<ChatBotProps> = ({ className }) => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');
  const chatRef = useRef<HTMLDivElement>(null);
  const { isOpen, openChat, closeChat } = useChatWindow();
  
  const {
    messages,
    inputValue,
    setInputValue,
    showContactDialog,
    setShowContactDialog,
    messagesEndRef,
    handleSendMessage,
    handleKeyPress,
    getPlaceholder,
    handleContactDialogClose,
    getContactFormData
  } = useChatLogic();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        closeChat();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeChat]);

  return (
    <>
      <div
        ref={chatRef}
        className={cn(
          "fixed z-50",
          isDashboard ? "bottom-6 right-6" : "bottom-6 right-6",
          className
        )}
      >
        {!isOpen && (
          <ChatToggleButton onClick={openChat} />
        )}

        {isOpen && (
          <ChatWindow
            messages={messages}
            inputValue={inputValue}
            setInputValue={setInputValue}
            messagesEndRef={messagesEndRef}
            handleSendMessage={handleSendMessage}
            handleKeyPress={handleKeyPress}
            getPlaceholder={getPlaceholder}
            onClose={closeChat}
          />
        )}
      </div>

      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <ChatContactForm
            initialData={getContactFormData()}
            onSubmissionSuccess={handleContactDialogClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
