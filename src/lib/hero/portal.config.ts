/**
 * Portal: sequence → white hold → platform reveal behind fading hero.
 */

/** Portal white hold / crossfade surface (not the platform section bg) */
export const PLATFORM_SURFACE_COLOR = "#f8f9fa";

/** Scale of platform when it first appears after the white hold */
export const PORTAL_INITIAL_SCALE = 0.36;

/** Share of portal scroll spent on white only (canvas / fill), before platform animates */
export const PORTAL_WHITE_HOLD_RATIO = 0.42;

/** Within the white-hold window, when to crossfade canvas → solid surface (0–1 of hold) */
export const PORTAL_WHITE_CROSSFADE_START = 0.62;

/** Pinned scroll (vh) for the portal phase */
export const HERO_PORTAL_SCROLL_VH = 1.05;

/** Within portal reveal (0–1): start fading hero shell so platform behind shows through */
export const PORTAL_HERO_FADE_START = 0.5;

/** Within portal reveal (0–1): start fading hero white fill (platform visible underneath) */
export const PORTAL_FILL_FADE_START = 0.2;

/** Portal reveal progress where handoff to normal page scroll is complete */
export const PORTAL_COMMIT_PROGRESS = 0.96;

/**
 * When scrubbing back into the hero sequence, keep the last tunnel frame until
 * sequence progress falls below this (0–1). Avoids advancing frames while the
 * hero is still hidden behind portal / white hold.
 */
export const PORTAL_BACK_SEQUENCE_HOLD_UNTIL = 0.62;
