# BOB World APK runtime evidence and screen verification tracker

Last checked: 2026-10-29. Scope: BOB-NEW only.

## Evidence boundary

The source bundle is present locally at `C:\Users\theki\Downloads\bob-World-New_1.0.1_apkcube.apks`; extracted split APKs are in `C:\Users\theki\Downloads\BOB-WORLD-APK-EXTRACTED`. Package identifier: `com.bankofbaroda.bobworlddmb`, version name `1.0.1`, version code `1011`. The base APK is approximately 220 MB and the ARM64 split is approximately 82 MB.

The current BOB-NEW screenshot folder contains screenshots of the web target, not screenshots captured from the original APK. Do not use them as source-app evidence. The earlier `original-apk-launch.png` was the x86_64 emulator launcher, not a verified source-app screen.

## Asset catalogue status

- APK bundle and ABI/density/language splits: **present**.
- Flutter asset manifest and font manifest: **catalogued**.
- Flutter image paths, fonts, colour values, native layouts, and native visual resources: **catalogued** in `docs/apk-audit/inventory/`.
- Asset usage/hash/manifest audit: **generated** in `docs/asset-usage-audit.md` and `docs/asset-usage-audit.csv`.
- Public target assets: 7,332 files / 181.24 MiB.
- Manifest paths missing from `public/`: 0.
- Literal source URL references detected: 27; all 27 resolve.
- Static source scanning detected 7,305 files not referenced by literal paths; this is not proof they are unused because dynamic references, CSS, manifest-driven assets and Android-only resources may not be detected.

## Screen evidence tracker

| Screen/flow | Evidence available | Confidence | Runtime source screenshot | Next action |
|---|---|---|---|---|
| App launch / splash | Splash image/video resource names and launcher assets | Likely | Not captured | Launch on ARM64 emulator and capture initial frames |
| Welcome / onboarding | Static resources only; exact route not established | Unknown | Not captured | Inspect startup sequence; do not infer unseen screens |
| Login / sign-in | Native and app resources available; exact layout not verified | Likely | Not captured | Capture only if visible before authentication |
| Dashboard / home | Flutter dashboard asset groups and named icon assets | Likely | Not captured | Capture only if publicly reachable without authentication; otherwise mark restricted |
| UPI activation | `activateUpi` and dashboard asset groups | Likely | Not captured | Record entry points and gate state only from observed evidence |
| Account management | `accountManagement` Flutter assets | Likely | Not captured | Map asset groups to screens when runtime evidence exists |
| Statements / statement upload | Native layout/resource names for statement-related UI | Likely | Not captured | Determine which components are first-party versus embedded SDK |
| QR / scanner | Scanner-related resources and native activity declarations | Likely | Not captured | Confirm entry point and permissions in runtime walkthrough |
| Offers / rewards | Resource groups and native activity declarations | Likely | Not captured | Confirm whether first-party or SDK-provided |
| Embedded web / SDK screens | Manifest activity declarations and native resources | Unknown | Not captured | Identify owning SDK and reachable entry point |

## Known route inventory

The source-to-target route list is documented in `docs/apk-screen-route-asset-inventory.md` (52 paths). These routes are migration targets from existing audit notes, not proof that the original APK exposes each path as an independent screen. Each route must be individually labelled **implemented**, **partial**, **placeholder**, or **missing** in the target app; runtime parity remains unverified until a corresponding source-app capture or reliable official reference exists.

## Emulator status

The existing Android 15 emulator is x86_64. The original bundle includes ARM64 native libraries, and the app returned to the launcher on the earlier attempt. A separate Android 15 Google APIs ARM64 image has now installed, and an AVD named `BOBWorld_ARM64_API35` was created. However, this Windows host is x86_64 and Android Emulator reports that ARM64 AVDs are unsupported on this host (`Avd's CPU Architecture 'arm64' is not supported by the QEMU2 emulator on x86_64 host`). The original package is installed on the existing x86_64 AVD, but a verified app launch/public-screen capture is still blocked by the source APK's ARM64 native split. A compatible ARM64 physical Android device or a supported ARM64 host is needed for runtime screenshots. Do not claim the ARM64 emulator is ready.

## Safe capture rules

- Capture public screens without entering real banking credentials.
- Never bypass login, OTP, MPIN, transaction PIN, device binding, or bank controls.
- If an authorised demo/test account becomes available, user-driven login may be used; mask account numbers, names, balances, notifications and other personal data before sharing screenshots.
- Do not mark a screen confirmed based solely on a filename, route file, XML resource, icon or inferred navigation.
- If a screen requires authentication and no authorised test account exists, leave it **unverified/restricted** and continue with clearly labelled demo data in BOB-NEW.

## Completion checklist

- [x] APK bundle and split files located.
- [x] Flutter/native resource inventory generated.
- [x] Asset usage audit generated.
- [x] Known route inventory documented.
- [ ] ARM64 system image install completes.
- [ ] ARM64 AVD created and booted.
- [ ] Original APK opens successfully.
- [ ] Public startup/login screenshots captured and checked.
- [ ] Source screenshot manifest created with capture evidence and confidence labels.
- [ ] Each target route reviewed for dedicated UI versus generic placeholder.
- [ ] Changes validated with typecheck, data tests, build, and route smoke tests.



## Public onboarding flow from official documentation

The official Bank of Baroda bob World public help page describes this pre-authentication sequence: launch the app; grant required permissions when prompted; choose a language and review informational screens; tap Login on the welcome screen; complete the app's required phone/SMS verification and OTP flow. This is documentation-derived flow evidence, not a runtime capture of version 1.0.1. Do not automate or bypass phone verification, OTP, PIN, or device checks.

Reference: https://bobworld.bankofbaroda.bank.in/ (official bob World website; onboarding and active-user FAQs). For public product-level features and service groupings, see https://bobworld.bankofbaroda.bank.in/about-bob-world. These references supplement but do not replace APK runtime screenshots.
