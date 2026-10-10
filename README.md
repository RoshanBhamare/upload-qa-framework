# Upload QA Framework

Playwright Test framework using JavaScript and the Page Object Model for the file upload
demo at `http://the-internet.herokuapp.com/upload`. Automated tests use checked-in sample
files; they do not generate or delete sample files during a run.

## Framework structure

```text
.
├── .github/
│   └── workflows/
│       └── playwright.yml             # Chromium, Firefox, and WebKit CI matrix
├── fixtures/
│   └── test-fixtures.js               # Shared upload-page and sample-file fixtures
├── pages/
│   ├── BasePage.js                     # Shared page navigation
│   └── UploadPage.js                   # Upload locators and user actions
├── reporters/
│   └── failure-classifier.js           # Additional failure classification output
├── test-cases/
│   └── file-upload-test-cases.md       # 20 manual cases and execution fields
├── test-data/
│   └── uploads/
│       ├── low/                        # ~1 KiB TXT, CSV, JSON, PDF, PNG + named cases
│       ├── medium/                     # ~100 KiB TXT, CSV, JSON, PDF, PNG
│       ├── high/                       # 1 MiB TXT, CSV, JSON, PDF, PNG
│       └── edge/                       # Empty TXT and harmless .exe-named text file
├── tests/
│   └── upload.spec.js                  # Automated upload test cases
├── utils/
│   └── sampleFiles.js                  # Safe resolver for checked-in test files
├── playwright.config.js                # Browser projects, timeouts, and reporters
├── reporting-labs.config.ts            # Reporting Labs HTML/PDF report configuration
├── package.json                        # Dependencies and npm scripts
└── README.md
```

Playwright writes test artifacts to `test-results/`. Reporting Labs writes its HTML, JSON,
and PDF reports to `reporting-labs/` and keeps trend history in
`reporting-labs.history.json`. These generated files are ignored by Git. Videos are
captured for test runs, screenshots on failure, and traces on first retry.

## How sample files are selected

`sampleFiles.get(tier, filename)` returns an absolute path to a checked-in file and reports
a clear error if the tier or file is missing. For example:

```js
const filePath = sampleFiles.get('medium', 'medium-sample.pdf');
await uploadPage.uploadAndWait(filePath);
```

Use the size-tier folders for repeatable regression inputs. Add new harmless samples to
the appropriate folder and update this inventory if you introduce a new tier or format.
Runtime-generated files are only preferable for unusual parameterized cases (such as
many precise boundary sizes) that would add unnecessary binary data to the repository.

## Run the tests

```bash
npm install
npm run install:browsers
npm test
```

`npm test` runs the suite in Chromium, Firefox, and WebKit. Install all supported browsers
locally with `npm run install:browsers`. To run only one browser, pass a Playwright project
selector, for example:

```bash
npm test -- --project=firefox
```

Set `BASE_URL` to point to another compatible environment when needed. For example, in
PowerShell:

```powershell
$env:BASE_URL = 'https://staging.example.com'
npm test
```

Available npm scripts:

| Script | Purpose |
|---|---|
| `npm test` | Run tests in Chromium, Firefox, and WebKit |
| `npm run install:browsers` | Install all Playwright browsers and system dependencies |

## Configuration and reporting

`playwright.config.js` defines `tests/` as the test directory, Chromium, Firefox, and
WebKit desktop projects, the base URL (overridable with `BASE_URL`), timeouts, and
reporters. GitHub Actions runs each browser in a separate matrix job and uploads a
browser-specific Reporting Labs report. CI enables retries and limits worker count; test
execution is kept sequential within a spec to reduce traffic to the shared public demo
host.

The Reporting Labs reporter generates an HTML/PDF report and run history under
`reporting-labs/`; open `reporting-labs/index.html` to view it. Every automated test is
tagged with priority, severity, owner, and feature metadata using `meta()` from
`reporting-labs`.

The manual suite includes scenarios that are intentionally exploratory (such as refresh,
native file-picker cancellation, drag-and-drop, and responsive layout). Tests do not
assume unsupported file types or file sizes are rejected. Empty submissions, zero-byte
uploads, and unsupported extensions record observed behavior rather than asserting an
undocumented validation rule.
