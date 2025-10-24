import React from 'react';
import { SearchIcon } from './icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <SearchIcon className="h-6 w-6 text-gray-400" />
        </div>
        <input
          type="search"
          name="search"
          id="search"
          className="block w-full h-16 pl-16 pr-36 py-3 border border-white/10 rounded-xl text-lg bg-gray-800/50 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-inner shadow-black/20 transition-all duration-300"
          placeholder="Rechercher..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
            <button
                type="button"
                onClick={onSearch}
                className="h-12 px-8 bg-teal-500 text-gray-900 font-semibold rounded-lg hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-colors"
            >
                Rechercher
            </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;