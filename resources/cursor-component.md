# Cursor (Pointer) component

Load this resource when about to author or modify a beat that has a click. The `<Pointer>` component lives in the scaffold at `src/components/Pointer.tsx` — this doc explains the contract and the rules for using it.

## Contract

```tsx
<Pointer
  fadeInFrame={number}    // local frame at which the cursor materializes at center
  fadeOutFrame={number}   // local frame at which the cursor begins fading out
  centerX={number}        // initial fade-in x (canvas px, top-left origin)
  centerY={number}        // initial fade-in y
  waypoints={[
    { x, y, arriveFrame, click?: boolean },
    ...
  ]}
/>
```

- `fadeIn` lasts 8 frames; the cursor reaches full opacity at `fadeInFrame + 8` and immediately begins gliding to the first waypoint.
- The first segment is `centerX,centerY → waypoints[0]`.
- Subsequent segments are `waypoints[i-1] → waypoints[i]`.
- A waypoint with `click: true` emits a green ripple (border `#13715B`) that grows from r=10 to r=70 and fades out over 24 frames.
- After the last waypoint, the cursor holds position; it begins fading out at `fadeOutFrame` (over 8 frames).

## Movement rules (the skill's "operating rules" enforced by this component)

| Rule | What the component does | What you must do |
|---|---|---|
| Cursor fades in **at center**, never from off-frame | `centerX/centerY` is where the SVG materializes | Pass slice center / container center as the initial coords |
| **One single straight move** to the first target | Single linear interpolation between two points | Don't create curved paths via intermediate waypoints meant only as control points |
| Multi-tap on the **same UI**: stays visible, glides between targets | One `<Pointer>` instance with multiple waypoints `click: true` | Set `fadeOutFrame` *after* the last click, not between clicks |
| Different UI / new beat: **reset** | New beat → new `<Pointer>` instance | Each beat owns its own `<Pointer>` with its own fade-in at center |
| Ease is a single decelerating curve | Hardcoded `Easing.bezier(0.16, 1, 0.3, 1)` | Don't override |

## Coordinate system

- `(0, 0)` is top-left of the canvas.
- Default canvas is 1280×960 (4:3 column).
- The cursor's hotspot is the tip of the arrow at SVG (2, 2). The component offsets by `(left: x - 4, top: y - 2)` so `(x, y)` is the click point.

## Verifying coordinates without rendering the full beat

The scaffold ships `<DebugCrosshair x={X} y={Y} label="..." />`. While authoring, drop it in the scene at the same coords as the waypoint:

```tsx
<Pointer ... waypoints={[{ x: 1058, y: 862, arriveFrame: 32, click: true }]} />
<DebugCrosshair x={1058} y={862} label="Create task button" />
```

Render a single still at the arrival frame:

```bash
npm run render:still -- --frame=287   # 287 = global arrival frame, not local
```

If the crosshair sits inside the target, the click will land. If not, adjust the waypoint and re-render the still — it costs ~1 second versus a full re-render. **Remove all DebugCrosshair instances before the final render.**

## Common mistakes

- **Cursor flying in from off-screen** — happens when `centerX/centerY` is outside the visible canvas. They must be inside, ideally at the slice's visual center.
- **Multi-tap fade flicker** — happens when you create a separate `<Pointer>` per click on the same UI. One `<Pointer>` per beat, multiple waypoints.
- **Click ripple but no cursor visible** — `fadeOutFrame` was set before the last waypoint's `arriveFrame`. Push it later.
- **Cursor lands 5–15px off the button** — hotspot offset misjudged. Verify with DebugCrosshair before final render.

## When NOT to use the cursor

Beats that are *illustrative* (counters ticking, rows sliding in, results landing, glow rings highlighting a feature) should not have a cursor. Let glow / motion carry the eye instead. The skill's rule: **interactive → cursor leads; illustrative → no cursor.**
