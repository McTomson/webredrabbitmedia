import { getAllPosts } from '@/lib/blog/posts';
import RSS from 'rss';

export async function GET() {
  const posts = await getAllPosts();

  const feed = new RSS({
    title: 'Red Rabbit Media - Website Tipps',
    description: 'Aktuelle Insights zu Webdesign, SEO und digitale Strategie für österreichische Unternehmen',
    site_url: 'https://web.redrabbit.media',
    feed_url: 'https://web.redrabbit.media/feed.xml',
    language: 'de-AT',
    pubDate: new Date().toUTCString(),
    copyright: `© ${new Date().getFullYear()} Red Rabbit Media`,
    managingEditor: 'office@redrabbit.media (Red Rabbit Media)',
    webMaster: 'office@redrabbit.media (Red Rabbit Media)',
    ttl: 60,
  });

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.excerpt,
      url: `https://web.redrabbit.media/tipps/${post.slug}`,
      date: post.publishedAt || new Date().toISOString(),
      author: 'Thomas Uhlir MBA',
      categories: post.tags || [post.category],
      enclosure: post.featuredImage ? {
        url: `https://web.redrabbit.media${post.featuredImage}`,
        type: 'image/jpeg',
      } : undefined,
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
