import React from 'react';
import { X, Music, Wand2, DicesIcon, CircleSlash2, ArrowUpRight } from 'lucide-react';
import { ChordProgression, KeySignature } from '../types';
import { CircleOfFifths } from './CircleOfFifths';

interface FloatingActionPanelProps {
  isVisible: boolean;
  onClose: () => void;
  selectedGenreTab: 'dance' | 'band';
  onGenreTabChange: (tab: 'dance' | 'band') => void;
  progressions: ChordProgression[];
  onProgressionSelect: (progression: ChordProgression) => void;
  progressionMode: 'repeat' | 'stretch';
  onProgressionModeChange: (mode: 'repeat' | 'stretch') => void;
  keySignature: KeySignature;
  onKeyChange: (key: KeySignature) => void;
  onClearChords: () => void;
  onRandomProgression: () => void;
  selectedBlockType: string;
  selectedBlockLength: number;
}

export function FloatingActionPanel({
  isVisible,
  onClose,
  selectedGenreTab,
  onGenreTabChange,
  progressions,
  onProgressionSelect,
  progressionMode,
  onProgressionModeChange,
  keySignature,
  onKeyChange,
  onClearChords,
  onRandomProgression,
  selectedBlockType,
  selectedBlockLength
}: FloatingActionPanelProps) {
  if (!isVisible) return null;

  return (
    <div className="sticky bottom-6 ml-auto mr-6 w-[420px] bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 z-50">
      {/* Selected section indicator */}
      <div className="absolute -top-12 left-0 right-0">
        <div className="bg-indigo-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg border border-indigo-500 flex items-center gap-2">
          <ArrowUpRight className="w-4 h-4 animate-pulse" />
          <span className="text-sm">
            Editing <strong>{selectedBlockType}</strong> ({selectedBlockLength} bars)
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-medium text-gray-200">Section Quick Actions</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRandomProgression}
              className="p-1.5 text-gray-400 hover:text-gray-300 bg-gray-700 rounded-lg group relative"
              title="Generate random progression"
            >
              <DicesIcon className="w-4 h-4" />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                Random progression for this section
              </span>
            </button>
            <button
              onClick={onClearChords}
              className="p-1.5 text-gray-400 hover:text-gray-300 bg-gray-700 rounded-lg group relative"
              title="Clear all chords"
            >
              <CircleSlash2 className="w-4 h-4" />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                Clear this section's chords
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-300 bg-gray-700 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Left Column: Circle of Fifths */}
          <div className="bg-gray-900/30 rounded-lg p-3 relative">
            <h4 className="text-xs font-medium text-gray-400 mb-2">Section Key & Mode</h4>
            <CircleOfFifths
              selectedKey={keySignature}
              onKeySelect={(key) => onKeyChange({ ...keySignature, key })}
              size="small"
            />
            <div className="flex justify-center mt-2">
              <button
                onClick={() => onKeyChange({ ...keySignature, mode: keySignature.mode === 'major' ? 'minor' : 'major' })}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  keySignature.mode === 'major'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {keySignature.mode === 'major' ? 'Major' : 'Minor'}
              </button>
            </div>
          </div>

          {/* Right Column: Progressions */}
          <div className="space-y-3">
            {/* Genre Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => onGenreTabChange('dance')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  selectedGenreTab === 'dance'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Electronic / Dance
              </button>
              <button
                onClick={() => onGenreTabChange('band')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  selectedGenreTab === 'band'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Band / Traditional
              </button>
            </div>

            {/* Pattern Mode */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-gray-400">Fill {selectedBlockLength} bars:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => onProgressionModeChange('repeat')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    progressionMode === 'repeat'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  title="Repeat the pattern to fill the section"
                >
                  Repeat
                </button>
                <button
                  onClick={() => onProgressionModeChange('stretch')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    progressionMode === 'stretch'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  title="Stretch the pattern across the section"
                >
                  Stretch
                </button>
              </div>
            </div>

            {/* Progressions */}
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin">
              {progressions.map((progression, index) => (
                <button
                  key={index}
                  onClick={() => onProgressionSelect(progression)}
                  className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Wand2 className="w-3 h-3 text-indigo-400" />
                    <h4 className="text-xs font-medium">{progression.name}</h4>
                  </div>
                  <div className="text-indigo-400 text-xs mb-1 break-words">
                    {progression.chords.join(' - ')}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {progression.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}