import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface InlineCTAProps {
    variant?: 'primary' | 'secondary' | 'info';
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    icon?: React.ReactNode;
}

/**
 * Inline CTA Komponente
 * Kann an verschiedenen Stellen im Content eingefügt werden
 * Varianten: primary, secondary, info
 */
export function InlineCTA({
    variant = 'primary',
    title,
    description,
    buttonText,
    buttonLink,
    icon
}: InlineCTAProps) {
    const styles = {
        primary: {
            bg: 'bg-gradient-to-r from-red-600 to-orange-600',
            text: 'text-white',
            button: 'bg-white text-red-600 hover:bg-gray-100'
        },
        secondary: {
            bg: 'bg-gray-50',
            text: 'text-gray-900',
            button: 'bg-red-600 text-white hover:bg-red-700'
        },
        info: {
            bg: 'bg-blue-50',
            text: 'text-gray-900',
            button: 'bg-blue-600 text-white hover:bg-blue-700'
        }
    };

    const style = styles[variant];

    return (
        <div className={`my-12 p-8 rounded-2xl shadow-lg ${style.bg}`}>
            <div className="flex flex-col md:flex-row items-center gap-6">
                {icon && (
                    <div className="flex-shrink-0">
                        {icon}
                    </div>
                )}
                <div className="flex-1 text-center md:text-left">
                    <h3 className={`text-2xl font-bold mb-2 ${style.text}`}>
                        {title}
                    </h3>
                    <p className={`text-lg mb-4 ${style.text} ${variant === 'primary' ? 'opacity-90' : ''}`}>
                        {description}
                    </p>
                    <Link
                        href={buttonLink}
                        className={`inline-flex items-center gap-2 px-8 py-4 rounded-none font-bold text-lg transition-all shadow-md hover:shadow-xl hover:-translate-y-1 duration-300 ${style.button}`}
                    >
                        {buttonText}
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
