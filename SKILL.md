---
name: create-onboarding-video
description: Produce short, punchy web app onboarding videos in Remotion that showcase a feature in action by animating isolated pieces of the UI (cropped components, not full pages) with nice UI-like transitions. Default output is column-sized (half-screen) for embedding next to copy in a two-column block on a marketing page. Use when the user asks to create, build, or generate an onboarding video, feature demo clip, in-page feature video, two-column feature block video, product launch video, or any short video that demonstrates a web app feature using supplied screenshots.
---

# Create Onboarding Video

Produce a **short, punchy web app onboarding video** in Remotion that showcases one feature working. Output is meant to drop into a **two-column feature block** on a marketing page — copy on one side, this video on the other — zoomed into the moment that proves the feature works. Not a tutorial, not a screen recording, not a marketing reel.

## What you make

- **Length:** short. 3–8 seconds per onboarding view, stitched together. Whole video rarely exceeds ~20s — these live next to copy on a marketing page, not in a standalone player.
- **Size:** **column-sized, not full-screen.** Default canvas is **1280×960 (4:3)** or **1200×900 (4:3)** — sized to fit one column of a two-column feature block at desktop widths, and to scale down cleanly to a stacked single-column on mobile. Square (1:1) is also fine when the layout calls for it. **Do not** default to 1920×1080 widescreen — that's a fullscreen video aspect, not a column aspect.
- **Style:** UI-first, **never the whole page**. Each beat shows a **piece of the feature in action** — a single button being clicked, a toggle flipping, a row reordering, a modal sliding in, a chart filling in, a dropdown opening — animated with **nice UI-like transitions** (springs, slides, scales, crossfades, masked reveals, shared-element swaps).
- **What "pieces" means:** crop, mask, or extract just the relevant component from the supplied still — the card, the input field, the nav bar, the sidebar item, the empty state turning into a filled state. The rest of the UI is omitted, blurred, or implied by a tinted background. We are showcasing **what the feature *does*,** not what the whole app looks like. This is doubly true at column size: a full-page screenshot shrunk into a column is unreadable, so cropping to a single component is non-negotiable.
- **Tone:** to the point. Each beat communicates one thing the feature does.
- **Loop-friendly.** Because these autoplay muted next to copy on a marketing page, the last frame should comfortably crossfade back to the first — design the end card / final beat so the loop point isn't jarring.
- **Output:** a Remotion project that renders to MP4 + WebM (the WebM is for `<video>` tag embedding on the marketing page). Optionally a square variant for stacked-mobile and a widescreen variant if a full-bleed hero placement is requested.

## Workflow

Follow this loop. **Do not skip the intake — guessing at flows produces generic videos.**

### 1. Intake — ask for stills + intent

For each onboarding view the user wants to feature, collect:

1. **Still shots (screenshots)** of the view — ask for **2–4 stills per view** so you can show interaction states:
   - resting state
   - mid-interaction (button hovered/pressed, field focused, modal halfway in, etc.)
   - result state (data loaded, success, next view)
   - any variant worth showing (empty vs. filled, light vs. dark, etc.)
2. **What the feature is** — one or two sentences on what this view does for the user and what makes it feel good. This drives which detail to zoom into.
3. **Order** — the sequence of views in the onboarding flow.
4. **Where it will live on the page** — confirm this is a column-embedded feature video (default) vs. a fullscreen hero video (rare). Default is column-sized (4:3 or 1:1).
5. **Optional:** brand color / accent, font if non-standard, target aspect ratio override (default 1280×960 / 4:3 column; 1080×1080 square; widescreen only if a fullscreen hero placement is confirmed), end-card text/CTA, whether it should loop seamlessly.

Use `AskUserQuestion` when the user is vague. **Match the feature to an archetype in `resources/state-archetypes.md`** before asking for screenshots — the archetype tells you exactly which states to capture (resting, mid-interaction, result, etc.) and removes the "I started authoring then realized I'm missing the focused state" bug. Don't start rendering until you have stills + intent for every view.

### 2. Plan the shots

For each view, identify the **single piece of the feature that proves the feature works** — the clicked button, the filling progress bar, the row that gets dragged, the field that auto-completes, the dropdown that expands — and how it transitions to the next beat. **Never animate the whole page.** Sketch the timeline (focal element → motion → result → next focal element) before writing components. Prefer:

- isolating/cropping/masking the relevant component out of the still and placing it on a tinted background
- showing the *interaction itself* (click ripple, drag, focus, hover, state change) rather than just the static layout
- shared-element transitions between beats (the button on beat 1 becomes the header on beat 2)
- subtle parallax / depth on layered elements
- spring-based motion over linear easing

### 3. Scaffold from `resources/scaffold/`

**Do not author from scratch.** The skill ships a complete Remotion scaffold at `resources/scaffold/`. Copy it into the target project — never reinvent the boilerplate.

```bash
cp -R <skill-dir>/resources/scaffold/ <project-dir>/
```

The scaffold gives you:
- `src/Root.tsx` + `src/Composition.tsx` — already wired to render whatever beats you define
- `src/beats.ts` — the `Beat` type and `computeTotalDuration()` helper. **Total composition duration is computed from the `BEATS` array — never hardcode `durationInFrames`.**
- `src/scenes/beats-config.ts` — the single source of timing truth. Edit `BEATS` here; the composition reshapes itself.
- `src/components/TopCaption.tsx`, `Pointer.tsx`, `DebugCrosshair.tsx` — pre-built and battle-tested. Don't rewrite them.
- `src/tokens.ts` — design tokens (replace per project; VerifyWise defaults are the comment).
- `package.json` with render + ship scripts.

### 4. Pin Remotion to the actual latest version

The scaffold's `package.json` lists `"latest"` for the three Remotion packages. **Resolve `latest` to a real version before installing** — do not invent versions:

```bash
npm view remotion version       # prints e.g. 4.0.459
# Edit package.json — replace all three "latest" entries with that exact version.
npm install
```

Inventing a version (e.g. `4.0.190`) will fail with `ETARGET notarget` and waste time.

### 5. Build with Remotion

**Always invoke the `remotion-best-practices` skill before writing scene code.** When you do, include this guidance:

> Build a short, **column-sized** web-app feature video (default canvas 1280×960, 4:3 — *not* widescreen). It's destined to autoplay muted inside one half of a two-column block on a marketing page. **Never render the whole page** — each beat must show a *piece of the feature in action*: an isolated/cropped/masked UI component (button, card, row, modal, field, chart, dropdown, etc.) animating through the interaction that demonstrates what the feature does. Place it on a clean tinted background; the rest of the app chrome is omitted or implied. Use **nice UI-like transitions** — springs, masked reveals, shared-element morphs, crossfades, parallax — to move between beats. Prefer `spring()` over linear interpolation, use `<Sequence>` to chain beats, and keep each beat short (90–240 frames at 30fps). The composition should loop cleanly — the last frame should crossfade comfortably back to the first. Stills go in `public/` and load via `staticFile()`; crop them with CSS `clip-path` / `overflow: hidden` / absolute positioning to extract the focal element.

Project conventions:
- Source stills in `public/<view-name>/<state>.png`.
- **Default 30fps, 1280×960 (4:3) column-sized.** Expose `width` and `height` as composition props so the same scenes can re-render at 1080×1080 (square) or 1920×1080 (widescreen, only if a fullscreen hero is explicitly asked for).
- Render an **MP4** (H.264) for general use **and** a **WebM** (VP9 or AV1) for `<video>` tag embedding on the marketing page. Both should be small (target <2 MB for a 15s clip) so the page stays fast.
- Layout the focal slice within a safe margin: at least 8% padding on every edge. Captions should sit comfortably *inside* the canvas, not flush to the corners — column-sized videos lose readability fast if anything is at the edge.
- **Rebuild vs crop:** when rebuilding a UI slice in JSX, run through `resources/rebuild-parity-checklist.md` before considering the slice done. The checklist also tells you when to crop a screenshot instead.

### 6. Verify cursor coordinates before final render

Two complementary tools:

**A. Coordinate picker (use first).** Open `resources/coordinate-picker.html` in a browser, drop the screenshot in, click the target, copy the generated `<Pointer>` config. Handles canvas-coord scaling automatically — a click in a half-size browser window still produces correct 1280×960 coordinates.

**B. DebugCrosshair (use to verify in-scene).** After pasting the picker's output into your scene, drop `<DebugCrosshair x={...} y={...} label="..."/>` at the same coords inside the scene component. Render a single still:

```bash
npm run render:still -- --frame=<global-arrival-frame>
```

If the crosshair sits inside the target, the click will land. **Remove all `<DebugCrosshair>` instances before the final render.**

### 6b. Choose SingleBeat vs SceneGroup

The scaffold supports two beat kinds:

- **SingleBeat** — one sequence, one component, one caption. Use when the visual changes substantially between beats (toolbar → modal → result).
- **SceneGroup** — one sequence wraps a UI that persists across multiple captioned moments. The group's component reads the local frame and drives state internally. Use when the same UI is on screen across multiple cuts and only its internal state changes (a modal that opens empty → fills in → submits — modal never unmounts).

The default is SingleBeat. Use SceneGroup when you catch yourself authoring three near-identical scene components for the same UI — they should be one group with three sub-beats. See `src/scenes/ExampleGroup.tsx` in the scaffold for the pattern.

### 7. Render + ship

```bash
npm run render        # mp4 + webm
SHIP_DEST=/path/to/website/public/videos/features npm run ship
```

The ship script is destination-agnostic — `SHIP_DEST` is set per project. For VerifyWise: `SHIP_DEST=../../public/videos/features` if the scaffold lives at `<website>/remotion/<feature>`.

### 8. Iterate

Render a preview, show it to the user, and ask which beats need to be slower, faster, or restaged. Treat the first render as a draft.

## Operating rules

- **Stills are required.** If the user hasn't provided screenshots, stop and ask. Do not invent UI from descriptions.
- **Pieces of the UI, not the whole UI.** If you catch yourself rendering a full-page mockup, stop and crop down to the component that carries the beat. The viewer should see the *feature in action*, not a tour of the app.
- **One feature per video.** If the user describes 5 unrelated features, propose splitting them into 5 videos.
- **Show, don't narrate.** No voiceover, no big text overlays explaining the feature — let the UI motion carry it. A short caption per beat is fine.
- **Captions are visible for the entire beat.** Each beat's supportive caption fades in within the first ~10–14 frames of the beat and remains on screen for the whole sequence. Do **not** delay caption entry to mid-beat or fade it out before the beat ends — the viewer should be able to read the line the entire time the focal UI is on screen. Let the scene-level crossfade between beats carry the caption swap.
- **Captions rise in from below.** They start ~60px under their rest position with opacity 0 and slide up + fade in together (strong UI ease-out, e.g. `Easing.bezier(0.16, 1, 0.3, 1)`). Never have a caption appear in place or drop in from above — the upward motion is part of the visual identity.
- **Captions live at the top, always at the same spot.** Anchor every caption to a fixed top-of-frame position (e.g. ~100px from the top, horizontally centered) and reuse that position across every beat. **Never** put a caption below the focal UI, never let it drift from beat to beat. Reserve a consistent top "caption band" (~200–240px) and lay the focal slice out below it. Build a single `TopCaption` wrapper component and use it everywhere — don't position captions inline per scene.
- **Captions are big — and tuned for column size.** For the default 1280-wide column canvas, font size around 44–48px, weight 700, with a `maxWidth` (≈80% of canvas width) so long lines wrap instead of running off-frame. They are headline-size callouts, not subtitle-size labels. If the video is rendered at the widescreen variant, scale captions to ~64px proportionally.
- **Caption length is tighter at column size.** At column scale, captions cap at ~5–7 words per line. Anything longer wraps awkwardly when the video is shown at 50% page width on desktop or full width on mobile. Cut the line if it doesn't fit.
- **Same caption across connected beats stays put.** When two consecutive beats are conceptually parts of the same moment and share the *exact same caption text* (e.g. one beat shows clicking the row, the next shows the modal opening — same headline applies to both), the caption must **not** re-animate at the cut. It rises and fades in once on the first beat, then on every continuation beat is rendered with `staticEntry` (or equivalent: instant full opacity, rest position, no slide). The two captions composite identically during the scene crossfade so the viewer perceives a single caption that persists across the cut, not a flicker. **Only** use this when the text is *exactly* the same — if the caption changes at all between beats, let the new one rise-and-fade-in normally so the change reads.
- **Cursor leads every click.** If a beat shows a *click, hover, or selection*, a visible cursor (`Pointer`) **must** appear, **move along a path**, and arrive on the target before the click ripple fires. No teleporting, no jump-cut clicks. The cursor's motion is what tells the viewer where the action is about to happen — the click ripple alone is not enough. Beats that are purely *illustrative* (highlighting a feature with glow rings, animating a static state, showing a result land) do **not** require a cursor; let glow / motion carry the eye instead. Decide per beat: **interactive → cursor leads; illustrative → no cursor.** For the cursor component itself and a copy-pasteable usage pattern, load `resources/cursor-component.md` only when you are about to author or modify a beat that has a click.
- **Cursor fades in at center, then moves in one straight line to the target.** The first interaction in a beat is always:
  1. **Fade in at the visual center** of the focal area (slice center / container center — whatever the viewer's eye is parked on for the beat). The pointer materialises in place; it does not enter from off-frame.
  2. **One single straight move** from that center to the interaction point. Direction is free — vertical, horizontal, **diagonal** are all fine, as long as it's *one straight segment*. Both `x` and `y` may change together (this is the only place a diagonal is allowed). Use a single decelerating ease (e.g. `Easing.bezier(0.16, 1, 0.3, 1)`) so the cursor feels guided, not flung.
- **Multiple clicks on the same UI: the pointer stays visible and glides from one to the next.** When a single beat has two or more interactions on the **same UI** (e.g. clicking a tab then clicking the Save button on the same form), **do not reset the pointer between clicks**. The pointer fades in once at center, glides straight to the first target, clicks, then **glides directly from that target to the next target** in one continuous straight segment, clicks, and so on. Only after the *last* interaction does it fade out. Never fade out + fade in at center between clicks on the same UI — that breaks the sense of a single user driving the action. Each segment between consecutive interactions is itself a **single straight line** (any direction allowed, same diagonal-OK rule as the entry).
- **Different UI / new view: reset.** If the next interaction lands on a *different* UI (a new view, a different form, a different beat altogether) the pointer does fade out and the next interaction starts with a fresh fade-in at center. The reset is what tells the viewer "we're somewhere new now."
- **Forbidden:** entering from off-frame edges, multi-segment paths within a single move, curves, zig-zags, intermediate keyframes that bend the trajectory, fading the pointer out + back in between clicks on the **same** UI. The motion should feel like the user's cursor **appearing where the eye already is** and gliding straight to each action in turn — not like a cursor entering from off-screen, and not like the cursor blinking out between every click on the same form.
- **Match the app's design language.** Use the colors, corner radii, and type from the supplied stills; don't restyle them.
- **Delegate to `remotion-best-practices`.** It is the source of truth for how to write Remotion code — invoke it any time you're about to author or modify a composition, scene, or transition.

## VerifyWise defaults

When working on a VerifyWise feature video, these defaults apply unless the user overrides them in the prompt:

- **Aspect ratio:** 4:3 column at 1280×960. Designed to drop into one half of a two-column block on the VerifyWise marketing site.
- **Audio:** silent. No music, no SFX. These videos autoplay muted next to copy on a marketing page; designing silent keeps file size low and avoids clipped audio when the user scrolls past.
- **Branding:**
  - **Chrome / captions / tinted background:** match the VerifyWise marketing site — `#13715B` green for accents, `#d0d5dd` for borders, `4px` corner radius, sentence case for caption text.
  - **Focal UI slice:** keep the *in-app* styling exactly as it appears in the supplied screenshot. Do not restyle the cropped component to match marketing tokens — that breaks the "this is the real product" feel.
- **Screenshots:** supplied by the user, per video. Do not try to launch the app, run Playwright, or capture from `app.verifywise.ai` / local dev — wait for the user to drop PNGs into `public/<view-name>/`.
- **Loop:** design every VerifyWise feature video to loop cleanly. Last frame should crossfade comfortably back to the first beat.
- **Cursor:** macOS-style arrow (black fill, white outline). Don't restyle to brand green — the cursor is a guide, not a focal element.
- **Tabular views (risk register, controls list, assessments table):** decide per video — sometimes a 2–3 row crop carries the beat, sometimes the whole table dimmed-with-focal-row is what proves the feature. Ask the user during intake. Don't default either way.
- **Multi-screen features (e.g. create risk → assign owner → view in register):** decide per feature whether the *journey* is the value or whether a *single proof state* is the value. If the multi-step nature is the point (assessment workflows, approval chains), show the abridged flow in 3–4 beats. If a single state proves it (a row landing in the register), just show that. Ask at intake.
- **Render output path:** drop the final MP4 + WebM into `public/videos/features/<feature-slug>.{mp4,webm}` in the VerifyWise website repo. Use the feature slug (kebab-case) for the filename. Both formats, both at column dimensions.

## Resources

The skill ships supporting files. Load them on demand, not upfront:

- **`resources/scaffold/`** — complete, copy-pasteable Remotion project. Supports both SingleBeat and SceneGroup kinds. Use as the starting point for every video. See section 3.
- **`resources/state-archetypes.md`** — match the feature to an archetype (CRUD-create, toggle, drag-and-drop, filter, etc.) and get the screenshot list. Load during intake, before asking for screenshots.
- **`resources/cursor-component.md`** — full contract for `<Pointer>`: coordinate system, movement rules, common mistakes, how to verify with `<DebugCrosshair>`. Load before authoring or modifying any beat that has a click.
- **`resources/coordinate-picker.html`** — open in a browser to pick cursor coordinates from a screenshot. Generates ready-to-paste `<Pointer>` config with correct canvas-px scaling.
- **`resources/rebuild-parity-checklist.md`** — checklist for rebuilt UI slices (corner radius, border, font weight, input height, shadow, focus ring). Load when rebuilding rather than cropping a screenshot.

## When in doubt

Ask. A 10-second clarifying question saves a 2-minute render that misses the point.
