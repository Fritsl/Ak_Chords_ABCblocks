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
  const isInitializedRef = useRef(false);
  const playbackTimeoutRef = useRef<number | null>(null);
  const [controls, setControls] = useState<SynthControls>(DEFAULT_CONTROLS);

  const stopCurrentPlayback = useCallback(() => {
    if (playbackTimeoutRef.current) {
      window.clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.releaseAll();
    }
  }, []);

  const updateSynthSettings = useCallback(() => {
    if (!synthRef.current || !reverbRef.current || !volumeRef.current) return;

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
  }, [controls]);

  const initializeSynth = useCallback(async () => {
    stopCurrentPlayback();

    if (!isInitializedRef.current) {
      if (synthRef.current) synthRef.current.dispose();
      if (reverbRef.current) reverbRef.current.dispose();
      if (volumeRef.current) volumeRef.current.dispose();

      volumeRef.current = new Tone.Volume(controls.volume).toDestination();
      
      reverbRef.current = new Tone.Reverb({
        decay: 2,
        wet: controls.reverb
      }).connect(volumeRef.current);

      const preset = SYNTH_PRESETS[controls.preset].settings;
      synthRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: preset.oscillator,
        envelope: {
          ...preset.envelope,
          attack: controls.attack,
          release: controls.release
        }
      }).connect(reverbRef.current);

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

      synthRef.current.triggerAttackRelease(notes, '2n');
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
      const duration = 1;

      chords.forEach((chord, index) => {
        const notes = getRomanNumeralNotes(chord, keySignature);
        if (notes.length > 0) {
          synthRef.current!.triggerAttackRelease(notes, '2n', now + index * duration);
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
  }, [initializeSynth, getRomanNumeralNotes, stopCurrentPlayback]);

  return {
    playChord,
    playProgression,
    controls,
    setControls,
    presets: SYNTH_PRESETS,
    stopPlayback: stopCurrentPlayback
  };
}