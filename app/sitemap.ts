import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://web.redrabbit.media'
    const currentDate = new Date().toISOString().split('T')[0]

    return [
        // Homepage - Höchste Priorität
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 1.0,
        },

        // Niche / Branchen Pages (High Growth)
        {
            url: `${baseUrl}/branchen/handwerk`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/branchen/aerzte`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/branchen/dienstleister`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.9,
        },

        // Legal Pages
        {
            url: `${baseUrl}/impressum`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/datenschutz`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/agb`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.3,
        },

        // Blog / Tipps Section & Master Article
        {
            url: `${baseUrl}/tipps`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/tipps/was-kostet-eine-website`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.9, // Pillars get higher priority
        },
        {
            url: `${baseUrl}/tipps/website-selbst-erstellen-vs-agentur`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/tipps/10-fehler-beim-website-erstellen`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/tipps/wie-lange-dauert-website-erstellung`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/tipps/restaurant-website-must-haves`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
        },

        // City Hub Pages (The 9 Capitals)
        {
            url: `${baseUrl}/webdesign-wien`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/webdesign-graz`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/webdesign-linz`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/webdesign-salzburg`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/webdesign-innsbruck`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/webdesign-klagenfurt`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        // Removed Villach & Wels from priority map (Quality Strategy)
        {
            url: `${baseUrl}/webdesign-st-poelten`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/webdesign-bregenz`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/webdesign-eisenstadt`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
        },

        // Bundesland Hub Pages (Regional SEO Strategy)
        {
            url: `${baseUrl}/webdesign-oberoesterreich`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/webdesign-niederoesterreich`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/webdesign-steiermark`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/webdesign-tirol`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/webdesign-kaernten`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/webdesign-vorarlberg`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/webdesign-burgenland`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/webdesign-salzburg`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },

        // Cookie Settings
        {
            url: `${baseUrl}/cookie-einstellungen`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
    ]
}
