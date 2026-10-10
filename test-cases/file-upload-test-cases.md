# File Upload — Manual Test Cases

**Application:** `http://the-internet.herokuapp.com/upload`  
**Module:** File Upload  
**Execution note:** This is a shared public demo. Use harmless files and keep large uploads limited to the controlled 1 MiB sample. No file-size or file-type validation requirement is assumed. The application’s actual response should be recorded for unverified behavior.

Reusable local files are stored under `test-data/uploads/` by size tier:

| Tier | Approximate size | Formats |
|---|---:|---|
| `low/` | 1 KiB | TXT, CSV, JSON, PDF, PNG |
| `medium/` | 100 KiB | TXT, CSV, JSON, PDF, PNG |
| `high/` | 1 MiB | TXT, CSV, JSON, PDF, PNG |
| `edge/` | 0 bytes for empty-file case | Empty TXT and harmless text named with an `.exe` extension |

Files are committed reusable test fixtures; tests do not generate or delete them.

For execution, fill **Actual result**, **Status** (`Pass` / `Fail` / `Blocked`), and **Tester / date**. Expected behavior describes what to observe; where the demo has no defined requirement, it deliberately does not assume acceptance or rejection.

## Test case inventory

| ID | Test case | Priority | Test type | Automation status | Actual result | Status | Tester / date |
|---|---|---|---|---|---|---|---|
| TC-FU-001 | Upload page loads successfully | High | Functional | Automatable | — | — | — |
| TC-FU-002 | File chooser and Upload button are displayed | High | UI | Automatable | — | — | — |
| TC-FU-003 | Upload a valid TXT file | High | Functional | Automatable | — | — | — |
| TC-FU-004 | Upload a valid PDF file | Medium | Functional | Automatable | — | — | — |
| TC-FU-005 | Upload a valid image file | Medium | Functional | Automatable | — | — | — |
| TC-FU-006 | Verify the exact uploaded filename | High | Functional | Automatable | — | — | — |
| TC-FU-007 | Submit without selecting a file | Medium | Negative | Partially Automatable | — | — | — |
| TC-FU-008 | Upload a zero-byte file | Medium | Boundary | Automatable | — | — | — |
| TC-FU-009 | Upload a filename containing spaces | Medium | Functional | Automatable | — | — | — |
| TC-FU-010 | Upload a filename containing special characters | Medium | Boundary | Automatable | — | — | — |
| TC-FU-011 | Upload medium- and high-size files | Low | Boundary | Automatable | — | — | — |
| TC-FU-012 | Upload the same file more than once | Medium | Functional | Automatable | — | — | — |
| TC-FU-013 | Cancel file selection | Low | UI | Partially Automatable | — | — | — |
| TC-FU-014 | Refresh after upload | Low | Resilience | Manual/Exploratory | — | — | — |
| TC-FU-015 | Verify browser navigation and URL | Medium | Functional | Automatable | — | — | — |
| TC-FU-016 | Test drag-and-drop if supported | Low | UI | Manual/Exploratory | — | — | — |
| TC-FU-017 | Observe behavior for an unsupported extension | Medium | Negative | Partially Automatable | — | — | — |
| TC-FU-018 | Verify keyboard accessibility | Medium | Accessibility | Partially Automatable | — | — | — |
| TC-FU-019 | Verify responsive layout | Low | UI | Manual/Exploratory | — | — | — |
| TC-FU-020 | Test failed-request behavior | Medium | Resilience | Automatable | — | — | — |

## Detailed test cases

### TC-FU-001 — Upload page loads successfully

- **Objective:** Verify the upload page is reachable and identifies itself.
- **Preconditions:** Browser has network access to the target.
- **Test data:** None.
- **Priority / type / automation:** High / Functional / Automatable.
- **Steps and expected results:**
  1. Navigate to `http://the-internet.herokuapp.com/upload`. **Expected:** The page responds and the browser remains on the upload route.
  2. Inspect the page heading. **Expected:** “File Uploader” is displayed.
- **Overall expected result:** Upload page loads with the expected heading.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-002 — File chooser and Upload button are displayed

- **Objective:** Confirm the file selection control and submit control are available.
- **Preconditions:** TC-FU-001 is complete.
- **Test data:** None.
- **Priority / type / automation:** High / UI / Automatable.
- **Steps and expected results:**
  1. Locate the file input (`#file-upload`). **Expected:** A file input is present and usable.
  2. Locate the Upload control (`#file-submit`). **Expected:** An enabled Upload button is present.
- **Overall expected result:** Both controls are available to the user.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-003 — Upload a valid TXT file

- **Objective:** Verify the basic upload flow using a harmless text file.
- **Preconditions:** Upload page is open.
- **Test data:** `valid-upload.txt`, containing a short plain-text line.
- **Priority / type / automation:** High / Functional / Automatable.
- **Steps and expected results:**
  1. Select `valid-upload.txt`. **Expected:** The selected filename is shown by the input.
  2. Click Upload. **Expected:** The application responds to the submission.
  3. Inspect the result. **Expected:** Record whether a result heading appears and the exact server response.
- **Overall expected result:** Submission completes and its observed result is recorded.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-004 — Upload a valid PDF file

- **Objective:** Observe upload behavior for a small PDF.
- **Preconditions:** Upload page is open.
- **Test data:** `valid-upload.pdf`, a harmless, small sample PDF.
- **Priority / type / automation:** Medium / Functional / Automatable.
- **Steps and expected results:**
  1. Select the PDF sample. **Expected:** The input identifies the selected filename.
  2. Submit the file. **Expected:** A server response is returned.
  3. Inspect the result page and filename. **Expected:** Record actual behavior; do not infer a PDF-specific validation requirement.
- **Overall expected result:** The observed result is recorded with the response status and filename.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-005 — Upload a valid image file

- **Objective:** Observe upload behavior for a small image.
- **Preconditions:** Upload page is open.
- **Test data:** `valid-upload.png`, a harmless small PNG.
- **Priority / type / automation:** Medium / Functional / Automatable.
- **Steps and expected results:**
  1. Select the PNG sample. **Expected:** The input identifies the selected filename.
  2. Submit the file. **Expected:** A server response is returned.
  3. Inspect the result page and filename. **Expected:** Record actual behavior; no image preview requirement is assumed.
- **Overall expected result:** The observed result is recorded.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-006 — Verify the exact uploaded filename

- **Objective:** Check that the result reports the submitted filename without alteration.
- **Preconditions:** Upload page is open.
- **Test data:** `ExactName_2026.txt`.
- **Priority / type / automation:** High / Functional / Automatable.
- **Steps and expected results:**
  1. Select the test file and submit it. **Expected:** The server responds.
  2. Read the uploaded filename shown on the result page. **Expected:** Compare it character-for-character with `ExactName_2026.txt`.
- **Overall expected result:** Actual filename display is recorded and compared to the submitted name.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-007 — Submit without selecting a file

- **Objective:** Observe empty-submit behavior without presuming a validation rule.
- **Preconditions:** Upload page is freshly opened; no file is selected.
- **Test data:** None.
- **Priority / type / automation:** Medium / Negative / Partially Automatable.
- **Steps and expected results:**
  1. Confirm the file input is empty. **Expected:** No filename is selected.
  2. Click Upload. **Expected:** Record the HTTP status, resulting URL, page title/content, and any validation message. No particular status or message is assumed.
- **Overall expected result:** Actual response is captured; classify only against an agreed requirement.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-008 — Upload a zero-byte file

- **Objective:** Observe how the application handles an empty file.
- **Preconditions:** Upload page is open.
- **Test data:** `empty-file.txt`, exactly 0 bytes.
- **Priority / type / automation:** Medium / Boundary / Automatable.
- **Steps and expected results:**
  1. Select the zero-byte file. **Expected:** The input shows its filename.
  2. Submit it. **Expected:** A response is returned.
  3. Inspect response and filename. **Expected:** Record actual result; no minimum-size rule is assumed.
- **Overall expected result:** Zero-byte upload behavior and response are recorded.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-009 — Upload a filename containing spaces

- **Objective:** Check that spaces in a filename survive selection and submission.
- **Preconditions:** Upload page is open.
- **Test data:** `notes with spaces.txt`.
- **Priority / type / automation:** Medium / Functional / Automatable.
- **Steps and expected results:**
  1. Select the file. **Expected:** Input identifies the filename including spaces.
  2. Submit it. **Expected:** The application responds.
  3. Compare the displayed filename with the original. **Expected:** Record whether spaces and spelling are preserved.
- **Overall expected result:** Exact filename handling is recorded.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-010 — Upload a filename containing special characters

- **Objective:** Observe filename handling for common punctuation and symbols.
- **Preconditions:** Upload page is open.
- **Test data:** `file_#1 & (final).txt`.
- **Priority / type / automation:** Medium / Boundary / Automatable.
- **Steps and expected results:**
  1. Select the file. **Expected:** The input identifies the selected file.
  2. Submit it. **Expected:** The application responds.
  3. Compare the displayed filename. **Expected:** Record exact preservation or transformation; do not assume encoding behavior.
- **Overall expected result:** Actual special-character handling is recorded.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-011 — Upload medium- and high-size files

- **Objective:** Check a modest boundary size without load-testing the public service.
- **Preconditions:** Upload page is open; network is stable.
- **Test data:** `medium/medium-sample.txt` (~100 KiB) and `high/high-sample.txt` (1 MiB).
- **Priority / type / automation:** Low / Boundary / Automatable.
- **Steps and expected results:**
  1. Select the medium-size sample and submit once. **Expected:** Record its response and displayed filename.
  2. Repeat with the high-size sample. **Expected:** Record its response and displayed filename.
  3. Record status and result. **Expected:** No file-size limit is presumed; do not increase size or repeat requests against the shared host.
- **Overall expected result:** The observed outcome for both controlled sizes is recorded.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-012 — Upload the same file more than once

- **Objective:** Observe repeat submissions using the same filename and content.
- **Preconditions:** Upload page is available.
- **Test data:** `repeat-upload.txt`, a small harmless text file.
- **Priority / type / automation:** Medium / Functional / Automatable.
- **Steps and expected results:**
  1. Select and submit the file. **Expected:** First response is recorded.
  2. Return to the upload page and submit the same file again. **Expected:** Second response is recorded independently.
  3. Compare the outcomes. **Expected:** Record any difference; no persistence or duplicate policy is assumed.
- **Overall expected result:** Both submissions complete or their failures are recorded.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-013 — Cancel file selection

- **Objective:** Verify that backing out of file selection does not leave a stale selection.
- **Preconditions:** Upload page is open on a desktop browser.
- **Test data:** None.
- **Priority / type / automation:** Low / UI / Partially Automatable.
- **Steps and expected results:**
  1. Activate Choose File to open the native picker. **Expected:** The operating-system file picker opens.
  2. Cancel/dismiss the picker without choosing a file. **Expected:** Picker closes; no new file is selected.
  3. Inspect the file input. **Expected:** It remains empty, or retains a prior selection if the browser does so; record actual behavior.
- **Overall expected result:** Cancellation does not submit a newly selected file.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-014 — Refresh after upload

- **Objective:** Observe refresh behavior after a completed upload.
- **Preconditions:** A small harmless file has just been submitted and the result page is displayed.
- **Test data:** `refresh-check.txt`.
- **Priority / type / automation:** Low / Resilience / Manual/Exploratory.
- **Steps and expected results:**
  1. Note the result page URL and filename. **Expected:** Current state is recorded.
  2. Refresh the page. **Expected:** Record whether the browser prompts to resubmit, reloads the result, or returns another result. Do not confirm a resubmission unless intended.
- **Overall expected result:** Refresh behavior is observed without unintentionally generating repeated uploads.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-015 — Verify browser navigation and URL

- **Objective:** Confirm the upload route before and after submission and inspect Back navigation.
- **Preconditions:** Upload page is reachable.
- **Test data:** `navigation-check.txt`.
- **Priority / type / automation:** Medium / Functional / Automatable.
- **Steps and expected results:**
  1. Open the upload page. **Expected:** URL path ends in `/upload`.
  2. Submit the test file. **Expected:** Record the resulting URL and response.
  3. Use browser Back. **Expected:** Record the destination and any resubmission prompt; do not assume a redirect scheme.
- **Overall expected result:** Navigation transitions are recorded and no accidental resubmission is confirmed.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-016 — Test drag-and-drop if supported

- **Objective:** Explore the advertised drag-and-drop path.
- **Preconditions:** Upload page is open; use a browser/device that supports file drag-and-drop.
- **Test data:** `drag-drop-check.txt`.
- **Priority / type / automation:** Low / UI / Manual/Exploratory.
- **Steps and expected results:**
  1. Inspect the visible drop area and any instructions. **Expected:** Record whether a target is visibly provided.
  2. Drag the harmless file onto the indicated area. **Expected:** Record selection/preview feedback or lack of response.
  3. Submit only if the UI indicates the file was selected. **Expected:** Record the observed response.
- **Overall expected result:** Support is established by observed UI behavior, not inferred from a placeholder element.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-017 — Observe behavior for an unsupported extension

- **Objective:** Record how the demo handles an extension often treated as unsupported, without treating that as a requirement.
- **Preconditions:** Upload page is open.
- **Test data:** `harmless-sample.exe` containing plain text only; it is not executable.
- **Priority / type / automation:** Medium / Negative / Partially Automatable.
- **Steps and expected results:**
  1. Select the harmless text file with `.exe` suffix. **Expected:** Record whether selection is allowed.
  2. Submit once. **Expected:** Record status, result heading, and displayed filename; no acceptance/rejection rule is assumed.
- **Overall expected result:** Actual handling is recorded for product-owner clarification if needed.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-018 — Verify keyboard accessibility

- **Objective:** Check keyboard access to the file input and submit control.
- **Preconditions:** Upload page is open; keyboard is available.
- **Test data:** Optional `keyboard-check.txt`.
- **Priority / type / automation:** Medium / Accessibility / Partially Automatable.
- **Steps and expected results:**
  1. Navigate through controls using Tab and Shift+Tab. **Expected:** Focus is visible and follows a usable order.
  2. Focus the file input and activate it with the keyboard. **Expected:** Native file picker opens where supported.
  3. Choose a file and move to Upload; submit with Enter or Space. **Expected:** Submission can be completed by keyboard.
  4. Inspect focus after navigation. **Expected:** Record focus visibility/order; no full WCAG conformance is inferred.
- **Overall expected result:** Keyboard operation and any accessibility barriers are recorded.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-019 — Verify responsive layout

- **Objective:** Check usability at narrow and wide viewport sizes.
- **Preconditions:** Upload page is reachable.
- **Test data:** Viewports approximately 375×812 and 1280×800 CSS pixels.
- **Priority / type / automation:** Low / UI / Manual/Exploratory.
- **Steps and expected results:**
  1. Inspect the page at the narrow viewport. **Expected:** Heading and controls remain visible and usable without unintended horizontal overflow.
  2. Inspect the page at the wide viewport. **Expected:** Controls remain visible and legible.
  3. If supported, select a small file at both sizes. **Expected:** Record any layout-specific obstruction.
- **Overall expected result:** Responsive usability observations are recorded; no formal design spec is assumed.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-FU-020 — Test failed-request behavior

- **Objective:** Safely verify UI behavior when the upload endpoint responds with an error.
- **Preconditions:** Playwright test context or an isolated proxy can intercept the request.
- **Test data:** `outage-check.txt`; intercept its POST and return HTTP 503 without forwarding it to the public service.
- **Priority / type / automation:** Medium / Resilience / Automatable (simulated).
- **Steps and expected results:**
  1. Configure an isolated route interception for the upload POST. **Expected:** The request is fulfilled by the test with status 503; no real upload request is sent.
  2. Select the harmless test file and submit. **Expected:** The client receives the simulated 503.
  3. Inspect the rendered result. **Expected:** Record error handling; the page must not display a successful-upload result for the simulated failed response.
- **Overall expected result:** Simulated outage is isolated and does not result in a false success state.
- **Actual result:** — **Status:** — **Tester / date:** —
