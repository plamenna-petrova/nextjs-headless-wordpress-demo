export const mdxPages = {
  bg: {
    "introduction/content-bg/page.mdx": () => import("./introduction/content-bg/page.mdx"),
    "about-the-application/content-bg/page.mdx": () => import("./about-the-application/content-bg/page.mdx"),
    "core-principles/content-bg/page.mdx": () => import("./core-principles/content-bg/page.mdx"),
    "rest-api-functions/content-bg/page.mdx": () => import("./rest-api-functions/content-bg/page.mdx"),
  },
  en: {
    "introduction/content-en/page.mdx": () => import("./introduction/content-en/page.mdx"),
    "about-the-application/content-en/page.mdx": () => import("./about-the-application/content-en/page.mdx"),
    "core-principles/content-en/page.mdx": () => import("./core-principles/content-en/page.mdx"),
    "rest-api-functions/content-en/page.mdx": () => import("./rest-api-functions/content-en/page.mdx"),
  },
};