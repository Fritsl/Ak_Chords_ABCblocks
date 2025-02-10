// Synth-related constants and types
import * as Tone from 'tone';

export const SYNTH_PRESETS = {
  strings: {
    name: 'Strings',
    settings: {
      oscillator: {
        type: 'fatsawtooth',
        count: 3,
        spread: 30
      },
      envelope: {
        attack: 0.2,
        decay: 0.3,
        sustain: 0.5,
        release: 1.5
      },
      portamento: 0.05
    }
  },
  piano: {
    name: 'Piano',
    settings: {
      oscillator: {
        type: 'triangle'
      },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }
  },
  pad: {
    name: 'Pad',
    settings: {
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.5,
        decay: 0.5,
        sustain: 1,
        release: 3
      }
    }
  },
  pluck: {
    name: 'Pluck',
    settings: {
      oscillator: {
        type: 'triangle'
      },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.1,
        release: 0.1
      }
    }
  }
} as const;

export const KEY_TO_NOTE: Record<string, string> = {
  'C': 'C4',
  'G': 'G3',
  'D': 'D4',
  'A': 'A3',
  'E': 'E4',
  'B': 'B3',
  'F♯': 'F#4',
  'C♯': 'C#4',
  'F': 'F3',
  'B♭': 'Bb3',
  'E♭': 'Eb4',
  'A♭': 'Ab3',
  'D♭': 'Db4',
  'G♭': 'Gb3',
  'C♭': 'Cb4'
};