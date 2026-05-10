import { interpolate, useCurrentFrame, Easing } from "remotion";
import { TOKENS } from "../tokens";

export type Waypoint = {
  x: number;
  y: number;
  arriveFrame: number;
  click?: boolean;
};

type Props = {
  fadeInFrame: number;
  fadeOutFrame: number;
  centerX: number;
  centerY: number;
  waypoints: Waypoint[];
};

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

// Macos-style cursor that:
// - fades in at (centerX, centerY)
// - glides in single straight segments through each waypoint
// - emits a green ripple at any waypoint with click: true
// - fades out at fadeOutFrame
//
// Coordinate system is top-left origin in canvas px. To verify a target visually
// without rendering the full beat, drop <DebugCrosshair x={...} y={...} /> into
// the scene during authoring; remove before final render.
export const Pointer: React.FC<Props> = ({
  fadeInFrame,
  fadeOutFrame,
  centerX,
  centerY,
  waypoints,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [fadeInFrame, fadeInFrame + 8, fadeOutFrame, fadeOutFrame + 8],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  if (opacity === 0) return null;

  let x = centerX;
  let y = centerY;

  if (waypoints.length > 0) {
    const first = waypoints[0];
    if (frame <= first.arriveFrame) {
      const t = interpolate(
        frame,
        [fadeInFrame + 8, first.arriveFrame],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }
      );
      x = centerX + (first.x - centerX) * t;
      y = centerY + (first.y - centerY) * t;
    } else {
      let segStart = first;
      let segEnd: Waypoint | null = null;
      for (let i = 1; i < waypoints.length; i++) {
        if (frame <= waypoints[i].arriveFrame) {
          segStart = waypoints[i - 1];
          segEnd = waypoints[i];
          break;
        }
      }
      if (segEnd === null) {
        const last = waypoints[waypoints.length - 1];
        x = last.x;
        y = last.y;
      } else {
        const t = interpolate(
          frame,
          [segStart.arriveFrame, segEnd.arriveFrame],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }
        );
        x = segStart.x + (segEnd.x - segStart.x) * t;
        y = segStart.y + (segEnd.y - segStart.y) * t;
      }
    }
  }

  return (
    <>
      {waypoints.map((wp, i) => {
        if (!wp.click) return null;
        const local = frame - wp.arriveFrame;
        if (local < 0 || local > 24) return null;
        const r = interpolate(local, [0, 24], [10, 70], {
          extrapolateRight: "clamp",
        });
        const rOpacity = interpolate(local, [0, 24], [0.55, 0], {
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: wp.x - r,
              top: wp.y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              border: `3px solid ${TOKENS.green}`,
              opacity: rOpacity,
              pointerEvents: "none",
            }}
          />
        );
      })}
      <svg
        width={32}
        height={40}
        viewBox="0 0 32 40"
        style={{
          position: "absolute",
          left: x - 4,
          top: y - 2,
          opacity,
          pointerEvents: "none",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
        }}
      >
        <path
          d="M2 2 L2 28 L9 22 L13 32 L17 30 L13 20 L22 20 Z"
          fill="#0A0A0A"
          stroke="#FFFFFF"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};
