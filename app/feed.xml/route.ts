import { getAllPosts } from '@/lib/blog/posts';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await getAllPosts();

  const rssItems = posts
    .map((post) => {
      const url = `https://web.redrabbit.media/tipps/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${post.category}]]></category>
      <author>office@redrabbit.media (Red Rabbit Media)</author>
      ${post.featuredImage ? `<enclosure url="${post.featuredImage}" type="image/jpeg" />` : ''}
    </item>`;
    })
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Red Rabbit Media - Website Tipps &amp; Webdesign Blog</title>
    <link>https://web.redrabbit.media</link>
    <description>Professionelle Tipps für Webdesign, SEO und digitale Präsenz. Von Experten für KMU in Österreich.</description>
    <language>de-AT</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://web.redrabbit.media/feed.xml" rel="self" type="application/rss+xml"/>
    <copyright>Copyright ${new Date().getFullYear()} Red Rabbit Media</copyright>
    <managingEditor>office@redrabbit.media (Red Rabbit Media)</managingEditor>
    <webMaster>office@redrabbit.media (Red Rabbit Media)</webMaster>
    <category>Webdesign</category>
    <category>SEO</category>
    <category>Digital Marketing</category>
    <image>
      <url>https://web.redrabbit.media/logo.png</url>
      <title>Red Rabbit Media</title>
      <link>https://web.redrabbit.media</link>
    </image>${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
