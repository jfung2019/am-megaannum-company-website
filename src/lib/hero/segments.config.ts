/**
 * Single source of truth for hero image-sequence segments.
 * Filenames: ezgif-frame-001.png … ezgif-frame-0NN.png (1-based index).
 */

import { HERO_PORTAL_SCROLL_VH } from "./portal.config";

export type HeroSegment = {
  id: string;
  folder: string;
  frameCount: number;
  fps: number;
  /** Scroll timeline weight — higher = more scroll distance for this segment */
  scrollWeight: number;
};

export const HERO_SEGMENTS: readonly HeroSegment[] = [
  {
    id: "segment01",
    folder: "/sequences/segment01",
    frameCount: 73,
    fps: 24,
    scrollWeight: 1,
  },
  {
    id: "segment02",
    folder: "/sequences/segment02",
    frameCount: 73,
    fps: 24,
    scrollWeight: 1,
  },
  {
    id: "segment03",
    folder: "/sequences/segment03",
    frameCount: 145,
    fps: 24,
    scrollWeight: 1.75,
  },
] as const;

/** Padding for ezgif-frame-001.png style names */
export const FRAME_PAD_LENGTH = 3;

export const FRAME_FILENAME_PREFIX = "ezgif-frame-";

export function getFramePath(folder: string, frameIndex1Based: number): string {
  const padded = String(frameIndex1Based).padStart(FRAME_PAD_LENGTH, "0");
  return `${folder}/${FRAME_FILENAME_PREFIX}${padded}.png`;
}

export function getSegmentFrameUrls(segment: HeroSegment): string[] {
  return Array.from({ length: segment.frameCount }, (_, i) =>
    getFramePath(segment.folder, i + 1),
  );
}

export function getAllFrameUrls(): string[] {
  return HERO_SEGMENTS.flatMap(getSegmentFrameUrls);
}

export const TOTAL_FRAMES = HERO_SEGMENTS.reduce(
  (sum, s) => sum + s.frameCount,
  0,
);

export const TOTAL_SCROLL_WEIGHT = HERO_SEGMENTS.reduce(
  (sum, s) => sum + s.scrollWeight,
  0,
);

/** Cumulative frame index where each segment starts (0-based global index) */
export function getSegmentStartFrames(): number[] {
  const starts: number[] = [];
  let acc = 0;
  for (const segment of HERO_SEGMENTS) {
    starts.push(acc);
    acc += segment.frameCount;
  }
  return starts;
}

/**
 * Scroll distance in viewport heights for the pinned hero frame scrub.
 */
export const HERO_SEQUENCE_SCROLL_VH = 3.8;

/** Total pinned scroll (sequence scrub + portal zoom). */
export const HERO_SCROLL_VH = HERO_SEQUENCE_SCROLL_VH + HERO_PORTAL_SCROLL_VH;

/** GSAP scrub smoothing — higher feels more cinematic, lower more responsive */
export const HERO_SCRUB_SMOOTHING = 1.2;
