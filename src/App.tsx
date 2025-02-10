import React, { useState, useRef } from 'react';
import { ArrangementVisualizer } from './components/ArrangementVisualizer';
import { ArrangementDropZone } from './components/ArrangementDropZone';
import { SiteHeader } from './components/SiteHeader';
import { ChordEditor } from './components/ChordEditor/ChordEditor';
import { QuickActionsFooter } from './components/QuickActionsFooter';
import { useArrangement } from './hooks/useArrangement';
import { KeySignature } from './types';
import { getNumberedSectionName } from './utils/sectionNames';

export default function App() {
  const {
    arrangement,
    error,
    isDragging,
    setIsDragging,
    handleXMLInput
  } = useArrangement('');

  const [showColors, setShowColors] = useState(true);
  const [keySignature, setKeySignature] = useState<KeySignature>({
    key: 'C',
    mode: 'major'
  });
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const [blockChords, setBlockChords] = useState<Record<number, string[]>>({});
  const [progressionMode, setProgressionMode] = useState<'repeat' | 'stretch'>('repeat');
  const [bpm, setBpm] = useState(120);
  const [isContinuousPlay, setIsContinuousPlay] = useState(false);

  // Add ref for the editor section
  const editorRef = useRef<HTMLDivElement>(null);

  const handleBlockFinished = () => {
    if (isContinuousPlay && selectedBlockIndex !== null && arrangement) {
      const nextBlockIndex = selectedBlockIndex + 1;
      if (nextBlockIndex < arrangement.Blocks.length) {
        setSelectedBlockIndex(nextBlockIndex);
      } else {
        setIsContinuousPlay(false);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleXMLInput(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const content = e.clipboardData.getData('text');
    if (content) {
      handleXMLInput(content);
    }
  };

  const handleChordChange = (blockIndex: number, barIndex: number, chord: string) => {
    setBlockChords(prev => {
      const currentChords = [...(prev[blockIndex] || [])];
      currentChords[barIndex] = chord;
      return {
        ...prev,
        [blockIndex]: currentChords
      };
    });
  };

  const handleChordsReorder = (blockIndex: number, newChords: string[]) => {
    setBlockChords(prev => ({
      ...prev,
      [blockIndex]: newChords
    }));
  };

  const handleBlockClick = (index: number) => {
    setSelectedBlockIndex(index);
    
    // Scroll to the editor section with a smooth animation
    if (editorRef.current) {
      const yOffset = -100; // Offset to account for the header and some padding
      const y = editorRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  const handleRandomProgression = () => {
    if (selectedBlockIndex === null) return;
    // Implementation for random progression
  };

  const handleClearBlockChords = () => {
    if (selectedBlockIndex === null) return;
    setBlockChords(prev => ({
      ...prev,
      [selectedBlockIndex]: []
    }));
  };

  return (
    <div className="min-h-screen bg-[#0B1B33] text-gray-100">
      <SiteHeader 
        keySignature={keySignature}
        onKeyChange={setKeySignature}
      />
      
      {/* Main content area with padding bottom for footer */}
      <div className="pb-[200px]">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <ArrangementDropZone
            arrangement={arrangement}
            error={error}
            isDragging={isDragging}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onPaste={handlePaste}
          >
            {arrangement && (
              <div className="relative">
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl p-4 sm:p-6 border border-gray-700">
                  <ArrangementVisualizer 
                    arrangement={arrangement} 
                    showColors={showColors}
                    selectedBlockIndex={selectedBlockIndex}
                    onBlockClick={handleBlockClick}
                  />
                </div>

                {/* Chord Editor Section */}
                {selectedBlockIndex !== null && (
                  <div ref={editorRef} className="mt-6">
                    <ChordEditor
                      arrangement={arrangement}
                      blockIndex={selectedBlockIndex}
                      chords={blockChords[selectedBlockIndex] || []}
                      onChordChange={(barIndex, chord) => handleChordChange(selectedBlockIndex, barIndex, chord)}
                      onChordsReorder={(newChords) => handleChordsReorder(selectedBlockIndex, newChords)}
                      genreTypeName={getNumberedSectionName(
                        arrangement.Blocks[selectedBlockIndex].Type,
                        selectedBlockIndex,
                        arrangement.Blocks,
                        arrangement.Genre
                      )}
                      isSelected={true}
                      keySignature={keySignature}
                    />
                  </div>
                )}
              </div>
            )}
          </ArrangementDropZone>
        </div>
      </div>

      {/* Footer */}
      {selectedBlockIndex !== null && arrangement && (
        <QuickActionsFooter
          onRandomProgression={handleRandomProgression}
          onClearChords={handleClearBlockChords}
          selectedBlockType={getNumberedSectionName(
            arrangement.Blocks[selectedBlockIndex].Type,
            selectedBlockIndex,
            arrangement.Blocks,
            arrangement.Genre
          )}
          selectedBlockLength={arrangement.Types[arrangement.Blocks[selectedBlockIndex].Type].Length}
          keySignature={keySignature}
          onKeyChange={setKeySignature}
          progressionMode={progressionMode}
          onProgressionModeChange={setProgressionMode}
          onProgressionSelect={(progression) => {
            if (selectedBlockIndex !== null) {
              const block = arrangement.Blocks[selectedBlockIndex];
              const numBars = arrangement.Types[block.Type].Length;
              let newChords: string[];
              
              if (progressionMode === 'repeat') {
                newChords = Array(numBars).fill(0).map((_, i) => progression.chords[i % progression.chords.length]);
              } else {
                newChords = Array(numBars).fill(0).map((_, i) => {
                  const progressionIndex = Math.floor((i / numBars) * progression.chords.length);
                  return progression.chords[progressionIndex];
                });
              }
              
              setBlockChords(prev => ({
                ...prev,
                [selectedBlockIndex]: newChords
              }));
            }
          }}
          showColors={showColors}
          onShowColorsChange={setShowColors}
          chords={blockChords[selectedBlockIndex] || []}
          bpm={bpm}
          arrangement={arrangement}
          isContinuousPlay={isContinuousPlay}
          setIsContinuousPlay={setIsContinuousPlay}
          onBlockFinished={handleBlockFinished}
        />
      )}
    </div>
  );
}