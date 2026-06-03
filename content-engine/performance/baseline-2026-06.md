# Baseline (Stand Juni 2026)

Ausgangslage vor Start der Content-Engine. KPI-Nullpunkt fuer den 6-Monats-Vergleich.

## Google Search Console
- Property: https://web.redrabbit.media/ — VERIFIZIERT (Konto thomas.uhlir@gmail.com).
- Websuche-Klicks: ~11 in den letzten ~3 Monaten (Maerz–Mai 2026). Nahe Null.
- Indexierung: noch zu erheben (Seiten-Report) — wird KPI #1.
- Bedeutung: sehr geringe organische Sichtbarkeit/Autoritaet. Bestaetigt die ehrliche
  Erwartung (Top-10 nur fuer gewinnbare Long-Tail/lokal, ~3-6 Monate, kompoundierend).

## Analytics
- GA4 live (G-09FNC6THTD), Consent/Cookie-Banner vorhanden.
- Vercel Analytics vorhanden (NEXT_PUBLIC_VERCEL_ANALYTICS_ID).

## Bestehende Integrationen (kein Neubau noetig)
- Google Indexing API (Service-Account, app/api/indexing/route.ts).
- IndexNow (Bing/Yandex). SMTP (Freigabe-Mails). ADMIN_API_TOKEN (Auth-Muster).

## KPI-Nullpunkt (gegen den wir messen)
- Organische Klicks/Monat: ~3-4 (aus 11/3mo).
- Indexierte Artikel-Seiten: TODO erheben.
- Keywords Top-20 / Top-10: ~0 (zu erheben).
- Leads aus Tipps: 0 (noch keine Lead-Mechanik).
