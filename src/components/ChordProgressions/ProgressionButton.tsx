import React from 'react';
import { Wand2 } from 'lucide-react';
import { ChordProgression } from '../../types';

interface ProgressionButtonProps {
  progression: ChordProgression;
  onClick: () => void;
}

export function ProgressionButton({ progression, onClick }: ProgressionButtonProps) {
  return (
    <button
      onClick={onClick}
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
  );
}