export interface ChordProgression {
  name: string;
  description: string;
  chords: string[];
}

export interface ChordProgressionData {
  [genre: string]: {
    [style: string]: {
      Verse: string;
      Chorus: string;
      'Solo-Break': string;
      Bridge: string;
      'Pre-Chorus': string;
      Intro: string;
      'Outro.Fade_Out': string;
      Air: string;
      [key: string]: string;
    };
  };
}