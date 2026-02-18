import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
} from "remotion";
import { Video } from "@remotion/media";
import { Audio } from "@remotion/media";
import { Noise } from "../../library/components/effects/Noise";
import { Vignette } from "../../library/components/effects/Vignette";
import { Letterbox } from "../../library/components/effects/Letterbox";
import { FadeInChars } from "../../library/components/text/TextAnimation";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";

const SFX_RISER =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1771450936699_b1jm97xu0u9_sfx_rising_cinematic_tension_build.mp3";
const SFX_IMPACT =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1771450939186_q5igs9ymwfj_sfx_deep_cinematic_bass_impact_hit.mp3";

const VIDEO_URL =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/chat-videos/1771450550413_fzxchfcxzc9_source.mp4";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const { fontFamily } = loadSpaceGrotesk();

  // Dramatic zoom into video
  const zoomProgress = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 30, mass: 2 },
  });
  const videoScale = interpolate(zoomProgress, [0, 1], [1.4, 1.05]);

  // Flash white on impact
  const flashOpacity = interpolate(frame, [25, 30, 40], [0, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title reveal timing
  const titleIn = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const titleY = interpolate(titleIn, [0, 1], [60, 0]);
  const titleOpacity = interpolate(titleIn, [0, 1], [0, 1]);

  // Subtitle
  const subIn = spring({
    frame: frame - 45,
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  const subOpacity = interpolate(subIn, [0, 1], [0, 1]);

  // Horizontal scan line
  const scanY = interpolate(frame, [0, 90], [-20, height + 20], {
    extrapolateRight: "clamp",
  });

  // Chromatic aberration intensity
  const chromaIntensity = interpolate(frame, [25, 32, 50], [0, 8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Video base with zoom */}
      <AbsoluteFill
        style={{
          transform: `scale(${videoScale})`,
          filter: "saturate(1.2) contrast(1.1)",
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
        />
      </AbsoluteFill>

      {/* Chromatic aberration overlay */}
      {chromaIntensity > 0.5 && (
        <>
          <AbsoluteFill
            style={{
              transform: `translate(${chromaIntensity}px, 0)`,
              mixBlendMode: "screen",
              opacity: 0.4,
              background:
                "linear-gradient(90deg, rgba(255,0,0,0.15) 0%, transparent 50%)",
            }}
          />
          <AbsoluteFill
            style={{
              transform: `translate(${-chromaIntensity}px, 0)`,
              mixBlendMode: "screen",
              opacity: 0.4,
              background:
                "linear-gradient(270deg, rgba(0,100,255,0.15) 0%, transparent 50%)",
            }}
          />
        </>
      )}

      {/* Flash white */}
      <AbsoluteFill
        style={{
          backgroundColor: "#fff",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: scanY,
          width: "100%",
          height: 3,
          background:
            "linear-gradient(180deg, transparent, rgba(255,255,255,0.25), transparent)",
          boxShadow: "0 0 30px 10px rgba(255,255,255,0.08)",
          pointerEvents: "none",
        }}
      />

      {/* Dark gradient overlay for text readability */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Title text */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
        }}
      >
        <FadeInChars
          stagger={0.04}
          duration={0.6}
          ease="power3.out"
          startFrom={30}
          style={{
            fontFamily,
            fontSize: 82,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.02em",
            textShadow: "0 4px 30px rgba(0,0,0,0.6)",
            textAlign: "center",
          }}
        >
          <span>DYNAMIC EDIT</span>
        </FadeInChars>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: subOpacity,
        }}
      >
        <FadeInChars
          stagger={0.02}
          duration={0.5}
          ease="power2.out"
          startFrom={45}
          style={{
            fontFamily,
            fontSize: 20,
            fontWeight: 500,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
          }}
        >
          <span>CINEMATIC GLITCH &amp; FLOW</span>
        </FadeInChars>
      </div>

      {/* Decorative corner brackets */}
      {titleOpacity > 0.5 && (
        <>
          <div
            style={{
              position: "absolute",
              top: 60,
              left: 60,
              width: 40,
              height: 40,
              borderLeft: "2px solid rgba(255,255,255,0.3)",
              borderTop: "2px solid rgba(255,255,255,0.3)",
              opacity: titleOpacity,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 60,
              right: 60,
              width: 40,
              height: 40,
              borderRight: "2px solid rgba(255,255,255,0.3)",
              borderBottom: "2px solid rgba(255,255,255,0.3)",
              opacity: titleOpacity,
            }}
          />
        </>
      )}

      {/* Cinematic overlays */}
      <Noise type="grain" intensity={0.3} speed={1} opacity={0.15} />
      <Vignette intensity={0.7} size={0.35} />
      <Letterbox size={0.08} animateIn={1} />

      {/* Sound effects */}
      <Audio src={SFX_RISER} volume={0.25} />
      <Sequence from={25}>
        <Audio src={SFX_IMPACT} volume={0.35} />
      </Sequence>
    </AbsoluteFill>
  );
};
