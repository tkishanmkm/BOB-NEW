# Expanded page/resource inventory

## What is indexed
- 611 Flutter image assets referenced in the Flutter asset manifest, copied into assets/flutter-ui.
- 4 Flutter font assets in the Flutter asset manifest, plus other decoded fonts inventoried in inventory/fonts.json.
- 1,022 native Android XML layout files, catalogued in inventory/native-layout-inventory.csv and searchable in gallery/native-layouts.html.
- 1,415 native drawable/mipmap visual resources copied into assets/native-visual-resources.
- 3,746 resource files in the original resource inventory CSV.

## Searchable galleries
- gallery/flutter-assets.html: searchable grid for recovered Flutter image assets.
- gallery/native-layouts.html: searchable native XML layout catalogue with links to extracted XML.

## Important caveat
This is a page/resource inventory, not a verified runtime screen-by-screen walkthrough. The application uses Flutter and embedded SDKs, so a large share of native layouts may belong to third-party SDK journeys. The Flutter AOT UI cannot be reconstructed exactly from asset names alone.
