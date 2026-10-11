# AI Prompt Log

## 2026-10-11

### Prompt 1
**Request:** Add comments to the upload scenario test file explaining what each block is doing.

**Outcome:** Added explanatory comments for each test case in `tests/upload-scenarios.spec.js`.

### Prompt 2
**Request:** Make unsupported multi-file conditions fail instead of skipping those scenarios.

**Outcome:** Replaced `test.skip(...)` assertions with failing `expect(...).toBeTruthy()` checks for multi-file and dropzone capability validations.

### Prompt 3
**Request:** Update the test cases to use the actual drop zone locator `#drag-drop-upload` and related selectors.

**Outcome:** Updated the drag-and-drop and remove-file scenarios to target the real Dropzone element and use DOM selectors for previews, filenames, and remove buttons.

### Prompt 4
**Request:** Update the manual test-case document to match the automation file.

**Outcome:** Synced `test-cases/file-upload-test-cases.md` with the current upload test scenarios, including the dropzone-based cases and the revised numbering.

### Prompt 5
**Request:** Remove TC-04 and update the related files.

**Outcome:** Removed the red-border validation case from the Playwright suite and manual test-case document, and renumbered the remaining upload-removal scenario to TC-04.

### Prompt 6
**Request:** Commit and push the current code changes.

**Outcome:** Created commit `31bfb7b` and pushed it to `origin/main`.

### Prompt 7
**Request:** Add the AI prompt log file to the repository.

**Outcome:** This file was created to record the prompts and outcomes above.

### Prompt 8
**Request:** Add the prompt log to the repository and keep it updated with the latest activity.

**Outcome:** The prompt log file was added and recorded the latest repository update activity.

### Prompt 9
**Request:** Add the prompt from this conversation to the AI prompt log.

**Outcome:** Recorded the current request to keep the AI prompt log updated with the latest activity.

### Prompt 10
**Request:** Add different browser compatibility support as well.

**Outcome:** Added Playwright projects for Chromium, Firefox, and WebKit and updated the browser matrix in CI.

### Prompt 11
**Request:** Add `meta({ priority: 'P1', severity: 'major', owner: 'Roshan', feature: 'File Upload' })` at the top of a test and then apply it to each relevant test case with the correct priority and severity.

**Outcome:** Added Reporting Labs metadata to the upload scenarios using appropriate priority and severity values for each case.

### Prompt 12
**Request:** Update the README file and push the code without including `reporting-labs.history.json`.

**Outcome:** Updated README documentation and ensured generated reporting files were ignored while proceeding with the code changes.

### Prompt 13
**Request:** Revert all the commits but stash all the changes because the incorrect author is showing in the commit history.

**Outcome:** Reverted the branch to the desired commit state while stashing later work to preserve code and generated artifacts.

### Prompt 14
**Request:** Keep only commit `6468b9a50721a48a19ce81a78467732f6c8c65a6` in history and move all other changes to stash.

**Outcome:** Moved the branch to the requested commit and saved the remaining work in stashes.

### Prompt 15
**Request:** Push the code and update the README file.

**Outcome:** Restored the stashed changes, committed with the correct author identity, and updated documentation before pushing.

### Prompt 16
**Request:** Upload the test case CSV file and automate those cases by modifying the existing framework to support CSV-driven scenarios.

**Outcome:** Added CSV parsing support and generated automated tests for the uploaded cases while keeping unsupported or blocked scenarios explicitly marked.

### Prompt 17
**Request:** Use the attached CSV sheet and ask if there are any doubts.

**Outcome:** Reviewed the provided CSV and proceeded with the implementation after confirming the intent to automate only the supported cases and mark blocked ones appropriately.

### Prompt 18
**Request:** Clear all the automated test cases.

**Outcome:** Removed the generated test suite and related automation setup while preserving the source manual test documents and CSV data.

### Prompt 19
**Request:** Automate the five specified upload scenarios in the provided test-case list.

**Outcome:** Added the upload scenario coverage for single-file upload, 5-file picker submission, drag-and-drop upload, red border validation, and file removal before upload, while explicitly skipping unsupported cases.

### Prompt 20
**Request:** Update the test case implementation to reuse the locators already defined in `pages/uploadPage.js` and follow the Page Object Model.

**Outcome:** Refactored the scenario tests to call existing page-object locators and capability helpers instead of duplicating selectors inline.

### Prompt 21
**Request:** Add all previous prompt logs to the AI prompt log file.

**Outcome:** Consolidated the earlier request history into the repository log so the file reflects the full prompt history.

### Prompt 22
**Request:** Check why most of the tests are failing.

**Outcome:** Reviewed the configured Playwright projects and failure artifacts. Identified intentionally failing known-defect/demo suites and navigation timeouts against the public upload site as separate failure causes.

### Prompt 23
**Request:** Remove all written test cases.

**Outcome:** Deleted the three Playwright spec files and removed the now-unused suite projects, scripts, and related documentation/workflow references while retaining the framework scaffold.

### Prompt 24
**Request:** Generate detailed manual file-upload test cases and implement suitable Playwright automation using the existing framework, after inspecting the application and repository.

**Outcome:** Confirmed the JavaScript Playwright/POM setup and inspected the live upload page. Added 20 manual cases and automated stable upload, filename, boundary, keyboard, and simulated-error scenarios. Recorded empty-submit and unsupported-extension behavior without assuming undocumented product rules; documented drag-and-drop as exploratory. Ran the suite and reported intermittent navigation timeouts from the public host.

### Prompt 25
**Request:** Keep reusable sample files of different formats and low/medium/high sizes locally, and advise whether to store them or generate and delete them at runtime.

**Outcome:** Added persistent TXT, CSV, JSON, PDF, and PNG samples under low (~1 KiB), medium (~100 KiB), and high (1 MiB) tiers, plus edge-case fixtures. Replaced the runtime file generator with a checked-in sample-file resolver and updated the test suite and documentation. Validated sample sizes/formats and test discovery; upload execution remained subject to public-host timeouts.

### Prompt 26
**Request:** Update the README with the current framework structure.

**Outcome:** Rewrote the README to document the repository tree, sample-file resolver and tiers, Playwright configuration/reporting, manual test cases, CI workflow, and run commands.

### Prompt 27
**Request:** Create a repository and push the code.

**Outcome:** Created a local initial commit, then found that the signed-in GitHub account already had a public `RoshanBhamare/upload-qa-framework` repository. With confirmation, merged its existing history locally and committed the merge. The push was rejected with HTTP 403 because Git credentials authenticated as `rushiD1401`, which lacks write permission. No remote push completed.

### Prompt 28
**Request:** Add all prompts from this conversation to the prompt log in sequence.

**Outcome:** Added the conversation’s requests and their outcomes to this file in chronological order.
