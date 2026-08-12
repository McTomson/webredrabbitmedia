# Pakete-Research + Entscheidung (11.08.2026)

3-Agenten-Research (Sonnet, parallel) zur Frage: Was sollen die drei Pakete auf
/preise auflisten, wie verpacken, wie die 2x-Preisspruenge rechtfertigen?
Thomas-Freigabe der Richtung: 11.08. ("ja").

## Kernbefunde

### Konkurrenz (11 AT/DE/CH-Agenturen gesichtet)
- Punkte pro Stufe: klein 5-7, gross 7-11. KEINE gute Seite fährt 20+-Listen
  (wirkt Copy-Paste, senkt Vertrauen).
- Preissprung wird ueber Struktur -> Sichtbarkeit -> laufende Wirkung begruendet,
  nicht ueber Feature-Menge oder "mehr Design".
- Nur-im-Top-Paket-Marker (fast ueberall): Shop, Buchungssystem, Mehrsprachigkeit,
  Schnittstellen, Content-/SEO-Strategie, priorisierte Betreuung.
- Beste Vorbilder: web-burgenland.at/webdesign-preise-pakete (klarste Struktur,
  "passt wenn du..."-Satz pro Stufe), evario.at Kostenrechner, semyweb.de
  Handwerker-Seite (inklusive/optional sauber getrennt).

### Kunde (KMU-Inhaber, aus FAQs/Ratgebern/IONOS-Studie)
- Top-Kriterien: gefunden werden/Anfragen, transparente Kosten ohne versteckte
  Folgekosten, selbst aendern koennen, Betreuung danach, Handy, Dauer.
- Groesste Aengste: abgezockt werden, danach allein gelassen, "Seite bringt
  nichts" (nur 46% der KMU messen ueberhaupt etwas -> Talos-Cockpit ist die
  direkte Antwort).
- Nachweislich egal: Technik-Stack, Frameworks, Design-Awards.
- Kundensprache: "gefunden werden", "Telefon klingelt", "selbst aendern",
  "was kostet das", "wie lange dauert das".
- Haeufigste echte Fragen: Kosten/Folgekosten, Dauer, selbst bearbeiten,
  Google, wer betreut danach, Nachtraege, unzufrieden was dann, Backup,
  DSGVO, was muss ich liefern.

### Verpackung (Marketing-Skills offers/pricing/copywriting + SaaS-Beispiele)
- Frage-Antwort ist Best Practice, aber als HYBRID: scanbare Punkte-Struktur
  bleibt (Stufen-Vergleichbarkeit), Punkt-TITEL = Kundenfrage, Antwort startet
  mit Ja/Nein, 1-3 Saetze Klartext. Nie Fliesstext statt Liste.
- 2x-Spruenge ueber Ergebnis-Stufen + sichtbare Arbeit rechtfertigen, nicht
  ueber Feature-Zaehlen. Keine unbelegten ROI-Zahlen (Ehrlichkeits-Regel).
- Business bleibt Anker ("Meistgewaehlt").

## Entscheidung (umgesetzt in PreiseMatrix.tsx)

Ergebnis-Dreiteilung:
- Starter (ab 1.250) = "Du bist professionell online." (5 Fragen)
- Business (ab 2.850) = "Du wirst gefunden, und das Telefon klingelt." (6 Fragen)
- Premium (ab 4.900) = "Deine Website arbeitet fuer dich." (7 Fragen)

Stil-Anker:
- Punkt-Titel = echte Kundenfrage, Antwort Klartext, Haus-Stimme (kein
  Gedankenstrich, du-Form, ehrlich, auffordern statt beruhigen).
- Ehrliche Grenze im Starter ("Leistung+Ort suchen -> Business") = eingebauter
  Upsell ohne Druck. Premium sagt umgekehrt "nur online stehen -> nimm Starter".
- Business Punkt 5 macht die Arbeit zum Preisgrund ("doppelt so viel Arbeit").
- Premium nennt Shop/Terminbuchung/Bezahlen + Talos-Ausbau als Marker (die
  Markt-Standard-Top-Tier-Marker); Spezial-Zusatzfunktionen bleiben im
  Talos-Panel "auf Anfrage".
- BEWUSST WEGGELASSEN: Zeitangaben/Dauer (Thomas hat sich auf keine
  Lieferzeiten festgelegt; fail-closed statt erfinden). Bei Bedarf spaeter.

Preise-Guard unveraendert: 1.250 / 2.850 / ab 4.900, NIE 790.
