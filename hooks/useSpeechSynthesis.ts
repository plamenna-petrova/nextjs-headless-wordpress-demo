import { useEffect, useRef, useState } from "react"

export const useSpeechSynthesis = () => {
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>();
  const [speechSynthesisVoices, setSpeechSynthesisVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedSpeechSynthesisVoiceIndex, setSelectedSpeechSynthesisVoiceIndex] = useState<number>(1);
  const [selectedSpeechSynthesisVoiceRate, setSelectedSpeechSynthesisVoiceRate] = useState<number>(1.25);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    const loadVoices = (): void => {
      const availableSpeechSynthesisVoices: SpeechSynthesisVoice[] = window.speechSynthesis.getVoices();
      setSpeechSynthesisVoices(availableSpeechSynthesisVoices);
    };

    if (typeof window !== "undefined") {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      const storedVoiceIndex: string | null = localStorage.getItem("selectedVoice");
      const storedVoiceRate: string | null = localStorage.getItem("selectedRate");

      if (storedVoiceIndex) {
        setSelectedSpeechSynthesisVoiceIndex(parseInt(storedVoiceIndex));
      }

      if (storedVoiceRate) {
        setSelectedSpeechSynthesisVoiceRate(parseFloat(storedVoiceRate));
      }
    }
  }, []);

  const speak = (text: string): void => {
    if (!text || !speechSynthesisVoices.length) {
      return;
    }

    setIsSpeaking(true);

    const speechSynthesisUtterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    speechSynthesisUtterance.voice = speechSynthesisVoices[selectedSpeechSynthesisVoiceIndex];
    console.log(speechSynthesisUtterance.voice);
    speechSynthesisUtterance.rate = selectedSpeechSynthesisVoiceRate;
    window.speechSynthesis.speak(speechSynthesisUtterance);

    speechSynthesisRef.current = speechSynthesisUtterance;

    speechSynthesisUtterance.onend = () => setIsSpeaking(false);
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
    speak,
    stopSpeaking,
    speechSynthesisVoices,
    selectedSpeechSynthesisVoiceIndex,
    selectedSpeechSynthesisVoiceRate,
    isSpeaking,
    saveSpeechSynthesisSettings
  }
}