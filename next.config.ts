/** @type {import('next').NextConfig} */
const nextConfig = {
  // Talos: @splinetool/loader ist gegen three 0.149 gebaut (Haupt-App: 0.185).
  // Alle three-Importe AUS @splinetool-Paketen werden auf das isolierte Paket
  // `three-spline` (npm-Alias auf three@0.149) umgeleitet; die Haupt-App
  // bleibt unberuehrt.
  webpack: (
    config: { plugins: unknown[] },
    { webpack }: { webpack: { NormalModuleReplacementPlugin: new (re: RegExp, fn: (res: { request: string; contextInfo?: { issuer?: string } }) => void) => unknown } }
  ) => {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^three($|\/)/, (resource) => {
        if ((resource.contextInfo?.issuer ?? '').includes('@splinetool')) {
          resource.request = resource.request.replace(/^three/, 'three-spline')
        }
      })
    )
    return config
  },
  // SSR + ISR Hybrid für beste SEO-Performance
  output: 'standalone',

  // Performance Optimierungen
  outputFileTracingRoot: __dirname,
  // Der fs-Bildcheck im Artikel-Template (ArticleImg) verleitet das Tracing,
  // den kompletten public/-Ordner (>1 GB Medien) in die Route-Funktion zu
  // packen -> Vercel-250-MB-Limit, Deploy-Abbruch (22.07.). Die Route ist
  // SSG (dynamicParams=false), die Funktion braucht public/ nie.
  outputFileTracingExcludes: {
    '/tipps/[slug]': ['./public/**'],
  },
  // Der Blog-Dashboard-Tab liest zur Laufzeit den Medien-Marker-Ordner
  // (.media-requests, ein Dot-Verzeichnis -> nft übersieht es sonst) und die
  // Artikel-MDX. Explizit einbündeln, sonst zeigt der Tab in Prod fälschlich 0.
  outputFileTracingIncludes: {
    '/dashboard/blog': [
      './content-engine/.media-requests/**',
      './content/blog/**',
      './content-engine/status/**',
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 384, 420, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'web.redrabbit.media',
      },
    ],
  },

  // SEO - 301 Redirects für konsolidierte Landing Pages
  async redirects() {
    return [
      // === Go-Live-Tausch: alte Preview-Praefixe auf Root ===
      // Alte /relaunch-preview-Links (intern/geteilt) auf den finalen Root-Pfad.
      {
        source: '/relaunch-preview/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/relaunch-preview',
        destination: '/',
        permanent: true,
      },

      // === Go-Live: alte Landeshauptstadt-Seiten auf die Bundesland-Hubs ===
      // (Salzburg NICHT: /webdesign-salzburg existiert neu 1:1.)
      {
        source: '/webdesign-graz',
        destination: '/webdesign-steiermark',
        permanent: true,
      },
      {
        source: '/webdesign-linz',
        destination: '/webdesign-oberoesterreich',
        permanent: true,
      },
      {
        source: '/webdesign-innsbruck',
        destination: '/webdesign-tirol',
        permanent: true,
      },
      {
        source: '/webdesign-klagenfurt',
        destination: '/webdesign-kaernten',
        permanent: true,
      },
      {
        source: '/webdesign-st-poelten',
        destination: '/webdesign-niederoesterreich',
        permanent: true,
      },
      {
        source: '/webdesign-bregenz',
        destination: '/webdesign-vorarlberg',
        permanent: true,
      },
      {
        source: '/webdesign-eisenstadt',
        destination: '/webdesign-burgenland',
        permanent: true,
      },
      // === Go-Live: entfernte Branchen-Seiten auf die Startseite ===
      {
        source: '/branchen',
        destination: '/',
        permanent: true,
      },
      {
        source: '/branchen/handwerk',
        destination: '/',
        permanent: true,
      },
      {
        source: '/branchen/gastronomie',
        destination: '/',
        permanent: true,
      },
      {
        source: '/branchen/einzelhandel',
        destination: '/',
        permanent: true,
      },
      {
        source: '/branchen/dienstleistung',
        destination: '/',
        permanent: true,
      },
      {
        source: '/branchen/aerzte',
        destination: '/',
        permanent: true,
      },

      // === Go-Live: alte Leistungs-Unterseiten auf die neuen zwei Produkte ===
      {
        source: '/leistungen/webdesign',
        destination: '/leistungen/website',
        permanent: true,
      },
      {
        source: '/leistungen/seo',
        destination: '/leistungen/website',
        permanent: true,
      },
      {
        source: '/leistungen/dashboard',
        destination: '/leistungen/talos',
        permanent: true,
      },
      {
        source: '/leistungen/ki-sichtbarkeit',
        destination: '/leistungen/talos',
        permanent: true,
      },

      // Oberösterreich - Secondary cities → Bundesland hub
      {
        source: '/webdesign-wels',
        destination: '/webdesign-oberoesterreich',
        permanent: true,
      },
      {
        source: '/webdesign-steyr',
        destination: '/webdesign-oberoesterreich',
        permanent: true,
      },
      {
        source: '/webdesign-braunau',
        destination: '/webdesign-oberoesterreich',
        permanent: true,
      },
      {
        source: '/webdesign-voecklabruck',
        destination: '/webdesign-oberoesterreich',
        permanent: true,
      },

      // Steiermark - Secondary cities → Bundesland hub (to be created)
      {
        source: '/webdesign-leoben',
        destination: '/webdesign-steiermark',
        permanent: true,
      },
      {
        source: '/webdesign-kapfenberg',
        destination: '/webdesign-steiermark',
        permanent: true,
      },

      // Tirol - Secondary cities → Bundesland hub (to be created)
      {
        source: '/webdesign-kufstein',
        destination: '/webdesign-tirol',
        permanent: true,
      },
      {
        source: '/webdesign-woergl',
        destination: '/webdesign-tirol',
        permanent: true,
      },

      // Kärnten - Secondary cities → Bundesland hub (to be created)
      {
        source: '/webdesign-villach',
        destination: '/webdesign-kaernten',
        permanent: true,
      },
      {
        source: '/webdesign-spittal',
        destination: '/webdesign-kaernten',
        permanent: true,
      },
      // Kärnten-Orte aus GSC-404-Altbestand (15.06.): themenrelevant auf den
      // Kärnten-Hub statt über den Catch-all auf die Startseite (Soft-404-Schutz).
      {
        source: '/webdesign-feldkirchen',
        destination: '/webdesign-kaernten',
        permanent: true,
      },
      {
        source: '/webdesign-voelkermarkt',
        destination: '/webdesign-kaernten',
        permanent: true,
      },

      // Vorarlberg - Secondary cities → Bundesland hub (to be created)
      {
        source: '/webdesign-dornbirn',
        destination: '/webdesign-vorarlberg',
        permanent: true,
      },
      {
        source: '/webdesign-feldkirch',
        destination: '/webdesign-vorarlberg',
        permanent: true,
      },

      // Niederösterreich - Secondary cities → Bundesland hub (to be created)
      {
        source: '/webdesign-wiener-neustadt',
        destination: '/webdesign-niederoesterreich',
        permanent: true,
      },
      {
        source: '/webdesign-krems',
        destination: '/webdesign-niederoesterreich',
        permanent: true,
      },
      {
        source: '/webdesign-baden',
        destination: '/webdesign-niederoesterreich',
        permanent: true,
      },
      // Fix for umlaut URL
      {
        source: '/webdesign-kärnten',
        destination: '/webdesign-kaernten',
        permanent: true,
      },
      {
        source: '/webdesign-k%C3%A4rnten',
        destination: '/webdesign-kaernten',
        permanent: true,
      },
      // Generic redirects for legacy paths
      {
        source: '/uber-uns',
        destination: '/#about',
        permanent: true,
      },
      // Slug-Hygiene 2026-06-12: abgeschnittene Auto-Slugs auf kurze Keyword-Slugs
      // umgezogen. 301 erhaelt die (geringe) Linkkraft + indexierte URLs.
      {
        source: '/tipps/was-ist-der-unterschied-zwischen-reinem-grafikdesign-und-funktionalem',
        destination: '/tipps/grafikdesign-vs-webdesign',
        permanent: true,
      },
      {
        source: '/tipps/was-ist-der-technologische-unterschied-zwischen-einer-statischen-und',
        destination: '/tipps/statische-vs-dynamische-website',
        permanent: true,
      },
      {
        source: '/tipps/wie-veraendern-ki-technologien-die-erstellung-von-modernen-websites',
        destination: '/tipps/ki-website-erstellung',
        permanent: true,
      },
      {
        source: '/tipps/was-ist-generative-engine-optimization-geo-und-warum-ersetzt',
        destination: '/tipps/generative-engine-optimization',
        permanent: true,
      },
      // SEO 2026-08-12: fehlende Redirect-Luecken (Sekundaerstaedte + Branche + Umlaut)
      {
        source: '/webdesign-schwaz',
        destination: '/webdesign-tirol',
        permanent: true,
      },
      {
        source: '/webdesign-oberwart',
        destination: '/webdesign-burgenland',
        permanent: true,
      },
      {
        source: '/webdesign-hohenems',
        destination: '/webdesign-vorarlberg',
        permanent: true,
      },
      // Umlaut-Quelle: Next.js matcht die dekodierte pathname; percent-encodete
      // Variante zusaetzlich (wie /webdesign-kärnten oben) fuer maximale Robustheit.
      {
        source: '/webdesign-oberösterreich',
        destination: '/webdesign-oberoesterreich',
        permanent: true,
      },
      {
        source: '/webdesign-ober%C3%B6sterreich',
        destination: '/webdesign-oberoesterreich',
        permanent: true,
      },
      {
        source: '/branchen/dienstleister',
        destination: '/',
        permanent: true,
      },

      // === CATCH-ALL fuer unbekannte /webdesign-<stadt>-URLs (SEO 2026-08-12) ===
      // MUSS die ALLERLETZTE Redirect-Regel bleiben: Next.js matcht in Reihenfolge,
      // der erste Treffer gewinnt. Alle expliziten Stadt->Bundesland-Redirects und
      // Umlaut-Fixes oben greifen daher zuerst; nur was NICHTS davon trifft, landet
      // hier und wird 308 auf die Startseite '/' geleitet — damit alte/verlinkte
      // Klein-Stadt-Slugs (die nie eine echte Seite waren) keine Linkkraft in 404s
      // verlieren.
      //
      // Die 9 ECHTEN Bundesland-Seiten (burgenland ... wien) sind per Negativ-
      // Lookahead ausgeschlossen, damit sie NICHT vom Catch-all geschluckt werden,
      // sondern normal mit 200 laden.
      //
      // >>> OVERRIDE-HINWEIS (WICHTIG): Wird spaeter eine ECHTE
      //     /webdesign-<stadt>-Seite gebaut (z.B. app/webdesign-graz/page.tsx),
      //     MUSS ihr Slug hier in den Negativ-Lookahead aufgenommen werden
      //     (analog zu den Bundeslaendern). Sonst wuerde diese Regel — sie laeuft
      //     VOR dem Filesystem-Routing — die neue Seite weiterhin auf '/' umleiten,
      //     statt sie normal laden zu lassen. Neue echte Stadt-Seite = Slug hier
      //     eintragen. <<<
      {
        source:
          '/webdesign-:slug((?!burgenland|kaernten|niederoesterreich|oberoesterreich|salzburg|steiermark|tirol|vorarlberg|wien).+)',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // Headers für SEO & Security
  async headers() {
    return [
      {
        // Hero-Videos/Poster haben stabile Dateinamen (bei Ersatz Query-Version
        // anhaengen) -> langlebig immutable cachen (Repeat-View/Navigation, Thomas 04.08.).
        source: '/hero/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          // SEO Headers
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large',
          },
          // Security Headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
          // HTTPS Strict Transport Security (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Content Security Policy (CSP) - Optimized for GTM
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://tagmanager.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://prod.spline.design https://unpkg.com https://chat.redrabbit.media; worker-src 'self' blob:; frame-src https://www.googletagmanager.com https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
    ]
  },

  // Compression
  compress: true,

  // Experimental Features für Performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

export default nextConfig
