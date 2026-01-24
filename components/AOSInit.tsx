"use client";

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AOSInit = () => {
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        AOS.init({
            once: true,
            duration: 800,
            easing: 'ease-out-cubic',
            offset: isMobile ? 50 : 100, // Trigger earlier on mobile for smoother feel
        });
    }, []);

    return null;
};

export default AOSInit;
