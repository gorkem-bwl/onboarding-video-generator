import { interpolate, useCurrentFrame, Easing } from "remotion";
import { TOKENS } from "../tokens";

type Props = {
  text: string;
  // staticEntry=true: caption is already on screen at full opacity from frame 0,
  //   no rise-in animation. Use ONLY when the previous beat ended with the
  //   exact same caption text (continuation beat). The crossfade between scenes
  //   composites the two captions identically so the viewer sees one persistent
  //   caption, not a flicker.
  //
  // staticEntry=false (default): caption rises 60px and fades in over 14 frames.
  //   This is the canonical entry — use for every new caption text.
  staticEntry?: boolean;
};

export const TopCaption: React.FC<Props> = ({ text, staticEntry = false }) => {
  const frame = useCurrentFrame();

  const opacity = staticEntry
    ? 1
    : interpolate(frame, [0, 14], [0, 1], {
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });

  const translateY = staticEntry
    ? 0
    : interpolate(frame, [0, 14], [60, 0], {
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });

  return (
    <div
      style={{
        position: "absolute",
        top: 100,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          fontFamily: TOKENS.fontStack,
          fontSize: 46,
          fontWeight: 700,
          color: TOKENS.text,
          letterSpacing: "-0.01em",
          textAlign: "center",
          lineHeight: 1.1,
          maxWidth: 1024,
          padding: "0 32px",
        }}
      >
        {text}
      </div>
    </div>
  );
};
