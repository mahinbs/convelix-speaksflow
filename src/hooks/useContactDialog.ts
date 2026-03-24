import { useCallback, useState } from 'react';
import { create } from 'zustand';

interface ContactDialogState {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const useContactStore = create<ContactDialogState>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
}));

export const useContactDialog = () => {
    const { setIsOpen } = useContactStore();

    const openContactDialog = useCallback(() => {
        setIsOpen(true);
    }, [setIsOpen]);

    const closeContactDialog = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    return {
        openContactDialog,
        closeContactDialog,
        isOpen: useContactStore((state) => state.isOpen)
    };
}; 