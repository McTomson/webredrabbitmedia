import React from 'react';

interface VideoEmbedProps {
    // YouTube video id, e.g. "f8QS2zGI-K8"
    id: string;
    title?: string;
}

// Responsive 16:9 YouTube embed. Uses youtube-nocookie for a privacy-friendly default,
// matching the site's cookie-conscious approach. Lazy-loaded so it never blocks the article.
export function VideoEmbed({ id, title = 'Video' }: VideoEmbedProps) {
    return (
        <figure className="w-full my-8">
            <div
                className="relative w-full overflow-hidden rounded-xl border border-zinc-800 shadow-lg"
                style={{ aspectRatio: '16 / 9' }}
            >
                <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${id}`}
                    title={title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                />
            </div>
            {title && (
                <figcaption className="mt-2 text-sm text-gray-500 text-center">{title}</figcaption>
            )}
        </figure>
    );
}
