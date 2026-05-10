# onboarding-video-generator

A Claude Code skill that produces short, column-sized web app onboarding videos in [Remotion](https://www.remotion.dev). Each video showcases one feature working — a single button click, a modal opening, a row landing in a list — with the kind of UI motion that goes well next to body copy in a two-column block on a marketing page.

Default output is **1280×960 (4:3 column)**, silent, looping, ~10–15 seconds, around 1 MB MP4.

## Why

Most "feature video" tools render full-screen demos that get shrunk into a column on a marketing page until the text is unreadable. This skill optimizes for the column placement from the start: focal UI piece, big top caption, no audio, clean loop seam.

## Example

VerifyWise "Add task" feature, ~12s. Five beats: toolbar with Add button → modal opens → form fills (typing, priority flip, date) → submit → result with summary cards ticking and new row sliding in.

https://github.com/user-attachments/assets/dabf7f9f-0ec0-4faa-bea2-bf68dc3b6eca


If your browser doesn't render the embed, [download the MP4](./examples/add-task-verifywise.mp4).

## Install (as a Claude Code skill)

```bash
git clone https://github.com/gorkem-bwl/onboarding-video-generator.git \
  ~/.claude/skills/create-onboarding-video
```

Then in any Claude Code session, invoke the skill or describe a feature video task — the skill auto-discovers based on the description in `SKILL.md`.

## What's inside

```
SKILL.md                                 The skill prompt + workflow
resources/
  scaffold/                              Complete Remotion project to copy per-video
    src/
      Root.tsx, Composition.tsx          Wired to render BEATS automatically
      beats.ts                           Beat / SceneGroup schema + duration math
      tokens.ts                          Design tokens (replace per-project)
      components/
        TopCaption.tsx                   Top-anchored caption with rise / static modes
        Pointer.tsx                      macOS cursor with waypoint glide + click ripples
        DebugCrosshair.tsx               Authoring-time coordinate verification
      scenes/
        beats-config.ts                  Single source of timing truth
        ExampleBeat.tsx, ExampleGroup.tsx
    scripts/
      preflight.js                       Pre-render checks (DebugCrosshair leftovers, missing assets)
    package.json, tsconfig.json, remotion.config.ts
  state-archetypes.md                    Match feature to archetype, get screenshot list
  cursor-component.md                    Pointer contract + common mistakes
  coordinate-picker.html                 Browser tool: click on screenshot, get Pointer JSX
  rebuild-parity-checklist.md            Checklist for rebuilt UI slices
examples/
  add-task-verifywise.mp4                Reference render
```

## Authoring loop

1. **Intake** — match the feature to an archetype in `resources/state-archetypes.md`, ask the user for the screenshots that archetype needs.
2. **Scaffold** — copy `resources/scaffold/` to a new folder (e.g. `<project>/remotion/<feature>/`).
3. **Pin Remotion** — replace `"latest"` in `package.json` with the actual current version (`npm view remotion version`). Inventing versions costs you a render.
4. **Define beats** — edit `src/scenes/beats-config.ts`. Add or remove a beat and the composition reshapes itself; total duration is computed automatically.
5. **Position cursors** — open `resources/coordinate-picker.html` in a browser, drop the screenshot in, click targets, copy the generated `<Pointer>` config into your scene.
6. **Verify** — drop `<DebugCrosshair x={...} y={...}/>` at click coords, run `npm run render:still -- --frame=N`. Adjust before full render.
7. **Render & ship** — `SHIP_DEST=/path/to/website/public/videos/features npm run ship` builds MP4 + WebM and copies into the website repo.

## VerifyWise example

This skill was built for [VerifyWise](https://verifywise.ai)'s marketing site and the included defaults reflect that: 4:3 column canvas, `#13715B` green primary, `#d0d5dd` borders, 4px corner radius, sentence case captions, screenshots supplied per-video. See the "VerifyWise defaults" section in [`SKILL.md`](./SKILL.md) — replace those tokens in `tokens.ts` for your own project.

## License

MIT — see [LICENSE](./LICENSE).
