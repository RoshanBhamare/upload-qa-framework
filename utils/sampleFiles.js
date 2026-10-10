// @ts-check
const fs = require('node:fs');
const path = require('node:path');

const SAMPLE_ROOT = path.resolve(__dirname, '..', 'test-data', 'uploads');
const SAMPLE_TIERS = new Set(['low', 'medium', 'high', 'edge']);

class SampleFiles {
  /**
   * @param {'low' | 'medium' | 'high' | 'edge'} tier
   * @param {string} name
   * @returns {string} absolute path to a repository-managed sample
   */
  get(tier, name) {
    if (!SAMPLE_TIERS.has(tier)) {
      throw new Error(`Unknown sample-file tier "${tier}". Expected low, medium, high, or edge.`);
    }
    if (!name || name === '.' || name === '..' || path.basename(name) !== name) {
      throw new Error(`Sample filename must not contain a path: "${name}".`);
    }

    const filePath = path.join(SAMPLE_ROOT, tier, name);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      throw new Error(`Sample file does not exist: ${path.relative(SAMPLE_ROOT, filePath)}.`);
    }
    return filePath;
  }
}

module.exports = { SampleFiles };
