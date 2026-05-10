# Feature video — scaffold

Column-sized Remotion project (1280×960, 4:3, silent, looping) for a single feature video.

## First-time setup

```bash
# 1. Pin actual latest Remotion version (the package.json uses "latest" as a placeholder)
npm view remotion version
# Edit package.json — replace "latest" with the printed version on all 3 remotion entries.

# 2. Install
npm install

# 3. Live preview
npm start  # opens Remotion Studio at http://localhost:3000
```

## Authoring loop

1. Edit `src/scenes/beats-config.ts` — the `BEATS` array drives everything. Total duration is computed from this.
2. Add one component file per beat in `src/scenes/`, register it in `BEAT_COMPONENTS`.
3. For interactive beats, use `<Pointer>`. To position the click target precisely, drop in `<DebugCrosshair x={...} y={...} label="..." />` while authoring, render a still:

   ```bash
   npm run render:still -- --frame=200
   ```

   Verify the crosshair sits on the target. Remove the crosshair before final render.

## Render

```bash
npm run render        # both mp4 + webm
npm run render:mp4
npm run render:webm
```

## Ship

The ship script is destination-agnostic — set `SHIP_DEST` to where the rendered files should land:

```bash
SHIP_DEST=/path/to/website/public/videos/features npm run ship
```

For VerifyWise, `SHIP_DEST=../../public/videos/features` if this scaffold lives at `<website>/remotion/<feature>`.

## File map

```
src/
  index.ts                    Remotion entry point — do not edit
  Root.tsx                    Single Composition; computes total duration from BEATS
  Composition.tsx             Renders BEATS as a TransitionSeries — do not edit
  beats.ts                    Beat type, computeTotalDuration, CROSSFADE_FRAMES
  tokens.ts                   Design tokens (replace per project)
  components/
    TopCaption.tsx            Top-anchored caption (rise vs static)
    Pointer.tsx               macOS cursor with waypoint glide + click ripples
    DebugCrosshair.tsx        Authoring-time coord verification
  scenes/
    beats-config.ts           BEATS array + BEAT_COMPONENTS map (single source of timing truth)
    ExampleBeat.tsx           Replace with real beats
public/                       Drop screenshots here, reference via staticFile()
```
