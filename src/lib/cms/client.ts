/**
 * Read published content from the CMS.
 *
 * Server-only: `CMS_SITE_API_KEY` is deliberately not a NEXT_PUBLIC_ var, so it
 * never reaches the browser. This runs in HomePage, a server component.
 */

/** How long Next's Data Cache holds a response. Matches the endpoint's own Cache-Control. */
const REVALIDATE_SECONDS = 60;

/** A hung CMS must not hang the page: this sits in the render path. */
const TIMEOUT_MS = 5000;

/**
 * The live `content` document, or `null` for every failure mode — unconfigured,
 * unreachable, unauthorized, or nothing published yet. Callers in `map.ts` fall
 * back to the bundled configs, so a null is a normal operating state and never
 * an error worth throwing over.
 */
export async function getSiteContent(): Promise<unknown> {
  const base = process.env.CMS_API_BASE_URL;
  const key = process.env.CMS_SITE_API_KEY;
  if (!base || !key) return null;

  try {
    const res = await fetch(`${base}/site/content`, {
      headers: { "X-Site-Key": key },
      // Next 15 does not cache fetch by default, so this opt-in IS the local
      // cache: one round trip a minute per deployment, however much traffic
      // arrives. Persisted under .next/cache, which `output: "standalone"` ships.
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const body: unknown = await res.json();
    return (body as { content?: unknown } | null)?.content ?? null;
  } catch {
    return null;
  }
}
