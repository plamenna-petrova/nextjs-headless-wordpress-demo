import { Translate } from "@google-cloud/translate/build/src/v2/index.js";
import he from "he";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import fg from "fast-glob";

const { decode } = he;

dotenv.config();

const locales = ["bg", "en", "es", "fr", "de", "jp"] as const;

type Locale = (typeof locales)[number];

const googleTranslate: Translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

async function translateHTML(html: string, targetLanguage: Locale, keepOriginalText = false): Promise<string> {
  if (targetLanguage === "bg" && keepOriginalText) {
    return html;
  }
  
  const [translation] = await googleTranslate.translate(html, {
    to: targetLanguage,
    format: "html",
  });

  return translation;
}

const SOURCE_LOCALE: Locale = "bg";
const TARGET_LOCALES: Locale[] = ["en"];

async function translateMDX() {
  const pattern = `app/**/content-${SOURCE_LOCALE}/page.mdx`;
  const sourcePaths: string[] = await fg(pattern);

  if (sourcePaths.length === 0) {
    console.error(`❌ No source files found with pattern: ${pattern}`);
    process.exit(1);
  }

  for (const sourceFilePath of sourcePaths) {
    const sourceContent: string = await fs.readFile(sourceFilePath, "utf8");

    for (const locale of TARGET_LOCALES) {
      const targetFilePath = sourceFilePath.replace(
        `/content-${SOURCE_LOCALE}/`,
        `/content-${locale}/`
      );

      const rawTranslation: string = await translateHTML(sourceContent, locale);
      const translatedContent: string = decode(rawTranslation);

      await fs.mkdir(path.dirname(targetFilePath), { recursive: true });
      await fs.writeFile(targetFilePath, translatedContent, "utf8");

      console.log(`✅ Translated: ${sourceFilePath} → ${targetFilePath}`);
    }
  }
}

translateMDX().catch((err) => {
  console.error("❌ Error translating MDX:", err);
  process.exit(1);
});