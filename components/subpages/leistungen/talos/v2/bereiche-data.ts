/**
 * Bereiche-Daten — die 9 Bereiche der Talos-Kommandozentrale (Thomas 07.08.,
 * Konzept-Entwurf 2 freigegeben "ok finde ich gut"). Reine Daten, Ansicht in
 * ./Bereiche.tsx (gleiches Seam-Muster wie faehigkeiten-data.ts).
 *
 * Copy-Regeln: du-Ton, kurze Saetze, KEIN Fachjargon (kein "KMU", "SEO",
 * "Analytics", "Dashboard-Widget"), kein Wort "gratis" (Thomas). Wert wird
 * ueber "Sonst zahlst du dafuer"-Zeilen gegen das Feindbild (Agentur-Stunden,
 * Einzel-Abos) aufgebaut. badge: 'hot' = rot markiert (Alleinstellung),
 * 'soon' = Phase 2 (Assistent/LLM), ehrlich als "Kommt bald" ausgewiesen.
 */
export type Bereich = {
  /** Gruppe (Thomas 07.08.: 3 beschriftete Gruppen statt 9-Karten-Wand). */
  gruppe: 'machen' | 'wissen' | 'gefunden';
  /** Bereichs-Name (Label-Zeile der Karte). */
  name: string;
  /** Hook-Headline (Serif): beantwortet eine Frage, die er sich laengst stellt. */
  head: string;
  /** Was es konkret ist, in normalen Worten. */
  why: string;
  /** Fettes Lead-in der Wert-Zeile ("Warum das zaehlt" / "Sonst zahlst du dafuer"). */
  edgeLead: string;
  /** Wert-/Vorsprungs-Argument. */
  edge: string;
  /** Talos-Ich-Zeile (kursiv, Marken-Signatur). */
  says: string;
  badge?: 'hot' | 'soon';
};

export const BEREICHE: Bereich[] = [
  {
    gruppe: 'machen',
    name: 'Deine Inhalte',
    head: 'Neuer Preis? Neues Foto? Änderst du selbst, in zwei Minuten.',
    why: 'Du klickst auf den Text, schreibst ihn neu, fertig. Kein Anruf bei der Agentur, keine Rechnung, kein Warten.',
    edgeLead: 'Sonst zahlst du dafür:',
    edge: 'Agenturen rechnen jede Kleinigkeit nach Stunden ab. Über die Jahre kommt da mehr zusammen als die Website gekostet hat.',
    says: 'Sag mir nicht Bescheid. Ändere es einfach. Es ist deine Seite.',
  },
  {
    gruppe: 'wissen',
    name: 'Deine Besucher',
    head: 'Wie viele heute da waren, weißt du ab jetzt genau.',
    why: 'Wie viele Leute kamen, woher, was sie sich angesehen haben. Jeden Tag frisch, ohne dass du etwas tun musst.',
    edgeLead: 'Warum das zählt:',
    edge: 'Ohne Zahlen ist jede Entscheidung geraten. Mit Zahlen siehst du, ob sich Werbung, Flyer oder der neue Text gelohnt haben.',
    says: 'Gestern waren vierzig Leute da. Ich zeig dir, woher sie kamen.',
  },
  {
    gruppe: 'wissen',
    name: 'Klicks und Verhalten',
    head: 'Du siehst, wo deine Besucher klicken. Und wo sie aussteigen.',
    why: 'Eine Karte färbt deine Seite dort ein, wo geklickt wird. Du siehst, welcher Knopf zieht und wo Leute abbrechen.',
    edgeLead: 'Warum das zählt:',
    edge: 'Die meisten Seiten verlieren Kunden an einer einzigen Stelle. Wer die Stelle kennt, kann sie beheben. Wer nicht, verliert weiter.',
    says: 'Deinen Anrufen-Knopf drücken viele. Den weiter unten sieht fast keiner.',
  },
  {
    gruppe: 'gefunden',
    name: 'Gefunden werden',
    head: 'Mit welchen Wörtern dich Google zeigt, steht bei dir drin.',
    why: 'Wonach die Leute suchen, auf welchem Platz du stehst, wie oft geklickt wird. Und wo ein kleiner Schritt dich nach oben bringt.',
    edgeLead: 'Sonst zahlst du dafür:',
    edge: 'Genau diese Auswertung verkaufen andere als eigenes Monats-Abo. Bei uns liegt sie einfach in deiner Zentrale.',
    says: 'Bei einem deiner Suchbegriffe stehst du knapp auf Seite zwei. Ein Schritt, und du bist oben.',
  },
  {
    gruppe: 'gefunden',
    name: 'ChatGPT und Co',
    head: 'Wenn jemand ChatGPT nach einem Betrieb wie deinem fragt: kommst du vor?',
    why: 'Immer mehr Leute fragen nicht mehr Google, sondern eine KI. Talos prüft regelmäßig, ob du dort auftauchst und was über dich erzählt wird.',
    edgeLead: 'Warum du damit vorn bist:',
    edge: 'Deine Konkurrenz denkt daran meist nicht einmal. Du bist dort sichtbar, wo die Kunden von morgen fragen.',
    says: 'Ich habe die KI nach deiner Branche gefragt. Willst du wissen, was sie über dich sagt?',
    badge: 'hot',
  },
  {
    gruppe: 'gefunden',
    name: 'Ruf und Bewertungen',
    head: 'Jede neue Google-Bewertung landet sofort bei dir.',
    why: 'Deine Sterne, jede neue Bewertung, wie oft angerufen und der Weg zu dir gesucht wird. Alles an einem Ort statt in fünf Apps.',
    edgeLead: 'Warum das zählt:',
    edge: 'Die meisten lesen Bewertungen, bevor sie anrufen. Wer schnell und freundlich antwortet, gewinnt sie. Wer nichts mitbekommt, nicht.',
    says: 'Neue Fünf-Sterne-Bewertung von heute Vormittag. Willst du antworten?',
  },
  {
    gruppe: 'wissen',
    name: 'Technik-Gesundheit',
    head: 'Ist die Seite schnell, sicher, erreichbar? Talos prüft es rund um die Uhr.',
    why: 'Ladezeit, Erreichbarkeit, Sicherheitszertifikat, kaputte Links. Stimmt etwas nicht, schlägt Talos Alarm, bevor es ein Kunde merkt.',
    edgeLead: 'Warum das zählt:',
    edge: 'Die meisten merken erst, dass ihre Seite weg war, wenn jemand anruft. Bei dir ist es umgekehrt.',
    says: 'Deine Seite lädt langsam am Handy. Das kostet dich Besucher. Hier ist der Grund.',
  },
  {
    gruppe: 'wissen',
    name: 'Deine Anfragen',
    head: 'Keine Anfrage geht dir mehr durch. Keine einzige.',
    why: 'Jede Nachricht über deine Seite fängt Talos auf, sammelt sie an einem Ort und sagt dir Bescheid. Du siehst, wie viele kamen und was daraus wurde.',
    edgeLead: 'Warum das zählt:',
    edge: 'Eine übersehene Anfrage ist ein Auftrag, der zur Konkurrenz geht. Hier siehst du schwarz auf weiß, was deine Seite einbringt.',
    says: 'Um zwei Uhr früh kam eine Anfrage. Sie liegt sauber für dich bereit.',
  },
  {
    gruppe: 'machen',
    name: 'Dein Assistent',
    head: 'Und wenn du eine Zahl nicht verstehst, fragst du einfach.',
    why: 'Talos erklärt dir jede Auswertung in normalen Worten und hilft dir beim Schreiben, wenn du einen besseren Text willst.',
    edgeLead: 'Warum das zählt:',
    edge: 'Andere lassen dich mit Kurven und Fachwörtern allein. Talos übersetzt. Du entscheidest.',
    says: 'Frag mich, was die Zahl heißt. Ich sag es dir ohne Fachwörter.',
    badge: 'soon',
  },
];
