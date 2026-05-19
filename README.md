# Megaannum company website

Next.js site with a scroll-driven cinematic hero (GSAP ScrollTrigger + canvas image sequences).

## Setup

```bash
npm install
```

Add PNG sequences under `public/sequences/` (see `public/sequences/README.md`).

```bash
npm run dev
```

## Hero tuning

Edit `src/lib/hero/segments.config.ts`:

- `HERO_SCROLL_VH` — scroll length while pinned (default `3.8`)
- `HERO_SCRUB_SMOOTHING` — GSAP scrub lag (default `1.2`)
- `scrollWeight` per segment — segment03 is weighted higher for the tunnel exit

## Stack

- Next.js App Router
- React, TypeScript, Tailwind CSS
- GSAP + ScrollTrigger
- HTML canvas frame rendering
