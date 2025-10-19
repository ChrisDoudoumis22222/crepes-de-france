// app/robots.ts
export default function robots() {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
    sitemap: null, // προαιρετικά απενεργοποιούμε sitemap
  };
}
