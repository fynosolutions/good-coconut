# Assessment B — local gallery evidence

Independent detector/browser assessment for `good-coconut-gallery/public/index.html`, supporting `public/gallery.css` and root `gallery.mjs`. No Assessment A findings were seen. No website files were edited and no form or external order was submitted.

## Detector

Ran bundled `impeccable detect --json public/index.html` once. Complete JSON: `b-detect.json`. 17 warnings, 8 rules, all attributed to absolute public/index.html and detector line 0 (generated HTML is minified; line 0 is not a meaningful source location).

| Rule | Count |
|---|---:|
| low-contrast | 1 |
| broken-image | 1 |
| cramped-padding | 4 |
| tiny-text | 2 |
| undersized-ui-text | 6 |
| cream-palette | 1 |
| organic-clip-path | 1 |
| dark-glow | 1 |

Confirmed: creator status/placeholder labels are undersized. Detector reports 7px coming-soon labels (matches max-width380 CSS); actual 390px viewport computed labels and placeholder captions are 8px. Desktop uses 9px. User-important truth about nonworking videos is much less visible than 44–58px play-circle affordances.

False positives / qualified results:
- broken-image refers to the empty image inside the CLOSED dialog; it is populated on photo open. All gallery brand images loaded, and lightbox displayed a 1200px image when opened. Do not report a broken visible photo.
- cream-palette is consistent with incumbent coconut/cream identity; this generic detector preference is not grounds for rebranding.
- organic-clip-path is deliberate masking of scrapbook tape. Judge photographic realism/style fit, not an automatic functional failure.
- dark-glow calls this a dark page, but rendered surface is light. Its teal shadows are not evidence of a dark UI.
- low-contrast 1.4:1 compares white text to reel base background #c6deda, ignoring rendered photo plus dark gradient; actual pixel contrast must be separately measured, so do not present 1.4:1 as verified visible contrast.
- cramped-padding on hero/favorites/gallery-section/visit ignores nested wraps or intentional full bleed. Not confirmed as 4 actual clipping defects.

## Browser evidence

Dedicated Edge session `galleryb-5bbb76af5f8f`, fresh page at http://127.0.0.1:4191/. Live page confirmed `#gallery`, 11 enlarge-photo links and three placeholder reels consistent with root gallery.mjs. Tested 1440×1000 and 390×844.

- 0 actual video elements; all three galleryReels have `src:null`, `creator:null`. Three tall posters show a large play symbol but are static figures. This is not an observed playback/network error: there is no video supplied at all. Coming-soon disclosures exist, but their 8px mobile type is poor reassurance.
- Exact image reuse is visible adjacent to itself: pudding.jpg appears as photo and first reel; original-about.jpg appears as shop photo and second reel. Gallery also repeats hero/product/ribbon imagery. This reduces the promise of new social moments; use fewer unique photos now or replace placeholder media with real permissioned creator content later. Never fabricate endorsement.
- 390px document scrollWidth equals innerWidth (390). Desktop also 1440/1440. No global horizontal overflow observed. Mobile switches into two columns, maintaining alternating photo/reel composition.
- At 390px gallery section height = 2972px, roughly 3.5 phone screens. The small two-column reels are hard to read; the long sequence of reused product images makes reaching visit/order information costly even with persistent Order online access.
- Mobile direct anchor positioning at gallery top leaves upper part of Gallery heading under sticky 80px header (section scroll-margin-top:0, padding-top55). Evidence `b-mobile-gallery-top.png`; flag as P2 anchor-offset issue, not general layout disappearance.
- Navigation: desktop Gallery link resolves /#gallery. Mobile hamburger opens and exposes Gallery/Visit us/Menu/Contact links; expanded state changes. No navigation dead-end observed.
- Photo link opened native dialog, real image loaded, initial focus became Close photo. Escape dismissed dialog. Useful positive evidence; no fake broken-image report.

Screenshots: b-desktop-gallery.png, b-mobile-gallery.png (middle section), b-mobile-gallery-top.png. Facts: b-browser-facts.txt.

## Overlay and cleanup

Mutable page-title change and appending script DOM node succeeded in private browser; title changed to `[Human] Good Coconut critique B`. Inline script flag did not appear, so inline execution was not proven. Attempted official live-server --background; command returned PID12124/port8400. Appended external detect.js to page; browser explicitly logged B_OVERLAY_SCRIPT_FAILED. No detector executed in page, and no reliable user-visible overlay exists. Browser was headless/private, not a presented user-visible tab.

Ran live-server stop --keep-inject: returned No running live server found. PID12124 was no longer present. Session closed with Browser closed. Did not stop or change existing preview service4191. Source files unchanged. Evidence retained intentionally. No temp script left on project disk; injected nodes existed only in now-closed browser.

Assessment B completed; report withheld from parent until Assessment A is complete. Pearly/MeloMelo comparison is left to Assessment A/parent's independently captured references, not inferred here from unvisited sites.
