import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { branches } from '@/app/branchen/data';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');
const BASE_URL = 'https://web.redrabbit.media';

export interface SitemapEntry {
    url: string;
    lastModified?: string;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
}

// 1. Get Blog Posts
export async function getAllBlogPostsSitemap(): Promise<SitemapEntry[]> {
    try {
        if (!fs.existsSync(BLOG_DIR)) return [];
        const files = fs.readdirSync(BLOG_DIR);
        return files
            .filter((file) => file.endsWith('.mdx'))
            .map((file) => {
                const slug = file.replace('.mdx', '');
                const filePath = path.join(BLOG_DIR, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const { data } = matter(fileContent);
                return {
                    url: `${BASE_URL}/tipps/${slug}`,
                    lastModified: data.publishedAt || new Date().toISOString(),
                    changeFrequency: 'monthly',
                    priority: 0.7,
                };
            });
    } catch (error) {
        console.error('Error in getAllBlogPostsSitemap:', error);
        return [];
    }
}

// 2. Get Branchen Pages
export async function getAllBranchenSitemap(): Promise<SitemapEntry[]> {
    return Object.keys(branches).map((slug) => ({
        url: `${BASE_URL}/branchen/${slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.9,
    }));
}

// 3. Get Static Pages (Safe Static List)
export async function getAllStaticPagesSitemap(): Promise<SitemapEntry[]> {
    const currentDate = new Date().toISOString();
    return [
        // Homepage
        { url: BASE_URL, lastModified: currentDate, changeFrequency: 'weekly', priority: 1.0 },

        // Legal Pages
        { url: `${BASE_URL}/impressum`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/datenschutz`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/agb`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/cookie-einstellungen`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.2 },

        // Blog Index
        { url: `${BASE_URL}/tipps`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },

        // City Hub Pages (The 9 Capitals)
        { url: `${BASE_URL}/webdesign-wien`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${BASE_URL}/webdesign-graz`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/webdesign-linz`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/webdesign-salzburg`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/webdesign-innsbruck`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/webdesign-klagenfurt`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/webdesign-st-poelten`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/webdesign-bregenz`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/webdesign-eisenstadt`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },

        // Bundesland Hub Pages
        { url: `${BASE_URL}/webdesign-oberoesterreich`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${BASE_URL}/webdesign-niederoesterreich`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/webdesign-steiermark`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/webdesign-tirol`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/webdesign-kaernten`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/webdesign-vorarlberg`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/webdesign-burgenland`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
    ];
}
