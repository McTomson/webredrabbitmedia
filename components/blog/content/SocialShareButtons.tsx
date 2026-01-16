"use client";

import { Share2, Linkedin, Twitter, Facebook, Mail } from 'lucide-react';
import { useState } from 'react';

interface SocialShareButtonsProps {
    url: string;
    title: string;
}

/**
 * Social Share Buttons Komponente
 * - LinkedIn, Twitter/X, Facebook, E-Mail Share
 * - Native Share API als Fallback (Mobile)
 * - Funktionierend mit korrekten Share-URLs
 * Position: Nach AuthorBio, statt Related Posts
 */
export function SocialShareButtons({ url, title }: SocialShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    // Share URLs
    const shareUrls = {
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Ich habe diesen interessanten Artikel gefunden: ${url}`)}`
    };

    // Native Share API (für Mobile)
    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    url: url,
                });
            } catch (err) {
                console.log('Share cancelled or failed:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            await copyToClipboard();
        }
    };

    // Copy URL to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Open share link in new window
    const openShareWindow = (shareUrl: string) => {
        window.open(
            shareUrl,
            'share-dialog',
            'width=626,height=436,location=no,toolbar=no,menubar=no'
        );
    };

    return (
        <section className="my-16 py-8 border-t border-gray-100">
            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Artikel teilen
                </h3>
                <p className="text-gray-600">
                    Hat Ihnen dieser Artikel gefallen? Teilen Sie ihn mit Ihrem Netzwerk!
                </p>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
                {/* LinkedIn */}
                <button
                    onClick={() => openShareWindow(shareUrls.linkedin)}
                    className="group flex items-center gap-2 px-6 py-3 bg-[#0077B5] text-white rounded-none font-semibold hover:bg-[#006399] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-300"
                    aria-label="Auf LinkedIn teilen"
                >
                    <Linkedin className="w-5 h-5" />
                    <span className="hidden sm:inline">LinkedIn</span>
                </button>

                {/* Twitter/X */}
                <button
                    onClick={() => openShareWindow(shareUrls.twitter)}
                    className="group flex items-center gap-2 px-6 py-3 bg-black text-white rounded-none font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-300"
                    aria-label="Auf X (Twitter) teilen"
                >
                    <Twitter className="w-5 h-5" />
                    <span className="hidden sm:inline">X</span>
                </button>

                {/* Facebook */}
                <button
                    onClick={() => openShareWindow(shareUrls.facebook)}
                    className="group flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white rounded-none font-semibold hover:bg-[#0C63D4] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-300"
                    aria-label="Auf Facebook teilen"
                >
                    <Facebook className="w-5 h-5" />
                    <span className="hidden sm:inline">Facebook</span>
                </button>

                {/* E-Mail */}
                <a
                    href={shareUrls.email}
                    className="group flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-none font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-300"
                    aria-label="Per E-Mail teilen"
                >
                    <Mail className="w-5 h-5" />
                    <span className="hidden sm:inline">E-Mail</span>
                </a>

                {/* Native Share / Copy Link */}
                <button
                    onClick={handleNativeShare}
                    className="group flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-none font-semibold hover:bg-red-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-300"
                    aria-label="Link teilen oder kopieren"
                >
                    <Share2 className="w-5 h-5" />
                    <span className="hidden sm:inline">
                        {copied ? 'Kopiert!' : 'Teilen'}
                    </span>
                </button>
            </div>

            {/* Optional: Stats */}
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    Helfen Sie uns, mehr Unternehmen mit wertvollen Insights zu erreichen
                </p>
            </div>
        </section>
    );
}
