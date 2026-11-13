(() => {
  // Mixer levels. Meera's voice always wins: while she speaks, music and effects duck automatically.
  const LEVEL = { vo: 1, sfx: 0.7, bgm: 0.32 };
  const DUCK = { bgm: 0.3, sfx: 0.45 };
  const RUNNING_BGM = 0.7;
  const DUCK_ATTACK = 0.06;
  const DUCK_RELEASE = 0.35;
  const DUCK_HOLD_MS = 280;
  const CROSSFADE = 0.8;
  const SFX_GAIN = {
    sfx_conveyor_loop: 0.4,
    sfx_ui_click: 0.55,
    sfx_card_arrow: 0.55,
    sfx_card_pickup: 0.6,
    sfx_card_drop: 0.7,
    sfx_tour_spotlight: 0.5,
    sfx_station_pass: 0.6,
    sfx_confetti: 0.6,
  };
  const STATION_GAIN = 0.75;
  // Meera's story at the start: one line per slide (data-beat on #meeraIntroduction).
  const STORY_VO = ['vo_story_01', 'vo_story_02', 'vo_story_03', 'vo_story_04', 'vo_story_05', 'vo_story_06'];

  const TOUR_VO = {
    'Starting ingredient': 'vo_tour_06',
    'Factory stations': 'vo_tour_07',
    'Test your line': 'vo_tour_11_v2',
  };
  // Tapping the HUD clock or progress bar (index.html) plays these.
  const HUD_TIP_VO = ['vo_tour_02_v2', 'vo_tour_03_v2'];

  // Meera's speech bubble on the factory screen. `once` lines play a single time per level visit.
  const BUBBLE_VO = {
    'Put the six steps in order, so our chocolates are ready for the mela.': { id: 'vo_choc_start_v2', once: 'start:chocolate' },
    'Our stall needs candles too! Order the steps on your own, so we have candles to sell.': { id: 'vo_candle_start_v2', once: 'start:candle' },
    'Last one! Order the cupcake steps on your own, so the stall has cupcakes too.': { id: 'vo_cupcake_start_v2', once: 'start:cupcake' },
    'Change one step, then run the line to see what happens.': { id: 'vo_play_one_change', once: 'one-change' },
    'Only one change at a time. Run the line to test it.': { id: 'vo_play_one_change_blocked' },
    'Drag a card to move it.': { id: 'vo_play_drag_01', once: 'drag:1' },
    'Put the steps in the order they happen.': { id: 'vo_play_drag_02', once: 'drag:2' },
    'Watch closely. Each station works before the product moves on.': { id: 'vo_play_run', once: 'run' },
  };

  // Failure reasons exactly as the feedback panel shows them.
  const REASON_VO = {
    'The chocolate is still solid.': 'vo_choc_temper_melt',
    'There is no melted chocolate to pour.': 'vo_choc_mould_melt',
    'It poured, but untempered chocolate sets dull and crumbly.': 'vo_choc_mould_temper_v2',
    'There is no melted chocolate to cool.': 'vo_choc_cool_melt',
    'The chocolate is not in the mould yet.': 'vo_choc_cool_mould',
    'There is no chocolate to unmould yet.': 'vo_choc_unmould_melt',
    'The chocolate is still too soft to remove.': 'vo_choc_unmould_cool',
    'There is no chocolate bar to wrap yet.': 'vo_choc_wrap_melt',
    'There is no chocolate bar yet.': 'vo_choc_wrap_mould',
    'The chocolate is still soft in the mould.': 'vo_choc_wrap_cool',
    'The chocolate is still inside the mould.': 'vo_choc_wrap_unmould',
    'There is no melted wax to pour.': 'vo_candle_pour_meltWax',
    'There is no wick in the mould for the wax to set around.': 'vo_candle_pour_placeWick',
    'There is no melted wax to cool.': 'vo_candle_coolWax_meltWax',
    'The wax is not in the mould yet.': 'vo_candle_coolWax_pour',
    'There is no candle to unmould yet.': 'vo_candle_unmouldCandle_meltWax',
    'The candle is still too soft to remove.': 'vo_candle_unmouldCandle_coolWax',
    'There is no candle to trim yet.': 'vo_candle_trim_meltWax',
    'There is no candle shape yet.': 'vo_candle_trim_pour',
    'The candle is still soft in the mould.': 'vo_candle_trim_coolWax',
    'The candle is still in the mould.': 'vo_candle_trim_unmouldCandle',
    'It mixed, but nothing was measured, so the batter is too runny.': 'vo_cupcake_mix_measure_v2',
    'There is no batter to pour into the paper cups.': 'vo_cupcake_fill_mix_v3',
    'The paper cups are empty.': 'vo_cupcake_bake_fill_v3',
    'There are no baked cupcakes to cool.': 'vo_cupcake_coolCupcake_bake_v2',
    'There are no cupcakes to decorate yet.': 'vo_cupcake_decorate_fill_v3',
    'The cupcakes are not baked yet.': 'vo_cupcake_decorate_bake_v3',
    'The cupcakes are still hot. The icing would melt.': 'vo_cupcake_decorate_coolCupcake_v3',
  };

  // Rule check: each wrong answer has its own reply.
  const RULE_WRONG_VO = { anyOrder: 'vo_rule_wrong_any', firstOnly: 'vo_rule_wrong_first' };

  const SCENE_BGM = {
    landing: 'bgm_title',
    intro: 'bgm_title',
    title: 'bgm_title',
    tour: 'bgm_tour',
    'level-chocolate': 'bgm_level_chocolate',
    'level-candle': 'bgm_level_candle',
    'level-cupcake': 'bgm_level_cupcake',
    quiz: 'bgm_quiz',
    celebrate: 'bgm_celebration',
    finale: 'bgm_finale',
  };
  const STATION_PREFIX = { chocolate: 'sfx_choc_', candle: 'sfx_candle_', cupcake: 'sfx_cupcake_' };

  const ALL_IDS = [
    ...STORY_VO, ...Object.values(TOUR_VO), ...HUD_TIP_VO, ...Object.values(BUBBLE_VO).map((line) => line.id),
    'vo_play_fail', 'vo_play_hint', 'vo_play_again', 'vo_fallback_fail',
    'vo_choc_success', 'vo_candle_success', 'vo_finale_alone_v2', 'vo_finale_helped_v2',
    'vo_rule_question', 'vo_rule_question_first_try', 'vo_rule_wrong_v2', ...Object.values(RULE_WRONG_VO), 'vo_rule_correct_v2',
    ...new Set(Object.values(REASON_VO)),
    'sfx_ui_click', 'sfx_ui_start', 'sfx_ui_panel_open', 'sfx_ui_panel_close', 'sfx_ui_toggle_sound', 'sfx_tour_spotlight',
    'sfx_card_pickup', 'sfx_card_drop', 'sfx_card_swap', 'sfx_card_arrow', 'sfx_card_invalid',
    'sfx_run_start', 'sfx_conveyor_loop', 'sfx_station_pass', 'sfx_station_fail', 'sfx_line_stop', 'sfx_repair',
    'sfx_choc_melt', 'sfx_choc_temper', 'sfx_choc_mould', 'sfx_choc_cool', 'sfx_choc_unmould', 'sfx_choc_wrap',
    'sfx_candle_meltWax', 'sfx_candle_placeWick', 'sfx_candle_pour', 'sfx_candle_coolWax', 'sfx_candle_unmouldCandle', 'sfx_candle_trim',
    'sfx_cupcake_measure', 'sfx_cupcake_mix', 'sfx_cupcake_fill', 'sfx_cupcake_bake', 'sfx_cupcake_coolCupcake', 'sfx_cupcake_decorate',
    'sfx_quiz_correct', 'sfx_quiz_wrong', 'sfx_line_complete', 'sfx_win_stinger', 'sfx_confetti', 'sfx_finale_stinger', 'sfx_badge',
    ...new Set(Object.values(SCENE_BGM)),
  ];
  const EARLY_IDS = ['vo_story_01', 'bgm_title', 'sfx_ui_start', 'sfx_ui_click'];

  const busFor = (id) => id.split('_')[0];
  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  // ---------------------------------------------------------------------------
  // Mixer: every sound goes source -> gain -> bus (vo | sfx | bgm) -> duck -> master.
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    window.FactoryAudio = { gameSound() {}, say() {}, stopVoice() {}, sfx() {}, setMuted() {}, isMuted: () => true, replayNarration() {}, canReplay: () => false };
    return;
  }
  let unlocked = false;
  // Every load starts with sound on: a new child is playing, and the HUD art cannot show a remembered mute.
  let muted = false;
  // iPhone and iPad: play through the silent switch, like a video would, instead of as a ringer-style sound.
  if (navigator.audioSession) {
    try {
      navigator.audioSession.type = 'playback';
    } catch {
      // Older Safari: the default session type is used.
    }
  }

  // Safari only lets audio start if the AudioContext is created inside the player's first tap,
  // so the whole graph is built there (see unlock) rather than when the page loads.
  let ctx = null;
  let master, duckNodes, buses;
  const createGraph = () => {
    ctx = new AudioContextClass();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
    duckNodes = { bgm: ctx.createGain(), sfx: ctx.createGain() };
    buses = { vo: ctx.createGain(), sfx: ctx.createGain(), bgm: ctx.createGain() };
    buses.vo.gain.value = LEVEL.vo;
    buses.sfx.gain.value = LEVEL.sfx;
    buses.bgm.gain.value = LEVEL.bgm;
    buses.vo.connect(master);
    buses.sfx.connect(duckNodes.sfx).connect(master);
    buses.bgm.connect(duckNodes.bgm).connect(master);
  };

  const rampParam = (param, value, timeConstant) => {
    if (!ctx) return;
    param.cancelScheduledValues(ctx.currentTime);
    param.setTargetAtTime(value, ctx.currentTime, timeConstant);
  };

  const setLevels = (targets, timeConstant) => {
    if (!ctx) return;
    if ('duckBgm' in targets) rampParam(duckNodes.bgm.gain, targets.duckBgm, timeConstant);
    if ('duckSfx' in targets) rampParam(duckNodes.sfx.gain, targets.duckSfx, timeConstant);
    if ('scene' in targets) rampParam(buses.bgm.gain, LEVEL.bgm * targets.scene, timeConstant);
  };

  // Every sound is stored once, as Ogg Opus wrapped in a small script (audio/embedded/<id>.ogg.js), so the same
  // file works over http(s) and when index.html is opened straight from disk.
  // Ogg Opus plays in Chrome, Edge, Firefox, Android and Safari 18.4+. Older Safari cannot decode it: there the game
  // runs silently, and nothing waits for a sound that will never play.
  const canPlayOgg = (() => {
    try {
      return !!new Audio().canPlayType('audio/ogg; codecs="opus"');
    } catch {
      return false;
    }
  })();
  if (!canPlayOgg) console.info('[audio] this browser cannot play Ogg Opus; the game runs without sound');
  const urlFor = (id) => `./audio/embedded/${id}.ogg.js`;

  const base64ToBytes = (base64) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  };
  // A wrapper file reads: (window.FactoryAudioData=...)["<id>.ogg"]="<base64>";
  const wrapperToBytes = (buffer) => {
    const text = new TextDecoder().decode(buffer);
    const start = text.indexOf(']="');
    const end = text.lastIndexOf('"');
    if (start < 0 || end <= start + 3) throw new Error('not an audio wrapper');
    return base64ToBytes(text.slice(start + 3, end));
  };

  // A fetch that stops receiving data is abandoned, so a stalled file can never hold up Meera's voice queue.
  const STALL_MS = 12000;
  const fetchBytes = (url) => {
    const controller = new AbortController();
    let timer = window.setTimeout(() => controller.abort(), STALL_MS);
    return fetch(url, { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error(`${response.status} ${url}`);
      if (!response.body) return response.arrayBuffer();
      const reader = response.body.getReader();
      const chunks = [];
      let size = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        size += value.length;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => controller.abort(), STALL_MS);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
      }
      return bytes.buffer;
    }).finally(() => window.clearTimeout(timer));
  };

  // Over http(s) the wrapper is fetched, or handed over by the loading bar if it already has it.
  // Opened straight from disk, fetch() is blocked, so the wrapper is loaded as a script instead.
  const fromDisk = location.protocol === 'file:';
  const readBytes = (id) => {
    if (!canPlayOgg) return Promise.reject(new Error('no Ogg Opus support'));
    if (!fromDisk) {
      const url = urlFor(id);
      const preloaded = window.FactoryPreload && window.FactoryPreload.bytes(url);
      return (preloaded || Promise.resolve(null)).then((data) => data || fetchBytes(url)).then(wrapperToBytes);
    }
    const key = `${id}.ogg`;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = urlFor(id);
      script.onload = () => {
        script.remove();
        const store = window.FactoryAudioData || {};
        const base64 = store[key];
        delete store[key];
        if (!base64) return reject(new Error(`empty ${key}`));
        resolve(base64ToBytes(base64));
      };
      script.onerror = () => {
        script.remove();
        reject(new Error(`missing ${key}`));
      };
      document.head.appendChild(script);
    });
  };

  // Callback form for older Safari; newer browsers also return a promise, which is silenced so a failure is reported once.
  const decode = (data) => new Promise((resolve, reject) => {
    const result = ctx.decodeAudioData(data, resolve, reject);
    if (result && result.catch) result.catch(() => {});
  });

  // Raw bytes can be read before the first tap; decoding needs the AudioContext.
  const pendingBytes = new Map(); // id -> Promise<ArrayBuffer>
  const prefetch = (id) => {
    if (pendingBytes.has(id) || buffers.has(id)) return;
    const bytes = readBytes(id);
    bytes.catch(() => {}); // load() reports the failure; this only silences the unhandled rejection.
    pendingBytes.set(id, bytes);
  };
  const buffers = new Map();
  const load = (id) => {
    if (!buffers.has(id)) {
      const bytes = pendingBytes.get(id) || readBytes(id);
      pendingBytes.delete(id);
      buffers.set(id, bytes
        .then(decode)
        .catch((error) => {
          if (canPlayOgg) console.warn('[audio] could not load', id, error);
          return null;
        }));
    }
    return buffers.get(id);
  };

  // Voice and effects are decoded up front so they start instantly. Music is not: decoded, the eight
  // stereo tracks take about 200 MB, which stalls school laptops and iPads. Each track is decoded when
  // its scene starts and released when the next one takes over (see setMusic).
  const preloadAll = async () => {
    const queue = ALL_IDS.filter((id, index) => ALL_IDS.indexOf(id) === index && busFor(id) !== 'bgm');
    const worker = async () => {
      while (queue.length) await load(queue.shift());
    };
    await Promise.all([worker(), worker(), worker()]);
  };

  // Plays one file on its bus and returns a handle, or null if it could not play.
  async function play(id, { loop = false, gain = 1, fadeIn = 0, maxDelayMs = Infinity } = {}) {
    if (!unlocked || muted) return null;
    // Safari can leave the context 'suspended' or 'interrupted' (another tab, a call, a locked screen).
    if (ctx.state !== 'running') ctx.resume().catch(() => {});
    const requestedAt = performance.now();
    const buffer = await load(id);
    if (!buffer || performance.now() - requestedAt > maxDelayMs || muted) return null;
    const source = ctx.createBufferSource();
    const node = ctx.createGain();
    source.buffer = buffer;
    source.loop = loop;
    node.gain.value = fadeIn ? 0.0001 : gain;
    if (fadeIn) node.gain.setTargetAtTime(gain, ctx.currentTime, fadeIn / 3);
    source.connect(node).connect(buses[busFor(id)]);
    const handle = {
      id,
      duration: buffer.duration,
      ended: new Promise((resolve) => { source.onended = resolve; }),
      stop(fadeOut = 0) {
        if (handle.stopped) return;
        handle.stopped = true;
        if (fadeOut) {
          rampParam(node.gain, 0.0001, fadeOut / 3);
          source.stop(ctx.currentTime + fadeOut);
        } else {
          source.stop();
        }
      },
    };
    source.start();
    return handle;
  }

  // ---------------------------------------------------------------------------
  // Sound effects
  const sfx = (id, options = {}) => {
    const gain = options.gain ?? SFX_GAIN[id] ?? 1;
    return play(id, { maxDelayMs: 350, ...options, gain });
  };
  const sfxLater = (id, ms, options) => window.setTimeout(() => sfx(id, options), ms);

  let conveyor = null;
  let conveyorToken = 0;
  const startConveyor = async (delayMs) => {
    const token = ++conveyorToken;
    await wait(delayMs);
    if (token !== conveyorToken) return;
    const handle = await play('sfx_conveyor_loop', { loop: true, gain: SFX_GAIN.sfx_conveyor_loop, fadeIn: 0.4 });
    if (token !== conveyorToken) handle?.stop(0.2);
    else conveyor = handle;
  };
  const stopConveyor = () => {
    conveyorToken += 1;
    conveyor?.stop(0.35);
    conveyor = null;
  };

  // ---------------------------------------------------------------------------
  // Meera's turn: while she speaks, or is about to, the buttons that move the child on wait for her.
  // No sound (muted, blocked or missing file) means no wait, so the game never gets stuck.
  const GATED = '.run-button, .feedback-actions .primary-button, .rule-option, .rule-next-button, .celebration-page__button, .meera-introduction__continue, .factory-tutorial__next, .sequence-list';
  let gateTimer = 0;
  let pendingSays = 0;
  const setGate = (on, maxMs = 0) => {
    window.clearTimeout(gateTimer);
    document.documentElement.classList.toggle('meera-speaking', on);
    // Fallback: never hold the child longer than the line itself, even if 'ended' never fires.
    if (on) gateTimer = window.setTimeout(() => setGate(false), maxMs);
  };
  const releaseGate = () => {
    if (!voBusy && !pendingSays) setGate(false);
  };
  document.addEventListener('click', (event) => {
    if (!document.documentElement.classList.contains('meera-speaking')) return;
    if (!(event.target instanceof Element) || !event.target.closest(GATED)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  // ---------------------------------------------------------------------------
  // Voice-over: one line at a time, queued in order. Ducks music and effects while it plays.
  let voQueue = [];
  let voCurrent = null;
  let voBusy = false;
  let voGeneration = 0;
  let releaseTimer = 0;

  const duck = () => {
    window.clearTimeout(releaseTimer);
    setLevels({ duckBgm: DUCK.bgm, duckSfx: DUCK.sfx }, DUCK_ATTACK);
  };
  const scheduleRelease = () => {
    window.clearTimeout(releaseTimer);
    releaseTimer = window.setTimeout(() => {
      if (!voBusy) setLevels({ duckBgm: 1, duckSfx: 1 }, DUCK_RELEASE);
    }, DUCK_HOLD_MS);
  };

  const pumpVO = async () => {
    if (voBusy) return;
    voBusy = true;
    const generation = voGeneration;
    while (voQueue.length && generation === voGeneration) {
      const id = voQueue.shift();
      duck();
      const handle = await play(id);
      if (generation !== voGeneration) {
        handle?.stop();
        break;
      }
      if (!handle) continue;
      setGate(true, handle.duration * 1000 + 1000);
      voCurrent = handle;
      // 'ended' can fail to fire (Safari with a suspended or interrupted context); never let the queue wait forever.
      await Promise.race([handle.ended, wait(handle.duration * 1000 + 2500)]);
      if (voCurrent === handle) voCurrent = null;
    }
    if (generation === voGeneration) {
      voBusy = false;
      scheduleRelease();
      releaseGate();
    }
  };

  // mode: 'queue' waits for Meera to finish; 'replace' cuts her off and starts fresh.
  // The last thing Meera said, for "Replay narration" in the HUD sound menu.
  let lastLines = [];
  const say = (ids, mode = 'replace') => {
    const list = (Array.isArray(ids) ? ids : [ids]).filter(Boolean);
    if (!list.length || !unlocked || muted) return void releaseGate();
    lastLines = list;
    if (mode === 'replace') stopVoice();
    voQueue.push(...list);
    pumpVO();
  };
  // `ids` may be a function, read when the line is due, for lines that depend on what is on screen by then.
  const sayLater = (ids, ms, mode) => {
    const generation = voGeneration;
    if (unlocked && !muted) {
      pendingSays += 1;
      setGate(true, ms + 1500);
    }
    window.setTimeout(() => {
      if (pendingSays) pendingSays -= 1;
      if (generation === voGeneration) say(typeof ids === 'function' ? ids() : ids, mode);
      else releaseGate();
    }, ms);
  };
  function stopVoice() {
    voGeneration += 1;
    voQueue = [];
    voCurrent?.stop(0.08);
    voCurrent = null;
    voBusy = false;
    scheduleRelease();
    releaseGate();
  }

  // ---------------------------------------------------------------------------
  // Music: one looping track per scene, crossfaded.
  let bgmWanted = null;
  let bgmPlaying = null;
  let bgmHandle = null;
  let bgmToken = 0;
  const setMusic = async (id) => {
    bgmWanted = id;
    if (!unlocked || muted || id === bgmPlaying) return;
    const token = ++bgmToken;
    const previous = bgmPlaying;
    bgmPlaying = id;
    bgmHandle?.stop(CROSSFADE);
    bgmHandle = null;
    // The fading-out source keeps its own reference, so dropping the cache entry frees the track once it stops.
    if (previous && previous !== id) buffers.delete(previous);
    if (!id) return;
    const handle = await play(id, { loop: true, fadeIn: CROSSFADE });
    if (token !== bgmToken) {
      handle?.stop(0.2);
      return;
    }
    bgmHandle = handle;
    if (!handle) bgmPlaying = null;
  };

  // ---------------------------------------------------------------------------
  // Unlocking, muting and tab visibility
  // Browsers only start audio inside a tap or key press. Safari and Brave do not count every event type,
  // so every kind of first touch tries, and each later one retries until the context is running.
  const unlock = () => {
    if (!ctx) createGraph();
    if (ctx.state !== 'running' && !document.hidden) {
      ctx.resume().catch(() => {});
      // A silent buffer started inside the tap is what finally unlocks audio on Safari and iOS.
      const silence = ctx.createBufferSource();
      silence.buffer = ctx.createBuffer(1, 1, 22050);
      silence.connect(ctx.destination);
      silence.start(0);
    }
    if (unlocked) return;
    unlocked = true;
    preloadAll();
    if (bgmWanted) setMusic(bgmWanted);
  };
  ['pointerdown', 'mousedown', 'touchend', 'pointerup', 'keydown', 'click'].forEach((type) => {
    window.addEventListener(type, unlock, { capture: true, passive: true });
  });
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend().catch(() => {}); else ctx.resume().catch(() => {});
  });

  const setMuted = (value) => {
    if (value === muted) return;
    muted = value;
    // The HUD speaker is part of the frame art, so the page shows the muted state with a class.
    document.documentElement.classList.toggle('sound-muted', muted);
    if (master) rampParam(master.gain, muted ? 0 : 1, 0.03);
    if (muted) {
      pendingSays = 0;
      stopVoice();
      stopConveyor();
      bgmToken += 1;
      bgmHandle?.stop(0.1);
      bgmHandle = null;
      if (bgmPlaying) buffers.delete(bgmPlaying);
      bgmPlaying = null;
    } else {
      setMusic(bgmWanted);
      sfx('sfx_ui_toggle_sound');
    }
  };

  // Load the first screen's sounds right away so START MISSION responds instantly.
  EARLY_IDS.forEach(prefetch);

  // ---------------------------------------------------------------------------
  // Hooks called by the game code in index.html (window.FactoryAudio.gameSound).
  let lastArrowAt = 0;
  const gameSound = (name, detail = {}) => {
    switch (name) {
      case 'move':
        sfx(performance.now() - lastArrowAt < 400 ? 'sfx_card_arrow' : 'sfx_card_drop');
        break;
      case 'pickup':
        sfx('sfx_card_pickup');
        break;
      case 'swap':
        sfx('sfx_card_swap');
        break;
      case 'drag_cancel':
        sfx('sfx_card_invalid');
        break;
      case 'run_start':
        sfx('sfx_run_start');
        startConveyor(700);
        break;
      case 'station_enter': {
        const prefix = STATION_PREFIX[detail.factory];
        if (prefix && detail.step) sfx(prefix + detail.step, { gain: STATION_GAIN });
        break;
      }
      case 'station':
        sfx('sfx_station_pass');
        break;
      case 'error':
        stopVoice();
        stopConveyor();
        sfx('sfx_station_fail');
        sfxLater('sfx_line_stop', 450);
        break;
      case 'line_complete':
        stopConveyor();
        sfx('sfx_line_complete');
        break;
      default:
        break;
    }
  };

  const replayNarration = () => {
    if (lastLines.length) say([...lastLines]);
  };
  const canReplay = () => unlocked && !muted && lastLines.length > 0;

  window.FactoryAudio = { gameSound, say, stopVoice, sfx, setMuted, isMuted: () => muted, replayNarration, canReplay };

  // ---------------------------------------------------------------------------
  // Button sounds. Only real taps count: the HUD and intro scripts forward clicks programmatically.
  document.addEventListener('click', (event) => {
    if (!event.isTrusted || !(event.target instanceof Element)) return;
    const button = event.target.closest('button');
    if (!button || button.disabled) return;
    const text = button.textContent.trim().toUpperCase();

    if (button.matches('.meera-introduction__continue') && text === 'NEXT') return void sfx('sfx_tour_spotlight');
    if (button.matches('.meera-landing__start, .meera-introduction__continue, .phase-intro .hero-button')) return void sfx('sfx_ui_start');
    if (button.matches('.factory-tutorial__next')) {
      if (text === 'START PLAYING') sfx('sfx_ui_start');
      return;
    }
    if (button.matches('.factory-tutorial__back')) return;
    if (button.matches('.factory-tutorial__skip')) return void sfx('sfx_ui_panel_close');
    if (button.matches('[aria-label^="Move "]')) {
      lastArrowAt = performance.now();
      return;
    }
    if (button.closest('.sequence-slot, .sequence-list') || button.matches('.run-button, .rule-option')) return;
    if (button.matches('.robotics-sound, .robotics-info, .robotics-hint, [aria-label^="Help:"], .step-help-close')) return;
    if (button.closest('.feedback-actions')) {
      sfx('sfx_repair');
      stopVoice();
      return;
    }
    if (text.includes('PLAY AGAIN')) {
      sfx('sfx_ui_start');
      say('vo_play_again');
      return;
    }
    sfx('sfx_ui_click');
  }, true);

  // Quiz answers: the game decides right or wrong, so read the result after it renders.
  document.addEventListener('click', (event) => {
    if (!event.isTrusted || !(event.target instanceof Element)) return;
    const option = event.target.closest('.rule-option');
    if (!option || option.disabled) return;
    window.setTimeout(() => {
      if (document.querySelector('.rule-feedback.correct')) {
        sfx('sfx_quiz_correct');
        sayLater('vo_rule_correct_v2', 350);
      } else {
        const answer = document.querySelector('.rule-feedback[data-answer]')?.dataset.answer;
        sfx('sfx_quiz_wrong');
        sayLater(RULE_WRONG_VO[answer] || 'vo_rule_wrong_v2', 250);
      }
    }, 60);
  }, true);

  // ---------------------------------------------------------------------------
  // Screen watcher: picks music and Meera's lines from what is on screen.
  const root = document.getElementById('root');
  const landing = document.getElementById('meeraLanding');
  const introduction = document.getElementById('meeraIntroduction');
  const tutorial = document.getElementById('factoryTutorial');
  const tutorialTitle = document.getElementById('factoryTutorialTitle');

  const spoken = new Set();
  const view = {
    scene: null, phase: null, factory: null, intro: false, introBeat: '', tour: false, tourTitle: '',
    bubble: '', feedback: null, help: false, muted,
  };

  const readShell = () => {
    const shell = root.querySelector('.game-shell');
    const classes = shell ? [...shell.classList] : [];
    return {
      phase: classes.find((name) => name.startsWith('phase-'))?.slice(6) || 'intro',
      factory: classes.find((name) => name.startsWith('factory-'))?.slice(8) || 'chocolate',
    };
  };

  const sceneFor = ({ phase, factory }) => {
    if (!introduction.hidden) return 'intro';
    if (!tutorial.hidden) return 'tour';
    if (!landing.hidden) return 'landing';
    if (phase === 'intro') return 'title';
    if (phase === 'success' || phase === 'candle_success') return 'celebrate';
    if (phase === 'rule') return 'quiz';
    if (phase === 'complete') return 'finale';
    return `level-${factory}`;
  };

  const onPhaseChange = (phase, previous) => {
    if (previous === 'running' && phase !== 'running') stopConveyor();
    setLevels({ scene: phase === 'running' ? RUNNING_BGM : 1 }, 0.4);

    if (phase === 'intro') {
      spoken.clear();
      return;
    }
    if (phase === 'success' || phase === 'candle_success') {
      sfx('sfx_win_stinger');
      sfxLater('sfx_confetti', 250);
      sayLater(phase === 'success' ? 'vo_choc_success' : 'vo_candle_success', 1500);
      return;
    }
    if (phase === 'complete') {
      sfx('sfx_finale_stinger');
      sfxLater('sfx_confetti', 300);
      sfxLater('sfx_badge', 1300);
      sayLater(() => (document.querySelector('.mission-complete.is-helped') ? 'vo_finale_helped_v2' : 'vo_finale_alone_v2'), 2200);
      return;
    }
    if (phase === 'rule') sayLater(() => (document.querySelector('.rule-screen.is-first-try') ? 'vo_rule_question_first_try' : 'vo_rule_question'), 450);
  };

  const onFeedback = (panel) => {
    // Unaided tries on the candle and cupcake lines give no station and no reason.
    if (panel.classList.contains('is-unaided')) return void sayLater('vo_play_fail', 650);
    const headline = panel.querySelector('h2')?.textContent.trim() || '';
    const reason = panel.querySelector('p')?.textContent.trim() || '';
    const lines = ['vo_play_fail', REASON_VO[reason] || 'vo_fallback_fail'];
    const direct = !headline.endsWith('is not ready yet');
    const hintKey = `hint:${view.factory}`;
    if (direct && !spoken.has(hintKey)) {
      spoken.add(hintKey);
      lines.push('vo_play_hint');
    }
    sayLater(lines, 650);
  };

  const onBubble = (text) => {
    const line = BUBBLE_VO[text];
    if (!line) return;
    const key = line.once === 'run' ? `run:${view.factory}` : line.once;
    if (key && spoken.has(key)) return;
    if (key) spoken.add(key);
    say(line.id, 'queue');
  };

  const sync = () => {
    const { phase, factory } = readShell();
    const scene = sceneFor({ phase, factory });
    const introOpen = !introduction.hidden;
    const tourOpen = !tutorial.hidden;

    const toggle = document.querySelector('.global-controls [aria-label="Turn sound on"], .global-controls [aria-label="Mute sound"]');
    if (toggle) setMuted(toggle.getAttribute('aria-label') === 'Turn sound on');

    if (phase !== view.phase || factory !== view.factory) {
      const previous = view.phase;
      view.phase = phase;
      view.factory = factory;
      if (previous !== null) onPhaseChange(phase, previous);
    }

    const introBeat = introOpen ? introduction.dataset.beat || '1' : '';
    if (introOpen && introBeat !== view.introBeat) say(STORY_VO[Number(introBeat) - 1]);
    if (!introOpen && view.intro && !tourOpen) stopVoice();
    view.intro = introOpen;
    view.introBeat = introBeat;

    const title = tourOpen ? tutorialTitle.textContent.trim() : '';
    if (tourOpen && title && title !== view.tourTitle) {
      sfx('sfx_tour_spotlight');
      say(TOUR_VO[title]);
    }
    if (!tourOpen && view.tour) stopVoice();
    view.tour = tourOpen;
    view.tourTitle = title;

    const help = !!root.querySelector('.step-help-dialog');
    if (help !== view.help) sfx(help ? 'sfx_ui_panel_open' : 'sfx_ui_panel_close');
    view.help = help;

    // Meera's bubble and failure lines wait until the intro dialog and tour are closed.
    const blocked = introOpen || tourOpen || !landing.hidden;
    const panel = root.querySelector('.feedback-panel');
    if (!blocked) {
      if (panel && panel !== view.feedback) onFeedback(panel);
      view.feedback = panel;
      const bubble = root.querySelector('.challenge-control-deck .mascot-bubble')?.textContent.trim() || '';
      if (bubble !== view.bubble) onBubble(bubble);
      view.bubble = bubble;
    } else if (!panel) {
      view.feedback = null;
    }

    if (scene !== view.scene) {
      view.scene = scene;
      setMusic(SCENE_BGM[scene]);
    }
  };

  let syncFrame = 0;
  const scheduleSync = () => {
    if (syncFrame) return;
    syncFrame = window.requestAnimationFrame(() => {
      syncFrame = 0;
      sync();
    });
  };
  new MutationObserver(scheduleSync).observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['class', 'hidden', 'aria-label', 'data-beat'],
  });
  sync();
})();
