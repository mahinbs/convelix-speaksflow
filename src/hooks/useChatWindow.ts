import { create } from 'zustand';

interface ChatState {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const useChatStore = create<ChatState>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
}));

export const useChatWindow = () => {
    const { isOpen, setIsOpen } = useChatStore();

    const openChat = () => {
        setIsOpen(true);
    };

    const closeChat = () => {
        setIsOpen(false);
    };

    return {
        isOpen,
        openChat,
        closeChat
    };
}; 