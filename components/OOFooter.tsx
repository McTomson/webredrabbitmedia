"use client";

import Link from 'next/link';

export default function OOFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Spalte 1: Kontakt */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Red Rabbit Media</h3>
            <div className="space-y-4 text-gray-400">
              <p>Hauptsitz Wien</p>
              <p className="text-white font-medium">Mobil in ganz Oberösterreich</p>
              <p>Grabnergasse 8, 1060 Wien</p>
              <p className="border-t border-gray-800 pt-4 mt-4">
                Persönliche Beratung in Linz, Wels, Steyr und ganz OÖ nach Vereinbarung.
              </p>
              <a href="mailto:office@redrabbit.media" className="block text-red-500 hover:text-red-400 transition-colors">
                office@redrabbit.media
              </a>
            </div>
          </div>
          
          {/* Spalte 2: Webdesign in OÖ */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Webdesign in OÖ</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/webdesign-linz" className="hover:text-white transition-colors">
                  Webdesign Linz
                </Link>
              </li>
              {/* Wels/Steyr nur verlinken wenn sie existieren - da unklar, hier placeholder oder auskommentiert */}
              {/* <li><Link href="/webdesign-wels" className="hover:text-white transition-colors">Webdesign Wels</Link></li> */}
              <li>
                <span className="text-gray-600">Webdesign Wels (bald verfügbar)</span>
              </li>
               <li>
                <span className="text-gray-600">Webdesign Steyr (bald verfügbar)</span>
              </li>
            </ul>
          </div>
          
          {/* Spalte 3: Webdesign Österreich */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Österreichweit</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/webdesign-wien" className="hover:text-white transition-colors">Webdesign Wien</Link></li>
              <li><Link href="/webdesign-niederoesterreich" className="hover:text-white transition-colors">Webdesign Niederösterreich</Link></li>
              <li><Link href="/webdesign-salzburg" className="hover:text-white transition-colors">Webdesign Salzburg</Link></li>
              <li><Link href="/webdesign-steiermark" className="hover:text-white transition-colors">Webdesign Steiermark</Link></li>
              <li><Link href="/webdesign-tirol" className="hover:text-white transition-colors">Webdesign Tirol</Link></li>
              <li><Link href="/webdesign-kaernten" className="hover:text-white transition-colors">Webdesign Kärnten</Link></li>
              <li><Link href="/webdesign-burgenland" className="hover:text-white transition-colors">Webdesign Burgenland</Link></li>
              <li><Link href="/webdesign-vorarlberg" className="hover:text-white transition-colors">Webdesign Vorarlberg</Link></li>
            </ul>
          </div>

          {/* Spalte 4: Rechtliches */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Rechtliches</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link></li>
              <li><Link href="/agb" className="hover:text-white transition-colors">AGB</Link></li>
              <li className="pt-4">
                <Link href="/" className="text-white hover:text-red-500 font-medium transition-colors">
                  Mehr über Red Rabbit Media →
                </Link>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© {currentYear} Red Rabbit Media. Alle Rechte vorbehalten.</p>
          <p className="mt-2 text-gray-600">Handcrafted with ❤️ & ☕️ in Austria</p>
        </div>
      </div>
    </footer>
  );
}
