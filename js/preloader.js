(() => {
  // Loading bar on the title screen. Every image and sound in js/asset-manifest.js is fetched before START MISSION
  // appears, so nothing pops in or stutters later on a slow school connection.
  // - Progress is weighed by real bytes (sizes from the files on disk, corrected by Content-Length) and never goes back.
  // - Smallest files first, five at a time, so pictures land in the first seconds and are not stuck behind music.
  // - Nothing can block the button: a failed, stalled or blocked transfer (file:// pages cannot fetch) counts as done,
  //   and the game then loads that file the normal way.
  // - Sounds (audio/embedded/*.ogg.js) are kept here and handed to js/game-audio.js (FactoryPreload.bytes), so they
  //   are downloaded once.
  //   Images are loaded into the browser's image cache under the exact URL the game uses.
  const manifest = window.FactoryAssetManifest || { images: [], audio: [] };
  const root = document.documentElement;
  const loader = document.querySelector('.meera-landing__loader');
  const fill = loader && loader.querySelector('.meera-landing__loader-fill');
  const label = loader && loader.querySelector('.meera-landing__loader-label');
  const startButton = document.querySelector('.meera-landing__start');

  // Sounds are Ogg Opus (Chrome, Edge, Firefox, Android, Safari 18.4+). A browser that cannot play them runs the
  // game silently, so it does not download them either.
  let canPlayOgg = false;
  try {
    canPlayOgg = !!new Audio().canPlayType('audio/ogg; codecs="opus"');
  } catch {
    // No Audio(): no sound.
  }

  const CONCURRENCY = 5;
  const STALL_MS = 12000; // no bytes for this long: give up on that file
  const MAX_MS = 90000; // hard cap per file, even if bytes trickle in
  const jobs = [
    ...manifest.images.map(([url, size]) => ({ url, size, kind: 'image' })),
    ...(canPlayOgg ? manifest.audio : []).map(([url, size]) => ({ url, size, kind: 'audio' })),
  ].sort((a, b) => a.size - b.size);
  // What the title screen shows right now (its <img>s and background pictures) goes first, so it never waits
  // behind the rest. Stylesheets load before this script runs, so computed backgrounds are already known.
  const onTitle = new Set([...document.querySelectorAll('#meeraLanding img, #meeraLanding, #meeraLanding *')]
    .flatMap((el) => [el.currentSrc || el.src, ...(getComputedStyle(el).backgroundImage.match(/url\("?([^")]+)"?\)/g) || [])
      .map((u) => u.replace(/^url\("?|"?\)$/g, ''))])
    .filter(Boolean)
    .map((u) => new URL(u, location.href).href));
  jobs.sort((a, b) => Number(onTitle.has(new URL(b.url, location.href).href)) - Number(onTitle.has(new URL(a.url, location.href).href)));
  const audioBytes = new Map(); // absolute url -> Promise<ArrayBuffer|null>, registered up front so nothing is fetched twice
  jobs.forEach((job) => {
    job.received = 0;
    job.done = false;
    if (job.kind === 'audio') audioBytes.set(new URL(job.url, location.href).href, new Promise((resolve) => { job.resolve = resolve; }));
  });
  const keptImages = []; // held so the decoded images stay in the browser's image cache
  let shown = 0;
  let ready = false;
  let lastProgressAt = Date.now();
  // If the whole connection stalls (nothing arrives for this long), show the button anyway; loading carries on.
  const IDLE_REVEAL_MS = 20000;

  const render = () => {
    const total = jobs.reduce((sum, job) => sum + job.size, 0) || 1;
    const received = jobs.reduce((sum, job) => sum + (job.done ? job.size : Math.min(job.received, job.size)), 0);
    const allDone = jobs.every((job) => job.done);
    // Monotonic, and 100 only when every file has settled.
    const percent = allDone ? 100 : Math.min(99, Math.floor((received / total) * 100));
    if (percent > shown) shown = percent;
    if (!loader) return;
    loader.setAttribute('aria-valuenow', String(shown));
    fill.style.transform = `scaleX(${shown / 100})`;
    label.textContent = shown >= 100 ? 'Factory ready!' : `Warming up the factory… ${shown}%`;
  };
  let renderQueued = false;
  const scheduleRender = () => {
    if (renderQueued) return;
    renderQueued = true;
    window.requestAnimationFrame(() => {
      renderQueued = false;
      render();
    });
    // A hidden tab gets no animation frames; still move the bar.
    window.setTimeout(() => {
      if (renderQueued) {
        renderQueued = false;
        render();
      }
    }, 250);
  };

  const transfer = (job) => new Promise((resolve) => {
    const controller = new AbortController();
    let stall = 0;
    const armStall = () => {
      window.clearTimeout(stall);
      stall = window.setTimeout(() => controller.abort(), STALL_MS);
    };
    const cap = window.setTimeout(() => controller.abort(), MAX_MS);
    armStall();
    const finish = (bytes) => {
      window.clearTimeout(stall);
      window.clearTimeout(cap);
      job.done = true;
      lastProgressAt = Date.now();
      scheduleRender();
      if (job.resolve) job.resolve(bytes);
      resolve();
    };
    fetch(job.url, { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error(`${response.status}`);
      const length = Number(response.headers.get('Content-Length'));
      if (length > 0) job.size = length;
      if (!response.body) return new Uint8Array(await response.arrayBuffer());
      const reader = response.body.getReader();
      const chunks = [];
      let size = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        size += value.length;
        job.received = size;
        lastProgressAt = Date.now();
        armStall();
        scheduleRender();
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
      }
      return bytes;
    }).then((bytes) => {
      if (job.kind === 'image') {
        // Now in the HTTP cache: load it once more as an image so it is decoded-ready under the game's URL.
        const image = new Image();
        image.src = job.url;
        keptImages.push(image);
        finish(null);
      } else {
        finish(bytes.buffer);
      }
    }).catch(() => finish(null));
  });

  const queue = [...jobs];
  const worker = async () => {
    while (queue.length) {
      await transfer(queue.shift());
    }
  };

  const reveal = () => {
    if (ready) return;
    ready = true;
    shown = 100;
    render();
    root.classList.remove('is-preloading');
    root.classList.add('is-preloaded');
    if (startButton) startButton.classList.add('is-popping-in');
    document.dispatchEvent(new Event('factory-assets-ready'));
  };

  window.FactoryPreload = {
    get ready() {
      return ready;
    },
    // A copy of a preloaded sound's wrapper file, or null.
    bytes(url) {
      const pending = audioBytes.get(new URL(url, location.href).href);
      if (!pending) return null;
      return pending.then((buffer) => (buffer ? buffer.slice(0) : null));
    },
  };

  // Opened straight from disk, fetch() is not allowed; the game reads its files the normal way (sounds as scripts).
  if (!jobs.length || location.protocol === 'file:') {
    reveal();
    return;
  }
  root.classList.add('is-preloading');
  render();
  Promise.all(Array.from({ length: CONCURRENCY }, worker)).then(reveal);
  const idleCheck = window.setInterval(() => {
    if (ready) return window.clearInterval(idleCheck);
    if (Date.now() - lastProgressAt > IDLE_REVEAL_MS) {
      window.clearInterval(idleCheck);
      reveal();
    }
  }, 1000);
})();
