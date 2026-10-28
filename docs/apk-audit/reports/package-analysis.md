# Package analysis

## Source and extraction
- Source: `C:\Users\theki\Downloads\bob-World-New_1.0.1_apkcube.apks`
- Source size observed: 197,187,152 bytes.
- Package format: APK set archive (`.apks`) containing `base.apk` plus language, ABI, and density splits.
- Base APK extracted and decoded into `work\base` and `work\base-decoded`.
- Manifest package: `com.bankofbaroda.bobworlddmb`.
- App label: `bob World 2.0`.
- Main activity observed: `com.digitalmobileapp.MainActivity`.
- Flutter embedding is present; the package also contains native Android activities and resource layouts.
- Manifest/build metadata reports compile SDK 36.

## Resource inventory
The resource inventory script recorded 3,746 files from the selected base and density resources: 2,300 other, 1,031 icons, 236 backgrounds, 121 logo-classified, 26 launcher icons, 21 font-classified, 9 banner-classified, and 2 illustration-classified entries. Categories are filename/resource-path heuristics, not manual visual verification. The Flutter asset manifest is separately available at `work\base-decoded\assets\flutter_assets\AssetManifest.json`.

## Fonts observed
Flutter `FontManifest.json` declares MaterialIcons, Acumin, Gabarito, Gabarito-ExtraBold, and CupertinoIcons. Bundled Acumin and Gabarito font files were found. See `inventory\fonts.json` for the resource scan.

## Important limitations
- No emulator screenshots have been captured in this pass.
- Not every recovered image has been visually classified.
- The APK includes many third-party/SDK assets, so resource counts do not equal unique first-party screens or brand assets.
- Decompiled resources contain unresolved references in apktool logs; those items need follow-up if they matter to a specific page.
- The presence of a statement-related layout resource does not by itself prove it is the main bob World account-statement PDF template.
