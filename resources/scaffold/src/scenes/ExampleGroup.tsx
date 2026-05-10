import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TOKENS } from "../tokens";
import { TopCaption } from "../components/TopCaption";
import { activeSubBeat } from "../beats";
import { SceneProps } from "../Composition";

// Pattern for a SceneGroup: ONE component renders the persistent UI for the
// entire group. Local frame drives both:
//   - the visual state of the UI (typed text, toggle position, highlighted button)
//   - which sub-beat's caption is on screen (via activeSubBeat helper)
//
// Captions only re-animate when caption text changes between sub-beats.
// If two consecutive sub-beats share the same text, set captionMode: "static"
// on the second so the caption holds in place across the swap.
export const ExampleGroup: React.FC<SceneProps> = ({ beat }) => {
  const frame = useCurrentFrame();
  if (beat.kind !== "group") {
    throw new Error(
      `ExampleGroup is a SceneGroup component. Got beat.kind="${beat.kind}".`
    );
  }
  const sub = activeSubBeat(frame, beat.subBeats);

  // Branch on `frame` (or on `sub`) to drive UI state. Examples:
  //   const titleTyped = FULL_TITLE.slice(0, Math.floor(interpolate(frame, [80, 110], [0, FULL_TITLE.length])))
  //   const priority = frame >= 130 ? "High" : "Medium"
  //   const submitHighlighted = frame >= 200 && frame < 220

  return (
    <AbsoluteFill style={{ backgroundColor: TOKENS.bg }}>
      {/* Caption is keyed by text so React unmounts and re-mounts on change,
          letting the rise animation play. Same-text continuations keep the
          same key and stay mounted with staticEntry. */}
      <TopCaption
        key={sub.caption}
        text={sub.caption}
        staticEntry={sub.captionMode === "static"}
      />
      {/* Persistent UI goes here — the same JSX renders for the whole group,
          with internal state driven by `frame`. Don't conditionally remount
          the whole tree; that defeats the point of a group. */}
    </AbsoluteFill>
  );
};
