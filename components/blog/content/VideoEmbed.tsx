"use client";

import React, { useState } from 'react';

interface VideoEmbedProps {
    // YouTube video id, e.g. "f8QS2zGI-K8" — still used for the "watch on YouTube" link
    id?: string;
    // Self-hosted MP4 URL (e.g. /videos/slug-video.mp4). When set, HTML5 <video> is used
    // instead of the YouTube iframe — never blocked by content filters.
    src?: string;
    // Poster image URL for the HTML5 player. Should also be self-hosted.
    poster?: string;
    title?: string;
}

export function VideoEmbed({ id, src, poster, title = 'Video' }: VideoEmbedProps) {
    const [play, setPlay] = useState(false);

    // Self-hosted path: HTML5 <video> — never blocked, always plays
    if (src) {
        return (
            <figure className="w-full my-8">
                <div
                    className="relative w-full overflow-hidden rounded-xl border border-zinc-800 shadow-lg bg-zinc-900"
                    style={{ aspectRatio: '16 / 9' }}
                >
                    <video
                        className="absolute inset-0 h-full w-full"
                        controls
                        preload="metadata"
                        poster={poster}
                    >
                        <source src={src} type="video/mp4" />
                    </video>
                </div>
                <figcaption className="mt-2 text-sm text-gray-500 text-center">
                    {id ? (
                        <a href={`https://youtu.be/${id}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {title}
                        </a>
                    ) : (
                        title
                    )}
                </figcaption>
            </figure>
        );
    }

    // YouTube fallback path (used when no self-hosted src is available)
    if (!id) return null;
    const ytPoster = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    const ytFallbackPoster = `https://i.ytimg.com/vi/${id}/0.jpg`;

    return (
        <figure className="w-full my-8">
            <div
                className="relative w-full overflow-hidden rounded-xl border border-zinc-800 shadow-lg bg-zinc-900"
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
                            src={ytPoster}
                            alt=""
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover"
                            onError={(e) => {
                                const img = e.currentTarget;
                                if (img.dataset.fallback !== '1') {
                                    img.dataset.fallback = '1';
                                    img.src = ytFallbackPoster;
                                } else {
                                    img.style.display = 'none';
                                }
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
            <figcaption className="mt-2 text-sm text-gray-500 text-center">
                <a href={`https://youtu.be/${id}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {title}
                </a>
            </figcaption>
        </figure>
    );
}
