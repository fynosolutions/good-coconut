# Pearly — 独立浏览器证据（原三品牌检查中的 Pearly 摘录）

Inspected 2026-11-06 in isolated agent-browser session evidence-3610d388e8e8 (Edge), 1440x900 and 390x844. A was kept independent; parent confirmed A complete before B findings sent.

## Pearly — https://drinkpearly.com/
- Hero is a JPG image (banner_816531f7-feeb-4a82-bed8-6385c512bda0.jpg), not a video. Desktop hero image 1440x694; HTML H1 DIY BUBBLE TEA KITS uses Interstate Compressed at 128px.
- Main SHOP NOW anchor points to /collections/bubble-tea-kits. Product cards combine images, H3 names and ADD TO CART links.
- Soft gradients and repeated wave SVG separators exist as CSS backgrounds.
- Lower instructional section contains three 258x258 muted autoplay looping MP4s (Action_1/2/3); Pearly in Action uses a separate portrait MP4 with controls and poster.
- Mobile document scrollWidth=390 at viewport 390; no whole-document horizontal overflow. Some carousel children extend beyond viewport, which alone is not evidence of a page overflow bug.

## Detector provenance and cleanup
- CLI file scan skipped as required for external URL targets.
- Mutable preflight succeeded on all 3: title changed to [Human], script element appended, script executed (executed=true).
- live-server --background was attempted and returned pid=17200, port=8400. Note procedural deviation: launch call occurred before successful preflight (first stdin-eval returned undefined; repeat direct eval succeeded). Service was not reliably retained across tool calls.
- Injected http://localhost:8400/detect.js on each page, waited 2500ms. Each script onerror set failed=true; none returned loaded=true. Console files contain only an Edge auto_open_controller_script line, no impeccable findings. Exact network failure cause was not exposed, so do not assert CSP or mixed-content as cause.
- Therefore detector findings/counts unavailable, NOT zero/clean; no reliable overlay exists. Browser remained headless, no human-visible overlay claimed. Fallback is saved DOM measurements and screenshots.
- Cleanup command live-server stop --keep-inject returned No running live server found. Follow-up checks found neither PID 17200 nor port 8400 listener. Browser close succeeded. No project HTML edits were made. Saved b-* files are intentional evidence artifacts.
- Homepage/button presence only; no checkout, form submissions, audience assumptions or full accessibility audit.
