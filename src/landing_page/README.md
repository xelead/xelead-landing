# Landing Page Modules

This folder holds modular landing page behavior. The proposal dialog lives in `proposalDialog.ts` and expects:

- A `src/landing_page/components/proposal-dialog.html` partial for the dialog markup.
- A Cloudflare Turnstile site key in the dialog markup.
- A Cloudflare Pages Function endpoint at `/api/send-email` for email delivery.

The dialog reads `VITE_TURNSTILE_SITE_KEY` and `VITE_API_BASE_URL` from `src/landing_page/config.ts` by default, and HTML `data-*` attributes can override them (`data-api-base-url`).

## Next.js Landing Components

React equivalents of the HTML partials live in `src/landing_page/components/*.tsx` and are composed by `src/landing_page/landing_page.tsx` for the Next.js app router. The components read `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `NEXT_PUBLIC_API_BASE_URL` from `src/landing_page/config.ts` when running under Next.js.
