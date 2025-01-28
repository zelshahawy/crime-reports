"use client";
import React, { useState, useEffect } from 'react';
import Search from '../components/Search';
import Filter from '../components/Filter';
import CrimeChart from '../components/CrimeChart';

import { ChartData } from 'chart.js';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [groupBy, setGroupBy] = useState<string>('');
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const apiUrl = "https://thechosenmenace.pythonanywhere.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!searchQuery || !groupBy) return;
        const response = await fetch(`${apiUrl}/crime_data?crime=${searchQuery}&group_by=${groupBy}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
    };
    fetchData();
  }, [searchQuery, groupBy]);

  return (
    <div>
<main className="flex-grow p-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Search and Filter Crimes</h2>
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                        <Filter onFilterChange={setGroupBy} />
                        <Search onSearchChange={setSearchQuery} />
                    </div>
                    <div className="mt-8 flex justify-center items-center">
                        {chartData ? (
                            <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-md min-h-[400px]">
                                <CrimeChart data={chartData} searchQuery={searchQuery} groupBy={groupBy} />
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center">Please select filters to generate a chart.</p>
                        )}
                    </div>
                </div>
            </main>
    </div>
  );
};

export default Home;

