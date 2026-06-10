# Review — Dashboard GSC + GA4 (commit aad0fc7)

**Datum**: 2026-06-10
**Reviewer**: review-it Skill, 3 parallele Agenten (Logic / Security / Simplify)
**Stack**: ui (Next.js 15 App Router, RSC), service (googleapis OAuth)
**Domain**: auth (OAuth refresh token), analytics
**Verdict**: GO — kein echtes CRITICAL; alle bestätigten Härtungen direkt angewandt.

## Architektur-Verifikation (Security)
- Layout-Guard (`app/dashboard/layout.tsx`) deckt ALLE Kind-Routen ab (Next.js Segment-Layout rendert bei jedem Request, alle Seiten force-dynamic). Kein verschachteltes Kind-Layout.
- Kein guard-freier Daten-Fetch-Pfad: `getSearchConsoleData`/`getAnalyticsData` werden nur von search/analytics-page importiert, von keiner API-Route und keiner Server-Action.
- Keine Creds im Repo (`.gitignore` deckt `.env*`; keine token.json/oauth_client.json getrackt). Defense-in-depth: auf Vercel fehlen die lokalen Creds ohnehin.

## Angewandte Fixes (accepted)
- **Security-1 (Secret-Leak, mittel)** `lib/dashboard/google.ts`: `safeErrorMessage()` mappt invalid_grant/401 auf freundlichen Hinweis und redigiert token-artige Query-Params (access_token/refresh_token/client_secret/id_token) — nie rohe Token in der UI-Fehlerbox.
- **Logic-3 + GSC-Off-by-one (MAJOR)** `lib/dashboard/google.ts`: GSC-Fenster auf exakt `days` Tage endend gestern korrigiert (war `days+1`); GA4 endDate auf `yesterday` angeglichen → beide Quellen zeigen denselben abgeschlossenen Zeitraum.
- **Logic-2 (MAJOR)** `app/dashboard/search/page.tsx`: KPI-Label "Ø Position" → "impr.-gew. (Top 250)" (Transparenz: Basis sind die Top-250-Queries der GSC-API).
- **Security-2 (niedrig)** search + analytics: href-Schema-Whitelist — GA4 `pagePath` nur verlinkt wenn site-relativ (`/...`); GSC page-URL nur wenn `http(s)://`. Verhindert `javascript:`/Open-Redirect-hrefs aus Fremd-/Bot-Traffic.
- **Simplify-1 (MINOR)** `app/dashboard/ui.tsx`: `RangeSwitch` + `DASH_RANGES` + `parseRange()` zentralisiert (vorher in beiden Tabs dupliziert) — eine Quelle für die `?days=`-Allowlist. Plus `focus-visible`-Ring für Tastaturbedienung.

## Bewusst nicht geändert
- **Logic-1 (Prod-Guard latent)**: Guard ist korrekt und von Security als solide verifiziert. Das Risiko entsteht nur, wenn jemand `DASHBOARD_ENABLED` absichtlich auf Vercel setzt — das ist der bewusste Schalter für eine spätere Freigabe. Mit der jetzt sanitisierten Fehlermeldung + fehlenden Vercel-Creds bleibt selbst dann nichts Sensibles sichtbar. Kein Over-Engineering.
- **Loaded<T> + StateNotice**: angemessen (kein 500, freundliche Degradierung), nicht zu viel.
- **format.ts**: alle Helfer genutzt, kein toter Code.

## Reviewer-Konvergenz
- Prod-Guard: Logic markierte latent, Security verifizierte solide → als sicher eingestuft, Fehlerbox zusätzlich gehärtet.
- Datenmapping GA4/GSC, Division-durch-0-Guards, searchParams-Promise, Striking-Distance-Filter: von Logic explizit als korrekt bestätigt.
