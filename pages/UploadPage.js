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

  /** @param {string} filePath */
  async selectFile(filePath) {
    await this.fileInput.setInputFiles(filePath);
  }

  async submit() {
    await this.submitButton.click();
  }

  /** Clicks Upload and returns the POST response so tests can assert on status codes. */
  async submitAndWait() {
    const [response] = await Promise.all([
      this.page.waitForResponse((r) => r.url().endsWith(UploadPage.PATH) && r.request().method() === 'POST'),
      this.submit(),
    ]);
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
