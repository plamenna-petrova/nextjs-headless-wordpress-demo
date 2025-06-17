import { Locale } from "@/lib/i18n";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react"

export const useSpeechSynthesis = () => {
  const [speechSynthesisVoices, setSpeechSynthesisVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [areSpeechSynthesisVoicesLoaded, setAreSpeechSynthesisVoicesLoaded] = useState<boolean>(false);
  const [selectedSpeechSynthesisVoiceIndex, setSelectedSpeechSynthesisVoiceIndex] = useState<number>(1);
  const [selectedSpeechSynthesisVoiceRate, setSelectedSpeechSynthesisVoiceRate] = useState<number>(1.25);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>();
  const locale = useLocale() as Locale;

  useEffect(() => {
    let loadSpeechSynthesisVoiceRetriesCount: number = 0;
    const MAX_LOAD_SPEECH_SYNTHESIS_VOICES_RETRIES: number = 10;

    const loadSpeechSynthesisVoicesWithRetry = (): void => {
      const availableSpeechSynthesisVoices: SpeechSynthesisVoice[] = window.speechSynthesis.getVoices();

      if (availableSpeechSynthesisVoices.length > 0) {
        setSpeechSynthesisVoices(availableSpeechSynthesisVoices);
        setAreSpeechSynthesisVoicesLoaded(true);

        const storedVoiceIndex: string | null = localStorage.getItem("selectedVoice");
        const storedVoiceRate: string | null = localStorage.getItem("selectedRate");

        if (storedVoiceRate) {
          setSelectedSpeechSynthesisVoiceRate(parseFloat(storedVoiceRate));
        }

        if (storedVoiceIndex !== null) {
          setSelectedSpeechSynthesisVoiceIndex(parseInt(storedVoiceIndex));
        } else {
          const bestVoiceMatchIndexByCurrentLocale: number = matchLocaleToVoice(availableSpeechSynthesisVoices);
          setSelectedSpeechSynthesisVoiceIndex(bestVoiceMatchIndexByCurrentLocale);
        }
      } else if (loadSpeechSynthesisVoiceRetriesCount < MAX_LOAD_SPEECH_SYNTHESIS_VOICES_RETRIES) {
        loadSpeechSynthesisVoiceRetriesCount++;
        setTimeout(loadSpeechSynthesisVoicesWithRetry, 200);
      } else {
        setAreSpeechSynthesisVoicesLoaded(false);
      }
    };

    const matchLocaleToVoice = (voices: SpeechSynthesisVoice[]): number => {
      const fullVoiceMatchForLanguage: number = voices.findIndex(
        (voice) => voice.lang.toLowerCase() === locale.toLowerCase()
      );

      if (fullVoiceMatchForLanguage !== -1) {
        return fullVoiceMatchForLanguage;
      }

      const shortLocaleName: string = locale.split("-")[0];

      const partialVoiceMatchForLanguage: number = voices.findIndex(
        (voice) => voice.lang.toLowerCase().startsWith(shortLocaleName)
      );

      if (partialVoiceMatchForLanguage !== -1) {
        return partialVoiceMatchForLanguage;
      }

      return 0;
    };

    if (typeof window !== "undefined") {
      loadSpeechSynthesisVoicesWithRetry();
      window.speechSynthesis.onvoiceschanged = loadSpeechSynthesisVoicesWithRetry;
    }
  }, [locale]);

  const speakText = (text: string, onSpeakingEnd?: () => void): void => {
    if (!text || !speechSynthesisVoices.length || !areSpeechSynthesisVoicesLoaded) {
      return;
    }

    setIsSpeaking(true);

    const speechSynthesisUtterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    speechSynthesisUtterance.voice = speechSynthesisVoices[selectedSpeechSynthesisVoiceIndex];
    speechSynthesisUtterance.rate = selectedSpeechSynthesisVoiceRate;

    if (onSpeakingEnd) {
      speechSynthesisUtterance.onend = () => {
        onSpeakingEnd();
        setIsSpeaking(false);
      }
    } else {
      speechSynthesisUtterance.onend = () => setIsSpeaking(false);
    }

    window.speechSynthesis.speak(speechSynthesisUtterance);
    speechSynthesisRef.current = speechSynthesisUtterance;
  };

  const stopSpeaking = (): void => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const saveSpeechSynthesisSettings = (voiceIndex: number, voiceRate: number): void => {
    localStorage.setItem("selectedVoice", voiceIndex.toString());
    localStorage.setItem("selectedRate", voiceRate.toString());
    setSelectedSpeechSynthesisVoiceIndex(voiceIndex);
    setSelectedSpeechSynthesisVoiceRate(voiceRate);
  };

  return {
    speakText,
    stopSpeaking,
    speechSynthesisVoices,
    selectedSpeechSynthesisVoiceIndex,
    selectedSpeechSynthesisVoiceRate,
    isSpeaking,
    saveSpeechSynthesisSettings
  }
}