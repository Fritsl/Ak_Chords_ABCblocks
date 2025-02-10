import React, { useState } from 'react';
import { CircleOfFifths } from './CircleOfFifths';
import { MUSICAL_KEYS, KeySignature, KeyMode } from '../types';
import { CircleIcon } from 'lucide-react';

interface KeySelectorProps {
  value: KeySignature;
  onChange: (newKey: KeySignature) => void;
}

export function KeySelector({ value, onChange }: KeySelectorProps) {
  const [showCircle, setShowCircle] = useState(false);

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="key" className="text-sm font-medium text-gray-300 whitespace-nowrap">
            Key:
          </label>
          <select
            id="key"
            value={value.key}
            onChange={(e) => onChange({ ...value, key: e.target.value as any })}
            className="w-24 rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {MUSICAL_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="mode" className="text-sm font-medium text-gray-300 whitespace-nowrap">
            Mode:
          </label>
          <select
            id="mode"
            value={value.mode}
            onChange={(e) => onChange({ ...value, mode: e.target.value as KeyMode })}
            className="w-24 rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="major">Major</option>
            <option value="minor">Minor</option>
          </select>
        </div>

        <button
          onClick={() => setShowCircle(true)}
          className="p-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group relative"
          title="Show Circle of Fifths"
        >
          <CircleIcon className="w-5 h-5" />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
            Show Circle of Fifths
          </span>
        </button>
      </div>

      {/* Circle of Fifths Full Page */}
      {showCircle && (
        <div className="fixed inset-0 bg-[#0B1B33] z-[999999] flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white">Circle of Fifths</h1>
                <p className="text-gray-400">Click on a key to select it</p>
              </div>
              <button
                onClick={() => setShowCircle(false)}
                className="p-3 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                title="Back to main page"
              >
                ✕
              </button>
            </div>
            <CircleOfFifths
              selectedKey={value}
              onKeyChange={(newKey) => {
                onChange(newKey);
                setShowCircle(false);
              }}
              size="normal"
            />
          </div>
        </div>
      )}
    </div>
  );
}