
import { KeySignature } from '../types';
import { FUNCTIONAL_PROGRESSIONS } from '../constants/music';

export const getFunctionColor = (chord: string) => {
  if (FUNCTIONAL_PROGRESSIONS.tonic.includes(chord)) return 'text-green-400';
  if (FUNCTIONAL_PROGRESSIONS.subdominant.includes(chord)) return 'text-blue-400';
  if (FUNCTIONAL_PROGRESSIONS.dominant.includes(chord)) return 'text-red-400';
  return 'text-indigo-300';
};

export const getCycledQuality = (chord: string): string => {
  const baseChord = chord.replace(/[^IiVv]+$/, '');
  const qualities = ['', 'm', 'm7', '7'];
  const currentQuality = chord.slice(baseChord.length);
  const currentIndex = qualities.indexOf(currentQuality);
  const nextQuality = qualities[(currentIndex + 1) % qualities.length];
  return baseChord + nextQuality;
};
