
export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  requirements?: string;
}

export interface ChatBotProps {
  className?: string;
}
