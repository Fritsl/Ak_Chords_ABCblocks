import React from 'react';
import { KeySignature } from '../types';

interface CircleOfFifthsProps {
  selectedKey: KeySignature;
  onKeyChange: (key: KeySignature) => void;
  size?: 'normal' | 'small';
}

export function CircleOfFifths({ selectedKey, onKeyChange, size = 'normal' }: CircleOfFifthsProps) {
  const keys = [
    'C', 'G', 'D', 'A', 'E', 'B', 'F♯',
    'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭'
  ];

  const dimensions = size === 'small' ? {
    container: 200,
    radius: 80,
    keySize: 32,
    centerSize: 48,
    fontSize: 'text-sm'
  } : {
    container: 300,
    radius: 120,
    keySize: 48,
    centerSize: 80,
    fontSize: 'text-lg'
  };

  // Get relative minor/major key
  const getRelativeKey = (key: string): string => {
    const majorToMinor: Record<string, string> = {
      'C': 'A',
      'G': 'E',
      'D': 'B',
      'A': 'F♯',
      'E': 'C♯',
      'B': 'G♯',
      'F♯': 'D♯',
      'F': 'D',
      'B♭': 'G',
      'E♭': 'C',
      'A♭': 'F',
      'D♭': 'B♭',
      'G♭': 'E♭'
    };
    return selectedKey.mode === 'major' ? majorToMinor[key] || key : key;
  };

  // Get number of sharps/flats for a key
  const getKeySignature = (key: string): string => {
    const signatures: Record<string, string> = {
      'C': '0',
      'G': '1♯',
      'D': '2♯',
      'A': '3♯',
      'E': '4♯',
      'B': '5♯',
      'F♯': '6♯',
      'F': '1♭',
      'B♭': '2♭',
      'E♭': '3♭',
      'A♭': '4♭',
      'D♭': '5♭',
      'G♭': '6♭'
    };
    return signatures[key] || '0';
  };

  return (
    <div className="relative" style={{ width: dimensions.container, height: dimensions.container }}>
      <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30" />
      {keys.map((key, index) => {
        const angle = (index * (360 / keys.length)) - 90;
        const isSelected = key === selectedKey.key;
        const x = Math.cos((angle * Math.PI) / 180) * dimensions.radius + dimensions.container / 2;
        const y = Math.sin((angle * Math.PI) / 180) * dimensions.radius + dimensions.container / 2;

        return (
          <div
            key={key}
            className={`
              absolute flex flex-col items-center transition-all duration-200
              ${isSelected ? 'scale-110' : ''}
            `}
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <button
              onClick={() => onKeyChange({ ...selectedKey, key })}
              className={`
                flex flex-col items-center justify-center rounded-full
                transition-all duration-200 cursor-pointer
                hover:ring-2 hover:ring-indigo-500/50
                ${isSelected 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }
              `}
              style={{
                width: `${dimensions.keySize}px`,
                height: `${dimensions.keySize}px`,
              }}
            >
              <span className={dimensions.fontSize}>{key}</span>
              <span className="text-[10px] opacity-75">{getKeySignature(key)}</span>
            </button>
            {isSelected && (
              <div className="mt-1 text-[10px] text-gray-400">
                {selectedKey.mode === 'major' ? 'Relative minor:' : 'Relative major:'} {getRelativeKey(key)}
              </div>
            )}
          </div>
        );
      })}
      <button
        onClick={() => onKeyChange({ ...selectedKey, mode: selectedKey.mode === 'major' ? 'minor' : 'major' })}
        className={`
          absolute inset-0 m-auto rounded-full flex flex-col items-center justify-center
          transition-all duration-200 cursor-pointer
          hover:ring-2 hover:ring-indigo-500/50
          ${selectedKey.mode === 'major' ? 'bg-indigo-600' : 'bg-purple-600'}
          text-white font-medium shadow-lg
        `}
        style={{
          width: `${dimensions.centerSize}px`,
          height: `${dimensions.centerSize}px`
        }}
      >
        <span className={dimensions.fontSize}>
          {selectedKey.key}
          <span className="text-sm ml-0.5">{selectedKey.mode === 'minor' ? 'm' : ''}</span>
        </span>
        <span className="text-xs opacity-75">{getKeySignature(selectedKey.key)}</span>
      </button>
    </div>
  );
}