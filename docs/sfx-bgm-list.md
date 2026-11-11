# The Chocolate Factory Line — SFX & BGM List

**Sound style:** Bright, cartoon factory. Soft and rounded, never harsh. It must not scare or annoy a child who hears it 20 times.
**Current state:** The game has only 4 synth beeps (`move`, `station`, `error`, `success`) in `game-bundle.js` (`Od` / `AX`). Every file in this list replaces or adds to those beeps.
**Filenames:** Use the ID as the filename (`sfx_ui_click.mp3`). Then run `tools/process-audio.sh <folder>` and `node tools/build.mjs`; the game keeps each clip in `audio/embedded/`.

---

## 1. BGM (background music)

| ID | Plays on | Loop | Length | Mood / generation prompt |
|---|---|---|---|---|
| `bgm_title` | Title screen, Meera intro | Yes | 60–90 s | Cheerful, curious factory theme. Marimba, pizzicato strings, light glockenspiel, soft bouncy bass. Medium tempo, about 100 BPM. Feels like the start of a fun adventure. Instrumental, loopable. |
| `bgm_tour` | Factory tour (tutorial) | Yes | 60 s | The same theme, reduced to a calm version. Soft marimba and light pads only, no drums. Sits quietly under Meera's voice. |
| `bgm_level_chocolate` | Level 1 gameplay | Yes | 90–120 s | Playful, focused puzzle music. Warm and cosy. Marimba, clarinet, soft ticking percussion, gentle machine rhythm. About 95 BPM. Must not distract from thinking. |
| `bgm_level_candle` | Level 2 gameplay | Yes | 90–120 s | Same instruments as Level 1, but calmer and dreamier. Adds celesta and soft vibraphone. About 90 BPM. |
| `bgm_level_cupcake` | Level 3 gameplay | Yes | 90–120 s | Same family, but bouncier and sweeter. Adds ukulele and light hand claps. About 105 BPM. Feels like the final level. |
| `bgm_quiz` | Factory rule check | Yes | 45–60 s | Light, thoughtful "thinking" music. Soft plucks and a slow ticking clock feel. Quiet and calm. |
| `bgm_celebration` | Chocolate and candle celebration screens | Yes | 30–45 s | Happy, bright loop that plays after the win stinger. Upbeat marimba and brass, light drums. |
| `bgm_finale` | Mission complete screen | Yes | 45–60 s | The title theme as a full celebration: brass, strings, drums, glockenspiel. Proud and joyful. |

**Rules for BGM**
- Only one music track plays at a time. Crossfade tracks over about 800 ms when the screen changes.
- While a Meera line plays, duck the music to about 40% volume. Bring it back over 500 ms when she stops.
- When the line runs, lower the music a little (to about 70%) so the station sounds stand out.
- Music starts only after the first click (START MISSION). Browsers block audio before that.

---

## 2. SFX — UI and controls

| ID | Plays when | Length | Description / generation prompt |
|---|---|---|---|
| `sfx_ui_click` | Any normal button: NEXT, BACK, Repair, help | 0.1 s | Soft, rounded wooden button tap. Short and clean. *(Both generated takes came out silent, so this reuses the `sfx_card_arrow` tick.)* |
| `sfx_ui_start` | START MISSION, LET'S GO!, START PLAYING | 0.6 s | Bright, happy "whoosh-ding" that sounds like the adventure is starting. Replaces the current `success` beep on start. |
| `sfx_ui_panel_open` | Help panel or tour card opens | 0.3 s | Light paper swoosh with a soft chime. |
| `sfx_ui_panel_close` | Help panel closes, SKIP TOUR | 0.25 s | The same swoosh, reversed and softer. |
| `sfx_ui_toggle_sound` | Sound turned on | 0.2 s | Tiny two-note "blip-bloop" going up. |
| `sfx_tour_spotlight` | The tour spotlight moves to the next element | 0.3 s | Soft magical twinkle. |

## 3. SFX — Arranging the stations

| ID | Plays when | Length | Description / generation prompt |
|---|---|---|---|
| `sfx_card_pickup` | Player starts dragging a card, or selects a card to swap | 0.15 s | Light cardboard lift with a soft "pop". |
| `sfx_card_drop` | Card is dropped in a new position (replaces the `move` beep) | 0.2 s | Satisfying soft "thunk" of a card clicking into a slot. |
| `sfx_card_swap` | Two cards swap by tapping | 0.3 s | Quick double "whip-whip" slide. |
| `sfx_card_arrow` | Arrow button moves a card one place | 0.12 s | Tiny slide tick. |
| `sfx_card_invalid` | Player tries a move that is not allowed (for example, the first card up) | 0.2 s | Soft, low "bonk". Gentle, not harsh. |

## 4. SFX — Running the line

| ID | Plays when | Length | Description / generation prompt |
|---|---|---|---|
| `sfx_run_start` | Player presses Run | 1.0 s | Factory machine powering up: lever clunk, then a rising motor hum. |
| `sfx_conveyor_loop` | While the product moves between stations (loop) | 2–3 s loop | Gentle conveyor belt rolling with soft mechanical clicks. Quiet and even, loopable. |
| `sfx_station_pass` | A station finishes correctly (replaces the `station` beep) | 0.4 s | Bright, pleasing "ding" with a small mechanical click. |
| `sfx_station_fail` | The line stops at a wrong station (replaces the `error` beep) | 0.8 s | Machine sputters and slows down, then a soft cartoon "uh-oh" buzzer. Funny, not scary. |
| `sfx_line_stop` | The conveyor halts after a failure | 0.5 s | Belt grinding to a gentle stop with a hiss of steam. |
| `sfx_repair` | Player presses Repair | 0.5 s | Quick wrench ratchet and a small "ting". |
| `sfx_show_order` | Player presses Show correct order | 0.8 s | Magical sparkle sweep, like pieces falling into place. |

## 5. SFX — Station sounds (one per step)

Play these when the product reaches each station during a run, under `sfx_station_pass`. Keep each one under 1 second.

**Chocolate**

| ID | Station | Description / generation prompt |
|---|---|---|
| `sfx_choc_melt` | Melt | Warm bubbling of thick melting chocolate. |
| `sfx_choc_temper` | Temper | Spatula stirring thick liquid in a bowl. |
| `sfx_choc_mould` | Mould | Smooth, thick liquid pouring into a metal tray. |
| `sfx_choc_cool` | Cool | Cold fridge whoosh with a small frosty sparkle. |
| `sfx_choc_unmould` | Unmould | Tray tapped, then a satisfying "pop" as the bar comes out. |
| `sfx_choc_wrap` | Wrap | Foil and paper wrapper crinkling. |

**Candle**

| ID | Station | Description / generation prompt |
|---|---|---|
| `sfx_candle_meltWax` | Melt Wax | Soft, slow bubbling of melting wax. |
| `sfx_candle_addScent` | Add Scent | Small glass dropper drip, then a light sparkle. |
| `sfx_candle_pour` | Pour into Mould | Liquid pouring gently into a glass mould. |
| `sfx_candle_coolWax` | Cool | Soft, cool air whoosh. |
| `sfx_candle_unmouldCandle` | Unmould | Gentle wax "pop" out of a mould. |
| `sfx_candle_trim` | Trim Wick | Small, crisp scissor snip. |

**Cupcake**

| ID | Station | Description / generation prompt |
|---|---|---|
| `sfx_cupcake_measure` | Measure Ingredients | Flour poured into a measuring cup, with a spoon tap on the rim. |
| `sfx_cupcake_mix` | Mix Batter | Whisk beating batter in a bowl. |
| `sfx_cupcake_fill` | Fill Liners | Soft, thick batter plopping into paper cups. |
| `sfx_cupcake_bake` | Bake Cupcakes | Oven door closing, then a warm oven timer "ding". |
| `sfx_cupcake_coolCupcake` | Cool Cupcakes | Tray set on a metal rack, with a light breeze. |
| `sfx_cupcake_decorate` | Decorate | Frosting squeeze, then sprinkles pattering. |

## 6. SFX — Quiz and rewards

| ID | Plays when | Length | Description / generation prompt |
|---|---|---|---|
| `sfx_quiz_correct` | Correct quiz answer | 0.8 s | Happy rising three-note chime with a sparkle. |
| `sfx_quiz_wrong` | Wrong quiz answer | 0.5 s | Soft, gentle two-note "hmm" going down. Kind, not negative. |
| `sfx_line_complete` | Product arrives at the output bay after a correct run (replaces the `success` beep) | 1.2 s | Machine powers down happily, then a bright "ta-da" bell. |
| `sfx_win_stinger` | Chocolate or candle celebration screen opens | 2.5 s | Short victory fanfare: brass, glockenspiel, a small drum roll, then a crowd "yay". |
| `sfx_confetti` | Confetti falls on the celebration screens | 1.5 s | Party popper burst, then paper confetti fluttering. |
| `sfx_finale_stinger` | Mission complete screen opens | 4 s | Big, proud fanfare with cheering. Bigger than `sfx_win_stinger`. |
| `sfx_badge` | "You're a Sequence Engineer!" appears | 1.0 s | Shiny medal "shing" with a sparkle. |

---

## 7. Mixing and playback

| Layer | Volume (of max) | Notes |
|---|---|---|
| Voice-over | 100% | Always the loudest. Only one line at a time; a new line stops the old one. |
| SFX | 60–80% | The conveyor loop is lower, at about 35%. |
| BGM | 30–40% | Ducks to about 40% of its own level under VO. |

- **Mute button:** one mute button turns off voice, SFX and music together. The game already stores `muted` in the save state.
- **Format:** MP3 at 128 kbps for music, 96 kbps for SFX. Mono is fine for SFX. Target size: under 3 MB total for SFX and under 1.5 MB per music loop.
- **Preload:** load the UI and arranging SFX on the first click. Load each level's station sounds and music when that level opens.
- **Order of sounds on failure:** `sfx_station_fail`, then `sfx_line_stop`, then Meera's `vo_play_fail` and reason line (see `docs/voiceover-script.md`).

---

**Total:** 8 BGM tracks and 43 SFX.
