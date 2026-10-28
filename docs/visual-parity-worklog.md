# BOB-NEW visual parity worklog

Status: **resource-informed styling pass; pixel parity not yet verified**.

## Implemented in this pass
- Registered the APK-declared Acumin and Gabarito font files already present in `public/assets/reference/fonts/`.
- Applied Acumin to interface body text and Gabarito to headings, retaining Daybook's distinct prototype identity.
- Introduced design tokens based on a small set of named native resource colors found in the audit (navy `#1f3c66`, deep blue `#162b75`, orange `#f26522`, body text `#27374d`). These are resource-derived cues, **not a verified Flutter theme**.
- Harmonized buttons, cards, nav states, notices, and focus/reduced-motion behavior with the token set.

## Still required for an identical visual match
1. Capture a consistent set of screenshots from the authorized source APK for every route and state (loading, empty, filled, validation, confirmation, dialogs, bottom sheets).
2. Compare screenshots at the same viewport/device scale and document dimensions, spacing, color, typography, icon, and asset differences.
3. Map only first-party assets to each confirmed screen. Native XML/vector files need conversion or React/SVG equivalents where browsers cannot render them directly; preserve attribution/licensing notes.
4. Keep official bank marks and exact identity elements out of the independently branded Daybook prototype; use original demo branding and clear local-prototype disclosures.
5. Re-run visual, accessibility, route, and responsive checks after each screen migration batch.

## Evidence limitation
The static audit contains mixed Flutter and Android/third-party SDK resources. Filenames and native resource colors do not prove which screen uses them at runtime. Without source APK screenshots or an authorized runtime walkthrough, exact pixel parity cannot be honestly certified.
