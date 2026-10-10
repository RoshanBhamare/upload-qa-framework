// @ts-check
const { test, expect } = require('../fixtures/test-fixtures');
const { meta } = require('reporting-labs');

test.describe('File upload', () => {
  test('TC-FU-001: upload page loads at the expected URL', async ({ page, uploadPage }) => {
    meta({ priority: 'P1', severity: 'major', owner: 'Roshan', feature: 'File Upload' });
    await expect(page).toHaveURL(/\/upload$/);
    await expect(uploadPage.pageHeading).toBeVisible();
  });

  test('TC-FU-002: file input and Upload button are available', async ({ uploadPage }) => {
    meta({ priority: 'P1', severity: 'major', owner: 'Roshan', feature: 'File Upload' });
    await expect(uploadPage.fileInput).toBeVisible();
    await expect(uploadPage.submitButton).toBeVisible();
    await expect(uploadPage.submitButton).toBeEnabled();
  });

  for (const { id, name } of [
    { id: 'TC-FU-003', name: 'valid-upload.txt' },
    { id: 'TC-FU-004', name: 'valid-upload.pdf' },
    { id: 'TC-FU-005', name: 'valid-upload.png' },
  ]) {
    test(`${id}: upload a ${name.split('.').pop()} file`, async ({ uploadPage, sampleFiles }) => {
      meta({ priority: 'P1', severity: 'major', owner: 'Roshan', feature: 'File Upload' });
      const file = sampleFiles.get('low', name);
      await uploadPage.uploadAndWait(file);

      await expect(uploadPage.successHeading).toBeVisible();
      await expect(uploadPage.uploadedFileName).toHaveText(name);
      await expect(uploadPage.page).toHaveURL(/\/upload$/);
    });
  }

  test('TC-FU-006: display the exact uploaded filename', async ({ uploadPage, sampleFiles }) => {
    meta({ priority: 'P1', severity: 'major', owner: 'Roshan', feature: 'File Upload' });
    const name = 'ExactName_2026.txt';
    const file = sampleFiles.get('low', name);

    await uploadPage.uploadAndWait(file);

    await expect(uploadPage.uploadedFileName).toHaveText(name);
  });

  test('TC-FU-007: record empty-submission behavior without assuming validation', async ({ uploadPage }, testInfo) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Roshan', feature: 'File Upload' });
    const response = await uploadPage.submitAndWait();
    const body = await response.text();
    const observation = {
      status: response.status(),
      url: uploadPage.page.url(),
      pageTitle: await uploadPage.page.title(),
      bodyPreview: body.slice(0, 500),
    };

    await testInfo.attach('empty-submit-observation.json', {
      body: Buffer.from(JSON.stringify(observation, null, 2)),
      contentType: 'application/json',
    });
    expect(response.status()).toBeGreaterThan(0);
  });

  test('TC-FU-008: upload a zero-byte file and observe the result', async ({ uploadPage, sampleFiles }, testInfo) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Roshan', feature: 'File Upload' });
    const name = 'empty-file.txt';
    const file = sampleFiles.get('edge', name);
    const response = await uploadPage.uploadAndWait(file);
    const observation = {
      status: response.status(),
      url: uploadPage.page.url(),
      successHeadingVisible: await uploadPage.successHeading.isVisible(),
      uploadedFilename: await uploadPage.uploadedFileName.textContent(),
    };

    await testInfo.attach('zero-byte-upload-observation.json', {
      body: Buffer.from(JSON.stringify(observation, null, 2)),
      contentType: 'application/json',
    });
    expect(response.status()).toBeGreaterThan(0);
  });

  test('TC-FU-009: upload a filename containing spaces', async ({ uploadPage, sampleFiles }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Roshan', feature: 'File Upload' });
    const name = 'notes with spaces.txt';
    const file = sampleFiles.get('low', name);

    await uploadPage.uploadAndWait(file);

    await expect(uploadPage.successHeading).toBeVisible();
    await expect(uploadPage.uploadedFileName).toHaveText(name);
  });

  test('TC-FU-010: upload a filename containing special characters', async ({ uploadPage, sampleFiles }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Roshan', feature: 'File Upload' });
    const name = 'file_#1 & (final).txt';
    const file = sampleFiles.get('low', name);

    await uploadPage.uploadAndWait(file);

    await expect(uploadPage.successHeading).toBeVisible();
    await expect(uploadPage.uploadedFileName).toHaveText(name);
  });

  for (const { tier, name } of [
    { tier: 'medium', name: 'medium-sample.txt' },
    { tier: 'high', name: 'high-sample.txt' },
  ]) {
    test(`TC-FU-011: upload the ${tier}-size sample`, async ({ uploadPage, sampleFiles }) => {
      meta({ priority: 'P1', severity: 'major', owner: 'Roshan', feature: 'File Upload' });
      const file = sampleFiles.get(tier, name);

      await uploadPage.uploadAndWait(file);

      await expect(uploadPage.successHeading).toBeVisible();
      await expect(uploadPage.uploadedFileName).toHaveText(name);
    });
  }

  test('TC-FU-012: upload the same file in two separate submissions', async ({ uploadPage, sampleFiles }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Roshan', feature: 'File Upload' });
    const name = 'repeat-upload.txt';
    const file = sampleFiles.get('low', name);

    for (let attempt = 0; attempt < 2; attempt += 1) {
      if (attempt > 0) await uploadPage.goto();
      await uploadPage.uploadAndWait(file);
      await expect(uploadPage.successHeading).toBeVisible();
      await expect(uploadPage.uploadedFileName).toHaveText(name);
    }
  });

  test('TC-FU-013: clear a selected file without opening an OS chooser', async ({ uploadPage, sampleFiles }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Roshan', feature: 'File Upload' });
    const file = sampleFiles.get('low', 'cancel-selection.txt');
    await uploadPage.selectFile(file);
    await expect(uploadPage.fileInput).toHaveValue(/cancel-selection\.txt$/);

    // Clearing via setInputFiles([]) is deterministic; native chooser cancellation is manual.
    await uploadPage.fileInput.setInputFiles([]);
    await expect(uploadPage.fileInput).toHaveValue('');
  });

  test('TC-FU-018: keyboard focus can move from file input to Upload', async ({ page, uploadPage }) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Roshan', feature: 'File Upload' });
    await uploadPage.fileInput.focus();
    await expect(uploadPage.fileInput).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(uploadPage.submitButton).toBeFocused();
  });

  test('TC-FU-017: record behavior for an unsupported extension without assuming rejection', async ({ uploadPage, sampleFiles }, testInfo) => {
    meta({ priority: 'P2', severity: 'minor', owner: 'Roshan', feature: 'File Upload' });
    const name = 'harmless-sample.exe';
    const file = sampleFiles.get('edge', name);
    const response = await uploadPage.uploadAndWait(file);
    const observation = {
      status: response.status(),
      url: uploadPage.page.url(),
      successHeadingVisible: await uploadPage.successHeading.isVisible(),
      uploadedFilename: await uploadPage.uploadedFileName.textContent(),
    };

    await testInfo.attach('unsupported-extension-observation.json', {
      body: Buffer.from(JSON.stringify(observation, null, 2)),
      contentType: 'application/json',
    });
    expect(response.status()).toBeGreaterThan(0);
  });

  test('TC-FU-020: a simulated upload outage is surfaced without a false success', async ({ page, uploadPage, sampleFiles }) => {
    meta({ priority: 'P1', severity: 'major', owner: 'Roshan', feature: 'File Upload' });
    await page.route('**/upload', (route) => route.fulfill({
      status: 503,
      contentType: 'text/plain',
      body: 'Simulated upload outage',
    }));
    const file = sampleFiles.get('low', 'outage-check.txt');
    const response = await uploadPage.uploadAndWait(file);

    expect(response.status()).toBe(503);
    await expect(uploadPage.successHeading).toBeHidden();
  });
});
