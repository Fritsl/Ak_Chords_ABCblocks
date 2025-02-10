import React from 'react';
import { Arrangement, BUILDING_HEIGHTS, BUILDING_COLORS } from '../types';
import { MousePointer } from 'lucide-react';
import { getNumberedSectionName } from '../utils/sectionNames';

interface Props {
  arrangement: Arrangement;
  showColors: boolean;
  selectedBlockIndex: number | null;
  onBlockClick: (index: number) => void;
}

export function ArrangementVisualizer({ 
  arrangement, 
  showColors,
  selectedBlockIndex,
  onBlockClick 
}: Props) {
  const maxHeight = 8;
  const gapSize = 2;
  
  const getDisplayName = (type: string, index: number) => {
    return getNumberedSectionName(type, index, arrangement.Blocks, arrangement.Genre);
  };
  
  const totalBars = arrangement.Blocks.reduce((acc, block) => {
    return acc + (arrangement.Types[block.Type]?.Length || 0);
  }, 0);

  const buildingData = arrangement.Blocks.reduce((acc, block, index) => {
    const previousPosition = index === 0 ? 0 : acc[index - 1].endPosition;
    const width = arrangement.Types[block.Type]?.Length || 0;
    const widthPrecise = parseFloat((width / totalBars * 100).toFixed(6));
    const startPosition = previousPosition;
    const endPosition = parseFloat((startPosition + widthPrecise).toFixed(6));
    
    acc[index] = {
      width: widthPrecise,
      startPosition,
      endPosition,
      barPosition: acc.reduce((sum, curr) => sum + (curr?.width || 0) * totalBars / 100, 0)
    };
    
    return acc;
  }, [] as Array<{
    width: number;
    startPosition: number;
    endPosition: number;
    barPosition: number;
  }>);

  // Show help tooltip on first load
  const [showHelp, setShowHelp] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setShowHelp(false), 5000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      className="w-full overflow-hidden rounded-lg p-4 relative"
      style={{
        background: 'linear-gradient(180deg, rgb(14, 42, 71) 0%, rgb(41, 128, 185) 55%, rgb(223, 237, 245) 100%)'
      }}
    >
      <div className="mb-2 flex justify-between items-center text-white">
        <div>
          <h2 className="text-lg font-bold text-shadow">{arrangement.Name || 'Untitled Arrangement'}</h2>
          <p className="text-xs opacity-75 text-shadow">Genre: {arrangement.Genre.replace(/_/g, '/')}</p>
        </div>
      </div>
      
      {/* Help tooltip */}
      {showHelp && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white px-4 py-2 rounded-lg shadow-xl border border-gray-700 z-10 whitespace-nowrap animate-bounce">
          <div className="flex items-center gap-2">
            <MousePointer className="w-4 h-4" />
            <span className="text-sm">Click any block to edit its chords</span>
          </div>
        </div>
      )}
      
      <div className="relative h-[160px] w-full mx-auto">
        <div className="flex h-[120px]">
          {arrangement.Blocks.map((building, index) => {
            const heightValue = BUILDING_HEIGHTS[building.Type];
            const colorClass = showColors 
              ? BUILDING_COLORS[building.Type]
              : 'bg-white';
            const buildingInfo = buildingData[index];
            const displayName = getDisplayName(building.Type, index);
            const isSelected = selectedBlockIndex === index;
            
            if (typeof heightValue === 'object' && heightValue.start !== undefined) {
              const startHeight = heightValue.start;
              const endHeight = heightValue.end;
              const startHeightPercentage = (startHeight / maxHeight) * 100;
              const endHeightPercentage = (endHeight / maxHeight) * 100;
              
              return (
                <div
                  key={index}
                  className="relative group"
                  style={{ 
                    width: `calc(${buildingInfo.width}% - ${gapSize}px)`,
                    marginRight: `${gapSize}px`
                  }}
                >
                  <button
                    onClick={() => onBlockClick(index)}
                    className={`absolute bottom-[28px] w-full transition-all duration-200 cursor-pointer
                      hover:ring-2 hover:ring-indigo-500/50 hover:scale-[1.02]
                      ${isSelected ? 'ring-4 ring-[#FFEE00] ring-offset-2 ring-offset-transparent scale-[1.02] z-10' : ''}
                    `}
                    style={{ 
                      clipPath: `polygon(
                        0% ${100 - startHeightPercentage}%, 
                        0% 100%, 
                        100% 100%, 
                        100% ${100 - endHeightPercentage}%
                      )`,
                      height: 'calc(100% - 28px)',
                      filter: isSelected ? 'brightness(1.1)' : 'none'
                    }}
                    title="Click to edit chords"
                  >
                    <div className={`w-full h-full ${colorClass} ring-1 ring-black/25`} />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-white text-[10px] sm:text-xs whitespace-nowrap text-shadow">
                      {Math.round(buildingInfo.barPosition)}
                    </div>
                  </button>
                  <div className={`absolute bottom-0 left-0 right-0 h-7 bg-[#e67e22] bg-opacity-90 text-white text-[10px] sm:text-xs px-0.5 rounded-sm
                    group-hover:ring-2 group-hover:ring-indigo-500/50
                    ${isSelected ? 'ring-2 ring-[#FFEE00]' : ''}
                  `}>
                    <div className="font-medium leading-tight truncate" title={displayName}>
                      {displayName}
                    </div>
                    <div className="text-[8px] sm:text-[10px] leading-tight truncate text-center">
                      {arrangement.Types[building.Type]?.Length}
                    </div>
                  </div>

                  {/* Hover tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-gray-900/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      Click to edit chords
                    </div>
                  </div>
                </div>
              );
            }
            
            const height = typeof heightValue === 'number' ? heightValue : 0.25;
            const heightPercentage = (height / maxHeight) * 100;
            
            return (
              <div
                key={index}
                className="relative group"
                style={{ 
                  width: `calc(${buildingInfo.width}% - ${gapSize}px)`,
                  marginRight: `${gapSize}px`
                }}
              >
                <button
                  onClick={() => onBlockClick(index)}
                  className={`absolute bottom-[28px] w-full transition-all duration-200 cursor-pointer
                    hover:ring-2 hover:ring-indigo-500/50 hover:scale-[1.02]
                    ${isSelected ? 'ring-4 ring-[#FFEE00] ring-offset-2 ring-offset-transparent scale-[1.02] z-10' : ''}
                  `}
                  style={{ 
                    clipPath: `polygon(
                      0% ${100 - heightPercentage}%, 
                      0% 100%, 
                      100% 100%, 
                      100% ${100 - heightPercentage}%
                    )`,
                    height: 'calc(100% - 28px)',
                    filter: isSelected ? 'brightness(1.1)' : 'none'
                  }}
                  title="Click to edit chords"
                >
                  <div className={`w-full h-full ${colorClass} ring-1 ring-black/25`} />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-white text-[10px] sm:text-xs whitespace-nowrap text-shadow">
                    {Math.round(buildingInfo.barPosition)}
                  </div>
                </button>
                <div className={`absolute bottom-0 left-0 right-0 h-7 bg-[#e67e22] bg-opacity-90 text-white text-[10px] sm:text-xs px-0.5 rounded-sm
                  group-hover:ring-2 group-hover:ring-indigo-500/50
                  ${isSelected ? 'ring-2 ring-[#FFEE00]' : ''}
                `}>
                  <div className="font-medium leading-tight truncate" title={displayName}>
                    {displayName}
                  </div>
                  <div className="text-[8px] sm:text-[10px] leading-tight truncate text-center">
                    {arrangement.Types[building.Type]?.Length}
                  </div>
                </div>

                  {/* Hover tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-gray-900/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      Click to edit chords
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
}