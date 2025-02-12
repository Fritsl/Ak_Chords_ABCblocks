import { useState } from 'react';

interface ChordSelectorProps {
  isVisible: boolean;
  onChordSelect: (chord: string, quality: string) => void;
}

export function ChordSelector({
  isVisible,
  onChordSelect
}: ChordSelectorProps) {
  if (!isVisible) return null;

  const baseChords = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const basicQualities = ['', 'm', 'dim', 'aug', '7', 'maj7', 'm7', 'sus4'];

  return (
    <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
      <div className="p-4">
        {/* Base chords */}
        <div className="grid grid-cols-4 gap-2">
          {baseChords.map((chord) => (
            <button
              key={chord}
              onClick={() => onChordSelect(chord, '')}
              className="px-2 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
            >
              {chord}
            </button>
          ))}
        </div>

        {/* Chord qualities */}
        <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-gray-700">
          {basicQualities.map((quality) => (
            <button
              key={quality}
              onClick={() => onChordSelect('', quality)}
              className="px-2 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
            >
              {quality || 'Basic'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}