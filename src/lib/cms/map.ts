/**
 * Map a raw CMS payload onto the section view-models, falling back to the
 * bundled configs field by field.
 *
 * The payload is typed `unknown` on purpose. A mirrored copy of the CMS
 * `Content` type would be the fourth in the fleet (after the pydantic schema and
 * the editor's own types.ts) and would need keeping in sync with both. Reading
 * defensively costs a handful of helpers and removes that burden entirely --
 * the same approach the CMS uses at its own trust boundary in
 * frontend/src/lib/cms/defaults.ts.
 */

import { HERO_CONTENT, type HeroContent } from "@/components/hero/hero.config";
import {
  CONTACT_CONTENT,
  type ContactContent,
  type ContactDetail,
} from "@/components/sections/contact/contact.config";
import {
  PARTNERS,
  type PartnerView,
} from "@/components/sections/partners/partners.config";
import {
  BOARD_CONTENT,
  type PeopleContent,
  type TeamMember,
} from "@/components/sections/people/people.config";
import {
  PLATFORM_CONTENT,
  type PlatformContent,
  type PlatformStat,
} from "@/components/sections/platform/platform.config";

type Rec = Record<string, unknown>;

const obj = (v: unknown): Rec =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Rec) : {};

/**
 * `&& v` is load-bearing: the CMS defaults its newer fields to "" so documents
 * published before those fields existed still parse. Treating empty as absent
 * turns those into the bundled default with no migration and no version check.
 */
const str = (v: unknown, fallback: string): string =>
  typeof v === "string" && v ? v : fallback;

const num = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

/** Objects only, and an empty result falls back — half a list is worse than the default. */
function rows(v: unknown): Rec[] | null {
  if (!Array.isArray(v)) return null;
  const kept = v.filter(
    (r): r is Rec => Boolean(r) && typeof r === "object" && !Array.isArray(r),
  );
  return kept.length ? kept : null;
}

/** An ImageRef becomes a URL on the CMS's public image route (no key: browsers fetch it). */
function imageUrl(ref: unknown): { url: string; width: number; height: number } | null {
  const r = obj(ref);
  const width = num(r.width);
  const height = num(r.height);
  const base = process.env.CMS_API_BASE_URL;
  if (typeof r.id !== "string" || !r.id || !base || width === null || height === null) {
    return null;
  }
  return { url: `${base}/content/images/${r.id}`, width, height };
}

/**
 * The CMS stores a stat as one display string ("$41B", "320bps", "20,000+") but
 * the count-up does arithmetic on it, so it has to come apart.
 *
 * ponytail: one regex over a free-text field. If editors need real control over
 * formatting, give them three inputs (prefix / value / suffix) in the CMS.
 */
export function parseStat(value: string, label: string): PlatformStat | null {
  const m = /^(\D*)([\d.,]+)(.*)$/.exec(value.trim());
  if (!m) return null;
  const n = Number(m[2].replace(/,/g, ""));
  if (!Number.isFinite(n)) return null;
  return {
    value: n,
    ...(m[1] ? { prefix: m[1] } : {}),
    ...(m[3] ? { suffix: m[3] } : {}),
    label,
  };
}

export function heroContent(raw: unknown): HeroContent {
  const landing = obj(obj(raw).landing);
  const lines = rows(landing.lines)
    ?.map((l, i) => ({
      text: str(l.text, ""),
      color: str(l.color, HERO_CONTENT.headingLines[i]?.color ?? "#ffffff"),
    }))
    .filter((l) => l.text);
  return {
    logo: imageUrl(landing.logo),
    brand: HERO_CONTENT.brand,
    headingLines: lines?.length ? lines : HERO_CONTENT.headingLines,
    body: str(landing.lower, HERO_CONTENT.body),
  };
}

export function platformContent(raw: unknown): PlatformContent {
  const root = obj(raw);
  const edge = obj(root.edge);
  const asOf = str(edge.asOf, "");
  const stats = rows(edge.stats)
    ?.map((s) => parseStat(str(s.value, ""), str(s.label, "")))
    .filter((s): s is PlatformStat => s !== null && Boolean(s.label));
  return {
    headline: str(edge.heading, PLATFORM_CONTENT.headline),
    intro: str(edge.paragraph, PLATFORM_CONTENT.intro),
    stats: stats?.length ? stats : PLATFORM_CONTENT.stats,
    footnote: asOf ? `All statistics as of ${asOf}` : PLATFORM_CONTENT.footnote,
    background: str(obj(root.general).accent, PLATFORM_CONTENT.background),
  };
}

/** The bundled partners carry a Logo component; CMS partners carry an image. */
export function partnerList(raw: unknown): PartnerView[] {
  const fallback = (): PartnerView[] =>
    PARTNERS.map((p) => ({ id: p.id, name: p.name, image: null, Logo: p.Logo }));

  const partners = rows(obj(raw).partners);
  if (!partners) return fallback();

  const mapped = partners
    .map((p, i) => ({
      id: str(p.id, `partner-${i}`),
      name: str(p.name, ""),
      image: imageUrl(p.logo),
      Logo: null,
    }))
    // A partner with neither a name nor a logo has nothing to render.
    .filter((p) => p.name || p.image);
  return mapped.length ? mapped : fallback();
}

function member(m: Rec, index: number): TeamMember {
  const name = str(m.name, "");
  const role = str(m.title, "");
  const photo = imageUrl(m.photo);
  return {
    id: str(m.id, `member-${index}`),
    name,
    role,
    // Empty src is not a valid next/image input, so the card renders a
    // placeholder instead of dropping the person entirely.
    image: photo?.url ?? "",
    imageAlt: role ? `Portrait of ${name}, ${role}` : `Portrait of ${name}`,
  };
}

export function peopleContent(raw: unknown): PeopleContent {
  const team = obj(obj(raw).team);
  const board = rows(team.board)?.map(member).filter((m) => m.name);
  const portfolio = rows(team.portfolio)?.map(member).filter((m) => m.name);
  return {
    eyebrow: str(team.eyebrow, BOARD_CONTENT.eyebrow),
    heading: str(team.heading, BOARD_CONTENT.heading),
    members: board?.length ? board : BOARD_CONTENT.members,
    portfolioTeam: {
      heading: str(team.portfolioHeading, BOARD_CONTENT.portfolioTeam.heading),
      members: portfolio?.length ? portfolio : BOARD_CONTENT.portfolioTeam.members,
    },
  };
}

export function contactContent(raw: unknown): ContactContent {
  const contact = obj(obj(raw).contact);
  const details = rows(contact.blocks)
    ?.map((b): ContactDetail => {
      const value = str(b.value, "");
      return {
        label: str(b.label, ""),
        value,
        // `kind` is the CMS's only signal that a value is an address.
        ...(b.kind === "email" && value ? { href: `mailto:${value}` } : {}),
      };
    })
    .filter((d) => d.label && d.value);
  return {
    eyebrow: str(contact.eyebrow, CONTACT_CONTENT.eyebrow),
    heading: str(contact.headline, CONTACT_CONTENT.heading),
    subhead: str(contact.sub, CONTACT_CONTENT.subhead),
    details: details?.length ? details : CONTACT_CONTENT.details,
    // The form labels have no CMS source: they are markup, not copy.
    form: CONTACT_CONTENT.form,
  };
}
