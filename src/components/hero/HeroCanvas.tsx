"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import {
  applyCanvasSize,
  computeDrawRect,
  getCanvasSize,
  type CanvasFit,
} from "@/lib/hero/canvasScale";

export type HeroCanvasHandle = {
  setImages: (images: HTMLImageElement[]) => void;
  setFrame: (globalFrame: number) => void;
  resize: () => void;
  getFrame: () => number;
};

type HeroCanvasProps = {
  className?: string;
  fit?: CanvasFit;
  maxDpr?: number;
};

const HeroCanvas = forwardRef<HeroCanvasHandle, HeroCanvasProps>(
  function HeroCanvas({ className = "", fit = "cover", maxDpr = 2 }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    const imagesRef = useRef<HTMLImageElement[]>([]);
    const targetFrameRef = useRef(0);
    const drawnFrameRef = useRef(-1);
    const rafRef = useRef<number | null>(null);
    const fitRef = useRef(fit);

    fitRef.current = fit;

    const drawFrame = useCallback((frame: number) => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      const images = imagesRef.current;

      if (!canvas || !ctx || images.length === 0) return;

      const clamped = Math.max(0, Math.min(frame, images.length - 1));
      const image = images[clamped];

      if (!image?.complete || !image.naturalWidth) return;

      const { width, height } = canvas;
      const rect = computeDrawRect(
        image.naturalWidth,
        image.naturalHeight,
        width,
        height,
        fitRef.current,
      );

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(
        image,
        rect.sx,
        rect.sy,
        rect.sw,
        rect.sh,
        rect.dx,
        rect.dy,
        rect.dw,
        rect.dh,
      );

      drawnFrameRef.current = clamped;
    }, []);

    const resize = useCallback(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const size = getCanvasSize(container, maxDpr);
      applyCanvasSize(canvas, size);

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      ctxRef.current = ctx;
      drawnFrameRef.current = -1;
      drawFrame(targetFrameRef.current);
    }, [drawFrame, maxDpr]);

    const loop = useCallback(() => {
      const target = targetFrameRef.current;
      if (target !== drawnFrameRef.current) {
        drawFrame(target);
      }
      rafRef.current = requestAnimationFrame(loop);
    }, [drawFrame]);

    useEffect(() => {
      resize();
      rafRef.current = requestAnimationFrame(loop);

      const container = containerRef.current;
      if (!container) {
        return () => {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
      }

      const ro = new ResizeObserver(() => resize());
      ro.observe(container);

      return () => {
        ro.disconnect();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [loop, resize]);

    useImperativeHandle(
      ref,
      () => ({
        setImages(images: HTMLImageElement[]) {
          imagesRef.current = images;
          drawnFrameRef.current = -1;
          drawFrame(targetFrameRef.current);
        },
        setFrame(globalFrame: number) {
          targetFrameRef.current = globalFrame;
          // Draw immediately so scroll scrub never waits on rAF
          if (globalFrame !== drawnFrameRef.current) {
            drawFrame(globalFrame);
          }
        },
        resize,
        getFrame: () => targetFrameRef.current,
      }),
      [drawFrame, resize],
    );

    return (
      <div
        ref={containerRef}
        className={`absolute inset-0 overflow-hidden bg-[#030712] ${className}`}
        aria-hidden
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>
    );
  },
);

export default HeroCanvas;
