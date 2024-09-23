"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Search from '../components/Search';
import Filter from '../components/Filter';
import CrimeGraph from '../components/CrimeGraph';

interface GraphData {
    labels: string[];
    values: number[];
}

const Home: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [groupBy, setGroupBy] = useState<string>('AGE_GROUP');
    const [graphData, setGraphData] = useState<GraphData>({ labels: [], values: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/crime-data?crime=${searchQuery}&group_by=${groupBy}`);
                const data = await response.json();
                console.log('Fetched data:', data); // Add this line
                setGraphData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [searchQuery, groupBy]);
    

    return (
        <div>
            <Head>
                <title>NCVS Crime Analysis</title>
                <meta name="description" content="Analyze crime data with filters and visualizations" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main className="p-8">
                <h2 className="text-xl mb-4">Search and Filter Crimes</h2>
                <Search onSearch={setSearchQuery} />
                <Filter onFilterChange={setGroupBy} />
                <div className="mt-8">
                    <p>Search Query: {searchQuery}</p>
                    <p>Group By: {groupBy}</p>
                    <div className="mt-8">
                        <CrimeGraph data={graphData} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
