import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: ['tests/**/*.spec.ts'],
  projects: [
    {
      name: 'unit',
      testMatch: /tests\/unit/,
    },
    {
      name: 'ui',
      testMatch: /tests\/ui/,
      use: {
        baseURL: 'http://localhost:3123',
      },
      webServer: {
        command: 'python3 -m http.server 3123 --directory .',
        port: 3123,
        reuseExistingServer: !process.env.CI,
        timeout: 10000,
      },
    },
  ],
});