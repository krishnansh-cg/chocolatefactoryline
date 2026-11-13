# The Chocolate Factory Line

A Grade 4 self-paced SKAI Space mission (coding and algorithms: a sequence is a chain of dependencies).
Meera's school-mela stall needs chocolates, but the steps on her factory line got mixed up. The child
guesses the order, runs the line, fixes one step at a time, states the rule, then orders a candle line
and a cupcake line on their own. The group mission that follows is The Great Chocolate Race.

## Run it

- **From disk:** open `index.html` in a browser. No server or internet needed.
  Played start to finish in Chrome and Brave, both from disk and over http, on 2026-09-29. Safari: see below.
- **On the web or a USB stick:** run `node tools/package.mjs` and upload or copy `dist/` (15.7 MB). The same
  build works on any static host and opened straight from disk. `dist/` never contains `tools/`, `docs/`,
  this README or junk files. The whole folder, tools included, is 16.2 MB.

The title screen shows a loading bar in place of START MISSION until every picture and sound has been
fetched (about 30 s on a 4 Mbps connection, instant from disk), so nothing pops in or stutters later.

Every page load is a fresh mission: nothing is saved between loads, so the next child on a shared
computer starts from the title screen with sound on.

## What is in the folder

```text
chocolate-factory-line/
├── index.html          # The game. Styles, fonts and the game code are inside this file.
├── css/                # Intro and story slides, celebration screens, layout fixes
├── js/
│   ├── preloader.js    # Loading bar on the title screen; hands the sounds it fetched to the engine
│   ├── asset-manifest.js # Generated list of every picture and sound, with its size (build.mjs writes it)
│   ├── game-audio.js   # Sound engine: voice, effects, music, narration gate
│   └── meera-intro.js  # Title screen, Meera's story slides, factory tour
├── assets/
│   ├── ui/             # HUD frame, buttons, hint icon, title logo
│   ├── backgrounds/    # Title and factory backgrounds
│   ├── meera/          # Meera's poses
│   ├── intro/          # Story slide pictures
│   ├── game/           # Station cards and product art used by the game code
│   └── cupcake/        # Cupcake level art
├── audio/
│   └── embedded/       # Every voice (Gudiya), effect and music clip, once: Ogg Opus wrapped as <id>.ogg.js
├── docs/               # Voice-over script, audio source map, sound list
└── tools/              # Developer files (not needed to play)
    ├── game-bundle.js  # The game code (React, compiled). Edit this, then run build.mjs
    ├── build.mjs       # Writes js/asset-manifest.js, then inlines game-bundle.js into index.html
    ├── build-manifest.mjs
    ├── package.mjs     # Copies only what ships into dist/
    ├── process-audio.sh
    ├── encode-opus.sh  # Ogg Opus encoding (process-audio.sh calls it)
    └── embed-audio.mjs # Wraps .ogg files into audio/embedded/
```

## Editing

- **Game code or text:** edit `tools/game-bundle.js`, then run `node tools/build.mjs`.
  The original React source no longer exists (only an older version is in the git history, now in the archive), so the
  compiled bundle is the source of truth. Search for the on-screen text to find the code.
- **Story slides, tour text:** `js/meera-intro.js`.
- **Which voice line plays when:** `js/game-audio.js` (maps on-screen text to clip IDs).
- **Voice lines:** every line's exact text is in `docs/voiceover-script.md` ("As recorded").
  Voice is ElevenLabs "Gudiya" (`e3FEEanj39p8QCSMe8iV`, model `eleven_multilingual_v2`).
  If you change a line's text, regenerate its audio. Save each export as `<ID>.mp3` in a folder, then:

  ```bash
  tools/process-audio.sh <folder-with-exports>
  ```

  It trims silence, levels loudness (`loudnorm I=-16`), encodes Ogg Opus (`tools/encode-opus.sh`) and wraps each
  clip into `audio/embedded/<id>.ogg.js`, replacing any old copy. Then run `node tools/build.mjs` so the loading
  bar knows the new sizes. To add a ready-made `.ogg` by hand: `node tools/embed-audio.mjs <folder>`, then
  `node tools/build.mjs`. To remove a clip, delete its `.ogg.js` and run `node tools/build.mjs`.
  The base64 inside a wrapper is the exact `.ogg` file, so a clip can always be unwrapped again.
- **Pictures:** after adding, removing or re-encoding anything in `assets/`, run `node tools/build.mjs`.

## How it plays smoothly everywhere

- **Audio starts on the first tap.** Safari and Brave do not accept every event as a
  "user gesture", so the engine tries on each kind of first touch and retries until audio is running.
  On iPhone and iPad it plays through the silent switch.
- **Sound menu, as in The Great Chocolate Race.** The HUD speaker opens a menu with "Replay narration"
  (Meera repeats her last line) and "Mute all sounds" / "Turn sounds on". When sound is off, the speaker
  shows a crossed-out icon. Mute is never remembered between loads, because a hidden, remembered mute left
  later players with no sound (the Brave bug of 2026-09-29).
- **Low memory.** Voice and effects are decoded up front so they start instantly. Music is decoded
  only when its scene starts and released when the next track takes over. Decoding all eight tracks
  up front took about 200 MB of memory.
- **Offline.** The font (Chakra Petch, SIL Open Font License) is embedded in `index.html`; there are
  no requests to other sites.
- **Meera's voice leads.** Buttons that move the child on (Next, Run, Repair, answers) wait until Meera
  finishes her line. With sound off, blocked or missing, nothing waits. Nothing can hold a button forever
  either: the wait ends at the line's length plus a second even if the "ended" event never fires, and a
  sound file that stops arriving is abandoned after 12 s.
- **The loading bar never blocks.** Progress is weighed by real bytes and only moves forward. Title-screen
  pictures load first, then every other picture, then the sounds, smallest first within each, five at a time,
  so music comes last (at 4 Mbps: title art visible at 3.5 s, every picture in by 14 s, all done at 33 s).
  Pictures stay in the browser's image cache under the URL the game uses, so after the bar reaches 100% the
  game makes no network requests at all, even on a host that sends `Cache-Control: no-cache`.
- **A picture that fails to download gets one more try.** Browsers never retry a broken `<img>` by themselves,
  so `js/preloader.js` re-requests any picture on the page (the game's included) once, 1.5 s after it fails.
  A file that fails, stalls for 12 s or is refused (from disk the browser does not allow fetching) counts
  as done, and the game loads it the normal way later. If nothing arrives at all for 20 s, the button
  appears anyway. Sounds are handed straight to the audio engine, so nothing is downloaded twice.
- **One copy of every sound.** Each clip is stored once, as Ogg Opus wrapped in a small script
  (`audio/embedded/<id>.ogg.js`). Over http(s) the loading bar fetches it; opened from disk, where browsers
  block fetching, the engine loads it as a script. Chrome, Edge, Firefox, Android and Safari 18.4+ play it.
- **Older Safari plays silently.** Safari before 18.4 (iPads that cannot update to iPadOS 18.4, such as the
  6th-generation iPad from 2018 and older) cannot play Ogg Opus. Since 2026-10-01 there is no mp3 fallback
  (it doubled the folder's size), so there the game plays fully but without sound: nothing waits for a sound,
  and the loading bar skips the audio. The old mp3 copies are in the archive if that is ever needed again.

## Safari

The audio engine includes Safari-specific handling (every gesture type, resuming an interrupted context,
the iPhone silent switch). It has not been played through in Safari yet, because Safari can only be
automated after "Allow Remote Automation" is switched on in its Develop menu. The two older-Safari cases
(no Ogg support, and Ogg that plays but will not decode) were simulated in Chromium on 2026-10-01: the game
plays start to finish silently, with no errors and no voice-gated button left waiting.

## Tested (2026-11-13)

Headless Chromium (Playwright) against a server sending `Cache-Control: no-cache`: full play-through from the
title to the finale (24 screens, every level's failure, repair and success, a wrong and a right rule answer).
0 JavaScript errors, 0 console errors, 0 failed or 4xx/5xx requests, every visible picture decoded on every
screen, 104 clips decoded, 0 network requests after the loading bar reached 100%. Also: 4 Mbps / 150 ms
(bar 0 to 100% in 33 s, never backwards, START hidden until 100%); the first try at every third picture
failing plus a music file that never answers (button at 16 s, every picture recovered by the retry); opened
from disk (button at once, sound on). Compositing is light on every screen (at most two `will-change`
elements, no 3D transforms or flipped faces, 43 small confetti animations at most), so nothing is at risk of
the GPU dropping textures.

## Tested (2026-10-01)

Headless Chromium (Playwright), full play-through with sound on: loading bar, story, tour, every level's
failure and success, rule check, finale, PLAY AGAIN back to the title. 25 screens, 0 JavaScript errors,
0 failed requests, every image decoded, nothing downloaded twice, 103 clips decoded, sound reaching the
speakers. Repeated with a 4 Mbps / 150 ms connection, offline (only the local server reachable), with every
sound file broken, as an older Safari without Ogg Opus, with a third of the loading bar's picture fetches
failing and a music file never answering (button at 13 s, game unaffected), and opened from disk (sound on).
Also fixed on the way: repeated taps on LET'S GO kept the factory locked until the tapping stopped.

## What is deliberately not in this folder

Moved to `../chocolate-factory-line-archive/` (from 2026-09-29 on), not deleted:

- `git-history/`: this folder's `.git` (297 MB, mostly the old Vite project: `node_modules`, an old `dist/`
  and PNG art). Moved out on 2026-10-01 to bring the folder from 340 MB to 16 MB. To use git here again,
  move it back as `.git`.
- `audio-separate-files-2026-10-01/`: the loose `audio/vo`, `sfx`, `bgm` folders: the `.ogg` files (exact
  copies of what is now inside `audio/embedded/`) and the `.mp3` fallback copies for older Safari.

- `source-art/`: the original PNG renders (Meera's poses, cupcake art, backgrounds), 28 MB.
  The game uses WebP copies of these.
- `unused-assets/`: art and sound nothing references any more (an unused Meera pose, two old
  celebration pictures, the "Show correct order" sound). Added 2026-09-30: `audio-2026-09-30/`, the 31 voice
  and effect clips retired by the SME major fixes (Add Scent, the old cupcake lines, the cut tour stops),
  and `art-2026-09-30/`, the Add Scent card and the scented-wax picture. Added 2026-10-01: `art-2026-10-01/`,
  the four old "Coco" mascot pictures (283 KB). They were never shown, because `js/meera-intro.js` swapped them
  for Meera's poses, but the loading bar still downloaded them. The game bundle now points at Meera's poses directly.
- `build-history/`: the one-time scripts that turned the old build into this one (cupcake level,
  audio hooks, celebration screens, SME review fixes), plus the bundle from before the SME fixes,
  so `apply-sme-review-fixes.mjs` can still be re-run against it.

The previous Meera-voice recordings and all ElevenLabs exports are in `~/Desktop/skaispace/ai-vo/`
(file names in `docs/audio-source-map.txt`).

## Encoder settings, and what they were measured at

- **Pictures:** WebP. On 2026-09-30, 13 pictures with a same-size PNG in the archive were re-encoded from
  that PNG at `cwebp -q 82 -m 6 -alpha_q 100 -exact`: backgrounds, six cupcake pictures, the three
  "Meera holding" poses, the dull chocolate bar and the wick mould (2218 KB to 1784 KB). Compared with the PNG
  over white and black, RMSE rose by about 0.5 and the worst pixel stayed within a few levels of the old copy.
  A side-by-side of Meera's face at 1.5x showed no visible difference. `cupcake/finished.webp` was left as it
  was, because q82 put its worst pixel at 110/255.
- **Audio:** Opus in Ogg, constrained VBR, 48 kHz: voice 48 kbps mono, effects 64 kbps, music 80 kbps
  stereo, encoded from the original ElevenLabs exports. Each was smaller than the mp3 it replaced: in total
  voice 1777 to 1297 KB, effects 423 to 279 KB, music 6158 to 5198 KB, with lengths within 71 ms and loudness
  within 0.5 LU. Wrapped as base64 scripts they take 9.0 MB; most web hosts gzip them back to about the
  size of the .ogg files when sending.

## Savings left on the table, on purpose

- **Card and product art (`assets/game`, `assets/cupcake`) is 1254 px square but drawn at 66 to 322 px**
  (measured at 1920x1080). On 2026-10-01, 25 of them were rebuilt from their original PNGs at 2.5x their
  largest drawn size: 2.2 MB down to 0.4 to 1.1 MB depending on quality setting. Not applied, because Chromium
  drew every candidate slightly softer than today's files (visible at 3x zoom), even lossless ones. The PNGs
  are in the archive's `source-art/` and in `git-history/` (the old `dist/assets/`).
- **The seven other Meera poses** were resized from their PNGs when first converted, so there is no
  same-size source to re-encode from; re-encoding the WebP would add a second generation of artefacts.
  The same goes for the `embedded-*` card art, whose PNGs cannot be matched one to one.
- **The base64 wrapping costs 2.3 MB on disk** (9.0 MB of wrappers for 6.8 MB of Ogg). It is what lets
  sound work when `index.html` is opened from disk, where browsers refuse to fetch files.
- **Dead code inside the compiled bundle.** 29 KB of CSS for screens that no longer exist was removed
  (selectors checked against every class the markup and code use, then every screen pixel-compared with
  the version before). Dead JavaScript inside the minified React bundle was not chased: without the source,
  a cut there cannot be verified.
