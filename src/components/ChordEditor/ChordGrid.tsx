
import React from 'react';
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
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { ChordCell } from './ChordCell';
import { KeySignature } from '../../types';
import { getFunctionColor } from '../../utils/chordUtils';

interface ChordGridProps {
  numBars: number;
  chords: string[];
  activeBarIndex: number | null;
  currentStep: number;
  onChordChange: (barIndex: number, chord: string) => void;
  onChordsReorder: (newChords: string[]) => void;
  onBarClick: (index: number) => void;
  keySignature: KeySignature;
  playChord: (chord: string, keySignature: KeySignature) => void;
  controls: {
    showExtensions: boolean;
    showAlterations: boolean;
    showInversions: boolean;
  };
}

export function ChordGrid({ 
  numBars, 
  chords, 
  activeBarIndex,
  currentStep,
  onChordChange,
  onChordsReorder,
  onBarClick,
  keySignature,
  playChord,
  controls 
}: ChordGridProps) {
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
      const newChords = [...chords];
      const [movedChord] = newChords.splice(oldIndex, 1);
      newChords.splice(newIndex, 0, movedChord);
      onChordsReorder(newChords);
    }
  };

  return (
    <div className="grid grid-cols-8 gap-2">
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
              onClick={() => onBarClick(barIndex)}
              functionColor={getFunctionColor(chords[barIndex])}
              keySignature={keySignature}
              onPlay={playChord}
              currentStep={currentStep}
              controls={controls}
              onSuggest={() => {}}
              onCycleQuality={() => {}}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
