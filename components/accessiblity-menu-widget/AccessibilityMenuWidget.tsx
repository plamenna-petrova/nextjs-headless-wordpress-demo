"use client";

import { ChangeEvent, useEffect, useMemo, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { PersonStanding, X, ChevronDown, Search, Brain, Eye, Glasses, Hand, MousePointer, Blend, Signature, ScanLine, Zap, BookA, MonitorPlay, Droplet, Sun, Moon, Contrast, Eclipse, ChevronsUpDown, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { localeCountries, localeNames, locales } from "@/lib/i18n";
import { Locale, useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { AccessibilityOptionDefinition, accessibilityOptionsDefinitions, AccessibilityProfileDefinition, accessibilityProfilesDefinitions, ColorBlindnessCommandValueType, ColorBlindnessType, colorBlindnessTypes, useAccessibilityStore } from "@/stores/accessibilityStore";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { mergeClassNames } from "@/lib/utils";
import Cookies from 'js-cookie';

interface Language {
  code: string;
  name: string;
  country: string;
}

interface AccessibilityProfile {
  name: string;
  definition: AccessibilityProfileDefinition;
  icon: LucideIcon;
}

interface AccessibilityOption {
  name: string;
  definition: AccessibilityOptionDefinition;
  icon?: LucideIcon;
  actionElement?: JSX.Element;
}

interface ColorBlindnessCommandItem {
  value: string;
  label: string;
}

const AccessibilityMenuWidget = () => {
  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState<boolean>(false);
  const [isLanguageSelectionDialogOpen, setIsLanguageSelectionDialogOpen] = useState<boolean>(false);
  const [languageSearchTerm, setLanguageSearchTerm] = useState<string>("");
  const [isColorBlindnessPopoverOpen, setIsColorBlindnessPopoverOpen] = useState<boolean>(false);
  const [colorBlindnessCommandValue, setColorBlindnessCommandValue] = useState<string>(Object.values(colorBlindnessTypes)[0]);
  const [isPending, startTransition] = useTransition();
  const { activeAccessibilityProfile, activeAccessibilityOptions, setActiveAccessibilityProfile, setIsHoverSpeechEnabled, setActiveAccessibilityOptions } = useAccessibilityStore();
  const { speakText, stopSpeakingAsync } = useSpeechSynthesis();
  const t = useTranslations("AccessibilityMenuWidget");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages: Language[] = locales.map((localeCode) => ({
    code: localeCode.toUpperCase(),
    name: localeNames[localeCode],
    country: localeCountries[localeCode]
  }));

  const colorBlindnessCommandItems: ColorBlindnessCommandItem[] = Object.entries(colorBlindnessTypes).map(([key, value]) => ({
    value: value as ColorBlindnessCommandValueType,
    label: t(`colorBlindnessTypes.${key.toLowerCase()}`)
  }));

  const colorBlindnessColors: Record<string, string> = useMemo(() => ({
    [colorBlindnessTypes.PROTANOMALY]: "#A05046",
    [colorBlindnessTypes.DEUTERANOMALY]: "#AE6D40",
    [colorBlindnessTypes.TRITANOMALY]: "#DC363D",
    [colorBlindnessTypes.PROTANOPIA]: "#5D5D47",
    [colorBlindnessTypes.DEUTERANOPIA]: "#85853c",
    [colorBlindnessTypes.TRITANOPIA]: "#DC3737",
    [colorBlindnessTypes.ACHROMATOMALY]: "#B46B6F",
    [colorBlindnessTypes.ACHROMATOPSIA]: "#878787",
  }), []);

  const accessibilityProfiles: AccessibilityProfile[] = [
    {
      name: t("accessibilityProfilesDefinitions.blind"),
      definition: accessibilityProfilesDefinitions.BLIND,
      icon: Eye
    },
    {
      name: t("accessibilityProfilesDefinitions.elderly"),
      definition: accessibilityProfilesDefinitions.ELDERLY,
      icon: Glasses
    },
    {
      name: t("accessibilityProfilesDefinitions.motorImpaired"),
      definition: accessibilityProfilesDefinitions.MOTOR_IMPAIRED,
      icon: MousePointer
    },
    {
      name: t("accessibilityProfilesDefinitions.visuallyImpaired"),
      definition: accessibilityProfilesDefinitions.VISUALLY_IMPAIRED,
      icon: ScanLine
    },
    {
      name: t("accessibilityProfilesDefinitions.colorBlind"),
      definition: accessibilityProfilesDefinitions.COLOR_BLIND,
      icon: Blend
    },
    {
      name: t("accessibilityProfilesDefinitions.dyslexia"),
      definition: accessibilityProfilesDefinitions.DYSLEXIA,
      icon: Signature
    },
    {
      name: t("accessibilityProfilesDefinitions.cognitiveAndLearning"),
      definition: accessibilityProfilesDefinitions.COGNITIVE_AND_LEARNING,
      icon: Brain
    },
    {
      name: t("accessibilityProfilesDefinitions.seizureAndEpileptic"),
      definition: accessibilityProfilesDefinitions.SEIZURE_AND_EPILEPTIC,
      icon: Zap
    },
    {
      name: t("accessibilityProfilesDefinitions.adhd"),
      definition: accessibilityProfilesDefinitions.ADHD,
      icon: Hand
    }
  ];

  const accessibilityOptions: AccessibilityOption[] = [
    {
      name: t("accessibilityOptionsDefinitions.colorBlindness"),
      definition: accessibilityOptionsDefinitions.COLOR_BLINDNESS,
      actionElement: (
        <Popover open={isColorBlindnessPopoverOpen} onOpenChange={setIsColorBlindnessPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isColorBlindnessPopoverOpen}
              className="w-[150px] justify-between text-[0.75rem]"
            >
              {colorBlindnessCommandValue
                ? colorBlindnessCommandItems.find((colorBlindnessCommandItem) => colorBlindnessCommandItem.value === colorBlindnessCommandValue)?.label
                : `${t("colorBlindnessTypes.searchType")}...`
              }
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[150px] p-0 overflow-y-auto pointer-events-auto"
            onWheel={(event) => event.stopPropagation()}
          >
            <Command>
              <CommandInput
                placeholder={`${t("colorBlindnessTypes.searchType")}...`}
                className="text-[0.75rem]"
              />
              <CommandList className="overflow-y-auto">
                <CommandEmpty>{t("colorBlindnessTypes.noResultsFound")}</CommandEmpty>
                <CommandGroup>
                  {colorBlindnessCommandItems.map((colorBlindnessCommandItem) => (
                    <CommandItem
                      key={colorBlindnessCommandItem.value}
                      value={colorBlindnessCommandItem.value}
                      keywords={[colorBlindnessCommandItem.label.toLowerCase()]}
                      onSelect={(currentValue: string) => {
                        setColorBlindnessCommandValue(currentValue === colorBlindnessCommandValue ? "" : currentValue);
                        setIsColorBlindnessPopoverOpen(false);
                      }}
                      className="text-[0.75rem]"
                    >
                      <Check
                        className={mergeClassNames(
                          "h-4 w-4",
                          colorBlindnessCommandValue === colorBlindnessCommandItem.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {colorBlindnessCommandItem.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )
    },
    {
      name: t("accessibilityOptionsDefinitions.screenReader"),
      definition: accessibilityOptionsDefinitions.SCREEN_READER,
      icon: MonitorPlay
    },
    {
      name: t("accessibilityOptionsDefinitions.dictionary"),
      definition: accessibilityOptionsDefinitions.DICTIONARY,
      icon: BookA
    },
    {
      name: t("accessibilityOptionsDefinitions.readingMask"),
      definition: accessibilityOptionsDefinitions.READING_MASK,
      icon: Blend
    },
    {
      name: t("accessibilityOptionsDefinitions.invertColors"),
      definition: accessibilityOptionsDefinitions.INVERT_COLORS,
      icon: Droplet
    },
    {
      name: t("accessibilityOptionsDefinitions.lightContrast"),
      definition: accessibilityOptionsDefinitions.LIGHT_CONTRAST,
      icon: Sun
    },
    {
      name: t("accessibilityOptionsDefinitions.darkContrast"),
      definition: accessibilityOptionsDefinitions.DARK_CONTRAST,
      icon: Moon
    },
    {
      name: t("accessibilityOptionsDefinitions.highContrast"),
      definition: accessibilityOptionsDefinitions.HIGH_CONTRAST,
      icon: Contrast
    },
    {
      name: t("accessibilityOptionsDefinitions.smartContrast"),
      definition: accessibilityOptionsDefinitions.SMART_CONTRAST,
      icon: Eclipse
    }
  ];

  const languageSearchTermInputClassNames: string = mergeClassNames(
    "block w-full rounded-md border border-gray-300 bg-white py-2 px-3 pr-9 text-base dark:text-black",
    "placeholder:text-sm placeholder:text-gray-600 leading-snug focus:border-blue-500 focus:outline-none",
    "focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition duration-150 ease-in-out"
  );

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

    const pathSegments: string[] = pathname.split('/');

    if (pathSegments[1] === 'documentation') {
      const lastPathSegment: string = pathSegments[pathSegments.length - 1];
      const updatedLastPathSegment: string = lastPathSegment.replace(/-(en|bg)$/, `-${newLocale}`);
      pathSegments[pathSegments.length - 1] = updatedLastPathSegment;
    }

    const newJoinedPath: string = pathSegments.join('/');

    startTransition(() => {
      router.replace({ pathname: newJoinedPath as any }, { locale: newLocale });
    });

    setLanguageSearchTerm("");
    setIsLanguageSelectionDialogOpen(false);
  }

  const handleAccessibilityProfileClick = async (accessibilityProfileDefinition: AccessibilityProfileDefinition): Promise<void> => {
    if (activeAccessibilityProfile === accessibilityProfileDefinition) {
      setActiveAccessibilityProfile(null);

      if (accessibilityProfileDefinition === accessibilityProfilesDefinitions.BLIND) {
        setIsHoverSpeechEnabled(false);
        await stopSpeakingAsync();
      }

      return;
    }

    setActiveAccessibilityProfile(accessibilityProfileDefinition);

    if (accessibilityProfileDefinition === accessibilityProfilesDefinitions.BLIND) {
      await stopSpeakingAsync().then(() => {
        speakText(t("screenReaderEnabled"), (): void => {
          setIsHoverSpeechEnabled(true);
        });
      });
    }
  }

  const handleAccessibilityOptionClick = (accessibilityOptionDefinition: AccessibilityOptionDefinition): void => {
    const updatedAccessibilityOptions: Set<AccessibilityOptionDefinition> = new Set(activeAccessibilityOptions || []);

    if (activeAccessibilityOptions?.has(accessibilityOptionDefinition)) {
      updatedAccessibilityOptions.delete(accessibilityOptionDefinition);
      setActiveAccessibilityOptions(updatedAccessibilityOptions);
    } else {
      updatedAccessibilityOptions.add(accessibilityOptionDefinition);
      setActiveAccessibilityOptions(updatedAccessibilityOptions);
    }
  }

  useEffect(() => {
    const handleAccesibilityMenuToggleOnKeyDown = (keyboardEvent: KeyboardEvent): void => {
      const isMac: boolean = /Mac/i.test(navigator.userAgent);
      const ctrlKey: boolean = isMac ? keyboardEvent.metaKey : keyboardEvent.ctrlKey;

      if (ctrlKey && keyboardEvent.key.toLowerCase() === "a") {
        keyboardEvent.preventDefault();
        setIsAccessibilityMenuOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleAccesibilityMenuToggleOnKeyDown);
    return () => window.removeEventListener("keydown", handleAccesibilityMenuToggleOnKeyDown);
  }, []);

  useEffect(() => {
    const colorBlindnessColor: string | null =
      colorBlindnessCommandValue !== colorBlindnessTypes.NONE
        ? colorBlindnessColors[colorBlindnessCommandValue]
        : null;

    if (colorBlindnessColor) {
      document.body.style.setProperty("--heading-color", colorBlindnessColor);

      document.querySelectorAll(".text-primary").forEach((element) => {
        element.classList.add("text-colorblind");
      });

      document.querySelectorAll(".prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6").forEach((element) => {
        element.classList.add("text-colorblind");
      });
    } else {
      document.body.style.removeProperty("--heading-color");

      document.querySelectorAll(".text-primary, .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6").forEach((element) => {
        element.classList.remove("text-colorblind");
      });
    }
  }, [activeAccessibilityOptions, colorBlindnessColors, colorBlindnessCommandValue]);

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
            aria-label={t('openAccessibilityMenu')}
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
                aria-label={t('closeAccessibilityMenu')}
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
                  placeholder={`${t('searchLanguage')}...`}
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
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <Accordion type="single" collapsible className="px-4">
            <AccordionItem value="profiles" className="border-none">
              <AccordionTrigger className="text-blue-500 dark:text-white !no-underline hover:!no-underline px-2 border rounded-md transition-all border-blue-500 dark:border-blue-500">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-500 p-1.5 dark:bg-blue-400">
                    <PersonStanding className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-md">{t('accessibilityProfiles')}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="border border-gray-300 dark:border-gray-700 rounded-md p-3 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  {accessibilityProfiles.map((accessibilityProfile) => (
                    <Card
                      key={accessibilityProfile.name}
                      onClick={() => handleAccessibilityProfileClick(accessibilityProfile.definition)}
                      className={`cursor-pointer
                        ${accessibilityProfile.definition === activeAccessibilityProfile
                          ? 'bg-blue-500 dark:bg-blue-500 text-white'
                          : 'bg-blue-50 dark:bg-transparent'}
                        hover:border-blue-500 hover:dark:bg-blue-500 transition-colors shadow-sm border border-gray-100 dark:border-gray-700 rounded-md`
                      }
                    >
                      <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
                        <accessibilityProfile.icon className="w-6 h-6" />
                        <span aria-label={accessibilityProfile.name} className="text-xs font-medium text-center">{accessibilityProfile.name}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="px-4 mt-4">
            <div className="border border-gray-300 dark:border-gray-700 rounded-md p-3">
              <div className="grid grid-cols-2 gap-3">
                {accessibilityOptions.map((accessibilityOption) => {
                  const isColorBlindnessOption: boolean = accessibilityOption.definition === accessibilityOptionsDefinitions.COLOR_BLINDNESS;

                  return (
                    <Card
                      key={accessibilityOption.name}
                      onClick={isColorBlindnessOption
                        ? undefined
                        : () => handleAccessibilityOptionClick(accessibilityOption.definition)
                      }
                      className={`
                        cursor-pointer ${!isColorBlindnessOption ? 'hover:border-blue-500 hover:dark:bg-blue-500': ''}
                        ${activeAccessibilityOptions?.has(accessibilityOption.definition)
                          ? 'bg-blue-500 dark:bg-blue-500 text-white'
                          : 'bg-blue-50 dark:bg-transparent'}
                          transition-colors shadow-sm border border-gray-100 dark:border-gray-700 rounded-md
                      `}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
                        {accessibilityOption.icon && <accessibilityOption.icon className="w-6 h-6" />}
                        <span aria-label={accessibilityOption.name} className="text-xs font-medium text-center">{accessibilityOption.name}</span>
                        {accessibilityOption.actionElement}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default AccessibilityMenuWidget;