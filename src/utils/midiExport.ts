import * as Tone from 'tone';
import { KeySignature } from '../types';
import { KEY_TO_NOTE } from '../constants/synth';
import { CHORD_QUALITIES, SCALE_DEGREES } from '../constants/chords';

declare global {
  interface Window {
    electronAPI?: {
      saveMIDI: (midiData: Uint8Array, fileName: string) => Promise<{ success: boolean; filePath?: string; error?: string }>;
      copyMIDIToClipboard: (midiData: Uint8Array, fileName: string) => Promise<{ success: boolean; filePath?: string; error?: string }>;
    };
  }
}

function getRomanNumeralNotes(romanNumeral: string, keySignature: KeySignature): number[] {
  const baseNote = KEY_TO_NOTE[keySignature.key];
  if (!baseNote) return [];

  const baseDegree = SCALE_DEGREES[romanNumeral.replace(/[^IiVv]/g, '')] || 0;
  const quality = romanNumeral.toLowerCase() === romanNumeral ? 'm' : '';
  const intervals = CHORD_QUALITIES[quality];

  return intervals.map(interval => {
    const note = Tone.Frequency(baseNote)
      .transpose(baseDegree)
      .transpose(interval);
    return note.toMidi();
  });
}

async function createMIDIData(
  chords: string[],
  keySignature: KeySignature,
  bpm: number,
  sectionName: string
) {
  const { Midi } = await import('@tonejs/midi');
  const midi = new Midi();

  midi.header.setTempo(bpm);

  const track = midi.addTrack();
  track.name = sectionName;
  track.channel = 0; // Piano channel

  chords.forEach((chord, index) => {
    if (!chord) return;

    const midiNotes = getRomanNumeralNotes(chord, keySignature);
    const startTime = index;
    const duration = 1;

    midiNotes.forEach(note => {
      track.addNote({
        midi: note,
        time: startTime,
        duration: duration,
        velocity: 0.7
      });
    });
  });

  return midi;
}

export async function exportToMIDI(
  chords: string[],
  keySignature: KeySignature,
  bpm: number,
  sectionName: string
) {
  const midi = await createMIDIData(chords, keySignature, bpm, sectionName);
  const midiArray = midi.toArray();
  const fileName = `${sectionName.replace(/\s+/g, '_')}_chords.mid`;

  if (window.electronAPI) {
    // Use Electron's native file dialog
    const result = await window.electronAPI.saveMIDI(midiArray, fileName);
    if (!result.success) {
      throw new Error(result.error || 'Failed to save MIDI file');
    }
  } else {
    // Fallback to browser download
    const blob = new Blob([midiArray], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export async function copyMIDIToClipboard(
  chords: string[],
  keySignature: KeySignature,
  bpm: number,
  sectionName: string
) {
  const midi = await createMIDIData(chords, keySignature, bpm, sectionName);
  const midiArray = midi.toArray();
  const fileName = `${sectionName.replace(/\s+/g, '_')}_chords.mid`;

  if (window.electronAPI) {
    // Use Electron to create a temporary file that can be copied
    const result = await window.electronAPI.copyMIDIToClipboard(midiArray, fileName);
    if (!result.success) {
      throw new Error(result.error || 'Failed to copy MIDI file');
    }
  } else {
    throw new Error('MIDI clipboard operations require the desktop app');
  }
}