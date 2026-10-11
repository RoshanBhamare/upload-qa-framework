// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const reportingLabs = require('./reporting-labs.config');


const CI = !!process.env.CI;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  // Keep requests to the shared public demo host sequential within each spec file.
  fullyParallel: false,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 2 : undefined, // be polite to a shared public demo host
  reporter: [
    ['list'],
     ['reporting-labs', reportingLabs],
    ['./reporters/video-archive.js'],
    // ['html', { open: 'never' }],
    // ['json', { outputFile: 'test-results/results.json' }],
    // ['./reporters/failure-classifier.js'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://the-internet.herokuapp.com',
    actionTimeout: 5_000,
    navigationTimeout: 15_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], video: 'on' } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
