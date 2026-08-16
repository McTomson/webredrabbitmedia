# Google Business Profile API — Einrichtung (kostenlos, keine Kreditkarte)

Ziel: Performance-Daten (Impressionen/Klicks/Anrufe/Suchbegriffe) und Reviews (lesen/antworten)
automatisch und **gratis** über die offiziellen Google-Business-Profile-APIs. Diese APIs sind
**nicht kostenpflichtig und brauchen KEIN Billing/keine Karte** (anders als die Maps-Platform).
Der einzige „Preis" ist eine kostenlose Freigabe, die Google manuell erteilt (~3–10 Werktage).

Alle API-Fakten verifiziert 2026-08-16 an den offiziellen Google-Docs.

## Was Thomas tun muss (einmalig) — ich bereite alles vor, du klickst/loggst dich ein

**Schritt 1 — Google-Cloud-Projekt (kostenlos, keine Karte)**
- console.cloud.google.com → bestehendes Projekt **claude-email-manager-484501** verwenden
  (dort liegen schon GSC/GA4) oder ein neues anlegen. **Projektnummer** notieren (Projekt-Info-Karte).

**Schritt 2 — 4 APIs aktivieren** (API-Bibliothek → jeweils „Aktivieren"; falls ein
Billing-Hinweis kommt: er ist für diese APIs überspringbar, KEINE Karte hinterlegen):
- Google My Business API  (`mybusiness.googleapis.com`) — Reviews (v4)
- My Business Account Management API  (`mybusinessaccountmanagement.googleapis.com`)
- My Business Business Information API  (`mybusinessbusinessinformation.googleapis.com`)
- Business Profile Performance API  (`businessprofileperformance.googleapis.com`)

**Schritt 3 — „Basic API Access" beantragen** (der eigentliche Freischalt-Schritt, gratis):
- Formular: support.google.com/business/contact/api_default → Grund **„Application for Basic API Access"**.
- Projektnummer aus Schritt 1 eintragen, Use-Case beschreiben. **Fertiger Text zum Einfügen unten.**
- Wichtig: Review-Verwaltung ausdrücklich nennen (Google ist bei Reviews strenger).
- Dauer: einige Tage bis ~2 Wochen. Bis zur Freigabe liefert die API 0 Quota (Aufrufe schlagen fehl —
  das ist normal, kein Fehler im Code).

**Schritt 4 — OAuth-Client** (falls nicht schon da): APIs & Dienste → Anmeldedaten →
„Desktop-App"-OAuth-Client → JSON herunterladen nach `~/.config/redrabbit-dashboard/oauth_client.json`.
Zustimmungsbildschirm: Testmodus reicht, `thomas.uhlir@gmail.com` als Testnutzer. `business.manage` ist
ein sensibler Scope, bleibt für dieses interne Ein-Personen-Tool aber unverifiziert (kein Google-Review nötig).

**Schritt 5 — einloggen** (das ist dein „ich log mich ein"):
```
npm run gbp:auth
```
Öffnet den Google-Login. Einmal zustimmen (jetzt inkl. `business.manage`). Token wird gespeichert.
Deckt GSC + GA4 + GBP mit EINEM Login ab.

## Danach (ich, sobald Freigabe da ist — null Extra-Arbeit für dich)

```
npm run gbp:performance     # schreibt performance.json → Dashboard-Tab "Local (GBP)" zeigt Sichtbarkeit
npm run gbp:reviews         # schreibt reviews.json → Velocity/Antwortrate/unbeantwortete
```
Optional Account-/Location-ID fest hinterlegen (spart den Discovery-Call), in `.env.local`:
```
RR_GBP_ACCOUNT_ID=...
RR_GBP_LOCATION_ID=...
RR_GBP_PLACE_ID=...     # für den Bewertungs-Direktlink + Grid-Zuordnung
```
Dann wöchentliches Scheduling (launchd bot-worktree / VPS-systemd), unregelmäßige Off-Peak-Zeit.

## Use-Case-Text fürs Antragsformular (zum Einfügen)

> We operate the Google Business Profile of our own company (Red Rabbit GmbH, a web design agency in
> Vienna, Austria). We want to use the Business Profile APIs to (1) read our Performance metrics
> (impressions, calls, website clicks, direction requests, search keywords) to monitor our local
> visibility, and (2) read and reply to our customer reviews so we can respond promptly and
> professionally. We manage only our own single verified location. All review replies and any profile
> changes are reviewed and approved by the business owner before publishing. We do not manage third-party
> businesses and do not resell API access.

## Warum kostenlos (Beleg)

Google unterscheidet „billable" und „non-billable" APIs; nur billable brauchen ein Billing-Konto
(support.google.com/googleapi/answer/6158867). Die Business-Profile-Familie ist **nicht** billable —
keine Preisliste, kein SKU, keine Karte. Kartenpflicht hat nur die **Maps Platform** (Places/Geocoding),
die wir NICHT verwenden. Rang-Grid gibt es in keiner Google-API — das bleibt der optionale, kostenlose
Browser-Check (siehe README).
