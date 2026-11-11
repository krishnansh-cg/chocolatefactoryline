import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Every sound ships once, as Ogg Opus wrapped in a tiny script: audio/embedded/<id>.ogg.js.
// Over http(s) the loading bar fetches the wrapper; opened straight from disk (file://), where browsers block fetch(),
// game-audio.js loads it as a <script>. The base64 inside is the exact .ogg file, so nothing is lost by wrapping.
// Usage: node tools/embed-audio.mjs <folder-with-ogg-files>   (adds or replaces those clips; process-audio.sh runs it)
// Then run node tools/build.mjs so the loading bar knows the new sizes.
const from = process.argv[2]
if (!from) throw new Error('Usage: node tools/embed-audio.mjs <folder-with-ogg-files>')
const outDir = fileURLToPath(new URL('../audio/embedded', import.meta.url))
mkdirSync(outDir, { recursive: true })

let count = 0
let bytes = 0
for (const file of readdirSync(resolve(from)).filter((name) => name.endsWith('.ogg'))) {
  const data = readFileSync(resolve(from, file)).toString('base64')
  const script = `(window.FactoryAudioData=window.FactoryAudioData||{})[${JSON.stringify(basename(file))}]="${data}";\n`
  writeFileSync(resolve(outDir, `${file}.js`), script)
  count += 1
  bytes += script.length
}
console.log(`Wrapped ${count} clips into audio/embedded (${(bytes / 1048576).toFixed(2)} MB).`)
