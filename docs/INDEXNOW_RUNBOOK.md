# IndexNow Runbook

IndexNow benachrichtigt Bing (und darüber Copilot) sowie andere teilnehmende
Suchmaschinen aktiv über geänderte/neue URLs, statt auf den naechsten
Crawl-Zyklus zu warten. Google nimmt an IndexNow nicht teil — dafuer bleibt
`app/sitemap.ts` + `app/robots.ts` die massgebliche Quelle.

## Key

- Datei: `public/aae688c6e687f308c0d45afc44f71b195268f2502455e33a6e7109201392fdbb.txt`
  (Inhalt = der Key selbst), erreichbar unter
  `https://web.redrabbit.media/aae688c6e687f308c0d45afc44f71b195268f2502455e33a6e7109201392fdbb.txt`.
- Script: `scripts/indexnow-ping.mjs` (keine Dependencies, Node 18+, globales
  `fetch`). POSTet an `https://api.indexnow.org/indexnow`.

## Befehl

```bash
# Kern-Seiten (Default-Liste im Script) pingen
node scripts/indexnow-ping.mjs

# gezielte URLs pingen
node scripts/indexnow-ping.mjs https://web.redrabbit.media/preise https://web.redrabbit.media/tipps/neuer-artikel
```

## Wann pingen

- Nach dem Go-Live-Tausch (wenn `/relaunch-preview` auf Root gehoben wird und
  die Seiten nicht mehr `noindex` sind).
- Nach inhaltlichen Updates auf Kernseiten (Preise, Leistungen, neue
  Ratgeber-Artikel).
- Nicht bei jedem Commit — IndexNow ist für echte Content-Änderungen gedacht,
  nicht als Ersatz für die Sitemap.

## WICHTIG — jetzt noch NICHT ausführen

Die Preview-Seiten unter `/relaunch-preview` sind aktuell `noindex`
(`robots: { index: false, follow: false }` in den jeweiligen `page.tsx`).
Ein IndexNow-Ping macht nur Sinn für Seiten, die auch indexiert werden sollen.
Das Script daher **nicht ausführen**, bevor der Go-Live-Tausch passiert ist
(siehe `docs/handoffs/NEXT_SESSION_seo-geo-perfektion.md`, Abschnitt
Go-Live-Domain-Modell). Diese Runbook-Datei und das Script sind vorbereitet,
der Ping selbst ist ein bewusster manueller Schritt danach.
