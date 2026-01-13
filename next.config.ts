/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSR + ISR Hybrid für beste SEO-Performance
  output: 'standalone',

  // Performance Optimierungen
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
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
      // Stadt-Seiten → Haupt-Seite mit Anchor
      {
        source: '/webdesign-graz',
        destination: '/webdesign-wien#staedte',
        permanent: true,
      },
      {
        source: '/webdesign-linz',
        destination: '/webdesign-wien#staedte',
        permanent: true,
      },
      {
        source: '/webdesign-salzburg',
        destination: '/webdesign-wien#staedte',
        permanent: true,
      },
      {
        source: '/webdesign-innsbruck',
        destination: '/webdesign-wien#staedte',
        permanent: true,
      },
      {
        source: '/webdesign-klagenfurt',
        destination: '/webdesign-wien#staedte',
        permanent: true,
      },
      {
        source: '/webdesign-villach',
        destination: '/webdesign-wien#staedte',
        permanent: true,
      },
      {
        source: '/webdesign-wels',
        destination: '/webdesign-wien#staedte',
        permanent: true,
      },
      {
        source: '/webdesign-st-poelten',
        destination: '/webdesign-wien#staedte',
        permanent: true,
      },
      {
        source: '/webdesign-dornbirn',
        destination: '/webdesign-wien#staedte',
        permanent: true,
      },
      {
        source: '/webdesign-bregenz',
        destination: '/webdesign-wien#staedte',
        permanent: true,
      },
      {
        source: '/webdesign-eisenstadt',
        destination: '/webdesign-wien#staedte',
        permanent: true,
      },
      // Bundesland-Seiten → Regionen
      {
        source: '/webdesign-niederoesterreich',
        destination: '/webdesign-wien#regionen',
        permanent: true,
      },
      {
        source: '/webdesign-oberoesterreich',
        destination: '/webdesign-wien#regionen',
        permanent: true,
      },
      {
        source: '/webdesign-tirol',
        destination: '/webdesign-wien#regionen',
        permanent: true,
      },
      {
        source: '/webdesign-vorarlberg',
        destination: '/webdesign-wien#regionen',
        permanent: true,
      },
      {
        source: '/webdesign-kaernten',
        destination: '/webdesign-wien#regionen',
        permanent: true,
      },
      {
        source: '/webdesign-steiermark',
        destination: '/webdesign-wien#regionen',
        permanent: true,
      },
      {
        source: '/webdesign-burgenland',
        destination: '/webdesign-wien#regionen',
        permanent: true,
      },
    ]
  },

  // Headers für SEO & Security
  async headers() {
    return [
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://tagmanager.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net; frame-src https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'self';",
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
