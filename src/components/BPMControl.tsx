import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

interface BPMControlProps {
  defaultBPM?: number;
}

export function BPMControl({ defaultBPM = 120 }: BPMControlProps) {
  const [bpm, setBpm] = useState(defaultBPM);
  const [displayValue, setDisplayValue] = useState(defaultBPM.toString());

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  const handleBPMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayValue(value);
    
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      const clampedValue = Math.min(300, Math.max(40, numericValue));
      setBpm(clampedValue);
    }
  };

  const handleBlur = () => {
    // Format the display value on blur
    const numericValue = parseFloat(displayValue);
    if (isNaN(numericValue)) {
      setDisplayValue(bpm.toString());
    } else {
      const clampedValue = Math.min(300, Math.max(40, numericValue));
      setBpm(clampedValue);
      setDisplayValue(clampedValue.toString());
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleBPMChange}
        onBlur={handleBlur}
        className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-center text-white"
        placeholder="120.0"
      />
      <span className="text-sm text-gray-400">BPM</span>
    </div>
  );
}