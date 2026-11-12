(() => {
  'use strict';
  const translate = key => window.InterscapeI18n?.t(key) || key;

  // The gallery advances only when a visitor chooses a scene.
  const stage = document.querySelector('.dream-stage');
  const scenes = [...document.querySelectorAll('[data-scene]')];
  const sceneButtons = [...document.querySelectorAll('[data-scene-to]')];
  const caption = document.querySelector('#scene-name');
  const sceneDescription = document.querySelector('#scene-description');
  const dreams = document.querySelector('.dreams');
  const imageDialog = document.querySelector('#image-dialog');
  const lightboxImage = document.querySelector('#lightbox-image');
  let galleryFocus = null;
  let current = 0;
  function updateImageDialog() {
    if (!imageDialog || !lightboxImage || !scenes[current]) return;
    const original = scenes[current].querySelector('img');
    const source = original.dataset.full || original.currentSrc || original.src;
    if (lightboxImage.src !== source) lightboxImage.src = source;
    lightboxImage.alt = translate(`sceneAlt${current}`);
    document.querySelector('#image-dialog-title').textContent = translate(`sceneName${current}`);
    document.querySelector('#lightbox-count').textContent = `${String(current + 1).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`;
    imageDialog.querySelector('[data-close-gallery]').setAttribute('aria-label', translate('close'));
    imageDialog.querySelector('[data-image-prev]').setAttribute('aria-label', translate('galleryPrevious'));
    imageDialog.querySelector('[data-image-next]').setAttribute('aria-label', translate('galleryNext'));
  }
  function showScene(index, announce = true) {
    if (!scenes.length || !Number.isInteger(index)) return;
    current = (index + scenes.length) % scenes.length;
    scenes.forEach((scene, i) => {
      scene.classList.toggle('is-active', i === current);
      scene.setAttribute('aria-hidden', String(i !== current));
    });
    sceneButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
    document.querySelector('#scene-current').textContent = String(current + 1).padStart(2, '0');
    caption.dataset.i18n = `sceneName${current}`;
    caption.textContent = translate(`sceneName${current}`);
    if (sceneDescription) {
      sceneDescription.dataset.i18n = `sceneBody${current}`;
      sceneDescription.textContent = translate(`sceneBody${current}`);
    }
    if (dreams) dreams.dataset.activeScene = String(current);
    if (imageDialog?.open) updateImageDialog();
    if (announce) document.querySelector('#scene-announcement').textContent = `${current + 1} / ${scenes.length}. ${caption.textContent}`;
  }
  sceneButtons.forEach(button => button.addEventListener('click', () => showScene(Number(button.dataset.sceneTo))));
  document.querySelector('[data-scene-prev]').addEventListener('click', () => showScene(current - 1));
  document.querySelector('[data-scene-next]').addEventListener('click', () => showScene(current + 1));
  stage.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      showScene(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let touchStart = null;
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') touchStart = { x: event.clientX, y: event.clientY };
  });
  stage.addEventListener('pointerup', event => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) showScene(current + (dx < 0 ? 1 : -1));
    touchStart = null;
  });
  stage.addEventListener('pointercancel', () => { touchStart = null; });

  const hasOpenDialog = () => Boolean(document.querySelector('dialog[open]'));
  function pausePageVideos() {
    document.querySelectorAll('video').forEach(media => media.pause());
  }
  function syncDialogState() {
    const open = hasOpenDialog();
    document.body.classList.toggle('dialog-open', open);
    if (open) pausePageVideos();
    updateMotionLabel();
  }
  function closeOnBackdrop(event) {
    const modal = event.currentTarget;
    const bounds = modal.getBoundingClientRect();
    if (event.target === modal && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) modal.close();
  }
  function openImageDialog(index = current) {
    if (!imageDialog || imageDialog.open || hasOpenDialog()) return;
    galleryFocus = document.activeElement;
    showScene(index, false);
    updateImageDialog();
    imageDialog.showModal();
    syncDialogState();
    imageDialog.querySelector('[data-close-gallery]').focus();
  }
  document.querySelectorAll('[data-expand-scene]').forEach(button => button.addEventListener('click', () => openImageDialog()));
  document.querySelectorAll('[data-open-scene]').forEach(button => button.addEventListener('click', () => openImageDialog(Number(button.dataset.openScene))));
  if (imageDialog) {
    imageDialog.querySelector('[data-close-gallery]').addEventListener('click', () => imageDialog.close());
    imageDialog.querySelector('[data-image-prev]').addEventListener('click', () => showScene(current - 1));
    imageDialog.querySelector('[data-image-next]').addEventListener('click', () => showScene(current + 1));
    imageDialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        showScene(current + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    imageDialog.addEventListener('click', closeOnBackdrop);
    imageDialog.addEventListener('close', () => {
      syncDialogState();
      if (galleryFocus?.isConnected) galleryFocus.focus({ preventScroll: true });
      galleryFocus = null;
    });
  }

  // Reflect the chapter in view without changing the visitor's scroll position.
  const header = document.querySelector('.site-header');
  if (header) {
    let headerFramePending = false;
    const updateHeader = () => { header.classList.toggle('is-scrolled', scrollY > 40); headerFramePending = false; };
    addEventListener('scroll', () => {
      if (!headerFramePending) { headerFramePending = true; requestAnimationFrame(updateHeader); }
    }, { passive: true });
    addEventListener('pageshow', updateHeader);
    updateHeader();
  }
  const chapterLinks = [...document.querySelectorAll('.chapter-nav a[href^="#"]')];
  const chapters = chapterLinks.map(link => ({ link, section: document.getElementById(link.hash.slice(1)) })).filter(item => item.section);
  if (chapters.length) {
    const visibleChapters = new Set();
    const chapterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visibleChapters.add(entry.target);
        else visibleChapters.delete(entry.target);
      });
      const visible = chapters.filter(item => visibleChapters.has(item.section));
      visible.sort((a, b) => Math.abs(a.section.getBoundingClientRect().top - innerHeight * 0.12) - Math.abs(b.section.getBoundingClientRect().top - innerHeight * 0.12));
      const active = visible[0]?.link;
      chapters.forEach(({ link }) => {
        if (link === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-12% 0px -50% 0px', threshold: [0, 0.1, 0.5, 1] });
    chapters.forEach(({ section }) => chapterObserver.observe(section));
  }

  // Ability descriptions are independent of the two playable video examples.
  const abilityButtons = [...document.querySelectorAll('[data-ability-to]')];
  const abilityPanels = [...document.querySelectorAll('[data-ability-panel]')];
  function showAbility(index, focus = false) {
    const selected = abilityButtons.find(button => Number(button.dataset.abilityTo) === index);
    if (!selected) return;
    abilityButtons.forEach(button => {
      const active = button === selected;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    abilityPanels.forEach(panel => { panel.hidden = Number(panel.dataset.abilityPanel) !== index; });
    if (focus) selected.focus();
  }
  abilityButtons.forEach((button, index) => {
    button.addEventListener('click', () => showAbility(Number(button.dataset.abilityTo)));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % abilityButtons.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + abilityButtons.length) % abilityButtons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = abilityButtons.length - 1;
      else return;
      event.preventDefault();
      showAbility(Number(abilityButtons[next].dataset.abilityTo), true);
    });
  });
  const initialAbility = abilityButtons.find(button => button.getAttribute('aria-selected') === 'true') || abilityButtons[0];
  if (initialAbility) showAbility(Number(initialAbility.dataset.abilityTo));

  // Keep the playable examples beside their descriptions; playback is visitor-controlled.
  const gameplayVideo = document.querySelector('#gameplay-video');
  const gameplayButtons = [...document.querySelectorAll('[data-gameplay]')];
  const gameplayCaption = document.querySelector('#gameplay-caption');
  const gameplayClips = {
    switch: { src: 'media/dream-switch.mp4', poster: 'img/dream-switch-poster.webp', caption: 'gameplayCaption1', label: 'gameplayVideoLabel' },
    action: { src: 'media/v3-action-play.mp4', poster: 'img/v3-action-poster.webp', caption: 'gameplayCaption2', label: 'gameplayVideoLabel2' }
  };
  let currentGameplay = 'switch';
  function updateGameplayCopy() {
    const clip = gameplayClips[currentGameplay];
    gameplayCaption.dataset.i18n = clip.caption;
    gameplayCaption.textContent = translate(clip.caption);
    gameplayVideo.dataset.i18nAria = clip.label;
    gameplayVideo.setAttribute('aria-label', translate(clip.label));
  }
  gameplayButtons.forEach(button => button.addEventListener('click', async () => {
    const next = button.dataset.gameplay;
    if (next === currentGameplay || !gameplayClips[next]) return;
    const wasPlaying = !gameplayVideo.paused;
    gameplayVideo.pause();
    currentGameplay = next;
    gameplayVideo.poster = gameplayClips[next].poster;
    gameplayVideo.querySelector('source').src = gameplayClips[next].src;
    gameplayVideo.load();
    gameplayButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    updateGameplayCopy();
    if (wasPlaying && !hasOpenDialog() && !document.hidden) {
      try { await gameplayVideo.play(); } catch { /* Native controls remain available. */ }
    }
  }));
  const exampleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (!entry.isIntersecting) entry.target.pause(); });
  }, { threshold: 0.1 });
  document.querySelectorAll('video').forEach(media => {
    exampleObserver.observe(media);
    media.addEventListener('play', () => { if (hasOpenDialog() || document.hidden) media.pause(); });
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pausePageVideos(); });

  // Only visible fog moves, and visitor and system preferences always take precedence.
  const motionButton = document.querySelector('#motion-toggle');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let manuallyPaused = false;

  // Observe each section, since the drifting layers extend beyond its edges.
  const fogSections = new Map();
  document.querySelectorAll('.fog-layer').forEach(layer => {
    const section = layer.closest('.hero, .dreams, .closing');
    if (!section) return;
    if (!fogSections.has(section)) fogSections.set(section, { layers: [], visible: false });
    fogSections.get(section).layers.push(layer);
  });
  function syncFogMotion() {
    const allowed = !document.hidden && !reducedMotion.matches && !navigator.connection?.saveData && !hasOpenDialog() && !manuallyPaused;
    fogSections.forEach(({ layers, visible }) => {
      layers.forEach(layer => layer.classList.toggle('is-drifting', allowed && visible));
    });
  }
  const fogObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { fogSections.get(entry.target).visible = entry.isIntersecting && entry.intersectionRatio > 0; });
    updateMotionLabel();
  }, { threshold: 0.01 });
  fogSections.forEach((_, section) => fogObserver.observe(section));
  navigator.connection?.addEventListener?.('change', updateMotionLabel);

  function updateMotionLabel() {
    syncFogMotion();
    motionButton.hidden = !fogSections.size || reducedMotion.matches || Boolean(navigator.connection?.saveData);
    const playing = Boolean(document.querySelector('.fog-layer.is-drifting'));
    const key = playing ? 'motionPause' : 'motionPlay';
    motionButton.setAttribute('aria-pressed', String(playing));
    motionButton.dataset.i18nAria = key;
    motionButton.setAttribute('aria-label', translate(key));
    const label = motionButton.querySelector('.motion-label');
    label.dataset.i18n = key;
    label.textContent = translate(key);
    motionButton.querySelector('.motion-icon').textContent = playing ? 'Ⅱ' : '▶';
  }
  motionButton.addEventListener('click', () => {
    manuallyPaused = Boolean(document.querySelector('.fog-layer.is-drifting'));
    updateMotionLabel();
  });
  document.addEventListener('visibilitychange', updateMotionLabel);
  reducedMotion.addEventListener('change', updateMotionLabel);
  updateMotionLabel();

  // Load the official trailer only after an explicit click.
  const dialog = document.querySelector('.trailer-dialog');
  const container = document.querySelector('#video-container');
  let lastFocus = null;
  function openTrailer() {
    if (dialog.open || hasOpenDialog()) return;
    lastFocus = document.activeElement;
    const frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/OuanYzbB6oQ?autoplay=1&rel=0';
    frame.title = translate('officialTrailer');
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allowFullscreen = true;
    container.replaceChildren(frame);
    dialog.showModal();
    syncDialogState();
    dialog.querySelector('.dialog-close').focus();
  }
  document.querySelectorAll('[data-trailer]').forEach(button => button.addEventListener('click', openTrailer));
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', closeOnBackdrop);
  dialog.addEventListener('close', () => {
    container.replaceChildren();
    syncDialogState();
    if (lastFocus?.isConnected) lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  });
  document.addEventListener('languagechange', () => {
    showScene(current, false);
    updateGameplayCopy();
    updateMotionLabel();
    const frame = container.querySelector('iframe');
    if (frame) frame.title = translate('officialTrailer');
  });
  showScene(0, false);
  updateGameplayCopy();
})();
