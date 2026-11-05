# Brand — Assessment B technical evidence
Target: https://www.melomelo.us/brand

## Desktop
1. **P2: Skip destination and main landmark absent.** The story has a page H1, origin H2, ingredients/glass H3s and environmental H4, but no main landmark and no working skip target according to axe. Fix structural traversal before adding accessibility controls.
2. **Needs review: reduced-motion response not conclusively verified.** After successful “set media light reduced-motion”, scrolling to the ingredients section produced running animations: heading duration 300ms; image scale(0.7), delay 1000ms + duration 300ms; body translateY(20px), delay 500ms + duration 300ms. Evidence dom-reduced-motion.json. This supports a reduced-motion implementation review; no claim of a severe vestibular effect or full WCAG failure. Prefer instantly revealed static content under reduced-motion. The reduced-motion matchMedia read was not successfully captured, so emulator command success is the evidence for preference emulation.
3. No horizontal overflow at 1440px. Core story appears as actual DOM text with heading structure, not a flattened image-only story.
4. HTML lang=en with Chinese main text; verify locale language propagation.

## Mobile
1. No horizontal overflow at 390px. Story headings are present and readable in DOM. Mobile content was inspected after scrolling; screenshots retained.
2. Mobile menu successfully opens, exposes three primary native navigation links, login and language controls. A button without accessible name appears in its snapshot and should be verified as the close affordance. Escape was issued, but immediate snapshot is insufficient to claim a persistent dismissal defect.
3. Same skip/main structural issues. Social icons measured 24×24 CSS px, smaller than 44×44 comfort guidance; add invisible padding if space permits. Do not call these automatic WCAG failures.
4. Footer accordions expose named buttons with expanded=false. Hidden-footer links can appear in early snapshots during transition; not treated as a confirmed focus leak.

## Automated results
| View | axe violation rules | Reported affected nodes | Incomplete rules | Pass rules |
|---|---|---|---|---|
| Desktop | landmark-one-main; region; skip-link | 1; 25; 1 | 3 | 38 |
| Mobile | landmark-one-main; region; skip-link | 1; 21; 1 | 1 | 37 |
These are 3 rule categories per viewport, not 27/23 unique defects. Impeccable: [] = zero findings, no rule/file locations. Browser console showed Google Maps non-async loading warnings (not a demonstrated user-visible bug); errors capture empty. Raw JSON saved alongside this report.

## Method and boundaries
Isolated Assessment B, agent /root/two_page_technical; no Assessment A output was read. Edge via dedicated agent-browser session melopagesb-3610d388e8e8, viewport 1440×1000 and 390×844, 2026-11-05. Actual SPA content was checked after initial shell. Locale served by this environment was Simplified Chinese with English store names; this does not prove every visitor receives Chinese. No purchase/newsletter/contact submission or location permission request. URL detector was run once and returned [] (exit 0). This is zero detector heuristics, not a clean accessibility/functional bill. Rendered DOM + axe 4.12.1 supplied browser fallback; no visible overlay was installed and no live server started. Browser was closed. Evidence retained intentionally; failed auxiliary eval files are empty and not evidence.

## Shared verified semantics
- HTML declares lang=en although visible main copy is Chinese; verify application locale updates document language and localized subtrees. This evidence does not establish absence of every possible nested lang override.
- No main, header or footer landmarks in DOM inventory; only Breadcrumb nav. axe reports landmark-one-main and region (best-practice rules, not an automatic claim of WCAG failure).
- Skip to Main Content href points to #main-content; axe reports no target. Fix a real focusable main landmark and wire skip destination to it. This is a concrete keyboard-navigation defect.
- A hidden generic H1 “MeloMelo Online Store” accompanies the page H1. Multiple H1s alone are not a WCAG violation; redundant generic announcement is the practical concern.
- Accessibility widget exists but does not repair these source semantics.

## Limits
Contrast is incomplete due to image/overlap background uncertainty, not a confirmed contrast failure. Desktop ARIA footer checks are incomplete, not promoted to violations. No screen-reader or real-device run. Touch-target measurements are CSS pixels and small targets are recommendations, not blanket WCAG failures. Navigation checks opened mobile menu and recorded Escape immediately; snapshot timing prevents a definitive dismissal failure claim. No broad crawl or destination health assertion.
