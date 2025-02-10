import React from 'react';

interface ArrangementHeaderProps {
  name: string;
  genre: string;
}

export function ArrangementHeader({ name, genre }: ArrangementHeaderProps) {
  return (
    <div className="mb-2 flex justify-between items-center text-white">
      <div>
        <h2 className="text-lg font-bold text-shadow">{name || 'Untitled Arrangement'}</h2>
        <p className="text-xs opacity-75 text-shadow">Genre: {genre.replace(/\./g, '/')}</p>
      </div>
    </div>
  );
}