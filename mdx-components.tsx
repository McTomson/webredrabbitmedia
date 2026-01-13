import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';

// Featured Snippet Component
function FeaturedSnippet({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="featured-snippet my-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-600 rounded-r-lg shadow-sm"
            itemScope
            itemType="https://schema.org/Answer"
        >
            <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <p className="text-sm font-semibold text-red-700 mb-2">Schnellantwort</p>
                    <p className="text-base leading-relaxed text-gray-800" itemProp="text">
                        {children}
                    </p>
                </div>
            </div>
        </div>
    );
}

// Table of Contents Component
function TableOfContents({ headings }: { headings: Array<{ id: string; text: string; level: number }> }) {
    return (
        <nav className="toc my-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Inhaltsverzeichnis</h2>
            <ul className="space-y-2">
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        style={{ marginLeft: `${(heading.level - 2) * 1}rem` }}
                        className="text-sm"
                    >
                        <Link
                            href={`#${heading.id}`}
                            className="text-gray-700 hover:text-red-600 transition-colors"
                        >
                            {heading.text}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

// Custom MDX Components
export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Headings with auto-generated IDs
        h1: ({ children, ...props }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900" {...props}>
                {children}
            </h1>
        ),
        h2: ({ children, ...props }) => {
            const id = typeof children === 'string'
                ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                : '';
            return (
                <h2 id={id} className="text-3xl font-bold mt-12 mb-4 text-gray-900 scroll-mt-20" {...props}>
                    {children}
                </h2>
            );
        },
        h3: ({ children, ...props }) => {
            const id = typeof children === 'string'
                ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                : '';
            return (
                <h3 id={id} className="text-2xl font-semibold mt-8 mb-3 text-gray-800 scroll-mt-20" {...props}>
                    {children}
                </h3>
            );
        },

        // Paragraphs
        p: ({ children, ...props }) => (
            <p className="text-base leading-relaxed mb-4 text-gray-700" {...props}>
                {children}
            </p>
        ),

        // Links
        a: ({ href, children, ...props }) => {
            const isExternal = href?.startsWith('http');
            const isInternal = href?.startsWith('/');

            if (isInternal) {
                return (
                    <Link href={href} className="text-red-600 hover:text-red-700 underline" {...props}>
                        {children}
                    </Link>
                );
            }

            return (
                <a
                    href={href}
                    className="text-red-600 hover:text-red-700 underline"
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    {...props}
                >
                    {children}
                    {isExternal && (
                        <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    )}
                </a>
            );
        },

        // Lists
        ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props}>
                {children}
            </ul>
        ),
        ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700" {...props}>
                {children}
            </ol>
        ),
        li: ({ children, ...props }) => (
            <li className="ml-4" {...props}>
                {children}
            </li>
        ),

        // Tables
        table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-6">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200" {...props}>
                    {children}
                </table>
            </div>
        ),
        thead: ({ children, ...props }) => (
            <thead className="bg-gray-50" {...props}>
                {children}
            </thead>
        ),
        tbody: ({ children, ...props }) => (
            <tbody className="bg-white divide-y divide-gray-200" {...props}>
                {children}
            </tbody>
        ),
        th: ({ children, ...props }) => (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props}>
                {children}
            </th>
        ),
        td: ({ children, ...props }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700" {...props}>
                {children}
            </td>
        ),

        // Blockquote
        blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600" {...props}>
                {children}
            </blockquote>
        ),

        // Code
        code: ({ children, ...props }) => (
            <code className="bg-gray-100 rounded px-2 py-1 text-sm font-mono text-red-600" {...props}>
                {children}
            </code>
        ),
        pre: ({ children, ...props }) => (
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4" {...props}>
                {children}
            </pre>
        ),

        // Images
        img: ({ src, alt, ...props }) => {
            if (!src) return null;

            return (
                <div className="my-8">
                    <Image
                        src={src}
                        alt={alt || ''}
                        width={1200}
                        height={630}
                        className="rounded-lg shadow-lg"
                        {...props}
                    />
                    {alt && (
                        <p className="text-sm text-gray-500 text-center mt-2 italic">{alt}</p>
                    )}
                </div>
            );
        },

        // Custom Components
        FeaturedSnippet,
        TableOfContents,

        ...components,
    };
}
