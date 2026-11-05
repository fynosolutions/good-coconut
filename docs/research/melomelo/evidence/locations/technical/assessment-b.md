# Locations — Assessment B technical evidence
Target: https://www.melomelo.us/locations

## Desktop
1. **P1: Store search unavailable in this run.** Both “Search location” and “使用目前位置” buttons remained disabled after the full ten-store list loaded. Typing Irvine left all ten cards and both disabled controls. Reloading and typing valid ZIP 92618 then Enter again left all ten cards. No visible explanation was observed. This is observed runtime behavior, not a claim about root cause or all networks. Keep the address list usable, restore search dependency readiness and explain loading/unavailable state. Evidence: desktop-snapshot.txt, search-irvine.txt, search-zip.txt, dom-desktop.json.
2. **P1: Different locations share one Maps destination.** Sawtelle (2002 Sawtelle Blvd, Los Angeles) and Irvine (14775 Jeffrey Rd Ste J, Irvine) use exactly the same link https://maps.app.goo.gl/89m9exs6LjnmXUqK8 via /hang-tight. At least the shared destination warrants data correction for distinct stores; the ultimate Google Maps redirect was not resolved, so this report does not claim which address it opens. Evidence: desktop-snapshot.txt and DOM link inventory.
3. **P2: Missing main/skip destination.** See shared verified semantics. Ten stores do have H2 headings, and each Maps link is a native anchor. Individual Maps accessible names all read “Google Maps”; add store-specific name for link-list navigation.
4. No horizontal page overflow observed: document width 1440, viewport 1440.

## Mobile
1. Same disabled search with 92618 and no filtered result observed. mobile-zip.png shows the field and current-location control visibly styled as available despite disabled DOM state; clarify unavailable state and preserve a practical path to stores.
2. No horizontal page overflow observed: document width 390, viewport 390. Maps anchors measured 170×44, giving a usable primary touch target.
3. Menu opened and revealed menu/locations/brand links plus login and language controls. Immediate Escape snapshot alone was not used as a failure. An extra unlabeled menu button appears in the accessibility snapshot and merits close-button naming verification.
4. The long address directory and header/footer remain without main landmark; the skip link has no destination, compounding traversal burden.

## Automated results
| View | axe violation rules | Reported affected nodes | Incomplete rules | Pass rules |
|---|---|---|---|---|
| Desktop | landmark-one-main; region; skip-link | 1; 88; 1 | 3 | 41 |
| Mobile | landmark-one-main; region; skip-link | 1; 84; 1 | 1 | 40 |
These are 3 rule categories per viewport, not 90/86 unique defects. Impeccable: [] = zero findings, no rule/file locations. All raw JSON saved alongside this report.

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
