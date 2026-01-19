import type { MetadataRoute } from 'next'
import { getAllBlogPostsSitemap } from '@/lib/blog/sitemap-utils'

export const runtime = 'nodejs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://web.redrabbit.media'
    const currentDate = new Date().toISOString().split('T')[0]

    // Fetch all blog posts dynamically (lightweight version)
    const allPosts = await getAllBlogPostsSitemap();

    const blogEntries: MetadataRoute.Sitemap = allPosts.map(post => ({
        url: `${baseUrl}/tipps/${post.slug}`,
        lastModified: post.publishedAt || currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    const staticRoutes: MetadataRoute.Sitemap = [
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

        // Blog Index
        {
            url: `${baseUrl}/tipps`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
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

        // Cookie Settings
        {
            url: `${baseUrl}/cookie-einstellungen`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.2,
        },
    ];

    return [...staticRoutes, ...blogEntries];
}
