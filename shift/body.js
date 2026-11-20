(() => {
  const cinema = document.querySelector("[data-cut-cinema]");
  if (!cinema) return;
  const player = cinema.querySelector("video");
  const source = player.querySelector("source");
  const reels = {
    corridor: { video: "media/v3-action-play.mp4", poster: "img/v3-action-poster.webp" },
    room: { video: "media/action-play.mp4", poster: "img/action-play-ui-poster.webp" },
    snap: { video: "shift/art/shift.mp4", poster: "shift/art/before.webp" }
  };
  const specs = document.querySelector("[data-cut-store-language]");
  function updateStoreLink() {
    const locale = document.documentElement.lang.split("-")[0];
    const url = new URL(specs.href);
    url.searchParams.set("l", { ko: "koreana", zh: "schinese", en: "english" }[locale] || "english");
    specs.href = url.href;
  }
  if (specs) {
    updateStoreLink();
    document.addEventListener("dreamlanguage", updateStoreLink);
  }
  const controls = cinema.querySelectorAll("[data-cut-reel]");
  controls.forEach(button => button.addEventListener("click", () => {
    if (button.getAttribute("aria-pressed") === "true") return;
    const name = button.dataset.cutReel;
    const resume = !player.paused && !player.ended;
    controls.forEach(control => control.setAttribute("aria-pressed", String(control === button)));
    cinema.querySelectorAll("[data-cut-note]").forEach(note => { note.hidden = note.dataset.cutNote !== name; });
    player.poster = reels[name].poster;
    source.src = reels[name].video;
    player.load();
    if (resume) player.play().catch(() => {});
  }));
  document.addEventListener("visibilitychange", () => { if (document.hidden) player.pause(); });
  document.addEventListener("click", event => {
    if (event.target.closest("[data-trailer]")) player.pause();
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) player.pause();
    }).observe(player);
  }
})();
