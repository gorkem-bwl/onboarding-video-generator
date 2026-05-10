import * as React from "react";

export type PointerSpec =
  | "none"
  | {
      centerX: number;
      centerY: number;
      waypoints: Array<{
        x: number;
        y: number;
        arriveFrame: number;
        click?: boolean;
      }>;
      fadeInFrame?: number;
      fadeOutFrame?: number;
    };

// A single beat: one TransitionSeries.Sequence, one component, one caption.
// Use for beats that are visually distinct (e.g. "toolbar" → "modal").
export type SingleBeat = {
  kind: "single";
  id: string;
  durationFrames: number;
  caption: string;
  captionMode: "rise" | "static";
  pointer: PointerSpec;
};

// A scene group: ONE Sequence holds the UI for several captioned moments.
// Use when the same UI persists across cuts and only its internal state
// changes (e.g. a modal that opens, gets typed into, and submits — the modal
// itself never unmounts).
//
// The group's component reads useCurrentFrame() (local to the sequence) and
// branches on subBeats[].fromFrame to decide what state to render. Captions
// are picked up from subBeats[] automatically.
export type SubBeat = {
  // Local frame within the group at which this sub-beat starts.
  fromFrame: number;
  caption: string;
  captionMode: "rise" | "static";
  pointer: PointerSpec;
};

export type SceneGroup = {
  kind: "group";
  id: string;
  durationFrames: number;
  subBeats: SubBeat[];
};

export type BeatLike = SingleBeat | SceneGroup;

export const CROSSFADE_FRAMES = 12;

export const computeTotalDuration = (
  beats: BeatLike[],
  crossfadeFrames: number = CROSSFADE_FRAMES
): number => {
  const sum = beats.reduce((acc, b) => acc + b.durationFrames, 0);
  const overlaps = (beats.length - 1) * crossfadeFrames;
  return sum - overlaps;
};

// Helper for SceneGroup components: returns the active SubBeat given the
// local frame.
export const activeSubBeat = (frame: number, subBeats: SubBeat[]): SubBeat => {
  let active = subBeats[0];
  for (const sb of subBeats) {
    if (frame >= sb.fromFrame) active = sb;
    else break;
  }
  return active;
};

// Returns the global frame number where a beat starts in the rendered video,
// accounting for crossfade overlaps. Use to convert local arrival frames into
// the --frame argument for `npm run render:still`.
//
// Example:
//   beatGlobalFrame(BEATS, "fill-fields", 32, CROSSFADE_FRAMES)
//   → returns the global frame at which local frame 32 of beat "fill-fields"
//     plays in the final video.
export const beatGlobalFrame = (
  beats: BeatLike[],
  beatId: string,
  localFrame: number,
  crossfadeFrames: number = CROSSFADE_FRAMES
): number => {
  let globalStart = 0;
  for (let i = 0; i < beats.length; i++) {
    if (beats[i].id === beatId) {
      return globalStart + localFrame;
    }
    globalStart += beats[i].durationFrames - crossfadeFrames;
  }
  throw new Error(`Beat id "${beatId}" not found in BEATS`);
};
