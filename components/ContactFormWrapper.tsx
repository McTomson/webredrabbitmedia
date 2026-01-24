"use client";

import dynamic from 'next/dynamic';
import { useContactForm } from './ContactFormProvider';

const ContactForm = dynamic(() => import('@/components/ContactForm'), {
    ssr: false
});

const ContactFormWrapper = () => {
    const { isOpen, closeForm } = useContactForm();

    if (!isOpen) return null;

    return <ContactForm isOpen={isOpen} onClose={closeForm} />;
};

export default ContactFormWrapper;
