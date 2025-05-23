export const locales = ["bg", "en", "es", "fr", "de", "jp"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "bg";

export const localeNames: Record<Locale, string> = {
  bg: "Български",
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  jp: "日本語",
};

export const localeCountries: Record<Locale, string> = {
  bg: "Bulgaria",
  en: "USA",
  es: "Spain",
  fr: "France",
  de: "Germany",
  jp: "Japan",
};
