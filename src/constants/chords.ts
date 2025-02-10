// Only keep the chord qualities definition, remove all hardcoded progressions
export const CHORD_QUALITIES = {
  '': [0, 4, 7],
  'm': [0, 3, 7],
  'dim': [0, 3, 6],
  'aug': [0, 4, 8],
  '7': [0, 4, 7, 10],
  'maj7': [0, 4, 7, 11],
  'm7': [0, 3, 7, 10],
  'dim7': [0, 3, 6, 9],
  'm7b5': [0, 3, 6, 10],
  '6': [0, 4, 7, 9],
  'm6': [0, 3, 7, 9],
  'sus4': [0, 5, 7],
  'sus2': [0, 2, 7],
  '9': [0, 4, 7, 10, 14],
  'maj9': [0, 4, 7, 11, 14],
  'm9': [0, 3, 7, 10, 14]
} as const;

export const SCALE_DEGREES = {
  'I': 0,
  'II': 2,
  'III': 4,
  'IV': 5,
  'V': 7,
  'VI': 9,
  'VII': 11,
  'i': 0,
  'ii': 2,
  'iii': 4,
  'iv': 5,
  'v': 7,
  'vi': 9,
  'vii': 11
} as const;