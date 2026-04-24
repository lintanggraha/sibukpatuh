# 📜 Changelog

Semua perubahan signifikan pada proyek **SibukPatuh** akan dicatat di file ini.

## [2026-04-23]

- ✨ **Feature:** feat: implement cross-mapping visual tool and framework comparison
- 🛠️ **Fix:** fix(ai): Switch to gemini-3-flash-preview
- 🛠️ **Fix:** fix(ai): Try v1beta with gemini-1.5-flash-latest
- 🛠️ **Fix:** fix(ai): Switch to v1 stable endpoint with gemini-1.5-flash
- 🛠️ **Fix:** fix(ai): Rollback Gemini model to gemini-pro for stability
- 📚 **Docs:** docs: Update README with Intelligence Center and Smart Fallback features
- 🎨 **UI/UX:** style(ui): Reorganize PADG overview into balanced 2x2 grid and rollback tabs
- ✨ **Feature:** feat(ui): Complete 4-tab layout for PADG 32 navigation
- 🎨 **UI/UX:** style(ui): Update PADG summary boxes to a balanced 2x2 grid
- ✨ **Feature:** feat(ui): Display detailed breach sources list in Intelligence Center
- ✨ **Feature:** feat(api): Implement Smart Fallback for Breach API rate limits
- ✨ **Feature:** feat(data): Add analogies for all remaining COBIT 2019 concepts
- 🛠️ **Fix:** fix(data): Add cache buster to COBIT JSON fetch
- 🛠️ **Fix:** fix(data): Update framework analogies and vercel rewrites
- 🛠️ **Fix:** fix(ui): Prevent cobit modal from overflowing viewport
- ✨ **Feature:** feat(ui): Standardize framework explorer UI and update copywriting tone

## [2026-04-22]

- 🛠️ **Fix:** fix: remove problematic rewrites from vercel.json and add proxy for local dev
- 🛠️ **Fix:** fix: add proxy for /api/gemini in local development
- 🛠️ **Fix:** fix: update Gemini model from gemini-2.0-flash to gemini-1.5-flash
- 🛠️ **Fix:** fix: improve card sizing and prevent overflow in PADG and COBIT views
- 🛠️ **Fix:** fix: remove all Chinese characters from framework analogies
- ✨ **Feature:** feat: enrich PBI analogies with ISO 27001 style metaphors
- ✨ **Feature:** feat: enrich PADG analogies with ISO 27001 style metaphors for non-regulatory people
- ✨ **Feature:** feat: enrich PADG analogies with user-friendly metaphors for non-regulatory people
- ✨ **Feature:** feat: display analogy field in PADG explorer detail panel
- 🛠️ **Fix:** fix: add filteredRequirements computed property to enable explorer filtering
- ✨ **Feature:** feat: enrich PADG requirements with analogies and fix empty summaries
- 🔄 cleanup: remove empty/placeholder sections from PADG view
- ✨ **Feature:** feat: add PADG 32/2025 Pengaturan Industri Sistem Pembayaran view

## [2026-04-21]

- 🛠️ **Fix:** Fix sanctions buttons not clickable in UU PDP - add click handlers
- 🛠️ **Fix:** Fix missing end tag in Pdp.vue tab
- 🔄 Add UU PDP (Pelindungan Data Pribadi) framework with SEOJK-like UI
- 🔄 Add analogy field to SEOJK requirements for educational context
- 🛠️ **Fix:** Fix NIST descriptions - rewrite with accurate, comprehensive, educational content based on official NIST CSF 2.0
- 🔄 Increase OTX pulse limit to 50 for better chart data
- 🔄 Update chart to show 5 days with yellow color
- 🛠️ **Fix:** fix: improve error messages for quota exceeded and remove debug logs
- 🛠️ **Fix:** fix: use GEMINI_KEY env var instead of GEMINI_API_KEY
- 🛠️ **Fix:** fix: debug Gemini API key and simplify vercel config
- 🛠️ **Fix:** fix: configure vercel.json for Vue SPA with API support
- 🛠️ **Fix:** fix: simplify vercel.json - remove invalid function config
- 🛠️ **Fix:** fix: improve AI responses - natural conversational style, more flexible context handling
- 🛠️ **Fix:** fix: configure API function runtime for Vercel serverless
- 🛠️ **Fix:** fix: add API rewrite rules for Vercel deployment
- 🛠️ **Fix:** fix: connect Gemini AI API for dynamic CVE analysis instead of hardcoded responses

## [2026-04-20]

- 🛠️ **Fix:** fix: diversify OTX IOC feed with round-robin pulse selection and indicator-specific context
- 🎨 **UI/UX:** style: move Breach Checker and Chart side-by-side for a compact UI
- 🛠️ **Fix:** fix: remove title truncation and add rich detail views in OTX section
- 🛠️ **Fix:** fix: remove extra closing div in OTX section of IntelligenceCenter.vue
- 🎨 **UI/UX:** style: harmonize OTX tables with minimalist CVE row style

---
*Auto-generated on: 2026-04-23*
