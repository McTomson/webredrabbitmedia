import { describe, it, expect } from 'vitest';
import { computeTopTerms } from './insights';

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
