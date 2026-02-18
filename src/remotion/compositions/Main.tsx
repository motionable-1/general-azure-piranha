import React from "react";
import { Artifact, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { glitch } from "../library/components/layout/transitions/presentations/glitch";
import { flashWhite } from "../library/components/layout/transitions/presentations/flashWhite";
import { flashBlack } from "../library/components/layout/transitions/presentations/flashBlack";
import { IntroScene } from "./scenes/IntroScene";
import { GlitchScene } from "./scenes/GlitchScene";
import { SpeedScene } from "./scenes/SpeedScene";
import { OutroScene } from "./scenes/OutroScene";

/**
 * Duration calculation:
 * Scene 1 (Intro): 120 frames (4s)
 * Transition 1 (glitch): 15 frames
 * Scene 2 (Glitch): 150 frames (5s)
 * Transition 2 (flashWhite): 12 frames
 * Scene 3 (Speed): 150 frames (5s)
 * Transition 3 (flashBlack): 12 frames
 * Scene 4 (Outro): 150 frames (5s)
 *
 * Total = 120 + 150 + 150 + 150 - 15 - 12 - 12 = 531 frames
 * + 30 frames buffer at end = 561 frames (~18.7s)
 */

export const Main: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <>
      {frame === 0 && (
        <Artifact content={Artifact.Thumbnail} filename="thumbnail.jpeg" />
      )}
      <TransitionSeries>
        {/* Scene 1: Cinematic Intro with title reveal */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <IntroScene />
        </TransitionSeries.Sequence>

        {/* Glitch transition into Scene 2 */}
        <TransitionSeries.Transition
          presentation={glitch()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 2: Glitch Freeze with RGB split */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <GlitchScene />
        </TransitionSeries.Sequence>

        {/* Flash white transition into Scene 3 */}
        <TransitionSeries.Transition
          presentation={flashWhite()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        {/* Scene 3: Speed Ramp with warm tones */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <SpeedScene />
        </TransitionSeries.Sequence>

        {/* Flash black transition into Scene 4 */}
        <TransitionSeries.Transition
          presentation={flashBlack()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        {/* Scene 4: Outro with CRT shutdown */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};
