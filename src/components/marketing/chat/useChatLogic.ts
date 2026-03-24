
import { useState, useRef, useEffect } from 'react';
import { Message, UserData } from './types';

export const useChatLogic = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm here to help you get started with Convelix. What's your name?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({});
  const [showContactDialog, setShowContactDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, isBot: boolean = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleNextStep = (userInput: string) => {
    addMessage(userInput, false);
    
    setTimeout(() => {
      switch (currentStep) {
        case 0: // After getting name
          setUserData(prev => ({ ...prev, name: userInput }));
          addMessage("Nice to meet you! What's your email address?", true);
          setCurrentStep(1);
          break;
        case 1: // After getting email
          setUserData(prev => ({ ...prev, email: userInput }));
          addMessage("Great! What's your phone number? (Optional - you can type 'skip')", true);
          setCurrentStep(2);
          break;
        case 2: // After getting phone
          const phone = userInput.toLowerCase() === 'skip' ? '' : userInput;
          setUserData(prev => ({ ...prev, phone }));
          addMessage("What's your company name? (Optional - you can type 'skip')", true);
          setCurrentStep(3);
          break;
        case 3: // After getting company
          const company = userInput.toLowerCase() === 'skip' ? '' : userInput;
          setUserData(prev => ({ ...prev, company }));
          addMessage("Perfect! Now tell me - what's your main challenge with lead management? What are you hoping to achieve?", true);
          setCurrentStep(4);
          break;
        case 4: // After getting requirements
          setUserData(prev => ({ ...prev, requirements: userInput }));
          addMessage("Thank you for sharing! I'll connect you with our team to discuss how Convelix can help you. Let me open our contact form with your information.", true);
          setTimeout(() => {
            setShowContactDialog(true);
          }, 1000);
          break;
      }
    }, 500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    handleNextStep(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPlaceholder = () => {
    switch (currentStep) {
      case 0: return "Type your name...";
      case 1: return "your@email.com";
      case 2: return "+1 (555) 123-4567 or 'skip'";
      case 3: return "Your company name or 'skip'";
      case 4: return "Describe your challenges...";
      default: return "Type your message...";
    }
  };

  const handleContactDialogClose = () => {
    setShowContactDialog(false);
    addMessage("Thank you! Our team will be in touch soon. Feel free to ask any other questions!", true);
  };

  const getContactFormData = () => {
    return {
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      company: userData.company || '',
      message: `Requirements from chat: ${userData.requirements || ''}`
    };
  };

  return {
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
  };
};
