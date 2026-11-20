(() => {
  'use strict';

  const text = {
    ko: {
      skip:'본문으로', nav:'주 메뉴', language:'언어', storyNav:'이야기', playNav:'게임플레이', journalNav:'개발 소식', infoNav:'게임 정보',
      snap:'손가락 튕기기', back:'처음 장면으로', description:'케이의 손짓에 따라 같은 로비가 다른 꿈으로 바뀝니다.',
      amber:'샹들리에가 있는 로비', ash:'천창 아래 벽에 문양이 드러난 로비',
      premise:'잠든 사람들을 깨우기 위해, 케이는 타인의 꿈에 들어간다.',
      release:'출시 예정', trailer:'공식 트레일러', wish:'Steam에서 찜하기', close:'닫기', youtube:'YouTube에서 보기 ↗',
      title:'INTER•SCAPE | 인터스케이프', meta:'손가락을 튕겨 두 꿈을 오가세요. 타인의 꿈으로 들어가는 요원 케이의 스토리 액션 어드벤처, INTER•SCAPE.'
    },
    en: {
      skip:'Skip to content', nav:'Main navigation', language:'Language', storyNav:'Story', playNav:'Gameplay', journalNav:'Studio news', infoNav:'Game info',
      snap:'Snap your fingers', back:'Return to the first scene', description:'K’s gesture shifts the same lobby from one dream to the next.',
      amber:'A lobby lit by a chandelier', ash:'A shaft of daylight reveals a seal on the wall',
      premise:'To wake the sleepers, K must enter their dreams.',
      release:'Coming soon', trailer:'Watch trailer', wish:'Wishlist on Steam', close:'Close', youtube:'Watch on YouTube ↗',
      title:'INTER•SCAPE', meta:'Snap your fingers to cross between dreams. Enter the dreams of others as Agent K in INTER•SCAPE, a story-driven action adventure.'
    },
    zh: {
      skip:'跳至正文', nav:'主导航', language:'语言', storyNav:'故事', playNav:'游戏玩法', journalNav:'开发动态', infoNav:'游戏信息',
      snap:'打个响指', back:'回到最初的场景', description:'凯打个响指，同一个大厅便切换到了另一个梦境。',
      amber:'吊灯照亮的大厅', ash:'天窗下的墙面显现出发光的纹样',
      premise:'为了唤醒沉睡的人们，凯必须走进他们的梦境。',
      release:'即将推出', trailer:'官方预告片', wish:'加入 Steam 愿望单', close:'关闭', youtube:'在 YouTube 上观看 ↗',
      title:'INTER•SCAPE', meta:'打个响指，穿梭于两个梦境。化身特工凯，走进他人的梦境，体验剧情动作冒险游戏 INTER•SCAPE。'
    }
  };
  const opening = document.querySelector('#lobby');
  const frame = opening.querySelector('.projection');
  const snap = opening.querySelector('#snap');
  const label = snap.querySelector('#snap-label');
  const clip = opening.querySelector('#snap-film');
  const announcement = opening.querySelector('#scene-live');
  const dialog = document.querySelector('#trailer-modal');
  const filmHost = dialog.querySelector('.film-host');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const picker = document.querySelector('#language');
  const copyNodes = [...document.querySelectorAll('[data-t]')];
  const original = Object.fromEntries(copyNodes.map(node => [node.dataset.t, node.textContent]));
  const localizedAttributes = [['data-aria', 'aria-label'], ['data-alt', 'alt']];
  for (const [key, attribute] of localizedAttributes) {
    for (const node of document.querySelectorAll('[' + key + ']')) {
      original[node.getAttribute(key)] = node.getAttribute(attribute);
    }
  }
  const supported = Object.keys(text);
  let language = new URL(location.href).searchParams.get('lang');
  if (!supported.includes(language)) {
    try { language = localStorage.getItem('interscape-lang'); } catch { language = 'ko'; }
  }
  if (!supported.includes(language)) language = 'ko';

  let inView = true;
  let busy = false;
  let timeout = 0;
  let filmOpener;
  function t(key) {
    return text[language][key] ?? window.storyCopy?.[language]?.[key] ?? original[key];
  }
  function updateCue() {
    label.textContent = t(document.body.dataset.dream === 'other' ? 'back' : 'snap');
  }
  function localize(next, remember) {
    language = next;
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : next;
    picker.value = next;
    document.title = t('title');
    for (const node of copyNodes) node.textContent = t(node.dataset.t);
    for (const [attr, target] of localizedAttributes) {
      for (const node of document.querySelectorAll('[' + attr + ']')) node.setAttribute(target,t(node.getAttribute(attr)));
    }
    for (const meta of document.querySelectorAll('meta[name="description"],meta[property="og:description"]')) meta.content = t('meta');
    if (remember) {
      const url = new URL(location.href);
      url.searchParams.set('lang', next);
      history.replaceState(null, '', url);
      try { localStorage.setItem('interscape-lang', next); } catch { /* The current page still changes language. */ }
    }
    updateCue();
    document.dispatchEvent(new CustomEvent('dreamlanguage', {detail: next}));
  }
  picker.addEventListener('change', () => localize(picker.value,true));

  // A real, forward-playing shot connects the two stills. Reset uses a straight cut.
  function settle(other) {
    busy = false;
    clearTimeout(timeout);
    clip.pause();
    snap.removeAttribute('data-busy');
    frame.dataset.mode = other ? 'other' : 'first';
    document.body.dataset.dream = other ? 'other' : 'first';
    updateCue();
    announcement.textContent = t(other ? 'ash' : 'amber');
  }
  function finishCut() {
    if (busy) settle(true);
  }
  function changeDream() {
    if (busy || dialog.open) return;
    if (document.body.dataset.dream === 'other') { settle(false); return; }
    if (reduced.matches || navigator.connection?.saveData) { settle(true); return; }
    busy = true;
    snap.setAttribute('data-busy','');
    if (!clip.src) clip.src = 'shift/art/shift.mp4';
    else clip.currentTime = 0;
    timeout = window.setTimeout(finishCut, 3500);
    clip.play().catch(finishCut);
  }
  clip.addEventListener('playing', () => {
    if (!busy) { clip.pause(); return; }
    frame.dataset.mode = 'playing';
  });
  clip.addEventListener('ended', finishCut);
  clip.addEventListener('error', finishCut);
  reduced.addEventListener('change', () => { if (reduced.matches) finishCut(); });
  snap.addEventListener('click', changeDream);
  document.addEventListener('keydown', event => {
    if (event.code !== 'Space' || event.repeat || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || !inView || dialog.open || document.querySelector('dialog[open]')) return;
    if (event.target.closest('button,a,input,textarea,select,summary,video,[contenteditable]')) return;
    event.preventDefault();
    changeDream();
  });
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting && entry.intersectionRatio >= .48;
    if (!inView) finishCut();
  }, {threshold:[0,.48]}).observe(frame);
  document.addEventListener('visibilitychange', () => { if (document.hidden) finishCut(); });

  for (const opener of document.querySelectorAll('[data-trailer]')) opener.addEventListener('click', event => {
    if (typeof dialog.showModal !== 'function' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (dialog.open) return;
    finishCut();
    filmOpener = opener;
    document.querySelectorAll('video').forEach(video => video.pause());
    const iframe = document.createElement('iframe');
    iframe.title = t('trailer');
    iframe.src = 'https://www.youtube-nocookie.com/embed/OuanYzbB6oQ?autoplay=1&rel=0';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    filmHost.replaceChildren(iframe);
    dialog.showModal();
    dialog.querySelector('[data-close]').focus();
  });
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target===dialog && (event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    filmHost.replaceChildren();
    filmOpener?.focus({preventScroll:true});
  });
  localize(language,false);
  snap.hidden = false;

  const priorSections = {'#main':'#lobby', '#dreams':'#worlds', '#media':'#cut-player', '#news':'#journal', '#info':'#information'};
  const section = priorSections[location.hash];
  if (section) {
    const destination = new URL(location.href);
    destination.hash = section;
    history.replaceState(null, '', destination);
    document.querySelector(section)?.scrollIntoView();
  }
})();
