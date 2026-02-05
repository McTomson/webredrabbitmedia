import React from 'react';

interface PodcastPlayerProps {
    embedUrl: string;
    title?: string;
    height?: number;
}

export function PodcastPlayer({
    embedUrl,
    title = "Podcast Episode",
    height = 400
}: PodcastPlayerProps) {
    // Ensure the URL is an embed URL
    const src = embedUrl.includes('/embed/')
        ? embedUrl
        : embedUrl.replace('/p/', '/embed/p/'); // Fallback basic conversion if needed, but specific ID logic is better handled by caller

    return (
        <div className="w-full my-8 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm">
            <iframe
                src={src}
                width="100%"
                height={height}
                style={{ border: 'none', background: 'transparent' }}
                title={title}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
            />
        </div>
    );
}
