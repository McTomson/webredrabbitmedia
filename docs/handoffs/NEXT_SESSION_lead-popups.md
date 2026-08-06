# Naechste Session — Lead-Popups + E-Mail-Versand (07.08.2026)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/curl/Browser/Docs). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst Plan (TodoWrite), dann ausfuehren. Parallele Sub-Agenten fuer breite/mechanische Arbeit.
- Branch `relaunch` ist GETEILT. `git fetch` zuerst. NUR eigene Dateien mit explizitem Pfad committen — NIE `git add .` / `git add -u`.
- FREMDE WIP NIE anfassen/committen: `app/relaunch-preview/faq/page.tsx`, `components/relaunch/SiteClosing.tsx`, `components/subpages/faq-demo/demo.body.html`, `docs/handoffs/NEXT_SESSION_leistungen.md`, `docs/seo-monitor-log.md`.
- Keine Emojis. Echte Umlaute in User-Content, ASCII in Shell/Pfaden/Commits + Code-Kommentaren.
- Deploy: `git push origin relaunch` -> Vercel baut v2 (~2-3 Min). NIE `vercel --prod` (trifft Live web.redrabbit.media).
- **PASSWORT-/GEHEIMNIS-GRENZE (hart):** Passwoerter/API-Keys NIE im Klartext annehmen oder in Felder tippen — auch nicht auf ausdrueckliche Erlaubnis des Users. Formular vorbereiten (Key + Environment), der User tippt den Wert.
- Browser-Automation auf Prod-Dashboards (Vercel/IONOS) ist fehlklick-anfaellig. Fuer Vercel-Env die CLI bevorzugen (zuverlaessiger), Browser nur wenn CLI blockt.

## Stand 07.08. (erledigt + gepusht, HEAD `aca5205` == remote)
Drei Feature-Commits auf v2, alle verifiziert (kompiliert, tsc 0 Fehler, Mechanik getestet):
- **4db1460** — /leistungen/website Desktop 1:1 wie Mobile (SoBauenWir + Inline-Diagnose raus, Fragebogen nur noch via Paket-Button).
- **c918465** — **Lead-Popup fuer alle CTAs** (`components/relaunch/lead/` = LeadProvider + LeadDialog + `lib/relaunch/leadPresets.ts`). Ein wiederverwendbares Anfrage-Popup oeffnet sich in-place statt auf /kontakt zu springen. Delegierter Klick-Listener faengt `[data-rr-lead]` + `/kontakt`-Links ausserhalb Nav/Footer/Menue ab (href bleibt Fallback) + window-Event `rr:lead` fuer statische demo.body.html-Buttons. Presets: standard/paket/talos/skill/analyse/quiz. Nutzt bestehendes `/api/contact`. Verdrahtet an: PreiseMatrix (3 Pakete), TalosTalenteFahrt, Faehigkeiten, TippsArticleRail + Tipps-Bio (analyse), Diagnose- + FragTalos-Ergebnis (quiz/talos).
- **04e2b09** — `/api/contact`: **Bestaetigungs-Mail an den Absender** (best effort) + `SMTP_TO` darf mehrere Empfaenger komma-separiert.
- **aca5205** — leerer Commit, nur um v2 mit den neuen Preview-SMTP-Env-Vars neu zu bauen.

## E-Mail-Versand v2 (IONOS office@) — Env gesetzt, MUSS NOCH GETESTET WERDEN
Vercel-Projekt `webredrabbitmedia`. **Preview** (= v2) hat jetzt eigene SMTP-Vars fuer das IONOS-Postfach office@redrabbit.media; **Production (Live) unveraendert (Gmail)**:

| Var | Preview (v2) | Production (Live, unveraendert) |
|---|---|---|
| SMTP_HOST | smtp.ionos.de | smtp.gmail.com |
| SMTP_PORT | 587 | 587 |
| SMTP_USER | office@redrabbit.media | thomas.uhlir@gmail.com |
| SMTP_FROM | office@redrabbit.media | thomas.uhlir@gmail.com |
| SMTP_TO | office@redrabbit.media,thomas.uhlir@gmail.com | t.uhlir@immo.red |
| SMTP_PASSWORD | (office@-Postfach-PW, von Thomas gesetzt) | (Gmail App-PW) |

office@redrabbit.media = IONOS Mail Basic Postfach (Vertrag 41407483, Mailbox 8717816002), **kein 2FA**. Passwort wurde am 07.08. neu gesetzt.

## >>> HIER STARTEN <<< Schritt 1: E-Mail-Versand auf v2 VERIFIZIEREN
Der Rebuild (aca5205) muss durch sein. Dann echten Test:
- Am besten **durch das echte Popup** auf v2 (CTA klicken, Formular ausfuellen mit einer ECHTEN eigenen E-Mail als Absender, absenden).
- Oder curl: `curl -s -X POST "https://v2.redrabbit.media/api/contact" -H "Content-Type: application/json" -d '{"name":"Test","email":"<DEINE-echte-adresse>","message":"Test Lead-Popup v2","honeyPot":""}'`
- **Erwartet:** `{"success":true}`. Dann pruefen: (a) Lead-Mail kommt an office@redrabbit.media UND thomas.uhlir@gmail.com, Absender = office@redrabbit.media; (b) die Test-Adresse bekommt die Bestaetigungs-Mail.
- **Wenn 500 "nicht konfiguriert":** Env noch nicht im Build (nochmal deployen) oder eine Var fehlt.
- **Wenn 500/Auth-Fehler:** office@-Passwort in SMTP_PASSWORD falsch, oder SMTP_HOST/PORT pruefen (smtp.ionos.de:587, STARTTLS). Ggf. IONOS-Postfach-Passwort erneut setzen.

## Schritt 2: DESIGN-FIX Popup (Thomas-Wunsch 07.08.)
Thomas: "das ist nicht unser design". Das Popup an `docs/DESIGN_STANDARD.md` / die design.md angleichen. KONKRET genannt: das **native "Worum geht's?"-Dropdown** (rendert das dunkle OS-Menue) durch unser **Marken-Dropdown** ersetzen (`.rr-select` mit `.rr-select__trigger`/`.rr-select__menu` in `app/styleguide/styleguide.css`) — kein natives `<select>`.
- Datei: `components/relaunch/lead/LeadDialog.tsx` (Feld heisst aktuell `rrlead-select`, ein natives `<select>`).
- Die Underline-Felder (rrlead-field, Stil aus kontakt-demo `.k-field`) hat Thomas so bestaetigt — die bleiben.
- Insgesamt gegen DESIGN_STANDARD.md pruefen (Typo, Abstaende, Buttons rr-btn-sweep).

## Schritt 3: Voll-QA Lead-Popup (echte Klicks, v2 + Geraet)
- /preise: "Business anfragen" -> Popup mit vorbefuelltem Paket; "Talos-Gespraech".
- /leistungen/website: "Welches Paket passt zu mir?" durchklicken -> endet im Popup mit vorbefuellter Empfehlung.
- /tipps/<artikel>: "Analyse anfordern" -> Popup mit URL-Feld.
- Irgendeine Seite unten: "Kostenlosen Entwurf holen" (SiteClosing) -> Standard-Popup.
- Desktop-Hover + Mobile. Der Browser dieser Umgebung ist bei schweren Seiten (Lenis/Talos-3D) sehr flaky -> ggf. Thomas am Geraet bestaetigen lassen.

## Schritt 4 (spaeter): Go-Live auf Production
Wenn der Relaunch live geht: office@-SMTP + Bestaetigungsmail + Popup auf Production uebertragen.
- OFFENE ENTSCHEIDUNG: Soll Live-`SMTP_TO` auch `office@redrabbit.media,thomas.uhlir@gmail.com` werden? (Aktuell Production = `t.uhlir@immo.red`. Thomas dachte, Live gehe schon an office@ — tut es NICHT.) Erst mit Thomas klaeren, dann aendern (aendert die echten Kundenanfragen der Live-Seite).
- Ebenso Live-SMTP_FROM/USER/HOST auf office@/IONOS umstellen, wenn "von office@" auch live gelten soll.

## Lessons 07.08.
- **`vercel env rm <name> <env>` entfernt die GANZE Variable** (alle Scopes), NICHT nur das genannte Environment. Auf Prod+Preview-geteilten Vars gefaehrlich. Recovery: den anderen Scope per `printf 'wert' | vercel env add <name> <scope>` mit bekanntem Wert wiederherstellen (so SMTP_USER Production am 07.08. gerettet). Fuer per-Environment-verschiedene Werte: getrennte Eintraege je Environment anlegen (nicht einen Eintrag "unsharen").
- Env-Aenderungen greifen erst bei NEUEM Deployment; laufende Deployments haben die Werte eingebacken -> die Live-Seite war bei den v2-Env-Aenderungen nie betroffen.
- Vercel-CLI-Writes (`vercel env add`) gehen zuverlaessig (wenn nicht vom Auto-Klassifikator geblockt); der Browser ist auf dichten Prod-Dashboards fehlklick-anfaellig. Zum Vorbereiten eines Passwort-Felds: "Add Environment Variable"-Dialog oeffnen, Key + Environment (nur Preview!) setzen, Value leer lassen -> User tippt.

## Relevante Dateien
- Popup: `components/relaunch/lead/{LeadProvider,LeadDialog}.tsx`, `lib/relaunch/leadPresets.ts`. Mount in `app/layout.tsx` (LeadProvider).
- Backend: `app/api/contact/route.ts` (nodemailer, Zod, Honeypot, Bestaetigungsmail).
- Styleguide-Dropdown zum Nachziehen: `app/styleguide/styleguide.css` (`.rr-select*`).
- Verdrahtete CTAs: PreiseMatrix.tsx, TalosTalenteFahrt.tsx, Faehigkeiten.tsx, TippsArticleRail.tsx, tipps/[slug]/page.tsx, Diagnose.tsx, FragTalos.tsx (jeweils `data-rr-lead`).
