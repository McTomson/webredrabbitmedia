"use client";

import React, { useState } from 'react';

interface VideoEmbedProps {
    // YouTube video id, e.g. "f8QS2zGI-K8"
    id: string;
    title?: string;
}

// Robust, privacy-friendly YouTube embed (lite pattern). Shows the YouTube poster image with
// a play button and only loads the youtube-nocookie iframe on click. This keeps the article
// fast, avoids cookies until the user opts in, and never renders a broken iframe placeholder
// if the embed is slow or momentarily blocked. The poster falls back to a lower-res thumbnail
// if the hq image is missing.
export function VideoEmbed({ id, title = 'Video' }: VideoEmbedProps) {
    const [play, setPlay] = useState(false);
    const poster = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    const fallbackPoster = `https://i.ytimg.com/vi/${id}/0.jpg`;

    return (
        <figure className="w-full my-8">
            <div
                className="relative w-full overflow-hidden rounded-xl border border-zinc-800 shadow-lg bg-black"
                style={{ aspectRatio: '16 / 9' }}
            >
                {play ? (
                    <iframe
                        className="absolute inset-0 h-full w-full"
                        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() => setPlay(true)}
                        aria-label={`Video abspielen: ${title}`}
                        className="group absolute inset-0 h-full w-full cursor-pointer"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={poster}
                            alt={title}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover"
                            onError={(e) => {
                                const img = e.currentTarget;
                                if (img.src !== fallbackPoster) img.src = fallbackPoster;
                            }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center">
                            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/70 shadow-lg transition-colors group-hover:bg-red-600">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-7 w-7 fill-white">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </span>
                        </span>
                    </button>
                )}
            </div>
            {title && (
                <figcaption className="mt-2 text-sm text-gray-500 text-center">{title}</figcaption>
            )}
        </figure>
    );
}
