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

const tagNamesForAriaLabelOnly = ["DIV", "SECTION", "ARTICLE"] as const;

type SpeechSynthesisTagName = (typeof tagNamesForSpeechSynthesis)[number];

type TagForAriaLabelOnly = (typeof tagNamesForAriaLabelOnly)[number];

export const TextToSpeechConversionOnHover = () => {
  const lastSpokenTextRef = useRef<string | null>(null);
  const { activeAccessibilityProfile, isHoverSpeechEnabled } = useAccessibilityStore();
  const { speakText, stopSpeaking } = useSpeechSynthesis();

  useEffect(() => {
    if (!isHoverSpeechEnabled) {
      return;
    }

    if (activeAccessibilityProfile !== accessibilityProfilesDefinitions.BLIND) {
      return;
    }

    let lastSpokenElement: HTMLElement | null = null;

    const handleTextToSpeechConversionMouseOver = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;

      if (lastSpokenElement && (lastSpokenElement === target || lastSpokenElement.contains(target))) {
        return;
      }

      if (!shouldReadTagContent(target)) {
        return;
      }

      const textToConvertToSpeech: string | null = getTextToConvertToSpeech(target);

      if (
        textToConvertToSpeech && 
        textToConvertToSpeech.trim().length > 1 &&
        textToConvertToSpeech !== lastSpokenTextRef.current
      ) {
        lastSpokenElement = target;
        lastSpokenTextRef.current = textToConvertToSpeech;
        console.log("Last Spoken Text",  lastSpokenTextRef.current);
        console.log("Text To Convert To Speech", textToConvertToSpeech);
        speakText(textToConvertToSpeech.trim());
      }
    };

    const getTextToConvertToSpeech = (element: HTMLElement): string | null => { 
      const elementTagNameAsUppercase = element.tagName.toUpperCase() as TagForAriaLabelOnly; 
      const ariaLabel: string | null = element.getAttribute("aria-label");

      if (tagNamesForAriaLabelOnly.includes(elementTagNameAsUppercase)) {
        return ariaLabel;
      }

      return ariaLabel || element.innerText;
    }

    const shouldReadTagContent = (element: HTMLElement): boolean => { 
      console.log("should read tag content", element);

      if (!isHTMLElementVisible(element)) {
        return false;
      }

      const elementTagNameAsUppercase = element.tagName.toUpperCase() as TagForAriaLabelOnly;

      if (tagNamesForAriaLabelOnly.includes(elementTagNameAsUppercase)) { 
        return element.hasAttribute("aria-label");
      }

      return (
        tagNamesForSpeechSynthesis.includes(element.tagName as SpeechSynthesisTagName) ||
        element.hasAttribute("aria-label") || 
        element.hasAttribute("title") || 
        element.getAttribute("role") === "button" ||
        element.dataset.tts === "true"
      );
    }

    const isHTMLElementVisible = (element: HTMLElement): boolean => { 
      const boundingClientRect: DOMRect = element.getBoundingClientRect();

      return (
        boundingClientRect.width > 0 &&
        boundingClientRect.height > 0 &&
        window.getComputedStyle(element).visibility !== "hidden"
      );
    }

    const handleTextToSpeechConversionMouseOut = (_: MouseEvent): void => {
      lastSpokenElement = null;
      lastSpokenTextRef.current = null;
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