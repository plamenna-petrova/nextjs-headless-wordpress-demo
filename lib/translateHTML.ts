import { Translate } from "@google-cloud/translate/build/src/v2";
import { Locale } from "@/lib/i18n";

const googleTranslate: Translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

export async function translateHTML(html: string, targetLanguage: Locale): Promise<string> {
  if (targetLanguage === "bg") {
    return html;
  }
  
  const [translation] = await googleTranslate.translate(html, {
    to: targetLanguage,
    format: "html",
  });

  return translation;
}