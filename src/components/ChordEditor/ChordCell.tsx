import React, { forwardRef } from 'react';
import { Wand2, RefreshCw, Play, GripVertical } from 'lucide-react';
import { KeySignature } from '../../types';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

interface ChordCellProps {
  id: string;
  barIndex: number;
  chord: string;
  isActive: boolean;
  onClick: () => void;
  onSuggest: () => void;
  onCycleQuality: () => void;
  functionColor: string;
  keySignature: KeySignature;
  onPlay: (chord: string) => void;
  currentStep: number;
  controls: {
    showExtensions: boolean;
    showAlterations: boolean;
    showInversions: boolean;
  };
}

interface ChordCellProps {
  id: string;
  barIndex: number;
  chord: string;
  isActive: boolean;
  onClick: () => void;
  onSuggest: () => void;
  onCycleQuality: () => void;
  functionColor: string;
  keySignature: KeySignature;
  onPlay: (chord: string) => void;
  currentStep: number;
  controls: {
    showExtensions: boolean;
    showAlterations: boolean;
    showInversions: boolean;
  };
}

const formatChord = (chord: string, controls: any) => {
  const baseChord = chord.replace(/[^IiVv]+$/, '');
  let result = baseChord;

  // Extract the full quality/extension part
  const qualityPart = chord.slice(baseChord.length);

  if (controls.showExtensions) {
    if (qualityPart.includes('maj')) result += 'maj';
    if (qualityPart.includes('m')) result += 'm';
    if (qualityPart.includes('dim')) result += 'dim';
    if (qualityPart.includes('aug')) result += 'aug';
  }

  if (controls.showAlterations) {
    if (qualityPart.includes('7')) result += '7';
    if (qualityPart.includes('9')) result += '9';
    if (qualityPart.includes('11')) result += '11';
    if (qualityPart.includes('13')) result += '13';
    if (qualityPart.includes('#5')) result += '#5';
    if (qualityPart.includes('b5')) result += 'b5';
  }

  if (controls.showInversions) {
    if (qualityPart.includes('/3')) result += '/3';
    if (qualityPart.includes('/5')) result += '/5';
    if (qualityPart.includes('/7')) result += '/7';
  }

  return result;
};

export const ChordCell = forwardRef<HTMLDivElement, ChordCellProps>(({
  id,
  barIndex,
  chord,
  isActive,
  onClick,
  onSuggest,
  onCycleQuality,
  functionColor,
  keySignature,
  onPlay,
  currentStep,
  controls,
  chord,
  isActive,
  onClick,
  onSuggest,
  onCycleQuality,
  functionColor,
  keySignature,
  onPlay,
  currentStep,
  controls
}, ref) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      <div className="relative">
        <button
          onClick={onClick}
          className={`
            relative w-full aspect-square bg-gray-700 hover:bg-gray-600 rounded-lg 
            border border-gray-600 focus:outline-none transition-all
            ${chord ? 'border-indigo-500/50' : ''}
            ${isActive ? 'ring-2 ring-indigo-500' : ''}
            ${currentStep === barIndex ? 'border-b-2 border-b-red-500' : ''}
          `}
        >
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="absolute -top-2 -left-2 p-1.5 bg-gray-600 hover:bg-gray-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          {/* Bar number */}
          <div className="absolute top-1 left-1 text-[10px] text-gray-500">
            {barIndex + 1}
          </div>

          {/* Chord display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-medium ${chord ? functionColor : 'text-gray-400'}`}>
              {chord ? formatChord(chord, controls) : '-'}
            </span>
          </div>
        </button>

        {/* Quick action buttons */}
        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {chord && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(chord);
              }}
              className="bg-green-500 hover:bg-green-400 rounded-full p-1.5"
              title="Play chord"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSuggest();
            }}
            className="bg-indigo-500 hover:bg-indigo-400 rounded-full p-1.5"
            title="Suggest chord"
          >
            <Wand2 className="w-3.5 h-3.5" />
          </button>
          {chord && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCycleQuality();
              }}
              className="bg-purple-500 hover:bg-purple-400 rounded-full p-1.5"
              title="Cycle chord quality"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

ChordCell.displayName = 'ChordCell';