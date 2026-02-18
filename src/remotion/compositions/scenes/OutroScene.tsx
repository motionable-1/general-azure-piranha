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
import { RetroOverlay } from "../../library/components/effects/RetroOverlay";
import {
  BlurReveal,
  FadeInChars,
} from "../../library/components/text/TextAnimation";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";

const SFX_IMPACT =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1771450939186_q5igs9ymwfj_sfx_deep_cinematic_bass_impact_hit.mp3";
const SFX_DRONE =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/sfx/1771450839103_6d2z2x5dms8_sfx_subtle_ambient_dark_drone_low_.mp3";

const VIDEO_URL =
  "https://pub-e3bfc0083b0644b296a7080b21024c5f.r2.dev/chat-videos/1771450550413_fzxchfcxzc9_source.mp4";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { fontFamily } = loadSpaceGrotesk();

  // CRT shutdown starts 60 frames before end
  const shutdownStart = durationInFrames - 60;
  const isShuttingDown = frame >= shutdownStart;

  // CRT squeeze: video compresses to a thin horizontal line then to a dot
  const shutdownProgress = isShuttingDown
    ? interpolate(
        frame,
        [
          shutdownStart,
          shutdownStart + 20,
          shutdownStart + 40,
          shutdownStart + 55,
        ],
        [0, 0.7, 0.95, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.cubic),
        },
      )
    : 0;

  const scaleY = isShuttingDown
    ? interpolate(shutdownProgress, [0, 0.7, 1], [1, 0.01, 0])
    : 1;
  const scaleX = isShuttingDown
    ? interpolate(shutdownProgress, [0, 0.5, 0.9, 1], [1, 1, 0.3, 0])
    : 1;

  // CRT brightness flash
  const crtBrightness = isShuttingDown
    ? interpolate(shutdownProgress, [0, 0.3, 0.7, 1], [1, 2.5, 3, 0])
    : 1;

  // Final dot glow
  const dotGlow = isShuttingDown
    ? interpolate(shutdownProgress, [0.85, 0.95, 1], [0, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // "REPLAY" text after CRT shutdown
  const replayOpacity = interpolate(
    frame,
    [shutdownStart + 45, shutdownStart + 55],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Video drift
  const driftScale = 1.03 + Math.sin(frame * 0.006) * 0.02;
  const driftX = Math.sin(frame * 0.004) * 10;

  // VHS-style bottom label
  const labelIn = spring({
    frame: frame - 10,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Video with CRT shutdown effect */}
      <AbsoluteFill
        style={{
          transform: `scale(${scaleX * driftScale}, ${scaleY * driftScale}) translateX(${driftX}px)`,
          filter: `brightness(${crtBrightness}) saturate(${isShuttingDown ? 0.5 : 1.2}) contrast(1.1)`,
          transformOrigin: "center center",
        }}
      >
        <Video
          src={VIDEO_URL}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          volume={(f) => {
            const fadeOut = interpolate(
              f,
              [durationInFrames - 90, durationInFrames - 30],
              [0.7, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            const fadeIn = interpolate(f, [0, 15], [0, 0.7], {
              extrapolateRight: "clamp",
            });
            return Math.min(fadeIn, fadeOut);
          }}
          trimBefore={Math.round(80 * fps)}
        />
      </AbsoluteFill>

      {/* CRT dot glow center */}
      {dotGlow > 0 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#fff",
            boxShadow: `0 0 ${40 * dotGlow}px ${20 * dotGlow}px rgba(255,255,255,${dotGlow * 0.6}), 0 0 ${80 * dotGlow}px ${40 * dotGlow}px rgba(200,220,255,${dotGlow * 0.3})`,
            opacity: dotGlow,
          }}
        />
      )}

      {/* "REPLAY" text after shutdown */}
      {replayOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: replayOpacity,
          }}
        >
          <BlurReveal
            stagger={0.06}
            duration={0.6}
            ease="power2.out"
            startFrom={shutdownStart + 45}
            style={{
              fontFamily,
              fontSize: 18,
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.5em",
              textTransform: "uppercase" as const,
            }}
          >
            <span>FIN</span>
          </BlurReveal>
        </div>
      )}

      {/* Dark overlay before CRT */}
      {!isShuttingDown && (
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.3) 100%)",
          }}
        />
      )}

      {/* Outro label */}
      {!isShuttingDown && (
        <div
          style={{
            position: "absolute",
            bottom: 130,
            right: 80,
            opacity: interpolate(labelIn, [0, 1], [0, 1]),
            textAlign: "right",
          }}
        >
          <div
            style={{
              width: interpolate(labelIn, [0, 1], [0, 80]),
              height: 2,
              background: "linear-gradient(90deg, transparent, #8b5cf6)",
              marginBottom: 12,
              marginLeft: "auto",
              boxShadow: "0 0 10px rgba(139,92,246,0.4)",
            }}
          />
          <FadeInChars
            stagger={0.03}
            duration={0.5}
            ease="power2.out"
            startFrom={15}
            style={{
              fontFamily,
              fontSize: 14,
              fontWeight: 600,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.3em",
              textTransform: "uppercase" as const,
            }}
          >
            <span>OUTRO</span>
          </FadeInChars>
        </div>
      )}

      {/* CRT / VHS overlay */}
      {!isShuttingDown && (
        <RetroOverlay retroStyle="crt" intensity={0.3} speed={0.8} />
      )}

      {/* Cinematic overlays */}
      {!isShuttingDown && (
        <>
          <Noise type="grain" intensity={0.3} speed={1} opacity={0.12} />
          <Vignette intensity={0.7} size={0.3} />
          <Letterbox size={0.08} />
        </>
      )}

      {/* Sound effects */}
      <Audio
        src={SFX_DRONE}
        volume={(f) =>
          interpolate(
            f,
            [0, 30, durationInFrames - 60, durationInFrames],
            [0, 0.15, 0.15, 0],
            {
              extrapolateRight: "clamp",
            },
          )
        }
      />
      <Sequence from={shutdownStart}>
        <Audio src={SFX_IMPACT} volume={0.3} />
      </Sequence>
    </AbsoluteFill>
  );
};
