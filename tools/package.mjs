import { cpSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Copies only what the game needs into dist/, ready to upload to any static host or to copy onto a USB stick:
// the same build works over http(s) and opened straight from disk.
//   node tools/package.mjs
// Never shipped: tools/, docs/, README.md, .claude/, .git*, and junk like .DS_Store.
const root = fileURLToPath(new URL('..', import.meta.url))
const out = join(root, 'dist')
rmSync(out, { recursive: true, force: true })
mkdirSync(out)

const junk = (name) => name === '.DS_Store' || name.startsWith('._') || name.endsWith('~') || name.endsWith('.bak')
const copy = (path) => cpSync(join(root, path), join(out, path), { recursive: true, filter: (src) => !junk(src.split(/[\\/]/).pop()) })

copy('index.html')
copy('css')
copy('js')
copy('assets')
copy('audio/embedded')

const sizeOf = (dir) => readdirSync(dir, { withFileTypes: true })
  .reduce((sum, e) => sum + (e.isDirectory() ? sizeOf(join(dir, e.name)) : statSync(join(dir, e.name)).size), 0)
const mb = (n) => `${(n / 1048576).toFixed(2)} MB`
console.log(`dist/: ${mb(sizeOf(out))}`)
for (const part of ['index.html', 'css', 'js', 'assets', 'audio']) {
  const p = join(out, part)
  console.log(`  ${part.padEnd(10)} ${mb(statSync(p).isDirectory() ? sizeOf(p) : statSync(p).size)}`)
}
