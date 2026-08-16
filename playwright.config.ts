import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: ['tests/**/*.spec.ts'],
  use: {
    baseURL: 'file://' + __dirname,
  },
  webServer: {
    command: 'npx http-server -p 0',
    port: 0,
    reuseExistingServer: !process.env.CI,
  },
});
