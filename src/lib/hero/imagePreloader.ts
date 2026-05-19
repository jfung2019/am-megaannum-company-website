export type PreloadProgress = {
  loaded: number;
  total: number;
  ratio: number;
};

export type PreloadOptions = {
  /** Max concurrent image requests */
  concurrency?: number;
  onProgress?: (progress: PreloadProgress) => void;
  signal?: AbortSignal;
};

function loadImage(url: string, signal?: AbortSignal): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const img = new Image();
    img.decoding = "async";

    const onAbort = () => {
      img.src = "";
      reject(new DOMException("Aborted", "AbortError"));
    };

    signal?.addEventListener("abort", onAbort, { once: true });

    img.onload = async () => {
      signal?.removeEventListener("abort", onAbort);
      if (typeof img.decode === "function") {
        try {
          await img.decode();
        } catch {
          /* decode optional — draw when onload fires */
        }
      }
      resolve(img);
    };

    img.onerror = () => {
      signal?.removeEventListener("abort", onAbort);
      reject(new Error(`Failed to load image: ${url}`));
    };

    img.src = url;
  });
}

/**
 * Preload URLs in batches; returns images in the same order as urls.
 */
export async function preloadImages(
  urls: readonly string[],
  options: PreloadOptions = {},
): Promise<HTMLImageElement[]> {
  const { concurrency = 10, onProgress, signal } = options;
  const total = urls.length;
  const results: HTMLImageElement[] = new Array(total);
  let loaded = 0;
  let nextIndex = 0;

  const report = () => {
    onProgress?.({ loaded, total, ratio: total ? loaded / total : 1 });
  };

  const worker = async (): Promise<void> => {
    while (nextIndex < total) {
      if (signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      const index = nextIndex++;
      const url = urls[index];
      const img = await loadImage(url, signal);
      results[index] = img;
      loaded++;
      report();
    }
  };

  const poolSize = Math.min(concurrency, total);
  await Promise.all(Array.from({ length: poolSize }, () => worker()));

  return results;
}

/**
 * Progressive preload: segment 01 first for fast hero start, then remaining.
 */
export async function preloadHeroSequences(
  segmentUrls: readonly (readonly string[])[],
  options: PreloadOptions = {},
): Promise<HTMLImageElement[][]> {
  const results: HTMLImageElement[][] = [];

  for (const urls of segmentUrls) {
    const images = await preloadImages(urls, options);
    results.push(images);
  }

  return results;
}

/** Flatten segment batches into one array for canvas indexing */
export function flattenSegmentImages(
  batches: HTMLImageElement[][],
): HTMLImageElement[] {
  return batches.flat();
}
