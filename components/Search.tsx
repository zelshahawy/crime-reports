// filepath: /Users/ziadelshahawy/personal-projects/crime-report-web-app/components/Search.tsx
import React, { useState, useEffect } from 'react';

interface SearchProps {
  onSearchChange: (search: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearchChange }) => {
  const [selectedSearch, setSelectedSearch] = useState<string>('FORCED_SEX');

  useEffect(() => {
    onSearchChange(selectedSearch);
  }, [selectedSearch, onSearchChange]);

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">Search Crime Type</label>
      <select
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition"
        onChange={(e) => setSelectedSearch(e.target.value)}
        value={selectedSearch}
      >
        <option value="FORCED_SEX">Forced Sexual Assault</option>
        <option value="VEHICLE_THEFT">Vehicle Theft</option>
        <option value="BROKEN_IN">Broken In</option>
        <option value="STOLEN">Possession Theft</option>
        <option value="TOTAL_CRIME">Total of the Four Crimes</option>
      </select>
    </div>
  );
};

export default Search;