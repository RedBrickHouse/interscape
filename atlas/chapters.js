(() => {
  const film = document.getElementById('folio-film');
  if (!film) return;

  const reels = [
    { src: '../media/dream-switch.mp4', poster: '../img/dream-switch-poster.webp' },
    { src: '../media/v3-action-play.mp4', poster: '../img/v3-action-poster.webp' }
  ];
  const options = document.querySelectorAll('[data-film]');
  const captions = document.querySelectorAll('[data-film-caption]');
  options.forEach(button => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.film);
      if (button.getAttribute('aria-pressed') === 'true') return;

      const resume = !film.paused;
      film.pause();
      film.poster = reels[index].poster;
      film.querySelector('source').src = reels[index].src;
      film.setAttribute('aria-labelledby', 'folio-film-name-' + index);
      options.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
      captions.forEach(caption => { caption.hidden = Number(caption.dataset.filmCaption) !== index; });
      film.load();
      if (resume) film.play().catch(() => {});
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) film.pause();
  });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-trailer]')) film.pause();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) film.pause();
    }).observe(film);
  }
})();
