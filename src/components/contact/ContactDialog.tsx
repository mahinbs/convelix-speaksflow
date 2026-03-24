
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ContactForm } from './ContactForm';

interface ContactDialogProps {
  children: React.ReactNode;
  formType: string;
}

export const ContactDialog: React.FC<ContactDialogProps> = ({
  children,
  formType
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmissionSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Contact Form</DialogTitle>
        </DialogHeader>
        <ContactForm 
          formType={formType}
          onSubmissionSuccess={handleSubmissionSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};
