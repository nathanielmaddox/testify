#!/usr/bin/env node
/**
 * Vercel remote install for ONE app (run from apps/<app> as the project's installCommand).
 *
 * The design system is a PRIVATE GitHub dependency (github:nathanielmaddox/storybook#<sha>) and
 * Vercel's build machine has no GitHub credentials, so on Vercel only we override it with the
 * vendored, prebuilt tarball in vendor/ (same approach as rank_and_rent and otesse_website). Local
 * installs keep the git pin. The tarball's sha must match the pin; when the design system is
 * bumped, re-pack it: scripts/vercel/README.md.
 */
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..', '..')
const appDir = path.relative(root, process.cwd()).split(path.sep).join('/')
if (!/^apps\/[a-z0-9_-]+$/.test(appDir)) {
  console.error(`Refusing: run from apps/<app>, not ${appDir || 'the repo root'}.`)
  process.exit(1)
}

/** The DS pin: the app's own manifest first, else any workspace manifest (check-workspace keeps them equal). */
function findPin() {
  const manifests = [path.join(root, appDir, 'package.json')]
  for (const dir of ['apps', 'packages']) {
    const base = path.join(root, dir)
    if (!existsSync(base)) continue
    for (const d of readdirSync(base, { withFileTypes: true }))
      if (d.isDirectory()) manifests.push(path.join(base, d.name, 'package.json'))
  }
  for (const file of manifests) {
    if (!existsSync(file)) continue
    const pkg = JSON.parse(readFileSync(file, 'utf8'))
    const spec =
      pkg.dependencies?.['@otesse/design-system'] ?? pkg.devDependencies?.['@otesse/design-system']
    if (spec) return spec
  }
  return undefined
}

const pin = findPin()
const sha = /#([0-9a-f]{8})/.exec(pin ?? '')?.[1]
const tgz = `vendor/otesse-design-system-0.1.0-${sha}.tgz`
if (!sha || !existsSync(path.join(root, tgz))) {
  console.error(
    `No vendored design system for pin ${pin}: expected ${tgz}. Re-pack it (scripts/vercel/README.md).`
  )
  process.exit(1)
}

const pkgPath = path.join(root, 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
pkg.pnpm = {
  ...pkg.pnpm,
  overrides: { ...pkg.pnpm?.overrides, '@otesse/design-system': `file:./${tgz}` },
}
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
console.log(`design system -> ${tgz}; installing ${appDir} and its workspace deps`)

execSync(
  `pnpm install --no-frozen-lockfile --config.confirmModulesPurge=false --filter "{./${appDir}}..." --filter testify`,
  {
    cwd: root,
    stdio: 'inherit',
  }
)
