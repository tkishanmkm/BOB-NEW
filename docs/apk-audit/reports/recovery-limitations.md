# Recovery limitations

- The source is an `.apks` bundle with base and split APKs. A base APK decode is available; the splits contain additional density/language resources and should be treated as part of the source package.
- This pass inventories resources and manifest/layout evidence only. It did not capture screenshots from a running app or inspect every screen in an emulator.
- Flutter is present, so some screen composition may live in compiled Flutter code and not be recoverable as XML layouts.
- Resource names can be ambiguous and include third-party SDK resources. The asset category classifier uses filename/path heuristics.
- The APK includes statement-related native UI resources, but a complete local statement-generation template has not been located/verified in this pass.
- Decompiled resource logs report unresolved references; check `apktool-base.log` for details.
- No backend/API was contacted and no app functionality was implemented.
