
import { useState } from 'react';

interface ChordSelectorProps {
  isVisible: boolean;
  selectedChord: string;
  showQualities: boolean;
  onChordSelect: (chord: string) => void;
  onQualitySelect: (quality: string) => void;
  controls?: {
    showExtensions: boolean;
    showAlterations: boolean;
    showInversions: boolean;
  };
  setControls?: (controls: any) => void;
}

export function ChordSelector({
  isVisible,
  selectedChord,
  showQualities,
  onChordSelect,
  onQualitySelect,
  controls,
  setControls
}: ChordSelectorProps) {
  if (!isVisible) return null;

  const chords = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const qualities = ['', 'm', '7', 'maj7', 'm7', 'dim', 'aug'];

  return (
    <div className="absolute z-50 p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-xl w-[300px]">
      <div className="grid grid-cols-4 gap-2">
        {!showQualities && chords.map(chord => (
          <button
            key={chord}
            onClick={() => onChordSelect(chord)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            {chord}
          </button>
        ))}
      </div>
      {showQualities && (
        <div className="grid grid-cols-4 gap-2 mt-4 border-t border-gray-700 pt-4">
          {qualities.map(quality => (
            <button
              key={quality}
              onClick={() => onQualitySelect(quality)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              {quality || 'Basic'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
