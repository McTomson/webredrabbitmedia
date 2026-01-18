/**
 * IndexNow Helper Functions
 * 
 * IndexNow is a protocol that allows websites to instantly notify search engines
 * about new or updated content. Supported by Google, Bing, Yandex, and others.
 * 
 * @see https://www.indexnow.org/
 */

const INDEXNOW_ENDPOINTS = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow'
];

// Generate a random API key for IndexNow
// This should be stored in .env.local as INDEXNOW_API_KEY
export function generateIndexNowKey(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 32; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

interface IndexNowResponse {
    success: boolean;
    endpoint: string;
    status?: number;
    error?: string;
}

/**
 * Submit a single URL to IndexNow
 */
export async function submitUrlToIndexNow(url: string): Promise<IndexNowResponse[]> {
    const apiKey = process.env.INDEXNOW_API_KEY;

    if (!apiKey) {
        throw new Error('INDEXNOW_API_KEY not configured in environment variables');
    }

    const host = new URL(url).hostname;

    const payload = {
        host,
        key: apiKey,
        keyLocation: `https://${host}/${apiKey}.txt`,
        urlList: [url]
    };

    const results: IndexNowResponse[] = [];

    // Submit to all endpoints in parallel
    const promises = INDEXNOW_ENDPOINTS.map(async (endpoint) => {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(payload)
            });

            return {
                success: response.ok,
                endpoint,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                endpoint,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    });

    const responses = await Promise.all(promises);
    results.push(...responses);

    return results;
}

/**
 * Submit multiple URLs to IndexNow (batch)
 * Maximum 10,000 URLs per request
 */
export async function submitBatchToIndexNow(urls: string[]): Promise<IndexNowResponse[]> {
    const apiKey = process.env.INDEXNOW_API_KEY;

    if (!apiKey) {
        throw new Error('INDEXNOW_API_KEY not configured in environment variables');
    }

    if (urls.length === 0) {
        throw new Error('URL list cannot be empty');
    }

    if (urls.length > 10000) {
        throw new Error('Maximum 10,000 URLs per batch request');
    }

    const host = new URL(urls[0]).hostname;

    const payload = {
        host,
        key: apiKey,
        keyLocation: `https://${host}/${apiKey}.txt`,
        urlList: urls
    };

    const results: IndexNowResponse[] = [];

    // Submit to all endpoints in parallel
    const promises = INDEXNOW_ENDPOINTS.map(async (endpoint) => {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(payload)
            });

            return {
                success: response.ok,
                endpoint,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                endpoint,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    });

    const responses = await Promise.all(promises);
    results.push(...responses);

    return results;
}

/**
 * Submit all URLs from sitemap to IndexNow
 */
export async function submitSitemapToIndexNow(sitemapUrl: string): Promise<IndexNowResponse[]> {
    try {
        // Fetch sitemap
        const response = await fetch(sitemapUrl);
        const sitemapXml = await response.text();

        // Extract URLs from sitemap (simple regex, works for basic sitemaps)
        const urlMatches = sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g);
        const urls = Array.from(urlMatches).map(match => match[1]);

        if (urls.length === 0) {
            throw new Error('No URLs found in sitemap');
        }

        // Submit in batches of 10,000
        const results: IndexNowResponse[] = [];
        for (let i = 0; i < urls.length; i += 10000) {
            const batch = urls.slice(i, i + 10000);
            const batchResults = await submitBatchToIndexNow(batch);
            results.push(...batchResults);
        }

        return results;
    } catch (error) {
        throw new Error(`Failed to process sitemap: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
