import { defineConfig } from "vitest/config";

// Only the CMS mapper is under test — a regex parser and a fallback merge, where
// a silent failure means wrong numbers on the live site. Everything else is prop
// plumbing that tsc already covers, so there is no DOM environment here.
export default defineConfig({
  // tsconfig sets jsx: "preserve" for Next, which would leave the partner SVG
  // components untransformed. The mapper imports them for its fallbacks.
  oxc: { jsx: "automatic" },
  resolve: { tsconfigPaths: true },
  test: { include: ["src/**/*.test.ts"] },
});
