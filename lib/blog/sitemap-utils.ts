import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { branches } from '@/app/branchen/[slug]/data';

const APP_DIR = path.join(process.cwd(), 'app');
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

// 3. Get Static Pages (Recursive Scan)
export async function getAllStaticPagesSitemap(): Promise<SitemapEntry[]> {
    const pages: SitemapEntry[] = [];

    function scanDirectory(currentPath: string, route: string) {
        if (!fs.existsSync(currentPath)) return;

        const items = fs.readdirSync(currentPath, { withFileTypes: true });

        for (const item of items) {
            if (item.isDirectory()) {
                // Ignore special folders
                if (item.name.startsWith('api') || item.name.startsWith('_') || item.name.startsWith('.')) continue;
                // Ignore dynamic routes (handled by other functions)
                if (item.name.includes('[') || item.name.includes(']')) continue;

                // Handle Route Groups (e.g. (marketing)) - don't add to URL
                if (item.name.startsWith('(') && item.name.endsWith(')')) {
                    scanDirectory(path.join(currentPath, item.name), route);
                } else {
                    scanDirectory(path.join(currentPath, item.name), `${route}/${item.name}`);
                }
            } else if (item.isFile()) {
                if (item.name === 'page.tsx' || item.name === 'page.js') {
                    // It's a page!
                    pages.push({
                        url: route === '' ? BASE_URL : `${BASE_URL}${route}`,
                        lastModified: new Date().toISOString(),
                        changeFrequency: 'monthly',
                        priority: route === '' ? 1.0 : 0.8, // Homepage = 1.0, others 0.8 default
                    });
                }
            }
        }
    }

    try {
        scanDirectory(APP_DIR, '');
        return pages;
    } catch (error) {
        console.error('Error in getAllStaticPagesSitemap:', error);
        return [];
    }
}
