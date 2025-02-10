import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { Music } from 'lucide-react';
import { 
  Wand2, 
  RefreshCw, 
  CircleSlash2, 
  ChevronUp,
  Dice2 as DicesIcon, 
  ChevronDown, 
  Download, 
  Copy,
  ArrowLeftRight,
  Palette, 
  Settings,
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-react';
import { ChordProgression, KeySignature } from '../types';
import { useChordProgressions } from '../hooks/useChordProgressions';
import { useSynth } from '../hooks/useSynth';
import { SynthControls } from './SynthControls';

interface QuickActionsFooterProps {
  onRandomProgression: () => void;
  onClearChords: () => void;
  selectedBlockType: string;
  selectedBlockLength: number;
  keySignature: KeySignature;
  onKeyChange: (key: KeySignature) => void;
  progressionMode: 'repeat' | 'stretch';
  onProgressionModeChange: (mode: 'repeat' | 'stretch') => void;
  onProgressionSelect: (progression: ChordProgression) => void;
  showColors: boolean;
  onShowColorsChange: (show: boolean) => void;
  chords: string[];
  bpm: number;
  arrangement: { Genre: string } | null;
}

export function QuickActionsFooter({
  onRandomProgression,
  onClearChords,
  selectedBlockType,
  selectedBlockLength,
  progressionMode,
  onProgressionModeChange,
  onProgressionSelect,
  showColors,
  onShowColorsChange,
  keySignature,
  chords,
  bpm,
  arrangement
}: QuickActionsFooterProps) {
  const { progressions, isLoading } = useChordProgressions(
    arrangement?.Genre || 'Pop.Rock.Disco',
    selectedBlockType
  );
  const { controls, setControls } = useSynth();
  const [currentProgressionIndex, setCurrentProgressionIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSynthControls, setShowSynthControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isContinuousPlay, setIsContinuousPlay] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Reset progression index when block type or genre changes
  useEffect(() => {
    setCurrentProgressionIndex(0);
  }, [selectedBlockType, arrangement?.Genre]);

  const currentProgression = progressions[currentProgressionIndex];

  const handlePreviousProgression = () => {
    const newIndex = currentProgressionIndex === 0 ? progressions.length - 1 : currentProgressionIndex - 1;
    setCurrentProgressionIndex(newIndex);
    if (progressions[newIndex]) {
      onProgressionSelect(progressions[newIndex]);
    }
  };

  const handleNextProgression = () => {
    const newIndex = currentProgressionIndex === progressions.length - 1 ? 0 : currentProgressionIndex + 1;
    setCurrentProgressionIndex(newIndex);
    if (progressions[newIndex]) {
      onProgressionSelect(progressions[newIndex]);
    }
  };

  const handleProgressionModeChange = (mode: 'repeat' | 'stretch') => {
    onProgressionModeChange(mode);
    if (currentProgression) {
      onProgressionSelect(currentProgression);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 shadow-xl z-50">
      {/* Synth Controls Modal */}
      {showSynthControls && (
        <div 
          className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[100] flex items-center justify-center"
          onClick={() => setShowSynthControls(false)}
        >
          <div 
            className="w-[420px] max-w-[90vw]"
            onClick={e => e.stopPropagation()}
          >
            <SynthControls
              controls={{...controls, showModal: showSynthControls}}
              onChange={(newControls) => {
                setControls(newControls);
                if (!newControls.showModal) {
                  setShowSynthControls(false);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Main Footer */}
      <div className="h-[64px] px-4">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          {/* Section Info */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Editing <span className="text-white font-medium">{selectedBlockType}</span>
              <span className="text-gray-500 ml-2">({selectedBlockLength} bars)</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-6">
            {/* Quick Progression Carousel */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousProgression}
                disabled={progressions.length === 0}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {isLoading ? (
                  <div className="w-[300px] h-[48px] bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-gray-400">Loading progressions...</span>
                  </div>
                ) : currentProgression ? (
                  <button
                    onClick={() => onProgressionSelect(currentProgression)}
                    className="w-[300px] h-[48px] p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors flex flex-col justify-center"
                  >
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-medium truncate">{currentProgression.name}</h4>
                        <div className="text-indigo-400 text-xs truncate">
                          {currentProgression.chords.join(' - ')}
                        </div>
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="w-[300px] h-[48px] bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-gray-400">No progressions available</span>
                  </div>
                )}

                {/* Stretch/Loop Toggle - Always visible */}
                <button
                  onClick={() => handleProgressionModeChange(progressionMode === 'repeat' ? 'stretch' : 'repeat')}
                  className="h-[48px] w-[48px] bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center text-gray-300"
                  title={progressionMode === 'stretch' ? 'Stretch pattern across section' : 'Repeat pattern to fill section'}
                >
                  {progressionMode === 'stretch' ? (
                    <ArrowLeftRight className="w-5 h-5" />
                  ) : (
                    <RefreshCw className="w-5 h-5" />
                  )}
                </button>
              </div>

              <button
                onClick={handleNextProgression}
                disabled={progressions.length === 0}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="h-8 w-px bg-gray-700" />

            {/* Play Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isPlaying) {
                      stopCurrentPlayback();
                      setIsPlaying(false);
                    } else {
                      playProgression(chords, keySignature);
                      setIsPlaying(true);
                    }
                  }}
                  className={`
                    px-3 py-1.5 text-sm rounded-lg inline-flex items-center gap-1.5
                    ${isPlaying 
                      ? 'bg-red-600 hover:bg-red-500 animate-pulse' 
                      : 'bg-green-600 hover:bg-green-500'
                    }
                    transition-colors duration-150
                  `}
                  style={isPlaying ? {
                    animationDuration: `${(60 / bpm) * 1000}ms`
                  } : undefined}
                >
                  <Music className="w-4 h-4" />
                  <span>{isPlaying ? 'Stop' : 'Play'}</span>
                </button>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={isContinuousPlay}
                    onChange={(e) => setIsContinuousPlay(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-500 bg-gray-700"
                  />
                  Loop
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={() => Tone.Transport.bpm.value = Tone.Transport.bpm.value / 2}
                    className={`px-2 py-1.5 text-xs ${Tone.Transport.bpm.value === 60 ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-500'} rounded-lg`}
                  >
                    ½x
                  </button>
                  <button
                    onClick={() => Tone.Transport.bpm.value = Tone.Transport.bpm.value * 2}
                    className={`px-2 py-1.5 text-xs ${Tone.Transport.bpm.value === 240 ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-500'} rounded-lg`}
                  >
                    2x
                  </button>
                  <button
                    onClick={() => Tone.Transport.bpm.value = 120}
                    className={`px-2 py-1.5 text-xs ${Tone.Transport.bpm.value === 120 ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-500'} rounded-lg`}
                  >
                    1x
                  </button>
                </div>
              </div>
            </div>

            {/* Other Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onRandomProgression}
                className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group relative"
                title="Generate random progression"
              >
                <RefreshCw className="w-5 h-5" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                  Random progression
                </span>
              </button>
              <button
                onClick={onClearChords}
                className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group relative"
                title="Clear all chords"
              >
                <CircleSlash2 className="w-5 h-5" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                  Clear chords
                </span>
              </button>
              <button
                onClick={() => setShowSynthControls(true)}
                className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group relative"
                title="Sound settings"
              >
                <Settings className="w-5 h-5" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                  Sound settings
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}