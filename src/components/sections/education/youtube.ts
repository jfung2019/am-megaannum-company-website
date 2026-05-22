/** Extract a YouTube video ID from a URL or bare 11-character id */
export function parseYoutubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);

    if (url.hostname === "youtu.be") {
      const id = url.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }

    if (url.hostname.includes("youtube.com")) {
      const fromQuery = url.searchParams.get("v");
      if (fromQuery) return fromQuery;

      const embed = url.pathname.match(/^\/embed\/([^/?]+)/);
      if (embed?.[1]) return embed[1];

      const shorts = url.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shorts?.[1]) return shorts[1];
    }
  } catch {
    return null;
  }

  return null;
}
