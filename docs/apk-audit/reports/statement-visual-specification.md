# Statement visual specification (partial)

## Directly observed resources
Native decoded resources include:
- `res/drawable/bank_statement_table_background.xml`
- `res/drawable/bank_statement_table_background_gl.xml`
- `res/drawable/border_for_statement_password.xml`
- `res/drawable/border_for_statement_password_gl.xml`
- `res/layout/custom_upload_bank_statements.xml`
- `res/layout/dialog_upload_bank_statements.xml`

These indicate UI for statement upload and statement-related presentation. They do not, by themselves, prove that the APK locally generates a complete bank account statement PDF.

## Visual attributes
- Page size/orientation: Not recovered or verified.
- PDF header/logo position: Not recovered or verified.
- Customer/account details table: Not recovered or verified as a complete PDF layout.
- Transaction table columns and widths: Not recovered or verified.
- Summary table: Not recovered or verified.
- Final-page text/footer/page-break rules: Not recovered or verified.
- PDF fonts/embedded fonts: Not recovered for the statement document specifically.
- Password-encryption appearance/configuration: Not audited; functional/encryption behavior is out of scope.

## Next visual-only investigation
Inspect UI-specific Flutter assets and native statement-related XML layouts, then obtain authorized screenshots or a sample statement document if available. Record the source of every layout claim. Do not implement or reproduce statement/business logic.
