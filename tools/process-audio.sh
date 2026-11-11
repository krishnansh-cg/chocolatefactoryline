#!/usr/bin/env bash
# Turns raw ElevenLabs exports (named by audio ID, e.g. vo_story_01.mp3) into the game's sounds:
# Ogg Opus clips (tools/encode-opus.sh), wrapped into audio/embedded/<id>.ogg.js (tools/embed-audio.mjs).
# Usage: tools/process-audio.sh <raw-folder>   then: node tools/build.mjs
# The folder may hold any mix of vo_*, sfx_* and bgm_* files. Clips not in the folder are left as they are.
set -euo pipefail

RAW=${1:?raw folder required}
TOOLS=$(cd "$(dirname "$0")" && pwd)
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

"$TOOLS/encode-opus.sh" "$RAW" "$WORK"
node "$TOOLS/embed-audio.mjs" "$WORK"
echo "Clips in the game: $(ls "$TOOLS/../audio/embedded" | grep -c '\.ogg\.js$')"
