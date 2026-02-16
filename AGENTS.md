# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` contains the Next.js App Router entry points (`layout.tsx`, `page.tsx`) and global styles in `globals.css`.
- `src/landing_page/` houses landing-specific logic and UI, including `components/` plus shared helpers like `proposalApi.ts` and `proposalDialog.ts`.
- `public/` stores static assets served directly by Next.js.
- Root configs include `next.config.ts`, `open-next.config.ts`, `wrangler.jsonc`, `tsconfig.json`, and `eslint.config.mjs`.

## Build, Test, and Development Commands
- `npm run dev`: start the Next.js dev server.
- `npm run build`: create a production build.
- `npm run start`: run the production server locally.
- `npm run lint`: run ESLint with the Next.js ruleset.
- `npm run check`: run `next build` plus `tsc` for type checks.
- `npm run preview`: build and run a Cloudflare Workers preview via OpenNext.
- `npm run deploy`: build and deploy to Cloudflare Workers.
- `npm run cf-typegen`: generate Cloudflare env typings into `env.d.ts`.

## Coding Style & Naming Conventions
- TypeScript + React (Next.js 16) with Tailwind CSS classes in JSX.
- Indentation uses tabs in existing source files; keep it consistent in touched files.
- Prefer PascalCase for React components and camelCase for functions/variables.
- Linting is handled by `eslint.config.mjs` via `next lint`.

## Testing Guidelines
- No test runner or test files are currently configured.
- If you add tests, keep them close to the code they cover (e.g., `src/landing_page/components/Button.test.tsx`) and document the chosen framework in this guide.

## Commit & Pull Request Guidelines
- Git history currently shows a single commit (`source repo import`), so no commit message convention is established yet.
- For PRs, include:
  - A short summary of changes and testing status (e.g., `npm run lint`).
  - Screenshots or screen recordings for UI/landing page changes.
  - Any new config or env requirements (update `env.d.ts` when needed).

## Configuration & Deployment Notes
- Cloudflare deployment is driven by OpenNext (`open-next.config.ts`) and Wrangler (`wrangler.jsonc`).
- Update `env.d.ts` via `npm run cf-typegen` when adding new Cloudflare bindings.


## Agent-Specific Instructions
If you update this repository structure or tooling, also update this `AGENTS.md` to keep guidance accurate.
Always do git pull to ensure latest code from remote before executing
only Use new files for new features
Add new folders for new modules
Follow the code architectural style
Break the code into smaller functions whenever possible
Add short description in Readme files in related folders for new features
Use packages instead of implementing everything in the code base
Follow security best practices
commit all changes at the end of the work
Use snake case for file and folder names
