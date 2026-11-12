# INTERSCAPE

Presentation website for INTERSCAPE, a story-driven action adventure developed by ROOMTONE Games.

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

Soft image edges and slow, decorative fog connect the game scenes. Text, gameplay controls and enlarged screenshots remain sharp. The background-motion button pauses both the video and fog; decorative motion also stops outside the viewport, behind dialogs, in hidden tabs, and when reduced motion or data saving is enabled.

## Assets

Game artwork, logos and footage belong to their respective owners. Assets are used to present INTERSCAPE and are not licensed for unrelated reuse. Release information and requirements follow the official Steam and PlayStation listings.
