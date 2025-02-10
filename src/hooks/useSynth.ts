import { useEffect, useRef, useCallback, useState } from 'react';
import * as Tone from 'tone';
import { KeySignature } from '../types';
import { SYNTH_PRESETS, KEY_TO_NOTE } from '../constants/synth';
import { CHORD_QUALITIES, SCALE_DEGREES } from '../constants/chords';

export type SynthControls = {
  preset: keyof typeof SYNTH_PRESETS;
  volume: number;
  reverb: number;
  attack: number;
  release: number;
};

const DEFAULT_CONTROLS: SynthControls = {
  preset: 'strings',
  volume: -12,
  reverb: 0.3,
  attack: 0.2,
  release: 1.5
};

export function useSynth() {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const volumeRef = useRef<Tone.Volume | null>(null);
  const analyserRef = useRef<Tone.Analyser | null>(null);
  const animationFrameRef = useRef<number>();
  const isInitializedRef = useRef(false);
  const playbackTimeoutRef = useRef<number | null>(null);
  const [controls, setControls] = useState<SynthControls>(DEFAULT_CONTROLS);
  const [tempoMultiplier, setTempoMultiplier] = useState(1); // Added tempo control

  const stopCurrentPlayback = useCallback(() => {
    if (playbackTimeoutRef.current) {
      window.clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.releaseAll();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }, []);

  const updateSynthSettings = useCallback(() => {
    if (!synthRef.current || !reverbRef.current || !volumeRef.current || !analyserRef.current) return;

    volumeRef.current.volume.value = controls.volume;
    reverbRef.current.wet.value = controls.reverb;

    const preset = SYNTH_PRESETS[controls.preset].settings;
    synthRef.current.set({
      oscillator: preset.oscillator,
      envelope: {
        ...preset.envelope,
        attack: controls.attack,
        release: controls.release
      }
    });

    // Force synth voice update
    synthRef.current.releaseAll();
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: preset.oscillator,
      envelope: {
        ...preset.envelope,
        attack: controls.attack,
        release: controls.release
      }
    }).connect(analyserRef.current).connect(reverbRef.current);
  }, [controls]);

  const initializeSynth = useCallback(async () => {
    stopCurrentPlayback();

    if (!isInitializedRef.current) {
      if (synthRef.current) synthRef.current.dispose();
      if (reverbRef.current) reverbRef.current.dispose();
      if (volumeRef.current) volumeRef.current.dispose();
      if (analyserRef.current) analyserRef.current.dispose();

      volumeRef.current = new Tone.Volume(controls.volume).toDestination();

      reverbRef.current = new Tone.Reverb({
        decay: 2,
        wet: controls.reverb
      }).connect(volumeRef.current);

      analyserRef.current = new Tone.Analyser('waveform', 256).toDestination();

      const preset = SYNTH_PRESETS[controls.preset].settings;
      synthRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: preset.oscillator,
        envelope: {
          ...preset.envelope,
          attack: controls.attack,
          release: controls.release
        }
      }).connect(analyserRef.current).connect(reverbRef.current);

      isInitializedRef.current = true;

      await Tone.start();
      if (Tone.context.state !== 'running') {
        await Tone.context.resume();
      }
    }
  }, [controls, stopCurrentPlayback]);

  useEffect(() => {
    updateSynthSettings();
  }, [controls, updateSynthSettings]);

  useEffect(() => {
    return () => {
      stopCurrentPlayback();
      if (synthRef.current) {
        synthRef.current.dispose();
        synthRef.current = null;
      }
      if (reverbRef.current) {
        reverbRef.current.dispose();
        reverbRef.current = null;
      }
      if (volumeRef.current) {
        volumeRef.current.dispose();
        volumeRef.current = null;
      }
      if (analyserRef.current) {
        analyserRef.current.dispose();
        analyserRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, [stopCurrentPlayback]);

  const getRomanNumeralNotes = useCallback((romanNumeral: string, keySignature: KeySignature): string[] => {
    const baseNote = KEY_TO_NOTE[keySignature.key];
    if (!baseNote) return [];

    const baseDegree = SCALE_DEGREES[romanNumeral.replace(/[^IiVv]/g, '')] || 0;
    const quality = romanNumeral.toLowerCase() === romanNumeral ? 'm' : '';
    const intervals = CHORD_QUALITIES[quality];

    return intervals.map(interval => {
      const note = Tone.Frequency(baseNote)
        .transpose(baseDegree)
        .transpose(interval);
      return note.toNote();
    });
  }, []);

  const playChord = useCallback(async (romanNumeral: string, keySignature: KeySignature) => {
    try {
      stopCurrentPlayback();
      await initializeSynth();
      if (!synthRef.current) return;

      const notes = getRomanNumeralNotes(romanNumeral, keySignature);
      if (notes.length === 0) return;

      synthRef.current.triggerAttackRelease(notes, '4n', undefined, 1.0); // Legato playback
    } catch (error) {
      console.error('Error playing chord:', error);
      isInitializedRef.current = false;
      await initializeSynth();
    }
  }, [initializeSynth, getRomanNumeralNotes, stopCurrentPlayback]);

  const playProgression = useCallback(async (chords: string[], keySignature: KeySignature) => {
    try {
      stopCurrentPlayback();
      await initializeSynth();
      if (!synthRef.current) return;

      const now = Tone.now();
      const duration = 1 / tempoMultiplier; // Adjust duration based on tempo

      chords.forEach((chord, index) => {
        const notes = getRomanNumeralNotes(chord, keySignature);
        if (notes.length > 0) {
          synthRef.current!.triggerAttackRelease(notes, '4n', now + index * duration, 1.0); // Legato playback
        }
      });

      playbackTimeoutRef.current = window.setTimeout(() => {
        playbackTimeoutRef.current = null;
      }, chords.length * duration * 1000);

    } catch (error) {
      console.error('Error playing progression:', error);
      isInitializedRef.current = false;
      await initializeSynth();
    }
  }, [initializeSynth, getRomanNumeralNotes, stopCurrentPlayback, tempoMultiplier]);

  const handleTempoChange = (multiplier: number) => {
    setTempoMultiplier(multiplier);
  };

  return {
    playChord,
    playProgression,
    controls,
    setControls,
    presets: SYNTH_PRESETS,
    stopPlayback: stopCurrentPlayback,
    handleTempoChange, // Added tempo control function
    tempoMultiplier, // Added tempoMultiplier state
    analyserRef
  };
}