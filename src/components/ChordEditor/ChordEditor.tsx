import React, { useState, useRef, useEffect } from 'react';
import { Music, Copy, Trash2, DicesIcon } from 'lucide-react'; // Added import for DicesIcon
import { Arrangement, KeySignature } from '../../types';
import { ChordCell } from './ChordCell';
import * as Tone from 'tone';
import { ChordSelector } from './ChordSelector';
import { getFunctionColor } from '../../constants/music';
import { useChordProgressions } from '../../hooks/useChordProgressions';
import { useSynth } from '../../hooks/useSynth';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

interface ChordEditorProps {
  arrangement: Arrangement;
  blockIndex: number;
  chords?: string[];
  onChordChange?: (barIndex: number, chord: string) => void;
  onChordsReorder?: (newChords: string[]) => void;
  onBlockFinished?: () => void; // Added callback for block completion
  genreTypeName: string;
  isSelected?: boolean;
  onSelect?: () => void;
  keySignature: KeySignature;
}

export function ChordEditor({ 
  arrangement, 
  blockIndex, 
  chords = [], 
  onChordChange,
  onChordsReorder,
  onBlockFinished, // Use the added callback
  genreTypeName,
  isSelected = false,
  onSelect,
  keySignature
}: ChordEditorProps) {
  const block = arrangement.Blocks[blockIndex];
  const numBars = arrangement.Types[block.Type].Length;
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  const [showQualities, setShowQualities] = useState(false);
  const [selectedChord, setSelectedChord] = useState<string>('');
  const [pasteError, setPasteError] = useState<string | null>(null);

  const { progressions, isLoading } = useChordProgressions(
    arrangement.Genre,
    block.Type // Pass the raw type directly
  );

  const { playChord, playProgression, stopPlayback } = useSynth();

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.split('-')[1]);
      const newIndex = parseInt(over.id.split('-')[1]);

      const newChords = arrayMove([...chords], oldIndex, newIndex);
      onChordsReorder?.(newChords);
    }
  };

  const handleChordSelect = (chord: string) => {
    if (showQualities) {
      setSelectedChord(chord);
      setShowQualities(false);
      onChordChange?.(activeBarIndex!, chord);
    } else {
      setSelectedChord(chord);
      setShowQualities(true);
    }
  };

  const handleQualitySelect = (quality: string) => {
    const newChord = selectedChord + quality;
    onChordChange?.(activeBarIndex!, newChord);
    setShowQualities(false);
    setActiveBarIndex(null);
  };

  const handleCopyChords = () => {
    const chordsText = chords.map((chord, i) => `Bar ${i + 1}: ${chord || '-'}`).join('\n');
    navigator.clipboard.writeText(chordsText);
  };

  const handlePasteChords = async () => {
    try {
      setPasteError(null);
      const text = await navigator.clipboard.readText();
      const lines = text.split('\n');

      const pastedChords = lines.map(line => {
        const match = line.match(/Bar \d+: (.+)/);
        return match ? (match[1] === '-' ? '' : match[1]) : null;
      }).filter(chord => chord !== null) as string[];

      if (pastedChords.length === 0) {
        setPasteError('Invalid chord format');
        return;
      }

      for (let i = 0; i < numBars; i++) {
        const chord = pastedChords[i % pastedChords.length];
        onChordChange?.(i, chord);
      }
    } catch (error) {
      setPasteError('Failed to paste chords');
      console.error('Paste error:', error);
    }
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [isContinuousPlay, setIsContinuousPlay] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const updateInterval = async () => {
      if (isPlaying && !intervalRef.current) {
        await Tone.start();
        const stepTime = (60 / Tone.Transport.bpm.value) * 1000 * 4;
        const validChords = chords.filter(chord => chord);

        if (validChords[0]) {
          playChord(validChords[0], keySignature);
        }

        intervalRef.current = window.setInterval(() => {
          setCurrentStep(step => {
            const nextStep = step + 1;
            if (nextStep >= validChords.length) {
              if (isContinuousPlay) {
                onBlockFinished?.(); // Call the callback when the block is finished
              }
              return 0;
            }
            if (validChords[nextStep]) {
              playChord(validChords[nextStep], keySignature);
            }
            return nextStep;
          });
        }, stepTime);
      }
    };

    updateInterval();

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, Tone.Transport.bpm.value, chords, keySignature, playChord, isContinuousPlay, onBlockFinished]);

  const handlePlayProgression = () => {
    if (isPlaying) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
      setCurrentStep(-1);
      stopPlayback();
    } else {
      setIsPlaying(true);
      setCurrentStep(0);
      const validChords = chords.filter(chord => chord);
      if (validChords.length > 0) {
        const stepTime = (60 / Tone.Transport.bpm.value) * 1000 * 4; // 4 beats per bar
        intervalRef.current = window.setInterval(() => {
          setCurrentStep(step => {
            const nextStep = (step + 1) % validChords.length;
            if (validChords[nextStep]) {
              playChord(validChords[nextStep], keySignature);
            }
            return nextStep;
          });
        }, stepTime);
      }
    }
  };

  return (
    <div 
      onClick={onSelect}
      className={`
        flex flex-col gap-4 p-4 rounded-lg transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'bg-indigo-600/10 ring-2 ring-indigo-500 scale-[1.02]' 
          : 'hover:bg-gray-700/30'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-medium text-gray-300">
            {genreTypeName} - {numBars} bars
          </span>
          {pasteError && (
            <span className="text-xs text-red-400 animate-fade-out">
              {pasteError}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {/* Progression Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newIndex = currentProgressionIndex === 0 ? progressions.length - 1 : currentProgressionIndex - 1;
                setCurrentProgressionIndex(newIndex);
                if (progressions[newIndex]) {
                  onProgressionSelect(progressions[newIndex]);
                }
              }}
              disabled={progressions.length === 0}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="w-[240px] h-[38px] bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-gray-400">Loading...</span>
                </div>
              ) : currentProgression ? (
                <button
                  onClick={() => onProgressionSelect(currentProgression)}
                  className="w-[240px] h-[38px] p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors flex flex-col justify-center"
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
                <div className="w-[240px] h-[38px] bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-gray-400">No progressions</span>
                </div>
              )}

              <button
                onClick={() => handleProgressionModeChange(progressionMode === 'repeat' ? 'stretch' : 'repeat')}
                className="h-[38px] w-[38px] bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center text-gray-300"
                title={progressionMode === 'stretch' ? 'Stretch pattern' : 'Repeat pattern'}
              >
                {progressionMode === 'stretch' ? (
                  <ArrowLeftRight className="w-4 h-4" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </button>
            </div>

            <button
              onClick={() => {
                const newIndex = currentProgressionIndex === progressions.length - 1 ? 0 : currentProgressionIndex + 1;
                setCurrentProgressionIndex(newIndex);
                if (progressions[newIndex]) {
                  onProgressionSelect(progressions[newIndex]);
                }
              }}
              disabled={progressions.length === 0}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          
          {/* Original Random button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (!isLoading && progressions.length > 0) {
                const randomProgression = progressions[Math.floor(Math.random() * progressions.length)];
                randomProgression.chords.forEach((chord, i) => {
                  if (i < numBars) {
                    onChordChange?.(i, chord);
                  }
                });
              }
            }}
            className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 rounded-lg inline-flex items-center gap-1.5"
          >
            <DicesIcon className="w-3 h-3" />
            <span>Random</span>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleCopyChords();
            }}
            className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 rounded-lg inline-flex items-center gap-1.5"
          >
            <Copy className="w-3 h-3" />
            <span>Copy</span>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handlePasteChords();
            }}
            className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 rounded-lg inline-flex items-center gap-1.5"
          >
            <Copy className="w-3 h-3" />
            <span>Paste</span>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              for (let i = 0; i < numBars; i++) {
                onChordChange?.(i, '');
              }
            }}
            className="px-3 py-1.5 text-xs bg-gray-600 hover:bg-gray-500 rounded-lg inline-flex items-center gap-1.5"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>

        </div>
      </div>

      {/* Chord Grid */}
      <div className="grid grid-cols-8 gap-2" onClick={e => e.stopPropagation()}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={Array.from({ length: numBars }).map((_, i) => `chord-${i}`)}
            strategy={rectSortingStrategy}
          >
            {Array.from({ length: numBars }).map((_, barIndex) => (
              <ChordCell
                key={`chord-${barIndex}`}
                id={`chord-${barIndex}`}
                barIndex={barIndex}
                chord={chords[barIndex]}
                isActive={activeBarIndex === barIndex}
                onClick={() => {
                  if (activeBarIndex === barIndex) {
                    setActiveBarIndex(null);
                    setShowQualities(false);
                  } else {
                    setActiveBarIndex(barIndex);
                    setShowQualities(false);
                  }
                }}
                onSuggest={() => {
                  if (!isLoading && progressions.length > 0) {
                    const randomProgression = progressions[Math.floor(Math.random() * progressions.length)];
                    const chord = randomProgression.chords[barIndex % randomProgression.chords.length];
                    onChordChange?.(barIndex, chord);
                  }
                }}
                onCycleQuality={() => {
                  const currentChord = chords[barIndex];
                  if (!currentChord) return;

                  const baseChord = currentChord.replace(/[^IiVv]+$/, '');
                  const qualities = ['', 'm', 'm7', '7'];
                  const currentQuality = currentChord.slice(baseChord.length);
                  const currentIndex = qualities.indexOf(currentQuality);
                  const nextQuality = qualities[(currentIndex + 1) % qualities.length];

                  onChordChange?.(barIndex, baseChord + nextQuality);
                }}
                functionColor={getFunctionColor(chords[barIndex])}
                keySignature={keySignature}
                onPlay={(chord) => playChord(chord, keySignature)}
                currentStep={currentStep}
              />
            ))}
          </SortableContext>
        </DndContext>

        {activeBarIndex !== null && (
          <ChordSelector
            isVisible={true}
            selectedChord={selectedChord}
            showQualities={showQualities}
            onChordSelect={handleChordSelect}
            onQualitySelect={handleQualitySelect}
          />
        )}
      </div>
    </div>
  );
}