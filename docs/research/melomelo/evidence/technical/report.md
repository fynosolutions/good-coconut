# Assessment B — independent technical evidence

Target: https://www.melomelo.us/menu
Date: 2026-11-05. Independent browser session melotech-3610d388e8e8; findings withheld until Assessment A completed. Edge headless, desktop 1440×900 and mobile 390×844. Page selected Simplified Chinese in this fresh browser context; do not imply every visitor sees this locale.

## Deterministic detector

Command: impeccable detect --json https://www.melomelo.us/menu. Raw output in detector.json. Six findings, all rule low-contrast, severity warning, file https://www.melomelo.us/menu, line 0 (rendered DOM, no source line). Selectors distinguish card nth-of-type 3, 4, 5, 11, 13, 14 and descend to the Sold Out badge. All report white #ffffff on #d7d7d7, 1.4:1 vs 4.5:1 requirement. These correspond to coconut-triple, insulation-box, melomelo-glass-mug, red-dragonfruit-coconut, yellow-dragonfruit-coconut, golden-kiwi-coconut. Screenshot mobile.png visibly corroborates pale white-on-gray badge styling. No false positives confirmed for these badge findings: the badge is informational text inside a product link, not the disabled purchase button. Do not apply the disabled-control contrast exemption to the Sold Out label.

Execution caveat: CLI produced a valid complete JSON array but process wrapper reported exit code 1 and no diagnostic stderr. Thus report usable findings, not a clean successful exit or WCAG certification. Detector was not rerun unnecessarily.

## Browser findings

1. P1/P2 accessibility: Skip to Main Content points to #main-content, but target is absent, and no main or role=main landmark exists. Confirmed with DOM, corroborated by axe. Keyboard users cannot use the advertised bypass path. Add main id=main-content tabindex=-1 and make the link move focus there. desktop-dom.json, preflight.json, axe-desktop.json.
2. P2: html lang=en while most rendered shopping content is Chinese. This needs locale-aware document language, and appropriate language tags on untranslated text. Assistive navigation names mix English phrases and Chinese item names. This is an observed locale-specific mismatch, not a claim of a broken language switch.
3. P2: small mobile secondary targets: wishlist ~26×32 CSS px, sort 39×27, hamburger/cart 40×40, announcement close 38×38. Primary purchase buttons are 44 px high on mobile and 48 px on desktop. These smaller controls miss a comfortable 44×44 design target; do NOT claim blanket WCAG 2.2 failure (24 px criterion and spacing exceptions differ).
4. P2: Mobile navigation drawer remains open after Escape. mobile-nav-after-escape.png confirms persistent open drawer after the command and subsequent tool calls. Drawer close button has no accessible name in the snapshot. Pointer close succeeds; after animation the drawer is removed. Add labeled close button, Escape handling, focus trap/restore; focus-trap behavior was not exhaustively audited.
5. Responsive positive: document scrollWidth equals innerWidth at both 1440 and 390. Category rail is an explicit focusable scrollable region. No document-level horizontal overflow observed. This does not certify all widths.
6. Heading positive/caveat: product titles are h2 and footer categories h3. Two h1 nodes exist: a screen-reader-only generic store name plus the page headline. Multiple h1 alone is not automatically a standards failure. Scope semantics around the actual page title and main region.
7. Link positive: product cards are semantic anchors with meaningful accessible labels and real product URLs. Opening coconut-single reaches a proper product detail page. The initial snapshot caught loading placeholders; loaded content appears, so do not report blank product detail as a defect. Only one product detail was checked; not a whole-site broken-link audit.

## Interaction scope and recovery

Product title link opened /product/coconut-single. No product modal was produced through that path. Menu Add to cart for the single coconut product directly added one reversible item, displayed an announcer/toast and cart count, and exposed a sticky cart summary with minimum $200 checkout restriction. No checkout, purchase, login, newsletter submission or other form submission occurred. Initial pointer decrement was obscured by its quantity input; keyboard focusing the decrement and Enter succeeded. Final DOM announcer says quantity updated to 0, cart summary disappeared, and final snapshot confirmed the empty state. Avoid asserting the pointer obstruction as a proven persistent defect; it may be transient layout/animation. The file named modal.txt is actually post-add-cart evidence, NOT proof of a product modal. Escape on that state is not a valid modal dismissal test.

## Supplemental axe scan

axe 4.12.1 at 1440 width: 3 violation rule groups, 40 passes, 3 incomplete groups. Violations: landmark-one-main (1 node), region (32 nodes), skip-link (1 node). These are overlapping best-practice semantics findings, not 34 unique WCAG violations. Incomplete groups: aria-prohibited-attr and aria-valid-attr-value on desktop footer label relationships (3 nodes each), color-contrast (43 nodes). Incomplete means review required, not confirmed failure. No broad contrast certification inferred from axe. Raw file axe-desktop.json.

## Overlay and cleanup provenance

Browser mutation preflight succeeded: temporary title change and appended script executed. Both were removed/restored. No user-visible browser presentation capability was available. A temporary Impeccable live server was started in this evidence folder; startup did not return connection JSON within the bounded inspection window, so no detector script injection into the page was completed. No user-visible overlay exists and no overlay console results are claimed. Fallback: rendered URL CLI detector + headless browser screenshots + DOM/axe evidence. No source/deployed site files or security headers were modified and CSP was not weakened.

Cleanup: isolated agent-browser session closed successfully. live-server stop --keep-inject reported Stopped live server on port 8400. Background startup command completed after shutdown. Test cart quantity restored to zero. Evidence JSON, JS probes and PNGs intentionally retained under melomelo-analysis/technical; they are report artifacts, not an active helper. Parent owns slug/ignore list/snapshot bookkeeping.
