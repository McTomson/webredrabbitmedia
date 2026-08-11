# Tracking-Setup (DSGVO, Go-Live web.redrabbit.media)

Stand: 12.08.2026. Beschreibt den DSGVO-konformen Tracking-Stack und die noetigen
Environment-Variablen in Vercel.

## Stack-Ueberblick

- **Consent Mode v2 Defaults**: Inline-Script als erstes Element im `<head>`
  (`app/layout.tsx`). Setzt alle Signale (`ad_storage`, `ad_user_data`,
  `ad_personalization`, `analytics_storage`) synchron auf `denied`, plus
  `ads_data_redaction=true` und `url_passthrough=true`. Wiederkehrende Besucher mit
  gespeicherter Zustimmung (localStorage `redrabbit-cookie-consent`) bekommen im selben
  Script direkt ein `consent update`.
- **GA4 + GTM**: hardcodiert in `app/layout.tsx`
  (`<DeferredThirdParties gaId="G-09FNC6THTD" gtmId="GTM-MQXGT8FL" />`). Laden
  verzoegert nach erster Interaktion oder 3 s nach `window.load` (Mobile-Perf).
- **CookieBanner** (`components/CookieBanner.tsx`): global in `app/layout.tsx`
  gemountet, erscheint auf allen Routen. Opt-in (Analytics und Marketing standardmaessig
  NICHT vorangehakt). Schreibt `redrabbit-cookie-consent`, feuert `gtag('consent','update')`
  und ein `rr:consent`-Window-Event. Marketing-Zustimmung steuert alle drei `ad_*`-Signale,
  Analytics steuert `analytics_storage`.
- **Microsoft Clarity** (`components/ClarityLoader.tsx`): laedt NUR nach
  Analytics-Zustimmung (beim Mount bei gespeicherter Zustimmung, sonst auf `rr:consent`).
  No-op ohne `NEXT_PUBLIC_CLARITY_ID`. Signalisiert nach Laden `clarity('consent')`.
- **Events**: `scroll_depth` und `outbound_click` (`components/AnalyticsListener.tsx`),
  `contact_form_open` beim Oeffnen des Lead-Popups (`components/relaunch/lead/LeadProvider.tsx`).

## Environment-Variablen (Vercel)

Bestehend (bereits gesetzt bzw. in `env.example` dokumentiert): `NEXT_PUBLIC_GA_ID`,
`NEXT_PUBLIC_SITE_URL`, SMTP_*, `ADMIN_API_TOKEN`, `INDEXNOW_API_KEY`.

Neu fuer diesen Tracking-Stack:

| Variable | Pflicht | Zweck |
| --- | --- | --- |
| `NEXT_PUBLIC_CLARITY_ID` | optional | Microsoft-Clarity-Projekt-ID. Fehlt sie, laedt Clarity nicht (No-op). Nach Anlage des Clarity-Projekts in Vercel (Production + Preview) setzen und neu deployen. |

Hinweis: GA4- und GTM-IDs sind aktuell im Code hardcodiert (bewusst, entsprechen der
alten Live-Seite). Falls sie kuenftig ueber Env laufen sollen, hier ergaenzen.

## Verifikation nach Deploy

- SSR-HTML muss das Consent-Default-Script enthalten:
  `curl -s https://<host>/ | grep -o "consent','default'"` bzw.
  `grep consent-mode-default`.
- `ads_data_redaction` und `url_passthrough` im selben Script vorhanden.
- Banner erscheint bei leerem localStorage; nach "Nur notwendige" bleiben alle
  Signale `denied`.
- Clarity-Script (`clarity.ms/tag/...`) taucht erst NACH Analytics-Zustimmung im DOM auf.

## Offene Punkte

- `NEXT_PUBLIC_CLARITY_ID` folgt nach Anlage des Clarity-Projekts.
- `generate_lead` (erfolgreicher Formular-Submit) wird noch NICHT gefeuert: die
  Submit-Logik liegt in `components/relaunch/lead/LeadDialog.tsx` (in diesem Auftrag tabu).
  Zum Nachruesten dort nach `setStatus("success")` ein `sendGAEvent('event','generate_lead', ...)`
  ergaenzen.
