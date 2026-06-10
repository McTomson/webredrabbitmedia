import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import matter from 'gray-matter';
import { embedPodcast, embedVideo, parseYoutubeId } from './mdxMedia';

// ──────────────────────────────────────────────────────────────────────────
// Media orchestrator: the deterministic tail of Spur 2, run AFTER the browser steps
// (NotebookLM podcast + video are already downloaded; Substack post already published).
// Given a slug and the downloaded files, it:
//   1. copies the podcast mp3 into public/audio and embeds <SimpleAudioPlayer/>
//   2. uploads the video to YouTube (public) via the Python Data-API uploader
//   3. embeds <VideoEmbed/> with the new video id
//   4. commits + pushes (Vercel redeploys)
//   5. sends the final mail (Mail 2 of the 2-mail flow) with every link
//   6. clears the media-request marker
//
// Usage:
//   tsx scripts/content-engine/media/run-media.ts --slug <slug> \
//       --podcast <mp3> --video <mp4> [--substack <url>] \
//       [--podcast-title "..."] [--video-title "..."] [--no-push] [--no-mail]
// ──────────────────────────────────────────────────────────────────────────

const ROOT = process.cwd();

// The YouTube uploader needs google-auth libs. They live in a dedicated venv so a
// Homebrew `python3` major bump (which silently drops the site-packages) cannot break
// the daily run. Fall back to bare `python3` if the venv is missing.
const VENV_PY = path.join(process.env.HOME || '', '.config/redrabbit-youtube/venv/bin/python');
const PYTHON = fs.existsSync(VENV_PY) ? VENV_PY : 'python3';

function arg(name: string): string | undefined {
    const i = process.argv.indexOf(`--${name}`);
    return i !== -1 ? process.argv[i + 1] : undefined;
}
function flag(name: string): boolean {
    return process.argv.includes(`--${name}`);
}
function log(s: string) {
    process.stdout.write(s + '\n');
}

function loadEnvLocal(): Record<string, string> {
    const env: Record<string, string> = {};
    const p = path.join(ROOT, '.env.local');
    if (fs.existsSync(p)) {
        for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
            const m = line.match(/^([A-Z_]+)=(.*)$/);
            if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
        }
    }
    return env;
}

function uploadToYoutube(videoFile: string, title: string, descFile: string, tags: string): string {
    const out = execFileSync(
        PYTHON,
        [
            path.join(ROOT, 'scripts/content-engine/upload/youtube_upload.py'),
            '--file', videoFile,
            '--title', title,
            '--description-file', descFile,
            '--privacy', 'public',
            '--category', '27',
            '--tags', tags,
        ],
        { encoding: 'utf8', timeout: 600_000, maxBuffer: 16 * 1024 * 1024 },
    );
    process.stdout.write(out);
    const id = parseYoutubeId(out);
    if (!id) throw new Error('YouTube-Upload: keine VIDEO_URL im Output gefunden');
    return id;
}

function main() {
    const slug = arg('slug');
    if (!slug) throw new Error('--slug fehlt');
    const podcast = arg('podcast');
    const video = arg('video');
    const substack = arg('substack');
    const env = loadEnvLocal();
    const SITE_URL = env.SITE_URL || 'https://web.redrabbit.media';

    const mdxPath = path.join(ROOT, 'content/blog', `${slug}.mdx`);
    if (!fs.existsSync(mdxPath)) throw new Error(`Artikel nicht gefunden: ${mdxPath}`);
    const title: string = matter(fs.readFileSync(mdxPath, 'utf8')).data.title;
    const podcastTitle = arg('podcast-title') || `Podcast: ${title}`;
    const videoTitle = arg('video-title') || `Video: ${title}`;

    // 0) Images: generated ONLY now, after the text was approved (never in the writing pipeline).
    //    Hero + infographic + context photos via images-only (pure CLI, no browser needed). Done
    //    first so an article never gets expensive images before the user has signed off on its text.
    if (!flag('no-images')) {
        log('0/6 Bilder werden erzeugt (Hero + Infografik + Kontextfotos) ...');
        execFileSync('npx', ['tsx', path.join(ROOT, 'scripts/content-engine/images-only.ts'), slug, '--hero'], {
            cwd: ROOT,
            stdio: 'inherit',
            timeout: 1_200_000,
        });
        log('0/6 Bilder erzeugt + eingebettet');
    } else {
        log('0/6 Bilder uebersprungen (--no-images)');
    }

    // Read AFTER images-only rewrote the file on disk, so podcast/video embeds build on top.
    let mdx = fs.readFileSync(mdxPath, 'utf8');

    // 1) Podcast: copy mp3 + embed player
    if (podcast) {
        if (!fs.existsSync(podcast)) throw new Error(`Podcast-Datei fehlt: ${podcast}`);
        const audioDir = path.join(ROOT, 'public/audio');
        fs.mkdirSync(audioDir, { recursive: true });
        const dest = path.join(audioDir, `${slug}-podcast.mp3`);
        fs.copyFileSync(podcast, dest);
        mdx = embedPodcast(mdx, slug, podcastTitle);
        log(`1/6 Podcast kopiert -> public/audio/${slug}-podcast.mp3 + eingebettet`);
    } else {
        log('1/6 Podcast uebersprungen (kein --podcast)');
    }

    // 2+3) Video: YouTube upload (public) + embed
    let youtubeUrl = '';
    if (video) {
        if (!fs.existsSync(video)) throw new Error(`Video-Datei fehlt: ${video}`);
        const article = `${SITE_URL}/tipps/${slug}`;
        const descFile = path.join(ROOT, 'scripts/content-engine/.work', `${slug}-yt-desc.txt`);
        fs.mkdirSync(path.dirname(descFile), { recursive: true });
        const desc = `${title}\n\nDen ganzen Artikel mit allen Details lesen Sie hier:\n${article}\n\nRed Rabbit Media, Webdesign und digitale Strategie aus Oesterreich.\nhttps://web.redrabbit.media`;
        fs.writeFileSync(descFile, desc);
        log('2/6 Video wird auf YouTube hochgeladen (public) ...');
        const id = uploadToYoutube(video, videoTitle, descFile, 'Webdesign,Website,Oesterreich,Red Rabbit Media');
        youtubeUrl = `https://youtu.be/${id}`;

        // Self-host the MP4 so the article plays it via HTML5 <video> (never blocked by
        // content filters like uBlock/Brave/Pi-hole, unlike a YouTube iframe). The id is kept
        // only for the "watch on YouTube" caption link. Copy the file + extract a poster frame.
        const videosDir = path.join(ROOT, 'public/videos');
        fs.mkdirSync(videosDir, { recursive: true });
        const videoDest = path.join(videosDir, `${slug}-video.mp4`);
        const posterDest = path.join(videosDir, `${slug}-poster.jpg`);
        fs.copyFileSync(video, videoDest);
        try {
            execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', '3', '-i', videoDest, '-frames:v', '1', '-vf', 'scale=1280:-2', posterDest], { stdio: 'inherit' });
        } catch {
            // ffmpeg missing or frame extraction failed: fall back to the hero image as poster.
            log('   Poster-Frame fehlgeschlagen, nutze Hero-Bild als Poster');
        }
        const posterRef = fs.existsSync(posterDest) ? `/videos/${slug}-poster.jpg` : `/images/blog/${slug}.png`;
        mdx = embedVideo(mdx, id, videoTitle, { src: `/videos/${slug}-video.mp4`, poster: posterRef });
        log(`3/6 Video selbst-gehostet + eingebettet (public/videos/${slug}-video.mp4, YouTube ${youtubeUrl})`);
    } else {
        log('2-3/6 Video uebersprungen (kein --video)');
    }

    fs.writeFileSync(mdxPath, mdx);

    // 4) commit + push
    if (!flag('no-push')) {
        execFileSync('git', ['add', mdxPath, 'public/audio', 'public/images/blog', 'public/videos'], { cwd: ROOT, stdio: 'inherit' });
        try {
            execFileSync('git', ['commit', '-q', '-m', `feat(blog): add images + podcast + video to ${slug}`], { cwd: ROOT, stdio: 'inherit' });
            execFileSync('git', ['push', 'origin', 'main'], { cwd: ROOT, stdio: 'inherit' });
            log('4/6 committed + gepusht (Vercel deployt)');
        } catch {
            log('4/6 nichts zu committen (Medien evtl. schon eingebettet)');
        }
    } else {
        log('4/6 push uebersprungen (--no-push)');
    }

    // 5) final mail
    if (!flag('no-mail') && env.ADMIN_API_TOKEN) {
        const body = JSON.stringify({ slug, youtube: youtubeUrl || undefined, substack: substack || undefined, youtubePrivacy: 'public' });
        try {
            const res = execFileSync('curl', [
                '-s', '-X', 'POST', `${SITE_URL}/api/published-notify`,
                '-H', `Authorization: Bearer ${env.ADMIN_API_TOKEN}`,
                '-H', 'Content-Type: application/json',
                '-d', body,
            ], { encoding: 'utf8' });
            log(`5/6 Schluss-Mail ausgeloest: ${res}`);
        } catch (e: any) {
            log(`5/6 Schluss-Mail Fehler: ${e.message}`);
        }
    } else {
        log('5/6 Schluss-Mail uebersprungen');
    }

    // 6) clear the media marker (local file, if present; committed clear handled by watcher)
    const marker = path.join(ROOT, 'content-engine/.media-requests', `${slug}.json`);
    if (fs.existsSync(marker)) {
        fs.rmSync(marker);
        log('6/6 Medien-Marker entfernt');
    } else {
        log('6/6 kein lokaler Marker');
    }

    log(`\nFertig fuer ${slug}. YouTube: ${youtubeUrl || '(kein Video)'} | Substack: ${substack || '(keiner)'}`);
}

main();
