import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface SitemapPost {
    slug: string;
    publishedAt: string;
}

export async function getAllBlogPostsSitemap(): Promise<SitemapPost[]> {
    return [
        { slug: 'test-post', publishedAt: new Date().toISOString() }
    ];
}
