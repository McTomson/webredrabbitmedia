# Naechste Session — v2-Preview-Hosting (redrabbit.media) (28.07.2026)

## Arbeitsregeln (verbindlich)
- Lies ZUERST alles Relevante: diesen Handoff, MEMORY.md, betroffene Dateien. Nicht loslegen ohne Kontext.
- NIE raten — immer verifizieren (Code/Browser/DNS/vercel). Bei Unsicherheit: fragen oder fail-closed, nie einen Wert erfinden.
- Erst einen Plan machen (TodoWrite), dann ausfuehren.
- Skills + parallele Sub-Agenten nutzen wo es hilft.
- Autonom handeln, voller Zugriff inkl. Browser — ohne fuer jeden Schritt nachzufragen (Grenze: kein Botschutz-Umgehen, keine Account-Anlage, nichts Destruktives ohne Deckung, keine kostenpflichtigen Upgrades).
- Geteilter Branch `relaunch`: vor Arbeit `git fetch` + `git log`, NUR eigene Dateien stagen (nicht preise-*, nicht seo-monitor-log, nicht fremde untracked-Komponenten).
- Deploy NUR mit vercel-Status **Ready** als "online" melden. Auf redrabbit.media ist der Login-Schutz AUS -> curl 200 ist echt (nicht mehr SSO-302).

## Was in dieser Session gebaut wurde (alles committet + gepusht + live verifiziert)
Ziel: den Relaunch teilbar/testbar auf der echten Domain, nicht indexiert.

- **Test-Subdomain `https://v2.redrabbit.media`** ist live und teilbar. Zeigt IMMER den neuesten `relaunch`-Branch-Stand (Push auf relaunch = Auto-Update). Oeffentlich (kein Login), aber `noindex`.
- Vercel: Domain `v2.redrabbit.media` -> Projekt webredrabbitmedia, Env **Preview**, Branch **relaunch** (Domains -> Add Existing -> Preview -> Branch relaunch).
- DNS bei **IONOS** (Konto Thomas, NS = ui-dns.*): CNAME `v2` -> `09e8b98312e48c92.vercel-dns-017.com`. A/MX nie anfassen.
- `middleware.ts` (v2.*-Host, Denylist):
  - `X-Robots-Tag: noindex, nofollow` fuer jeden `v2.*`-Host (Live-Domain web.redrabbit.media nie deindexieren).
  - `Cache-Control: no-store, must-revalidate` (Reviewer sieht immer frisch; Edge-HIT hatte alte HTML geliefert).
  - **Wurzel-Rewrite**: `/` -> `/relaunch-preview`, `/x` -> `/relaunch-preview/x` (interner NextResponse.rewrite, kein Redirect). Deshalb zeigt `v2.redrabbit.media/` direkt die Relaunch-Home und `v2.redrabbit.media/leistungen/talos` die Talos-Seite, OHNE /relaunch-preview in der URL.
- `components/ChromeGate.tsx` (neu, Client): blendet das alte Root-Layout-Chrome (`<Header/>` = Ueber uns/Portfolio/Anrufen/Jetzt starten, `<Footer/>` = Bundeslaender/Staedte-SEO) aus fuer /relaunch-preview-Routen UND den v2.*-Host. Root-Layout (`app/layout.tsx`) wickelt Header/Footer jetzt in `<ChromeGate>`. SSG-sicher (Pfad-Check server, Host-Check client -> gleiche Ausgabe, kein Flash/Hydration-Mismatch), kein dynamisches Rendering, Live-Domain unberuehrt.
- Nebenbei gefixt: `MehrwertRechner.tsx` (gerades " -> typografisch, hatte den relaunch-Build gekillt).

## Stand
- Erledigt + verifiziert + live: alles oben. `v2.redrabbit.media` = 200, altes Menue 0, alter Footer 0, noindex aktiv, Deploy Ready.
- Git: Branch `relaunch`, HEAD = origin, alles gepusht. Meine Dateien: `middleware.ts`, `app/layout.tsx`, `components/ChromeGate.tsx`, `app/relaunch-preview/leistungen/talos/page.tsx`, `components/subpages/preise/MehrwertRechner.tsx`.
- Offen / moegliche naechste Schritte:
  1. Beim Durchklicken auf v2: manche alten Pfade existieren im Relaunch nicht -> 404 moeglich (nur die im Relaunch gebauten Seiten funktionieren). Wenn Thomas eine 404-Stelle nennt: Seite bauen oder Link anpassen.
  2. Interne Relaunch-Links zeigen teils noch `/relaunch-preview/...` in der URL (Rewrite betrifft nur die Wurzel-Ebene, nicht die im Markup fest verlinkten Pfade). Fuer eine durchgehend saubere URL muesste man die Links relativieren oder den echten `/v2`-Routen-Umbau machen.
  3. Echter Launch: `/v2/home`-Pfad auf PRODUKTION (statt Subdomain) = Ordner `app/relaunch-preview` -> `app/v2` umbenennen (172 Verweise in 81 Dateien) + Merge in Produktions-Branch. Bewusst aufgeschoben.
- Rueckgaengig (Subdomain oeffentlich): Vercel Domains -> Deployment Protection -> "Require Log In" wieder AN. Aktuell projektweit AUS (25.07., damit Externe die Preview sehen).

## Relevante Dateien
- `middleware.ts` (host-basiertes noindex/no-store/Wurzel-Rewrite)
- `components/ChromeGate.tsx` + `app/layout.tsx` (altes Chrome ausblenden)
- `app/relaunch-preview/page.tsx` (Relaunch-Home: RelaunchMenu/CornerLogo/HomeMorph/CasePanels/HomeClosing/FooterReassembly)
- Memory: `reference_vercel_deploy_verifikation_250mb.md` (Punkte 3-5: Login-Schutz AUS, v2-Subdomain, Wurzel-Rewrite, ChromeGate).
- Dev: `npm run dev -- --port 9000`. KEIN `npm run build` bei laufendem dev.
