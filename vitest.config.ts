import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Engine tests + pure dashboard logic (lib/dashboard). Stays away from the Next.js
// app/components tree, which has no unit tests and uses JSX/RSC that Vitest should not
// compile here. lib/**/*.test.ts must only cover pure modules (no JSX, no server-only deps).
export default defineConfig({
    resolve: {
        // Mirror the tsconfig "@/*" -> "./*" path alias so tests resolve it like Next/tsc.
        alias: { '@': path.resolve(__dirname, '.') },
    },
    test: {
        include: ['scripts/content-engine/**/*.test.ts', 'lib/**/*.test.ts'],
        environment: 'node',
    },
});
