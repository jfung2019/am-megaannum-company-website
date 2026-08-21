import { beforeAll, describe, expect, it } from "vitest";

// imageUrl reads this at call time to build image URLs, so it must be set
// before the assertions — not before the imports.
const BASE = "http://cms.test/api/v1";

import { HERO_CONTENT } from "@/components/hero/hero.config";
import { CONTACT_CONTENT } from "@/components/sections/contact/contact.config";
import { PARTNERS } from "@/components/sections/partners/partners.config";
import { BOARD_CONTENT } from "@/components/sections/people/people.config";
import { PLATFORM_CONTENT } from "@/components/sections/platform/platform.config";
import {
  contactContent,
  heroContent,
  parseStat,
  partnerList,
  peopleContent,
  platformContent,
} from "@/lib/cms/map";

beforeAll(() => {
  process.env.CMS_API_BASE_URL = BASE;
});

const img = (id: string) => ({ id, width: 100, height: 50, mime: "image/png" });

function payload() {
  return {
    general: { accent: "#123456" },
    landing: {
      logo: img("brand-1"),
      heroVideo: { id: "hero-1", width: 1920, height: 1080, mime: "video/mp4" },
      lower: "CMS body copy.",
      lines: [
        { id: "1", text: "Published", color: "#ffffff" },
        { id: "2", text: "Headline", color: "#EC721A" },
      ],
    },
    edge: {
      heading: "Published heading",
      paragraph: "Published paragraph.",
      asOf: "March 2027",
      stats: [
        { id: "a", value: "$41B", label: "Assets under intelligence" },
        { id: "b", value: "20,000+", label: "Decisions made" },
      ],
    },
    partners: [{ id: "p1", name: "Northmark", logo: img("logo-1") }],
    team: {
      eyebrow: "CMS eyebrow",
      heading: "CMS heading",
      portfolioHeading: "CMS portfolio",
      board: [{ id: "m1", name: "Miriam", title: "Chair", photo: img("photo-1") }],
      portfolio: [{ id: "m2", name: "Lucas", title: "CIO", photo: img("photo-2") }],
    },
    contact: {
      eyebrow: "CMS contact",
      headline: "CMS headline",
      sub: "CMS sub",
      blocks: [
        { id: "b1", label: "Sales", value: "sales@x.com", kind: "email" },
        { id: "b2", label: "HQ", value: "Hong Kong", kind: "text" },
      ],
    },
  };
}

describe("parseStat", () => {
  it.each([
    ["$41B", { value: 41, prefix: "$", suffix: "B" }],
    ["20,000+", { value: 20000, suffix: "+" }],
    ["320bps", { value: 320, suffix: "bps" }],
    ["11 min", { value: 11, suffix: " min" }],
    ["5", { value: 5 }],
  ])("splits %s", (input, expected) => {
    expect(parseStat(input, "label")).toMatchObject(expected);
  });

  it("returns null when there is no number to count up to", () => {
    // Rendering NaN would be worse than dropping the stat.
    expect(parseStat("one in three", "label")).toBeNull();
    expect(parseStat("", "label")).toBeNull();
  });
});

describe("mapping a published payload", () => {
  it("reads the CMS values", () => {
    const raw = payload();

    expect(heroContent(raw)).toEqual({
      logo: {
        url: `${BASE}/content/images/brand-1`,
        width: 100,
        height: 50,
        mime: "image/png",
      },
      brand: HERO_CONTENT.brand,
      headingLines: [
        { text: "Published", color: "#ffffff" },
        { text: "Headline", color: "#EC721A" },
      ],
      body: "CMS body copy.",
      videoUrl: `${BASE}/content/images/hero-1`,
    });

    expect(platformContent(raw)).toEqual({
      headline: "Published heading",
      intro: "Published paragraph.",
      stats: [
        { value: 41, prefix: "$", suffix: "B", label: "Assets under intelligence" },
        { value: 20000, suffix: "+", label: "Decisions made" },
      ],
      footnote: "All statistics as of March 2027",
      background: "#123456",
    });

    expect(partnerList(raw)).toEqual([
      {
        id: "p1",
        name: "Northmark",
        image: {
          url: `${BASE}/content/images/logo-1`,
          width: 100,
          height: 50,
          mime: "image/png",
        },
        Logo: null,
      },
    ]);

    const people = peopleContent(raw);
    expect(people.eyebrow).toBe("CMS eyebrow");
    expect(people.portfolioTeam.heading).toBe("CMS portfolio");
    expect(people.members).toEqual([
      {
        id: "m1",
        name: "Miriam",
        role: "Chair",
        image: `${BASE}/content/images/photo-1`,
        imageMime: "image/png",
        imageAlt: "Portrait of Miriam, Chair",
      },
    ]);

    expect(contactContent(raw).details).toEqual([
      { label: "Sales", value: "sales@x.com", href: "mailto:sales@x.com" },
      { label: "HQ", value: "Hong Kong" },
    ]);
    // No CMS source for the form labels.
    expect(contactContent(raw).form).toBe(CONTACT_CONTENT.form);
  });
});

describe("falling back to the bundled configs", () => {
  it.each([
    ["null", null],
    ["undefined", undefined],
    ["empty object", {}],
    ["a string", "nonsense"],
    ["wrong-typed fields", { edge: 5, team: [], contact: "x", partners: {}, landing: 0 }],
    ["empty lists", { edge: { stats: [] }, team: { board: [] }, contact: { blocks: [] }, partners: [] }],
    ["lists of junk", { edge: { stats: [1, "a"] }, partners: [null], team: { board: ["x"] } }],
  ])("yields the defaults for %s", (_name, raw) => {
    expect(heroContent(raw)).toEqual(HERO_CONTENT);
    expect(platformContent(raw)).toEqual(PLATFORM_CONTENT);
    expect(peopleContent(raw)).toEqual(BOARD_CONTENT);
    expect(contactContent(raw)).toEqual(CONTACT_CONTENT);
    expect(partnerList(raw).map((p) => p.name)).toEqual(PARTNERS.map((p) => p.name));
  });

  it("keeps the bundled clip when the CMS has no hero video", () => {
    // The hero must never render a blank <video>, and documents published before
    // the field existed have no heroVideo at all.
    expect(heroContent({ landing: { logo: null } }).videoUrl).toBe(HERO_CONTENT.videoUrl);
    expect(heroContent({ landing: { heroVideo: { id: "x" } } }).videoUrl).toBe(
      HERO_CONTENT.videoUrl,
    );
  });

  it("leaves the logo null when the CMS has none, so the wordmark shows instead", () => {
    // next/image rejects an empty src, and the nav must not render blank.
    expect(heroContent({ landing: { logo: null } }).logo).toBeNull();
    // An ImageRef missing its dimensions is unusable too.
    expect(heroContent({ landing: { logo: { id: "x" } } }).logo).toBeNull();
  });

  it("treats a blank heading as absent, so pre-migration documents still read well", () => {
    // The CMS defaults its newer fields to "" so older documents parse. Those
    // must show the bundled copy, not an empty heading.
    const raw = { ...payload(), edge: { ...payload().edge, heading: "" } };
    expect(platformContent(raw).headline).toBe(PLATFORM_CONTENT.headline);

    const team = { ...payload().team, eyebrow: "", portfolioHeading: "" };
    expect(peopleContent({ team }).eyebrow).toBe(BOARD_CONTENT.eyebrow);
    expect(peopleContent({ team }).portfolioTeam.heading).toBe(
      BOARD_CONTENT.portfolioTeam.heading,
    );
  });

  it("drops only the unparseable stat, keeping the rest", () => {
    const edge = {
      ...payload().edge,
      stats: [
        { id: "a", value: "$41B", label: "Good" },
        { id: "b", value: "many", label: "Bad" },
      ],
    };
    expect(platformContent({ edge }).stats).toEqual([
      { value: 41, prefix: "$", suffix: "B", label: "Good" },
    ]);
  });

  it("keeps a member whose photo is missing, with an empty image for the placeholder", () => {
    const team = { board: [{ id: "m1", name: "Miriam", title: "Chair", photo: null }] };
    expect(peopleContent({ team }).members).toEqual([
      {
        id: "m1",
        name: "Miriam",
        role: "Chair",
        image: "",
        imageMime: "",
        imageAlt: "Portrait of Miriam, Chair",
      },
    ]);
  });

  it("marks an SVG image so next/image skips optimizing it", () => {
    // The CMS route has no file extension, so next/image can't tell an SVG
    // from a raster image by URL alone -- it 400s trying to optimize one.
    const raw = {
      partners: [{ id: "p1", name: "Acme", logo: img("logo-1") }],
    };
    raw.partners[0].logo = { id: "logo-1", width: 100, height: 50, mime: "image/svg+xml" };
    expect(partnerList(raw)[0].image?.mime).toBe("image/svg+xml");
  });
});
