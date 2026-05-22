"use client";

import { useState } from "react";

import { VISION_YOUTUBE_VIDEO_ID } from "./vision.config";

type VisionVideoProps = {
  videoId?: string;
  title?: string;
  className?: string;
};

export default function VisionVideo({
  videoId = VISION_YOUTUBE_VIDEO_ID,
  title = "Megaannum platform overview",
  className = "",
}: VisionVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const posterUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden bg-neutral-900 lg:aspect-auto lg:h-full lg:min-h-[inherit] ${className}`.trim()}
    >
      {isPlaying ? (
        <iframe
          src={embedSrc}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-black/35" aria-hidden />

          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center transition hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label={`Play video: ${title}`}
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/50 backdrop-blur-sm transition hover:scale-105 md:h-18 md:w-18">
              <svg
                viewBox="0 0 24 24"
                className="ml-1 h-7 w-7 fill-white md:h-8 md:w-8"
                aria-hidden
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        </>
      )}
    </div>
  );
}
