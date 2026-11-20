(() => {
  const strip = document.querySelector('.dream-strip');
  if (!strip) return;
  const section = strip.closest('.dream-frames');
  const choices = [...strip.querySelectorAll('[data-frame]')];
  const caption = section.querySelector('#frame-caption');
  const copy = {
    ko: {
      title: '케이가 지나온 꿈', noir: '흑백 골목', neon: '네온 도시', field: '붉은 꽃밭',
      captions: ['골목을 가로막은 낡은 자동차. 케이 너머로 사람들의 그림자가 길게 드리운다.', '케이의 발아래로 네온사인이 뒤집힌 듯 펼쳐진다.', '붉은 꽃 사이에 돌기둥이 서 있고, 그 너머로 빛의 고리가 떠 있다.']
    },
    en: {
      title: 'Inside the dreams', noir: 'Noir alley', neon: 'Neon city', field: 'Red meadow',
      captions: ['An old car blocks the alley. Beyond K, the figures cast long shadows.', 'A street of neon signs stretches out beneath K’s feet.', 'Stone pillars rise from a field of red flowers. Rings of light hang in the distance.']
    },
    zh: {
      title: '凯走过的梦境', noir: '黑白小巷', neon: '霓虹都市', field: '红色花田',
      captions: ['一辆老式汽车挡在巷中。凯的前方，人影斜映在墙上。', '霓虹灯牌在凯的脚下铺展开来。', '石柱立在一片红花之间，远处的光环悬浮在空中。']
    }
  };
  let scene = 1;
  function lang() { return document.documentElement.lang.split('-')[0]; }
  function show(index) {
    scene = index;
    strip.dataset.selected = String(scene);
    for (const [i, button] of choices.entries()) button.setAttribute('aria-pressed', String(i === scene));
    caption.textContent = (copy[lang()] || copy.ko).captions[scene];
  }
  function localize() {
    const strings = copy[lang()] || copy.ko;
    for (const node of section.querySelectorAll('[data-frame-text]')) node.textContent = strings[node.dataset.frameText];
    show(scene);
  }
  for (const [index, button] of choices.entries()) {
    button.addEventListener('click', () => show(index));
    button.addEventListener('keydown', event => {
      const offsets = {ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1};
      if (!Object.hasOwn(offsets, event.key)) return;
      event.preventDefault();
      const next = (index + offsets[event.key] + choices.length) % choices.length;
      show(next);
      choices[next].focus();
    });
  }
  document.addEventListener('dreamlanguage', localize);
  localize();
})();
