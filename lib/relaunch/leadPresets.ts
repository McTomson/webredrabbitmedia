/**
 * Lead-Popup Presets (Thomas 06.08.2026).
 *
 * Jeder Lead-CTA im Relaunch oeffnet dasselbe wiederverwendbare Anfrage-Popup
 * (components/relaunch/lead/LeadDialog.tsx). Welche Ueberschrift, welches
 * vorbefuellte "Worum geht's?" (service) und ob das URL-Feld erscheint, kommt
 * aus diesen Presets. So bleibt EIN Popup fuer die ganze Seite, aber der
 * Kontext des geklickten Buttons (Paket, Talos, Analyse, Quiz-Empfehlung)
 * wird passend vorbefuellt.
 *
 * Copy grounded in brand/ (RisikoBand: "Entwurf ohne Vorkasse", Reaktionszeit
 * "in der Regel am selben Werktag"). Preise 1.250 / 2.850 / ab 4.900 sind
 * kanonisch (decisions-log 30.07.). Ton = du, kurz, keine Gedankenstriche,
 * keine Floskeln.
 */

export type LeadPresetKey =
  | "standard"
  | "paket"
  | "talos"
  | "skill"
  | "analyse"
  | "quiz";

/** Was der Aufrufer uebergibt (Attribut oder open()-Argument). */
export interface LeadOpenOpts {
  preset?: LeadPresetKey | string;
  /** Vorbefuelltes "Worum geht's?" (ueberschreibt den Preset-Default). */
  service?: string;
  /** Optionaler Vorbefuell-Text im Nachrichtenfeld (z.B. Quiz-Ergebnis). */
  messagePrefill?: string;
}

/** Aufgeloeste Anzeige-Konfiguration fuer das Popup. */
export interface LeadConfig {
  title: string;
  sub: string;
  /** Vorbefuellter service-Wert ("" = Nutzer waehlt selbst). */
  service: string;
  /** URL-Feld "Deine aktuelle Website" zeigen (Analyse-Variante). */
  showUrl: boolean;
  /** Optionaler Vorbefuell-Text fuer das Nachrichtenfeld. */
  messagePrefill: string;
  submitLabel: string;
}

/** Standard-Auswahl im "Worum geht's?"-Dropdown. */
export const SERVICE_OPTIONS: string[] = [
  "Neue Website",
  "Meine Website ist alt oder bringt nichts",
  "Ich werde bei Google nicht gefunden",
  "Bei Google und bei der KI gefunden werden",
  "Laufende Betreuung für eine bestehende Seite",
  "Talos und KI-Agenten",
  "Etwas anderes",
];

const RISIKO_SUB =
  "Erzähl uns kurz, worum es geht. Wir melden uns, in der Regel am selben Werktag. Der erste Entwurf entsteht ohne Vorkasse.";

const BASE: Record<LeadPresetKey, LeadConfig> = {
  standard: {
    title: "Entwurf ohne Vorkasse",
    sub: RISIKO_SUB,
    service: "",
    showUrl: false,
    messagePrefill: "",
    submitLabel: "Anfrage senden",
  },
  paket: {
    title: "Entwurf ohne Vorkasse",
    sub: RISIKO_SUB,
    service: "Neue Website",
    showUrl: false,
    messagePrefill: "",
    submitLabel: "Anfrage senden",
  },
  talos: {
    title: "Reden wir über Talos",
    sub: "Sag uns kurz, was Talos für dich tun soll. Wir melden uns, in der Regel am selben Werktag. Unverbindlich.",
    service: "Talos und KI-Agenten",
    showUrl: false,
    messagePrefill: "",
    submitLabel: "Anfrage senden",
  },
  skill: {
    title: "Reden wir über Talos",
    sub: "Sag uns kurz, was du brauchst. Wir melden uns, in der Regel am selben Werktag. Unverbindlich.",
    service: "Talos und KI-Agenten",
    showUrl: false,
    messagePrefill: "",
    submitLabel: "Anfrage senden",
  },
  analyse: {
    title: "Kostenlose Analyse deiner Seite",
    sub: "Sag uns, welche Seite du hast. Wir schauen sie uns an und melden uns mit ehrlichem Feedback. Kein Verkaufsdruck.",
    service: "Kostenlose Website-Analyse",
    showUrl: true,
    messagePrefill: "",
    submitLabel: "Analyse anfordern",
  },
  quiz: {
    title: "Entwurf ohne Vorkasse",
    sub: RISIKO_SUB,
    service: "Neue Website",
    showUrl: false,
    messagePrefill: "",
    submitLabel: "Anfrage senden",
  },
};

/**
 * Loest die Klick-Optionen zu einer fertigen Popup-Konfiguration auf.
 * Unbekannte Preset-Keys fallen sicher auf "standard" zurueck.
 */
export function resolveLeadConfig(opts: LeadOpenOpts | null | undefined): LeadConfig {
  const key = (opts?.preset ?? "standard") as LeadPresetKey;
  const base = BASE[key] ?? BASE.standard;
  return {
    ...base,
    service: opts?.service ?? base.service,
    messagePrefill: opts?.messagePrefill ?? base.messagePrefill,
  };
}
