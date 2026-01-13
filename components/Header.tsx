"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Phone, ArrowRight } from "lucide-react";

interface HeaderProps {
    onFormOpen?: () => void;
}

export default function Header({ onFormOpen }: HeaderProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 outline-none focus:outline-none ${scrolled
                ? "bg-white/95 backdrop-blur-sm shadow-sm py-4"
                : "bg-transparent py-6"
                }`}
            role="banner"
        >
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex justify-between items-center">
                    <div className="fade-down" style={{ animationDelay: '100ms' }}>
                        <Link href="/" className="flex items-center outline-none focus:outline-none">
                            <Image
                                src="/images/logo.webp"
                                alt="Red Rabbit Media Logo"
                                width={80}
                                height={80}
                                className={`w-auto transition-all duration-300 ${scrolled ? "h-12" : "h-16"}`}
                            />
                        </Link>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 outline-none focus:outline-none">
                        {[
                            { name: 'Über uns', href: '/#about' },
                            { name: 'Portfolio', href: '/#portfolio' },
                            { name: 'Ablauf', href: '/#process' },
                            { name: 'Tipps', href: '/tipps' },
                            { name: 'Preis', href: '/#pricing' },
                            { name: 'FAQ', href: '/#faq' },
                            { name: 'Kontakt', href: '/#contact' }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`transition-colors duration-300 text-sm font-light tracking-wide outline-none focus:outline-none ${scrolled ? "text-gray-600 hover:text-red-600" : "text-gray-800 hover:text-red-600"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <div className="flex items-center gap-4 ml-4">
                            <a
                                href="tel:+436769000955"
                                className={`group flex items-center gap-2 px-6 py-3 rounded-none transition-all duration-300 font-light text-sm tracking-wide outline-none focus:outline-none ${scrolled
                                    ? "bg-[#172554] text-white hover:bg-[#1e3a8a]"
                                    : "bg-[#172554] text-white hover:bg-[#1e3a8a]"
                                    }`}
                            >
                                <Phone className="w-4 h-4" />
                                <span>Gerne Anrufen</span>
                            </a>
                            <button
                                onClick={onFormOpen}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-none hover:bg-red-700 transition-all duration-300 font-light text-sm tracking-wide group outline-none focus:outline-none"
                            >
                                <span>Jetzt starten</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
