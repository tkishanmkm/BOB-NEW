# Statement UI and generation investigation - evidence-based

## Important distinction
The recovered native resources prominently contain bank-statement upload screens used in loan/verification journeys. These are not the same thing as the customer's own account-statement PDF generator. The resource evidence currently available does not establish the exact implementation of the account-statement generator.

## Upload UI recovered from XML
The native layout custom_upload_bank_statements.xml shows a horizontal row with a Bank Statement label; a dashed upload area with Click here to upload file; a selected-file state with primary-color background and selected filename, initially hidden; cross/remove icons; and a password input in a custom wrapper with a show-password toggle. It references Acumin Pro Medium, dimension, and color resources.

The dialog_upload_bank_statements.xml layout shows a white vertically arranged confirmation dialog with a note and Yes/No buttons. The string resource asks whether the user uploaded bank statements for the last six months.

Other related loan-journey screens include fragment_pl_bank_statements.xml, fragment_pl_upload_bank_statements.xml, fragment_mudra_bank_statement.xml, fragment_mudra_upload_bank_statements.xml, and account-selection/row layouts. These contain account-detail fields, account grids, upload controls, password-protected PDF options, and continue/submit buttons. See gallery/native-layouts.html and inventory/native-layout-inventory.csv for the native layouts and view IDs.

## Textual requirements found in resources
The bank_statements_text string says statements should cover the last completed six months; can be one statement or multiple month/quarter/half-year files; must be digitally generated PDF/e-statement; scanned/converted PDFs are not accepted; and statements from two different banks are not allowed. Other strings mention last-12-month statements in particular loan journeys. These are app copy strings and can vary by flow; they are not a universal account-statement generator specification.

## Is account statement generation local or server-side?
Unknown from this pass. The base APK contains Flutter assets and compiled Flutter application code; manifest/asset/layout resources alone do not expose the full Dart UI or the account-statement PDF generation flow. No running app screenshots, network calls, backend inspection, or live financial operations were performed. No claim is made that a PDF is generated locally or server-side.

## PDF-generation evidence
The decoded base resources include generic PDF assets such as sample-pdf-file.pdf and downloadItrPdf.pdf, plus strings such as Download PDF. Those resources are not enough to prove they are the account statement template. No verified statement PDF template, exact statement page dimensions, table column widths, page-break algorithm, or statement-specific footer was identified.

## Next evidence needed for exact visual reconstruction
1. A user-provided sample account-statement PDF exported from the app, with personal/account details safely redacted, or screenshots of the statement screen and PDF pages.
2. Authorized emulator/device screenshots of the statement flow if the app is available for testing. Do not use real financial actions; stop before transactions or authentication steps.
3. If only static analysis is allowed, the output can remain limited to resource evidence and cannot truthfully claim exact runtime behavior of compiled Flutter screens.

This investigation is UI/documentation-only. It does not implement statement generation or banking logic.
