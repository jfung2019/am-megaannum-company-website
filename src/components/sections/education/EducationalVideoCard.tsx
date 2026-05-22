"use client";

import { useState } from "react";

import { parseYoutubeVideoId } from "./youtube";

type EducationalVideoCardProps = {
  title: string;
  description: string;
  youtubeUrl: string;
  className?: string;
};

export default function EducationalVideoCard({
  title,
  description,
  youtubeUrl,
  className = "",
}: EducationalVideoCardProps) {
  const videoId = parseYoutubeVideoId(youtubeUrl);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoId) {
    return (
      <article
        className={`rounded-sm border border-black/10 bg-white p-6 ${className}`.trim()}
      >
        <p className="text-sm text-black/60">Invalid YouTube URL for “{title}”.</p>
      </article>
    );
  }

  const posterUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-sm border border-black/8 bg-white shadow-sm shadow-black/5 ${className}`.trim()}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
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
            <div className="absolute inset-0 bg-black/30" aria-hidden />

            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center transition hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ec721a] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label={`Play video: ${title}`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/50 backdrop-blur-sm transition hover:scale-105 md:h-16 md:w-16">
                <svg
                  viewBox="0 0 24 24"
                  className="ml-0.5 h-6 w-6 fill-white md:h-7 md:w-7"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="text-lg font-medium tracking-tight text-[#1c1c1c] md:text-xl">
          {title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-black/60 md:text-[0.95rem]">
          {description}
        </p>
      </div>
    </article>
  );
}
