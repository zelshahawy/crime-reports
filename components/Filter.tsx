// components/Filter.tsx
import React from 'react';

interface FilterProps {
    onFilterChange: (filter: string) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
    return (
        <select
            className="w-full p-2 border border-gray-300 rounded-lg"
            onChange={(e) => onFilterChange(e.target.value)}
        >
            <option value="INCOME">Income Level</option>
            <option value="PRINCIPAL_SEX">Principal Sex</option>
            <option value="PRINCIPAL_RACE">Race</option>
        </select>
    );
};

export default Filter;
