# She Drives · At the Helm (motion edition)

Vertical 1080×1920 explainer reels in the "At the Helm" field-guide style, rendered from data.
One lesson = one JSON file in `lessons/`. The template is `src/AtTheHelm.tsx`.

## Render

```bash
npm install
scripts/render.sh 07-sound-signals      # one lesson -> out/07-sound-signals.mp4
scripts/render.sh all                   # every lesson in lessons/
npx remotion studio                     # live preview, edit timings in the browser
```

Render time is about 90 seconds per 23-second reel on a 2-core machine.

## Lesson file

See `src/lesson.ts` for the full schema. Fields:

- `number`, `title`, `subhead`, `cornerScript`, `scriptLine`, `cornerTag`
- `hero`: `{ "kind": "image", "image": "heroes/07.png" }` for a painted hero in `public/heroes/`,
  or `{ "kind": "blast-chart" }` for the built-in horn-signal hero
- `meaning`, `examples` (3 to 5 items; `icon` is a Lucide icon name or `blast:ss` style pattern), `tip`
- `cta` (shown and spoken in the final beat), `footnote` (source line)
- `beats`: start time in seconds of `meaning`, `examples`, `tip`, `cta`
- `vo` (optional): cue phrases per beat, used by `scripts/retime.py` to snap beats to Renee's recorded VO

## Painted heroes

Generate the still elsewhere (FLUX.1 schnell locally, Recraft, Ideogram, Higgsfield), then:

```bash
scripts/cutout.py heroes-in/07.png public/heroes/07.png   # background removal via rembg
```

and point `hero.image` at it.

## VO re-timing

Export captions as SRT from DaVinci Resolve (Timeline > Create Subtitles from Audio) or CapCut, then:

```bash
scripts/retime.py lessons/07-sound-signals.json vo/07.srt
scripts/render.sh 07-sound-signals
```

## Rules baked in

- Fonts: Bebas Neue (headline), Anton (brush labels), Caveat (script), Poppins (body). All Google Fonts, bundled in `public/fonts/`.
- Brand colors from the captain page: `#ee3d8f`, `#d3277e`, `#ff6aad`, `#2b282c`, `#1b181c`, `#fdf2f7`.
- Every lesson carries a `footnote` with its source. No source, no render.
- Music is never baked in. Cleared music only, added in the posting app.
