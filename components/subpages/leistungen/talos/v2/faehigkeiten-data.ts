/**
 * Faehigkeiten-Daten — Typ + FAEHIGKEITEN-Array (6 Eintraege, 5 buchbare +
 * "Die Sonderanfertigung" invers). Einziger Konsument: Faehigkeiten.tsx
 * (Firmen-Grid + Modal). Daten/View bewusst getrennt, damit die reine Copy
 * die Grid-Komponente nicht aufblaeht.
 *
 * Copy-Quellen:
 *  - nutzen/fuerWen/ablauf/warum/says: docs/specs/TALOS_COPY_V2_2026-07-22_
 *    ENTWURF.md, Sektion 4 (unveraendert uebernommen).
 *  - kurz + koennen[] (je 6 konkrete Faehigkeiten): ENTWURF 24.07. (Thomas'
 *    Wunsch, Modal wie Website-"Drei Pakete": links Name, rechts konkrete
 *    Faehigkeiten als Klick-Akkordeon). ABGELEITET aus Rolle + nutzen/ablauf,
 *    NOCH NICHT von Thomas final freigegeben -> Wort fuer Wort korrigierbar.
 */
export type Koennen = {
  titel: string;
  detail: string;
};

export type Faehigkeit = {
  name: string;
  kurz: string; // Einzeiler links unter dem Namen (ENTWURF)
  koennen: Koennen[]; // konkrete Faehigkeiten, klickbar -> Detail (ENTWURF)
  nutzen: string;
  fuerWen: string;
  ablauf: string;
  warum: string;
  says: string;
  invers?: boolean;
};

export const FAEHIGKEITEN: Faehigkeit[] = [
  {
    name: 'Der Schreiber',
    kurz: 'Dein Blog läuft, ohne dass du schreibst.',
    koennen: [
      { titel: 'Regelmäßige Blog-Beiträge', detail: 'Er schreibt laufend Beiträge zu deinen Themen und legt sie dir als Entwurf ins Postfach. Du liest drüber, ein Klick, online.' },
      { titel: 'Themen-Ideen für deinen Betrieb', detail: 'Fällt dir kein Thema ein, schlägt er welche vor, die zu deinen Kunden und deiner Branche passen.' },
      { titel: 'Geschrieben in deinem Ton', detail: 'Er lernt deine Sprache und schreibt so, als hättest du es selbst getippt.' },
      { titel: 'Verteilt, wo man dich findet', detail: 'Die Beiträge landen dort und sind so gebaut, dass Kunden und Google sie finden.' },
      { titel: 'Alte Beiträge aufgefrischt', detail: 'Er hält ältere Beiträge aktuell, damit deine Seite nicht veraltet wirkt.' },
      { titel: 'Immer erst zu deiner Freigabe', detail: 'Nichts geht online, bevor du es gesehen und Ja gesagt hast.' },
    ],
    nutzen: 'Er schreibt regelmäßig Beiträge für deinen Betrieb und verteilt sie dort, wo deine Kunden und Google sie finden.',
    fuerWen: 'Für alle, die wissen, dass sie eigentlich bloggen sollten, aber nie dazukommen.',
    ablauf: 'Er legt dir fertige Beiträge als Entwurf ins Postfach. Du liest drüber, ein Klick, online.',
    warum: 'Eine Seite, die regelmäßig Neues bringt, wird öfter gefunden und wirkt lebendig. Ganz ohne dass du selbst schreiben musst.',
    says: 'Ich schreibe, du entscheidest. Nichts geht raus, bevor du Ja sagst.',
  },
  {
    name: 'Der Empfang',
    kurz: 'Keine Anfrage bleibt liegen.',
    koennen: [
      { titel: 'Sofort-Antwort auf Anfragen', detail: 'Kommt eine Anfrage rein, meldet er sich sofort zurück, in deiner Art und rund um die Uhr.' },
      { titel: 'Nachfassen, wenn jemand still wird', detail: 'Antwortet ein Interessent nicht, hakt er höflich nach, damit dir niemand verloren geht.' },
      { titel: 'Termine vorschlagen und abstimmen', detail: 'Er schlägt passende Termine vor und stimmt sie ab. Kein Hin und Her per Mail mehr.' },
      { titel: 'Rund um die Uhr erreichbar', detail: 'Auch abends, am Wochenende und nachts bekommt jede Anfrage sofort eine Reaktion.' },
      { titel: 'Häufige Fragen direkt beantwortet', detail: 'Standardfragen klärt er selbst, den Rest bereitet er für dich vor.' },
      { titel: 'Alles in deiner Art', detail: 'Er antwortet im Ton deines Betriebs, freundlich und passend.' },
    ],
    nutzen: 'Er fängt jede Anfrage auf, meldet sich sofort zurück, hakt nach, wenn jemand still wird, und schlägt Termine vor.',
    fuerWen: 'Für alle, die tagsüber am Kunden, auf der Baustelle oder im Betrieb sind und nicht ans Postfach kommen.',
    ablauf: 'Kommt eine Anfrage rein, reagiert er sofort in deiner Art. Was er vorbereitet, siehst du und gibst es frei, oder du lässt ihn machen.',
    warum: 'Die meisten Interessenten springen ab, wenn sie zu lange auf Antwort warten. Talos lässt niemanden warten, auch nachts nicht.',
    says: 'Meldet sich jemand um zwei Uhr früh, bin ich trotzdem da.',
  },
  {
    name: 'Der Aussendienst',
    kurz: 'Er geht auf deine Wunschkunden zu.',
    koennen: [
      { titel: 'Wunschkunden finden', detail: 'Du sagst ihm, wen du suchst. Er recherchiert die passenden Betriebe.' },
      { titel: 'Ansprechpartner recherchieren', detail: 'Er findet die richtige Person, an die die Nachricht gehen soll.' },
      { titel: 'Erstkontakt schreiben', detail: 'Er legt dir die Nachrichten fertig hin. Du gibst frei, was rausgeht.' },
      { titel: 'In deinem Namen anschreiben', detail: 'Der Kontakt läuft über deinen Betrieb, in deinem Ton.' },
      { titel: 'Nachfassen bei Interessenten', detail: 'Meldet sich niemand, hakt er höflich ein zweites Mal nach.' },
      { titel: 'Heiße Kontakte übergeben', detail: 'Wird ein Kontakt konkret, legt er ihn dir zur Übernahme hin.' },
    ],
    nutzen: 'Er sucht deine Wunschkunden, findet die passenden Ansprechpartner und schreibt sie in deinem Namen an.',
    fuerWen: 'Für Betriebe, die nicht nur gefunden werden wollen, sondern selbst auf Leute zugehen.',
    ablauf: 'Du sagst ihm, wen du suchst. Er recherchiert und legt dir die Nachrichten fertig hin. Du gibst frei, was rausgeht.',
    warum: 'Neukunden gewinnen kostet normalerweise viel Zeit oder viel Geld. Talos übernimmt das Suchen und Anschreiben, du führst nur noch die Gespräche, die was werden.',
    says: 'Sag mir, wen du gewinnen willst. Den Erstkontakt übernehme ich.',
  },
  {
    name: 'Der Poster',
    kurz: 'Deine Kanäle bleiben lebendig.',
    koennen: [
      { titel: 'Regelmäßige Social-Posts', detail: 'Er macht laufend Posts, damit deine Kanäle nicht einschlafen.' },
      { titel: 'Posts in deinem Ton', detail: 'In deiner Sprache und mit deinen Themen, als kämen sie von dir.' },
      { titel: 'Passende Anlässe aufgegriffen', detail: 'Er greift Feiertage, Aktionen und aktuelle Themen von selbst auf.' },
      { titel: 'Mehrere Kanäle bespielt', detail: 'Er kümmert sich um deine Kanäle parallel, ohne dass du umschalten musst.' },
      { titel: 'Kanal auf Selbstlauf', detail: 'Oder du lässt ihn einen Kanal ganz allein bespielen.' },
      { titel: 'Immer erst zu deiner Freigabe', detail: 'Du siehst jeden Post vorher, ein Klick, draußen.' },
    ],
    nutzen: 'Er macht regelmäßig Posts für deine Kanäle, in deinem Ton und mit deinen Themen.',
    fuerWen: 'Für alle, die wissen, dass sie präsent sein sollten, aber keine Lust auf den täglichen Post-Stress haben.',
    ablauf: 'Er bereitet die Posts vor, du siehst sie vorher, ein Klick und sie sind draußen. Oder du lässt ihn einen Kanal allein bespielen.',
    warum: 'Regelmäßig sichtbar zu sein bringt Kunden, kostet aber Disziplin. Talos hält die Disziplin, du behältst die Kontrolle.',
    says: 'Ich halte deine Kanäle lebendig, du musst nicht mehr dran denken.',
  },
  {
    name: 'Der Sichtbarmacher',
    kurz: 'Mehr Menschen finden dich.',
    koennen: [
      { titel: 'Besser bei Google gefunden', detail: 'Er arbeitet laufend daran, dass dich mehr Leute bei Google finden.' },
      { titel: 'Bei den Antwort-Maschinen auftauchen', detail: 'Er sorgt dafür, dass du in den empfohlenen Antworten vorkommst.' },
      { titel: 'Sichtbarkeit laufend beobachtet', detail: 'Er behält im Blick, wo und wie du gefunden wirst.' },
      { titel: 'Schwachstellen der Seite behoben', detail: 'Er findet, was dich zurückhält, und bessert es aus.' },
      { titel: 'Lokale Sichtbarkeit gestärkt', detail: 'Damit dich vor allem Leute aus deiner Gegend finden.' },
      { titel: 'Alles sichtbar im Dashboard', detail: 'Was er tut und was es bringt, siehst du jederzeit nach.' },
    ],
    nutzen: 'Er sorgt dafür, dass dich mehr Leute finden, bei Google und bei den neuen Antwort-Maschinen, die immer mehr Leute statt einer Suche fragen.',
    fuerWen: 'Für alle, die online zu selten auftauchen und daran etwas ändern wollen.',
    ablauf: 'Er beobachtet, wo und wie du gefunden wirst, und arbeitet laufend daran, dass es mehr wird. Was er dafür tut, siehst du in deinem Dashboard.',
    warum: 'Immer mehr Menschen suchen nicht mehr selbst, sondern fragen und bekommen eine Antwort empfohlen. Wer da nicht auftaucht, existiert für sie nicht. Talos sorgt dafür, dass du auftauchst.',
    says: 'Ich sorge dafür, dass man dich empfiehlt, nicht nur findet.',
  },
  {
    name: 'Die Sonderanfertigung',
    kurz: 'Gebaut auf deinen Betrieb.',
    koennen: [
      { titel: 'Auf deinen Betrieb zugeschnitten', detail: 'Braucht dein Betrieb etwas Eigenes, bauen wir genau das.' },
      { titel: 'Marktanalyse und Research', detail: 'Er sammelt und wertet für dich aus, was du an Wissen brauchst.' },
      { titel: 'Fertige Antwort-Entwürfe', detail: 'Wiederkehrende Antworten legt er dir vorbereitet hin.' },
      { titel: 'Termin-Abstimmung automatisiert', detail: 'Das Hin und Her um Termine übernimmt er im Hintergrund.' },
      { titel: 'Wiederkehrende Aufgaben automatisiert', detail: 'Was dich ständig aufhält, läuft danach von allein.' },
      { titel: 'Kurzes Gespräch, dann gebaut', detail: 'Wir schauen uns an, was du brauchst, und schneidern es auf.' },
    ],
    nutzen: 'Braucht dein Betrieb etwas, das es so nicht von der Stange gibt, bauen wir es. Marktanalyse, Research-Beiträge, fertige Antwort-Entwürfe, Termin-Abstimmung, jede Automatisierung, die dir Zeit spart.',
    fuerWen: 'Für alle mit einer wiederkehrenden Aufgabe, die nervt und Zeit frisst, aber in kein fertiges Feld passt.',
    ablauf: 'Kurzes Gespräch, wir schauen uns an, was du brauchst, und schneidern es Talos passend auf den Leib.',
    warum: 'Kein Betrieb ist gleich. Statt dir ein Standardpaket aufzudrücken, bauen wir genau das, was bei dir Arbeit spart.',
    says: 'Sag mir, was dich ständig aufhält. Wahrscheinlich baue ich dir das.',
    invers: true,
  },
];
