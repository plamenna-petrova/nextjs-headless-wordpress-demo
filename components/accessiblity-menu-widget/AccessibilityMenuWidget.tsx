"use client";

import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { PersonStanding, X, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog";
import { localeCountries, localeNames, locales } from "@/lib/i18n";
import { Locale, useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import Cookies from 'js-cookie';

interface Language {
  code: string;
  name: string;
  country: string;
}

const languages: Language[] = locales.map((localeCode) => ({
  code: localeCode.toUpperCase(),
  name: localeNames[localeCode],
  country: localeCountries[localeCode]
}));

const AccessibilityMenuWidget = () => {
  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState<boolean>(false);
  const [isLanguageSelectionDialogOpen, setIsLanguageSelectionDialogOpen] = useState<boolean>(false);
  const [languageSearchTerm, setLanguageSearchTerm] = useState<string>("");
  const t = useTranslations("AccessibilityMenuWidget");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const languageSearchTermInputClassNames: string = "block w-full rounded-md border border-gray-300 bg-white py-2 px-3 pr-9 text-base dark:text-black " +
    "placeholder:text-sm placeholder:text-gray-600 leading-snug focus:border-blue-500 focus:outline-none " +
    "focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition duration-150 ease-in-out";

  useEffect(() => {
    const handleAccesibilityMenuToggleOnKeyDown = (keyboardEvent: KeyboardEvent): void => {
      const isMac: boolean = /Mac/i.test(navigator.userAgent) || navigator.platform.toUpperCase().includes("MAC");
      const ctrlKey: boolean = isMac ? keyboardEvent.metaKey : keyboardEvent.ctrlKey;

      if (ctrlKey && keyboardEvent.key.toLowerCase() === "a") {
        keyboardEvent.preventDefault();
        setIsAccessibilityMenuOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleAccesibilityMenuToggleOnKeyDown);
    return () => window.removeEventListener("keydown", handleAccesibilityMenuToggleOnKeyDown);
  }, []);

  const filteredLanguages: Language[] = languages.filter(({ name, code, country }) => {
    const languageSearchTermAsLowerCase: string = languageSearchTerm.toLowerCase();

    return (
      name.toLowerCase().includes(languageSearchTermAsLowerCase) ||
      code.toLowerCase().includes(languageSearchTermAsLowerCase) ||
      country.toLowerCase().includes(languageSearchTermAsLowerCase)
    )
  });

  const handleLocaleChange = (newLocale: Locale): void => { 
    Cookies.set('NEXT_LOCALE', newLocale, { expires: 365 });
    startTransition(() => {
      router.replace({ pathname }, { locale: newLocale });
    });
    setLanguageSearchTerm("");
    setIsLanguageSelectionDialogOpen(false);
  }

  return (
    <Sheet open={isAccessibilityMenuOpen} onOpenChange={setIsAccessibilityMenuOpen}>
      <SheetTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-10 z-50"
        >
          <button
            className="bg-blue-500 text-white p-4 rounded-full shadow-xl focus:outline-none"
            aria-label="Open Accessibility Menu"
          >
            <PersonStanding className="h-7 w-7 pointer-events-none" />
          </button>
        </motion.div>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 sm:w-96 p-0 [&>button]:hidden border-l-0">
        <div className="flex items-center justify-between mb-4 bg-blue-500 p-4">
          <div className="flex flex-row items-center gap-1">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="icon"
                className="rounded-full bg-white hover:bg-white text-blue-500"
                onClick={() => setIsAccessibilityMenuOpen(false)}
              >
                <X className="h-6 w-6 font-bold" />
              </Button>
            </motion.div>
            <div className="flex flex-col">
              <h2 className="text-md font-semibold ml-1 text-white">{t('title')}</h2>
              <h2 className="text-md font-semibold ml-1 text-white">{t('menuToggleShortcut')}</h2>
            </div>
          </div>
          <Dialog open={isLanguageSelectionDialogOpen} onOpenChange={setIsLanguageSelectionDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-white hover:bg-white py-2">
                <span className="pr-1 text-blue-500">{locale.toUpperCase()}</span>
                <ChevronDown className="h-6 w-5 text-blue-500 mt-[1px]" />
              </Button>
            </DialogTrigger>
            <DialogOverlay className="bg-black/0" />
            <DialogContent
              className="sm:max-w-xl w-full"
              onOpenAutoFocus={(event) => event.preventDefault()}
              aria-describedby={t('selectInterfaceLanguageDialog')}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl">{t('interfaceLanguage')}</DialogTitle>
              </DialogHeader>
              <div className="relative mt-4">
                <input
                  type="text"
                  name="searchLanguage"
                  autoFocus={false}
                  placeholder="Search Language..."
                  className={languageSearchTermInputClassNames}
                  value={languageSearchTerm}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setLanguageSearchTerm(event.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2 max-h-60 overflow-y-auto">
                {filteredLanguages.map((language: Language) => (
                  <Button
                    key={language.code}
                    variant="outline"
                    className="justify-start gap-3 h-auto py-3 px-3 hover:bg-blue-500 hover:text-white"
                    onClick={() => handleLocaleChange(language.code.toLowerCase() as Locale)}
                    disabled={isPending}
                  >
                    <span className="inline-grid place-items-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold leading-none">
                      {language.code}
                    </span>
                    <span className="text-sm">
                      {language.name} ({language.country})
                    </span>
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollArea className="mt-4 h-[calc(100vh-10rem)] pr-2">
          <div className="space-y-4">
            <Button variant="secondary" className="w-full">
              Increase Font Size
            </Button>
            <Button variant="secondary" className="w-full">
              High Contrast Mode
            </Button>
            <Button variant="secondary" className="w-full">
              Screen Reader Help
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default AccessibilityMenuWidget;