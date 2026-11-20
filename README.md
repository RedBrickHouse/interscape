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

The sphere in the opening screenshot is the entry to three dream scenes. Select the sphere or a still to open a scene. A return button and Escape bring back the cover. On touchscreens, swipe to change the open scene. Reduced motion displays the same artwork with a direct cut. The body includes the story of Oracle, three playable excerpts, studio news and platform details.

The former review address `atlas/` forwards to the homepage, including supported language and section links. The original layout is archived at `atlas/dream-atlas.html`.

## Assets

Game artwork, logos and footage belong to their respective owners. Assets are used to present INTER•SCAPE and are not licensed for unrelated reuse. Release information and requirements follow the official Steam and PlayStation listings.
