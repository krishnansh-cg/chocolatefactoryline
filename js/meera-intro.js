(() => {
  const root = document.getElementById('root');
  const landing = document.getElementById('meeraLanding');
  const landingStart = landing.querySelector('.meera-landing__start');
  const introduction = document.getElementById('meeraIntroduction');
  const continueButton = introduction.querySelector('.meera-introduction__continue');
  const introductionMascot = introduction.querySelector('.meera-introduction__mascot');
  const storyGreeting = introduction.querySelector('#meeraIntroductionTitle');
  const storyKicker = introduction.querySelector('.meera-story__kicker');
  const storyCount = introduction.querySelector('.meera-story__count');
  const storyBeat = introduction.querySelector('.meera-story');
  const storyArt = introduction.querySelector('.meera-story__art');
  const storyText = introduction.querySelector('.meera-story__text');
  const storyDots = [...introduction.querySelectorAll('.meera-story__dots li')];
  const storyBack = introduction.querySelector('.meera-story__back');
  const tutorial = document.getElementById('factoryTutorial');
  const tutorialSpotlight = tutorial.querySelector('.factory-tutorial__spotlight');
  const tutorialCard = tutorial.querySelector('.factory-tutorial__card');
  const tutorialTitle = tutorial.querySelector('#factoryTutorialTitle');
  const tutorialDescription = tutorial.querySelector('.factory-tutorial__description');
  const tutorialCount = tutorial.querySelector('.factory-tutorial__count');
  const tutorialBack = tutorial.querySelector('.factory-tutorial__back');
  const tutorialSkip = tutorial.querySelector('.factory-tutorial__skip');
  const tutorialNext = tutorial.querySelector('.factory-tutorial__next');
  const hud = document.getElementById('roboticsHud');
  // Three stops only, so the child is moving cards quickly. The HUD clock, progress bar, speaker and i
  // explain themselves with a tip when first tapped (index.html).
  const tutorialSteps = [
    { selectors: ['.input-bay'], title: 'Starting ingredient', description: 'Your starting material enters the factory line here.' },
    { selectors: ['.sequence-list'], title: 'Factory stations', description: 'Put these six stations in the right order. Drag, tap to swap, or use the arrows.' },
    { selectors: ['.line-control-bar .run-button', '.feedback-actions .primary-button'], title: 'Test your line', description: 'When your line looks right, press here to run it.' }
  ];
  // Meera's story, one illustrated sentence at a time (voice lines vo_story_01-06 in game-audio.js).
  // `scene` beats are built from the game's own art, so nothing shows the working order before the child's guess.
  const chocolateSteps = ['embedded-101794-770b40d352', 'embedded-98442-1c6e24dbd7', 'embedded-85102-2ab31ffb40', 'embedded-131654-14c45bbd6f', 'embedded-109362-ba49d8adc7', 'embedded-81566-9f6fc71ff2']
    .map((name) => `./assets/game/${name}.webp`);
  const storyBeats = [
    { greeting: true, pose: 'meera-idle', text: 'I love making chocolates, candles and cupcakes on my factory line.',
      image: './assets/intro/previous-lines-india.webp', imageAlt: 'Indian schoolchildren beside chocolate, candle and cupcake factory lines' },
    { pose: 'meera-celebrating', text: 'Our class stall at the school mela opens tomorrow.',
      image: './assets/intro/indian-school-fair.webp', imageAlt: 'Students and teachers decorating their school courtyard for the mela' },
    { pose: 'meera-thinking', text: 'But last night, the steps on my chocolate line got mixed up!', scene: 'jumble',
      imageAlt: 'The chocolate factory with its six station cards scattered and tumbled about' },
    { pose: 'meera-wrong-answer-try-again', text: 'If we can’t fix it, we’ll have no chocolates to sell.',
      image: './assets/intro/empty-fair-stall.webp', imageAlt: 'Two schoolchildren waiting beside an empty stall at the school mela' },
    { pose: 'meera-pointing-hint', text: 'Order matters every day. You put on socks before shoes!' },
    { pose: 'meera-thumbs-up', label: 'Our job', text: 'Put the steps back in order, so our chocolates are ready for the mela.', scene: 'job',
      imageAlt: 'A wrapped chocolate bar in front of the chocolate factory' },
  ];
  // Scattered positions and tilts for the mixed-up station cards.
  const jumble = [[8, 14, -18], [62, 8, 14], [30, 46, 9], [74, 50, -12], [12, 60, 22], [47, 18, -6]];
  let storyIndex = 0;

  // The game bundle shows Meera's poses directly, but its alt text still names the old mascot,
  // so each pose gets its own description here.
  const poseDescriptions = new Map([
    ['meera-idle.webp', 'Meera, your factory guide'],
    ['meera-pointing-hint.webp', 'Meera points toward the mission'],
    ['meera-wrong-answer-try-again.webp', 'Meera encourages you to try again'],
    ['meera-thumbs-up.webp', 'Meera gives a thumbs-up']
  ]);
  let allowNativeStart = false;
  let introductionOrigin = null;
  let gameLoad;
  let transitionId = 0;
  let introductionShownAt = 0;
  // Set while LET'S GO closes the story. The fading dialog still takes taps, and each repeat tap used to restart
  // the close and cancel the last one, so fast tapping kept the factory locked until the child stopped.
  let leavingStory = false;
  let activeTutorialSteps = [];
  let tutorialIndex = 0;
  let tutorialOpen = false;
  let tutorialSeen = false;
  const fadeDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 480;

  root.inert = true;

  const loadGame = () => {
    const existing = root.querySelector('.game-shell');
    if (existing) return Promise.resolve(existing);
    if (gameLoad) return gameLoad;
    gameLoad = new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        const shell = root.querySelector('.game-shell');
        if (!shell) return;
        observer.disconnect();
        resolve(shell);
      });
      observer.observe(root, { childList: true, subtree: true });
    });
    return gameLoad;
  };

  const showScreen = (screen, id) => {
    screen.hidden = false;
    if (fadeDuration === 0) {
      screen.classList.add('is-visible');
      return;
    }
    window.requestAnimationFrame(() => {
      if (id === transitionId) screen.classList.add('is-visible');
    });
  };

  const hideScreen = (screen, id) => {
    screen.classList.remove('is-visible');
    window.setTimeout(() => {
      if (id === transitionId) screen.hidden = true;
    }, fadeDuration);
  };

  const renderStoryArt = (beat) => {
    storyArt.replaceChildren();
    storyArt.hidden = !beat.image && !beat.scene;
    if (beat.image) {
      const image = document.createElement('img');
      image.className = 'meera-story__image';
      image.src = beat.image;
      image.alt = beat.imageAlt;
      storyArt.append(image);
      return;
    }
    if (!beat.scene) return;
    const scene = document.createElement('div');
    scene.className = `meera-story__scene is-${beat.scene}`;
    scene.setAttribute('role', 'img');
    scene.setAttribute('aria-label', beat.imageAlt);
    const background = document.createElement('img');
    background.className = 'meera-story__scene-bg';
    background.alt = '';
    background.src = beat.scene === 'jumble' ? './assets/game/embedded-3417250-61e124c577.webp' : './assets/game/embedded-2772602-3c94705f59.webp';
    scene.append(background);
    if (beat.scene === 'jumble') {
      chocolateSteps.forEach((src, index) => {
        const [x, y, turn] = jumble[index];
        const piece = document.createElement('img');
        piece.className = 'meera-story__piece';
        piece.src = src;
        piece.alt = '';
        piece.style.cssText = `--x:${x}%;--y:${y}%;--turn:${turn}deg;--i:${index}`;
        scene.append(piece);
      });
    } else {
      const bar = document.createElement('img');
      bar.className = 'meera-story__hero';
      bar.src = './assets/game/embedded-1862522-537e4b0733.webp';
      bar.alt = '';
      scene.append(bar);
    }
    storyArt.append(scene);
  };

  const renderStory = () => {
    const beat = storyBeats[storyIndex];
    const isLast = storyIndex === storyBeats.length - 1;
    introduction.dataset.beat = String(storyIndex + 1);
    storyGreeting.hidden = !beat.greeting;
    storyKicker.textContent = beat.greeting ? 'Meet your factory guide' : 'Our mela stall';
    storyCount.textContent = `${storyIndex + 1} of ${storyBeats.length}`;
    introductionMascot.src = `./assets/meera/${beat.pose}.webp`;
    renderStoryArt(beat);
    storyText.replaceChildren();
    if (beat.label) {
      const label = document.createElement('strong');
      label.textContent = `${beat.label}: `;
      storyText.append(label);
    }
    storyText.append(beat.text);
    storyBeat.classList.toggle('is-text-only', !beat.image && !beat.scene);
    storyBeat.classList.remove('is-entering');
    void storyBeat.offsetWidth;
    storyBeat.classList.add('is-entering');
    storyDots.forEach((dot, index) => {
      dot.classList.toggle('is-current', index === storyIndex);
      dot.classList.toggle('is-seen', index < storyIndex);
    });
    storyBack.hidden = storyIndex === 0;
    continueButton.textContent = isLast ? 'LET’S GO!' : 'NEXT';
  };

  storyBack.addEventListener('click', () => {
    if (storyIndex === 0) return;
    storyIndex -= 1;
    renderStory();
    continueButton.focus();
  });

  const showIntroduction = (origin) => {
    leavingStory = false;
    const id = ++transitionId;
    storyIndex = 0;
    renderStory();
    introductionOrigin = origin;
    introductionShownAt = Date.now();
    const hudArt = document.querySelector('.robotics-hud-art');
    if (!hudArt.getAttribute('src')) hudArt.src = hudArt.dataset.src;
    root.inert = true;
    showScreen(introduction, id);
    if (origin === 'landing') {
      landing.inert = true;
      hideScreen(landing, id);
    }
    document.body.classList.add('meera-dialog-open');
    document.dispatchEvent(new Event('factory-ui-timer-sync'));
    continueButton.focus();
  };

  const waitForFactoryStage = () => new Promise((resolve) => {
    if (root.querySelector('.factory-stage')) {
      resolve();
      return;
    }
    const observer = new MutationObserver(() => {
      if (!root.querySelector('.factory-stage')) return;
      observer.disconnect();
      window.clearTimeout(timeout);
      resolve();
    });
    observer.observe(root, { childList: true, subtree: true });
    const timeout = window.setTimeout(() => {
      observer.disconnect();
      resolve();
    }, 5000);
  });

  const getTargetBounds = (step) => {
    const rects = step.selectors.flatMap((selector) => [...document.querySelectorAll(selector)]).filter((element) => {
      const bounds = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return bounds.width > 0 && bounds.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !element.hidden;
    }).map((element) => element.getBoundingClientRect());
    if (!rects.length) return null;
    return {
      left: Math.min(...rects.map((rect) => rect.left)),
      top: Math.min(...rects.map((rect) => rect.top)),
      right: Math.max(...rects.map((rect) => rect.right)),
      bottom: Math.max(...rects.map((rect) => rect.bottom))
    };
  };

  const positionTutorial = () => {
    if (!tutorialOpen) return;
    const step = activeTutorialSteps[tutorialIndex];
    const bounds = getTargetBounds(step);
    if (!bounds) return;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = step.padding ?? 9;
    const left = Math.max(4, bounds.left - padding);
    const top = Math.max(4, bounds.top - padding);
    const right = Math.min(viewportWidth - 4, bounds.right + padding);
    const bottom = Math.min(viewportHeight - 4, bounds.bottom + padding);
    Object.assign(tutorialSpotlight.style, {
      left: `${left}px`, top: `${top}px`,
      width: `${Math.max(1, right - left)}px`, height: `${Math.max(1, bottom - top)}px`
    });

    tutorialCard.style.width = '';
    let cardWidth = tutorialCard.offsetWidth;
    let cardHeight = tutorialCard.offsetHeight;
    const gap = 15;
    const below = bottom + gap + cardHeight <= viewportHeight - 12;
    const above = top - gap - cardHeight >= 12;
    let cardTop;
    let cardLeft;
    if (below || above) {
      cardTop = below ? bottom + gap : top - gap - cardHeight;
      cardLeft = Math.max(12, Math.min(viewportWidth - cardWidth - 12, (left + right - cardWidth) / 2));
    } else {
      const leftSpace = left - gap - 12;
      const rightSpace = viewportWidth - right - gap - 12;
      const minSideWidth = Math.min(220, viewportWidth - 24);
      const side = leftSpace >= minSideWidth ? 'left' : rightSpace >= minSideWidth ? 'right' : null;
      if (side) {
        tutorialCard.style.width = `${Math.min(cardWidth, side === 'left' ? leftSpace : rightSpace)}px`;
        cardWidth = tutorialCard.offsetWidth;
        cardHeight = tutorialCard.offsetHeight;
        cardLeft = side === 'left' ? left - gap - cardWidth : right + gap;
        cardTop = Math.max(12, Math.min(viewportHeight - cardHeight - 12, (top + bottom - cardHeight) / 2));
      } else {
        cardTop = Math.max(12, viewportHeight - cardHeight - 12);
        cardLeft = Math.max(12, Math.min(viewportWidth - cardWidth - 12, (left + right - cardWidth) / 2));
      }
    }
    Object.assign(tutorialCard.style, { left: `${cardLeft}px`, top: `${cardTop}px` });
  };

  const renderTutorialStep = () => {
    const step = activeTutorialSteps[tutorialIndex];
    tutorialTitle.textContent = step.title;
    tutorialDescription.textContent = step.description;
    tutorialCount.textContent = `${tutorialIndex + 1} / ${activeTutorialSteps.length}`;
    tutorialBack.disabled = tutorialIndex === 0;
    tutorialNext.textContent = tutorialIndex === activeTutorialSteps.length - 1 ? 'START PLAYING' : 'NEXT';
    window.requestAnimationFrame(positionTutorial);
  };

  const finishTutorial = () => {
    if (!tutorialOpen) return;
    tutorialOpen = false;
    tutorial.classList.remove('is-visible');
    window.setTimeout(() => {
      tutorial.hidden = true;
      document.body.classList.remove('factory-tutorial-open');
      document.dispatchEvent(new Event('factory-ui-timer-sync'));
      root.inert = false;
      hud.inert = false;
      root.querySelector('.line-control-bar .run-button, .feedback-actions .primary-button')?.focus();
    }, fadeDuration ? 280 : 0);
  };

  // On a slow device the factory screen can still be animating in; wait for it rather than skip the tour.
  const startFactoryTutorial = async () => {
    if (tutorialOpen || tutorialSeen) return;
    for (let tries = 0; tries < 6 && !root.querySelector('.factory-stage'); tries += 1) await waitForFactoryStage();
    if (!root.querySelector('.factory-stage') || tutorialOpen || tutorialSeen) return;
    activeTutorialSteps = tutorialSteps.filter((step) => getTargetBounds(step));
    if (!activeTutorialSteps.length) return;
    tutorialSeen = true;
    tutorialIndex = 0;
    tutorialOpen = true;
    root.inert = true;
    hud.inert = true;
    document.body.classList.add('factory-tutorial-open');
    document.dispatchEvent(new Event('factory-ui-timer-sync'));
    tutorial.hidden = false;
    renderTutorialStep();
    window.requestAnimationFrame(() => tutorial.classList.add('is-visible'));
    tutorialNext.focus();
  };

  tutorialBack.addEventListener('click', () => {
    if (tutorialIndex === 0) return;
    tutorialIndex -= 1;
    renderTutorialStep();
  });
  tutorialNext.addEventListener('click', () => {
    if (tutorialIndex === activeTutorialSteps.length - 1) return finishTutorial();
    tutorialIndex += 1;
    renderTutorialStep();
  });
  tutorialSkip.addEventListener('click', finishTutorial);
  tutorial.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') finishTutorial();
  });
  window.addEventListener('resize', positionTutorial);
  window.addEventListener('scroll', positionTutorial, { passive: true });

  const describeMascot = (image) => {
    if (!image.matches('.intro-mascot, .mascot-guide img, .success-mascot, .complete-mascot, .finale-mascot')) return;
    const description = poseDescriptions.get((image.getAttribute('src') || '').split('/').pop());
    if (description && image.alt !== description) image.alt = description;
  };

  const sync = () => {
    const isTitle = !!root.querySelector('.game-shell.phase-intro');
    document.body.classList.toggle('meera-title-active', isTitle);
    if (!isTitle && !introduction.hidden && !introductionOrigin) {
      introduction.hidden = true;
      document.body.classList.remove('meera-dialog-open');
    }
    root.querySelectorAll('.intro-mascot, .mascot-guide img, .success-mascot, .complete-mascot, .finale-mascot').forEach(describeMascot);
  };

  // START MISSION is hidden until the loading bar finishes; keyboard or scripted starts wait for it too.
  const assetsReady = () => !window.FactoryPreload || window.FactoryPreload.ready;

  document.addEventListener('click', (event) => {
    const start = event.target instanceof Element && event.target.closest('.phase-intro .hero-button');
    if (!start || allowNativeStart) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!assetsReady()) return;
    showIntroduction('native');
  }, true);

  document.addEventListener('factory-ui-back', () => {
    if (document.body.classList.contains('meera-booting') || tutorialOpen || !introduction.hidden) return;
    showIntroduction('factory');
  });

  landingStart.addEventListener('click', () => {
    if (!assetsReady()) return;
    showIntroduction('landing');
  });

  continueButton.addEventListener('click', async () => {
    if (leavingStory) return;
    if (storyIndex < storyBeats.length - 1) {
      storyIndex += 1;
      renderStory();
      return;
    }
    leavingStory = true;
    continueButton.disabled = true;
    if (!root.querySelector('.game-shell')) continueButton.textContent = 'LOADING…';
    await loadGame();
    continueButton.disabled = false;
    continueButton.textContent = 'LET’S GO!';
    const origin = introductionOrigin;
    const start = root.querySelector('.phase-intro .hero-button');
    if (start && origin !== 'factory') {
      allowNativeStart = true;
      try {
        start.click();
      } finally {
        allowNativeStart = false;
      }
      await waitForFactoryStage();
    }
    // A quick tap can beat the first crossfade; keep the dialog opaque before revealing the game.
    const remainingFade = Math.max(0, fadeDuration + 32 - (Date.now() - introductionShownAt));
    if (remainingFade) await new Promise((resolve) => window.setTimeout(resolve, remainingFade));
    const id = ++transitionId;
    if (origin === 'landing') {
      landing.hidden = true;
      document.body.classList.remove('meera-booting');
      document.documentElement.classList.remove('meera-booting');
    }
    hideScreen(introduction, id);
    window.setTimeout(() => {
      if (id !== transitionId) return;
      document.body.classList.remove('meera-dialog-open');
      introductionOrigin = null;
      root.inert = false;
      startFactoryTutorial();
      document.dispatchEvent(new Event('factory-ui-timer-sync'));
    }, fadeDuration);
  });

  introduction.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (continueButton.disabled || leavingStory) return;
    const id = ++transitionId;
    const origin = introductionOrigin;
    hideScreen(introduction, id);
    if (introductionOrigin === 'landing') {
      showScreen(landing, id);
      landing.inert = false;
      landingStart.focus();
    } else {
      root.querySelector('.phase-intro .hero-button')?.focus();
    }
    window.setTimeout(() => {
      if (id !== transitionId) return;
      document.body.classList.remove('meera-dialog-open');
      introductionOrigin = null;
      root.inert = origin === 'landing';
      document.dispatchEvent(new Event('factory-ui-timer-sync'));
    }, fadeDuration);
  });

  new MutationObserver(sync).observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'src']
  });
  sync();
})();
