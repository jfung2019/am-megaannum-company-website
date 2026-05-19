export type CanvasFit = "cover" | "contain";

export type DrawRect = {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
};

export type CanvasSize = {
  width: number;
  height: number;
  dpr: number;
};

/** Cap DPR for mobile performance while keeping sharpness on desktop */
export function getDevicePixelRatio(max = 2): number {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, max);
}

export function getCanvasSize(
  container: HTMLElement,
  maxDpr = 2,
): CanvasSize {
  const rect = container.getBoundingClientRect();
  const dpr = getDevicePixelRatio(maxDpr);
  return {
    width: Math.max(1, Math.floor(rect.width * dpr)),
    height: Math.max(1, Math.floor(rect.height * dpr)),
    dpr,
  };
}

/**
 * Compute source/dest rectangles for drawImage with cover or contain fit.
 */
export function computeDrawRect(
  imageWidth: number,
  imageHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  fit: CanvasFit = "cover",
): DrawRect {
  const imageAspect = imageWidth / imageHeight;
  const canvasAspect = canvasWidth / canvasHeight;

  let dw: number;
  let dh: number;

  if (fit === "cover") {
    if (canvasAspect > imageAspect) {
      dw = canvasWidth;
      dh = canvasWidth / imageAspect;
    } else {
      dh = canvasHeight;
      dw = canvasHeight * imageAspect;
    }
  } else {
    if (canvasAspect > imageAspect) {
      dh = canvasHeight;
      dw = canvasHeight * imageAspect;
    } else {
      dw = canvasWidth;
      dh = canvasWidth / imageAspect;
    }
  }

  const dx = (canvasWidth - dw) / 2;
  const dy = (canvasHeight - dh) / 2;

  return {
    dx,
    dy,
    dw,
    dh,
    sx: 0,
    sy: 0,
    sw: imageWidth,
    sh: imageHeight,
  };
}

export function applyCanvasSize(
  canvas: HTMLCanvasElement,
  size: CanvasSize,
): void {
  canvas.width = size.width;
  canvas.height = size.height;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
}
