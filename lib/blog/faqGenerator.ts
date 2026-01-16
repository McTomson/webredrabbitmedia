/**
 * FAQ Generator für Blog-Posts
 *
 * Generiert automatisch SEO-optimierte FAQs basierend auf:
 * - H1 und H2 Headings aus dem Artikel
 * - Keywords in den Headings
 * - Deutsche Fragestellung für bessere GEO/LLM Optimierung
 */

export interface FAQ {
    question: string;
    answer: string;
}

interface Heading {
    id: string;
    text: string;
    level: number;
}

/**
 * Hauptfunktion: Generiert FAQs aus Artikel-Headings
 */
export function generateFAQsFromHeadings(
    headings: Heading[],
    articleTitle: string,
    content: string
): FAQ[] {
    const faqs: FAQ[] = [];

    // Schritt 1: Title-basierte FAQ als erste Frage
    const titleFAQ = generateTitleFAQ(articleTitle, content);
    if (titleFAQ) {
        faqs.push(titleFAQ);
    }

    // Schritt 2: H2-Headings in FAQs konvertieren
    const h2Headings = headings.filter(h => h.level === 2);

    h2Headings.forEach(heading => {
        const question = convertToQuestion(heading.text);
        const answer = extractSectionSummary(heading, content);

        if (question && answer) {
            faqs.push({ question, answer });
        }
    });

    // Schritt 3: Limit auf 5-8 FAQs (SEO Best Practice)
    return faqs.slice(0, 8);
}

/**
 * Generiert FAQ basierend auf Artikel-Titel
 */
function generateTitleFAQ(title: string, content: string): FAQ | null {
    // Extrahiere erste 2-3 Sätze als Antwort
    const sentences = content
        .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
        .replace(/^#.+$/gm, '') // Remove headings
        .trim()
        .match(/[^.!?]+[.!?]+/g) || [];

    const answer = sentences.slice(0, 2).join(' ').substring(0, 300);

    if (!answer) return null;

    // Wenn Titel bereits eine Frage ist, verwende ihn direkt
    if (title.includes('?')) {
        return { question: title, answer };
    }

    // Sonst: Konvertiere Titel in Frage
    const question = convertToQuestion(title);
    return { question, answer };
}

/**
 * Konvertiert Heading-Text in deutsche Frage
 */
export function convertToQuestion(text: string): string {
    // Bereinigung
    let clean = text
        .replace(/^\d+\.\s*/, '') // Entferne Nummern
        .replace(/^[#\s]+/, '') // Entferne # und Spaces
        .trim();

    // Wenn bereits eine Frage, direkt zurückgeben
    if (clean.endsWith('?')) {
        return clean;
    }

    // Pattern-basierte Konvertierung
    const lowerText = clean.toLowerCase();

    // Kosten/Preis Keywords
    if (lowerText.match(/kosten|preis|tarif|gebühr|investition/)) {
        return inferCostQuestion(clean);
    }

    // Zeit/Dauer Keywords
    if (lowerText.match(/dauer|zeit|lange|schnell|zeitraum/)) {
        return inferTimeQuestion(clean);
    }

    // Fehler/Problem Keywords
    if (lowerText.match(/fehler|problem|stolperstein|risik|gefahr/)) {
        return inferProblemQuestion(clean);
    }

    // Vorteile/Nutzen Keywords
    if (lowerText.match(/vorteil|nutzen|benefit|plus|gewinn/)) {
        return inferBenefitQuestion(clean);
    }

    // Unterschied/Vergleich Keywords
    if (lowerText.match(/unterschied|vergleich|vs|versus|gegenüber/)) {
        return inferComparisonQuestion(clean);
    }

    // Arten/Typen Keywords
    if (lowerText.match(/arten|typen|varianten|formen|möglichkeit/)) {
        return `Welche ${clean} gibt es?`;
    }

    // Auswahl/Entscheidung Keywords
    if (lowerText.match(/auswahl|wahl|entscheid|bestimm|find/)) {
        return `Wie ${clean}?`;
    }

    // Funktion/Arbeitsweise Keywords
    if (lowerText.match(/funktion|arbeitsweise|mechanismus|ablauf|prozess/)) {
        return `Wie funktioniert ${clean}?`;
    }

    // Default: "Was ist..." für Definitionen
    return `Was ist ${clean}?`;
}

/**
 * Spezifische Frage-Inferenz für Kosten
 */
function inferCostQuestion(text: string): string {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('faktoren') || lowerText.includes('beeinfluss')) {
        return `Welche Faktoren beeinflussen ${text.replace(/faktoren|beeinfluss/gi, '').trim()}?`;
    }

    if (lowerText.includes('sparen') || lowerText.includes('reduzier')) {
        return `Wie kann man bei ${text} sparen?`;
    }

    // Default für Kosten
    return `Was kostet ${text.replace(/kosten|preis|tarif|gebühr/gi, '').trim()}?`;
}

/**
 * Spezifische Frage-Inferenz für Zeit/Dauer
 */
function inferTimeQuestion(text: string): string {
    const subject = text.replace(/dauer|zeit|lange|schnell|zeitraum/gi, '').trim();
    return `Wie lange dauert ${subject}?`;
}

/**
 * Spezifische Frage-Inferenz für Probleme/Fehler
 */
function inferProblemQuestion(text: string): string {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('vermeid') || lowerText.includes('verhinder')) {
        return `Wie vermeidet man ${text.replace(/vermeid|verhinder/gi, '').trim()}?`;
    }

    return `Welche ${text} sollte man vermeiden?`;
}

/**
 * Spezifische Frage-Inferenz für Vorteile
 */
function inferBenefitQuestion(text: string): string {
    const subject = text.replace(/vorteil|nutzen|benefit|plus|gewinn/gi, '').trim();
    return `Was sind die Vorteile von ${subject}?`;
}

/**
 * Spezifische Frage-Inferenz für Vergleiche
 */
function inferComparisonQuestion(text: string): string {
    return `Was ist der ${text}?`;
}

/**
 * Extrahiert Section-Zusammenfassung als Antwort
 */
export function extractSectionSummary(heading: Heading, content: string): string {
    // Finde Section-Start
    const headingPattern = `## ${heading.text}`;
    const sectionStart = content.indexOf(headingPattern);

    if (sectionStart === -1) return '';

    // Finde nächsten H2 (Section-Ende)
    const nextH2Pattern = /^## /gm;
    nextH2Pattern.lastIndex = sectionStart + headingPattern.length;
    const nextMatch = nextH2Pattern.exec(content);
    const sectionEnd = nextMatch ? nextMatch.index : content.length;

    // Extrahiere Section-Content
    let sectionContent = content.substring(sectionStart + headingPattern.length, sectionEnd).trim();

    // Entferne H3 Headings
    sectionContent = sectionContent.replace(/^### .+$/gm, '');

    // Entferne MDX-Komponenten (vereinfacht)
    sectionContent = sectionContent.replace(/<[A-Z]\w+[^>]*>[\s\S]*?<\/[A-Z]\w+>/g, '');
    sectionContent = sectionContent.replace(/<[A-Z]\w+[^>]*\/>/g, '');

    // Entferne Markdown-Formatierung
    sectionContent = sectionContent
        .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
        .replace(/\*(.+?)\*/g, '$1') // Italic
        .replace(/`(.+?)`/g, '$1') // Code
        .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Links
        .trim();

    // Extrahiere erste 2-3 Sätze
    const sentences = sectionContent.match(/[^.!?]+[.!?]+/g) || [];

    if (sentences.length === 0) return '';

    // Erstelle prägnante Antwort (max 250 Zeichen für Featured Snippet Optimierung)
    let answer = sentences.slice(0, 2).join(' ').trim();

    // Kürze auf max 250 Zeichen
    if (answer.length > 250) {
        answer = answer.substring(0, 247) + '...';
    }

    return answer;
}

/**
 * Validiert FAQ-Qualität
 */
export function validateFAQ(faq: FAQ): boolean {
    // Frage muss mit Fragewort beginnen
    const startsWithQuestionWord = /^(Was|Wie|Warum|Welche|Wann|Wo|Wer|Wessen)/i.test(faq.question);

    // Frage muss mit ? enden
    const endsWithQuestionMark = faq.question.endsWith('?');

    // Antwort muss mindestens 50 Zeichen haben
    const hasSubstantialAnswer = faq.answer.length >= 50;

    // Antwort darf nicht zu lang sein (max 300 Zeichen)
    const answerNotTooLong = faq.answer.length <= 300;

    return startsWithQuestionWord && endsWithQuestionMark && hasSubstantialAnswer && answerNotTooLong;
}

/**
 * Filtert und sortiert FAQs nach Qualität
 */
export function filterAndSortFAQs(faqs: FAQ[]): FAQ[] {
    return faqs
        .filter(validateFAQ)
        .slice(0, 8); // Max 8 FAQs für SEO
}
