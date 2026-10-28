# Page inventory (static resource evidence)

This is an evidence-based initial inventory, not a claim that every runtime screen has been observed. The APK uses Flutter plus native Android/SDK activities. The Flutter asset manifest is at `work\base-decoded\assets\flutter_assets\AssetManifest.json`; native layout resources are in `work\base-decoded\res\layout`.

## Observed UI/resource groups
- App entry/branding: manifest label `bob World 2.0`; launcher icon resources; `src_assets_newui_splashscreen.png` and `src_assets_newui_splashscreenend.png` resource names; `splash_screen.mp4` asset.
- Dashboard/UPI visuals: Flutter asset groups include `assets/images/dashBoard/` and `assets/images/activateUpi/` with home, alerts, logout, transaction-history, scanner, balance-inquiry, and related icon resources.
- Account management: `assets/images/accountManagement/` contains account-management action icons and illustrations.
- Bank logos: `assets/images/bankLogo/` includes a collection of bank-logo assets; these are shared UI assets, not necessarily all used on the primary screens.
- Native statement-related resources: `bank_statement_table_background.xml`, `bank_statement_table_background_gl.xml`, `border_for_statement_password.xml`, `custom_upload_bank_statements.xml`, and `dialog_upload_bank_statements.xml` were found in decoded Android resources. These names indicate statement-related UI/resource elements, but do not establish the complete statement generator or its final output.
- Native home/banner resources: `banner_slider_image.xml`, `cheg_include_home_banner.xml`, and `cheg_include_announcement_banner.xml` were found; some may belong to embedded SDKs rather than the core banking UI.
- Other native SDK activities are declared in the manifest, including UPI, QR scanning, rewards/offers, and embedded web screens. These are not all necessarily first-party bob World pages.

## Verification status
- Resource-based identification: partial.
- Runtime screen inventory: not completed; no emulator screenshot pass in this run.
- Exact navigation hierarchy: not established from resources alone.
- For any screen not represented by inspected resources or screenshots, mark it unknown rather than inferred as confirmed.
