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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://tagmanager.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://region1.google-analytics.com; frame-src https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'self';",
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
