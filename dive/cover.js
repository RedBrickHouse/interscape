(() => {
  'use strict';
  const labels = {
    ko: {
      title:'INTER•SCAPE | 인터스케이프', meta:'드림머신 오라클에 접속한 사람들이 깨어나지 않는다. 다이브 요원 케이는 그들을 깨우러 꿈에 들어간다. 룸톤게임즈의 액션 어드벤처 INTER•SCAPE.',
      enter:'꿈에 들어가기', leave:'꿈에서 나오기', portalDesc:'검은 구체 안의 장면을 화면 가득 엽니다.', choose:'꿈 장면 선택',
      halo:'빛의 고리', goggles:'모자 쓴 곰', screens:'녹색 모니터', fullPhoto:'전체 스크린샷', failure:'장면을 불러오지 못했습니다. 다시 선택해 주세요.',
      coverAlt:'붉은 꽃밭에 선 우주복 차림의 인물 위로 거대한 구체가 떠 있다.', haloAlt:'사람이 밝은 고리 앞에 떠 있고, 보랏빛 궤적이 몸을 두른다.', gogglesAlt:'흑백 화면 속 모자와 코트를 쓴 곰. 왼쪽 위에는 꿈의 주인을 찾으라는 목표가 적혀 있다.', screensAlt:'초록색 화면 세 대가 천장에 매달려 있다. 그 아래로 두 사람이 보인다.',
      credit:'룸톤게임즈의 액션 어드벤처', release:'출시 예정', nav:'주 메뉴', storyNav:'이야기', playNav:'게임플레이', journalNav:'소식', infoNav:'게임 정보',
      language:'언어', skip:'본문으로', trailer:'트레일러', wish:'Steam에서 찜하기', close:'닫기', youtube:'YouTube에서 보기 ↗'
    },
    en: {
      title:'INTER•SCAPE', meta:'Users of the Oracle dream machine have stopped waking up. Play as Agent K in INTER•SCAPE, an action adventure from ROOMTONE Games.',
      enter:'Enter the dream', leave:'Leave dream', portalDesc:'Open the scene inside the black sphere.', choose:'Choose a dream scene',
      halo:'Halo', goggles:'Bear in a hat', screens:'Green monitors', fullPhoto:'Full screenshot', failure:'This scene could not load. Select it again to retry.',
      coverAlt:'An astronaut stands in a field of red flowers beneath an enormous sphere.', haloAlt:'A figure floats in front of a bright ring, surrounded by trails of violet light.', gogglesAlt:'A bear in a hat and coat, in black and white. The objective at the top reads “Find the Dream Host”.', screensAlt:'Three green monitors hang from the ceiling above two people.',
      credit:'An action adventure by ROOMTONE Games', release:'Coming soon', nav:'Main navigation', storyNav:'Story', playNav:'Gameplay', journalNav:'News', infoNav:'Game info',
      language:'Language', skip:'Skip to content', trailer:'Watch trailer', wish:'Wishlist on Steam', close:'Close', youtube:'Watch on YouTube ↗'
    },
    zh: {
      title:'INTER•SCAPE', meta:'接入梦境机器 Oracle 的人们再也没有醒来。在 ROOMTONE Games 的动作冒险游戏 INTER•SCAPE 中，扮演特工 K，进入他人的梦境。',
      enter:'进入梦境', leave:'离开梦境', portalDesc:'展开黑色球体中的画面。', choose:'选择梦境画面',
      halo:'光环', goggles:'戴帽子的熊', screens:'绿色显示屏', fullPhoto:'查看完整截图', failure:'画面加载失败，请重新选择。',
      coverAlt:'身穿宇航服的人站在红色花田里，头顶悬着一个巨大的球体。', haloAlt:'一个人悬浮在明亮的光环前，周围环绕着紫色光迹。', gogglesAlt:'黑白画面中，一只熊穿着大衣，头戴礼帽。左上角的任务提示要求寻找梦境的主人。', screensAlt:'三台泛着绿光的显示器悬在天花板上，下方站着两个人。',
      credit:'ROOMTONE Games 出品的动作冒险游戏', release:'即将推出', nav:'主导航', storyNav:'故事', playNav:'玩法', journalNav:'动态', infoNav:'游戏信息',
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
    status.textContent = '';
    if (remember) {
      const url = new URL(location.href);
      url.searchParams.set('lang',next);
      history.replaceState(null,'',url);
      try { localStorage.setItem('interscape-lang',next); } catch { /* The selection still applies to this page. */ }
    }
    document.dispatchEvent(new CustomEvent('dreamlanguage',{detail:next}));
  }
  picker.addEventListener('change',() => setLanguage(picker.value,true));
  function displayScene(key, open) {
    for (const button of buttons) {
      const selected = button.dataset.photo === key;
      document.getElementById('photo-'+button.dataset.photo).hidden = !selected;
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
    name.textContent = t(key);
    description.setAttribute('aria-label',t(open ? key+'Alt' : 'coverAlt'));
    fullPhoto.href = document.getElementById('photo-'+key).src;
    status.textContent = open ? t(key) : '';
  }
  async function enterScene(key, moveFocus) {
    const ticket = ++request;
    const image = document.getElementById('photo-'+key);
    if (!image.hasAttribute('src')) image.src = image.dataset.src;
    frame.setAttribute('aria-busy','true');
    try {
      await image.decode();
      if (ticket !== request) return;
      displayScene(key,true);
      if (moveFocus) leave.focus({preventScroll:true});
      else if (frame.getBoundingClientRect().bottom < Math.min(frame.clientHeight,innerHeight)*.7) {
        frame.scrollIntoView({block:'start'});
      }
    } catch {
      if (ticket !== request) return;
      if (image.dataset.src) image.removeAttribute('src');
      status.textContent = t('failure');
    } finally {
      if (ticket === request) frame.removeAttribute('aria-busy');
    }
  }
  function cover() {
    ++request;
    frame.removeAttribute('aria-busy');
    displayScene(active,false);
    enter.focus({preventScroll:true});
  }
  enter.addEventListener('click',() => enterScene(active,true));
  leave.addEventListener('click',cover);
  for (const [index,button] of buttons.entries()) {
    button.addEventListener('click',() => enterScene(button.dataset.photo,false));
    button.addEventListener('keydown',event => {
      const target = {ArrowLeft:(index+keys.length-1)%keys.length,ArrowRight:(index+1)%keys.length,Home:0,End:keys.length-1}[event.key];
      if (target === undefined) return;
      event.preventDefault();
      buttons[target].focus();
      enterScene(keys[target],false);
    });
  }
  document.addEventListener('keydown',event => {
    if (!inside || dialog.open || event.defaultPrevented || event.key !== 'Escape') return;
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
      enterScene(keys[next],false);
    }
  },{passive:true});
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
