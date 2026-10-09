# Vercel deploys for testify apps

Every app deploys on its own; the monorepo root never does (`DO-NOT-DEPLOY-FROM-HERE.md`).

Per app project: root directory = the app path (`apps/website`), framework Next.js, installCommand
`node ../../scripts/vercel/install.mjs` and buildCommand `next build` (set in the app's `vercel.json`).
Project name is agreed with the owner before the first deploy. Remote build only; never `vercel build` +
`--prebuilt` from Windows.

`vercel.json` must carry no `//` comment key: the CLI's schema check rejects it before uploading. Notes
live here instead.

Env, production + preview: `ENABLE_EXPERIMENTAL_COREPACK=1` (so Vercel uses the root `packageManager`
pnpm@10.11.0), plus whatever the app's `.env.example` lists.

## Design system tarball

`@otesse/design-system` is a private GitHub dependency (`github:nathanielmaddox/storybook#<sha>`) and the
Vercel build machine has no GitHub credentials. `install.mjs` therefore overrides it on Vercel only with
`vendor/otesse-design-system-0.1.0-<first 8 of the pinned sha>.tgz` (root `pnpm.overrides`, written on the
build machine only, never committed) and installs `--filter "{./apps/<app>}..."` plus the root.

`vendor/` is empty in a fresh clone (only `.gitkeep`). For the current pin `e7d37602`, the identical
tarball already exists at `vs_code/rank_and_rent/vendor/otesse-design-system-0.1.0-e7d37602.tgz`; copy it
into `vendor/` and commit it before the first deploy.

After a design-system bump, re-pack from the locally installed (already built) package: copy `dist`,
`src`, `tailwind.config.js`, `postcss.config.js`, `package.json` (with `scripts` emptied so nothing runs on
install) into a temp folder, `npm pack --ignore-scripts`, and rename into `vendor/` with the new sha.
Delete the old tarball.

## Deploying

1. Write the ephemeral root `.vercel/repo.json` (orgId, remoteName origin, one entry per project: id,
   name, directory). Delete `.vercel/` when done: the pre-push hook refuses while it holds anything but
   `repo.json`, and a root project link would deploy the wrong thing.
2. From `apps/<app>`: `npx -y vercel@60.1.3 deploy --prod --yes` in PowerShell. In Git Bash `npx vercel`
   fails (spawn cmd.exe ENOENT); installing `vercel@60.1.3` into a scratch folder and running
   `node <scratch>/node_modules/vercel/dist/vc.js deploy --prod --yes` from `apps/<app>` works. The root
   `.vercelignore` keeps node_modules, .next, .git, tsbuildinfo and every `.env*` (except `.env.example`)
   out of the upload.
3. Smoke test the deployment URL (home page 200, brand present, no console errors) before promoting.
