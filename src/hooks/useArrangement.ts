import { useState, useCallback, useEffect } from 'react';
import { parseArrangementXML } from '../utils/xmlParser';
import { Arrangement, VALID_GENRES, VALID_LENGTHS, REQUIRED_TYPES } from '../types';

const STORAGE_KEY = 'currentGenre';

export function useArrangement(initialXml: string) {
  const [xmlInput, setXmlInput] = useState(initialXml);
  const [arrangement, setArrangement] = useState<Arrangement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateArrangement = (arr: Arrangement) => {
    if (arr.Blocks.length > 32) {
      throw new Error('Instructions');
    }

    // Replace dots with underscores in genre
    arr.Genre = arr.Genre.replace(/\./g, '_');

    if (!VALID_GENRES.includes(arr.Genre as any)) {
      throw new Error('Instructions');
    }

    const typeNames = Object.keys(arr.Types);
    if (typeNames.length !== REQUIRED_TYPES.length) {
      throw new Error('Instructions');
    }

    // Replace dots with underscores in type names
    arr.Types = Object.fromEntries(
      Object.entries(arr.Types).map(([key, value]) => [
        key.replace(/\./g, '_'),
        value
      ])
    );

    // Replace dots with underscores in block types
    arr.Blocks = arr.Blocks.map(block => ({
      ...block,
      Type: block.Type.replace(/\./g, '_')
    }));

    for (const type of typeNames) {
      const normalizedType = type.replace(/\./g, '_');
      if (!REQUIRED_TYPES.includes(normalizedType as any)) {
        throw new Error('Instructions');
      }
      
      const length = arr.Types[type].Length;
      if (!VALID_LENGTHS.includes(length as any)) {
        throw new Error('Instructions');
      }
    }
  };

  const handleXMLInput = useCallback((content: string) => {
    if (!content.trim()) {
      setXmlInput('');
      setArrangement(null);
      setError(null);
      return;
    }

    try {
      const parsed = parseArrangementXML(content);
      validateArrangement(parsed);
      setXmlInput(content);
      setArrangement(parsed);
      setError(null);
      
      const formattedGenre = parsed.Genre.replace(/\./g, '_');
      localStorage.setItem(STORAGE_KEY, formattedGenre);
    } catch (err) {
      setError('Instructions');
      setArrangement(null);
    }
  }, []);

  useEffect(() => {
    if (!xmlInput.trim()) {
      setArrangement(null);
      setError(null);
      return;
    }

    try {
      const parsed = parseArrangementXML(xmlInput);
      validateArrangement(parsed);
      setArrangement(parsed);
      setError(null);
      
      const formattedGenre = parsed.Genre.replace(/\./g, '_');
      localStorage.setItem(STORAGE_KEY, formattedGenre);
    } catch (err) {
      setError('Instructions');
      setArrangement(null);
    }
  }, [xmlInput]);

  return {
    xmlInput,
    arrangement,
    error,
    isDragging,
    setIsDragging,
    handleXMLInput
  };
}