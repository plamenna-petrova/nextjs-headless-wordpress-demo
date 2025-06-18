"use client";

import { useEffect, useRef } from "react";
import { accessibilityProfilesDefinitions, useAccessibilityStore } from "@/stores/accessibilityStore"
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

const tagNamesForSpeechSynthesis = [
  "P",            // Paragraphs
  "SPAN",         // Inline container for text
  "DIV",          // Generic container for block-level content
  "LABEL",        // Labels for form inputs
  "H1",           // Main heading
  "H2",           // Secondary heading
  "H3",           // Tertiary heading
  "H4",           // Quaternary heading
  "H5",           // Quinary heading
  "H6",           // Senary heading
  "LI",           // List items
  "A",            // Links
  "TH",           // Table headers
  "TD",           // Table cells
  "CODE",         // Inline code snippets
  "DD",           // Description list definitions
  "STRONG",       // Strongly emphasized text
  "EM",           // Emphasized text
  "BUTTON",       // Controls
  "SUMMARY",      // Accordion headers
  "CAPTION",      // Table captions
  "FIGCAPTION",   // Descriptions for figures/images
  "INPUT",        // Text-based input elements
  "TEXTAREA",     // Larger input areas
  "LEGEND",       // Describes a group of inputs
  "FIELDSET",     // Group of related inputs
  "OUTPUT",       // For computed results
  "BLOCKQUOTE",   // Quoted text
  "ARTICLE",      // Self-contained content
  "SECTION",      // Logical document sections
  "NAV",          // Navigation areas
  "ASIDE",        // Side content
  "TIME",         // Dates and times
  "MARK",         // Highlighted text
  "CITE",         // Citations or sources
  "ABBR",         // Abbreviations
  "Q"             // Inline quotes
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
      const originalTarget = event.target as HTMLElement;
      const speechTarget: HTMLElement | null = findSpeechRoot(originalTarget);

      if (!speechTarget) {
        return;
      }

      console.log("Original Target", originalTarget);
      console.log("Speech Target", speechTarget);	

      const textToConvertToSpeech: string | undefined = getTextToConvertToSpeech(speechTarget)?.trim();

      if (textToConvertToSpeech && textToConvertToSpeech.length > 1) {
        console.log("Text To Convert To Speech", textToConvertToSpeech);
        speakText(textToConvertToSpeech);
      }
    };

    const findSpeechRoot = (element: HTMLElement): HTMLElement | null => {
      let currentElement: HTMLElement | null = element;

      while (currentElement && currentElement !== document.body) {
        if (shouldReadTagContent(currentElement)) {
          return currentElement;
        }

        currentElement = currentElement.parentElement;
      }

      return null;
    };

    const getTextToConvertToSpeech = (element: HTMLElement): string | null => {
      const datasetTTS: string | undefined = element.dataset.tts;
      const ariaLabel: string | null = element.getAttribute("aria-label");
      const title: string | null = element.getAttribute("title");
    
      if (datasetTTS) {
        return datasetTTS;
      }

      if (ariaLabel) {
        return ariaLabel;
      }

      if (title) {
        return title;
      }
    
      const elementTagNameAsUppercase: string = element.tagName.toUpperCase();
      const innerText: string = element.innerText.trim();
    
      const isLinkWithText: boolean = elementTagNameAsUppercase === "A" && innerText.length > 0;
    
      const isSimpleElement = element.children.length === 0;
    
      return (isLinkWithText || isSimpleElement) ? innerText : null;
    };

    const shouldReadTagContent = (element: HTMLElement): boolean => {
      if (!isHTMLElementVisible(element)) {
        return false;
      }

      const elementTagNameAsUppercase: string = element.tagName.toUpperCase();

      if (["SVG", "PATH", "USE", "CIRCLE"].includes(elementTagNameAsUppercase)) {
        return false;
      }

      const isSpeechSynthesisTag: boolean = tagNamesForSpeechSynthesis.includes(
        elementTagNameAsUppercase as SpeechSynthesisTagName
      );

      const qualifiesForSpeechSynthesis: boolean = (
        isSpeechSynthesisTag || 
        element.hasAttribute("aria-label") || 
        element.hasAttribute("title") ||
        element.getAttribute("role") === "button" || 
        element.dataset.tts === "true" ||
        (elementTagNameAsUppercase === "A" && element.innerText.trim().length > 0)
      );

      if (!qualifiesForSpeechSynthesis) {
        return false;
      }

      return true;
    };

    const isHTMLElementVisible = (element: HTMLElement): boolean => { 
      const boundingClientRect: DOMRect = element.getBoundingClientRect();

      return (
        boundingClientRect.width > 0 &&
        boundingClientRect.height > 0 &&
        window.getComputedStyle(element).visibility !== "hidden"
      );
    }

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