"use client";

import { useEffect } from "react";
import { accessibilityProfilesDefinitions, useAccessibilityStore } from "@/stores/accessibilityStore"
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

const tagNamesForSpeechSynthesis = [
  "P", "SPAN", "DIV", "LABEL", "H1", "H2", "H3", "H4",
  "H5", "H6", "LI", "A", "TH", "TD", "CODE", "DD", "STRONG", "EM"
] as const;

type SpeechSynthesisTagName = (typeof tagNamesForSpeechSynthesis)[number];

export const TextToSpeechConversionOnHover = () => {
  const { activeAccessibilityProfile, isHoverSpeechEnabled } = useAccessibilityStore();
  const { speakText, stopSpeaking } = useSpeechSynthesis();

  useEffect(() => {
    if (!isHoverSpeechEnabled) {
      return;
    }

    if (activeAccessibilityProfile !== accessibilityProfilesDefinitions.BLIND) {
      return;
    }

    const handleTextToSpeechConversionMouseOver = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;

      const textToConvertToSpeech: string | null = target?.innerText || target?.getAttribute("aria-label");

      if (
        textToConvertToSpeech &&
        textToConvertToSpeech.trim().length > 1 &&
        tagNamesForSpeechSynthesis.includes(target.tagName as SpeechSynthesisTagName)
      ) {
        speakText(textToConvertToSpeech.trim());
      }
    };

    const handleTextToSpeechConversionMouseOut = (_: MouseEvent): void => {
      stopSpeaking();
    };

    document.addEventListener("mouseover", handleTextToSpeechConversionMouseOver);
    document.addEventListener("mouseout", handleTextToSpeechConversionMouseOut);

    return () => {
      document.removeEventListener("mouseover", handleTextToSpeechConversionMouseOver);
      document.removeEventListener("mouseout", handleTextToSpeechConversionMouseOut);
    };
  }, [activeAccessibilityProfile, isHoverSpeechEnabled, speakText, stopSpeaking]);

  return null;
};