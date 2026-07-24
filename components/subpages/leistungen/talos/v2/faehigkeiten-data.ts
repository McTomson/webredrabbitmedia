/**
 * Faehigkeiten-Daten — Typ + FAEHIGKEITEN-Array (6 Eintraege, 5 buchbare +
 * "Die Sonderanfertigung" invers). Einziger Konsument: Faehigkeiten.tsx
 * (Firmen-Grid + Modal). Daten/View bewusst getrennt, damit die reine Copy
 * die Grid-Komponente nicht aufblaeht. Quelle der Copy:
 * docs/specs/TALOS_COPY_V2_2026-07-22_ENTWURF.md, Sektion 4.
 */
export type Faehigkeit = {
  name: string;
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
    nutzen: 'Er schreibt regelmäßig Beiträge für deinen Betrieb und verteilt sie dort, wo deine Kunden und Google sie finden.',
    fuerWen: 'Für alle, die wissen, dass sie eigentlich bloggen sollten, aber nie dazukommen.',
    ablauf: 'Er legt dir fertige Beiträge als Entwurf ins Postfach. Du liest drüber, ein Klick, online.',
    warum: 'Eine Seite, die regelmäßig Neues bringt, wird öfter gefunden und wirkt lebendig. Ganz ohne dass du selbst schreiben musst.',
    says: 'Ich schreibe, du entscheidest. Nichts geht raus, bevor du Ja sagst.',
  },
  {
    name: 'Der Empfang',
    nutzen: 'Er fängt jede Anfrage auf, meldet sich sofort zurück, hakt nach, wenn jemand still wird, und schlägt Termine vor.',
    fuerWen: 'Für alle, die tagsüber am Kunden, auf der Baustelle oder im Betrieb sind und nicht ans Postfach kommen.',
    ablauf: 'Kommt eine Anfrage rein, reagiert er sofort in deiner Art. Was er vorbereitet, siehst du und gibst es frei, oder du lässt ihn machen.',
    warum: 'Die meisten Interessenten springen ab, wenn sie zu lange auf Antwort warten. Talos lässt niemanden warten, auch nachts nicht.',
    says: 'Meldet sich jemand um zwei Uhr früh, bin ich trotzdem da.',
  },
  {
    name: 'Der Aussendienst',
    nutzen: 'Er sucht deine Wunschkunden, findet die passenden Ansprechpartner und schreibt sie in deinem Namen an.',
    fuerWen: 'Für Betriebe, die nicht nur gefunden werden wollen, sondern selbst auf Leute zugehen.',
    ablauf: 'Du sagst ihm, wen du suchst. Er recherchiert und legt dir die Nachrichten fertig hin. Du gibst frei, was rausgeht.',
    warum: 'Neukunden gewinnen kostet normalerweise viel Zeit oder viel Geld. Talos übernimmt das Suchen und Anschreiben, du führst nur noch die Gespräche, die was werden.',
    says: 'Sag mir, wen du gewinnen willst. Den Erstkontakt übernehme ich.',
  },
  {
    name: 'Der Poster',
    nutzen: 'Er macht regelmäßig Posts für deine Kanäle, in deinem Ton und mit deinen Themen.',
    fuerWen: 'Für alle, die wissen, dass sie präsent sein sollten, aber keine Lust auf den täglichen Post-Stress haben.',
    ablauf: 'Er bereitet die Posts vor, du siehst sie vorher, ein Klick und sie sind draußen. Oder du lässt ihn einen Kanal allein bespielen.',
    warum: 'Regelmäßig sichtbar zu sein bringt Kunden, kostet aber Disziplin. Talos hält die Disziplin, du behältst die Kontrolle.',
    says: 'Ich halte deine Kanäle lebendig, du musst nicht mehr dran denken.',
  },
  {
    name: 'Der Sichtbarmacher',
    nutzen: 'Er sorgt dafür, dass dich mehr Leute finden, bei Google und bei den neuen Antwort-Maschinen, die immer mehr Leute statt einer Suche fragen.',
    fuerWen: 'Für alle, die online zu selten auftauchen und daran etwas ändern wollen.',
    ablauf: 'Er beobachtet, wo und wie du gefunden wirst, und arbeitet laufend daran, dass es mehr wird. Was er dafür tut, siehst du in deinem Dashboard.',
    warum: 'Immer mehr Menschen suchen nicht mehr selbst, sondern fragen und bekommen eine Antwort empfohlen. Wer da nicht auftaucht, existiert für sie nicht. Talos sorgt dafür, dass du auftauchst.',
    says: 'Ich sorge dafür, dass man dich empfiehlt, nicht nur findet.',
  },
  {
    name: 'Die Sonderanfertigung',
    nutzen: 'Braucht dein Betrieb etwas, das es so nicht von der Stange gibt, bauen wir es. Marktanalyse, Research-Beiträge, fertige Antwort-Entwürfe, Termin-Abstimmung, jede Automatisierung, die dir Zeit spart.',
    fuerWen: 'Für alle mit einer wiederkehrenden Aufgabe, die nervt und Zeit frisst, aber in kein fertiges Feld passt.',
    ablauf: 'Kurzes Gespräch, wir schauen uns an, was du brauchst, und schneidern es Talos passend auf den Leib.',
    warum: 'Kein Betrieb ist gleich. Statt dir ein Standardpaket aufzudrücken, bauen wir genau das, was bei dir Arbeit spart.',
    says: 'Sag mir, was dich ständig aufhält. Wahrscheinlich baue ich dir das.',
    invers: true,
  },
];
