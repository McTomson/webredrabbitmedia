import type { MetadataRoute } from 'next'
import { getAllBlogPostsSitemap, getAllBranchenSitemap, getAllStaticPagesSitemap } from '@/lib/blog/sitemap-utils'

export const runtime = 'nodejs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    // Fetch all sitemap entries from our automated utilities
    const [staticPages, branchenPages, blogPosts] = await Promise.all([
        getAllStaticPagesSitemap(),
        getAllBranchenSitemap(),
        getAllBlogPostsSitemap()
    ]);

    // Combine all entries
    return [...staticPages, ...branchenPages, ...blogPosts];
}
