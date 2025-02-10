import React from 'react';
import { DIATONIC_CHORDS, FUNCTIONAL_PROGRESSIONS } from '../../constants/music';

interface ChordSelectorProps {
  isVisible: boolean;
  selectedChord: string;
  showQualities: boolean;
  onChordSelect: (chord: string) => void;
  onQualitySelect: (quality: string) => void;
}

export function ChordSelector({
  isVisible,
  selectedChord,
  showQualities,
  onChordSelect,
  onQualitySelect
}: ChordSelectorProps) {
  if (!isVisible) return null;

  if (showQualities && selectedChord) {
    return (
      <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
        <div className="p-2 grid grid-cols-2 gap-1">
          {DIATONIC_CHORDS.major[selectedChord as keyof typeof DIATONIC_CHORDS.major]?.map((quality) => (
            <button
              key={quality}
              onClick={() => onQualitySelect(quality)}
              className="px-2 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
            >
              {selectedChord}{quality || '(none)'}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
      <div className="p-2 grid grid-cols-4 gap-1">
        {Object.entries(DIATONIC_CHORDS.major).map(([chord]) => (
          <button
            key={chord}
            onClick={() => onChordSelect(chord)}
            className={`px-2 py-1 text-sm rounded ${
              FUNCTIONAL_PROGRESSIONS.tonic.includes(chord)
                ? 'bg-green-900/30 hover:bg-green-800/30'
                : FUNCTIONAL_PROGRESSIONS.subdominant.includes(chord)
                  ? 'bg-blue-900/30 hover:bg-blue-800/30'
                  : FUNCTIONAL_PROGRESSIONS.dominant.includes(chord)
                    ? 'bg-red-900/30 hover:bg-red-800/30'
                    : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {chord}
          </button>
        ))}
      </div>
    </div>
  );
}