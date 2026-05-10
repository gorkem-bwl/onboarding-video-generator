import { BeatLike } from "../beats";
import { ExampleBeat } from "./ExampleBeat";

// Replace these with real beats for your feature.
//
// Two kinds of entries are supported:
//
// 1. SingleBeat (kind: "single") — one Sequence, one component, one caption.
//    Use when the visual changes substantially between beats (e.g. toolbar
//    view → modal view → result view).
//
// 2. SceneGroup (kind: "group") — one Sequence wrapping a UI that persists
//    across multiple captioned moments. The group's component reads the
//    local frame and decides what state to render. Captions tick per
//    subBeat. Use when the SAME UI is on screen across multiple cuts and
//    only its internal state changes (e.g. a modal that opens empty → gets
//    typed into → submits — the modal itself never unmounts).
//
// Total duration is computed in Root.tsx via computeTotalDuration(BEATS).

export const BEATS: BeatLike[] = [
  {
    kind: "single",
    id: "example",
    durationFrames: 90,
    caption: "Replace with your first caption",
    captionMode: "rise",
    pointer: "none",
  },
  // Example of a SceneGroup (commented out — uncomment + register a
  // component to use):
  //
  // {
  //   kind: "group",
  //   id: "modal-flow",
  //   durationFrames: 240,
  //   subBeats: [
  //     { fromFrame: 0,   caption: "Open the form",         captionMode: "rise",   pointer: "none" },
  //     { fromFrame: 80,  caption: "Set priority and date", captionMode: "rise",   pointer: "none" },
  //     { fromFrame: 180, caption: "Submit",                captionMode: "static", pointer: "none" },
  //   ],
  // },
];

// Map beat ids to their scene component. For a SceneGroup, the component
// receives subBeats[] via the BeatLike object so it can branch on local
// frame.
//
// Adding a beat or group requires:
//   1. a new entry in BEATS above
//   2. a new component file in src/scenes/
//   3. a new entry here mapping id -> component
export const BEAT_COMPONENTS: Record<string, React.FC> = {
  example: ExampleBeat,
};
