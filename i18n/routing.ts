import { defineRouting } from "next-intl/routing";

const postFirstPageRoute = "/posts?page=1";

export const routing = defineRouting({
  locales: ["bg", "en", "es", "fr", "de", "jp"],
  defaultLocale: "bg",
  pathnames: {
    "/": "/",
    "/posts": {
      bg: postFirstPageRoute,
      en: postFirstPageRoute,
    },
  },
});