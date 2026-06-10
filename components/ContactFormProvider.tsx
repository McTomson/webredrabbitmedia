"use client";

import React, { createContext, useContext, useState } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

interface ContactFormContextType {
    isOpen: boolean;
    openForm: () => void;
    closeForm: () => void;
}

const ContactFormContext = createContext<ContactFormContextType | undefined>(undefined);

export const ContactFormProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openForm = () => {
        // CTA intent signal: every "Erstgespräch / Analyse anfordern" button opens this modal,
        // so one event here captures contact intent per page (incl. articles), pre-submit.
        try {
            sendGAEvent('event', 'contact_form_open', {
                page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
            });
        } catch {
            /* analytics must never block opening the form */
        }
        setIsOpen(true);
    };
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
