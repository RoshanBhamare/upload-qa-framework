// @ts-check
const { BasePage } = require('./BasePage');

/** Page object for /upload. Contains NO assertions about product behaviour: only locators and actions. */
class UploadPage extends BasePage {
  static PATH = '/upload';

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'File Uploader' });
    this.fileInput = page.locator('#file-upload');
    this.submitButton = page.locator('#file-submit');
    this.dropZone = page.locator('#drag-drop-upload');
    this.dropZoneFileName = page.locator('#drag-drop-upload .dz-filename span');
    this.successHeading = page.getByRole('heading', { name: 'File Uploaded!' });
    this.uploadedFileName = page.locator('#uploaded-files');
  }

  /** Navigates and waits for the page to be usable. A failure HERE is an environment/automation problem. */
  async goto() {
    await this.open(UploadPage.PATH);
    await this.pageHeading.waitFor({ timeout: 15_000 });
  }

  /** @param {string} text */
  async showSubtitle(text) {
    await this.page.locator('html').waitFor({ state: 'attached' });
    await this.page.evaluate((caption) => {
      let subtitle = document.getElementById('playwright-video-subtitle');
      if (!subtitle) {
        subtitle = document.createElement('div');
        subtitle.id = 'playwright-video-subtitle';
        subtitle.setAttribute('role', 'status');
        subtitle.setAttribute('aria-live', 'polite');
        Object.assign(subtitle.style, {
          position: 'fixed',
          left: '0',
          right: '0',
          bottom: '0',
          zIndex: '2147483647',
          boxSizing: 'border-box',
          padding: '12px 20px',
          color: '#fff',
          background: 'rgba(15, 23, 42, 0.94)',
          font: '600 16px/1.4 Segoe UI, Arial, sans-serif',
          textAlign: 'center',
          pointerEvents: 'none',
        });
        const host = document.body || document.documentElement;
        if (!host) throw new Error('Cannot display video subtitle before the page document is ready.');
        host.appendChild(subtitle);
      }
      subtitle.textContent = caption;
    }, text);
  }

  /** @param {string} filePath */
  async selectFile(filePath) {
    await this.fileInput.setInputFiles(filePath);
  }

  async submit() {
    await this.submitButton.click();
  }

  /** Clicks Upload and returns the POST response so tests can assert on status codes. */
  async submitAndWait() {
    await this.showSubtitle('Submitting the selected file to the upload form.');
    const [response] = await Promise.all([
      this.page.waitForResponse((r) => r.url().endsWith(UploadPage.PATH) && r.request().method() === 'POST'),
      this.submit(),
    ]);
    await this.showSubtitle(`Upload response received: HTTP ${response.status()}. Reviewing the result.`);
    return response;
  }

  /** @param {string} filePath */
  async uploadViaInput(filePath) {
    await this.selectFile(filePath);
    await this.submit();
  }

  /** Selects a file and submits it while returning the server response. */
  async uploadAndWait(filePath) {
    await this.selectFile(filePath);
    return this.submitAndWait();
  }

  /** Uses the Dropzone widget via the native file chooser (OS-level drag from desktop is not automatable). */
  async uploadViaDropZone(filePath) {
    const [chooser] = await Promise.all([this.page.waitForEvent('filechooser'), this.dropZone.click()]);
    await chooser.setFiles(filePath);
  }
}

module.exports = { UploadPage };
