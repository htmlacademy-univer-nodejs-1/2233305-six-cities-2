import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['default'],
    globalSetup: './e2e/globalSetup.ts'
  },
});
