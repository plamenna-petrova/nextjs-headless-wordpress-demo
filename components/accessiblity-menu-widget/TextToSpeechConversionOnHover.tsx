"use client";

import { useEffect } from "react";
import { accessibilityProfilesDefinitions, useAccessibilityStore } from "@/stores/accessibilityStore"
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

export const TextToSpeechConversionOnHover = () => {
  const { activeAccessibilityProfile } = useAccessibilityStore();
  const { speak, stopSpeaking } = useSpeechSynthesis();

  useEffect(() => {
    if (activeAccessibilityProfile !== accessibilityProfilesDefinitions.BLIND) {
      return;
    }

    const handleTextToSpeechConversionMouseOver = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      console.log("target element");
      console.log(target.childNodes);

      const textToConvertToSpeech: string | null =
        target?.innerText || target?.textContent || target?.getAttribute("aria-label");

      if (
        textToConvertToSpeech &&
        textToConvertToSpeech.trim().length > 1 &&
        ["P", "SPAN", "DIV", "LABEL", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "A", "TH","TD"].includes(target.tagName)
      ) {
        speak(textToConvertToSpeech.trim());
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
  }, [activeAccessibilityProfile, speak, stopSpeaking]);

  return null;
};