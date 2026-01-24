"use client";

import React, { createContext, useContext, useState } from 'react';

interface ContactFormContextType {
    isOpen: boolean;
    openForm: () => void;
    closeForm: () => void;
}

const ContactFormContext = createContext<ContactFormContextType | undefined>(undefined);

export const ContactFormProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openForm = () => setIsOpen(true);
    const closeForm = () => setIsOpen(false);

    return (
        <ContactFormContext.Provider value={{ isOpen, openForm, closeForm }}>
            {children}
        </ContactFormContext.Provider>
    );
};

export const useContactForm = () => {
    const context = useContext(ContactFormContext);
    if (context === undefined) {
        throw new Error('useContactForm must be used within a ContactFormProvider');
    }
    return context;
};
