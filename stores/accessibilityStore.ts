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

export type AccessibilityProfileDefinition = (typeof accessibilityProfilesDefinitions)[keyof typeof accessibilityProfilesDefinitions];

interface AccessibilityStore {
  activeAccessibilityProfile: AccessibilityProfileDefinition | null;
  isHoverSpeechEnabled: boolean;
  setActiveAccessibilityProfile: (accessibilityProfile: AccessibilityProfileDefinition | null) => void;
  setIsHoverSpeechEnabled: (enabled: boolean) => void;
}

export const useAccessibilityStore = create<AccessibilityStore>((set) => ({
  activeAccessibilityProfile: null,
  isHoverSpeechEnabled: false,
  setActiveAccessibilityProfile: (acessibilityProfile) => set({ activeAccessibilityProfile: acessibilityProfile }),
  setIsHoverSpeechEnabled: (enabled) => set({ isHoverSpeechEnabled: enabled })
}));