# Visual design system (resource-derived)

## Typography
Flutter `FontManifest.json` declares:
- `Acumin` -> `assets/fonts/Acumin.otf`
- `Gabarito` -> `assets/fonts/Gabarito.ttf`
- `Gabarito-ExtraBold` -> `assets/fonts/Gabarito-ExtraBold.ttf`
- `MaterialIcons` -> `fonts/MaterialIcons-Regular.otf`
- `packages/cupertino_icons/CupertinoIcons` -> Cupertino icon font

Additional Acumin variants exist in the decoded base assets. Exact screen-by-screen font sizes and weights require layout/code or screenshot verification.

## Colors
`inventory\colors.json` contains values parsed from native Android `res/values/colors.xml` and the night-mode color resource if present. Because this app contains Flutter and multiple SDKs, these native color values should not automatically be treated as the complete primary Flutter theme.

## Visual assets
Use `inventory\asset-inventory.csv` to trace each asset back to its original resource path. The asset category column is heuristic. Flutter image resources are indexed by `work\base-decoded\assets\flutter_assets\AssetManifest.json`.

## Not verified
- Exact Flutter theme tokens and page-specific color usage.
- Pixel measurements, padding, radii, and typography per screen.
- Light/dark screen screenshots.
- Which banner assets are currently visible at runtime.
