import { defineConfig } from 'vitest/config';

// Engine tests only. Keeps Vitest away from the Next.js app/components tree,
// which has no unit tests and uses JSX/RSC that Vitest should not compile here.
export default defineConfig({
    test: {
        include: ['scripts/content-engine/**/*.test.ts'],
        environment: 'node',
    },
});
