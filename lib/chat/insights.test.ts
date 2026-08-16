import { describe, it, expect } from 'vitest';
import { computeTopTerms, isGap, findGaps } from './insights';

describe('computeTopTerms', () => {
    it('counts topic words, ignoring stopwords and short words', () => {
        const qs = [
            'Was kostet eine Website?',
            'Wie lange dauert eine Website?',
            'Kostet die Website extra?',
        ];
        const terms = computeTopTerms(qs);
        const byTerm = Object.fromEntries(terms.map((t) => [t.term, t.count]));
        expect(byTerm['website']).toBe(3);
        expect(byTerm['kostet']).toBe(2);
        // stopwords / short words excluded
        expect(byTerm['was']).toBeUndefined();
        expect(byTerm['die']).toBeUndefined();
    });
    it('respects the top-N limit and sorts by frequency', () => {
        const qs = Array.from({ length: 5 }, () => 'website website website preise hosting');
        const terms = computeTopTerms(qs, 2);
        expect(terms).toHaveLength(2);
        expect(terms[0].term).toBe('website');
        expect(terms[0].count).toBeGreaterThanOrEqual(terms[1].count);
    });
    it('handles empty input', () => {
        expect(computeTopTerms([])).toEqual([]);
    });
});

describe('isGap', () => {
    it('flags no-knowledge admissions', () => {
        expect(isGap('Das kann ich dir leider nicht sagen, ich gebe die Frage weiter.')).toBe(true);
        expect(isGap('Weiß ich nicht genau, magst du das ans Team geben?')).toBe(true);
        expect(isGap('Dazu habe ich keine Info im Moment.')).toBe(true);
    });
    it('does NOT flag normal answers or lead handovers', () => {
        expect(isGap('Eine Website kostet ab 1.250 Euro, je nach Umfang.')).toBe(false);
        expect(isGap('Super, das Team meldet sich bei dir!')).toBe(false);
    });
});

describe('findGaps', () => {
    it('pairs a question with a gap reply in the same session', () => {
        const msgs = [
            { session_id: 's1', rolle: 'user', text: 'Macht ihr auch Apps?', ts: '2026-08-16T10:00:00Z' },
            { session_id: 's1', rolle: 'bot', text: 'Das weiß ich nicht, ich gebe es weiter.', ts: '2026-08-16T10:00:05Z' },
            { session_id: 's1', rolle: 'user', text: 'Was kostet eine Website?', ts: '2026-08-16T10:01:00Z' },
            { session_id: 's1', rolle: 'bot', text: 'Ab 1.250 Euro.', ts: '2026-08-16T10:01:05Z' },
        ];
        const gaps = findGaps(msgs);
        expect(gaps).toHaveLength(1);
        expect(gaps[0].text).toBe('Macht ihr auch Apps?');
    });
    it('does not cross session boundaries', () => {
        const msgs = [
            { session_id: 'a', rolle: 'user', text: 'Frage A', ts: '2026-08-16T10:00:00Z' },
            { session_id: 'b', rolle: 'bot', text: 'weiß ich nicht', ts: '2026-08-16T10:00:01Z' },
        ];
        expect(findGaps(msgs)).toHaveLength(0);
    });
});
