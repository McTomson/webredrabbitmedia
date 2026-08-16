import fs from 'node:fs';
import path from 'node:path';
import { getAllPosts, getAllPostsIncludingDrafts, type BlogPostMeta } from '@/lib/blog/posts';

// Read-only data layer for the Blog dashboard tab. Everything is derived from the
// filesystem the content-engine already writes — no new infra, no CMS:
//   - drafts     = content/blog/*.mdx with `status: draft` -> waiting for Thomas' Freigabe.
//   - openMedia  = leftover markers in content-engine/.media-requests/. run-media.ts
//                  DELETES a marker on success (fs.rmSync), so any file still present
//                  means podcast/video/Substack is not done yet.
//   - published  = live articles (newest first); the page joins these with GSC clicks.

const ROOT = process.cwd();
const MEDIA_DIR = path.join(ROOT, 'content-engine/.media-requests');

export interface OpenMedia {
    slug: string;
    /** requested | needs-images | needs-video | ... (whatever the last pass wrote) */
    status: string;
    requestedAt: string;
    chosenHook?: string;
}

export interface BlogBoardView {
    drafts: BlogPostMeta[];
    openMedia: OpenMedia[];
    published: BlogPostMeta[];
}

function readOpenMedia(): OpenMedia[] {
    let files: string[];
    try {
        files = fs.readdirSync(MEDIA_DIR).filter((f) => f.endsWith('.json'));
    } catch {
        return [];
    }
    const out: OpenMedia[] = [];
    for (const f of files) {
        try {
            const m = JSON.parse(fs.readFileSync(path.join(MEDIA_DIR, f), 'utf8'));
            out.push({
                slug: typeof m.slug === 'string' ? m.slug : f.replace(/\.json$/, ''),
                status: typeof m.status === 'string' ? m.status : 'requested',
                requestedAt: typeof m.requestedAt === 'string' ? m.requestedAt : '',
                chosenHook: typeof m.chosenHook === 'string' ? m.chosenHook : undefined,
            });
        } catch {
            // skip malformed marker
        }
    }
    // newest request first
    return out.sort((a, b) => (a.requestedAt < b.requestedAt ? 1 : -1));
}

export async function getBlogBoard(): Promise<BlogBoardView> {
    const [all, published] = await Promise.all([
        getAllPostsIncludingDrafts(),
        getAllPosts(),
    ]);
    const drafts = all.filter((p) => p.status === 'draft');
    return { drafts, openMedia: readOpenMedia(), published };
}
