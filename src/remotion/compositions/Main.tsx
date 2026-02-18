import { AbsoluteFill, Artifact, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/SpaceMono";

const LoaderDots = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dot = (index: number) => {
    const phase = (frame / fps) * 2 * Math.PI + index * 0.8;
    return 0.35 + Math.max(0, Math.sin(phase)) * 0.65;
  };

  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block text-sky-300"
          style={{ opacity: dot(i) }}
        >
          .
        </span>
      ))}
    </span>
  );
};

export const Main: React.FC = () => {
  const { fontFamily } = loadFont();
  const frame = useCurrentFrame();
  return (
    <>
      {/* Leave this here to generate a thumbnail */}
      {frame === 0 && (
        <Artifact content={Artifact.Thumbnail} filename="thumbnail.jpeg" />
      )}
      <AbsoluteFill className="flex items-center justify-center bg-[#0f1115]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.28),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:48px_48px] opacity-40" />
        <div
          className="flex flex-col items-center gap-4 text-center text-white drop-shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
          style={{ fontFamily, fontWeight: 700, letterSpacing: "0.01em" }}
        >
          <div className="text-4xl md:text-5xl font-bold">
            <span className="font-extrabold text-sky-300">TypeFrames</span> is
            building your video
            <LoaderDots />
          </div>
          <div className="text-base md:text-lg text-white/70">
            Rendering scenes, timing transitions, and polishing frames.
          </div>
        </div>
      </AbsoluteFill>
    </>
  );
};
