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
| TC-01 | Upload a single valid file | P1 | Functional | Automatable | — | — | — |
| TC-02 | Upload 5 files in one file-picker submission | P0 | Functional | Automatable | — | — | — |
| TC-03 | Drag and drop 3 files into the drop zone | P0 | Functional | Automatable | — | — | — |
| TC-04 | Remove selected files from a multi-file drop before upload | P1 | Functional | Automatable | — | — | — |

## Detailed test cases

### TC-01 — Upload a single valid file

- **Objective:** Validate the standard happy path for a single successful upload from the file input.
- **Preconditions:** Upload page is loaded and the app is ready to accept input.
- **Test data:** `valid-upload.txt` from the low tier sample set.
- **Priority / type / automation:** P1 / Functional / Automatable.
- **Steps and expected results:**
  1. Select `valid-upload.txt` using the `#file-upload` input. **Expected:** The selected file is accepted and the filename is available for submission.
  2. Click the Upload button (`#file-submit`). **Expected:** The POST request resolves successfully and the page navigates to the result state.
  3. Verify the success heading and submitted filename. **Expected:** The heading `File Uploaded!` is visible and the uploaded filename is `sample.txt`.
- **Overall expected result:** A single valid file uploads successfully and shows the expected confirmation.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-02 — Upload 5 files in one file-picker submission

- **Objective:** Confirm the file picker supports multi-select and that multiple files can be submitted in one action.
- **Preconditions:** The file input must support the `multiple` attribute and the upload page is open.
- **Test data:** Five valid files from the low-tier list: `valid-upload.txt`, `valid-upload.pdf`, `valid-upload.png`, `sample.csv`, and `sample.json`.
- **Priority / type / automation:** P0 / Functional / Automatable.
- **Steps and expected results:**
  1. Check whether the file input supports multiple selection. **Expected:** `input.multiple` is `true`; otherwise this case fails because the requirement is not met.
  2. Select all five files in a single file-picker action. **Expected:** The application accepts the selection without rejecting the multi-file input.
  3. Submit the files. **Expected:** The upload request succeeds and the success state appears.
  4. Verify the result. **Expected:** Every selected file is represented in the uploaded results and the UI shows the filenames.
- **Overall expected result:** Multi-file selection and submit behavior works as required, otherwise the test fails.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-03 — Drag and drop 3 files into the drop zone

- **Objective:** Validate the browser drag-and-drop experience using the drop zone at `#drag-drop-upload`.
- **Preconditions:** The drop zone is visible and functional; network interception is enabled for `/upload`.
- **Test data:** Three sample files from the low tier: `valid-upload.txt`, `valid-upload.pdf`, and `valid-upload.png`.
- **Priority / type / automation:** P0 / Functional / Automatable.
- **Steps and expected results:**
  1. Locate the drop zone `#drag-drop-upload`. **Expected:** The drop target is visible in the page.
  2. Trigger drag-and-drop events for the three files. **Expected:** Each file is added to the drop zone as a preview and the upload request is fired once per file.
  3. Validate the UI state. **Expected:** The number of previews equals the number of uploaded files, and the filename list matches the files dropped.
  4. Validate the uploaded request payload. **Expected:** The intercepted `POST /upload` calls include all file names.
- **Overall expected result:** Drag-and-drop upload accepts and displays all three files successfully.
- **Actual result:** — **Status:** — **Tester / date:** —

### TC-04 — Remove selected files from a multi-file drop before upload

- **Objective:** Ensure the drop zone supports per-file removal before the upload is finalized.
- **Preconditions:** The app exposes an actual dropzone with per-file remove controls and does not auto-submit dropped files immediately.
- **Test data:** Five sample files from the low-tier list.
- **Priority / type / automation:** P1 / Functional / Automatable.
- **Steps and expected results:**
  1. Locate the drop zone `#drag-drop-upload` and drop five files into it. **Expected:** The preview count equals five.
  2. Remove the first two files using the remove controls. **Expected:** The preview list shrinks from 5 to 3 and the selected files are no longer present.
  3. Confirm the remaining files. **Expected:** Only the unremoved files stay in the list.
- **Overall expected result:** Users can remove individual dropped files before upload, and the remaining preview list is correct.
- **Actual result:** — **Status:** — **Tester / date:** —
