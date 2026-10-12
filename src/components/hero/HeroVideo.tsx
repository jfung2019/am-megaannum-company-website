"use client";

import { useEffect, useRef } from "react";

type HeroVideoProps = {
  src: string;
};

/** Background video that stays paused while the OS "reduce motion" setting is on. */
export default function HeroVideo({ src }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (query.matches) {
        video.pause();
      } else {
        void video.play().catch(() => {});
      }
    };

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [src]);

  // src on the element, not a typed <source>: the CMS serves whatever mime
  // was uploaded and a wrong `type` makes the browser skip the file.
  return (
    <video
      ref={videoRef}
      key={src}
      src={src}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      aria-hidden
    />
  );
}
