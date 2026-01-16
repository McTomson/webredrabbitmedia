import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import { useMDXComponents } from '@/mdx-components';
import { generateFAQsFromHeadings, type FAQ } from './faqGenerator';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    featuredSnippet: string;
    featuredSnippetTitle?: string;
    author: string;
    publishedAt: string;
    updatedAt: string;
    category: string;
    tags: string[];
    featuredImage: string;
    sources?: Array<{ name: string; url: string }>;
    content: string;
    // Neil Patel-style enhancements
    keyTakeaways?: string[];
    conclusionStats?: Array<{ label: string; value: string }>;
    autoGenerateFAQs?: boolean;
    customFAQs?: FAQ[];
    faqs?: FAQ[]; // Runtime-generated
}

export interface BlogPostMeta extends Omit<BlogPost, 'content'> {
    readingTime: number;
}

// Get all blog posts
export async function getAllPosts(): Promise<BlogPostMeta[]> {
    const files = fs.readdirSync(BLOG_DIR);

    const posts = await Promise.all(
        files
            .filter((file) => file.endsWith('.mdx'))
            .map(async (file) => {
                const slug = file.replace('.mdx', '');
                const post = await getPostBySlug(slug);

                if (!post) return null;

                const { content, ...meta } = post;
                const readingTime = calculateReadingTime(content);

                return {
                    ...meta,
                    readingTime,
                };
            })
    );

    return posts
        .filter((post): post is BlogPostMeta => post !== null)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// Get single blog post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
        const fileContent = fs.readFileSync(filePath, 'utf8');

        const { data, content } = matter(fileContent);

        // Extract headings for FAQ generation
        const headings = extractHeadings(content);

        // Generate or use custom FAQs
        const faqs = data.customFAQs
            ? data.customFAQs
            : (data.autoGenerateFAQs !== false) // Default to true
                ? generateFAQsFromHeadings(headings, data.title, content)
                : [];

        return {
            slug,
            title: data.title,
            excerpt: data.excerpt,
            featuredSnippet: data.featuredSnippet,
            featuredSnippetTitle: data.featuredSnippetTitle,
            author: data.author,
            publishedAt: data.publishedAt,
            updatedAt: data.updatedAt,
            category: data.category,
            tags: data.tags || [],
            featuredImage: data.featuredImage,
            sources: data.sources,
            content,
            // Neil Patel-style enhancements
            keyTakeaways: data.keyTakeaways,
            conclusionStats: data.conclusionStats,
            autoGenerateFAQs: data.autoGenerateFAQs !== false,
            customFAQs: data.customFAQs,
            faqs,
        };
    } catch (error) {
        console.error(`Error reading post ${slug}:`, error);
        return null;
    }
}

// Compile MDX content
export async function compileBlogPost(content: string) {
    const { content: compiledContent } = await compileMDX({
        source: content,
        components: useMDXComponents({}),
        options: {
            parseFrontmatter: false,
        },
    });

    return compiledContent;
}

// Calculate reading time
function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}

// Get related posts
export async function getRelatedPosts(currentSlug: string, limit = 3): Promise<BlogPostMeta[]> {
    const currentPost = await getPostBySlug(currentSlug);
    if (!currentPost) return [];

    const allPosts = await getAllPosts();

    // Filter out current post and find posts with matching tags or category
    const related = allPosts
        .filter((post) => post.slug !== currentSlug)
        .map((post) => {
            let score = 0;

            // Same category = +3 points
            if (post.category === currentPost.category) score += 3;

            // Matching tags = +1 point each
            const matchingTags = post.tags.filter((tag) => currentPost.tags.includes(tag));
            score += matchingTags.length;

            return { post, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ post }) => post);

    return related;
}

// Get posts by category
export async function getPostsByCategory(category: string): Promise<BlogPostMeta[]> {
    const allPosts = await getAllPosts();
    return allPosts.filter((post) => post.category === category);
}

// Get posts by tag
export async function getPostsByTag(tag: string): Promise<BlogPostMeta[]> {
    const allPosts = await getAllPosts();
    return allPosts.filter((post) => post.tags.includes(tag));
}

// Search posts
export async function searchPosts(query: string): Promise<BlogPostMeta[]> {
    const allPosts = await getAllPosts();
    const lowerQuery = query.toLowerCase();

    return allPosts.filter((post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
}

// Extract headings from markdown content for Table of Contents
export function extractHeadings(content: string): Array<{
    id: string;
    text: string;
    level: number;
}> {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const headings: Array<{ id: string; text: string; level: number }> = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length; // 2 for ##, 3 for ###
        const text = match[2];
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        headings.push({ id, text, level });
    }

    return headings;
}
