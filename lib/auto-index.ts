// Auto-Indexierung für neue Blog-Posts
export async function notifyGoogleOfNewPost(slug: string) {
    const url = `https://web.redrabbit.media/tipps/${slug}`;

    try {
        // 1. Google Indexing API
        const indexResponse = await fetch('/api/indexing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, type: 'URL_UPDATED' }),
        });

        if (!indexResponse.ok) {
            console.error('Indexing API failed:', await indexResponse.text());
        }

        // 2. Update Sitemap (wird automatisch generiert)
        // Next.js generiert Sitemap dynamisch

        // 3. Ping Search Engines
        await pingSearchEngines();

        console.log(`✅ Successfully notified search engines about: ${url}`);
        return { success: true, url };

    } catch (error) {
        console.error('Failed to notify search engines:', error);
        return { success: false, error };
    }
}

// Ping Search Engines über Sitemap
async function pingSearchEngines() {
    const sitemapUrl = 'https://web.redrabbit.media/sitemap.xml';

    try {
        await Promise.all([
            fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`),
            fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`),
        ]);
        console.log('✅ Pinged Google and Bing');
    } catch (error) {
        console.error('Failed to ping search engines:', error);
    }
}

// Batch-Indexierung für mehrere URLs
export async function batchNotifyGoogle(urls: string[]) {
    const results = await Promise.allSettled(
        urls.map(url =>
            fetch('/api/indexing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, type: 'URL_UPDATED' }),
            })
        )
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Batch indexing: ${successful} successful, ${failed} failed`);
    return { successful, failed, total: urls.length };
}

// Remove URL from index
export async function removeFromIndex(slug: string) {
    const url = `https://web.redrabbit.media/tipps/${slug}`;

    try {
        const response = await fetch('/api/indexing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, type: 'URL_DELETED' }),
        });

        return await response.json();
    } catch (error) {
        console.error('Failed to remove from index:', error);
        return { success: false, error };
    }
}
