// Workspace invariants (CLAUDE.md "Layout"). Run by pre-push and `pnpm check:workspace`.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const errors = []
const DS_PIN = /^github:nathanielmaddox\/storybook#[0-9a-f]{40}$/

function manifests(dir) {
  const base = join(root, dir)
  if (!existsSync(base)) return []
  return readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(base, d.name, 'package.json')))
    .map((d) => ({
      folder: d.name,
      dir,
      pkg: JSON.parse(readFileSync(join(base, d.name, 'package.json'), 'utf8')),
    }))
}

const apps = manifests('apps')
const packages = manifests('packages')
const dsSpecs = new Set()
const ports = new Map()

for (const { folder, dir, pkg } of [...apps, ...packages]) {
  const where = `${dir}/${folder}`
  if (pkg.private !== true) errors.push(`${where}: "private" must be true`)
  if (pkg.name !== `@testify/${folder}`) errors.push(`${where}: name must equal @testify/${folder}`)
  for (const field of ['dependencies', 'devDependencies']) {
    const ds = pkg[field]?.['@otesse/design-system']
    if (!ds) continue
    dsSpecs.add(ds)
    if (!DS_PIN.test(ds))
      errors.push(`${where}: @otesse/design-system must be pinned to a full commit sha (${ds})`)
  }
  const port = /-p\s+(\d+)/.exec(pkg.scripts?.dev ?? '')?.[1]
  if (port) {
    if (ports.has(port))
      errors.push(`${where}: dev port ${port} already used by ${ports.get(port)}`)
    ports.set(port, where)
  }
}
if (dsSpecs.size > 1)
  errors.push(`@otesse/design-system spec differs across manifests: ${[...dsSpecs].join(' | ')}`)
// Vercel's multi-project repo.json is inventory, not a root deployment link.
if (
  existsSync(join(root, '.vercel')) &&
  readdirSync(join(root, '.vercel')).some((name) => name !== 'repo.json')
)
  errors.push(
    'Root .vercel/ may contain repo.json inventory only; deploy from an app folder (DO-NOT-DEPLOY-FROM-HERE.md)'
  )

if (errors.length) {
  for (const e of errors) console.error(`check-workspace: ${e}`)
  process.exit(1)
}
console.log(`check-workspace: ok (${apps.length} apps, ${packages.length} packages)`)
