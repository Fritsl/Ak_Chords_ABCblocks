import React from 'react';
import { Volume2, Music, Wand2, Clock } from 'lucide-react';
import { SynthControls as SynthControlsType } from '../hooks/useSynth';
import { SYNTH_PRESETS } from '../constants/synth';

interface SynthControlsProps {
  controls: SynthControlsType;
  onChange: (controls: SynthControlsType) => void;
}

export function SynthControls({ controls, onChange }: SynthControlsProps) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-300">Sound Settings</h3>
        <button
          onClick={() => onChange({ ...controls, showModal: false })}
          className="p-1.5 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {/* Preset Selection */}
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(SYNTH_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => onChange({ ...controls, preset: key as keyof typeof SYNTH_PRESETS })}
              className={`
                p-3 rounded-lg border text-left transition-colors
                ${controls.preset === key
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                <span className="text-sm font-medium">{preset.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Volume Control */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <Volume2 className="w-4 h-4" />
            <span>Volume</span>
          </label>
          <input
            type="range"
            min="-60"
            max="0"
            value={controls.volume}
            onChange={(e) => onChange({ ...controls, volume: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Reverb Control */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <Music className="w-4 h-4" />
            <span>Reverb</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={controls.reverb}
            onChange={(e) => onChange({ ...controls, reverb: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Attack/Release Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Attack</span>
            </label>
            <input
              type="range"
              min="0.001"
              max="1"
              step="0.001"
              value={controls.attack}
              onChange={(e) => onChange({ ...controls, attack: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Release</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="4"
              step="0.1"
              value={controls.release}
              onChange={(e) => onChange({ ...controls, release: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}