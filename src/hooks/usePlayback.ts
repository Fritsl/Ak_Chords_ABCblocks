
import { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { KeySignature } from '../types';

export function usePlayback(chords: string[], onBlockFinished?: () => void) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isContinuousPlay, setIsContinuousPlay] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const intervalRef = useRef<number | null>(null);

  const stopPlayback = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentStep(-1);
  };

  const startPlayback = async () => {
    await Tone.start();
    setIsPlaying(true);
    setCurrentStep(0);
  };

  return {
    isPlaying,
    isContinuousPlay,
    currentStep,
    setIsContinuousPlay,
    startPlayback,
    stopPlayback
  };
}
