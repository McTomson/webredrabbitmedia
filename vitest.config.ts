import { defineConfig } from 'vitest/config';

// Engine tests + pure dashboard logic (lib/dashboard). Stays away from the Next.js
// app/components tree, which has no unit tests and uses JSX/RSC that Vitest should not
// compile here. lib/**/*.test.ts must only cover pure modules (no JSX, no server-only deps).
export default defineConfig({
    test: {
        include: ['scripts/content-engine/**/*.test.ts', 'lib/**/*.test.ts'],
        environment: 'node',
    },
});
