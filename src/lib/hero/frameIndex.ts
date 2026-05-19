import { HERO_SEGMENTS } from "./segments.config";

export type FrameLocation = {
  segmentIndex: number;
  localFrame: number;
  globalFrame: number;
};

/** Map a global frame index to segment + local frame */
export function globalToLocal(globalFrame: number): FrameLocation {
  const clamped = Math.max(
    0,
    Math.min(
      globalFrame,
      HERO_SEGMENTS.reduce((s, seg) => s + seg.frameCount, 0) - 1,
    ),
  );

  let remaining = clamped;
  for (let i = 0; i < HERO_SEGMENTS.length; i++) {
    const segment = HERO_SEGMENTS[i];
    if (remaining < segment.frameCount) {
      return {
        segmentIndex: i,
        localFrame: remaining,
        globalFrame: clamped,
      };
    }
    remaining -= segment.frameCount;
  }

  const last = HERO_SEGMENTS.length - 1;
  return {
    segmentIndex: last,
    localFrame: HERO_SEGMENTS[last].frameCount - 1,
    globalFrame: clamped,
  };
}

/** Convert timeline progress (0–1) to global frame index */
export function progressToFrame(
  progress: number,
  totalFrames: number,
): number {
  if (totalFrames <= 1) return 0;
  return Math.round(progress * (totalFrames - 1));
}
