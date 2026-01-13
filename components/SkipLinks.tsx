"use client";

import { useEffect, useState } from 'react';

const SkipLinks = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Show skip links when Tab is pressed
            if (e.key === 'Tab') {
                setIsVisible(true);
            }
        };

        const handleClick = () => {
            // Hide skip links on click anywhere
            setIsVisible(false);
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('click', handleClick);
        };
    }, []);

    const scrollToElement = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.focus();
            element.scrollIntoView({ behavior: 'smooth' });
            setIsVisible(false); // Hide after clicking
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 z-[60] bg-red-600 text-white p-2 space-y-2 w-full sm:w-auto">
            <button
                onClick={() => scrollToElement('main-content')}
                className="block w-full px-4 py-2 text-left hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white rounded transition-colors"
            >
                Zum Hauptinhalt springen
            </button>
            <button
                onClick={() => scrollToElement('navigation')}
                className="block w-full px-4 py-2 text-left hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white rounded transition-colors"
            >
                Zur Navigation springen
            </button>
            <button
                onClick={() => scrollToElement('footer')}
                className="block w-full px-4 py-2 text-left hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white rounded transition-colors"
            >
                Zum Footer springen
            </button>
        </div>
    );
};

export default SkipLinks;
