// Common reference types for internal use
export const BLOCK_TYPE_MAP = {
  'Verse': 'A',
  'Chorus': 'B', 
  'Solo_Break': 'C',
  'Bridge': 'R',
  'Pre_Chorus': 'P',
  'Intro': 'I',
  'Outro_Fade_Out': 'O',
  'Air': 'S'
} as const;

export const REVERSE_BLOCK_TYPE_MAP = {
  'A': 'Verse',
  'B': 'Chorus',
  'C': 'Solo_Break', 
  'R': 'Bridge',
  'P': 'Pre_Chorus',
  'I': 'Intro',
  'O': 'Outro_Fade_Out',
  'S': 'Air'
} as const;

export interface Block {
  Type: string;
}

export interface TypeDefinition {
  Length: number;
}

export interface Arrangement {
  Version: string;
  Genre: string;
  Name: string;
  UserName: string;
  Blocks: Block[];
  Types: Record<string, TypeDefinition>;
}

export const VALID_GENRES = [
  'Pop_Rock_Disco',
  'EDM_House_Electronic',
  'RnB_Hip_Hop',
  'Jazz_Blues',
  'Ambient',
  'UserDefined'
] as const;

export const VALID_LENGTHS = [1, 2, 3, 4, 6, 8, 10, 12, 16, 24, 32] as const;

// Use internal reference system for type validation
export const REQUIRED_TYPES = ['A', 'B', 'C', 'R', 'P', 'I', 'O', 'S'] as const;

export const BUILDING_HEIGHTS = {
  'A': 3, // Verse
  'B': 7, // Chorus
  'C': 5, // Solo-Break
  'R': 4, // Bridge
  'P': { start: 6, end: 7 }, // Pre-Chorus
  'I': { start: 2, end: 3 }, // Intro
  'O': { start: 3, end: 2 }, // Outro
  'S': 2  // Air
} as const;

export const BUILDING_COLORS = {
  'A': 'bg-[#b8d94f]', // Verse
  'B': 'bg-[#6de454]', // Chorus
  'C': 'bg-[#4fe4aa]', // Solo-Break
  'R': 'bg-[#4fb8e4]', // Bridge
  'P': 'bg-[#7154e4]', // Pre-Chorus
  'I': 'bg-[#d454e4]', // Intro
  'O': 'bg-[#e4548c]', // Outro
  'S': 'bg-[#e49b54]'  // Air
} as const;

export const GENRE_TYPE_MAPPINGS: Record<string, Record<string, string>> = {
  'Pop_Rock_Disco': {
    'A': 'Verse',
    'B': 'Chorus',
    'C': 'Solo/Break',
    'R': 'Bridge',
    'P': 'Pre-Chorus',
    'I': 'Intro',
    'O': 'Outro/Fade Out',
    'S': 'Air'
  },
  'EDM_House_Electronic': {
    'A': 'Break',
    'B': 'Drop',
    'C': 'Build',
    'R': 'Breakdown',
    'P': 'Buildup',
    'I': 'Intro',
    'O': 'Outro',
    'S': 'Air'
  },
  'RnB_Hip_Hop': {
    'A': 'Verse',
    'B': 'Chorus',
    'C': 'Beat Switch',
    'R': 'Variation',
    'P': 'Pre-Chorus',
    'I': 'Intro',
    'O': 'Fade Out',
    'S': 'Air'
  },
  'Jazz_Blues': {
    'A': 'Head',
    'B': 'Impro/Solo',
    'C': 'Solo Transition',
    'R': 'Return to Head',
    'P': 'Lead-in',
    'I': 'Intro',
    'O': 'Coda/Vamping',
    'S': 'Air'
  },
  'Ambient': {
    'A': 'Exposition',
    'B': 'Development',
    'C': 'Cadence',
    'R': 'Transitional',
    'P': 'Prelude',
    'I': 'Intro',
    'O': 'Outro',
    'S': 'Air'
  }
};

export const MUSICAL_KEYS = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'C♯',
  'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭'
] as const;

export type MusicalKey = typeof MUSICAL_KEYS[number];
export type KeyMode = 'major' | 'minor';

export interface KeySignature {
  key: MusicalKey;
  mode: KeyMode;
}

export interface ChordProgression {
  chords: string[];
  name: string;
  description: string;
}