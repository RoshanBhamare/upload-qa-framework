// @ts-check
const base = require('@playwright/test');
const { UploadPage } = require('../pages/UploadPage');
const { SampleFiles } = require('../utils/sampleFiles');

/**
 * Single import point for specs: `const { test, expect } = require('../fixtures/test-fixtures')`.
 * Add new page objects / services here and every spec gets them for free.
 */
const test = base.test.extend({
  uploadPage: async ({ page }, use, testInfo) => {
    const uploadPage = new UploadPage(page);
    await uploadPage.goto();
    await uploadPage.showSubtitle(`${testInfo.title}. The upload page is ready.`);
    await use(uploadPage);
  },
  sampleFiles: async ({}, use) => {
    await use(new SampleFiles());
  },
});

module.exports = { test, expect: base.expect };
