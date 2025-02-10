import React from 'react';
import { Music, Wand2 } from 'lucide-react';
import { Arrangement } from '../types';

const GENERIC_ARRANGEMENT = `<?xml version="1.0" encoding="UTF-8"?>
<Arrangement Version="123" Genre="Pop_Rock_Disco" Name="Generic Arrangement" UserName="">
  <Blocks>
    <Block Type="Intro"/>
    <Block Type="Verse"/>
    <Block Type="Verse"/>
    <Block Type="Bridge"/>
    <Block Type="Pre_Chorus"/>
    <Block Type="Chorus"/>
    <Block Type="Verse"/>
    <Block Type="Pre_Chorus"/>
    <Block Type="Chorus"/>
    <Block Type="Solo_Break"/>
    <Block Type="Air"/>
    <Block Type="Chorus"/>
    <Block Type="Chorus"/>
    <Block Type="Outro_Fade_Out"/>
  </Blocks>
  <Types>
    <Verse Length="8"/>
    <Chorus Length="8"/>
    <Solo_Break Length="16"/>
    <Bridge Length="8"/>
    <Pre_Chorus Length="4"/>
    <Intro Length="8"/>
    <Outro_Fade_Out Length="8"/>
    <Air Length="1"/>
  </Types>
</Arrangement>`;

const EIGHT_BLOCKS_ARRANGEMENT = `<?xml version="1.0" encoding="UTF-8"?>
<Arrangement Version="123" Genre="Pop_Rock_Disco" Name="8 Blocks" UserName="">
  <Blocks>
    <Block Type="Verse"/>
    <Block Type="Chorus"/>
    <Block Type="Solo_Break"/>
    <Block Type="Bridge"/>
    <Block Type="Pre_Chorus"/>
    <Block Type="Intro"/>
    <Block Type="Outro_Fade_Out"/>
    <Block Type="Air"/>
  </Blocks>
  <Types>
    <Verse Length="8"/>
    <Chorus Length="8"/>
    <Solo_Break Length="8"/>
    <Bridge Length="8"/>
    <Pre_Chorus Length="8"/>
    <Intro Length="8"/>
    <Outro_Fade_Out Length="8"/>
    <Air Length="8"/>
  </Types>
</Arrangement>`;

interface ArrangementDropZoneProps {
  arrangement: Arrangement | null;
  error: string | null;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  onQuickStart?: () => void;
  children: React.ReactNode;
}

export function ArrangementDropZone({
  arrangement,
  error,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onPaste,
  onQuickStart,
  children
}: ArrangementDropZoneProps) {
  return (
    <div 
      className={`
        bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl p-6 mb-8 relative min-h-[300px] transition-all duration-200
        border border-gray-700
        ${isDragging ? 'ring-2 ring-indigo-500 bg-indigo-900/30' : ''}
        ${!arrangement && !error ? 'flex items-center justify-center' : ''}
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onPaste={onPaste}
    >
      {!arrangement && !error && (
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <Music className="w-24 h-24 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-100 mb-4">
            Welcome to ArrangerKing Chord Creator
          </h3>
          <div className="inline-block bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <ol className="list-decimal list-inside space-y-2 text-left text-gray-300">
              <li>Open ArrangerKing in your DAW</li>
              <li>Click the ArrangerKing Logo, Select "XML Copy"</li>
              <li>Come back here and press Ctrl + V (Windows) or Cmd+V (OsX)</li>
            </ol>
          </div>
          
          {/* Sample arrangement buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => onPaste({ clipboardData: { getData: () => GENERIC_ARRANGEMENT } } as any)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              Use Generic Arrangement
            </button>
            <button
              onClick={() => onPaste({ clipboardData: { getData: () => EIGHT_BLOCKS_ARRANGEMENT } } as any)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              Use 8 Blocks
            </button>
          </div>
        </div>
      )}
      {children}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 backdrop-blur-sm rounded-lg">
          <div className="p-6 bg-gray-900/50 text-gray-300 rounded-lg max-w-md border border-gray-700">
            <div className="flex justify-center mb-8">
              <Music className="w-20 h-20 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4 text-center">
              Let's Get Started
            </h3>
            <ol className="list-decimal list-inside space-y-3">
              <li>Open ArrangerKing in your DAW</li>
              <li>Click the ArrangerKing Logo, Select "XML Copy"</li>
              <li>Come back here and press Ctrl + V (Windows) or Cmd+V (OsX)</li>
            </ol>
            
            {/* Sample arrangement buttons */}
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => onPaste({ clipboardData: { getData: () => GENERIC_ARRANGEMENT } } as any)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                Use Generic Arrangement
              </button>
              <button
                onClick={() => onPaste({ clipboardData: { getData: () => EIGHT_BLOCKS_ARRANGEMENT } } as any)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                Use 8 Blocks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}