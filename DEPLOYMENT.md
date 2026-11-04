# Vercel deployment

- GitHub: `fynosolutions/good-coconut` (private).
- Requested Vercel workspace: `wei34`.
- Framework: Other; Node: 22.x; build: `npm run build`; output: `public`.
- The `/api/contact` function uses the shared validation and email adapter; static pages and Google Maps use the headers in `vercel.json`.
- `RESEND_API_KEY` and `MAIL_FROM` (a verified sending domain) are required for actual email sending. `MAIL_TO` defaults to the published business email. Never commit these values. `PUBLIC_ORIGIN` is optional; when unset on Vercel, the HTTPS request host is used for same-origin validation.
- Without mail credentials the form reports that the message was not sent and preserves the visitor's input.
- Current request limits and duplicate tracking are per function instance. They are not a global quota; configure shared storage / platform rate limiting before relying on global limits. Resend also receives the idempotency key.
- Validate `/`, `/menu/`, `/menu/wall-street/`, `/online/`, `/contact-us/`, Google Maps, local assets, and `/api/contact` after deployment. Real inbox delivery requires a separately configured and verified sender.

## Verification

`npm run check`, `npm test`, `node test-vercel.mjs`, and `node qa-review.mjs`.
Browser checks require an installed Edge at the path in the QA script. Dependencies are now local to this repository.

## Menu release verification

- `node qa-menu-locations.mjs`: both location catalogs, prices, images, search, product details, order destinations, responsive layouts, and no-JavaScript navigation.
- `node qa-menu-switch.mjs`: in-page switching without a reload or scroll jump, browser history, fetch failure/retry, and rapid selection changes.
- Production menus: `/menu/` (Flushing) and `/menu/wall-street/` (Wall Street). Keep both JSON source files and all `public/assets/menu/` images in the release.
