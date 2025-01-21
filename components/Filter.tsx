import React, { useState, useEffect } from 'react';

interface FilterProps {
    onFilterChange: (filter: string) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
    const [selectedFilter, setSelectedFilter] = useState<string>('INCOME'); // Default to "INCOME"

    useEffect(() => {
        onFilterChange(selectedFilter); // Apply the default filter on component mount
    }, [selectedFilter, onFilterChange]);

    return (
        <select
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
>  
            <option value="PRINCIPAL_SEX">Principal Sex</option>
            <option value="INCOME">Income Level</option>
            <option value="PRINCIPAL_RACE">Race</option>
            <option value="ATT_COLLEGE">Attended College</option>
            <option value="JOB">Job</option>
            <option value="PRINCIPAL_MARITAL">Marital Status</option>
            <option value="PRINCIPAL_ED">Education Level</option>
            <option value="NUM_INCIDENTS">Number of Incidents</option>
        </select>
    );
};

export default Filter;
