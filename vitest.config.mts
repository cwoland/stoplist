import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: [{ find: /^@\//, replacement: `${import.meta.dirname}/` }],
    },
    test: {
        environment: 'jsdom',
        include: ['**/*.test.{ts,tsx}'],
        exclude: ['node_modules', '.next'],
    },
});