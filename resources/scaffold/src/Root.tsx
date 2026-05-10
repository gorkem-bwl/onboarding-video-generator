import { Composition } from "remotion";
import { FeatureVideo } from "./Composition";
import { BEATS } from "./scenes/beats-config";
import { computeTotalDuration } from "./beats";

// Default canvas: 1280x960 (4:3 column).
// Override per-feature only if a fullscreen hero placement is confirmed.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="FeatureVideo"
      component={FeatureVideo}
      durationInFrames={computeTotalDuration(BEATS)}
      fps={30}
      width={1280}
      height={960}
    />
  );
};
