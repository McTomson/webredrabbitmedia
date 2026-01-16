import Image from 'next/image';
import Link from 'next/link';

/**
 * Sidebar About Section Komponente
 * Zeigt Informationen über Red Rabbit Media
 * - Logo
 * - Kurzbeschreibung
 * - Stats
 * - CTA Button
 */
export function SidebarAbout() {
    const stats = [
        { value: '315+', label: 'Projekte' },
        { value: '4.8/5', label: 'Rating' },
        { value: '2016', label: 'Seit' }
    ];

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            {/* Logo */}
            <div className="mb-6">
                <Image
                    src="/images/hero/redrabbitmedialogo.png"
                    alt="Red Rabbit Media"
                    width={180}
                    height={60}
                    className="h-12 w-auto"
                />
            </div>

            {/* Headline */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">
                Über Red Rabbit Labs
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Wir sind Ihre Premium-Digitalagentur aus Österreich. Spezialisiert auf
                High-Performance Websites mit Next.js, SEO-Exzellenz und modernem Design.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
                {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className="text-2xl font-bold text-red-600">{stat.value}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* CTA Button */}
            <Link
                href="/uber-uns"
                className="block w-full px-5 py-3 bg-gray-900 text-white text-center rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-300"
            >
                Mehr über uns erfahren
            </Link>
        </div>
    );
}
