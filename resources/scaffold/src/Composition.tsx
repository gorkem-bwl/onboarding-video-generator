import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TOKENS } from "./tokens";
import { BEATS, BEAT_COMPONENTS } from "./scenes/beats-config";
import { CROSSFADE_FRAMES, BeatLike } from "./beats";

// Props every registered scene component receives. Single-beat components
// can ignore them; SceneGroup components read `beat.subBeats` to drive
// internal timing.
export type SceneProps = { beat: BeatLike };

// The Composition is data-driven. To restage the video, edit BEATS in
// scenes/beats-config.ts. Total duration is computed automatically in Root.tsx.
export const FeatureVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: TOKENS.bg }}>
      <TransitionSeries>
        {BEATS.map((beat, i) => {
          const Component = BEAT_COMPONENTS[beat.id] as React.FC<SceneProps>;
          if (!Component) {
            throw new Error(
              `No component registered for beat id "${beat.id}". ` +
                `Add it to BEAT_COMPONENTS in scenes/beats-config.ts.`
            );
          }
          const isLast = i === BEATS.length - 1;
          return (
            <>
              <TransitionSeries.Sequence
                key={`seq-${beat.id}`}
                durationInFrames={beat.durationFrames}
              >
                <Component beat={beat} />
              </TransitionSeries.Sequence>
              {!isLast && (
                <TransitionSeries.Transition
                  key={`trans-${beat.id}`}
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: CROSSFADE_FRAMES })}
                />
              )}
            </>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
