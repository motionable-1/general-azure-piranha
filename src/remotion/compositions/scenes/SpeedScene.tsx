import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
  Sequence,
} from "remotion";
import { Video } from "@remotion/media";
import { Audio } from "@remotion/media";
import { Noise } from "../../library/components/effects/Noise";
import { Vignette } from "../../library/components/effects/Vignette";
import { Letterbox } from "../../library/components/effects/Letterbox";
import { LightLeak } from "../../library/components/effects/LightLeak";
import { SlideInText } from "../../library/components/text/TextAnimation";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";

const SFX_WHOOSH =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1771450946272_xhol6hv426n_sfx_fast_cinematic_whoosh_transiti.mp3";

const VIDEO_URL =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/chat-videos/1771450550413_fzxchfcxzc9_source.mp4";

/** Animated speed line decorative element */
const SpeedLine: React.FC<{
  y: number;
  delay: number;
  width: number;
  color: string;
}> = ({ y, delay, width: lineWidth, color }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const progress = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const x = interpolate(progress, [0, 1], [-lineWidth, width + 100]);
  const opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0, 0.6, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        width: lineWidth,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity,
        pointerEvents: "none",
        boxShadow: `0 0 8px ${color}`,
      }}
    />
  );
};

export const SpeedScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { fontFamily } = loadSpaceGrotesk();

  // Slow zoom + pan for cinematic feel
  const scale = 1.05 + Math.sin(frame * 0.004) * 0.03;
  const panX = Math.sin(frame * 0.003) * 15;
  const panY = Math.cos(frame * 0.005) * 8;

  // Warm color grading
  const warmth = interpolate(Math.sin(frame * 0.01), [-1, 1], [0, 15]);

  // Brightness pulse
  const brightness = 1 + Math.sin(frame * 0.02) * 0.05;

  // Motion blur effect (horizontal blur during "speed ramp" moments)
  const speedRampFrame = frame % 90;
  const isSpeedRamp = speedRampFrame > 30 && speedRampFrame < 45;
  const blurAmount = isSpeedRamp
    ? interpolate(speedRampFrame, [30, 37, 45], [0, 4, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Label animation
  const labelProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  // Divider line grow
  const dividerWidth = interpolate(
    spring({ frame: frame - 10, fps, config: { damping: 25, stiffness: 80 } }),
    [0, 1],
    [0, 200],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Video with cinematic treatment */}
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${panX}px, ${panY}px)`,
          filter: `saturate(1.4) contrast(1.1) brightness(${brightness}) hue-rotate(${warmth}deg)`,
        }}
      >
        <Video
          src={VIDEO_URL}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          volume={(f) =>
            interpolate(f, [0, 15], [0, 0.7], {
              extrapolateRight: "clamp",
            })
          }
          trimBefore={Math.round(40 * fps)}
        />
      </AbsoluteFill>

      {/* Motion blur overlay */}
      {blurAmount > 0 && (
        <AbsoluteFill
          style={{
            backdropFilter: `blur(${blurAmount}px)`,
            WebkitBackdropFilter: `blur(${blurAmount}px)`,
          }}
        />
      )}

      {/* Speed lines during ramp */}
      {isSpeedRamp && (
        <>
          <SpeedLine
            y={height * 0.2}
            delay={32}
            width={400}
            color="rgba(255,200,100,0.4)"
          />
          <SpeedLine
            y={height * 0.35}
            delay={33}
            width={300}
            color="rgba(255,150,50,0.3)"
          />
          <SpeedLine
            y={height * 0.55}
            delay={34}
            width={500}
            color="rgba(255,200,100,0.35)"
          />
          <SpeedLine
            y={height * 0.7}
            delay={35}
            width={350}
            color="rgba(255,180,80,0.3)"
          />
          <SpeedLine
            y={height * 0.85}
            delay={36}
            width={250}
            color="rgba(255,220,120,0.25)"
          />
        </>
      )}

      {/* Dark gradient overlay */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Label: "SPEED RAMP" */}
      <div
        style={{
          position: "absolute",
          bottom: 130,
          left: 80,
          opacity: interpolate(labelProgress, [0, 1], [0, 1]),
        }}
      >
        {/* Divider line */}
        <div
          style={{
            width: dividerWidth,
            height: 2,
            background: "linear-gradient(90deg, #ff8a00, #ff5500)",
            marginBottom: 14,
            boxShadow: "0 0 12px rgba(255,138,0,0.4)",
          }}
        />
        <SlideInText
          direction="bottom"
          distance={30}
          stagger={0.04}
          duration={0.5}
          ease="power3.out"
          startFrom={18}
          style={{
            fontFamily,
            fontSize: 15,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
          }}
        >
          <span>SPEED RAMP</span>
        </SlideInText>
      </div>

      {/* Timestamp indicator */}
      <div
        style={{
          position: "absolute",
          top: 80,
          right: 80,
          fontFamily: "monospace",
          fontSize: 12,
          color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.1em",
          opacity: interpolate(labelProgress, [0, 1], [0, 1]),
        }}
      >
        {Math.floor(frame / fps)
          .toString()
          .padStart(2, "0")}
        :{(frame % fps).toString().padStart(2, "0")}
      </div>

      {/* Cinematic overlays */}
      <LightLeak leakStyle="warm" intensity={0.25} speed={0.4} />
      <Noise type="grain" intensity={0.25} speed={1} opacity={0.1} />
      <Vignette intensity={0.6} size={0.35} />
      <Letterbox size={0.08} />

      {/* SFX */}
      <Sequence from={30}>
        <Audio src={SFX_WHOOSH} volume={0.2} />
      </Sequence>
    </AbsoluteFill>
  );
};
