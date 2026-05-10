import { AbsoluteFill } from "remotion";
import { TOKENS } from "../tokens";
import { TopCaption } from "../components/TopCaption";
import { SceneProps } from "../Composition";

// Replace this with the real beat. The pattern for a SingleBeat:
// 1. AbsoluteFill with the canvas background
// 2. TopCaption (rise on first beat with this text; staticEntry on continuations)
// 3. Focal slice — either crop a screenshot via overflow:hidden + absolute
//    positioning, or rebuild the slice in JSX (see resources/rebuild-parity-checklist.md).
// 4. Pointer if the beat is interactive (interactive → cursor leads).
//
// For a SceneGroup, see ExampleGroup.tsx.
export const ExampleBeat: React.FC<SceneProps> = ({ beat }) => {
  if (beat.kind !== "single") {
    throw new Error(
      `ExampleBeat is a single-beat component. Got beat.kind="${beat.kind}".`
    );
  }
  return (
    <AbsoluteFill style={{ backgroundColor: TOKENS.bg }}>
      <TopCaption
        text={beat.caption}
        staticEntry={beat.captionMode === "static"}
      />
    </AbsoluteFill>
  );
};
