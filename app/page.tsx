"use client";
import { ChartData } from 'chart.js';
import React, { useEffect, useState } from 'react';
import CrimeChart from '../components/CrimeChart';
import DataTable from '../components/DataTable'; // added
import Filter from '../components/Filter';
import Search from '../components/Search';
import FORCED_TO_ASSAULT_CACHE from "./static/cache.json";

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [groupBy, setGroupBy] = useState<string>('');
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const [showRaw, setShowRaw] = useState<boolean>(false); // added

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const FORCED_TO_ASSAULT_DATASET: ChartData<'bar'> = FORCED_TO_ASSAULT_CACHE as ChartData<'bar'>;

  const wake_up_server = async () => {
    try {
      const response = await fetch(`${apiUrl}/ping`, { method: 'GET' });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      console.log('Server woken up successfully');
    } catch (error) {
      console.error('Error waking up server:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!searchQuery || !groupBy) return;
        if (searchQuery === "FORCED_SEX" && groupBy === "PRINCIPAL_SEX") {
          setChartData(FORCED_TO_ASSAULT_DATASET);
          wake_up_server();
          console.log('Used cached data');
          return;
        }

        const response = await fetch(
          `${apiUrl}/crime_data?crime=${searchQuery}&group_by=${groupBy}`
        );
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [searchQuery, groupBy]);

  return (
    <div>
      <main className="flex-grow p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Search and Filter Crimes
        </h2>

        <div className="max-w-4xl mx-auto space-y-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <Filter onFilterChange={setGroupBy} />
            <Search onSearchChange={setSearchQuery} />
          </div>
        </div>

        <div className="flex justify-center items-center">
          {chartData ? (
            <div className="w-full max-w-4xl space-y-4">
              {/* toggle */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowRaw(prev => !prev)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  {showRaw ? 'Show Chart' : 'Show Raw Data'}
                </button>
              </div>

              {/* chart or table */}
              <div className="p-4 bg-white rounded-lg shadow-md min-h-[400px]">
                {showRaw ? (
                  <DataTable
                    data={chartData}
                    groupBy={groupBy}
                    searchQuery={searchQuery}
                  />
                ) : (
                  <CrimeChart
                    data={chartData}
                    searchQuery={searchQuery}
                    groupBy={groupBy}
                  />
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center">
              Please select filters to generate a chart.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
