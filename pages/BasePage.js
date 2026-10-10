// @ts-check
/** Shared behaviour for all page objects. Add cross-page helpers here. */
class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  /** @param {string} path relative to baseURL */
  async open(path) {
    await this.page.goto(path, { waitUntil: 'commit' });
  }
}

module.exports = { BasePage };
