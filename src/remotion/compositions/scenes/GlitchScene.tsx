import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  random,
  Sequence,
} from "remotion";
import { Video } from "@remotion/media";
import { Audio } from "@remotion/media";
import { Noise } from "../../library/components/effects/Noise";
import { Vignette } from "../../library/components/effects/Vignette";
import { Letterbox } from "../../library/components/effects/Letterbox";
import { LightLeak } from "../../library/components/effects/LightLeak";
import { HackerText } from "../../library/components/text/TextAnimation";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";

const SFX_GLITCH =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1771450943261_eu6cqtq16w5_sfx_digital_glitch_transition_stut.mp3";

const VIDEO_URL =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/chat-videos/1771450550413_fzxchfcxzc9_source.mp4";

/** Floating accent line that drifts across the screen */
const FloatingLine: React.FC<{
  seed: string;
  color: string;
  thickness: number;
}> = ({ seed, color, thickness }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const baseY = random(seed) * height;
  const y = baseY + Math.sin(frame * 0.05 + random(seed + "p") * 10) * 40;
  const opacity = 0.15 + Math.sin(frame * 0.03) * 0.1;
  const width = 200 + random(seed + "w") * 600;

  return (
    <div
      style={{
        position: "absolute",
        left: `${random(seed + "x") * 60}%`,
        top: y,
        width,
        height: thickness,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

export const GlitchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { fontFamily } = loadSpaceGrotesk();

  // Glitch intensity pulses
  const glitchPhase = Math.floor(frame / 4);
  const isGlitching = random(`glitch-${glitchPhase}`) > 0.7;
  const glitchIntensity = isGlitching
    ? random(`glitch-i-${glitchPhase}`) * 0.8
    : 0;

  // Block displacement for glitch slices
  const numSlices = 8;
  const sliceHeight = 100 / numSlices;

  // RGB split amount
  const rgbSplit = glitchIntensity * 12;

  // Video hue shift during glitch
  const hueShift = glitchIntensity * 40;

  // Slow zoom drift
  const driftScale = 1.02 + Math.sin(frame * 0.008) * 0.015;
  const driftX = Math.sin(frame * 0.005) * 8;
  const driftY = Math.cos(frame * 0.007) * 5;

  // Text label reveal
  const labelIn = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 150 },
  });
  const labelOpacity = interpolate(labelIn, [0, 1], [0, 1]);
  const labelX = interpolate(labelIn, [0, 1], [-40, 0]);

  // Accent bar animation
  const barWidth = spring({
    frame: frame - 15,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Base video with drift and color grading */}
      <AbsoluteFill
        style={{
          transform: `scale(${driftScale}) translate(${driftX}px, ${driftY}px)`,
          filter: `saturate(1.3) contrast(1.15) hue-rotate(${hueShift}deg)`,
        }}
      >
        <Video
          src={VIDEO_URL}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          volume={(f: number) =>
            interpolate(f, [0, 15], [0, 0.8], {
              extrapolateRight: "clamp",
            })
          }
          trimBefore={3 * fps}
        />
      </AbsoluteFill>

      {/* Glitch block displacement slices */}
      {isGlitching &&
        Array.from({ length: numSlices }).map((_, i) => {
          const sliceRandom = random(`slice-${glitchPhase}-${i}`);
          if (sliceRandom > 0.4) return null;

          const displaceX =
            (random(`disp-x-${glitchPhase}-${i}`) - 0.5) * 80 * glitchIntensity;
          const top = i * sliceHeight;
          const bottom = 100 - (i + 1) * sliceHeight;

          return (
            <AbsoluteFill
              key={`slice-${i}`}
              style={{
                clipPath: `inset(${top}% 0 ${bottom}% 0)`,
                transform: `translateX(${displaceX}px)`,
                filter: `hue-rotate(${random(`hue-${glitchPhase}-${i}`) * 60 - 30}deg)`,
              }}
            >
              <Video
                src={VIDEO_URL}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                volume={0}
                muted
                trimBefore={3 * fps}
              />
            </AbsoluteFill>
          );
        })}

      {/* RGB split overlays */}
      {rgbSplit > 1 && (
        <>
          <AbsoluteFill
            style={{
              transform: `translate(${rgbSplit}px, ${-rgbSplit * 0.3}px)`,
              mixBlendMode: "screen",
              opacity: 0.35,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(135deg, rgba(255,0,50,0.2), transparent 60%)",
              }}
            />
          </AbsoluteFill>
          <AbsoluteFill
            style={{
              transform: `translate(${-rgbSplit}px, ${rgbSplit * 0.3}px)`,
              mixBlendMode: "screen",
              opacity: 0.35,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(315deg, rgba(0,100,255,0.2), transparent 60%)",
              }}
            />
          </AbsoluteFill>
        </>
      )}

      {/* Dark overlay for text contrast */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Floating accent lines */}
      <FloatingLine seed="line1" color="rgba(0,200,255,0.3)" thickness={1} />
      <FloatingLine seed="line2" color="rgba(255,50,100,0.2)" thickness={2} />
      <FloatingLine seed="line3" color="rgba(100,255,150,0.15)" thickness={1} />

      {/* Label: "GLITCH FREEZE" */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 80,
          opacity: labelOpacity,
          transform: `translateX(${labelX}px)`,
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            width: interpolate(barWidth, [0, 1], [0, 60]),
            height: 3,
            backgroundColor: "#00d4ff",
            marginBottom: 12,
            boxShadow: "0 0 15px rgba(0,212,255,0.5)",
          }}
        />
        <HackerText
          stagger={0.03}
          duration={0.8}
          chars="01!@#$%"
          initialColor="#00d4ff"
          startFrom={25}
          style={{
            fontFamily,
            fontSize: 14,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.35em",
            textTransform: "uppercase" as const,
          }}
        >
          <span>GLITCH FREEZE</span>
        </HackerText>
      </div>

      {/* Bottom-right frame counter */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          right: 80,
          fontFamily: "monospace",
          fontSize: 13,
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.15em",
          opacity: labelOpacity,
        }}
      >
        {String(frame).padStart(4, "0")} / {String(fps).padStart(2, "0")}fps
      </div>

      {/* Cinematic overlays */}
      <LightLeak leakStyle="cool" intensity={0.2} speed={0.3} />
      <Noise type="grain" intensity={0.35} speed={1.5} opacity={0.12} />
      <Vignette intensity={0.65} size={0.3} />
      <Letterbox size={0.08} />

      {/* Glitch SFX */}
      <Sequence from={0}>
        <Audio src={SFX_GLITCH} volume={0.2} />
      </Sequence>
    </AbsoluteFill>
  );
};
