
import { useState } from 'react';
import { Switch } from '@headlessui/react';

interface ChordSelectorProps {
  isVisible: boolean;
  selectedChord: string;
  showQualities: boolean;
  onChordSelect: (chord: string) => void;
  onQualitySelect: (quality: string) => void;
}

export function ChordSelector({
  isVisible,
  selectedChord,
  showQualities,
  onChordSelect,
  onQualitySelect
}: ChordSelectorProps) {
  const [showExtensions, setShowExtensions] = useState(false);
  const [showAlterations, setShowAlterations] = useState(false);
  const [showInversions, setShowInversions] = useState(false);

  if (!isVisible) return null;

  const basicQualities = ['', 'm', 'dim', 'aug', '7', 'maj7', 'm7', 'sus4'];
  const extensions = ['9', '11', '13', 'maj9', 'maj13', 'm9', 'm13'];
  const alterations = ['7#5', '7b5', '9#5', '9b5', '7#9', '7b9', '7#11', '6/9'];

  if (showQualities && selectedChord) {
    return (
      <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
        <div className="p-4 space-y-4">
                <span className="sr-only">Show Alterations</span>
                <span
                  className={`${
                    showAlterations ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
              <span className="text-sm text-gray-300">Alterations</span>
            </div>
          </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={showInversions}
                onChange={setShowInversions}
                className={`${
                  showInversions ? 'bg-blue-600' : 'bg-gray-600'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span className="sr-only">Show Inversions</span>
                <span
                  className={`${
                    showInversions ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
              <span className="text-sm text-gray-300">Inversions</span>
            </div>
          </div>

          {/* Basic Qualities */}
          <div className="grid grid-cols-4 gap-2">
            {basicQualities.map((quality) => (
              <button
                key={quality}
                onClick={() => onQualitySelect(quality)}
                className="px-2 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
              >
                {selectedChord}{quality || '(none)'}
              </button>
            ))}
          </div>

          {/* Extensions */}
          {showExtensions && (
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-700">
              {extensions.map((quality) => (
                <button
                  key={quality}
                  onClick={() => onQualitySelect(quality)}
                  className="px-2 py-1 text-sm bg-blue-900/30 hover:bg-blue-800/30 rounded"
                >
                  {selectedChord}{quality}
                </button>
              ))}
            </div>
          )}

          {/* Alterations */}
          {showAlterations && (
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-700">
              {alterations.map((quality) => (
                <button
                  key={quality}
                  onClick={() => onQualitySelect(quality)}
                  className="px-2 py-1 text-sm bg-purple-900/30 hover:bg-purple-800/30 rounded"
                >
                  {selectedChord}{quality}
                </button>
              ))}
            </div>
          )}

          {/* Inversions */}
          {showInversions && (
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-700">
              {['', '/3', '/5', '/7'].map((inversion) => (
                <button
                  key={inversion}
                  onClick={() => onQualitySelect(selectedChord + inversion)}
                  className="px-2 py-1 text-sm bg-green-900/30 hover:bg-green-800/30 rounded"
                >
                  {selectedChord}{inversion || '(root)'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
      <div className="p-2 grid grid-cols-4 gap-1">
        {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'].map((chord) => (
          <button
            key={chord}
            onClick={() => onChordSelect(chord)}
            className="px-2 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
          >
            {chord}
          </button>
        ))}
      </div>
    </div>
  );
}
