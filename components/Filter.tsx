import React, { useState, useEffect } from 'react';

interface FilterProps {
    onFilterChange: (filter: string) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
    const [selectedFilter, setSelectedFilter] = useState<string>('PRINCIPAL_SEX');

    useEffect(() => {
        onFilterChange(selectedFilter);
    }, [selectedFilter, onFilterChange]);

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Group By</label>
            <select
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
            >
                <option value="PRINCIPAL_SEX">Sex</option>
                <option value="INCOME">Income Level</option>
                <option value="PRINCIPAL_RACE">Race</option>
                <option value="ATT_COLLEGE">Attended College</option>
                <option value="JOB">Job</option>
                <option value="PRINCIPAL_MARITAL">Marital Status</option>
                <option value="PRINCIPAL_ED">Education Level</option>
                <option value="NUM_INCIDENTS">Number of Incidents</option>
            </select>
        </div>
    );
};

export default Filter;
