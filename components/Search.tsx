import React from 'react';

interface SearchProps {
  onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  return (
    <div>
      <select
        className="w-full p-2 border border-gray-300 rounded-lg"
        onChange={(e) => onSearch(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>Select a crime type...</option>
        <option value="FORCED_SEX">Forced Sex</option>
        <option value="VEHICLE_THEFT">Vehicle Theft</option>
        <option value="BROKEN_IN">Broken In</option>
      </select>
    </div>
  );
};

export default Search;

