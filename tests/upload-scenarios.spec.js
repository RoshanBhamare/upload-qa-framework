// @ts-check
const fs = require('node:fs');
const { test, expect } = require('../fixtures/test-fixtures');
const { meta } = require('reporting-labs');

const LOW_TIER = [
  { name: 'valid-upload.txt', mimeType: 'text/plain' },
  { name: 'valid-upload.pdf', mimeType: 'application/pdf' },
  { name: 'valid-upload.png', mimeType: 'image/png' },
  { name: 'sample.csv', mimeType: 'text/csv' },
  { name: 'sample.json', mimeType: 'application/json' },
];

function attachMeta(priority, severity) {
  meta({ priority, severity, owner: 'Roshan', feature: 'File Upload' });
}

/**
 * Dispatches browser file-drag events to the page's actual Dropzone element.
 * @param {import('../pages/UploadPage').UploadPage} uploadPage
 * @param {Array<{name: string, mimeType: string, path: string}>} files
 */
async function dropFiles(uploadPage, files) {
  const payload = files.map(({ name, mimeType, path: filePath }) => ({
    name,
    mimeType,
    base64: fs.readFileSync(filePath).toString('base64'),
  }));

  await uploadPage.dropZone.evaluate((element, dragFiles) => {
    const transfer = new DataTransfer();
    for (const file of dragFiles) {
      const bytes = Uint8Array.from(atob(file.base64), (character) => character.charCodeAt(0));
      transfer.items.add(new File([bytes], file.name, { type: file.mimeType }));
    }
    for (const type of ['dragenter', 'dragover', 'drop']) {
      element.dispatchEvent(new DragEvent(type, {
        bubbles: true,
        cancelable: true,
        dataTransfer: transfer,
      }));
    }
  }, payload);
}

/**
 * Intercepts each upload request to keep UI-only multi-file scenarios isolated from the public demo.
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<string[]>}
 */
async function mockUploadRequests(page) {
  /** @type {string[]} */
  const requestBodies = [];
  await page.route('**/upload', async (route) => {
    const request = route.request();
    if (request.method() === 'POST') {
      requestBodies.push(request.postDataBuffer()?.toString('latin1') ?? '');
      await route.fulfill({ status: 200, contentType: 'text/plain', body: 'Upload accepted for UI test.' });
      return;
    }
    await route.continue();
  });
  return requestBodies;
}

function getTestFiles(sampleFiles, count) {
  return LOW_TIER.slice(0, count).map(({ name, mimeType }) => ({
    name,
    mimeType,
    path: sampleFiles.get('low', name),
  }));
}

test.describe('Requested upload scenarios', () => {
  // TC-01: Validate the happy path for a single upload using the standard file input.
  // This block picks one valid file, submits it, and verifies the success state and uploaded filename.
  test('TC-01: upload a single valid file', async ({ page, uploadPage, sampleFiles }) => {
    attachMeta('P1', 'major');
    const filePath = sampleFiles.get('low', 'valid-upload.txt');
    await uploadPage.showSubtitle('TC-01: Selecting the sample text file.');
    await uploadPage.fileInput.setInputFiles({
      name: 'sample.txt',
      mimeType: 'text/plain',
      buffer: fs.readFileSync(filePath),
    });

    const response = await uploadPage.submitAndWait();
    await uploadPage.showSubtitle('TC-01: Verifying the response, success heading, and exact filename.');
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);
    await expect(page).toHaveURL(/\/upload$/);
    await expect(uploadPage.successHeading).toBeVisible();
    await expect(uploadPage.uploadedFileName).toHaveText('sample.txt');
  });

  // TC-02: Check that the file picker supports multi-select and can submit multiple files in one action.
  // The test confirms the app accepts several files together and shows each selected filename in the success flow.
  test('TC-02: upload 5 files in one file-picker submission', async ({ uploadPage, sampleFiles }) => {
    attachMeta('P0', 'major');
    await uploadPage.showSubtitle('TC-02: Checking whether the file input supports multiple files.');
    const supportsMultiple = await uploadPage.fileInput.evaluate((input) => input.multiple);
    expect(supportsMultiple, 'The application file input does not support multiple selection.').toBeTruthy();

    const files = getTestFiles(sampleFiles, 5);
    await uploadPage.showSubtitle('TC-02: Selecting five sample files for one submission.');
    await uploadPage.fileInput.setInputFiles(files.map(({ name, mimeType, path: filePath }) => ({
      name,
      mimeType,
      buffer: fs.readFileSync(filePath),
    })));
    const response = await uploadPage.submitAndWait();
    await uploadPage.showSubtitle('TC-02: Verifying the response and all five uploaded filenames.');
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);
    await expect(uploadPage.successHeading).toBeVisible();
    for (const file of files) {
      await expect(uploadPage.uploadedFileName).toContainText(file.name);
    }
  });

  // TC-03: Exercise the drag-and-drop dropzone with three valid files and verify the browser's upload requests.
  // This block intercepts the network call, checks the file previews, and validates the exact filenames sent to /upload.
  test('TC-03: drag and drop 3 files into the drop zone', async ({ page, uploadPage, sampleFiles }, testInfo) => {
    attachMeta('P0', 'major');
    await uploadPage.showSubtitle('TC-03: Checking that the drop zone is visible.');
    await expect(uploadPage.dropZone).toBeVisible();
    testInfo.annotations.push({
      type: 'network',
      description: 'POST /upload is intercepted; this case validates client-side Dropzone handling.',
    });

    const files = getTestFiles(sampleFiles, 3);
    const requestBodies = await mockUploadRequests(page);
    await uploadPage.showSubtitle('TC-03: Dropping three files; upload requests are intercepted locally.');
    await dropFiles(uploadPage, files);

    await uploadPage.showSubtitle('TC-03: Verifying drop previews, filenames, and intercepted requests.');
    const previews = uploadPage.dropZone.locator('.dz-preview');
    await expect(previews).toHaveCount(files.length);
    await expect(uploadPage.dropZone.locator('.dz-success')).toHaveCount(files.length);
    const displayedNames = await uploadPage.dropZone.locator('.dz-filename span').allTextContents();
    expect(displayedNames).toEqual(files.map((file) => file.name));
    expect(requestBodies).toHaveLength(files.length);
    for (const file of files) {
      expect(requestBodies.some((body) => body.includes(file.name))).toBe(true);
    }
  });

  // TC-04: Validate that users can remove individual files from the dropzone before sending them for upload.
  // This block drops multiple files, removes two of them, and verifies only the remaining files stay in the preview list.
  test('TC-04: remove selected files from a multi-file drop before upload', async ({ page, uploadPage, sampleFiles }) => {
    attachMeta('P1', 'major');
    const dropZone = page.locator('#drag-drop-upload');
    await uploadPage.showSubtitle('TC-04: Checking the drop zone before selecting files.');
    await expect(dropZone).toBeVisible();

    const files = getTestFiles(sampleFiles, 5);
    await uploadPage.showSubtitle('TC-04: Dropping five sample files into the drop zone.');
    await dropFiles(uploadPage, files);
    const previews = dropZone.locator('.dz-preview');
    await uploadPage.showSubtitle('TC-04: Confirming five previews, then removing two files.');
    await expect(previews).toHaveCount(files.length);
    const removeButtons = dropZone.locator('.dz-remove');
    for (const index of [0, 1]) {
      await removeButtons.nth(index).click();
    }
    await uploadPage.showSubtitle('TC-04: Verifying that three file previews remain.');
    await expect(previews).toHaveCount(3);
  });
});
