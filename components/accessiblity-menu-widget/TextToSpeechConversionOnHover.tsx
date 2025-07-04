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

  const lastSpokenElement = useRef<HTMLElement | null>(null);
  const lastSpokenText = useRef<string | null>(null);
  const lastUtteranceId = useRef<string | null>(null);

  useEffect(() => {
    if (!isHoverSpeechEnabled || activeAccessibilityProfile !== accessibilityProfilesDefinitions.BLIND) {
      return;
    }

    const handleTextToSpeechConversionMouseOver = (event: MouseEvent): void => {      
      const originalTarget = event.target as HTMLElement;
      const speechTarget: HTMLElement | null = findSpeechRoot(originalTarget);

      if (!speechTarget) {
        return;
      }

      const textToConvertToSpeech: string | undefined = getTextToConvertToSpeech(speechTarget)?.trim();

      if (!textToConvertToSpeech || textToConvertToSpeech.length < 2) {
        return;
      }

      if (speechTarget === lastSpokenElement.current || 
        (lastSpokenText && textToConvertToSpeech === lastSpokenText.current)) {
        return;
      }

      const newUtteranceId = `${speechTarget.tagName}-${textToConvertToSpeech}`;

      if (newUtteranceId === lastUtteranceId.current) { 
        return;
      }

      speakText(textToConvertToSpeech);

      lastSpokenElement.current = speechTarget;
      lastSpokenText.current = textToConvertToSpeech;
      lastUtteranceId.current = newUtteranceId;
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
      if (element.closest("[data-tts='false']")) {
        return null;
      }

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

      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        const placeholder: string = element.placeholder?.trim();
        const value: string = element.value?.trim();

        if (value) {
          return value;
        }

        if (placeholder) {
          return placeholder;
        }

        return null;
      }

      const innerText: string = element.innerText.trim();

      if (!innerText || innerText.length < 2) {
        return null;
      }

      const allowedInlineTags: Set<string> = new Set(["CODE", "STRONG", "EM", "ABBR", "MARK", "CITE", "Q", "SPAN", "I", "B", "U", "SMALL", "SUP", "SUB"]);

      const hasOnlyInlineChildren: boolean = Array.from(element.children).every(child =>
        allowedInlineTags.has(child.tagName.toUpperCase())
      );

      const isLinkWithText: boolean = elementTagNameAsUppercase === "A" && innerText.length > 0;
      const isSimpleElement: boolean = element.children.length === 0 || hasOnlyInlineChildren;

      return (isLinkWithText || isSimpleElement) ? innerText : null;
    };

    const shouldReadTagContent = (element: HTMLElement): boolean => {
      if (!isHTMLElementVisible(element)) {
        return false;
      }

      if (element.closest("[data-tts='false']")) {
        return false;
      }

      const elementTagNameAsUppercase: string = element.tagName.toUpperCase();

      if (["SVG", "PATH", "USE", "CIRCLE"].includes(elementTagNameAsUppercase)) {
        return false;
      }

      const tagNamesForSpeechSysnthesisSet = new Set(tagNamesForSpeechSynthesis);
      
      const isSpeechSynthesisTag: boolean = tagNamesForSpeechSysnthesisSet.has(
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
      lastSpokenElement.current = null;
      lastSpokenText.current = null;
      lastUtteranceId.current = null;
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