import React from 'react';

interface SearchProps {
  onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search for a crime..."
      className="w-full p-2 border border-gray-300 rounded-lg"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};

export default Search;
