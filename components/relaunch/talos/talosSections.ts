// Stationen der Talos-Praesentation: Copy (message-first, aus TALOS_COPY_2026-07.md)
// + Kino-Kamera-Keyframe pro Station + Kompositions-Seite (Talos links, Card rechts).
// Kamera-Werte am echten Modell vermessen (Head-Center ~ y263, Body-Center ~ y138).
// Reihenfolge nach Spec, Botschaft korrigiert (Hero verankert Website + arbeitet-fuer-dich).

export type CardSide = "right" | "left" | "center";

export interface CamKey {
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
  yaw: number; // Pivot-Drehung (Talos-Ausrichtung)
}

export interface TalosSection {
  id: string;
  label: string; // Kapitel-Punkt rechts
  eyebrow: string;
  headline: string;
  subline?: string;
  says: string[]; // Talos-Sprechzeilen (Crimson)
  bullets?: { title: string; body?: string }[];
  cam: CamKey;
  cardSide: CardSide;
}

// Kamera-Presets (wiederkehrende Einstellungen)
const HERO_CAM: CamKey = { pos: [0, 190, 660], target: [0, 120, 12], fov: 42, yaw: 0 };
const LEFT_NEAR: CamKey = { pos: [120, 205, 470], target: [58, 168, 12], fov: 40, yaw: -0.34 };
const LEFT_WIDE: CamKey = { pos: [130, 205, 540], target: [55, 150, 12], fov: 42, yaw: -0.28 };
const PROFILE_LEFT: CamKey = { pos: [95, 210, 430], target: [52, 175, 12], fov: 39, yaw: -0.46 };
const WIDE_ATMO: CamKey = { pos: [0, 195, 780], target: [0, 110, 12], fov: 42, yaw: 0.1 };
const FACE_YOU: CamKey = { pos: [80, 205, 440], target: [40, 172, 12], fov: 40, yaw: 0.14 };
const CLOSE_BACK: CamKey = { pos: [0, 188, 700], target: [0, 122, 12], fov: 42, yaw: 0 };

export const TALOS_SECTIONS: TalosSection[] = [
  {
    id: "tal-hero",
    label: "Hallo",
    eyebrow: "Deine neue Website",
    headline: "Wir bauen deine Website. Sie arbeitet ab Tag eins für dich.",
    subline:
      "Kein Baukasten, kein Template von der Stange. Eine echte, für deinen Betrieb gebaute Seite zum Fixpreis. Und sie bleibt nicht stehen, sobald sie online ist.",
    says: [
      "Hallo, ich bin Talos. Ich bin das Gesicht deiner neuen Website.",
      "Scroll einfach weiter, ich zeig dir, was ich für dich tue.",
    ],
    cam: HERO_CAM,
    cardSide: "right",
  },
  {
    id: "tal-wer",
    label: "Wer",
    eyebrow: "Wer ist Talos",
    headline: "Kein Zusatz-Gadget. Deine Website selbst, nur dass sie mitarbeitet.",
    subline:
      "Talos ist keine App, die du dir noch dazukaufst. Er ist die Art, wie wir Websites bauen: eine Seite, die dir Arbeit abnimmt, statt nur gut auszusehen.",
    says: [
      "Ich passe auf, dass deine Seite läuft und schnell bleibt.",
      "Kommt eine Anfrage rein, fange ich sie für dich auf.",
      "Und ich sorge dafür, dass sich hinter den Kulissen was bewegt.",
    ],
    cam: LEFT_NEAR,
    cardSide: "right",
  },
  {
    id: "tal-fundament",
    label: "Fundament",
    eyebrow: "In jeder Website drin",
    headline: "Das steckt in jeder Website von uns. Ohne Aufpreis.",
    subline:
      "Jede Seite, die wir bauen, kommt fertig mit dem, wofür andere extra kassieren. Zum Fixpreis, den du vorher kennst.",
    says: [
      "Das ist bei jeder Website von uns dabei. Keine Extra-Rechnung.",
      "Und ja, es ist eine echte Seite, individuell für dich gebaut.",
    ],
    bullets: [
      { title: "Hosting inklusive", body: "Deine Seite läuft schnell und sicher." },
      { title: "Dein Dashboard", body: "Die Zahlen zu deiner Seite in Klartext statt Fachchinesisch." },
      { title: "Selbst ändern", body: "Texte und Bilder änderst du selbst, ganz ohne uns anzurufen." },
      { title: "Ausfall-Alarm", body: "Fällt die Seite aus, wissen wir es vor dir." },
      { title: "Monatlicher Bericht", body: "Zu Tempo und Auffindbarkeit deiner Seite." },
      { title: "Pflege inklusive", body: "Updates und Sicherheit laufen im Hintergrund mit." },
    ],
    cam: LEFT_WIDE,
    cardSide: "right",
  },
  {
    id: "tal-faehig",
    label: "Können",
    eyebrow: "Was Talos kann",
    headline: "Such dir aus, welche Arbeit dir Talos abnimmt.",
    subline:
      "Die Website ist die Basis. Darauf schaltest du Helfer dazu, wie Bausteine. Nimm, was du brauchst, den Rest lässt du weg.",
    says: [
      "Ich schreibe, du entscheidest. Nichts geht online, bevor du Ja sagst.",
      "Meldet sich jemand um zwei Uhr nachts, bin ich trotzdem da.",
      "Ein Klick von dir genügt. Und du kannst mich jederzeit bremsen.",
    ],
    bullets: [
      { title: "Der Schreiber", body: "Hält deine Seite lebendig: schreibt Beiträge und verteilt sie, damit dich Google und deine Kunden finden." },
      { title: "Der Empfang", body: "Lässt keine Anfrage liegen: nimmt Termine und Anfragen auf und hakt automatisch nach." },
      { title: "Auf Anfrage", body: "Vertrieb, Ruf und Sichtbarkeit bauen wir dir nach einem kurzen Gespräch passend dazu." },
    ],
    cam: PROFILE_LEFT,
    cardSide: "right",
  },
  {
    id: "tal-tag",
    label: "Arbeitstag",
    eyebrow: "Ein ganz normaler Tag",
    headline: "So sieht ein Arbeitstag mit Talos aus.",
    subline:
      "Während du deinen Betrieb führst, läuft im Hintergrund einiges. Hier ein Tag, von früh bis spät.",
    says: ["Du machst Feierabend, ich mache noch ein bisschen weiter."],
    bullets: [
      { title: "06:00", body: "Talos prüft die Nacht durch: Seite läuft, alles schnell." },
      { title: "09:15", body: "Ein neuer Beitrag liegt fertig zur Freigabe in deinem Postfach." },
      { title: "12:30", body: "Eine Anfrage kommt rein, während du auf der Baustelle bist. Talos fängt sie auf." },
      { title: "17:40", body: "Ein Interessent hat sich zwei Tage nicht gemeldet. Talos hakt freundlich nach." },
      { title: "22:41", body: "Du schläfst. Deine Seite arbeitet weiter." },
    ],
    cam: WIDE_ATMO,
    cardSide: "right",
  },
  {
    id: "tal-frag",
    label: "Frag Talos",
    eyebrow: "Frag Talos",
    headline: "Nicht sicher, was dein Betrieb braucht? Frag mich.",
    subline:
      "Fünf kurze Fragen, dann sage ich dir, welche Website und welche Helfer zu deinem Betrieb passen. Kein Verkaufsgespräch, du kannst jederzeit aussteigen.",
    says: [
      "Beantworte mir kurz fünf Fragen, dann wird es konkret.",
      "Keine Sorge, ich verkauf dir nichts, was du nicht brauchst.",
    ],
    cam: FACE_YOU,
    cardSide: "right",
  },
  {
    id: "tal-start",
    label: "Start",
    eyebrow: "Los geht's",
    headline: "Deine Website zum Fixpreis. Den Preis kennst du vorher.",
    subline:
      "Feste Preise statt Stundensatz-Ratespiel. Den Entwurf siehst du zuerst, gezahlt wird erst, wenn er dir gefällt.",
    says: ["Bis gleich. Ich freu mich, wenn wir zusammen loslegen."],
    bullets: [
      { title: "950 Euro", body: "Der Einstieg, eine starke Seite für deinen Betrieb." },
      { title: "2.900 Euro", body: "Die beliebteste Wahl, mit mehr Umfang und Selbstlauf." },
      { title: "ab 4.900 Euro", body: "Das Flaggschiff, wenn es richtig was können soll." },
    ],
    cam: CLOSE_BACK,
    cardSide: "center",
  },
];
