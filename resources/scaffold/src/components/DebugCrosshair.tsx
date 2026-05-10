// Authoring-time aid. Drop into a scene while positioning a cursor click
// target, render a still frame to verify the coordinate, then remove before
// final render.
//
// Usage:
//   <DebugCrosshair x={1058} y={862} label="Create task button" />
//
// Verify with:
//   npx remotion still src/index.ts <CompositionId> out/check.png --frame=N
//
// If the crosshair sits inside the button, the click will land. If it's
// off, adjust before re-running the full render.

type Props = {
  x: number;
  y: number;
  label?: string;
  color?: string;
};

export const DebugCrosshair: React.FC<Props> = ({
  x,
  y,
  label,
  color = "#FF00FF",
}) => {
  const SIZE = 40;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - SIZE / 2,
          top: y - 1,
          width: SIZE,
          height: 2,
          backgroundColor: color,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 1,
          top: y - SIZE / 2,
          width: 2,
          height: SIZE,
          backgroundColor: color,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 6,
          top: y - 6,
          width: 12,
          height: 12,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      {label && (
        <div
          style={{
            position: "absolute",
            left: x + 12,
            top: y + 12,
            padding: "4px 8px",
            background: color,
            color: "#FFFFFF",
            fontSize: 12,
            fontFamily: "monospace",
            borderRadius: 3,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          {label} ({x},{y})
        </div>
      )}
    </>
  );
};
