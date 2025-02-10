import { REVERSE_BLOCK_TYPE_MAP, GENRE_TYPE_MAPPINGS } from '../types';

export function getNumberedSectionName(type: string, index: number, blocks: Array<{ Type: string }>, genre: string) {
  // Get the genre mapping, defaulting to Pop_Rock_Disco if not found
  const genreMapping = GENRE_TYPE_MAPPINGS[genre] || GENRE_TYPE_MAPPINGS['Pop_Rock_Disco'];
  
  // Get the display name from the genre mapping
  const displayName = genreMapping[type] || REVERSE_BLOCK_TYPE_MAP[type as keyof typeof REVERSE_BLOCK_TYPE_MAP] || type;
  
  // Count total occurrences of this type
  const totalOccurrences = blocks.filter(block => block.Type === type).length;
  
  // If there's more than one occurrence of this type, add numbers to all instances
  if (totalOccurrences > 1) {
    // Count how many blocks of this type appear up to this one (including this one)
    const typeCount = blocks
      .slice(0, index + 1)
      .filter(block => block.Type === type)
      .length;
    
    return `${displayName} ${typeCount}`;
  }
  
  return displayName;
}