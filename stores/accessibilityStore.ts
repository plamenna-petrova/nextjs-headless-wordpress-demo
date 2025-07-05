import { create } from "zustand";

export const accessibilityProfilesDefinitions = {
  BLIND: "Blind",
  ELDERLY: "Elderly",
  MOTOR_IMPAIRED: "Motor Impaired",
  VISUALLY_IMPAIRED: "Visually Impaired",
  COLOR_BLIND: "Color Blind",
  DYSLEXIA: "Dyslexia",
  COGNITIVE_AND_LEARNING: "Cognitive & Learning",
  SEIZURE_AND_EPILEPTIC: "Seizure & Epileptic",
  ADHD: "ADHD",
} as const;

export const accessibilityOptionsDefinitions = {
  COLOR_BLINDNESS: "Color Blindness",
  SCREEN_READER: "Screen Reader",
  DICTIONARY: "Dictionary",
  READING_MASK: "Reading Mask",
  INVERT_COLORS: "Invert Colors",
  LIGHT_CONTRAST: "Light Contrast",
  DARK_CONTRAST: "Dark Contrast",
  HIGH_CONTRAST: "High Contrast",
  SMART_CONTRAST: "Smart Contrast",
} as const;

export const colorBlindnessTypes = {
  NONE: "None",
  PROTANOMALY: "Protanomaly",
  DEUTERANOMALY: "Deuteranomaly",
  TRITANOMALY: "Tritanomaly",
  PROTANOPIA: "Protanopia",
  DEUTERANOPIA: "Deuteranopia",
  TRITANOPIA: "Tritanopia",
  ACHROMATOMALY: "Achromatomaly",
  ACHROMATOPSIA: "Achromatopsia",
} as const;

export type AccessibilityProfileDefinition = (typeof accessibilityProfilesDefinitions)[keyof typeof accessibilityProfilesDefinitions];

export type AccessibilityOptionDefinition = (typeof accessibilityOptionsDefinitions)[keyof typeof accessibilityOptionsDefinitions];

export type ColorBlindnessType = (typeof colorBlindnessTypes)[keyof typeof colorBlindnessTypes];

export type ColorBlindnessCommandValueType = keyof typeof colorBlindnessTypes;

interface AccessibilityStore {
  activeAccessibilityProfile: AccessibilityProfileDefinition | null;
  isHoverSpeechEnabled: boolean;
  activeAccessibilityOptions: Set<AccessibilityOptionDefinition> | null;  
  setActiveAccessibilityProfile: (accessibilityProfile: AccessibilityProfileDefinition | null) => void;
  setIsHoverSpeechEnabled: (enabled: boolean) => void;
  setActiveAccessibilityOptions: (accessibilityOptions: Set<AccessibilityOptionDefinition> | null) => void;
}

export const useAccessibilityStore = create<AccessibilityStore>((set) => ({
  activeAccessibilityProfile: null,
  isHoverSpeechEnabled: false,
  activeAccessibilityOptions: null,
  setActiveAccessibilityProfile: (acessibilityProfile) => set({ activeAccessibilityProfile: acessibilityProfile }),
  setIsHoverSpeechEnabled: (enabled) => set({ isHoverSpeechEnabled: enabled }),
  setActiveAccessibilityOptions: (accessibilityOptions) => set({ activeAccessibilityOptions: accessibilityOptions })
}));