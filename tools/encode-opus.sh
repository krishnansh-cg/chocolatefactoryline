#!/usr/bin/env bash
# Encodes raw ElevenLabs exports (named by audio ID) into the game's Ogg Opus clips: trims silence, levels loudness,
# and makes the music loop seamlessly. The clips are written to <out-folder>; process-audio.sh then wraps them into
# audio/embedded/ (tools/embed-audio.mjs), the only copy the game ships.
# Usage: tools/encode-opus.sh <raw-folder> <out-folder> [vo-kbps sfx-kbps bgm-kbps]
# Every .ogg must come out smaller than the export it came from; the script refuses to keep one that does not.
set -euo pipefail
shopt -s nullglob

RAW=${1:?raw folder required}
OUT=${2:?output folder required}
VO_K=${3:-48}
SFX_K=${4:-64}
BGM_K=${5:-80}
mkdir -p "$OUT"
TRIM='silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse'
OPUS=(-c:a libopus -vbr constrained -compression_level 10 -ar 48000)

cut_for() {
  case $1 in
    bgm_title) echo 72 ;; bgm_tour) echo 59 ;; bgm_level_chocolate) echo 98.5 ;; bgm_level_candle) echo 96.5 ;;
    bgm_level_cupcake) echo 93 ;; bgm_quiz) echo 46.5 ;; bgm_celebration) echo 39.5 ;; bgm_finale) echo 40 ;;
  esac
}
XF=2.5

keep_if_smaller() {
  local ogg=$1 src=$2
  if [ "$(stat -f%z "$ogg")" -ge "$(stat -f%z "$src")" ]; then
    echo "NOT SMALLER, removed: $(basename "$ogg") ($(stat -f%z "$ogg") >= $(stat -f%z "$src") bytes)" >&2
    rm "$ogg"
  fi
}

for file in "$RAW"/vo_*.mp3; do
  id=$(basename "$file" .mp3)
  ffmpeg -loglevel error -y -i "$file" -af "$TRIM,loudnorm=I=-16:TP=-1.5:LRA=11" -ac 1 "${OPUS[@]}" -application voip -b:a "${VO_K}k" "$OUT/$id.ogg"
  keep_if_smaller "$OUT/$id.ogg" "$file"
done

for file in "$RAW"/sfx_*.mp3; do
  id=$(basename "$file" .mp3)
  filters="$TRIM"
  [ "$id" = sfx_conveyor_loop ] && filters="anull"
  peak=$(ffmpeg -hide_banner -i "$file" -af "$filters,volumedetect" -f null - 2>&1 | sed -n 's/.*max_volume: \(-\{0,1\}[0-9.]*\) dB/\1/p')
  gain=$(echo "-1 - ($peak)" | bc -l)
  ffmpeg -loglevel error -y -i "$file" -af "$filters,volume=${gain}dB" "${OPUS[@]}" -application audio -b:a "${SFX_K}k" "$OUT/$id.ogg"
  keep_if_smaller "$OUT/$id.ogg" "$file"
done

for file in "$RAW"/bgm_*.mp3; do
  id=$(basename "$file" .mp3)
  cut=$(cut_for "$id")
  ffmpeg -loglevel error -y -i "$file" -i "$file" -filter_complex \
    "[0:a]atrim=$XF:$cut,asetpts=PTS-STARTPTS[body];[1:a]atrim=0:$XF,asetpts=PTS-STARTPTS[head];[body][head]acrossfade=d=$XF:c1=qsin:c2=qsin,loudnorm=I=-16:TP=-1.5:LRA=11[out]" \
    -map "[out]" "${OPUS[@]}" -application audio -b:a "${BGM_K}k" "$OUT/$id.ogg"
  keep_if_smaller "$OUT/$id.ogg" "$file"
done
