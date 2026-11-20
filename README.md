# INTER•SCAPE

Presentation website for INTER•SCAPE, a story-driven action adventure developed by ROOMTONE Games.

- Preview: https://redbrickhouse.gg/interscape/
- Steam: https://store.steampowered.com/app/3093160/INTERSCAPE/
- Developer: https://www.roomtonegames.com/

## Development

Static HTML, CSS and JavaScript with Korean, English and Simplified Chinese content. No build step or external JavaScript framework.

```sh
python3 -m http.server 8117 --bind 127.0.0.1
```

Open http://localhost:8117/. Use `?lang=ko`, `?lang=en` or `?lang=zh` to select a language.

GitHub Pages serves the root of the `main` branch. The review version retains `noindex, nofollow` metadata.

## Presentation

The sphere in the opening screenshot leads to three dream scenes. Hover or focus a still to preview it, then activate the sphere or still to enter. Open the image viewer for the uncropped screenshot, use the arrow keys or swipe to browse, and press Escape to return. The monitor room also has a manually played excerpt from the official trailer. Reduced motion uses direct cuts. The body includes the story of Oracle, three playable excerpts, studio news and platform details.

The former review address `atlas/` forwards to the homepage, including supported language and section links. The original layout is archived at `atlas/dream-atlas.html`.

## Assets

Game artwork, logos and footage belong to their respective owners. Assets are used to present INTER•SCAPE and are not licensed for unrelated reuse. Release information and requirements follow the official Steam and PlayStation listings.

Self-hosted text subsets in `dive/type/` are derived from Nanum Myeongjo, Noto Sans KR, Noto Serif SC and Spectral. Each subset is distributed with its original OFL license.
