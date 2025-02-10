
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
    fontSize: 'text-sm',
    ringSize: 160
  } : {
    container: 300,
    radius: 120,
    keySize: 48,
    centerSize: 80,
    fontSize: 'text-lg',
    ringSize: 240
  };

  const getRelativeKey = (key: string): string => {
    const majorToMinor: Record<string, string> = {
      'C': 'A', 'G': 'E', 'D': 'B', 'A': 'F♯',
      'E': 'C♯', 'B': 'G♯', 'F♯': 'D♯',
      'F': 'D', 'B♭': 'G', 'E♭': 'C',
      'A♭': 'F', 'D♭': 'B♭', 'G♭': 'E♭'
    };
    return selectedKey.mode === 'major' ? majorToMinor[key] || key : key;
  };

  const getKeySignature = (key: string): string => {
    const signatures: Record<string, string> = {
      'C': '0', 'G': '1♯', 'D': '2♯', 'A': '3♯',
      'E': '4♯', 'B': '5♯', 'F♯': '6♯',
      'F': '1♭', 'B♭': '2♭', 'E♭': '3♭',
      'A♭': '4♭', 'D♭': '5♭', 'G♭': '6♭'
    };
    return signatures[key] || '0';
  };

  return (
    <div className="relative" style={{ width: dimensions.container, height: dimensions.container }}>
      {/* Decorative rings */}
      <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-pulse" 
           style={{ width: dimensions.ringSize, height: dimensions.ringSize, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
      <div className="absolute inset-0 rounded-full border border-indigo-400/20" 
           style={{ width: dimensions.ringSize - 20, height: dimensions.ringSize - 20, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
      
      {keys.map((key, index) => {
        const angle = (index * (360 / keys.length)) - 90;
        const isSelected = key === selectedKey.key;
        const x = Math.cos((angle * Math.PI) / 180) * dimensions.radius + dimensions.container / 2;
        const y = Math.sin((angle * Math.PI) / 180) * dimensions.radius + dimensions.container / 2;

        return (
          <div
            key={key}
            className={`absolute flex flex-col items-center transition-all duration-300 ease-in-out
              ${isSelected ? 'scale-110 z-10' : 'hover:scale-105'}`}
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
                transition-all duration-300 shadow-lg
                hover:ring-2 hover:ring-indigo-500/50
                ${isSelected 
                  ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white' 
                  : 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-200 hover:from-gray-600 hover:to-gray-700'
                }
              `}
              style={{
                width: `${dimensions.keySize}px`,
                height: `${dimensions.keySize}px`,
              }}
            >
              <span className={`${dimensions.fontSize} font-medium`}>{key}</span>
              <span className="text-[10px] opacity-75">{getKeySignature(key)}</span>
            </button>
            {isSelected && (
              <div className="mt-1 text-[10px] text-gray-400 bg-gray-800/80 px-2 py-0.5 rounded-full backdrop-blur-sm">
                {selectedKey.mode === 'major' ? 'Relative minor:' : 'Relative major:'} {getRelativeKey(key)}
              </div>
            )}
          </div>
        );
      })}
      
      <button
        onClick={() => onKeyChange({ ...selectedKey, mode: selectedKey.mode === 'major' ? 'minor' : 'major' })}
        className={`
          absolute inset-0 m-auto rounded-full 
          flex flex-col items-center justify-center
          transition-all duration-300 cursor-pointer
          hover:ring-2 hover:ring-indigo-500/50 shadow-xl
          ${selectedKey.mode === 'major' 
            ? 'bg-gradient-to-br from-indigo-500 to-indigo-600' 
            : 'bg-gradient-to-br from-purple-500 to-purple-600'}
          text-white font-medium
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
