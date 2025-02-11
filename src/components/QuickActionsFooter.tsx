import React, { useState, useEffect } from 'react';
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
import { exportToMIDI } from '../utils/midiExport';
import { SynthControls } from './SynthControls';
import { Switch } from '@headlessui/react';

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
  controls: any; // Add controls prop
  setControls: React.Dispatch<React.SetStateAction<any>>; //Add setControls prop
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
  arrangement,
  controls,
  setControls
}: QuickActionsFooterProps) {
  const { progressions, isLoading } = useChordProgressions(
    arrangement?.Genre || 'Pop.Rock.Disco',
    selectedBlockType
  );
  const [currentProgressionIndex, setCurrentProgressionIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSynthControls, setShowSynthControls] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showExtensions, setShowExtensions] = useState(false);
  const [showAlterations, setShowAlterations] = useState(false);
  const [showInversions, setShowInversions] = useState(false);

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
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-6">
            {/* Chord Settings */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={controls.showExtensions}
                  onChange={(checked) => setControls({...controls, showExtensions: checked})}
                  className={`${
                    controls.showExtensions ? 'bg-blue-600' : 'bg-gray-600'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span className="sr-only">Show Extensions</span>
                  <span
                    className={`${
                      controls.showExtensions ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <span className="text-sm text-gray-300">Extensions</span>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={controls.showAlterations}
                  onChange={(checked) => setControls({...controls, showAlterations: checked})}
                  className={`${
                    controls.showAlterations ? 'bg-blue-600' : 'bg-gray-600'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span className="sr-only">Show Alterations</span>
                  <span
                    className={`${
                      controls.showAlterations ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <span className="text-sm text-gray-300">Alterations</span>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={controls.showInversions}
                  onChange={(checked) => setControls({...controls, showInversions: checked})}
                  className={`${
                    controls.showInversions ? 'bg-blue-600' : 'bg-gray-600'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span className="sr-only">Show Inversions</span>
                  <span
                    className={`${
                      controls.showInversions ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <span className="text-sm text-gray-300">Inversions</span>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-700" />

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
                onClick={async () => {
                  try {
                    setIsExporting(true);
                    if (!chords || chords.length === 0) {
                      throw new Error('No chords to export');
                    }
                    await exportToMIDI(chords, keySignature, bpm, selectedBlockType);
                  } catch (error) {
                    console.error('Failed to export MIDI:', error.message || error);
                    // Could add user feedback here if needed
                  } finally {
                    setIsExporting(false);
                  }
                }}
                disabled={isExporting || !chords.length}
                className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group relative disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download MIDI file"
              >
                <Download className="w-5 h-5" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                  Download MIDI
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