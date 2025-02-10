import React from 'react';
import { Download } from 'lucide-react';
import { KeySelector } from './KeySelector';
import { BPMControl } from './BPMControl';
import { KeySignature } from '../types';

interface SiteHeaderProps {
  keySignature: KeySignature;
  onKeyChange: (key: KeySignature) => void;
}

export function SiteHeader({ keySignature, onKeyChange }: SiteHeaderProps) {
  return (
    <header className="border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <a href="https://arrangerking.com" target="_blank" rel="noopener noreferrer">
            <img 
              src="https://arrangerking.com/assets/img/ArrangerKingLogo.png" 
              alt="ArrangerKing" 
              className="h-8 w-auto"
            />
          </a>
          <BPMControl defaultBPM={120} />
        </div>

        <div className="flex items-center gap-6">
          <KeySelector value={keySignature} onChange={onKeyChange} />
          <a
            href="https://arrangerking.com/#download"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
          >
            <Download className="w-4 h-4" />
            <span>Download ArrangerKing</span>
          </a>
        </div>
      </div>
    </header>
  );
}