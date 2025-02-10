import { useState, useEffect } from 'react';
import { ChordProgression, BLOCK_TYPE_MAP, REVERSE_BLOCK_TYPE_MAP } from '../types';
import progressionsData from '../data/chordprogressions_genre_data.json';

export function useChordProgressions(genre: string, blockType: string) {
  const [progressions, setProgressions] = useState<ChordProgression[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!genre || !blockType) {
      setProgressions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Convert internal reference (A, B, C, etc) back to original type name
      const originalType = REVERSE_BLOCK_TYPE_MAP[blockType as keyof typeof REVERSE_BLOCK_TYPE_MAP];
      
      if (!originalType) {
        console.error('Unknown block type:', blockType);
        setProgressions([]);
        setError('Unknown block type');
        return;
      }

      // Find all matching progressions for this block type
      const allProgressions: ChordProgression[] = [];
      
      // Iterate through all main categories
      Object.entries(progressionsData).forEach(([category, styles]) => {
        // For each style in the category
        Object.entries(styles).forEach(([style, sections]) => {
          // Check if this style has a progression for our block type
          const progression = sections[originalType.replace(/_/g, '.')];
          if (progression) {
            // Split the progression string into an array of chords
            const chords = progression.split(' - ').map(chord => chord.trim());
            
            allProgressions.push({
              name: `${category.replace(/_/g, '/')} - ${style}`,
              description: `${style} style progression for ${originalType.replace(/_/g, ' ')}`,
              chords
            });
          }
        });
      });

      setProgressions(allProgressions);
      setError(null);
    } catch (err) {
      console.error('Error loading progressions:', err);
      setError('Failed to load chord progressions');
      setProgressions([]);
    } finally {
      setIsLoading(false);
    }
  }, [genre, blockType]);

  return { progressions, isLoading, error };
}