import { describe, it, expect } from 'vitest';
import { withTimeout } from './google';

// withTimeout guards the unattended daily run: the googleapis/gaxios client has no default
// request timeout, so a stalled GSC call once froze run-daily.sh for 3+ h (no article, no mail).
describe('withTimeout', () => {
    it('resolves with the value when the promise settles before the timeout', async () => {
        const v = await withTimeout(Promise.resolve('ok'), 1000, 'fast');
        expect(v).toBe('ok');
    });

    it('rejects with a timeout error when the promise is too slow', async () => {
        const slow = new Promise<string>((res) => setTimeout(() => res('late'), 200));
        await expect(withTimeout(slow, 20, 'slow-call')).rejects.toThrow(/Timeout nach 20 ms \(slow-call\)/);
    });

    it('propagates the original rejection (not a timeout) when the promise fails fast', async () => {
        const boom = Promise.reject(new Error('real failure'));
        await expect(withTimeout(boom, 1000, 'boom')).rejects.toThrow('real failure');
    });

    it('does not leave the event loop blocked after a timeout (timer is unref-able)', async () => {
        // A never-settling promise must still let the timeout fire and reject.
        const never = new Promise<number>(() => {});
        const start = Date.now();
        await expect(withTimeout(never, 30, 'never')).rejects.toThrow(/Timeout/);
        expect(Date.now() - start).toBeLessThan(500);
    });
});
