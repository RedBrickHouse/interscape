(() => {
  'use strict';

  const atlas = document.querySelector('.frontispiece');
  const orrery = atlas.querySelector('.orrery');
  const planet = atlas.querySelector('.planet-art');
  const art = planet.querySelector('img');
  const choices = [...atlas.querySelectorAll('[data-world-choice]')];
  const motion = atlas.querySelector('.still-toggle');
  const film = document.querySelector('.atlas-dialog');
  const viewer = document.querySelector('.picture-viewer');
  const openPlate = document.querySelector('.open-plate');
  const fullImage = viewer.querySelector('.unfolded-image');
  const screen = film.querySelector('.film-screen');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const maps = {
    flowers: { plate: 'Fig. I', ink: '#72463c' },
    noir: { plate: 'Fig. II', ink: '#48595b' },
    neon: { plate: 'Fig. III', ink: '#694368' }
  };
  const openingCopy = {
    ko: {
      expandWorld: '꿈 풍경 크게 보기', next: '다음 풍경', previous: '이전 풍경',
      genre: '스토리 액션 어드벤처', coming: '출시 예정', skip: '본문으로', nav: '목차', language: '언어', navStory: '이야기', navPlay: '플레이', navJournal: '개발 소식', navInfo: '게임 정보',
      lead: '잠든 이들을 깨우기 위해, 요원 케이는 타인의 꿈으로 들어갑니다.', wish: 'Steam에서 찜하기', film: '공식 트레일러',
      worlds: '꿈의 색인', choose: '꿈 풍경 선택', flowers: '붉은 꽃밭', noir: '흑백 골목', neon: '네온 도시',
      flowersAlt: '붉은 꽃밭과 돌기둥 사이로 빛의 고리가 떠 있다.', noirAlt: '흑백 골목의 낡은 자동차 옆에 케이가 서 있다.', neonAlt: '네온으로 빛나는 도로를 향해 인물이 떨어진다.',
      motion: '배경 움직임 멈추기', resume: '배경 움직임 재생', close: '닫기', youtube: 'YouTube에서 보기 ↗',
      description: '요원 케이와 함께 꿈의 지도첩을 펼쳐 보세요. ROOMTONE Games의 스토리 액션 어드벤처 INTER•SCAPE.'
    },
    en: {
      expandWorld: 'Enlarge dream landscape', next: 'Next landscape', previous: 'Previous landscape',
      genre: 'Story action adventure', coming: 'Coming soon', skip: 'Skip to content', nav: 'Contents', language: 'Language', navStory: 'Story', navPlay: 'Gameplay', navJournal: 'Journal', navInfo: 'Game info',
      lead: 'Agent K enters the dreams of others to find a way to wake the sleepers.', wish: 'Wishlist on Steam', film: 'Watch trailer',
      worlds: 'Dream index', choose: 'Choose a dream landscape', flowers: 'Red meadow', noir: 'Noir alley', neon: 'Neon city',
      flowersAlt: 'Rings of light hang above a red meadow punctuated by stone pillars.', noirAlt: 'K stands beside a vintage car in a monochrome alley.', neonAlt: 'A figure falls toward a neon-lit street.',
      motion: 'Pause background motion', resume: 'Resume background motion', close: 'Close', youtube: 'Watch on YouTube ↗',
      description: 'Explore the dreams of others with Agent K in INTER•SCAPE, a story-driven action adventure by ROOMTONE Games.'
    },
    zh: {
      expandWorld: '放大梦境风景', next: '下一幅风景', previous: '上一幅风景',
      genre: '剧情动作冒险', coming: '即将推出', skip: '跳至正文', nav: '目录', language: '语言', navStory: '故事', navPlay: '游戏玩法', navJournal: '开发日志', navInfo: '游戏资料',
      lead: '为了唤醒沉睡的人们，特工凯走进了他人的梦境。', wish: '加入 Steam 愿望单', film: '官方预告片',
      worlds: '梦境索引', choose: '选择梦境风景', flowers: '绯红花海', noir: '黑白小巷', neon: '霓虹都市',
      flowersAlt: '红色花海与石柱之间悬浮着发光的圆环。', noirAlt: '凯站在黑白小巷的一辆老式汽车旁。', neonAlt: '一个身影正落向霓虹闪烁的街道。',
      motion: '暂停背景动画', resume: '恢复背景动画', close: '关闭', youtube: '在 YouTube 上观看 ↗',
      description: '随特工凯进入他人的梦境，体验 ROOMTONE Games 的剧情动作冒险游戏 INTER•SCAPE。'
    }
  };
  const copyNodes = [...document.querySelectorAll('[data-copy]')];
  const defaultCopy = Object.fromEntries(copyNodes.map(node => [node.dataset.copy, node.textContent]));
  const url = new URL(location.href);
  let lang = url.searchParams.get('lang');
  if (!Object.hasOwn(openingCopy, lang)) {
    try { lang = localStorage.getItem('interscape-lang'); } catch { lang = 'ko'; }
  }
  if (!Object.hasOwn(openingCopy, lang)) lang = 'ko';
  let world = 'flowers';
  let paused = false;
  let inView = true;
  let opener;

  function translation(key) {
    return openingCopy[lang][key] ?? window.chapterCopy?.[lang]?.[key] ?? defaultCopy[key];
  }

  function syncMotion() {
    const needsStill = reduced.matches || navigator.connection?.saveData;
    atlas.classList.toggle('motion-live', !needsStill && !paused && inView && !document.hidden && !film.open && !viewer.open);
    motion.hidden = Boolean(needsStill);
    motion.setAttribute('aria-pressed', String(paused));
    motion.setAttribute('aria-label', translation(paused ? 'resume' : 'motion'));
  }
  function describePlate() {
    document.querySelector('#plate-name').textContent = translation(world);
    art.alt = translation(world + 'Alt');
    if (viewer.open) {
      fullImage.src = art.src;
      fullImage.alt = art.alt;
      viewer.querySelector('#view-name').textContent = translation(world);
      viewer.querySelector('.view-count').textContent = (Object.keys(maps).indexOf(world) + 1) + ' / 3';
    }
  }
  function setLanguage(next, changeUrl) {
    lang = next;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    for (const node of copyNodes) node.textContent = translation(node.dataset.copy);
    for (const node of document.querySelectorAll('[data-copy-aria]')) node.setAttribute('aria-label', translation(node.dataset.copyAria));
    for (const button of document.querySelectorAll('[data-lang]')) button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
    document.querySelector('meta[name="description"]').content = translation('description');
    document.querySelector('meta[property="og:description"]').content = translation('description');
    if (changeUrl) {
      const nextUrl = new URL(location.href);
      nextUrl.searchParams.set('lang', lang);
      history.replaceState(null, '', nextUrl);
      try { localStorage.setItem('interscape-lang', lang); } catch { /* Storage is optional. */ }
    }
    describePlate();
    syncMotion();
  }
  for (const button of document.querySelectorAll('[data-lang]')) button.addEventListener('click', () => setLanguage(button.dataset.lang, true));

  // Plot a static engraved chart at native resolution. Redraw only when its size or ink changes.
  const canvas = document.querySelector('#star-chart');
  const context = canvas.getContext('2d');
  function drawChart() {
    if (!context) return;
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = width * .505, cy = height * .49;
    const rx = width * .39, ry = height * .432;
    const ink = maps[world].ink;
    function line(x1, y1, x2, y2) {
      context.beginPath(); context.moveTo(x1, y1); context.lineTo(x2, y2); context.stroke();
    }
    function ellipse(x, y, a, b, tilt, opacity, dash = []) {
      context.globalAlpha = opacity;
      context.setLineDash(dash);
      context.beginPath();
      context.ellipse(x, y, a, b, tilt, 0, 2 * Math.PI);
      context.stroke();
      context.setLineDash([]);
    }
    context.strokeStyle = ink;
    context.fillStyle = ink;
    context.lineWidth = .85;
    context.save();
    context.translate(cx, cy);
    context.rotate(-.123);
    ellipse(0, 0, rx, ry, 0, .48);
    ellipse(0, 0, rx+5, ry+5, 0, .23);
    for (let mark=0; mark<180; mark++) {
      const angle=mark*Math.PI/90, length=mark%15===0 ? 10 : mark%5===0 ? 5 : 2;
      context.globalAlpha = mark%5===0 ? .55 : .29;
      line(rx*Math.cos(angle), ry*Math.sin(angle), (rx+length)*Math.cos(angle), (ry+length)*Math.sin(angle));
    }
    context.restore();
    const orbitTilt = { flowers: -.28, noir: .23, neon: -.48 }[world];
    ellipse(cx, cy+height*.025, width*.475, height*.22, orbitTilt, .55);
    ellipse(cx, cy, width*.431, height*.415, -.18, .40, [1,5]);
    // The small satellite and three points lie along the diagram, like pinholes in a print.
    [[.096,.64],[.78,.83],[.425,.075],[.88,.31]].forEach(([x,y],i)=>{
      const px=x*width,py=y*height;
      context.globalAlpha=.75;
      line(px-6,py,px+6,py);line(px,py-6,px,py+6);
      if(i===0||i===2) ellipse(px,py,3,3,0,.65);
    });
    context.globalAlpha=1;
  }
  new ResizeObserver(drawChart).observe(orrery);
  let changing = 0;
  async function selectWorld(next) {
    const requestId=++changing;
    if (next===world) return;
    const image = new Image();
    image.src = 'art/' + next + '.webp';
    try { await image.decode(); } catch { return; }
    if (requestId!==changing) return;
    const oldImage = art.cloneNode();
    oldImage.removeAttribute('id');
    oldImage.setAttribute('aria-hidden','true');
    oldImage.alt='';
    oldImage.style.cssText='position:absolute;inset:0;z-index:1';
    const animate = atlas.classList.contains('motion-live') && typeof art.animate === 'function';
    if (animate) planet.append(oldImage);
    world=next;
    atlas.dataset.world=next;
    art.src=image.src;
    describePlate();
    document.querySelector('#plate-figure').textContent=maps[next].plate;
    for (const button of choices) button.setAttribute('aria-pressed', String(button.dataset.worldChoice===next));
    drawChart();
    if (animate) {
      const fade=oldImage.animate([{opacity:1},{opacity:0}],{duration:520,easing:'ease-out',fill:'forwards'});
      fade.finished.finally(()=>oldImage.remove());
    }
  }
  choices.forEach((button,index)=>{
    button.addEventListener('click',()=>selectWorld(button.dataset.worldChoice));
    button.addEventListener('keydown',event=>{
      if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const choice=choices[(index+(event.key==='ArrowRight'?1:-1)+choices.length)%choices.length];
      choice.focus();choice.click();
    });
  });

  function stepPlate(direction) {
    const keys = Object.keys(maps);
    selectWorld(keys[(keys.indexOf(world) + direction + keys.length) % keys.length]);
  }
  openPlate.addEventListener('click', () => {
    viewer.showModal();
    describePlate();
    syncMotion();
    viewer.querySelector('[data-close-view]').focus();
  });
  viewer.querySelector('[data-close-view]').addEventListener('click', () => viewer.close());
  for (const button of viewer.querySelectorAll('[data-step]')) {
    button.addEventListener('click', () => stepPlate(Number(button.dataset.step)));
  }
  viewer.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    stepPlate(event.key === 'ArrowRight' ? 1 : -1);
  });
  viewer.addEventListener('close', () => { syncMotion(); openPlate.focus({preventScroll:true}); });
  viewer.addEventListener('click', event => {
    const box = viewer.getBoundingClientRect();
    if (event.target === viewer && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) viewer.close();
  });

  motion.addEventListener('click',()=>{paused=!paused;syncMotion();});
  reduced.addEventListener('change',syncMotion);
  document.addEventListener('visibilitychange',syncMotion);
  new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;syncMotion();}).observe(atlas);

  for(const trigger of document.querySelectorAll('[data-trailer]')) trigger.addEventListener('click',()=>{
    if(film.open) return;
    opener=trigger;
    document.querySelectorAll('video').forEach(video=>video.pause());
    const frame=document.createElement('iframe');
    frame.src='https://www.youtube-nocookie.com/embed/OuanYzbB6oQ?autoplay=1&rel=0';
    frame.title=translation('film');frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen=true; frame.referrerPolicy='strict-origin-when-cross-origin';
    screen.replaceChildren(frame); film.showModal(); syncMotion();
    film.querySelector('button').focus();
  });
  film.querySelector('[data-close-film]').addEventListener('click',()=>film.close());
  film.addEventListener('click',event=>{
    const rect=film.getBoundingClientRect();
    if(event.target===film && (event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))film.close();
  });
  film.addEventListener('close',()=>{screen.replaceChildren();syncMotion();opener?.focus({preventScroll:true});});
  setLanguage(lang,false);
})();
