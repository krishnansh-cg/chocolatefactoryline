import { readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

// Inlines tools/game-bundle.js into index.html as the game's module script.
// The bundle is inlined, not linked, because browsers refuse module scripts from file:// pages,
// and the game must run when opened straight from disk.
// Usage: node tools/build.mjs
// It first regenerates js/asset-manifest.js (the loading bar's file list) from the files on disk.
await import('./build-manifest.mjs')
const root = new URL('..', import.meta.url)
const htmlPath = fileURLToPath(new URL('index.html', root))
const bundle = readFileSync(fileURLToPath(new URL('tools/game-bundle.js', root)), 'utf8')
// The manifest's query string is its content hash, so a browser never keeps a stale file list after a redeploy.
const manifestHash = createHash('sha1').update(readFileSync(fileURLToPath(new URL('js/asset-manifest.js', root)))).digest('hex').slice(0, 8)
const html = readFileSync(htmlPath, 'utf8').replace(/asset-manifest\.js\?v=[\w]+/, `asset-manifest.js?v=${manifestHash}`)

const openTag = '<script id="factoryGameBundle" type="module">'
const start = html.indexOf(openTag)
const end = html.indexOf('</script>', start)
if (start < 0 || end < 0) throw new Error('index.html has no factoryGameBundle script to fill.')
if (bundle.includes('</script>')) throw new Error('The bundle must not contain a closing script tag.')

writeFileSync(htmlPath, html.slice(0, start + openTag.length) + bundle + html.slice(end))
console.log(`Inlined ${(bundle.length / 1024).toFixed(0)} KiB game bundle into index.html (${(Buffer.byteLength(readFileSync(htmlPath)) / 1024).toFixed(0)} KiB total).`)
