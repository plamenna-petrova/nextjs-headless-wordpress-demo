import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["bg", "en", "es", "fr", "de", "jp"],
  defaultLocale: "bg",
  pathnames: {
    '/': '/',
    '/posts': {
      bg: '/публикации',
      en: '/posts'
    }
  }
});