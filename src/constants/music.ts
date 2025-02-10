// Musical constants for chord types and progressions
export const CHORD_QUALITIES = {
  // Basic triads
  major: ['', 'maj', '5'],
  minor: ['m', 'm5'],
  diminished: ['°', 'dim'],
  augmented: ['aug', '+'],

  // Seventh chords
  dominant: ['7', '7sus4'],
  major7: ['maj7', 'M7'],
  minor7: ['m7'],
  diminished7: ['dim7', '°7'],
  halfDiminished: ['m7b5', 'ø'],
  augmented7: ['aug7', '+7'],

  // Extended chords
  ninth: ['9', 'maj9', 'm9'],
  eleventh: ['11', 'maj11', 'm11'],
  thirteenth: ['13', 'maj13', 'm13'],

  // Altered dominants
  altered: ['7b5', '7#5', '7b9', '7#9', '7b5b9', '7b5#9', '7#5b9', '7#5#9', '9b5', '9#5', '13b9', '13#9'],

  // Suspended chords
  suspended: ['sus2', 'sus4'],

  // Add chords
  add: ['add9', 'add11', 'add13'],

  // Sixth chords
  sixth: ['6', 'm6', '6/9'],

  // Special
  power: ['5'],
  quartal: ['4']
} as const;

// Diatonic chords with their available qualities
export const DIATONIC_CHORDS = {
  major: {
    I: [
      '', 'maj7', '6', 'maj9', 'maj13', 'add9', 'sus2', 'sus4', '6/9',
      '7', '9', '11', '13', '7sus4', '7b5', '7#5', '7b9', '7#9'
    ],
    ii: ['m', 'm7', 'm9', 'm11', 'm13', 'm6', 'ø', 'm7b5'],
    iii: ['m', 'm7', 'm9', 'm11', 'm6'],
    IV: ['', 'maj7', '6', 'maj9', 'add9', 'sus4', '7', '9', '11'],
    V: [
      '', '7', '9', '11', '13', 'sus4', '7sus4',
      '7b5', '7#5', '7b9', '7#9', '7b5b9', '7b5#9', '7#5b9', '7#5#9'
    ],
    vi: ['m', 'm7', 'm9', 'm11', 'm13', 'm6'],
    vii: ['m7b5', 'ø', 'dim', 'dim7', '°', '°7']
  },
  minor: {
    i: ['m', 'm7', 'm9', 'm11', 'm13', 'm6', 'madd9'],
    ii: ['dim', 'dim7', '°', '°7', 'm7b5', 'ø'],
    III: ['', 'maj7', '6', 'maj9', 'add9'],
    iv: ['m', 'm7', 'm9', 'm11', 'm6'],
    v: ['m', 'm7', '7', '7b9', '7#9'],
    VI: ['', 'maj7', '6', 'maj9'],
    VII: ['', '7', '7b9', '7#9']
  }
} as const;

// Common chord progressions by function
export const FUNCTIONAL_PROGRESSIONS = {
  tonic: ['I', 'i', 'III', 'vi'],
  subdominant: ['IV', 'iv', 'ii', 'ii°'],
  dominant: ['V', 'v', 'vii°', 'VII']
} as const;

// Color coding for chord functions
export const FUNCTION_COLORS = {
  tonic: 'text-green-400',
  subdominant: 'text-blue-400',
  dominant: 'text-red-400',
  other: 'text-indigo-300'
} as const;

// Get the functional color for a chord
export function getFunctionColor(chord: string): string {
  if (!chord) return 'text-gray-400';
  
  // Extract base chord without quality
  const baseChord = chord.replace(/[^IiVv]+$/, '');
  
  if (FUNCTIONAL_PROGRESSIONS.tonic.includes(baseChord)) return FUNCTION_COLORS.tonic;
  if (FUNCTIONAL_PROGRESSIONS.subdominant.includes(baseChord)) return FUNCTION_COLORS.subdominant;
  if (FUNCTIONAL_PROGRESSIONS.dominant.includes(baseChord)) return FUNCTION_COLORS.dominant;
  return FUNCTION_COLORS.other;
}

// Validate if a chord symbol is valid
export function isValidChord(chord: string): boolean {
  // Extract base chord and quality
  const match = chord.match(/^([IiVv]+)(.*?)$/);
  if (!match) return false;

  const [, baseChord, quality] = match;
  
  // Check if base chord exists in diatonic chords
  const isMajorChord = baseChord === baseChord.toUpperCase();
  const chordSet = isMajorChord ? DIATONIC_CHORDS.major : DIATONIC_CHORDS.minor;
  
  if (!chordSet[baseChord as keyof typeof chordSet]) return false;

  // If no quality, it's valid
  if (!quality) return true;

  // Check if quality is valid for this chord
  const validQualities = chordSet[baseChord as keyof typeof chordSet];
  return validQualities.includes(quality);
}