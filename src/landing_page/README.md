# Landing Page Modules

This folder holds modular landing page behavior. The proposal dialog lives in `proposal_dialog.ts` and expects:

- A `src/landing_page/components/proposal-dialog.html` partial for the dialog markup.
- A Cloudflare Turnstile site key in the dialog markup.
- A Next.js App Router endpoint at `/api/send_email` for email delivery.

The dialog reads UI config from `window.uiConfig` via `getPublicUiConfigValue(key)` in `src/landing_page/config.ts`, and HTML `data-*` attributes can override them (`data-api-base-url`).

## Next.js Landing Components

React equivalents of the HTML partials live in `src/landing_page/components/*.tsx` and are composed by `src/landing_page/landing_page.tsx` for the Next.js app router. The components read config through `usePublicUiConfigValue(key)` in `use_landing_page_config.ts`, which updates after `/api/ui_config` populates `window.uiConfig`.
