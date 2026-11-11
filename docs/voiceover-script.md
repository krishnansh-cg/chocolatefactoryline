# The Chocolate Factory Line — Voice-over Script

**Speaker:** Meera, the factory guide (only voice in the game).
**Voice:** ElevenLabs "Gudiya - Innocent Kid Narrator" (`e3FEEanj39p8QCSMe8iV`), model `eleven_multilingual_v2`, the same voice as The Great Chocolate Race. Every line the game plays was re-recorded in this voice on 2026-09-29; sources are in `audio-source-map.txt`. Recorded text matches the on-screen text word for word. Where a table below differs, the table at the end ("As recorded") is the source of truth.
**Pace:** Relaxed and clear. Short pause at each full stop. Smile in the voice. Never rushed, never babyish.
**Failure lines:** Calm and encouraging, never disappointed.
**Celebration lines:** Big energy, but still clear.

Each line has an ID. Use the ID as the audio filename (`vo_intro_02.mp3`), so the code can map lines to triggers.
Lines match the on-screen text closely, so captions and audio agree.

> Lines marked **NEW** or **RE-RECORD** were added or reworded for the SME pre-review fixes (2026-09-29).
> Lines marked **NEW 2026-09-30** were added or reworded for the SME major fixes (2026-09-30) and have no audio yet:
> the game shows their text and plays nothing until the files exist. The list is under "To record" at the end.
> Old files replaced by a `_v2` or `_v3` ID are no longer used.

---

## 1. Meera's story (intro slides)

One illustrated sentence per slide; NEXT waits for each line. Opens after START MISSION, and again from the HUD "Meera's message" button.

| ID | Slide | Line |
|---|---|---|
| `vo_story_01` **NEW** | 1 · chocolate, candle and cupcake lines | Hi, I'm Meera! I love making chocolates, candles and cupcakes on my factory line. |
| `vo_story_02` **NEW** | 2 · school mela | Our class stall at the school mela opens tomorrow. |
| `vo_story_03` **NEW** | 3 · station cards scattered in the factory | But last night, the steps on my chocolate line got mixed up! |
| `vo_story_04` **NEW** | 4 · empty stall | If we can't fix it, we'll have no chocolates to sell. |
| `vo_story_05` **NEW** | 5 · text only | Order matters every day. You put on socks before shoes! |
| `vo_story_06` **NEW** | 6 · wrapped bar at the factory | Our job: Put the steps back in order, so our chocolates are ready for the mela. |

> `vo_intro_01` and `vo_intro_02` (the single intro card) are no longer used.

## 2. Factory tour (tutorial)

Three stops only, so the child's first move comes quickly: where the material enters, how to move the cards, where to press Run.

| ID | Tour step | Line |
|---|---|---|
| `vo_tour_06` | Starting ingredient | Your starting material enters the factory line here. |
| `vo_tour_07` | Factory stations | Put these six stations in the right order. Drag, tap to swap, or use the arrows. |
| `vo_tour_11_v2` | Test your line | When your line looks right, press here to run it. |

**HUD tips (not in the tour).** The HUD controls explain themselves when tapped, in a small tip bubble:

| ID | Control | Line |
|---|---|---|
| `vo_tour_02_v2` | Clock (every tap, with voice) | This clock shows how long you have been working. There is no rush! |
| `vo_tour_03_v2` | Progress bar (every tap, with voice) | This bar shows how far you have come in the mission. |
| (text only) | Speaker (first tap) | Hear my last line again, or turn the sound off. |
| (text only) | i (first tap) | Station help: what each step does. |

> No longer used: `vo_tour_01`, `vo_tour_04_v2`, `vo_tour_05`, `vo_tour_08`, `vo_tour_09`, `vo_tour_10`. Meera's message button replays the story, so it needs no tip.

## 3. Shared gameplay lines (all three levels)

| ID | Plays when | Line |
|---|---|---|
| `vo_play_drag_01` | Drag demo, before first move | Drag a card to move it. |
| `vo_play_drag_02` | Drag demo, after first move | Put the steps in the order they happen. |
| `vo_play_run` | Player presses Run | Watch closely. Each station does its work before the product moves on. |
| `vo_play_fail` | Line stops at a wrong station (also the only line on unaided candle and cupcake tries) | Uh-oh, something is missing. Let's fix the order! |
| `vo_play_one_change` **NEW** | Chocolate, after Repair (once per level) | Change one step, then run the line to see what happens. |
| `vo_play_one_change_blocked` **NEW** | Chocolate, child tries a second change before running | Only one change at a time. Run the line to test it. |
| `vo_play_hint` | Direct hint shows (Chocolate after 2 fails; Candle and Cupcake from the 5th run, after 3 unaided tries) | Here's a clue. The message shows which step must come first. |

> `vo_play_show_order` is no longer used: the "Show correct order" button was removed so the candle and cupcake lines are solved by the child.

> Play `vo_play_fail` first, then the matching reason line from the level's table below.

## 4. Level 1 — Chocolate Factory

| ID | Plays when | Line |
|---|---|---|
| `vo_choc_start_v2` **RE-RECORD** | Chocolate level begins | Put the six steps in order, so our chocolates are ready for the mela. |

**Failure reasons** — what is missing at the station where the line stopped. Only true dependencies stop a station outright.
Temper is a quality step: untempered chocolate still pours, but the quality check stops it (panel title: "Quality check stopped Mould").

| ID | Stopped at | Missing | Line |
|---|---|---|---|
| `vo_choc_temper_melt` | Temper | Melt | The chocolate is still solid. |
| `vo_choc_mould_melt` | Mould | Melt | There is no melted chocolate to pour. |
| `vo_choc_mould_temper_v2` **NEW 2026-09-30** | Mould | Temper (quality) | It poured, but untempered chocolate sets dull and crumbly. |
| `vo_choc_cool_melt` | Cool | Melt | There is no melted chocolate to cool. |
| `vo_choc_cool_mould` | Cool, Unmould | Temper or Mould | The chocolate is not in the mould yet. |
| `vo_choc_unmould_melt` | Unmould | Melt | There is no chocolate to unmould yet. |
| `vo_choc_unmould_cool` | Unmould | Cool | The chocolate is still too soft to remove. |
| `vo_choc_wrap_melt` | Wrap | Melt | There is no chocolate bar to wrap yet. |
| `vo_choc_wrap_mould` | Wrap | Temper or Mould | There is no chocolate bar yet. |
| `vo_choc_wrap_cool` | Wrap | Cool | The chocolate is still soft in the mould. |
| `vo_choc_wrap_unmould` | Wrap | Unmould | The chocolate is still inside the mould. |

> No longer used: `vo_choc_mould_temper`, `vo_choc_cool_temper` ("…not tempered yet" said the line could not work, which is not true).

| ID | Plays when | Line |
|---|---|---|
| `vo_choc_success` | Chocolate celebration screen | Great job! The chocolate line is complete. Every station got exactly what it needed. |

## 5. Factory rule check (quiz)

| ID | Plays when | Line |
|---|---|---|
| `vo_rule_question` | Quiz screen opens, after the line broke at least once | Why does the order matter? Choose the idea that explains why the line broke. |
| `vo_rule_question_first_try` **NEW** | Quiz screen opens, chocolate line worked first time | Why does the order matter? Your line worked first time! Choose the idea that explains why order matters. |
| `vo_rule_wrong_any` **NEW** | Wrong answer: "Any order works…" | Not quite. All six steps can be there, and the line still stops. |
| `vo_rule_wrong_first` **NEW** | Wrong answer: "Only the first step matters…" | Not quite. A line can start right and still stop at a later station. |
| `vo_rule_correct_v2` **NEW 2026-09-30** | Correct answer (NEXT button waits for this line) | Correct! Each step needs something an earlier step made. That’s a dependency. |

| `vo_rule_wrong_v2` **NEW 2026-09-30** | Fallback for a wrong answer with no matching reply | Not quite. Think about what each station needs from an earlier station. |

> The rule is "Each step needs something an earlier step made", not "the step before it": Wrap needs the bar cooled (two steps earlier) as well as unmoulded. The same wording is on the correct-answer line and the finale.
> Answer options (shuffled on screen): "Each step needs something an earlier step made." · "Any order works, as long as all six steps happen." · "Only the first step matters; the rest can go anywhere."
> No longer used: `vo_rule_correct`, `vo_rule_wrong`.

## 6. Level 2 — Candle Factory

| ID | Plays when | Line |
|---|---|---|
| `vo_candle_start_v2` **RE-RECORD** | Candle level begins | Our stall needs candles too! Order the steps on your own, so we have candles to sell. |

> The first 3 candle and cupcake runs are unaided: no station and no reason, only `vo_play_fail`. The reason lines below play from the 4th run.

The candle line is Melt Wax, Place Wick, Pour into Mould, Cool, Unmould, Trim Wick. Add Scent was replaced: the wick has to be in the mould
before the wax is poured, and Trim Wick needs a wick to trim. Place Wick needs nothing before it, so "Place Wick, Melt Wax, Pour…" also works.

| ID | Stopped at | Missing | Line |
|---|---|---|---|
| `vo_candle_pour_meltWax` | Pour into Mould | Melt Wax | There is no melted wax to pour. |
| `vo_candle_pour_placeWick` **NEW 2026-09-30** | Pour into Mould | Place Wick | There is no wick in the mould for the wax to set around. |
| `vo_candle_coolWax_meltWax` | Cool | Melt Wax | There is no melted wax to cool. |
| `vo_candle_coolWax_pour` | Cool, Unmould | Place Wick or Pour | The wax is not in the mould yet. |
| `vo_candle_unmouldCandle_meltWax` | Unmould | Melt Wax | There is no candle to unmould yet. |
| `vo_candle_unmouldCandle_coolWax` | Unmould | Cool | The candle is still too soft to remove. |
| `vo_candle_trim_meltWax` | Trim Wick | Melt Wax | There is no candle to trim yet. |
| `vo_candle_trim_pour` | Trim Wick | Place Wick or Pour | There is no candle shape yet. |
| `vo_candle_trim_coolWax` | Trim Wick | Cool | The candle is still soft in the mould. |
| `vo_candle_trim_unmouldCandle` | Trim Wick | Unmould | The candle is still in the mould. |

> No longer used: every `vo_candle_*_addScent` line, and `vo_candle_addScent_meltWax`. Station sound `sfx_candle_addScent` is replaced by `sfx_candle_placeWick`.

| ID | Plays when | Line |
|---|---|---|
| `vo_candle_success` | Candle celebration screen | Great job! The candle line is complete. Every station got exactly what it needed. |

## 7. Level 3 — Cupcake Factory

| ID | Plays when | Line |
|---|---|---|
| `vo_cupcake_start_v2` **RE-RECORD** | Cupcake level begins | Last one! Order the cupcake steps on your own, so the stall has cupcakes too. |

Each line says what is missing at the station where the line stopped, not which step to do first.
Measure is a quality step: unmeasured ingredients still mix, but the quality check stops the batter.

| ID | Stopped at | Missing | Line |
|---|---|---|---|
| `vo_cupcake_mix_measure_v2` **NEW 2026-09-30** | Mix Batter | Measure (quality) | It mixed, but nothing was measured, so the batter is too runny. |
| `vo_cupcake_fill_mix_v3` **NEW 2026-09-30** | Fill Paper Cups | Measure or Mix | There is no batter to pour into the paper cups. |
| `vo_cupcake_bake_fill_v3` **NEW 2026-09-30** | Bake | Measure, Mix or Fill | The paper cups are empty. |
| `vo_cupcake_coolCupcake_bake_v2` **NEW 2026-09-30** | Cool | any earlier step | There are no baked cupcakes to cool. |
| `vo_cupcake_decorate_fill_v3` **NEW 2026-09-30** | Decorate | Measure, Mix or Fill | There are no cupcakes to decorate yet. |
| `vo_cupcake_decorate_bake_v3` **NEW 2026-09-30** | Decorate | Bake | The cupcakes are not baked yet. |
| `vo_cupcake_decorate_coolCupcake_v3` **NEW 2026-09-30** | Decorate | Cool | The cupcakes are still hot. The icing would melt. |

> No longer used: every earlier `vo_cupcake_*` reason line (they gave the order instead of what was missing, and some named the wrong station).

## 8. Finale

| ID | Plays when | Line |
|---|---|---|
| `vo_finale_alone_v2` **NEW 2026-09-30** | Mission complete, candle and cupcake solved with no clues | Great job! You’re a Sequence Engineer! You ordered the candle and cupcake lines with no clues! Each step needs something an earlier step made. That’s a dependency. Next time you get ready for school, spot the steps that must come first! Next, with your group, you'll design a new factory line and test it! |
| `vo_finale_helped_v2` **NEW 2026-09-30** | Mission complete, clues were used on candle or cupcake | Great job! You’re a Sequence Engineer! You finished all three lines. Some needed clues, and that’s okay! Each step needs something an earlier step made. That’s a dependency. Next time you get ready for school, spot the steps that must come first! Next, with your group, you'll design a new factory line and test it! |
| `vo_play_again` | Player presses PLAY AGAIN | Let's run the factory again! |

## 9. Fallback

| ID | Plays when | Line |
|---|---|---|
| `vo_fallback_fail` | Any failure without a matching reason line | This station can't work yet. An earlier step is missing. |

---

## Optional — Help panel ("What do the six steps mean?")

Record these only if the help panel should read steps aloud when tapped.

| ID | Step | Line |
|---|---|---|
| `vo_help_choc_melt` | Melt | Warm the solid chocolate until it is smooth and runny. |
| `vo_help_choc_temper` | Temper | Stir the melted chocolate at the right temperature so it turns shiny. |
| `vo_help_choc_mould` | Mould | Pour the prepared chocolate into the metal mould. |
| `vo_help_choc_cool` | Cool | Chill the filled mould until the chocolate turns firm. |
| `vo_help_choc_unmould` | Unmould | Gently lift the firm chocolate out of the mould. |
| `vo_help_choc_wrap` | Wrap | Wrap the finished chocolate to keep it safe. |
| `vo_help_candle_meltWax` | Melt Wax | Warm the solid wax until it turns liquid. |
| `vo_help_candle_placeWick` | Place Wick | Stand the wick up in the middle of the empty mould. |
| `vo_help_candle_pour` | Pour into Mould | Pour the melted wax into the mould, around the wick. |
| `vo_help_candle_coolWax` | Cool | Leave the filled mould until the wax turns firm. |
| `vo_help_candle_unmouldCandle` | Unmould | Gently lift the firm candle out of the mould. |
| `vo_help_candle_trim` | Trim Wick | Cut the wick to a short, neat length. |
| `vo_help_cupcake_measure` | Measure Ingredients | Measure the flour, sugar, milk, eggs and butter. |
| `vo_help_cupcake_mix` | Mix Batter | Mix the measured ingredients into a smooth batter. |
| `vo_help_cupcake_fill` | Fill Paper Cups | Pour the batter into the paper cups. |
| `vo_help_cupcake_bake` | Bake Cupcakes | Bake the filled paper cups until the cupcakes turn golden. |
| `vo_help_cupcake_coolCupcake` | Cool Cupcakes | Let the baked cupcakes cool on a rack. |
| `vo_help_cupcake_decorate` | Decorate | Add icing and sprinkles to the cooled cupcakes. |

---

**Total:** 61 lines the game plays, plus 18 optional help lines.


---

## Recorded for the SME major fixes (Gudiya, 2026-09-30)

Voice `e3FEEanj39p8QCSMe8iV`, model `eleven_multilingual_v2`, processed with `tools/process-audio.sh`. Text is exactly what the screen shows; sources are in `audio-source-map.txt`.

| ID | Line |
|---|---|
| `vo_choc_mould_temper_v2` | It poured, but untempered chocolate sets dull and crumbly. |
| `vo_candle_pour_placeWick` | There is no wick in the mould for the wax to set around. |
| `vo_cupcake_mix_measure_v2` | It mixed, but nothing was measured, so the batter is too runny. |
| `vo_cupcake_fill_mix_v3` | There is no batter to pour into the paper cups. |
| `vo_cupcake_bake_fill_v3` | The paper cups are empty. |
| `vo_cupcake_coolCupcake_bake_v2` | There are no baked cupcakes to cool. |
| `vo_cupcake_decorate_fill_v3` | There are no cupcakes to decorate yet. |
| `vo_cupcake_decorate_bake_v3` | The cupcakes are not baked yet. |
| `vo_cupcake_decorate_coolCupcake_v3` | The cupcakes are still hot. The icing would melt. |
| `vo_rule_correct_v2` | Correct! Each step needs something an earlier step made. That’s a dependency. |
| `vo_rule_wrong_v2` | Not quite. Think about what each station needs from an earlier station. |
| `vo_finale_alone_v2` | Great job! You’re a Sequence Engineer! You ordered the candle and cupcake lines with no clues! Each step needs something an earlier step made. That’s a dependency. Next time you get ready for school, spot the steps that must come first! Next, with your group, you’ll design a new factory line and test it! |
| `vo_finale_helped_v2` | Great job! You’re a Sequence Engineer! You finished all three lines. Some needed clues, and that’s okay! Each step needs something an earlier step made. That’s a dependency. Next time you get ready for school, spot the steps that must come first! Next, with your group, you’ll design a new factory line and test it! |

Sound effect: `sfx_candle_placeWick` (Place Wick station), prompt "A short soft thud of a cotton candle wick with a small metal tab being set down into an empty metal candle mould, gentle, clean, cartoon game foley, no music".

---

## As recorded (Gudiya, 2026-09-29)

> Lines marked "No longer used" in the sections above are still listed here, because their files are still in `audio/vo/`.

Every line the game plays, with the exact text of its audio file. Generated from the code, so it matches the screen.

| ID | Line |
|---|---|
| `vo_story_01` | Hi, I’m Meera! I love making chocolates, candles and cupcakes on my factory line. |
| `vo_story_02` | Our class stall at the school mela opens tomorrow. |
| `vo_story_03` | But last night, the steps on my chocolate line got mixed up! |
| `vo_story_04` | If we can’t fix it, we’ll have no chocolates to sell. |
| `vo_story_05` | Order matters every day. You put on socks before shoes! |
| `vo_story_06` | Our job: Put the steps back in order, so our chocolates are ready for the mela. |
| `vo_tour_01` | I’ll tell you what is happening on the factory line right here. |
| `vo_tour_02_v2` | This clock shows how long you have been working. There is no rush! |
| `vo_tour_03_v2` | This bar shows how far you have come in the mission. |
| `vo_tour_04_v2` | Tap here to hear my message about the mela again. |
| `vo_tour_05` | Tap the speaker to hear me again, or to turn sound off. Tap the i for station help. |
| `vo_tour_06` | Your starting material enters the factory line here. |
| `vo_tour_07` | Put these six stations in the right order. Drag, tap to swap, or use the arrows. |
| `vo_tour_08` | After the stations do their work, the finished product arrives here. |
| `vo_tour_09` | I’ll give you clues and feedback here as you work. |
| `vo_tour_10` | If a run goes wrong, a hint will appear to help you try again. |
| `vo_tour_11_v2` | When your line looks right, press here to run it. |
| `vo_choc_start_v2` | Put the six steps in order, so our chocolates are ready for the mela. |
| `vo_candle_start_v2` | Our stall needs candles too! Order the steps on your own, so we have candles to sell. |
| `vo_cupcake_start_v2` | Last one! Order the cupcake steps on your own, so the stall has cupcakes too. |
| `vo_play_one_change` | Change one step, then run the line to see what happens. |
| `vo_play_one_change_blocked` | Only one change at a time. Run the line to test it. |
| `vo_play_drag_01` | Drag a card to move it. |
| `vo_play_drag_02` | Put the steps in the order they happen. |
| `vo_play_run` | Watch closely. Each station works before the product moves on. |
| `vo_choc_temper_melt` | The chocolate is still solid. |
| `vo_choc_mould_melt` | There is no melted chocolate to pour. |
| `vo_choc_mould_temper` | The melted chocolate is not tempered yet. |
| `vo_choc_cool_melt` | There is no melted chocolate to cool. |
| `vo_choc_cool_temper` | The chocolate is not tempered yet. |
| `vo_choc_cool_mould` | The chocolate is not in the mould yet. |
| `vo_choc_unmould_melt` | There is no chocolate to unmould yet. |
| `vo_choc_unmould_cool` | The chocolate is still too soft to remove. |
| `vo_choc_wrap_melt` | There is no chocolate bar to wrap yet. |
| `vo_choc_wrap_mould` | There is no chocolate bar yet. |
| `vo_choc_wrap_cool` | The chocolate is still soft in the mould. |
| `vo_choc_wrap_unmould` | The chocolate is still inside the mould. |
| `vo_candle_addScent_meltWax` | The wax is still solid. |
| `vo_candle_pour_meltWax` | There is no melted wax to pour. |
| `vo_candle_pour_addScent` | The melted wax is not scented yet. |
| `vo_candle_coolWax_meltWax` | There is no melted wax to cool. |
| `vo_candle_coolWax_addScent` | The wax is not scented yet. |
| `vo_candle_coolWax_pour` | The wax is not in the mould yet. |
| `vo_candle_unmouldCandle_meltWax` | There is no candle to unmould yet. |
| `vo_candle_unmouldCandle_coolWax` | The candle is still too soft to remove. |
| `vo_candle_trim_meltWax` | There is no candle to trim yet. |
| `vo_candle_trim_pour` | There is no candle shape yet. |
| `vo_candle_trim_coolWax` | The candle is still soft in the mould. |
| `vo_candle_trim_unmouldCandle` | The candle is still in the mould. |
| `vo_cupcake_mix_measure` | Measure the ingredients before mixing the batter. |
| `vo_cupcake_fill_measure_v2` | Measure the ingredients before filling the paper cups. |
| `vo_cupcake_fill_mix_v2` | Mix the batter before filling the paper cups. |
| `vo_cupcake_bake_measure` | Measure the ingredients before baking. |
| `vo_cupcake_bake_mix` | Mix the batter before baking. |
| `vo_cupcake_bake_fill_v2` | The paper cups need batter before they go into the oven. |
| `vo_cupcake_coolCupcake_measure` | Measure the ingredients before baking cupcakes. |
| `vo_cupcake_coolCupcake_mix` | Mix the batter before baking cupcakes. |
| `vo_cupcake_coolCupcake_fill_v2` | Fill the paper cups before baking cupcakes. |
| `vo_cupcake_coolCupcake_bake` | Bake the cupcakes before cooling them. |
| `vo_cupcake_decorate_measure` | Measure the ingredients before making cupcakes. |
| `vo_cupcake_decorate_mix` | Mix the batter before making cupcakes. |
| `vo_cupcake_decorate_fill_v2` | Fill the paper cups before making cupcakes. |
| `vo_cupcake_decorate_bake_v2` | Bake the cupcakes before adding icing. |
| `vo_cupcake_decorate_coolCupcake_v2` | Let the cupcakes cool before adding icing. |
| `vo_play_fail` | Something is missing. Let’s fix the order! |
| `vo_play_hint` | Here’s a clue. The message shows which step must come first. |
| `vo_play_again` | Let’s run the factory again! |
| `vo_fallback_fail` | This station cannot work yet, because an earlier result is missing. |
| `vo_choc_success` | Great job! The chocolate line is complete. Every station got exactly what it needed. |
| `vo_candle_success` | Great job! The candle line is complete. Every station got exactly what it needed. |
| `vo_finale_alone` | Great job! You’re a Sequence Engineer! You ordered the candle and cupcake lines with no clues! Next time you get ready for school, spot the steps that must come first! Next, with your group, you’ll design a new factory line and test it! |
| `vo_finale_helped` | Great job! You’re a Sequence Engineer! You finished all three lines. Some needed clues, and that’s okay! Next time you get ready for school, spot the steps that must come first! Next, with your group, you’ll design a new factory line and test it! |
| `vo_rule_question` | Why does the order matter? Choose the idea that explains why the line broke. |
| `vo_rule_question_first_try` | Why does the order matter? Your line worked first time! Choose the idea that explains why order matters. |
| `vo_rule_wrong` | Not quite. Think about what each station receives from the station before it. |
| `vo_rule_wrong_any` | Not quite. All six steps can be there, and the line still stops. |
| `vo_rule_wrong_first` | Not quite. A line can start right and still stop at a later station. |
| `vo_rule_correct` | Correct! Each step depends on the step before it. That’s the dependency rule. |
