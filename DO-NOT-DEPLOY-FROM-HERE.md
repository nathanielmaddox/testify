# DO NOT DEPLOY FROM HERE

**This is the monorepo root. It is NOT a Vercel project.** (Same rule as `vs_code/otesse` and `vs_code/rank_and_rent`.)

Each app deploys independently from its own folder, by git author `cocoking` / `hello@otesse.com`, with an explicit `vercel deploy --prod`. Never from this directory. How: `scripts/vercel/README.md`.

| App     | Path            | Vercel project  |
| ------- | --------------- | --------------- |
| website | `apps/website/` | not yet created |

The root `package.json` `deploy` script and the root `vercel.json` both refuse on purpose.

If you find a `.vercel/` directory next to this file holding anything but `repo.json`, delete it. A root-level link creates or overwrites the wrong Vercel project.
