// AGENTS.md must be a byte-identical copy of CLAUDE.md.
// Claude Code reads CLAUDE.md; Codex / ChatGPT and other tools read AGENTS.md. If they drift, agents follow different rules.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const a = readFileSync(resolve(root, 'CLAUDE.md'))
const b = readFileSync(resolve(root, 'AGENTS.md'))
if (!a.equals(b)) {
  console.error(
    'AGENTS.md must be a byte-identical copy of CLAUDE.md: run `cp CLAUDE.md AGENTS.md` and stage both.'
  )
  process.exit(1)
}
