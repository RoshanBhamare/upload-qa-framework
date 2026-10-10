// @ts-check
/**
 * Custom reporter that labels every failure so a reader can tell, at a glance:
 *   PRODUCT_DEFECT (known)  - test is tagged known-defect AND failed on a real assertion mismatch
 *   ASSERTION_MISMATCH      - assertion compared observed values and disagreed -> likely product defect, triage it
 *   SELECTOR_OR_TIMING      - element never appeared / wrong locator / race -> likely a broken or flaky SCRIPT
 *   AUTOMATION_ERROR        - JS error, bad file path, browser/launch/network problem -> broken script or environment
 *
 * A heuristic aid for triage, not an oracle. Humans confirm via trace/screenshot.
 */
const stripAnsi = (s) => s.replace(/\u001b\[[0-9;]*m/g, '');

function classify(test, result) {
  const msg = stripAnsi(result.error?.message || result.error?.stack || '');
  const known = test.annotations.some((a) => a.type === 'known-defect');

  if (/TypeError|ReferenceError|SyntaxError|ENOENT|EACCES|net::ERR_|Executable doesn't exist|browserType\.launch|Target (page|context|browser).*closed|strict mode violation/.test(msg)) {
    return 'AUTOMATION_ERROR';
  }
  if (/element\(s\) not found|waiting for (locator|getBy)|locator\.\w+: Timeout/.test(msg)) {
    return 'SELECTOR_OR_TIMING';
  }
  if (/Expected|Received/.test(msg) && /expect\(/.test(msg)) {
    return known ? 'PRODUCT_DEFECT (known)' : 'ASSERTION_MISMATCH';
  }
  return 'AUTOMATION_ERROR';
}

class FailureClassifier {
  constructor() {
    this.rows = new Map();
  }

  onTestEnd(test, result) {
    if (result.status === 'passed' || result.status === 'skipped') {
      this.rows.delete(test.id);
      return;
    }
    this.rows.set(test.id, { title: test.titlePath().slice(2).join(' > '), cls: classify(test, result) });
  }

  onEnd() {
    if (!this.rows.size) return;
    console.log('\n=== Failure classification ===');
    for (const { title, cls } of this.rows.values()) console.log(`${cls.padEnd(24)} ${title}`);
    console.log('==============================\n');
  }

  printsToStdio() {
    return false;
  }
}

module.exports = FailureClassifier;
