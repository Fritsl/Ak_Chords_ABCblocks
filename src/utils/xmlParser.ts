import { BLOCK_TYPE_MAP } from '../types';

export function parseArrangementXML(xmlString: string) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  const arrangementElement = xmlDoc.querySelector('Arrangement');
  if (!arrangementElement) throw new Error('Invalid XML: No Arrangement element found');

  const arrangement = {
    Version: arrangementElement.getAttribute('Version') || '',
    Genre: (arrangementElement.getAttribute('Genre') || '').replace(/\./g, '_'),
    Name: arrangementElement.getAttribute('Name') || '',
    UserName: arrangementElement.getAttribute('UserName') || '',
    Blocks: [] as { Type: string }[],
    Types: {} as Record<string, { Length: number }>
  };

  // Helper function to normalize type names
  const normalizeType = (type: string): string => {
    return type.replace(/\./g, '_').replace(/\s+\d+$/, '');
  };

  // Parse blocks and convert to internal reference system
  const blockElements = xmlDoc.querySelectorAll('Blocks > Block');
  blockElements.forEach(block => {
    const rawType = block.getAttribute('Type') || '';
    const normalizedType = normalizeType(rawType);
    
    // Convert to internal reference
    const internalType = BLOCK_TYPE_MAP[normalizedType as keyof typeof BLOCK_TYPE_MAP];
    
    if (!internalType) {
      console.error('Unknown block type:', rawType, 'normalized to:', normalizedType);
      return;
    }

    arrangement.Blocks.push({
      Type: internalType
    });
  });

  // Parse types and convert to internal reference system
  const typeElements = xmlDoc.querySelectorAll('Types > *');
  typeElements.forEach(type => {
    const length = parseInt(type.getAttribute('Length') || '0', 10);
    const normalizedType = normalizeType(type.tagName);
    
    // Convert to internal reference
    const internalType = BLOCK_TYPE_MAP[normalizedType as keyof typeof BLOCK_TYPE_MAP];
    
    if (!internalType) {
      console.error('Unknown type:', type.tagName, 'normalized to:', normalizedType);
      return;
    }

    arrangement.Types[internalType] = { Length: length };
  });

  // Ensure all required types exist with default values
  Object.values(BLOCK_TYPE_MAP).forEach(type => {
    if (!arrangement.Types[type]) {
      arrangement.Types[type] = { Length: 8 };
    }
  });

  return arrangement;
}