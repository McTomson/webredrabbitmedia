"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Phone, ArrowRight, Menu, X } from "lucide-react";

interface HeaderProps {
    onFormOpen?: () => void;
}

export default function Header({ onFormOpen }: HeaderProps) {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    const navLinks = [
        { name: 'Über uns', href: '/#about' },
        { name: 'Portfolio', href: '/#portfolio' },
        { name: 'Ablauf', href: '/#process' },
        { name: 'Tipps', href: '/tipps' },
        { name: 'Preis', href: '/#pricing' },
        { name: 'FAQ', href: '/#faq' },
        { name: 'Kontakt', href: '/kontakt' }
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 outline-none focus:outline-none ${scrolled || isMenuOpen
                    ? "bg-white/95 backdrop-blur-sm shadow-sm py-4"
                    : "bg-transparent py-6"
                    }`}
                role="banner"
            >
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <div className="flex justify-between items-center">
                        <div className="fade-down" style={{ animationDelay: '100ms' }}>
                            <Link href="/" className="flex items-center outline-none focus:outline-none" onClick={() => setIsMenuOpen(false)}>
                                <div className="relative w-[130px] md:w-[150px] h-[35px] md:h-[40px]">
                                    <Image
                                        src="/images/logo.webp"
                                        alt="Red Rabbit Media Logo"
                                        fill
                                        className="object-contain object-left"
                                        priority // Fix LCP warning
                                        sizes="(max-width: 768px) 130px, 150px"
                                    />
                                </div>
                            </Link>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-gray-800 outline-none focus:outline-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        <nav className="hidden md:flex items-center gap-8 outline-none focus:outline-none">
                            {navLinks.map((item) => (
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
                                    className="group flex items-center gap-2 px-6 py-3 bg-[#172554] text-white hover:bg-[#1e3a8a] rounded-none transition-all duration-300 font-light text-sm tracking-wide outline-none focus:outline-none"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span>Gerne Anrufen</span>
                                </a>
                                {onFormOpen ? (
                                    <button
                                        onClick={onFormOpen}
                                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-none hover:bg-red-700 transition-all duration-300 font-light text-sm tracking-wide group outline-none focus:outline-none"
                                    >
                                        <span>Jetzt starten</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ) : (
                                    <Link
                                        href="/kontakt"
                                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-none hover:bg-red-700 transition-all duration-300 font-light text-sm tracking-wide group outline-none focus:outline-none"
                                    >
                                        <span>Jetzt starten</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                    }`}
            >
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                />
                <div
                    className={`absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-500 flex flex-col ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div className="p-8 pt-24 flex-1">
                        <nav className="flex flex-col gap-6">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-xl font-light text-gray-800 hover:text-red-600 transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="p-8 border-t border-gray-100 flex flex-col gap-4">
                        <a
                            href="tel:+436769000955"
                            className="flex items-center justify-center gap-3 w-full py-4 bg-[#172554] text-white font-light rounded-none active:scale-95 transition-all"
                        >
                            <Phone className="w-5 h-5" />
                            <span>Gerne Anrufen</span>
                        </a>
                        {onFormOpen ? (
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onFormOpen?.();
                                }}
                                className="flex items-center justify-center gap-3 w-full py-4 bg-red-600 text-white font-light rounded-none active:scale-95 transition-all"
                            >
                                <span>Jetzt starten</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <Link
                                href="/kontakt"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center gap-3 w-full py-4 bg-red-600 text-white font-light rounded-none active:scale-95 transition-all"
                            >
                                <span>Jetzt starten</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
