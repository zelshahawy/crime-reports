"use client";
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Search from '../components/Search';
import Filter from '../components/Filter';
import Footer from '../components/Footer';
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
        const response = await fetch(`${apiUrl}/?crime=${searchQuery}&group_by=${groupBy}`);
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
      <Header />
      <main className="p-8">
        <h2 className="text-xl mb-4">Search and Filter Crimes</h2>
        <Filter onFilterChange={setGroupBy} />
        <Search onSearch={setSearchQuery} />
        <div className="mt-8 flex justify-center items-center">
          {chartData ? (
            <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-md">
              <CrimeChart data={chartData} searchQuery={searchQuery} groupBy={groupBy} />
            </div>
          ) : (
            <p>Please select filters to generate a chart.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

