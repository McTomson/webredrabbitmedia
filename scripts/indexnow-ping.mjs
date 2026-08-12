#!/usr/bin/env node
/**
 * IndexNow ping — tells Bing/Copilot (and any other IndexNow-participating
 * search engine) that pages changed, so they fetch faster than a normal
 * crawl cycle. No dependencies, Node 18+ (global fetch).
 *
 * Key file: public/aae688c6e687f308c0d45afc44f71b195268f2502455e33a6e7109201392fdbb.txt
 * (content = the key itself), served at
 * https://web.redrabbit.media/aae688c6e687f308c0d45afc44f71b195268f2502455e33a6e7109201392fdbb.txt
 *
 * Usage:
 *   node scripts/indexnow-ping.mjs                       # pings the default core-page list below
 *   node scripts/indexnow-ping.mjs <url> <url> ...        # pings exactly the given URLs
 *
 * See docs/INDEXNOW_RUNBOOK.md for when this may be run — NOT before go-live.
 */

const HOST = 'web.redrabbit.media';
const KEY = 'aae688c6e687f308c0d45afc44f71b195268f2502455e33a6e7109201392fdbb';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const DEFAULT_URLS = [
  `https://${HOST}/`,
  `https://${HOST}/preise`,
  `https://${HOST}/leistungen`,
  `https://${HOST}/ueber-uns`,
  `https://${HOST}/faq`,
  `https://${HOST}/kontakt`,
  `https://${HOST}/tipps`,
  `https://${HOST}/webdesign-wien`,
  `https://${HOST}/webdesign-niederoesterreich`,
  `https://${HOST}/webdesign-oberoesterreich`,
  `https://${HOST}/webdesign-steiermark`,
  `https://${HOST}/webdesign-tirol`,
  `https://${HOST}/webdesign-salzburg`,
  `https://${HOST}/webdesign-kaernten`,
  `https://${HOST}/webdesign-vorarlberg`,
  `https://${HOST}/webdesign-burgenland`,
];

const argUrls = process.argv.slice(2);
const urlList = argUrls.length > 0 ? argUrls : DEFAULT_URLS;

const body = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList,
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

console.log(`IndexNow ping: ${res.status} ${res.statusText}`);
console.log(`URLs submitted (${urlList.length}):`);
for (const u of urlList) console.log(`  - ${u}`);

if (!res.ok) {
  const text = await res.text().catch(() => '');
  if (text) console.error(text);
  process.exit(1);
}
