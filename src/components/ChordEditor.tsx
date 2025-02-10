import React, { useState } from 'react';
import { Arrangement } from '../types';
import { Music, Copy, Trash2, ChevronDown, Wand2, RefreshCw } from 'lucide-react';

interface ChordEditorProps {
  arrangement: Arrangement;
  blockIndex: number;
  chords?: string[];
  onChordChange?: (barIndex: number, chord: string) => void;
  genreTypeName: string;
  isSelected?: boolean;
}

// Simplified chord options with common variations
const DIATONIC_CHORDS = {
  major: {
    I: ['', 'maj7', '6', 'maj9'],
    ii: ['m', 'm7', 'm9'],
    iii: ['m', 'm7'],
    IV: ['', 'maj7', '6'],
    V: ['', '7', 'sus4'],
    vi: ['m', 'm7'],
    vii: ['m7b5']
  }
};

// Common chord progressions by function
const FUNCTIONAL_PROGRESSIONS = {
  tonic: ['I', 'vi', 'iii'],
  subdominant: ['IV', 'ii'],
  dominant: ['V', 'vii']
};

export function ChordEditor({ 
  arrangement, 
  blockIndex, 
  chords = [], 
  onChordChange,
  genreTypeName,
  isSelected = false
}: ChordEditorProps) {
  const block = arrangement.Blocks[blockIndex];
  const numBars = arrangement.Types[block.Type].Length;
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  const [showQualities, setShowQualities] = useState(false);
  const [selectedChord, setSelectedChord] = useState<string>('');

  const handleChordSelect = (chord: string, barIndex: number) => {
    if (showQualities) {
      setSelectedChord(chord);
      setShowQualities(false);
      onChordChange?.(barIndex, chord);
    } else {
      setSelectedChord(chord);
      setShowQualities(true);
    }
  };

  const handleQualitySelect = (quality: string, barIndex: number) => {
    const newChord = selectedChord + quality;
    onChordChange?.(barIndex, newChord);
    setShowQualities(false);
    setActiveBarIndex(null);
  };

  const handleClearChords = () => {
    for (let i = 0; i < numBars; i++) {
      onChordChange?.(i, '');
    }
  };

  const handleCopyChords = () => {
    const chordsText = chords.map((chord, i) => `Bar ${i + 1}: ${chord || '-'}`).join('\n');
    navigator.clipboard.writeText(chordsText);
  };

  const suggestNextChord = (currentBar: number) => {
    const previousChord = currentBar > 0 ? chords[currentBar - 1] : null;
    
    if (!previousChord) {
      return 'I';
    }

    if (FUNCTIONAL_PROGRESSIONS.tonic.includes(previousChord)) {
      return FUNCTIONAL_PROGRESSIONS.subdominant[Math.floor(Math.random() * FUNCTIONAL_PROGRESSIONS.subdominant.length)];
    }
    
    if (FUNCTIONAL_PROGRESSIONS.subdominant.includes(previousChord)) {
      return FUNCTIONAL_PROGRESSIONS.dominant[Math.floor(Math.random() * FUNCTIONAL_PROGRESSIONS.dominant.length)];
    }
    
    return FUNCTIONAL_PROGRESSIONS.tonic[Math.floor(Math.random() * FUNCTIONAL_PROGRESSIONS.tonic.length)];
  };

  const cycleChordQuality = (barIndex: number) => {
    const currentChord = chords[barIndex];
    if (!currentChord) return;
    
    const baseChord = currentChord.replace(/[^IiVv]+$/, '');
    const qualities = DIATONIC_CHORDS.major[baseChord as keyof typeof DIATONIC_CHORDS.major] || [];
    const currentQuality = currentChord.slice(baseChord.length);
    const currentIndex = qualities.indexOf(currentQuality);
    const nextQuality = qualities[(currentIndex + 1) % qualities.length];
    
    onChordChange?.(barIndex, baseChord + nextQuality);
  };

  const getFunctionColor = (chord: string) => {
    if (FUNCTIONAL_PROGRESSIONS.tonic.includes(chord)) return 'text-green-400';
    if (FUNCTIONAL_PROGRESSIONS.subdominant.includes(chord)) return 'text-blue-400';
    if (FUNCTIONAL_PROGRESSIONS.dominant.includes(chord)) return 'text-red-400';
    return 'text-indigo-300';
  };

  return (
    <div className={`flex flex-col gap-4 transition-all duration-200 ${
      isSelected ? 'scale-[1.02]' : ''
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-medium text-gray-300">
            {genreTypeName} - {numBars} bars
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCopyChords}
            className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 rounded-lg inline-flex items-center gap-1.5"
          >
            <Copy className="w-3 h-3" />
            <span>Copy</span>
          </button>
          <button 
            onClick={handleClearChords}
            className="px-3 py-1.5 text-xs bg-gray-600 hover:bg-gray-500 rounded-lg inline-flex items-center gap-1.5"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Chord Grid */}
      <div className="grid grid-cols-8 gap-2">
        {Array.from({ length: numBars }).map((_, barIndex) => (
          <div key={barIndex} className="relative group">
            <div className="relative">
              <button
                onClick={() => {
                  if (activeBarIndex === barIndex) {
                    setActiveBarIndex(null);
                    setShowQualities(false);
                  } else {
                    setActiveBarIndex(barIndex);
                    setShowQualities(false);
                  }
                }}
                className={`
                  relative w-full aspect-square bg-gray-700 hover:bg-gray-600 rounded-lg 
                  border border-gray-600 focus:outline-none transition-all
                  ${chords[barIndex] ? 'border-indigo-500/50' : ''}
                  ${activeBarIndex === barIndex ? 'ring-2 ring-indigo-500' : ''}
                `}
              >
                {/* Bar number */}
                <div className="absolute top-1 left-1 text-[10px] text-gray-500">
                  {barIndex + 1}
                </div>

                {/* Chord display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-medium ${
                    chords[barIndex] ? getFunctionColor(chords[barIndex]) : 'text-gray-400'
                  }`}>
                    {chords[barIndex] || '-'}
                  </span>
                </div>
              </button>

              {/* Quick action buttons */}
              <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const suggestion = suggestNextChord(barIndex);
                    if (suggestion) {
                      onChordChange?.(barIndex, suggestion);
                    }
                  }}
                  className="bg-indigo-500 hover:bg-indigo-400 rounded-full p-1.5"
                  title="Suggest next chord"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                </button>
                {chords[barIndex] && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cycleChordQuality(barIndex);
                    }}
                    className="bg-purple-500 hover:bg-purple-400 rounded-full p-1.5"
                    title="Cycle chord quality"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Chord selection dropdown */}
            {activeBarIndex === barIndex && !showQualities && (
              <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
                <div className="p-2 grid grid-cols-4 gap-1">
                  {Object.entries(DIATONIC_CHORDS.major).map(([chord]) => (
                    <button
                      key={chord}
                      onClick={() => handleChordSelect(chord, barIndex)}
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
            )}

            {/* Chord quality selection */}
            {activeBarIndex === barIndex && showQualities && selectedChord && (
              <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
                <div className="p-2 grid grid-cols-2 gap-1">
                  {DIATONIC_CHORDS.major[selectedChord as keyof typeof DIATONIC_CHORDS.major]?.map((quality) => (
                    <button
                      key={quality}
                      onClick={() => handleQualitySelect(quality, barIndex)}
                      className="px-2 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                    >
                      {selectedChord}{quality || '(none)'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}