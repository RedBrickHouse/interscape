(() => {
  'use strict';
  const dialog = document.getElementById('still-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const controls = {
    ko:{ close:'닫기', prev:'이전 장면', next:'다음 장면', original:'원본 파일', retry:'다시 시도', failed:'스크린샷을 불러오지 못했습니다.' },
    en:{ close:'Close', prev:'Previous scene', next:'Next scene', original:'Original file', retry:'Try again', failed:'The screenshot could not load.' },
    zh:{ close:'关闭', prev:'上一张', next:'下一张', original:'原图', retry:'重试', failed:'截图加载失败。' }
  };
  const title = dialog.querySelector('#still-title');
  const stage = dialog.querySelector('.still-stage');
  const mat = dialog.querySelector('.still-mat');
  const count = dialog.querySelector('.still-count');
  const file = dialog.querySelector('.still-file');
  const close = dialog.querySelector('.still-close');
  const previous = dialog.querySelector('.still-prev');
  const next = dialog.querySelector('.still-next');
  const error = dialog.querySelector('.still-error');
  const retry = dialog.querySelector('.still-retry');

  let scenes = [];
  let selected = 0;
  let request = 0;
  let copy = controls.ko;
  let opener;
  let touch;

  function caption(index) {
    const scene = scenes[index];
    title.textContent = scene.name;
    count.textContent = (index + 1) + ' / ' + scenes.length;
    file.href = scene.src;
  }

  async function show(index) {
    selected = index;
    const scene = scenes[index];
    const ticket = ++request;
    error.hidden = true;
    stage.setAttribute('aria-busy','true');
    const image = new Image();
    image.alt = scene.alt;
    image.width = 1920;
    image.height = 1080;
    image.decoding = 'async';
    image.draggable = false;
    image.src = scene.src;
    if (!mat.firstElementChild) caption(index);
    try {
      await image.decode();
      if (ticket !== request || !dialog.open) return;
      mat.replaceChildren(image);
      caption(index);
    } catch {
      if (ticket !== request || !dialog.open) return;
      error.hidden = false;
      error.querySelector('[role="status"]').textContent = copy.failed;
    } finally {
      if (ticket === request) stage.removeAttribute('aria-busy');
    }
  }
  function step(delta) {
    show((selected + delta + scenes.length) % scenes.length);
  }
  dialog.addEventListener('showphoto',event => {
    const detail = event.detail;
    scenes = detail.scenes;
    opener = detail.opener;
    copy = controls[detail.language] || controls.ko;
    close.setAttribute('aria-label',copy.close);
    previous.setAttribute('aria-label',copy.prev);
    next.setAttribute('aria-label',copy.next);
    file.querySelector('span').textContent = copy.original;
    retry.textContent = copy.retry;
    if (!dialog.open) dialog.showModal();
    show(Math.max(0,scenes.findIndex(scene => scene.key === detail.key)));
    close.focus({preventScroll:true});
  });
  close.addEventListener('click',() => dialog.close());
  previous.addEventListener('click',() => step(-1));
  next.addEventListener('click',() => step(1));
  retry.addEventListener('click',() => show(selected));
  dialog.addEventListener('keydown',event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();
      step(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  stage.addEventListener('touchstart',event => {
    touch = null;
    if (event.touches.length===1 && !event.target.closest('button')) {
      touch = [event.touches[0].clientX,event.touches[0].clientY];
    }
  },{passive:true});
  stage.addEventListener('touchcancel',() => { touch = null; });
  stage.addEventListener('touchend',event => {
    if (!touch) return;
    const dx = event.changedTouches[0].clientX - touch[0];
    const dy = event.changedTouches[0].clientY - touch[1];
    touch = null;
    if (Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.5) step(dx<0 ? 1 : -1);
  },{passive:true});
  dialog.addEventListener('click',event => {
    if (event.target!==dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom) dialog.close();
  });
  dialog.addEventListener('close',() => {
    if (dialog.open) return;
    request++;
    scenes = [];
    touch = null;
    mat.replaceChildren();
    error.hidden = true;
    stage.removeAttribute('aria-busy');
    if (opener?.isConnected) opener.focus({preventScroll:true});
    opener = null;
  });
  dialog.setAttribute('data-ready','');
})();
