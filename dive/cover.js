(() => {
  'use strict';
  const labels = {
    ko: {
      title:'INTER•SCAPE | 인터스케이프', meta:'검은 구체가 나타난 뒤, 사람들은 꿈에서 깨어나지 못했다. 다른 사람의 꿈에 들어갈 수 있는 요원 케이가 이들을 구하러 나선다. 룸톤게임즈의 액션 어드벤처 INTER•SCAPE.',
      enter:'꿈속으로 들어가기', leave:'꿈에서 나오기', portalDesc:'구체 안에 보이는 장면을 크게 봅니다.', choose:'꿈 장면 선택',
      halo:'빛의 고리', goggles:'꿈의 주인을 찾아라', screens:'모니터실', fullPhoto:'스크린샷 크게 보기', failure:'장면을 불러오지 못했습니다. 다시 선택해 주세요.',
      coverAlt:'붉은 꽃밭에 우주복을 입은 사람이 서 있고, 그 위로 거대한 구체가 떠 있다.', haloAlt:'빛나는 고리 앞에 사람이 떠 있다. 주변으로 보랏빛 선들이 휘어져 있다.', gogglesAlt:'흑백 화면 속 곰이 모자를 쓰고 코트를 입고 있다. 왼쪽 위에는 꿈의 주인을 찾으라는 목표가 보인다.', screensAlt:'천장에 매달린 모니터 세 대가 초록빛을 낸다. 그 아래 두 사람이 서 있다.',
      leadOne:'검은 구체가 나타난 뒤,', leadTwo:'사람들은 꿈에서 깨어나지 못했다.', menu:'메뉴', trailerTitle:'공식 트레일러', motionPlay:'영상 재생', motionReplay:'다시 재생', motionPause:'일시 정지', motionError:'영상을 불러오지 못했습니다. 다시 시도해 주세요.', release:'출시 예정', nav:'주 메뉴', storyNav:'이야기', playNav:'게임플레이', journalNav:'개발 소식', infoNav:'게임 정보',
      language:'언어', skip:'본문으로', trailer:'트레일러 보기', wish:'스팀에서 찜하기', close:'닫기', youtube:'YouTube에서 보기 ↗'
    },
    en: {
      title:'INTER•SCAPE', meta:'A black sphere hangs in the sky, and people are trapped in their dreams. Play as Agent K in INTER•SCAPE, an action adventure from ROOMTONE Games.',
      enter:'Enter the dream', leave:'Leave dream', portalDesc:'Open the scene inside the black sphere.', choose:'Choose a dream scene',
      halo:'Halo', goggles:'Find the Dream Host', screens:'Monitor room', fullPhoto:'Full screenshot', failure:'This scene could not load. Select it again to retry.',
      coverAlt:'An astronaut stands in a field of red flowers beneath an enormous sphere.', haloAlt:'A figure floats in front of a bright ring, surrounded by trails of violet light.', gogglesAlt:'A bear in a hat and coat, in black and white. The objective at the top reads “Find the Dream Host”.', screensAlt:'Three green monitors hang from the ceiling above two people.',
      leadOne:'A black sphere appeared.', leadTwo:'Now the dreamers can’t wake up.', menu:'Menu', trailerTitle:'Official trailer', motionPlay:'Play clip', motionReplay:'Replay clip', motionPause:'Pause clip', motionError:'The clip could not load. Try playing it again.', release:'Coming soon', nav:'Main navigation', storyNav:'Story', playNav:'Gameplay', journalNav:'News', infoNav:'Game info',
      language:'Language', skip:'Skip to content', trailer:'Watch trailer', wish:'Wishlist on Steam', close:'Close', youtube:'Watch on YouTube ↗'
    },
    zh: {
      title:'INTER•SCAPE', meta:'黑色球体出现后，人们被困在梦中。在 ROOMTONE Games 的动作冒险游戏 INTER•SCAPE 中，扮演特工 K，进入他人的梦境。',
      enter:'进入梦境', leave:'离开梦境', portalDesc:'展开黑色球体中的画面。', choose:'选择梦境画面',
      halo:'光环', goggles:'寻找梦境的主人', screens:'三块屏幕', fullPhoto:'查看完整截图', failure:'画面加载失败，请重新选择。',
      coverAlt:'身穿宇航服的人站在红色花田里，头顶悬着一个巨大的球体。', haloAlt:'一个人悬浮在明亮的光环前，周围环绕着紫色光迹。', gogglesAlt:'黑白画面中，一只熊穿着大衣，头戴礼帽。左上角的任务提示要求寻找梦境的主人。', screensAlt:'三台泛着绿光的显示器悬在天花板上，下方站着两个人。',
      leadOne:'黑色球体出现后，', leadTwo:'人们再也没有醒来。', menu:'菜单', trailerTitle:'官方预告片', motionPlay:'播放片段', motionReplay:'重播片段', motionPause:'暂停', motionError:'片段加载失败，请重试。', release:'即将推出', nav:'主导航', storyNav:'故事', playNav:'玩法', journalNav:'动态', infoNav:'游戏信息',
      language:'语言', skip:'跳至正文', trailer:'观看预告片', wish:'加入 Steam 愿望单', close:'关闭', youtube:'在 YouTube 上观看 ↗'
    }
  };
  const frame = document.querySelector('.frame');
  const enter = document.getElementById('enter');
  const leave = document.getElementById('leave');
  const strip = document.querySelector('.stills');
  const name = document.getElementById('scene-name');
  const release = frame.querySelector('.release');
  const description = document.getElementById('visual-description');
  const fullPhoto = document.getElementById('full-photo');
  const status = document.getElementById('scene-status');
  const buttons = [...strip.querySelectorAll('[data-photo]')];
  const keys = buttons.map(button => button.dataset.photo);
  const picker = document.getElementById('language');
  const dialog = document.getElementById('trailer-modal');
  const filmHost = dialog.querySelector('.film-host');
  const mast = document.querySelector('.mast');
  const menu = document.getElementById('menu-toggle');
  const smallScreen = matchMedia('(max-width:680px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const roomFilm = document.getElementById('monitor-film');
  const roomPlay = document.getElementById('monitor-play');
  const roomLabel = document.getElementById('monitor-label');
  const optics = frame.querySelector('.optics');
  const stage = frame.querySelector('.window');
  const nodes = [...document.querySelectorAll('[data-t]')];
  const attributes = [...document.querySelectorAll('[data-aria]')];
  const original = Object.fromEntries(nodes.map(n => [n.dataset.t,n.textContent]));
  for (const node of attributes) original[node.dataset.aria] = node.getAttribute('aria-label');
  let language = new URL(location.href).searchParams.get('lang');
  if (!Object.hasOwn(labels,language)) {
    try { language = localStorage.getItem('interscape-lang'); } catch { language = 'ko'; }
  }
  if (!Object.hasOwn(labels,language)) language = 'ko';
  let active = 'halo';
  let inside = false;
  let request = 0;
  let opener;
  let peekTimer;
  let fade;
  let motionRequest = 0;
  function t(key) { return labels[language][key] ?? window.storyCopy?.[language]?.[key] ?? original[key]; }
  function setLanguage(next, remember) {
    language = next;
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : next;
    picker.value = next;
    for (const node of nodes) node.textContent = t(node.dataset.t);
    for (const node of attributes) node.setAttribute('aria-label',t(node.dataset.aria));
    document.title = t('title');
    for (const meta of document.querySelectorAll('meta[name="description"],meta[property="og:description"]')) meta.content = t('meta');
    name.textContent = t(active);
    description.setAttribute('aria-label', t(inside ? active+'Alt' : 'coverAlt'));
    clearStatus();
    updateMotionLabel();
    if (remember) {
      const url = new URL(location.href);
      url.searchParams.set('lang',next);
      history.replaceState(null,'',url);
      try { localStorage.setItem('interscape-lang',next); } catch { /* The selection still applies to this page. */ }
    }
    document.dispatchEvent(new CustomEvent('dreamlanguage',{detail:next}));
  }
  picker.addEventListener('change',() => setLanguage(picker.value,true));
  function closeMenu() {
    mast.removeAttribute('data-open');
    menu.setAttribute('aria-expanded','false');
  }
  function adjustMenu() {
    closeMenu();
    menu.hidden = !smallScreen.matches;
  }
  mast.setAttribute('data-enhanced','');
  adjustMenu();
  smallScreen.addEventListener('change',adjustMenu);
  menu.addEventListener('click',event => {
    const open = mast.toggleAttribute('data-open');
    menu.setAttribute('aria-expanded',String(open));
    if (open && event.detail===0) mast.querySelector('nav a').focus({preventScroll:true});
  });
  mast.querySelector('nav').addEventListener('click',closeMenu);
  document.addEventListener('pointerdown',event => { if (!mast.contains(event.target)) closeMenu(); });
  mast.addEventListener('focusout',event => { if (!mast.contains(event.relatedTarget)) closeMenu(); });
  document.addEventListener('keydown',event => {
    if (event.key==='Escape' && mast.hasAttribute('data-open')) {
      closeMenu();
      menu.focus();
      event.preventDefault();
    }
  });
  function clearStatus() {
    status.removeAttribute('data-error');
    status.textContent = '';
  }
  function showError(key) {
    status.setAttribute('data-error','');
    status.textContent = t(key);
  }
  function updateMotionLabel() {
    const state = roomFilm.ended ? 'replay' : roomFilm.paused ? 'ready' : 'playing';
    roomPlay.dataset.state = state;
    roomLabel.textContent = t({ready:'motionPlay',playing:'motionPause',replay:'motionReplay'}[state]);
  }
  function stopMotion() {
    motionRequest++;
    roomFilm.pause();
    roomFilm.hidden = true;
    if (roomFilm.readyState) roomFilm.currentTime = 0;
    updateMotionLabel();
  }
  roomPlay.addEventListener('click',async () => {
    if (!inside || active !== 'screens') return;
    clearStatus();
    if (!roomFilm.paused) { roomFilm.pause(); return; }
    const ticket = ++motionRequest;
    if (!roomFilm.hasAttribute('src') || roomFilm.error) {
      roomFilm.poster = 'dive/motion/screens-poster.webp';
      roomFilm.src = 'dive/motion/screens.mp4';
    }
    if (roomFilm.ended) roomFilm.currentTime = 0;
    try {
      await roomFilm.play();
      if (ticket === motionRequest && inside && active === 'screens') roomFilm.hidden = false;
    } catch {
      if (ticket === motionRequest) { roomFilm.hidden = true; showError('motionError'); }
    }
    updateMotionLabel();
  });
  for (const event of ['playing','pause','ended']) roomFilm.addEventListener(event,updateMotionLabel);
  document.addEventListener('visibilitychange',() => { if (document.hidden) roomFilm.pause(); });
  new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) roomFilm.pause(); }).observe(frame);

  function imageFor(key) { return document.getElementById('photo-'+key); }
  function releaseFade() {
    if (fade) { fade.cancel(); fade = null; }
    stage.querySelector('.outgoing')?.remove();
  }
  function dissolve() {
    releaseFade();
    if (reduced.matches) return;
    const copy = imageFor(active).cloneNode(false);
    copy.removeAttribute('id');
    copy.dataset.image = active;
    copy.classList.add('outgoing');
    stage.append(copy);
    fade = copy.animate([{opacity:1},{opacity:0}],{duration:330,easing:'ease-out',fill:'forwards'});
    fade.onfinish = () => { copy.remove(); fade = null; };
  }
  function displayScene(key, open) {
    if (key!==active && inside===open) dissolve();
    else releaseFade();
    if (key!==active || inside!==open) stopMotion();
    for (const button of buttons) {
      const selected = button.dataset.photo===key;
      imageFor(button.dataset.photo).hidden = !selected;
      button.setAttribute('aria-pressed',String(selected));
    }
    active = key;
    inside = open;
    frame.dataset.scene = key;
    frame.dataset.inside = String(open);
    document.body.dataset.dream = open ? 'other' : 'first';
    enter.hidden = open;
    leave.hidden = !open;
    name.parentElement.hidden = !open;
    release.hidden = open;
    roomPlay.hidden = !open || key!=='screens';
    name.textContent = t(key);
    description.setAttribute('aria-label',t(open ? key+'Alt' : 'coverAlt'));
    fullPhoto.href = imageFor(key).src;
    clearStatus();
    if (open) status.textContent = t(key);
  }
  async function selectScene(key, open, moveFocus=false) {
    clearTimeout(peekTimer);
    if (!open && (inside || frame.hasAttribute('aria-busy') || key===active)) return;
    const ticket = ++request;
    const image = imageFor(key);
    if (!image.hasAttribute('src')) image.src = image.dataset.src;
    if (open) frame.setAttribute('aria-busy','true');
    try {
      await image.decode();
      if (ticket!==request) return;
      displayScene(key,open);
      if (moveFocus) leave.focus({preventScroll:true});
      else if (open && frame.getBoundingClientRect().bottom < Math.min(frame.clientHeight,innerHeight)*.7) {
        frame.scrollIntoView({block:'start'});
      }
    } catch {
      if (ticket!==request) return;
      image.removeAttribute('src');
      if (open) showError('failure');
    } finally {
      if (ticket===request) frame.removeAttribute('aria-busy');
    }
  }
  function cover() {
    ++request;
    clearTimeout(peekTimer);
    frame.removeAttribute('aria-busy');
    displayScene(active,false);
    enter.focus({preventScroll:true});
  }
  enter.addEventListener('click',() => selectScene(active,true,true));
  leave.addEventListener('click',cover);
  enter.addEventListener('pointermove',event => {
    if (event.pointerType!=='mouse' || reduced.matches) return;
    const box=enter.getBoundingClientRect();
    optics.style.setProperty('--light-x',Math.round(100*(event.clientX-box.left)/box.width)+'%');
    optics.style.setProperty('--light-y',Math.round(100*(event.clientY-box.top)/box.height)+'%');
    optics.setAttribute('data-lit','');
  });
  enter.addEventListener('pointerleave',() => optics.removeAttribute('data-lit'));
  for (const [index,button] of buttons.entries()) {
    button.addEventListener('pointerenter',event => {
      if (event.pointerType!=='mouse' || inside) return;
      peekTimer = setTimeout(() => selectScene(button.dataset.photo,false),180);
    });
    button.addEventListener('pointerleave',() => clearTimeout(peekTimer));
    button.addEventListener('focus',() => {
      if (!inside && button.matches(':focus-visible')) selectScene(button.dataset.photo,false);
    });
    button.addEventListener('click',() => selectScene(button.dataset.photo,true));
    button.addEventListener('keydown',event => {
      const target = {ArrowLeft:(index+keys.length-1)%keys.length,ArrowRight:(index+1)%keys.length,Home:0,End:keys.length-1}[event.key];
      if (target===undefined) return;
      event.preventDefault();
      buttons[target].focus();
      selectScene(keys[target],inside);
    });
  }
  document.addEventListener('keydown',event => {
    if (!inside || document.querySelector('dialog[open]') || event.defaultPrevented || event.key !== 'Escape') return;
    const bounds = frame.getBoundingClientRect();
    if (bounds.bottom > innerHeight*.3 && bounds.top < innerHeight*.7) cover();
  });
  let touch;
  frame.addEventListener('touchstart',event => {
    if (!inside || event.touches.length!==1 || event.target.closest('a,button,select')) { touch=null; return; }
    touch = [event.touches[0].clientX,event.touches[0].clientY];
  },{passive:true});
  frame.addEventListener('touchcancel',() => { touch=null; });
  frame.addEventListener('touchend',event => {
    if (!touch) return;
    const dx = event.changedTouches[0].clientX - touch[0];
    const dy = event.changedTouches[0].clientY - touch[1];
    touch=null;
    if (Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.5) {
      const next = (keys.indexOf(active)+(dx<0?1:-1)+keys.length)%keys.length;
      selectScene(keys[next],true);
    }
  },{passive:true});
  fullPhoto.addEventListener('click',event => {
    const viewer = document.getElementById('still-dialog');
    if (!viewer?.hasAttribute('data-ready') || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    roomFilm.pause();
    const scenes = keys.map(key => ({key,name:t(key),alt:t(key+'Alt'),src:imageFor(key).dataset.src}));
    viewer.dispatchEvent(new CustomEvent('showphoto',{detail:{key:active,scenes,language,opener:fullPhoto}}));
  });
  for (const trigger of document.querySelectorAll('[data-trailer]')) trigger.addEventListener('click',event => {
    if (typeof dialog.showModal!=='function' || event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) return;
    event.preventDefault();
    opener=trigger;
    document.querySelectorAll('video').forEach(v => v.pause());
    const video=document.createElement('iframe');
    video.title=t('trailer');
    video.src='https://www.youtube-nocookie.com/embed/OuanYzbB6oQ?autoplay=1&rel=0';
    video.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    video.referrerPolicy='strict-origin-when-cross-origin';
    video.allowFullscreen=true;
    filmHost.replaceChildren(video);
    dialog.showModal();
    dialog.querySelector('[data-close]').focus();
  });
  dialog.querySelector('[data-close]').addEventListener('click',() => dialog.close());
  dialog.addEventListener('click',event => {
    if (event.target !== dialog) return;
    const box=dialog.getBoundingClientRect();
    if (event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom) dialog.close();
  });
  dialog.addEventListener('close',() => { filmHost.replaceChildren(); opener?.focus({preventScroll:true}); });
  setLanguage(language,false);
  enter.hidden=false;
  strip.hidden=false;
  const oldSections={'#main':'#lobby','#dreams':'#lobby','#media':'#cut-player','#news':'#journal','#info':'#information'};
  if (Object.hasOwn(oldSections,location.hash)) {
    const url=new URL(location.href);
    url.hash=oldSections[location.hash];
    history.replaceState(null,'',url);
    document.querySelector(url.hash).scrollIntoView();
  }
})();
